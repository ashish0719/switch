import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileKey: {
        type: String,
        required: true
    },
    fileKey: {
        type: String,
        required: true
    },
    // fileUrl removed as it is generated dynamically (presigned)
    type: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
