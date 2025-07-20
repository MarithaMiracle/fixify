"use client";

import React, { useState } from 'react';

import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-white shadow-sm z-50 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <a href="/" className="text-2xl font-bold text-teal-700 font-poppins">Fixify</a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter">Services</a>
                    <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter">About Us</a>
                    <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter">Become a Provider</a>
                    <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter">Login</a>
                    <button className="bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg font-inter">
                        Sign Up
                    </button>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white py-4 shadow-lg">
                    <div className="flex flex-col items-center space-y-4">
                        <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter" onClick={() => setIsOpen(false)}>Services</a>
                        <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter" onClick={() => setIsOpen(false)}>About Us</a>
                        <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter" onClick={() => setIsOpen(false)}>Become a Provider</a>
                        <a href="#" className="text-gray-700 hover:text-teal-700 transition-colors font-inter" onClick={() => setIsOpen(false)}>Login</a>
                        <button className="bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg w-fit font-inter" onClick={() => setIsOpen(false)}>
                            Sign Up
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;