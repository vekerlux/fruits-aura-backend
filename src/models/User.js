const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['consumer', 'distributor', 'admin'],
        default: 'consumer'
    },
    subscription: {
        plan: {
            type: String,
            enum: ['fresher', 'aura', 'farming'],
            default: 'aura' // Welcome bonus default
        },
        status: {
            type: String,
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now
        }
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    phone: {
        type: String,
        trim: true
    },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        landmark: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: Date,
    refreshToken: String
}, {
    timestamps: true
});

// Hash password before saving
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
