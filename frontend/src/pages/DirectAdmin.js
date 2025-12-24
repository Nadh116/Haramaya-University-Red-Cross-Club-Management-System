import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DirectAdmin = () => {
    const [authStatus, setAuthStatus] = useState('checking');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        checkAuthAndLogin();
    }, []);

    const checkAuthAndLogin = async () => {
        try {
            // First check if we already have a valid token
            const token = localStorage.getItem('token');
            if (token) {
                console.log('🔑 Found existing token, validating...');
                const isValid = await validateToken(token);
                if (isValid) {
                    setAuthStatus('authenticated');
                    return;
                }
            }

            // If no valid token, attempt automatic login
            console.log('🔐 No valid token, attempting automatic login...');
            const loginResult = await performLogin();
            if (loginResult.success) {
                setAuthStatus('authenticated');
                setUserInfo(loginResult.user);
            } else {
                setAuthStatus('failed');
            }
        } catch (error) {
            console.error('❌ Auth check failed:', error);
            setAuthStatus('error');
        }
    };

    const validateToken = async (token) => {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    };

    const performLogin = async () => {
        try {
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

            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const retryAuth = () => {
        setAuthStatus('checking');
        checkAuthAndLogin();
    };

    const clearAndRetry = () => {
        localStorage.clear();
        setAuthStatus('checking');
        checkAuthAndLogin();
    };

    if (authStatus === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
                    <p className="text-gray-600">Setting up admin access...</p>
                </div>
            </div>
        );
    }

    if (authStatus === 'failed' || authStatus === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
                        <p className="text-gray-600 mb-6">
                            Unable to authenticate automatically. This might indicate backend connectivity issues.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={retryAuth}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                🔄 Retry Authentication
                            </button>
                            <button
                                onClick={clearAndRetry}
                                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                            >
                                🗑️ Clear Data & Retry
                            </button>
                            <Link
                                to="/debug-auth"
                                className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center"
                            >
                                🔍 Open Debug Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Successfully authenticated
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-lg">+</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Haramaya Red Cross</h1>
                                <p className="text-sm text-gray-600">Direct Admin Access</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Welcome back,</p>
                            <p className="font-semibold text-gray-900">
                                {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Administrator'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {userInfo?.role || 'Admin'} • {userInfo?.email || 'admin@haramaya.edu.et'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <i className="fas fa-check-circle text-green-600 mr-3"></i>
                        <div>
                            <h3 className="text-green-800 font-semibold">Authentication Successful!</h3>
                            <p className="text-green-700 text-sm">
                                You are now logged in and can access all admin functions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Admin Functions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gallery Management */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <i className="fas fa-images text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Gallery Management</h3>
                                <p className="text-sm text-gray-600">Upload and manage images</p>
                            </div>
                        </div>
                        <Link
                            to="/gallery/admin"
                            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
                        >
                            Manage Gallery
                        </Link>
                    </div>

                    {/* User Management */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <i className="fas fa-users text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                                <p className="text-sm text-gray-600">Manage users and roles</p>
                            </div>
                        </div>
                        <Link
                            to="/admin/users"
                            className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center"
                        >
                            Manage Users
                        </Link>
                    </div>

                    {/* Event Management */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <i className="fas fa-calendar text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
                                <p className="text-sm text-gray-600">Create and manage events</p>
                            </div>
                        </div>
                        <Link
                            to="/admin/events"
                            className="block w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-center"
                        >
                            Manage Events
                        </Link>
                    </div>

                    {/* Donation Management */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                                <i className="fas fa-hand-holding-heart text-yellow-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Donation Management</h3>
                                <p className="text-sm text-gray-600">Track and verify donations</p>
                            </div>
                        </div>
                        <Link
                            to="/admin/donations"
                            className="block w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 text-center"
                        >
                            Manage Donations
                        </Link>
                    </div>

                    {/* Announcement Management */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                <i className="fas fa-bullhorn text-red-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                                <p className="text-sm text-gray-600">Create and manage announcements</p>
                            </div>
                        </div>
                        <Link
                            to="/admin/announcements"
                            className="block w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-center"
                        >
                            Manage Announcements
                        </Link>
                    </div>

                    {/* Contact Management */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                                <i className="fas fa-envelope text-indigo-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Contact Management</h3>
                                <p className="text-sm text-gray-600">Handle contact inquiries</p>
                            </div>
                        </div>
                        <Link
                            to="/contact/admin"
                            className="block w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 text-center"
                        >
                            Manage Contacts
                        </Link>
                    </div>
                </div>

                {/* Debug and Utility Links */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Debug & Utilities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link
                            to="/debug-auth"
                            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 text-center text-sm"
                        >
                            🔍 Debug Panel
                        </Link>
                        <Link
                            to="/admin"
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center text-sm"
                        >
                            📊 Main Dashboard
                        </Link>
                        <a
                            href="/test-login.html"
                            target="_blank"
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center text-sm"
                        >
                            🧪 Test Login
                        </a>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-sm"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectAdmin;