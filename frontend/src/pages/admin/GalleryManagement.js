import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        published: 'all',
        search: ''
    });
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        category: 'events',
        tags: '',
        altText: '',
        caption: ''
    });

    const { user } = useAuth();

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'blood-donation', name: 'Blood Donation' },
        { id: 'training', name: 'Training' },
        { id: 'community', name: 'Community Service' },
        { id: 'events', name: 'Events' },
        { id: 'emergency', name: 'Emergency Response' }
    ];

    useEffect(() => {
        fetchImages();
    }, [filters]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const params = {
                limit: 12,
                published: filters.published === 'all' ? undefined : filters.published === 'true',
                category: filters.category === 'all' ? undefined : filters.category,
                search: filters.search || undefined
            };

            const response = await galleryAPI.getImages(params);
            setImages(response.data.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedImage) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('category', uploadForm.category);
            formData.append('tags', uploadForm.tags);
            formData.append('altText', uploadForm.altText);
            formData.append('caption', uploadForm.caption);

            await galleryAPI.uploadImage(formData);

            setShowUploadModal(false);
            setSelectedImage(null);
            setUploadForm({
                title: '',
                description: '',
                category: 'events',
                tags: '',
                altText: '',
                caption: ''
            });
            fetchImages();
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await galleryAPI.deleteImage(imageId);
            fetchImages();
            alert('Image deleted successfully!');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image. Please try again.');
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setSelectedImage(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                            <p className="text-gray-600 mt-2">Upload and manage gallery images</p>
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-red-cross-600 text-white px-6 py-3 rounded-lg hover:bg-red-cross-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Upload Image</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.published}
                                onChange={(e) => setFilters({ ...filters, published: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="true">Published</option>
                                <option value="false">Draft</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                placeholder="Search by title, description, or tags..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Images Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading images..." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {images.map((image) => (
                            <div key={image._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* Image */}
                                <div className="aspect-square bg-gradient-to-br from-red-cross-100 to-red-cross-200 flex items-center justify-center overflow-hidden">
                                    {image.imageUrl ? (
                                        <img
                                            src={image.thumbnailUrl || image.imageUrl}
                                            alt={image.seoData?.altText || image.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to placeholder if image fails to load
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full bg-gradient-to-br from-red-cross-100 to-red-cross-200 flex items-center justify-center ${image.imageUrl ? 'hidden' : ''}`}>
                                        <div className="text-center text-red-cross-600">
                                            <i className="fas fa-image text-3xl mb-2"></i>
                                            <p className="text-sm font-medium">{image.title}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-2 py-1 bg-red-cross-100 text-red-cross-600 text-xs rounded-full">
                                            {categories.find(cat => cat.id === image.category)?.name}
                                        </span>
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <span><i className="fas fa-eye"></i> {image.viewCount || 0}</span>
                                            <span><i className="fas fa-heart"></i> {image.likeCount || 0}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 text-xs rounded-full ${image.isPublished
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {image.isPublished ? 'Published' : 'Draft'}
                                        </span>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDelete(image._id)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Upload New Image</h2>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                <form onSubmit={handleUpload} className="space-y-6">
                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Image *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Max file size: 10MB</p>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={uploadForm.title}
                                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            value={uploadForm.description}
                                            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            value={uploadForm.category}
                                            onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                            required
                                        >
                                            {categories.slice(1).map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tags
                                        </label>
                                        <input
                                            type="text"
                                            value={uploadForm.tags}
                                            onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                                            placeholder="Separate tags with commas"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowUploadModal(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploading || !selectedImage}
                                            className="px-6 py-2 bg-red-cross-600 text-white rounded-lg hover:bg-red-cross-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? (
                                                <span className="flex items-center">
                                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                                    Uploading...
                                                </span>
                                            ) : (
                                                'Upload Image'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryManagement;