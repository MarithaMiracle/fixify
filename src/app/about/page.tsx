"use client";

import React from 'react';
import { Info } from 'lucide-react';

export default function AboutUsPage() {
    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-grow pt-24 pb-12">
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 font-poppins flex items-center justify-center gap-4">
                                <Info className="w-10 h-10 text-[#cc6500]" /> About Fixify
                            </h1>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-inter">
                                Welcome to Fixify, Nigeria's premier online marketplace designed to effortlessly connect you with trusted, skilled professionals for all your everyday needs. From plumbing and electrical repairs to beauty services, catering, and beyond, we bring convenience and reliability right to your fingertips.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-inter">
                                Our mission is to simplify your life by providing a seamless booking experience and access to a vast network of rigorously vetted and verified service providers. We believe in transparency, security, and exceptional service quality, ensuring peace of mind with every booking.
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Our Vision</h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-inter">
                                To be the most trusted and comprehensive platform for services in Nigeria, empowering both customers to find reliable help and professionals to grow their businesses.
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Our Values</h2>
                            <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed space-y-2 mb-6 font-inter">
                                <li>Trust: Building strong relationships through transparency and integrity.</li>
                                <li>Quality: Ensuring every service delivered meets high standards.</li>
                                <li>Convenience: Making booking and managing services as easy as possible.</li>
                                <li>Community: Fostering a supportive environment for both users and providers.</li>
                            </ul>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}