const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: String,
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: Number
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash' // Changed default from 'card' to 'cash'
    },
    stripePaymentId: String,
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    deliveryInstructions: String,
    estimatedDelivery: Date,
    actualDelivery: Date
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `FA${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
