const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');
const getOtpTemplate = require('../utils/emailTemplate');
const {
    registerUser,
    loginUser,
    updateUserProfile,
    verifyRegisterOtp,
    verifyLoginOtp
} = require('../controllers/userControlller');

// Brevo HTTP Email Sender Helper
const sendBrevoEmail = async (to, subject, html) => {
    if (!process.env.BREVO_API_KEY) {
        console.warn("⚠️ BREVO_API_KEY is not defined. Email will not be sent.");
        throw new Error("Email service is not configured (BREVO_API_KEY missing)");
    }
    
    await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
            sender: {
                name: 'Antari Store',
                email: process.env.EMAIL_USER || 'shriinamdar88@gmail.com'
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html
        },
        {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
};

// Debug: test SMTP connectivity and send a test email
router.get('/email/test', async (req, res) => {
    const to = (req.query.to || process.env.EMAIL_USER || '').toString();
    if (!to) return res.status(400).json({ message: 'No recipient specified. Provide ?to=you@example.com' });

    try {
        await sendBrevoEmail(
            to,
            'Antaristore — Test Email',
            'This is a test email from Antaristore backend.'
        );
        return res.json({ message: 'Test email sent successfully via Brevo API' });
    } catch (err) {
        console.error('❌ SEND TEST EMAIL FAILED:', err.response?.data || err.message);
        const errMsg = err.response?.data?.message || err.message || err.toString();
        return res.status(500).json({ message: 'Failed to send test email', error: errMsg });
    }
});

// --- CUSTOMER ROUTES ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-register', verifyRegisterOtp);
router.post('/verify-login', verifyLoginOtp);
// --- PERMANENT PROFILE SYNC ---
// Handles the "Save" button in Profile.js - persists to DB permanently
router.put('/profile', protect, updateUserProfile);

// --- ADMIN ROUTES (Lifetime Access) ---
router.post('/admin/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Force role to 'admin' so seedAdmin is never needed again
        const newUser = new User({
            name,
            email: normalizedEmail,
            password,
            role: 'admin'
        });

        await newUser.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        // Check if user exists and is actually an admin
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: "Access Denied: Admin not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save({ validateModifiedOnly: true });

        // Send OTP Email
        try {
            await sendBrevoEmail(
                user.email,
                'AntariStore — Admin Sign-In Code',
                getOtpTemplate(otp, "login")
            );
        } catch (mailErr) {
            console.error("❌ Send OTP Email Failed:", mailErr.response?.data || mailErr.message);
            throw new Error("Email delivery failed: " + (mailErr.response?.data?.message || mailErr.message));
        }

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: 'System Error: ' + err.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateModifiedOnly: true });

        // Create JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;