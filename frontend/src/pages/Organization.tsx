import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { Building2, Users, MapPin, Layers, Plus, Shield, Trash2 } from "lucide-react";
import { KPICard } from "@/components/common/KPICard";
import { DEPT_LIST, LOCATION_LIST, ASSETS, NAME_LIST } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth, ROLE_LIST, PERMISSION_KEYS, PERMISSION_LABELS, type Role, type PermissionKey } from "@/context/AuthContext";

interface Department {
  name: string;
  head: string;
  headcount: number;
  budget: number;
  description: string;
}

interface Site {
  name: string;
  address: string;
  timezone: string;
  hours: string;
  status: "Active" | "Inactive";
}

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  "Admin": "Full access to all modules, settings and organization structure.",
  "Asset Manager": "Registers and manages assets, approves allocations, runs maintenance.",
  "Department Head": "Approves allocations and bookings for their department.",
  "Employee": "Can request bookings and view assets assigned to them.",
  "Auditor": "Read-only access focused on audits and compliance reporting.",
  "Technician": "Handles maintenance tickets and asset servicing.",
};

const seedDepartments = (): Department[] =>
  DEPT_LIST.map((name, i) => ({
    name,
    head: NAME_LIST[i % NAME_LIST.length],
    headcount: 18 + i * 6,
    budget: 120000 + i * 45000,
    description: `${name} team covering day-to-day operations and asset ownership.`,
  }));

const seedSites = (): Site[] =>
  LOCATION_LIST.map((name) => ({
    name,
    address: "Address on file",
    timezone: "Auto",
    hours: "08:00–18:00",
    status: "Active",
  }));

