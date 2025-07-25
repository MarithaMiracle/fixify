"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Shirt, Utensils, HeartHandshake, Scissors, Laptop,
    Package, BookOpen, Camera, PawPrint, ChevronRight } from 'lucide-react';

const CategoryCard = ({ category }: { category: { name: string; icon: React.ReactNode; description: string; } }) => {
    // Determine the accent color based on category name for unique tints
    const getCategoryColorClasses = (name: string) => {
        switch (name) {
            case "Home & Repairs": return "bg-[#F0F8FF] text-[#2563EB] border-[#F0F8FF]"; // blue-50, blue-600
            case "Cleaning & Laundry": return "bg-[#F5F5FC] text-[#7C3AED] border-[#F5F5FC]"; // lavender-50, purple-600
            case "Catering & Events": return "bg-[#FFFBEB] text-[#CA8A04] border-[#FFFBEB]"; // yellow-50, yellow-600
            case "Beauty & Grooming": return "bg-[#FDF2F8] text-[#DB2777] border-[#FDF2F8]"; // pink-50, pink-600
            case "Fashion & Tailoring": return "bg-[#F5F3FF] text-[#7C3AED] border-[#F5F3FF]"; // purple-50, purple-600 (duplicate, intentional for demo)
            case "Tech & Installations": return "bg-[#F0FDF4] text-[#16A34A] border-[#F0FDF4]"; // green-50, green-600
            case "Errands & Logistics": return "bg-[#FFFBEB] text-[#CA8A04] border-[#FFFBEB]"; // yellow-50, yellow-600 (duplicate, intentional for demo)
            case "Tutors & Trainers": return "bg-[#EEF2FF] text-[#4F46E5] border-[#EEF2FF]"; // indigo-50, indigo-600
            case "Media & Creativity": return "bg-[#FEF2F2] text-[#DC2626] border-[#FEF2F2]"; // red-50, red-600
            case "Lifestyle & Pet Care": return "bg-[#FFF7ED] text-[#EA580C] border-[#FFF7ED]"; // orange-50, orange-600
            default: return "bg-gray-50 text-[#cc6500] border-gray-100"; // Fallback to new primary color
        }
    };

    const colorClasses = getCategoryColorClasses(category.name);
    // Extract the text color class directly from the returned string for the icon and link
    const textColorForElements = colorClasses.split(' ').find(cls => cls.startsWith('text-'));


    return (
        <div
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col items-center text-center border ${colorClasses}`}
        >
            <div className={`mb-4 text-5xl ${textColorForElements}`}>
                {category.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{category.name}</h3>
            <p className="text-gray-600 text-sm font-inter">{category.description}</p>
            <Link href={`/search?category=${encodeURIComponent(category.name)}`} className={`font-semibold mt-4 ${textColorForElements} hover:underline transition-colors`}>
                Explore Services →
            </Link>
        </div>
    );
};

// SidebarFilter component (nested within ServiceCategoriesPage)
const SidebarFilter = () => {
    const categories = [
        { name: "Home & Repairs", subCategories: ["Plumbing", "Electrical", "Painting", "Carpentry"] },
        { name: "Cleaning & Laundry", subCategories: ["Home Cleaning", "Office Cleaning", "Dry Cleaning", "Carpet Cleaning"] },
        { name: "Catering & Events", subCategories: ["Event Planning", "Catering", "Decorations", "Photography"] },
        { name: "Beauty & Grooming", subCategories: ["Makeup Artists", "Barbers", "Hairstylists", "Nail Technicians"] },
        { name: "Fashion & Tailoring", subCategories: ["Custom Tailoring", "Alterations", "Outfit Design"] },
        { name: "Tech & Installations", subCategories: ["CCTV Installation", "Network Setup", "Computer Repair"] },
        { name: "Errands & Logistics", subCategories: ["Dispatch Services", "Parcel Delivery", "Personal Errands"] },
        { name: "Tutors & Trainers", subCategories: ["Academic Tutoring", "Skill Training", "Fitness Coaching"] },
        { name: "Media & Creativity", subCategories: ["Photography", "Videography", "Content Creation"] },
        { name: "Lifestyle & Pet Care", subCategories: ["Pet Grooming", "Home Spa", "Wellness Coaching"] },
    ];

    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const toggleCategory = (categoryName: string) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };

    // Placeholder for actual category selection logic
    const handleSelectCategory = (subCategory: string) => {
        console.log(`Selected: ${subCategory}`);
    };

    return (
        <div className="w-full md:w-64 bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24 md:h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 font-poppins">Categories</h3>
            <ul className="space-y-4">
                {categories.map((category, index) => (
                    <li key={index}>
                        <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full text-left text-lg font-medium text-gray-700 hover:text-[#cc6500] transition-colors flex justify-between items-center font-inter"
                        >
                            {category.name}
                            <ChevronRight
                                className={`w-5 h-5 transition-transform duration-200 ${
                                    openCategory === category.name ? 'rotate-90' : ''
                                }`}
                            />
                        </button>
                        {openCategory === category.name && category.subCategories && (
                            <ul className="ml-4 mt-2 space-y-2">
                                {category.subCategories.map((sub, subIndex) => (
                                    <li key={subIndex}>
                                        <Link href={`/search?category=${encodeURIComponent(sub)}`} className="text-gray-600 hover:text-[#cc6500] text-sm transition-colors font-inter">
                                            {sub}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
                {/* CORRECTED: Use Link for "All Services" navigation */}
                <li>
                    <Link href="/search" className="block text-gray-700 hover:text-[#cc6500] font-semibold font-inter py-2">
                        All Services
                    </Link>
                </li>
            </ul>
        </div>
    );
};

// Default exported ServiceCategoriesPage
export default function ServiceCategoriesPage() {
    const serviceCategories = [
        { name: "Home & Repairs", icon: <Home /> , description: "Plumbing, electrical, painting, etc." },
        { name: "Cleaning & Laundry", icon: <Shirt />, description: "Dry cleaning, home cleaning, post-construction cleanup" },
        { name: "Catering & Events", icon: <Utensils />, description: "Event planners, caterers, decorators" },
        { name: "Beauty & Grooming", icon: <HeartHandshake />, description: "Makeup artists, barbers, hairstylists" },
        { name: "Fashion & Tailoring", icon: <Scissors />, description: "Custom tailoring, outfit designers, alterations" },
        { name: "Tech & Installations", icon: <Laptop />, description: "CCTV, network setup, computer repair" },
        { name: "Errands & Logistics", icon: <Package />, description: "Dispatch, errands, parcel delivery" },
        { name: "Tutors & Trainers", icon: <BookOpen />, description: "Home tutors, skill trainers, coaches" },
        { name: "Media & Creativity", icon: <Camera />, description: "Photography, videography, content creators" },
        { name: "Lifestyle & Pet Care", icon: <PawPrint />, description: "Pet grooming, home spa, wellness" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-24 pb-12"> {/* Adjusted pt- to account for Navbar */}
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-gray-900 text-center mb-10 font-poppins">Explore Our Services</h1>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar for Filters (Mobile-first: will appear above categories on small screens) */}
                        <SidebarFilter />

                        {/* Main Content Area: Category Cards Grid */}
                        <div className="flex-grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {serviceCategories.map((category, index) => (
                                    <CategoryCard key={index} category={category} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}