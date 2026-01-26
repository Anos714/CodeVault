import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Protected = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isCheckingAuth = useSelector((state) => state.auth.isCheckingAuth);
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default Protected;
