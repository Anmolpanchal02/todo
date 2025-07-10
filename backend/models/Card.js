    const mongoose = require('mongoose');

    const cardSchema = new mongoose.Schema({
        title: { type: String, required: true, trim: true },
        desc: { type: String, required: true },
        filesize: { type: String, default: 'N/A' },
        fileURL: { type: String, default: null }, // This will now store the Cloudinary URL
        cloudinaryPublicId: { type: String, default: null }, // <-- New field for Cloudinary Public ID
        tag: {
            isOpen: { type: Boolean, default: false },
            textTitle: { type: String, default: '' },
            tagColor: { type: String, default: 'green' },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }, { timestamps: true });

    module.exports = mongoose.model('Card', cardSchema);