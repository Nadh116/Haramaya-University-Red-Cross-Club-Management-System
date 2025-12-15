import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Handle network errors
        if (!error.response) {
            error.message = 'Network error. Please check your connection.';
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

export default api;