"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Star, MapPin, Sparkles, Calendar, History, Wallet, User, FileText, LogOut, ClipboardList, ClipboardCheck, Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserDashboardPage() {
    const [activeSection, setActiveSection] = useState('upcoming');
    const { logout, userRole } = useAuth();

    // Dummy Data for User Dashboard
    const user = {
        name: "Jane Doe",
        profileImage: "https://placehold.co/100x100/f3e5f5/9c27b0?text=JD",
        walletBalance: "₦25,500",
        uid: "user_abc123def456" // User ID for display (important for Firestore)
    };

    const upcomingBookings = [
        { id: 1, service: "Plumbing Repair", provider: "John Duru", date: "Aug 10, 2024", time: "10:00 AM", status: "Confirmed", price: "₦12,500", address: "123 Main St, Lagos" },
        { id: 2, service: "Bridal Makeup", provider: "Sarah Adebayo", date: "Sep 01, 2024", time: "09:00 AM", status: "Pending", price: "₦50,000", address: "456 Oak Ave, Abuja" },
    ];

    const pastBookings = [
        { id: 3, service: "Deep Cleaning", provider: "CleanPro Services", date: "Jul 05, 2024", time: "02:00 PM", status: "Completed", price: "₦8,000", rating: 5 },
        { id: 4, service: "Laptop Repair", provider: "TechFix Solutions", date: "Jun 18, 2024", time: "11:00 AM", status: "Completed", price: "₦15,000", rating: 4 },
    ];

    const savedProviders = [
        { id: 101, name: "Sarah Adebayo", category: "Makeup Artist", rating: 4.8, image: "https://placehold.co/60x60/f3e5f5/9c27b0?text=SA" },
        { id: 102, name: "John Duru", category: "Plumber", rating: 4.9, image: "https://placehold.co/60x60/dbeafe/1e40af?text=JD" },
    ];

    const paymentHistory = [
        { id: 201, date: "Jul 10, 2024", description: "Plumbing Repair (Booking #1)", amount: "₦12,500", type: "Debit" },
        { id: 202, date: "Jun 20, 2024", description: "Wallet Top-up", amount: "₦5,000", type: "Credit" },
        { id: 203, date: "Jun 05, 2024", description: "Deep Cleaning (Booking #3)", amount: "₦8,000", type: "Debit" },
    ];

    // Placeholder for profile form states
    const [profileName, setProfileName] = useState(user.name);
    const [profileEmail, setProfileEmail] = useState("jane.doe@example.com");
    const [profilePhone, setProfilePhone] = useState("08012345678");

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Profile Updated:", { profileName, profileEmail, profilePhone });
        alert("Profile updated successfully!"); // Placeholder
    };


    // Render content based on active section
    const renderContent = () => {
        switch (activeSection) {
            case 'upcoming':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Upcoming Bookings</h2>
                        {upcomingBookings.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="mb-3 md:mb-0">
                                            <p className="font-bold text-lg text-gray-800 font-poppins">{booking.service}</p>
                                            <p className="text-gray-600 font-inter">with {booking.provider}</p>
                                            <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> {booking.date} at {booking.time}
                                            </p>
                                            <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {booking.address}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {booking.status}
                                            </span>
                                            <span className="font-bold text-lg text-[#cc6500] font-inter">{booking.price}</span>
                                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">You have no upcoming bookings.</p>
                        )}
                    </div>
                );
            case 'past':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Past Bookings</h2>
                        {pastBookings.length > 0 ? (
                            <div className="space-y-4">
                                {pastBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="mb-3 md:mb-0">
                                            <p className="font-bold text-lg text-gray-800 font-poppins">{booking.service}</p>
                                            <p className="text-gray-600 font-inter">with {booking.provider}</p>
                                            <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> {booking.date}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {booking.status}
                                            </span>
                                            <div className="flex items-center">
                                                {[...Array(booking.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                ))}
                                                {[...Array(5 - booking.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-gray-300" />
                                                ))}
                                            </div>
                                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">You have no past bookings.</p>
                        )}
                    </div>
                );
            case 'saved':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Saved Providers</h2>
                        {savedProviders.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedProviders.map((provider) => (
                                    <div key={provider.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                                        <img
                                            src={provider.image}
                                            alt={provider.name}
                                            className="w-16 h-16 rounded-full object-cover mr-4"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/cccccc/ffffff?text=Pro"; }}
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800 font-poppins">{provider.name}</p>
                                            <p className="text-sm text-gray-600 font-inter">{provider.category}</p>
                                            <div className="flex items-center">
                                                {[...Array(Math.floor(provider.rating))].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                ))}
                                                <span className="text-xs text-gray-500 ml-1">{provider.rating}</span>
                                            </div>
                                        </div>
                                        <button className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors">
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">You have no saved providers yet.</p>
                        )}
                    </div>
                );
            case 'wallet':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">My Wallet</h2>
                        <div className="bg-[#fffbf5] p-6 rounded-lg shadow-md border border-[#ffc14d] flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Wallet className="w-8 h-8 text-[#cc6500]" />
                                <span className="text-xl font-semibold text-gray-800 font-poppins">Current Balance:</span>
                            </div>
                            <span className="text-3xl font-bold text-[#cc6500] font-poppins">{user.walletBalance}</span>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md">
                                Add Funds
                            </button>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Update Profile</h2>
                        <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <div className="mb-4">
                                <label htmlFor="profileName" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="profileName"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="profileEmail" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="profileEmail"
                                    value={profileEmail}
                                    onChange={(e) => setProfileEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="profilePhone" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="profilePhone"
                                    value={profilePhone}
                                    onChange={(e) => setProfilePhone(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                />
                            </div>
                            <button type="submit" className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md">
                                Save Changes
                            </button>
                        </form>
                    </div>
                );
            case 'payment-history':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Payment History</h2>
                        {paymentHistory.length > 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Description</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Amount</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paymentHistory.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{item.date}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{item.description}</td>
                                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold font-inter ${item.type === 'Debit' ? 'text-red-600' : 'text-green-600'}`}>{item.amount}</td>
                                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold font-inter ${item.type === 'Debit' ? 'text-red-600' : 'text-green-600'}`}>{item.type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">No payment history found.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-6">
                    {/* Dashboard Header */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center">
                            <img
                                src={user.profileImage}
                                alt={`${user.name}'s profile`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-6"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/ffffff?text=User"; }}
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 font-poppins">Welcome, {user.name}!</h1>
                                <p className="text-gray-600 text-sm font-inter">Manage your bookings and profile here.</p>
                                <p className="text-gray-500 text-xs mt-1 font-inter">User ID: <span className="font-mono text-gray-700">{user.uid}</span></p>
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-0">
                            {/* HIGHLIGHTED CHANGE START */}
                            <Link href="/services" passHref>
                                <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-md font-semibold hover:bg-[#a95500] transition-colors shadow-md">
                                    Book a New Service
                                </button>
                            </Link>
                            {/* HIGHLIGHTED CHANGE END */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24">
                            <ul className="space-y-2">
                                <li className="mb-4 text-gray-500 text-xs uppercase font-semibold font-inter tracking-wider">Navigation</li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('upcoming')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'upcoming' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <ClipboardList className="w-5 h-5" /> Upcoming Bookings
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('past')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'past' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <ClipboardCheck className="w-5 h-5" /> Past Bookings
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('saved')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'saved' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Users className="w-5 h-5" /> Saved Providers
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('wallet')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'wallet' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Wallet className="w-5 h-5" /> My Wallet
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('profile')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'profile' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <User className="w-5 h-5" /> Update Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('payment-history')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'payment-history' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <FileText className="w-5 h-5" /> Payment History
                                    </button>
                                </li>
                                <li className="mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={logout}
                                        className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-colors duration-200 ease-in-out font-inter"
                                    >
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[600px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}