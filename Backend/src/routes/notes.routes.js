import express from 'express';
import multer from 'multer';
import { uploadNote, getNotes, deleteNote } from '../controllers/notes.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
    .get(protect, getNotes)
    .post(protect, admin, upload.single('file'), uploadNote);

router.route('/:id')
    .delete(protect, admin, deleteNote);

export default router;
