import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RedCrossSymbol from '../common/RedCrossSymbol';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinks = [
        { path: '/', label: 'Home', public: true },
        { path: '/about', label: 'About', public: true },
        { path: '/events', label: 'Events', public: true },
        { path: '/announcements', label: 'Announcements', public: true },
    ];

    const protectedLinks = [
        { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'officer', 'member', 'volunteer'] },
        { path: '/admin', label: 'Admin', roles: ['admin'] },
        { path: '/admin/users', label: 'Users', roles: ['admin', 'officer'] },
        { path: '/admin/events', label: 'Manage Events', roles: ['admin', 'officer'] },
        { path: '/admin/donations', label: 'Donations', roles: ['admin', 'officer'] },
    ];

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <RedCrossSymbol size="sm" animate={true} variant="circle" />
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-900">Haramaya</span>
                                <span className="text-xl font-bold text-red-cross-600 ml-1">Red Cross</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Public links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                    ? 'text-red-cross-600 bg-red-cross-50'
                                    : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Protected links */}
                        {user && protectedLinks.map((link) => (
                            hasRole(link.roles) && (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'text-red-cross-600 bg-red-cross-50'
                                        : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-red-cross-500 focus:ring-offset-2"
                                >
                                    <div className="w-8 h-8 bg-red-cross-100 rounded-full flex items-center justify-center">
                                        <span className="text-red-cross-600 font-medium">
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-gray-700 font-medium">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                                </button>

                                {/* Dropdown menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <i className="fas fa-user mr-2"></i>
                                            Profile
                                        </Link>

                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <i className="fas fa-tachometer-alt mr-2"></i>
                                            Dashboard
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <i className="fas fa-sign-out-alt mr-2"></i>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-red-cross-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-cross-500"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                    ? 'text-red-cross-600 bg-red-cross-50'
                                    : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user && protectedLinks.map((link) => (
                            hasRole(link.roles) && (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                        ? 'text-red-cross-600 bg-red-cross-50'
                                        : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}

                        {!user && (
                            <div className="border-t border-gray-200 pt-4">
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-cross-600 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-red-cross-600 hover:bg-red-cross-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;