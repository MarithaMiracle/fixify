"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Import all necessary icons from lucide-react
import {
    X, Star, Phone, MapPin, Sparkles, DollarSign, Calendar, User, LogOut, MessageSquareText,
    Briefcase, CalendarCheck, Banknote, ListPlus, Edit, Trash2, Check, ExternalLink,
    BadgeCheck, Loader2, TrendingUp, Users, Clock, Award
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { providersAPI, servicesAPI, paymentsAPI } from '../../lib/api';

// --- Enhanced data interfaces to match the backend API response ---
interface Service {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
}

interface Booking {
    id: string;
    serviceId: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    bookingDate: string;
    totalAmount: number;
    createdAt: string;
    User: {
        fullName: string;
        phone: string;
        email: string;
        profileImage?: string;
    };
    Service: {
        name: string;
        price: number;
    };
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    User: {
        fullName: string;
        profileImage?: string;
    };
}

interface PayoutHistory {
    id: string;
    amount: number;
    status: string;
    date: string;
    reference: string;
}

interface ProviderStatistics {
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    totalServices: number;
    totalReviews: number;
    monthlyBookings: number;
    monthlyEarnings: number;
}

interface ProviderEarnings {
    totalEarnings: number;
    pendingEarnings: number;
    availableForWithdrawal: number;
}

interface ProviderData {
    id: string;
    bio: string;
    businessName: string;
    isVerified: boolean;
    averageRating: number;
    hourlyRate?: number;
    experience?: number;
    skills?: string[];
    workingHours?: any;
    serviceRadius?: number;
    User: {
        id: string;
        fullName: string;
        email: string;
        profileImage?: string;
        isProvider: boolean;
        phone?: string;
        address?: any;
    };
    Services: Service[];
    Bookings: Booking[];
    Reviews: Review[];
    statistics: ProviderStatistics;
    earnings: ProviderEarnings;
    payoutHistory: PayoutHistory[];
}

export default function ProviderDashboardPage() {
    // --- State to hold the fetched data and UI status ---
    const [providerData, setProviderData] = useState<ProviderData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const { logout } = useAuth();

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                setIsLoading(true);
                const response = await providersAPI.getMe();
                const fetchedData = response.data.provider;
                
                setProviderData(fetchedData);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch provider data:', err);
                setError(err.message || 'Failed to load dashboard data. Please log in as a provider.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProviderData();
    }, []);

    // --- Action Handlers ---
    const handleProfileUpdate = async (formData: any) => {
        try {
            setActionLoading('profile');
            await providersAPI.updateProfile(formData);
            // Refresh data
            const response = await providersAPI.getMe();
            setProviderData(response.data.provider);
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Profile update failed:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddService = () => {
        console.log("Add New Service functionality triggered!");
        // You would implement a modal here or navigate to a service creation page
        // For now, this is a placeholder
    };

    const handleEditService = (id: string) => {
        console.log(`Edit Service with ID: ${id}`);
        // Implement service editing functionality
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        
        try {
            setActionLoading(`delete-${id}`);
            await servicesAPI.delete(id);
            // Refresh data
            const response = await providersAPI.getMe();
            setProviderData(response.data.provider);
            alert('Service deleted successfully!');
        } catch (error: any) {
            console.error('Service deletion failed:', error);
            alert('Failed to delete service. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAcceptBooking = async (id: string) => {
        try {
            setActionLoading(`accept-${id}`);
            await providersAPI.updateBookingStatus(id, 'confirmed');
            // Refresh data
            const response = await providersAPI.getMe();
            setProviderData(response.data.provider);
            alert('Booking accepted successfully!');
        } catch (error: any) {
            console.error('Booking acceptance failed:', error);
            alert('Failed to accept booking. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeclineBooking = async (id: string) => {
        if (!confirm('Are you sure you want to decline this booking?')) return;
        
        try {
            setActionLoading(`decline-${id}`);
            await providersAPI.updateBookingStatus(id, 'cancelled');
            // Refresh data
            const response = await providersAPI.getMe();
            setProviderData(response.data.provider);
            alert('Booking declined successfully!');
        } catch (error: any) {
            console.error('Booking decline failed:', error);
            alert('Failed to decline booking. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleWithdrawEarnings = async (amount: number, bankAccount: string) => {
        try {
            setActionLoading('withdraw');
            await paymentsAPI.withdraw({
                amount,
                bankAccount,
                providerId: providerData?.id
            });
            // Refresh data
            const response = await providersAPI.getMe();
            setProviderData(response.data.provider);
            alert('Withdrawal request submitted successfully!');
        } catch (error: any) {
            console.error('Withdrawal failed:', error);
            alert('Failed to process withdrawal. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    // --- Conditional Rendering based on state ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-16 w-16 animate-spin text-[#cc6500]" />
                <p className="mt-4 text-xl font-semibold text-gray-700">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold bg-gray-50 p-6 text-center">
                <div className="text-center">
                    <p className="mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!providerData) {
        return (
            <div className="text-center p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div>
                    <h1 className="text-2xl font-bold mb-4">No Provider Profile Found</h1>
                    <p className="mb-6">It looks like you don't have a provider profile associated with your account.</p>
                    <Link href="/become-provider" className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors">
                        Create Provider Profile
                    </Link>
                </div>
            </div>
        );
    }
    
    // Helper function to format currency
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to render content for each section
    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Dashboard Overview</h2>
                        
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Bookings</p>
                                        <p className="text-2xl font-bold">{providerData.statistics.totalBookings}</p>
                                    </div>
                                    <CalendarCheck className="w-8 h-8 text-blue-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Total Earnings</p>
                                        <p className="text-2xl font-bold">{formatCurrency(providerData.earnings.totalEarnings)}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm">Active Services</p>
                                        <p className="text-2xl font-bold">{providerData.statistics.totalServices}</p>
                                    </div>
                                    <Briefcase className="w-8 h-8 text-yellow-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Rating</p>
                                        <p className="text-2xl font-bold flex items-center">
                                            {providerData.averageRating?.toFixed(1) || 'N/A'}
                                            <Star className="w-5 h-5 ml-1 text-yellow-300 fill-yellow-300" />
                                        </p>
                                    </div>
                                    <Award className="w-8 h-8 text-purple-200" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Bookings */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Recent Bookings</h3>
                                {providerData.Bookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <p className="font-semibold text-gray-800">{booking.Service.name}</p>
                                            <p className="text-sm text-gray-600">{booking.User.fullName}</p>
                                            <p className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                                {providerData.Bookings.length === 0 && (
                                    <p className="text-gray-600 text-center py-4">No bookings yet</p>
                                )}
                            </div>

                            {/* Recent Reviews */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Recent Reviews</h3>
                                {providerData.Reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className="py-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center mr-3">
                                                {review.User.fullName[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{review.User.fullName}</p>
                                                <div className="flex items-center">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                                    </div>
                                ))}
                                {providerData.Reviews.length === 0 && (
                                    <p className="text-gray-600 text-center py-4">No reviews yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'profile-setup':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Profile Setup</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <form className="space-y-4" onSubmit={(e) => { 
                                e.preventDefault(); 
                                const formData = new FormData(e.target as HTMLFormElement);
                                const data = Object.fromEntries(formData);
                                handleProfileUpdate(data);
                            }}>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Business Name</label>
                                    <input 
                                        type="text" 
                                        name="businessName"
                                        defaultValue={providerData.businessName || ''}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter"
                                        placeholder="Your business name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">About Your Business</label>
                                    <textarea 
                                        rows={4} 
                                        name="bio"
                                        defaultValue={providerData.bio || ''}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter" 
                                        placeholder="Tell us about your services and experience..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Hourly Rate (₦)</label>
                                    <input 
                                        type="number" 
                                        name="hourlyRate"
                                        defaultValue={providerData.hourlyRate || ''}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter"
                                        placeholder="e.g., 5000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter">Years of Experience</label>
                                    <input 
                                        type="number" 
                                        name="experience"
                                        defaultValue={providerData.experience || ''}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] font-inter"
                                        placeholder="e.g., 5"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={actionLoading === 'profile'}
                                    className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md disabled:opacity-50"
                                >
                                    {actionLoading === 'profile' ? 'Updating...' : 'Update Profile'}
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
                        {providerData.Services && providerData.Services.length > 0 ? (
                            <div className="space-y-4">
                                {providerData.Services.map((service) => (
                                    <div key={service.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="mb-3 md:mb-0 flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-bold text-lg text-gray-800 font-poppins">{service.name}</p>
                                                {!service.isActive && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Inactive</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm font-inter">{service.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">Created: {formatDate(service.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg text-[#cc6500] font-inter">{formatCurrency(service.price)}</span>
                                            <button 
                                                onClick={() => handleEditService(service.id)} 
                                                className="text-gray-600 hover:text-[#cc6500] transition-colors" 
                                                aria-label="Edit Service"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteService(service.id)} 
                                                disabled={actionLoading === `delete-${service.id}`}
                                                className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50" 
                                                aria-label="Delete Service"
                                            >
                                                {actionLoading === `delete-${service.id}` ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-inter mb-4">You haven't added any services yet.</p>
                                <button 
                                    onClick={handleAddService}
                                    className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors"
                                >
                                    Add Your First Service
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'bookings':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Calendar & Bookings</h2>
                        
                        {/* Booking Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-700 text-sm font-semibold">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-800">{providerData.statistics.pendingBookings}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-600" />
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-700 text-sm font-semibold">Completed</p>
                                        <p className="text-2xl font-bold text-green-800">{providerData.statistics.completedBookings}</p>
                                    </div>
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-700 text-sm font-semibold">This Month</p>
                                        <p className="text-2xl font-bold text-blue-800">{providerData.statistics.monthlyBookings}</p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {providerData.Bookings && providerData.Bookings.length > 0 ? (
                            <div className="space-y-4">
                                {providerData.Bookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div className="mb-3 md:mb-0 flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p className="font-bold text-lg text-gray-800 font-poppins">{booking.Service.name}</p>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 font-inter">Client: {booking.User.fullName}</p>
                                                <p className="text-gray-600 font-inter">Phone: {booking.User.phone}</p>
                                                <p className="text-sm text-gray-500 font-inter flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" /> {formatDate(booking.bookingDate)}
                                                </p>
                                                <p className="text-sm font-semibold text-[#cc6500] font-inter">
                                                    Amount: {formatCurrency(booking.totalAmount)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-start md:items-end gap-2">
                                                {booking.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAcceptBooking(booking.id)}
                                                            disabled={actionLoading === `accept-${booking.id}`}
                                                            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 flex items-center gap-1 disabled:opacity-50"
                                                        >
                                                            {actionLoading === `accept-${booking.id}` ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <Check className="w-3 h-3" />
                                                            )} Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeclineBooking(booking.id)}
                                                            disabled={actionLoading === `decline-${booking.id}`}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 flex items-center gap-1 disabled:opacity-50"
                                                        >
                                                            {actionLoading === `decline-${booking.id}` ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <X className="w-3 h-3" />
                                                            )} Decline
                                                        </button>
                                                    </div>
                                                )}
                                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                                <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-inter">No bookings yet.</p>
                            </div>
                        )}
                    </div>
                );

            case 'payouts':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Payment Payouts & History</h2>
                        
                        {/* Earnings Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Total Earnings</p>
                                        <p className="text-2xl font-bold">{formatCurrency(providerData.earnings.totalEarnings)}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm">Pending Earnings</p>
                                        <p className="text-2xl font-bold">{formatCurrency(providerData.earnings.pendingEarnings)}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Available</p>
                                        <p className="text-2xl font-bold">{formatCurrency(providerData.earnings.availableForWithdrawal)}</p>
                                    </div>
                                    <Banknote className="w-8 h-8 text-blue-200" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => setActiveSection('withdraw')}
                                disabled={providerData.earnings.availableForWithdrawal <= 0}
                                className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Withdraw Earnings
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Payout History</h3>
                        {providerData.payoutHistory && providerData.payoutHistory.length > 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Amount</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Reference</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {providerData.payoutHistory.map((payout) => (
                                                <tr key={payout.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">
                                                        {formatDate(payout.date)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-[#cc6500] font-inter">
                                                        {formatCurrency(payout.amount)}
                                                    </td>
                                                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold font-inter ${
                                                        payout.status === 'completed' ? 'text-green-600' : 
                                                        payout.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                                                        {payout.reference}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                                <Banknote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-inter">No payout history found.</p>
                            </div>
                        )}
                    </div>
                );

            case 'reviews':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Customer Reviews</h2>
                        
                        {/* Review Statistics */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-inter">Average Rating</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {providerData.averageRating?.toFixed(1) || 'N/A'}
                                        </span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-5 h-5 ${
                                                        i < Math.floor(providerData.averageRating || 0)
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600 text-sm font-inter">Total Reviews</p>
                                    <p className="text-3xl font-bold text-gray-900">{providerData.statistics.totalReviews}</p>
                                </div>
                            </div>
                        </div>

                        {providerData.Reviews && providerData.Reviews.length > 0 ? (
                            <div className="space-y-6">
                                {providerData.Reviews.map((review) => (
                                    <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-start mb-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold text-lg mr-4 shadow-sm">
                                                {review.User.fullName[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-semibold text-gray-800 font-poppins">{review.User.fullName}</p>
                                                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600 font-inter">
                                                        {review.rating} out of 5 stars
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed font-inter">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                                <MessageSquareText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-inter">No customer reviews yet.</p>
                                <p className="text-sm text-gray-500 mt-2">Reviews will appear here after customers book and rate your services.</p>
                            </div>
                        )}
                    </div>
                );

            case 'withdraw':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Withdraw Earnings</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 font-semibold">Available for Withdrawal:</p>
                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(providerData.earnings.availableForWithdrawal)}</p>
                            </div>
                            
                            <form onSubmit={(e) => { 
                                e.preventDefault(); 
                                const formData = new FormData(e.target as HTMLFormElement);
                                const amount = parseFloat(formData.get('amount') as string);
                                const bankAccount = formData.get('bankAccount') as string;
                                
                                if (amount > providerData.earnings.availableForWithdrawal) {
                                    alert('Amount exceeds available balance!');
                                    return;
                                }
                                
                                handleWithdrawEarnings(amount, bankAccount);
                            }}>
                                <div className="mb-4">
                                    <label htmlFor="withdrawAmount" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                        Amount to Withdraw (₦)
                                    </label>
                                    <input
                                        type="number"
                                        id="withdrawAmount"
                                        name="amount"
                                        min="1000"
                                        max={providerData.earnings.availableForWithdrawal}
                                        step="100"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                        placeholder="e.g., 50000"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Minimum withdrawal: ₦1,000</p>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="bankAccount" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                                        Select Bank Account
                                    </label>
                                    <select
                                        id="bankAccount"
                                        name="bankAccount"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                    >
                                        <option value="">Select an account</option>
                                        <option value="GTBank-1234">GTBank - ****1234 (Savings)</option>
                                        <option value="ZenithBank-5678">Zenith Bank - ****5678 (Current)</option>
                                        <option value="FirstBank-9012">First Bank - ****9012 (Savings)</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-2 font-inter">
                                        Don't see your bank account? Update your banking details in profile settings.
                                    </p>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={actionLoading === 'withdraw' || providerData.earnings.availableForWithdrawal <= 0}
                                    className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading === 'withdraw' ? 'Processing...' : 'Request Payout'}
                                </button>
                            </form>
                        </div>
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
                                src={providerData.User.profileImage || 'https://placehold.co/100x100/E5E7EB/4B5563?text=N/A'}
                                alt={`${providerData.User.fullName}'s profile`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-6"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://placehold.co/100x100/cccccc/ffffff?text=Provider";
                                }}
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 font-poppins">
                                    Welcome, {providerData.User.fullName}!
                                </h1>
                                <p className="text-gray-600 text-sm font-inter">
                                    {providerData.businessName || 'Manage your services and earnings.'}
                                </p>
                                <p className="text-gray-500 text-xs mt-1 font-inter">
                                    Provider ID: <span className="font-mono text-gray-700">{providerData.id}</span>
                                </p>
                                {providerData.isVerified ? (
                                    <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                                        <BadgeCheck className="w-4 h-4" /> Verified Provider
                                    </p>
                                ) : (
                                    <p className="text-yellow-600 text-sm flex items-center gap-1 mt-1">
                                        <Sparkles className="w-4 h-4" /> Verification Pending
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-0">
                            <Link href={`/providers/${providerData.id}`} passHref>
                                <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full text-md font-semibold hover:bg-[#a95500] transition-colors shadow-md flex items-center gap-2">
                                    <ExternalLink className="w-5 h-5" /> View Public Profile
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24">
                            <ul className="space-y-2">
                                <li className="mb-4 text-gray-500 text-xs uppercase font-semibold font-inter tracking-wider">Navigation</li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('overview')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'overview' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <TrendingUp className="w-5 h-5" /> Dashboard Overview
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveSection('profile-setup')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                            ${activeSection === 'profile-setup' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <User className="w-5 h-5" /> Profile Setup
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
                                        {providerData.statistics.pendingBookings > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                                                {providerData.statistics.pendingBookings}
                                            </span>
                                        )}
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
                                        {providerData.statistics.totalReviews > 0 && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                                                {providerData.statistics.totalReviews}
                                            </span>
                                        )}
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