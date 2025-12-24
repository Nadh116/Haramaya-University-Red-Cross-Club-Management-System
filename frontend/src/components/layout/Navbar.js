import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RedCrossSymbol from '../common/RedCrossSymbol';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: 'fas fa-home', public: true },
        { path: '/about', label: 'About', icon: 'fas fa-info-circle', public: true },
        { path: '/events', label: 'Events', icon: 'fas fa-calendar-alt', public: true },
        { path: '/announcements', label: 'Announcements', icon: 'fas fa-bullhorn', public: true },
        { path: '/gallery', label: 'Gallery', icon: 'fas fa-images', public: true },
        { path: '/contact', label: 'Contact', icon: 'fas fa-envelope', public: true },
    ];

    const protectedLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', roles: ['admin', 'officer', 'member', 'volunteer'] },
    ];

    const adminManagementLinks = [
        { path: '/admin', label: 'Admin Panel', icon: 'fas fa-cog', roles: ['admin'] },
        { path: '/admin/users', label: 'Manage Users', icon: 'fas fa-users', roles: ['admin', 'officer'] },
        { path: '/admin/events', label: 'Manage Events', icon: 'fas fa-calendar-plus', roles: ['admin', 'officer'] },
        { path: '/admin/announcements', label: 'Manage Announcements', icon: 'fas fa-megaphone', roles: ['admin', 'officer'] },
        { path: '/admin/donations', label: 'Manage Donations', icon: 'fas fa-hand-holding-heart', roles: ['admin', 'officer'] },
        { path: '/gallery/admin', label: 'Manage Gallery', icon: 'fas fa-images', roles: ['admin', 'officer'] },
        { path: '/contact/admin', label: 'Manage Contacts', icon: 'fas fa-envelope', roles: ['admin', 'officer'] },
    ];

    // If user is logged in, show sidebar layout
    if (user) {
        return (
            <>
                {/* Fixed Sidebar */}
                <div className="fixed left-0 top-0 w-64 h-full bg-gray-800 text-white flex flex-col z-40">
                    {/* Logo and brand */}
                    <div className="p-6 border-b border-gray-700">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 group"
                        >
                            <div className="transform group-hover:scale-110 transition-transform duration-200">
                                <RedCrossSymbol size="sm" animate={true} variant="circle" />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <span className="text-lg font-bold text-white">Haramaya</span>
                                    <span className="text-lg font-bold text-red-cross-400 ml-1">Red Cross</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {/* Dashboard */}
                        {protectedLinks.map((link) => (
                            hasRole(link.roles) && (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-red-cross-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    <i className={`${link.icon} w-5 text-center`}></i>
                                    <span>{link.label}</span>
                                </Link>
                            )
                        ))}

                        {/* Public Navigation */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                    ? 'bg-red-cross-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <i className={`${link.icon} w-5 text-center`}></i>
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        {/* Admin Management Links */}
                        {hasRole(['admin', 'officer']) && (
                            <>
                                <div className="pt-4 pb-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                                        Management
                                    </p>
                                </div>
                                {adminManagementLinks.map((link) => (
                                    hasRole(link.roles) && (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                                ? 'bg-red-cross-600 text-white shadow-lg'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                }`}
                                        >
                                            <i className={`${link.icon} w-5 text-center`}></i>
                                            <span>{link.label}</span>
                                        </Link>
                                    )
                                ))}
                            </>
                        )}
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-red-cross-500 to-red-cross-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium text-white">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-400 capitalize">
                                        {user.role}
                                    </div>
                                </div>
                                <i className={`fas fa-chevron-up text-gray-400 text-xs transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`}></i>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <i className="fas fa-user w-4 text-center"></i>
                                        <span>My Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <i className="fas fa-sign-out-alt w-4 text-center"></i>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Top Header */}
                <header className="fixed top-0 left-64 right-0 bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-30">
                    <div className="flex items-center justify-between">
                        {/* Left side - Page title */}
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user.firstName}!</p>
                        </div>

                        {/* Right side - Notifications */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <i className="fas fa-bell text-lg"></i>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* User Avatar */}
                            <div className="w-8 h-8 bg-gradient-to-br from-red-cross-500 to-red-cross-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Spacer - This pushes content away from sidebar and header */}
                <div className="ml-64 pt-20">
                    {/* This div creates the necessary spacing */}
                </div>
            </>
        );
    }

    // If user is not logged in, show regular navbar
    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200 group"
                        >
                            <div className="transform group-hover:scale-110 transition-transform duration-200">
                                <RedCrossSymbol size="sm" animate={true} variant="circle" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <span className="text-lg font-bold text-gray-900">Haramaya</span>
                                        <span className="text-lg font-bold text-red-cross-600 ml-1">Red Cross</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                    ? 'text-red-cross-600 bg-red-cross-50'
                                    : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-red-cross-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-red-cross-600 hover:bg-red-cross-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Join Us
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu for non-logged users */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-2 bg-gray-50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${isActive(link.path)
                                    ? 'text-red-cross-600 bg-red-cross-50'
                                    : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <i className={`${link.icon} w-5 text-center`}></i>
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                            <Link
                                to="/login"
                                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-red-cross-600 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="fas fa-sign-in-alt w-5 text-center"></i>
                                <span>Sign In</span>
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-red-cross-600 bg-red-cross-50 hover:bg-red-cross-100 transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="fas fa-user-plus w-5 text-center"></i>
                                <span>Join Us</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;