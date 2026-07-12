import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Building2, Users, MapPin, Layers } from "lucide-react";
import { KPICard } from "@/components/common/KPICard";
import { DEPT_LIST, LOCATION_LIST, ASSETS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Organization() {
  const navigate = useNavigate();
  const [depts, setDepts] = useState<string[]>(DEPT_LIST);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const addDept = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Enter a department name"); return; }
    if (depts.some(d => d.toLowerCase() === trimmed.toLowerCase())) { toast.error("That department already exists"); return; }
    setDepts(d => [...d, trimmed]);
    setOpen(false);
    setName("");
    toast.success("Department added", { description: trimmed });
  };

  return (
    <AppLayout>
      <PageHeader title="Organization" description="Structure, departments, locations and users."
        actions={<Button onClick={() => setOpen(true)} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />Add department</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <KPICard label="Departments" value={depts.length} icon={Layers} accent="primary" />
        <KPICard label="Locations" value={LOCATION_LIST.length} icon={MapPin} accent="ai" />
        <KPICard label="Total employees" value={248} icon={Users} accent="success" />
        <KPICard label="Sites" value={4} icon={Building2} accent="warning" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold mb-3">Departments</h3>
          <ul className="divide-y divide-[#F1F5F9]">
            {depts.map(d => {
              const count = ASSETS.filter(a => a.department === d).length;
              return (
                <li key={d} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold">{d[0]}</div>
                    <div><p className="text-sm font-medium">{d}</p><p className="text-xs text-[#64748B]">{count} assets</p></div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { toast.info(`Viewing ${d} assets`); navigate({ to: "/assets" }); }}>Manage</Button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold mb-3">Locations</h3>
          <ul className="divide-y divide-[#F1F5F9]">
            {LOCATION_LIST.map(l => (
              <li key={l} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center"><MapPin className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium">{l}</p><p className="text-xs text-[#64748B]">{ASSETS.filter(a => a.location === l).length} assets on site</p></div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { toast.info(`Viewing assets at ${l}`); navigate({ to: "/assets" }); }}>View</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add department</DialogTitle></DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs">Department name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Legal" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={addDept}>Add department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}