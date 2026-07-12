import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ALLOCATIONS, ASSETS, NAME_LIST, type Allocation } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { KPICard } from "@/components/common/KPICard";
import { CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Assets currently held by someone can't be allocated again — they must be
// transferred instead. This mirrors the "no double allocation" rule.
const AVAILABLE_ASSETS = ASSETS.filter(a => a.status === "Available" || a.status === "Reserved");

export default function Allocations() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Allocation[]>(ALLOCATIONS);
  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState(AVAILABLE_ASSETS[0]?.id ?? "");
  const [to, setTo] = useState(NAME_LIST[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const cols: ColumnDef<Allocation>[] = [
    { header: "ID", accessorKey: "id", cell: ({ row }) => <span className="font-mono text-xs text-[#64748B]">{row.original.id}</span> },
    { header: "Asset", accessorKey: "asset", cell: ({ row }) => <span className="font-medium text-[#0F172A]">{row.original.asset}</span> },
    { header: "From", accessorKey: "from", cell: ({ row }) => row.original.from ?? <span className="text-[#94A3B8]">Pool</span> },
    { header: "To", accessorKey: "to" },
    { header: "Date", accessorKey: "date" },
    { header: "Due back", accessorKey: "dueDate", cell: ({ row }) => row.original.dueDate ?? <span className="text-[#94A3B8]">—</span> },
    { header: "Approver", accessorKey: "approver" },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  const submit = () => {
    const asset = AVAILABLE_ASSETS.find(a => a.id === assetId);
    if (!asset) { toast.error("Pick an available asset"); return; }
    // Guard against double-allocating an asset that's already held.
    const alreadyHeld = rows.some(r => r.asset === asset.name && r.status === "Active");
    if (alreadyHeld) {
      toast.error(`${asset.name} is already allocated`, { description: "Use a transfer request instead." });
      return;
    }
    const rec: Allocation = {
      id: `AL${600 + rows.length}`,
      asset: asset.name,
      to,
      date: new Date().toISOString().slice(0, 10),
      dueDate: dueDate || undefined,
      status: "Active",
      approver: user?.name ?? "Pending approval",
      notes: notes || undefined,
    };
    setRows(r => [rec, ...r]);
    setOpen(false);
    setDueDate("");
    setNotes("");
    toast.success("Allocation created", { description: `${asset.name} → ${to}` });
  };

  return (
    <AppLayout>
      <PermissionGate perm="allocations">
        <PageHeader title="Allocations & Transfers" description="Manage asset assignments across employees and departments."
          actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New allocation</Button>} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <KPICard label="Active allocations" value={rows.filter(a => a.status === "Active").length} icon={CheckCircle2} accent="success" />
          <KPICard label="Pending transfers" value={4} icon={Clock} accent="warning" />
          <KPICard label="Returns this month" value={rows.filter(a => a.status === "Returned").length} icon={RotateCcw} accent="primary" />
        </div>
        <DataTable data={rows} columns={cols} searchPlaceholder="Search allocations…" toolbar={<Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => toast.info("Select rows in the table, then use Bulk transfer")}><ArrowLeftRight className="h-4 w-4" />Bulk transfer</Button>} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New allocation</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Asset</Label>
                <select value={assetId} onChange={e => setAssetId(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {AVAILABLE_ASSETS.slice(0, 30).map(a => <option key={a.id} value={a.id}>{a.name} · {a.tag}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Allocate to</Label>
                <select value={to} onChange={e => setTo(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {NAME_LIST.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Expected return date (optional)</Label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={submit}>Create allocation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}