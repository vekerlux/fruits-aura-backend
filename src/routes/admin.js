const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { adminMiddleware } = require('../middleware/auth');

// Get all pending orders (admin only)
router.get('/pending', adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ status: 'pending' })
            .populate('userId', 'name email phone role')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Approve an order (admin only)
router.put('/:id/approve', adminMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is not pending' });
        }

        order.status = 'approved';
        order.approvedBy = req.user._id;
        order.approvedAt = new Date();

        // Allow admin to adjust delivery fee
        if (req.body.deliveryFee !== undefined) {
            order.deliveryFee = req.body.deliveryFee;
            order.total = order.subtotal + order.deliveryFee;
        }

        await order.save();

        // TODO: Send email notification to customer

        res.json({
            success: true,
            message: 'Order approved successfully',
            order
        });
    } catch (error) {
        console.error('Error approving order:', error);
        res.status(500).json({ message: 'Error approving order' });
    }
});

// Update order status (admin only)
router.put('/:id/status', adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'approved', 'in-transit', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            success: true,
            message: `Order status updated to ${status}`,
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
});

// Get all pending distributors (admin only)
router.get('/distributors/pending', adminMiddleware, async (req, res) => {
    try {
        const distributors = await User.find({
            role: 'distributor',
            approved: false
        }).select('name email phone createdAt');

        res.json({
            success: true,
            distributors
        });
    } catch (error) {
        console.error('Error fetching distributors:', error);
        res.status(500).json({ message: 'Error fetching distributors' });
    }
});

// Approve a distributor account (admin only)
router.put('/distributors/:id/approve', adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'distributor') {
            return res.status(400).json({ message: 'User is not a distributor' });
        }

        user.approved = true;
        await user.save();

        // TODO: Send approval email

        res.json({
            success: true,
            message: 'Distributor approved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                approved: user.approved
            }
        });
    } catch (error) {
        console.error('Error approving distributor:', error);
        res.status(500).json({ message: 'Error approving distributor' });
    }
});

module.exports = router;
