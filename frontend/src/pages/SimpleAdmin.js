import React, { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../utils/simpleAuth';

const SimpleAdmin = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated()) {
                window.location.href = '/login';
                return;
            }

            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData);
                } else {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">+</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Haramaya Red Cross Admin</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                WELCOME, {user?.firstName} {user?.lastName}
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                    <p className="text-gray-600">Manage your Red Cross system</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-users text-blue-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                                <p className="text-gray-600 text-sm">Manage users and permissions</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <a
                                href="/admin/users"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Manage Users →
                            </a>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-calendar-alt text-green-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                                <p className="text-gray-600 text-sm">Create and manage events</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <a
                                href="/admin/events"
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                                Manage Events →
                            </a>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-images text-purple-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
                                <p className="text-gray-600 text-sm">Upload and manage images</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <a
                                href="/gallery/admin"
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                Manage Gallery →
                            </a>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.firstName} {user?.lastName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user?.isActive ? 'Active' : 'Inactive'} • {user?.isApproved ? 'Approved' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Debug Info */}
                <div className="mt-8 bg-gray-100 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
                        <p>User ID: {user?._id}</p>
                        <p>Login Time: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SimpleAdmin;