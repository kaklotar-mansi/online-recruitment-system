import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await api.get(`/jobs/${id}`);
      setForm({
        ...data,
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline).toISOString().slice(0, 10)
          : "",
      });
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/jobs/${id}`, form);
      navigate("/admin/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input name="title" required value={form.title} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input name="company" required value={form.company} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" required value={form.location} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input name="salaryRange" value={form.salaryRange} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
            <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" required rows={5} value={form.description} onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
          <textarea name="requirements" rows={4} value={form.requirements} onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <button type="submit" disabled={loading}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-brand-700 disabled:opacity-60">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditJob;
