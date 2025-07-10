const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// IMPORTANT: Load this from your .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
        return res.status(400).json({ error: 'All fields (email, password, fullname) are required.' });
    }

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        const newUser = new User({ email, password, fullname }); // Password hashing handled by pre-save hook in User model
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' }); // Optional: add expiry
        res.status(201).json({ token, message: 'User registered successfully!' }); // 201 Created
        console.log('Signup request for:', email);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Compare plain text password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Optional: add expiry
        res.json({ token, message: 'Logged in successfully!' });
        console.log('Login request for:', email);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

module.exports = router;