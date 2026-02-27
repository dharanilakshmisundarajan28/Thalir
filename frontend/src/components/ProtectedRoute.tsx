// src/components/ProtectedRoute.tsx
// Place this in: src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import authService from "../services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g. ["ROLE_FARMER"], ["ROLE_PROVIDER"], ["ROLE_ADMIN"]
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = authService.getCurrentUser();

  // 1. No user in localStorage → send to login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if token is expired (JWT payload is base64 encoded)
  try {
    const payload = JSON.parse(atob(user.token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      // Clear stale token and redirect
      authService.logout();
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Token is malformed
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  // 3. Role check (optional — only if allowedRoles is provided)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles: string[] = user.roles ?? [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. All checks passed → render the page
  return <>{children}</>;
};

export default ProtectedRoute;