// Simple auth utility to bypass context issues
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    window.location.href = '/login';
};

export const redirectIfNotAuthenticated = () => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
};

// Simple user info from token (basic implementation)
export const getCurrentUser = async () => {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        } else {
            // Token might be invalid
            logout();
            return null;
        }
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};