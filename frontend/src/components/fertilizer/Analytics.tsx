import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const analyticsData = [
  { month: 'January', revenue: 425000, target: 500000, growth: 12.5 },
  { month: 'February', revenue: 475000, target: 500000, growth: 15.2 },
  { month: 'March', revenue: 425000, target: 450000, growth: 18.7 },
];

const trendData = [
  { label: 'Jan', value: 210000 },
  { label: 'Feb', value: 240000 },
  { label: 'Mar', value: 310000 },
  { label: 'Apr', value: 370000 },
  { label: 'May', value: 410000 },
  { label: 'Jun', value: 425000 },
];

const categoryData = [
  { name: 'Nitrogen-rich', value: 40, color: '#1a5c2e' },
  { name: 'Organic', value: 25, color: '#2d8a4e' },
  { name: 'Liquid Feed', value: 15, color: '#5bb57a' },
  { name: 'Synthetic Mix', value: 20, color: '#c8e6d0' },
];

const transactions: {
  id: string;
  date: string;
  farmer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}[] = [
  { id: '#ORD-2541', date: 'Oct 24, 2023', farmer: 'Rajesh Kumar', amount: '₹12,450', status: 'Paid' },
  { id: '#ORD-2540', date: 'Oct 23, 2023', farmer: 'Suresh Raina', amount: '₹8,200', status: 'Pending' },
  { id: '#ORD-2539', date: 'Oct 23, 2023', farmer: 'Vikram Singh', amount: '₹15,000', status: 'Paid' },
  { id: '#ORD-2538', date: 'Oct 22, 2023', farmer: 'Amit Patel', amount: '₹6,750', status: 'Failed' },
];

const topProducts = [
  { name: 'SuperUrea 46% (50kg)', revenue: '₹86,500', units: '124 units sold', growth: '+12%', positive: true, color: '#2d6a4f' },
  { name: 'Bio-Organic Potash', revenue: '₹62,400', units: '98 units sold', growth: '+5%', positive: true, color: '#40916c' },
  { name: 'Liquid Nutrient Mix 5L', revenue: '₹48,200', units: '76 units sold', growth: '-2%', positive: false, color: '#52b788' },
  { name: 'Synthetic Phosphate', revenue: '₹32,100', units: '64 units sold', growth: '+18%', positive: true, color: '#74c69d' },
];

const statusStyle = {
  Paid: { background: '#dcfce7', color: '#16a34a' },
  Pending: { background: '#fef3c7', color: '#d97706' },
  Failed: { background: '#fee2e2', color: '#dc2626' },
};

