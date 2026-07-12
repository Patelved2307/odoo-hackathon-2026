import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Package, PlusSquare, IdCard, ArrowLeftRight, Calendar,
  Wrench, ClipboardCheck, BarChart3, Sparkles, Brain, Bell, Activity, User, Settings,
  Search, HelpCircle, ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import logoIcon from "@/assets/logo-icon.png";

const NAV = [
  { section: "Overview", items: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", perm: "dashboard" },
    { to: "/organization", icon: Building2, label: "Organization", perm: "organization" },
  ]},
  { section: "Assets", items: [
    { to: "/assets", icon: Package, label: "Asset Directory", perm: "assets.directory" },
    { to: "/assets/register", icon: PlusSquare, label: "Register Asset", perm: "assets.register" },
    { to: "/allocations", icon: ArrowLeftRight, label: "Allocations", perm: "allocations" },
    { to: "/bookings", icon: Calendar, label: "Bookings", perm: "bookings" },
  ]},
  { section: "Operations", items: [
    { to: "/maintenance", icon: Wrench, label: "Maintenance", perm: "maintenance" },
    { to: "/audit", icon: ClipboardCheck, label: "Audits", perm: "audit" },
    { to: "/reports", icon: BarChart3, label: "Reports", perm: "reports" },
  ]},
  { section: "AI", items: [
    { to: "/copilot", icon: Sparkles, label: "AI Copilot", perm: "copilot", ai: true },
    { to: "/insights", icon: Brain, label: "AI Insights", perm: "insights", ai: true },
  ]},
  { section: "System", items: [
    { to: "/notifications", icon: Bell, label: "Notifications", perm: "notifications" },
    { to: "/activity", icon: Activity, label: "Activity Logs", perm: "activity" },
    { to: "/settings", icon: Settings, label: "Settings", perm: "settings" },
    { to: "/help", icon: HelpCircle, label: "Help & Support", perm: "help" },
  ]},
] as const;

export function Sidebar() {
  const { can } = useAuth();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex flex-col shrink-0 border-r border-[#E2E8F0] bg-[#F8FAFC] h-screen sticky top-0"
    >
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-[#E2E8F0]">
        <div className="h-9 w-9 flex items-center justify-center shrink-0">
          <img src={logoIcon} alt="AssetFlow AI" className="h-9 w-9" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#0F172A] leading-tight">AssetFlow</p>
            <p className="text-[11px] text-[#64748B] leading-tight">Enterprise AI</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV.map(group => {
          const visible = group.items.filter(i => can(i.perm));
          if (!visible.length) return null;
          return (
            <div key={group.section}>
              {!collapsed && (
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">{group.section}</p>
              )}
              <ul className="space-y-0.5">
                {visible.map(item => {
                  const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "group flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[13px] font-medium transition-colors",
                          active
                            ? "bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#E2E8F0]"
                            : "text-[#64748B] hover:bg-white/70 hover:text-[#0F172A]"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", (item as any).ai && "text-[#7C3AED]", active && !(item as any).ai && "text-[#2563EB]")} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(c => !c)}
        className="mx-3 mb-3 h-9 flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] text-xs font-medium"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && "Collapse"}
      </button>
    </motion.aside>
  );
}

export { Search as SearchIcon };
