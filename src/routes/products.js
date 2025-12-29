const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { category, search, sort = 'name', page = 1, limit = 20 } = req.query;

        const query = { isActive: true };

        // Category filter
        if (category && category !== 'All Drinks') {
            query.category = category;
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        let sortOption = {};
        switch (sort) {
            case 'price-low': sortOption = { price: 1 }; break;
            case 'price-high': sortOption = { price: -1 }; break;
            case 'rating': sortOption = { rating: -1 }; break;
            default: sortOption = { name: 1 };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments(query);

        res.json({
            success: true,
            data: {
                products,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, data: { product } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Vote for a product
router.post('/:id/vote', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const user = await User.findById(req.user.id);

        if (user.votes.includes(req.params.id)) {
            return res.status(400).json({ success: false, message: 'You have already voted for this product' });
        }

        // Increment vote count
        product.voteCount += 1;
        await product.save();

        // Add to user votes
        user.votes.push(req.params.id);
        await user.save();

        res.json({
            success: true,
            data: {
                voteCount: product.voteCount,
                voted: true
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
