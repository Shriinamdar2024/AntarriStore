const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- MIDDLEWARE ---
// UPDATED: Added a function to handle multiple Vercel subdomains and preview URLs
const allowedOrigins = [
    "http://localhost:5173",
    "https://antarristore.vercel.app",
    "https://antarri-store.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list OR is a Vercel subdomain
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err.stack);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;
// UPDATED: Added '0.0.0.0' to ensure the server binds to the correct network interface on Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
});