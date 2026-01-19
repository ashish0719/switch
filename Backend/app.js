import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import resumeRoutes from "./src/routes/resume.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import notesRoutes from "./src/routes/notes.routes.js";
import cors from "cors";





const app = express();


connectDB();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});




app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/notes", notesRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}); 