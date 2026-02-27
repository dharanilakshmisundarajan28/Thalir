import { useState } from "react";
import {
  Search, Bell, ShoppingCart, Star,
  Plus, Minus, X, MapPin, Truck, Shield,
  Package, Leaf, Zap, CheckCircle
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Nitrogen", "Phosphorus", "Potassium", "Micronutrients", "Organic", "Compound"];

const PRODUCTS = [
  {
    id: 1, name: "Urea (46% Nitrogen)", brand: "IFFCO", category: "Nitrogen",
    price: 267, unit: "50kg bag", rating: 4.5, reviews: 2341,
    badge: "BEST SELLER", badgeColor: "bg-amber-500",
    description: "High-nitrogen fertilizer ideal for paddy, wheat and maize. Boosts vegetative growth.",
    tags: ["Wheat", "Paddy", "Maize"],
    stock: 320, emoji: "🌿", inStock: true,
    delivery: "2-3 days", origin: "Punjab Depot",
  },
  {
    id: 2, name: "DAP (Di-Ammonium Phosphate)", brand: "NFL", category: "Phosphorus",
    price: 1350, unit: "50kg bag", rating: 4.7, reviews: 1892,
    badge: "RECOMMENDED", badgeColor: "bg-green-600",
    description: "Rich in phosphorus and nitrogen. Best for root development at sowing time.",
    tags: ["All Crops", "Sowing Stage"],
    stock: 180, emoji: "🧪", inStock: true,
    delivery: "1-2 days", origin: "Ludhiana Depot",
  },
  {
    id: 3, name: "MOP (Muriate of Potash)", brand: "IPL", category: "Potassium",
    price: 1700, unit: "50kg bag", rating: 4.3, reviews: 987,
    badge: null, badgeColor: "",
    description: "Enhances disease resistance and improves fruit quality. Essential for potassium-deficient soils.",
    tags: ["Fruits", "Vegetables", "Cotton"],
    stock: 95, emoji: "🔴", inStock: true,
    delivery: "3-4 days", origin: "Amritsar Depot",
  },
  {
    id: 4, name: "NPK 19-19-19 (Water Soluble)", brand: "Coromandel", category: "Compound",
    price: 1200, unit: "25kg bag", rating: 4.8, reviews: 3210,
    badge: "TOP RATED", badgeColor: "bg-blue-600",
    description: "Balanced nutrition for all growth stages. Ideal for drip and foliar application.",
    tags: ["Drip Irrigation", "All Crops"],
    stock: 42, emoji: "💊", inStock: true,
    delivery: "2-3 days", origin: "Patiala Depot",
  },
  {
    id: 5, name: "Vermicompost (Organic)", brand: "GreenGold", category: "Organic",
    price: 12, unit: "kg", rating: 4.6, reviews: 1540,
    badge: "ORGANIC", badgeColor: "bg-lime-600",
    description: "100% organic soil enricher. Improves soil structure and microbial activity naturally.",
    tags: ["Organic Farming", "Soil Health"],
    stock: 850, emoji: "🍂", inStock: true,
    delivery: "1-2 days", origin: "Local Farm",
  },
  {
    id: 6, name: "Zinc Sulphate (21%)", brand: "Zuari", category: "Micronutrients",
    price: 95, unit: "kg", rating: 4.2, reviews: 672,
    badge: null, badgeColor: "",
    description: "Corrects zinc deficiency in rice and wheat. Improves grain quality and yield.",
    tags: ["Paddy", "Wheat", "Zinc Deficiency"],
    stock: 0, emoji: "⚡", inStock: false,
    delivery: "5-6 days", origin: "Jalandhar Depot",
  },
  {
    id: 7, name: "SSP (Single Super Phosphate)", brand: "GSFC", category: "Phosphorus",
    price: 400, unit: "50kg bag", rating: 4.1, reviews: 445,
    badge: null, badgeColor: "",
    description: "Contains phosphorus, calcium and sulphur. Good for oilseed crops and pulses.",
    tags: ["Mustard", "Groundnut", "Pulses"],
    stock: 210, emoji: "🌱", inStock: true,
    delivery: "2-3 days", origin: "Bathinda Depot",
  },
  {
    id: 8, name: "Bio-NPK Liquid Fertilizer", brand: "Krishi Bio", category: "Organic",
    price: 450, unit: "litre", rating: 4.4, reviews: 318,
    badge: "NEW", badgeColor: "bg-purple-600",
    description: "Bio-fertilizer with nitrogen-fixing and phosphate-solubilizing bacteria. 100% eco-friendly.",
    tags: ["Organic", "Bio Farming", "Soil Health"],
    stock: 60, emoji: "🧬", inStock: true,
    delivery: "3-4 days", origin: "Chandigarh Hub",
  },
];

// ── Cart Item type ────────────────────────────────────────────────────────────
interface CartItem {
  product: typeof PRODUCTS[0];
  qty: number;
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s} size={11}
          className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({
  cart, onClose, onQtyChange, onRemove, onPlaceOrder
}: {
  cart: CartItem[];
  onClose: () => void;
  onQtyChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPlaceOrder: () => void;
}) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-slate-700" />
            <h2 className="text-base font-extrabold text-slate-800">Your Cart</h2>
            <span className="bg-green-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300">
              <ShoppingCart size={48} />
              <p className="text-sm font-bold">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="bg-slate-50 rounded-xl p-3 flex gap-3 items-start">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl border border-slate-100 shrink-0">
                  {item.product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-tight truncate">{item.product.name}</p>
                  <p className="text-xs text-slate-400 mb-2">{item.product.brand} · {item.product.unit}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg">
                      <button onClick={() => onQtyChange(item.product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-green-600 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-extrabold text-slate-800 w-6 text-center">{item.qty}</span>
                      <button onClick={() => onQtyChange(item.product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-green-600 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-extrabold text-slate-800">₹{(item.product.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(item.product.id)} className="text-slate-300 hover:text-red-400 transition-colors mt-0.5">
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-semibold">Subtotal</span>
              <span className="text-xl font-extrabold text-slate-800">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
              <Truck size={13} className="text-green-600 shrink-0" />
              <span className="text-xs font-semibold text-green-700">Free delivery on orders above ₹2,000</span>
            </div>
            <button
              onClick={onPlaceOrder}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-3.5 rounded-xl transition-colors shadow-md text-sm"
            >
              Place Order · ₹{total.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Order Success Modal ───────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Order Placed!</h2>
        <p className="text-sm text-slate-400 mb-1">Your fertilizer order has been placed successfully.</p>
        <p className="text-xs text-slate-400 mb-6">You'll receive a confirmation shortly.</p>
        <div className="bg-slate-50 rounded-xl px-4 py-3 w-full mb-5">
          <p className="text-xs text-slate-400 font-semibold mb-0.5">Order ID</p>
          <p className="text-sm font-extrabold text-slate-800 font-mono">ORD-{Date.now().toString().slice(-6)}</p>
        </div>
        <button onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }: {
  product: typeof PRODUCTS[0];
  onAddToCart: (p: typeof PRODUCTS[0]) => void;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col">
      {/* Top */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 flex items-center justify-between">
        <span className="text-4xl">{product.emoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          {product.badge && (
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white tracking-widest ${product.badgeColor}`}>
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-600 tracking-widest">
              OUT OF STOCK
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
          <h3 className="font-extrabold text-slate-800 text-[15px] leading-tight">{product.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-slate-400 font-semibold">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1">{product.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.map(t => (
            <span key={t} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>

        {/* Delivery info */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Truck size={10} /> {product.delivery}</span>
          <span className="flex items-center gap-1"><MapPin size={10} /> {product.origin}</span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
          <div>
            <span className="text-xl font-extrabold text-slate-800">₹{product.price.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-1">/ {product.unit}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-colors ${
              product.inStock
                ? "bg-green-600 hover:bg-green-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Plus size={13} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FertilizerMarket() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [sortBy, setSortBy]                 = useState("Popular");
  const [cart, setCart]                     = useState<CartItem[]>([]);
  const [showCart, setShowCart]             = useState(false);
  const [showSuccess, setShowSuccess]       = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const changeQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const removeItem = (id: number) => setCart(prev => prev.filter(i => i.product.id !== id));

  const placeOrder = () => {
    setCart([]);
    setShowCart(false);
    setShowSuccess(true);
  };

  const filtered = PRODUCTS
    .filter(p => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Top Rated") return b.rating - a.rating;
      return b.reviews - a.reviews; // Popular
    });

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Fertilizer Market</h1>
          <p className="text-sm text-slate-400 mt-0.5">Browse and order fertilizers directly from verified suppliers.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Verified badge */}
          <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <Shield size={11} /> Verified Suppliers Only
          </span>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
          {/* Cart button */}
          <button
            onClick={() => setShowCart(true)}
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
          { icon: Truck,    label: "Free Delivery", sub: "On orders above ₹2,000", color: "text-green-600 bg-green-50" },
          { icon: Shield,   label: "Verified Quality", sub: "ISI & BIS certified products", color: "text-blue-600 bg-blue-50" },
          { icon: Zap,      label: "Fast Dispatch", sub: "Ships within 24 hours", color: "text-amber-600 bg-amber-50" },
          { icon: Leaf,     label: "Govt. Approved", sub: "Subsidised rates available", color: "text-lime-600 bg-lime-50" },
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
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === c
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
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fertilizers..."
              className="bg-transparent outline-none text-sm text-slate-600 w-40 placeholder:text-slate-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-slate-100 border-none text-sm font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {["Popular", "Top Rated", "Price: Low to High", "Price: High to Low"].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filtered.length} products
          </span>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-4 flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
            <Package size={48} />
            <p className="text-sm font-bold">No products found</p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onQtyChange={changeQty}
          onRemove={removeItem}
          onPlaceOrder={placeOrder}
        />
      )}

      {/* Success Modal */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}