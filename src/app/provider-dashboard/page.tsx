"use client";

import React, { useState } from 'react';

import {
    X, Star, Phone, MapPin, Sparkles, DollarSign, Calendar, User, LogOut, MessageSquareText,
    Briefcase, CalendarCheck, Banknote, ListPlus, Edit, Trash2, Check, ExternalLink,
    BadgeCheck
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProviderDashboardPage() {
    const [activeSection, setActiveSection] = useState('bookings');

    // Dummy Data for Service Provider Dashboard
    const provider = {
        name: "Aisha Mohammed",
        category: "Professional Caterer",
        profileImage: "https://placehold.co/100x100/f0e0f7/000000?text=AM",
        pendingEarnings: "₦185,000",
        uid: "provider_xyz789uvw012", // Provider ID for display (important for Firestore)
        isVerified: true
    };

    const myServices = [
        { id: 1, name: "Birthday Catering (Small)", price: "₦100,000", description: "Catering for up to 30 guests." },
        { id: 2, name: "Wedding Catering (Standard)", price: "₦350,000", description: "Full catering for up to 100 guests, 3-course meal." },
        { id: 3, name: "Finger Foods & Snacks", price: "₦50,000", description: "Assorted small chops for events." },
    ];

    const upcomingBookings = [
        { id: 1, clientName: "Funke Adekunle", service: "Birthday Catering (Small)", date: "Aug 25, 2024", time: "05:00 PM", status: "Pending", contact: "09012345678", address: "15 Palm Drive, Lagos" },
        { id: 2, clientName: "Chike Obi", service: "Finger Foods & Snacks", date: "Sep 10, 2024", time: "11:00 AM", status: "Confirmed", contact: "08011223344", address: "789 Pine St, Lagos" },
    ];

    const pastPayouts = [
        { id: 201, date: "Jul 15, 2024", amount: "₦120,000", status: "Completed" },
        { id: 202, date: "Jun 01, 2024", amount: "₦80,000", status: "Completed" },
    ];

    const customerReviews = [
        { id: 301, clientName: "Ngozi E.", rating: 5, date: "Jul 28, 2024", text: "Aisha's catering was phenomenal! Everything was delicious and beautifully presented. Highly recommend her for any event.", responded: false },
        { id: 302, clientName: "Tunde B.", rating: 4, date: "Jul 10, 2024", text: "Great service, food was tasty. A bit late with setup but overall good experience.", responded: true },
    ];

    const handleProfileUpdate = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Profile Updated for Provider");
        alert("Provider profile updated successfully!"); // Placeholder
    };

    const handleAddService = () => {
        alert("Add New Service functionality triggered!"); // Placeholder
    };

    const handleEditService = (id: number) => {
        alert(`Edit Service with ID: ${id}`); // Placeholder
    };

    const handleDeleteService = (id: number) => {
        if (confirm(`Are you sure you want to delete service with ID: ${id}?`)) { // Using confirm for simple demo
            alert(`Service with ID: ${id} deleted!`); // Placeholder
        }
    };

    const handleAcceptBooking = (id: number) => {
        alert(`Booking request ${id} accepted!`); // Placeholder
    };

    const handleDeclineBooking = (id: number) => {
        alert(`Booking request ${id} declined!`); // Placeholder
    };

    const handleWithdrawEarnings = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        alert("Withdrawal request submitted!"); // Placeholder
    };


    // Render content based on active section
    const renderContent = () => {
        switch (activeSection) {
            case 'profile-setup':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Profile Setup Wizard</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <p className="text-gray-700 mb-4 font-inter">
                                Welcome to Fixify! Let's get your profile set up so you can start receiving bookings.
                            </p>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Service Category</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter">
                                        <option>Catering & Events</option>
                                        <option>Home & Repairs</option>
                                        <option>Beauty & Grooming</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">About Your Business</label>
                                    <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter" placeholder="Tell us about your services and experience..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Upload Profile Picture</label>
                                    <input type="file" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter"/>
                                </div>
                                <button type="submit" className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md">
                                    Complete Profile
                                </button>
                            </form>
                        </div>
                    </div>
                );
            case 'my-services':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">My Services & Pricing</h2>
                        <button
                            onClick={handleAddService}
                            className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md mb-6 flex items-center gap-2"
                        >
                            <ListPlus className="w-5 h-5" /> Add New Service
                        </button>
                        {myServices.length > 0 ? (
                            <div className="space-y-4">
                                {myServices.map((service) => (
                                    <div key={service.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="mb-3 md:mb-0">
                                            <p className="font-bold text-lg text-gray-800 font-poppins">{service.name}</p>
                                            <p className="text-gray-600 text-sm font-inter">{service.description}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg text-[#cc6500] font-inter">{service.price}</span>
                                            <button onClick={() => handleEditService(service.id)} className="text-gray-600 hover:text-[#cc6500] transition-colors" aria-label="Edit Service">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDeleteService(service.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label="Delete Service">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">You haven't added any services yet. Click "Add New Service" to get started!</p>
                        )}
                    </div>
                );
            case 'bookings':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Calendar & Bookings</h2>
                        {upcomingBookings.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="mb-3 md:mb-0">
                                            <p className="font-bold text-lg text-gray-800 font-poppins">{booking.service}</p>
                                            <p className="text-gray-600 font-inter">Client: {booking.clientName}</p>
                                            <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> {booking.date} at {booking.time}
                                            </p>
                                            <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {booking.address}
                                            </p>
                                            <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                <Phone className="w-4 h-4" /> {booking.contact}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {booking.status}
                                            </span>
                                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                                                View Details
                                            </button>
                                            {booking.status === 'Pending' && (
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleAcceptBooking(booking.id)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-600 flex items-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3" /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeclineBooking(booking.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-600 flex items-center gap-1"
                                                    >
                                                        <X className="w-3 h-3" /> Decline
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">No upcoming bookings.</p>
                        )}
                    </div>
                );
            case 'payouts':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Payment Payouts & History</h2>
                        <div className="bg-[#fffbf5] p-6 rounded-lg shadow-md border border-[#ffc14d] flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Banknote className="w-8 h-8 text-[#cc6500]" />
                                <span className="text-xl font-semibold text-gray-800 font-poppins">Pending Earnings:</span>
                            </div>
                            <span className="text-3xl font-bold text-[#cc6500] font-poppins">{provider.pendingEarnings}</span>
                        </div>
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => setActiveSection('withdraw')}
                                className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md"
                            >
                                Withdraw Earnings
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Payout History</h3>
                        {pastPayouts.length > 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Amount</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pastPayouts.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{item.date}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-[#cc6500] font-inter">{item.amount}</td>
                                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold font-inter ${item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{item.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">No payout history found.</p>
                        )}
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Customer Reviews</h2>
                        {customerReviews.length > 0 ? (
                            <div className="space-y-6">
                                {customerReviews.map((review) => (
                                    <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={`https://placehold.co/40x40/f3e5f5/9c27b0?text=${review.clientName.split(' ')[0][0]}${review.clientName.split(' ')[1][0]}`}
                                                alt={`${review.clientName}'s avatar`}
                                                className="w-10 h-10 rounded-full object-cover mr-3 shadow-sm"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/cccccc/ffffff?text=User"; }}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800 font-poppins">{review.clientName}</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                    <span className="ml-2 font-inter">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed font-inter">{review.text}</p>
                                        {!review.responded && (
                                            <button className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                                                Respond to Review
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-inter">No customer reviews yet.</p>
                        )}
                    </div>
                );
            case 'withdraw':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Withdraw Earnings</h2>
                        <form onSubmit={handleWithdrawEarnings} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <div className="mb-4">
                                <label htmlFor="withdrawAmount" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                    Amount to Withdraw (₦)
                                </label>
                                <input
                                    type="number"
                                    id="withdrawAmount"
                                    min="1"
                                    step="any"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                    placeholder="e.g., 50000"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="bankAccount" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                    Select Bank Account
                                </label>
                                <select
                                    id="bankAccount"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                >
                                    <option value="">Select an account</option>
                                    <option value="GTBank-1234">GTBank - ****1234 (Savings)</option>
                                    <option value="ZenithBank-5678">Zenith Bank - ****5678 (Current)</option>
                                    {/* Add more bank accounts dynamically */}
                                </select>
                                <p className="text-sm text-gray-500 mt-2 font-inter">Ensure your bank account details are up-to-date in your profile settings.</p>
                            </div>
                            <button type="submit" className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md">
                                Request Payout
                            </button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-6">
                        {/* Dashboard Header */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center">
                                <img
                                    src={provider.profileImage}
                                    alt={`${provider.name}'s profile`}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-6"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/ffffff?text=Provider"; }}
                                />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-1 font-poppins">Welcome, {provider.name}!</h1>
                                    <p className="text-gray-600 text-sm font-inter">Manage your services and earnings.</p>
                                    <p className="text-gray-500 text-xs mt-1 font-inter">Provider ID: <span className="font-mono text-gray-700">{provider.uid}</span></p>
                                    {provider.isVerified ? (
                                        <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                                            <BadgeCheck className="w-4 h-4" /> Verified Provider
                                        </p>
                                    ) : (
                                        <p className="text-yellow-600 text-sm flex items-center gap-1 mt-1">
                                            <Sparkles className="w-4 h-4" /> Not Verified (Complete Profile)
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-0">
                                <a href="#" className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-md font-semibold hover:bg-[#a95500] transition-colors shadow-md flex items-center gap-2">
                                    <ExternalLink className="w-5 h-5" /> View Public Profile
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar Navigation */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24">
                                <ul className="space-y-2">
                                    <li className="mb-4 text-gray-500 text-xs uppercase font-semibold font-inter tracking-wider">Navigation</li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('profile-setup')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'profile-setup' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <User className="w-5 h-5" /> Profile Setup Wizard
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('my-services')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'my-services' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <Briefcase className="w-5 h-5" /> My Services & Pricing
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('bookings')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'bookings' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <CalendarCheck className="w-5 h-5" /> Calendar & Bookings
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('payouts')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'payouts' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <Banknote className="w-5 h-5" /> Payment Payouts & History
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('reviews')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'reviews' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <MessageSquareText className="w-5 h-5" /> Customer Reviews
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('withdraw')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'withdraw' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <DollarSign className="w-5 h-5" /> Withdraw Earnings
                                        </button>
                                    </li>
                                    <li className="mt-6 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => alert("Logging out...")} // Placeholder for logout action
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
                <Footer />
            </div>
        </>
    );
}
