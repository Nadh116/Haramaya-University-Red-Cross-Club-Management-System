import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL || '/api'
        : '/api', // Use proxy in development
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
        console.log('🔗 Full URL:', config.baseURL + config.url);

        // Don't add auth token for public endpoints
        const publicEndpoints = [];
        const isPublicContactSubmission = config.url === '/contact' && config.method?.toLowerCase() === 'post';
        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            config.url === endpoint || config.url?.startsWith(endpoint + '?')
        ) || isPublicContactSubmission;

        if (!isPublicEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('🔑 Token added to request');
            } else {
                console.log('⚠️ No token found in localStorage');
            }
        } else {
            console.log('🌐 Public endpoint - no auth token needed');
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.config?.url);
        console.error('❌ Error details:', error.response?.data);

        // Handle 401 errors (unauthorized) - but be more selective
        if (error.response?.status === 401) {
            console.log('🔓 Unauthorized error detected');

            // Only redirect to login for auth-related endpoints or if it's a token verification failure
            const isAuthEndpoint = error.config?.url?.includes('/auth/');
            const isTokenExpired = error.response?.data?.message?.includes('token') ||
                error.response?.data?.message?.includes('expired') ||
                error.response?.data?.message?.includes('invalid');

            if (isAuthEndpoint || isTokenExpired) {
                console.log('🗑️ Clearing token and redirecting to login');
                localStorage.removeItem('token');

                // Use React Router navigation instead of window.location
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else {
                console.log('⚠️ 401 error but not redirecting - might be role/permission issue');
            }
        }

        // Handle network errors
        if (!error.response) {
            error.message = 'Network error. Please check your connection.';
            console.error('🌐 Network error detected');
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/updatedetails', userData),
    updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
    forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
    logout: () => api.get('/auth/logout'),
};

export const userAPI = {
    getUsers: (params) => api.get('/users', { params }),
    getUser: (id) => api.get(`/users/${id}`),
    createUser: (userData) => api.post('/users', userData),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`),
    approveUser: (id) => api.put(`/users/${id}/approve`),
    rejectUser: (id) => api.put(`/users/${id}/reject`),
    getPendingApprovals: () => api.get('/users/pending'),
    getUserStats: () => api.get('/users/stats'),
};

export const eventAPI = {
    getEvents: (params) => api.get('/events', { params }),
    getEvent: (id) => api.get(`/events/${id}`),
    createEvent: (eventData) => api.post('/events', eventData),
    updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
    deleteEvent: (id) => api.delete(`/events/${id}`),
    registerForEvent: (id, data) => api.post(`/events/${id}/register`, data),
    unregisterFromEvent: (id) => api.delete(`/events/${id}/register`),
    addEventFeedback: (id, feedback) => api.post(`/events/${id}/feedback`, feedback),
};

export const donationAPI = {
    getDonations: (params) => api.get('/donations', { params }),
    getDonation: (id) => api.get(`/donations/${id}`),
    createDonation: (donationData) => api.post('/donations', donationData),
    updateDonation: (id, donationData) => api.put(`/donations/${id}`, donationData),
    deleteDonation: (id) => api.delete(`/donations/${id}`),
    verifyDonation: (id) => api.put(`/donations/${id}/verify`),
    getDonationStats: () => api.get('/donations/stats'),
};

export const announcementAPI = {
    getAnnouncements: (params) => api.get('/announcements', { params }),
    getAnnouncement: (id) => api.get(`/announcements/${id}`),
    createAnnouncement: (announcementData) => api.post('/announcements', announcementData),
    updateAnnouncement: (id, announcementData) => api.put(`/announcements/${id}`, announcementData),
    deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
    toggleLike: (id) => api.post(`/announcements/${id}/like`),
    addComment: (id, comment) => api.post(`/announcements/${id}/comments`, comment),
};

export const branchAPI = {
    getBranches: () => api.get('/branches'),
    getBranch: (id) => api.get(`/branches/${id}`),
    createBranch: (branchData) => api.post('/branches', branchData),
    updateBranch: (id, branchData) => api.put(`/branches/${id}`, branchData),
    deleteBranch: (id) => api.delete(`/branches/${id}`),
};

export const memberAPI = {
    getMembers: (params) => api.get('/members', { params }),
    getMemberStats: () => api.get('/members/stats'),
};

export const volunteerAPI = {
    getVolunteers: (params) => api.get('/volunteers', { params }),
    getVolunteerStats: () => api.get('/volunteers/stats'),
    getVolunteerEvents: (id) => api.get(`/volunteers/${id}/events`),
};

export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getActivities: (params) => api.get('/dashboard/activities', { params }),
    getPersonalDashboard: () => api.get('/dashboard/personal'),
};

export const galleryAPI = {
    getImages: (params) => api.get('/gallery', { params }),
    getImage: (id) => api.get(`/gallery/${id}`),
    uploadImage: (formData) => api.post('/gallery', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateImage: (id, imageData) => api.put(`/gallery/${id}`, imageData),
    deleteImage: (id) => api.delete(`/gallery/${id}`),
    toggleLike: (id) => api.post(`/gallery/${id}/like`),
    getFeaturedImages: (params) => api.get('/gallery/featured', { params }),
    getStatistics: () => api.get('/gallery/statistics'),
};

export const contactAPI = {
    submitForm: (contactData) => api.post('/contact', contactData),
    getContacts: (params) => api.get('/contact', { params }),
    getContact: (id) => api.get(`/contact/${id}`),
    updateStatus: (id, statusData) => api.put(`/contact/${id}/status`, statusData),
    addResponse: (id, responseData) => api.post(`/contact/${id}/response`, responseData),
    deleteContact: (id) => api.delete(`/contact/${id}`),
    getStatistics: () => api.get('/contact/statistics'),
};

export default api;