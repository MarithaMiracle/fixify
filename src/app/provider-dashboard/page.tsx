"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import all necessary icons from lucide-react
import {
    X, Star, Phone, MapPin, Sparkles, DollarSign, Calendar, User, LogOut, MessageSquareText,
    Briefcase, CalendarCheck, Banknote, ListPlus, Edit, Trash2, Check, ExternalLink,
    BadgeCheck, Loader2, TrendingUp, Users, Clock, Award, AlertCircle, RefreshCw,
    PlusCircle, Eye, ChevronRight, Activity, BarChart3
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { providersAPI, servicesAPI, bookingsAPI } from '../../lib/api';
import ProviderAuthGuard from '../components/ProviderAuthGuard';

// Enhanced interfaces with proper typing
interface Service {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    categoryId: string;
}

interface BookingUser {
    fullName: string;
    phone: string;
    email: string;
    profileImage?: string;
}

interface BookingService {
    name: string;
    price: number;
}

interface Booking {
    id: string;
    serviceId: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    bookingDate: string;
    totalAmount: number;
    createdAt: string;
    address?: {
        street: string;
        city: string;
        state: string;
        landmark?: string;
    };
    specialInstructions?: string;
    User: BookingUser;
    Service: BookingService;
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

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    isProvider: boolean;
    phone?: string;
    address?: any;
}

interface ProviderData {
    id: string;
    bio?: string;
    businessName?: string;
    isVerified: boolean;
    averageRating: number;
    hourlyRate?: number;
    experience?: number;
    skills?: string[];
    workingHours?: any;
    serviceRadius?: number;
    completedJobs: number;
    User: UserProfile;
    Services: Service[];
    Bookings: Booking[];
    Reviews: Review[];
    statistics: ProviderStatistics;
    earnings: ProviderEarnings;
    payoutHistory: PayoutHistory[];
}

function ProviderDashboardContent() {
    // State management
    const [providerData, setProviderData] = useState<ProviderData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();

    // Data fetching with enhanced error handling
    const fetchProviderData = async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setIsLoading(true);
            }
            
            console.log('🔄 Fetching provider data...');
            const response = await providersAPI.getMe();
            
            if (response.data.success) {
                const fetchedData = response.data.data.provider;
                console.log('✅ Provider data fetched:', fetchedData);
                setProviderData(fetchedData);
                setError(null);
            } else {
                throw new Error(response.data.message || 'Failed to fetch provider data');
            }
        } catch (err: any) {
            console.error('❌ Failed to fetch provider data:', err);
            
            if (err.response?.status === 404) {
                setError('Provider profile not found. Please complete your provider registration.');
            } else if (err.response?.status === 401) {
                setError('Authentication required. Please log in as a provider.');
                logout();
            } else {
                setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
            }
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchProviderData();
    }, []);

    // Auto-refresh data every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isLoading && !refreshing) {
                fetchProviderData(true);
            }
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, [isLoading, refreshing]);

    // Action handlers with better error handling
    const handleProfileUpdate = async (formData: FormData) => {
        try {
            setActionLoading('profile');
            
            const updateData = {
                businessName: formData.get('businessName') as string,
                bio: formData.get('bio') as string,
                hourlyRate: parseFloat(formData.get('hourlyRate') as string) || undefined,
                experience: parseInt(formData.get('experience') as string) || undefined,
                serviceRadius: parseInt(formData.get('serviceRadius') as string) || undefined,
            };

            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key as keyof typeof updateData] === undefined) {
                    delete updateData[key as keyof typeof updateData];
                }
            });

            console.log('📝 Updating profile with:', updateData);
            await providersAPI.updateProfile(updateData);
            
            // Refresh data
            await fetchProviderData();
            alert('✅ Profile updated successfully!');
        } catch (error: any) {
            console.error('❌ Profile update failed:', error);
            alert(`❌ Failed to update profile: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddService = () => {
        // For now, show an alert. In a real app, you'd open a modal or navigate to a service creation page
        alert('🚧 Add New Service functionality will be implemented next. This would typically open a modal or navigate to a service creation form.');
        console.log("Add New Service functionality triggered!");
    };

    const handleEditService = (serviceId: string) => {
        alert(`🚧 Edit Service functionality will be implemented next. Service ID: ${serviceId}`);
        console.log(`Edit Service with ID: ${serviceId}`);
    };

    const handleDeleteService = async (serviceId: string) => {
        if (!confirm('⚠️ Are you sure you want to delete this service? This action cannot be undone.')) {
            return;
        }
        
        try {
            setActionLoading(`delete-${serviceId}`);
            console.log(`🗑️ Deleting service: ${serviceId}`);
            
            await servicesAPI.delete(serviceId);
            
            // Refresh data
            await fetchProviderData();
            alert('✅ Service deleted successfully!');
        } catch (error: any) {
            console.error('❌ Service deletion failed:', error);
            alert(`❌ Failed to delete service: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAcceptBooking = async (bookingId: string) => {
        try {
            setActionLoading(`accept-${bookingId}`);
            console.log(`✅ Accepting booking: ${bookingId}`);
            
            await providersAPI.updateBookingStatus(bookingId, 'confirmed');
            
            // Refresh data
            await fetchProviderData();
            alert('✅ Booking accepted successfully!');
        } catch (error: any) {
            console.error('❌ Booking acceptance failed:', error);
            alert(`❌ Failed to accept booking: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeclineBooking = async (bookingId: string) => {
        if (!confirm('⚠️ Are you sure you want to decline this booking?')) {
            return;
        }
        
        try {
            setActionLoading(`decline-${bookingId}`);
            console.log(`❌ Declining booking: ${bookingId}`);
            
            await providersAPI.updateBookingStatus(bookingId, 'cancelled');
            
            // Refresh data
            await fetchProviderData();
            alert('✅ Booking declined successfully!');
        } catch (error: any) {
            console.error('❌ Booking decline failed:', error);
            alert(`❌ Failed to decline booking: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleWithdrawEarnings = async (amount: number, bankAccount: string) => {
        try {
            setActionLoading('withdraw');
            console.log(`💰 Processing withdrawal: ₦${amount} to ${bankAccount}`);
            
            // For now, simulate the withdrawal process
            alert(`🚧 Withdrawal functionality will be implemented with payment gateway integration. 
Amount: ₦${amount.toLocaleString()}
Account: ${bankAccount}`);
            
            // In a real implementation:
            // await paymentsAPI.withdraw({ amount, bankAccount, providerId: providerData?.id });
            // await fetchProviderData();
            
        } catch (error: any) {
            console.error('❌ Withdrawal failed:', error);
            alert(`❌ Failed to process withdrawal: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    // Utility functions
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-16 w-16 animate-spin text-[#cc6500]" />
                <p className="mt-4 text-xl font-semibold text-gray-700">Loading your dashboard...</p>
                <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your data</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-md border border-red-200">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h2>
                    <p className="text-red-600 mb-6 max-w-md">{error}</p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => fetchProviderData()} 
                            className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-5 h-5" /> Retry Loading
                        </button>
                        {error.includes('Provider profile not found') && (
                            <Link href="/become-provider" className="block">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                                    Complete Provider Registration
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // No provider data state
    if (!providerData) {
        return (
            <div className="text-center p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">No Provider Profile Found</h1>
                    <p className="mb-6 text-gray-600">It looks like you don't have a provider profile associated with your account.</p>
                    <Link href="/become-provider" className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors inline-block">
                        Create Provider Profile
                    </Link>
                </div>
            </div>
        );
    }

    // Content rendering function
    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-poppins">Dashboard Overview</h2>
                            <button
                                onClick={() => fetchProviderData(true)}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                {refreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        
                        {/* Enhanced Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                                        <p className="text-3xl font-bold">{providerData.statistics.totalBookings}</p>
                                        <p className="text-blue-200 text-xs mt-1">
                                            {providerData.statistics.completedBookings} completed
                                        </p>
                                    </div>
                                    <CalendarCheck className="w-10 h-10 text-blue-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                                        <p className="text-3xl font-bold">{formatCurrency(providerData.earnings.totalEarnings)}</p>
                                        <p className="text-green-200 text-xs mt-1">
                                            {formatCurrency(providerData.earnings.availableForWithdrawal)} available
                                        </p>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-green-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm font-medium">Active Services</p>
                                        <p className="text-3xl font-bold">{providerData.statistics.totalServices}</p>
                                        <p className="text-yellow-200 text-xs mt-1">
                                            {providerData.Services.filter(s => s.isActive).length} active
                                        </p>
                                    </div>
                                    <Briefcase className="w-10 h-10 text-yellow-200" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Rating</p>
                                        <div className="flex items-center">
                                            <p className="text-3xl font-bold mr-2">
                                                {providerData.averageRating?.toFixed(1) || 'N/A'}
                                            </p>
                                            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                        </div>
                                        <p className="text-purple-200 text-xs mt-1">
                                            {providerData.statistics.totalReviews} reviews
                                        </p>
                                    </div>
                                    <Award className="w-10 h-10 text-purple-200" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <button
                                    onClick={handleAddService}
                                    className="flex items-center gap-3 p-4 bg-[#cc6500] hover:bg-[#a95500] text-white rounded-lg transition-colors"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span className="font-medium">Add Service</span>
                                </button>
                                <button
                                    onClick={() => setActiveSection('bookings')}
                                    className="flex items-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium">View Bookings</span>
                                    {providerData.statistics.pendingBookings > 0 && (
                                        <span className="bg-white text-blue-500 text-xs px-2 py-1 rounded-full font-bold">
                                            {providerData.statistics.pendingBookings}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveSection('payouts')}
                                    className="flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                >
                                    <Banknote className="w-5 h-5" />
                                    <span className="font-medium">Payouts</span>
                                </button>
                                <Link href={`/providers/${providerData.id}`} className="block">
                                    <button className="w-full flex items-center gap-3 p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
                                        <Eye className="w-5 h-5" />
                                        <span className="font-medium">View Profile</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Bookings */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                                    <button
                                        onClick={() => setActiveSection('bookings')}
                                        className="text-[#cc6500] hover:text-[#a95500] text-sm font-medium flex items-center gap-1"
                                    >
                                        View All <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                {providerData.Bookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{booking.Service.name}</p>
                                            <p className="text-sm text-gray-600">{booking.User.fullName}</p>
                                            <p className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {formatCurrency(booking.totalAmount)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {providerData.Bookings.length === 0 && (
                                    <div className="text-center py-8">
                                        <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600">No bookings yet</p>
                                        <p className="text-sm text-gray-500">Bookings will appear here when customers book your services</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Reviews */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Recent Reviews</h3>
                                    <button
                                        onClick={() => setActiveSection('reviews')}
                                        className="text-[#cc6500] hover:text-[#a95500] text-sm font-medium flex items-center gap-1"
                                    >
                                        View All <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                {providerData.Reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className="py-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-start mb-2">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center mr-3 flex-shrink-0">
                                                {review.User.fullName[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-sm text-gray-800">{review.User.fullName}</p>
                                                    <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                    <span className="ml-2 text-xs text-gray-600">
                                                        {review.rating}/5
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {providerData.Reviews.length === 0 && (
                                    <div className="text-center py-8">
                                        <MessageSquareText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600">No reviews yet</p>
                                        <p className="text-sm text-gray-500">Customer reviews will appear here after service completion</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            // ... (Continue with other sections - profile-setup, my-services, bookings, payouts, reviews, withdraw)
            // For brevity, I'll include just the overview section here, but the full implementation would include all sections

            // Add these sections to the renderContent() function in your provider dashboard

// Profile Setup Section
case 'profile-setup':
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Setup</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleProfileUpdate(formData);
                }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Business Name</label>
                            <input 
                                type="text" 
                                name="businessName"
                                defaultValue={providerData.businessName || ''}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent"
                                placeholder="Your business name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Hourly Rate (₦)</label>
                            <input 
                                type="number" 
                                name="hourlyRate"
                                defaultValue={providerData.hourlyRate || ''}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent"
                                placeholder="e.g., 5000"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Years of Experience</label>
                            <input 
                                type="number" 
                                name="experience"
                                defaultValue={providerData.experience || ''}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent"
                                placeholder="e.g., 5"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Service Radius (km)</label>
                            <input 
                                type="number" 
                                name="serviceRadius"
                                defaultValue={providerData.serviceRadius || ''}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent"
                                placeholder="e.g., 25"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">About Your Business</label>
                        <textarea 
                            rows={4} 
                            name="bio"
                            defaultValue={providerData.bio || ''}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent" 
                            placeholder="Tell us about your services and experience..."
                        />
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button 
                            type="submit" 
                            disabled={actionLoading === 'profile'}
                            className="bg-[#cc6500] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                            {actionLoading === 'profile' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Update Profile
                                </>
                            )}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveSection('overview')}
                            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

// My Services Section
case 'my-services':
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Services & Pricing</h2>
                <button
                    onClick={handleAddService}
                    className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md flex items-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" /> Add New Service
                </button>
            </div>

            {/* Services Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-700 text-sm font-semibold">Total Services</p>
                            <p className="text-2xl font-bold text-blue-800">{providerData.Services.length}</p>
                        </div>
                        <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-700 text-sm font-semibold">Active Services</p>
                            <p className="text-2xl font-bold text-green-800">
                                {providerData.Services.filter(s => s.isActive).length}
                            </p>
                        </div>
                        <Activity className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-700 text-sm font-semibold">Avg. Price</p>
                            <p className="text-2xl font-bold text-yellow-800">
                                {providerData.Services.length > 0 
                                    ? formatCurrency(Math.round(providerData.Services.reduce((sum, s) => sum + s.price, 0) / providerData.Services.length))
                                    : '₦0'
                                }
                            </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
            </div>

            {providerData.Services && providerData.Services.length > 0 ? (
                <div className="space-y-4">
                    {providerData.Services.map((service) => (
                        <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                                <div className="flex-1 mb-4 lg:mb-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        {service.imageUrl && (
                                            <img 
                                                src={service.imageUrl} 
                                                alt={service.name}
                                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                                                {service.isActive ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Inactive</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 max-w-2xl">{service.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Created: {formatDate(service.createdAt)}</span>
                                                <span>•</span>
                                                <span className="font-semibold text-[#cc6500]">{formatCurrency(service.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => handleEditService(service.id)} 
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors" 
                                    >
                                        <Edit className="w-4 h-4" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteService(service.id)} 
                                        disabled={actionLoading === `delete-${service.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50" 
                                    >
                                        {actionLoading === `delete-${service.id}` ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Start by adding your first service to attract customers and begin accepting bookings.
                    </p>
                    <button 
                        onClick={handleAddService}
                        className="bg-[#cc6500] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md"
                    >
                        Add Your First Service
                    </button>
                </div>
            )}
        </div>
    );

// Bookings Section
case 'bookings':
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendar & Bookings</h2>
            
            {/* Booking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-700 text-sm font-semibold">Pending</p>
                            <p className="text-2xl font-bold text-yellow-800">{providerData.statistics.pendingBookings}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-700 text-sm font-semibold">Confirmed</p>
                            <p className="text-2xl font-bold text-blue-800">
                                {providerData.Bookings.filter(b => b.status === 'confirmed').length}
                            </p>
                        </div>
                        <Check className="w-8 h-8 text-blue-600" />
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
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-700 text-sm font-semibold">This Month</p>
                            <p className="text-2xl font-bold text-purple-800">{providerData.statistics.monthlyBookings}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {providerData.Bookings && providerData.Bookings.length > 0 ? (
                <div className="space-y-4">
                    {providerData.Bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center">
                                <div className="flex-1 mb-4 xl:mb-0">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
                                            {booking.User.fullName[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-lg text-gray-800">{booking.Service.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600 flex items-center gap-1">
                                                        <User className="w-4 h-4" /> <strong>Client:</strong> {booking.User.fullName}
                                                    </p>
                                                    <p className="text-gray-600 flex items-center gap-1">
                                                        <Phone className="w-4 h-4" /> <strong>Phone:</strong> {booking.User.phone}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" /> <strong>Date:</strong> {formatDate(booking.bookingDate)}
                                                    </p>
                                                    <p className="text-[#cc6500] font-semibold flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" /> <strong>Amount:</strong> {formatCurrency(booking.totalAmount)}
                                                    </p>
                                                </div>
                                            </div>
                                            {booking.address && (
                                                <p className="text-gray-600 text-sm mt-2 flex items-start gap-1">
                                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    {booking.address.street}, {booking.address.city}, {booking.address.state}
                                                    {booking.address.landmark && ` (${booking.address.landmark})`}
                                                </p>
                                            )}
                                            {booking.specialInstructions && (
                                                <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-3 rounded-lg">
                                                    <strong>Special Instructions:</strong> {booking.specialInstructions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAcceptBooking(booking.id)}
                                                disabled={actionLoading === `accept-${booking.id}`}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 flex items-center gap-1 disabled:opacity-50 transition-colors"
                                            >
                                                {actionLoading === `accept-${booking.id}` ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleDeclineBooking(booking.id)}
                                                disabled={actionLoading === `decline-${booking.id}`}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 flex items-center gap-1 disabled:opacity-50 transition-colors"
                                            >
                                                {actionLoading === `decline-${booking.id}` ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <X className="w-4 h-4" />
                                                )}
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <a href={`tel:${booking.User.phone}`} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        Call
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <CalendarCheck className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        When customers book your services, they will appear here for you to manage.
                    </p>
                    <Link href="/services" className="bg-[#cc6500] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md inline-block">
                        View My Public Services
                    </Link>
                </div>
            )}
        </div>
    );

// Payouts Section
case 'payouts':
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Payouts & History</h2>
            
            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                            <p className="text-3xl font-bold">{formatCurrency(providerData.earnings.totalEarnings)}</p>
                            <p className="text-green-200 text-xs mt-1">All time earnings</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium">Pending Earnings</p>
                            <p className="text-3xl font-bold">{formatCurrency(providerData.earnings.pendingEarnings)}</p>
                            <p className="text-yellow-200 text-xs mt-1">From confirmed bookings</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Available to Withdraw</p>
                            <p className="text-3xl font-bold">{formatCurrency(providerData.earnings.availableForWithdrawal)}</p>
                            <p className="text-blue-200 text-xs mt-1">Ready for payout</p>
                        </div>
                        <Banknote className="w-10 h-10 text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Withdraw Button */}
            <div className="flex justify-end mb-8">
                <button
                    onClick={() => setActiveSection('withdraw')}
                    disabled={providerData.earnings.availableForWithdrawal <= 0}
                    className="bg-[#cc6500] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <DollarSign className="w-5 h-5" />
                    {providerData.earnings.availableForWithdrawal <= 0 ? 'No Funds Available' : 'Withdraw Earnings'}
                </button>
            </div>

            {/* Monthly Earnings Chart Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Earnings Overview</h3>
                <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Earnings Chart</p>
                        <p className="text-gray-500 text-sm">This Month: {formatCurrency(providerData.statistics.monthlyEarnings)}</p>
                    </div>
                </div>
            </div>

            {/* Payout History */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payout History</h3>
            {providerData.payoutHistory && providerData.payoutHistory.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {providerData.payoutHistory.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(payout.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#cc6500]">
                                            {formatCurrency(payout.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                payout.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                            {payout.reference}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-[#cc6500] hover:text-[#a95500] font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Banknote className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payout History</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Your withdrawal history will appear here once you start making payouts.
                    </p>
                </div>
            )}
        </div>
    );

// Reviews Section
case 'reviews':
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            
            {/* Review Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                        {providerData.averageRating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="flex items-center justify-center mb-2">
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
                    <p className="text-gray-600 text-sm">Average Rating</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{providerData.statistics.totalReviews}</div>
                    <p className="text-gray-600 text-sm">Total Reviews</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                        {providerData.statistics.totalReviews > 0 
                            ? Math.round((providerData.Reviews.filter(r => r.rating >= 4).length / providerData.statistics.totalReviews) * 100)
                            : 0
                        }%
                    </div>
                    <p className="text-gray-600 text-sm">Positive Reviews</p>
                    <p className="text-xs text-gray-500 mt-1">(4+ stars)</p>
                </div>
            </div>

            {/* Reviews List */}
            {providerData.Reviews && providerData.Reviews.length > 0 ? (
                <div className="space-y-6">
                    {providerData.Reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start mb-4">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold text-lg mr-4 shadow-md flex-shrink-0">
                                    {review.User.fullName[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-lg">{review.User.fullName}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                    {[...Array(5 - review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-gray-300" />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {review.rating} out of 5 stars
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <MessageSquareText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Customer reviews will appear here after they complete and rate your services. 
                        Great reviews help attract more customers!
                    </p>
                    <Link href={`/providers/${providerData.id}`} className="bg-[#cc6500] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md inline-block">
                        View My Public Profile
                    </Link>
                </div>
            )}
        </div>
    );

// Withdraw Section
case 'withdraw':
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => setActiveSection('payouts')}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    ← Back to Payouts
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Withdraw Earnings</h2>
            </div>
            
            <div className="max-w-2xl">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-800 font-semibold text-lg">Available for Withdrawal</p>
                                <p className="text-3xl font-bold text-green-800">{formatCurrency(providerData.earnings.availableForWithdrawal)}</p>
                            </div>
                            <Banknote className="w-12 h-12 text-blue-600" />
                        </div>
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
                        
                        if (amount < 1000) {
                            alert('Minimum withdrawal amount is ₦1,000');
                            return;
                        }
                        
                        handleWithdrawEarnings(amount, bankAccount);
                    }}>
                        <div className="mb-6">
                            <label htmlFor="withdrawAmount" className="block text-gray-700 text-sm font-semibold mb-3">
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
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent text-lg"
                                placeholder="e.g., 50000"
                            />
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                                <span>Minimum: ₦1,000</span>
                                <span>Maximum: {formatCurrency(providerData.earnings.availableForWithdrawal)}</span>
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <label htmlFor="bankAccount" className="block text-gray-700 text-sm font-semibold mb-3">
                                Select Bank Account
                            </label>
                            <select
                                id="bankAccount"
                                name="bankAccount"
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6500] focus:border-transparent text-lg"
                            >
                                <option value="">Select an account</option>
                                <option value="GTBank-1234">GTBank - ****1234 (Savings)</option>
                                <option value="ZenithBank-5678">Zenith Bank - ****5678 (Current)</option>
                                <option value="FirstBank-9012">First Bank - ****9012 (Savings)</option>
                                <option value="AccessBank-3456">Access Bank - ****3456 (Savings)</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <strong>Note:</strong> Don't see your bank account? Update your banking details in profile settings.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                type="submit" 
                                disabled={actionLoading === 'withdraw' || providerData.earnings.availableForWithdrawal <= 0}
                                className="flex-1 bg-[#cc6500] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {actionLoading === 'withdraw' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="w-5 h-5" />
                                        Request Payout
                                    </>
                                )}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setActiveSection('payouts')}
                                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

            default:
                return <div>Section under development...</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-6">
                    {/* Enhanced Dashboard Header */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between">
                            <div className="flex flex-col sm:flex-row items-center mb-6 lg:mb-0">
                                <div className="relative">
                                    <img
                                        src={providerData.User.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(providerData.User.fullName)}&background=cc6500&color=fff&size=128`}
                                        alt={`${providerData.User.fullName}'s profile`}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-6"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(providerData.User.fullName)}&background=cc6500&color=fff&size=128`;
                                        }}
                                    />
                                    {providerData.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                            <BadgeCheck className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Welcome back, {providerData.User.fullName}!
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-1">
                                        {providerData.businessName || 'Professional Service Provider'}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
                                        <span>ID: {providerData.id.slice(0, 8)}...</span>
                                        <span>•</span>
                                        <span>{providerData.completedJobs} jobs completed</span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                        {providerData.isVerified ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <BadgeCheck className="w-4 h-4" /> Verified Provider
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                                                <Clock className="w-4 h-4" /> Verification Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href={`/providers/${providerData.id}`} target="_blank">
                                    <button className="bg-[#cc6500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a95500] transition-colors shadow-lg flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5" /> View Public Profile
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setActiveSection('profile-setup')}
                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <Edit className="w-5 h-5" /> Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Enhanced Sidebar Navigation */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24">
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setActiveSection('overview')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            activeSection === 'overview' 
                                                ? 'bg-[#cc6500] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#cc6500]'
                                        }`}
                                    >
                                        <BarChart3 className="w-5 h-5" /> Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('profile-setup')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            activeSection === 'profile-setup' 
                                                ? 'bg-[#cc6500] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#cc6500]'
                                        }`}
                                    >
                                        <User className="w-5 h-5" /> Profile Setup
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('my-services')}
                                        className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            activeSection === 'my-services' 
                                                ? 'bg-[#cc6500] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#cc6500]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-5 h-5" /> My Services
                                        </div>
                                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                            {providerData.statistics.totalServices}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('bookings')}
                                        className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            activeSection === 'bookings' 
                                                ? 'bg-[#cc6500] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#cc6500]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CalendarCheck className="w-5 h-5" /> Bookings
                                        </div>
                                        {providerData.statistics.pendingBookings > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                {providerData.statistics.pendingBookings}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('payouts')}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            activeSection === 'payouts' 
                                                ? 'bg-[#cc6500] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#cc6500]'
                                        }`}
                                    >
                                        <Banknote className="w-5 h-5" /> Payouts
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('reviews')}
                                        className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            activeSection === 'reviews' 
                                                ? 'bg-[#cc6500] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#cc6500]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquareText className="w-5 h-5" /> Reviews
                                        </div>
                                        {providerData.statistics.totalReviews > 0 && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                {providerData.statistics.totalReviews}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats in Sidebar */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">This Month</span>
                                        <span className="font-semibold text-gray-900">{providerData.statistics.monthlyBookings} bookings</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Monthly Earnings</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(providerData.statistics.monthlyEarnings)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Available</span>
                                        <span className="font-semibold text-[#cc6500]">{formatCurrency(providerData.earnings.availableForWithdrawal)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-md border border-gray-100 min-h-[600px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Main component with auth guard
export default function ProviderDashboardPage() {
    return (
        <ProviderAuthGuard redirectTo="/auth?redirect=provider-dashboard">
            <ProviderDashboardContent />
        </ProviderAuthGuard>
    );
}