import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registrationNotes, setRegistrationNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await eventAPI.getEvent(id);
            setEvent(response.data.event);
        } catch (error) {
            console.error('Error fetching event:', error);
            setError('Event not found or you do not have permission to view it.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
            return;
        }

        try {
            setRegistering(true);
            setError('');
            await eventAPI.registerForEvent(id, { notes: registrationNotes });
            setSuccess('Successfully registered for the event!');
            fetchEvent(); // Refresh event data
            setRegistrationNotes('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to register for event');
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregister = async () => {
        try {
            setRegistering(true);
            setError('');
            await eventAPI.unregisterFromEvent(id);
            setSuccess('Successfully unregistered from the event.');
            fetchEvent(); // Refresh event data
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to unregister from event');
        } finally {
            setRegistering(false);
        }
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

    const isRegistered = user && event?.participants?.some(p => p.user._id === user._id);
    const canRegister = event && new Date() < new Date(event.registrationDeadline) && event.availableSpots > 0;
    const isEventPast = event && new Date() > new Date(event.endDate);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading event details..." />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card text-center py-12">
                        <i className="fas fa-exclamation-triangle text-red-400 text-6xl mb-4"></i>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link to="/events" className="btn btn-primary">
                            <i className="fas fa-arrow-left mr-2"></i>
                            Back to Events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6 animate-fade-in">
                    <Link to="/events" className="text-red-cross-600 hover:text-red-cross-700 font-medium">
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to Events
                    </Link>
                </div>

                {/* Event Header */}
                <div className="card mb-8 animate-slide-up">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className={`badge ${getEventTypeColor(event.type)}`}>
                                    <i className={`fas ${getEventTypeIcon(event.type)} mr-1`}></i>
                                    {event.type.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`badge ${event.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                    {event.status.toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                            <p className="text-lg text-gray-600">{event.description}</p>
                        </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <i className="fas fa-calendar text-red-cross-600 w-5 mr-3"></i>
                                <div>
                                    <p className="font-medium">Start Date</p>
                                    <p className="text-gray-600">{formatDate(event.startDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-calendar-check text-red-cross-600 w-5 mr-3"></i>
                                <div>
                                    <p className="font-medium">End Date</p>
                                    <p className="text-gray-600">{formatDate(event.endDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-map-marker-alt text-red-cross-600 w-5 mr-3"></i>
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-gray-600">{event.location}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <i className="fas fa-users text-red-cross-600 w-5 mr-3"></i>
                                <div>
                                    <p className="font-medium">Participants</p>
                                    <p className="text-gray-600">{event.participantCount} / {event.maxParticipants}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-clock text-red-cross-600 w-5 mr-3"></i>
                                <div>
                                    <p className="font-medium">Registration Deadline</p>
                                    <p className="text-gray-600">{formatDate(event.registrationDeadline)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-user-tie text-red-cross-600 w-5 mr-3"></i>
                                <div>
                                    <p className="font-medium">Organizer</p>
                                    <p className="text-gray-600">
                                        {event.organizer?.firstName} {event.organizer?.lastName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    {event.requirements && event.requirements.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                            <ul className="space-y-2">
                                {event.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start">
                                        <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                        <span className="text-gray-600">{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Registration Section */}
                    <div className="border-t border-gray-200 pt-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                                <div className="flex">
                                    <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
                                    <div className="text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                                <div className="flex">
                                    <i className="fas fa-check-circle text-green-400 mr-3 mt-0.5"></i>
                                    <div className="text-sm text-green-700">{success}</div>
                                </div>
                            </div>
                        )}

                        {!user ? (
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Please log in to register for this event.</p>
                                <Link to="/login" className="btn btn-primary">
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Login to Register
                                </Link>
                            </div>
                        ) : isEventPast ? (
                            <div className="text-center">
                                <p className="text-gray-600">This event has already ended.</p>
                            </div>
                        ) : isRegistered ? (
                            <div className="text-center">
                                <p className="text-green-600 mb-4 font-medium">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    You are registered for this event!
                                </p>
                                <button
                                    onClick={handleUnregister}
                                    disabled={registering}
                                    className="btn btn-secondary"
                                >
                                    {registering ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Unregistering...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-times mr-2"></i>
                                            Unregister
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : !canRegister ? (
                            <div className="text-center">
                                <p className="text-gray-600">
                                    {new Date() > new Date(event.registrationDeadline)
                                        ? 'Registration deadline has passed.'
                                        : 'This event is full.'}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Register for Event</h3>
                                <div className="mb-4">
                                    <label className="label">Additional Notes (Optional)</label>
                                    <textarea
                                        className="input"
                                        rows="3"
                                        placeholder="Any special requirements or notes..."
                                        value={registrationNotes}
                                        onChange={(e) => setRegistrationNotes(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleRegister}
                                    disabled={registering}
                                    className="btn btn-primary w-full"
                                >
                                    {registering ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-user-plus mr-2"></i>
                                            Register for Event
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Participants List */}
                {event.participants && event.participants.length > 0 && (
                    <div className="card animate-slide-up animate-stagger-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Registered Participants ({event.participantCount})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.participants.map((participant, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-red-cross-600 rounded-full flex items-center justify-center">
                                        <i className="fas fa-user text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {participant.user?.firstName} {participant.user?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Registered {new Date(participant.registeredAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetail;