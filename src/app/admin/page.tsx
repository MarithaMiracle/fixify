"use client";

import React, { useState } from 'react';

import {
    LayoutDashboard, Users, UserCog, Briefcase, CalendarCheck, Banknote, MessageSquareText, Check, Eye, Trash2, Edit, DollarSign, Ban, RefreshCcw, BellRing, LogOut, ClipboardList
} from 'lucide-react';

export default function AdminDashboardPage() {
    const [activeSection, setActiveSection] = useState('overview');

    // Dummy Data for Admin Dashboard
    const dashboardStats = {
        totalUsers: 1540,
        activeProviders: 320,
        pendingBookings: 15,
        totalRevenue: "₦12,500,000"
    };

    const recentActivities = [
        { id: 1, type: "New User Registration", description: "John Doe signed up.", date: "2 mins ago" },
        { id: 2, type: "Booking Confirmed", description: "Plumbing repair for Jane Smith.", date: "1 hour ago" },
        { id: 3, type: "New Provider Application", description: "Sarah Adebayo applied as a Caterer.", date: "4 hours ago" },
        { id: 4, type: "Withdrawal Request", description: "Provider Payout for A. Musa (₦50,000).", date: "yesterday" },
    ];

    const usersData = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", joined: "Jan 15, 2023" },
        { id: 2, name: "Bob Williams", email: "bob@example.com", status: "Inactive", joined: "Feb 20, 2023" },
        { id: 3, name: "Charlie Davis", email: "charlie@example.com", status: "Active", joined: "Mar 01, 2024" },
    ];

    const providersData = [
        { id: 1, name: "Grace Electric", email: "grace@example.com", category: "Electrical", status: "Approved", joined: "Apr 01, 2023", verified: true },
        { id: 2, name: "Swift Cleaners", email: "swift@example.com", category: "Cleaning", status: "Pending", joined: "May 10, 2024", verified: false },
        { id: 3, name: "Max Plumbing", email: "max@example.com", category: "Plumbing", status: "Approved", joined: "Mar 15, 2023", verified: true },
    ];

    const serviceListings = [
        { id: 1, name: "Leak Repair", category: "Plumbing", provider: "Max Plumbing", price: "₦10,000", status: "Active" },
        { id: 2, name: "Event Decor", category: "Catering & Events", provider: "Dream Events", price: "₦150,000", status: "Active" },
        { id: 3, name: "Post Construction Clean", category: "Cleaning", provider: "Swift Cleaners", price: "₦30,000", status: "Pending Approval" },
    ];

    const bookingsOverview = [
        { id: 1, service: "AC Repair", client: "Alice Johnson", provider: "Cooling Tech", date: "Aug 10, 2024", status: "Confirmed", amount: "₦25,000" },
        { id: 2, service: "Hair Braiding", client: "Emily White", provider: "Beauty Hub", date: "Aug 12, 2024", status: "Pending", amount: "₦8,000" },
        { id: 3, service: "Event Setup", client: "Daniel Green", provider: "Event Pros", date: "Jul 28, 2024", status: "Completed", amount: "₦120,000" },
    ];

    const disputes = [
        { id: 1, type: "Payment Issue", reportedBy: "Client (Alice J.)", concerning: "Provider (Cooling Tech)", status: "Open", date: "Aug 05, 2024" },
        { id: 2, type: "Service Quality", reportedBy: "Provider (Max Plumbing)", concerning: "Client (Bob W.)", status: "Resolved", date: "Jul 20, 2024" },
    ];

    const withdrawals = [
        { id: 1, provider: "Grace Electric", amount: "₦50,000", date: "Aug 01, 2024", status: "Approved" },
        { id: 2, provider: "Swift Cleaners", amount: "₦20,000", date: "Jul 25, 2024", status: "Pending" },
    ];

    // Placeholder actions
    const handleViewDetails = (type: string, id: number) => alert(`View details for ${type} ID: ${id}`);
    const handleEdit = (type: string, id: number) => alert(`Edit ${type} ID: ${id}`);
    const handleDelete = (type: string, id: number) => { if (confirm(`Are you sure you want to delete ${type} ID: ${id}?`)) alert(`${type} ID: ${id} deleted!`); };
    const handleApprove = (id: number) => alert(`Approved Provider ID: ${id}`);
    const handleReject = (id: number) => alert(`Rejected Provider ID: ${id}`);
    const handleResolve = (id: number) => alert(`Dispute ID: ${id} resolved!`);


    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-[#fffbf5] p-5 rounded-lg shadow-sm border border-[#ffc14d] text-center">
                                <Users className="w-8 h-8 text-[#cc6500] mx-auto mb-3" />
                                <p className="text-gray-600 font-inter text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 font-poppins">{dashboardStats.totalUsers}</p>
                            </div>
                            <div className="bg-[#e6f7f7] p-5 rounded-lg shadow-sm border border-[#a8edea] text-center">
                                <UserCog className="w-8 h-8 text-[#00796B] mx-auto mb-3" />
                                <p className="text-gray-600 font-inter text-sm">Active Providers</p>
                                <p className="text-2xl font-bold text-gray-900 font-poppins">{dashboardStats.activeProviders}</p>
                            </div>
                            <div className="bg-[#ffebe6] p-5 rounded-lg shadow-sm border border-[#ffc4b3] text-center">
                                <ClipboardList className="w-8 h-8 text-[#FF7F50] mx-auto mb-3" />
                                <p className="text-gray-600 font-inter text-sm">Pending Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 font-poppins">{dashboardStats.pendingBookings}</p>
                            </div>
                            <div className="bg-[#f0f8ff] p-5 rounded-lg shadow-sm border border-[#bfd8ff] text-center">
                                <DollarSign className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
                                <p className="text-gray-600 font-inter text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 font-poppins">{dashboardStats.totalRevenue}</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Recent Activity</h3>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {recentActivities.length > 0 ? (
                                <ul className="space-y-3">
                                    {recentActivities.map((activity) => (
                                        <li key={activity.id} className="flex justify-between items-center text-gray-700 text-sm font-inter py-2 border-b border-gray-100 last:border-b-0">
                                            <span><span className="font-semibold">{activity.type}:</span> {activity.description}</span>
                                            <span className="text-gray-500">{activity.date}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 font-inter">No recent activity.</p>
                            )}
                        </div>
                    </div>
                );
            case 'users-management':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Users Management</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {usersData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Email</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Joined</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {usersData.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{user.name}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{user.email}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{user.joined}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleViewDetails('User', user.id)} className="text-[#cc6500] hover:text-[#a95500] mr-3">
                                                            <Eye className="w-5 h-5 inline" />
                                                        </button>
                                                        <button onClick={() => handleDelete('User', user.id)} className="text-red-600 hover:text-red-800">
                                                            <Trash2 className="w-5 h-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-inter">No users found.</p>
                            )}
                        </div>
                    </div>
                );
            case 'providers-management':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Service Providers Management</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {providersData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Category</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Joined</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {providersData.map((provider) => (
                                                <tr key={provider.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{provider.name}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{provider.category}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${provider.status === 'Approved' ? 'bg-green-100 text-green-800' : provider.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                            {provider.status} {provider.verified && <Check className="w-3 h-3 inline-block ml-1" />}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{provider.joined}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleViewDetails('Provider', provider.id)} className="text-[#cc6500] hover:text-[#a95500] mr-3">
                                                            <Eye className="w-5 h-5 inline" />
                                                        </button>
                                                        {provider.status === 'Pending' && (
                                                            <>
                                                                <button onClick={() => handleApprove(provider.id)} className="text-green-600 hover:text-green-800 mr-3">
                                                                    <Check className="w-5 h-5 inline" />
                                                                </button>
                                                                <button onClick={() => handleReject(provider.id)} className="text-red-600 hover:text-red-800 mr-3">
                                                                    <Ban className="w-5 h-5 inline" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => handleDelete('Provider', provider.id)} className="text-red-600 hover:text-red-800">
                                                            <Trash2 className="w-5 h-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-inter">No service providers found.</p>
                            )}
                        </div>
                    </div>
                );
            case 'service-listings':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Service Listings</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {serviceListings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Service Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Category</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Provider</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Price</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {serviceListings.map((service) => (
                                                <tr key={service.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{service.name}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{service.category}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{service.provider}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#cc6500] font-semibold font-inter">{service.price}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {service.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleEdit('Service', service.id)} className="text-[#cc6500] hover:text-[#a95500] mr-3">
                                                            <Edit className="w-5 h-5 inline" />
                                                        </button>
                                                        <button onClick={() => handleDelete('Service', service.id)} className="text-red-600 hover:text-red-800">
                                                            <Trash2 className="w-5 h-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-inter">No service listings found.</p>
                            )}
                        </div>
                    </div>
                );
            case 'bookings-overview':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Bookings Overview</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {bookingsOverview.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Service</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Client</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Provider</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Amount</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {bookingsOverview.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{booking.service}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{booking.client}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{booking.provider}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{booking.date}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#cc6500] font-semibold font-inter">{booking.amount}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleViewDetails('Booking', booking.id)} className="text-[#cc6500] hover:text-[#a95500] mr-3">
                                                            <Eye className="w-5 h-5 inline" />
                                                        </button>
                                                        {booking.status !== 'Completed' && (
                                                            <button onClick={() => alert(`Mark booking ${booking.id} as completed`)} className="text-green-600 hover:text-green-800">
                                                                <Check className="w-5 h-5 inline" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-inter">No bookings found.</p>
                            )}
                        </div>
                    </div>
                );
            case 'disputes-resolution':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Disputes Resolution</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {disputes.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Type</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Reported By</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Concerning</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Date</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {disputes.map((dispute) => (
                                                <tr key={dispute.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{dispute.type}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{dispute.reportedBy}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{dispute.concerning}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dispute.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {dispute.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{dispute.date}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleViewDetails('Dispute', dispute.id)} className="text-[#cc6500] hover:text-[#a95500] mr-3">
                                                            <Eye className="w-5 h-5 inline" />
                                                        </button>
                                                        {dispute.status === 'Open' && (
                                                            <button onClick={() => handleResolve(dispute.id)} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-600">
                                                                Resolve
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-inter">No disputes to resolve.</p>
                            )}
                        </div>
                    </div>
                );
            case 'withdrawals-monitoring':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Withdrawals Monitoring</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            {withdrawals.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Provider</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Amount</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Status</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {withdrawals.map((withdrawal) => (
                                                <tr key={withdrawal.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{withdrawal.provider}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#cc6500] font-semibold font-inter">{withdrawal.amount}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-inter">{withdrawal.date}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${withdrawal.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {withdrawal.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        {withdrawal.status === 'Pending' && (
                                                            <button onClick={() => alert(`Approve withdrawal ${withdrawal.id}`)} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-600 mr-2">
                                                                Approve
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleViewDetails('Withdrawal', withdrawal.id)} className="text-[#cc6500] hover:text-[#a95500]">
                                                            <Eye className="w-5 h-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-inter">No withdrawal requests.</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-6">
                        {/* Admin Dashboard Header */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 font-poppins">Fixify Admin Panel</h1>
                                <p className="text-gray-600 text-sm font-inter mt-1 sm:ml-4 sm:mt-0">Platform overview and management.</p>
                            </div>
                            <div className="mt-6 sm:mt-0 flex gap-4">
                                <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4" /> Refresh Data
                                </button>
                                <button className="bg-[#cc6500] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#a95500] transition-colors shadow-md flex items-center gap-2">
                                    <BellRing className="w-4 h-4" /> Notifications
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar Navigation */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24">
                                <ul className="space-y-2">
                                    <li className="mb-4 text-gray-500 text-xs uppercase font-semibold font-inter tracking-wider">Dashboard Navigation</li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('overview')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'overview' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <LayoutDashboard className="w-5 h-5" /> Dashboard Overview
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('users-management')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'users-management' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <Users className="w-5 h-5" /> Users Management
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('providers-management')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'providers-management' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <UserCog className="w-5 h-5" /> Service Providers Management
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('service-listings')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'service-listings' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <Briefcase className="w-5 h-5" /> Service Listings
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('bookings-overview')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'bookings-overview' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <CalendarCheck className="w-5 h-5" /> Bookings Overview
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('disputes-resolution')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'disputes-resolution' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <MessageSquareText className="w-5 h-5" /> Disputes Resolution
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveSection('withdrawals-monitoring')}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out font-inter
                                                ${activeSection === 'withdrawals-monitoring' ? 'bg-[#ffedd5] text-[#cc6500]' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <Banknote className="w-5 h-5" /> Withdrawals Monitoring
                                        </button>
                                    </li>
                                    <li className="mt-6 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => alert("Logging out of Admin Panel...")} // Placeholder for logout
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
        </>
    );
}
