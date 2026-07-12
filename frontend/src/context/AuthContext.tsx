import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "Admin" | "Asset Manager" | "Department Head" | "Employee" | "Auditor" | "Technician";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
}

// Permission matrix
const PERMISSIONS: Record<string, Role[]> = {
  "dashboard": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "organization": ["Admin"],
  "assets.register": ["Admin", "Asset Manager"],
  "assets.directory": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "assets.passport": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "allocations": ["Admin", "Asset Manager", "Department Head"],
  "bookings": ["Admin", "Asset Manager", "Department Head", "Employee"],
  "maintenance": ["Admin", "Asset Manager", "Technician"],
  "audit": ["Admin", "Auditor"],
  "reports": ["Admin", "Asset Manager", "Department Head", "Auditor"],
  "copilot": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "insights": ["Admin", "Asset Manager", "Department Head"],
  "notifications": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "activity": ["Admin", "Auditor"],
  "profile": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "settings": ["Admin"],
  "search": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
  "help": ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"],
};

interface AuthCtx {
  user: User | null;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  can: (perm: string) => boolean;
  switchRole: (role: Role) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("assetflow_user");
    if (raw) { try { setUser(JSON.parse(raw)); } catch { /* ignore */ } }
  }, []);

  const login = (email: string, role: Role = "Admin") => {
    const u: User = {
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: email.split("@")[0].split(".").map(s => s[0].toUpperCase() + s.slice(1)).join(" ") || "Demo User",
      email,
      role,
      department: role === "Technician" ? "Facilities" : role === "Auditor" ? "Compliance" : "Operations",
    };
    setUser(u);
    if (typeof window !== "undefined") localStorage.setItem("assetflow_user", JSON.stringify(u));
  };
  const switchRole = (role: Role) => {
    if (!user) return;
    const u = { ...user, role };
    setUser(u);
    if (typeof window !== "undefined") localStorage.setItem("assetflow_user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("assetflow_user");
  };
  const can = (perm: string) => !!user && (PERMISSIONS[perm]?.includes(user.role) ?? false);

  return <Ctx.Provider value={{ user, login, logout, can, switchRole }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
