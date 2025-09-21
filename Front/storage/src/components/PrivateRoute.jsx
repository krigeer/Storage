// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../services/authService";

export default function PrivateRoute({ children }) {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; 
}