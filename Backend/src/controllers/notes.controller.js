import Note from '../models/Note.js';
import R2 from '../config/r2.js';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

export const uploadNote = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title } = req.body;
        const file = req.file;
        const fileKey = `notes/${uuidv4()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await R2.send(command);


        const note = new Note({
            title: title || file.originalname,
            fileKey,
            fileUrl: "",
            type: file.mimetype,
            uploadedBy: req.user._id
        });

        await note.save();

        res.status(201).json({ success: true, note });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during upload' });
    }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name');

        const notesWithUrls = await Promise.all(notes.map(async (note) => {
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: note.fileKey,
            });
            // Generate a signed URL valid for 1 hour (3600 seconds)
            const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });

            return {
                ...note.toObject(),
                fileUrl: signedUrl // Override the stored URL with the dynamic signed one
            };
        }));

        res.json(notesWithUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: note.fileKey,
        });

        await R2.send(command);
        await note.deleteOne();

        res.json({ success: true, message: 'Note deleted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
