import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGalleryImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);

    const fetchGalleryImages = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching gallery images...');
            const params = {
                category: activeCategory === 'all' ? undefined : activeCategory,
                published: true,
                limit: 20
            };
            console.log('📋 API params:', params);

            const response = await galleryAPI.getImages(params);
            console.log('✅ API response:', response.data);

            if (response.data && response.data.data && response.data.data.images) {
                setGalleryImages(response.data.data.images);
                console.log('📸 Images loaded:', response.data.data.images.length);
                console.log('🔍 Sample image URLs:', response.data.data.images.slice(0, 2).map(img => ({
                    title: img.title,
                    imageUrl: img.imageUrl,
                    fullUrl: img.imageUrl
                })));
            } else {
                console.log('⚠️ No images in response, using fallback');
                setGalleryImages(getSampleImages());
            }
            setError(null);
        } catch (error) {
            console.error('❌ Error fetching gallery images:', error);
            console.error('❌ Error details:', error.response?.data);
            setError('Failed to load gallery images');
            // Fallback to sample data for demo
            setGalleryImages(getSampleImages());
        } finally {
            setLoading(false);
        }
    };

    // Sample gallery data as fallback
    const getSampleImages = () => [
        {
            _id: '1',
            title: 'Blood Donation Drive 2024',
            description: 'Annual blood donation campaign at Main Campus',
            category: 'blood-donation',
            imageUrl: '/images/gallery/blood-donation-1.jpg',
            thumbnailUrl: '/images/gallery/blood-donation-1.jpg',
            viewCount: 150,
            likeCount: 25
        },
        {
            _id: '2',
            title: 'First Aid Training Session',
            description: 'Training volunteers in emergency response',
            category: 'training',
            imageUrl: '/images/gallery/training-1.jpg',
            thumbnailUrl: '/images/gallery/training-1.jpg',
            viewCount: 89,
            likeCount: 12
        },
        {
            _id: '3',
            title: 'Community Outreach Program',
            description: 'Helping local communities in need',
            category: 'community',
            imageUrl: '/images/gallery/community-1.jpg',
            thumbnailUrl: '/images/gallery/community-1.jpg',
            viewCount: 203,
            likeCount: 45
        },
        {
            _id: '4',
            title: 'World Red Cross Day Celebration',
            description: 'Celebrating humanitarian values',
            category: 'events',
            imageUrl: '/images/gallery/event-1.jpg',
            thumbnailUrl: '/images/gallery/event-1.jpg',
            viewCount: 312,
            likeCount: 67
        },
        {
            _id: '5',
            title: 'Mobile Blood Collection',
            description: 'Reaching remote areas for blood collection',
            category: 'blood-donation',
            imageUrl: '/images/gallery/blood-donation-2.jpg',
            thumbnailUrl: '/images/gallery/blood-donation-2.jpg',
            viewCount: 178,
            likeCount: 34
        },
        {
            _id: '6',
            title: 'CPR Certification Program',
            description: 'Life-saving skills training for students',
            category: 'training',
            imageUrl: '/images/gallery/training-2.jpg',
            thumbnailUrl: '/images/gallery/training-2.jpg',
            viewCount: 95,
            likeCount: 18
        }
    ];

    const categories = [
        { id: 'all', name: 'All', icon: 'fas fa-th' },
        { id: 'blood-donation', name: 'Blood Donation', icon: 'fas fa-tint' },
        { id: 'training', name: 'Training', icon: 'fas fa-graduation-cap' },
        { id: 'community', name: 'Community Service', icon: 'fas fa-hands-helping' },
        { id: 'events', name: 'Events', icon: 'fas fa-calendar-alt' }
    ];

    const filteredImages = activeCategory === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === activeCategory);

    const openModal = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    const navigateImage = (direction) => {
        const currentIndex = filteredImages.findIndex(img => img._id === selectedImage._id);
        let newIndex;

        if (direction === 'next') {
            newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
        } else {
            newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
        }

        setSelectedImage(filteredImages[newIndex]);
    };

    return (
        <section className="py-16 bg-white w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Gallery
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore moments from our humanitarian activities, training sessions,
                        and community service initiatives across all campuses.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeCategory === category.id
                                ? 'bg-red-cross-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <i className={category.icon}></i>
                            <span className="hidden sm:inline">{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image._id}
                            className="group relative overflow-hidden rounded-lg bg-gray-200 aspect-square cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => openModal(image)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Real image or placeholder */}
                            {image.imageUrl ? (
                                <img
                                    src={image.imageUrl}
                                    alt={image.seoData?.altText || image.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('❌ Image failed to load:', image.imageUrl);
                                        // Fallback to placeholder if image fails to load
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                    onLoad={(e) => {
                                        console.log('✅ Image loaded successfully:', image.title);
                                    }}
                                />
                            ) : null}

                            {/* Placeholder fallback */}
                            <div className={`w-full h-full bg-gradient-to-br from-red-cross-100 to-red-cross-200 flex items-center justify-center ${image.imageUrl ? 'hidden' : ''}`}>
                                <div className="text-center text-red-cross-600">
                                    <i className="fas fa-image text-4xl mb-2"></i>
                                    <p className="text-sm font-medium">{image.title}</p>
                                </div>
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                                    <p className="text-xs opacity-90">{image.description}</p>
                                </div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-red-cross-600 text-white text-xs rounded-full">
                                    {categories.find(cat => cat.id === image.category)?.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-images text-gray-400 text-5xl mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <i className="fas fa-times text-2xl"></i>
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => navigateImage('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <i className="fas fa-chevron-left text-3xl"></i>
                        </button>
                        <button
                            onClick={() => navigateImage('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <i className="fas fa-chevron-right text-3xl"></i>
                        </button>

                        {/* Image Container */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                            {/* Real image or placeholder */}
                            {selectedImage.imageUrl ? (
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.seoData?.altText || selectedImage.title}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => {
                                        console.error('❌ Modal image failed to load:', selectedImage.imageUrl);
                                        // Fallback to placeholder if image fails to load
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                    onLoad={(e) => {
                                        console.log('✅ Modal image loaded successfully:', selectedImage.title);
                                    }}
                                />
                            ) : null}

                            {/* Placeholder fallback */}
                            <div className={`w-full h-96 bg-gradient-to-br from-red-cross-100 to-red-cross-200 flex items-center justify-center ${selectedImage.imageUrl ? 'hidden' : ''}`}>
                                <div className="text-center text-red-cross-600">
                                    <i className="fas fa-image text-6xl mb-4"></i>
                                    <p className="text-xl font-medium">{selectedImage.title}</p>
                                </div>
                            </div>

                            {/* Image Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {selectedImage.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 bg-red-cross-100 text-red-cross-600 text-sm rounded-full">
                                        {categories.find(cat => cat.id === selectedImage.category)?.name}
                                    </span>
                                    <div className="text-sm text-gray-500">
                                        {filteredImages.findIndex(img => img._id === selectedImage._id) + 1} of {filteredImages.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;