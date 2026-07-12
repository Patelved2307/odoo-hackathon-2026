export type AssetStatus = "Available" | "Allocated" | "Reserved" | "Maintenance" | "Lost" | "Retired" | "Disposed";

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  serial: string;
  status: AssetStatus;
  location: string;
  department: string;
  assignee?: string;
  value: number;
  purchaseDate: string;
  warrantyUntil: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  vendor: string;
}

const CATEGORIES = ["Laptop", "Monitor", "Phone", "Vehicle", "Furniture", "Server", "Camera", "Projector", "Tablet", "Printer"];
const DEPTS = ["Engineering", "Design", "Sales", "Marketing", "HR", "Finance", "Operations", "IT"];
const LOCATIONS = ["HQ · Floor 3", "HQ · Floor 5", "Warehouse A", "Branch · Berlin", "Branch · Singapore", "Remote"];
const STATUSES: AssetStatus[] = ["Available", "Allocated", "Reserved", "Maintenance", "Lost", "Retired"];
const NAMES = ["Sarah Chen", "Marcus Reed", "Priya Shah", "Diego Lopez", "Amara Okafor", "Yuki Tanaka", "Liam Walsh", "Noor Farah", "Elena Rossi", "Kwame Boateng"];
const VENDORS = ["Apple", "Dell", "HP", "Lenovo", "Samsung", "Cisco", "Logitech"];

function seed(i: number, arr: unknown[]) { return arr[i % arr.length]; }

export const ASSETS: Asset[] = Array.from({ length: 84 }).map((_, i) => {
  const cat = seed(i, CATEGORIES) as string;
  const status = seed(i * 3, STATUSES) as AssetStatus;
  return {
    id: `A${1000 + i}`,
    tag: `AF-${(1000 + i).toString()}`,
    name: `${cat} ${["Pro", "Air", "X1", "Elite", "Studio", "Max"][i % 6]} ${(i % 5) + 1}`,
    category: cat,
    serial: `SN${Math.floor(100000 + i * 7919).toString().slice(0, 8)}`,
    status,
    location: seed(i * 2, LOCATIONS) as string,
    department: seed(i, DEPTS) as string,
    assignee: status === "Allocated" ? (seed(i, NAMES) as string) : undefined,
    value: 400 + ((i * 137) % 4200),
    purchaseDate: `202${(i % 4) + 1}-0${(i % 9) + 1}-1${i % 9}`,
    warrantyUntil: `202${(i % 3) + 5}-0${(i % 9) + 1}-1${i % 9}`,
    condition: (["Excellent", "Good", "Fair", "Poor"] as const)[i % 4],
    vendor: seed(i, VENDORS) as string,
  };
});

export interface Booking {
  id: string;
  asset: string;
  user: string;
  from: string;
  to: string;
  purpose: string;
  status: "Approved" | "Pending" | "Rejected" | "Completed";
}
export const BOOKINGS: Booking[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `B${200 + i}`,
  asset: ASSETS[i * 2 % ASSETS.length].name,
  user: NAMES[i % NAMES.length],
  from: `2026-07-${(i % 27) + 1}`,
  to: `2026-07-${(i % 27) + 3}`,
  purpose: ["Client demo", "Field visit", "Workshop", "Training", "Off-site"][i % 5],
  status: (["Approved", "Pending", "Rejected", "Completed"] as const)[i % 4],
}));

export interface MaintenanceTicket {
  id: string;
  asset: string;
  issue: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Awaiting Parts" | "Resolved";
  technician: string;
  opened: string;
  eta: string;
}
export const TICKETS: MaintenanceTicket[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `T${300 + i}`,
  asset: ASSETS[(i * 5) % ASSETS.length].name,
  issue: ["Screen flicker", "Battery drain", "Fan noise", "Overheating", "Won't power on", "Cracked chassis"][i % 6],
  priority: (["Low", "Medium", "High", "Critical"] as const)[i % 4],
  status: (["Open", "In Progress", "Awaiting Parts", "Resolved"] as const)[i % 4],
  technician: NAMES[(i + 3) % NAMES.length],
  opened: `2026-06-${(i % 28) + 1}`,
  eta: `2026-07-${(i % 20) + 5}`,
}));

export interface Allocation {
  id: string;
  asset: string;
  from?: string;
  to: string;
  date: string;
  status: "Active" | "Transferred" | "Returned";
  approver: string;
}
export const ALLOCATIONS: Allocation[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `AL${500 + i}`,
  asset: ASSETS[(i * 3) % ASSETS.length].name,
  from: i % 3 === 0 ? undefined : NAMES[i % NAMES.length],
  to: NAMES[(i + 2) % NAMES.length],
  date: `2026-0${(i % 6) + 1}-1${i % 9}`,
  status: (["Active", "Transferred", "Returned"] as const)[i % 3],
  approver: NAMES[(i + 5) % NAMES.length],
}));

export interface AuditRecord {
  id: string;
  cycle: string;
  scope: string;
  assets: number;
  verified: number;
  discrepancies: number;
  status: "Planned" | "In Progress" | "Completed";
  lead: string;
  date: string;
}
export const AUDITS: AuditRecord[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `AU${700 + i}`,
  cycle: `Q${(i % 4) + 1} 2026`,
  scope: ["Full inventory", "IT equipment", "Vehicles", "Furniture", "Field devices"][i % 5],
  assets: 40 + i * 12,
  verified: 30 + i * 10,
  discrepancies: i % 3,
  status: (["Planned", "In Progress", "Completed"] as const)[i % 3],
  lead: NAMES[i % NAMES.length],
  date: `2026-0${(i % 9) + 1}-15`,
}));

export interface ActivityEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  when: string;
}
export const ACTIVITY: ActivityEvent[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `E${900 + i}`,
  actor: NAMES[i % NAMES.length],
  action: ["allocated", "returned", "opened ticket for", "audited", "reserved", "updated", "retired"][i % 7],
  target: ASSETS[i % ASSETS.length].name,
  when: `${(i % 12) + 1}h ago`,
}));

export interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  body: string;
  when: string;
  unread: boolean;
}
export const NOTIFICATIONS: Notification[] = [
  { id: "N1", type: "warning", title: "5 assets due for maintenance", body: "Preventive checks scheduled this week.", when: "12m ago", unread: true },
  { id: "N2", type: "success", title: "Q2 audit completed", body: "0 discrepancies flagged across IT equipment.", when: "2h ago", unread: true },
  { id: "N3", type: "info", title: "New booking request", body: "Marcus Reed requested Camera Pro 2 for Jul 15–17.", when: "3h ago", unread: true },
  { id: "N4", type: "error", title: "Asset flagged Lost", body: "Laptop Air 3 (AF-1024) reported missing.", when: "1d ago", unread: false },
  { id: "N5", type: "info", title: "Warranty expiring", body: "12 assets have warranty expiring next 30 days.", when: "2d ago", unread: false },
];

export const KPI = {
  totalAssets: ASSETS.length,
  allocated: ASSETS.filter(a => a.status === "Allocated").length,
  available: ASSETS.filter(a => a.status === "Available").length,
  maintenance: ASSETS.filter(a => a.status === "Maintenance").length,
  totalValue: ASSETS.reduce((s, a) => s + a.value, 0),
  utilization: 78,
};

export const CATEGORY_LIST = CATEGORIES;
export const DEPT_LIST = DEPTS;
export const LOCATION_LIST = LOCATIONS;
export const NAME_LIST = NAMES;
