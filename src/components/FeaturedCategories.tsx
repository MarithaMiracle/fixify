"use client";

import React from 'react';

import { Home, Utensils, Zap, Sparkles, Wrench, BrushCleaning, Flower } from 'lucide-react';
import { faucet } from "@lucide/lab";
import { createLucideIcon } from 'lucide-react';

// Create the Faucet component
const Faucet = createLucideIcon('Faucet', faucet);


const FeaturedCategories = () => {
    const categories = [
        { name: "Home & Repairs", icon: <Home />, description: "Experienced handymen for home repairs big or small." },
        { name: "Electrical Work", icon: <Zap />, description: "Certified electricians for installations, repairs, and safety checks." },
        { name: "Deep Cleaning", icon: <Sparkles />, description: "Thorough cleaning services for your home. Get a sparkling clean space." },
        { name: "Appliance Repair", icon: <Wrench />, description: "Expert technicians for refrigerators, washing machines, ovens, and other household appliances" },
        { name: "Painting Services", icon: <BrushCleaning />, description: "Professional painters for interior and exterior jobs." },
        { name: "Plumbing", icon: <Faucet />, description: "Reliable plumbers for drain cleaning, pipe repairs, and fixture installations." },
        { name: "Beauty & Grooming", icon: <Flower />, description: "Makeup artists, barbers, hairstylists." },
        { name: "Catering & Events", icon: <Utensils />, description: "Event planners, caterers, decorators." },
    ];

    return (
        <section className="py-20 bg-white"> {/* Changed background to white for contrast as per inspiration */}
            <div className="container mx-auto px-6">
                <div className='mb-12'>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center font-poppins">Our Popular Services</h2>
                <div className="mt-2 h-1 w-20 bg-teal-600 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="category-card bg-white p-8 rounded-xl shadow-md transition-all duration-300 ease-in-out text-center border border-gray-100
                                       hover:scale-105 hover:shadow-lg"
                        >
                            <div className="flex justify-center mb-4 text-teal-700 text-5xl">
                                {category.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{category.name}</h3>
                            <p className="text-gray-600 mb-4 font-inter">{category.description}</p>
                            <a href="#" className="text-teal-700 font-semibold hover:text-teal-700 transition-colors font-inter">Learn More →</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;