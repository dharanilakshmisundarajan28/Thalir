import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Login from "./components/Login";
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
import type { IUser } from "./types/user.type";

const App = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  // Only show navbar on legacy pages, hide on new AuthPage
  const isPublicPage = location.pathname === '/auth' || location.pathname === '/';

  return (
    <div>
      {!isPublicPage && (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            THALIR
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>
      )}

      <div className={isPublicPage ? "" : "container mt-3"}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<div>Home Page</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
          </Route>

          {/* Consumer Routes */}
          <Route path="/consumer" element={<ConsumerLayout />}>
            <Route index element={<ConsumerDashboard />} />
            <Route path="home" element={<ConsumerDashboard />} />
            <Route path="cart" element={<div>Cart Page</div>} />
            <Route path="orders" element={<div>Orders Page</div>} />
          </Route>

          {/* Provider Routes */}
          <Route path="/provider" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="inventory" element={<div>Inventory Page</div>} />
            <Route path="orders" element={<div>Orders Page</div>} />
          </Route>

          {/* Admin Routes */}
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
