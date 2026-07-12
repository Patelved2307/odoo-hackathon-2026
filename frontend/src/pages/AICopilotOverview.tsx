import { SiteLayout } from "@/components/site/Layout";
import { Sparkles, Send, Activity, Heart, IdCard } from "lucide-react";


const prompts = [
  "Who has Laptop AF-201?",
  "Which meeting room is available at 3pm?",
  "Which assets should be retired?",
  "Show me overdue assets.",
  "What's open in maintenance?",
];

const answers: Record<string, string> = {
  "Who has Laptop AF-201?": "Priya Menon (Design) — allocated on 2026-06-14, expected return 2026-08-14. Health Score: 88.",
  "Which meeting room is available at 3pm?": "Meeting Room A1 and Meeting Room C4 are free. Room B2 is booked 14:00–15:30.",
  "Which assets should be retired?": "3 candidates — health <45 and >4 years old: Printer AF-0032 (health 38), Projector AF-0021 (health 41), Chair-set AF-0088 (health 43).",
  "Show me overdue assets.": "2 overdue returns — Camera AF-0074 (Rahul S., 6 days overdue), Tablet AF-0058 (Anita K., 2 days overdue).",
  "What's open in maintenance?": "1 open ticket — Laptop AF-0114, priority High, technician not yet assigned. Raised 2 days ago.",
};

export default function AI() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--violet)]" />
          The AI layer, built in
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-5xl md:text-7xl">Ask your asset registry <span className="gradient-text italic">anything.</span></h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          The AI Copilot answers in natural language — but every answer is computed live against your data. It's a query engine, not a chatbot.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-border bg-surface p-6 card-shadow">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-semibold">AssetFlow Copilot</div>
                <div className="text-xs text-muted-foreground">Live · connected to your workspace</div>
              </div>
            </div>
            <div className="mt-6 space-y-5">
              {prompts.slice(0, 3).map((q) => (
                <div key={q} className="space-y-2">
                  <div className="ml-auto max-w-md rounded-2xl rounded-br-md gradient-bg px-4 py-3 text-sm text-primary-foreground">{q}</div>
                  <div className="max-w-lg rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-sm">{answers[q]}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
              <input placeholder="Ask about assets, bookings, health…" className="flex-1 bg-transparent text-sm outline-none" />
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-full gradient-bg text-primary-foreground">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">Suggested prompts</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {prompts.map((p) => (
                <span key={p} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">{p}</span>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              {[
                { icon: Heart, title: "Asset Health Score", body: "Computed indicator per asset, shown as a radial ring in the Passport and used to sort retirement candidates in Reports and Copilot." },
                { icon: Activity, title: "AI-assisted Maintenance", body: "Simulated damage-inspection preview on photo attach: likely damage type and cost range — right in the ticket flow." },
                { icon: IdCard, title: "Digital Asset Passport", body: "Every asset carries its full history — registration, allocations, returns, repairs — a single source of truth for lifecycle." },
              ].map((x) => (
                <div key={x.title} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                      <x.icon className="h-4 w-4" />
                    </span>
                    <div className="font-semibold">{x.title}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{x.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
