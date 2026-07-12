import { SiteLayout } from "@/components/site/Layout";
import { Boxes, Users, Calendar, Wrench, ClipboardCheck, BarChart3, Bot, Bell, Building2, IdCard, LayoutDashboard } from "lucide-react";


const features = [
  { icon: LayoutDashboard, title: "Role-aware Dashboard", body: "Hero greeting, quick actions, and KPI cards that adapt to Admin, Asset Manager, Dept Head or Employee. Overdue-return panel auto-flags anything past its expected return date." },
  { icon: Building2, title: "Organization Setup", body: "Departments (with hierarchy and heads), asset categories with category-specific fields like warranty period, and a full employee directory — the only place role promotions happen." },
  { icon: Boxes, title: "Asset Registration & Directory", body: "Auto-generated AF-000X tags, search by tag / serial / name, filter by status and category, and a Digital Asset Passport for every asset with full chronological history." },
  { icon: Users, title: "Allocation & Transfer", body: "Conflict-detected allocation, one-click Transfer Request when the asset is held, and a return flow with condition notes + damage flagging that routes assets to maintenance." },
  { icon: Calendar, title: "Resource Booking", body: "Book rooms, vehicles, projectors, cameras. Real interval-overlap validation per resource per date. Statuses: Upcoming, Ongoing, Completed, Cancelled." },
  { icon: Wrench, title: "Maintenance Management", body: "Raise ticket with priority and simulated AI damage inspection. Approval-gated workflow, auto asset-status changes, Health Score recovery on resolution." },
  { icon: ClipboardCheck, title: "Asset Audit", body: "New Audit Cycle with scope and auditor assignment. Per-asset Verified / Missing / Damaged. Close & Lock cascades statuses — Missing → Lost, Damaged → Needs Repair." },
  { icon: Bot, title: "AI Asset Copilot", body: "Natural-language chat computed live against your data. Ask about holders, available rooms, retirement candidates, overdue returns and open maintenance." },
  { icon: BarChart3, title: "Reports & Analytics", body: "TCO, warranty coverage, idle assets, ticket volume. Asset status distribution, department-wise allocation, and a booking heatmap by hour." },
  { icon: Bell, title: "Activity Log & Notifications", body: "Tamper-proof, append-only feed. Every login, registration, allocation, transfer, booking, maintenance and audit event writes a timestamped entry." },
  { icon: IdCard, title: "Digital Asset Passport", body: "Photo, full metadata, animated health-score ring, and every event that ever touched the asset — registration through repair — in one view." },
];

export default function Features() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-20">
        <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">Features</div>
        <h1 className="mt-2 max-w-3xl font-display text-5xl md:text-6xl">Eleven modules. <span className="gradient-text italic">One live simulation.</span></h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Every action anywhere in AssetFlow AI reflects immediately on the dashboard, reports, activity log and notifications. It's a live platform, not a click-through mockup.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="rounded-3xl border border-border bg-surface p-8 transition-shadow hover:card-shadow">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-bg text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-border bg-surface p-10 md:p-14">
          <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">Core business rules</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Enforced in the UI, not left to policy.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["No double allocation", "Enforced at the point of allocation — the UI won't let you complete on a held asset, only offer a transfer."],
              ["No booking overlaps", "Real interval-overlap math per resource per date."],
              ["Approval before repair", "Raise → Approve → Assign → Progress → Resolve can't be skipped."],
              ["Audit Lock", "Once closed, verification results become read-only and cascade to asset status."],
              ["No self-assigned admin", "Signup only creates Employees; every escalation is explicit."],
              ["Full traceability", "Every asset has its own history array and every action writes to the global log."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-2xl border border-border p-6">
                <div className="font-semibold">{h}</div>
                <div className="mt-1 text-sm text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
