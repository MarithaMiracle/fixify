// src/app/auth/page.tsx
"use client"; // This component uses client-side React Hooks

import React, { useState } from 'react';
import { User, Briefcase, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook

export default function AuthPage() { // Renamed from LoginPage for clarity if using /auth route
    const [selectedRole, setSelectedRole] = useState('user');
    const { login } = useAuth(); // Get the login function from context

    const handleSimulateLogin = () => {
        login(selectedRole); // Call the login function from context
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
                    onClick={handleSimulateLogin}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#cc6500] hover:bg-[#a95500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc6500] font-inter transition-all duration-200 ease-in-out shadow-md"
                >
                    Simulate Login
                </button>
            </div>
        </div>
    );
}