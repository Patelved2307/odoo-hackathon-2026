import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ASSETS as INITIAL_ASSETS, type Asset, type AssetStatus, CATEGORY_LIST } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Download, Plus, Filter, MoreHorizontal, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { downloadCsv } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_LIST: (AssetStatus | "All")[] = ["All", "Available", "Allocated", "Reserved", "Maintenance", "Lost", "Retired"];

export default function AssetDirectory() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [cat, setCat] = useState<string>("All");
  const [status, setStatus] = useState<AssetStatus | "All">("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = assets
    .filter(a => cat === "All" || a.category === cat)
    .filter(a => status === "All" || a.status === status);

  const setAssetStatus = (id: string, next: AssetStatus, label: string) => {
    setAssets(list => list.map(a => a.id === id ? { ...a, status: next, assignee: next === "Allocated" ? a.assignee : undefined } : a));
    toast.success(label);
  };

  const columns: ColumnDef<Asset>[] = [
    { header: "Tag", accessorKey: "tag", cell: ({ row }) => <span className="font-mono text-xs text-[#64748B]">{row.original.tag}</span> },
    { header: "Asset", accessorKey: "name", cell: ({ row }) => (
      <Link to="/assets/passport/$id" params={{ id: row.original.id }} className="font-medium text-[#0F172A] hover:text-[#2563EB]">{row.original.name}</Link>
    )},
    { header: "Category", accessorKey: "category" },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Assignee", accessorKey: "assignee", cell: ({ row }) => row.original.assignee ?? <span className="text-[#94A3B8]">—</span> },
    { header: "Department", accessorKey: "department" },
    { header: "Location", accessorKey: "location" },
    { header: "Value", accessorKey: "value", cell: ({ row }) => <span className="tabular-nums">${row.original.value.toLocaleString()}</span> },
    { id: "actions", header: "", cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate({ to: "/assets/passport/$id", params: { id: row.original.id } })}><Eye className="h-4 w-4 mr-2" />View passport</DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.original.status === "Allocated"}
            onClick={() => navigate({ to: "/allocations" })}
          >
            Allocate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { navigate({ to: "/maintenance" }); }}>Schedule maintenance</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setAssetStatus(row.original.id, "Retired", `${row.original.name} retired`)}
          >
            Retire
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  const exportCsv = () => {
    downloadCsv("asset-directory", filtered.map(a => ({
      tag: a.tag, name: a.name, category: a.category, status: a.status,
      assignee: a.assignee ?? "", department: a.department, location: a.location, value: a.value,
    })));
    toast.success(`Exported ${filtered.length} assets`);
  };

  return (
    <AppLayout>
      <PermissionGate perm="assets.directory">
        <PageHeader
          title="Asset Directory"
          description="Search, filter, and manage every asset across your organization."
          actions={
            <>
              <Button variant="outline" className="gap-2" onClick={exportCsv}><Download className="h-4 w-4" />Export CSV</Button>
              <Button onClick={() => navigate({ to: "/assets/register" })} className="gap-2 bg-[#2563EB] hover:bg-[#1d4fd8]"><Plus className="h-4 w-4" />Register</Button>
            </>
          }
        />
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", ...CATEGORY_LIST].map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 h-8 rounded-full text-xs font-medium border transition-colors ${cat === c ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]"}`}>
              {c}
            </button>
          ))}
        </div>
        <DataTable
          data={filtered}
          columns={columns}
          searchPlaceholder="Search by name, tag, serial, assignee…"
          toolbar={
            <DropdownMenu open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Filter className="h-4 w-4" />
                  {status === "All" ? "Filters" : `Status: ${status}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {STATUS_LIST.map(s => (
                  <DropdownMenuItem key={s} onClick={() => setStatus(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          }
          pageSize={12}
        />
      </PermissionGate>
    </AppLayout>
  );
}