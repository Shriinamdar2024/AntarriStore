const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Links order to a specific user account
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    customerName: { type: String, required: true },
    email: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },

    // For tracking
    orderId: { type: String, required: true },
    trackingId: { type: String },

    // Changed from 'items' to 'orderItems' to align with standard MERN patterns
    orderItems: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true }
    }],

    // Pricing
    itemsPrice: { type: Number, default: 0.0 },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    // Payment
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    status: {
        type: String,
        // UPDATED: Added 'Out for Delivery' to the allowed values
        enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Processing' // Start at Processing for better UX
    },
    shippingAddress: {
        address: { type: String },
        city: { type: String },
        pincode: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);