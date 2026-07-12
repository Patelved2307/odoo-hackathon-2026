import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, DollarSign, Users } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { KPICard } from "@/components/common/KPICard";
import { downloadCsv } from "@/lib/utils";
import { toast } from "sonner";
import { ASSETS } from "@/data/mock";

const util = Array.from({ length: 12 }).map((_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], used: 60 + i * 2, idle: 30 - i }));
const spend = Array.from({ length: 6 }).map((_, i) => ({ q: `Q${i+1}`, capex: 40 + i * 5, opex: 20 + i * 3 }));
const life = Array.from({ length: 5 }).map((_, i) => ({ y: `Y${i+1}`, v: 100 - i * 18 }));

const REPORTS = ["Asset inventory · full", "Utilization · monthly", "Maintenance · SLA", "Audit · exceptions", "Depreciation · GL export", "Compliance · SOC 2"];

function generateReport(name: string) {
  if (name.startsWith("Asset inventory")) {
    downloadCsv("asset-inventory-full", ASSETS.map(a => ({ tag: a.tag, name: a.name, category: a.category, status: a.status, department: a.department, location: a.location, value: a.value })));
  } else if (name.startsWith("Utilization")) {
    downloadCsv("utilization-monthly", util);
  } else if (name.startsWith("Depreciation")) {
    downloadCsv("depreciation-curve", life);
  } else {
    downloadCsv(name.replace(/[^a-z0-9]+/gi, "-").toLowerCase(), [{ report: name, generated: new Date().toISOString() }]);
  }
  toast.success(`${name} generated`, { description: "Download started." });
}

export default function Reports() {
  return (
    <AppLayout>
      <PermissionGate perm="reports">
        <PageHeader title="Reports & Analytics" description="Executive views across utilization, spend and lifecycle."
          actions={<><Button variant="outline" className="gap-2" onClick={() => toast.info("Report templates", { description: "Choose a report from Available reports below to generate it." })}><FileText className="h-4 w-4" />Templates</Button><Button className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={() => generateReport("Asset inventory · full")}><Download className="h-4 w-4" />Export report</Button></>} />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <KPICard label="Utilization rate" value={78} suffix="%" icon={TrendingUp} accent="success" delta={5.2} />
          <KPICard label="Total spend YTD" value={342000} prefix="$" icon={DollarSign} accent="primary" delta={-3.1} />
          <KPICard label="Cost per employee" value={2140} prefix="$" icon={Users} accent="warning" delta={-2.4} />
          <KPICard label="Avg lifecycle (mo)" value={38} icon={TrendingUp} accent="ai" delta={4.1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Chart title="Utilization vs idle" subtitle="Monthly, current year">
            <AreaChart data={util}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="used" stackId="a" stroke="#2563EB" fill="#2563EB" fillOpacity={0.85} />
              <Area type="monotone" dataKey="idle" stackId="a" stroke="#CBD5E1" fill="#CBD5E1" />
            </AreaChart>
          </Chart>
          <Chart title="CapEx vs OpEx" subtitle="Quarterly spend, USD thousands">
            <BarChart data={spend}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="q" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="capex" fill="#2563EB" radius={[6, 6, 0, 0]} />
              <Bar dataKey="opex" fill="#7C3AED" radius={[6, 6, 0, 0]} />
            </BarChart>
          </Chart>
          <Chart title="Depreciation curve" subtitle="Average asset value by age (year)">
            <LineChart data={life}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="y" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </Chart>
          <div className="card-surface p-5">
            <h3 className="text-sm font-semibold mb-3">Available reports</h3>
            <ul className="divide-y divide-[#F1F5F9]">
              {REPORTS.map(r => (
                <li key={r} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#94A3B8]" /><span className="text-[#0F172A]">{r}</span></div>
                  <Button variant="ghost" size="sm" className="h-7 text-[#2563EB]" onClick={() => generateReport(r)}>Generate</Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PermissionGate>
    </AppLayout>
  );
}

function Chart({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactElement }) {
  return (
    <div className="card-surface p-5">
      <div className="mb-3"><h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>{subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}</div>
      <div className="h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </div>
  );
}