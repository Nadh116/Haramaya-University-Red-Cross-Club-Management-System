import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card text-center py-12">
                    <i className="fas fa-calendar-day text-gray-400 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Event Detail Page</h2>
                    <p className="text-gray-600 mb-4">
                        Event ID: {id}
                    </p>
                    <p className="text-gray-600 mb-6">
                        This page will display detailed information about a specific event.
                    </p>
                    <div className="text-sm text-gray-500">
                        Features to be implemented:
                        <ul className="mt-2 space-y-1">
                            <li>• Complete event information</li>
                            <li>• Registration form for participants</li>
                            <li>• Event location and requirements</li>
                            <li>• Participant list and feedback</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;