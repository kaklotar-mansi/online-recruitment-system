import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeLink: { type: String, required: true },
    coverNote: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Rejected", "Hired"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Prevent the same applicant from applying twice to the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
