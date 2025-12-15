import React from 'react';

const UserManagement = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card text-center py-12">
                    <i className="fas fa-users-cog text-gray-400 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">User Management</h2>
                    <p className="text-gray-600 mb-6">
                        This page will provide comprehensive user management capabilities.
                    </p>
                    <div className="text-sm text-gray-500">
                        Features to be implemented:
                        <ul className="mt-2 space-y-1">
                            <li>• User listing with search and filters</li>
                            <li>• User approval and rejection</li>
                            <li>• Role management</li>
                            <li>• User activity tracking</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;