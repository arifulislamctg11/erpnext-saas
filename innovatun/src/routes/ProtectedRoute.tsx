import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/use-auth";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/register" replace />;
  if (isAdmin && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}


