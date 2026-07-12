import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { NOTIFICATIONS as SEED_NOTIFICATIONS, type Notification } from "@/data/mock";

const STORAGE_KEY = "assetflow_notifications";

function loadStored(): Notification[] {
  if (typeof window === "undefined") return SEED_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_NOTIFICATIONS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED_NOTIFICATIONS;
    return parsed as Notification[];
  } catch {
    return SEED_NOTIFICATIONS;
  }
}

function persist(list: Notification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
}

interface NotificationsCtx {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const Ctx = createContext<NotificationsCtx | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    setNotifications(loadStored());
  }, []);

  const update = (updater: (prev: Notification[]) => Notification[]) => {
    setNotifications(prev => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  };

  const markRead = (id: string) =>
    update(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));

  const markUnread = (id: string) =>
    update(prev => prev.map(n => (n.id === id ? { ...n, unread: true } : n)));

  const markAllRead = () => update(prev => prev.map(n => ({ ...n, unread: false })));

  const dismiss = (id: string) => update(prev => prev.filter(n => n.id !== id));

  const clearAll = () => update(() => []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Ctx.Provider value={{ notifications, unreadCount, markRead, markUnread, markAllRead, dismiss, clearAll }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNotifications must be used within NotificationsProvider");
  return c;
}