const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/gallery');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Get all gallery images with filtering and pagination
const getGalleryImages = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            featured,
            published = 'true',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search
        } = req.query;

        const filter = {};

        if (published === 'true') {
            filter.isPublished = true;
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (featured === 'true') {
            filter.isFeatured = true;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [images, totalCount] = await Promise.all([
            Gallery.find(filter)
                .populate('uploadedBy', 'firstName lastName')
                .populate('branch', 'name')
                .populate('eventId', 'title')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Gallery.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.json({
            success: true,
            data: {
                images,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalCount,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery images',
            error: error.message
        });
    }
};

// Get single gallery image
const getGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Gallery.findById(id)
            .populate('uploadedBy', 'firstName lastName email')
            .populate('branch', 'name location')
            .populate('eventId', 'title startDate')
            .populate('likes.user', 'firstName lastName');

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        // Increment view count
        await image.incrementViewCount();

        res.json({
            success: true,
            data: { image }
        });
    } catch (error) {
        console.error('Error fetching gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery image',
            error: error.message
        });
    }
};

// Upload new gallery image
const uploadGalleryImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        const {
            title,
            description,
            category,
            tags,
            eventId,
            branch,
            altText,
            caption
        } = req.body;

        // Process image and create thumbnail
        const imagePath = req.file.path;
        const thumbnailPath = imagePath.replace(/(\.[^.]+)$/, '_thumb$1');

        // Get image metadata
        const metadata = await sharp(imagePath).metadata();

        // Create thumbnail
        await sharp(imagePath)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);

        // Create gallery entry
        const galleryImage = new Gallery({
            title,
            description,
            imageUrl: `/uploads/gallery/${req.file.filename}`,
            thumbnailUrl: `/uploads/gallery/${req.file.filename.replace(/(\.[^.]+)$/, '_thumb$1')}`,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            eventId: eventId || undefined,
            branch: branch || undefined,
            uploadedBy: req.user.id,
            isPublished: true, // Auto-publish uploaded images
            metadata: {
                fileSize: req.file.size,
                dimensions: {
                    width: metadata.width,
                    height: metadata.height
                },
                format: metadata.format
            },
            seoData: {
                altText: altText || title,
                caption: caption || description
            }
        });

        await galleryImage.save();

        const populatedImage = await Gallery.findById(galleryImage._id)
            .populate('uploadedBy', 'firstName lastName')
            .populate('branch', 'name')
            .populate('eventId', 'title');

        res.status(201).json({
            success: true,
            message: 'Gallery image uploaded successfully',
            data: { image: populatedImage }
        });
    } catch (error) {
        console.error('Error uploading gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading gallery image',
            error: error.message
        });
    }
};

// Update gallery image
const updateGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Process tags if provided
        if (updates.tags && typeof updates.tags === 'string') {
            updates.tags = updates.tags.split(',').map(tag => tag.trim());
        }

        const image = await Gallery.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )
            .populate('uploadedBy', 'firstName lastName')
            .populate('branch', 'name')
            .populate('eventId', 'title');

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery image updated successfully',
            data: { image }
        });
    } catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating gallery image',
            error: error.message
        });
    }
};

// Delete gallery image
const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        // Delete image files
        try {
            const imagePath = path.join(__dirname, '../uploads/gallery', path.basename(image.imageUrl));
            const thumbnailPath = path.join(__dirname, '../uploads/gallery', path.basename(image.thumbnailUrl));

            await Promise.all([
                fs.unlink(imagePath).catch(() => { }),
                fs.unlink(thumbnailPath).catch(() => { })
            ]);
        } catch (fileError) {
            console.error('Error deleting image files:', fileError);
        }

        await Gallery.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Gallery image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting gallery image',
            error: error.message
        });
    }
};

// Toggle like on gallery image
const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        await image.toggleLike(userId);

        res.json({
            success: true,
            message: 'Like toggled successfully',
            data: {
                likeCount: image.likeCount,
                isLiked: image.likes.some(like => like.user.toString() === userId)
            }
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling like',
            error: error.message
        });
    }
};

// Get gallery statistics
const getGalleryStatistics = async (req, res) => {
    try {
        const statistics = await Gallery.getStatistics();

        res.json({
            success: true,
            data: { statistics }
        });
    } catch (error) {
        console.error('Error fetching gallery statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery statistics',
            error: error.message
        });
    }
};

// Get featured images
const getFeaturedImages = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const featuredImages = await Gallery.find({
            isPublished: true,
            isFeatured: true
        })
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            data: { images: featuredImages }
        });
    } catch (error) {
        console.error('Error fetching featured images:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured images',
            error: error.message
        });
    }
};

module.exports = {
    getGalleryImages,
    getGalleryImage,
    uploadGalleryImage: [upload.single('image'), uploadGalleryImage],
    updateGalleryImage,
    deleteGalleryImage,
    toggleLike,
    getGalleryStatistics,
    getFeaturedImages
};