/**
 * Delivery Pricing Calculator for Abakaliki
 * Handles both single bottle and Auraset pricing
 */

const calculateDeliveryFee = (items) => {
    let totalBottles = 0;
    let hasAuraset = false;
    let aurasetCount = 0;

    // Calculate totals
    items.forEach(item => {
        const quantity = item.quantity || 1;
        totalBottles += quantity;

        // Check if this is an Auraset order (5+ bottles)
        if (item.isAuraset || quantity >= 5) {
            hasAuraset = true;
            aurasetCount += Math.floor(quantity / 5);
        }
    });

    // AURASET PRICING: ₦1,500 - ₦2,000 per Auraset
    if (hasAuraset) {
        // Base price per Auraset is ₦1,750 (middle of range)
        // Admin can adjust this manually per order
        const baseAurasetFee = 1750;
        return {
            fee: aurasetCount * baseAurasetFee,
            type: 'auraset',
            count: aurasetCount,
            note: `Delivery for ${aurasetCount} Auraset(s): ₦1,500-₦2,000 per Auraset depending on exact location`
        };
    }

    // SINGLE BOTTLE PRICING
    // 1 bottle: ₦700
    // 2 bottles: ₦600 each = ₦1,200
    // 3 bottles: ₦500 each = ₦1,500
    // 4 bottles: ₦500 each but 1 free delivery = ₦1,500 total
    // 5+ bottles: Use Auraset pricing

    let fee;
    let note;

    if (totalBottles === 1) {
        fee = 700;
        note = '1 bottle delivery: ₦700';
    } else if (totalBottles === 2) {
        fee = 1200; // ₦600 per bottle
        note = '2 bottles delivery: ₦600 per bottle';
    } else if (totalBottles === 3) {
        fee = 1500; // ₦500 per bottle
        note = '3 bottles delivery: ₦500 per bottle';
    } else if (totalBottles === 4) {
        // ₦500 per bottle but 1 delivery free
        fee = 1500;
        note = '4 bottles delivery: ₦500 per bottle (1 delivery free)';
    } else {
        // 5+ bottles treated as Auraset
        fee = 1750;
        note = '5+ bottles: Auraset pricing applies';
    }

    return {
        fee,
        type: 'single',
        count: totalBottles,
        note
    };
};

/**
 * Validate and adjust delivery fee
 * Allows admin to set custom fee within acceptable range
 */
const validateDeliveryFee = (calculatedFee, customFee, type) => {
    if (!customFee) return calculatedFee;

    if (type === 'auraset') {
        // Auraset fee must be between ₦1,500 and ₦2,000 per Auraset
        const minFee = 1500;
        const maxFee = 2000;

        if (customFee < minFee || customFee > maxFee) {
            throw new Error(`Auraset delivery fee must be between ₦${minFee} and ₦${maxFee} per Auraset`);
        }
    }

    return customFee;
};

module.exports = {
    calculateDeliveryFee,
    validateDeliveryFee
};
