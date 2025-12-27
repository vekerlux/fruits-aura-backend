require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function debugUser() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected');

        console.log('🗑️  Deleting existing users...');
        await User.deleteMany({ email: 'admin@fruitsaura.com' });

        console.log('👤 Attempting to create user...');
        const admin = new User({
            email: 'admin@fruitsaura.com',
            password: 'Admin123!',
            name: 'Debug Admin',
            role: 'admin'
        });

        console.log('Saving user...');
        await admin.save();
        console.log('✅ User created successfully');

        // Verify password
        const savedUser = await User.findOne({ email: 'admin@fruitsaura.com' }).select('+password');
        console.log('Saved user password hash:', savedUser.password);

        const isMatch = await savedUser.comparePassword('Admin123!');
        console.log('🔐 Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

        process.exit(0);
    } catch (error) {
        console.log('ERROR_MESSAGE_START');
        console.log(error.message);
        console.log('ERROR_MESSAGE_END');
        process.exit(1);
    }
}

debugUser();
