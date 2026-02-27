import React, { useEffect, useState, useCallback } from "react";
import { orderService, hasRole } from "../../services/Fertilizer.service";
import type { OrderResponse, OrderStatus, Page } from "../../services/Fertilizer.service";

/* ─── Badge Config ──────────────────────────────────────────────────────────── */
const statusBadge: Record<OrderStatus, { bg: string; color: string; border: string; dot: string; label: string }> = {
  PENDING:   { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A", dot: "#F59E0B",  label: "Pending"   },
  CONFIRMED: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6",  label: "Confirmed" },
  SHIPPED:   { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", dot: "#8B5CF6",  label: "Shipped"   },
  DELIVERED: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0", dot: "#22C55E",  label: "Delivered" },
  CANCELLED: { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB", dot: "#9CA3AF",  label: "Cancelled" },
};

const FILTER_OPTIONS: Array<{ label: string; value: OrderStatus | "ALL" }> = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending",    value: "PENDING" },
  { label: "Confirmed",  value: "CONFIRMED" },
  { label: "Shipped",    value: "SHIPPED" },
  { label: "Delivered",  value: "DELIVERED" },
  { label: "Cancelled",  value: "CANCELLED" },
];

/* ─── Icons ─────────────────────────────────────────────────────────────────── */
const Icon = {
  search: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  sync:   <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  list:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  grid:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  eye:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  ban:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  chevDown: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9"/></svg>,
  left:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6"/></svg>,
  right:  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>,
  refresh:<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  alert:  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  package:<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>,
  close:  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  edit:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, subColor = "#6B7280", icon, iconBg }: {
  label: string; value: string | number; sub?: string; subColor?: string;
  icon: React.ReactNode; iconBg: string;
}) => (
  <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"18px 20px", display:"flex", alignItems:"flex-start", gap:14, flex:"1 1 180px", minWidth:160 }}>
    <div style={{ width:38, height:38, borderRadius:10, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</div>
    <div>
      <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:500, marginBottom:2, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:700, color:"#111827", lineHeight:1.2 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:subColor, marginTop:3 }}>{sub}</div>}
    </div>
  </div>
);

