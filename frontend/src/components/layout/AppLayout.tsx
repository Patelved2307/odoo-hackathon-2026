import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 px-6 py-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight text-[#0F172A] leading-tight">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-[#64748B]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PermissionGate({ perm, children }: { perm: string; children: ReactNode }) {
  const { can } = useAuth();
  if (!can(perm)) {
    return (
      <div className="card-surface p-12 text-center max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-[#0F172A]">Access restricted</h2>
        <p className="mt-2 text-sm text-[#64748B]">Your current role doesn't have permission to view this page. Contact an administrator or switch roles.</p>
      </div>
    );
  }
  return <>{children}</>;
}
