import React, { useState, useEffect } from 'react';
import { userAPI, branchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filters and pagination
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        branch: '',
        isApproved: '',
        isActive: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
        fetchBranches();
    }, [filters, pagination.page]);

    const fetchUsers = async () => {
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

            const response = await userAPI.getUsers(params);
            setUsers(response.data.users);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Fetch users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await branchAPI.getBranches();
            setBranches(response.data.branches);
        } catch (error) {
            console.error('Fetch branches error:', error);
        }
    };

    const handleApproveUser = async (userId) => {
        try {
            await userAPI.approveUser(userId);
            setSuccess('User approved successfully');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to approve user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRejectUser = async (userId) => {
        if (window.confirm('Are you sure you want to reject this user?')) {
            try {
                await userAPI.rejectUser(userId);
                setSuccess('User rejected successfully');
                fetchUsers();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to reject user');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await userAPI.deleteUser(userId);
                setSuccess('User deactivated successfully');
                fetchUsers();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to deactivate user');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            officer: 'bg-blue-100 text-blue-800',
            member: 'bg-green-100 text-green-800',
            volunteer: 'bg-purple-100 text-purple-800',
            visitor: 'bg-gray-100 text-gray-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (user) => {
        if (!user.isActive) {
            return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>;
        }
        if (!user.isApproved) {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    if (loading && users.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading users..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">Manage Users, approvals, and permissions</p>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add User
                            </button>
                        )}
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                        <div className="flex">
                            <i className="fas fa-exclamation-circle text-red-500 mt-0.5 mr-3"></i>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-slide-up">
                        <div className="flex">
                            <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
                            <p className="text-green-700">{success}</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="card mb-8 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Name, email, or student ID"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                value={filters.role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="input"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="officer">Officer</option>
                                <option value="member">Member</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="visitor">Visitor</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                            <select
                                value={filters.branch}
                                onChange={(e) => handleFilterChange('branch', e.target.value)}
                                className="input"
                            >
                                <option value="">All Branches</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.isApproved}
                                onChange={(e) => handleFilterChange('isApproved', e.target.value)}
                                className="input"
                            >
                                <option value="">All Status</option>
                                <option value="true">Approved</option>
                                <option value="false">Pending</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
                            <select
                                value={filters.isActive}
                                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card animate-slide-up animate-stagger-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Users ({pagination.total})
                        </h2>
                        {loading && (
                            <LoadingSpinner size="sm" />
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-cross-100 rounded-full flex items-center justify-center">
                                                    <span className="text-red-cross-600 font-medium text-sm">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    {user.studentId && (
                                                        <div className="text-xs text-gray-400">ID: {user.studentId}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.branch?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(user)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowUserModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Details"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>

                                                {!user.isApproved && user.isActive && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveUser(user._id)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Approve User"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectUser(user._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Reject User"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </>
                                                )}

                                                {currentUser?.role === 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Deactivate User"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <i className="fas fa-users text-gray-400 text-4xl mb-4"></i>
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {(pagination.page - 1) * pagination.limit + 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">{pagination.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pagination.page
                                                        ? 'z-10 bg-red-cross-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-cross-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fade-in">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white animate-scale-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <p className="text-sm text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                    <p className="text-sm text-gray-900">{selectedUser.studentId || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                                    <p className="text-sm text-gray-900">{selectedUser.branch?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <p className="text-sm text-gray-900">{selectedUser.department || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                                    <p className="text-sm text-gray-900">{selectedUser.yearOfStudy || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                                    <p className="text-sm text-gray-900">{selectedUser.bloodType}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    {getStatusBadge(selectedUser)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                                    <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                                </div>
                                {selectedUser.approvedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Approved</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedUser.approvedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="btn btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;