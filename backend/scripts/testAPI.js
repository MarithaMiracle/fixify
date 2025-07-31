const axios = require('axios');

const testAPI = async(baseURL = 'http://localhost:5000/api') => {
    console.log('🧪 Testing Fixify API');
    console.log('=====================\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const health = await axios.get(`${baseURL}/health`);
        console.log('✅ Health check passed:', health.data.status);

        // Test registration
        console.log('\n2. Testing user registration...');
        const registerData = {
            fullName: 'Test User',
            email: `test${Date.now()}@example.com`,
            phone: '08087654321',
            password: 'test123',
            role: 'user'
        };

        const registerResponse = await axios.post(`${baseURL}/auth/register`, registerData);
        console.log('✅ Registration successful');

        const token = registerResponse.data.data.token;

        // Test login
        console.log('\n3. Testing user login...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: registerData.email,
            password: registerData.password
        });
        console.log('✅ Login successful');

        // Test protected route
        console.log('\n4. Testing protected route...');
        const profileResponse = await axios.get(`${baseURL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Protected route access successful');

        // Test services endpoint
        console.log('\n5. Testing services endpoint...');
        const servicesResponse = await axios.get(`${baseURL}/services`);
        console.log(`✅ Services retrieved: ${servicesResponse.data.data.services.length} services`);

        // Test categories endpoint
        console.log('\n6. Testing categories endpoint...');
        const categoriesResponse = await axios.get(`${baseURL}/services/categories`);
        console.log(`✅ Categories retrieved: ${categoriesResponse.data.data.categories.length} categories`);

        console.log('\n🎉 All API tests passed!');
        console.log('\n📋 API Endpoints Available:');
        console.log('Authentication: /api/auth/*');
        console.log('Users: /api/users/*');
        console.log('Services: /api/services/*');
        console.log('Bookings: /api/bookings/*');
        console.log('Payments: /api/payments/*');
        console.log('Reviews: /api/reviews/*');
        console.log('Providers: /api/providers/*');
        console.log('Admin: /api/admin/*');
        console.log('Upload: /api/upload/*');

    } catch (error) {
        console.error('❌ API test failed:', (error.response && error.response.data) || error.message);
        process.exit(1);
    }
};

// Run if executed directly
if (require.main === module) {
    const baseURL = process.argv[2] || 'http://localhost:5000/api';
    testAPI(baseURL);
}

module.exports = { testAPI };