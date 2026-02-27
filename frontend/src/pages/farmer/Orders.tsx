import { useState } from "react";
import {
  Search, Bell, Download,
  Truck, TrendingUp, ShoppingCart, CheckCircle, XCircle, Clock, RefreshCw,
  MapPin, Calendar, User, Package, Filter, Eye, ChevronRight
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const STATUS_TABS = ["All Orders", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const ORDERS = [
  {
    id: "ORD-2025-001", buyer: "Ramesh Kumar", location: "Ludhiana, Punjab",
    product: "Hybrid Wheat Seeds (HD-2967)", category: "Seeds",
    qty: 50, unit: "kg", amount: 12250, date: "27 Feb 2025",
    status: "Delivered", avatar: "RK", emoji: "🌾",
  },
  {
    id: "ORD-2025-002", buyer: "Sukhvinder Singh", location: "Amritsar, Punjab",
    product: "NPK Fertilizer 19-19-19", category: "Fertilizers",
    qty: 10, unit: "bags", amount: 12000, date: "26 Feb 2025",
    status: "Shipped", avatar: "SS", emoji: "🧪",
  },
  {
    id: "ORD-2025-003", buyer: "Meena Devi", location: "Patiala, Punjab",
    product: "Urea (46% Nitrogen)", category: "Fertilizers",
    qty: 20, unit: "bags", amount: 5340, date: "26 Feb 2025",
    status: "Processing", avatar: "MD",  emoji: "🌿",
  },
  {
    id: "ORD-2025-004", buyer: "Harpreet Kaur", location: "Jalandhar, Punjab",
    product: "Paddy Seeds (Pusa Basmati)", category: "Seeds",
    qty: 100, unit: "kg", amount: 18000, date: "25 Feb 2025",
    status: "Pending", avatar: "HK", emoji: "🌾",
  },
  {
    id: "ORD-2025-005", buyer: "Gurpreet Singh", location: "Bathinda, Punjab",
    product: "Vermicompost (Organic)", category: "Organic",
    qty: 200, unit: "kg", amount: 2400, date: "25 Feb 2025",
    status: "Cancelled", avatar: "GS", emoji: "🍂",
  },
  {
    id: "ORD-2025-006", buyer: "Balwinder Pal", location: "Ferozepur, Punjab",
    product: "Drip Irrigation Kit (1 acre)", category: "Equipment",
    qty: 2, unit: "kits", amount: 17000, date: "24 Feb 2025",
    status: "Delivered", avatar: "BP", emoji: "💧",
  },
];

const STATS = [
  { label: "Total Orders",  value: "1,284", change: "+24 today",        icon: ShoppingCart, color: "text-blue-600 bg-blue-50",   alert: false },
  { label: "Pending",       value: "38",    change: "Needs attention",   icon: Clock,        color: "text-amber-600 bg-amber-50", alert: true  },
  { label: "In Transit",    value: "142",   change: "Out for delivery",  icon: Truck,        color: "text-purple-600 bg-purple-50", alert: false },
  { label: "Delivered",     value: "1,089", change: "+8.2% this month",  icon: CheckCircle,  color: "text-green-600 bg-green-50", alert: false },
  { label: "Total Revenue", value: "₹4.2L", change: "+12.5% this month", icon: TrendingUp,   color: "text-rose-600 bg-rose-50",   alert: false },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  Pending:    { color: "bg-amber-50 text-amber-700 border border-amber-200",    icon: <Clock size={10} /> },
  Processing: { color: "bg-blue-50 text-blue-700 border border-blue-200",       icon: <RefreshCw size={10} /> },
  Shipped:    { color: "bg-purple-50 text-purple-700 border border-purple-200", icon: <Truck size={10} /> },
  Delivered:  { color: "bg-green-50 text-green-700 border border-green-200",    icon: <CheckCircle size={10} /> },
  Cancelled:  { color: "bg-red-50 text-red-600 border border-red-200",          icon: <XCircle size={10} /> },
};

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-amber-500",
  "bg-green-600", "bg-cyan-500",  "bg-pink-500", "bg-indigo-500",
];

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderModal({ order, onClose }: { order: typeof ORDERS[0]; onClose: () => void }) {
  const cfg = STATUS_CONFIG[order.status];
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-800">Order Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 font-mono">{order.id}</span>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${cfg.color}`}>
              {cfg.icon} {order.status}
            </span>
          </div>
          <p className="font-extrabold text-slate-800 text-base mb-0.5">{order.product}</p>
          <p className="text-xs text-slate-400">{order.category} · {order.qty} {order.unit}</p>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          {[
            { icon: User,     label: "Buyer",    value: order.buyer },
            { icon: MapPin,   label: "Location", value: order.location },
            { icon: Calendar, label: "Date",     value: order.date },
            { icon: Package,  label: "Amount",   value: `₹${order.amount.toLocaleString()}` },
          ].map(row => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Icon size={13}/>
                  <span className="text-xs font-semibold">{row.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{row.value}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState<typeof ORDERS[0] | null>(null);

  const PER_PAGE = 6;

  const filtered = ORDERS.filter(o => {
    if (activeTab !== "All Orders" && o.status !== activeTab) return false;
    if (search && (
      !o.buyer.toLowerCase().includes(search.toLowerCase()) &&
      !o.product.toLowerCase().includes(search.toLowerCase()) &&
      !o.id.toLowerCase().includes(search.toLowerCase())
    )) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Order Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track and manage all your agricultural product orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-5 gap-4">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white border rounded-2xl p-4 shadow-sm ${s.alert ? "border-amber-200" : "border-slate-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon size={13} />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-800 mb-0.5">{s.value}</p>
              <p className={`text-[11px] font-semibold ${s.alert ? "text-amber-600" : "text-slate-400"}`}>{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">

        {/* Tabs + Search */}
        <div className="flex items-center justify-between px-5 pt-4 border-b border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all relative ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600 -mb-px"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
                {tab !== "All Orders" && (
                  <span className={`ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                  }`}>
                    {ORDERS.filter(o => o.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pb-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
              <Search size={13} className="text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search orders, buyers..."
                className="bg-transparent outline-none text-sm text-slate-600 w-44 placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors">
              <Filter size={13} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/40">
              {["Order ID", "Buyer", "Product", "Qty & Amount", "Date", "Status", "Action"].map(h => (
                <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-sm text-slate-400 py-12">No orders found.</td>
              </tr>
            ) : (
              paginated.map((o, i) => {
                const cfg = STATUS_CONFIG[o.status];
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <tr key={o.id} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">

                    {/* Order ID */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-lg">{o.id}</span>
                    </td>

                    {/* Buyer */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${avatarColor} text-white text-[11px] font-extrabold flex items-center justify-center shrink-0`}>
                          {o.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{o.buyer}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                            <MapPin size={9} /> {o.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{o.emoji}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight max-w-[160px] truncate">{o.product}</p>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{o.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Qty & Amount */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-extrabold text-slate-800">₹{o.amount.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{o.qty} {o.unit}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-slate-600 font-medium">{o.date}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${cfg.color}`}>
                        {cfg.icon} {o.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelected(o)}
                        className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/40">
          <span className="text-xs text-slate-400 font-medium">
            Showing {paginated.length} of {filtered.length} orders
          </span>
          <div className="flex items-center gap-2">
            {[...Array(Math.max(totalPages, 1))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  page === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-green-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-400 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}