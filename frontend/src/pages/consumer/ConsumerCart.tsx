// src/components/consumer/ConsumerCart.tsx

import { useState, useEffect } from "react";
import { farmCartService, farmOrderService } from "../../services/Fertilizer.service";
import type { FarmCartResponse, FarmCheckoutRequest } from "../../services/Fertilizer.service";

export default function ConsumerCart() {
  const [cart, setCart]             = useState<FarmCartResponse | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing]       = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState<FarmCheckoutRequest>({
    deliveryAddress: "", deliveryPhone: "", notes: ""
  });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      setCart(await farmCartService.getCart());
    } catch (e: any) {
      setError(e.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    setUpdatingId(cartItemId);
    try {
      setCart(await farmCartService.updateItem(cartItemId, quantity));
    } catch (e: any) {
      showToast(e.message || "Failed to update", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    setUpdatingId(cartItemId);
    try {
      setCart(await farmCartService.removeItem(cartItemId));
      showToast("Item removed", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to remove item", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const placeOrder = async () => {
    if (!form.deliveryAddress.trim()) {
      showToast("Please enter a delivery address", "error");
      return;
    }
    setPlacing(true);
    try {
      await farmOrderService.checkout(form);
      setOrderSuccess(true);
      setShowCheckout(false);
      setCart(null);
    } catch (e: any) {
      showToast(e.message || "Checkout failed", "error");
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.items ?? [];

  // ── Order Success Screen ──
  if (orderSuccess) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 64, height: 64, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Order Placed!</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>Your order has been placed successfully. The farmer will confirm it shortly.</p>
          <a href="/consumer/orders" style={{ display: "inline-block", background: "#16a34a", color: "#fff", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            View My Orders
          </a>
        </div>
      </div>
    );
  }

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

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>My Cart</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #16a34a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
            ⚠ {error} <button onClick={fetchCart} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>Your cart is empty</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>Browse fresh produce from local farmers.</p>
            <a href="/consumer/products" style={{ background: "#16a34a", color: "#fff", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Browse Products
            </a>
          </div>
        )}

        {!loading && items.length > 0 && !showCheckout && (
          <>
            {/* Cart items */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 16 }}>
              {items.map((item, i) => (
                <div key={item.cartItemId} style={{
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                  borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none",
                  opacity: updatingId === item.cartItemId ? 0.5 : 1, transition: "opacity 0.2s",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🌿</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{item.productName}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>by {item.farmerName} · ₹{Number(item.priceAtAddition).toFixed(2)}/{item.unit || "unit"}</div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      disabled={updatingId === item.cartItemId}
                      style={{ width: 30, background: "#f9fafb", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#374151" }}>−</button>
                    <span style={{ width: 36, textAlign: "center", lineHeight: "30px", fontSize: 13, fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      disabled={updatingId === item.cartItemId}
                      style={{ width: 30, background: "#f9fafb", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#374151" }}>+</button>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", minWidth: 70, textAlign: "right" }}>
                    ₹{Number(item.subtotal).toFixed(2)}
                  </div>

                  <button onClick={() => removeItem(item.cartItemId)} disabled={updatingId === item.cartItemId}
                    style={{ background: "#fef2f2", border: "none", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: 14, color: "#ef4444" }}>🗑</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>Subtotal ({items.length} items)</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>₹{Number(cart?.totalPrice ?? 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>₹{Number(cart?.totalPrice ?? 0).toFixed(2)}</span>
              </div>
              <button onClick={() => setShowCheckout(true)} style={{
                width: "100%", background: "#16a34a", color: "#fff", border: "none",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}

        {/* Checkout Form */}
        {showCheckout && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "28px 28px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Delivery Details</h3>

            {[
              { key: "deliveryAddress", label: "Delivery Address *", type: "text", placeholder: "Enter your full delivery address" },
              { key: "deliveryPhone",   label: "Phone Number",        type: "tel",  placeholder: "e.g. 9876543210" },
              { key: "notes",           label: "Order Notes",         type: "text", placeholder: "Any special instructions..." },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>ORDER SUMMARY</div>
              {items.map(item => (
                <div key={item.cartItemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "#374151" }}>{item.productName} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#16a34a" }}>₹{Number(cart?.totalPrice ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={placeOrder} disabled={placing} style={{
                flex: 1, background: placing ? "#6b7280" : "#16a34a", color: "#fff",
                border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700,
                cursor: placing ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                {placing && <span style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />}
                {placing ? "Placing Order…" : "Place Order"}
              </button>
              <button onClick={() => setShowCheckout(false)} style={{
                flex: 1, background: "#f3f4f6", color: "#374151", border: "none",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>
                Back to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}