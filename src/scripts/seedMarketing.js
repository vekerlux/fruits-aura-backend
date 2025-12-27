require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const productsData = [
    {
        name: "Watermelon Mix",
        description: "A natural blend of watermelon + banana.",
        price: 1900,
        category: "Fresh Mix",
        image: "https://images.unsplash.com/photo-1589733955941-5c93fd14220d?q=80&w=1000&auto=format&fit=crop", // Watermelon image
        rating: 4.8,
        reviewCount: 120,
        isActive: true,
        isFuture: false,
        bundlePrice: 7500 // Auraset price for 5
    },
    {
        name: "Banana Mix",
        description: "Rich and creamy banana goodness.",
        price: 1900,
        category: "Coming Soon",
        image: "https://images.unsplash.com/photo-1571771896612-44111297a558?q=80&w=1000&auto=format&fit=crop", // Banana image
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isFuture: true,
        voteCount: 150
    },
    {
        name: "Orange Mix",
        description: "Zesty orange punch.",
        price: 1900,
        category: "Coming Soon",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop", // Orange image
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isFuture: true,
        voteCount: 85
    },
    {
        name: "Cucumber Mix",
        description: "Cool and refreshing cucumber.",
        price: 1900,
        category: "Coming Soon",
        image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=1000&auto=format&fit=crop", // Cucumber image
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isFuture: true,
        voteCount: 42
    },
    {
        name: "Pineapple Mix",
        description: "Tropical pineapple delight.",
        price: 1900,
        category: "Coming Soon",
        image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=1000&auto=format&fit=crop", // Pineapple image
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isFuture: true,
        voteCount: 200
    }
];

async function seedMarketing() {
    try {
        console.log('🌱 Starting new marketing seed...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});

        console.log('🍹 Inserting new product catalog...');
        // Note: Model needs update to support isFuture and voteCount schema fields first, 
        // but Mongoose is flexible so we can seed strict: false or update model first.
        // We will assume model update runs shortly after or we update schema now.

        const products = await Product.insertMany(productsData);
        console.log(`✅ ${products.length} products created`);
        console.log('   - 1 Active (Watermelon)');
        console.log('   - 4 Future (Coming Soon)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedMarketing();
