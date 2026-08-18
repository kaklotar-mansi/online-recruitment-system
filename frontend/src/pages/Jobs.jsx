import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

// Basic job listing shown to applicants after login.
// (Job details, apply flow, and "My Applications" will be added
// separately as part of the full Applicant module.)
const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs");
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Open Positions</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""} — here are the currently active jobs.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {job.company} · {job.location}
                  </p>
                </div>
                <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2 py-1 rounded-full">
                  {job.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
              <p className="text-sm font-medium text-gray-700 mt-3">{job.salaryRange}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
