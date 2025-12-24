const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function addSampleGalleryImages() {
    try {
        console.log('🔍 Checking existing gallery images...');

        // Find an admin user to use as uploadedBy
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('❌ No admin user found. Please run the seed script first.');
            return;
        }
        console.log(`👤 Using admin user: ${adminUser.firstName} ${adminUser.lastName}`);

        // Check if we already have gallery images
        const existingImages = await Gallery.find();
        console.log(`📊 Found ${existingImages.length} existing images`);

        // Get actual uploaded files
        const uploadsDir = path.join(__dirname, '../uploads/gallery');
        const files = fs.readdirSync(uploadsDir).filter(file =>
            !file.includes('_thumb') && (file.endsWith('.jpg') || file.endsWith('.png'))
        );

        console.log(`📁 Found ${files.length} uploaded files:`, files);

        // Sample gallery data using actual uploaded files
        const sampleImages = [
            {
                title: 'Blood Donation Drive 2024',
                description: 'Annual blood donation campaign at Main Campus - helping save lives through voluntary blood donation',
                category: 'blood-donation',
                imageUrl: files[0] ? `/uploads/gallery/${files[0]}` : '/uploads/gallery/sample-blood-donation.jpg',
                thumbnailUrl: files[0] ? `/uploads/gallery/${files[0].replace('.jpg', '_thumb.jpg').replace('.png', '_thumb.png')}` : '/uploads/gallery/sample-blood-donation_thumb.jpg',
                isPublished: true,
                isFeatured: true,
                tags: ['blood-donation', 'healthcare', 'community-service'],
                seoData: {
                    altText: 'Blood donation drive at Haramaya University Red Cross',
                    caption: 'Volunteers participating in annual blood donation campaign'
                },
                uploadedBy: adminUser._id,
                viewCount: 150,
                likes: []
            },
            {
                title: 'First Aid Training Session',
                description: 'Training volunteers in emergency response and life-saving techniques',
                category: 'training',
                imageUrl: files[1] ? `/uploads/gallery/${files[1]}` : '/uploads/gallery/sample-training.jpg',
                thumbnailUrl: files[1] ? `/uploads/gallery/${files[1].replace('.jpg', '_thumb.jpg').replace('.png', '_thumb.png')}` : '/uploads/gallery/sample-training_thumb.jpg',
                isPublished: true,
                isFeatured: false,
                tags: ['training', 'first-aid', 'emergency-response'],
                seoData: {
                    altText: 'First aid training session for Red Cross volunteers',
                    caption: 'Learning essential emergency response skills'
                },
                uploadedBy: adminUser._id,
                viewCount: 89,
                likes: []
            },
            {
                title: 'Community Outreach Program',
                description: 'Helping local communities in need through various support programs',
                category: 'community',
                imageUrl: files[2] ? `/uploads/gallery/${files[2]}` : '/uploads/gallery/sample-community.jpg',
                thumbnailUrl: files[2] ? `/uploads/gallery/${files[2].replace('.jpg', '_thumb.jpg').replace('.png', '_thumb.png')}` : '/uploads/gallery/sample-community_thumb.jpg',
                isPublished: true,
                isFeatured: true,
                tags: ['community-service', 'outreach', 'humanitarian'],
                seoData: {
                    altText: 'Community outreach program by Haramaya Red Cross',
                    caption: 'Volunteers helping local communities'
                },
                uploadedBy: adminUser._id,
                viewCount: 203,
                likes: []
            },
            {
                title: 'World Red Cross Day Celebration',
                description: 'Celebrating humanitarian values and the spirit of volunteerism',
                category: 'events',
                imageUrl: files[3] ? `/uploads/gallery/${files[3]}` : '/uploads/gallery/sample-event.jpg',
                thumbnailUrl: files[3] ? `/uploads/gallery/${files[3].replace('.jpg', '_thumb.jpg').replace('.png', '_thumb.png')}` : '/uploads/gallery/sample-event_thumb.jpg',
                isPublished: true,
                isFeatured: true,
                tags: ['world-red-cross-day', 'celebration', 'humanitarian'],
                seoData: {
                    altText: 'World Red Cross Day celebration at Haramaya University',
                    caption: 'Celebrating humanitarian values and volunteerism'
                },
                uploadedBy: adminUser._id,
                viewCount: 312,
                likes: []
            }
        ];

        // Clear existing gallery data and add new sample data
        console.log('🗑️ Clearing existing gallery data...');
        await Gallery.deleteMany({});

        console.log('📸 Adding sample gallery images...');
        const createdImages = await Gallery.insertMany(sampleImages);

        console.log(`✅ Successfully added ${createdImages.length} sample gallery images!`);

        // Display the created images
        createdImages.forEach((image, index) => {
            console.log(`${index + 1}. ${image.title}`);
            console.log(`   📁 Image: ${image.imageUrl}`);
            console.log(`   🏷️ Category: ${image.category}`);
            console.log(`   👀 Views: ${image.viewCount}, ❤️ Likes: ${image.likeCount}`);
            console.log('');
        });

        console.log('🎉 Gallery setup complete!');
        console.log('📋 Summary:');
        console.log(`   • Total images: ${createdImages.length}`);
        console.log(`   • Published images: ${createdImages.filter(img => img.isPublished).length}`);
        console.log(`   • Featured images: ${createdImages.filter(img => img.isFeatured).length}`);
        console.log(`   • Categories: ${[...new Set(createdImages.map(img => img.category))].join(', ')}`);

    } catch (error) {
        console.error('❌ Error adding sample gallery images:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the script
addSampleGalleryImages();