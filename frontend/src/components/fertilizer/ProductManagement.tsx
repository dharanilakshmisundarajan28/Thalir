import { useState } from "react";
import type { CSSProperties } from "react";


/* ---------------- TYPES ---------------- */
type CategoryKey = 'NITROGEN' | 'ORGANIC' | 'LIQUID-FREE' | 'SYNTHETIC';
type StatusKey = 'Active' | 'Low Stock' | 'Out of Stock';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: CategoryKey;
  price: number;
  quantity: number;
  minimumStock: number;
  status: StatusKey;
  enabled: boolean;
}

interface FormState {
  name: string;
  sku: string;
  category: CategoryKey;
  price: string;
  quantity: string;
  minimumStock: string;
  status: StatusKey;
}

/* ---------------- DATA ---------------- */
const CATEGORY_BADGES: Record<CategoryKey, { label: string; bg: string; color: string }> = {
  NITROGEN: { label: 'NITROGEN', bg: '#e8f5e9', color: '#2e7d32' },
  ORGANIC: { label: 'ORGANIC', bg: '#fff3e0', color: '#e65100' },
  'LIQUID-FREE': { label: 'LIQUID-FREE', bg: '#e8f5e9', color: '#2e7d32' },
  SYNTHETIC: { label: 'SYNTHETIC', bg: '#fce4ec', color: '#c62828' },
};

const STATUS_STYLES: Record<StatusKey, { dot: string; label: string; color: string }> = {
  Active: { dot: '#22c55e', label: 'In Stock', color: '#15803d' },
  'Low Stock': { dot: '#f59e0b', label: 'Low Stock', color: '#b45309' },
  'Out of Stock': { dot: '#ef4444', label: 'Out of Stock', color: '#b91c1c' },
};

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'NitroMax 500 Plus', sku: 'NIT-001-2024', category: 'NITROGEN', price: 45.0, quantity: 450, minimumStock: 50, status: 'Active', enabled: true },
  { id: 2, name: 'Premium Bio-Compost', sku: 'BIO-VRT-002', category: 'ORGANIC', price: 29.9, quantity: 32, minimumStock: 50, status: 'Low Stock', enabled: true },
  { id: 3, name: 'Liquid Bloom Feed (5L)', sku: 'HES-2024-001', category: 'LIQUID-FREE', price: 52.5, quantity: 11, minimumStock: 20, status: 'Out of Stock', enabled: false },
  { id: 4, name: 'Synthetic NPK 15-15-15', sku: 'NPK-2024-001', category: 'SYNTHETIC', price: 38.0, quantity: 390, minimumStock: 50, status: 'Active', enabled: true },
];

const DEFAULT_FORM: FormState = {
  name: '', sku: '', category: 'NITROGEN', price: '', quantity: '', minimumStock: '', status: 'Active',
};

