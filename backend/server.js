    require('dotenv').config(); // <-- MUST BE AT THE VERY TOP
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');

    // Ensure Cloudinary is configured when the server starts
    require('./config/cloudinaryConfig'); // <-- Require Cloudinary config here

    const cardRoutes = require('./routes/cardRoutes');
    const authRoutes = require('./routes/authRoutes');

    const app = express();

    app.use(cors());
    app.use(express.json()); // For parsing JSON bodies

    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log('MongoDB Connected'))
      .catch((err) => console.error('MongoDB Error:', err));

    // API Routes
    app.use('/api/cards', cardRoutes);
    app.use('/api/auth', authRoutes);

    // 404 fallback for any unhandled routes
    app.use((req, res) => {
        res.status(404).json({ error: 'API endpoint not found' });
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
    