import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const JobCard = ({ job }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
      </div>
      <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-1 rounded-full whitespace-nowrap">
        {job.type}
      </span>
    </div>
    <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm font-medium text-gray-700">{job.salaryRange}</span>
      {job.applicationDeadline && (
        <span className="text-xs text-gray-400">
          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
        </span>
      )}
    </div>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user ? `Welcome, ${user.name.split(" ")[0]}` : "Open Positions"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user
            ? "Here are the latest jobs posted by our recruiters"
            : "Browse jobs posted by our recruiters — login or register to apply"}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search by title, company, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-96 border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
