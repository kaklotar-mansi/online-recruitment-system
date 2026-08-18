import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc  Applicant applies to a job
// @route POST /api/applications
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, resumeLink, coverNote } = req.body;

    if (!jobId || !resumeLink) {
      return res.status(400).json({ message: "jobId and resumeLink are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "active") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeLink,
      coverNote,
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

// @desc  Applicant views their own applications
// @route GET /api/applications/my
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type status")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// @desc  Admin views all applications for a specific job
// @route GET /api/applications/job/:jobId
export const getApplicationsForJob = async (req, res, next) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email phone")
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// @desc  Admin views all applications (applicant records) across all jobs
// @route GET /api/applications
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({})
      .populate("applicant", "name email phone")
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// @desc  Admin updates application status
// @route PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Shortlisted", "Rejected", "Hired"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    next(err);
  }
};
