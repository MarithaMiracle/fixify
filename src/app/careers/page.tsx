"use client";

import React from 'react';
import { Briefcase } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CareersPage() {
    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-grow pt-24 pb-12">
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 font-poppins flex items-center justify-center gap-4">
                                <Briefcase className="w-10 h-10 text-[#cc6500]" /> Join Our Team
                            </h1>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-inter">
                                At Fixify, we're building something special, and we're looking for passionate, talented individuals to join our growing team. If you're driven by innovation, enjoy a collaborative environment, and want to make a real impact on how services are delivered in Nigeria, you've come to the right place.
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Why Work at Fixify?</h2>
                            <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed space-y-2 mb-6 font-inter">
                                <li>Impact: Contribute to a platform that genuinely helps thousands of people daily.</li>
                                <li>Growth: Opportunities for personal and professional development.</li>
                                <li>Culture: A dynamic, supportive, and inclusive work environment.</li>
                                <li>Innovation: Be part of a team that embraces new ideas and technologies.</li>
                            </ul>

                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">Current Openings</h2>
                            <div className="space-y-6">
                                {[
                                    { id: 1, title: "Senior Software Engineer (Frontend)", location: "Lagos, Nigeria", type: "Full-time" },
                                    { id: 2, title: "Customer Support Specialist", location: "Remote", type: "Full-time" },
                                    { id: 3, title: "Marketing Manager", location: "Lagos, Nigeria", type: "Full-time" },
                                    { id: 4, title: "Partnership & Growth Lead", location: "Abuja, Nigeria", type: "Full-time" },
                                ].map(job => (
                                    <div key={job.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 font-poppins">{job.title}</h3>
                                            <p className="text-gray-600 text-sm font-inter mt-1">{job.location} &bull; {job.type}</p>
                                        </div>
                                        <a href="#" className="mt-4 md:mt-0 bg-[#cc6500] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] transition-colors">
                                            View Details
                                        </a>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-gray-600 text-lg mt-10 font-inter">
                                Don't see a role that fits? Send us your resume at <a href="mailto:careers@fixify.com" className="text-[#cc6500] hover:underline">careers@fixify.com</a>. We're always looking for great talent!
                            </p>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
