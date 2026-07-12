import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { Sparkles, Send, Lightbulb, TrendingUp, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "ai"; content: string; streaming?: boolean };

const SUGGESTIONS = [
  "Show idle laptops in Sales this month",
  "Which assets need preventive maintenance next 30 days?",
  "Total spend on monitors in 2026",
  "List all assets assigned to Priya Shah",
  "Which meeting rooms are available tomorrow at 2pm?",
  "Top 5 assets by health score",
];

const RESPONSES: Record<string, string> = {
  default: "Based on your organization's data, I found 12 assets matching that criteria. The most notable insight: **utilization dropped 8%** in the last 30 days for this category. I recommend reallocating idle units to Engineering, which has an active demand surge. Want me to generate a transfer plan?",
  idle: "I detected **8 idle laptops** in Sales that haven't been active in 21+ days. Estimated recoverable value: **$12,400**. Top candidates: MacBook Air 3, Dell Latitude X1, ThinkPad Elite 2. These could be redistributed to Engineering or put into maintenance rotation.",
  maintenance: "**14 assets** are flagged for preventive maintenance within 30 days. Highest priority: 3 servers with predicted failure risk >70% (Server Pro 4, Server X1 2, Server Studio 5). I can auto-create tickets and notify Technicians. Estimated downtime impact: **8 hours total**.",
  priya: "**Priya Shah** (Asset Manager) currently has **6 assets**: Laptop AF-0114 (allocated Jun 14, due Aug 14), Monitor AF-0203, Desk AF-0156, Chair AF-0089, External SSD AF-0341, and Docking Station AF-0418. All items are in good condition with average health score of **87**.",
  booking: "Tomorrow at **2:00 PM**, I have availability data: Meeting Room A1 (Free), Meeting Room C4 (Free), Meeting Room B2 (Booked 1:30-3:30 PM). Recommendation: **A1 or C4** both available. A1 has better ventilation and AV setup.",
  health: "**Top 5 Assets by Health Score**: 1. Server Studio 2 (99), 2. Projector AF-0099 (96), 3. MacBook Pro M3 (95), 4. Monitor LG UltraWide (94), 5. Conference Phone System (92). All critical infrastructure is in excellent condition.",
  unrecognized: "I couldn't match that to anything in your asset data, so I don't want to guess and hand you a made-up answer. Try asking about assets, allocations, bookings, maintenance, spend, warranties, or a specific person or department — or tap one of the suggestions below.",
};

// Domain terms the copilot can actually answer about. Anything outside this
// list (typos, keyboard mash, off-topic text) should fall through to the
// "unrecognized" reply instead of the polished — but fabricated — default.
const KNOWN_TERMS = [
  "idle", "unused", "maintenance", "preventive", "priya", "room", "rooms", "available", "availability",
  "health", "spend", "cost", "budget", "warranty", "warranties", "audit", "book", "booking", "bookings",
  "allocation", "allocations", "report", "reports", "department", "location", "technician", "laptop",
  "monitor", "server", "servers", "utilization", "value", "depreciation", "transfer", "ticket", "tickets",
  "asset", "assets", "device", "devices", "employee", "employees", "vehicle", "vehicles", "phone", "phones",
];
const QUESTION_STARTERS = ["which", "what", "who", "how", "show", "list", "total", "top", "find", "when", "where", "why", "does", "do", "is", "are"];

function isRecognizedQuery(q: string) {
  const s = q.toLowerCase().trim();
  if (s.length < 4) return false;
  const words = s.split(/\s+/);
  // A real question is either multiple words that read like English, or
  // contains at least one domain term / question starter we know how to answer.
  const hasKnownTerm = KNOWN_TERMS.some(t => s.includes(t));
  const startsLikeQuestion = QUESTION_STARTERS.includes(words[0]) || s.endsWith("?");
  // Single-token gibberish (e.g. "dfgaerg") has no spaces and isn't a known term.
  if (words.length === 1 && !hasKnownTerm) return false;
  return hasKnownTerm || startsLikeQuestion;
}

