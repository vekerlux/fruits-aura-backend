const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    longDescription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    bundlePrice: {
        type: Number,
        min: [0, 'Bundle price cannot be negative']
    },
    bundleSize: {
        type: Number,
        default: 5
    },
    category: {
        type: String,
        required: true,
        enum: ['Fresh Mix', 'Coming Soon']
    },
    isComingSoon: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    ingredients: [{
        type: String
    }],
    nutrition: {
        calories: Number,
        sugar: String,
        vitaminC: String,
        protein: String
    },
    voteCount: {
        type: Number,
        default: 0
    },
    inventory: {
        stock: {
            type: Number,
            default: 100
        },
        lowStockThreshold: {
            type: Number,
            default: 10
        }
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFuture: {
        type: Boolean,
        default: false
    },
    voteCount: {
        type: Number,
        default: 0
    },
    bundlePrice: {
        type: Number
    }
}, {
    timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
