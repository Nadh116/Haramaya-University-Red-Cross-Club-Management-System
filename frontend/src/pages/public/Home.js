import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI, announcementAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RedCrossSymbol from '../../components/common/RedCrossSymbol';

const Home = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const [eventsResponse, announcementsResponse] = await Promise.all([
                eventAPI.getEvents({ limit: 3, status: 'published' }),
                announcementAPI.getAnnouncements({ limit: 3 })
            ]);

            setUpcomingEvents(eventsResponse.data.events);
            setRecentAnnouncements(announcementsResponse.data.announcements);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-hidden">
            {/* Hero Section with Clear Red Cross Group Background */}
            <section
                className="relative min-h-screen w-full text-white hero-section"
                style={{
                    backgroundImage: `url('/red-cross-group.jpg')`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Light overlay only for text readability */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Content */}
                <div className="relative flex items-center min-h-screen w-full">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center animate-fade-in">
                            <div className="mb-8 animate-float">
                                <RedCrossSymbol size="2xl" animate={true} variant="circle" className="mx-auto" />
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up text-red-cross-600">
                                Haramaya University
                                <span className="block text-red-cross-600 animate-slide-up animate-stagger-1">Red Cross Club</span>
                            </h1>

                            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up animate-stagger-2" style={{ color: '#0F172A' }}>
                                Serving humanity through compassion, dedication, and community action across all university campuses.
                            </p>

                            <div className="mb-8 animate-slide-up animate-stagger-3">
                                <p className="text-lg italic" style={{ color: '#0F172A' }}>
                                    "Building stronger communities through humanitarian service"
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-stagger-4">
                                <Link to="/register" className="btn btn-lg bg-white text-red-cross-600 hover:bg-gray-100 hover-glow transform hover:scale-105 transition-all duration-300">
                                    <i className="fas fa-user-plus mr-2"></i>
                                    Register as  Voluntary
                                </Link>
                                <Link to="/events" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-red-cross-600 transform hover:scale-105 transition-all duration-300">
                                    <i className="fas fa-calendar mr-2"></i>
                                    View Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center stats-card animate-fade-in">
                            <div className="w-16 h-16 bg-red-cross-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-cross-200 transition-colors duration-300 animate-scale-in">
                                <i className="fas fa-users text-red-cross-600 text-2xl"></i>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-up">500+</h3>
                            <p className="text-gray-600 animate-slide-up animate-stagger-1">Active Members</p>
                        </div>
                        <div className="text-center stats-card animate-fade-in animate-stagger-1">
                            <div className="w-16 h-16 bg-red-cross-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-cross-200 transition-colors duration-300 animate-scale-in animate-stagger-1">
                                <i className="fas fa-tint text-red-cross-600 text-2xl"></i>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-up animate-stagger-1">1,200+</h3>
                            <p className="text-gray-600 animate-slide-up animate-stagger-2">Blood Units Donated</p>
                        </div>
                        <div className="text-center stats-card animate-fade-in animate-stagger-2">
                            <div className="w-16 h-16 bg-red-cross-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-cross-200 transition-colors duration-300 animate-scale-in animate-stagger-2">
                                <i className="fas fa-calendar-check text-red-cross-600 text-2xl"></i>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-up animate-stagger-2">150+</h3>
                            <p className="text-gray-600 animate-slide-up animate-stagger-3">Events Organized</p>
                        </div>
                        <div className="text-center stats-card animate-fade-in animate-stagger-3">
                            <div className="w-16 h-16 bg-red-cross-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-cross-200 transition-colors duration-300 animate-scale-in animate-stagger-3">
                                <i className="fas fa-building text-red-cross-600 text-2xl"></i>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-up animate-stagger-3">3</h3>
                            <p className="text-gray-600 animate-slide-up animate-stagger-4">Campus Branches</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-gray-50 w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                The Haramaya University Red Cross Club is committed to preventing and alleviating
                                human suffering through humanitarian service, disaster relief, and community health initiatives.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-red-cross-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <p className="text-gray-600">Emergency response and disaster relief</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-red-cross-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <p className="text-gray-600">Blood donation campaigns and health services</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-red-cross-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <p className="text-gray-600">Community education and awareness programs</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-red-cross-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <p className="text-gray-600">Volunteer training and capacity building</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-red-cross-pattern rounded-lg p-8">
                                <div className="bg-white rounded-lg p-6 shadow-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Our Community</h3>
                                    <p className="text-gray-600 mb-6">
                                        Be part of a movement that makes a real difference in people's lives.
                                        Together, we can build a more resilient and compassionate community.
                                    </p>
                                    <Link to="/register" className="btn btn-primary w-full">
                                        Become a Volunteer
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="py-16 bg-white w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                        <Link to="/events" className="btn btn-outline">
                            View All Events
                        </Link>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <div key={event._id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`badge ${event.type === 'blood_donation' ? 'badge-error' :
                                            event.type === 'training' ? 'badge-info' :
                                                'badge-success'
                                            }`}>
                                            {event.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(event.startDate)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-map-marker-alt mr-1"></i>
                                            {event.location}
                                        </div>
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="text-red-cross-600 hover:text-red-cross-700 font-medium text-sm"
                                        >
                                            Learn More →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <i className="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
                            <p className="text-gray-500">No upcoming events at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Announcements */}
            <section className="py-16 bg-gray-50 w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Latest Announcements</h2>
                        <Link to="/announcements" className="btn btn-outline">
                            View All Announcements
                        </Link>
                    </div>

                    {recentAnnouncements.length > 0 ? (
                        <div className="space-y-6">
                            {recentAnnouncements.map((announcement) => (
                                <div key={announcement._id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`badge ${announcement.priority === 'high' ? 'badge-error' :
                                                    announcement.priority === 'medium' ? 'badge-warning' :
                                                        'badge-info'
                                                    }`}>
                                                    {announcement.priority.toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(announcement.publishDate)}
                                                </span>
                                                {announcement.isPinned && (
                                                    <i className="fas fa-thumbtack text-red-cross-600"></i>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {announcement.content}
                                            </p>
                                            <Link
                                                to={`/announcements/${announcement._id}`}
                                                className="text-red-cross-600 hover:text-red-cross-700 font-medium"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <i className="fas fa-bullhorn text-gray-400 text-4xl mb-4"></i>
                            <p className="text-gray-500">No announcements available.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="py-16 bg-white w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore More</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover our activities and get in touch with us
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Gallery Preview */}
                        <div className="bg-gradient-to-br from-red-cross-50 to-red-cross-100 rounded-lg p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="w-16 h-16 bg-red-cross-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-images text-white text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Gallery</h3>
                            <p className="text-gray-600 mb-6">
                                View photos from our blood donation campaigns, training sessions,
                                community service activities, and special events.
                            </p>
                            <Link
                                to="/gallery"
                                className="btn btn-primary inline-flex items-center"
                            >
                                <i className="fas fa-images mr-2"></i>
                                View Gallery
                            </Link>
                        </div>

                        {/* Contact Preview */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-envelope text-white text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
                            <p className="text-gray-600 mb-6">
                                Get in touch for volunteer opportunities, emergency assistance,
                                or any questions about our humanitarian services.
                            </p>
                            <Link
                                to="/contact"
                                className="btn bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center"
                            >
                                <i className="fas fa-envelope mr-2"></i>
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-red-cross-600 text-white w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of students and community members who are already making an impact
                        through humanitarian service and volunteer work.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn btn-lg bg-white text-red-cross-600 hover:bg-gray-100">
                            <i className="fas fa-heart mr-2"></i>
                            Become a Volunteer
                        </Link>
                        <Link to="/about" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-red-cross-600">
                            <i className="fas fa-info-circle mr-2"></i>
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;