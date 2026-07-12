import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { ACTIVITY } from "@/data/mock";
import { motion } from "framer-motion";
import { Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { downloadCsv } from "@/lib/utils";
import { toast } from "sonner";

const ACTIONS = ["All", ...Array.from(new Set(ACTIVITY.map(e => e.action)))];

export default function ActivityLogs() {
  const [action, setAction] = useState("All");
  const filtered = action === "All" ? ACTIVITY : ACTIVITY.filter(e => e.action === action);

  const exportCsv = () => {
    downloadCsv("activity-log", filtered.map(e => ({ actor: e.actor, action: e.action, target: e.target, when: e.when })));
    toast.success(`Exported ${filtered.length} events`);
  };

  return (
    <AppLayout>
      <PermissionGate perm="activity">
        <PageHeader title="Activity Logs" description="Full audit trail of every action across the platform."
          actions={
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" />{action === "All" ? "Filter" : action}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {ACTIONS.map(a => <DropdownMenuItem key={a} onClick={() => setAction(a)}>{a}</DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="gap-2" onClick={exportCsv}><Download className="h-4 w-4" />Export</Button>
            </>
          } />
        <div className="card-surface p-6">
          <ol className="relative border-l-2 border-[#E2E8F0] ml-3 space-y-5">
            {filtered.map((e, i) => (
              <motion.li key={e.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-[#2563EB]" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#0F172A]">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-[#64748B]">{e.action}</span>{" "}
                    <span className="font-medium">{e.target}</span>
                  </div>
                  <span className="text-xs text-[#94A3B8] shrink-0 ml-4">{e.when}</span>
                </div>
              </motion.li>
            ))}
            {filtered.length === 0 && <p className="text-sm text-[#94A3B8] pl-6">No events match this filter.</p>}
          </ol>
        </div>
      </PermissionGate>
    </AppLayout>
  );
}