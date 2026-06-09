const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/authMiddleware');
const getOtpTemplate = require('../utils/emailTemplate');
const {
    registerUser,
    loginUser,
    updateUserProfile,
    verifyRegisterOtp,
    verifyLoginOtp
} = require('../controllers/userControlller');
// Setup Email Transporter — with timeout to prevent hanging on Render cold start
const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,  // 10s to establish connection
    greetingTimeout: 10000,    // 10s to get SMTP greeting
    socketTimeout: 20000,      // 20s socket inactivity limit
});

// Log SMTP connectivity at startup to surface configuration issues early
transporter.verify()
    .then(() => console.log('✅ SMTP transporter verified — ready to send emails'))
    .catch((err) => console.error('❌ SMTP transporter verify failed at startup:', err.message || err));

// Debug: test SMTP connectivity and send a test email
router.get('/email/test', async (req, res) => {
    const to = (req.query.to || process.env.EMAIL_USER || '').toString();
    if (!to) return res.status(400).json({ message: 'No recipient specified. Provide ?to=you@example.com' });

    try {
        // Verify transporter connection first
        await transporter.verify();
    } catch (err) {
        console.error('❌ SMTP VERIFY FAILED:', err);
        return res.status(500).json({ message: 'SMTP verify failed', error: err.message || err.toString() });
    }

    try {
        const info = await transporter.sendMail({
            from: `"Antaristore Test" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Antaristore — Test Email',
            text: 'This is a test email from Antaristore backend.'
        });
        return res.json({ message: 'Test email sent', info });
    } catch (err) {
        console.error('❌ SEND TEST EMAIL FAILED:', err);
        return res.status(500).json({ message: 'Failed to send test email', error: err.message || err.toString() });
    }
});

// Debug: diagnose different SMTP configurations
router.get('/email/diagnose', async (req, res) => {
    const results = {};
    
    // Test 1: gmail service with pool
    try {
        const t1 = nodemailer.createTransport({
            service: 'gmail',
            pool: true,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            connectionTimeout: 10000,
        });
        await t1.verify();
        results.service_gmail_pool = 'SUCCESS';
    } catch (err) {
        results.service_gmail_pool = err.message || err.toString();
    }

    // Test 2: gmail service without pool
    try {
        const t2 = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            connectionTimeout: 10000,
        });
        await t2.verify();
        results.service_gmail_no_pool = 'SUCCESS';
    } catch (err) {
        results.service_gmail_no_pool = err.message || err.toString();
    }

    // Test 3: Port 587 (TLS)
    try {
        const t3 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            connectionTimeout: 10000,
        });
        await t3.verify();
        results.port_587_tls = 'SUCCESS';
    } catch (err) {
        results.port_587_tls = err.message || err.toString();
    }

    // Test 4: Port 465 (SSL)
    try {
        const t4 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            connectionTimeout: 10000,
        });
        await t4.verify();
        results.port_465_ssl = 'SUCCESS';
    } catch (err) {
        results.port_465_ssl = err.message || err.toString();
    }

    res.json(results);
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

        // Send OTP Email — with 15s timeout so it doesn't hang forever
        const sendMailWithTimeout = (mailOptions) =>
            Promise.race([
                transporter.sendMail(mailOptions),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Email send timeout — try again')), 15000)
                )
            ]);

        await sendMailWithTimeout({
            from: `"Antaristore Admin" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'AntariStore — Admin Sign-In Code',
            html: getOtpTemplate(otp, "login")
        });

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error("Admin Login Error:", err);
        // Return specific timeout message so user knows to retry
        const msg = err.message.includes('timeout')
            ? 'Email server is warming up — please try again in 10 seconds'
            : 'System Error: ' + err.message;
        res.status(500).json({ message: msg });
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