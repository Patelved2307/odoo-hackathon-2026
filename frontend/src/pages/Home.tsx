import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { ArrowRight, ShieldCheck, Sparkles, Boxes, Calendar, Wrench, ClipboardCheck, BarChart3, Bot, QrCode, Users } from "lucide-react";
import hero from "@/assets/hero.jpg";
import booking from "@/assets/booking.jpg";
import maintenance from "@/assets/maintenance.jpg";
import audit from "@/assets/audit.jpg";


const kpis = [
  { v: "1", l: "unified platform" },
  { v: "4", l: "role tiers" },
  { v: "11", l: "core modules" },
  { v: "100%", l: "audit trail" },
];

const modules = [
  { icon: Boxes, title: "Asset Directory", body: "Registry with tag, serial, category, location, holder, and a computed Health Score per asset." },
  { icon: Users, title: "Allocation & Transfer", body: "Block double allocation at the point of action; offer a one-click transfer request instead." },
  { icon: Calendar, title: "Resource Booking", body: "True interval-overlap validation for rooms, vehicles, and shared equipment — no double books." },
  { icon: Wrench, title: "Maintenance", body: "Raise → Approve → Assign → Progress → Resolve. Approval-gated, with AI damage preview." },
  { icon: ClipboardCheck, title: "Audit Cycles", body: "Verify assets, then Lock the cycle — Missing flips to Lost, Damaged to Needs Repair, automatically." },
  { icon: BarChart3, title: "Reports & Insights", body: "TCO, warranty coverage, idle assets, booking heatmaps, and computed AI recommendations." },
  { icon: Bot, title: "AI Copilot", body: "Natural-language queries computed live against your data — no static answers." },
  { icon: QrCode, title: "Digital Asset Passport", body: "Full chronological history per asset — registrations, allocations, returns, and repairs." },
];

export default function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 soft-bg" />
        <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[color:var(--violet)] opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-[color:var(--teal)] opacity-20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--violet)]" />
              Enterprise Asset Management, reimagined with AI
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Every asset,
              <br />
              <span className="gradient-text italic">every resource,</span>
              <br />
              in one place.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              AssetFlow AI digitizes the complete lifecycle of organizational assets — replacing spreadsheets, paper registers and WhatsApp tracking with a centralized, role-based ERP built for real operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/demo" className="group inline-flex items-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-medium text-primary-foreground glow-shadow transition-transform hover:-translate-y-0.5">
                Request a demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/features" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium hover:bg-secondary">
                Explore features
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-4 gap-6">
              {kpis.map((k) => (
                <div key={k.l}>
                  <dt className="font-display text-3xl">{k.v}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{k.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] gradient-bg opacity-20 blur-2xl" />
            <img
              src={hero}
              alt="AssetFlow AI workspace with laptops, tablets and equipment"
              width={1600}
              height={1100}
              className="rounded-3xl border border-border card-shadow"
            />
            <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-border bg-surface p-4 card-shadow sm:block">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--teal)]" />
                Health Score
              </div>
              <div className="mt-1 font-display text-3xl">92<span className="text-lg text-muted-foreground">/100</span></div>
              <div className="text-xs text-muted-foreground">Laptop · AF-0114</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">One platform</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Everything your operations touches.</h2>
          </div>
          <Link to="/features" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">
            All features →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div key={m.title} className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:card-shadow">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors group-hover:gradient-bg group-hover:text-primary-foreground">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature showcase rows */}
      <section className="mx-auto max-w-7xl space-y-24 px-6 py-20">
        <ShowcaseRow
          eyebrow="No double allocation"
          title="Conflict-aware allocation, at the point of action."
          body="When Priya already holds Laptop AF-0114, allocating it to Raj is blocked in the UI itself. AssetFlow AI then offers a one-click Transfer Request — with an approval trail and history that updates the moment it's approved."
          image={hero}
          imageAlt="Allocation flow"
          bullets={["Real-time conflict detection", "One-click Transfer Request", "Auto-updated asset history"]}
        />
        <ShowcaseRow
          eyebrow="No booking overlaps"
          title="True interval math for every shared resource."
          body="A 9:30–10:30 request against an existing 9:00–10:00 booking is rejected. A 10:00–11:00 request goes through. Rooms, vehicles, projectors, cameras — every bookable resource, per date, per resource."
          image={booking}
          imageAlt="Bookable resources"
          reverse
          bullets={["Real interval-overlap validation", "Live status per resource", "Upcoming · Ongoing · Completed"]}
        />
        <ShowcaseRow
          eyebrow="Approval-gated maintenance"
          title="From ticket to resolution, with AI in the loop."
          body="Any user can raise a ticket. A simulated AI damage inspection previews likely damage type and cost range. Only Admin, Asset Manager or Dept Head can advance the workflow — asset status auto-flips to Under Maintenance on approval."
          image={maintenance}
          imageAlt="Technician repairing a laptop"
          bullets={["Raise → Approve → Assign → Progress → Resolve", "AI-assisted damage inspection", "Health Score recovers on resolution"]}
        />
        <ShowcaseRow
          eyebrow="Audit Lock"
          title="Verify, close, and let consequences cascade."
          body="Run a cycle across a department or location, verify each asset as Verified / Missing / Damaged, then close and lock. Missing assets flip to Lost, Damaged assets are flagged Needs Repair — automatically."
          image={audit}
          imageAlt="Warehouse audit"
          reverse
          bullets={["Scope by department or location", "Live discrepancy summary", "Locked rows become read-only"]}
        />
      </section>

      {/* Trust / RBAC strip */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-border bg-surface p-10 card-shadow md:p-16">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">
            <ShieldCheck className="h-4 w-4" /> Realistic access control
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Roles that reflect how your org actually runs.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Signup only ever creates an Employee — no self-elevating admins. Every privilege change happens explicitly, in Organization Setup, by an Admin.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { r: "Admin", d: "Full control · seeded" },
              { r: "Asset Manager", d: "Registry, allocation, audit" },
              { r: "Dept Head", d: "Departmental oversight" },
              { r: "Employee", d: "Browse, book, raise tickets" },
            ].map((x) => (
              <div key={x.r} className="rounded-2xl border border-border p-5">
                <div className="font-semibold">{x.r}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-primary-foreground md:p-16">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[color:var(--teal)] opacity-40 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl">Ready to retire the spreadsheets?</h2>
            <p className="mt-4 text-lg opacity-90">See AssetFlow AI running with real conflict flows, live audit locks, and an AI Copilot that answers questions about your actual data.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-white/90">
                Request a demo
              </Link>
              <Link to="/ai" className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium hover:bg-white/10">
                Meet the AI Copilot
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ShowcaseRow({
  eyebrow,
  title,
  body,
  bullets,
  image,
  imageAlt,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <div className={`grid items-center gap-12 lg:grid-cols-2 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">{eyebrow}</div>
        <h3 className="mt-3 font-display text-3xl md:text-4xl">{title}</h3>
        <p className="mt-4 text-muted-foreground">{body}</p>
        <ul className="mt-6 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full gradient-bg" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        <img src={image} alt={imageAlt} loading="lazy" className="rounded-3xl border border-border card-shadow" />
      </div>
    </div>
  );
}
