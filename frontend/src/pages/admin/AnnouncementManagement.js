import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI, branchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'general',
        priority: 'medium',
        visibility: 'public',
        status: 'draft',
        tags: '',
        expiryDate: '',
        isPinned: false,
        sendNotification: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        fetchAnnouncements();
        fetchBranches();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await announcementAPI.getAnnouncements({ limit: 50 });
            setAnnouncements(response.data.announcements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Frontend validation
        if (!formData.title || !formData.content) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            // Process tags
            const processedData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
            };

            // Remove empty expiryDate
            if (!processedData.expiryDate) {
                delete processedData.expiryDate;
            }

            if (editingAnnouncement) {
                await announcementAPI.updateAnnouncement(editingAnnouncement._id, processedData);
                setSuccess('Announcement updated successfully!');
            } else {
                await announcementAPI.createAnnouncement(processedData);
                setSuccess('Announcement created successfully!');
            }

            resetForm();
            fetchAnnouncements();
        } catch (error) {
            console.error('Announcement save error:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to save announcement');

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
            content: '',
            type: 'general',
            priority: 'medium',
            visibility: 'public',
            status: 'draft',
            tags: '',
            expiryDate: '',
            isPinned: false,
            sendNotification: true
        });
        setShowCreateForm(false);
        setEditingAnnouncement(null);
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            priority: announcement.priority,
            visibility: announcement.visibility,
            status: announcement.status,
            tags: announcement.tags ? announcement.tags.join(', ') : '',
            expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toISOString().slice(0, 16) : '',
            isPinned: announcement.isPinned || false,
            sendNotification: announcement.sendNotification !== false
        });
        setShowCreateForm(true);
    };

    const handleDelete = async (announcementId) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await announcementAPI.deleteAnnouncement(announcementId);
                setSuccess('Announcement deleted successfully!');
                fetchAnnouncements();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to delete announcement');
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
            archived: 'bg-yellow-100 text-yellow-800',
            deleted: 'bg-red-100 text-red-800'
        };
        return colors[status] || colors.draft;
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

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Announcement Management</h1>
                        <p className="text-gray-600">Create and manage Red Cross announcements</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        {showCreateForm ? 'Cancel' : 'Create Announcement'}
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
                            {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="label">Announcement Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        className="input"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter announcement title"
                                    />
                                </div>

                                <div>
                                    <label className="label">Type *</label>
                                    <select
                                        name="type"
                                        required
                                        className="input"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
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
                                    <label className="label">Priority *</label>
                                    <select
                                        name="priority"
                                        required
                                        className="input"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Visibility *</label>
                                    <select
                                        name="visibility"
                                        required
                                        className="input"
                                        value={formData.visibility}
                                        onChange={handleInputChange}
                                    >
                                        <option value="public">Public</option>
                                        <option value="members_only">Members Only</option>
                                        <option value="officers_only">Officers Only</option>
                                        <option value="admin_only">Admin Only</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Status *</label>
                                    <select
                                        name="status"
                                        required
                                        className="input"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">Content *</label>
                                <textarea
                                    name="content"
                                    required
                                    rows="6"
                                    className="input"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="Write your announcement content here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        className="input"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="e.g., urgent, health, training"
                                    />
                                </div>

                                <div>
                                    <label className="label">Expiry Date (optional)</label>
                                    <input
                                        type="datetime-local"
                                        name="expiryDate"
                                        className="input"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isPinned"
                                        id="isPinned"
                                        className="h-4 w-4 text-red-cross-600 focus:ring-red-cross-500 border-gray-300 rounded"
                                        checked={formData.isPinned}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-900">
                                        Pin to top
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="sendNotification"
                                        id="sendNotification"
                                        className="h-4 w-4 text-red-cross-600 focus:ring-red-cross-500 border-gray-300 rounded"
                                        checked={formData.sendNotification}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-900">
                                        Send notification to users
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
                                    {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Announcements List */}
                <div className="card animate-slide-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">All Announcements</h2>
                        <div className="text-sm text-gray-500">
                            Total: {announcements.length} announcements
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" text="Loading announcements..." />
                        </div>
                    ) : announcements.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Announcement
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type & Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status & Visibility
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Engagement
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {announcements.map((announcement) => (
                                        <tr key={announcement._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {announcement.title}
                                                            {announcement.isPinned && (
                                                                <i className="fas fa-thumbtack text-red-cross-500 ml-2"></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {announcement.content}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatDate(announcement.publishDate)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <span className="badge badge-info">
                                                        {announcement.type.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    <br />
                                                    <span className={`badge ${getPriorityColor(announcement.priority)}`}>
                                                        {announcement.priority.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <span className={`badge ${getStatusColor(announcement.status)}`}>
                                                        {announcement.status.toUpperCase()}
                                                    </span>
                                                    <br />
                                                    <span className="text-xs text-gray-500">
                                                        {announcement.visibility.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="space-y-1">
                                                    <div>{announcement.viewCount || 0} views</div>
                                                    <div>{announcement.likeCount || 0} likes</div>
                                                    <div>{announcement.commentCount || 0} comments</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    to={`/announcements/${announcement._id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(announcement)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(announcement._id)}
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
                            <i className="fas fa-bullhorn text-gray-400 text-6xl mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements Found</h3>
                            <p className="text-gray-600 mb-6">
                                Get started by creating your first announcement.
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Create First Announcement
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementManagement;