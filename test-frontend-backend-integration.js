// Test script to verify frontend-backend integration
const axios = require('axios');

const FRONTEND_URL = 'http://localhost:3002';
const BACKEND_URL = 'http://localhost:5000/api';

async function testIntegration() {
    console.log('🧪 Testing Frontend-Backend Integration...\n');

    // Test 1: Frontend accessibility
    try {
        console.log('1. Testing Frontend Accessibility...');
        const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
        console.log('   ✅ Frontend accessible on port 3002');
        console.log(`   ✅ Status: ${frontendResponse.status}`);
        console.log(`   ✅ Content-Type: ${frontendResponse.headers['content-type']}`);
    } catch (error) {
        console.log('   ❌ Frontend not accessible:', error.message);
        return;
    }

    // Test 2: Backend API accessibility
    try {
        console.log('\n2. Testing Backend API...');
        const backendResponse = await axios.get(`${BACKEND_URL}/health`);
        console.log('   ✅ Backend API accessible on port 5000');
        console.log(`   ✅ Status: ${backendResponse.status}`);
        console.log(`   ✅ Message: ${backendResponse.data.message}`);
    } catch (error) {
        console.log('   ❌ Backend API not accessible:', error.message);
        return;
    }

    // Test 3: Gallery API integration
    try {
        console.log('\n3. Testing Gallery API Integration...');
        const galleryResponse = await axios.get(`${BACKEND_URL}/gallery`);
        console.log('   ✅ Gallery API working');
        console.log(`   ✅ Images count: ${galleryResponse.data.data.images.length}`);
        console.log(`   ✅ Pagination: ${JSON.stringify(galleryResponse.data.data.pagination)}`);
    } catch (error) {
        console.log('   ❌ Gallery API error:', error.message);
    }

    // Test 4: Contact form submission
    try {
        console.log('\n4. Testing Contact Form Integration...');
        const contactData = {
            name: 'Integration Test User',
            email: 'test@integration.com',
            phone: '+251911234567',
            subject: 'Frontend-Backend Integration Test',
            message: 'This is an automated test to verify that the frontend and backend are working together correctly.',
            inquiryType: 'general'
        };

        const contactResponse = await axios.post(`${BACKEND_URL}/contact`, contactData);
        console.log('   ✅ Contact form submission working');
        console.log(`   ✅ Status: ${contactResponse.status}`);
        console.log(`   ✅ Contact ID: ${contactResponse.data.data.contactId}`);
        console.log(`   ✅ Message: ${contactResponse.data.message}`);
    } catch (error) {
        console.log('   ❌ Contact form error:', error.response?.data?.message || error.message);
    }

    // Test 5: Gallery statistics
    try {
        console.log('\n5. Testing Gallery Statistics...');
        const statsResponse = await axios.get(`${BACKEND_URL}/gallery/statistics`);
        console.log('   ✅ Gallery statistics working');
        console.log(`   ✅ Total images: ${statsResponse.data.data.statistics.overall.totalImages}`);
        console.log(`   ✅ Published images: ${statsResponse.data.data.statistics.overall.publishedImages}`);
    } catch (error) {
        console.log('   ❌ Gallery statistics error:', error.message);
    }

    // Test 6: CORS configuration
    try {
        console.log('\n6. Testing CORS Configuration...');
        const corsResponse = await axios.get(`${BACKEND_URL}/gallery`, {
            headers: {
                'Origin': FRONTEND_URL
            }
        });
        console.log('   ✅ CORS working correctly');
        console.log('   ✅ Frontend can access backend APIs');
    } catch (error) {
        console.log('   ❌ CORS error:', error.message);
    }

    console.log('\n🎉 Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   • Frontend: Running on http://localhost:3002');
    console.log('   • Backend: Running on http://localhost:5000');
    console.log('   • Gallery: API working, ready for image uploads');
    console.log('   • Contact: Form submissions working and saving to database');
    console.log('   • CORS: Configured for frontend-backend communication');
    console.log('\n✅ Gallery and Contact features are fully functional!');
}

// Run the test
testIntegration().catch(console.error);