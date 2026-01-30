import React from 'react';
import Contact from '../../components/common/Contact';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <i className="fas fa-envelope text-red-cross-600 mr-3"></i>
                            Contact Us
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get in touch with us for volunteer opportunities, emergency assistance,
                            blood donation inquiries, or any questions about our humanitarian services.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Component */}
            <Contact />
        </div>
    );
};

export default ContactPage;