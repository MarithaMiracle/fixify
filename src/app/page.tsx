"use client";

import React from 'react';

import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import HowItWorks from './components/HowItWorks';
import WhyChooseFixify from './components/WhyChooseFixify';
import TestimonialsSlider from './components/TestimonialsSlider';
import CallToActionProvider from './components/CallToActionProvider';


export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <HeroSection />
                <FeaturedCategories />
                <HowItWorks />
                <WhyChooseFixify />
                <TestimonialsSlider />
                <CallToActionProvider />
            </main>
        </div>
    );
}