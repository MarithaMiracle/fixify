// src/components/Footer.tsx
"use client"; // IMPORTANT: This component needs to be a client component to use next/link

import React from 'react';
import Link from 'next/link'; // IMPORTANT: For client-side navigation
// Changed to Lucide icons for consistency with Navbar and other components
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#8c4700] text-white py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-full md:col-span-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-4 font-poppins">Fixify</h3>
                    <p className="text-sm text-[#ffc14d] font-inter">
                        Your trusted marketplace for booking reliable professionals for every task.
                    </p>
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Quick Links</h4>
                    <ul className="space-y-2 text-[#ffc14d] font-inter">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                        <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Follow Us</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="Facebook">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="Instagram">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="Twitter">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
                <div className="col-span-full md:col-span-1 text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Newsletter</h4>
                    <p className="text-sm text-[#ffc14d] mb-4 font-inter">Stay updated with our latest services and offers.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-grow p-3 rounded-lg bg-[#a95500] border border-[#e67300] text-white placeholder-[#ffc14d] focus:outline-none focus:ring-2 focus:ring-[#ffa500] font-inter"
                        />
                        <button className="bg-[#cc6500] text-white px-5 py-3 rounded-lg hover:bg-[#e67300] transition-colors font-semibold">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-8 pt-8 border-t border-[#a95500] text-center text-sm text-[#ffc14d] font-inter">
                &copy; {new Date().getFullYear()} Fixify. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;