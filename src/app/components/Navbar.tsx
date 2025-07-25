// src/components/Navbar.tsx
"use client"; // IMPORTANT: This component uses client-side React Hooks

import React, { useState } from 'react';
import Link from 'next/link'; // IMPORTANT: For client-side navigation
import { Menu, X, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'; // Lucide Icons
import { useAuth } from '../../contexts/AuthContext'; // CORRECTED PATH: Relative to src/components

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false); // State for mobile menu
    const { isAuthenticated, userRole, logout } = useAuth(); // Consume auth context

    console.log("Navbar: Rendering. isAuthenticated:", isAuthenticated, "userRole:", userRole);

    // Determine the correct dashboard link based on the user's role
    const getDashboardLink = (role: string | null): string => { // Corrected type: role can be string or null
        switch(role) {
            case 'user': return '/dashboard';
            case 'provider': return '/provider-dashboard';
            case 'admin': return '/admin';
            default: return '/dashboard'; // Fallback link, though should ideally not be reached if authenticated
        }
    }
    // Dynamic dashboard link for the Navbar
    const dashboardLink = isAuthenticated ? getDashboardLink(userRole) : '/auth';

    return (
        <nav className="fixed w-full bg-white shadow-sm z-50 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo - links to home page */}
                <Link href="/" className="text-2xl font-bold text-[#cc6500] font-poppins">Fixify</Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/services" className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Services</Link>
                    <Link href="/about" className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">About Us</Link>

                    {/* "Become a Provider" link logic */}
                    {/* If logged in as a user, link to provider dashboard (simulating conversion) */}
                    {/* Otherwise, link to the auth page with a suggestion to sign up as provider */}
                    {isAuthenticated && userRole === 'user' ? (
                        <Link href="/provider-dashboard" className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Become a Provider</Link>
                    ) : (
                        <Link href="/auth?type=signup&role=provider" className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Become a Provider</Link>
                    )}


                    {!isAuthenticated ? (
                        // Show Login/Sign Up if not authenticated
                        <Link href="/auth" className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Login / Sign Up</Link>
                    ) : (
                        // Show Welcome message, Dashboard link, and Logout button if authenticated
                        <>
                            <span className="text-gray-700 font-inter text-sm">
                                Welcome, <span className="font-semibold capitalize">{userRole}!</span>
                            </span>
                            <Link href={dashboardLink} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">
                                Dashboard
                            </Link>
                            <button onClick={logout} className="bg-[#cc6500] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white py-4 shadow-lg">
                    <div className="flex flex-col items-center space-y-4">
                        <Link href="/services" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Services</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">About Us</Link>
                        {isAuthenticated && userRole === 'user' ? (
                            <Link href="/provider-dashboard" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Become a Provider</Link>
                        ) : (
                            <Link href="/auth?type=signup&role=provider" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Become a Provider</Link>
                        )}

                        {!isAuthenticated ? (
                            <Link href="/auth" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Login / Sign Up</Link>
                        ) : (
                            <>
                                <span className="text-gray-700 font-inter text-sm">
                                    Welcome, <span className="font-semibold capitalize">{userRole}!</span>
                                </span>
                                <Link href={dashboardLink} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">
                                    Dashboard
                                </Link>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="bg-[#cc6500] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg w-fit">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;