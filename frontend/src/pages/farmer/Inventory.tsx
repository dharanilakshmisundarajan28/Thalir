// PATH: src/pages/farmer/Inventory.tsx
// Farmer's produce management — fully connected to /api/farm/products
import { useState, useEffect, useCallback } from "react";
import {
  Search, Bell, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  Package, TrendingUp, ShoppingBag, RefreshCw,
  ChevronRight, LayoutGrid, List
} from "lucide-react";
import { farmProductService } from "../../services/Fertilizer.service";
import type { FarmProductResponse, FarmProductRequest } from "../../services/Fertilizer.service";

// ── Status helpers ─────────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 50;
type DisplayStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Inactive";

function getStatus(p: FarmProductResponse): DisplayStatus {
  if (!p.isActive) return "Inactive";
  if (p.stockQuantity === 0) return "Out of Stock";
  if (p.stockQuantity <= LOW_STOCK_THRESHOLD) return "Low Stock";
  return "In Stock";
}

const STATUS_STYLE: Record<DisplayStatus, string> = {
  "In Stock": "bg-green-50 text-green-700 border border-green-200",
  "Low Stock": "bg-amber-50 text-amber-700 border border-amber-200",
  "Out of Stock": "bg-red-50 text-red-600 border border-red-200",
  Inactive: "bg-slate-100 text-slate-500 border border-slate-200",
};

const CATEGORIES = [
  "All Categories", "VEGETABLES", "FRUITS", "GRAINS", "DAIRY", "ORGANIC", "HERBS", "ROOTS"
];

// ── Default form state ─────────────────────────────────────────────────────────
const DEFAULT_FORM: FarmProductRequest = {
  name: "", description: "", category: "VEGETABLES",
  price: 0, stockQuantity: 0, unit: "kg", imageUrl: "",
};

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 2000,
      background: type === "success" ? "#f0fdf4" : "#fef2f2",
      border: `1px solid ${type === "success" ? "#86efac" : "#fecaca"}`,
      color: type === "success" ? "#15803d" : "#dc2626",
      borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}>
      {type === "success" ? "✓" : "✕"} {msg}
    </div>
  );
}

