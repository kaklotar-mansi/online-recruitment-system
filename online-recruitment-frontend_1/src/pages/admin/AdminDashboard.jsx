import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const StatCard = ({ label, value, to }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow block"
  >
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, activeJobs: 0, applications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get("/jobs?all=true"),
          api.get("/applications"),
        ]);
        setStats({
          jobs: jobsRes.data.length,
          activeJobs: jobsRes.data.filter((j) => j.status === "active").length,
          applications: appsRes.data.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard label="Total Jobs Posted" value={stats.jobs} to="/admin/jobs" />
          <StatCard label="Active Jobs" value={stats.activeJobs} to="/admin/jobs" />
          <StatCard label="Total Applications" value={stats.applications} to="/admin/applicants" />
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link
          to="/admin/jobs/new"
          className="bg-brand-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-brand-700"
        >
          + Post New Job
        </Link>
        <Link
          to="/admin/applicants"
          className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-md font-medium hover:bg-gray-50"
        >
          View Applicant Records
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
