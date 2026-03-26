const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if the request has a "Bearer token" in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the database (excluding password) and attach to the request
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found, authorization denied' });
            }

            return next(); // Move to the next function and exit protect
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If the loop finished without finding a valid token
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if the user is an Admin
const admin = (req, res, next) => {
    // Check if the user exists and has the correct role OR boolean
    // This allows support for both 'role: admin' and 'isAdmin: true' schemas
    if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
        next();
    } else {
        // Use 403 Forbidden for role issues so the frontend 
        // can distinguish between "Login Expired" (401) and "Not an Admin" (403)
        res.status(403).json({ message: 'Access Denied: Admin privileges required' });
    }
};

module.exports = { protect, admin };