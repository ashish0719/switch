import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            // Role defaults to 'user' in schema
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "fallbackSecret", { expiresIn: "1h" });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                socialLinks: newUser.socialLinks, // Empty by default
                projects: newUser.projects,
                certifications: newUser.certifications
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallbackSecret", { expiresIn: "1h" });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                socialLinks: user.socialLinks,
                projects: user.projects,
                certifications: user.certifications
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { userId, socialLinks, projects, certifications } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (socialLinks) user.socialLinks = socialLinks;
        if (projects) user.projects = projects;
        if (certifications) user.certifications = certifications;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                socialLinks: user.socialLinks,
                projects: user.projects,
                certifications: user.certifications
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {


        const userId = req.user?.id; // from middleware
        if (!userId) return res.status(401).json({ error: "No token, authorization denied" });

        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};
