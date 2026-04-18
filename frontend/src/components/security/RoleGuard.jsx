import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function RoleGuard({ roles, children }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.rol)) {
    return <Navigate to="/home/access-denied" replace />;
  }

  return children;
}
