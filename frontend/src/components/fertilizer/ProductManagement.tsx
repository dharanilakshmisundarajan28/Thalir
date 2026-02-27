import { useState, useEffect, useCallback } from "react";
import type { CSSProperties } from "react";
import { productService } from "../../services/Fertilizer.service";
import type { ProductResponse, ProductRequest, Page } from "../../services/Fertilizer.service";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type CategoryKey = "NITROGEN" | "ORGANIC" | "LIQUID-FREE" | "SYNTHETIC" | string;

// Derive display status from backend fields
type DisplayStatus = "Active" | "Low Stock" | "Out of Stock" | "Inactive";

interface FormState {
  name: string;
  description: string;
  brand: string;
  sku: string;         // mapped to brand field visually as SKU identifier
  category: CategoryKey;
  price: string;
  stockQuantity: string;
  minimumStock: string; // local-only threshold (not in backend, stored in component)
  unit: string;
  imageUrl: string;
}

/* ─── Badge & Status Config ─────────────────────────────────────────────────── */
const CATEGORY_BADGES: Record<string, { label: string; bg: string; color: string }> = {
  NITROGEN:     { label: "NITROGEN",     bg: "#e8f5e9", color: "#2e7d32" },
  ORGANIC:      { label: "ORGANIC",      bg: "#fff3e0", color: "#e65100" },
  "LIQUID-FREE":{ label: "LIQUID-FREE",  bg: "#e8f5e9", color: "#2e7d32" },
  SYNTHETIC:    { label: "SYNTHETIC",    bg: "#fce4ec", color: "#c62828" },
};
const getBadge = (cat: string) =>
  CATEGORY_BADGES[cat] ?? { label: cat.toUpperCase(), bg: "#f3f4f6", color: "#374151" };

const STATUS_STYLES: Record<DisplayStatus, { dot: string; label: string; color: string }> = {
  Active:         { dot: "#22c55e", label: "In Stock",     color: "#15803d" },
  "Low Stock":    { dot: "#f59e0b", label: "Low Stock",    color: "#b45309" },
  "Out of Stock": { dot: "#ef4444", label: "Out of Stock", color: "#b91c1c" },
  Inactive:       { dot: "#9ca3af", label: "Inactive",     color: "#6b7280" },
};

const LOW_STOCK_THRESHOLD = 50; // default minimum stock if not overridden

const deriveStatus = (p: ProductResponse, minStock: number): DisplayStatus => {
  if (!p.isActive) return "Inactive";
  if (p.stockQuantity === 0) return "Out of Stock";
  if (p.stockQuantity <= minStock) return "Low Stock";
  return "Active";
};

/* ─── Default Form ───────────────────────────────────────────────────────────── */
const DEFAULT_FORM: FormState = {
  name: "", description: "", brand: "", sku: "",
  category: "NITROGEN", price: "", stockQuantity: "",
  minimumStock: String(LOW_STOCK_THRESHOLD), unit: "kg", imageUrl: "",
};

/* ─── CSS Helpers ────────────────────────────────────────────────────────────── */
const th = (): CSSProperties => ({
  padding: "0.6rem 1rem", textAlign: "left", fontSize: 11, fontWeight: 700,
  color: "#6b7280", letterSpacing: "0.05em", whiteSpace: "nowrap",
});
const td = (): CSSProperties => ({
  padding: "0.75rem 1rem", fontSize: 13, color: "#374151", verticalAlign: "middle",
});
const iconBtn = (bg: string): CSSProperties => ({
  background: bg, border: "none", borderRadius: 7, width: 30, height: 30,
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
});

