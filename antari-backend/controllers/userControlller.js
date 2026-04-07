const getOtpTemplate = require('../utils/emailTemplate');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper to create JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error("❌ CRITICAL ERROR: JWT_SECRET is not defined in your .env file!");
        return jwt.sign({ id }, 'temporary_secret_key', { expiresIn: '30d' });
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ================= REGISTER STEP 1 (SEND OTP) =================
exports.registerUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "No data sent in request" });
    }

    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'EMAIL REQUIRED' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        let user = await User.findOne({ email: normalizedEmail });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'USER ALREADY EXISTS' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (!user) {
            user = new User({
                name: "temp_user", // ✅ FIX
                email: normalizedEmail,
                password: "temp123",
                otp,
                otpExpires: Date.now() + 10 * 60 * 1000
            });
        } else {
            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000;
        }

        await user.save();

        await transporter.sendMail({
            to: user.email,
            subject: "AntariStore — Verify Your Email",
            html: getOtpTemplate(otp, "register")
        });

        res.json({ message: "OTP sent to email", email: user.email });

    } catch (error) {
        console.error("❌ OTP SEND ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= REGISTER STEP 2 (VERIFY OTP + SET PASSWORD) =================
exports.verifyRegisterOtp = async (req, res) => {
    const { email, otp, name, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "INVALID OR EXPIRED OTP" });
        }

        user.name = name;
        user.password = password;
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.json({
            message: "REGISTRATION COMPLETE",
            token: generateToken(user._id),
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= LOGIN STEP 1 (PASSWORD → SEND OTP) =================
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'EMAIL AND PASSWORD REQUIRED' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !user.isVerified) {
            return res.status(401).json({ message: 'USER NOT VERIFIED' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        await transporter.sendMail({
            to: user.email,
            subject: "AntariStore — Sign-In Verification Code",
            html: getOtpTemplate(otp, "login")
        });

        res.json({ message: "OTP sent to email" });

    } catch (error) {
        console.error("❌ LOGIN OTP ERROR:", error.message);
        res.status(500).json({ message: `SERVER ERROR: ${error.message.toUpperCase()}` });
    }
};

// ================= LOGIN STEP 2 (VERIFY OTP) =================
exports.verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "INVALID OR EXPIRED OTP" });
        }

        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            fullName: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= EXISTING PROFILE (UNCHANGED) =================
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.fullName || req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.pincode = req.body.pincode || user.pincode;

            user.cardName = req.body.cardName || user.cardName;
            user.cardNumber = req.body.cardNumber || user.cardNumber;
            user.expiry = req.body.expiry || user.expiry;

            const updatedUser = await user.save();

            res.json({
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.name,
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