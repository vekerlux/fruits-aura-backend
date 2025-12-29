const checkDailyLimits = (role) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id;
            const User = require('../models/User');

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Get today's date at midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Reset daily counts if it's a new day
            if (!user.dailyOrders?.date || user.dailyOrders.date < today) {
                user.dailyOrders = {
                    date: today,
                    bottleCount: 0,
                    aurasetCount: 0
                };
                await user.save();
            }

            // Calculate order totals from request
            const { items } = req.body;
            let bottlesToAdd = 0;
            let aurasetsToAdd = 0;

            items.forEach(item => {
                if (item.isAuraset || item.quantity >= 5) {
                    aurasetsToAdd += Math.floor(item.quantity / 5);
                    bottlesToAdd += item.quantity;
                } else {
                    bottlesToAdd += item.quantity;
                }
            });

            // Define limits based on role and subscription
            let maxBottles = 20;
            let maxAurasets = 3;

            if (user.role === 'distributor') {
                maxBottles = 50;
                maxAurasets = 999; // Unlimited Aurasets for distributors
            } else if (user.subscription?.plan === 'fresher') {
                maxBottles = 10;
                maxAurasets = 1;
            } else if (user.subscription?.plan === 'farming') {
                maxBottles = 50;
                maxAurasets = 999;
            }

            // Check limits
            const newBottleCount = user.dailyOrders.bottleCount + bottlesToAdd;
            const newAurasetCount = user.dailyOrders.aurasetCount + aurasetsToAdd;

            if (newBottleCount > maxBottles) {
                return res.status(400).json({
                    message: `Daily limit exceeded. You can order max ${maxBottles} bottles per day. Current: ${user.dailyOrders.bottleCount}, Attempting: ${bottlesToAdd}`,
                    limit: maxBottles,
                    current: user.dailyOrders.bottleCount,
                    attempted: bottlesToAdd
                });
            }

            if (newAurasetCount > maxAurasets) {
                return res.status(400).json({
                    message: `Daily Auraset limit exceeded. You can order max ${maxAurasets} Aurasets per day. Current: ${user.dailyOrders.aurasetCount}, Attempting: ${aurasetsToAdd}`,
                    limit: maxAurasets,
                    current: user.dailyOrders.aurasetCount,
                    attempted: aurasetsToAdd
                });
            }

            // Store the counts for later update
            req.orderCounts = {
                bottles: bottlesToAdd,
                aurasets: aurasetsToAdd
            };

            next();
        } catch (error) {
            console.error('Daily limit check error:', error);
            res.status(500).json({ message: 'Error checking daily limits' });
        }
    };
};

module.exports = { checkDailyLimits };
