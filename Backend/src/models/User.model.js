import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    socialLinks: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        leetcode: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        phone: { type: String, default: "" }
    },
    projects: [{
        title: String,
        link: String,
        description: String
    }],
    certifications: [{
        name: String,
        issuer: String,
        link: String,
        date: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
