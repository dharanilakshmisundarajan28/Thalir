// PATH: src/pages/farmer/FertilizerMarket.tsx
// Fully connected to backend: /api/fertilizer/products, /api/fertilizer/cart, /api/fertilizer/orders/checkout
import { useState, useEffect, useCallback } from "react";
import {
  Search, Bell, ShoppingCart, Star,
  Plus, Minus, X, MapPin, Truck, Shield,
  Package, Leaf, Zap, CheckCircle, RefreshCw
} from "lucide-react";
import {
  productService, cartService, orderService,
} from "../../services/Fertilizer.service";
import type {
  ProductResponse, CartResponse, CheckoutRequest, Page
} from "../../services/Fertilizer.service";

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "NITROGEN", "PHOSPHORUS", "POTASSIUM", "MICRONUTRIENTS", "ORGANIC", "COMPOUND"];
const PAGE_SIZE = 12;

// ── Category emoji/color map ──────────────────────────────────────────────────
const CAT_STYLE: Record<string, { emoji: string; bg: string; color: string }> = {
  NITROGEN: { emoji: "🌿", bg: "from-green-50 to-green-100", color: "#166534" },
  PHOSPHORUS: { emoji: "🔵", bg: "from-blue-50 to-blue-100", color: "#1d4ed8" },
  POTASSIUM: { emoji: "🔴", bg: "from-rose-50 to-rose-100", color: "#be123c" },
  MICRONUTRIENTS: { emoji: "⚡", bg: "from-amber-50 to-amber-100", color: "#92400e" },
  ORGANIC: { emoji: "🍂", bg: "from-lime-50 to-lime-100", color: "#3f6212" },
  COMPOUND: { emoji: "💊", bg: "from-purple-50 to-purple-100", color: "#5b21b6" },
};
const getCatStyle = (cat: string) =>
  CAT_STYLE[cat?.toUpperCase()] ?? { emoji: "🌱", bg: "from-slate-50 to-slate-100", color: "#374151" };

