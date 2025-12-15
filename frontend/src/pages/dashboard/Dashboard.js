import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, activitiesResponse, personalResponse] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getActivities({ limit: 5 }),
                dashboardAPI.getPersonalDashboard()
            ]);

            setStats(statsResponse.data.stats);
            setActivities(activitiesResponse.data.activities);
            setPersonalData(personalResponse.data.dashboard);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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
        switch (type) {
            case 'user_registration':
                return 'fa-user-plus';
            case 'donation':
                return 'fa-heart';
            case 'event_created':
                return 'fa-calendar-plus';
            case 'announcement':
                return 'fa-bullhorn';
            default:
                return 'fa-info-circle';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.firstName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's what's happening with Haramaya Red Cross Club
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-users text-blue-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Members</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.common?.totalMembers || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-calendar text-green-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.common?.upcomingEvents || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-bullhorn text-red-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Recent Announcements</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.common?.recentAnnouncements || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {hasRole(['admin', 'officer']) && (
                        <div className="card">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-clock text-yellow-600 text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.admin?.pendingApprovals || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasRole(['member', 'volunteer']) && (
                        <div className="card">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-heart text-purple-600 text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">My Events</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.member?.myEvents || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    to="/events"
                                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fas fa-calendar text-blue-600 text-2xl mb-2"></i>
                                    <span className="text-sm font-medium text-gray-900">View Events</span>
                                </Link>

                                <Link
                                    to="/announcements"
                                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fas fa-bullhorn text-green-600 text-2xl mb-2"></i>
                                    <span className="text-sm font-medium text-gray-900">Announcements</span>
                                </Link>

                                <Link
                                    to="/profile"
                                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fas fa-user text-purple-600 text-2xl mb-2"></i>
                                    <span className="text-sm font-medium text-gray-900">My Profile</span>
                                </Link>

                                {hasRole(['admin', 'officer']) && (
                                    <Link
                                        to="/admin"
                                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <i className="fas fa-cog text-red-600 text-2xl mb-2"></i>
                                        <span className="text-sm font-medium text-gray-900">Admin Panel</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* My Events (for members/volunteers) */}
                        {hasRole(['member', 'volunteer']) && personalData?.myEvents && (
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">My Registered Events</h2>
                                    <Link to="/events" className="text-red-cross-600 hover:text-red-cross-700 text-sm font-medium">
                                        View All →
                                    </Link>
                                </div>
                                {personalData.myEvents.length > 0 ? (
                                    <div className="space-y-3">
                                        {personalData.myEvents.slice(0, 3).map((event) => (
                                            <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(event.startDate)} • {event.branch?.name}
                                                    </p>
                                                </div>
                                                <span className={`badge ${event.status === 'published' ? 'badge-success' : 'badge-warning'
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No registered events</p>
                                )}
                            </div>
                        )}

                        {/* Available Events */}
                        {personalData?.availableEvents && (
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Available Events</h2>
                                    <Link to="/events" className="text-red-cross-600 hover:text-red-cross-700 text-sm font-medium">
                                        View All →
                                    </Link>
                                </div>
                                {personalData.availableEvents.length > 0 ? (
                                    <div className="space-y-3">
                                        {personalData.availableEvents.slice(0, 3).map((event) => (
                                            <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(event.startDate)} • {event.branch?.name}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Register
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No available events</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Profile Card */}
                        <div className="card">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-cross-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-red-cross-600 font-bold text-xl">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{user?.fullName}</h3>
                                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                                <p className="text-sm text-gray-500">{user?.branch?.name}</p>

                                {!user?.isApproved && ['member', 'volunteer'].includes(user?.role) && (
                                    <div className="mt-3">
                                        <span className="badge badge-warning">Pending Approval</span>
                                    </div>
                                )}

                                <Link to="/profile" className="btn btn-sm btn-outline mt-4 w-full">
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                            {activities.length > 0 ? (
                                <div className="space-y-3">
                                    {activities.map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <i className={`fas ${getActivityIcon(activity.type)} text-gray-600 text-xs`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">{activity.message}</p>
                                                <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No recent activities</p>
                            )}
                        </div>

                        {/* Next Event */}
                        {stats?.member?.nextEvent && (
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Event</h3>
                                <div className="bg-red-cross-50 border border-red-cross-200 rounded-lg p-4">
                                    <h4 className="font-medium text-red-cross-900">{stats.member.nextEvent.title}</h4>
                                    <p className="text-sm text-red-cross-700 mt-1">
                                        {formatDate(stats.member.nextEvent.startDate)}
                                    </p>
                                    <p className="text-sm text-red-cross-600 mt-1">
                                        {stats.member.nextEvent.branch?.name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;