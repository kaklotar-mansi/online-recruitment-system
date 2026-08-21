import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load this job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-16">Loading job...</p>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="text-brand-600 hover:underline font-medium">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) return null;

  const isClosed = job.status !== "active";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-brand-600 hover:underline">
        ← Back to Jobs
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">
              {job.company} · {job.location}
            </p>
          </div>
          <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full whitespace-nowrap">
            {job.type}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
          <span className="font-medium text-gray-800">{job.salaryRange}</span>
          {job.applicationDeadline && (
            <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
          )}
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isClosed ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
            }`}
          >
            {isClosed ? "Closed" : "Active"}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
              Requirements
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          {!user && (
            <Link
              to="/login"
              className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-brand-700"
            >
              Login to Apply
            </Link>
          )}

          {user && user.role === "applicant" && !isClosed && (
            <Link
              to={`/jobs/${job._id}/apply`}
              className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-brand-700"
            >
              Apply Now
            </Link>
          )}

          {user && user.role === "applicant" && isClosed && (
            <p className="text-sm text-gray-500">
              This job is no longer accepting applications.
            </p>
          )}

          {user && user.role === "admin" && (
            <p className="text-sm text-gray-500">
              Viewing as admin.{" "}
              <Link to="/admin/jobs" className="text-brand-600 hover:underline">
                Manage jobs →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
