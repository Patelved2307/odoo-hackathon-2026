import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Building2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AppLayout>
      <PageHeader title="Profile" description="Manage your personal details and preferences." />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 lg:col-span-1 text-center">
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
        <form onSubmit={e => { e.preventDefault(); toast.success("Profile updated"); }} className="card-surface p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold">Personal information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="Full name"><Input defaultValue={user.name} /></F>
            <F label="Email"><Input defaultValue={user.email} type="email" /></F>
            <F label="Phone"><Input placeholder="+1 555 000 0000" /></F>
            <F label="Timezone">
              <select className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm">
                <option>UTC-08:00 · Pacific</option><option>UTC · London</option><option>UTC+05:30 · India</option><option>UTC+09:00 · Tokyo</option>
              </select>
            </F>
          </div>
          <div className="flex justify-end pt-3 border-t border-[#E2E8F0]"><Button className="bg-[#2563EB] hover:bg-[#1d4fd8]">Save changes</Button></div>
        </form>
      </div>
    </AppLayout>
  );
}
function Row({ icon: Icon, label }: any) { return <div className="flex items-center gap-2 text-sm text-[#64748B]"><Icon className="h-4 w-4 text-[#94A3B8]" />{label}</div>; }
function F({ label, children }: any) { return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>; }
