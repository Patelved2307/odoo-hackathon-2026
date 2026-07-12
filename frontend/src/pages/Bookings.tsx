import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { BOOKINGS, type Booking, ASSETS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Bookings() {
  const [open, setOpen] = useState(false);
  const cols: ColumnDef<Booking>[] = [
    { header: "ID", accessorKey: "id", cell: ({ row }) => <span className="font-mono text-xs text-[#64748B]">{row.original.id}</span> },
    { header: "Asset", accessorKey: "asset", cell: ({ row }) => <span className="font-medium">{row.original.asset}</span> },
    { header: "User", accessorKey: "user" },
    { header: "From", accessorKey: "from" },
    { header: "To", accessorKey: "to" },
    { header: "Purpose", accessorKey: "purpose" },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];
  return (
    <AppLayout>
      <PermissionGate perm="bookings">
        <PageHeader title="Resource Bookings" description="Reserve shared assets like meeting rooms, vehicles and equipment."
          actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New booking</Button>} />
        <DataTable data={BOOKINGS} columns={cols} searchPlaceholder="Search bookings…" toolbar={<Button variant="outline" size="sm" className="gap-2 h-9"><Calendar className="h-4 w-4" />Calendar view</Button>} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create booking</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">Asset</Label>
                <select className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">{ASSETS.slice(0, 20).map(a => <option key={a.id}>{a.name}</option>)}</select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">From</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label className="text-xs">To</Label><Input type="date" /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Purpose</Label><Input placeholder="Client demo, field visit…" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={() => { setOpen(false); toast.success("Booking request submitted"); }}>Submit request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}
