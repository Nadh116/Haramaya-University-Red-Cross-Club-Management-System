import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            console.log('🚀 Submitting contact form...');
            console.log('📋 Form data:', formData);

            // Use proxy path - this will be proxied to localhost:5000/api/contact
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('📄 Response data:', data);

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    inquiryType: 'general'
                });
                console.log('✅ Contact form submitted successfully!');
            } else {
                console.error('❌ Server error:', data);
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: 'fas fa-map-marker-alt',
            title: 'Main Campus',
            details: [
                'Haramaya University',
                'Red Cross Club Office',
                'Student Affairs Building, Room 205',
                'Haramaya, Ethiopia'
            ]
        },
        {
            icon: 'fas fa-phone',
            title: 'Phone Numbers',
            details: [
                'Main Office: +251-25-553-0011',
                'Emergency: +251-91-123-4567',
                'Coordinator: +251-92-987-6543'
            ]
        },
        {
            icon: 'fas fa-envelope',
            title: 'Email Addresses',
            details: [
                'info@haramayaredcross.org',
                'volunteer@haramayaredcross.org',
                'emergency@haramayaredcross.org'
            ]
        },
        {
            icon: 'fas fa-clock',
            title: 'Office Hours',
            details: [
                'Monday - Friday: 8:00 AM - 5:00 PM',
                'Saturday: 9:00 AM - 1:00 PM',
                'Sunday: Closed',
                'Emergency: 24/7 Available'
            ]
        }
    ];

    const branches = [
        {
            name: 'Main Campus Branch',
            address: 'Haramaya University Main Campus',
            phone: '+251-25-553-0011',
            email: 'main@haramayaredcross.org',
            coordinator: 'Dr. Ahmed Hassan'
        },
        {
            name: 'Health Science Campus',
            address: 'Harar Health Science Campus',
            phone: '+251-25-666-7788',
            email: 'health@haramayaredcross.org',
            coordinator: 'Ms. Fatima Mohammed'
        },
        {
            name: 'Chiro Campus Branch',
            address: 'Chiro Campus Extension',
            phone: '+251-25-444-5566',
            email: 'chiro@haramayaredcross.org',
            coordinator: 'Mr. Bekele Tadesse'
        }
    ];

    const socialLinks = [
        { icon: 'fab fa-facebook', url: '#', name: 'Facebook' },
        { icon: 'fab fa-twitter', url: '#', name: 'Twitter' },
        { icon: 'fab fa-instagram', url: '#', name: 'Instagram' },
        { icon: 'fab fa-linkedin', url: '#', name: 'LinkedIn' },
        { icon: 'fab fa-youtube', url: '#', name: 'YouTube' },
        { icon: 'fab fa-telegram', url: '#', name: 'Telegram' }
    ];

    return (
        <section className="py-16 bg-gray-50 w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions about our programs? Want to volunteer? Need emergency assistance?
                        We're here to help and would love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Inquiry Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Inquiry Type
                                </label>
                                <select
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                    required
                                >
                                    <option value="general">General Information</option>
                                    <option value="volunteer">Volunteer Opportunities</option>
                                    <option value="emergency">Emergency Assistance</option>
                                    <option value="donation">Blood Donation</option>
                                    <option value="training">Training Programs</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                            </div>

                            {/* Name and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone and Subject */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-cross-500 focus:border-transparent resize-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-cross-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-cross-700 focus:ring-2 focus:ring-red-cross-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Sending Message...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Send Message
                                    </span>
                                )}
                            </button>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    <div>
                                        <p className="font-medium">Message sent successfully!</p>
                                        <p className="text-sm mt-1">Your message has been sent to our admin team. We'll get back to you within 24-48 hours via email.</p>
                                    </div>
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    Sorry, there was an error sending your message. Please try again.
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-red-cross-100 rounded-full flex items-center justify-center mr-4">
                                            <i className={`${info.icon} text-red-cross-600 text-xl`}></i>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900">{info.title}</h4>
                                    </div>
                                    <div className="space-y-1">
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Campus Branches */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-6">Our Campus Branches</h4>
                            <div className="space-y-4">
                                {branches.map((branch, index) => (
                                    <div key={index} className="border-l-4 border-red-cross-600 pl-4">
                                        <h5 className="font-semibold text-gray-900">{branch.name}</h5>
                                        <p className="text-sm text-gray-600">{branch.address}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                            <span className="text-gray-600">
                                                <i className="fas fa-phone mr-1"></i>
                                                {branch.phone}
                                            </span>
                                            <span className="text-gray-600">
                                                <i className="fas fa-envelope mr-1"></i>
                                                {branch.email}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Coordinator: {branch.coordinator}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-red-cross-300 hover:bg-red-cross-50 transition-colors duration-200 group"
                                    >
                                        <i className={`${social.icon} text-2xl text-gray-600 group-hover:text-red-cross-600 mb-2`}></i>
                                        <span className="text-sm text-gray-600 group-hover:text-red-cross-600">
                                            {social.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-red-cross-600 text-white rounded-lg p-6">
                            <h4 className="text-xl font-bold mb-4">Emergency Contact</h4>
                            <p className="mb-4">
                                For urgent humanitarian assistance or emergency situations,
                                contact our 24/7 emergency hotline:
                            </p>
                            <div className="flex items-center justify-center bg-white/10 rounded-lg p-4">
                                <i className="fas fa-phone-alt text-2xl mr-3"></i>
                                <span className="text-2xl font-bold">+251-91-123-4567</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;