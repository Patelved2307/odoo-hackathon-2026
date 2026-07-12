import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, PlusSquare, Wrench, Sparkles, ClipboardCheck, Calendar, ArrowLeftRight, Bell, Settings, Brain, BarChart3 } from "lucide-react";
import { ASSETS } from "@/data/mock";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const go = (to: any) => { onOpenChange(false); navigate({ to }); };
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/assets")}><Package className="h-4 w-4 mr-2" />Asset Directory</CommandItem>
          <CommandItem onSelect={() => go("/assets/register")}><PlusSquare className="h-4 w-4 mr-2" />Register Asset</CommandItem>
          <CommandItem onSelect={() => go("/allocations")}><ArrowLeftRight className="h-4 w-4 mr-2" />Allocations</CommandItem>
          <CommandItem onSelect={() => go("/bookings")}><Calendar className="h-4 w-4 mr-2" />Bookings</CommandItem>
          <CommandItem onSelect={() => go("/maintenance")}><Wrench className="h-4 w-4 mr-2" />Maintenance</CommandItem>
          <CommandItem onSelect={() => go("/audit")}><ClipboardCheck className="h-4 w-4 mr-2" />Audits</CommandItem>
          <CommandItem onSelect={() => go("/reports")}><BarChart3 className="h-4 w-4 mr-2" />Reports</CommandItem>
          <CommandItem onSelect={() => go("/copilot")}><Sparkles className="h-4 w-4 mr-2" />AI Copilot</CommandItem>
          <CommandItem onSelect={() => go("/insights")}><Brain className="h-4 w-4 mr-2" />AI Insights</CommandItem>
          <CommandItem onSelect={() => go("/notifications")}><Bell className="h-4 w-4 mr-2" />Notifications</CommandItem>
          <CommandItem onSelect={() => go("/settings")}><Settings className="h-4 w-4 mr-2" />Settings</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Assets">
          {ASSETS.slice(0, 6).map(a => (
            <CommandItem key={a.id} onSelect={() => go({ to: "/assets/passport/$id", params: { id: a.id } } as any)}>
              <Package className="h-4 w-4 mr-2" />{a.tag} · {a.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