function pickResponse(q: string) {
  if (!isRecognizedQuery(q)) return RESPONSES.unrecognized;
  const s = q.toLowerCase();
  if (s.includes("idle") || s.includes("unused")) return RESPONSES.idle;
  if (s.includes("maintenance") || s.includes("preventive")) return RESPONSES.maintenance;
  if (s.includes("priya")) return RESPONSES.priya;
  if (s.includes("room") || s.includes("available")) return RESPONSES.booking;
  if (s.includes("health")) return RESPONSES.health;
  return RESPONSES.default;
}

export default function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", content: "Hi! I'm your AssetFlow AI assistant. Ask me anything about your assets, allocations, or operations." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, typing]);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs(m => [...m, { role: "user", content: q }]);
    setInput("");
    setTyping(true);
    const full = pickResponse(q);

    // Real replies don't start appearing the instant you hit send — give a
    // short "thinking" beat (during which the bouncing dots show) before the
    // text starts streaming in, and reveal it more gradually than before.
    setTimeout(() => {
      let i = 0;
      setMsgs(m => [...m, { role: "ai", content: "", streaming: true }]);
      const iv = setInterval(() => {
        i += 2;
        setMsgs(m => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "ai", content: full.slice(0, i), streaming: i < full.length };
          return copy;
        });
        if (i >= full.length) { clearInterval(iv); setTyping(false); }
      }, 32);
    }, 700);
  };

  return (
    <AppLayout>
      <PermissionGate perm="copilot">
        <PageHeader title="AI Copilot" description="Ask about assets, workflows, and operations in natural language." />
        <div className="grid lg:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
          <div className="lg:col-span-3 card-surface flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {msgs.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "ai" ? "bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white" : "bg-slate-100 text-[#0F172A] font-semibold text-xs"}`}>
                      {m.role === "ai" ? <Sparkles className="h-4 w-4" /> : "You"}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "ai" ? "bg-[#F1F5F9] text-[#0F172A]" : "bg-[#2563EB] text-white"}`}>
                      {m.content.split("**").map((part, idx) => idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part)}
                      {m.streaming && <span className="inline-block w-1.5 h-4 bg-[#7C3AED] ml-0.5 animate-pulse align-middle" />}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && !msgs[msgs.length - 1]?.streaming && (
                <div className="flex gap-2 items-center text-xs text-[#64748B]">
                  <div className="flex gap-1"><span className="h-1.5 w-1.5 bg-[#94A3B8] rounded-full animate-bounce" /><span className="h-1.5 w-1.5 bg-[#94A3B8] rounded-full animate-bounce [animation-delay:150ms]" /><span className="h-1.5 w-1.5 bg-[#94A3B8] rounded-full animate-bounce [animation-delay:300ms]" /></div>
                  Thinking…
                </div>
              )}
            </div>
            <div className="border-t border-[#E2E8F0] p-4 bg-white">
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-slate-200 hover:text-[#0F172A]">{s}</button>
                ))}
              </div>
              <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your assets…" className="flex-1 h-11 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]" />
                <Button type="submit" disabled={!input.trim() || typing} className="h-11 px-4 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-surface p-4">
              <div className="flex items-center gap-2 mb-2.5"><Lightbulb className="h-4 w-4 text-[#7C3AED]" /><h3 className="text-sm font-semibold">Suggested prompts</h3></div>
              <ul className="space-y-1.5 text-xs">
                {SUGGESTIONS.map(s => <li key={s}><button onClick={() => send(s)} className="w-full text-left p-2 rounded-md hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]">{s}</button></li>)}
              </ul>
            </div>
            <div className="card-surface p-4">
              <div className="flex items-center gap-2 mb-2.5"><MessageSquare className="h-4 w-4 text-[#64748B]" /><h3 className="text-sm font-semibold">Recent conversations</h3></div>
              <ul className="space-y-1 text-xs text-[#64748B]">
                <li className="p-2 rounded hover:bg-[#F1F5F9]">Q2 audit summary</li>
                <li className="p-2 rounded hover:bg-[#F1F5F9]">Cost per department</li>
                <li className="p-2 rounded hover:bg-[#F1F5F9]">Warranty expiring next 90d</li>
              </ul>
            </div>
          </aside>
        </div>
      </PermissionGate>
    </AppLayout>
  );
}