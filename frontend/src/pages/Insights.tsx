import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { Brain, TrendingUp, AlertTriangle, DollarSign, PackageX, Users, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const INSIGHTS = [
  { icon: TrendingUp, title: "Asset Health Score", value: "92/100", trend: "+4 vs last month", desc: "Overall portfolio health is strong. 3 categories improved.", accent: "success", confidence: 96 },
  { icon: AlertTriangle, title: "Predictive Maintenance", value: "14 assets", trend: "Next 30 days", desc: "3 servers with >70% failure risk. Recommend immediate check.", accent: "warning", confidence: 88 },
  { icon: DollarSign, title: "Procurement Forecast", value: "$48,200", trend: "Recommended Q3 spend", desc: "Demand up 34% in Engineering. Prioritize laptops & monitors.", accent: "primary", confidence: 82 },
  { icon: PackageX, title: "Idle Asset Detection", value: "22 assets", trend: "Potential $34K savings", desc: "Reallocate idle units in Sales and Marketing.", accent: "warning", confidence: 91 },
  { icon: ShieldAlert, title: "Risk Analysis", value: "Low", trend: "2 flags requiring review", desc: "Loss rate improved 12%. Warranty gap identified on 5 assets.", accent: "success", confidence: 94 },
  { icon: Users, title: "Department Recommendations", value: "Rebalance", trend: "Engineering under-provisioned", desc: "Move 6 laptops from Marketing pool to Engineering.", accent: "ai", confidence: 87 },
];

const A: Record<string, string> = { success: "bg-emerald-50 text-emerald-600", warning: "bg-amber-50 text-amber-600", primary: "bg-blue-50 text-[#2563EB]", ai: "bg-violet-50 text-[#7C3AED]" };

export default function Insights() {
  return (
    <AppLayout>
      <PermissionGate perm="insights">
        <PageHeader title="AI Insights" description="Predictive analysis and recommendations across your asset portfolio." />
        <div className="card-surface p-6 bg-gradient-to-br from-violet-50 via-white to-blue-50 mb-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center shrink-0"><Brain className="h-5 w-5 text-white" /></div>
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">Executive summary</h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-2xl">Your asset portfolio is <strong className="text-[#0F172A]">operating efficiently</strong>. Focus areas for this quarter: preventive maintenance on aging server infrastructure, reallocation of 22 idle units, and planned procurement of ~$48K to meet Engineering demand.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="bg-white" onClick={() => toast.success("Action plan generated", { description: "3 tasks added — preventive maintenance, idle reallocation, Q3 procurement." })}>Generate action plan</Button>
                <Button size="sm" variant="outline" className="bg-white" onClick={() => toast.success("Review scheduled", { description: "A calendar invite for the quarterly portfolio review has been queued." })}>Schedule review</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {INSIGHTS.map((ins, i) => (
            <motion.div key={ins.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} className="card-surface p-5 hover:shadow-[var(--shadow-hover)] transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${A[ins.accent]}`}><ins.icon className="h-5 w-5" /></div>
                <span className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wide">{ins.confidence}% confidence</span>
              </div>
              <h3 className="text-sm font-semibold text-[#0F172A] mt-3">{ins.title}</h3>
              <p className="text-2xl font-semibold text-[#0F172A] mt-1 tracking-tight">{ins.value}</p>
              <p className="text-[11px] text-[#64748B] font-medium">{ins.trend}</p>
              <p className="text-xs text-[#64748B] mt-3 leading-relaxed">{ins.desc}</p>
              <div className="mt-3">
                <Progress value={ins.confidence} className="h-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </PermissionGate>
    </AppLayout>
  );
}