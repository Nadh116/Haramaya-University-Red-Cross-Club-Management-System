import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        inquiryType: 'all',
        priority: 'all',
        search: ''
    });
    const [pagination, setPagination] = useState({});
    const [statistics, setStatistics] = useState({});

    const { user } = useAuth();

    const statusOptions = [
        { value: 'all', label: 'All Status', color: 'gray' },
        { value: 'new', label: 'New', color: 'blue' },
        { value: 'in-progress', label: 'In Progress', color: 'yellow' },
        { value: 'resolved', label: 'Resolved', color: 'green' },
        { value: 'closed', label: 'Closed', color: 'gray' }
    ];

    const inquiryTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'general', label: 'General Information' },
        { value: 'volunteer', label: 'Volunteer Opportunities' },
        { value: 'emergency', label: 'Emergency Assistance' },
        { value: 'donation', label: 'Blood Donation' },
        { value: 'training', label: 'Training Programs' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'suggestion', label: 'Suggestion' }
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'low', label: 'Low', color: 'green' },
        { value: 'medium', label: 'Medium', color: 'yellow' },
        { value: 'high', label: 'High', color: 'orange' },
        { value: 'urgent', label: 'Urgent', color: 'red' }
    ];

    useEffect(() => {
        fetchContacts();
        fetchStatistics();
    }, [filters]);

    const fetchContacts = async (page = 1) => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 20,
                status: filters.status === 'all' ? undefined : filters.status,
                inquiryType: filters.inquiryType === 'all' ? undefined : filters.inquiryType,
                priority: filters.priority === 'all' ? undefined : filters.priority,
                search: filters.search || undefined
            };

            const response = await contactAPI.getContacts(params);
            setContacts(response.data.data.contacts);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await contactAPI.getStatistics();
            setStatistics(response.data.data.statistics);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleStatusUpdate = async (contactId, newStatus) => {
        try {
            await contactAPI.updateStatus(contactId, { status: newStatus });
            fetchContacts();
            if (selectedContact && selectedContact._id === contactId) {
                setSelectedContact({ ...selectedContact, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
        }
    };

    const handlePriorityUpdate = async (contactId, newPriority) => {
        try {
            await contactAPI.updateStatus(contactId, { priority: newPriority });
            fetchContacts();
            if (selectedContact && selectedContact._id === contactId) {
                setSelectedContact({ ...selectedContact, priority: newPriority });
            }
        } catch (error) {
            console.error('Error updating priority:', error);
            alert('Error updating priority. Please try again.');
        }
    };

    const handleSendResponse = async (e) => {
        e.preventDefault();
        if (!responseMessage.trim()) return;

        try {
            await contactAPI.addResponse(selectedContact._id, {
                message: responseMessage,
                isInternal: false,
                sendEmail: true
            });

            setResponseMessage('');
            setShowResponseModal(false);

            // Refresh contact details
            const response = await contactAPI.getContact(selectedContact._id);
            setSelectedContact(response.data.data.contact);

            fetchContacts();
        } catch (error) {
            console.error('Error sending response:', error);
            alert('Error sending response. Please try again.');
        }
    };

    const handleDelete = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) return;

        try {
            await contactAPI.deleteContact(contactId);
            fetchContacts();
            if (selectedContact && selectedContact._id === contactId) {
                setShowDetailModal(false);
                setSelectedContact(null);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        const statusObj = statusOptions.find(s => s.value === status);
        return statusObj ? statusObj.color : 'gray';
    };

    const getPriorityColor = (priority) => {
        const priorityObj = priorityOptions.find(p => p.value === priority);
        return priorityObj ? priorityObj.color : 'gray';
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
                    <p className="text-gray-600 mt-2">Manage and respond to contact form submissions</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-envelope text-blue-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Contacts</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.totalContacts || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-clock text-yellow-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.pendingContacts || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Resolved</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.resolvedContacts || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Urgent</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.urgentContacts || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            >
                                {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                            <select
                                value={filters.inquiryType}
                                onChange={(e) => setFilters({ ...filters, inquiryType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            >
                                {inquiryTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            >
                                {priorityOptions.map(priority => (
                                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                placeholder="Search by name, email, subject, or message..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Contacts Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading contacts..." />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {contacts.map((contact) => (
                                        <tr key={contact._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                    <div className="text-sm text-gray-500">{contact.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                    {inquiryTypes.find(t => t.value === contact.inquiryType)?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={contact.status}
                                                    onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                                                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-red-cross-500 bg-${getStatusColor(contact.status)}-100 text-${getStatusColor(contact.status)}-800`}
                                                >
                                                    {statusOptions.slice(1).map(status => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={contact.priority}
                                                    onChange={(e) => handlePriorityUpdate(contact._id, e.target.value)}
                                                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-red-cross-500 bg-${getPriorityColor(contact.priority)}-100 text-${getPriorityColor(contact.priority)}-800`}
                                                >
                                                    {priorityOptions.slice(1).map(priority => (
                                                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(contact.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedContact(contact);
                                                            setShowDetailModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700"
                                                        title="View Details"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedContact(contact);
                                                            setShowResponseModal(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-700"
                                                        title="Send Response"
                                                    >
                                                        <i className="fas fa-reply"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(contact._id)}
                                                        className="text-red-600 hover:text-red-700"
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {pagination.hasPrevPage && (
                                            <button
                                                onClick={() => fetchContacts(pagination.currentPage - 1)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        <span className="px-4 py-2 bg-red-cross-600 text-white rounded-lg">
                                            {pagination.currentPage} of {pagination.totalPages}
                                        </span>
                                        {pagination.hasNextPage && (
                                            <button
                                                onClick={() => fetchContacts(pagination.currentPage + 1)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Response Modal */}
                {showResponseModal && selectedContact && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Send Response</h2>
                                    <button
                                        onClick={() => setShowResponseModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-900">Original Message:</h3>
                                    <p className="text-sm text-gray-600 mt-1">{selectedContact.subject}</p>
                                    <p className="text-sm text-gray-700 mt-2">{selectedContact.message}</p>
                                </div>

                                <form onSubmit={handleSendResponse}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Response *
                                        </label>
                                        <textarea
                                            value={responseMessage}
                                            onChange={(e) => setResponseMessage(e.target.value)}
                                            rows="6"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                            placeholder="Type your response here..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowResponseModal(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-red-cross-600 text-white rounded-lg hover:bg-red-cross-700"
                                        >
                                            Send Response
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManagement;