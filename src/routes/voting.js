const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Vote for a coming soon product
router.post('/:id/vote', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.isComingSoon) {
            return res.status(400).json({ message: 'This product is already available. No voting needed.' });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        // Check if user already voted for this product
        if (user.votes && user.votes.includes(product._id)) {
            return res.status(400).json({ message: 'You have already voted for this product' });
        }

        // Add vote to user's votes array
        if (!user.votes) {
            user.votes = [];
        }
        user.votes.push(product._id);
        await user.save();

        // Increment product vote count
        if (!product.voteCount) {
            product.voteCount = 0;
        }
        product.voteCount += 1;
        await product.save();

        res.json({
            success: true,
            message: 'Vote recorded successfully!',
            voteCount: product.voteCount
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Error recording vote' });
    }
});

// Get vote rankings for coming soon products
router.get('/coming-soon/rankings', async (req, res) => {
    try {
        const comingSoonProducts = await Product.find({ isComingSoon: true })
            .select('name voteCount category color')
            .sort({ voteCount: -1 }); // Sort by most voted

        res.json({
            success: true,
            products: comingSoonProducts
        });
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({ message: 'Error fetching vote rankings' });
    }
});

// Check if user has voted for a product
router.get('/:id/vote-status', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const hasVoted = user.votes && user.votes.includes(req.params.id);

        res.json({
            success: true,
            hasVoted
        });
    } catch (error) {
        console.error('Vote status error:', error);
        res.status(500).json({ message: 'Error checking vote status' });
    }
});

module.exports = router;
