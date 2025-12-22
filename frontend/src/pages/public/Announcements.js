import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        priority: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchAnnouncements();
    }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            };

            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '') delete params[key];
            });

            const response = await announcementAPI.getAnnouncements(params);
            setAnnouncements(response.data.announcements);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleLike = async (announcementId) => {
        if (!user) return;

        try {
            await announcementAPI.toggleLike(announcementId);
            // Refresh announcements to get updated like count
            fetchAnnouncements();
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-blue-100 text-blue-800',
            high: 'bg-yellow-100 text-yellow-800',
            critical: 'bg-red-100 text-red-800'
        };
        return colors[priority] || colors.medium;
    };

    const getTypeIcon = (type) => {
        const icons = {
            general: 'fas fa-info-circle',
            urgent: 'fas fa-exclamation-triangle',
            event: 'fas fa-calendar-alt',
            donation: 'fas fa-heart',
            training: 'fas fa-graduation-cap',
            meeting: 'fas fa-users',
            emergency: 'fas fa-ambulance'
        };
        return icons[type] || icons.general;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Announcements</h1>
                    <p className="text-xl text-gray-600">
                        Stay updated with the latest news and announcements from Haramaya Red Cross
                    </p>
                </div>

                {/* Filters */}
                <div className="card mb-8 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="label">Search</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search announcements..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">Type</label>
                            <select
                                className="input"
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="general">General</option>
                                <option value="urgent">Urgent</option>
                                <option value="event">Event</option>
                                <option value="donation">Donation</option>
                                <option value="training">Training</option>
                                <option value="meeting">Meeting</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Priority</label>
                            <select
                                className="input"
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilters({ type: '', priority: '', search: '' });
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className="btn btn-secondary w-full"
                            >
                                <i className="fas fa-times mr-2"></i>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Announcements List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading announcements..." />
                    </div>
                ) : announcements.length > 0 ? (
                    <div className="space-y-6 animate-fade-in">
                        {announcements.map((announcement, index) => (
                            <div
                                key={announcement._id}
                                className={`card hover:shadow-lg transition-all duration-300 animate-slide-up ${announcement.isPinned ? 'border-l-4 border-red-cross-500 bg-red-cross-50' : ''
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-center space-x-3 mb-3">
                                            <i className={`${getTypeIcon(announcement.type)} text-red-cross-600`}></i>
                                            <span className={`badge ${getPriorityColor(announcement.priority)}`}>
                                                {announcement.priority.toUpperCase()}
                                            </span>
                                            {announcement.isPinned && (
                                                <span className="badge bg-red-cross-100 text-red-cross-800">
                                                    <i className="fas fa-thumbtack mr-1"></i>
                                                    PINNED
                                                </span>
                                            )}
                                            <span className="badge badge-info">
                                                {announcement.type.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Title and Content */}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-red-cross-600 transition-colors">
                                            <Link to={`/announcements/${announcement._id}`}>
                                                {announcement.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {announcement.content}
                                        </p>

                                        {/* Meta Information */}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <span>
                                                    <i className="fas fa-user mr-1"></i>
                                                    {announcement.author ?
                                                        `${announcement.author.firstName} ${announcement.author.lastName}` :
                                                        'Unknown Author'
                                                    }
                                                </span>
                                                <span>
                                                    <i className="fas fa-clock mr-1"></i>
                                                    {formatDate(announcement.publishDate)}
                                                </span>
                                                <span>
                                                    <i className="fas fa-eye mr-1"></i>
                                                    {announcement.viewCount || 0} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        {user && (
                                            <button
                                                onClick={() => handleLike(announcement._id)}
                                                className="flex items-center space-x-1 text-gray-500 hover:text-red-cross-600 transition-colors"
                                            >
                                                <i className="fas fa-heart"></i>
                                                <span>{announcement.likeCount || 0}</span>
                                            </button>
                                        )}
                                        <span className="flex items-center space-x-1 text-gray-500">
                                            <i className="fas fa-comment"></i>
                                            <span>{announcement.commentCount || 0}</span>
                                        </span>
                                    </div>
                                    <Link
                                        to={`/announcements/${announcement._id}`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Read More
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {pagination.total > pagination.limit && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <span className="px-4 py-2 text-sm text-gray-600">
                                        Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                                    </span>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 animate-fade-in">
                        <i className="fas fa-bullhorn text-gray-400 text-6xl mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements Found</h3>
                        <p className="text-gray-600 mb-6">
                            {filters.search || filters.type || filters.priority
                                ? 'Try adjusting your filters to see more announcements.'
                                : 'There are no announcements available at the moment.'}
                        </p>
                        {(filters.search || filters.type || filters.priority) && (
                            <button
                                onClick={() => {
                                    setFilters({ type: '', priority: '', search: '' });
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className="btn btn-primary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;