/* ─── Status Update Dropdown (Provider only) ────────────────────────────────── */
const StatusDropdown = ({ orderId, current, onUpdate }: {
  orderId: number; current: OrderStatus; onUpdate: (id: number, status: OrderStatus) => void;
}) => {
  const [open, setOpen] = useState(false);
  const options: OrderStatus[] = ["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"];
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display:"flex", alignItems:"center", gap:4,
        background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:7,
        padding:"4px 10px", fontSize:11, fontWeight:600, color:"#15803D", cursor:"pointer",
      }}>
        Update {Icon.chevDown}
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", right:0, background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, boxShadow:"0 4px 16px rgba(0,0,0,0.1)", zIndex:100, minWidth:130, overflow:"hidden" }}>
          {options.filter(s => s !== current).map(s => {
            const sb = statusBadge[s];
            return (
              <button key={s} onClick={() => { onUpdate(orderId, s); setOpen(false); }} style={{
                display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px",
                background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#374151",
                transition:"background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <span style={{ width:7, height:7, borderRadius:"50%", background:sb.dot, flexShrink:0 }} />
                {sb.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Order Detail Modal ────────────────────────────────────────────────────── */
const OrderDetailModal = ({ order, onClose, onCancel, onUpdateStatus, cancelling, isProvider }: {
  order: OrderResponse; onClose: () => void;
  onCancel: (id: number) => void;
  onUpdateStatus: (id: number, status: OrderStatus) => void;
  cancelling: boolean;
  isProvider: boolean;
}) => {
  const sb = statusBadge[order.status];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:560, maxHeight:"90vh", overflow:"auto", boxShadow:"0 25px 50px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #F3F4F6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>Order #{order.orderId}</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>{new Date(order.orderedAt).toLocaleString("en-IN", { dateStyle:"medium", timeStyle:"short" })}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sb.bg, color:sb.color, border:`1px solid ${sb.border}`, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:sb.dot, flexShrink:0 }} />{sb.label}
            </span>
            <button onClick={onClose} style={{ width:30, height:30, border:"1px solid #E5E7EB", borderRadius:8, background:"#F9FAFB", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6B7280" }}>{Icon.close}</button>
          </div>
        </div>

        {/* Items */}
        <div style={{ padding:"20px 24px" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:12 }}>Items Ordered</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#F9FAFB", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:"#ECFDF5", display:"flex", alignItems:"center", justifyContent:"center", color:"#16A34A" }}>{Icon.package}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{item.productName}</div>
                    <div style={{ fontSize:11, color:"#9CA3AF" }}>Qty: {item.quantity} {item.unit && `× ${item.unit}`}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>₹{Number(item.subtotal).toLocaleString()}</div>
                  <div style={{ fontSize:11, color:"#9CA3AF" }}>₹{Number(item.priceAtOrder).toLocaleString()} each</div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"2px solid #F3F4F6", marginTop:16, paddingTop:14 }}>
            <span style={{ fontSize:14, fontWeight:600, color:"#374151" }}>Total Amount</span>
            <span style={{ fontSize:20, fontWeight:700, color:"#16A34A" }}>₹{Number(order.totalAmount).toLocaleString()}</span>
          </div>

          {/* Delivery Info */}
          <div style={{ marginTop:16, background:"#F9FAFB", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Delivery Details</div>
            <div style={{ fontSize:13, color:"#374151", marginBottom:4 }}>📍 {order.deliveryAddress}</div>
            {order.deliveryPhone && <div style={{ fontSize:13, color:"#374151", marginBottom:4 }}>📞 {order.deliveryPhone}</div>}
            {order.notes && <div style={{ fontSize:12, color:"#9CA3AF", marginTop:6, fontStyle:"italic" }}>"{order.notes}"</div>}
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            {/* Provider: update status */}
            {isProvider && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#6B7280", marginBottom:6 }}>UPDATE STATUS</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {(["CONFIRMED","SHIPPED","DELIVERED"] as OrderStatus[])
                    .filter(s => s !== order.status)
                    .map(s => {
                      const sb = statusBadge[s];
                      return (
                        <button key={s} onClick={() => { onUpdateStatus(order.orderId, s); onClose(); }} style={{
                          background:sb.bg, border:`1px solid ${sb.border}`, color:sb.color,
                          borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer",
                        }}>
                          → {sb.label}
                        </button>
                      );
                    })
                  }
                </div>
              </div>
            )}
            {/* Farmer: cancel PENDING */}
            {!isProvider && order.status === "PENDING" && (
              <button onClick={() => onCancel(order.orderId)} disabled={cancelling} style={{
                flex:1, padding:"10px", borderRadius:10,
                border:"1px solid #FCA5A5", background:"#FEF2F2", color:"#DC2626",
                fontSize:13, fontWeight:600, cursor:cancelling ? "not-allowed" : "pointer",
                opacity:cancelling ? 0.6 : 1,
              }}>{cancelling ? "Cancelling..." : "Cancel Order"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
const OrderHistory: React.FC = () => {
  const [page, setPage]                   = useState<Page<OrderResponse> | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [currentPage, setCurrentPage]     = useState(0);
  const [viewMode, setViewMode]           = useState<"list" | "grid">("list");
  const [filterStatus, setFilterStatus]   = useState<OrderStatus | "ALL">("ALL");
  const [selectedRows, setSelectedRows]   = useState<Set<number>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [cancelling, setCancelling]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [syncing, setSyncing]             = useState(false);

  // Determine role once at mount — drives which endpoint + which actions are shown
  const isProvider = hasRole("ROLE_PROVIDER");
  const isFarmer   = hasRole("ROLE_FARMER");

  const PAGE_SIZE = 10;

  /* ── Fetch: role-aware endpoint ── */
  const fetchOrders = useCallback(async (pg = 0) => {
    setLoading(true);
    setError(null);
    try {
      let data: Page<OrderResponse>;
      if (isProvider) {
        // Provider sees ALL orders from farmers → GET /api/fertilizer/orders
        data = await orderService.getAllOrders(pg, PAGE_SIZE);
      } else {
        // Farmer sees only their own fertilizer orders → GET /api/fertilizer/orders/my
        data = await orderService.getMyOrders(pg, PAGE_SIZE);
      }
      setPage(data);
      setCurrentPage(pg);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [isProvider]);

  useEffect(() => { fetchOrders(0); }, [fetchOrders]);

  /* ── Refresh ── */
  const handleRefresh = async () => {
    setSyncing(true);
    await fetchOrders(currentPage);
    setSyncing(false);
  };

  /* ── Cancel order (Farmer only) ── */
  const handleCancel = async (orderId: number) => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(orderId);
      setPage(prev => prev ? {
        ...prev,
        content: prev.content.map(o => o.orderId === orderId ? updated : o),
      } : prev);
      if (selectedOrder?.orderId === orderId) setSelectedOrder(updated);
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  /* ── Update status (Provider only) ── */
  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const updated = await orderService.updateStatus(orderId, status);
      setPage(prev => prev ? {
        ...prev,
        content: prev.content.map(o => o.orderId === orderId ? updated : o),
      } : prev);
      if (selectedOrder?.orderId === orderId) setSelectedOrder(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    }
  };

  /* ── Derived data ── */
  const orders = page?.content ?? [];

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchesSearch = searchQuery === "" ||
      String(o.orderId).includes(searchQuery) ||
      o.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const toggleRow = (id: number) => {
    setSelectedRows(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const totalValue     = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const pendingCount   = orders.filter(o => o.status === "PENDING").length;
  const deliveredCount = orders.filter(o => o.status === "DELIVERED").length;
  const avgOrderValue  = orders.length ? Math.round(totalValue / orders.length) : 0;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

  /* ─────────────── RENDER ─────────────── */
  if (loading && !page) return (
    <div style={{ display:"flex", height:"100vh", alignItems:"center", justifyContent:"center", background:"#F9FAFB", flexDirection:"column", gap:12 }}>
      <div style={{ width:36, height:36, border:"3px solid #16A34A", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <span style={{ fontSize:13, color:"#9CA3AF" }}>Loading orders…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#F3F4F6", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #F9FAFB; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
        .action-btn:hover { background: #F3F4F6 !important; }
        .row-hover:hover { background: #F9FAFB !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }
        .filter-btn:hover { border-color: #86EFAC !important; }
        .page-btn:hover { background: #F0FDF4 !important; border-color: #16A34A !important; color: #16A34A !important; }
      `}</style>

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Top Bar */}
        <header style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"0 24px", height:56, display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
          <div style={{ flex:1, maxWidth:400, display:"flex", alignItems:"center", gap:8, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, padding:"7px 12px" }}>
            <span style={{ color:"#9CA3AF" }}>{Icon.search}</span>
            <input
              placeholder="Search by order ID, product, address…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border:"none", background:"transparent", outline:"none", fontSize:13, color:"#374151", width:"100%" }}
            />
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14 }}>
            {/* Role badge */}
            <span style={{
              background: isProvider ? "#EFF6FF" : "#F0FDF4",
              border: `1px solid ${isProvider ? "#BFDBFE" : "#BBF7D0"}`,
              color: isProvider ? "#1D4ED8" : "#15803D",
              borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700,
            }}>
              {isProvider ? "Provider View" : isFarmer ? "Farmer View" : ""}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:8, padding:"5px 10px" }}>
              <span style={{ color:"#16A34A", animation:syncing ? "spin 1s linear infinite" : "none", display:"inline-block" }}>{Icon.sync}</span>
              <span style={{ fontSize:11, color:"#15803D", fontWeight:600 }}>{syncing ? "Syncing…" : "Live"}</span>
            </div>
            <button onClick={handleRefresh} style={{ width:32, height:32, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#6B7280" }} title="Refresh">
              {Icon.refresh}
            </button>
            <div style={{ width:32, height:32, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#6B7280" }}>{Icon.bell}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflow:"auto", padding:24 }}>

          {/* Page Header */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:24, fontWeight:700, color:"#111827" }}>
                {isProvider ? "All Customer Orders" : "My Fertilizer Orders"}
              </h1>
              <p style={{ fontSize:13, color:"#9CA3AF", marginTop:3 }}>
                {page
                  ? `${page.totalElements} total order${page.totalElements !== 1 ? "s" : ""} · Page ${currentPage + 1} of ${page.totalPages}`
                  : "Loading…"}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"12px 16px", marginBottom:20, color:"#DC2626" }}>
              <span style={{ flexShrink:0 }}>{Icon.alert}</span>
              <span style={{ fontSize:13, fontWeight:500 }}>{error}</span>
              <button onClick={() => fetchOrders(currentPage)} style={{ marginLeft:"auto", fontSize:12, color:"#DC2626", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Retry</button>
            </div>
          )}

          {/* Orders Card */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E7EB", padding:20, marginBottom:20 }}>

            {/* Filters + View Toggle */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, gap:12, flexWrap:"wrap" }}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {FILTER_OPTIONS.map(({ label, value }) => (
                  <button key={value} className="filter-btn" onClick={() => setFilterStatus(value)} style={{
                    display:"flex", alignItems:"center", gap:5,
                    background: filterStatus === value ? "#F0FDF4" : "#F9FAFB",
                    border: filterStatus === value ? "1px solid #86EFAC" : "1px solid #E5E7EB",
                    borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:500,
                    color: filterStatus === value ? "#15803D" : "#6B7280",
                    cursor:"pointer", transition:"all 0.15s",
                  }}>
                    {value !== "ALL" && (
                      <span style={{ width:6, height:6, borderRadius:"50%", background:statusBadge[value as OrderStatus].dot, flexShrink:0 }} />
                    )}
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12, color:"#9CA3AF" }}>Showing {filteredOrders.length} of {orders.length}</span>
                <div style={{ display:"flex", background:"#F3F4F6", borderRadius:8, padding:3, gap:2 }}>
                  {(["list","grid"] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)} style={{
                      background: viewMode === mode ? "#fff" : "transparent",
                      border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer",
                      color: viewMode === mode ? "#16A34A" : "#9CA3AF",
                      boxShadow: viewMode === mode ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                    }}>
                      {mode === "list" ? Icon.list : Icon.grid}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty state */}
            {filteredOrders.length === 0 && !loading && (
              <div style={{ textAlign:"center", padding:"48px 0", color:"#9CA3AF" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <div style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:6 }}>No orders found</div>
                <div style={{ fontSize:13 }}>{filterStatus !== "ALL" ? "Try changing the filter" : isProvider ? "No orders from farmers yet" : "You haven't placed any orders yet"}</div>
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && filteredOrders.length > 0 && (
              <div className="fade-in" style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid #F3F4F6" }}>
                      <th style={{ width:36, padding:"10px 12px" }}>
                        <input type="checkbox" onChange={e => setSelectedRows(e.target.checked ? new Set(orders.map(o => o.orderId)) : new Set())} style={{ cursor:"pointer", accentColor:"#16A34A" }} />
                      </th>
                      {["Order ID","Items","Amount","Date","Status","Actions"].map(h => (
                        <th key={h} style={{ textAlign:"left", padding:"10px 12px", fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => {
                      const sb = statusBadge[o.status];
                      return (
                        <tr key={o.orderId} className="row-hover" style={{
                          borderBottom:"1px solid #F9FAFB",
                          background: selectedRows.has(o.orderId) ? "#F0FDF4" : "transparent",
                        }}>
                          <td style={{ padding:"13px 12px" }}>
                            <input type="checkbox" checked={selectedRows.has(o.orderId)} onChange={() => toggleRow(o.orderId)} style={{ cursor:"pointer", accentColor:"#16A34A" }} />
                          </td>
                          <td style={{ padding:"13px 12px" }}>
                            <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>#{o.orderId}</div>
                            <div style={{ fontSize:11, color:"#9CA3AF" }}>{o.deliveryAddress?.slice(0,28)}{(o.deliveryAddress?.length ?? 0) > 28 ? "…" : ""}</div>
                          </td>
                          <td style={{ padding:"13px 12px" }}>
                            <div style={{ fontSize:12, color:"#374151" }}>
                              {o.items.slice(0,2).map(i => i.productName).join(", ")}
                              {o.items.length > 2 ? ` +${o.items.length - 2} more` : ""}
                            </div>
                            <div style={{ fontSize:11, color:"#9CA3AF" }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</div>
                          </td>
                          <td style={{ padding:"13px 12px" }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>₹{Number(o.totalAmount).toLocaleString()}</div>
                          </td>
                          <td style={{ padding:"13px 12px" }}>
                            <div style={{ fontSize:12, color:"#6B7280" }}>{formatDate(o.orderedAt)}</div>
                          </td>
                          <td style={{ padding:"13px 12px" }}>
                            <span style={{
                              display:"inline-flex", alignItems:"center", gap:5,
                              background:sb.bg, color:sb.color, border:`1px solid ${sb.border}`,
                              borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:500,
                            }}>
                              <span style={{ width:5, height:5, borderRadius:"50%", background:sb.dot, flexShrink:0 }} />
                              {sb.label}
                            </span>
                          </td>
                          <td style={{ padding:"13px 12px" }}>
                            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                              <button className="action-btn" onClick={() => setSelectedOrder(o)} title="View details" style={{
                                width:28, height:28, border:"1px solid #E5E7EB", borderRadius:7,
                                background:"#fff", cursor:"pointer", display:"flex",
                                alignItems:"center", justifyContent:"center", color:"#6B7280",
                              }}>{Icon.eye}</button>
                              {/* Provider: inline status updater */}
                              {isProvider && o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                                <StatusDropdown orderId={o.orderId} current={o.status} onUpdate={handleUpdateStatus} />
                              )}
                              {/* Farmer: cancel if PENDING */}
                              {isFarmer && o.status === "PENDING" && (
                                <button className="action-btn" onClick={() => handleCancel(o.orderId)} title="Cancel order" style={{
                                  width:28, height:28, border:"1px solid #FECACA", borderRadius:7,
                                  background:"#FEF2F2", cursor:"pointer", display:"flex",
                                  alignItems:"center", justifyContent:"center", color:"#DC2626",
                                }}>{Icon.ban}</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {page && page.totalPages > 1 && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:16, padding:"0 4px" }}>
                    <span style={{ fontSize:12, color:"#9CA3AF" }}>Page {currentPage + 1} of {page.totalPages}</span>
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={() => fetchOrders(currentPage - 1)} disabled={currentPage === 0} style={{
                        width:28, height:28, borderRadius:7, border:"1px solid #E5E7EB",
                        background:"#F9FAFB", color:"#6B7280", cursor:currentPage === 0 ? "not-allowed" : "pointer",
                        opacity:currentPage === 0 ? 0.4 : 1, display:"flex", alignItems:"center", justifyContent:"center",
                      }}>{Icon.left}</button>
                      {Array.from({ length: page.totalPages }, (_, i) => (
                        <button key={i} onClick={() => fetchOrders(i)} style={{
                          width:28, height:28, borderRadius:7,
                          border: i === currentPage ? "1px solid #16A34A" : "1px solid #E5E7EB",
                          background: i === currentPage ? "#16A34A" : "#F9FAFB",
                          color: i === currentPage ? "#fff" : "#6B7280",
                          fontSize:12, fontWeight:600, cursor:"pointer",
                        }}>{i + 1}</button>
                      ))}
                      <button onClick={() => fetchOrders(currentPage + 1)} disabled={currentPage >= page.totalPages - 1} style={{
                        width:28, height:28, borderRadius:7, border:"1px solid #E5E7EB",
                        background:"#F9FAFB", color:"#6B7280", cursor:currentPage >= page.totalPages - 1 ? "not-allowed" : "pointer",
                        opacity:currentPage >= page.totalPages - 1 ? 0.4 : 1, display:"flex", alignItems:"center", justifyContent:"center",
                      }}>{Icon.right}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GRID VIEW */}
            {viewMode === "grid" && filteredOrders.length > 0 && (
              <div className="fade-in" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:16 }}>
                {filteredOrders.map(o => {
                  const sb = statusBadge[o.status];
                  return (
                    <div key={o.orderId}
                      style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:18, cursor:"pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; }}
                      onClick={() => setSelectedOrder(o)}
                    >
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>#{o.orderId}</span>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:sb.bg, color:sb.color, border:`1px solid ${sb.border}`, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:500 }}>
                          <span style={{ width:4, height:4, borderRadius:"50%", background:sb.dot }} />{sb.label}
                        </span>
                      </div>
                      <p style={{ fontSize:12, color:"#6B7280", marginBottom:8 }}>
                        {o.items.slice(0,2).map(i => i.productName).join(", ")}
                        {o.items.length > 2 ? ` +${o.items.length - 2}` : ""}
                      </p>
                      <p style={{ fontSize:22, fontWeight:700, color:"#111827", marginBottom:4 }}>₹{Number(o.totalAmount).toLocaleString()}</p>
                      <p style={{ fontSize:11, color:"#9CA3AF", marginBottom:14 }}>{formatDate(o.orderedAt)} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                      {isFarmer && o.status === "PENDING" && (
                        <button onClick={e => { e.stopPropagation(); handleCancel(o.orderId); }} style={{
                          width:"100%", padding:"6px", borderRadius:8, border:"1px solid #FECACA",
                          background:"#FEF2F2", color:"#DC2626", fontSize:11, fontWeight:600, cursor:"pointer",
                        }}>Cancel Order</button>
                      )}
                      {isProvider && o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }} onClick={e => e.stopPropagation()}>
                          {(["CONFIRMED","SHIPPED","DELIVERED"] as OrderStatus[]).filter(s => s !== o.status).map(s => (
                            <button key={s} onClick={() => handleUpdateStatus(o.orderId, s)} style={{
                              flex:1, padding:"5px", borderRadius:7, border:`1px solid ${statusBadge[s].border}`,
                              background:statusBadge[s].bg, color:statusBadge[s].color, fontSize:10, fontWeight:600, cursor:"pointer",
                            }}>→ {statusBadge[s].label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stat Cards */}
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <StatCard label="Total Orders" value={page?.totalElements ?? 0} sub={`${orders.length} on this page`} subColor="#16A34A" iconBg="#F0FDF4"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
            />
            <StatCard label="Pending" value={pendingCount} sub="Awaiting action" subColor="#D97706" iconBg="#FFFBEB"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            />
            <StatCard label="Page Value" value={`₹${totalValue.toLocaleString()}`} sub="Sum of this page" iconBg="#EFF6FF"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={2}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
            />
            <StatCard label="Avg. Order" value={`₹${avgOrderValue.toLocaleString()}`} sub="This page average" subColor="#16A34A" iconBg="#F0FDF4"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
            />
            <StatCard label="Delivered" value={deliveredCount} sub="Successfully fulfilled" subColor="#16A34A" iconBg="#F0FDF4"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>}
            />
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={handleCancel}
          onUpdateStatus={handleUpdateStatus}
          cancelling={cancelling}
          isProvider={isProvider}
        />
      )}
    </div>
  );
};

export default OrderHistory;