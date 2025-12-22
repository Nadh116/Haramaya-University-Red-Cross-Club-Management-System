import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsResponse, activitiesResponse] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getActivities({ limit: 10 })
            ]);

            setStats(statsResponse.data.stats);
            setActivities(activitiesResponse.data.activities);
        } catch (error) {
            setError('Failed to load dashboard data');
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            user_registration: 'fas fa-user-plus text-blue-500',
            donation: 'fas fa-heart text-red-500',
            event_created: 'fas fa-calendar-plus text-green-500',
            announcement: 'fas fa-bullhorn text-purple-500'
        };
        return icons[type] || 'fas fa-info-circle text-gray-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome back, {user?.firstName}! Here's what's happening with Haramaya Red Cross.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Members */}
                    <div className="card animate-slide-up">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-users text-blue-600 text-xl"></i>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Members</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.common?.totalMembers || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="card animate-slide-up animate-stagger-1">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-calendar-alt text-green-600 text-xl"></i>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.common?.upcomingEvents || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="card animate-slide-up animate-stagger-2">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-clock text-yellow-600 text-xl"></i>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.admin?.pendingApprovals || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Donations */}
                    <div className="card animate-slide-up animate-stagger-3">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-heart text-red-600 text-xl"></i>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.admin?.totalDonations || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blood Donation Stats */}
                {stats?.admin?.totalBloodUnits > 0 && (
                    <div className="card mb-8 animate-slide-up animate-stagger-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Blood Donation Impact</h3>
                            <Link to="/admin/donations" className="text-red-cross-600 hover:text-red-cross-700 text-sm font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-3xl font-bold text-red-600 mb-2">
                                    {stats.admin.totalBloodUnits}
                                </div>
                                <div className="text-sm text-gray-600">Units Collected</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-3xl font-bold text-red-600 mb-2">
                                    {stats.admin.totalBloodUnits * 3}
                                </div>
                                <div className="text-sm text-gray-600">Lives Potentially Saved</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-3xl font-bold text-red-600 mb-2">
                                    {Math.round(stats.admin.totalBloodUnits * 0.45)}L
                                </div>
                                <div className="text-sm text-gray-600">Blood Volume</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Actions */}
                    <div className="card animate-slide-up animate-stagger-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/admin/users"
                                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fas fa-users text-blue-600 text-2xl mb-2"></i>
                                <span className="text-sm font-medium text-gray-900">Manage Users</span>
                                {stats?.admin?.pendingApprovals > 0 && (
                                    <span className="mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                        {stats.admin.pendingApprovals} pending
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/admin/events"
                                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fas fa-calendar-plus text-green-600 text-2xl mb-2"></i>
                                <span className="text-sm font-medium text-gray-900">Create Event</span>
                            </Link>

                            <Link
                                to="/admin/announcements"
                                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fas fa-bullhorn text-purple-600 text-2xl mb-2"></i>
                                <span className="text-sm font-medium text-gray-900">New Announcement</span>
                            </Link>

                            <Link
                                to="/admin/donations"
                                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fas fa-heart text-red-600 text-2xl mb-2"></i>
                                <span className="text-sm font-medium text-gray-900">Record Donation</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="card animate-slide-up animate-stagger-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                            <button
                                onClick={fetchDashboardData}
                                className="text-gray-400 hover:text-gray-600"
                                title="Refresh"
                            >
                                <i className="fas fa-sync-alt"></i>
                            </button>
                        </div>

                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <i className={getActivityIcon(activity.type)}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(activity.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <i className="fas fa-history text-4xl mb-3"></i>
                                <p>No recent activities</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Events Breakdown */}
                {stats?.admin?.monthlyEvents && stats.admin.monthlyEvents.length > 0 && (
                    <div className="card mt-8 animate-slide-up animate-stagger-7">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">This Month's Events</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.admin.monthlyEvents.map((eventType, index) => (
                                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {eventType.count}
                                    </div>
                                    <div className="text-sm text-gray-600 capitalize">
                                        {eventType._id.replace('_', ' ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* System Status */}
                <div className="card mt-8 animate-slide-up animate-stagger-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">System Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Database</p>
                                <p className="text-xs text-gray-500">Connected</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">API Services</p>
                                <p className="text-xs text-gray-500">Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">User Sessions</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;