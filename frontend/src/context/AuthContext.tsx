import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "Admin" | "Asset Manager" | "Department Head" | "Employee" | "Auditor" | "Technician";

export const ROLE_LIST: Role[] = ["Admin", "Asset Manager", "Department Head", "Employee", "Auditor", "Technician"];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
}

// Every gated area of the app, keyed the same way PermissionGate/`can()` are called.
export const PERMISSION_KEYS = [
  "dashboard", "organization", "assets.register", "assets.directory", "assets.passport",
  "allocations", "bookings", "maintenance", "audit", "reports", "copilot", "insights",
  "notifications", "activity", "profile", "settings", "search", "help",
] as const;
export type PermissionKey = typeof PERMISSION_KEYS[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  dashboard: "Dashboard",
  organization: "Organization settings",
  "assets.register": "Register new assets",
  "assets.directory": "Asset directory",
  "assets.passport": "Digital passport",
  allocations: "Allocations",
  bookings: "Bookings",
  maintenance: "Maintenance",
  audit: "Audit",
  reports: "Reports",
  copilot: "AI Copilot",
  insights: "AI Insights",
  notifications: "Notifications",
  activity: "Activity logs",
  profile: "Profile",
  settings: "Settings",
  search: "Search",
  help: "Help",
};

// Default permission matrix, one entry per role — this is now the single
// source of truth. Editing it at runtime (via Organization > Roles &
// Permissions) actually changes what each role can do across the app,
// instead of just changing a label in the UI.
const DEFAULT_ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = {
  "Admin": [...PERMISSION_KEYS],
  "Asset Manager": ["dashboard", "assets.register", "assets.directory", "assets.passport", "allocations", "bookings", "maintenance", "reports", "copilot", "insights", "notifications", "profile", "search", "help"],
  "Department Head": ["dashboard", "assets.directory", "assets.passport", "allocations", "bookings", "reports", "copilot", "insights", "notifications", "profile", "search", "help"],
  "Employee": ["dashboard", "assets.directory", "assets.passport", "bookings", "copilot", "notifications", "profile", "search", "help"],
  "Auditor": ["dashboard", "assets.directory", "assets.passport", "audit", "reports", "copilot", "activity", "notifications", "profile", "search", "help"],
  "Technician": ["dashboard", "assets.directory", "assets.passport", "maintenance", "copilot", "notifications", "profile", "search", "help"],
};

const STORAGE_KEY = "assetflow_role_permissions";

function loadStoredPermissions(): Record<Role, PermissionKey[]> {
  if (typeof window === "undefined") return DEFAULT_ROLE_PERMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ROLE_PERMISSIONS;
    const parsed = JSON.parse(raw);
    // Merge over defaults so newly added permission keys/roles are never missing.
    return { ...DEFAULT_ROLE_PERMISSIONS, ...parsed };
  } catch {
    return DEFAULT_ROLE_PERMISSIONS;
  }
}

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string, role: Role) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  can: (perm: string) => boolean;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "department">>) => void;
  rolePermissions: Record<Role, PermissionKey[]>;
  setRolePermissions: (role: Role, perms: PermissionKey[]) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [rolePermissions, setRolePermissionsState] = useState<Record<Role, PermissionKey[]>>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("assetflow_user");
    if (raw) { try { setUser(JSON.parse(raw)); } catch { /* ignore */ } }
    setRolePermissionsState(loadStoredPermissions());
  }, []);

  // Requires a real-looking email, a password meeting a minimum length, and a
  // role — garbage input no longer silently logs you in.
  const login = (email: string, password: string, role: Role): { ok: true } | { ok: false; error: string } => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      return { ok: false, error: "Enter a valid work email address." };
    }
    if (!password || password.length < 8) {
      return { ok: false, error: "Password must be at least 8 characters." };
    }
    if (!role || !ROLE_LIST.includes(role)) {
      return { ok: false, error: "Select a role to sign in as." };
    }
    const u: User = {
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: trimmedEmail.split("@")[0].split(".").map(s => s[0]?.toUpperCase() + s.slice(1)).join(" ") || "Demo User",
      email: trimmedEmail,
      role,
      department: role === "Technician" ? "Facilities" : role === "Auditor" ? "Compliance" : "Operations",
    };
    setUser(u);
    if (typeof window !== "undefined") localStorage.setItem("assetflow_user", JSON.stringify(u));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("assetflow_user");
  };

  const updateProfile = (patch: Partial<Pick<User, "name" | "email" | "department">>) => {
    if (!user) return;
    const u = { ...user, ...patch };
    setUser(u);
    if (typeof window !== "undefined") localStorage.setItem("assetflow_user", JSON.stringify(u));
  };

  const can = (perm: string) => !!user && (rolePermissions[user.role]?.includes(perm as PermissionKey) ?? false);

  const setRolePermissions = (role: Role, perms: PermissionKey[]) => {
    setRolePermissionsState(prev => {
      const next = { ...prev, [role]: perms };
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user, login, logout, can, updateProfile, rolePermissions, setRolePermissions }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}