import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc  Get all active jobs (public) - admin sees all
// @route GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const filter = req.query.all === "true" ? {} : { status: "active" };
    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// @desc  Get single job by id
// @route GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// @desc  Create a job (admin only)
// @route POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const { title, company, location, type, description, requirements, salaryRange, applicationDeadline } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      requirements,
      salaryRange,
      applicationDeadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a job (admin only)
// @route PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a job (admin only)
// @route DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job and related applications deleted" });
  } catch (err) {
    next(err);
  }
};
