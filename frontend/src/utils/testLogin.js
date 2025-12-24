// Simple test login utility
export const testLogin = async () => {
    try {
        console.log('🧪 Testing direct login...');

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@haramaya.edu.et',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('📋 Login response:', data);

        if (data.success && data.token) {
            console.log('✅ Login successful!');
            localStorage.setItem('token', data.token);
            console.log('💾 Token stored in localStorage');

            // Reload the page to trigger auth state update
            window.location.reload();
            return true;
        } else {
            console.log('❌ Login failed:', data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        return false;
    }
};

// Function to manually set admin token for testing
export const setTestToken = () => {
    // This is a temporary solution for testing
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzZhNzE3ZjY5YzY4MzE4YzY5YzY5YyIsImlhdCI6MTczNTg5NjU3NywiZXhwIjoxNzM4NDg4NTc3fQ.example';
    localStorage.setItem('token', testToken);
    console.log('🧪 Test token set');
    window.location.reload();
};

// Function to clear all auth data
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    console.log('🗑️ Auth data cleared');
    window.location.reload();
};