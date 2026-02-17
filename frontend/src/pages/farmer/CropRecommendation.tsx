// below is working ui
// import { useState } from "react";
// import {
//   Leaf,
//   Sprout,
//   Wheat,
//   Factory,
//   Info,
//   Loader2,
//   AlertCircle
// } from "lucide-react";
// import recommendationService from "../../services/recommendation.service";
// import type { Recommendation } from "../../services/recommendation.service";

// export default function CropRecommendation() {
//   const [landArea, setLandArea] = useState("");
//   const [soilType, setSoilType] = useState("");
//   const [location, setLocation] = useState("");
//   const [generated, setGenerated] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

//   const locationSuggestions = [
//     "Coimbatore, TN",
//     "Madurai, TN",
//     "Salem, TN",
//     "Erode, TN",
//     "Trichy, TN",
//   ];

//   const handleGenerate = async () => {
//     if (!landArea || !soilType || !location) {
//       alert("Please fill all fields");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await recommendationService.getRecommendations({
//         soil_type: soilType,
//         land_area: parseFloat(landArea),
//         location: location
//       });

//       setRecommendations(response.data.recommendations);
//       setGenerated(true);
//     } catch (err: any) {
//       console.error("Failed to fetch recommendations:", err);
//       setError(err.response?.data?.detail || "Failed to reach ML service. Please ensure it's running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     setGenerated(false);
//     setError("");
//   };

//   const getCropIcon = (cropName: string) => {
//     if (!cropName) return <Leaf className="text-green-600" />;
//     const name = cropName.toLowerCase();
//     if (name.includes('paddy') || name.includes('rice')) return <Sprout className="text-green-600" />;
//     if (name.includes('wheat') || name.includes('maize')) return <Wheat className="text-amber-600" />;
//     if (name.includes('sugarcane')) return <Factory className="text-green-700" />;
//     return <Leaf className="text-green-600" />;
//   }

//   const getBarColor = (rate: number) => {
//     if (rate >= 0.8) return "bg-green-600";
//     if (rate >= 0.5) return "bg-amber-500";
//     return "bg-red-500";
//   }

//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* =========================================================
//          🟢 SCREEN 1 — INPUT
//       ========================================================== */}
//       {!generated && (
//         <div className="flex items-center justify-center min-h-screen p-6">
//           <div className="w-full max-w-xl">
//             <div className="bg-white rounded-3xl shadow-lg p-8 border">
//               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
//                 <Leaf size={20} className="text-green-600" />
//                 Recommendation Engine
//               </h3>

//               {/* Error Message */}
//               {error && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex gap-3 animate-shake">
//                   <AlertCircle size={18} />
//                   <p>{error}</p>
//                 </div>
//               )}

//               {/* Land Area */}
//               <div className="mb-4">
//                 <label className="text-sm text-slate-500 font-medium">
//                   Land Area (Acres)
//                 </label>
//                 <input
//                   type="number"
//                   value={landArea}
//                   onChange={(e) => setLandArea(e.target.value)}
//                   placeholder="e.g. 5.5"
//                   className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
//                 />
//               </div>

//               {/* Soil Type */}
//               <div className="mb-4">
//                 <label className="text-sm text-slate-500 font-medium">
//                   Soil Type
//                 </label>
//                 <select
//                   value={soilType}
//                   onChange={(e) => setSoilType(e.target.value)}
//                   className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
//                 >
//                   <option value="">Select Soil Type</option>
//                   <option value="Loamy">Loamy Soil</option>
//                   <option value="Black">Black Soil</option>
//                   <option value="Clayey">Clayey Soil</option>
//                   <option value="Sandy">Sandy Soil</option>
//                   <option value="Red">Red Soil</option>
//                 </select>
//               </div>

