"use client";

import React from 'react';

const CallToActionProvider = () => {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between bg-soft-blue p-8 md:p-12 rounded-xl shadow-lg gap-8 md:gap-12">
                    
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-poppins">
                            Become a Trusted Fixify Provider
                        </h2>
                        <p className="text-gray-700 mb-6 text-base sm:text-lg font-inter leading-relaxed">
                            Grow your business and reach more customers. Join our network of top-rated professionals today.
                        </p>
                        <button className="bg-[#cc5500] text-white font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-full hover:bg-[#cc4500] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
                            Join Fixify →
                        </button>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative">
                            <img
                                src="/carpenter-cutting-mdf-board-inside-workshop (1).jpg"
                                alt="Confident African service provider holding tools"
                                className="rounded-xl shadow-lg w-full max-w-md object-cover h-auto scale-x-[-1]"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://placehold.co/800x600/3182ce/ffffff?text=Professional+Builder";
                                }}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionProvider;