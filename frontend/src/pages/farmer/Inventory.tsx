import { useState } from "react";
import {
  Search, Bell, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  Package, AlertTriangle, TrendingUp, ShoppingBag, Tag,
  ChevronRight, LayoutGrid, List
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All Categories", "Seeds", "Fertilizers", "Pesticides", "Tools & Equipment", "Organic"];

const STATUS_OPTIONS = ["All Status", "In Stock", "Low Stock", "Out of Stock"];

const PRODUCTS = [
  {
    id: 1, name: "Hybrid Wheat Seeds (HD-2967)", category: "Seeds",
    price: 245, unit: "kg", stock: 850, minStock: 100,
    status: "In Stock", sku: "SED-WHT-001", emoji: "🌾",
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: 2, name: "NPK Fertilizer 19-19-19", category: "Fertilizers",
    price: 1200, unit: "50kg bag", stock: 42, minStock: 50,
    status: "Low Stock", sku: "FRT-NPK-019", emoji: "🧪",
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 3, name: "Urea (46% Nitrogen)", category: "Fertilizers",
    price: 267, unit: "50kg bag", stock: 320, minStock: 80,
    status: "In Stock", sku: "FRT-URE-046", emoji: "🌿",
    color: "bg-green-50 text-green-700",
  },
  {
    id: 4, name: "Chlorpyrifos Insecticide", category: "Pesticides",
    price: 580, unit: "litre", stock: 0, minStock: 20,
    status: "Out of Stock", sku: "PST-CHL-500", emoji: "🛡️",
    color: "bg-red-50 text-red-700",
  },
  {
    id: 5, name: "Paddy Seeds (Pusa Basmati)", category: "Seeds",
    price: 180, unit: "kg", stock: 1200, minStock: 200,
    status: "In Stock", sku: "SED-RCE-PUS", emoji: "🌾",
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: 6, name: "Manual Seed Drill", category: "Tools & Equipment",
    price: 3500, unit: "piece", stock: 8, minStock: 5,
    status: "In Stock", sku: "TLS-DRL-001", emoji: "🔧",
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: 7, name: "Vermicompost (Organic)", category: "Organic",
    price: 12, unit: "kg", stock: 15, minStock: 50,
    status: "Low Stock", sku: "ORG-VRM-001", emoji: "🍂",
    color: "bg-lime-50 text-lime-700",
  },
  {
    id: 8, name: "Drip Irrigation Kit (1 acre)", category: "Tools & Equipment",
    price: 8500, unit: "kit", stock: 5, minStock: 3,
    status: "In Stock", sku: "TLS-DRP-001", emoji: "💧",
    color: "bg-cyan-50 text-cyan-700",
  },
];

const STATS = [
  { label: "Total Products", value: "1,284", change: "+12 this month", icon: Package, color: "text-green-600 bg-green-50" },
  { label: "Low Stock Alert", value: "18",   change: "Requires attention", icon: AlertTriangle, color: "text-amber-600 bg-amber-50", alert: true },
  { label: "Total Value",     value: "₹84,200", change: "Retail Estimate", icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
  { label: "Avg. Order Value",value: "₹142.50", change: "+10% from last month", icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
  { label: "Active Discounts",value: "12",   change: "On selected items", icon: Tag, color: "text-rose-600 bg-rose-50" },
];

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Stock":    "bg-green-50 text-green-700 border border-green-200",
    "Low Stock":   "bg-amber-50 text-amber-700 border border-amber-200",
    "Out of Stock":"bg-red-50 text-red-600 border border-red-200",
  };
  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${map[status]}`}>
      {status === "In Stock" && "● "}
      {status === "Low Stock" && "⚠ "}
      {status === "Out of Stock" && "✕ "}
      {status}
    </span>
  );
}

// ── Add Product Modal ─────────────────────────────────────────────────────────

function AddProductModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-800">Add New Product</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "Product Name", placeholder: "e.g. Hybrid Wheat Seeds" },
            { label: "SKU", placeholder: "e.g. SED-WHT-001" },
            { label: "Price (₹)", placeholder: "e.g. 245" },
            { label: "Stock Quantity", placeholder: "e.g. 500" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{f.label}</label>
              <input
                placeholder={f.placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green-400 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green-400 transition-colors">
              {CATEGORIES.filter(c => c !== "All Categories").map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-500 rounded-xl transition-colors">
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Inventory() {
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewMode, setViewMode]         = useState<"table" | "grid">("table");
  const [page, setPage]                 = useState(1);
  const [showModal, setShowModal]       = useState(false);
  const [toggles, setToggles]           = useState<Record<number, boolean>>(
    Object.fromEntries(PRODUCTS.map(p => [p.id, p.status !== "Out of Stock"]))
  );

  const PER_PAGE = 5;

  const filtered = PRODUCTS.filter(p => {
    if (category !== "All Categories" && p.category !== category) return false;
    if (statusFilter !== "All Status" && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleProduct = (id: number) =>
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Product Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">Organise and monitor your fertilizer inventory levels.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Inventory live badge */}
          <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Inventory Sync: Live
          </span>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="bg-slate-100 border-none text-sm font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-100 border-none text-sm font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
            <Search size={13} className="text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products, SKUs or categories..."
              className="bg-transparent outline-none text-sm text-slate-600 w-52 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Showing {filtered.length} of {PRODUCTS.length} products</span>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-slate-700" : "text-slate-400"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-slate-700" : "text-slate-400"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Table View ── */}
      {viewMode === "table" && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Product", "Category", "Price", "Stock Quantity", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  {/* Product */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${p.color}`}>
                        {p.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{p.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{p.category}</span>
                  </td>
                  {/* Price */}
                  <td className="px-5 py-3.5 text-sm font-extrabold text-slate-800">
                    ₹{p.price.toLocaleString()}
                    <span className="text-[11px] text-slate-400 font-normal ml-1">/ {p.unit}</span>
                  </td>
                  {/* Stock */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-700">{p.stock.toLocaleString()} <span className="text-slate-400 font-normal text-xs">{p.unit}s</span></span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.stock === 0 ? "bg-red-400" : p.stock < p.minStock ? "bg-amber-400" : "bg-green-500"}`}
                          style={{ width: `${Math.min((p.stock / (p.minStock * 5)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => toggleProduct(p.id)} className="p-1.5 transition-colors">
                        {toggles[p.id]
                          ? <ToggleRight size={20} className="text-green-600" />
                          : <ToggleLeft size={20} className="text-slate-300" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/40">
            <span className="text-xs text-slate-400 font-medium">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
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
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-400 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Grid View ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {paginated.map(p => (
            <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${p.color}`}>
                  {p.emoji}
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="font-extrabold text-sm text-slate-800 leading-tight mb-0.5">{p.name}</p>
              <p className="text-[11px] text-slate-400 font-mono mb-3">{p.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-800">₹{p.price.toLocaleString()}</span>
                <span className="text-xs text-slate-400">{p.stock} {p.unit}s left</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1">
                  <Edit2 size={11} /> Edit
                </button>
                <button onClick={() => toggleProduct(p.id)} className="flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 border border-slate-200">
                  {toggles[p.id]
                    ? <><ToggleRight size={13} className="text-green-600" /> Active</>
                    : <><ToggleLeft size={13} className="text-slate-400" /> Inactive</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Modal */}
      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
}