import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { branchAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RedCrossSymbol from '../../components/common/RedCrossSymbol';

const Profile = () => {
    const { user, updateUser, updatePassword, loading } = useAuth();
    const [branches, setBranches] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Profile form data
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        yearOfStudy: '',
        bloodType: '',
        studentId: ''
    });

    // Password form data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                yearOfStudy: user.yearOfStudy || '',
                bloodType: user.bloodType || '',
                studentId: user.studentId || ''
            });
        }
        fetchBranches();
    }, [user]);

    const fetchBranches = async () => {
        try {
            const response = await branchAPI.getBranches();
            setBranches(response.data.branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await updateUser(profileData);
            if (result.success) {
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Failed to update profile');
            }
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        try {
            const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
            if (result.success) {
                setSuccess('Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Failed to update password');
            }
        } catch (error) {
            setError('Failed to update password');
        }
    };

    const bloodTypes = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading profile..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-cross-500 to-red-cross-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-3xl">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                    <p className="text-gray-600 capitalize">{user.role} • {user.branch?.name}</p>
                    <div className="flex justify-center mt-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'officer' ? 'bg-blue-100 text-blue-800' :
                                    user.role === 'member' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                            }`}>
                            {user.role?.toUpperCase()}
                        </span>
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

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                        ? 'border-red-cross-500 text-red-cross-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className="fas fa-user mr-2"></i>
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'password'
                                        ? 'border-red-cross-500 text-red-cross-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className="fas fa-lock mr-2"></i>
                                Change Password
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'activity'
                                        ? 'border-red-cross-500 text-red-cross-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className="fas fa-history mr-2"></i>
                                Activity History
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                    <div className="card animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="btn btn-outline"
                            >
                                <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div>
                                    <label className="label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                {/* Academic Information */}
                                <div>
                                    <label className="label">Student ID</label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={profileData.studentId}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="label">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={profileData.department}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="label">Year of Study</label>
                                    <select
                                        name="yearOfStudy"
                                        value={profileData.yearOfStudy}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    >
                                        <option value="">Select year</option>
                                        {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                                            <option key={year} value={year}>
                                                Year {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Blood Type</label>
                                    <select
                                        name="bloodType"
                                        value={profileData.bloodType}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="input"
                                    >
                                        {bloodTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type === 'Unknown' ? 'Unknown / Not Sure' : type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary"
                                    >
                                        {loading ? (
                                            <>
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save mr-2"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                    <div className="card animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

                        <form onSubmit={handlePasswordSubmit} className="max-w-md">
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="input"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="label">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="input"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="input"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary"
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-key mr-2"></i>
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Activity History Tab */}
                {activeTab === 'activity' && (
                    <div className="card animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity History</h2>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                <i className="fas fa-sign-in-alt text-green-500 mt-1"></i>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Account Created</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {user.lastLogin && (
                                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <i className="fas fa-clock text-blue-500 mt-1"></i>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Last Login</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(user.lastLogin).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {user.approvedAt && (
                                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Account Approved</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(user.approvedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center py-8 text-gray-500">
                                <i className="fas fa-history text-4xl mb-3"></i>
                                <p>More activity history features coming soon...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;