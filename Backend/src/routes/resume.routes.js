import express from "express";
import multer from "multer";
import { generateResume, optimizeResume, saveResume, previewResume } from "../controllers/resume.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/optimize", upload.fields([{ name: 'resumeFile' }, { name: 'jdFile' }]), optimizeResume); // AI Optimization with File Upload
router.post("/preview", previewResume);   // Generate PDF for preview
router.post("/download", saveResume);     // Save & Download final PDF

export default router;