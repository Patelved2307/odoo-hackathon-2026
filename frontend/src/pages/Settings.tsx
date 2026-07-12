import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";

const INTEGRATIONS = [["Slack","Notifications & alerts"],["Jira","Ticket sync"],["Workday","HR & user provisioning"],["Okta","SSO & SCIM"],["QuickBooks","Depreciation export"],["Zapier","No-code automations"]];

export default function Settings() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const toggleConnect = (name: string) => {
    setConnected(c => {
      const next = !c[name];
      toast.success(next ? `Connected to ${name}` : `Disconnected from ${name}`);
      return { ...c, [name]: next };
    });
  };
  return (
    <AppLayout>
      <PermissionGate perm="settings">
        <PageHeader title="Settings" description="Workspace, security, notifications and integrations." />
        <Tabs defaultValue="general">
          <TabsList className="bg-white border border-[#E2E8F0]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4">
            <div className="card-surface p-6 space-y-4 max-w-2xl">
              <Row label="Workspace name"><Input defaultValue="Acme Corporation" /></Row>
              <Row label="Default currency">
                <select className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option></select>
              </Row>
              <Row label="Fiscal year start">
                <select className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm"><option>January</option><option>April</option><option>July</option><option>October</option></select>
              </Row>
              <div className="flex justify-end pt-3 border-t border-[#E2E8F0]"><Button onClick={() => toast.success("Settings saved")} className="bg-[#2563EB] hover:bg-[#1d4fd8]">Save</Button></div>
            </div>
          </TabsContent>
          <TabsContent value="security" className="mt-4">
            <div className="card-surface p-6 space-y-4 max-w-2xl">
              {["Require SSO for all users", "Enforce 2FA", "Session timeout after 30 minutes", "Restrict access by IP range"].map(l => (
                <div key={l} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                  <p className="text-sm text-[#0F172A]">{l}</p><Switch />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <div className="card-surface p-6 space-y-4 max-w-2xl">
              {["Email digest (daily)", "Maintenance alerts", "Allocation approvals", "Audit results", "AI insight summaries"].map(l => (
                <div key={l} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                  <p className="text-sm text-[#0F172A]">{l}</p><Switch defaultChecked />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="integrations" className="mt-4">
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
              {INTEGRATIONS.map(([n, d]) => (
                <div key={n} className="card-surface p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium">{n}</p><p className="text-xs text-[#64748B]">{d}</p></div>
                  <Button variant={connected[n] ? "default" : "outline"} size="sm" className={connected[n] ? "bg-emerald-600 hover:bg-emerald-700" : ""} onClick={() => toggleConnect(n)}>
                    {connected[n] ? "Connected" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="billing" className="mt-4">
            <div className="card-surface p-6 max-w-2xl">
              <p className="text-sm text-[#64748B]">You're on the <strong className="text-[#0F172A]">Enterprise</strong> plan. 84 assets tracked · Unlimited users · Priority support.</p>
              <Button variant="outline" className="mt-4" onClick={() => toast.info("Billing portal", { description: "This demo workspace doesn't have live billing — contact sales to manage a real subscription." })}>Manage subscription</Button>
            </div>
          </TabsContent>
        </Tabs>
      </PermissionGate>
    </AppLayout>
  );
}
function Row({ label, children }: any) { return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>; }