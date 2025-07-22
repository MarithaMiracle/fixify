"use client";

import React from 'react';
import { Search, Calendar, Check } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search />,
            title: "1. Find Your Pro",
            description: "Browse verified professionals by service, location, and ratings."
        },
        {
            icon: <Calendar />,
            title: "2. Book in Seconds",
            description: "Select your service, choose a time, and confirm your booking instantly."
        },
        {
            icon: <Check />,
            title: "3. Get it Done",
            description: "Your trusted pro arrives and completes the job to your satisfaction."
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-poppins">How Fixify Works</h2>
                    <div className="mt-2 h-1 w-20 bg-[#cc6500] mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                            <div className="flex justify-center mb-4 text-[#cc6500] text-6xl">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{step.title}</h3>
                            <p className="text-gray-600 font-inter">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;