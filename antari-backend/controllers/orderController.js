const Order = require('../models/Order');

// @desc    Create new order
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentId,
        trackingId,
        orderId,
        customerName,
        email
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        try {
            const order = new Order({
                orderItems,
                user: req.user._id,
                customerName: customerName || req.user.name,
                email: email || req.user.email,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentId,
                trackingId,
                orderId: orderId ? orderId.toUpperCase() : `ANT-${Date.now()}`,
                isPaid: paymentMethod === 'Digital' || (paymentId && paymentId !== 'CASH_ON_DELIVERY'),
                paidAt: (paymentMethod === 'Digital' || paymentId) ? Date.now() : null,
                status: 'Pending'
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: 'Order creation failed', error: error.message });
        }
    }
};

// @desc    Get logged in user orders (FIXES EMPTY CUSTOMER SIDE)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// @desc    Get order by custom orderId (Secure Tracking)
const getOrderByTrackingId = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id.toUpperCase() });

        if (order) {
            // UPDATED SECURITY: Allow the owner OR an Admin to see the tracking
            if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'Access Denied: This acquisition is registered to a different user.'
                });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Reference ID not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during tracking', error: error.message });
    }
};

// @desc    Cancel an order
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id.toUpperCase() });

        if (order) {
            if (order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to cancel this order' });
            }

            // UPDATED: Block cancellation if shipped, out for delivery, or already delivered
            const restrictedStatuses = ['Shipped', 'Out for Delivery', 'Delivered'];
            if (restrictedStatuses.includes(order.status)) {
                return res.status(400).json({ message: 'Order cannot be cancelled at this stage of logistics' });
            }

            order.status = 'Cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Cancellation failed', error: error.message });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders, // Exported new function
    getOrderByTrackingId,
    cancelOrder
};