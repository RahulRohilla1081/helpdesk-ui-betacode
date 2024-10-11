import React from "react";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const authRoute = localStorage.getItem("SUPPORT_DATA");

  if (!authRoute) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
