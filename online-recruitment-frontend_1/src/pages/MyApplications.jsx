import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/applications/my");
        setApplications(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Applications</h1>
      <p className="text-gray-500 text-sm mb-6">Track the status of jobs you've applied to</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
          <Link
            to="/"
            className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-brand-700"
          >
            Browse Open Positions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {app.job?.title || "Job no longer available"}
                  </h3>
                  {app.job && (
                    <p className="text-sm text-gray-500">
                      {app.job.company} · {app.job.location} · {app.job.type}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="mt-3 text-sm flex flex-wrap items-center gap-4">
                <a
                  href={app.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline font-medium"
                >
                  View Submitted Resume →
                </a>
                {app.job && (
                  <Link to={`/jobs/${app.job._id}`} className="text-brand-600 hover:underline">
                    View Job
                  </Link>
                )}
              </div>

              {app.coverNote && (
                <p className="text-sm text-gray-600 mt-2 italic">"{app.coverNote}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
