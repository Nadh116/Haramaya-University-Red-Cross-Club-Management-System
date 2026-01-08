import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RedCrossSymbol from '../../components/common/RedCrossSymbol';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login, loading, error, clearError, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Load saved credentials from localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');

        if (savedEmail && savedPassword) {
            setFormData({
                email: savedEmail,
                password: savedPassword
            });
            setRememberMe(true);
        }
    }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    // Clear error when component mounts
    useEffect(() => {
        clearError();
    }, []); // Remove clearError from dependencies

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔍 Login form submitted');
        console.log('📧 Email:', formData.email);
        console.log('🔒 Password length:', formData.password.length);

        // Save credentials to localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
            localStorage.setItem('rememberedPassword', formData.password);
            console.log('💾 Credentials saved to localStorage');
        } else {
            // Clear saved credentials if remember me is unchecked
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            console.log('🗑️ Credentials cleared from localStorage');
        }

        console.log('🚀 Calling login function...');
        const result = await login(formData.email, formData.password);
        console.log('📋 Login result:', result);

        if (result.success) {
            console.log('✅ Login successful, navigating...');
            const from = location.state?.from?.pathname || '/dashboard';
            console.log('🧭 Navigating to:', from);
            navigate(from, { replace: true });
        } else {
            console.log('❌ Login failed:', result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center animate-scale-in">
                        <RedCrossSymbol size="xl" animate={true} variant="circle" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/register"
                            className="font-medium text-red-cross-600 hover:text-red-cross-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="label">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <i className="fas fa-envelope text-gray-400"></i>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="input pr-10"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-red-cross-600 focus:ring-red-cross-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <button
                                type="button"
                                className="font-medium text-red-cross-600 hover:text-red-cross-500"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex justify-center py-3"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Sign in
                                </>
                            )}
                        </button>
                    </div>

                    {/* Temporary Test Login Button */}
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={async () => {
                                console.log('🧪 Testing direct login...');
                                try {
                                    const response = await fetch('/api/auth/login', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            email: 'admin@haramaya.edu.et',
                                            password: 'admin123'
                                        })
                                    });
                                    const data = await response.json();
                                    console.log('📋 Response:', data);

                                    if (data.success && data.token) {
                                        localStorage.setItem('token', data.token);
                                        console.log('✅ Token stored, reloading...');
                                        window.location.href = '/admin';
                                    } else {
                                        alert('Login failed: ' + (data.message || 'Unknown error'));
                                    }
                                } catch (error) {
                                    console.error('❌ Error:', error);
                                    alert('Network error: ' + error.message);
                                }
                            }}
                            className="btn btn-secondary w-full flex justify-center py-2 text-sm"
                        >
                            🧪 Test Direct Login (Admin)
                        </button>
                    </div>
                </form>

                {/* Additional Links */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        New to Haramaya Red Cross?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-red-cross-600 hover:text-red-cross-500"
                        >
                            Join our community
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;