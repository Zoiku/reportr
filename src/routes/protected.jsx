import { useAuthStore } from "@/hooks/use-auth-store";
import Authenticating from "@/pages/system/authenticating";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function Protected() {
  const location = useLocation();
  const { isAuthenticating, getIsAuthenticated } = useAuthStore();

  if (isAuthenticating) return <Authenticating />;

  if (!getIsAuthenticated()) {
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
