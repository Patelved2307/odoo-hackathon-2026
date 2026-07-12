import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AUDITS, NAME_LIST, type AuditRecord } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardCheck, ShieldCheck, AlertTriangle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { KPICard } from "@/components/common/KPICard";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SCOPES = ["Full inventory", "IT equipment", "Vehicles", "Furniture", "Field devices"];

export default function Audit() {
  const [rows, setRows] = useState<AuditRecord[]>(AUDITS);
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState(SCOPES[0]);
  const [lead, setLead] = useState(NAME_LIST[0]);
  const [assets, setAssets] = useState(50);

  const cols: ColumnDef<AuditRecord>[] = [
    { header: "Cycle", accessorKey: "cycle", cell: ({ row }) => <span className="font-medium">{row.original.cycle}</span> },
    { header: "Scope", accessorKey: "scope" },
    { header: "Progress", accessorKey: "verified", cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[140px]">
        <Progress value={(row.original.verified / row.original.assets) * 100} className="h-1.5" />
        <span className="text-xs text-[#64748B] tabular-nums">{row.original.verified}/{row.original.assets}</span>
      </div>
    )},
    { header: "Discrepancies", accessorKey: "discrepancies", cell: ({ row }) => (
      <span className={row.original.discrepancies > 0 ? "text-red-600 font-medium" : "text-[#64748B]"}>{row.original.discrepancies}</span>
    )},
    { header: "Lead", accessorKey: "lead" },
    { header: "Date", accessorKey: "date" },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  const submit = () => {
    const rec: AuditRecord = {
      id: `AU${800 + rows.length}`,
      cycle: `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`,
      scope,
      assets,
      verified: 0,
      discrepancies: 0,
      status: "Planned",
      lead,
      date: new Date().toISOString().slice(0, 10),
    };
    setRows(r => [rec, ...r]);
    setOpen(false);
    toast.success("Audit cycle created", { description: `${rec.cycle} · ${scope}` });
  };

  return (
    <AppLayout>
      <PermissionGate perm="audit">
        <PageHeader title="Asset Audits" description="Plan, execute and review inventory audit cycles."
          actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New audit cycle</Button>} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <KPICard label="Active cycles" value={rows.filter(a => a.status === "In Progress").length} icon={ClipboardCheck} accent="primary" />
          <KPICard label="Assets verified" value={rows.reduce((s, a) => s + a.verified, 0)} icon={ShieldCheck} accent="success" />
          <KPICard label="Total discrepancies" value={rows.reduce((s, a) => s + a.discrepancies, 0)} icon={AlertTriangle} accent="warning" />
        </div>
        <DataTable data={rows} columns={cols} searchPlaceholder="Search audits…" />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New audit cycle</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Scope</Label>
                <select value={scope} onChange={e => setScope(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {SCOPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Auditor lead</Label>
                <select value={lead} onChange={e => setLead(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
                  {NAME_LIST.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Assets in scope</Label>
                <Input type="number" min={1} value={assets} onChange={e => setAssets(Number(e.target.value) || 0)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={submit}>Create cycle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}