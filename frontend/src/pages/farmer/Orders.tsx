// PATH: src/pages/farmer/FarmerOrders.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Search, Bell, Download,
  Truck, TrendingUp, ShoppingCart, CheckCircle, XCircle, Clock, RefreshCw,
  MapPin, Calendar, User, Package, Filter, Eye, ChevronRight
} from "lucide-react";
import { farmOrderService } from "../../services/Fertilizer.service";
import type { FarmOrderResponse, FarmOrderStatus, Page } from "../../services/Fertilizer.service";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_TABS = ["All Orders", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const TAB_LABELS: Record<string, string> = {
  "All Orders": "All Orders",
  PENDING:      "Pending",
  CONFIRMED:    "Confirmed",
  SHIPPED:      "Shipped",
  DELIVERED:    "Delivered",
  CANCELLED:    "Cancelled",
};

const STATUS_CONFIG: Record<FarmOrderStatus, { color: string; icon: React.ReactNode; label: string }> = {
  PENDING:   { color: "bg-amber-50 text-amber-700 border border-amber-200",    icon: <Clock size={10} />,     label: "Pending"   },
  CONFIRMED: { color: "bg-blue-50 text-blue-700 border border-blue-200",       icon: <RefreshCw size={10} />, label: "Confirmed" },
  SHIPPED:   { color: "bg-purple-50 text-purple-700 border border-purple-200", icon: <Truck size={10} />,     label: "Shipped"   },
  DELIVERED: { color: "bg-green-50 text-green-700 border border-green-200",    icon: <CheckCircle size={10} />, label: "Delivered" },
  CANCELLED: { color: "bg-red-50 text-red-600 border border-red-200",          icon: <XCircle size={10} />,   label: "Cancelled" },
};

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-amber-500",
  "bg-green-600", "bg-cyan-500",  "bg-pink-500", "bg-indigo-500",
];

const NEXT_STATUSES: Partial<Record<FarmOrderStatus, FarmOrderStatus[]>> = {
  PENDING:   ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED",   "CANCELLED"],
  SHIPPED:   ["DELIVERED"],
};

const PER_PAGE = 10;

