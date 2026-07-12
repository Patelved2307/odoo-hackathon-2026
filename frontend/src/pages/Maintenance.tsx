import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TICKETS, ASSETS, NAME_LIST, type MaintenanceTicket } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { KPICard } from "@/components/common/KPICard";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Priority = MaintenanceTicket["priority"];
type Status = MaintenanceTicket["status"];

// Extends the base ticket with a resolvedAt stamp so "resolved this month" can
// be computed honestly instead of counting every resolved ticket ever raised.
type Ticket = MaintenanceTicket & { resolvedAt?: string };

const now = new Date();
const isThisMonth = (iso?: string) => {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

export default function Maintenance() {
  const [rows, setRows] = useState<Ticket[]>(TICKETS);

  // ---- Raise ticket dialog ----
  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState(ASSETS[0]?.id ?? "");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  // ---- Manage ticket dialog ----
  const [manageOpen, setManageOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [draftStatus, setDraftStatus] = useState<Status>("Open");
  const [draftTechnician, setDraftTechnician] = useState("");
  const [draftEta, setDraftEta] = useState("");

  const openManage = (t: Ticket) => {
    setActiveTicket(t);
    setDraftStatus(t.status);
    setDraftTechnician(t.technician === "Unassigned" ? "" : t.technician);
    setDraftEta(t.eta === "TBD" ? "" : t.eta);
    setManageOpen(true);
  };

  const saveTicket = () => {
    if (!activeTicket) return;
    if (draftStatus !== "Open" && !draftTechnician.trim()) {
      toast.error("Assign a technician before moving this ticket forward");
      return;
    }
    setRows(rs => rs.map(t => t.id === activeTicket.id
      ? {
          ...t,
          status: draftStatus,
          technician: draftTechnician.trim() || "Unassigned",
          eta: draftEta || t.eta,
          resolvedAt: draftStatus === "Resolved" ? (t.resolvedAt ?? now.toISOString().slice(0, 10)) : undefined,
        }
      : t));
    setManageOpen(false);
    toast.success("Ticket updated", { description: activeTicket.id });
  };

  const cols: ColumnDef<Ticket>[] = [
    { header: "ID", accessorKey: "id", cell: ({ row }) => <span className="font-mono text-xs text-[#64748B]">{row.original.id}</span> },
    { header: "Asset", accessorKey: "asset", cell: ({ row }) => <span className="font-medium">{row.original.asset}</span> },
    { header: "Issue", accessorKey: "issue" },
    { header: "Priority", accessorKey: "priority", cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Technician", accessorKey: "technician" },
    { header: "Opened", accessorKey: "opened" },
    { header: "ETA", accessorKey: "eta" },
    {
      header: "Manage",
      id: "manage",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => openManage(row.original)}>Update</Button>
      ),
    },
  ];

  const submit = () => {
    const asset = ASSETS.find(a => a.id === assetId);
    if (!asset) { toast.error("Pick an asset"); return; }
    if (!issue.trim()) { toast.error("Describe the issue"); return; }
    const rec: Ticket = {
      id: `T${400 + rows.length}`,
      asset: asset.name,
      issue: issue.trim(),
      priority,
      status: "Open",
      technician: "Unassigned",
      opened: now.toISOString().slice(0, 10),
      eta: "TBD",
    };
    setRows(r => [rec, ...r]);
    setOpen(false);
    setIssue("");
    toast.success("Ticket raised", { description: `${rec.id} · ${asset.name}` });
  };

  const resolvedThisMonth = useMemo(
    () => rows.filter(t => t.status === "Resolved" && isThisMonth(t.resolvedAt ?? t.opened)).length,
    [rows]
  );

  return (
    <AppLayout>
      <PermissionGate perm="maintenance">
        <PageHeader title="Maintenance Management" description="Track tickets, work orders and preventive schedules."
          actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New ticket</Button>} />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <KPICard label="Open tickets" value={rows.filter(t => t.status === "Open").length} icon={Wrench} accent="primary" />
          <KPICard label="In progress" value={rows.filter(t => t.status === "In Progress").length} icon={Clock} accent="warning" />
          <KPICard label="Critical" value={rows.filter(t => t.priority === "Critical" && t.status !== "Resolved").length} icon={AlertTriangle} accent="warning" />
          <KPICard label="Resolved this month" value={resolvedThisMonth} icon={CheckCircle2} accent="success" />
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

        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{activeTicket ? `Update ${activeTicket.id} · ${activeTicket.asset}` : "Update ticket"}</DialogTitle></DialogHeader>
            {activeTicket && (
              <div className="space-y-3">
                <p className="text-xs text-[#64748B]">{activeTicket.issue}</p>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <select value={draftStatus} onChange={e => setDraftStatus(e.target.value as Status)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                    {(["Open", "In Progress", "Awaiting Parts", "Resolved"] as Status[]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Technician</Label>
                  <select value={draftTechnician} onChange={e => setDraftTechnician(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                    <option value="">Unassigned</option>
                    {NAME_LIST.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">ETA</Label>
                  <Input type="date" value={draftEta} onChange={e => setDraftEta(e.target.value)} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setManageOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={saveTicket}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}