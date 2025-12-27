const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authMiddleware } = require('../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: req.params.productId,
            status: 'approved'
        })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');

        res.json({ success: true, data: { reviews } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create review (authentication optional)
router.post('/', async (req, res) => {
    try {
        const { productId, rating, comment, author } = req.body;

        // Get auth header
        const token = req.headers.authorization?.replace('Bearer ', '');
        let userId = null;
        let authorName = author;

        // If token exists, try to authenticate
        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const User = require('../models/User');
                const user = await User.findById(decoded.userId).select('-password');
                if (user) {
                    userId = user._id;
                    authorName = author || user.name;
                }
            } catch (err) {
                // Invalid token, treat as guest
                console.log('Invalid token, creating as guest review');
            }
        }

        const review = await Review.create({
            productId: String(productId), // Convert to string to match schema
            userId: userId || new (require('mongoose').Types.ObjectId)(), // Guest user placeholder
            author: authorName || 'Anonymous',
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: { review }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