// ── Checkout Modal ─────────────────────────────────────────────────────────────
function CheckoutModal({
  cart, onClose, onPlaced,
}: {
  cart: CartResponse | null;
  onClose: () => void;
  onPlaced: () => void;
}) {
  const [form, setForm] = useState<CheckoutRequest>({ deliveryAddress: "", deliveryPhone: "", notes: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlace = async () => {
    if (!form.deliveryAddress.trim()) { setError("Please enter a delivery address"); return; }
    setPlacing(true);
    setError(null);
    try {
      await orderService.checkout(form);
      onPlaced();
    } catch (e: any) {
      setError(e.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-800">Delivery Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {[
            { key: "deliveryAddress", label: "Delivery Address *", type: "text", placeholder: "Enter your full delivery address" },
            { key: "deliveryPhone", label: "Phone Number", type: "tel", placeholder: "e.g. 9876543210" },
            { key: "notes", label: "Order Notes", type: "text", placeholder: "Any special instructions..." },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
              <input
                type={f.type} placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green-400 transition-colors"
              />
            </div>
          ))}

          {cart && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Order Summary</p>
              {cart.items.map(item => (
                <div key={item.cartItemId} className="flex justify-between text-sm text-slate-700 mb-1">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-semibold">₹{Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-600 text-base">₹{Number(cart.totalPrice).toFixed(2)}</span>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <div className="flex gap-3">
            <button onClick={handlePlace} disabled={placing}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {placing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {placing ? "Placing…" : "Place Order"}
            </button>
            <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Order Success Modal ────────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Order Placed! 🎉</h2>
        <p className="text-sm text-slate-400 mb-1">Your fertilizer order has been placed successfully.</p>
        <p className="text-xs text-slate-400 mb-6">The supplier will confirm it shortly.</p>
        <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({
  cart, loading, onClose, onQtyChange, onRemove, onCheckout,
}: {
  cart: CartResponse | null;
  loading: boolean;
  onClose: () => void;
  onQtyChange: (cartItemId: number, newQty: number) => void;
  onRemove: (cartItemId: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-slate-700" />
            <h2 className="text-base font-extrabold text-slate-800">Fertilizer Cart</h2>
            {cart && <span className="bg-green-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">{cart.totalItems}</span>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="w-7 h-7 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && (!cart || cart.items.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300">
              <ShoppingCart size={48} />
              <p className="text-sm font-bold">Your cart is empty</p>
            </div>
          )}
          {!loading && cart?.items.map(item => (
            <div key={item.cartItemId} className="bg-slate-50 rounded-xl p-3 flex gap-3 items-start">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl border border-green-200 shrink-0">🌿</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 leading-tight truncate">{item.productName}</p>
                <p className="text-xs text-slate-400 mb-2">₹{Number(item.priceAtAddition).toFixed(2)} / {item.unit || "unit"}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg">
                    <button onClick={() => onQtyChange(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-green-600 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-extrabold text-slate-800 w-6 text-center">{item.quantity}</span>
                    <button onClick={() => onQtyChange(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-green-600 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800">₹{Number(item.subtotal).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => onRemove(item.cartItemId)} className="text-slate-300 hover:text-red-400 transition-colors mt-0.5">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-semibold">Total</span>
              <span className="text-xl font-extrabold text-slate-800">₹{Number(cart.totalPrice).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
              <Truck size={13} className="text-green-600 shrink-0" />
              <span className="text-xs font-semibold text-green-700">Free delivery on orders above ₹2,000</span>
            </div>
            <button onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-3.5 rounded-xl transition-colors shadow-md text-sm">
              Proceed to Checkout · ₹{Number(cart.totalPrice).toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, adding }: {
  product: ProductResponse;
  onAddToCart: (p: ProductResponse) => void;
  adding: boolean;
}) {
  const catStyle = getCatStyle(product.category);
  const isOut = product.stockQuantity === 0;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col">
      {/* Top */}
      <div className={`bg-gradient-to-br ${catStyle.bg} p-5 flex items-center justify-between`}>
        <span className="text-4xl">{catStyle.emoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          {!product.isActive && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 tracking-widest">INACTIVE</span>
          )}
          {isOut && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-600 tracking-widest">OUT OF STOCK</span>
          )}
          {!isOut && product.stockQuantity <= 20 && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 tracking-widest">LOW STOCK</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{product.brand || product.sellerName}</p>
          <h3 className="font-extrabold text-slate-800 text-[15px] leading-tight">{product.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={11} className="text-amber-400 fill-amber-400" />
          ))}
          <span className="text-[11px] text-slate-400 font-semibold">({product.category})</span>
        </div>

        {product.description && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1">{product.description}</p>
        )}

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Package size={10} /> {product.stockQuantity} {product.unit} left</span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
          <div>
            <span className="text-xl font-extrabold text-slate-800">₹{Number(product.price).toFixed(2)}</span>
            <span className="text-xs text-slate-400 ml-1">/ {product.unit || "unit"}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.isActive || isOut || adding}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-colors ${product.isActive && !isOut
                ? "bg-green-600 hover:bg-green-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
          >
            {adding ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={13} />}
            {adding ? "" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FertilizerMarket() {
  const [productPage, setProductPage] = useState<Page<ProductResponse> | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [sortBy, setSortBy] = useState("name");

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Fetch products ────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (pg = 0, kw = "", cat = "", sort = "name") => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      let data: Page<ProductResponse>;
      if (kw.trim()) {
        data = await productService.search(kw.trim(), pg, PAGE_SIZE);
      } else if (cat && cat !== "All") {
        data = await productService.getByCategory(cat, pg, PAGE_SIZE);
      } else {
        data = await productService.getAll(pg, PAGE_SIZE, sort);
      }
      setProductPage(data);
      setCurrentPage(pg);
    } catch (e: any) {
      setProductError(e.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => { fetchProducts(0); }, [fetchProducts]);

  // ── Fetch cart ─────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    setLoadingCart(true);
    try {
      setCart(await cartService.getCart());
    } catch (e: any) {
      // If cart is empty or 404, that's fine
      if (!e.message?.includes("404")) {
        console.warn("Cart fetch:", e.message);
      }
      setCart(null);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Product actions ───────────────────────────────────────────────────────
  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => fetchProducts(0, val, activeCategory, sortBy), 400));
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    fetchProducts(0, search, cat, sortBy);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    fetchProducts(0, search, activeCategory, sort);
  };

  const addToCart = async (product: ProductResponse) => {
    setAddingId(product.id);
    try {
      const updated = await cartService.addItem(product.id, 1);
      setCart(updated);
      showToast(`Added "${product.name}" to cart`, "success");
    } catch (e: any) {
      showToast(e.message || "Failed to add to cart", "error");
    } finally {
      setAddingId(null);
    }
  };

  const handleQtyChange = async (cartItemId: number, newQty: number) => {
    if (newQty < 1) {
      handleRemove(cartItemId);
      return;
    }
    try {
      const updated = await cartService.updateItem(cartItemId, newQty);
      setCart(updated);
    } catch (e: any) {
      showToast(e.message || "Failed to update", "error");
    }
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      const updated = await cartService.removeItem(cartItemId);
      setCart(updated);
    } catch (e: any) {
      showToast(e.message || "Failed to remove", "error");
    }
  };

  const handleOrderPlaced = () => {
    setCart(null);
    setShowCheckout(false);
    setShowCart(false);
    setShowSuccess(true);
  };

  const products = productPage?.content ?? [];
  const cartCount = cart?.totalItems ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>

      {/* ── Toast ── */}
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

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Fertilizer Market</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {productPage ? `${productPage.totalElements} products available` : "Browse and order fertilizers from verified suppliers."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <Shield size={11} /> Verified Suppliers Only
          </span>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
          {/* Cart button */}
          <button
            onClick={() => { setShowCart(true); fetchCart(); }}
            className="relative flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <ShoppingCart size={15} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Trust Bar ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Truck, label: "Free Delivery", sub: "On orders above ₹2,000", color: "text-green-600 bg-green-50" },
          { icon: Shield, label: "Verified Quality", sub: "ISI & BIS certified products", color: "text-blue-600 bg-blue-50" },
          { icon: Zap, label: "Fast Dispatch", sub: "Ships within 24 hours", color: "text-amber-600 bg-amber-50" },
          { icon: Leaf, label: "Govt. Approved", sub: "Subsidised rates available", color: "text-lime-600 bg-lime-50" },
        ].map(t => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                <Icon size={15} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-700">{t.label}</p>
                <p className="text-[10px] text-slate-400">{t.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => handleCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === c
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
            <Search size={13} className="text-slate-400" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search fertilizers..."
              className="bg-transparent outline-none text-sm text-slate-600 w-40 placeholder:text-slate-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => handleSort(e.target.value)}
            className="bg-slate-100 border-none text-sm font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="name">Name A-Z</option>
            <option value="price">Price</option>
            <option value="createdAt">Newest</option>
          </select>
          <button onClick={() => fetchProducts(currentPage, search, activeCategory, sortBy)}
            className="w-8 h-8 flex items-center justify-center bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition">
            <RefreshCw size={13} className={`text-green-600 ${loadingProducts ? "animate-spin" : ""}`} />
          </button>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {productPage ? `${productPage.totalElements} products` : ""}
          </span>
        </div>
      </div>

      {/* ── Error ── */}
      {productError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold flex justify-between">
          <span>⚠ {productError}</span>
          <button onClick={() => fetchProducts(0)} className="hover:underline font-bold">Retry</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loadingProducts && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Product Grid ── */}
      {!loadingProducts && products.length === 0 && !productError && (
        <div className="col-span-4 flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
          <Package size={48} />
          <p className="text-sm font-bold text-slate-500">No products found</p>
        </div>
      )}
      {!loadingProducts && products.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} adding={addingId === p.id} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {productPage && productPage.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={currentPage === 0} onClick={() => fetchProducts(currentPage - 1, search, activeCategory, sortBy)}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-green-400 disabled:opacity-40 transition">‹</button>
          {Array.from({ length: productPage.totalPages }, (_, i) => (
            <button key={i} onClick={() => fetchProducts(i, search, activeCategory, sortBy)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition ${i === currentPage ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-green-400"
                }`}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage >= productPage.totalPages - 1} onClick={() => fetchProducts(currentPage + 1, search, activeCategory, sortBy)}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-green-400 disabled:opacity-40 transition">›</button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer
          cart={cart}
          loading={loadingCart}
          onClose={() => setShowCart(false)}
          onQtyChange={handleQtyChange}
          onRemove={handleRemove}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onPlaced={handleOrderPlaced}
        />
      )}

      {/* Success Modal */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}