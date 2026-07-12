import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { BOOKINGS, type Booking, ASSETS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

export default function Bookings() {
  const [rows, setRows] = useState<Booking[]>(BOOKINGS);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"table" | "calendar">("table");

  // New booking form fields — previously uncontrolled, so nothing typed here
  // was ever read when the request was "submitted".
  const [assetName, setAssetName] = useState(ASSETS[0]?.name ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [purpose, setPurpose] = useState("");

  // For the calendar view: which day is selected, and which bookings fall on it.
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const cols: ColumnDef<Booking>[] = [
    { header: "ID", accessorKey: "id", cell: ({ row }) => <span className="font-mono text-xs text-[#64748B]">{row.original.id}</span> },
    { header: "Asset", accessorKey: "asset", cell: ({ row }) => <span className="font-medium">{row.original.asset}</span> },
    { header: "User", accessorKey: "user" },
    { header: "From", accessorKey: "from" },
    { header: "To", accessorKey: "to" },
    { header: "Purpose", accessorKey: "purpose" },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  const resetForm = () => {
    setAssetName(ASSETS[0]?.name ?? "");
    setFrom("");
    setTo("");
    setPurpose("");
  };

  const submit = () => {
    if (!assetName) { toast.error("Select an asset"); return; }
    if (!from || !to) { toast.error("Pick a from and to date"); return; }
    if (new Date(to) < new Date(from)) { toast.error("End date can't be before the start date"); return; }

    const rec: Booking = {
      id: `B${200 + rows.length}`,
      asset: assetName,
      user: "You",
      from,
      to,
      purpose: purpose || "Not specified",
      status: "Pending",
    };
    // Prepend so the new booking is immediately visible in the list below,
    // matching the pattern used on the Allocations page.
    setRows(r => [rec, ...r]);
    setOpen(false);
    resetForm();
    toast.success("Booking request submitted", { description: `${rec.asset} · ${rec.from} → ${rec.to}` });
  };

  // Dates that have at least one booking, used to mark them on the calendar.
  const bookedDates = useMemo(() => rows.map(b => new Date(b.from)), [rows]);

  const bookingsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().slice(0, 10);
    return rows.filter(b => key >= b.from && key <= b.to);
  }, [rows, selectedDate]);

  return (
    <AppLayout>
      <PermissionGate perm="bookings">
        <PageHeader title="Resource Bookings" description="Reserve shared assets like meeting rooms, vehicles and equipment."
          actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New booking</Button>} />

        {view === "table" ? (
          <DataTable
            data={rows}
            columns={cols}
            searchPlaceholder="Search bookings…"
            toolbar={
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => setView("calendar")}>
                <CalendarIcon className="h-4 w-4" />Calendar view
              </Button>
            }
          />
        ) : (
          <div className="card-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Booking calendar</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Days with a dot have at least one booking starting.</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => setView("table")}>
                <List className="h-4 w-4" />Table view
              </Button>
            </div>
            <div className="grid md:grid-cols-[auto_1fr] gap-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{ booked: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-[#2563EB]" }}
                className="rounded-md border border-[#E2E8F0]"
              />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[#64748B] mb-3">
                  {selectedDate ? selectedDate.toDateString() : "Select a date"}
                </h4>
                {bookingsOnSelectedDate.length === 0 ? (
                  <p className="text-sm text-[#94A3B8]">No bookings cover this date.</p>
                ) : (
                  <ul className="space-y-2">
                    {bookingsOnSelectedDate.map(b => (
                      <li key={b.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{b.asset}</p>
                          <p className="text-xs text-[#64748B]">{b.user} · {b.from} → {b.to} · {b.purpose}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create booking</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">Asset</Label>
                <select value={assetName} onChange={e => setAssetName(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {ASSETS.slice(0, 20).map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">From</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">To</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Purpose</Label><Input placeholder="Client demo, field visit…" value={purpose} onChange={e => setPurpose(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={submit}>Submit request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}