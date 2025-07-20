"use client";

import React from 'react';

import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-teal-800 text-white py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo and Description */}
                <div className="col-span-full md:col-span-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-4 font-poppins">Fixify</h3>
                    <p className="text-sm text-teal-200 font-inter">
                        Your trusted marketplace for booking reliable professionals for every task.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Quick Links</h4>
                    <ul className="space-y-2 text-teal-200 font-inter">
                        <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Follow Us</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="#" className="text-teal-200 hover:text-white transition-colors" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="#" className="text-teal-200 hover:text-white transition-colors" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="#" className="text-teal-200 hover:text-white transition-colors" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="#" className="text-teal-200 hover:text-white transition-colors" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="col-span-full md:col-span-1 text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Newsletter</h4>
                    <p className="text-sm text-teal-200 mb-4 font-inter">Stay updated with our latest services and offers.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-grow p-3 rounded-lg bg-teal-700 border border-teal-600 text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 font-inter"
                        />
                        <button className="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-500 transition-colors font-semibold font-inter">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="container mx-auto px-6 mt-8 pt-8 border-t border-teal-700 text-center text-sm text-teal-300 font-inter">
                &copy; {new Date().getFullYear()} Fixify. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;