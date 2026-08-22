import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState("");

  const [form, setForm] = useState({ resumeLink: "", coverNote: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setJobLoading(true);
      setJobError("");
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setJobError(err.response?.data?.message || "Failed to load this job");
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/applications", { jobId: id, ...form });
      setSuccess(true);
      setTimeout(() => navigate("/my-applications"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (jobLoading) {
    return <p className="text-center text-gray-500 mt-16">Loading job...</p>;
  }

  if (jobError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{jobError}</p>
        <Link to="/" className="text-brand-600 hover:underline font-medium">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to={`/jobs/${id}`} className="text-sm text-brand-600 hover:underline">
        ← Back to Job Details
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Apply for {job?.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {job?.company} · {job?.location}
        </p>

        {success ? (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-md">
            Application submitted! Redirecting to your applications...
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="resumeLink"
                  required
                  placeholder="https://drive.google.com/your-resume"
                  value={form.resumeLink}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Link to your resume (Google Drive, Dropbox, portfolio, etc.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Note (optional)
                </label>
                <textarea
                  name="coverNote"
                  rows={5}
                  placeholder="Briefly tell the recruiter why you're a good fit..."
                  value={form.coverNote}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 text-white py-2.5 rounded-md font-medium hover:bg-brand-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
