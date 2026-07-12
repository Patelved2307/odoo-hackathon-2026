import { SiteLayout } from "@/components/site/Layout";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";


export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--violet)]">Contact</div>
        <h1 className="mt-2 max-w-3xl font-display text-5xl md:text-6xl">Let's see it running <span className="gradient-text italic">on your assets.</span></h1>
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
              <h2 className="mt-4 font-display text-2xl">Thanks — we'll be in touch.</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">A member of our team will reach out within one business day to schedule your walkthrough.</p>
            </div>
          ) : (
            <div className="space-y-5">
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
                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">What are you trying to fix?</label>
                <textarea rows={4} placeholder="Tell us about your current workflow…" className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button className="w-full rounded-full gradient-bg px-6 py-3 text-sm font-medium text-primary-foreground glow-shadow transition-transform hover:-translate-y-0.5">
                Request a demo
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
