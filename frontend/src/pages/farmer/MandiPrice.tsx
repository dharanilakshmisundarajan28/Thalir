import { useState } from "react";
import {
  Search,
  Bell,
  MapPin,
  Navigation,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CROPS = ["Wheat", "Rice", "Tomato", "Maize"];
const LOCATIONS = ["Ludhiana District", "Amritsar District", "Patiala District"];
const RADIUS = ["Within 25km", "Within 50km", "Within 100km"];

const MANDIS = [
  {
    name: "Khanna Mandi",
    location: "Ludhiana, Punjab",
    distance: "12.4 km",
    bestPrice: "₹2,45",
    unit: "/qt",
    arrivals: "450 MT",
    recommended: true,
    trend: +4.2,
  },
  {
    name: "Ludhiana Grain Market",
    location: "Ludhiana, Punjab",
    distance: "3.1 km",
    bestPrice: "₹2,38",
    unit: "/qt",
    arrivals: "320 MT",
    recommended: false,
    trend: -1.1,
  },
  {
    name: "Samrala Mandi",
    location: "Ludhiana, Punjab",
    distance: "28.7 km",
    bestPrice: "₹2,42",
    unit: "/qt",
    arrivals: "210 MT",
    recommended: false,
    trend: +2.8,
  },
];

const CHART_DATA = [
  28, 32, 30, 35, 34, 38, 36, 40, 39, 42,
  41, 45, 44, 47, 46, 50, 49, 52, 51, 55,
  54, 58, 57, 60, 62, 65, 63, 68, 66, 72,
];

const STATS = [
  { label: "Today's Avg Price", value: "₹2,42/qt", change: "+1.8%", up: true },
  { label: "Total Arrivals",    value: "980 MT",    change: "+12%",  up: true },
  { label: "Active Mandis",     value: "7 Nearby",  change: "50 km radius", up: null },
];

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const norm = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="flex items-end gap-[3px] h-28 w-full py-1">
      {data.map((val, i) => {
        const recent = i >= data.length - 7;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${Math.max(norm(val), 6)}%`,
              background: recent
                ? "linear-gradient(180deg,#4ade80,#16a34a)"
                : "rgba(0,0,0,0.07)",
              minHeight: 4,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MandiPrice() {
  const [activeCrop, setActiveCrop]         = useState("Wheat");
  const [activeLocation, setActiveLocation] = useState("Ludhiana District");
  const [activeRadius, setActiveRadius]     = useState("Within 50km");
  const [selected, setSelected]             = useState(MANDIS[0]);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Mandi Price Comparison
          </h1>
          <span className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase animate-pulse">
            Live Updates
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Search size={14} className="text-slate-400" />
            <input
              placeholder="Search markets..."
              className="outline-none text-sm text-slate-600 w-36 bg-transparent placeholder:text-slate-400"
            />
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Bell size={15} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-sm">
        {/* Crop pills */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crop:</span>
          <div className="flex gap-1.5">
            {CROPS.map(c => (
              <button
                key={c}
                onClick={() => setActiveCrop(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeCrop === c
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* Location */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location:</span>
          <select
            value={activeLocation}
            onChange={e => setActiveLocation(e.target.value)}
            className="bg-slate-100 border-none text-sm font-medium text-slate-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select
            value={activeRadius}
            onChange={e => setActiveRadius(e.target.value)}
            className="bg-slate-100 border-none text-sm font-medium text-slate-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            {RADIUS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[280px_1fr] gap-5 items-start">

        {/* ── Left: Mandi Cards ── */}
        <div className="flex flex-col gap-3">
          {MANDIS.map(m => {
            const isSelected = selected.name === m.name;
            return (
              <div
                key={m.name}
                onClick={() => setSelected(m)}
                className={`rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-xl"
                    : "bg-white text-slate-800 shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {m.recommended && (
                  <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 ${
                    isSelected ? "bg-green-600/25 text-green-300" : "bg-green-50 text-green-700"
                  }`}>
                    <Star size={9} fill="currentColor" />
                    RECOMMENDED MARKET
                  </div>
                )}

                <p className="font-extrabold text-[17px] leading-tight mb-1">{m.name}</p>

                <div className={`flex items-center gap-1.5 text-xs mb-4 ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                  <MapPin size={11} />
                  {m.location} · {m.distance} away
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Best Price</p>
                    <p className="font-extrabold text-2xl leading-none">{m.bestPrice}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">0{m.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Arrivals</p>
                    <p className="font-extrabold text-lg">{m.arrivals}</p>
                  </div>
                </div>

                {isSelected && (
                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 transition-colors text-white text-sm font-bold py-2.5 rounded-xl">
                    <Navigation size={14} />
                    Navigate to Mandi
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right Panel ── */}
        <div className="flex flex-col gap-4">

          {/* Price Trend Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  Price Trend: {activeCrop}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Fluctuations in the last 30 days</p>
              </div>
              <span className="flex items-center gap-1 bg-green-50 text-green-700 text-sm font-bold px-3 py-1.5 rounded-full">
                <TrendingUp size={13} /> +4.2%
              </span>
            </div>

            <BarChart data={CHART_DATA} />

            <div className="flex justify-between mt-2">
              {["1 MONTH AGO", "15 DAYS AGO", "TODAY"].map(l => (
                <span key={l} className="text-[10px] text-slate-300 font-bold tracking-wider">{l}</span>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                <p className="text-xl font-extrabold text-slate-800 mb-1">{s.value}</p>
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  s.up === true ? "text-green-600" : s.up === false ? "text-red-500" : "text-slate-400"
                }`}>
                  {s.up === true  && <TrendingUp size={11} />}
                  {s.up === false && <TrendingDown size={11} />}
                  {s.change}
                </span>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4">Price Comparison Table</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Market", "Distance", "Best Price", "Arrivals", "Trend"].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MANDIS.map(m => (
                  <tr
                    key={m.name}
                    onClick={() => setSelected(m)}
                    className={`cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${
                      selected.name === m.name ? "bg-slate-50" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 pr-4 text-sm font-bold text-slate-800">{m.name}</td>
                    <td className="py-3 pr-4 text-sm text-slate-500">{m.distance}</td>
                    <td className="py-3 pr-4 text-sm font-extrabold text-green-600">{m.bestPrice}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600">{m.arrivals}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        m.trend > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                      }`}>
                        {m.trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {m.trend > 0 ? "+" : ""}{m.trend}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}