/* ---------------- HELPERS ---------------- */
function th(): CSSProperties {
  return { padding: '0.6rem 1rem', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
}
function td(): CSSProperties {
  return { padding: '0.75rem 1rem', fontSize: 13, color: '#374151', verticalAlign: 'middle' };
}
function iconBtn(bg: string): CSSProperties {
  return { background: bg, border: 'none', borderRadius: 7, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 };
}

/* ---------------- COMPONENT ---------------- */
export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const resetForm = () => { setForm(DEFAULT_FORM); setEditingId(null); };

  const saveProduct = () => {
    if (!form.name || !form.sku) return;
    if (editingId !== null) {
      setProducts(prev => prev.map(p =>
        p.id === editingId
          ? { ...p, ...form, price: +form.price, quantity: +form.quantity, minimumStock: +form.minimumStock }
          : p
      ));
    } else {
      const newProduct: Product = {
        id: Date.now(),
        enabled: true,
        name: form.name,
        sku: form.sku,
        category: form.category,
        status: form.status,
        price: +form.price,
        quantity: +form.quantity,
        minimumStock: +form.minimumStock,
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowModal(false);
    resetForm();
  };

  const editProduct = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, sku: p.sku, category: p.category, price: String(p.price), quantity: String(p.quantity), minimumStock: String(p.minimumStock), status: p.status });
    setShowModal(true);
  };

  const deleteProduct = (id: number) => setProducts(prev => prev.filter(p => p.id !== id));
  const toggleEnabled = (id: number) => setProducts(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));

  const lowStock = products.filter(p => p.status === 'Low Stock').length;

  const FORM_FIELDS: { key: keyof FormState; label: string; type: string }[] = [
    { key: 'name', label: 'Product Name', type: 'text' },
    { key: 'sku', label: 'SKU', type: 'text' },
    { key: 'price', label: 'Price ($)', type: 'number' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'minimumStock', label: 'Minimum Stock', type: 'number' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f4f6f8', overflow: 'hidden' }}>
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ background: '#fff', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 280 }}>
            <span style={{ color: '#9ca3af' }}>🔍</span>
            <input placeholder="Search products, SKUs, or categories..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#374151', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: 12, color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }}></span>
              Inventory Sync: Live ↻
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', flex: 1 }}>
          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Product Management</h1>
              <p style={{ margin: '0.2rem 0 0', color: '#6b7280', fontSize: 13 }}>Organize and monitor your fertilizer inventory levels.</p>
            </div>
            <button onClick={() => { resetForm(); setShowModal(true); }} style={{
              background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1.25rem',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              ✚ Add New Product
            </button>
          </div>

          {/* Filters + view toggle */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '0.75rem 1rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['All Categories', 'Stock Status'].map(f => (
                <select key={f} defaultValue={f} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.35rem 0.7rem', fontSize: 12, color: '#374151', background: '#fff', cursor: 'pointer' }}>
                  <option>{f}</option>
                </select>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Showing {products.length} of 128 products</span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {(['grid', 'list'] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.3rem 0.5rem',
                    background: viewMode === mode ? '#2e7d32' : '#fff',
                    color: viewMode === mode ? '#fff' : '#6b7280', cursor: 'pointer', fontSize: 14
                  }}>
                    {mode === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={th()}><input type="checkbox" /></th>
                  <th style={th()}>PRODUCT</th>
                  <th style={th()}>CATEGORY</th>
                  <th style={th()}>PRICE</th>
                  <th style={th()}>STOCK QUANTITY</th>
                  <th style={th()}>STATUS</th>
                  <th style={th()}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const badge = CATEGORY_BADGES[p.category] ?? { label: p.category, bg: '#f3f4f6', color: '#374151' };
                  const stat = STATUS_STYLES[p.status] ?? STATUS_STYLES['Active'];
                  const isLow = p.quantity <= p.minimumStock && p.quantity > 0;
                  const isOut = p.quantity === 0;
                  return (
                    <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <td style={td()}><input type="checkbox" /></td>
                      <td style={td()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                          <div style={{ width: 38, height: 38, borderRadius: 8, background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td style={td()}>
                        <span style={{ background: badge.bg, color: badge.color, fontSize: 10, fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4, letterSpacing: '0.05em' }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={td()}><span style={{ fontWeight: 600, fontSize: 13 }}>${p.price.toFixed(2)}</span></td>
                      <td style={td()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: 13, color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#111827', fontWeight: 500 }}>
                            {p.quantity} units
                          </span>
                          {isLow && !isOut && <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600 }}>▲</span>}
                        </div>
                      </td>
                      <td style={td()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: stat.dot, display: 'inline-block' }}></span>
                          <span style={{ fontSize: 12, color: stat.color, fontWeight: 500 }}>• {stat.label}</span>
                        </div>
                      </td>
                      <td style={td()}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button onClick={() => editProduct(p)} style={iconBtn('#eff6ff')}>✏️</button>
                          <button onClick={() => deleteProduct(p.id)} style={iconBtn('#fef2f2')}>🗑️</button>
                          <div onClick={() => toggleEnabled(p.id)} style={{
                            width: 36, height: 20, borderRadius: 10, background: p.enabled ? '#22c55e' : '#d1d5db',
                            position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
                          }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: '50%', background: '#fff',
                              position: 'absolute', top: 2, left: p.enabled ? 18 : 2, transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {[1, 2, 3, '...', 6].map((n, i) => (
                  <button key={i} style={{
                    width: 28, height: 28, borderRadius: 6, border: '1px solid ' + (n === 1 ? '#2e7d32' : '#e5e7eb'),
                    background: n === 1 ? '#2e7d32' : '#fff', color: n === 1 ? '#fff' : '#374151',
                    fontSize: 12, cursor: 'pointer', fontWeight: n === 1 ? 700 : 400
                  }}>{n}</button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#6b7280' }}>PAGE 1 OF 6</span>
            </div>
          </div>

          {/* STATS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            {[
              { label: 'TOTAL PRODUCTS', value: '1,284', sub: '+12 this month', icon: '📦', iconBg: '#e8f5e9', subColor: '#22c55e' },
              { label: 'LOW STOCK ALERT', value: String(lowStock), sub: 'Requires attention', icon: '⚠️', iconBg: '#fff8e1', subColor: '#f59e0b' },
              { label: 'TOTAL VALUE', value: '$84,200', sub: 'Total estimated', icon: '💰', iconBg: '#e8f5e9', subColor: '#6b7280' },
              { label: 'AVG. ORDER VALUE', value: '$142.50', sub: '+5% from last month', icon: '📈', iconBg: '#e8f5e9', subColor: '#22c55e' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1rem 1.1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.subColor, marginTop: '0.2rem' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: 17, fontWeight: 700, color: '#111827' }}>
              {editingId !== null ? 'Edit Product' : 'Add New Product'}
            </h3>

            {FORM_FIELDS.map(f => (
              <div key={f.key} style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Category</label>
              <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value as CategoryKey }))}
                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
                {(Object.keys(CATEGORY_BADGES) as CategoryKey[]).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Status</label>
              <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as StatusKey }))}
                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
                {(['Active', 'Low Stock', 'Out of Stock'] as StatusKey[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={saveProduct} style={{ flex: 1, background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                {editingId !== null ? 'Save Changes' : 'Add Product'}
              </button>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, padding: '0.65rem', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}