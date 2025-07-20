"use client";

import React from "react";

const TestimonialsSlider = () => {
    const testimonials = [
        {
            quote: "Fixify made finding a plumber incredibly easy. The service was prompt, professional, and the price was fair. Highly recommend!",
            author: "Amina B.",
            role: "Homeowner",
            avatar: "/smiley-african-woman-with-golden-earrings.jpg"
        },
        {
            quote: "I needed a last-minute deep clean, and Fixify delivered. The booking was fast, and the cleaners did a fantastic job. My home has never looked better.",
            author: "Kwame O.",
            role: "Renter",
            avatar: "/portrait-serious-man.jpg"
        },
        {
            quote: "Booking an electrician was hassle-free. The pro was knowledgeable and quickly fixed the issue. So glad I found Fixify!",
            author: "Ngozi C.",
            role: "Property Manager",
            avatar: "/close-up-shot-beautiful-hipster-transparent-glasses-casual-outfit-looks-seriously.jpg"
        },
    ];

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-poppins">
                        What Our Customers Say
                    </h2>
                    <div className="mt-2 h-1 w-20 bg-teal-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="flex-1">
                                <p className="text-gray-700 italic mb-6 font-inter leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                            <div className="flex items-center mt-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-teal-500 ring-offset-2">
                                        <img
                                            src={testimonial.avatar}
                                            alt={`Portrait of ${testimonial.author}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=teal&color=fff&size=80`;
                                            }}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-gray-800 font-poppins">{testimonial.author}</p>
                                    <p className="text-gray-500 text-sm font-inter">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSlider;