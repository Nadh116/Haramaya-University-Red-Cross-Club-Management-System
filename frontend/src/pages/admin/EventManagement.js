import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI, branchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'blood_donation',
        startDate: '',
        endDate: '',
        location: '',
        branch: '',
        maxParticipants: 50,
        registrationDeadline: '',
        requirements: [''],
        status: 'draft',
        isPublic: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { user } = useAuth(); // eslint-disable-line no-unused-vars

    useEffect(() => {
        fetchEvents();
        fetchBranches();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventAPI.getEvents({ limit: 50 });
            setEvents(response.data.events);
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const addRequirement = () => {
        setFormData(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const removeRequirement = (index) => {
        const newRequirements = formData.requirements.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Frontend validation
        if (!formData.title || !formData.description || !formData.startDate ||
            !formData.endDate || !formData.location || !formData.branch ||
            !formData.registrationDeadline) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate dates
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const regDeadline = new Date(formData.registrationDeadline);

        if (endDate <= startDate) {
            setError('End date must be after start date');
            return;
        }

        if (regDeadline >= startDate) {
            setError('Registration deadline must be before event start date');
            return;
        }

        try {
            // Filter out empty requirements and ensure proper date formatting
            const cleanedData = {
                ...formData,
                requirements: formData.requirements.filter(req => req.trim() !== ''),
                // Ensure dates are properly formatted as ISO strings
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                registrationDeadline: regDeadline.toISOString()
            };

            // Debug: Log the data being sent
            console.log('Sending event data:', cleanedData);

            if (editingEvent) {
                await eventAPI.updateEvent(editingEvent._id, cleanedData);
                setSuccess('Event updated successfully!');
            } else {
                await eventAPI.createEvent(cleanedData);
                setSuccess('Event created successfully!');
            }

            resetForm();
            fetchEvents();
        } catch (error) {
            console.error('Event creation error:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to save event');

            // Show detailed validation errors if available
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
                setError(`Validation failed: ${errorMessages}`);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'blood_donation',
            startDate: '',
            endDate: '',
            location: '',
            branch: '',
            maxParticipants: 50,
            registrationDeadline: '',
            requirements: [''],
            status: 'draft',
            isPublic: true
        });
        setShowCreateForm(false);
        setEditingEvent(null);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            type: event.type,
            startDate: new Date(event.startDate).toISOString().slice(0, 16),
            endDate: new Date(event.endDate).toISOString().slice(0, 16),
            location: event.location,
            branch: event.branch._id,
            maxParticipants: event.maxParticipants,
            registrationDeadline: new Date(event.registrationDeadline).toISOString().slice(0, 16),
            requirements: event.requirements.length > 0 ? event.requirements : [''],
            status: event.status,
            isPublic: event.isPublic
        });
        setShowCreateForm(true);
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventAPI.deleteEvent(eventId);
                setSuccess('Event deleted successfully!');
                fetchEvents();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to delete event');
            }
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

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            published: 'bg-green-100 text-green-800',
            ongoing: 'bg-blue-100 text-blue-800',
            completed: 'bg-purple-100 text-purple-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || colors.draft;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                        <p className="text-gray-600">Create and manage Red Cross events</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        {showCreateForm ? 'Cancel' : 'Create Event'}
                    </button>
                </div>

                {/* Success/Error Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <i className="fas fa-check-circle text-green-400 mr-3 mt-0.5"></i>
                            <div className="text-sm text-green-700">{success}</div>
                        </div>
                    </div>
                )}

                {/* Create/Edit Form */}
                {showCreateForm && (
                    <div className="card mb-8 animate-slide-up">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            {editingEvent ? 'Edit Event' : 'Create New Event'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        className="input"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter event title"
                                    />
                                </div>
                                <div>
                                    <label className="label">Event Type *</label>
                                    <select
                                        name="type"
                                        required
                                        className="input"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="blood_donation">Blood Donation</option>
                                        <option value="training">Training</option>
                                        <option value="emergency_response">Emergency Response</option>
                                        <option value="awareness">Awareness</option>
                                        <option value="fundraising">Fundraising</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    className="input"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the event..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="label">Start Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        required
                                        className="input"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="label">End Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        required
                                        className="input"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="label">Registration Deadline *</label>
                                    <input
                                        type="datetime-local"
                                        name="registrationDeadline"
                                        required
                                        className="input"
                                        value={formData.registrationDeadline}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="label">Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        className="input"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Event location"
                                    />
                                </div>
                                <div>
                                    <label className="label">Branch *</label>
                                    <select
                                        name="branch"
                                        required
                                        className="input"
                                        value={formData.branch}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map((branch) => (
                                            <option key={branch._id} value={branch._id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Max Participants *</label>
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        required
                                        min="1"
                                        className="input"
                                        value={formData.maxParticipants}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Requirements</label>
                                {formData.requirements.map((requirement, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="text"
                                            className="input flex-1"
                                            value={requirement}
                                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                                            placeholder="Enter requirement"
                                        />
                                        {formData.requirements.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRequirement(index)}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addRequirement}
                                    className="btn btn-secondary btn-sm"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    Add Requirement
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Status</label>
                                    <select
                                        name="status"
                                        className="input"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isPublic"
                                        id="isPublic"
                                        className="h-4 w-4 text-red-cross-600 focus:ring-red-cross-500 border-gray-300 rounded"
                                        checked={formData.isPublic}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                                        Public Event (visible to non-members)
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save mr-2"></i>
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Events List */}
                <div className="card animate-slide-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
                        <div className="text-sm text-gray-500">
                            Total: {events.length} events
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" text="Loading events..." />
                        </div>
                    ) : events.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type & Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Participants
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <tr key={event._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {event.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <span className="badge badge-info">
                                                        {event.type.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    <br />
                                                    <span className={`badge ${getStatusColor(event.status)}`}>
                                                        {event.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>
                                                    <div>{formatDate(event.startDate)}</div>
                                                    <div className="text-xs">{event.location}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {event.participantCount} / {event.maxParticipants}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <i className="fas fa-calendar-times text-gray-400 text-6xl mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                            <p className="text-gray-600 mb-6">
                                Get started by creating your first event.
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Create First Event
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventManagement;