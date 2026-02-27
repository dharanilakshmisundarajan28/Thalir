import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp, FiShoppingCart, FiAlertTriangle, FiUsers,
  FiBell, FiMail, FiSearch, FiBox, FiPlus, FiRefreshCw,
} from "react-icons/fi";
import SalesChart from "./SalesChart";
import { productService, orderService } from "../../services/Fertilizer.service";
import type { ProductResponse, OrderResponse } from "../../services/Fertilizer.service";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type OrderDisplayStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Confirmed";

const STATUS_MAP: Record<string, OrderDisplayStatus> = {
  PENDING:   "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED:   "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusBadge: Record<OrderDisplayStatus, { bg: string; color: string }> = {
  Pending:   { bg: "#FEF9C3", color: "#B45309" },
  Confirmed: { bg: "#EDE9FE", color: "#6D28D9" },
  Shipped:   { bg: "#DBEAFE", color: "#1D4ED8" },
  Delivered: { bg: "#DCFCE7", color: "#15803D" },
  Cancelled: { bg: "#FEE2E2", color: "#B91C1C" },
};

const LOW_STOCK_THRESHOLD = 50;

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const getInitials = (name: string) =>
  name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]   = useState("");

  // ── Data state ──
  const [products, setProducts]         = useState<ProductResponse[]>([]);
  const [orders, setOrders]             = useState<OrderResponse[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders]     = useState(true);
  const [errorProducts, setErrorProducts]     = useState<string | null>(null);
  const [errorOrders, setErrorOrders]         = useState<string | null>(null);
  const [refreshing, setRefreshing]           = useState(false);

  /* ── Fetch my products (provider view) ── */
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const data = await productService.getMyProducts();
      setProducts(data);
    } catch (e: any) {
      setErrorProducts(e.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ── Fetch all orders (admin/provider view — recent 5) ── */
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const page = await orderService.getAllOrders(0, 5);
      setOrders(page.content);
    } catch (e: any) {
      setErrorOrders(e.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  /* ── Refresh all ── */
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setRefreshing(false);
  };

  /* ── Derived Metrics ── */
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === "PENDING").length;

  const lowStockProducts = products.filter(
    p => p.isActive && p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD
  );
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);
  const lowStockAlerts = lowStockProducts.length + outOfStockProducts.length;

  const totalProducts = products.length;

  /* ── Inventory snapshot — bottom 3 by stock quantity ── */
  const inventoryItems = [...products]
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 3)
    .map(p => {
      const max = Math.max(p.stockQuantity * 2, 200);
      const status: "In Stock" | "Low Stock" | "Out of Stock" =
        p.stockQuantity === 0 ? "Out of Stock"
        : p.stockQuantity <= LOW_STOCK_THRESHOLD ? "Low Stock"
        : "In Stock";
      return { id: p.id, name: p.name, status, quantity: p.stockQuantity, unit: p.unit || "units", max };
    });

  const inventoryBarColor: Record<string, string> = {
    "In Stock":     "#22C55E",
    "Low Stock":    "#F97316",
    "Out of Stock": "#EF4444",
  };

  /* ── Top selling product (highest stock × price value) ── */
  const topProduct = [...products].sort((a, b) => (b.price * b.stockQuantity) - (a.price * a.stockQuantity))[0];

  /* ── Filter orders by search query ── */
  const filteredOrders = orders.filter(o =>
    searchQuery === "" ||
    String(o.orderId).includes(searchQuery) ||
    o.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const loading = loadingProducts || loadingOrders;

  /* ═══════════════ RENDER ═══════════════ */
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
        .skeleton { background: linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 6px; }
        @keyframes shimmer { to { background-position: -200% 0; } }
      `}</style>

      {/* ── Top Navbar ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "0 32px", height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiBox size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>THALIR</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500, marginTop: -1 }}>Provider Dashboard</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 14px", flex: 1, maxWidth: 400, margin: "0 32px" }}>
          <FiSearch size={14} color="#9CA3AF" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search orders, farmers, or items..."
            style={{ border: "none", background: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%" }}
          />
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[
            { label: "Dashboard", path: "/provider/dashboard" },
            { label: "Products",  path: "/provider/products"  },
            { label: "Orders",    path: "/provider/orders"    },
            { label: "Analytics", path: "/provider/analytics" },
            { label: "Farmers",   path: "/provider/farmers"   },
            { label: "Settings",  path: "/provider/settings"  },
          ].map(link => (
            <button key={link.label} className="nav-link" onClick={() => navigate(link.path)} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
              color: link.label === "Dashboard" ? "#16A34A" : "#6B7280", padding: 0,
            }}>{link.label}</button>
          ))}

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Refresh button */}
            <button onClick={handleRefresh} title="Refresh" style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center" }}>
              <FiRefreshCw size={16} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
            </button>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <FiBell size={18} color="#6B7280" />
              {lowStockAlerts > 0 && (
                <div style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              )}
            </div>
            <FiMail size={18} color="#6B7280" style={{ cursor: "pointer" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>GreenEarth Inputs</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Premium Provider</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>GI</div>
          </div>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ padding: "28px 32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ── Error Banners ── */}
        {(errorProducts || errorOrders) && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#DC2626", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠ {errorProducts || errorOrders}</span>
            <button onClick={handleRefresh} style={{ background: "none", border: "none", color: "#DC2626", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Retry</button>
          </div>
        )}

        {/* ── Metric Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>

          {/* Total Revenue */}
          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiTrendingUp size={16} color="#16A34A" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>↑ Live</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Total Revenue</p>
            {loadingOrders
              ? <div className="skeleton" style={{ height: 32, width: 120 }} />
              : <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>₹{totalRevenue.toLocaleString()}</p>
            }
          </div>

          {/* Pending Orders */}
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
            {loadingOrders
              ? <div className="skeleton" style={{ height: 32, width: 60 }} />
              : <>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{pendingOrders}</p>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>of {orders.length} recent</span>
                </>
            }
          </div>

          {/* Low Stock Alerts */}
          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiAlertTriangle size={16} color="#DC2626" />
              </div>
              {outOfStockProducts.length > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>{outOfStockProducts.length} out of stock</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Low Stock Alerts</p>
            {loadingProducts
              ? <div className="skeleton" style={{ height: 32, width: 60 }} />
              : <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>{lowStockAlerts}</p>
            }
          </div>

          {/* Total Products */}
          <div className="metric-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiUsers size={16} color="#2563EB" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>↑ Live</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Total Products</p>
            {loadingProducts
              ? <div className="skeleton" style={{ height: 32, width: 60 }} />
              : <>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{totalProducts}</p>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{products.filter(p => p.isActive).length} active</span>
                </>
            }
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
              <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #E5E7EB", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Last 6 Months</span>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
            <SalesChart />
          </div>

          {/* Inventory Snapshot */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Inventory Snapshot</h2>

            {loadingProducts ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 6, width: "100%" }} />
                </div>
              ))
            ) : inventoryItems.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "20px 0" }}>No products yet</p>
            ) : (
              inventoryItems.map(item => {
                const barColor = inventoryBarColor[item.status];
                const pct = Math.min(Math.round((item.quantity / item.max) * 100), 100);
                return (
                  <div key={item.id} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#111827", flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: barColor, flexShrink: 0 }}>
                        {item.quantity} {item.unit} left
                      </span>
                    </div>
                    <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 99, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })
            )}

            {/* Top Selling */}
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14, marginTop: 6 }}>
              <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Highest Value Product
              </p>
              {loadingProducts ? (
                <div className="skeleton" style={{ height: 36, width: "100%" }} />
              ) : topProduct ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: "#F0FDF4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FiBox size={16} color="#16A34A" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{topProduct.name}</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                      ₹{topProduct.price.toFixed(2)} · {topProduct.stockQuantity} {topProduct.unit || "units"} in stock
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              onClick={() => navigate("/provider/products")}
              style={{ marginTop: 16, width: "100%", padding: "9px", borderRadius: 9, border: "1px solid #E5E7EB", background: "#F9FAFB", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
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
            <button onClick={() => navigate("/provider/orders")} style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              View All Orders →
            </button>
          </div>

          {loadingOrders ? (
            <div style={{ padding: "24px 0", textAlign: "center" }}>
              <div style={{ width: 28, height: 28, border: "3px solid #16A34A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>Loading orders…</span>
            </div>
          ) : errorOrders ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#DC2626", fontSize: 13 }}>
              Failed to load orders. <button onClick={fetchOrders} style={{ color: "#DC2626", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Retry</button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
              {searchQuery ? "No orders match your search." : "No recent orders found."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {["Order ID", "Items", "Date", "Amount", "Status", "Action"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const displayStatus = STATUS_MAP[order.status] ?? "Pending";
                    const badge = statusBadge[displayStatus];
                    const itemSummary = order.items.slice(0, 2).map(i => i.productName).join(", ")
                      + (order.items.length > 2 ? ` +${order.items.length - 2} more` : "");
                    const initials = getInitials(order.deliveryAddress || "FA");

                    return (
                      <tr key={order.orderId} className="order-row" style={{ borderBottom: "1px solid #F9FAFB" }}>
                        <td style={{ padding: "13px 12px", fontSize: 13, fontWeight: 600, color: "#16A34A" }}>
                          #{order.orderId}
                        </td>
                        <td style={{ padding: "13px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#16A34A", flexShrink: 0 }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{itemSummary || "—"}</div>
                              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "13px 12px", fontSize: 12, color: "#6B7280" }}>
                          {formatDate(order.orderedAt)}
                        </td>
                        <td style={{ padding: "13px 12px", fontSize: 13, fontWeight: 600, color: "#111827" }}>
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: "13px 12px" }}>
                          <span style={{ background: badge.bg, color: badge.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                            {displayStatus}
                          </span>
                        </td>
                        <td style={{ padding: "13px 12px" }}>
                          <button
                            onClick={() => navigate("/provider/orders")}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}
                          >⋯</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── FAB ── */}
        <button
          className="add-btn"
          onClick={() => navigate("/provider/products")}
          style={{
            position: "fixed", bottom: 32, left: 32,
            display: "flex", alignItems: "center", gap: 8,
            background: "#16A34A", color: "#fff",
            border: "none", borderRadius: 12, padding: "12px 20px",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(22,163,74,0.35)", transition: "background 0.15s",
          }}
        >
          <FiPlus size={16} /> Add New Product
        </button>

      </div>
    </div>
  );
};

export default Dashboard;