import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import CropRecommendation from "./pages/farmer/CropRecommendation";
import Register from "./components/Register";
import Profile from "./components/Profile";
import AuthPage from "./pages/AuthPage";

import FarmerLayout from "./layouts/FarmerLayout";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";

import ConsumerLayout from "./layouts/ConsumerLayout";
import ConsumerDashboard from "./pages/consumer/ConsumerDashboard";

import ProviderLayout from "./layouts/ProviderLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  const location = useLocation();

  const isPublicPage =
    location.pathname === "/auth" || location.pathname === "/";

  return (
    <div>
      <div className={isPublicPage ? "" : ""}>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<div>Home Page</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* ================= FARMER ================= */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="orders" element={<FarmerDashboard />} />

            {/* ✅ REAL CROP PAGE */}
            <Route
              path="crop-recommendation"
              element={<CropRecommendation />}
            />

            <Route
              path="mandi-price"
              element={
                <div className="p-8">
                  <h2 className="text-2xl font-bold">Mandi Price</h2>
                  <p className="mt-4">
                    Real-time market prices for your crops.
                  </p>
                </div>
              }
            />

            <Route
              path="products"
              element={
                <div className="p-8">
                  <h2 className="text-2xl font-bold">Product Management</h2>
                  <p className="mt-4">
                    Manage your inputs and vendor listings.
                  </p>
                </div>
              }
            />

            <Route
              path="settings"
              element={
                <div className="p-8">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <p className="mt-4">
                    Configure your account preferences.
                  </p>
                </div>
              }
            />
          </Route>

          {/* ================= CONSUMER ================= */}
          <Route path="/consumer" element={<ConsumerLayout />}>
            <Route index element={<ConsumerDashboard />} />
            <Route path="home" element={<ConsumerDashboard />} />
            <Route path="cart" element={<div>Cart Page</div>} />
            <Route path="orders" element={<div>Orders Page</div>} />
          </Route>

          {/* ================= PROVIDER ================= */}
          <Route path="/provider" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="inventory" element={<div>Inventory Page</div>} />
            <Route path="orders" element={<div>Orders Page</div>} />
          </Route>

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<div>User Management</div>} />
            <Route path="health" element={<div>System Health</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
