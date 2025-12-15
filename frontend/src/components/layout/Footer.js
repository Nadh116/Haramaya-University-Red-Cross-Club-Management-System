import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand and description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-red-cross-600 rounded flex items-center justify-center">
                                <i className="fas fa-plus text-white text-sm"></i>
                            </div>
                            <div>
                                <span className="text-xl font-bold">Haramaya</span>
                                <span className="text-xl font-bold text-red-cross-400 ml-1">Red Cross</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Haramaya University Red Cross Club is dedicated to humanitarian service,
                            disaster relief, and community health initiatives across all university campuses.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 transition-colors">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 transition-colors">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 transition-colors">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 transition-colors">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/announcements" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    Announcements
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-red-cross-400 transition-colors">
                                    Join Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <i className="fas fa-map-marker-alt text-red-cross-400 mt-1"></i>
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Haramaya University<br />
                                        Main Campus, Dire Dawa Road<br />
                                        Haramaya, Ethiopia
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <i className="fas fa-phone text-red-cross-400"></i>
                                <p className="text-gray-300 text-sm">+251 25 553 0011</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <i className="fas fa-envelope text-red-cross-400"></i>
                                <p className="text-gray-300 text-sm">redcross@haramaya.edu.et</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Haramaya University Red Cross Club. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 text-sm transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 text-sm transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-cross-400 text-sm transition-colors">
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;