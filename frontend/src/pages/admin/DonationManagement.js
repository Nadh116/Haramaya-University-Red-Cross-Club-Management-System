import React, { useState, useEffect } from 'react';
import { donationAPI, branchAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [stats, setStats] = useState(null);

    // Filters and pagination
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        branch: '',
        startDate: '',
        endDate: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    // Create donation form
    const [newDonation, setNewDonation] = useState({
        donor: '',
        type: 'blood',
        bloodType: '',
        bloodUnits: 1,
        amount: '',
        currency: 'ETB',
        items: [],
        description: '',
        donationDate: new Date().toISOString().split('T')[0],
        location: '',
        branch: '',
        medicalInfo: {
            hemoglobin: '',
            bloodPressure: { systolic: '', diastolic: '' },
            weight: '',
            temperature: '',
            medicallyEligible: true,
            notes: ''
        }
    });

    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchDonations();
        fetchBranches();
        fetchStats();
    }, [filters, pagination.page]);

    const fetchDonations = async () => {
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

            const response = await donationAPI.getDonations(params);
            setDonations(response.data.donations);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            setError('Failed to fetch donations');
            console.error('Fetch donations error:', error);
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

    const fetchStats = async () => {
        try {
            const response = await donationAPI.getDonationStats();
            setStats(response.data);
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const handleVerifyDonation = async (donationId) => {
        try {
            await donationAPI.verifyDonation(donationId);
            setSuccess('Donation verified successfully');
            fetchDonations();
            fetchStats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to verify donation');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to delete this donation?')) {
            try {
                await donationAPI.deleteDonation(donationId);
                setSuccess('Donation deleted successfully');
                fetchDonations();
                fetchStats();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete donation');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleCreateDonation = async (e) => {
        e.preventDefault();
        try {
            const donationData = { ...newDonation };

            // Clean up data based on type
            if (donationData.type !== 'blood') {
                delete donationData.bloodType;
                delete donationData.bloodUnits;
                delete donationData.medicalInfo;
            }
            if (donationData.type !== 'money') {
                delete donationData.amount;
                delete donationData.currency;
            }
            if (donationData.type !== 'supplies') {
                delete donationData.items;
            }

            await donationAPI.createDonation(donationData);
            setSuccess('Donation recorded successfully');
            setShowCreateModal(false);
            resetForm();
            fetchDonations();
            fetchStats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to create donation');
            setTimeout(() => setError(''), 3000);
        }
    };

    const resetForm = () => {
        setNewDonation({
            donor: '',
            type: 'blood',
            bloodType: '',
            bloodUnits: 1,
            amount: '',
            currency: 'ETB',
            items: [],
            description: '',
            donationDate: new Date().toISOString().split('T')[0],
            location: '',
            branch: '',
            medicalInfo: {
                hemoglobin: '',
                bloodPressure: { systolic: '', diastolic: '' },
                weight: '',
                temperature: '',
                medicallyEligible: true,
                notes: ''
            }
        });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const getTypeBadgeColor = (type) => {
        const colors = {
            blood: 'bg-red-100 text-red-800',
            money: 'bg-green-100 text-green-800',
            supplies: 'bg-blue-100 text-blue-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>,
            verified: <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Verified</span>,
            processed: <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Processed</span>,
            rejected: <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejected</span>
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency = 'ETB') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'ETB' ? 'USD' : currency,
            minimumFractionDigits: 0
        }).format(amount).replace('$', currency === 'ETB' ? 'ETB ' : '$');
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    if (loading && donations.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading donations..." />
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
                            <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
                            <p className="text-gray-600">Track and manage all donations</p>
                        </div>
                        {['admin', 'officer'].includes(currentUser?.role) && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Record Donation
                            </button>
                        )}
                    </div>
                </div>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.typeStats.map((stat, index) => (
                            <div key={stat._id} className={`card animate-slide-up animate-stagger-${index}`}>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat._id === 'blood' ? 'bg-red-100' :
                                                stat._id === 'money' ? 'bg-green-100' :
                                                    stat._id === 'supplies' ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            <i className={`text-xl ${stat._id === 'blood' ? 'fas fa-tint text-red-600' :
                                                    stat._id === 'money' ? 'fas fa-dollar-sign text-green-600' :
                                                        stat._id === 'supplies' ? 'fas fa-box text-blue-600' :
                                                            'fas fa-gift text-gray-600'
                                                }`}></i>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 capitalize">{stat._id} Donations</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                                        <p className="text-xs text-gray-500">{stat.verified} verified</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="input"
                            >
                                <option value="">All Types</option>
                                <option value="blood">Blood</option>
                                <option value="money">Money</option>
                                <option value="supplies">Supplies</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="input"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="processed">Processed</option>
                                <option value="rejected">Rejected</option>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {/* Donations Table */}
                <div className="card animate-slide-up animate-stagger-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Donations ({pagination.total})
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
                                        Donor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {donations.map((donation) => (
                                    <tr key={donation._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-cross-100 rounded-full flex items-center justify-center">
                                                    <span className="text-red-cross-600 font-medium text-sm">
                                                        {donation.donor?.firstName?.charAt(0)}{donation.donor?.lastName?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {donation.isAnonymous ? 'Anonymous' :
                                                            `${donation.donor?.firstName} ${donation.donor?.lastName}`}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {donation.donor?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(donation.type)}`}>
                                                {donation.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {donation.type === 'blood' && (
                                                <div>
                                                    <div>{donation.bloodUnits} units</div>
                                                    <div className="text-xs text-gray-500">{donation.bloodType}</div>
                                                </div>
                                            )}
                                            {donation.type === 'money' && (
                                                <div>{formatCurrency(donation.amount, donation.currency)}</div>
                                            )}
                                            {donation.type === 'supplies' && (
                                                <div>{donation.items?.length || 0} items</div>
                                            )}
                                            {donation.type === 'other' && (
                                                <div className="text-xs text-gray-500">Other donation</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(donation.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(donation.donationDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDonation(donation);
                                                        setShowDonationModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Details"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>

                                                {donation.status === 'pending' && ['admin', 'officer'].includes(currentUser?.role) && (
                                                    <button
                                                        onClick={() => handleVerifyDonation(donation._id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Verify Donation"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                )}

                                                {currentUser?.role === 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteDonation(donation._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Donation"
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

                    {donations.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <i className="fas fa-hand-holding-heart text-gray-400 text-4xl mb-4"></i>
                            <p className="text-gray-500">No donations found</p>
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

            {/* Donation Details Modal */}
            {showDonationModal && selectedDonation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fade-in">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white animate-scale-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Donation Details</h3>
                            <button
                                onClick={() => setShowDonationModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Donor</label>
                                    <p className="text-sm text-gray-900">
                                        {selectedDonation.isAnonymous ? 'Anonymous' :
                                            `${selectedDonation.donor?.firstName} ${selectedDonation.donor?.lastName}`}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(selectedDonation.type)}`}>
                                        {selectedDonation.type}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    {getStatusBadge(selectedDonation.status)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <p className="text-sm text-gray-900">{formatDate(selectedDonation.donationDate)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <p className="text-sm text-gray-900">{selectedDonation.location}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                                    <p className="text-sm text-gray-900">{selectedDonation.branch?.name}</p>
                                </div>

                                {selectedDonation.type === 'blood' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                                            <p className="text-sm text-gray-900">{selectedDonation.bloodType}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Units</label>
                                            <p className="text-sm text-gray-900">{selectedDonation.bloodUnits}</p>
                                        </div>
                                    </>
                                )}

                                {selectedDonation.type === 'money' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                                            <p className="text-sm text-gray-900">
                                                {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {selectedDonation.receiptNumber && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
                                        <p className="text-sm text-gray-900">{selectedDonation.receiptNumber}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recorded By</label>
                                    <p className="text-sm text-gray-900">
                                        {selectedDonation.recordedBy?.firstName} {selectedDonation.recordedBy?.lastName}
                                    </p>
                                </div>

                                {selectedDonation.verifiedBy && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Verified By</label>
                                        <p className="text-sm text-gray-900">
                                            {selectedDonation.verifiedBy?.firstName} {selectedDonation.verifiedBy?.lastName}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedDonation.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <p className="text-sm text-gray-900">{selectedDonation.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowDonationModal(false)}
                                className="btn btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Donation Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fade-in">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white animate-scale-in max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Record New Donation</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleCreateDonation} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
                                    <select
                                        value={newDonation.type}
                                        onChange={(e) => setNewDonation(prev => ({ ...prev, type: e.target.value }))}
                                        className="input"
                                        required
                                    >
                                        <option value="blood">Blood Donation</option>
                                        <option value="money">Money Donation</option>
                                        <option value="supplies">Supply Donation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                                    <select
                                        value={newDonation.branch}
                                        onChange={(e) => setNewDonation(prev => ({ ...prev, branch: e.target.value }))}
                                        className="input"
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(branch => (
                                            <option key={branch._id} value={branch._id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {newDonation.type === 'blood' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                                            <select
                                                value={newDonation.bloodType}
                                                onChange={(e) => setNewDonation(prev => ({ ...prev, bloodType: e.target.value }))}
                                                className="input"
                                                required
                                            >
                                                <option value="">Select Blood Type</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Units</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newDonation.bloodUnits}
                                                onChange={(e) => setNewDonation(prev => ({ ...prev, bloodUnits: parseInt(e.target.value) }))}
                                                className="input"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {newDonation.type === 'money' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={newDonation.amount}
                                                onChange={(e) => setNewDonation(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                                                className="input"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                            <select
                                                value={newDonation.currency}
                                                onChange={(e) => setNewDonation(prev => ({ ...prev, currency: e.target.value }))}
                                                className="input"
                                            >
                                                <option value="ETB">ETB</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Donation Date</label>
                                    <input
                                        type="date"
                                        value={newDonation.donationDate}
                                        onChange={(e) => setNewDonation(prev => ({ ...prev, donationDate: e.target.value }))}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={newDonation.location}
                                        onChange={(e) => setNewDonation(prev => ({ ...prev, location: e.target.value }))}
                                        className="input"
                                        placeholder="Donation location"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newDonation.description}
                                    onChange={(e) => setNewDonation(prev => ({ ...prev, description: e.target.value }))}
                                    className="input"
                                    rows="3"
                                    placeholder="Additional notes about the donation"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Record Donation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationManagement;