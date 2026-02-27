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
import ConsumerProducts from "./pages/consumer/ConsumerProducts";
import ConsumerCart from "./pages/consumer/ConsumerCart";
import ConsumerOrders from "./pages/consumer/ConsumerOrders";

import ProviderLayout from "./layouts/ProviderLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import Analytics from "./components/fertilizer/Analytics";
import ProductManagement from "./components/fertilizer/ProductManagement";
import OrderHistory from "./components/fertilizer/OrderHistory";
import ProviderSettings from "./components/fertilizer/Settings";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import FertilizerMarket from "./pages/farmer/FertilizerMarket";
import Inventory from "./pages/farmer/Inventory";
import MandiPrice from "./pages/farmer/MandiPrice";
import GovernmentSchemes from "./pages/farmer/GovernmentSchemes";
import Orders from "./pages/farmer/Orders";


const App = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === "/auth" || location.pathname === "/";

  return (
    <div>
      <div className={isPublicPage ? "" : ""}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/"         element={<AuthPage />} />
          <Route path="/auth"     element={<AuthPage />} />
          <Route path="/login"    element={<Navigate to="/" replace />} />
          <Route path="/home"     element={<div>Home Page</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile"  element={<Profile />} />

          {/* ================= FARMER ================= */}
          <Route path="/farmer" element={
            <ProtectedRoute allowedRoles={["ROLE_FARMER"]}>
              <FarmerLayout />
            </ProtectedRoute>
          }>
            <Route index                      element={<FarmerDashboard />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="orders"    element={<Orders />} />
            <Route path="crop-recommendation" element={<CropRecommendation />} />
            <Route path="mandi-price" element={<MandiPrice/>} />
            <Route path="products" element={<Inventory/>} />
            <Route path="government-schemes" element={<GovernmentSchemes/>} />
            <Route path="fertilizer-market" element={<FertilizerMarket />} />
            <Route path="settings" element={
              <div className="p-8">
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="mt-4">Configure your account preferences.</p>
              </div>
            } />
          </Route>

          {/* ================= CONSUMER ================= */}
          <Route path="/consumer" element={
            <ProtectedRoute allowedRoles={["ROLE_CONSUMER"]}>
              <ConsumerLayout />
            </ProtectedRoute>
          }>
            <Route index             element={<ConsumerDashboard />} />
            <Route path="home"       element={<ConsumerDashboard />} />
            <Route path="products"   element={<ConsumerProducts />} />
            <Route path="cart"       element={<ConsumerCart />} />
            <Route path="orders"     element={<ConsumerOrders />} />
          </Route>

          {/* ================= PROVIDER ================= */}
          <Route path="/provider" element={
            <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
              <ProviderLayout />
            </ProtectedRoute>
          }>
            <Route index            element={<ProviderDashboard />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products"  element={<ProductManagement />} />
            <Route path="orders"    element={<OrderHistory />} />
            <Route path="settings"  element={<ProviderSettings />} />
          </Route>

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index            element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users"     element={<div>User Management</div>} />
            <Route path="health"    element={<div>System Health</div>} />
            <Route path="settings"  element={<div>Settings</div>} />
          </Route>

          {/* ================= FALLBACKS ================= */}
          <Route path="/unauthorized" element={
            <div style={{ padding: 40, textAlign: "center" }}>
              <h2>⛔ Access Denied</h2>
              <p>You don't have permission to view this page.</p>
              <a href="/">Go to Login</a>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;