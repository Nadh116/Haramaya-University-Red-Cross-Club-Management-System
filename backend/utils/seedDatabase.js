const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Branch = require('../models/Branch');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const Announcement = require('../models/Announcement');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Sample data
const branches = [
    {
        name: 'Main Campus',
        code: 'MAIN',
        location: 'Haramaya University Main Campus, Dire Dawa Road',
        description: 'The main campus of Haramaya University',
        contactPerson: {
            name: 'Dr. Ahmed Hassan',
            email: 'ahmed.hassan@haramaya.edu.et',
            phone: '+251911234567'
        }
    },
    {
        name: 'Technology Campus',
        code: 'TECH',
        location: 'Haramaya University Technology Campus',
        description: 'Technology and Engineering campus',
        contactPerson: {
            name: 'Eng. Fatima Mohammed',
            email: 'fatima.mohammed@haramaya.edu.et',
            phone: '+251911234568'
        }
    },
    {
        name: 'Veterinary Campus',
        code: 'VET',
        location: 'Haramaya University Veterinary Campus',
        description: 'Veterinary Medicine and Animal Sciences campus',
        contactPerson: {
            name: 'Dr. Solomon Tesfaye',
            email: 'solomon.tesfaye@haramaya.edu.et',
            phone: '+251911234569'
        }
    }
];

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Branch.deleteMany({});
        await Event.deleteMany({});
        await Donation.deleteMany({});
        await Announcement.deleteMany({});

        console.log('Cleared existing data...');

        // Create branches
        const createdBranches = await Branch.insertMany(branches);
        console.log('Branches created...');

        // Create admin user
        const adminUser = await User.create({
            firstName: 'System',
            lastName: 'Administrator',
            email: 'admin@haramaya.edu.et',
            password: 'admin123',
            phone: '+251911000000',
            role: 'admin',
            branch: createdBranches[0]._id,
            isActive: true,
            isApproved: true,
            bloodType: 'O+'
        });

        // Create officer users
        const officers = [
            {
                firstName: 'Meron',
                lastName: 'Tadesse',
                email: 'meron.tadesse@haramaya.edu.et',
                password: 'officer123',
                phone: '+251911111111',
                role: 'officer',
                branch: createdBranches[0]._id,
                studentId: 'HU/2020/001',
                department: 'Public Health',
                yearOfStudy: 4,
                bloodType: 'A+',
                isActive: true,
                isApproved: true,
                approvedBy: adminUser._id,
                approvedAt: new Date()
            },
            {
                firstName: 'Daniel',
                lastName: 'Bekele',
                email: 'daniel.bekele@haramaya.edu.et',
                password: 'officer123',
                phone: '+251911111112',
                role: 'officer',
                branch: createdBranches[1]._id,
                studentId: 'HU/2020/002',
                department: 'Computer Science',
                yearOfStudy: 3,
                bloodType: 'B+',
                isActive: true,
                isApproved: true,
                approvedBy: adminUser._id,
                approvedAt: new Date()
            }
        ];

        const createdOfficers = await User.insertMany(officers);
        console.log('Officers created...');

        // Create sample members
        const members = [
            {
                firstName: 'Sara',
                lastName: 'Ahmed',
                email: 'sara.ahmed@student.haramaya.edu.et',
                password: 'member123',
                phone: '+251922222221',
                role: 'member',
                branch: createdBranches[0]._id,
                studentId: 'HU/2021/101',
                department: 'Medicine',
                yearOfStudy: 2,
                bloodType: 'O-',
                isActive: true,
                isApproved: true,
                approvedBy: createdOfficers[0]._id,
                approvedAt: new Date()
            },
            {
                firstName: 'Yohannes',
                lastName: 'Girma',
                email: 'yohannes.girma@student.haramaya.edu.et',
                password: 'member123',
                phone: '+251922222222',
                role: 'member',
                branch: createdBranches[1]._id,
                studentId: 'HU/2021/102',
                department: 'Engineering',
                yearOfStudy: 3,
                bloodType: 'AB+',
                isActive: true,
                isApproved: true,
                approvedBy: createdOfficers[1]._id,
                approvedAt: new Date()
            },
            {
                firstName: 'Hanan',
                lastName: 'Mohammed',
                email: 'hanan.mohammed@student.haramaya.edu.et',
                password: 'member123',
                phone: '+251922222223',
                role: 'volunteer',
                branch: createdBranches[2]._id,
                studentId: 'HU/2022/201',
                department: 'Veterinary Medicine',
                yearOfStudy: 1,
                bloodType: 'A-',
                isActive: true,
                isApproved: true,
                approvedBy: adminUser._id,
                approvedAt: new Date()
            }
        ];

        const createdMembers = await User.insertMany(members);
        console.log('Members created...');

        // Create sample events
        const events = [
            {
                title: 'Blood Donation Drive - Main Campus',
                description: 'Annual blood donation campaign to support local hospitals and emergency services.',
                type: 'blood_donation',
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
                location: 'Main Campus Student Center',
                branch: createdBranches[0]._id,
                organizer: createdOfficers[0]._id,
                maxParticipants: 100,
                registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                requirements: ['Age 18-65', 'Weight above 50kg', 'Good health condition'],
                status: 'published',
                isPublic: true,
                tags: ['blood', 'donation', 'health', 'community']
            },
            {
                title: 'First Aid Training Workshop',
                description: 'Comprehensive first aid training for Red Cross volunteers and community members.',
                type: 'training',
                startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Same day
                location: 'Technology Campus Auditorium',
                branch: createdBranches[1]._id,
                organizer: createdOfficers[1]._id,
                maxParticipants: 50,
                registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                requirements: ['Red Cross member or volunteer', 'Commitment to attend full session'],
                status: 'published',
                isPublic: true,
                tags: ['training', 'first-aid', 'skills', 'emergency']
            }
        ];

        const createdEvents = await Event.insertMany(events);
        console.log('Events created...');

        // Create sample announcements
        const announcements = [
            {
                title: 'Welcome to Haramaya University Red Cross Club',
                content: 'We are excited to launch our new digital platform for managing Red Cross activities. This system will help us coordinate better, track our humanitarian efforts, and build a stronger community of volunteers.',
                type: 'general',
                priority: 'high',
                author: adminUser._id,
                targetAudience: {
                    roles: ['all']
                },
                visibility: 'public',
                status: 'published',
                tags: ['welcome', 'platform', 'community'],
                isPinned: true,
                pinnedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Upcoming Blood Donation Drive',
                content: 'Join us for our monthly blood donation drive. Your donation can save up to three lives! Registration is now open for all eligible donors.',
                type: 'event',
                priority: 'medium',
                author: createdOfficers[0]._id,
                relatedEvent: createdEvents[0]._id,
                targetAudience: {
                    roles: ['member', 'volunteer', 'visitor']
                },
                visibility: 'public',
                status: 'published',
                tags: ['blood-donation', 'health', 'community-service']
            }
        ];

        await Announcement.insertMany(announcements);
        console.log('Announcements created...');

        // Create sample donations
        const donations = [
            {
                donor: createdMembers[0]._id,
                type: 'blood',
                bloodType: 'O-',
                bloodUnits: 1,
                description: 'Regular blood donation',
                donationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                location: 'Main Campus Health Center',
                branch: createdBranches[0]._id,
                recordedBy: createdOfficers[0]._id,
                status: 'verified',
                verifiedBy: adminUser._id,
                verifiedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
                medicalInfo: {
                    hemoglobin: 13.5,
                    bloodPressure: { systolic: 120, diastolic: 80 },
                    weight: 65,
                    temperature: 36.5,
                    medicallyEligible: true
                }
            },
            {
                donor: createdMembers[1]._id,
                type: 'money',
                amount: 500,
                currency: 'ETB',
                description: 'Donation for emergency relief fund',
                donationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                location: 'Technology Campus',
                branch: createdBranches[1]._id,
                recordedBy: createdOfficers[1]._id,
                status: 'verified',
                verifiedBy: adminUser._id,
                verifiedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
            }
        ];

        await Donation.insertMany(donations);
        console.log('Donations created...');

        console.log('✅ Database seeded successfully!');
        console.log('\n📋 Sample Login Credentials:');
        console.log('Admin: admin@haramaya.edu.et / admin123');
        console.log('Officer: meron.tadesse@haramaya.edu.et / officer123');
        console.log('Member: sara.ahmed@student.haramaya.edu.et / member123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeder
if (require.main === module) {
    connectDB().then(() => {
        seedDatabase();
    });
}

module.exports = seedDatabase;