//               {/* Location with suggestions */}
//               <div className="mb-5">
//                 <label className="text-sm text-slate-500 font-medium">
//                   Location
//                 </label>
//                 <input
//                   list="locations"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder="Enter or select location (City, State)"
//                   className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
//                 />
//                 <datalist id="locations">
//                   {locationSuggestions.map((loc) => (
//                     <option key={loc} value={loc} />
//                   ))}
//                 </datalist>
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 disabled={loading}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="animate-spin" size={20} />
//                     Processing AI Analytics...
//                   </>
//                 ) : (
//                   "Generate Recommendations"
//                 )}
//               </button>
//             </div>

//             {/* Info */}
//             <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-slate-600 flex gap-3 mt-5">
//               <Info size={18} className="text-green-600 mt-0.5" />
//               <p>
//                 Recommendations are generated using our proprietary ML model
//                 trained on 20-year historical weather trends and current 7-day forecasts.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =========================================================
//          🟢 SCREEN 2 — RESULTS
//       ========================================================== */}
//       {generated && (
//         <div className="relative overflow-hidden">
//           {/* Background */}
//           <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50" />

//           <div className="relative z-10 animate-slideInRight min-h-[80vh] p-6 max-w-7xl mx-auto">
//             {/* Header */}
//             <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
//                   🌱 Top Recommended Crops
//                   <span className="text-sm font-normal text-slate-500 bg-white/50 px-3 py-1 rounded-full border">
//                     {location}
//                   </span>
//                 </h2>
//                 <p className="text-slate-500 mt-1">AI-powered analytics for your farm's success.</p>
//               </div>

//               <button
//                 onClick={handleBack}
//                 className="text-sm text-green-700 font-semibold hover:underline bg-white px-4 py-2 rounded-lg border shadow-sm self-start md:self-auto"
//               >
//                 ← Modify Inputs
//               </button>
//             </div>

//             {/* Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {recommendations.map((rec, index) => (
//                 <CropCard
//                   key={rec.crop}
//                   delay={index * 150}
//                   icon={getCropIcon(rec.crop)}
//                   title={rec.crop}
//                   probability={`${(rec.success_rate * 100).toFixed(0)}% Success Rate`}
//                   score={`${(rec.success_rate * 100).toFixed(0)}%`}
//                   barColor={getBarColor(rec.success_rate)}
//                   yieldText={`${rec.expected_yield_tons} tons`}
//                   profit={`₹${rec.predicted_profit.toLocaleString()}`}
//                   risk={rec.risk}
//                 />
//               ))}
//             </div>

//             {recommendations.length === 0 && (
//               <div className="bg-white rounded-3xl p-12 text-center border shadow-sm">
//                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <AlertCircle className="text-slate-400" size={32} />
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-800">No recommendations found</h3>
//                 <p className="text-slate-500 mt-2">Try adjusting your land area or soil type.</p>
//               </div>
//             )}
//           </div>

//           {/* Animations */}
//           <style>{`
//             @keyframes slideInRight {
//               from { opacity: 0; transform: translateX(80px); }
//               to { opacity: 1; transform: translateX(0); }
//             }
//             .animate-slideInRight {
//               animation: slideInRight .5s ease forwards;
//             }

//             @keyframes cardReveal {
//               from { opacity: 0; transform: translateY(20px); }
//               to { opacity: 1; transform: translateY(0); }
//             }
//             .animate-cardReveal {
//               animation: cardReveal .5s ease forwards;
//             }

//             @keyframes shake {
//               0%, 100% { transform: translateX(0); }
//               25% { transform: translateX(-4px); }
//               75% { transform: translateX(4px); }
//             }
//             .animate-shake {
//               animation: shake 0.4s ease-in-out;
//             }
//           `}</style>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===================================================== */

// interface CropCardProps {
//   icon: React.ReactNode;
//   title: string;
//   probability: string;
//   score: string;
//   barColor: string;
//   yieldText: string;
//   profit: string;
//   risk: string;
//   delay?: number;
// }

