import React, { useEffect, useState } from "react";
/* ---------- Types ---------- */
type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
type PaymentStatus = "Paid" | "Pending";

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderDate: number;
};

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
  iconBg: string;
};

/* ---------- Static Data ---------- */
const STATIC_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-8521",
    customerName: "Rajesh Kumar",
    amount: 4500,
    status: "Pending",
    paymentStatus: "Pending",
    orderDate: new Date("2023-10-24").getTime(),
  },
  {
    id: 2,
    orderNumber: "ORD-8520",
    customerName: "Santhini Manujayam",
    amount: 3200,
    status: "Shipped",
    paymentStatus: "Paid",
    orderDate: new Date("2023-10-23").getTime(),
  },
  {
    id: 3,
    orderNumber: "ORD-8519",
    customerName: "Amit Patel",
    amount: 5800,
    status: "Delivered",
    paymentStatus: "Paid",
    orderDate: new Date("2023-10-22").getTime(),
  },
  {
    id: 4,
    orderNumber: "ORD-8518",
    customerName: "Priya Sharma",
    amount: 2100,
    status: "Cancelled",
    paymentStatus: "Pending",
    orderDate: new Date("2023-10-21").getTime(),
  },
];

const statusBadge = {
  Pending: { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A", dot: "#F59E0B" },
  Shipped: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },
  Delivered: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  Cancelled: { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB", dot: "#9CA3AF" },
};

const paymentBadge = {
  Paid: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  Pending: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },
};

/* ---------- Icons ---------- */
const icons = {
  dashboard: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  product: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    </svg>
  ),
  orders: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
  ),
  customers: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  analytics: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  eye: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  download: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  edit: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  trash: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  sync: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  bell: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  store: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  grid: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  list: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logout: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  trendUp: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
};

/* ---------- Stat Card ---------- */
const StatCard = ({ label, value, sub, subColor = "#6B7280", icon, iconBg }: StatCardProps) => (
  <div style={{
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    flex: "1 1 180px",
    minWidth: 160,
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: subColor || "#6B7280", marginTop: 3 }}>{sub}</div>}
    </div>
  </div>
);

