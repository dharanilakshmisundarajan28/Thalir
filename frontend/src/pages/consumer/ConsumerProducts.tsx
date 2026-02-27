// src/components/consumer/ConsumerProducts.tsx

import { useState, useEffect, useCallback } from "react";
import { farmProductService, farmCartService } from "../../services/Fertilizer.service";
import type { FarmProductResponse, Page } from "../../services/Fertilizer.service";

const CATEGORIES = ["All", "VEGETABLE", "FRUIT", "GRAIN", "DAIRY", "HERB", "OTHER"];
const PAGE_SIZE = 12;

const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
  VEGETABLE: { bg: "#dcfce7", color: "#15803d" },
  FRUIT:     { bg: "#fef9c3", color: "#b45309" },
  GRAIN:     { bg: "#fef3c7", color: "#92400e" },
  DAIRY:     { bg: "#dbeafe", color: "#1d4ed8" },
  HERB:      { bg: "#f3e8ff", color: "#7e22ce" },
  OTHER:     { bg: "#f3f4f6", color: "#374151" },
};

export default function ConsumerProducts() {
  const [page, setPage]           = useState<Page<FarmProductResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [category, setCategory]   = useState("All");
  const [addingId, setAddingId]   = useState<number | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchProducts = useCallback(async (pg = 0, kw = "", cat = "") => {
    setLoading(true);
    setError(null);
    try {
      let data: Page<FarmProductResponse>;
      if (kw.trim()) {
        data = await farmProductService.search(kw.trim(), pg, PAGE_SIZE);
      } else if (cat && cat !== "All") {
        data = await farmProductService.getByCategory(cat, pg, PAGE_SIZE);
      } else {
        data = await farmProductService.getAll(pg, PAGE_SIZE);
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

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => fetchProducts(0, val, category), 400));
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    fetchProducts(0, search, cat);
  };

  const handleAddToCart = async (product: FarmProductResponse) => {
    const qty = quantities[product.id] ?? 1;
    setAddingId(product.id);
    try {
      await farmCartService.addItem(product.id, qty);
      showToast(`Added ${qty} ${product.unit || "unit(s)"} of "${product.name}" to cart`, "success");
    } catch (e: any) {
      showToast(e.message || "Failed to add to cart", "error");
    } finally {
      setAddingId(null);
    }
  };

  const products = page?.content ?? [];

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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Fresh from Farmers</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
          {page ? `${page.totalElements} products available` : "Browse fresh produce directly from local farmers"}
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 380 }}>
          <span style={{ color: "#9ca3af" }}>🔍</span>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search vegetables, fruits, grains..."
            style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%", background: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)} style={{
              border: `1px solid ${category === cat ? "#16a34a" : "#e5e7eb"}`,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600,
              background: category === cat ? "#16a34a" : "#fff",
              color: category === cat ? "#fff" : "#374151", cursor: "pointer",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>⚠ {error}</span>
          <button onClick={() => fetchProducts(currentPage, search, category)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #16a34a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading products…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && products.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No products found</p>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Try a different search or category.</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          {products.map(product => {
            const catStyle = CATEGORY_STYLE[product.category] ?? CATEGORY_STYLE.OTHER;
            const isAdding = addingId === product.id;
            const qty = quantities[product.id] ?? 1;
            const isOut = product.stockQuantity === 0;
            return (
              <div key={product.id} style={{
                background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
                overflow: "hidden", display: "flex", flexDirection: "column",
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Image */}
                <div style={{ height: 140, background: catStyle.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : "🌿"
                  }
                  <span style={{ position: "absolute", top: 10, left: 10, background: catStyle.bg, color: catStyle.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.04em" }}>
                    {product.category}
                  </span>
                  {isOut && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "14px 14px 10px", flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 2 }}>{product.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>by {product.farmerName}</div>
                  {product.description && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                      {product.description}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>₹{Number(product.price).toFixed(2)}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>/{product.unit || "unit"}</span>
                    </div>
                    <span style={{ fontSize: 11, color: isOut ? "#ef4444" : product.stockQuantity <= 10 ? "#f59e0b" : "#16a34a", fontWeight: 600 }}>
                      {isOut ? "Out" : `${product.stockQuantity} left`}
                    </span>
                  </div>
                </div>

                {/* Add to cart */}
                <div style={{ padding: "0 14px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <button onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.max(1, (prev[product.id] ?? 1) - 1) }))}
                      style={{ width: 28, background: "#f9fafb", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#374151" }}>−</button>
                    <span style={{ width: 32, textAlign: "center", lineHeight: "28px", fontSize: 13, fontWeight: 600 }}>{qty}</span>
                    <button onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.min(product.stockQuantity, (prev[product.id] ?? 1) + 1) }))}
                      style={{ width: 28, background: "#f9fafb", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#374151" }}>+</button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdding || isOut}
                    style={{
                      flex: 1, background: isOut ? "#e5e7eb" : "#16a34a", color: isOut ? "#9ca3af" : "#fff",
                      border: "none", borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 700,
                      cursor: isOut || isAdding ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}
                  >
                    {isAdding
                      ? <span style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />
                      : "🛒 Add"
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {page && page.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button disabled={currentPage === 0} onClick={() => fetchProducts(currentPage - 1, search, category)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: currentPage === 0 ? "not-allowed" : "pointer", opacity: currentPage === 0 ? 0.4 : 1 }}>‹</button>
          {Array.from({ length: page.totalPages }, (_, i) => (
            <button key={i} onClick={() => fetchProducts(i, search, category)} style={{
              width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: i === currentPage ? 700 : 400,
              border: `1px solid ${i === currentPage ? "#16a34a" : "#e5e7eb"}`,
              background: i === currentPage ? "#16a34a" : "#fff",
              color: i === currentPage ? "#fff" : "#374151", cursor: "pointer",
            }}>{i + 1}</button>
          ))}
          <button disabled={currentPage >= page.totalPages - 1} onClick={() => fetchProducts(currentPage + 1, search, category)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: currentPage >= page.totalPages - 1 ? "not-allowed" : "pointer", opacity: currentPage >= page.totalPages - 1 ? 0.4 : 1 }}>›</button>
        </div>
      )}
    </div>
  );
}