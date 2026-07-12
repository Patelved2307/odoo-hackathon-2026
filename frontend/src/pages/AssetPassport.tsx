import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { ASSETS, NAME_LIST } from "@/data/mock";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Wrench, ArrowLeftRight, History, MapPin, Calendar, DollarSign, Shield, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AssetPassport() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const asset = ASSETS.find(a => a.id === id);
  const [qrOpen, setQrOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [assignee, setAssignee] = useState(NAME_LIST[0]);
  const [status, setStatus] = useState(asset?.status);

  if (!asset) return (
    <AppLayout>
      <PageHeader title="Asset not found" />
      <Link to="/assets" className="text-sm text-[#2563EB]">← Back to directory</Link>
    </AppLayout>
  );

  const timeline = [
    { when: "2 days ago", title: "Preventive maintenance completed", desc: "Battery replaced, firmware updated." },
    { when: "3 weeks ago", title: `Allocated to ${asset.assignee ?? "Priya Shah"}`, desc: "Transferred from IT pool." },
    { when: "2 months ago", title: "Audit passed", desc: "Q2 2026 inventory verification." },
    { when: "6 months ago", title: "Software refresh", desc: "OS reinstalled, security agent deployed." },
    { when: `Purchased`, title: "Onboarded to AssetFlow", desc: `${asset.vendor} · ${asset.purchaseDate}` },
  ];

  const exportPdf = () => {
    toast.info("Preparing PDF…", { description: "Opening the print dialog — choose \"Save as PDF\" to export the passport." });
    setTimeout(() => window.print(), 400);
  };

  const confirmReassign = () => {
    setReassignOpen(false);
    toast.success("Asset reassigned", { description: `${asset.name} → ${assignee}` });
  };

  const retire = () => {
    setStatus("Retired");
    toast.success("Asset retired", { description: asset.name });
  };

  return (
    <AppLayout>
      <PageHeader
        title={asset.name}
        description={`${asset.tag} · ${asset.category} · ${asset.vendor}`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => setQrOpen(true)}><QrCode className="h-4 w-4" />QR</Button>
            <Button variant="outline" className="gap-2" onClick={exportPdf}><Download className="h-4 w-4" />Export PDF</Button>
            <Button className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={() => setReassignOpen(true)}><ArrowLeftRight className="h-4 w-4" />Reassign</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-4">
          <div className="card-surface p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-[#E2E8F0] flex items-center justify-center text-2xl font-semibold text-[#0F172A]">
                  {asset.category[0]}
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Digital Asset Passport</p>
                  <h2 className="text-xl font-semibold text-[#0F172A]">{asset.name}</h2>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">Serial: {asset.serial}</p>
                </div>
              </div>
              <StatusBadge status={status ?? asset.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
              <Meta icon={User} label="Assignee" value={asset.assignee ?? "Unassigned"} />
              <Meta icon={MapPin} label="Location" value={asset.location} />
              <Meta icon={DollarSign} label="Value" value={`$${asset.value.toLocaleString()}`} />
              <Meta icon={Shield} label="Condition" value={asset.condition} />
              <Meta icon={Calendar} label="Purchased" value={asset.purchaseDate} />
              <Meta icon={Shield} label="Warranty" value={asset.warrantyUntil} />
              <Meta icon={MapPin} label="Department" value={asset.department} />
              <Meta icon={User} label="Vendor" value={asset.vendor} />
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-[#64748B]" />
              <h3 className="text-sm font-semibold">Lifecycle timeline</h3>
            </div>
            <ol className="relative border-l-2 border-[#E2E8F0] ml-2 space-y-5">
              {timeline.map((t, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="pl-5 relative">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-[#2563EB]" />
                  <p className="text-xs text-[#94A3B8]">{t.when}</p>
                  <p className="text-sm font-medium text-[#0F172A] mt-0.5">{t.title}</p>
                  <p className="text-xs text-[#64748B]">{t.desc}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="card-surface p-5">
            <h3 className="text-sm font-semibold mb-3">Quick actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setReassignOpen(true)}><ArrowLeftRight className="h-4 w-4" />Transfer asset</Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { toast.success("Ticket opened", { description: `A maintenance ticket for ${asset.name} was created.` }); navigate({ to: "/maintenance" }); }}><Wrench className="h-4 w-4" />Open ticket</Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { toast.success("Audit scheduled", { description: `${asset.name} added to the next audit cycle.` }); navigate({ to: "/audit" }); }}><Calendar className="h-4 w-4" />Schedule audit</Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-600" onClick={retire} disabled={status === "Retired"}>
                {status === "Retired" ? "Retired" : "Retire asset"}
              </Button>
            </div>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-sm font-semibold mb-3">Compliance</h3>
            <ul className="space-y-2.5 text-sm">
              {[["Insurance policy", "Active"], ["Data wipe cert", "N/A"], ["Chain of custody", "Verified"], ["Depreciation", "Straight-line 3y"]].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="text-[#64748B]">{k}</span>
                  <span className="text-[#0F172A] font-medium">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Asset QR code</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="h-40 w-40 rounded-xl bg-[repeating-conic-gradient(#0F172A_0_25%,white_0_50%)] bg-[length:20px_20px] border border-[#E2E8F0]" />
            <p className="text-sm font-mono text-[#64748B]">{asset.tag}</p>
            <p className="text-xs text-[#94A3B8] text-center">Scan to open this asset's passport from a mobile device.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrOpen(false)}>Close</Button>
            <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={() => { toast.success("QR code downloaded"); setQrOpen(false); }}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reassign asset</DialogTitle></DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs">New assignee</Label>
            <select value={assignee} onChange={e => setAssignee(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] px-3 text-sm">
              {NAME_LIST.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={confirmReassign}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] uppercase tracking-wide"><Icon className="h-3 w-3" />{label}</div>
      <p className="text-sm text-[#0F172A] font-medium mt-1">{value}</p>
    </div>
  );
}