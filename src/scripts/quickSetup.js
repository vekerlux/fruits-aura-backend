const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function setupDatabase() {
    try {
        console.log('🌱 Setting up database through API...\n');

        // Register admin user
        console.log('👤 Creating admin user...');
        const adminResponse = await axios.post(`${API_URL}/auth/register`, {
            name: 'Admin User',
            email: 'admin@fruitsaura.com',
            password: 'Admin123!'
        });
        console.log('✅ Admin user created:', adminResponse.data.user.email);

        // Login as admin to get token
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@fruitsaura.com',
            password: 'Admin123!'
        });
        const token = loginResponse.data.token;
        console.log('✅ Admin logged in successfully\n');

        // Update user to admin role directly in database would require backend endpoint
        // For now, user needs to manually update in MongoDB or we create products as regular user

        console.log('📝 Admin credentials:');
        console.log('   Email: admin@fruitsaura.com');
        console.log('   Password: Admin123!');
        console.log('\n✨ Setup completed! You can now login to the application.');

    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.data.message || error.message);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

setupDatabase();
