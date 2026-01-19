import Resume from "../models/Resume.model.js";
import { optimizeResumeWithJD } from "../services/optimiseResume.js";
import { generatePDF } from "../services/pdf.service.js";

export const generateResume = async (req, res) => {
    try {
        const { userId, resumeData, jd } = req.body;

        if (!userId || !resumeData || !jd) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const optimizedResume = await optimizeResumeWithJD(resumeData, jd);

        // Just return the JSON for the frontend to show diff/edit
        res.json({
            success: true,
            optimizedResume
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Resume optimization failed" });
    }
};

import { parsePDF } from "../services/fileParsing.service.js";

export const optimizeResume = async (req, res) => {
    try {
        let resumeData = req.body.resumeData;
        let jd = req.body.jd;

        // 1. Handle File Uploads
        if (req.files) {
            // Handle Resume File
            if (req.files['resumeFile'] && req.files['resumeFile'][0]) {
                const buffer = req.files['resumeFile'][0].buffer;
                resumeData = await parsePDF(buffer);
                console.log("Parsed Resume PDF. Length:", resumeData.length);
            }

            // Handle JD File
            if (req.files['jdFile'] && req.files['jdFile'][0]) {
                const buffer = req.files['jdFile'][0].buffer;
                jd = await parsePDF(buffer);
                console.log("Parsed JD PDF. Length:", jd.length);
            }
        }

        if (!resumeData || !jd) {
            return res.status(400).json({ error: "Missing resume or JD (files or text)" });
        }

        // If resumeData came from body/JSON, it might be a stringified object if using FormData
        if (typeof resumeData === 'string') {
            try {
                resumeData = JSON.parse(resumeData);
            } catch (jsonErr) {
                console.log("Error parsing resumeData JSON:", jsonErr);
                // If it's just raw text, we might leave it as string or handle appropriately based on service expectation
            }
        }

        // [FEATURE] EXPANDED USER PROFILE
        let userProfile = null;
        if (req.body.userId) {
            try {
                // Use a standard import if possible, or keep dynamic if circular dependency is a hard constraint
                const { default: User } = await import("../models/User.model.js");
                const user = await User.findById(req.body.userId);
                if (user) {
                    userProfile = {
                        projects: user.projects || [],
                        certifications: user.certifications || []
                    };
                }
            } catch (fetchErr) {
                console.error("Error fetching user profile:", fetchErr);
                // Non-critical, continue without profile
            }
        }

        const optimizedResume = await optimizeResumeWithJD(resumeData, jd, userProfile);


        if (req.body.userId) {
            try {
                const User = (await import("../models/User.model.js")).default;
                const user = await User.findById(req.body.userId);

                if (user && user.socialLinks) {
                    if (!optimizedResume.personalInfo) optimizedResume.personalInfo = {};

                    if (user.socialLinks.github) optimizedResume.personalInfo.github = user.socialLinks.github;
                    if (user.socialLinks.linkedin) optimizedResume.personalInfo.linkedin = user.socialLinks.linkedin;
                    if (user.socialLinks.leetcode) optimizedResume.personalInfo.leetcode = user.socialLinks.leetcode;
                    if (user.socialLinks.portfolio) optimizedResume.personalInfo.portfolio = user.socialLinks.portfolio;
                    if (user.socialLinks.phone) optimizedResume.personalInfo.phone = user.socialLinks.phone;
                }

                if (optimizedResume.projects && user.projects && user.projects.length > 0) {
                    optimizedResume.projects = optimizedResume.projects.map(optProj => {
                        // Find matching project in user profile (fuzzy match by title)
                        const profileProj = user.projects.find(p => {
                            const pName = (p.name || "").trim().toLowerCase();
                            const optTitle = (optProj.title || "").trim().toLowerCase();

                            // Skip if either is invalid or too short to save
                            if (pName.length < 3 || optTitle.length < 3) return false;

                            return pName.includes(optTitle) || optTitle.includes(pName);
                        });

                        // If found and has a link, add it
                        if (profileProj && profileProj.link) {
                            return { ...optProj, link: profileProj.link };
                        }
                        return optProj;
                    });
                }

                // 3. Merge Certification Links
                if (optimizedResume.certifications && user.certifications && user.certifications.length > 0) {
                    optimizedResume.certifications = optimizedResume.certifications.map(optCert => {
                        // Handle if AI returned string instead of object (legacy/fallback)
                        let certName = typeof optCert === 'string' ? optCert : optCert.name;
                        let certObj = typeof optCert === 'string' ? { name: optCert } : optCert;

                        // Find matching cert in user profile
                        const profileCert = user.certifications.find(c => {
                            const cName = (c.name || "").trim().toLowerCase();
                            const optName = (certName || "").trim().toLowerCase();

                            // Skip if either is invalid or too short
                            if (cName.length < 3 || optName.length < 3) return false;

                            return cName.includes(optName) || optName.includes(cName);
                        });

                        if (profileCert && profileCert.link) {
                            return { ...certObj, link: profileCert.link };
                        }
                        return certObj;
                    });
                }
            } catch (mergeErr) {
                console.error("Error merging user profile links:", mergeErr);
            }
        }

        // Stateless: We just return the data. We DO NOT save to DB.
        res.json({
            success: true,
            optimizedResume
        });

    } catch (err) {
        console.error("Optimization Error Detail:", err);
        console.error("Stack:", err.stack);
        res.status(500).json({ error: "Optimization failed: " + err.message });
    }
};

export const previewResume = async (req, res) => {
    try {
        const { resumeData, templateId } = req.body;

        if (!resumeData || !templateId) {
            return res.status(400).json({ error: "Missing resumeData or templateId" });
        }

        const pdfBuffer = await generatePDF(resumeData, templateId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("Preview Error Detail:", err);
        res.status(500).json({ error: "Failed to generate preview: " + err.message });
    }
};

export const saveResume = async (req, res) => { // This acts as the 'download' and 'save'
    try {
        const { userId, resumeData, templateId } = req.body;

        if (!userId || !resumeData || !templateId) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // 1. Generate the final PDF
        const pdfBuffer = await generatePDF(resumeData, templateId);


        await Resume.findOneAndUpdate(
            { userId },
            {
                resumeData,
                updatedAt: new Date()
                // pdfUrl: ... (if we were uploading to S3)
            },
            { upsert: true }
        );

        // 3. Return the PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="resume_${userId}.pdf"`
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("Save/Download Error:", err.message);
        res.status(500).json({ error: "Failed to save and download resume" });
    }
};
