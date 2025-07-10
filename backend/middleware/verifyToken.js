const jwt = require('jsonwebtoken');

// IMPORTANT: Load this from your .env file
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header (e.g., "Bearer YOUR_TOKEN")
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach the decoded user payload (which contains the user ID) to the request object
        req.user = decoded; // req.user.id will contain the user's ID
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // Handle cases where the token is invalid or expired
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};

module.exports = verifyToken;