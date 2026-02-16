import { useState } from "react";
import {
  Leaf,
  MapPin,
  Sprout,
  Wheat,
  Factory,
  Info,
} from "lucide-react";

export default function CropRecommendation() {
  const [landArea, setLandArea] = useState("");
  const [soilType, setSoilType] = useState("");
  const [location, setLocation] = useState("");
  const [generated, setGenerated] = useState(false);

  const locationSuggestions = [
    "Coimbatore, TN",
    "Madurai, TN",
    "Salem, TN",
    "Erode, TN",
    "Trichy, TN",
  ];

  const handleGenerate = () => {
    if (!landArea || !soilType || !location) {
      alert("Please fill all fields");
      return;
    }
    setGenerated(true);
  };

  const handleBack = () => setGenerated(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* =========================================================
         🟢 SCREEN 1 — INPUT
      ========================================================== */}
      {!generated && (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-3xl shadow-lg p-8 border">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                <Leaf size={20} className="text-green-600" />
                Recommendation Engine
              </h3>

              {/* Land Area */}
              <div className="mb-4">
                <label className="text-sm text-slate-500 font-medium">
                  Land Area (Acres)
                </label>
                <input
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="e.g. 5.5"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              {/* Soil Type */}
              <div className="mb-4">
                <label className="text-sm text-slate-500 font-medium">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
                >
                  <option value="">Select Soil Type</option>
                  <option>Red Soil</option>
                  <option>Black Soil</option>
                  <option>Alluvial Soil</option>
                  <option>Clay Soil</option>
                </select>
              </div>

              {/* Location with suggestions */}
              <div className="mb-5">
                <label className="text-sm text-slate-500 font-medium">
                  Location
                </label>
                <input
                  list="locations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter or select location"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
                />
                <datalist id="locations">
                  {locationSuggestions.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-sm transition"
              >
                Generate Recommendations
              </button>
            </div>

            {/* Info */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-slate-600 flex gap-3 mt-5">
              <Info size={18} className="text-green-600 mt-0.5" />
              <p>
                Recommendations are generated using our proprietary ML model
                trained on 20-year historical weather trends.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         🟢 SCREEN 2 — RESULTS
      ========================================================== */}
      {generated && (
        <div className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50" />

          <div className="relative z-10 animate-slideInRight min-h-[80vh] p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                🌱 Top Recommended Crops
              </h2>

              <button
                onClick={handleBack}
                className="text-sm text-green-700 font-semibold hover:underline"
              >
                ← Modify Inputs
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <CropCard
                delay={0}
                icon={<Sprout className="text-green-600" />}
                title="Turmeric"
                probability="High Probability"
                score="92%"
                barColor="bg-green-600"
                yieldText="12-15 tons/acre"
                profit="₹1,20,000"
                risk="Low"
              />

              <CropCard
                delay={120}
                icon={<Wheat className="text-amber-600" />}
                title="Rice (Samba)"
                probability="Moderate Probability"
                score="85%"
                barColor="bg-amber-500"
                yieldText="2.5-3 tons/acre"
                profit="₹80,000"
                risk="Medium"
              />

              <CropCard
                delay={240}
                icon={<Factory className="text-green-700" />}
                title="Sugarcane"
                probability="Stable Growth"
                score="78%"
                barColor="bg-green-500"
                yieldText="40-50 tons/acre"
                profit="₹1,50,000"
                risk="Low"
              />
            </div>
          </div>

          {/* Animations */}
          <style>{`
            @keyframes slideInRight {
              from { opacity: 0; transform: translateX(80px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .animate-slideInRight {
              animation: slideInRight .5s ease forwards;
            }

            @keyframes cardReveal {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-cardReveal {
              animation: cardReveal .5s ease forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

/* ===================================================== */

function CropCard({
  icon,
  title,
  probability,
  score,
  barColor,
  yieldText,
  profit,
  risk,
  delay = 0,
}: any) {
  return (
    <div
      className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border p-5 hover:shadow-lg transition opacity-0 animate-cardReveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            {icon}
          </div>

          <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{probability}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{score}</p>
          <p className="text-[10px] text-slate-400 font-semibold">
            SUCCESS SCORE
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
        <div className={`${barColor} h-2 rounded-full w-[85%]`} />
      </div>

      <div className="grid grid-cols-3 text-sm">
        <div>
          <p className="text-xs text-slate-400">EXPECTED YIELD</p>
          <p className="font-semibold text-slate-700">{yieldText}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">PREDICTED PROFIT</p>
          <p className="font-semibold text-slate-700">{profit}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">RISK LEVEL</p>
          <p className="font-semibold text-green-600">{risk}</p>
        </div>
      </div>

      <div className="text-right mt-3">
        <button className="text-green-600 text-sm font-semibold hover:underline">
          View Details →
        </button>
      </div>
    </div>
  );
}
