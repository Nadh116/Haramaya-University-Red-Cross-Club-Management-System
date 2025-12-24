import React from 'react';
import Gallery from '../../components/common/Gallery';

const GalleryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <i className="fas fa-images text-red-cross-600 mr-3"></i>
                            Our Gallery
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Explore moments from our humanitarian activities, training sessions,
                            blood donation campaigns, and community service initiatives across all campuses.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery Component */}
            <Gallery />
        </div>
    );
};

export default GalleryPage;