// ✅ Fix: Use a custom interface instead of TooltipProps to avoid TS errors
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: '13px'
      }}>
        <p style={{ fontWeight: 600, color: '#374151', marginBottom: 2 }}>{label}</p>
        <p style={{ color: '#1a5c2e', fontWeight: 700 }}>₹{payload?.[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      padding: '28px 32px',
      background: 'linear-gradient(140deg, #f3faf4 0%, #eaf5ec 60%, #f0f7f1 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.45s ease',
    },
    topbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '26px',
    },
    exportBtn: {
      background: 'linear-gradient(135deg, #1a5c2e 0%, #2d8a4e 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '9px 18px',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      boxShadow: '0 4px 14px rgba(26,92,46,0.28)',
      letterSpacing: '-0.01em',
    },
    card: {
      background: 'white',
      borderRadius: '18px',
      border: '1px solid #e8f2ea',
      boxShadow: '0 1px 6px rgba(26,92,46,0.05)',
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '18px',
      marginBottom: '22px',
    },
    kpiCard: {
      background: 'white',
      borderRadius: '18px',
      border: '1px solid #e8f2ea',
      boxShadow: '0 1px 6px rgba(26,92,46,0.05)',
      padding: '22px',
      transition: 'transform 0.18s, box-shadow 0.18s',
      cursor: 'default',
    },
    midRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: '20px',
      marginBottom: '20px',
    },
    botRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: '20px',
    },
    sectionTitle: {
      fontFamily: "'Georgia', 'Playfair Display', serif",
      fontSize: '1.05rem',
      fontWeight: 700,
      color: '#1a2e1c',
      letterSpacing: '-0.01em',
    },
    badge: (color: string, bg: string) => ({
      fontSize: '11px',
      fontWeight: 700,
      color,
      background: bg,
      padding: '2px 9px',
      borderRadius: '999px',
    }),
    statusBadge: (status: keyof typeof statusStyle) => ({
      fontSize: '11px',
      fontWeight: 700,
      color: statusStyle[status]?.color,
      background: statusStyle[status]?.background,
      padding: '3px 10px',
      borderRadius: '999px',
      display: 'inline-block',
    }),
  };

  const kpis = [
    { label: 'Total Revenue', value: '₹4,25,000', change: '+12.5%', icon: '💰' },
    { label: 'Gross Profit', value: '₹1,12,500', change: '+8.2%', icon: '📈' },
    { label: 'Avg. Order Value', value: '₹8,500', change: '+4.1%', icon: '🛒' },
    { label: 'Total Orders', value: '524', change: '+15.3%', icon: '📦' },
  ];

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.topbar}>
        <div>
          <h1 style={{ fontFamily: "'Georgia', 'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#1a2e1c', letterSpacing: '-0.02em', margin: 0 }}>
            Revenue Analytics
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px', marginBottom: 0 }}>GreenEarth Fertilizers — Admin Account</p>
        </div>
        <button style={styles.exportBtn}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
          </svg>
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {kpis.map((card, i) => (
          <div
            key={i}
            style={styles.kpiCard}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(26,92,46,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 6px rgba(26,92,46,0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px' }}>{card.icon}</span>
              <span style={styles.badge('#16a34a', '#dcfce7')}>{card.change}</span>
            </div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.45rem', fontWeight: 800, color: '#1a2e1c', marginBottom: '4px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '2px' }}>vs last month</div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={styles.midRow}>
        {/* Revenue Trends */}
        <div style={{ ...styles.card, padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={styles.sectionTitle}>Revenue Trends</span>
            <select style={{
              fontSize: '12px', color: '#6b7280',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              padding: '5px 10px', background: '#f9fafb', outline: 'none', cursor: 'pointer'
            }}>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d8a4e" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2d8a4e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              {/* ✅ Fix: Pass content as a render function to avoid type issues */}
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1a5c2e"
                strokeWidth={2.5}
                fill="url(#greenGrad)"
                dot={(props) => {
                  const { cx, cy, index } = props;
                  if (index === trendData.length - 1)
                    return <circle key={index} cx={cx} cy={cy} r={5} fill="#1a5c2e" stroke="white" strokeWidth={2} />;
                  if (index === 2)
                    return <circle key={index} cx={cx} cy={cy} r={4} fill="white" stroke="#1a5c2e" strokeWidth={2} />;
                  return <g key={index} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div style={{ ...styles.card, padding: '26px' }}>
          <div style={{ ...styles.sectionTitle, marginBottom: '18px' }}>Sales by Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <PieChart width={155} height={155}>
                <Pie data={categoryData} cx={72} cy={72} innerRadius={48} outerRadius={72} dataKey="value" startAngle={90} endAngle={-270}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: '1rem', fontWeight: 800, color: '#1a2e1c' }}>₹425k</div>
                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Total</div>
              </div>
            </div>
            <div style={{ width: '100%', marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categoryData.map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ color: '#6b7280' }}>{cat.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#1f2937' }}>{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={styles.botRow}>
        {/* Recent Transactions */}
        <div style={{ ...styles.card, padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={styles.sectionTitle}>Recent Transactions</span>
            <button style={{ fontSize: '12px', fontWeight: 700, color: '#1a5c2e', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID', 'Date', 'Farmer Name', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', fontSize: '10px', fontWeight: 700,
                    color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em',
                    paddingBottom: '12px', borderBottom: '1px solid #f3f4f6'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '11px 0', fontSize: '13px', fontWeight: 700, color: '#374151' }}>{t.id}</td>
                  <td style={{ padding: '11px 8px', fontSize: '13px', color: '#9ca3af' }}>{t.date}</td>
                  <td style={{ padding: '11px 8px', fontSize: '13px', color: '#374151' }}>{t.farmer}</td>
                  <td style={{ padding: '11px 8px', fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{t.amount}</td>
                  <td style={{ padding: '11px 0' }}>
                    <span style={styles.statusBadge(t.status)}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div style={{ ...styles.card, padding: '26px' }}>
          <div style={{ ...styles.sectionTitle, marginBottom: '18px' }}>Top Products</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                  background: `${p.color}1a`,
                }}>🌿</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{p.units}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1f2937' }}>{p.revenue}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: p.positive ? '#16a34a' : '#dc2626', marginTop: '2px' }}>{p.growth}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', marginTop: '18px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '10px',
            borderRadius: '12px', cursor: 'pointer',
            background: '#f4faf5', color: '#1a5c2e',
            border: '1px solid #c8e6d0',
          }}>
            Detailed Inventory Report
          </button>
        </div>
      </div>

      {/* Revenue Metrics Table */}
      <div style={{ ...styles.card, padding: '26px', marginTop: '20px' }}>
        <div style={{ ...styles.sectionTitle, marginBottom: '18px' }}>Revenue Metrics</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderRadius: '10px' }}>
                {['Month', 'Actual Revenue', 'Target Revenue', 'Growth %', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '10px', fontWeight: 700, color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((d, i) => {
                const onTrack = d.revenue >= d.target;
                return (
                  <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1f2937', fontSize: '14px' }}>{d.month}</td>
                    <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '14px' }}>₹{d.revenue.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '14px' }}>₹{d.target.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: '#16a34a', fontWeight: 700, fontSize: '14px' }}>↑ {d.growth}%</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '999px',
                        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                        background: onTrack ? '#dcfce7' : '#fee2e2',
                        color: onTrack ? '#16a34a' : '#dc2626',
                      }}>
                        {onTrack ? 'On Track' : 'Below Target'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '20px' }}>
        <div style={{
          padding: '22px', background: '#f0faf2', borderRadius: '18px',
          border: '1px solid #c8e6d0', borderLeft: '4px solid #2d8a4e',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Highest Performing Month
          </div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.45rem', fontWeight: 700, color: '#1a5c2e' }}>March 2024</div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>₹4,25,000 revenue with 18.7% growth</div>
        </div>
        <div style={{
          padding: '22px', background: '#fffbeb', borderRadius: '18px',
          border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Average Monthly Revenue
          </div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.45rem', fontWeight: 700, color: '#92400e' }}>₹4,41,667</div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Based on last 3 months</div>
        </div>
      </div>
    </div>
  );
}