/* ---------- Main Component ---------- */
const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("All Status");

  useEffect(() => {
    setTimeout(() => { setOrders(STATIC_ORDERS); setLoading(false); }, 400);
  }, []);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const toggleRow = (id: number) => {
    setSelectedRows(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const filteredOrders = filterStatus === "All Status" ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #16A34A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F3F4F6", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #F9FAFB; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
        .nav-item:hover { background: rgba(22,163,74,0.08) !important; }
        .action-btn:hover { background: #F3F4F6 !important; }
        .row-hover:hover { background: #F9FAFB !important; }
        .toggle-on { background: #16A34A !important; }
        .toggle-off { background: #D1D5DB !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }
      `}</style>



      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #E5E7EB",
          padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
        }}>
          <div style={{
            flex: 1, maxWidth: 400, display: "flex", alignItems: "center", gap: 8,
            background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "7px 12px",
          }}>
            <span style={{ color: "#9CA3AF" }}>{icons.search}</span>
            <input placeholder="Search orders, customers..." style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: 13, color: "#374151", width: "100%",
            }} />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "5px 10px",
            }}>
              <span style={{ color: "#16A34A", animation: "spin 2s linear infinite", display: "inline-block" }}>{icons.sync}</span>
              <span style={{ fontSize: 11, color: "#15803D", fontWeight: 600 }}>Inventory Sync: Live</span>
            </div>
            <div style={{
              width: 32, height: 32, background: "#F9FAFB", border: "1px solid #E5E7EB",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7280",
            }}>{icons.bell}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>Order Management</h1>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3 }}>Organize and monitor customer orders</p>
            </div>

          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px", marginBottom: 20 }}>

            {/* Filters & view toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["All Status", "Pending", "Shipped", "Delivered", "Cancelled"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: filterStatus === s ? "#F0FDF4" : "#F9FAFB",
                    border: filterStatus === s ? "1px solid #BBF7D0" : "1px solid #E5E7EB",
                    borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 500,
                    color: filterStatus === s ? "#15803D" : "#6B7280", cursor: "pointer",
                  }}>
                    {s} {icons.chevronDown}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>
                <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 3, gap: 2 }}>
                  {([["list", icons.list], ["grid", icons.grid]] as [string, React.ReactNode][]).map(([mode, icon]) => (
                    <button key={mode} onClick={() => setViewMode(mode as "list" | "grid")} style={{
                      background: viewMode === mode ? "#fff" : "transparent",
                      border: "none", borderRadius: 6, padding: "5px 10px",
                      cursor: "pointer", color: viewMode === mode ? "#16A34A" : "#9CA3AF",
                      boxShadow: viewMode === mode ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                    }}>{icon}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            {viewMode === "list" && (
              <div className="fade-in" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <th style={{ width: 36, padding: "10px 12px" }}>
                        <input type="checkbox" onChange={e => {
                          if (e.target.checked) setSelectedRows(new Set(orders.map(o => o.id)));
                          else setSelectedRows(new Set());
                        }} style={{ cursor: "pointer", accentColor: "#16A34A" }} />
                      </th>
                      {["Order", "Customer", "Amount", "Date", "Status", "Payment", "Actions"].map(h => (
                        <th key={h} style={{
                          textAlign: "left", padding: "10px 12px",
                          fontSize: 11, fontWeight: 600, color: "#9CA3AF",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => {
                      const sb = statusBadge[o.status];
                      const pb = paymentBadge[o.paymentStatus];
                      return (
                        <tr key={o.id} className="row-hover" style={{
                          borderBottom: "1px solid #F9FAFB",
                          background: selectedRows.has(o.id) ? "#F0FDF4" : "transparent",
                          transition: "background 0.12s",
                        }}>
                          <td style={{ padding: "13px 12px" }}>
                            <input type="checkbox" checked={selectedRows.has(o.id)} onChange={() => toggleRow(o.id)} style={{ cursor: "pointer", accentColor: "#16A34A" }} />
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{o.orderNumber}</div>
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <div style={{ fontSize: 13, color: "#374151" }}>{o.customerName}</div>
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>₹{o.amount.toLocaleString()}</div>
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <div style={{ fontSize: 12, color: "#6B7280" }}>{formatDate(o.orderDate)}</div>
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              background: sb.bg, color: sb.color, border: `1px solid ${sb.border}`,
                              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500,
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: sb.dot, flexShrink: 0 }} />
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              background: pb.bg, color: pb.color, border: `1px solid ${pb.border}`,
                              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500,
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: pb.dot, flexShrink: 0 }} />
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: "13px 12px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="action-btn" style={{
                                width: 28, height: 28, border: "1px solid #E5E7EB", borderRadius: 7,
                                background: "#fff", cursor: "pointer", display: "flex",
                                alignItems: "center", justifyContent: "center", color: "#6B7280",
                                transition: "all 0.12s",
                              }}>{icons.eye}</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "0 4px" }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>Page 1 of 1</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1].map(n => (
                      <button key={n} style={{
                        width: 28, height: 28, borderRadius: 7, border: "1px solid #16A34A",
                        background: "#16A34A", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grid view */}
            {viewMode === "grid" && (
              <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {filteredOrders.map((o) => {
                  const sb = statusBadge[o.status];
                  const pb = paymentBadge[o.paymentStatus];
                  return (
                    <div key={o.id} style={{
                      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18,
                      transition: "box-shadow 0.15s, border-color 0.15s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#D1D5DB"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{o.orderNumber}</span>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          background: sb.bg, color: sb.color, border: `1px solid ${sb.border}`,
                          borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 500,
                        }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: sb.dot }} />
                          {o.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{o.customerName}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>₹{o.amount.toLocaleString()}</p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 14 }}>{formatDate(o.orderDate)}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          background: pb.bg, color: pb.color, border: `1px solid ${pb.border}`,
                          borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 500,
                        }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: pb.dot }} />
                          {o.paymentStatus}
                        </span>
                        <div style={{ display: "flex", gap: 5 }}>
                          {[icons.eye, icons.download].map((icon, i) => (
                            <button key={i} className="action-btn" style={{
                              width: 28, height: 28, border: "1px solid #E5E7EB", borderRadius: 7,
                              background: "#F9FAFB", cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center", color: "#6B7280",
                            }}>{icon}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <StatCard
              label="Total Orders"
              value={orders.length}
              sub="+12 this month"
              subColor="#16A34A"
              iconBg="#F0FDF4"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
            />
            <StatCard
              label="Pending Orders"
              value={orders.filter(o => o.status === "Pending").length}
              sub="Requires attention"
              subColor="#D97706"
              iconBg="#FFFBEB"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            />
            <StatCard
              label="Total Value"
              value={`₹${orders.reduce((a, o) => a + o.amount, 0).toLocaleString()}`}
              sub="Total estimated"
              iconBg="#EFF6FF"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={2}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
            />
            <StatCard
              label="Avg. Order Value"
              value={`₹${Math.round(orders.reduce((a, o) => a + o.amount, 0) / (orders.length || 1)).toLocaleString()}`}
              sub="+5% from last month"
              subColor="#16A34A"
              iconBg="#F0FDF4"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
            />
            <StatCard
              label="Delivered"
              value={orders.filter(o => o.status === "Delivered").length}
              sub="Successfully fulfilled"
              subColor="#16A34A"
              iconBg="#F0FDF4"
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderHistory;