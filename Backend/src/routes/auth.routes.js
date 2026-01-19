import express from "express";
import { register, login, updateProfile, getProfile } from "../controllers/auth.controller.js";
// import authMiddleware from "../middleware/auth.middleware.js"; // Need to create if we want protected routes

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", updateProfile); // Using PUT for updates
// router.get("/me", authMiddleware, getProfile); 

export default router;
