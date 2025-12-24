import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RedCrossSymbol from './components/common/RedCrossSymbol';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layout Components
import Navbar from './components/layout/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import Announcements from './pages/public/Announcements';
import AnnouncementDetail from './pages/public/AnnouncementDetail';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Pages
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/user/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import SimpleAdmin from './pages/SimpleAdmin';
import DebugAuth from './pages/DebugAuth';
import DirectAdmin from './pages/DirectAdmin';
import UserManagement from './pages/admin/UserManagement';
import EventManagement from './pages/admin/EventManagement';
import DonationManagement from './pages/admin/DonationManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import ContactManagement from './pages/admin/ContactManagement';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-cross-50 to-white">
                <div className="text-center animate-scale-in">
                    <div className="mb-6 animate-float">
                        <RedCrossSymbol size="2xl" animate={true} variant="circle" className="mx-auto mb-4" />
                    </div>
                    <LoadingSpinner size="lg" text="Loading Haramaya Red Cross..." />
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <Router>
                <div className={user ? "min-h-screen" : "min-h-screen flex flex-col"}>
                    <Navbar />

                    <main className={user ? "ml-64 pt-20 page-transition" : "flex-grow page-transition"}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<div className="animate-fade-in"><Home /></div>} />
                            <Route path="/about" element={<div className="animate-slide-up"><About /></div>} />
                            <Route path="/events" element={<div className="animate-fade-in"><Events /></div>} />
                            <Route path="/events/:id" element={<div className="animate-scale-in"><EventDetail /></div>} />
                            <Route path="/announcements" element={<div className="animate-fade-in"><Announcements /></div>} />
                            <Route path="/announcements/:id" element={<div className="animate-scale-in"><AnnouncementDetail /></div>} />
                            <Route path="/gallery" element={<div className="animate-fade-in"><Gallery /></div>} />
                            <Route path="/contact" element={<div className="animate-slide-up"><Contact /></div>} />
                            <Route path="/login" element={<div className="animate-slide-in-left"><Login /></div>} />
                            <Route path="/register" element={<div className="animate-slide-in-right"><Register /></div>} />

                            {/* Protected Routes */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <div className="animate-fade-in"><Dashboard /></div>
                                </ProtectedRoute>
                            } />

                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <div className="animate-slide-up"><Profile /></div>
                                </ProtectedRoute>
                            } />

                            {/* Admin Routes */}
                            <Route path="/admin" element={
                                <ProtectedRoute roles={['admin']}>
                                    <div className="animate-scale-in"><AdminDashboard /></div>
                                </ProtectedRoute>
                            } />

                            {/* Simple Admin Route (bypass for testing) */}
                            <Route path="/simple-admin" element={<SimpleAdmin />} />

                            {/* Debug Auth Route (for troubleshooting) */}
                            <Route path="/debug-auth" element={<DebugAuth />} />

                            {/* Direct Admin Route (bypass authentication) */}
                            <Route path="/direct-admin" element={<DirectAdmin />} />

                            <Route path="/admin/users" element={
                                <ProtectedRoute roles={['admin', 'officer']}>
                                    <div className="animate-fade-in"><UserManagement /></div>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/events" element={
                                <ProtectedRoute roles={['admin', 'officer']}>
                                    <div className="animate-fade-in"><EventManagement /></div>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/donations" element={
                                <ProtectedRoute roles={['admin', 'officer']}>
                                    <div className="animate-fade-in"><DonationManagement /></div>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/announcements" element={
                                <ProtectedRoute roles={['admin', 'officer']}>
                                    <div className="animate-fade-in"><AnnouncementManagement /></div>
                                </ProtectedRoute>
                            } />

                            <Route path="/gallery/admin" element={
                                <ProtectedRoute roles={['admin', 'officer']}>
                                    <div className="animate-fade-in"><GalleryManagement /></div>
                                </ProtectedRoute>
                            } />

                            <Route path="/contact/admin" element={
                                <ProtectedRoute roles={['admin', 'officer']}>
                                    <div className="animate-fade-in"><ContactManagement /></div>
                                </ProtectedRoute>
                            } />

                            {/* 404 Route */}
                            <Route path="*" element={
                                <div className="min-h-screen flex items-center justify-center animate-fade-in">
                                    <div className="text-center animate-scale-in">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">404</h1>
                                        <p className="text-gray-600 mb-8 animate-slide-up animate-stagger-1">Page not found</p>
                                        <a href="/" className="btn btn-primary animate-slide-up animate-stagger-2">
                                            Go Home
                                        </a>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;