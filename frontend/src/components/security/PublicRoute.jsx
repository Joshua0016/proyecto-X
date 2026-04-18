import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) return <Navigate to="/home/members" replace />;

  return children;
}
