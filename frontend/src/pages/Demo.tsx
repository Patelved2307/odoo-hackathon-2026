import { SiteLayout } from "@/components/site/Layout";
import { Mail, Phone, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";


export default function Demo() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">Demo</div>
        <h1 className="mt-2 max-w-3xl font-display text-5xl md:text-6xl">See AssetFlow AI <span className="gradient-text italic">in action.</span></h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Schedule a personalized walkthrough with our team. We'll show you how AssetFlow AI transforms asset lifecycle management with AI-powered insights.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          {[
            { icon: Mail, h: "Email", v: "hello@assetflow.ai" },
            { icon: Phone, h: "Phone", v: "+91 80 4718 2211" },
            { icon: MapPin, h: "Office", v: "Bengaluru · Karnataka, India" },
          ].map((x) => (
            <div key={x.h} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-primary-foreground">
                <x.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{x.h}</div>
                <div className="mt-1 font-medium">{x.v}</div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="font-semibold">What you'll see in the demo</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Conflict-aware allocation with a live Transfer Request</li>
              <li>· True booking overlap validation on a shared resource</li>
              <li>· Approval-gated maintenance with AI damage preview</li>
              <li>· A full Audit Cycle running through Close & Lock</li>
              <li>· The AI Copilot answering against real data</li>
              <li>· Role-based access control in action</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-3xl border border-border bg-surface p-8 card-shadow"
        >
          {sent ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-primary-foreground">✓</div>
              <h2 className="mt-4 font-display text-2xl">Demo scheduled!</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">A member of our team will reach out within one business day to confirm your walkthrough time and share login credentials.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold mb-4">Schedule your demo</h3>
              </div>
              <Field label="Full name" name="name" placeholder="Jane Doe" required />
              <Field label="Work email" name="email" type="email" placeholder="jane@company.com" required />
              <Field label="Organization" name="org" placeholder="Company or institution" required />
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">How many assets do you manage?</label>
                <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option>Under 500</option>
                  <option>500 – 2,500</option>
                  <option>2,500 – 10,000</option>
                  <option>10,000+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Preferred demo date/time</label>
                <input type="datetime-local" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">What are you most interested in?</label>
                <textarea rows={4} placeholder="Tell us about your pain points…" className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button className="w-full rounded-full gradient-bg px-6 py-3 text-sm font-medium text-primary-foreground glow-shadow transition-transform hover:-translate-y-0.5">
                Request demo
              </button>
            </div>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} required={required} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
