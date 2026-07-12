import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { useNotifications } from "@/context/NotificationsContext";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Check, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ICONS = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle };
const CLR = { info: "text-blue-500 bg-blue-50", success: "text-emerald-500 bg-emerald-50", warning: "text-amber-500 bg-amber-50", error: "text-red-500 bg-red-50" };

export default function NotificationCenter() {
  const { notifications, markRead, markAllRead, dismiss } = useNotifications();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const unreadCount = notifications.filter(n => n.unread).length;
  const list = tab === "unread" ? notifications.filter(n => n.unread) : notifications;

  return (
    <AppLayout>
      <PageHeader
        title="Notifications"
        description="Real-time alerts across allocations, maintenance and audits."
        actions={
          <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0} className="gap-2">
            <Check className="h-4 w-4" />Mark all read
          </Button>
        }
      />

      <div className="flex items-center gap-2 mb-4">
        {(["all", "unread"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 h-8 rounded-full text-xs font-medium border ${tab === t ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}
          >
            {t === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="card-surface divide-y divide-[#F1F5F9]">
        <AnimatePresence initial={false}>
          {list.map((n, i) => {
            const Icon = ICONS[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group p-4 flex items-start gap-3 hover:bg-[#F8FAFC] ${n.unread ? "bg-blue-50/30" : ""}`}
              >
                <button
                  onClick={() => n.unread && markRead(n.id)}
                  className="flex items-start gap-3 flex-1 min-w-0 text-left"
                  aria-label={n.unread ? "Mark as read" : undefined}
                >
                  <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${CLR[n.type]}`}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#0F172A]">{n.title}</p>
                      {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{n.when}</p>
                  </div>
                </button>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {n.unread && (
                    <button
                      onClick={() => markRead(n.id)}
                      title="Mark as read"
                      className="h-7 w-7 rounded-md flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(n.id)}
                    title="Dismiss"
                    className="h-7 w-7 rounded-md flex items-center justify-center text-[#64748B] hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {list.length === 0 && (
          <div className="p-12 text-center text-sm text-[#94A3B8]">
            <Bell className="h-6 w-6 mx-auto mb-2" />
            {tab === "unread" ? "No unread notifications." : "You're all caught up."}
          </div>
        )}
      </div>
    </AppLayout>
  );
}