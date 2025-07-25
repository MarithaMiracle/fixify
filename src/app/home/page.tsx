"use client";

import React, { useState, useEffect } from 'react';
import {
    Menu, X, ChevronLeft, ChevronRight, Star, Home, Shirt, Utensils, HeartHandshake, Scissors,
    Laptop, Package, BookOpen, Camera, PawPrint, Mail, Phone, MapPin, Facebook, Instagram,
    Twitter, Linkedin, Lock, CalendarCheck, Search, Calendar, Check, Users, DollarSign,
    Clock, CheckCircle, User, Briefcase, Settings, ClipboardList, TrendingUp, Handshake,
    Wallet, CreditCard, Banknote, UserRoundCheck, ShieldCheck, ClipboardCheck
} from 'lucide-react';

// --- Global Styles for Canvas Environment (REMOVE IN REAL NEXT.JS PROJECT - USE globals.css) ---
const GlobalStyles = () => (
    <>
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; box-sizing: border-box; overflow-x: hidden; }
            h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
            img { max-width: 100%; height: auto; }
            /* Styling for markdown content for prose class */
            .prose h1:first-child { margin-top: 0; }
            .prose h2 { font-size: 1.875rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #333; }
            .prose h3 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: #333; }
            .prose p { margin-bottom: 1.25rem; line-height: 1.75; color: #4b5563; }
            .prose ul { list-style-type: disc; margin-left: 1.25rem; margin-bottom: 1.25rem; color: #4b5563; }
            .prose ol { list-style-type: decimal; margin-left: 1.25rem; margin-bottom: 1.25rem; color: #4b5563; }
            .prose li { margin-bottom: 0.5rem; }
            .prose a { color: #cc6500; text-decoration: underline; }
        ` }} />
    </>
);

// --- Navbar Component (Conceptually in src/components/Navbar.tsx) ---
const Navbar = ({ isAuthenticated, userRole, onLogout, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-white shadow-sm z-50 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#" onClick={() => onNavigate('home')} className="text-2xl font-bold text-[#cc6500] font-poppins">Fixify</a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <a href="#" onClick={() => onNavigate('services')} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Services</a>
                    <a href="#" onClick={() => onNavigate('about')} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">About Us</a>
                    <a href="#" onClick={() => onNavigate('become-provider')} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Become a Provider</a>

                    {!isAuthenticated ? (
                        <a href="#" onClick={() => onNavigate('login')} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Login</a>
                    ) : (
                        <>
                            <a href="#" onClick={() => onNavigate('dashboard')} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Dashboard</a>
                            <button onClick={onLogout} className="bg-[#cc6500] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
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
                        <a href="#" onClick={() => { onNavigate('services'); setIsOpen(false); }} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Services</a>
                        <a href="#" onClick={() => { onNavigate('about'); setIsOpen(false); }} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">About Us</a>
                        <a href="#" onClick={() => { onNavigate('become-provider'); setIsOpen(false); }} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Become a Provider</a>
                        {!isAuthenticated ? (
                            <a href="#" onClick={() => { onNavigate('login'); setIsOpen(false); }} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Login</a>
                        ) : (
                            <>
                                <a href="#" onClick={() => { onNavigate('dashboard'); setIsOpen(false); }} className="text-gray-700 hover:text-[#cc6500] transition-colors font-inter">Dashboard</a>
                                <button onClick={() => { onLogout(); setIsOpen(false); }} className="bg-[#cc6500] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg w-fit">
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

// --- Footer Component (Conceptually in src/components/Footer.tsx) ---
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
                        <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4 font-poppins">Follow Us</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="#" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="Facebook">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="Instagram">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="Twitter">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-[#ffc14d] hover:text-white transition-colors" aria-label="LinkedIn">
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


// --- Login Page Component (Conceptually in src/app/login/page.tsx) ---
const LoginPage = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState('user');

    const handleLogin = () => {
        onLogin(selectedRole);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 font-poppins">
                        Welcome to Fixify
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 font-inter">
                        Please select your role to continue
                    </p>
                </div>
                <div className="flex justify-center space-x-4 mb-6">
                    <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 ease-in-out">
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={selectedRole === 'user'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-radio text-[#cc6500] h-5 w-5"
                        />
                        <span className="text-gray-700 font-inter flex items-center gap-1">
                            <User className="w-5 h-5" /> User
                        </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 ease-in-out">
                        <input
                            type="radio"
                            name="role"
                            value="provider"
                            checked={selectedRole === 'provider'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-radio text-[#cc6500] h-5 w-5"
                        />
                        <span className="text-gray-700 font-inter flex items-center gap-1">
                            <Briefcase className="w-5 h-5" /> Provider
                        </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 ease-in-out">
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={selectedRole === 'admin'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-radio text-[#cc6500] h-5 w-5"
                        />
                        <span className="text-gray-700 font-inter flex items-center gap-1">
                            <Settings className="w-5 h-5" /> Admin
                        </span>
                    </label>
                </div>
                <button
                    type="submit"
                    onClick={handleLogin}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#cc6500] hover:bg-[#a95500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc6500] font-inter transition-all duration-200 ease-in-out shadow-md"
                >
                    Simulate Login
                </button>
            </div>
        </div>
    );
};

// --- Home Page Component (Conceptually in src/app/page.tsx) ---
const HomePage = ({ onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <section className="relative bg-gradient-to-br from-[#f0f8ff] to-[#f5f5fc] py-20 md:py-32 flex items-center justify-center min-h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        {/* Placeholder for abstract illustration/blobs, actual animation requires tailwind.config.js */}
                        <div className="absolute w-64 h-64 bg-[#80CBC4] rounded-full mix-blend-multiply filter blur-xl opacity-70 top-10 left-10 md:w-96 md:h-96"></div>
                        <div className="absolute w-64 h-64 bg-[#FFAB91] rounded-full mix-blend-multiply filter blur-xl opacity-70 bottom-10 right-10 md:w-96 md:h-96"></div>
                        <div className="absolute w-64 h-64 bg-[#B0E0E6] rounded-full mix-blend-multiply filter blur-xl opacity-70 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-96 md:h-96"></div>
                    </div>
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 font-poppins">
                            Need a hand? <br className="md:hidden"/> Book trusted pros near you in seconds.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-inter">
                            Find reliable professionals for plumbing, makeup, catering, tailoring, and more, right here in Nigeria.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => onNavigate('booking')} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
                                Book a Service
                            </button>
                            <button onClick={() => onNavigate('services')} className="bg-white text-[#cc6500] border-2 border-[#cc6500] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#f0f8ff] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 font-inter">
                                Find Talent
                            </button>
                        </div>
                    </div>
                </section>

                {/* Featured Categories */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-poppins">Our Popular Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: "Home & Repairs", icon: <Home className="w-12 h-12" />, description: "Experienced handymen for home repairs big or small." },
                                { name: "Electrical Work", icon: <Laptop className="w-12 h-12" />, description: "Certified electricians for installations, repairs, and safety checks." },
                                { name: "Deep Cleaning", icon: <Shirt className="w-12 h-12" />, description: "Thorough cleaning services for your home. Get a sparkling clean space." },
                                { name: "Appliance Repair", icon: <Utensils className="w-12 h-12" />, description: "Expert technicians for refrigerators, washing machines, ovens." },
                                { name: "Painting Services", icon: <Scissors className="w-12 h-12" />, description: "Professional painters for interior and exterior jobs." },
                                { name: "Plumbing", icon: <Package className="w-12 h-12" />, description: "Reliable plumbers for drain cleaning, pipe repairs, and fixture installations." },
                                { name: "Beauty & Grooming", icon: <HeartHandshake className="w-12 h-12" />, description: "Makeup artists, barbers, hairstylists." },
                                { name: "Catering & Events", icon: <Utensils className="w-12 h-12" />, description: "Event planners, caterers, decorators." },
                            ].map((category, index) => (
                                <div
                                    key={index}
                                    className="category-card bg-white p-8 rounded-xl shadow-md transition-all duration-300 ease-in-out text-center border border-gray-100
                                               hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="flex justify-center mb-4 text-[#cc6500] text-5xl">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{category.name}</h3>
                                    <p className="text-gray-600 mb-4 font-inter">{category.description}</p>
                                    <a href="#" onClick={() => onNavigate('services')} className="text-[#cc6500] font-semibold hover:text-[#a95500] transition-colors font-inter">Learn More →</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 font-poppins">How Fixify Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: <Search className="w-16 h-16" />, title: "1. Find Your Pro", description: "Browse verified professionals by service, location, and ratings." },
                                { icon: <Calendar className="w-16 h-16" />, title: "2. Book in Seconds", description: "Select your service, choose a time, and confirm your booking instantly." },
                                { icon: <Check className="w-16 h-16" />, title: "3. Get it Done", description: "Your trusted pro arrives and completes the job to your satisfaction." },
                            ].map((step, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                    <div className="flex justify-center mb-4 text-[#cc6500] text-6xl">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{step.title}</h3>
                                    <p className="text-gray-600 font-inter">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Fixify */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-poppins">Why Choose Fixify?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    image: "https://placehold.co/600x400/E0F2F7/000000?text=Trusted+Pros",
                                    alt: "A woman using a mobile phone to book a service",
                                    title: "Trusted Professionals",
                                    description: "We rigorously vet all service providers to ensure you receive top-quality and trustworthy service.",
                                    icon: <Users className="w-6 h-6" />
                                },
                                {
                                    image: "https://placehold.co/600x400/E6E6FA/000000?text=Transparent+Pricing",
                                    alt: "A magnifying glass over a document showing a price tag",
                                    title: "Transparent Pricing",
                                    description: "No hidden fees. See upfront pricing and detailed quotes before you book, ensuring complete transparency.",
                                    icon: <DollarSign className="w-6 h-6" />
                                },
                                {
                                    image: "https://placehold.co/600x400/FF7F50/000000?text=Easy+Booking",
                                    alt: "A person booking a service on their laptop at home",
                                    title: "Easy Online Booking",
                                    description: "Book any service anytime through our intuitive platform. Schedule at your convenience, 24/7.",
                                    icon: <Clock className="w-6 h-6" />
                                },
                                {
                                    image: "https://placehold.co/600x400/00796B/FFFFFF?text=Dedicated+Support",
                                    alt: "A friendly customer support agent with a headset on",
                                    title: "Dedicated Support",
                                    description: "Our support team is always ready to assist you. Get help whenever you need it, ensuring a smooth experience.",
                                    icon: <CheckCircle className="w-6 h-6" />
                                },
                            ].map((prop, index) => (
                                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
                                    <img
                                        src={prop.image}
                                        alt={prop.alt}
                                        className="w-full h-64 object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image"; }}
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins flex items-center gap-2">
                                            <span className="text-[#cc6500] text-2xl">{prop.icon}</span> {prop.title}
                                        </h3>
                                        <p className="text-gray-600 font-inter">{prop.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 font-poppins">What Our Customers Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "Fixify made finding a plumber incredibly easy. The service was prompt, professional, and the price was fair. Highly recommend!",
                                    author: "Sarah J.",
                                    role: "Homeowner",
                                    avatar: "https://placehold.co/80x80/e0f2f7/000000?text=SJ"
                                },
                                {
                                    quote: "I needed a last-minute deep clean, and Fixify delivered. The booking was fast, and the cleaners did a fantastic job. My home has never looked better.",
                                    author: "Mark T.",
                                    role: "Renter",
                                    avatar: "https://placehold.co/80x80/f0e0f7/000000?text=MT"
                                },
                                {
                                    quote: "Booking an electrician was hassle-free. The pro was knowledgeable and quickly fixed the issue. So glad I found Fixify!",
                                    author: "Emily R.",
                                    role: "Property Manager",
                                    avatar: "https://placehold.co/80x80/e7f7e0/000000?text=ER"
                                },
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                    <p className="text-gray-700 italic mb-4 font-inter">"{testimonial.quote}"</p>
                                    <div className="flex items-center mt-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={`Portrait of ${testimonial.author}`}
                                            className="w-12 h-12 rounded-full object-cover mr-4 shadow-sm"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/cccccc/ffffff?text=User"; }}
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800 font-poppins">{testimonial.author}</p>
                                            <p className="text-gray-500 text-sm font-inter">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action for Providers */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between bg-[#f0f8ff] p-12 rounded-xl shadow-lg">
                            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-poppins">Become a Trusted Fixify Provider</h2>
                                <p className="text-gray-700 mb-6 text-lg font-inter">Grow your business and reach more customers. Join our network of top-rated professionals today.</p>
                                <button onClick={() => onNavigate('become-provider')} className="bg-[#cc6500] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
                                    Join Fixify →
                                </button>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <img
                                    src="https://placehold.co/600x400/00796B/FFFFFF?text=Service+Provider"
                                    alt="A confident service provider holding tools"
                                    className="rounded-xl shadow-lg w-full max-w-sm object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Provider+Image"; }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

// --- Service Categories Page Component (Conceptually in src/app/services/page.tsx) ---
const ServiceCategoriesPage = ({ onNavigate }) => {
    const categories = [
        { name: "Home & Repairs", icon: <Home className="w-10 h-10" />, description: "Plumbing, electrical, painting, etc." },
        { name: "Cleaning & Laundry", icon: <Shirt className="w-10 h-10" />, description: "Dry cleaning, home cleaning, post-construction cleanup." },
        { name: "Catering & Events", icon: <Utensils className="w-10 h-10" />, description: "Event planners, caterers, decorators." },
        { name: "Beauty & Grooming", icon: <HeartHandshake className="w-10 h-10" />, description: "Makeup artists, barbers, hairstylists." },
        { name: "Fashion & Tailoring", icon: <Scissors className="w-10 h-10" />, description: "Custom tailoring, outfit designers, alterations." },
        { name: "Tech & Installations", icon: <Laptop className="w-10 h-10" />, description: "CCTV, network setup, computer repair." },
        { name: "Errands & Logistics", icon: <Package className="w-10 h-10" />, description: "Dispatch, errands, parcel delivery." },
        { name: "Tutors & Trainers", icon: <BookOpen className="w-10 h-10" />, description: "Home tutors, skill trainers, coaches." },
        { name: "Media & Creativity", icon: <Camera className="w-10 h-10" />, description: "Photography, videography, content creators." },
        { name: "Lifestyle & Pet Care", icon: <PawPrint className="w-10 h-10" />, description: "Pet grooming, home spa, wellness." },
    ];

    const subCategories = {
        "Home & Repairs": ["Plumbing", "Electrical", "Painting", "Carpentry"],
        "Cleaning & Laundry": ["Home Cleaning", "Dry Cleaning", "Office Cleaning"],
        "Catering & Events": ["Event Planning", "Catering", "Decorations"],
    };

    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (categoryName) => {
        setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-16 pb-12 bg-gray-50">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12 font-poppins">Explore Our Services</h1>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar with Filters */}
                        <aside className="md:w-1/4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 font-poppins">Categories</h2>
                            <ul className="space-y-4">
                                {Object.keys(subCategories).map((categoryName, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => toggleCategory(categoryName)}
                                            className="w-full text-left flex justify-between items-center text-gray-700 hover:text-[#cc6500] font-semibold font-inter py-2"
                                        >
                                            {categoryName}
                                            {expandedCategory === categoryName ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                        {expandedCategory === categoryName && (
                                            <ul className="pl-4 mt-2 space-y-1">
                                                {subCategories[categoryName].map((sub, subIndex) => (
                                                    <li key={subIndex}>
                                                        <a href="#" onClick={() => onNavigate('search-results')} className="block text-gray-600 hover:text-[#a95500] font-inter py-1">
                                                            {sub}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                                {/* Add non-expandable categories here if needed */}
                                <li>
                                    <a href="#" onClick={() => onNavigate('search-results')} className="block text-gray-700 hover:text-[#cc6500] font-semibold font-inter py-2">
                                        All Services
                                    </a>
                                </li>
                            </ul>
                        </aside>

                        {/* Main Content Area (Category Cards Grid) */}
                        <section className="md:w-3/4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col items-center text-center border border-gray-100"
                                    >
                                        <div className="text-[#cc6500] mb-4 text-5xl">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">{category.name}</h3>
                                        <p className="text-gray-600 text-sm font-inter">{category.description}</p>
                                        <a href="#" onClick={() => onNavigate('search-results')} className="mt-4 text-[#cc6500] font-semibold hover:text-[#a95500] transition-colors font-inter">Explore Services →</a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
    );
};

// --- Search & Results Page Component (Conceptually in src/app/search/page.tsx) ---
const SearchResultsPage = ({ onNavigate }) => {
    const providers = [
        {
            id: 'sarah-adebayo',
            name: "Sarah Adebayo",
            category: "Professional Makeup Artist",
            rating: 4.9,
            reviews: 120,
            price: "₦15,000",
            avatar: "https://placehold.co/80x80/ffe4b5/000000?text=SA",
            badges: ["Verified", "Top-Rated"]
        },
        {
            id: 'john-doe',
            name: "John Doe",
            category: "Expert Plumber",
            rating: 4.7,
            reviews: 95,
            price: "₦8,000",
            avatar: "https://placehold.co/80x80/add8e6/000000?text=JD",
            badges: ["Verified"]
        },
        {
            id: 'emily-williams',
            name: "Emily Williams",
            category: "Certified Electrician",
            rating: 4.8,
            reviews: 150,
            price: "₦10,000",
            avatar: "https://placehold.co/80x80/90ee90/000000?text=EW",
            badges: ["Verified", "Top-Rated"]
        },
        {
            id: 'chinedu-okoro',
            name: "Chinedu Okoro",
            category: "Home Deep Cleaner",
            rating: 4.5,
            reviews: 70,
            price: "₦5,000",
            avatar: "https://placehold.co/80x80/dda0dd/000000?text=CO",
            badges: []
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-16 pb-12 bg-gray-50">
                <div className="container mx-auto px-6 py-8">
                    {/* Search Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-grow w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for a service (e.g., plumbing, makeup)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                />
                            </div>
                        </div>
                        <div className="flex-grow w-full md:w-auto">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Location (e.g., Lagos, Abuja)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                />
                            </div>
                        </div>
                        <button className="bg-[#cc6500] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md w-full md:w-auto">
                            Search
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <aside className="md:w-1/4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 font-poppins">Filters</h2>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 font-poppins">Price Range</h3>
                                <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-[#cc6500]" />
                                <div className="flex justify-between text-sm text-gray-600 mt-2 font-inter">
                                    <span>₦1,000</span>
                                    <span>₦50,000+</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 font-poppins">Rating</h3>
                                <div className="space-y-2 font-inter">
                                    <label className="flex items-center">
                                        <input type="radio" name="rating" className="form-radio text-[#cc6500]" />
                                        <span className="ml-2 flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" /> 4 Stars & Up</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="rating" className="form-radio text-[#cc6500]" />
                                        <span className="ml-2 flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" /> 3 Stars & Up</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="rating" className="form-radio text-[#cc6500]" />
                                        <span className="ml-2 flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" /> Any Rating</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 font-poppins">Availability</h3>
                                <input type="date" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" />
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 font-poppins">Gender Preference</h3>
                                <div className="space-y-2 font-inter">
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" className="form-radio text-[#cc6500]" />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" className="form-radio text-[#cc6500]" />
                                        <span className="ml-2">Female</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" className="form-radio text-[#cc6500]" />
                                        <span className="ml-2">Any</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="bg-[#cc6500] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md w-full font-inter">
                                    Apply Filters
                                </button>
                                <button className="bg-white text-[#cc6500] border border-[#cc6500] px-6 py-3 rounded-lg font-semibold hover:bg-[#f0f8ff] transition-colors w-full font-inter">
                                    Clear All
                                </button>
                            </div>
                        </aside>

                        {/* Provider Cards List */}
                        <section className="md:w-3/4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">{providers.length} Results Found</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {providers.map((provider) => (
                                    <div key={provider.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center">
                                        <img
                                            src={provider.avatar}
                                            alt={provider.name}
                                            className="w-24 h-24 rounded-full object-cover mr-6 mb-4 sm:mb-0 shadow-sm"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/cccccc/ffffff?text=Pro"; }}
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-semibold text-gray-800 font-poppins">{provider.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2 font-inter">{provider.category}</p>
                                            <div className="flex items-center mb-3">
                                                {[...Array(Math.floor(provider.rating))].map((_, i) => (
                                                    <Star key={i} className="text-yellow-500 w-4 h-4 fill-current" />
                                                ))}
                                                {[...Array(5 - Math.floor(provider.rating))].map((_, i) => (
                                                    <Star key={i} className="text-gray-300 w-4 h-4" />
                                                ))}
                                                <span className="ml-2 text-gray-600 text-sm font-inter">
                                                    {provider.rating} ({provider.reviews} reviews)
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {provider.badges.map((badge, i) => (
                                                    <span key={i} className="bg-[#e6f0ff] text-[#2563eb] text-xs font-medium px-2.5 py-0.5 rounded-full font-inter">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-800 text-lg font-bold font-poppins">Starting From: {provider.price}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:ml-auto">
                                            <button onClick={() => onNavigate('provider-profile', provider.id)} className="bg-[#cc6500] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Provider Profile Page Component (Conceptually in src/app/providers/[id]/page.tsx) ---
const ProviderProfilePage = ({ providerId, onNavigate }) => {
    // Dummy provider data - in a real app, you'd fetch this based on providerId
    const provider = {
        id: providerId,
        name: "Sarah Adebayo",
        category: "Professional Makeup Artist",
        location: "Lagos, Nigeria",
        rating: 4.9,
        reviews: 120,
        bio: "Experienced and passionate makeup artist with over 7 years in the industry. Specializing in bridal, editorial, and special occasion makeup. My goal is to enhance natural beauty and make every client feel confident and beautiful. Available for bookings across Lagos and nearby states.",
        services: [
            { name: "Bridal Makeup", price: "₦35,000 - ₦75,000" },
            { name: "Engagement Makeup", price: "₦25,000 - ₦50,000" },
            { name: "Photoshoot Makeup", price: "₦20,000 - ₦40,000" },
            { name: "Special Occasion Makeup", price: "₦15,000 - ₦30,000" },
            { name: "Makeup Consultation", price: "₦5,000" },
        ],
        gallery: [
            "https://placehold.co/600x400/FFD700/000000?text=Work+1",
            "https://placehold.co/600x400/FFA500/000000?text=Work+2",
            "https://placehold.co/600x400/FF7F50/000000?text=Work+3",
            "https://placehold.co/600x400/FF6347/000000?text=Work+4",
        ],
        testimonials: [
            { name: "Grace O.", rating: 5, date: "2024-06-15", comment: "Sarah is amazing! She transformed me for my wedding day. Highly professional and talented." },
            { name: "Tunde B.", rating: 5, date: "2024-05-20", comment: "Excellent service. My wife loved her birthday makeup. Very punctual." },
            { name: "Ngozi E.", rating: 4, date: "2024-04-10", comment: "Good service, but communication could be a bit faster. Overall happy with the result." },
        ],
        workingHours: "Mon-Sat: 9 AM - 6 PM",
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-16 pb-12 bg-gray-50">
                <div className="container mx-auto px-6 py-8">
                    {/* Header Section */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center md:items-start mb-8">
                        <img
                            src={provider.avatar || "https://placehold.co/120x120/cccccc/ffffff?text=Pro"}
                            alt={provider.name}
                            className="w-32 h-32 rounded-full object-cover mr-0 md:mr-8 mb-6 md:mb-0 shadow-md border-4 border-white"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x120/cccccc/ffffff?text=Pro"; }}
                        />
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins">{provider.name}</h1>
                            <p className="text-xl text-[#cc6500] font-semibold mb-2 font-inter">{provider.category}</p>
                            <p className="text-gray-600 mb-3 font-inter flex items-center justify-center md:justify-start">
                                <MapPin className="w-5 h-5 mr-1 text-gray-500" /> {provider.location}
                            </p>
                            <div className="flex items-center justify-center md:justify-start mb-4">
                                {[...Array(Math.floor(provider.rating))].map((_, i) => (
                                    <Star key={i} className="text-yellow-500 w-5 h-5 fill-current" />
                                ))}
                                {[...Array(5 - Math.floor(provider.rating))].map((_, i) => (
                                    <Star key={i} className="text-gray-300 w-5 h-5" />
                                ))}
                                <span className="ml-2 text-gray-700 font-inter">
                                    {provider.rating} ({provider.reviews} reviews)
                                </span>
                            </div>
                            <button onClick={() => onNavigate('booking')} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 font-inter">
                                Book Now
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - About, Services, Gallery */}
                        <div className="lg:w-2/3 space-y-8">
                            <section className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">About Me</h2>
                                <p className="text-gray-700 leading-relaxed font-inter">{provider.bio}</p>
                            </section>

                            <section className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Services Offered</h2>
                                <ul className="space-y-4">
                                    {provider.services.map((service, index) => (
                                        <li key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                                            <span className="text-lg font-inter text-gray-700">{service.name}</span>
                                            <span className="text-lg font-semibold text-gray-900 font-poppins">{service.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">My Portfolio</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {provider.gallery.map((imgSrc, index) => (
                                        <img
                                            key={index}
                                            src={imgSrc}
                                            alt={`Work ${index + 1}`}
                                            className="w-full h-32 md:h-48 object-cover rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Portfolio"; }}
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Booking Card, Reviews */}
                        <div className="lg:w-1/3 space-y-8">
                            {/* Booking Card (sticky on desktop) */}
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 lg:sticky lg:top-24">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Ready to Book?</h2>
                                <p className="text-gray-700 mb-4 font-inter">
                                    Available: <span className="font-semibold">{provider.workingHours}</span>
                                </p>
                                <button onClick={() => onNavigate('booking')} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg w-full font-inter">
                                    Book Now
                                </button>
                                <button className="mt-4 bg-white text-[#cc6500] border-2 border-[#cc6500] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#f0f8ff] transition-all duration-300 ease-in-out shadow-md w-full font-inter">
                                    Send Inquiry
                                </button>
                            </div>

                            {/* Ratings & Reviews */}
                            <section className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Ratings & Reviews ({provider.reviews})</h2>
                                {/* Summary (simplified) */}
                                <div className="flex items-center mb-6">
                                    <span className="text-4xl font-bold text-gray-900 mr-2 font-poppins">{provider.rating}</span>
                                    <div className="flex">
                                        {[...Array(Math.floor(provider.rating))].map((_, i) => (
                                            <Star key={i} className="text-yellow-500 w-6 h-6 fill-current" />
                                        ))}
                                        {[...Array(5 - Math.floor(provider.rating))].map((_, i) => (
                                            <Star key={i} className="text-gray-300 w-6 h-6" />
                                        ))}
                                    </div>
                                </div>

                                {/* Individual Reviews */}
                                <div className="space-y-6">
                                    {provider.testimonials.map((testimonial, index) => (
                                        <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-800 font-poppins">{testimonial.name}</span>
                                                <div className="flex">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="text-yellow-500 w-4 h-4 fill-current" />
                                                    ))}
                                                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="text-gray-300 w-4 h-4" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 font-inter">{testimonial.comment}</p>
                                            <span className="text-gray-500 text-xs font-inter">{testimonial.date}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-6 bg-white text-[#cc6500] border border-[#cc6500] px-6 py-3 rounded-full font-semibold hover:bg-[#f0f8ff] transition-colors w-full font-inter">
                                    Write a Review
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Booking Flow Pages (Conceptually in src/components/booking/steps/ & src/components/booking/) ---
const BookingProgressBar = ({ currentStep }) => {
    const steps = ["Service", "Time", "Details", "Payment", "Confirm"];
    return (
        <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300
                        ${index + 1 <= currentStep ? 'bg-[#cc6500]' : 'bg-gray-300'}`}>
                        {index + 1}
                    </div>
                    <span className={`mt-2 text-sm font-semibold font-inter ${index + 1 <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>
                        {step}
                    </span>
                </div>
            ))}
        </div>
    );
};

const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
                <CheckCircle className="w-20 h-20 text-[#22c55e] mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Booking Confirmed!</h2>
                <p className="text-gray-700 mb-6 font-inter">Your service has been successfully booked with Fixify.</p>

                <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 text-sm font-inter">
                    <p className="mb-2"><strong>Service:</strong> {bookingDetails.serviceCategory || 'N/A'}</p>
                    <p className="mb-2"><strong>Description:</strong> {bookingDetails.serviceDescription || 'N/A'}</p>
                    <p className="mb-2"><strong>Date:</strong> {bookingDetails.date || 'N/A'}</p>
                    <p className="mb-2"><strong>Time:</strong> {bookingDetails.time || 'N/A'}</p>
                    <p className="mb-2"><strong>Address:</strong> {bookingDetails.address || 'N/A'}</p>
                    <p className="mb-2"><strong>Contact:</strong> {bookingDetails.contactEmail || 'N/A'} / {bookingDetails.contactPhone || 'N/A'}</p>
                    <p><strong>Payment Method:</strong> {bookingDetails.paymentMethod || 'N/A'}</p>
                </div>

                <button
                    onClick={onClose}
                    className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md w-full font-inter"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

const Step1SelectService = ({ bookingData, setBookingData, onNext }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="serviceCategory" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Choose Service Category</label>
            <select
                id="serviceCategory"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                value={bookingData.serviceCategory || ''}
                onChange={(e) => setBookingData({ ...bookingData, serviceCategory: e.target.value })}
            >
                <option value="">Select a category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Makeup">Makeup</option>
                <option value="Home Cleaning">Home Cleaning</option>
                <option value="Tailoring">Tailoring</option>
                <option value="Catering">Catering</option>
            </select>
        </div>
        <div>
            <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Describe Your Task (Optional)</label>
            <textarea
                id="serviceDescription"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                placeholder="e.g., Leaky faucet in kitchen, needs fixing urgently. Or, need bridal makeup for July 25th."
                value={bookingData.serviceDescription || ''}
                onChange={(e) => setBookingData({ ...bookingData, serviceDescription: e.target.value })}
            ></textarea>
        </div>

        {/* Coupon Section */}
        <div className="mt-4">
            <button
                className="text-[#cc6500] text-sm font-semibold hover:underline font-inter"
                onClick={() => setBookingData(prev => ({ ...prev, showCoupon: !prev.showCoupon }))}
            >
                {bookingData.showCoupon ? 'Hide Coupon Section' : 'Have a Coupon Code?'}
            </button>
            {bookingData.showCoupon && (
                <div className="mt-3 flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                        value={bookingData.couponCode || ''}
                        onChange={(e) => setBookingData({ ...bookingData, couponCode: e.target.value })}
                    />
                    <button className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors font-inter">Apply</button>
                </div>
            )}
        </div>

        <div className="flex justify-end pt-6">
            <button onClick={onNext} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                Next Step
            </button>
        </div>
    </div>
);

const Step2ChooseDateTime = ({ bookingData, setBookingData, onPrevious, onNext }) => {
    const timeSlots = [
        "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
        "5:00 PM", "6:00 PM"
    ];

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="bookingDate" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Select Date</label>
                <input
                    type="date"
                    id="bookingDate"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                    value={bookingData.date || ''}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Choose Time Slot</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map(slot => (
                        <button
                            key={slot}
                            className={`p-3 rounded-lg border transition-all duration-200 ease-in-out font-inter
                                ${bookingData.time === slot
                                    ? 'bg-[#cc6500] text-white border-[#cc6500] shadow-md'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                }`}
                            onClick={() => setBookingData({ ...bookingData, time: slot })}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-between pt-6">
                <button onClick={onPrevious} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors font-inter">
                    <ChevronLeft className="w-5 h-5 inline-block mr-2" /> Previous
                </button>
                <button onClick={onNext} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                    Next Step <ChevronRight className="w-5 h-5 inline-block ml-2" />
                </button>
            </div>
        </div>
    );
};

const Step3EnterDetails = ({ bookingData, setBookingData, onPrevious, onNext }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Service Address</label>
            <input
                type="text"
                id="address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                placeholder="e.g., 123 Main St, Apt 4B"
                value={bookingData.address || ''}
                onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
            />
        </div>
        <div>
            <label htmlFor="city" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">City</label>
            <input
                type="text"
                id="city"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                placeholder="e.g., Lagos"
                value={bookingData.city || ''}
                onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
            />
        </div>
        <div>
            <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Contact Email</label>
            <input
                type="email"
                id="contactEmail"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                placeholder="youremail@example.com"
                value={bookingData.contactEmail || ''}
                onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
            />
        </div>
        <div>
            <label htmlFor="contactPhone" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Contact Phone</label>
            <input
                type="tel"
                id="contactPhone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                placeholder="e.g., +234 801 234 5678"
                value={bookingData.contactPhone || ''}
                onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
            />
        </div>
        <div className="flex justify-between pt-6">
            <button onClick={onPrevious} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors font-inter">
                <ChevronLeft className="w-5 h-5 inline-block mr-2" /> Previous
            </button>
            <button onClick={onNext} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                Next Step <ChevronRight className="w-5 h-5 inline-block ml-2" />
            </button>
        </div>
    </div>
);

const Step4PaymentOptions = ({ bookingData, setBookingData, onPrevious, onNext }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 font-poppins">Choose Payment Method</h3>
            <div className="space-y-4">
                <label className={`block p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                    ${bookingData.paymentMethod === 'Paystack' ? 'border-[#cc6500] ring-2 ring-[#cc6500] bg-[#fff0e6]' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Paystack"
                        checked={bookingData.paymentMethod === 'Paystack'}
                        onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                        className="form-radio text-[#cc6500] h-5 w-5"
                    />
                    <span className="ml-3 text-gray-800 font-semibold font-inter flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Pay with Paystack
                    </span>
                </label>
                <label className={`block p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                    ${bookingData.paymentMethod === 'Flutterwave' ? 'border-[#cc6500] ring-2 ring-[#cc6500] bg-[#fff0e6]' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Flutterwave"
                        checked={bookingData.paymentMethod === 'Flutterwave'}
                        onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                        className="form-radio text-[#cc6500] h-5 w-5"
                    />
                    <span className="ml-3 text-gray-800 font-semibold font-inter flex items-center gap-2">
                        <Banknote className="w-5 h-5" /> Pay with Flutterwave
                    </span>
                </label>
                <label className={`block p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                    ${bookingData.paymentMethod === 'Fixify Wallet' ? 'border-[#cc6500] ring-2 ring-[#cc6500] bg-[#fff0e6]' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Fixify Wallet"
                        checked={bookingData.paymentMethod === 'Fixify Wallet'}
                        onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                        className="form-radio text-[#cc6500] h-5 w-5"
                    />
                    <span className="ml-3 text-gray-800 font-semibold font-inter flex items-center gap-2">
                        <Wallet className="w-5 h-5" /> Use Fixify Wallet (Balance: ₦5,200)
                    </span>
                </label>
            </div>
        </div>
        <div className="flex justify-between pt-6">
            <button onClick={onPrevious} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors font-inter">
                <ChevronLeft className="w-5 h-5 inline-block mr-2" /> Previous
            </button>
            <button onClick={onNext} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                Next Step <ChevronRight className="w-5 h-5 inline-block ml-2" />
            </button>
        </div>
    </div>
);

const Step5ConfirmSummary = ({ bookingData, onPrevious, onConfirm }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 font-poppins">Booking Summary</h3>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-100 space-y-3">
            <p className="text-gray-700 font-inter"><strong>Service Category:</strong> {bookingData.serviceCategory || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Service Description:</strong> {bookingData.serviceDescription || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Date:</strong> {bookingData.date || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Time:</strong> {bookingData.time || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Address:</strong> {bookingData.address || 'N/A'}, {bookingData.city || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Contact Email:</strong> {bookingData.contactEmail || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Contact Phone:</strong> {bookingData.contactPhone || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Payment Method:</strong> {bookingData.paymentMethod || 'N/A'}</p>
            <p className="text-gray-700 font-inter"><strong>Coupon Code:</strong> {bookingData.couponCode || 'N/A'}</p>
            <div className="pt-4 border-t border-gray-200 mt-4">
                <p className="text-gray-900 text-xl font-bold font-poppins">Estimated Total: ₦12,500</p>
            </div>
        </div>
        <div className="flex justify-between pt-6">
            <button onClick={onPrevious} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors font-inter">
                <ChevronLeft className="w-5 h-5 inline-block mr-2" /> Previous
            </button>
            <button onClick={onConfirm} className="bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                Confirm Booking
            </button>
        </div>
    </div>
);

const BookingFlowPage = ({ onNavigate }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleConfirmBooking = () => {
        // In a real app: send bookingData to backend API, handle payment etc.
        console.log("Booking Confirmed:", bookingData);
        setShowConfirmationModal(true);
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setCurrentStep(1); // Reset to first step
        setBookingData({}); // Clear booking data
        onNavigate('dashboard'); // Optionally navigate to user dashboard after booking
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1SelectService bookingData={bookingData} setBookingData={setBookingData} onNext={handleNext} />;
            case 2:
                return <Step2ChooseDateTime bookingData={bookingData} setBookingData={setBookingData} onPrevious={handlePrevious} onNext={handleNext} />;
            case 3:
                return <Step3EnterDetails bookingData={bookingData} setBookingData={setBookingData} onPrevious={handlePrevious} onNext={handleNext} />;
            case 4:
                return <Step4PaymentOptions bookingData={bookingData} setBookingData={setBookingData} onPrevious={handlePrevious} onNext={handleNext} />;
            case 5:
                return <Step5ConfirmSummary bookingData={bookingData} onPrevious={handlePrevious} onConfirm={handleConfirmBooking} />;
            default:
                return <Step1SelectService bookingData={bookingData} setBookingData={setBookingData} onNext={handleNext} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-16 pb-12 bg-gray-50">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12 font-poppins">Book Your Service</h1>
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <BookingProgressBar currentStep={currentStep} />
                        {renderStep()}
                    </div>
                </div>
            </main>
            <BookingConfirmationModal
                isOpen={showConfirmationModal}
                onClose={handleCloseConfirmationModal}
                bookingDetails={bookingData}
            />
        </div>
    );
};

// --- User Dashboard Page Component (Conceptually in src/app/dashboard/user/page.tsx) ---
const UserDashboardPage = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState('upcoming');

    const renderContent = () => {
        switch (activeSection) {
            case 'upcoming':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Upcoming Bookings</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">Plumbing Repair - Leaky Faucet</h3>
                            <p className="text-gray-600 font-inter">With John Doe (Expert Plumber)</p>
                            <p className="text-gray-600 font-inter mb-3">Date: August 1, 2025 at 10:00 AM</p>
                            <span className="bg-[#e6f0ff] text-[#2563eb] text-xs font-medium px-2.5 py-0.5 rounded-full font-inter">Confirmed</span>
                            <div className="flex gap-4 mt-4">
                                <button className="bg-[#cc6500] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] font-inter">View Details</button>
                                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 font-inter">Cancel</button>
                            </div>
                        </div>
                        <p className="text-gray-500 text-center font-inter">No more upcoming bookings.</p>
                    </div>
                );
            case 'past':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Past Bookings</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">Home Deep Cleaning</h3>
                            <p className="text-gray-600 font-inter">With CleanSweep Services</p>
                            <p className="text-gray-600 font-inter mb-3">Date: July 10, 2025</p>
                            <span className="bg-[#dcfce7] text-[#16a34a] text-xs font-medium px-2.5 py-0.5 rounded-full font-inter">Completed</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">Laptop Screen Repair</h3>
                            <p className="text-gray-600 font-inter">With TechFix Pros</p>
                            <p className="text-gray-600 font-inter mb-3">Date: June 22, 2025</p>
                            <span className="bg-[#dcfce7] text-[#16a34a] text-xs font-medium px-2.5 py-0.5 rounded-full font-inter">Completed</span>
                        </div>
                    </div>
                );
            case 'saved':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Saved Providers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
                                <img src="https://placehold.co/60x60/ffe4b5/000000?text=SA" alt="Sarah Adebayo" className="w-16 h-16 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 font-poppins">Sarah Adebayo</h3>
                                    <p className="text-gray-600 text-sm font-inter">Makeup Artist</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
                                <img src="https://placehold.co/60x60/add8e6/000000?text=JD" alt="John Doe" className="w-16 h-16 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 font-poppins">John Doe</h3>
                                    <p className="text-gray-600 text-sm font-inter">Plumber</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'wallet':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">My Wallet</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                            <p className="text-gray-600 text-lg mb-2 font-inter">Current Balance:</p>
                            <p className="text-5xl font-bold text-[#cc6500] font-poppins mb-6">₦8,500</p>
                            <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                Add Funds
                            </button>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Update Profile</h2>
                        <form className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Full Name</label>
                                <input type="text" id="name" defaultValue="Jane Doe" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Email Address</label>
                                <input type="email" id="email" defaultValue="jane.doe@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Phone Number</label>
                                <input type="tel" id="phone" defaultValue="+2348012345678" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Address</label>
                                <input type="text" id="address" defaultValue="123 Example St, Lagos" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" />
                            </div>
                            <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                Save Changes
                            </button>
                        </form>
                    </div>
                );
            case 'payment-history':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Payment History</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 font-inter">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-07-01</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Deep Cleaning</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦5,000</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Completed</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-06-22</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Laptop Repair</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦8,000</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Completed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-16 pb-12 bg-gray-50">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-8">My Dashboard</h1>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="lg:w-1/4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div className="flex items-center mb-6">
                                <img src="https://placehold.co/80x80/cccccc/ffffff?text=User" alt="User Profile" className="w-16 h-16 rounded-full object-cover mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-800 font-poppins">Jane Doe</p>
                                    <p className="text-sm text-gray-600 font-inter">Client ID: U001</p>
                                </div>
                            </div>
                            <ul className="space-y-3 font-inter">
                                <li>
                                    <button onClick={() => setActiveSection('upcoming')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'upcoming' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                                        <ClipboardList className="w-5 h-5" /> Upcoming Bookings
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveSection('past')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'past' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                                        <ClipboardCheck className="w-5 h-5" /> Past Bookings
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveSection('saved')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'saved' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                                        <UserRoundCheck className="w-5 h-5" /> Saved Providers
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveSection('wallet')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'wallet' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                                        <Wallet className="w-5 h-5" /> My Wallet
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveSection('profile')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'profile' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                                        <User className="w-5 h-5" /> Update Profile
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveSection('payment-history')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'payment-history' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                                        <CreditCard className="w-5 h-5" /> Payment History
                                    </button>
                                </li>
                            </ul>
                        </aside>

                        {/* Main Content Area */}
                        <section className="lg:w-3/4 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                            {renderContent()}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Service Provider Dashboard Page Component (Conceptually in src/app/dashboard/provider/page.tsx) ---
const ServiceProviderDashboardPage = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState('calendar'); // Default to calendar/bookings

    const renderContent = () => {
        switch (activeSection) {
            case 'profile-setup':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Profile Setup Wizard</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <p className="text-gray-700 mb-4 font-inter">Welcome! Let's get your profile set up so you can start receiving bookings.</p>
                            <form className="space-y-4">
                                {/* Dummy form fields for profile setup */}
                                <div>
                                    <label htmlFor="service" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Primary Service Category</label>
                                    <select id="service" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter">
                                        <option>Select Category</option>
                                        <option>Plumbing</option>
                                        <option>Makeup Artist</option>
                                        <option>Deep Cleaning</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="bio" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">About Me (Bio)</label>
                                    <textarea id="bio" rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" placeholder="Tell users about your experience and expertise..."></textarea>
                                </div>
                                <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                    Save & Continue
                                </button>
                            </form>
                        </div>
                    </div>
                );
            case 'my-services':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">My Services & Pricing</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-200 font-inter">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Bridal Makeup</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₦50,000</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-[#cc6500] hover:text-[#a95500] font-semibold mr-3">Edit</button>
                                            <button className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Photoshoot Makeup</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₦30,000</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-[#cc6500] hover:text-[#a95500] font-semibold mr-3">Edit</button>
                                            <button className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="mt-6 bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                Add New Service
                            </button>
                        </div>
                    </div>
                );
            case 'calendar':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">My Calendar & Bookings</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <p className="text-gray-700 mb-4 font-inter">Overview of your upcoming appointments:</p>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 font-poppins">Makeup Session - Bridal</h3>
                                        <p className="text-gray-700 text-sm font-inter">Client: Aisha B.</p>
                                        <p className="text-gray-700 text-sm font-inter">Date: Aug 5, 2025 | Time: 11:00 AM</p>
                                    </div>
                                    <div className="flex gap-2 mt-3 sm:mt-0">
                                        <button className="bg-[#22c55e] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#16a34a] font-inter">Accept</button>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 font-inter">Decline</button>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 font-poppins">Makeup Session - Photoshoot</h3>
                                        <p className="text-gray-700 text-sm font-inter">Client: John D.</p>
                                        <p className="text-gray-700 text-sm font-inter">Date: Aug 6, 2025 | Time: 2:00 PM</p>
                                    </div>
                                    <div className="flex gap-2 mt-3 sm:mt-0">
                                        <button className="bg-[#22c55e] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#16a34a] font-inter">Accept</button>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 font-inter">Decline</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'payouts':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Payment Payouts & History</h2>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                            <p className="text-gray-600 text-lg mb-2 font-inter">Available for Withdrawal:</p>
                            <p className="text-5xl font-bold text-[#22c55e] font-poppins mb-6">₦25,000</p>
                            <button onClick={() => setActiveSection('withdraw')} className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                Request Payout
                            </button>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 font-poppins mt-8">Payout History</h3>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 font-inter">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-07-15</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦40,000</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Completed</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-06-30</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦20,000</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Completed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'reviews':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Customer Reviews</h2>
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-800 font-poppins">Aisha B.</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="text-yellow-500 w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm mb-2 font-inter">"Sarah is amazing! She transformed me for my wedding day. Highly professional and talented."</p>
                                <span className="text-gray-500 text-xs font-inter">2024-06-15</span>
                                <div className="mt-3">
                                    <textarea className="w-full p-2 border border-gray-300 rounded-md font-inter" rows="2" placeholder="Write your response..."></textarea>
                                    <button className="mt-2 bg-[#cc6500] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] font-inter">Respond</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'withdraw':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Withdraw Earnings</h2>
                        <form className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div>
                                <label htmlFor="amount" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Amount to Withdraw (₦)</label>
                                <input type="number" id="amount" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter" placeholder="e.g., 20000" />
                            </div>
                            <div>
                                <label htmlFor="bank" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Select Bank Account</label>
                                <select id="bank" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#cc6500] focus:border-[#cc6500] font-inter">
                                    <option>Select Bank</option>
                                    <option>GTBank - ****1234</option>
                                    <option>Zenith Bank - ****5678</option>
                                </select>
                            </div>
                            <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-md font-inter">
                                Request Payout
                            </button>
                            <p className="text-gray-500 text-sm mt-2 font-inter">Payouts are processed within 24-48 hours.</p>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-16 pb-12 bg-gray-50">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-8">Provider Dashboard</h1>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="lg:w-1/4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div className="flex items-center mb-6">
                                <img src="https://placehold.co/80x80/ffe4b5/000000?text=Pro" alt="Provider Profile" className="w-16 h-16 rounded-full object-cover mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-800 font-poppins">Sarah Adebayo</p>
                                    <p className="text-sm text-gray-600 font-inter">Makeup Artist</p>
                                    <span className="bg-[#dcfce7] text-[#16a34a] text-xs font-medium px-2.5 py-0.5 rounded-full font-inter">Verified</span>
                                </div>
                            </div>
                            <ul className="space-y-3 font-inter">
                                <li>
                                    <button onClick={() => setActiveSection('calendar')} className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeSection === 'calendar' ? 'bg-[#f0f8ff] text-[#cc6500] font-semibold' : 'hover:bg-gray-