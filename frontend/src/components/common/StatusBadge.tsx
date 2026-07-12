import { cn } from "@/lib/utils";

const MAP: Record<string, { bg: string; text: string; dot: string }> = {
  Available: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Allocated: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Reserved: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  Maintenance: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Lost: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Retired: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  Disposed: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-500" },
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Transferred: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Returned: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-500" },
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Completed: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
  Open: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "In Progress": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Awaiting Parts": { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  Resolved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Planned: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
  Low: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  Medium: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  High: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Critical: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}
