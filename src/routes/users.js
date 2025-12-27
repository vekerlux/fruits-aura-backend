const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        res.json({
            success: true,
            data: { user: req.user }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const { name, phone, addresses } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, addresses },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
