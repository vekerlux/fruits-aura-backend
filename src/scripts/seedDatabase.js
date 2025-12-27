require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

// Product data from frontend
const productsData = [
    {
        name: "Berry Blast",
        description: "Mixed berries with a hint of mint",
        longDescription: "A refreshing blend of strawberries, blueberries, and raspberries with a cool mint finish. Packed with antioxidants and vitamins.",
        price: 5.99,
        category: "Berry Boost",
        color: "#FF6B9D",
        image: "",
        ingredients: ["Strawberry", "Blueberry", "Raspberry", "Mint", "Ice"],
        nutrition: {
            calories: 120,
            sugar: "18g",
            vitaminC: "80mg",
            protein: "2g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.5,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Citrus Burst",
        description: "Orange, lemon, and grapefruit blend",
        longDescription: "Wake up your senses with this zesty combination of fresh oranges, tangy lemons, and pink grapefruit. Perfect morning energy boost.",
        price: 6.49,
        category: "Citrus Blends",
        color: "#FFB347",
        image: "",
        ingredients: ["Orange", "Lemon", "Grapefruit", "Honey", "Ice"],
        nutrition: {
            calories: 110,
            sugar: "20g",
            vitaminC: "120mg",
            protein: "1g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.7,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Tropical Paradise",
        description: "Mango, pineapple, and coconut fusion",
        longDescription: "Transport yourself to a tropical island with this exotic blend of sweet mangoes, juicy pineapples, and creamy coconut water.",
        price: 7.99,
        category: "Tropical Mix",
        color: "#FFD700",
        image: "",
        ingredients: ["Mango", "Pineapple", "Coconut Water", "Passion Fruit", "Ice"],
        nutrition: {
            calories: 150,
            sugar: "25g",
            vitaminC: "95mg",
            protein: "3g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.8,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Green Detox",
        description: "Spinach, kale, apple, and cucumber",
        longDescription: "Cleanse and energize with this nutrient-packed green smoothie. Fresh spinach, kale, crisp apple, and cool cucumber for ultimate wellness.",
        price: 6.99,
        category: "Green Detox",
        color: "#90EE90",
        image: "",
        ingredients: ["Spinach", "Kale", "Green Apple", "Cucumber", "Lemon", "Ginger"],
        nutrition: {
            calories: 95,
            sugar: "12g",
            vitaminC: "110mg",
            protein: "4g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.3,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Açaí Power",
        description: "Açaí berries with banana and granola",
        longDescription: "Superfood bowl in a bottle! Rich açaí berries blended with banana and topped with crunchy granola for sustained energy.",
        price: 8.49,
        category: "Berry Boost",
        color: "#8B4789",
        image: "",
        ingredients: ["Açaí Berry", "Banana", "Granola", "Blueberry", "Honey"],
        nutrition: {
            calories: 180,
            sugar: "22g",
            vitaminC: "65mg",
            protein: "5g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.9,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Peach Perfection",
        description: "Fresh peaches with vanilla and almond milk",
        longDescription: "Creamy and dreamy! Sweet Georgia peaches blended with vanilla and smooth almond milk for a dessert-like treat.",
        price: 6.99,
        category: "Tropical Mix",
        color: "#FFDAB9",
        image: "",
        ingredients: ["Peach", "Almond Milk", "Vanilla", "Cinnamon", "Ice"],
        nutrition: {
            calories: 130,
            sugar: "19g",
            vitaminC: "55mg",
            protein: "3g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.6,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Lemon Zest",
        description: "Lemon, ginger, and turmeric wellness shot",
        longDescription: "Immunity-boosting power shot with fresh lemon juice, spicy ginger, and anti-inflammatory turmeric. Your daily wellness in one bottle.",
        price: 4.99,
        category: "Citrus Blends",
        color: "#FFF44F",
        image: "",
        ingredients: ["Lemon", "Ginger", "Turmeric", "Cayenne", "Honey"],
        nutrition: {
            calories: 45,
            sugar: "8g",
            vitaminC: "85mg",
            protein: "1g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.4,
        reviewCount: 0,
        isActive: true
    },
    {
        name: "Watermelon Wave",
        description: "Watermelon, strawberry, and lime cooler",
        longDescription: "Ultimate summer refreshment! Juicy watermelon, sweet strawberries, and a splash of lime for the perfect cooling drink.",
        price: 5.49,
        category: "Tropical Mix",
        color: "#FF6B6B",
        image: "",
        ingredients: ["Watermelon", "Strawberry", "Lime", "Mint", "Ice"],
        nutrition: {
            calories: 85,
            sugar: "16g",
            vitaminC: "45mg",
            protein: "1g"
        },
        inventory: {
            stock: 100,
            lowStockThreshold: 10
        },
        rating: 4.7,
        reviewCount: 0,
        isActive: true
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...');

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
            emailVerified: true
        });
        console.log('✅ Admin user created:', admin.email);

        // Insert products
        console.log('🍹 Inserting products...');
        const products = await Product.insertMany(productsData);
        console.log(`✅ ${products.length} products created`);

        console.log('\n✨ Database seeding completed successfully!');
        console.log('\n📝 Login credentials:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);

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