// ── Helper: initials from name ────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderModal({
  order, onClose, onUpdateStatus, updating,
}: {
  order: FarmOrderResponse;
  onClose: () => void;
  onUpdateStatus: (id: number, status: FarmOrderStatus) => void;
  updating: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const nextStatuses = NEXT_STATUSES[order.status] ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-extrabold text-slate-800">Order Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>

        <div className="px-6 pb-6">
          {/* Order summary card */}
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 font-mono">#{order.orderId}</span>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${cfg.color}`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">{item.productName}</span>
                  <span className="text-xs text-slate-500">{item.quantity} {item.unit} · ₹{Number(item.subtotal).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 mb-5">
            {[
              { icon: User,     label: "Consumer",  value: order.consumerName },
              { icon: MapPin,   label: "Deliver to", value: order.deliveryAddress },
              { icon: Calendar, label: "Ordered",   value: formatDate(order.orderedAt) },
              { icon: Package,  label: "Total",     value: `₹${Number(order.totalAmount).toLocaleString()}` },
            ].map(row => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Icon size={13} />
                    <span className="text-xs font-semibold">{row.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 text-right max-w-[220px]">{row.value}</span>
                </div>
              );
            })}
            {order.deliveryPhone && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 ml-5">Phone</span>
                <span className="text-sm font-bold text-slate-800">{order.deliveryPhone}</span>
              </div>
            )}
            {order.notes && (
              <div className="text-xs italic text-slate-400 bg-slate-50 rounded-lg p-2 mt-1">
                "{order.notes}"
              </div>
            )}
          </div>

          {/* Status update buttons */}
          {nextStatuses.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {nextStatuses.map(s => {
                  const c = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      disabled={updating}
                      onClick={() => onUpdateStatus(order.orderId, s)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-opacity ${c.color} ${updating ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
                    >
                      {c.icon} → {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Orders() {
  const [pageData, setPageData]     = useState<Page<FarmOrderResponse> | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab]   = useState("All Orders");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<FarmOrderResponse | null>(null);
  const [updating, setUpdating]     = useState(false);
  const [syncing, setSyncing]       = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (pg = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmOrderService.getReceivedOrders(pg, PER_PAGE);
      setPageData(data);
      setCurrentPage(pg);
    } catch (e: any) {
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(0); }, [fetchOrders]);

  const handleRefresh = async () => {
    setSyncing(true);
    await fetchOrders(currentPage);
    setSyncing(false);
  };

  // ── Status update ────────────────────────────────────────────────────────────
  const handleUpdateStatus = async (orderId: number, status: FarmOrderStatus) => {
    setUpdating(true);
    try {
      const updated = await farmOrderService.updateStatus(orderId, status);
      setPageData(prev => prev ? {
        ...prev,
        content: prev.content.map(o => o.orderId === orderId ? updated : o),
      } : prev);
      if (selected?.orderId === orderId) setSelected(updated);
    } catch (e: any) {
      alert(e.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────────
  const allOrders = pageData?.content ?? [];

  const filtered = allOrders.filter(o => {
    const matchTab = activeTab === "All Orders" || o.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      String(o.orderId).includes(q) ||
      o.consumerName?.toLowerCase().includes(q) ||
      o.deliveryAddress?.toLowerCase().includes(q) ||
      o.items.some(i => i.productName.toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  // Stats from current page data
  const totalRevenue = allOrders.reduce((s, o) => s + Number(o.totalAmount), 0);
  const stats = [
    { label: "Total Orders",  value: pageData?.totalElements ?? 0,               icon: ShoppingCart, color: "text-blue-600 bg-blue-50",   alert: false },
    { label: "Pending",       value: allOrders.filter(o => o.status === "PENDING").length,   icon: Clock,       color: "text-amber-600 bg-amber-50", alert: allOrders.some(o => o.status === "PENDING") },
    { label: "Shipped",       value: allOrders.filter(o => o.status === "SHIPPED").length,   icon: Truck,       color: "text-purple-600 bg-purple-50", alert: false },
    { label: "Delivered",     value: allOrders.filter(o => o.status === "DELIVERED").length, icon: CheckCircle, color: "text-green-600 bg-green-50", alert: false },
    { label: "Page Revenue",  value: `₹${totalRevenue.toLocaleString()}`,                    icon: TrendingUp,  color: "text-rose-600 bg-rose-50",   alert: false },
  ];

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loading && !pageData) {
    return (
      <div className="flex items-center justify-center h-96 flex-col gap-3">
        <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading orders…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Order Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {pageData
              ? `${pageData.totalElements} orders received from consumers`
              : "Track and manage orders for your farm produce."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Refreshing…" : "Refresh"}
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold flex justify-between items-center">
          <span>⚠ {error}</span>
          <button onClick={() => fetchOrders(currentPage)} className="text-red-700 font-bold hover:underline">Retry</button>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map(s => {
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
              {s.alert && <p className="text-[11px] font-semibold text-amber-600">Needs attention</p>}
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
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all relative ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600 -mb-px"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {TAB_LABELS[tab]}
                {tab !== "All Orders" && (
                  <span className={`ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                  }`}>
                    {allOrders.filter(o => o.status === tab).length}
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
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders, consumers..."
                className="bg-transparent outline-none text-sm text-slate-600 w-44 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/40">
              {["Order ID", "Consumer", "Products", "Amount", "Date", "Status", "Action"].map(h => (
                <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-sm text-slate-400 py-12">
                  {activeTab !== "All Orders" ? "No orders with this status." : "No orders received yet."}
                </td>
              </tr>
            )}

            {!loading && filtered.map((o, i) => {
              const cfg = STATUS_CONFIG[o.status];
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const hasNext = (NEXT_STATUSES[o.status] ?? []).length > 0;

              return (
                <tr key={o.orderId} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">

                  {/* Order ID */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-lg">
                      #{o.orderId}
                    </span>
                  </td>

                  {/* Consumer */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${avatarColor} text-white text-[11px] font-extrabold flex items-center justify-center shrink-0`}>
                        {initials(o.consumerName || "?")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{o.consumerName}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                          <MapPin size={9} /> {o.deliveryAddress?.slice(0, 28)}{(o.deliveryAddress?.length ?? 0) > 28 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Products */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold text-slate-800 leading-tight max-w-[180px] truncate">
                      {o.items.slice(0, 2).map(i => i.productName).join(", ")}
                      {o.items.length > 2 ? ` +${o.items.length - 2}` : ""}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-extrabold text-slate-800">₹{Number(o.totalAmount).toLocaleString()}</p>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-600 font-medium">{formatDate(o.orderedAt)}</p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(o)}
                        className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                      {/* Quick status advance */}
                      {hasNext && NEXT_STATUSES[o.status]!.filter(s => s !== "CANCELLED").map(s => (
                        <button
                          key={s}
                          disabled={updating}
                          onClick={() => handleUpdateStatus(o.orderId, s)}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-opacity ${STATUS_CONFIG[s].color} ${updating ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"}`}
                        >
                          → {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/40">
          <span className="text-xs text-slate-400 font-medium">
            Showing {filtered.length} of {pageData?.totalElements ?? 0} orders
          </span>
          <div className="flex items-center gap-2">
            {pageData && Array.from({ length: pageData.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => fetchOrders(i)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === i
                    ? "bg-green-600 text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-green-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={!pageData || currentPage >= pageData.totalPages - 1}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-400 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          updating={updating}
        />
      )}
    </div>
  );
}