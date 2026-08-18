import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
      default: "Full-time",
    },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },
    salaryRange: { type: String, default: "Not disclosed" },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    applicationDeadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
