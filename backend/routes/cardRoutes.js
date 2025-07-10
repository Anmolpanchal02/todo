    const express = require('express');
    const router = express.Router();
    const Card = require('../models/Card');
    const verifyToken = require('../middleware/verifyToken');
    const cloudinary = require('../config/cloudinaryConfig'); // <-- Import Cloudinary config
    const multer = require('multer'); // <-- Import Multer

    // Configure Multer for in-memory storage (file won't be saved to disk)
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // Create Card (Auth required, Cloudinary upload)
    router.post('/', verifyToken, upload.single('file'), async (req, res) => { // <-- Add upload middleware
        try {
            let fileURL = null;
            let cloudinaryPublicId = null;
            let fileSize = 'N/A';

            // If a file is uploaded, upload it to Cloudinary
            if (req.file) {
                // Determine resource type for Cloudinary (image or raw for others)
                const resourceType = req.file.mimetype.startsWith('image/') ? 'image' : 'raw';

                const result = await cloudinary.uploader.upload(
                    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                    {
                        resource_type: resourceType,
                        folder: `docs_app/${req.user.id}` // Organize by user ID
                    }
                );
                fileURL = result.secure_url;
                cloudinaryPublicId = result.public_id;
                fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)}mb`;
            }

            const newCard = new Card({
                title: req.body.title,
                desc: req.body.desc,
                filesize: fileSize,
                fileURL: fileURL,
                cloudinaryPublicId: cloudinaryPublicId, // <-- Save public ID
                tag: {
                    isOpen: !!fileURL,
                    textTitle: fileURL ? 'Download' : '',
                    tagColor: 'green',
                },
                userId: req.user.id
            });
            const savedCard = await newCard.save();
            res.status(201).json(savedCard);
        } catch (err) {
            console.error('Error creating card with Cloudinary upload:', err);
            res.status(500).json({ error: 'Server error: Could not create card or upload file.' });
        }
    });

    // Get Cards for Logged In User Only (Auth required) - No change needed here
    router.get('/', verifyToken, async (req, res) => {
        try {
            const cards = await Card.find({ userId: req.user.id }).sort({ createdAt: -1 });
            res.json(cards);
        } catch (err) {
            console.error('Error fetching cards:', err);
            res.status(500).json({ error: 'Server error: Could not fetch cards.' });
        }
    });

    // Update Card (Auth required: User must own the card) - No change needed here
    router.patch('/:id', verifyToken, async (req, res) => {
        try {
            const { title, desc } = req.body;
            if (!title || !desc) {
                return res.status(400).json({ error: 'Title and description cannot be empty.' });
            }

            const updatedCard = await Card.findOneAndUpdate(
                { _id: req.params.id, userId: req.user.id },
                { title, desc },
                { new: true, runValidators: true }
            );

            if (!updatedCard) {
                return res.status(403).json({ error: 'Forbidden: Card not found or you do not own this card.' });
            }
            res.json(updatedCard);
        } catch (err) {
            console.error('Error updating card:', err);
            res.status(500).json({ error: 'Server error: Could not update card.' });
        }
    });

    // Delete Card (Auth required: User must own the card, Cloudinary deletion)
    router.delete('/:id', verifyToken, async (req, res) => {
        try {
            // Find the card first to get its Cloudinary public ID
            const cardToDelete = await Card.findOne({ _id: req.params.id, userId: req.user.id });

            if (!cardToDelete) {
                return res.status(403).json({ error: 'Forbidden: Card not found or you do not own this card.' });
            }

            // If the card has a file associated with Cloudinary, delete it from Cloudinary
            if (cardToDelete.cloudinaryPublicId) {
                await cloudinary.uploader.destroy(cardToDelete.cloudinaryPublicId);
                console.log(`Deleted file from Cloudinary: ${cardToDelete.cloudinaryPublicId}`);
            }

            // Then delete the card from MongoDB
            await Card.deleteOne({ _id: req.params.id, userId: req.user.id });

            res.json({ success: true, message: 'Card and associated file deleted successfully.' });
        } catch (err) {
            console.error('Error deleting card or Cloudinary file:', err);
            res.status(500).json({ error: 'Server error: Could not delete card or associated file.' });
        }
    });

    module.exports = router;
    