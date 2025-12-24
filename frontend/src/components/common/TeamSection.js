import React from 'react';
import ProfileCard from './ProfileCard';

/**
 * TeamSection Component
 * 
 * Displays the "Meet the Team" section with team member profile cards.
 * Uses responsive grid layout and maintains consistency with existing About page sections.
 */
const TeamSection = () => {
    // Team member data as defined in the design document
    const teamMembers = [
        {
            id: 'developer',
            name: 'Nedhi Jemal',
            role: 'Full Stack Developer',
            description: 'Passionate developer who designed and built the Haramaya Red Cross Club website. Specializes in React, Node.js, and modern web technologies.',
            image: '/images/team/nedhi-jemal.jpg',
            socialLinks: {
                github: 'https://github.com/nedhijemal',
                linkedin: 'https://linkedin.com/in/nedhijemal',
                email: 'nedhi.jemal@haramaya.edu.et'
            }
        },
        {
            id: 'developer-2',
            name: 'Samson',
            role: 'Frontend Developer',
            description: 'Creative frontend developer focused on user experience and responsive design. Expert in React, CSS, and modern UI frameworks.',
            image: '/images/team/developer-2-placeholder.svg',
            socialLinks: {
                github: 'https://github.com/samson',
                linkedin: 'https://linkedin.com/in/samson',
                email: 'samson@haramaya.edu.et'
            }
        },
        {
            id: 'club-leader',
            name: 'Jemal',
            role: 'Club Leader / President',
            description: 'Leads the club, organizes activities, and coordinates members.',
            image: '/images/team/leader-placeholder.svg',
            socialLinks: {
                email: 'jemal@haramaya.edu.et'
            }
        }
    ];

    // Handle empty team members array
    if (!teamMembers || teamMembers.length === 0) {
        return (
            <div className="mb-16 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
                    <p className="text-gray-600">Team information will be available soon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-16 animate-fade-in">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Get to know the dedicated individuals who make our humanitarian mission possible.
                </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => {
                    // Validate member data
                    if (!member || !member.id) {
                        console.warn('Invalid team member data:', member);
                        return null;
                    }

                    return (
                        <div
                            key={member.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <ProfileCard
                                image={member.image}
                                name={member.name}
                                role={member.role}
                                description={member.description}
                                socialLinks={member.socialLinks}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamSection;