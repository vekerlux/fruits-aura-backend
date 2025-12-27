const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 10
    },
    helpful: {
        type: Number,
        default: 0
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved' // Auto-approve for now
    }
}, {
    timestamps: true
});

// Note: Product rating updates are handled on the frontend since products are static data
// not stored in MongoDB. This hook is disabled to prevent ObjectId casting errors.

module.exports = mongoose.model('Review', reviewSchema);
