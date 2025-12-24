import React from 'react';

/**
 * ProfileCard Component
 * 
 * A reusable component for displaying team member profiles with consistent styling.
 * Integrates with the existing design system using Tailwind CSS classes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.image - Profile image URL or path
 * @param {string} props.name - Full name of team member
 * @param {string} props.role - Position/role title
 * @param {string} props.description - 2-3 line description
 * @param {Object} props.socialLinks - Optional social media links
 * @param {string} props.socialLinks.github - GitHub profile URL
 * @param {string} props.socialLinks.linkedin - LinkedIn profile URL
 * @param {string} props.socialLinks.email - Email address
 */
const ProfileCard = ({
    image,
    name,
    role,
    description,
    socialLinks = {}
}) => {
    // Default placeholder image if none provided
    const defaultImage = '/images/team/default-avatar.svg';

    // Handle image loading errors
    const handleImageError = (e) => {
        e.target.src = defaultImage;
        e.target.onerror = null; // Prevent infinite loop
    };

    // Render social link icon
    const renderSocialLink = (type, url) => {
        if (!url) return null;

        const socialConfig = {
            github: {
                icon: 'fab fa-github',
                label: 'GitHub Profile',
                color: 'hover:text-gray-900'
            },
            linkedin: {
                icon: 'fab fa-linkedin',
                label: 'LinkedIn Profile',
                color: 'hover:text-blue-600'
            },
            email: {
                icon: 'fas fa-envelope',
                label: 'Email Contact',
                color: 'hover:text-red-cross-600',
                href: url.startsWith('mailto:') ? url : `mailto:${url}`
            }
        };

        const config = socialConfig[type];
        if (!config) return null;

        return (
            <a
                key={type}
                href={config.href || url}
                target={type !== 'email' ? '_blank' : undefined}
                rel={type !== 'email' ? 'noopener noreferrer' : undefined}
                className={`text-gray-500 ${config.color} transition-colors duration-200 transform hover:scale-110`}
                aria-label={`${config.label} for ${name}`}
            >
                <i className={`${config.icon} text-lg`}></i>
            </a>
        );
    };

    return (
        <div className="card text-center animate-fade-in">
            {/* Profile Image */}
            <div className="mb-6">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                    <img
                        src={image || defaultImage}
                        alt={`${name || 'Team member'} profile`}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
                        onError={handleImageError}
                    />
                    {/* Red Cross accent ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-cross-100 opacity-50"></div>
                </div>
            </div>

            {/* Member Information */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {name || 'Team Member'}
                </h3>
                <p className="text-red-cross-600 font-medium mb-3">
                    {role || 'Team Member'}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {description || 'No description available'}
                </p>
            </div>

            {/* Social Links */}
            {(socialLinks.github || socialLinks.linkedin || socialLinks.email) && (
                <div className="flex justify-center space-x-4 pt-4 border-t border-gray-100">
                    {renderSocialLink('github', socialLinks.github)}
                    {renderSocialLink('linkedin', socialLinks.linkedin)}
                    {renderSocialLink('email', socialLinks.email)}
                </div>
            )}
        </div>
    );
};

export default ProfileCard;