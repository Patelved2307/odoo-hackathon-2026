import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ASSETS, ACTIVITY, BOOKINGS } from "@/data/mock";
import { Search as SearchIcon, Package, Activity, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function GlobalSearch() {
  const [q, setQ] = useState("");
  const s = q.toLowerCase();
  const assets = q ? ASSETS.filter(a => (a.name+a.tag+a.category+(a.assignee||"")).toLowerCase().includes(s)).slice(0, 8) : [];
  const events = q ? ACTIVITY.filter(a => (a.actor+a.action+a.target).toLowerCase().includes(s)).slice(0, 6) : [];
  const bookings = q ? BOOKINGS.filter(b => (b.asset+b.user+b.purpose).toLowerCase().includes(s)).slice(0, 6) : [];

  return (
    <AppLayout>
      <PageHeader title="Global Search" description="Search across assets, people, bookings and events." />
      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
        <Input value={q} onChange={e => setQ(e.target.value)} autoFocus placeholder="Type to search across your workspace…" className="h-14 pl-12 text-base" />
      </div>

      {!q && <p className="mt-8 text-sm text-[#94A3B8]">Try searching for an asset name, tag, employee or purpose.</p>}

      {q && (
        <div className="mt-6 space-y-6">
          <Section icon={Package} title={`Assets (${assets.length})`}>
            {assets.map(a => (
              <Link key={a.id} to="/assets/passport/$id" params={{ id: a.id }} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC]">
                <div><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-[#64748B]">{a.tag} · {a.category} · {a.location}</p></div>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </Section>
          <Section icon={Calendar} title={`Bookings (${bookings.length})`}>
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC]">
                <div><p className="text-sm font-medium">{b.asset}</p><p className="text-xs text-[#64748B]">{b.user} · {b.purpose}</p></div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </Section>
          <Section icon={Activity} title={`Activity (${events.length})`}>
            {events.map(e => (
              <div key={e.id} className="p-3 rounded-lg hover:bg-[#F8FAFC] text-sm">
                <span className="font-medium">{e.actor}</span> <span className="text-[#64748B]">{e.action}</span> <span className="font-medium">{e.target}</span>
                <span className="text-xs text-[#94A3B8] ml-2">· {e.when}</span>
              </div>
            ))}
          </Section>
        </div>
      )}
    </AppLayout>
  );
}
function Section({ icon: Icon, title, children }: any) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-2 px-2 mb-2"><Icon className="h-4 w-4 text-[#64748B]" /><h3 className="text-sm font-semibold">{title}</h3></div>
      <div className="divide-y divide-[#F1F5F9]">{children}</div>
    </div>
  );
}
