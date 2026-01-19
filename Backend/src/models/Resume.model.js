import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    resumeData: {
        type: Object,
        required: true,
    },
    pdfUrl: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Resume", ResumeSchema);