export default function Organization() {
  const navigate = useNavigate();

  // ---- Departments ----
  const [depts, setDepts] = useState<Department[]>(seedDepartments());
  const [deptOpen, setDeptOpen] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptHead, setDeptHead] = useState("");
  const [deptHeadcount, setDeptHeadcount] = useState("");
  const [deptBudget, setDeptBudget] = useState("");
  const [deptDescription, setDeptDescription] = useState("");

  const resetDeptForm = () => {
    setDeptName(""); setDeptHead(""); setDeptHeadcount(""); setDeptBudget(""); setDeptDescription("");
  };

  const addDept = () => {
    const trimmed = deptName.trim();
    if (!trimmed) { toast.error("Enter a department name"); return; }
    if (depts.some(d => d.name.toLowerCase() === trimmed.toLowerCase())) { toast.error("That department already exists"); return; }
    if (!deptHead.trim()) { toast.error("Assign a department head"); return; }
    const headcount = Number(deptHeadcount);
    if (!deptHeadcount || Number.isNaN(headcount) || headcount <= 0) { toast.error("Enter a valid headcount"); return; }
    const budget = Number(deptBudget);
    if (!deptBudget || Number.isNaN(budget) || budget < 0) { toast.error("Enter a valid annual budget"); return; }

    setDepts(d => [...d, { name: trimmed, head: deptHead.trim(), headcount, budget, description: deptDescription.trim() || "No description provided." }]);
    setDeptOpen(false);
    resetDeptForm();
    toast.success("Department added", { description: trimmed });
  };

  const removeDept = (name: string) => {
    setDepts(d => d.filter(dep => dep.name !== name));
    toast.success("Department removed", { description: name });
  };

  // ---- Locations ----
  const [sites, setSites] = useState<Site[]>(seedSites());
  const [siteOpen, setSiteOpen] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [siteTimezone, setSiteTimezone] = useState("auto");
  const [siteHours, setSiteHours] = useState("08:00–18:00");

  const resetSiteForm = () => {
    setSiteName(""); setSiteAddress(""); setSiteTimezone("auto"); setSiteHours("08:00–18:00");
  };

  const addSite = () => {
    const trimmed = siteName.trim();
    if (!trimmed) { toast.error("Enter a site name"); return; }
    if (sites.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) { toast.error("That location already exists"); return; }
    if (!siteAddress.trim()) { toast.error("Enter an address"); return; }

    setSites(s => [...s, { name: trimmed, address: siteAddress.trim(), timezone: siteTimezone, hours: siteHours || "08:00–18:00", status: "Active" }]);
    setSiteOpen(false);
    resetSiteForm();
    toast.success("Location added", { description: trimmed });
  };

  const removeSite = (name: string) => {
    setSites(s => s.filter(site => site.name !== name));
    toast.success("Location removed", { description: name });
  };

  // ---- Roles & permissions (live — backed by AuthContext, applies app-wide) ----
  const { rolePermissions, setRolePermissions } = useAuth();
  const [roleOpen, setRoleOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [draftPermissions, setDraftPermissions] = useState<PermissionKey[]>([]);

  const openRole = (role: Role) => {
    setActiveRole(role);
    setDraftPermissions(rolePermissions[role]);
    setRoleOpen(true);
  };

  const togglePermission = (perm: PermissionKey) => {
    // Admin must always retain access to Organization settings, otherwise
    // it's possible to lock every admin out of this page permanently.
    if (activeRole === "Admin" && perm === "organization") return;
    setDraftPermissions(p => p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm]);
  };

  const saveRolePermissions = () => {
    if (!activeRole) return;
    setRolePermissions(activeRole, draftPermissions);
    setRoleOpen(false);
    toast.success("Permissions updated", { description: `${activeRole} · changes apply immediately for anyone signed in with this role` });
  };

  // ---- Compliance ----
  const [retention, setRetention] = useState("7");
  const [auditFrequency, setAuditFrequency] = useState("q");
  const [frameworks, setFrameworks] = useState<Record<string, boolean>>({
    "SOC 2": true, "ISO 27001": true, GDPR: true, HIPAA: false, "PCI-DSS": false,
  });

  const toggleFramework = (f: string) => setFrameworks(prev => ({ ...prev, [f]: !prev[f] }));

  // ---- Workspace defaults ----
  const [autoTag, setAutoTag] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [warrantyNotify, setWarrantyNotify] = useState(true);
  const [aiCopilot, setAiCopilot] = useState(true);

  const saveAll = () => toast.success("Organization settings saved");

  const totalEmployees = useMemo(() => depts.reduce((s, d) => s + d.headcount, 0), [depts]);

  return (
    <AppLayout>
      <PermissionGate perm="organization">
        <PageHeader
          title="Organization"
          description="Structure, departments, locations, roles and compliance defaults."
          actions={<Button onClick={saveAll} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]">Save changes</Button>}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <KPICard label="Departments" value={depts.length} icon={Layers} accent="primary" />
          <KPICard label="Locations" value={sites.length} icon={MapPin} accent="ai" />
          <KPICard label="Total employees" value={totalEmployees} icon={Users} accent="success" />
          <KPICard label="Sites" value={sites.filter(s => s.status === "Active").length} icon={Building2} accent="warning" />
        </div>

        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments"><Layers className="mr-2 h-4 w-4" />Departments</TabsTrigger>
            <TabsTrigger value="locations"><MapPin className="mr-2 h-4 w-4" />Locations</TabsTrigger>
            <TabsTrigger value="roles"><Users className="mr-2 h-4 w-4" />Roles & Permissions</TabsTrigger>
            <TabsTrigger value="compliance"><Shield className="mr-2 h-4 w-4" />Compliance</TabsTrigger>
            <TabsTrigger value="workspace"><Building2 className="mr-2 h-4 w-4" />Workspace</TabsTrigger>
          </TabsList>

          <TabsContent value="departments">
            <div className="card-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Departments ({depts.length})</h3>
                <Button size="sm" onClick={() => setDeptOpen(true)} className="gap-1.5 bg-[#2563EB] hover:bg-[#1d4fd8]">
                  <Plus className="h-4 w-4" />New department
                </Button>
              </div>
              <ul className="divide-y divide-[#F1F5F9]">
                {depts.map(d => {
                  const assetCount = ASSETS.filter(a => a.department === d.name).length;
                  return (
                    <li key={d.name} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold">{d.name[0]}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-[#64748B] truncate">
                            Head: {d.head} · {d.headcount} employees · {assetCount} assets · ${d.budget.toLocaleString()} budget
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => { toast.info(`Viewing ${d.name} assets`); navigate({ to: "/assets" }); }}>Manage</Button>
                        <Button variant="ghost" size="icon" onClick={() => removeDept(d.name)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <div className="card-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Sites & locations ({sites.length})</h3>
                <Button size="sm" onClick={() => setSiteOpen(true)} className="gap-1.5 bg-[#2563EB] hover:bg-[#1d4fd8]">
                  <Plus className="h-4 w-4" />Add location
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {sites.map(l => (
                  <div key={l.name} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#2563EB]"><MapPin className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{l.name}</p>
                        <p className="text-xs text-[#64748B] truncate">{l.address} · {l.hours} · {ASSETS.filter(a => a.location === l.name).length} assets on site</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="secondary">{l.status}</Badge>
                      <Button variant="ghost" size="icon" onClick={() => removeSite(l.name)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="card-surface p-5">
              <h3 className="text-sm font-semibold mb-1">Role matrix</h3>
              <p className="text-xs text-[#64748B] mb-3">Changes here apply immediately across the app for anyone signed in with that role.</p>
              <div className="space-y-3">
                {ROLE_LIST.map(r => (
                  <div key={r} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{r}</p>
                      <p className="text-xs text-[#64748B]">{ROLE_DESCRIPTIONS[r]}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {rolePermissions[r].length === 0
                          ? <span className="text-[11px] text-[#94A3B8]">No permissions granted</span>
                          : rolePermissions[r].map(p => <Badge key={p} variant="secondary">{PERMISSION_LABELS[p]}</Badge>)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0" onClick={() => openRole(r)}>Edit permissions</Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="card-surface p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Asset record retention</Label>
                <Select value={retention} onValueChange={setRetention}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Audit frequency</Label>
                <Select value={auditFrequency} onValueChange={setAuditFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Monthly</SelectItem>
                    <SelectItem value="q">Quarterly</SelectItem>
                    <SelectItem value="a">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">Compliance frameworks</Label>
                <p className="text-[11px] text-[#64748B] mb-1">Tap a framework to mark it in or out of scope.</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(frameworks).map(f => (
                    <button key={f} type="button" onClick={() => toggleFramework(f)}>
                      <Badge variant={frameworks[f] ? "default" : "secondary"} className="cursor-pointer">{f}{frameworks[f] ? " ✓" : ""}</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workspace">
            <div className="card-surface p-5 space-y-4 max-w-xl">
              <h3 className="text-sm font-semibold">Workspace defaults</h3>
              {[
                { label: "Auto-tag on registration", desc: "Generate AF-#### tags automatically.", val: autoTag, set: setAutoTag },
                { label: "Require approval for allocations", desc: "Route to department head.", val: requireApproval, set: setRequireApproval },
                { label: "Notify on warranty expiration", desc: "30-day heads-up per asset.", val: warrantyNotify, set: setWarrantyNotify },
                { label: "AI Copilot enabled", desc: "Suggestions in every workflow.", val: aiCopilot, set: setAiCopilot },
              ].map((x, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{x.label}</div>
                    <div className="text-[11px] text-[#64748B]">{x.desc}</div>
                  </div>
                  <Switch checked={x.val} onCheckedChange={x.set} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add department dialog */}
        <Dialog open={deptOpen} onOpenChange={(o) => { setDeptOpen(o); if (!o) resetDeptForm(); }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add department</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Department name *</Label>
                <Input value={deptName} onChange={e => setDeptName(e.target.value)} placeholder="e.g. Legal" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department head *</Label>
                <Input value={deptHead} onChange={e => setDeptHead(e.target.value)} placeholder="e.g. Priya Shah" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Headcount *</Label>
                  <Input type="number" min={1} value={deptHeadcount} onChange={e => setDeptHeadcount(e.target.value)} placeholder="e.g. 12" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Annual budget (USD) *</Label>
                  <Input type="number" min={0} value={deptBudget} onChange={e => setDeptBudget(e.target.value)} placeholder="e.g. 150000" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea rows={2} value={deptDescription} onChange={e => setDeptDescription(e.target.value)} placeholder="What does this department own or manage?" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeptOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={addDept}>Add department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add location dialog */}
        <Dialog open={siteOpen} onOpenChange={(o) => { setSiteOpen(o); if (!o) resetSiteForm(); }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add location</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Site name *</Label>
                <Input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="e.g. Branch · Tokyo" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Address *</Label>
                <Textarea rows={2} value={siteAddress} onChange={e => setSiteAddress(e.target.value)} placeholder="Street, city, postal code" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Timezone</Label>
                  <Select value={siteTimezone} onValueChange={setSiteTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="pst">Pacific (PST)</SelectItem>
                      <SelectItem value="est">Eastern (EST)</SelectItem>
                      <SelectItem value="cet">Central Europe (CET)</SelectItem>
                      <SelectItem value="sgt">Singapore (SGT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Operating hours</Label>
                  <Input value={siteHours} onChange={e => setSiteHours(e.target.value)} placeholder="08:00–18:00" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSiteOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={addSite}>Add location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit role permissions dialog */}
        <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{activeRole ? `Edit permissions · ${activeRole}` : "Edit permissions"}</DialogTitle></DialogHeader>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {PERMISSION_KEYS.map(perm => {
                const locked = activeRole === "Admin" && perm === "organization";
                return (
                  <div key={perm} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2">
                    <span className="text-sm">{PERMISSION_LABELS[perm]}{locked && <span className="text-[11px] text-[#94A3B8] ml-1.5">(required for Admin)</span>}</span>
                    <Switch checked={draftPermissions.includes(perm)} onCheckedChange={() => togglePermission(perm)} disabled={locked} />
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleOpen(false)}>Cancel</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={saveRolePermissions}>Save permissions</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGate>
    </AppLayout>
  );
}