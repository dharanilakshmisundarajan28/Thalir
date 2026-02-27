// src/components/consumer/ConsumerOrders.tsx

import { useState, useEffect, useCallback } from "react";
import { farmOrderService } from "../../services/Fertilizer.service";
import type { FarmOrderResponse, FarmOrderStatus, Page } from "../../services/Fertilizer.service";

const PAGE_SIZE = 10;

const STATUS_STYLE: Record<FarmOrderStatus, { bg: string; color: string; dot: string }> = {
  PENDING:   { bg: "#fef9c3", color: "#b45309", dot: "#f59e0b" },
  CONFIRMED: { bg: "#ede9fe", color: "#6d28d9", dot: "#8b5cf6" },
  SHIPPED:   { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  DELIVERED: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  CANCELLED: { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
};

export default function ConsumerOrders() {
  const [page, setPage]               = useState<Page<FarmOrderResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<FarmOrderResponse | null>(null);
  const [cancellingId, setCancellingId]   = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<FarmOrderStatus | "ALL">("ALL");

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async (pg = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmOrderService.getMyOrders(pg, PAGE_SIZE);
      setPage(data);
      setCurrentPage(pg);
    } catch (e: any) {
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(0); }, [fetchOrders]);

  const handleCancel = async (orderId: number) => {
    if (!window.confirm("Cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const updated = await farmOrderService.cancelOrder(orderId);
      if (selectedOrder?.orderId === orderId) setSelectedOrder(updated);
      setPage(prev => prev ? {
        ...prev,
        content: prev.content.map(o => o.orderId === orderId ? updated : o)
      } : prev);
      showToast("Order cancelled successfully", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to cancel order", "error");
    } finally {
      setCancellingId(null);
    }
  };

  const orders = page?.content ?? [];
  const filtered = filterStatus === "ALL" ? orders : orders.filter(o => o.status === filterStatus);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Segoe UI', sans-serif", padding: "24px 32px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#86efac" : "#fecaca"}`,
          color: toast.type === "success" ? "#15803d" : "#dc2626",
          borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>My Orders</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
            {page ? `${page.totalElements} total orders` : "Track your farm produce purchases"}
          </p>
        </div>
        <button onClick={() => fetchOrders(currentPage)} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#374151" }}>
          ↻ Refresh
        </button>
      </div>

      {/* Status filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            border: `1px solid ${filterStatus === s ? "#16a34a" : "#e5e7eb"}`,
            borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600,
            background: filterStatus === s ? "#16a34a" : "#fff",
            color: filterStatus === s ? "#fff" : "#374151", cursor: "pointer",
          }}>
            {s === "ALL" ? "All Orders" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>⚠ {error}</span>
          <button onClick={() => fetchOrders(currentPage)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #16a34a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && !error && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>No orders found</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>
            {filterStatus !== "ALL" ? "No orders with this status." : "You haven't placed any orders yet."}
          </p>
          <a href="/consumer/products" style={{ background: "#16a34a", color: "#fff", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Start Shopping
          </a>
        </div>
      )}

      {/* Orders List */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {filtered.map(order => {
            const s = STATUS_STYLE[order.status];
            const isCancelling = cancellingId === order.orderId;
            return (
              <div key={order.orderId} style={{
                background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
                padding: "18px 20px", cursor: "pointer", transition: "box-shadow 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              onClick={() => setSelectedOrder(order)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Order #{order.orderId}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                      from {order.farmerName} · {formatDate(order.orderedAt)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", marginRight: 5 }} />
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                  {order.items.slice(0, 3).map(i => i.productName).join(", ")}
                  {order.items.length > 3 && ` +${order.items.length - 3} more`}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                  <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedOrder(order)} style={{
                      background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 14px",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#374151",
                    }}>View Details</button>
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(order.orderId)}
                        disabled={isCancelling}
                        style={{
                          background: isCancelling ? "#e5e7eb" : "#fef2f2",
                          border: "none", borderRadius: 8, padding: "6px 14px",
                          fontSize: 12, fontWeight: 600, cursor: isCancelling ? "wait" : "pointer",
                          color: isCancelling ? "#9ca3af" : "#dc2626",
                        }}
                      >
                        {isCancelling ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {page && page.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button disabled={currentPage === 0} onClick={() => fetchOrders(currentPage - 1)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: currentPage === 0 ? "not-allowed" : "pointer", opacity: currentPage === 0 ? 0.4 : 1 }}>‹</button>
          {Array.from({ length: page.totalPages }, (_, i) => (
            <button key={i} onClick={() => fetchOrders(i)} style={{
              width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: i === currentPage ? 700 : 400,
              border: `1px solid ${i === currentPage ? "#16a34a" : "#e5e7eb"}`,
              background: i === currentPage ? "#16a34a" : "#fff",
              color: i === currentPage ? "#fff" : "#374151", cursor: "pointer",
            }}>{i + 1}</button>
          ))}
          <button disabled={currentPage >= page.totalPages - 1} onClick={() => fetchOrders(currentPage + 1)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: currentPage >= page.totalPages - 1 ? "not-allowed" : "pointer", opacity: currentPage >= page.totalPages - 1 ? 0.4 : 1 }}>›</button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setSelectedOrder(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Order #{selectedOrder.orderId}</h3>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{formatDate(selectedOrder.orderedAt)}</div>
              </div>
              <span style={{
                background: STATUS_STYLE[selectedOrder.status].bg,
                color: STATUS_STYLE[selectedOrder.status].color,
                borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700,
              }}>{selectedOrder.status}</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", marginBottom: 10 }}>ITEMS</div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.productName}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.quantity} {item.unit} × ₹{Number(item.priceAtOrder).toFixed(2)}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>₹{Number(item.subtotal).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Farmer</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedOrder.farmerName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Delivery to</span>
                <span style={{ fontSize: 12, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{selectedOrder.deliveryAddress}</span>
              </div>
              {selectedOrder.deliveryPhone && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Phone</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedOrder.deliveryPhone}</span>
                </div>
              )}
              {selectedOrder.notes && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Notes</span>
                  <span style={{ fontSize: 12, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#16a34a" }}>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {selectedOrder.status === "PENDING" && (
                <button onClick={() => { handleCancel(selectedOrder.orderId); setSelectedOrder(null); }}
                  disabled={cancellingId === selectedOrder.orderId}
                  style={{ flex: 1, background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Cancel Order
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)}
                style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}