import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Mail, MapPin, Building2, Shield, Package, ArrowLeftRight, Wrench, Clock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { ASSETS, ALLOCATIONS, TICKETS, ACTIVITY } from "@/data/mock";
import { Link } from "@tanstack/react-router";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("UTC-08:00 · Pacific");
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(false);

  // In this demo dataset most people won't share a name with the seeded
  // mock records, so fall back to a representative sample rather than
  // showing an empty page.
  const myAssets = useMemo(() => {
    if (!user) return [];
    const mine = ASSETS.filter(a => a.assignee === user.name);
    return mine.length ? mine : ASSETS.filter(a => a.status === "Allocated").slice(0, 4);
  }, [user]);
  const myAllocations = useMemo(() => {
    if (!user) return [];
    const mine = ALLOCATIONS.filter(a => a.to === user.name && a.status === "Active");
    return mine.length ? mine : ALLOCATIONS.filter(a => a.status === "Active").slice(0, 4);
  }, [user]);
  const myTickets = useMemo(() => {
    if (!user) return [];
    const mine = TICKETS.filter(t => t.technician === user.name && t.status !== "Resolved");
    return mine.length ? mine : TICKETS.filter(t => t.status !== "Resolved").slice(0, 3);
  }, [user]);
  const myActivity = useMemo(() => {
    if (!user) return [];
    const mine = ACTIVITY.filter(e => e.actor === user.name);
    return (mine.length ? mine : ACTIVITY).slice(0, 5);
  }, [user]);

  if (!user) return null;

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist through AuthContext so the sidebar, topbar, and everywhere
    // else user.name/email is shown updates immediately, not just this page.
    updateProfile({ name, email });
    toast.success("Profile updated", { description: "Your changes are reflected across the app." });
  };

  const saveSecurity = () => {
    toast.success("Security preferences saved");
  };

  return (
    <AppLayout>
      <PageHeader title="Profile" description="Manage your personal details and preferences." />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="card-surface p-6 text-center">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white text-2xl font-semibold flex items-center justify-center">
              {user.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{user.name}</h2>
            <p className="text-xs text-[#64748B]">{user.role}</p>
            <div className="mt-6 space-y-2.5 text-left">
              <Row icon={Mail} label={user.email} />
              <Row icon={Building2} label={user.department} />
              <Row icon={MapPin} label="HQ · Floor 3" />
              <Row icon={Shield} label={`Role: ${user.role}`} />
            </div>
          </div>

          <div className="card-surface p-5">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Your activity at a glance</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat icon={Package} value={myAssets.length} label="Assets" />
              <Stat icon={ArrowLeftRight} value={myAllocations.length} label="Active" />
              <Stat icon={Wrench} value={myTickets.length} label="Tickets" />
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-3"><Clock className="h-4 w-4 text-[#64748B]" /><h3 className="text-sm font-semibold text-[#0F172A]">Recent activity</h3></div>
            <ul className="divide-y divide-[#F1F5F9]">
              {myActivity.map(e => (
                <li key={e.id} className="py-2.5 text-xs text-[#64748B]">
                  <span className="font-medium text-[#0F172A]">{e.action}</span> {e.target}
                  <div className="text-[#94A3B8] mt-0.5">{e.when}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={saveProfile} className="card-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold">Personal information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <F label="Full name"><Input value={name} onChange={e => setName(e.target.value)} /></F>
              <F label="Email"><Input value={email} onChange={e => setEmail(e.target.value)} type="email" /></F>
              <F label="Phone"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" /></F>
              <F label="Timezone">
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm">
                  <option>UTC-08:00 · Pacific</option><option>UTC · London</option><option>UTC+05:30 · India</option><option>UTC+09:00 · Tokyo</option>
                </select>
              </F>
            </div>
            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]"><Button type="submit" className="bg-[#2563EB] hover:bg-[#1d4fd8]">Save changes</Button></div>
          </form>

          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#64748B]" /><h3 className="text-sm font-semibold">Security</h3></div>
            <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
              <div><p className="text-sm text-[#0F172A]">Two-factor authentication</p><p className="text-xs text-[#64748B]">Require a verification code at sign-in</p></div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
              <div><p className="text-sm text-[#0F172A]">Login alerts</p><p className="text-xs text-[#64748B]">Email me when a new device signs in</p></div>
              <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
            </div>
            <div className="flex justify-end pt-1"><Button variant="outline" onClick={saveSecurity}>Save security preferences</Button></div>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Assigned assets</h3>
              <Link to="/assets" className="text-xs text-[#2563EB] hover:underline">View directory</Link>
            </div>
            {myAssets.length === 0 ? (
              <p className="text-sm text-[#94A3B8]">No assets currently assigned.</p>
            ) : (
              <ul className="divide-y divide-[#F1F5F9]">
                {myAssets.map(a => (
                  <li key={a.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <Link to="/assets/passport/$id" params={{ id: a.id }} className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB]">{a.name}</Link>
                      <p className="text-xs text-[#64748B]">{a.tag} · {a.location}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Row({ icon: Icon, label }: any) { return <div className="flex items-center gap-2 text-sm text-[#64748B]"><Icon className="h-4 w-4 text-[#94A3B8]" />{label}</div>; }
function F({ label, children }: any) { return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>; }
function Stat({ icon: Icon, value, label }: { icon: any; value: number; label: string }) {
  return (
    <div className="rounded-lg bg-[#F8FAFC] py-3">
      <Icon className="h-4 w-4 mx-auto text-[#2563EB] mb-1" />
      <p className="text-sm font-semibold text-[#0F172A]">{value}</p>
      <p className="text-[10px] text-[#64748B]">{label}</p>
    </div>
  );
}