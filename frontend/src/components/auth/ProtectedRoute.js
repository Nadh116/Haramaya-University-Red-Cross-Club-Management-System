import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, roles = null }) => {
    const { user, loading, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (roles && !hasRole(roles)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-lock text-red-600 text-2xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <a href="/dashboard" className="btn btn-primary">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // Check if user needs approval for certain roles
    if (['member', 'volunteer'].includes(user.role) && !user.isApproved) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-clock text-yellow-600 text-2xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Pending Approval</h1>
                    <p className="text-gray-600 mb-6">
                        Your account is pending approval from an administrator.
                        You'll receive access once your membership is approved.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <i className="fas fa-info-circle mr-2"></i>
                            This usually takes 1-2 business days. You'll be notified via email once approved.
                        </p>
                    </div>
                    <a href="/" className="btn btn-secondary">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;