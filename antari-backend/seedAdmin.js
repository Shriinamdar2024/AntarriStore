const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");

        // 1. Clean up existing admin to prevent "User already exists" errors
        const email = "shriinamdar88@gmail.com";
        await User.deleteOne({ email: email });

        // 2. Create the admin with PLAIN TEXT password
        // The User.js pre-save hook will hash this for you!
        const admin = new User({
            name: "Shrirup Admin",
            email: email,
            password: "Shridnya@2026", // DO NOT HASH THIS MANUALLY
            role: "admin"
        });

        await admin.save();
        console.log("✅ Admin Account Created Successfully with correct hashing!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedAdmin();