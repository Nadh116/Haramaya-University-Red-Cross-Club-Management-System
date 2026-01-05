import React, { useState } from 'react';

const PublicContactForm = () => {
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
            console.log('🚀 Submitting public contact form...');
            console.log('📋 Form data:', formData);

            // Make direct API call without using the main API service
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

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Contact Haramaya Red Cross
                </h2>
                <p className="text-lg text-gray-600">
                    Send us a message and our admin team will get back to you soon.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        What can we help you with? *
                    </label>
                    <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
                            Your Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="Enter your full name"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="your.email@example.com"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="+251911234567"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="Brief subject of your message"
                            required
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                        placeholder="Please describe how we can help you..."
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Message...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            Send Message to Admin
                        </span>
                    )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <div>
                                <p className="font-medium">Message sent successfully!</p>
                                <p className="text-sm">Our admin team will review your message and get back to you within 24-48 hours.</p>
                            </div>
                        </div>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                            <div>
                                <p className="font-medium">Sorry, there was an error sending your message.</p>
                                <p className="text-sm">Please try again or contact us directly at info@haramayaredcross.org</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                            <p className="font-medium">📧 Email</p>
                            <p>info@haramayaredcross.org</p>
                        </div>
                        <div>
                            <p className="font-medium">📞 Phone</p>
                            <p>+251-25-553-0011</p>
                        </div>
                        <div>
                            <p className="font-medium">🚨 Emergency</p>
                            <p>+251-91-123-4567</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicContactForm;