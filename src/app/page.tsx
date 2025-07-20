"use client";

import React from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CallToActionProvider from '../components/CallToActionProvider';
import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSlider from '../components/TestimonialsSlider';
import WhyChooseFixify from '../components/WhyChooseFixify';

export default function App() {
    return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <HeroSection />
                    <FeaturedCategories />
                    <HowItWorks />
                    <WhyChooseFixify />
                    <TestimonialsSlider />
                    <CallToActionProvider />
                </main>
                <Footer />
            </div>
      
    );
}
