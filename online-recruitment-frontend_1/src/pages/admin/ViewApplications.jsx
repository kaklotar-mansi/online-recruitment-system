import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";

const STATUS_OPTIONS = ["Pending", "Shortlisted", "Rejected", "Hired"];

const ViewApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplications(data);
      if (data.length > 0) setJobTitle(data[0].job?.title || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/admin/jobs" className="text-sm text-brand-600 hover:underline">← Back to Manage Jobs</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">
        Applications {jobTitle && `for "${jobTitle}"`}
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No applications received yet for this job.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{app.applicant?.name}</h3>
                  <p className="text-sm text-gray-500">{app.applicant?.email} · {app.applicant?.phone || "No phone"}</p>
                  <p className="text-xs text-gray-400 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="mt-3 text-sm">
                <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-medium">
                  View Resume →
                </a>
              </div>

              {app.coverNote && (
                <p className="text-sm text-gray-600 mt-2 italic">"{app.coverNote}"</p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">Update status:</span>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(app._id, status)}
                    disabled={app.status === status}
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      app.status === status
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "border-brand-300 text-brand-600 hover:bg-brand-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
