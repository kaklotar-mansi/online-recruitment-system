import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/jobs?all=true");
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleStatus = async (job) => {
    try {
      await api.put(`/jobs/${job._id}`, {
        status: job.status === "active" ? "closed" : "active",
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job and all its applications?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
        <Link
          to="/admin/jobs/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-md font-medium hover:bg-brand-700"
        >
          + Post New Job
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                  <td className="px-4 py-3 text-gray-600">{job.company}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        job.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/jobs/${job._id}/applications`} className="text-brand-600 hover:underline">
                      Applications
                    </Link>
                    <Link to={`/admin/jobs/${job._id}/edit`} className="text-brand-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => toggleStatus(job)} className="text-yellow-600 hover:underline">
                      {job.status === "active" ? "Close" : "Reopen"}
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