/* ─── Inline notification ────────────────────────────────────────────────────── */
interface Toast { msg: string; type: "success" | "error" }

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export default function ProductManagement() {
  /* ── State ── */
  const [page, setPage]               = useState<Page<ProductResponse> | null>(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState<number | null>(null);
  const [toggling, setToggling]       = useState<number | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [toast, setToast]             = useState<Toast | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [viewMode, setViewMode]       = useState<"grid" | "list">("list");
  const [showModal, setShowModal]     = useState(false);
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [form, setForm]               = useState<FormState>(DEFAULT_FORM);
  // Local map of productId → minimumStock (not stored in backend)
  const [minStockMap, setMinStockMap] = useState<Record<number, number>>({});

  const PAGE_SIZE = 10;

  /* ── Toast helper ── */
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch ── */
  const fetchProducts = useCallback(async (pg = 0, keyword = "", category = "") => {
    setLoading(true);
    setError(null);
    try {
      let data: Page<ProductResponse>;
      if (keyword.trim()) {
        data = await productService.search(keyword.trim(), pg, PAGE_SIZE);
      } else if (category && category !== "All Categories") {
        data = await productService.getByCategory(category, pg, PAGE_SIZE);
      } else {
        data = await productService.getAll(pg, PAGE_SIZE);
      }
      setPage(data);
      setCurrentPage(pg);
    } catch (e: any) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(0); }, [fetchProducts]);

  /* ── Debounced search ── */
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => fetchProducts(0, val, filterCategory), 400));
  };

  /* ── Category filter ── */
  const handleCategoryFilter = (cat: string) => {
    setFilterCategory(cat);
    fetchProducts(0, searchQuery, cat);
  };

  /* ── Open modal for create ── */
  const openCreate = () => {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  /* ── Open modal for edit ── */
  const openEdit = (p: ProductResponse) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      brand: p.brand ?? "",
      sku: p.brand ?? "",          // brand doubles as the SKU display label
      category: p.category,
      price: String(p.price),
      stockQuantity: String(p.stockQuantity),
      minimumStock: String(minStockMap[p.id] ?? LOW_STOCK_THRESHOLD),
      unit: p.unit ?? "kg",
      imageUrl: p.imageUrl ?? "",
    });
    setShowModal(true);
  };

  /* ── Save (create or update) ── */
  const saveProduct = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try {
      const payload: ProductRequest = {
        name: form.name.trim(),
        description: form.description.trim(),
        brand: form.brand.trim() || form.sku.trim(),
        category: form.category,
        price: parseFloat(form.price) || 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        unit: form.unit.trim() || "kg",
        imageUrl: form.imageUrl.trim(),
      };

      if (editingId !== null) {
        await productService.update(editingId, payload);
        // persist local minStock
        setMinStockMap(prev => ({ ...prev, [editingId]: parseInt(form.minimumStock) || LOW_STOCK_THRESHOLD }));
        showToast("Product updated successfully", "success");
      } else {
        const created = await productService.create(payload);
        setMinStockMap(prev => ({ ...prev, [created.id]: parseInt(form.minimumStock) || LOW_STOCK_THRESHOLD }));
        showToast("Product created successfully", "success");
      }

      setShowModal(false);
      setEditingId(null);
      fetchProducts(currentPage, searchQuery, filterCategory);
    } catch (e: any) {
      showToast(e.message || "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
const deleteProduct = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  setDeleting(id);
  try {
    await productService.delete(id);
    showToast("Product deleted", "success");
    fetchProducts(currentPage, searchQuery, filterCategory);
  } catch (e: any) {
    showToast(e.message || "Delete failed", "error");
  } finally {
    setDeleting(null);
  }
};

  /* ── Toggle active/inactive ── */
  const toggleActive = async (p: ProductResponse) => {
    setToggling(p.id);
    try {
      if (p.isActive) {
        await productService.deactivate(p.id);
        showToast(`"${p.name}" deactivated`, "success");
      } else {
        // Re-activate: update with same data, isActive is controlled server-side by deactivate endpoint.
        // We re-PUT the product which resets isActive=true in the backend service.
        await productService.update(p.id, {
          name: p.name, description: p.description, brand: p.brand,
          category: p.category, price: p.price, stockQuantity: p.stockQuantity,
          unit: p.unit, imageUrl: p.imageUrl,
        });
        showToast(`"${p.name}" reactivated`, "success");
      }
      fetchProducts(currentPage, searchQuery, filterCategory);
    } catch (e: any) {
      showToast(e.message || "Failed to update status", "error");
    } finally {
      setToggling(null);
    }
  };

  /* ── Derived ── */
  const products = page?.content ?? [];
  const lowStockCount = products.filter(p => {
    const min = minStockMap[p.id] ?? LOW_STOCK_THRESHOLD;
    return p.isActive && p.stockQuantity > 0 && p.stockQuantity <= min;
  }).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);
  const avgPrice   = products.length ? products.reduce((s, p) => s + p.price, 0) / products.length : 0;

  const CATEGORIES = ["All Categories", "NITROGEN", "ORGANIC", "LIQUID-FREE", "SYNTHETIC"];

  const FORM_FIELDS: { key: keyof FormState; label: string; type: string }[] = [
    { key: "name",          label: "Product Name",   type: "text"   },
    { key: "brand",         label: "Brand",          type: "text"   },
    { key: "description",   label: "Description",    type: "text"   },
    { key: "price",         label: "Price (₹)",       type: "number" },
    { key: "stockQuantity", label: "Stock Quantity",  type: "number" },
    { key: "minimumStock",  label: "Minimum Stock",  type: "number" },
    { key: "unit",          label: "Unit (kg/L/bag)", type: "text"   },
    { key: "imageUrl",      label: "Image URL",      type: "text"   },
  ];

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f4f6f8", overflow: "hidden" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#86efac" : "#fecaca"}`,
          color: toast.type === "success" ? "#15803d" : "#dc2626",
          borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8,
        }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── Top bar ── */}
        <div style={{ background: "#fff", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ background: "#f3f4f6", borderRadius: 8, padding: "0.45rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", width: 320 }}>
            <span style={{ color: "#9ca3af" }}>🔍</span>
            <input
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#374151", width: "100%" }}
            />
            {loading && searchQuery && <span style={{ fontSize: 11, color: "#9ca3af" }}>…</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: 12, color: "#2e7d32", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf50", display: "inline-block" }} />
              Inventory Sync: Live ↻
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem", flex: 1 }}>

          {/* ── Page header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Product Management</h1>
              <p style={{ margin: "0.2rem 0 0", color: "#6b7280", fontSize: 13 }}>
                {page ? `${page.totalElements} products across ${page.totalPages} page${page.totalPages !== 1 ? "s" : ""}` : "Loading…"}
              </p>
            </div>
            <button onClick={openCreate} style={{
              background: "#2e7d32", color: "#fff", border: "none", borderRadius: 10,
              padding: "0.6rem 1.25rem", fontWeight: 600, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}>✚ Add New Product</button>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⚠ {error}</span>
              <button onClick={() => fetchProducts(currentPage, searchQuery, filterCategory)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Retry</button>
            </div>
          )}

          {/* ── Filters + view toggle ── */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "0.75rem 1rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <select
                value={filterCategory}
                onChange={e => handleCategoryFilter(e.target.value)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.35rem 0.7rem", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer" }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                Showing {products.length} of {page?.totalElements ?? 0}
              </span>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {(["grid", "list"] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    border: "1px solid #e5e7eb", borderRadius: 6, padding: "0.3rem 0.5rem",
                    background: viewMode === mode ? "#2e7d32" : "#fff",
                    color: viewMode === mode ? "#fff" : "#6b7280", cursor: "pointer", fontSize: 14,
                  }}>{mode === "grid" ? "⊞" : "☰"}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "2rem", textAlign: "center", color: "#9ca3af", fontSize: 13, marginBottom: "1rem" }}>
              <div style={{ width: 28, height: 28, border: "3px solid #2e7d32", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
              Loading products…
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && products.length === 0 && !error && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "3rem", textAlign: "center", color: "#9ca3af", marginBottom: "1rem" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No products found</div>
              <div style={{ fontSize: 13 }}>Try a different search or add your first product.</div>
            </div>
          )}

          {/* ── TABLE ── */}
          {!loading && products.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "1rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={th()}><input type="checkbox" /></th>
                    <th style={th()}>PRODUCT</th>
                    <th style={th()}>CATEGORY</th>
                    <th style={th()}>PRICE</th>
                    <th style={th()}>STOCK</th>
                    <th style={th()}>STATUS</th>
                    <th style={th()}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => {
                    const badge   = getBadge(p.category);
                    const minStock = minStockMap[p.id] ?? LOW_STOCK_THRESHOLD;
                    const status  = deriveStatus(p, minStock);
                    const stat    = STATUS_STYLES[status];
                    const isLow   = status === "Low Stock";
                    const isOut   = status === "Out of Stock";
                    const isDeleting = deleting === p.id;
                    const isToggling = toggling === p.id;

                    return (
                      <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? "1px solid #f3f4f6" : "none", opacity: isDeleting ? 0.4 : 1, transition: "opacity 0.2s" }}>
                        <td style={td()}><input type="checkbox" /></td>

                        {/* Product name + brand */}
                        <td style={td()}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                            <div style={{ width: 38, height: 38, borderRadius: 8, background: badge.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                              {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 6 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : "🌿"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: "#9ca3af" }}>{p.brand || p.sellerName}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={td()}>
                          <span style={{ background: badge.bg, color: badge.color, fontSize: 10, fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 4, letterSpacing: "0.05em" }}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Price */}
                        <td style={td()}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>₹{p.price.toFixed(2)}</span>
                          {p.unit && <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 3 }}>/{p.unit}</span>}
                        </td>

                        {/* Stock */}
                        <td style={td()}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span style={{ fontSize: 13, color: isOut ? "#ef4444" : isLow ? "#f59e0b" : "#111827", fontWeight: 500 }}>
                              {p.stockQuantity} {p.unit || "units"}
                            </span>
                            {isLow && <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700 }}>▲ Low</span>}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={td()}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: stat.dot, display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: stat.color, fontWeight: 500 }}>{stat.label}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={td()}>
                          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                            <button onClick={() => openEdit(p)} title="Edit" style={iconBtn("#eff6ff")}>✏️</button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              disabled={isDeleting}
                              title="Delete"
                              style={{ ...iconBtn("#fef2f2"), opacity: isDeleting ? 0.5 : 1 }}
                            >🗑️</button>

                            {/* Active toggle */}
                            <div
                              onClick={() => !isToggling && toggleActive(p)}
                              title={p.isActive ? "Deactivate" : "Activate"}
                              style={{
                                width: 36, height: 20, borderRadius: 10,
                                background: p.isActive ? "#22c55e" : "#d1d5db",
                                position: "relative", cursor: isToggling ? "wait" : "pointer",
                                transition: "background 0.2s", flexShrink: 0,
                                opacity: isToggling ? 0.6 : 1,
                              }}
                            >
                              <div style={{
                                width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                position: "absolute", top: 2,
                                left: p.isActive ? 18 : 2,
                                transition: "left 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ── Pagination ── */}
              {page && page.totalPages > 1 && (
                <div style={{ padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    <button
                      disabled={currentPage === 0}
                      onClick={() => fetchProducts(currentPage - 1, searchQuery, filterCategory)}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: currentPage === 0 ? "not-allowed" : "pointer", opacity: currentPage === 0 ? 0.4 : 1 }}
                    >‹</button>

                    {Array.from({ length: page.totalPages }, (_, i) => (
                      <button key={i} onClick={() => fetchProducts(i, searchQuery, filterCategory)} style={{
                        width: 28, height: 28, borderRadius: 6,
                        border: `1px solid ${i === currentPage ? "#2e7d32" : "#e5e7eb"}`,
                        background: i === currentPage ? "#2e7d32" : "#fff",
                        color: i === currentPage ? "#fff" : "#374151",
                        fontSize: 12, cursor: "pointer", fontWeight: i === currentPage ? 700 : 400,
                      }}>{i + 1}</button>
                    ))}

                    <button
                      disabled={currentPage >= page.totalPages - 1}
                      onClick={() => fetchProducts(currentPage + 1, searchQuery, filterCategory)}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: currentPage >= page.totalPages - 1 ? "not-allowed" : "pointer", opacity: currentPage >= page.totalPages - 1 ? 0.4 : 1 }}
                    >›</button>
                  </div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>PAGE {currentPage + 1} OF {page.totalPages}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Stats Row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {[
              { label: "TOTAL PRODUCTS",  value: page?.totalElements ?? 0,           sub: `${products.length} on this page`,  icon: "📦", iconBg: "#e8f5e9", subColor: "#22c55e" },
              { label: "LOW STOCK ALERT", value: lowStockCount,                       sub: "Requires attention",                icon: "⚠️", iconBg: "#fff8e1", subColor: "#f59e0b" },
              { label: "PAGE VALUE",      value: `₹${totalValue.toLocaleString()}`,   sub: "Stock × price",                    icon: "💰", iconBg: "#e8f5e9", subColor: "#6b7280" },
              { label: "AVG. PRICE",      value: `₹${avgPrice.toFixed(2)}`,           sub: "Across this page",                 icon: "📈", iconBg: "#e8f5e9", subColor: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1rem 1.1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.subColor, marginTop: "0.2rem" }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ══ MODAL ══ */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => { setShowModal(false); setEditingId(null); }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", width: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: 17, fontWeight: 700, color: "#111827" }}>
              {editingId !== null ? "Edit Product" : "Add New Product"}
            </h3>

            {FORM_FIELDS.map(f => (
              <div key={f.key} style={{ marginBottom: "0.85rem" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: "0.3rem" }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  min={f.type === "number" ? "0" : undefined}
                />
              </div>
            ))}

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: "0.3rem" }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13 }}
              >
                {["NITROGEN", "ORGANIC", "LIQUID-FREE", "SYNTHETIC"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={saveProduct}
                disabled={saving || !form.name.trim() || !form.price}
                style={{ flex: 1, background: saving ? "#6b7280" : "#2e7d32", color: "#fff", border: "none", borderRadius: 10, padding: "0.65rem", fontWeight: 600, fontSize: 13, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {saving && <span style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />}
                {saving ? "Saving…" : editingId !== null ? "Save Changes" : "Add Product"}
              </button>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); }}
                style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "0.65rem", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}