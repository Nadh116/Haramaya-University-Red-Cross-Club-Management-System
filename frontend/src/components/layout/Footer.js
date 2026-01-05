import React from 'react';
import { Link } from 'react-router-dom';
import RedCrossSymbol from '../common/RedCrossSymbol';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About HURCC */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <RedCrossSymbol size="sm" animate={false} variant="circle" />
                            <div>
                                <span className="text-xl font-bold">Haramaya</span>
                                <span className="text-xl font-bold text-red-cross-400 ml-1">Red Cross</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Haramaya University Red Cross Club is a humanitarian, volunteer-based student organization dedicated to serving humanity through compassion, dedication, and community action, in alignment with Ethiopian Red Cross Society principles.
                        </p>

                        {/* Credits & Acknowledgment */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-red-cross-400 mb-3">Credits & Acknowledgment</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p>
                                    <span className="font-medium">Idea Initiator / Founder:</span><br />
                                    Abdulfetah Jemal (AJ), President of HUCISA
                                </p>
                                <p>
                                    <span className="font-medium">System & Website Developer:</span><br />
                                    Nedhi Jemal — Full Stack Developer
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    Activities
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <i className="fas fa-university text-red-cross-400 mt-1"></i>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">
                                        Haramaya University Red Cross Club
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <i className="fas fa-map-marker-alt text-red-cross-400 mt-1"></i>
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Haramaya University<br />
                                        Main Campus, Ethiopia
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <i className="fas fa-envelope text-red-cross-400"></i>
                                <p className="text-gray-300 text-sm">redcross@haramaya.edu.et</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal & Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Haramaya University Red Cross Club (HURCC). All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/about" className="text-gray-400 hover:text-red-cross-400 text-sm transition-colors">
                                About HURCC
                            </Link>
                            <Link to="/contact" className="text-gray-400 hover:text-red-cross-400 text-sm transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;