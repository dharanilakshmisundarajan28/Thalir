import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiShoppingCart,
  FiAlertTriangle,
  FiUsers,
  FiBell,
  FiMail,
  FiSearch,
  FiBox,
  FiPlus,
} from "react-icons/fi";
import SalesChart from "./SalesChart";

type Metrics = {
  totalRevenue: number;
  totalOrders: number;
  lowStockAlerts: number;
  totalProducts: number;
};

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
};

type InventoryItem = {
  id: number;
  name: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  quantity: number;
  max: number;
};

const statusBadge: Record<Order["status"], { bg: string; color: string }> = {
  Pending:   { bg: "#FEF9C3", color: "#B45309" },
  Shipped:   { bg: "#DBEAFE", color: "#1D4ED8" },
  Delivered: { bg: "#DCFCE7", color: "#15803D" },
  Cancelled: { bg: "#FEE2E2", color: "#B91C1C" },
};

const inventoryBarColor: Record<InventoryItem["status"], string> = {
  "In Stock":     "#22C55E",
  "Low Stock":    "#F97316",
  "Out of Stock": "#EF4444",
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const metrics: Metrics = {
    totalRevenue: 425000,
    totalOrders: 18,
    lowStockAlerts: 12,
    totalProducts: 842,
  };

  const recentOrders: Order[] = [
    { id: 1, orderNumber: "ORD-9021", customerName: "Rajesh Kumar",    date: "Oct 24, 2023", amount: "₹14,500", status: "Pending" },
    { id: 2, orderNumber: "ORD-9018", customerName: "Senthil Murugan", date: "Oct 23, 2023", amount: "₹8,200",  status: "Shipped" },
    { id: 3, orderNumber: "ORD-9015", customerName: "Anitha Devi",     date: "Oct 22, 2023", amount: "₹6,750",  status: "Delivered" },
    { id: 4, orderNumber: "ORD-9012", customerName: "Prakash Nair",    date: "Oct 21, 2023", amount: "₹11,300", status: "Cancelled" },
  ];

  const inventoryItems: InventoryItem[] = [
    { id: 1, name: "Urea Fertilizer (45kg)",  status: "Low Stock",    quantity: 8,   max: 100 },
    { id: 2, name: "Potash NPK 15-15-15",     status: "Low Stock",    quantity: 22,  max: 100 },
    { id: 3, name: "DAP Complex (50kg)",      status: "In Stock",     quantity: 142, max: 200 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FB", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .metric-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09) !important; transform: translateY(-1px); }
        .metric-card { transition: box-shadow 0.18s, transform 0.18s; }
        .order-row:hover { background: #F9FAFB !important; }
        .nav-link:hover { color: #16A34A !important; }
        .add-btn:hover { background: #15803D !important; }
      `}</style>

      {/* ── Top Navbar ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "#16A34A",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiBox size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>THALIR</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500, marginTop: -1 }}>Provider Dashboard</div>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#F3F4F6", borderRadius: 10, padding: "8px 14px",
          flex: 1, maxWidth: 400, margin: "0 32px",
        }}>
          <FiSearch size={14} color="#9CA3AF" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search orders, farmers, or items..."
            style={{
              border: "none", background: "none", outline: "none",
              fontSize: 13, color: "#374151", width: "100%",
            }}
          />
        </div>

        {/* Right — Nav Links + Icons + User */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Nav links */}
          {[
            { label: "Dashboard",   path: "/provider/dashboard" },
            { label: "Products",    path: "/provider/products" },
            { label: "Orders",      path: "/provider/orders" },
            { label: "Analytics",   path: "/provider/analytics" },
            { label: "Farmers",     path: "/provider/farmers" },
            { label: "Settings",    path: "/provider/settings" },
          ].map(link => (
            <button
              key={link.label}
              className="nav-link"
              onClick={() => navigate(link.path)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                color: link.label === "Dashboard" ? "#16A34A" : "#6B7280",
                padding: 0,
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <FiBell size={18} color="#6B7280" />
              <div style={{
                position: "absolute", top: -3, right: -3,
                width: 8, height: 8, borderRadius: "50%", background: "#EF4444",
              }} />
            </div>
            <FiMail size={18} color="#6B7280" style={{ cursor: "pointer" }} />
          </div>

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>GreenEarth Inputs</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Premium Provider</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#16A34A",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>
              GI
            </div>
          </div>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ padding: "28px 32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ── Metric Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>

          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiTrendingUp size={16} color="#16A34A" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>↑ 12.5%</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Total Revenue</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>₹{metrics.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiShoppingCart size={16} color="#D97706" />
              </div>
              <button onClick={() => navigate("/provider/orders")} style={{ fontSize: 11, fontWeight: 600, color: "#16A34A", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                View All
              </button>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Pending Orders</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{metrics.totalOrders}</p>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>This Week</span>
          </div>

          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiAlertTriangle size={16} color="#DC2626" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>4 urgent</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Low Stock Alerts</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>{metrics.lowStockAlerts}</p>
          </div>

          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiUsers size={16} color="#2563EB" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>↑ 9%</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Total Customers</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{metrics.totalProducts}</p>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>This Month</span>
          </div>

        </div>

        {/* ── Chart + Inventory ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 24 }}>

          {/* Sales Chart */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Sales Performance</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "3px 0 0" }}>Revenue trends over the last 6 months</p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                border: "1px solid #E5E7EB", borderRadius: 8, padding: "5px 10px", cursor: "pointer",
              }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Last 6 Months</span>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <SalesChart />
          </div>

          {/* Inventory Snapshot */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Inventory Snapshot</h2>

            {inventoryItems.map((item) => {
              const barColor = inventoryBarColor[item.status];
              const pct = Math.round((item.quantity / item.max) * 100);
              return (
                <div key={item.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{item.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: barColor }}>
                      {item.quantity} bags left
                    </span>
                  </div>
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 99, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}

            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14, marginTop: 6 }}>
              <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Top Selling Item
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, background: "#F0FDF4", borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FiBox size={16} color="#16A34A" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Bio-Organic Pellets</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>635 units sold this month</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/provider/products")}
              style={{
                marginTop: 16, width: "100%", padding: "9px", borderRadius: 9,
                border: "1px solid #E5E7EB", background: "#F9FAFB",
                fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F3F4F6")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F9FAFB")}
            >
              Manage Inventory
            </button>
          </div>
        </div>

        {/* ── Recent Orders ── */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Recent Orders</h2>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "3px 0 0" }}>Incoming requests from local farmers</p>
            </div>
            <button
              onClick={() => navigate("/provider/orders")}
              style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              View All Orders →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                  {["Order ID", "Farmer Name", "Date", "Amount", "Status", "Action"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "10px 12px",
                      fontSize: 11, fontWeight: 600, color: "#9CA3AF",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const badge = statusBadge[order.status];
                  const initials = order.customerName.split(" ").map(n => n[0]).join("").slice(0, 2);
                  return (
                    <tr key={order.id} className="order-row" style={{ borderBottom: "1px solid #F9FAFB" }}>
                      <td style={{ padding: "13px 12px", fontSize: 13, fontWeight: 600, color: "#16A34A" }}>#{order.orderNumber}</td>
                      <td style={{ padding: "13px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%", background: "#DCFCE7",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, color: "#16A34A", flexShrink: 0,
                          }}>
                            {initials}
                          </div>
                          <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{order.customerName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 12px", fontSize: 12, color: "#6B7280" }}>{order.date}</td>
                      <td style={{ padding: "13px 12px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{order.amount}</td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{
                          background: badge.bg, color: badge.color,
                          borderRadius: 20, padding: "3px 10px",
                          fontSize: 11, fontWeight: 600,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}>⋯</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Add New Product FAB ── */}
        <button
          className="add-btn"
          onClick={() => navigate("/provider/products")}
          style={{
            position: "fixed", bottom: 32, left: 32,
            display: "flex", alignItems: "center", gap: 8,
            background: "#16A34A", color: "#fff",
            border: "none", borderRadius: 12,
            padding: "12px 20px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
            transition: "background 0.15s",
          }}
        >
          <FiPlus size={16} />
          Add New Product
        </button>

      </div>
    </div>
  );
};

export default Dashboard;