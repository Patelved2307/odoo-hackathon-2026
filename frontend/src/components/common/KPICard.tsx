import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  delta?: number;
  accent?: "primary" | "success" | "warning" | "ai";
}

function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => {
    const controls = animate(mv, to, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [to, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export function KPICard({ label, value, prefix, suffix, icon: Icon, delta, accent = "primary" }: Props) {
  const ring = {
    primary: "bg-blue-50 text-[#2563EB]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    ai: "bg-violet-50 text-[#7C3AED]",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-5 hover:shadow-[var(--shadow-hover)] transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#64748B]">{label}</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tight text-[#0F172A] leading-none">
            <Counter to={value} prefix={prefix} suffix={suffix} />
          </p>
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", ring)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof delta === "number" && (
        <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-medium", delta >= 0 ? "text-emerald-600" : "text-red-600")}>
          {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(delta)}% vs last month
        </div>
      )}
    </motion.div>
  );
}
