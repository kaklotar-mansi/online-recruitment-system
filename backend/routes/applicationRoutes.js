import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, adminOnly, applicantOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, applicantOnly, applyToJob);
router.get("/my", protect, applicantOnly, getMyApplications);
router.get("/job/:jobId", protect, adminOnly, getApplicationsForJob);
router.get("/", protect, adminOnly, getAllApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

export default router;
