import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { branchAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RedCrossSymbol from '../../components/common/RedCrossSymbol';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        branch: '',
        studentId: '',
        department: '',
        yearOfStudy: '',
        bloodType: 'Unknown'
    });
    const [branches, setBranches] = useState([]);
    const [branchesLoading, setBranchesLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const { register, loading, error, clearError, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Fetch branches
    useEffect(() => {
        fetchBranches();
        clearError();
    }, [clearError]);

    const fetchBranches = async () => {
        try {
            setBranchesLoading(true);
            console.log('🏢 Fetching branches...');
            const response = await branchAPI.getBranches();
            console.log('✅ Branches fetched:', response.data);
            setBranches(response.data.branches || []);

            if (!response.data.branches || response.data.branches.length === 0) {
                console.warn('⚠️ No branches found in response');
            }
        } catch (error) {
            console.error('❌ Error fetching branches:', error);
            console.error('❌ Error details:', error.response?.data);
            // Set empty array as fallback
            setBranches([]);
        } finally {
            setBranchesLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear specific field error
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }

        // Clear global error
        if (error) {
            clearError();
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.branch) newErrors.branch = 'Please select a branch';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Enhanced password validation
        if (formData.password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
            }
        }

        // Password confirmation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Phone validation
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Year of study validation
        if (formData.yearOfStudy && (formData.yearOfStudy < 1 || formData.yearOfStudy > 7)) {
            newErrors.yearOfStudy = 'Year of study must be between 1 and 7';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { confirmPassword, ...submitData } = formData;

        const result = await register(submitData);

        if (result.success) {
            navigate('/dashboard', { replace: true });
        }
    };

    const bloodTypes = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center animate-scale-in">
                        <RedCrossSymbol size="xl" animate={true} variant="circle" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Join Haramaya Red Cross
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-red-cross-600 hover:text-red-cross-500"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex">
                                    <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
                                    <div className="text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        )}

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="label">
                                        First Name *
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        className={`input ${errors.firstName ? 'border-red-300' : ''}`}
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="label">
                                        Last Name *
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        className={`input ${errors.lastName ? 'border-red-300' : ''}`}
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className={`input ${errors.email ? 'border-red-300' : ''}`}
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="label">
                                        Phone Number *
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        className={`input ${errors.phone ? 'border-red-300' : ''}`}
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="branch" className="label">
                                        Campus Branch *
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="branch"
                                            name="branch"
                                            required
                                            disabled={branchesLoading}
                                            className={`input appearance-none bg-white pr-10 ${errors.branch ? 'border-red-300' : ''} ${branchesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            value={formData.branch}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                {branchesLoading ? 'Loading branches...' : 'Select your campus'}
                                            </option>
                                            {branches.map((branch) => (
                                                <option key={branch._id} value={branch._id}>
                                                    {branch.name} - {branch.location}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            {branchesLoading ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <i className="fas fa-chevron-down text-gray-400"></i>
                                            )}
                                        </div>
                                    </div>
                                    {errors.branch && (
                                        <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
                                    )}
                                    {branches.length === 0 && !branchesLoading && (
                                        <p className="mt-1 text-sm text-yellow-600">
                                            <i className="fas fa-exclamation-triangle mr-1"></i>
                                            No branches available. Please contact administrator.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="studentId" className="label">
                                        Student ID
                                    </label>
                                    <input
                                        id="studentId"
                                        name="studentId"
                                        type="text"
                                        className="input"
                                        placeholder="Enter your student ID"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="department" className="label">
                                        Department
                                    </label>
                                    <input
                                        id="department"
                                        name="department"
                                        type="text"
                                        className="input"
                                        placeholder="Enter your department"
                                        value={formData.department}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="yearOfStudy" className="label">
                                        Year of Study
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="yearOfStudy"
                                            name="yearOfStudy"
                                            className={`input appearance-none bg-white pr-10 ${errors.yearOfStudy ? 'border-red-300' : ''}`}
                                            value={formData.yearOfStudy}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select year</option>
                                            {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                                                <option key={year} value={year}>
                                                    Year {year}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <i className="fas fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                    {errors.yearOfStudy && (
                                        <p className="mt-1 text-sm text-red-600">{errors.yearOfStudy}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                            <div>
                                <label htmlFor="bloodType" className="label">
                                    Blood Type
                                </label>
                                <div className="relative">
                                    <select
                                        id="bloodType"
                                        name="bloodType"
                                        className="input appearance-none bg-white pr-10"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                    >
                                        {bloodTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type === 'Unknown' ? 'Unknown / Not Sure' : type}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <i className="fas fa-chevron-down text-gray-400"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="label">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            className={`input pr-10 ${errors.password ? 'border-red-300' : ''}`}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="label">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            className={`input pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-red-cross-600 focus:ring-red-cross-500 border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <a href="#" className="text-red-cross-600 hover:text-red-cross-500">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-red-cross-600 hover:text-red-cross-500">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full flex justify-center py-3"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus mr-2"></i>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        By registering, you'll be able to participate in events, volunteer activities,
                        and stay updated with Red Cross initiatives at Haramaya University.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;