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
    ];

    const protectedLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', roles: ['admin', 'officer', 'member', 'volunteer'] },
        { path: '/admin', label: 'Admin Panel', icon: 'fas fa-cog', roles: ['admin'] },
        { path: '/admin/users', label: 'Manage Users', icon: 'fas fa-users', roles: ['admin', 'officer'] },
        { path: '/admin/events', label: 'Manage Events', icon: 'fas fa-calendar-plus', roles: ['admin', 'officer'] },
        { path: '/admin/announcements', label: 'Manage Announcements', icon: 'fas fa-megaphone', roles: ['admin', 'officer'] },
        { path: '/admin/donations', label: 'Manage Donations', icon: 'fas fa-hand-holding-heart', roles: ['admin', 'officer'] },
    ];

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand - Compact */}
                    <div className="flex items-center flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200 group"
                            onClick={() => setIsOpen(false)}
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
                                    <span className="text-xs text-gray-500 -mt-1">University Chapter</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop navigation - Compact size */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Public links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${isActive(link.path)
                                    ? 'text-red-cross-600 bg-red-cross-50 shadow-sm'
                                    : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-50'
                                    }`}
                            >
                                <i className={`${link.icon} text-xs`}></i>
                                <span className="hidden lg:inline text-xs">{link.label}</span>
                            </Link>
                        ))}

                        {/* Protected links - All visible with smaller size */}
                        {user && protectedLinks.map((link) => (
                            hasRole(link.roles) && (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${isActive(link.path)
                                        ? 'text-red-cross-600 bg-red-cross-50 shadow-sm'
                                        : 'text-gray-700 hover:text-red-cross-600 hover:bg-gray-50'
                                        }`}
                                    title={link.label}
                                >
                                    <i className={`${link.icon} text-xs`}></i>
                                    <span className="hidden lg:inline text-xs">{link.label}</span>
                                </Link>
                            )
                        ))}
                    </div>

                    {/* User menu - Compact size */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        {user ? (
                            <>
                                {/* User Profile Dropdown - Smaller */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-1 text-xs rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-cross-500 transition-all duration-200 border border-gray-200"
                                        title="User Menu"
                                    >
                                        <div className="w-6 h-6 bg-gradient-to-br from-red-cross-500 to-red-cross-600 rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-white font-semibold text-xs">
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="hidden lg:block text-left">
                                            <div className="text-gray-900 font-medium text-xs">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="text-gray-500 text-xs capitalize">
                                                {user.role}
                                            </div>
                                        </div>
                                        <i className={`fas fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''
                                            }`}></i>
                                    </button>

                                    {/* Enhanced Dropdown menu */}
                                    {isProfileOpen && (
                                        <div className="user-dropdown animate-fade-in">
                                            <div className="user-dropdown-header">
                                                <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                                <div className="flex items-center mt-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                        user.role === 'officer' ? 'bg-blue-100 text-blue-800' :
                                                            user.role === 'member' ? 'bg-green-100 text-green-800' :
                                                                'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {user.role?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                to="/profile"
                                                className="user-dropdown-item"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <i className="fas fa-user user-dropdown-icon"></i>
                                                My Profile
                                            </Link>

                                            <Link
                                                to="/dashboard"
                                                className="user-dropdown-item"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <i className="fas fa-tachometer-alt user-dropdown-icon"></i>
                                                Dashboard
                                            </Link>

                                            {hasRole(['admin', 'officer']) && (
                                                <Link
                                                    to="/admin"
                                                    className="user-dropdown-item"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <i className="fas fa-cog user-dropdown-icon"></i>
                                                    Admin Panel
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="user-dropdown-logout"
                                            >
                                                <i className="fas fa-sign-out-alt user-dropdown-icon"></i>
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
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
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-cross-500 transition-all duration-200"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-up relative w-full">
                    <div className="px-4 pt-2 pb-4 space-y-2 bg-gray-50">
                        {/* Mobile user info */}
                        {user && (
                            <div className="flex items-center space-x-3 px-3 py-3 bg-white rounded-lg mb-3 shadow-sm">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-cross-500 to-red-cross-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500 capitalize">
                                        {user.role}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile navigation links */}
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

                        {user && protectedLinks.map((link) => (
                            hasRole(link.roles) && (
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
                            )
                        ))}

                        {/* Mobile auth links */}
                        {!user && (
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
                        )}

                        {/* Mobile logout - Enhanced visibility */}
                        {user && (
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 border border-red-200"
                                >
                                    <i className="fas fa-sign-out-alt w-5 text-center text-red-600"></i>
                                    <span className="font-semibold">Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;