import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/use-auth";

export default function AdminProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading, isAdmin } = useAuth();
  
  // Temporarily bypass admin check for UI testing
  // TODO: Remove this bypass when ready for production
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  // if (!isAdmin) return <Navigate to="/dashboard" replace />;
  
  return children;
}
