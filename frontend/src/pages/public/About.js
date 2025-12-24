import React from 'react';
import TeamSection from '../../components/common/TeamSection';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Haramaya Red Cross Club</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Dedicated to humanitarian service and community development across Haramaya University campuses
                    </p>
                </div>

                {/* Historical Background & Purpose */}
                <div className="mb-16">
                    <div className="card">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Historical Background & Purpose</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Historical Background */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mr-4">
                                        <i className="fas fa-history text-red-cross-600 text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Historical Background</h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    The Haramaya University Red Cross Club (HURCC) was founded on September 23, 1999 E.C. at Haramaya University. It is a humanitarian, volunteer-based student organization that operates in alignment with the Ethiopian Red Cross Society (ERCS) principles.
                                </p>
                                <p className="text-gray-600">
                                    Since its establishment, HURCC has been actively involved in life-saving services, awareness creation, and emergency response activities. The club has grown from a small group of committed students into a respected and active humanitarian organization serving both the university and surrounding communities.
                                </p>
                            </div>

                            {/* Purpose */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mr-4">
                                        <i className="fas fa-target text-red-cross-600 text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Purpose</h3>
                                </div>
                                <p className="text-gray-600 mb-4">HURCC exists to:</p>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Mobilize university students for voluntary humanitarian activities</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Support vulnerable and at-risk communities</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Conduct blood donation campaigns</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Respond effectively to emergencies</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-4">
                            The Haramaya University Red Cross Club was established to bring the humanitarian mission
                            of the International Red Cross Movement to our university community. We serve as a bridge
                            between students, faculty, and the broader community in times of need.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Operating across three campuses - Main Campus, Technology Campus, and Veterinary Campus -
                            we coordinate relief efforts, health initiatives, and emergency response activities that
                            make a real difference in people's lives.
                        </p>
                        <p className="text-gray-600">
                            Our volunteers are trained in first aid, disaster response, and community health,
                            ensuring we're always ready to serve when called upon.
                        </p>
                    </div>
                    <div className="bg-red-cross-pattern rounded-lg p-8">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-cross-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-plus text-white text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Our Mission</h3>
                                <p className="text-gray-600 mb-4">
                                    Be part of a community dedicated to serving others and making a positive impact.
                                </p>
                                <a href="/register" className="btn btn-primary w-full">
                                    Become a Member
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission, Vision, Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="card text-center">
                        <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-bullseye text-red-cross-600 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-600">
                            To prevent and alleviate human suffering through humanitarian service,
                            disaster relief, and community health initiatives within and beyond the university.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-eye text-red-cross-600 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600">
                            To be the leading humanitarian organization in the university community,
                            fostering a culture of compassion, resilience, and service excellence.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-heart text-red-cross-600 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
                        <p className="text-gray-600">
                            Humanity, Impartiality, Neutrality, Independence, Voluntary Service,
                            Unity, and Universality guide everything we do.
                        </p>
                    </div>
                </div>

                {/* Campus Branches */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Campus Branches</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Main Campus</h3>
                            <p className="text-gray-600 mb-4">
                                Our headquarters and largest branch, coordinating university-wide activities
                                and serving as the central hub for all Red Cross operations.
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    Haramaya University Main Campus
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-users mr-2"></i>
                                    200+ Active Members
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Campus</h3>
                            <p className="text-gray-600 mb-4">
                                Focusing on innovative approaches to humanitarian challenges and
                                technology-driven solutions for community health and safety.
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    Technology Campus
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-users mr-2"></i>
                                    150+ Active Members
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Veterinary Campus</h3>
                            <p className="text-gray-600 mb-4">
                                Specializing in animal health initiatives and zoonotic disease prevention,
                                contributing to both animal and human welfare.
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    Veterinary Campus
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-users mr-2"></i>
                                    100+ Active Members
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meet the Team Section */}
                <TeamSection />

                {/* Historical Background & Purpose */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Historical Background & Purpose</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Learn about our founding story and the humanitarian mission that drives us forward.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Historical Background */}
                        <div className="card">
                            <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mb-6">
                                <i className="fas fa-history text-red-cross-600 text-xl"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Historical Background</h3>
                            <p className="text-gray-600 mb-4">
                                The Haramaya University Red Cross Club (HURCC) was founded on September 23, 1999 E.C.
                                at Haramaya University. It is a humanitarian, volunteer-based student organization that
                                operates in alignment with the Ethiopian Red Cross Society (ERCS) principles.
                            </p>
                            <p className="text-gray-600">
                                Since its establishment, HURCC has been actively involved in life-saving services,
                                awareness creation, and emergency response activities. The club has grown from a small
                                group of committed students into a respected and active humanitarian organization serving
                                both the university and surrounding communities.
                            </p>
                        </div>

                        {/* Purpose */}
                        <div className="card">
                            <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mb-6">
                                <i className="fas fa-target text-red-cross-600 text-xl"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Purpose</h3>
                            <p className="text-gray-600 mb-4">HURCC exists to:</p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span>Mobilize university students for voluntary humanitarian activities</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span>Support vulnerable and at-risk communities</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span>Conduct blood donation campaigns</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-red-cross-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span>Respond effectively to emergencies</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="card">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-gray-600">
                            Have questions or want to learn more about our activities? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-envelope text-red-cross-600 text-xl"></i>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                            <p className="text-gray-600">redcross@haramaya.edu.et</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-phone text-red-cross-600 text-xl"></i>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                            <p className="text-gray-600">+251 25 553 0011</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-cross-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-map-marker-alt text-red-cross-600 text-xl"></i>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                            <p className="text-gray-600">Haramaya University<br />Main Campus</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;