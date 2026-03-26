const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { addOrderItems, getOrderByTrackingId } = require('../controllers/orderController');
const Order = require('../models/Order');

// 1. Create Order (Customer)
router.post('/', protect, addOrderItems);

// 2. GET ALL ORDERS (Admin Only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. GET LOGGED IN USER ORDERS (Customer)
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. TRACK ORDER BY CUSTOM TRACKING ID (Public/Secured)
// Updated to use the dedicated controller for consistency
router.get('/track/:id', protect, getOrderByTrackingId);

// 5. UPDATE ORDER STATUS (Admin Only)
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. CANCEL ORDER (Supports both Database _id and Custom orderId)
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const { id } = req.params;
        let order;

        // Step A: Attempt to find by custom Order ID (e.g., ANT-123)
        order = await Order.findOne({ orderId: id.toUpperCase() });

        // Step B: Fallback to finding by MongoDB _id if not found by custom ID
        // Only attempt if the ID looks like a valid MongoDB ObjectId
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        }

        if (order) {
            // Security Check
            const isOwner = order.user.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'admin' || req.user.isAdmin === true;

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to cancel this order' });
            }

            // Logistics Logic: Block cancellation if it's already on the move
            const restrictedStatuses = ['Shipped', 'Out for Delivery', 'Delivered'];
            if (restrictedStatuses.includes(order.status)) {
                return res.status(400).json({ message: 'Cannot cancel order once it has entered the logistics phase' });
            }

            order.status = 'Cancelled';
            order.cancelReason = req.body.reason || 'Cancelled by user';
            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Acquisition Record Not Found' });
        }
    } catch (error) {
        console.error("Cancellation Error:", error);
        res.status(500).json({ message: 'Server Error during cancellation process' });
    }
});

module.exports = router;