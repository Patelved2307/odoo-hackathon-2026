import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description: string; action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#64748B]">{description}</p>
      {action && <Button onClick={action.onClick} className="mt-5 bg-[#2563EB] hover:bg-[#1d4fd8]">{action.label}</Button>}
    </div>
  );
}
