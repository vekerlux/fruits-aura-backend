const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// All order routes require authentication
router.use(authMiddleware);

// Create new order
router.post('/', async (req, res) => {
    try {
        const { items, total, deliveryAddress, deliveryInstructions, paymentStatus, paymentMethod } = req.body;
        const user = await User.findById(req.user._id);

        // Daily Limit Check
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayOrders = await Order.find({
            userId: req.user._id,
            createdAt: { $gte: startOfDay }
        });

        // Calculate current usage including this order
        let bottlesCount = 0;
        let bundlesCount = 0;

        // Helper to count items
        const countItems = (orderItems) => {
            orderItems.forEach(item => {
                const isBundle = item.name.toLowerCase().includes('auraset') || item.isBundle;
                if (isBundle) {
                    bundlesCount += item.quantity;
                    bottlesCount += item.quantity * 5;
                } else {
                    bottlesCount += item.quantity;
                }
            });
        };

        todayOrders.forEach(order => countItems(order.items));
        countItems(items);

        // Enforce Limits
        const isDistributor = user.role === 'distributor';
        const bottleLimit = isDistributor ? 50 : 20;
        const bundleLimit = isDistributor ? 10 : 3; // Assuming distributor can buy more bundles (50/5 = 10)

        if (bottlesCount > bottleLimit) {
            return res.status(400).json({
                success: false,
                message: `Daily limit exceeded. You can only order ${bottleLimit} bottles per day. Current attempt: ${bottlesCount}`
            });
        }

        if (bundlesCount > bundleLimit) {
            return res.status(400).json({
                success: false,
                message: `Daily limit exceeded. You can only order ${bundleLimit} Aurasets per day.`
            });
        }

        const order = await Order.create({
            userId: req.user._id,
            items,
            total,
            deliveryAddress,
            deliveryInstructions,
            paymentStatus: paymentStatus || 'pending',
            paymentMethod: paymentMethod || 'card'
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user's orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name image');

        res.json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get specific order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('items.productId');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, data: { order } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
