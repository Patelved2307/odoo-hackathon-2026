import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export interface WorkspaceSettings {
  workspaceName: string;
  currency: CurrencyCode;
  fiscalYearStart: string;
}

const DEFAULT_SETTINGS: WorkspaceSettings = {
  workspaceName: "Acme Corporation",
  currency: "USD",
  fiscalYearStart: "January",
};

interface SettingsCtx {
  settings: WorkspaceSettings;
  currencySymbol: string;
  updateSettings: (patch: Partial<WorkspaceSettings>) => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

const STORAGE_KEY = "assetflow_settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);

  // Load any previously saved settings once on mount, same pattern as AuthContext.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { setSettings(s => ({ ...s, ...JSON.parse(raw) })); } catch { /* ignore */ } }
  }, []);

  const updateSettings = (patch: Partial<WorkspaceSettings>) => {
    setSettings(s => {
      const next = { ...s, ...patch };
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ settings, currencySymbol: CURRENCY_SYMBOLS[settings.currency], updateSettings }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be used within SettingsProvider");
  return c;
}