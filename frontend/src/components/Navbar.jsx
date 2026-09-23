import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `text-sm font-medium px-1 pb-0.5 border-b-2 transition-colors ${
    isActive
      ? "text-brand-700 border-brand-600"
      : "text-slate-500 border-transparent hover:text-slate-800"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
            R
          </span>
          <span className="text-lg font-semibold text-slate-800 tracking-tight">
            RecruitHub
          </span>
          {user?.role === "admin" && (
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium ml-1">
              Admin
            </span>
          )}
        </Link>

        {/* Center nav links */}
        <div className="hidden sm:flex items-center gap-6">
          {(!user || user.role !== "admin") && (
            <NavLink to="/" end className={linkClass}>
              Jobs
            </NavLink>
          )}

          {user?.role === "applicant" && (
            <NavLink to="/my-applications" className={linkClass}>
              My Applications
            </NavLink>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/jobs" className={linkClass}>
                Manage Jobs
              </NavLink>
              <NavLink to="/admin/applicants" className={linkClass}>
                Applicant Records
              </NavLink>
            </>
          )}
        </div>

        {/* Right side auth actions */}
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-brand-700"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-slate-600">{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="border border-gray-300 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav links */}
      <div className="sm:hidden flex items-center gap-5 px-4 pb-3 -mt-1 overflow-x-auto">
        {(!user || user.role !== "admin") && (
          <NavLink to="/" end className={linkClass}>
            Jobs
          </NavLink>
        )}
        {user?.role === "applicant" && (
          <NavLink to="/my-applications" className={linkClass}>
            My Applications
          </NavLink>
        )}
        {user?.role === "admin" && (
          <>
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/jobs" className={linkClass}>
              Manage Jobs
            </NavLink>
            <NavLink to="/admin/applicants" className={linkClass}>
              Applicant Records
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
