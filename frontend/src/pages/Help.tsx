import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Video, LifeBuoy, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const FAQS = [
  { q: "How do I register a new asset?", a: "Navigate to Assets → Register and fill in the required fields. Categorization and location help AI suggestions." },
  { q: "Who can approve allocation transfers?", a: "Department Heads and Admins can approve. Employees can request but not approve." },
  { q: "How does predictive maintenance work?", a: "The AI analyzes usage patterns, age, and telemetry to predict failure probability within a 30-day window." },
  { q: "Can I export reports as PDF?", a: "Yes. On any report page, click Export. Formats supported: PDF, CSV, and XLSX." },
  { q: "What roles are available?", a: "Admin, Asset Manager, Department Head, Employee, Auditor and Technician. Permissions vary per role." },
];

const TILES = [
  [BookOpen, "Documentation", "Guides & API"],
  [Video, "Tutorials", "Video walkthroughs"],
  [MessageCircle, "Community", "Ask & answer"],
  [LifeBuoy, "Contact support", "Human help 24/7"],
] as const;

export default function Help() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const filtered = q ? FAQS.filter(f => (f.q + f.a).toLowerCase().includes(q.toLowerCase())) : FAQS;

  const openTile = (title: string) => {
    if (title === "Contact support") { navigate({ to: "/contact" }); return; }
    toast.info(title, { description: "This section isn't part of the demo yet — reach out via Contact support." });
  };

  return (
    <AppLayout>
      <PageHeader title="Help & Support" description="Guides, docs, and human help — all in one place." />
      <div className="card-surface p-8 bg-gradient-to-br from-blue-50 via-white to-violet-50 mb-6">
        <h2 className="text-xl font-semibold">How can we help you today?</h2>
        <div className="relative max-w-xl mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search help articles…" className="h-12 pl-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {TILES.map(([Icon, title, sub]) => (
          <button key={title} onClick={() => openTile(title)} className="card-surface p-5 hover:shadow-[var(--shadow-hover)] transition-shadow cursor-pointer text-left">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center"><Icon className="h-5 w-5" /></div>
            <p className="mt-3 text-sm font-semibold">{title}</p>
            <p className="text-xs text-[#64748B]">{sub}</p>
          </button>
        ))}
      </div>

      <div className="card-surface p-6">
        <h3 className="text-sm font-semibold mb-3">Frequently asked</h3>
        <div className="divide-y divide-[#F1F5F9]">
          {filtered.map(f => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer text-sm font-medium text-[#0F172A] flex items-center justify-between list-none">
                {f.q}<span className="text-[#94A3B8] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-[#64748B]">{f.a}</p>
            </details>
          ))}
          {filtered.length === 0 && <p className="py-3 text-sm text-[#94A3B8]">No articles match "{q}".</p>}
        </div>
        <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-sm text-[#64748B]">Still need help?</p>
          <Button className="bg-[#2563EB] hover:bg-[#1d4fd8]" onClick={() => navigate({ to: "/contact" })}>Contact support</Button>
        </div>
      </div>
    </AppLayout>
  );
}