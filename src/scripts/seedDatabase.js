require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

// Fruits Aura Product Data - Nigerian Market
const productsData = [
    // ACTIVE PRODUCT
    {
        name: "Watermelon Mix",
        description: "A natural blend of watermelon + banana",
        longDescription: "Experience pure refreshment with our signature Watermelon Mix. Fresh watermelon blended perfectly with banana for a naturally sweet, healthy drink. No added sugar, just pure fruit goodness.",
        price: 1900, // Nigerian Naira
        bundlePrice: 7500, // Auraset (5 bottles)
        bundleSize: 5,
        category: "Fresh Mix",
        color: "#FF6B6B",
        image: "/images/fruits-aura-bottle.png",
        ingredients: ["Watermelon", "Banana", "Natural Water"],
        nutrition: {
            calories: 95,
            sugar: "Natural fruit sugar only",
            vitaminC: "85mg",
            protein: "2g"
        },
        inventory: {
            stock: 200,
            lowStockThreshold: 20
        },
        rating: 4.8,
        reviewCount: 0,
        isActive: true,
        isComingSoon: false
    },

    // COMING SOON PRODUCTS (VOTABLE)
    {
        name: "Banana Mix",
        description: "Pure banana blend (Coming Soon)",
        longDescription: "Vote for this delicious banana blend! Made with ripe bananas and a hint of natural sweetness. Help us decide which flavor to launch next.",
        price: 1900,
        bundlePrice: 7500,
        bundleSize: 5,
        category: "Coming Soon",
        color: "#FFD93D",
        image: "",
        ingredients: ["Banana", "Natural Water", "Lime"],
        nutrition: {
            calories: 110,
            sugar: "Natural fruit sugar only",
            vitaminC: "65mg",
            protein: "3g"
        },
        inventory: {
            stock: 0,
            lowStockThreshold: 0
        },
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isComingSoon: true
    },
    {
        name: "Orange Mix",
        description: "Fresh orange blend (Coming Soon)",
        longDescription: "Vote for this zesty orange mix! Packed with vitamin C and natural citrus flavor. Let us know if you want this next!",
        price: 1900,
        bundlePrice: 7500,
        bundleSize: 5,
        category: "Coming Soon",
        color: "#FFB347",
        image: "",
        ingredients: ["Orange", "Natural Water", "Lemon"],
        nutrition: {
            calories: 105,
            sugar: "Natural fruit sugar only",
            vitaminC: "120mg",
            protein: "2g"
        },
        inventory: {
            stock: 0,
            lowStockThreshold: 0
        },
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isComingSoon: true
    },
    {
        name: "Cucumber Mix",
        description: "Refreshing cucumber blend (Coming Soon)",
        longDescription: "Vote for this cool cucumber mix! Perfect for hot Nigerian weather. Super refreshing and hydrating.",
        price: 1900,
        bundlePrice: 7500,
        bundleSize: 5,
        category: "Coming Soon",
        color: "#90EE90",
        image: "",
        ingredients: ["Cucumber", "Lime", "Mint", "Natural Water"],
        nutrition: {
            calories: 45,
            sugar: "Minimal natural sugars",
            vitaminC: "45mg",
            protein: "1g"
        },
        inventory: {
            stock: 0,
            lowStockThreshold: 0
        },
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isComingSoon: true
    },
    {
        name: "Pineapple Mix",
        description: "Tropical pineapple blend (Coming Soon)",
        longDescription: "Vote for this tropical pineapple mix! Sweet, tangy, and full of natural goodness. Show us you want this flavor!",
        price: 1900,
        bundlePrice: 7500,
        bundleSize: 5,
        category: "Coming Soon",
        color: "#FFD700",
        image: "",
        ingredients: ["Pineapple", "Coconut Water", "Lime"],
        nutrition: {
            calories: 125,
            sugar: "Natural fruit sugar only",
            vitaminC: "95mg",
            protein: "2g"
        },
        inventory: {
            stock: 0,
            lowStockThreshold: 0
        },
        rating: 0,
        reviewCount: 0,
        isActive: false,
        isComingSoon: true
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting Fruits Aura database seed...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = await User.create({
            email: process.env.ADMIN_EMAIL || 'admin@fruitsaura.com',
            password: process.env.ADMIN_PASSWORD || 'Admin123!',
            name: 'Admin User',
            role: 'admin',
            approved: true,
            emailVerified: true
        });
        console.log('✅ Admin user created:', admin.email);

        // Insert products
        console.log('🍹 Inserting Fruits Aura products...');
        const products = await Product.insertMany(productsData);
        console.log(`✅ ${products.length} products created (1 active + 4 coming soon)`);
        console.log('   Active: Watermelon Mix (₦1,900 | Auraset: ₦7,500)');
        console.log('   Coming Soon: Banana, Orange, Cucumber, Pineapple');

        console.log('\n✨ Fruits Aura database seeding completed successfully!');
        console.log('\n📝 Login credentials:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
        console.log('\n💰 Pricing: ₦1,900 per bottle | ₦7,500 per Auraset (5 bottles)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Full error:', error);
        process.exit(1);
    }
}

seedDatabase();
