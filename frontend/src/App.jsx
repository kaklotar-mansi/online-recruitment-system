import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import ApplyJob from "./pages/ApplyJob.jsx";
import MyApplications from "./pages/MyApplications.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageJobs from "./pages/admin/ManageJobs.jsx";
import PostJob from "./pages/admin/PostJob.jsx";
import EditJob from "./pages/admin/EditJob.jsx";
import ViewApplications from "./pages/admin/ViewApplications.jsx";
import ApplicantRecords from "./pages/admin/ApplicantRecords.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public landing: job listing — visible to everyone, applicants included */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Job details — public, visible to everyone */}
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Applicant */}
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute role="applicant">
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="applicant">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute role="admin">
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/new"
          element={
            <ProtectedRoute role="admin">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:jobId/applications"
          element={
            <ProtectedRoute role="admin">
              <ViewApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applicants"
          element={
            <ProtectedRoute role="admin">
              <ApplicantRecords />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
