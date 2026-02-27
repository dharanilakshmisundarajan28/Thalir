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

  // 1. No user info → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role check (optional — only if allowedRoles is provided)
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