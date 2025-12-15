import React from 'react';

const Announcements = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Announcements</h1>
                    <p className="text-xl text-gray-600">
                        Stay updated with the latest news and announcements
                    </p>
                </div>

                <div className="card text-center py-12">
                    <i className="fas fa-bullhorn text-gray-400 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Announcements Page</h2>
                    <p className="text-gray-600 mb-6">
                        This page will display all announcements with filtering and interaction features.
                    </p>
                    <div className="text-sm text-gray-500">
                        Features to be implemented:
                        <ul className="mt-2 space-y-1">
                            <li>• Announcement listing with pagination</li>
                            <li>• Filter by type and priority</li>
                            <li>• Like and comment functionality</li>
                            <li>• Pinned announcements</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Announcements;