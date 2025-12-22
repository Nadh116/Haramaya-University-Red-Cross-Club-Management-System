import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { announcementAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchAnnouncement();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            const response = await announcementAPI.getAnnouncement(id);
            setAnnouncement(response.data.announcement);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await announcementAPI.toggleLike(id);
            fetchAnnouncement(); // Refresh to get updated like count
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!commentText.trim()) return;

        try {
            setSubmittingComment(true);
            await announcementAPI.addComment(id, { content: commentText });
            setCommentText('');
            fetchAnnouncement(); // Refresh to get updated comments
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-blue-100 text-blue-800',
            high: 'bg-yellow-100 text-yellow-800',
            critical: 'bg-red-100 text-red-800'
        };
        return colors[priority] || colors.medium;
    };

    const getTypeIcon = (type) => {
        const icons = {
            general: 'fas fa-info-circle',
            urgent: 'fas fa-exclamation-triangle',
            event: 'fas fa-calendar-alt',
            donation: 'fas fa-heart',
            training: 'fas fa-graduation-cap',
            meeting: 'fas fa-users',
            emergency: 'fas fa-ambulance'
        };
        return icons[type] || icons.general;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading announcement..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/announcements" className="btn btn-primary">
                        Back to Announcements
                    </Link>
                </div>
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-search text-gray-400 text-6xl mb-4"></i>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcement Not Found</h1>
                    <p className="text-gray-600 mb-6">The announcement you're looking for doesn't exist.</p>
                    <Link to="/announcements" className="btn btn-primary">
                        Back to Announcements
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 page-transition">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 animate-fade-in">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-red-cross-600">Home</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to="/announcements" className="hover:text-red-cross-600">Announcements</Link>
                        <i className="fas fa-chevron-right"></i>
                        <span className="text-gray-900">{announcement.title}</span>
                    </div>
                </nav>

                {/* Main Content */}
                <article className="card animate-slide-up">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <i className={`${getTypeIcon(announcement.type)} text-red-cross-600 text-xl`}></i>
                            <span className={`badge ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority.toUpperCase()}
                            </span>
                            {announcement.isPinned && (
                                <span className="badge bg-red-cross-100 text-red-cross-800">
                                    <i className="fas fa-thumbtack mr-1"></i>
                                    PINNED
                                </span>
                            )}
                            <span className="badge badge-info">
                                {announcement.type.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {announcement.title}
                        </h1>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-user"></i>
                                    <span>
                                        {announcement.author ?
                                            `${announcement.author.firstName} ${announcement.author.lastName}` :
                                            'Unknown Author'
                                        }
                                        {announcement.author && (
                                            <span className="ml-1 text-xs">({announcement.author.role})</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-clock"></i>
                                    <span>{formatDate(announcement.publishDate)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-eye"></i>
                                    <span>{announcement.viewCount || 0} views</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none mb-8">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {announcement.content}
                        </div>
                    </div>

                    {/* Tags */}
                    {announcement.tags && announcement.tags.length > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {announcement.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Event */}
                    {announcement.relatedEvent && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Related Event</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-800">{announcement.relatedEvent.title}</p>
                                    <p className="text-sm text-blue-600">
                                        {formatDate(announcement.relatedEvent.startDate)} • {announcement.relatedEvent.location}
                                    </p>
                                </div>
                                <Link
                                    to={`/events/${announcement.relatedEvent._id}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    View Event
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between py-4 border-t border-gray-200">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={handleLike}
                                className="flex items-center space-x-2 text-gray-500 hover:text-red-cross-600 transition-colors"
                            >
                                <i className="fas fa-heart"></i>
                                <span>{announcement.likeCount || 0} likes</span>
                            </button>
                            <span className="flex items-center space-x-2 text-gray-500">
                                <i className="fas fa-comment"></i>
                                <span>{announcement.commentCount || 0} comments</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: announcement.title,
                                            text: announcement.content.substring(0, 100) + '...',
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                                className="btn btn-secondary btn-sm"
                            >
                                <i className="fas fa-share mr-2"></i>
                                Share
                            </button>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <div className="card mt-8 animate-slide-up animate-stagger-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Comments ({announcement.commentCount || 0})
                    </h3>

                    {/* Add Comment Form */}
                    {user ? (
                        <form onSubmit={handleComment} className="mb-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-red-cross-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-user text-red-cross-600"></i>
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        rows="3"
                                        className="input mb-3"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !commentText.trim()}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {submittingComment ? (
                                                <>
                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                    Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-comment mr-2"></i>
                                                    Post Comment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg mb-8">
                            <p className="text-gray-600 mb-4">Please log in to comment on this announcement.</p>
                            <Link to="/login" className="btn btn-primary">
                                Log In
                            </Link>
                        </div>
                    )}

                    {/* Comments List */}
                    {announcement.comments && announcement.comments.length > 0 ? (
                        <div className="space-y-6">
                            {announcement.comments.map((comment, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-user text-gray-600"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">
                                                    {comment.user ?
                                                        `${comment.user.firstName} ${comment.user.lastName}` :
                                                        'Unknown User'
                                                    }
                                                </h4>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="fas fa-comments text-4xl mb-3"></i>
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center animate-fade-in animate-stagger-2">
                    <Link to="/announcements" className="btn btn-secondary">
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to Announcements
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetail;