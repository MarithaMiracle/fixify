"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Star, MapPin, Clock, MessageSquareText, Image, ClipboardList } from 'lucide-react';

// Define the type for the dynamic parameters received by the page component
interface ProviderProfilePageParams {
    id: string;
}

// Define the overall props for the ProviderProfilePage component
interface ProviderProfilePageProps {
    params: ProviderProfilePageParams;
}

export default function ProviderProfilePage({ params }: ProviderProfilePageProps) {
    
    const { id: providerId } = params;

    const provider = {
        name: providerId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        category: "Professional Makeup Artist", // Placeholder category
        location: "Lagos, Nigeria",
        rating: 4.8,
        reviewsCount: 150,
        profileImage: `https://placehold.co/150x150/dbeafe/1e40af?text=${providerId.split('-').map(word => word.charAt(0)).join('').toUpperCase()}`, // Dynamic placeholder image based on ID
        bio: `Experienced and passionate ${providerId.split('-').join(' ')} with a keen eye for detail and a dedication to enhancing natural beauty. Specializing in bridal, editorial, and special occasion makeup. My goal is to enhance natural beauty and make every client feel confident and beautiful. Available for bookings across Lagos and nearby states.`,
        services: [
            { name: "Bridal Makeup", price: "₦50,000" },
            { name: "Engagement Makeup", price: "₦40,000" },
            { name: "Photo Shoot Makeup", price: "₦30,000" },
            { name: "Party Makeup", price: "₦25,000" },
            { name: "Makeup Consultation", price: "₦10,000" },
        ],
        portfolioImages: [
            "https://placehold.co/600x400/ffe4e6/8b0000?text=Work+1",
            "https://placehold.co/600x400/f0f9ff/00796B?text=Work+2",
            "https://placehold.co/600x400/fff3e0/ff5722?text=Work+3",
            "https://placehold.co/600x400/e0f7fa/00bcd4?text=Work+4",
            "https://placehold.co/600x400/f3e5f5/9c27b0?text=Work+5",
            "https://placehold.co/600x400/e8f5e9/4caf50?text=Work+6",
        ],
        reviews: [
            { author: "Chioma N.", rating: 5, date: "July 20, 2024", text: `Sarah was incredible! She made me feel so comfortable and I absolutely loved my bridal makeup. It lasted all day!` },
            { author: "Femi A.", rating: 5, date: "July 15, 2024", text: `Booked Sarah for a photoshoot and she delivered beyond expectations. Very professional and creative.` },
            { author: "Amara D.", rating: 4, date: "June 28, 2024", text: `Good makeup, very prompt. Just a minor shade adjustment was needed, but overall happy.` },
        ],
        workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-6">
                    {/* Provider Header Section */}
                    <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 z-0">
                            <div className="absolute w-48 h-48 bg-[#cc6500] rounded-full mix-blend-multiply filter blur-xl opacity-50 top-10 left-10"></div>
                            <div className="absolute w-48 h-48 bg-[#ffc14d] rounded-full mix-blend-multiply filter blur-xl opacity-50 bottom-10 right-10"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <img
                                src={provider.profileImage}
                                alt={`${provider.name}'s profile`}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/cccccc/ffffff?text=Pro"; }}
                            />
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">{provider.name}</h1>
                            <p className="text-lg text-[#cc6500] font-semibold mb-2 font-inter">{provider.category}</p>
                            <p className="text-gray-600 mb-4 font-inter flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-500" /> {provider.location}
                            </p>
                            <div className="flex items-center justify-center mb-6">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="font-semibold text-gray-800 font-inter">{provider.rating}</span>
                                <span className="text-gray-600 ml-1 font-inter">({provider.reviewsCount} reviews)</span>
                            </div>
                            <Link href="/booking" passHref>
                                <button className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
                                    Book Now
                                </button>
                            </Link>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: About, Services, Gallery */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About Section */}
                            <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                                    <MessageSquareText className="w-6 h-6 text-[#cc6500]" /> About {provider.name}
                                </h2>
                                <p className="text-gray-700 leading-relaxed font-inter">{provider.bio}</p>
                            </section>

                            {/* Services Offered Section */}
                            <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                                    <ClipboardList className="w-6 h-6 text-[#cc6500]" /> Services Offered
                                </h2>
                                <div className="space-y-4">
                                    {provider.services.map((service, index) => (
                                        <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-b-0">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 font-poppins">{service.name}</h3>
                                            </div>
                                            <span className="font-bold text-[#cc6500] font-inter">{service.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Photo Gallery Section */}
                            <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins flex items-center gap-2">
                                    <Image className="w-6 h-6 text-[#cc6500]" /> Photo Gallery
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {provider.portfolioImages.map((image, index) => (
                                        <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                                            <img
                                                src={image}
                                                alt={`Portfolio image ${index + 1}`}
                                                className="w-full h-32 md:h-48 object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Portfolio"; }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Booking Card (sticky on desktop) and Reviews */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Booking Card / CTA */}
                            <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 lg:sticky lg:top-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins text-center">Ready to Book?</h2>
                                <div className="flex items-center mb-4 text-gray-700 font-inter">
                                    <Clock className="w-5 h-5 text-gray-600 mr-2" />
                                    <span>Working Hours: {provider.workingHours}</span>
                                </div>
                                <Link href="/booking" passHref>
                                    <button className="w-full bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
                                        Book Now
                                    </button>
                                </Link>
                                <p className="text-center text-sm text-gray-500 mt-4 font-inter">Or <Link href="/contact" className="text-[#cc6500] hover:underline">Send an Inquiry</Link></p>
                            </section>

                            {/* Ratings & Reviews Section */}
                            <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                                    <Star className="w-6 h-6 text-[#cc6500] fill-[#cc6500]" /> Ratings & Reviews
                                </h2>
                                <div className="flex items-center mb-6">
                                    <span className="text-4xl font-bold text-gray-900 mr-2 font-poppins">{provider.rating}</span>
                                    <div className="flex items-center mr-2">
                                        {[...Array(Math.floor(provider.rating))].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        ))}
                                        {[...Array(5 - Math.ceil(provider.rating))].map((_, i) => ( // Corrected Math.ceil usage
                                            <Star key={i} className="w-6 h-6 text-gray-300" />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 font-inter">({provider.reviewsCount} reviews)</span>
                                </div>

                                <div className="space-y-6">
                                    {provider.reviews.map((review, index) => (
                                        <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center mb-2">
                                                <img
                                                    src={`https://placehold.co/40x40/f3e5f5/9c27b0?text=${review.author.split(' ')[0][0]}${review.author.split(' ')[1][0]}`}
                                                    alt={`${review.author}'s avatar`}
                                                    className="w-10 h-10 rounded-full object-cover mr-3 shadow-sm"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/cccccc/ffffff?text=User"; }}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800 font-poppins">{review.author}</p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        ))}
                                                        {[...Array(5 - review.rating)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 text-gray-300" />
                                                        ))}
                                                        <span className="ml-2 font-inter">{review.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed font-inter">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-6 w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors font-inter">
                                    Write a Review
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}