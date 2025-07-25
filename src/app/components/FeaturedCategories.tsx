"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Utensils, Zap, Sparkles, Wrench, BrushCleaning, Flower } from 'lucide-react';
import { faucet } from "@lucide/lab";
import { createLucideIcon } from 'lucide-react';

// Create the Faucet component
const Faucet = createLucideIcon('Faucet', faucet);

interface Category {
    name: string;
    icon: React.ReactNode;
    description: string;
}

const FeaturedCategories: React.FC = () => {
    const categories: Category[] = [
        { name: "Home & Repairs", icon: <Home />, description: "Experienced handymen for home repairs big or small." },
        { name: "Electrical Work", icon: <Zap />, description: "Certified electricians for installations, repairs, and safety checks." },
        { name: "Deep Cleaning", icon: <Sparkles />, description: "Thorough cleaning services for your home. Get a sparkling clean space." },
        { name: "Appliance Repair", icon: <Wrench />, description: "Expert technicians for refrigerators, washing machines, ovens, and other household appliances" },
        { name: "Painting Services", icon: <BrushCleaning />, description: "Professional painters for interior and exterior jobs." },
        { name: "Plumbing", icon: <Faucet />, description: "Reliable plumbers for drain cleaning, pipe repairs, and fixture installations." },
        { name: "Beauty & Grooming", icon: <Flower />, description: "Makeup artists, barbers, hairstylists." },
        { name: "Catering & Events", icon: <Utensils />, description: "Event planners, caterers, decorators." },
    ];

    // Determine the accent color based on category name for unique tints
    const getCategoryColorClasses = (name: string): string => {
        switch (name) {
            case "Home & Repairs": return "bg-[#F0F8FF] text-[#2563EB] border-[#F0F8FF]";
            case "Electrical Work": return "bg-[#FEFCE8] text-[#CA8A04] border-[#FEFCE8]";
            case "Deep Cleaning": return "bg-[#F5F5FC] text-[#7C3AED] border-[#F5F5FC]";
            case "Appliance Repair": return "bg-[#F0FDF4] text-[#16A34A] border-[#F0FDF4]";
            case "Painting Services": return "bg-[#FEF2F2] text-[#DC2626] border-[#FEF2F2]";
            case "Plumbing": return "bg-[#EFF6FF] text-[#2563EB] border-[#EFF6FF]";
            case "Beauty & Grooming": return "bg-[#FDF2F8] text-[#DB2777] border-[#FDF2F8]";
            case "Catering & Events": return "bg-[#FFFBEB] text-[#CA8A04] border-[#FFFBEB]";
            case "Cleaning & Laundry": return "bg-[#F5F5FC] text-[#7C3AED] border-[#F5F5FC]";
            case "Fashion & Tailoring": return "bg-[#F5F3FF] text-[#7C3AED] border-[#F5F3FF]";
            case "Tech & Installations": return "bg-[#F0FDF4] text-[#16A34A] border-[#F0FDF4]";
            case "Errands & Logistics": return "bg-[#FFFBEB] text-[#CA8A04] border-[#FFFBEB]";
            case "Tutors & Trainers": return "bg-[#EEF2FF] text-[#4F46E5] border-[#EEF2FF]";
            case "Media & Creativity": return "bg-[#FEF2F2] text-[#DC2626] border-[#FEF2F2]";
            case "Lifestyle & Pet Care": return "bg-[#FFF7ED] text-[#EA580C] border-[#FFF7ED]";
            default: return "bg-gray-50 text-[#cc5500] border-gray-100";
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className='mb-12'>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center font-poppins">Our Popular Services</h2>
                    <div className="mt-2 h-1 w-20 bg-[#cc5500] mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="category-card bg-white p-8 rounded-xl shadow-md transition-all duration-300 ease-in-out text-center border border-gray-100
                                       hover:scale-105 hover:shadow-lg"
                        >
                            <div className="flex justify-center mb-4 text-[#cc5500] text-5xl">
                                {category.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{category.name}</h3>
                            <p className="text-gray-600 mb-4 font-inter">{category.description}</p>
                            <Link 
                                href={`/search?category=${encodeURIComponent(category.name)}`}
                                className="text-[#cc5500] font-semibold hover:text-[#a95500] transition-colors font-inter inline-block"
                            >
                                Learn More →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;