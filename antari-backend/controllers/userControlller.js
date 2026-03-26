const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to create JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error("❌ CRITICAL ERROR: JWT_SECRET is not defined in your .env file!");
        return jwt.sign({ id }, 'temporary_secret_key', { expiresIn: '30d' });
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new customer
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "No data sent in request" });
    }

    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'PLEASE FILL ALL FIELDS' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'USER ALREADY EXISTS' });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: 'customer'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("❌ REGISTRATION ERROR:", error);
        res.status(500).json({ message: `SERVER ERROR: ${error.message.toUpperCase()}` });
    }
};

// @desc    Authenticate customer & get token
// @route   POST /api/users/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'EMAIL AND PASSWORD REQUIRED' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD' });
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                fullName: user.name, // Added for frontend consistency
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                pincode: user.pincode || '',
                cardName: user.cardName || '',
                cardNumber: user.cardNumber || '',
                expiry: user.expiry || '',
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD' });
        }
    } catch (error) {
        console.error("❌ LOGIN 500 ERROR:", error.message);
        res.status(500).json({ message: `SERVER ERROR: ${error.message.toUpperCase()}` });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Personal Info
            // Fix: Map 'fullName' from frontend to 'name' in DB
            user.name = req.body.fullName || req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            // Shipping
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.pincode = req.body.pincode || user.pincode;

            // Billing
            user.cardName = req.body.cardName || user.cardName;
            user.cardNumber = req.body.cardNumber || user.cardNumber;
            user.expiry = req.body.expiry || user.expiry;

            // Ensure role doesn't change during profile update
            const updatedUser = await user.save();

            res.json({
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.name, // Mapping back for React state consistency
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    city: updatedUser.city,
                    pincode: updatedUser.pincode,
                    cardName: updatedUser.cardName,
                    cardNumber: updatedUser.cardNumber,
                    expiry: updatedUser.expiry,
                    role: updatedUser.role,
                }
            });
        } else {
            res.status(404).json({ message: 'USER NOT FOUND' });
        }
    } catch (error) {
        console.error("❌ PROFILE UPDATE ERROR:", error.message);
        res.status(500).json({ message: `SERVER ERROR: ${error.message.toUpperCase()}` });
    }
};