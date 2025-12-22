import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI, branchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        branch: '',
        search: '',
        status: 'published'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
        fetchBranches();
    }, [filters, pagination.page]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.page,
                limit: pagination.limit
            };

            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await eventAPI.getEvents(params);
            setEvents(response.data.events);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await branchAPI.getBranches();
            setBranches(response.data.branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeColor = (type) => {
        const colors = {
            blood_donation: 'bg-red-100 text-red-800',
            training: 'bg-blue-100 text-blue-800',
            emergency_response: 'bg-orange-100 text-orange-800',
            awareness: 'bg-green-100 text-green-800',
            fundraising: 'bg-purple-100 text-purple-800',
            meeting: 'bg-gray-100 text-gray-800',
            other: 'bg-indigo-100 text-indigo-800'
        };
        return colors[type] || colors.other;
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            blood_donation: 'fa-tint',
            training: 'fa-graduation-cap',
            emergency_response: 'fa-ambulance',
            awareness: 'fa-bullhorn',
            fundraising: 'fa-donate',
            meeting: 'fa-users',
            other: 'fa-calendar'
        };
        return icons[type] || icons.other;
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Red Cross Events</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join us in making a difference through humanitarian service, training, and community engagement
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="label">Search Events</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Search by title, description..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>

                        {/* Event Type */}
                        <div>
                            <label className="label">Event Type</label>
                            <select
                                className="input"
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="blood_donation">Blood Donation</option>
                                <option value="training">Training</option>
                                <option value="emergency_response">Emergency Response</option>
                                <option value="awareness">Awareness</option>
                                <option value="fundraising">Fundraising</option>
                                <option value="meeting">Meeting</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Branch */}
                        <div>
                            <label className="label">Campus Branch</label>
                            <select
                                className="input"
                                value={filters.branch}
                                onChange={(e) => handleFilterChange('branch', e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilters({ type: '', branch: '', search: '', status: 'published' });
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

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading events..." />
                    </div>
                ) : events.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {events.map((event, index) => (
                                <div
                                    key={event._id}
                                    className={`event-card animate-fade-in animate-stagger-${(index % 3) + 1}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`badge ${getEventTypeColor(event.type)}`}>
                                            <i className={`fas ${getEventTypeIcon(event.type)} mr-1`}></i>
                                            {event.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {event.availableSpots} spots left
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-calendar mr-2"></i>
                                            {formatDate(event.startDate)}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-map-marker-alt mr-2"></i>
                                            {event.location}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-users mr-2"></i>
                                            {event.participantCount} / {event.maxParticipants} participants
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Registration deadline: {formatDate(event.registrationDeadline)}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="btn btn-primary w-full"
                                        >
                                            <i className="fas fa-info-circle mr-2"></i>
                                            View Details & Register
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 animate-fade-in">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="fas fa-chevron-left mr-2"></i>
                                    Previous
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === pagination.page
                                                    ? 'bg-red-cross-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === totalPages}
                                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <i className="fas fa-chevron-right ml-2"></i>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 animate-fade-in">
                        <i className="fas fa-calendar-times text-gray-400 text-6xl mb-4"></i>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                        <p className="text-gray-600 mb-6">
                            {filters.search || filters.type || filters.branch
                                ? 'Try adjusting your filters to find more events.'
                                : 'There are no events available at the moment. Check back soon!'}
                        </p>
                        {(filters.search || filters.type || filters.branch) && (
                            <button
                                onClick={() => {
                                    setFilters({ type: '', branch: '', search: '', status: 'published' });
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-times mr-2"></i>
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;