// function CropCard({
//   icon,
//   title,
//   probability,
//   score,
//   barColor,
//   yieldText,
//   profit,
//   risk,
//   delay = 0,
// }: CropCardProps) {
//   return (
//     <div
//       className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border p-6 hover:shadow-xl transition-all duration-300 opacity-0 animate-cardReveal group"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
//             {icon}
//           </div>

//           <div>
//             <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
//             <p className="text-xs text-slate-500 font-medium">{probability}</p>
//           </div>
//         </div>

//         <div className="text-right">
//           <p className="text-3xl font-black text-slate-800 leading-tight">{score}</p>
//           <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
//             Success Score
//           </p>
//         </div>
//       </div>

//       <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
//         <div
//           className={`${barColor} h-full rounded-full transition-all duration-1000 ease-out`}
//           style={{ width: score, transitionDelay: `${delay + 300}ms` }}
//         />
//       </div>

//       <div className="grid grid-cols-3 gap-2 text-sm border-t pt-4">
//         <div>
//           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Yield</p>
//           <p className="font-bold text-slate-700">{yieldText}</p>
//         </div>

//         <div>
//           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Profit</p>
//           <p className="font-bold text-green-600">{profit}</p>
//         </div>

//         <div className="text-right">
//           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Risk</p>
//           <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${risk === 'Low' ? 'bg-green-100 text-green-700' :
//             risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
//               'bg-red-100 text-red-700'
//             }`}>
//             {risk}
//           </span>
//         </div>
//       </div>

//       <div className="text-right mt-5">
//         <button className="text-green-600 text-sm font-bold hover:underline">
//           View Details →
//         </button>
//       </div>
//     </div>
//   );
// }
// ----------------------------------















// the below code is working backend

// import React, { useState } from "react";
// import recommendationService from "../../services/recommendation.service";

// const CropRecommendation = () => {
//   const [soil, setSoil] = useState("");
//   const [area, setArea] = useState("");
//   const [location, setLocation] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   const handleGenerate = async () => {
//     console.log("🔥 BUTTON CLICKED");

//     if (!soil || !area || !location) {
//       alert("Fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("📡 Calling API...");

//       const res = await recommendationService.getRecommendations({
//         soil_type: soil,
//         land_area: Number(area),
//         location: location,
//       });

//       console.log("✅ RESPONSE:", res.data);
//       setResult(res.data);
//     } catch (err) {
//       console.error("❌ API ERROR:", err);
//       alert("Backend not responding");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">AI Crop Recommendation</h2>

//       <input
//         placeholder="Soil Type"
//         value={soil}
//         onChange={(e) => setSoil(e.target.value)}
//         className="border p-2 mr-2"
//       />

//       <input
//         placeholder="Land Area"
//         value={area}
//         onChange={(e) => setArea(e.target.value)}
//         className="border p-2 mr-2"
//       />

//       <input
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         className="border p-2 mr-2"
//       />

//       <button
//         onClick={handleGenerate}
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Generating..." : "Generate"}
//       </button>

//       {/* RESULT */}
//       {result && (
//         <div className="mt-6 border p-4 rounded">
//           <h3 className="font-bold">Result</h3>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CropRecommendation;


// below is ui

import { useState } from "react";
import {
  Leaf,
  Sprout,
  Wheat,
  Factory,
  Info,
  Loader2,
  AlertCircle
} from "lucide-react";
import recommendationService from "../../services/recommendation.service";

const VALID_SOILS = ["Loamy", "Black", "Clayey", "Sandy", "Red"];

