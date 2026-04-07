const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- MIDDLEWARE ---
// ✅ FIXED: Simplified CORS to avoid preflight issues
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
// UPDATED: Added timeout options to resolve ECONNRESET and handshake issues
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log("✅ DATABASE CONNECTED"))
    .catch((err) => {
        console.error("❌ CONNECTION ERROR:", err.message);
        // Helpful hint for ECONNRESET
        if (err.message.includes('ECONNRESET')) {
            console.log("💡 Tip: Check your MongoDB Atlas Network Access (IP Whitelist).");
        }
    });

// --- ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);

app.get('/', (req, res) => {
    res.send("Antaristore API is running...");
});

// Keep-alive ping endpoint — used by frontend to wake Render before heavy requests
app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'awake' });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err.stack);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
});