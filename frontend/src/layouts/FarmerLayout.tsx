import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Home,
  ShoppingCart,
  Leaf,
  TrendingUp,
  Package,
  Settings,
  Bell,
  DollarSign,
  Users,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import DynamicWeather from "../components/dashboard/DynamicWeather";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";

export default function FarmerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const [openProfile, setOpenProfile] = useState(false);
  const [range, setRange] = useState("6");

  // ✅ close dropdown outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🌱 NAV
  const navItems = [
    { name: "Dashboard", path: "/farmer/dashboard", icon: Home },
    { name: "Orders", path: "/farmer/orders", icon: ShoppingCart },
    { name: "Crop", path: "/farmer/crop-recommendation", icon: Leaf },
    { name: "Mandi Price", path: "/farmer/mandi-price", icon: TrendingUp },
    { name: "Inventory", path: "/farmer/products", icon: Package },
    { name: "Settings", path: "/farmer/settings", icon: Settings },
  ];

  // 🌱 KPI DATA
  const kpis = [
    {
      title: "Total Revenue",
      value: 425000,
      prefix: "₹",
      growth: "+12.5%",
      icon: DollarSign,
      color:
        "bg-gradient-to-br from-green-200 via-emerald-200 to-green-300 text-emerald-900",
    },
    {
      title: "Pending Orders",
      value: 142,
      growth: "+8.2%",
      icon: ShoppingCart,
      color:
        "bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300 text-amber-900",
    },
    {
      title: "Active Vendors",
      value: 12,
      growth: "-2.4%",
      icon: Users,
      color:
        "bg-gradient-to-br from-rose-200 via-pink-200 to-rose-300 text-rose-900",
    },
    {
      title: "Total Products",
      value: 84,
      growth: "+15.3%",
      icon: Package,
      color:
        "bg-gradient-to-br from-lime-200 via-green-200 to-emerald-300 text-green-900",
    },
  ];

  // ✅ COUNTER
  const Counter = ({ value, prefix = "" }: any) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 900;
      const step = Math.ceil(value / (duration / 16));

      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <span>
        {prefix}
        {count.toLocaleString()}
      </span>
    );
  };

  // 🔥 REAL MONTH DATA
  const chartData = useMemo(() => {
    const monthsToShow = parseInt(range);
    const today = new Date();

    const data = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

      data.push({
        month: d.toLocaleString("default", { month: "short" }),
        revenue: Math.floor(20000 + Math.random() * 60000),
      });
    }

    return data;
  }, [range]);

  const handleLogout = () => navigate("/");
  const handleSettings = () => navigate("/farmer/settings");

  const showDashboard = location.pathname.includes("dashboard");

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col shadow-xl">
        <div className="h-16 flex items-center px-6 text-xl font-bold tracking-widest border-b border-white/10">
          THALIR
        </div>

        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Rajesh 👋
          </h1>

          <div className="flex items-center gap-5 relative" ref={profileRef}>
            <Bell className="text-slate-600" size={22} />

            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-lg cursor-pointer"
            >
              FA
            </div>

            {openProfile && (
              <div className="absolute right-0 top-14 w-44 bg-white rounded-xl shadow-xl border py-2 z-50">
                <button
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-red-600"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <main className="px-8 pb-8 overflow-y-auto">
          {showDashboard && (
            <>
              {/* KPI */}
              <div className="grid gap-4 mb-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`${item.color} p-4 rounded-xl shadow-md`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <Icon size={22} />
                        <span
                          className={`text-xs font-semibold ${
                            item.growth.includes("-")
                              ? "text-red-600"
                              : "text-green-700"
                          }`}
                        >
                          {item.growth}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold opacity-80">
                        {item.title}
                      </h4>
                      <p className="text-2xl font-extrabold mt-1">
                        <Counter value={item.value} prefix={item.prefix || ""} />
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 🔥 MAIN GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
                {/* LEFT 70% */}
                <div className="xl:col-span-7 flex flex-col gap-6">
                  {/* GRAPH — 30% HEIGHT */}
                  <div className="bg-white rounded-2xl shadow p-6 h-[50vh]">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          Sales Performance
                        </h3>
                        <p className="text-sm text-slate-500">
                          Revenue growth over time
                        </p>
                      </div>

                      <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="border rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="1">Last 1 Month</option>
                        <option value="6">Last 6 Months</option>
                        <option value="12">Last 12 Months</option>
                      </select>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip
                          formatter={(v: any) => [
                            `₹${v.toLocaleString()}`,
                            "Revenue",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#16a34a"
                          strokeWidth={4}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* ✅ RECENT ORDERS — ONLY UNDER GRAPH */}
                  <RecentOrdersTable />
                </div>

                {/* RIGHT 30% */}
                <div className="xl:col-span-3">
                  <DynamicWeather />
                </div>
              </div>
            </>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
