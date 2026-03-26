const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true }, // 'Clothing' or 'Mobile Accessories'

    // Image Data from Cloudinary
    images: [{ type: String, required: true }], // Array to store multiple Cloudinary URLs

    // Clothing Specific Fields
    fit: { type: String },
    fabric: { type: String },
    sizes: [String],
    colors: [{ name: String, hex: String }],

    // Mobile Accessories Specific Fields
    subCategory: { type: String }, // 'Mobile Case', 'Cables', etc.
    brand: { type: String },
    model: { type: String },

    // Management Fields
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);