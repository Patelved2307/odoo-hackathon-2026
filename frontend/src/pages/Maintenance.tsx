import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TICKETS, ASSETS, type MaintenanceTicket } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { KPICard } from "@/components/common/KPICard";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Priority = MaintenanceTicket["priority"];

export default function Maintenance() {
  const [rows, setRows] = useState<MaintenanceTicket[]>(TICKETS);
  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState(ASSETS[0]?.id ?? "");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const cols: ColumnDef<MaintenanceTicket>[] = [
    { header: "ID", accessorKey: "id", cell: ({ row }) => <span className="font-mono text-xs text-[#64748B]">{row.original.id}</span> },
    { header: "Asset", accessorKey: "asset", cell: ({ row }) => <span className="font-medium">{row.original.asset}</span> },
    { header: "Issue", accessorKey: "issue" },
    { header: "Priority", accessorKey: "priority", cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Technician", accessorKey: "technician" },
    { header: "Opened", accessorKey: "opened" },
    { header: "ETA", accessorKey: "eta" },
  ];

  const submit = () => {
    const asset = ASSETS.find(a => a.id === assetId);
    if (!asset) { toast.error("Pick an asset"); return; }
    if (!issue.trim()) { toast.error("Describe the issue"); return; }
    const rec: MaintenanceTicket = {
      id: `T${400 + rows.length}`,
      asset: asset.name,
      issue: issue.trim(),
      priority,
      status: "Open",
      technician: "Unassigned",
      opened: new Date().toISOString().slice(0, 10),
      eta: "TBD",
    };
    setRows(r => [rec, ...r]);
    setOpen(false);
    setIssue("");
    toast.success("Ticket raised", { description: `${rec.id} · ${asset.name}` });
  };

  return (
    <AppLayout>
      <PermissionGate perm="maintenance">
        <PageHeader title="Maintenance Management" description="Track tickets, work orders and preventive schedules."
          actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New ticket</Button>} />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <KPICard label="Open tickets" value={rows.filter(t => t.status === "Open").length} icon={Wrench} accent="primary" />
          <KPICard label="In progress" value={rows.filter(t => t.status === "In Progress").length} icon={Clock} accent="warning" />
          <KPICard label="Critical" value={rows.filter(t => t.priority === "Critical").length} icon={AlertTriangle} accent="warning" delta={-8} />
          <KPICard label="Resolved this month" value={rows.filter(t => t.status === "Resolved").length} icon={CheckCircle2} accent="success" delta={22} />
        </div>
        <DataTable data={rows} columns={cols} searchPlaceholder="Search tickets…" />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Raise maintenance ticket</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Asset</Label>
                <select value={assetId} onChange={e => setAssetId(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {ASSETS.slice(0, 30).map(a => <option key={a.id} value={a.id}>{a.name} · {a.tag}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Issue</Label>
                <Input value={issue} onChange={e => setIssue(e.target.value)} placeholder="e.g. Screen flicker" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {(["Low", "Medium", "High", "Critical"] as Priority[]).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={submit}>Raise ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}