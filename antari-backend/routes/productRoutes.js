const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <--- ADD THIS LINE
const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware'); // Your Cloudinary middleware

// @desc    Add a new product with image upload
// @route   POST /api/products/add
router.post('/add', upload.array('image', 5), async (req, res) => {
    try {
        const { name, description, price, category, subCategory, metadata } = req.body;

        // Parse metadata string back into an object
        const parsedMetadata = metadata ? JSON.parse(metadata) : {};

        // Extract Cloudinary URLs from the uploaded files array
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            subCategory,
            images: imageUrls,
            isActive: true, // FIXED: Ensures new products show up on the customer side immediately
            // Spread the metadata fields into the document
            fit: parsedMetadata.fit,
            fabric: parsedMetadata.fabric,
            sizes: parsedMetadata.sizes,
            colors: parsedMetadata.colors,
            brand: parsedMetadata.brand,
            model: parsedMetadata.model,
            material: parsedMetadata.material
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Route Error:", err);
        res.status(400).json({ message: err.message });
    }
});

// --- MOVED ABOVE /:ID TO PREVENT ROUTE CONFLICT ---
// @desc    Get all active products for the Storefront
// @route   GET /api/products/public
router.get('/public', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get a single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id.trim();

        // Now that mongoose is imported, this line will work:
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        // This will print the actual error to your VS Code terminal
        console.error("Database Query Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// @desc    Toggle product active status
// @route   PATCH /api/products/:id/toggle
router.patch('/:id/toggle', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.isActive = !product.isActive;
        await product.save();

        res.json({
            message: `Product ${product.isActive ? 'Enabled' : 'Disabled'}`,
            isActive: product.isActive
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;