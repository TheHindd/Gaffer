import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useAppContext();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default RoleProtectedRoute;
