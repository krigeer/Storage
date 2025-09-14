import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/authService";

export default function PrivateRoute() {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
}
