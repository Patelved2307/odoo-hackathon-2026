import { Bell, Search, Command as CmdIcon, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth, type Role } from "@/context/AuthContext";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NOTIFICATIONS } from "@/data/mock";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { CommandPalette } from "./CommandPalette";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard", organization: "Organization", assets: "Assets", register: "Register",
  allocations: "Allocations", bookings: "Bookings", maintenance: "Maintenance", audit: "Audit",
  reports: "Reports", copilot: "AI Copilot", insights: "AI Insights", notifications: "Notifications",
  activity: "Activity Logs", profile: "Profile", settings: "Settings", search: "Search", help: "Help",
  passport: "Digital Passport",
};

export function Topbar() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [openCmd, setOpenCmd] = useState(false);
  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpenCmd(v => !v); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((p, i) => ({ label: ROUTE_LABELS[p] ?? p, path: "/" + parts.slice(0, i + 1).join("/") }));

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-[#E2E8F0] flex items-center px-6 gap-4">
        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <Link to="/dashboard" className="text-[#64748B] hover:text-[#0F172A]">Home</Link>
          {crumbs.map((c, i) => (
            <span key={c.path} className="flex items-center gap-1.5 min-w-0">
              <span className="text-[#CBD5E1]">/</span>
              <span className={i === crumbs.length - 1 ? "text-[#0F172A] font-medium truncate" : "text-[#64748B]"}>{c.label}</span>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setOpenCmd(true)}
            className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] w-72 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search assets, people, actions…</span>
            <kbd className="flex items-center gap-0.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]">
              <CmdIcon className="h-3 w-3" />K
            </kbd>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-9 w-9 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]">
                <Bell className="h-4 w-4" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-white" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <Link to="/notifications" className="text-xs text-[#2563EB] hover:underline">View all</Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.slice(0, 4).map(n => (
                  <div key={n.id} className="px-4 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                    <p className="text-[13px] font-medium text-[#0F172A]">{n.title}</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{n.when}</p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#CBD5E1]">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white text-[12px] font-semibold flex items-center justify-center">
                  {user?.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[12px] font-medium text-[#0F172A]">{user?.name}</p>
                  <p className="text-[10px] text-[#64748B]">{user?.role}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-[#64748B] font-normal">{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                <UserIcon className="h-4 w-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Switch role</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(["Admin","Asset Manager","Department Head","Employee","Auditor","Technician"] as Role[]).map(r => (
                    <DropdownMenuItem key={r} onClick={() => switchRole(r)}>{r}</DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/login" }); }} className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <CommandPalette open={openCmd} onOpenChange={setOpenCmd} />
    </>
  );
}