// ── Product Form Modal ─────────────────────────────────────────────────────────
function ProductModal({
  editingProduct, onClose, onSaved,
}: {
  editingProduct: FarmProductResponse | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [form, setForm] = useState<FarmProductRequest>(
    editingProduct
      ? {
        name: editingProduct.name,
        description: editingProduct.description ?? "",
        category: editingProduct.category,
        price: editingProduct.price,
        stockQuantity: editingProduct.stockQuantity,
        unit: editingProduct.unit ?? "kg",
        imageUrl: editingProduct.imageUrl ?? "",
      }
      : DEFAULT_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Product name is required"); return; }
    if (form.price <= 0) { setError("Price must be greater than 0"); return; }
    setSaving(true);
    setError(null);
    try {
      if (editingProduct) {
        await farmProductService.update(editingProduct.id, form);
        onSaved("Product updated successfully");
      } else {
        await farmProductService.create(form);
        onSaved("Product added successfully");
      }
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const FIELDS: { key: keyof FarmProductRequest; label: string; type: string; placeholder: string }[] = [
    { key: "name", label: "Product Name *", type: "text", placeholder: "e.g. Tomatoes" },
    { key: "description", label: "Description", type: "text", placeholder: "Brief description of product" },
    { key: "price", label: "Price per unit (₹)", type: "number", placeholder: "e.g. 40" },
    { key: "stockQuantity", label: "Stock Quantity", type: "number", placeholder: "e.g. 500" },
    { key: "unit", label: "Unit", type: "text", placeholder: "kg / litre / piece" },
    { key: "imageUrl", label: "Image URL", type: "text", placeholder: "https://..." },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-800">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>

        <div className="flex flex-col gap-3">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={String((form as any)[f.key] ?? "")}
                onChange={e => setForm(prev => ({
                  ...prev,
                  [f.key]: f.type === "number" ? (parseFloat(e.target.value) || 0) : e.target.value,
                }))}
                min={f.type === "number" ? "0" : undefined}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green-400 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green-400 transition-colors"
            >
              {CATEGORIES.filter(c => c !== "All Categories").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-500 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? "Saving…" : editingProduct ? "Save Changes" : "Add Product"}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DisplayStatus }) {
  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLE[status]}`}>
      {status === "In Stock" && "● "}
      {status === "Low Stock" && "⚠ "}
      {status === "Out of Stock" && "✕ "}
      {status}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Inventory() {
  const [products, setProducts] = useState<FarmProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FarmProductResponse | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmProductService.getMyProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    if (category !== "All Categories" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (p: FarmProductResponse) => {
    setToggling(p.id);
    try {
      if (p.isActive) {
        await farmProductService.deactivate(p.id);
        showToast(`"${p.name}" deactivated`, "success");
      } else {
        await farmProductService.update(p.id, {
          name: p.name, description: p.description,
          category: p.category, price: p.price,
          stockQuantity: p.stockQuantity, unit: p.unit, imageUrl: p.imageUrl,
        });
        showToast(`"${p.name}" reactivated`, "success");
      }
      fetchProducts();
    } catch (e: any) {
      showToast(e.message || "Failed to update status", "error");
    } finally {
      setToggling(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (p: FarmProductResponse) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    try {
      await farmProductService.delete(p.id);
      showToast(`"${p.name}" deleted`, "success");
      fetchProducts();
    } catch (e: any) {
      showToast(e.message || "Failed to delete", "error");
    } finally {
      setDeleting(null);
    }
  };

  // ── Stats derived from current data ───────────────────────────────────────
  const inStockCount = products.filter(p => p.isActive && p.stockQuantity > 0).length;
  const lowStockCount = products.filter(p => p.isActive && p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD).length;
  const totalValue = products.reduce((s, p) => s + p.price * p.stockQuantity, 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-green-600 bg-green-50", alert: false },
    { label: "In Stock", value: inStockCount, icon: ShoppingBag, color: "text-blue-600 bg-blue-50", alert: false },
    { label: "Low Stock", value: lowStockCount, icon: TrendingUp, color: "text-amber-600 bg-amber-50", alert: lowStockCount > 0 },
    { label: "Inventory Value", value: `₹${totalValue.toLocaleString()}`, icon: TrendingUp, color: "text-purple-600 bg-purple-50", alert: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">My Farm Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your farm produce listings visible to consumers.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Live
          </span>
          <button onClick={fetchProducts} disabled={loading}
            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={14} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
          <button
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold flex justify-between">
          <span>⚠ {error}</span>
          <button onClick={fetchProducts} className="font-bold hover:underline">Retry</button>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-4 gap-4">
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

          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
            <Search size={13} className="text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm text-slate-600 w-48 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Showing {filtered.length} of {products.length} products</span>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-slate-700" : "text-slate-400"}`}>
              <List size={14} />
            </button>
            <button onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-slate-700" : "text-slate-400"}`}>
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 flex items-center justify-center shadow-sm">
          <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && !error && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 flex flex-col items-center text-slate-300 shadow-sm gap-3">
          <Package size={48} />
          <p className="text-sm font-bold text-slate-500">No products found</p>
          <p className="text-xs text-slate-400">Add your first product to get started</p>
        </div>
      )}

      {/* ── Table view ── */}
      {!loading && viewMode === "table" && paginated.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const status = getStatus(p);
                const isDeleting = deleting === p.id;
                const isToggling = toggling === p.id;
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors" style={{ opacity: isDeleting ? 0.4 : 1 }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-xl shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt="" className="w-7 h-7 object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : "🥬"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{p.name}</p>
                          {p.description && <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{p.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-extrabold text-slate-800">
                      ₹{Number(p.price).toFixed(2)}
                      <span className="text-[11px] text-slate-400 font-normal ml-1">/ {p.unit || "unit"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700">
                          {p.stockQuantity.toLocaleString()} <span className="text-slate-400 font-normal text-xs">{p.unit}s</span>
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p.stockQuantity === 0 ? "bg-red-400" : p.stockQuantity <= LOW_STOCK_THRESHOLD ? "bg-amber-400" : "bg-green-500"}`}
                            style={{ width: `${Math.min((p.stockQuantity / (LOW_STOCK_THRESHOLD * 5)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingProduct(p); setShowModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p)} disabled={isDeleting}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          <Trash2 size={14} />
                        </button>
                        <button onClick={() => handleToggle(p)} disabled={isToggling} className="p-1.5 transition-colors disabled:opacity-50">
                          {p.isActive
                            ? <ToggleRight size={20} className="text-green-600" />
                            : <ToggleLeft size={20} className="text-slate-300" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/40">
            <span className="text-xs text-slate-400 font-medium">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${page === i + 1 ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-green-400"
                    }`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-400 disabled:opacity-40 transition-colors">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Grid view ── */}
      {!loading && viewMode === "grid" && paginated.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {paginated.map(p => {
            const status = getStatus(p);
            return (
              <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-xl">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="w-8 h-8 object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : "🥬"}
                  </div>
                  <StatusBadge status={status} />
                </div>
                <p className="font-extrabold text-sm text-slate-800 leading-tight mb-0.5">{p.name}</p>
                <p className="text-[11px] text-slate-400 mb-3">{p.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-800">₹{Number(p.price).toFixed(2)}</span>
                  <span className="text-xs text-slate-400">{p.stockQuantity} {p.unit}s left</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setEditingProduct(p); setShowModal(true); }}
                    className="flex-1 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1">
                    <Edit2 size={11} /> Edit
                  </button>
                  <button onClick={() => handleToggle(p)} disabled={toggling === p.id}
                    className="flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 border border-slate-200">
                    {p.isActive
                      ? <><ToggleRight size={13} className="text-green-600" /> Active</>
                      : <><ToggleLeft size={13} className="text-slate-400" /> Inactive</>
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          editingProduct={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSaved={msg => { showToast(msg, "success"); fetchProducts(); }}
        />
      )}
    </div>
  );
}