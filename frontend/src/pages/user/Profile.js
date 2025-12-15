import React from 'react';

const Profile = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card text-center py-12">
                    <i className="fas fa-user-circle text-gray-400 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">User Profile Page</h2>
                    <p className="text-gray-600 mb-6">
                        This page will allow users to view and edit their profile information.
                    </p>
                    <div className="text-sm text-gray-500">
                        Features to be implemented:
                        <ul className="mt-2 space-y-1">
                            <li>• Personal information editing</li>
                            <li>• Password change functionality</li>
                            <li>• Profile picture upload</li>
                            <li>• Activity history</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;