export default function CropRecommendation() {
  const [landArea, setLandArea] = useState("");
  const [soilType, setSoilType] = useState("");
  const [location, setLocation] = useState("");

  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  const locationSuggestions = [
    "Coimbatore, TN",
    "Madurai, TN",
    "Salem, TN",
    "Erode, TN",
    "Trichy, TN",
  ];

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: any = {};

    if (!soilType) newErrors.soil = "Please select soil type";

    const areaNum = Number(landArea);
    if (!landArea) newErrors.area = "Enter land area";
    else if (areaNum <= 0) newErrors.area = "Enter positive value for land";

    if (!location) newErrors.location = "Enter location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= API ================= */
  const handleGenerate = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const response = await recommendationService.getRecommendations({
        soil_type: soilType,
        land_area: parseFloat(landArea),
        location: location
      });

      setRecommendations(response.data.recommendations);
      setGenerated(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to reach ML service. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setGenerated(false);
    setError("");
  };

  /* ================= ICONS ================= */
  const getCropIcon = (cropName: string) => {
    const name = cropName?.toLowerCase() || "";
    if (name.includes("paddy") || name.includes("rice"))
      return <Sprout className="text-green-600" />;
    if (name.includes("wheat") || name.includes("maize"))
      return <Wheat className="text-amber-600" />;
    if (name.includes("sugarcane"))
      return <Factory className="text-green-700" />;
    return <Leaf className="text-green-600" />;
  };

  const getBarColor = (rate: number) => {
    if (rate >= 0.8) return "bg-green-600";
    if (rate >= 0.5) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= INPUT SCREEN ================= */}
      {!generated && (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-3xl shadow-lg p-8 border">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                <Leaf size={20} className="text-green-600" />
                Recommendation Engine
              </h3>

              {/* API ERROR */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex gap-3 animate-shake">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              {/* LAND */}
              <div className="mb-4">
                <label className="text-sm text-slate-500 font-medium">
                  Land Area (Acres)
                </label>
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500/20"
                />
                {errors.area && (
                  <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                )}
              </div>

              {/* SOIL */}
              <div className="mb-4">
                <label className="text-sm text-slate-500 font-medium">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500/20"
                >
                  <option value="">Select Soil Type</option>
                  {VALID_SOILS.map((s) => (
                    <option key={s} value={s}>
                      {s} Soil
                    </option>
                  ))}
                </select>
                {errors.soil && (
                  <p className="text-red-500 text-sm mt-1">{errors.soil}</p>
                )}
              </div>

              {/* LOCATION */}
              <div className="mb-5">
                <label className="text-sm text-slate-500 font-medium">
                  Location
                </label>
                <input
                  list="locations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500/20"
                />
                <datalist id="locations">
                  {locationSuggestions.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing AI Analytics...
                  </>
                ) : (
                  "Generate Recommendations"
                )}
              </button>
            </div>

            {/* INFO BOX */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-slate-600 flex gap-3 mt-5">
              <Info size={18} className="text-green-600 mt-0.5" />
              <p>
                AI recommendations based on historical weather and ML insights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {generated && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50" />

          <div className="relative z-10 animate-slideInRight min-h-[80vh] p-6 max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                🌱 Top Recommended Crops
              </h2>

              <button
                onClick={handleBack}
                className="text-sm text-green-700 font-semibold hover:underline bg-white px-4 py-2 rounded-lg border shadow-sm"
              >
                ← Modify Inputs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <CropCard
                  key={rec.crop}
                  delay={index * 150}
                  icon={getCropIcon(rec.crop)}
                  title={rec.crop}
                  score={`${(rec.success_rate * 100).toFixed(0)}%`}
                  barColor={getBarColor(rec.success_rate)}
                  yieldText={`${rec.expected_yield_tons} tons`}
                  profit={`₹${rec.predicted_profit}`}
                  risk={rec.risk}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
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
  );
}

/* ================= CARD ================= */

function CropCard({
  icon,
  title,
  score,
  barColor,
  yieldText,
  profit,
  risk,
  delay = 0,
}: any) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border p-6 opacity-0 animate-cardReveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-2xl font-bold">{score}</p>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full mb-4">
        <div className={`${barColor} h-full`} style={{ width: score }} />
      </div>

      <p className="text-sm">Yield: {yieldText}</p>
      <p className="text-sm text-green-600 font-semibold">Profit: {profit}</p>
      <p className="text-sm">Risk: {risk}</p>
    </div>
  );
}

