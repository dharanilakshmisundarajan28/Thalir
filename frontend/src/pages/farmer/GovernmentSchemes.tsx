import { useState } from "react";
import {
  Search, Bell, CheckCircle, AlertCircle, Clock,
  ChevronRight, Zap, Shield, Scissors, Building2,
  FileText, ExternalLink, Star, TrendingUp
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All Categories", icon: null },
  { label: "Financial",      icon: TrendingUp },
  { label: "Insurance",      icon: Shield },
  { label: "Subsidies",      icon: Scissors },
  { label: "Infrastructure", icon: Building2 },
];

const FILTERS = ["Eligible Only", "Under Review"];

const RECOMMENDED = [
  {
    id: 1,
    name: "PM-KISAN",
    tag: "ELIGIBLE",
    tagColor: "green",
    match: 98,
    description: "Income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
    details: [{ label: "Annual Benefit", value: "₹6,000 / year", highlight: false }],
    primaryAction: "Apply Now",
    secondaryAction: "Details",
    icon: "🌾",
  },
  {
    id: 2,
    name: "PM Fasal Bima Yojana",
    tag: "CHECK REQUIREMENTS",
    tagColor: "yellow",
    match: 85,
    description: "Comprehensive insurance cover against failure of the crop, thus helping farmers to stabilise their income.",
    details: [{ label: "Coverage", value: "Full Crop Insurance", highlight: true }],
    primaryAction: "Submit Docs",
    secondaryAction: "Details",
    icon: "🛡️",
  },
  {
    id: 3,
    name: "PM Krishi Sinchayee Yojana",
    tag: "ELIGIBLE",
    tagColor: "green",
    match: 93,
    description: "Focuses on expanding cultivable area under assured irrigation, improve on-farm water use efficiency.",
    details: [{ label: "Benefit Type", value: "Equipment Subsidy", highlight: true }],
    primaryAction: "Apply Now",
    secondaryAction: "Details",
    icon: "💧",
  },
];

const RECENTLY_LAUNCHED = [
  {
    id: 1,
    name: "PM-KUSUM Component B",
    description: "Solar pump installation with 60% central & state subsidy.",
    time: "2 days ago",
    scope: "All States",
    icon: "☀️",
  },
  {
    id: 2,
    name: "Organic Farming Incentive",
    description: "Transition support for converting traditional farms to organic.",
    time: "5 days ago",
    scope: "Regional",
    icon: "🌿",
  },
];

const ALL_SCHEMES = [
  { name: "Kisan Credit Card",         category: "Financial",      match: 91, status: "Eligible",      benefit: "₹3L Credit Limit" },
  { name: "Soil Health Card Scheme",   category: "Subsidies",      match: 88, status: "Eligible",      benefit: "Free Soil Testing" },
  { name: "e-NAM Platform",            category: "Infrastructure", match: 76, status: "Under Review",  benefit: "Market Access" },
  { name: "PMFBY Rabi 2025",           category: "Insurance",      match: 82, status: "Eligible",      benefit: "Crop Insurance" },
  { name: "National Beekeeping Mission",category: "Subsidies",     match: 67, status: "Under Review",  benefit: "₹2,000 / colony" },
];

// ── Tag Badge ─────────────────────────────────────────────────────────────────

function Tag({ tag, color }: { tag: string; color: string }) {
  const styles: Record<string, string> = {
    green:  "bg-green-50 text-green-700 border border-green-200",
    yellow: "bg-amber-50 text-amber-700 border border-amber-200",
    red:    "bg-red-50 text-red-600 border border-red-200",
  };
  return (
    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-widest uppercase ${styles[color]}`}>
      {tag}
    </span>
  );
}

// ── Match Badge ───────────────────────────────────────────────────────────────

function MatchBadge({ pct }: { pct: number }) {
  const color = pct >= 90 ? "text-green-600 bg-green-50" : pct >= 80 ? "text-amber-600 bg-amber-50" : "text-slate-500 bg-slate-100";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {pct}% Match
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GovernmentSchemes() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeFilters, setActiveFilters]   = useState<string[]>([]);
  const [search, setSearch]                 = useState("");

  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const filtered = ALL_SCHEMES.filter(s => {
    if (activeCategory !== "All Categories" && s.category !== activeCategory) return false;
    if (activeFilters.includes("Eligible Only") && s.status !== "Eligible") return false;
    if (activeFilters.includes("Under Review") && s.status !== "Under Review") return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Government Schemes
          </h1>
          <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            124 Total
          </span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle size={10} /> 6 Action Required
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Search size={14} className="text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search specific schemes e.g. PM-KISAN"
              className="outline-none text-sm text-slate-600 w-56 bg-transparent placeholder:text-slate-400"
            />
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Category Tabs + Filters ── */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            const isActive = activeCategory === c.label;
            return (
              <button
                key={c.label}
                onClick={() => setActiveCategory(c.label)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {Icon && <Icon size={13} />}
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {FILTERS.map(f => {
            const isOn = activeFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  isOn
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                }`}
              >
                {isOn && <CheckCircle size={11} />}
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Recommended for You ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-500 fill-amber-400" />
            <h2 className="text-base font-extrabold text-slate-800">Recommended for You</h2>
          </div>
          <button className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
            View All Matches <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {RECOMMENDED.map(s => (
            <div
              key={s.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col gap-3"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex flex-col items-end gap-1">
                  <Tag tag={s.tag} color={s.tagColor} />
                  <MatchBadge pct={s.match} />
                </div>
              </div>

              {/* Name + Description */}
              <div>
                <h3 className="font-extrabold text-slate-800 text-[15px] leading-tight mb-1">{s.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.description}</p>
              </div>

              {/* Detail chip */}
              {s.details.map(d => (
                <div key={d.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{d.label}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                    d.highlight ? "bg-green-50 text-green-700" : "text-slate-700"
                  }`}>{d.value}</span>
                </div>
              ))}

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-1">
                <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  {s.secondaryAction}
                </button>
                <button className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-500 rounded-xl transition-colors shadow-sm">
                  {s.primaryAction}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recently Launched ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} className="text-green-600" />
          <h2 className="text-base font-extrabold text-slate-800">Recently Launched</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RECENTLY_LAUNCHED.map(s => (
            <div
              key={s.id}
              className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex items-center gap-4 cursor-pointer group"
            >
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-extrabold text-slate-800 text-sm truncate">{s.name}</p>
                  <span className="bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">NEW</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-1">{s.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={9} /> {s.time}
                  </span>
                  <span className="text-[10px] text-slate-400">· {s.scope}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-green-600 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── All Schemes Table ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-slate-500" />
            <h2 className="text-base font-extrabold text-slate-800">All Schemes</h2>
            <span className="text-xs text-slate-400 font-medium">({filtered.length} results)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Scheme Name", "Category", "Match", "Status", "Benefit", "Action"].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-sm text-slate-400 py-10">
                    No schemes match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-800">{s.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <MatchBadge pct={s.match} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${
                        s.status === "Eligible"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {s.status === "Eligible"
                          ? <CheckCircle size={10} />
                          : <Clock size={10} />
                        }
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-600">{s.benefit}</td>
                    <td className="px-5 py-3.5">
                      <button className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
                        View <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}