import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/common/KPICard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Package, CheckCircle2, Wrench, DollarSign, TrendingUp, Sparkles, Plus, Download } from "lucide-react";
import { KPI, ACTIVITY, ASSETS, NOTIFICATIONS, BOOKINGS } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from "recharts";
import { useNavigate } from "@tanstack/react-router";

const trend = Array.from({ length: 12 }).map((_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], v: 40 + Math.round(Math.sin(i/2) * 15 + i * 3) }));
const catDist = ["Laptop","Monitor","Phone","Vehicle","Furniture","Server"].map((n, i) => ({ name: n, value: 12 + i * 4 }));
const COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <AppLayout>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        description="Here's what's happening across your asset portfolio today."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
            <Button onClick={() => navigate({ to: "/assets/register" })} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />New asset</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="Total assets" value={KPI.totalAssets} icon={Package} delta={4.2} accent="primary" />
        <KPICard label="Available now" value={KPI.available} icon={CheckCircle2} delta={2.1} accent="success" />
        <KPICard label="In maintenance" value={KPI.maintenance} icon={Wrench} delta={-1.3} accent="warning" />
        <KPICard label="Portfolio value" value={KPI.totalValue} prefix="$" icon={DollarSign} delta={6.8} accent="ai" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Utilization trend</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Assets in active use over the last 12 months</p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600"><TrendingUp className="h-3.5 w-3.5" />+12.4%</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="m" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="card-surface p-5">
          <h3 className="text-sm font-semibold text-[#0F172A]">Category mix</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Distribution by asset type</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catDist} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {catDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {catDist.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs text-[#64748B]">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />{c.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#0F172A]">Recent activity</h3>
            <button onClick={() => navigate({ to: "/activity" })} className="text-xs text-[#2563EB] hover:underline">View all</button>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {ACTIVITY.slice(0, 6).map(e => (
              <li key={e.id} className="py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 text-[11px] font-semibold text-[#0F172A] flex items-center justify-center">
                  {e.actor.split(" ").map(s => s[0]).join("")}
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <span className="font-medium text-[#0F172A]">{e.actor}</span>{" "}
                  <span className="text-[#64748B]">{e.action}</span>{" "}
                  <span className="font-medium text-[#0F172A]">{e.target}</span>
                </div>
                <span className="text-xs text-[#94A3B8]">{e.when}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-5 bg-gradient-to-br from-[#F1F5F9] to-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center"><Sparkles className="h-4 w-4 text-[#7C3AED]" /></div>
            <h3 className="text-sm font-semibold text-[#0F172A]">AI Insights</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
              <p className="font-medium text-[#0F172A]">Reallocate 8 idle laptops</p>
              <p className="text-xs text-[#64748B] mt-0.5">Detected in Sales; potential savings $12,400</p>
            </li>
            <li className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
              <p className="font-medium text-[#0F172A]">3 servers due preventive check</p>
              <p className="text-xs text-[#64748B] mt-0.5">Predicted failure risk in 21 days</p>
            </li>
            <li className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
              <p className="font-medium text-[#0F172A]">Procurement recommended</p>
              <p className="text-xs text-[#64748B] mt-0.5">Monitor demand up 34% in Engineering</p>
            </li>
          </ul>
          <Button onClick={() => navigate({ to: "/insights" })} variant="outline" className="w-full mt-4 border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED]/5">Open AI Insights</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Upcoming bookings</h3>
          <ul className="divide-y divide-[#F1F5F9]">
            {BOOKINGS.slice(0, 5).map(b => (
              <li key={b.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{b.asset}</p>
                  <p className="text-xs text-[#64748B]">{b.user} · {b.from} → {b.to}</p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Allocation by department</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={["Engineering","Design","Sales","Marketing","HR","Finance","Ops"].map((d, i) => ({ d, v: 8 + i * 3 + (i % 2 ? 4 : 0) }))}>
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="d" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Bar dataKey="v" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
