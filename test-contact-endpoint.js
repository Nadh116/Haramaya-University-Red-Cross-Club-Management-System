const axios = require('axios');

async function testContactEndpoint() {
    console.log('🧪 Testing Contact Form Endpoint...\n');

    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+251911234567',
        subject: 'Test Contact Form',
        message: 'This is a test message to verify the contact form functionality.',
        inquiryType: 'general'
    };

    try {
        console.log('📤 Sending test contact form data...');
        console.log('Data:', JSON.stringify(testData, null, 2));

        const response = await axios.post('http://localhost:5000/api/contact', testData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        console.log('\n✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('\n❌ ERROR DETECTED!');
        console.log('Error Type:', error.name);
        console.log('Error Message:', error.message);

        if (error.response) {
            console.log('Status Code:', error.response.status);
            console.log('Status Text:', error.response.statusText);
            console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
            console.log('Response Headers:', error.response.headers);
        } else if (error.request) {
            console.log('Request was made but no response received');
            console.log('Request:', error.request);
        } else {
            console.log('Error setting up request:', error.message);
        }
    }
}

testContactEndpoint();