// src/app/search/page.tsx
"use client"; // This component uses client-side hooks

import React, { useState } from 'react';
import Link from 'next/link'; // IMPORTED: Link for client-side navigation
import { Star, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

// Define the type for a Provider for better type safety
interface Provider {
    id: number | string; // Provider ID can be number or string (e.g., 'sarah-adebayo')
    name: string;
    category: string;
    avatar: string;
    rating: number; // Corrected type
    reviews: number;
    badges: string[];
    price: number;
}

// ProviderCard component
const ProviderCard = ({ provider }: { provider: Provider }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:shadow-lg transition-all duration-300 ease-in-out">
            <img
                src={provider.avatar}
                alt={provider.name}
                className="w-24 h-24 rounded-full object-cover shadow-sm flex-shrink-0"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/ffffff?text=Pro"; }}
            />
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-semibold text-gray-800 font-poppins mb-1">{provider.name}</h3>
                <p className="text-gray-600 text-sm font-inter mb-2">{provider.category}</p>
                <div className="flex items-center justify-center sm:justify-start mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < provider.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-gray-700 text-sm ml-2 font-inter">({provider.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                    {provider.badges.includes('Verified') && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Verified
                        </span>
                    )}
                    {provider.badges.includes('Top-Rated') && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-blue-700" /> Top-Rated
                        </span>
                    )}
                </div>
                <p className="text-gray-800 text-lg font-bold font-poppins">From ₦{provider.price.toLocaleString()}</p>
                <div className="mt-4">
                    {/* CORRECTED: Link to the dynamic Provider Profile Page */}
                    <Link href={`/providers/${provider.id}`} passHref>
                        <button className="bg-[#cc6500] text-white px-6 py-2 rounded-full text-md font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md">
                            View Profile
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// FilterSidebar component
const FilterSidebar = () => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedRating, setSelectedRating] = useState('');
    const [availabilityDate, setAvailabilityDate] = useState('');
    const [genderPreference, setGenderPreference] = useState('');

    const handleApplyFilters = () => {
        console.log("Applying Filters:", { priceRange, selectedRating, availabilityDate, genderPreference });
        // In a real app, this would trigger a search/filter on the backend or data set
    };

    const handleClearFilters = () => {
        setPriceRange({ min: 0, max: 100000 });
        setSelectedRating('');
        setAvailabilityDate('');
        setGenderPreference('');
        console.log("Filters Cleared");
    };

    const ratings = [
        { label: '5 Stars', value: '5' },
        { label: '4 Stars & Up', value: '4' },
        { label: '3 Stars & Up', value: '3' },
    ];

    const genders = [
        { label: 'Any', value: 'any' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    return (
        <div className="w-full md:w-80 bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24 md:h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 font-poppins flex items-center gap-2">
                <SlidersHorizontal className="w-6 h-6 text-[#cc6500]" /> Filters
            </h3>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-inter">Price Range (₦)</h4>
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm font-inter focus:border-[#cc6500] focus:ring-[#cc6500] focus:ring-1"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm font-inter focus:border-[#cc6500] focus:ring-[#cc6500] focus:ring-1"
                    />
                </div>
                {/* A simplified slider placeholder */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-[#cc6500] h-full rounded-full w-1/2"></div> {/* Example fill */}
                </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-inter">Rating</h4>
                <div className="space-y-2">
                    {ratings.map((ratingOption) => (
                        <label key={ratingOption.value} className="flex items-center text-gray-700 font-inter text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                value={ratingOption.value}
                                checked={selectedRating === ratingOption.value}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="form-radio h-4 w-4 text-[#cc6500] border-gray-300 focus:ring-[#cc6500]"
                            />
                            <span className="ml-2 flex items-center">
                                {[...Array(Number(ratingOption.value.split(' ')[0]))].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                {ratingOption.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-inter">Availability</h4>
                <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm font-inter focus:border-[#cc6500] focus:ring-[#cc6500] focus:ring-1"
                />
            </div>

            {/* Gender Preference */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-3 font-inter">Gender Preference</h4>
                <div className="flex flex-wrap gap-3">
                    {genders.map((genderOption) => (
                        <label key={genderOption.value} className="flex items-center text-gray-700 font-inter text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value={genderOption.value}
                                checked={genderPreference === genderOption.value}
                                onChange={(e) => setGenderPreference(e.target.value)}
                                className="form-radio h-4 w-4 text-[#cc6500] border-gray-300 focus:ring-[#cc6500]"
                            />
                            <span className="ml-2">{genderOption.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleApplyFilters}
                    className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-md font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleClearFilters}
                    className="w-full bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-md font-semibold hover:bg-gray-100 transition-all duration-300 ease-in-out shadow-sm"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

// Default exported SearchResultsPage
export default function SearchResultsPage() {
    // Dummy data for service providers
    const providers: Provider[] = [ // Added type annotation for providers array
        {
            id: 'michael-eze', // Changed to string for consistency with dynamic routing
            name: "Michael Eze",
            category: "Plumbing Specialist",
            avatar: "https://placehold.co/96x96/ccddee/333333?text=ME",
            rating: 4.8,
            reviews: 215,
            badges: ['Verified', 'Top-Rated'],
            price: 7500,
        },
        {
            id: 'funmi-adekunle',
            name: "Funmi Adekunle",
            category: "Professional Cleaner",
            avatar: "https://placehold.co/96x96/eeddcc/333333?text=FA",
            rating: 4.9,
            reviews: 302,
            badges: ['Verified'],
            price: 5000,
        },
        {
            id: 'chukwuma-okoro',
            name: "Chukwuma Okoro",
            category: "Certified Electrician",
            avatar: "https://placehold.co/96x96/ddcced/333333?text=CO",
            rating: 4.7,
            reviews: 188,
            badges: ['Verified'],
            price: 9000,
        },
        {
            id: 'aisha-bello',
            name: "Aisha Bello",
            category: "Event Decorator",
            avatar: "https://placehold.co/96x96/d0f0d0/333333?text=AB",
            rating: 4.5,
            reviews: 95,
            badges: [],
            price: 15000,
        },
        {
            id: 'david-obi',
            name: "David Obi",
            category: "Home Painter",
            avatar: "https://placehold.co/96x96/e0e0e0/333333?text=DO",
            rating: 4.6,
            reviews: 120,
            badges: ['Top-Rated'],
            price: 6000,
        },
        {
            id: 'grace-tunde',
            name: "Grace Tunde",
            category: "Makeup Artist",
            avatar: "https://placehold.co/96x96/ffe0e0/333333?text=GT",
            rating: 5.0,
            reviews: 55,
            badges: ['Verified', 'Top-Rated'],
            price: 12000,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-24 pb-12"> {/* Adjusted pt- to account for Navbar */}
                <div className="container mx-auto px-6">
                    {/* Top Search Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="What service do you need?"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter"
                            />
                        </div>
                        <div className="relative flex-grow w-full sm:w-auto">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter location"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter"
                            />
                        </div>
                        <button className="bg-[#cc6500] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md w-full sm:w-auto">
                            Search
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar for Filters */}
                        <FilterSidebar />

                        {/* Main Content Area: Provider Cards List */}
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">{providers.length} Results Found</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {providers.map((provider) => (
                                    <ProviderCard key={provider.id} provider={provider} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}