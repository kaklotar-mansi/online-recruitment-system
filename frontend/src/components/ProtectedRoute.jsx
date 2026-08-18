import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  // Not logged in at all -> send to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role -> show an explicit access-denied message
  if (role && user.role !== role) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
          ⛔
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-5">You have no access to admin.</p>
        <Link
          to="/"
          className="inline-block bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
