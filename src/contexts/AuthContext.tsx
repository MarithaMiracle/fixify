// src/contexts/AuthContext.tsx
"use client"; // IMPORTANT: This component uses client-side React Hooks

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // IMPORTANT: For client-side redirection in Client Components

// Define an interface for the AuthContext value for type safety
interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    loading: boolean;
    login: (role: string) => void; // Corrected: `role` is a string, returns void
    logout: () => void; // Corrected: returns void
}

// 1. Create the Context object
//    It's typed to accept AuthContextType or null, with null as the initial default.
const AuthContext = createContext<AuthContextType | null>(null);

// 2. AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading of initial auth check
    const router = useRouter(); // Initialize useRouter hook

    // Effect to run once on component mount to check for stored session/role
    useEffect(() => {
        console.log("AuthContext: useEffect - Checking localStorage for role...");
        const storedRole = localStorage.getItem('fixify_user_role');
        // Validate storedRole against allowed roles to prevent unexpected types
        if (storedRole && ['user', 'provider', 'admin'].includes(storedRole)) {
            setIsAuthenticated(true);
            setUserRole(storedRole);
            console.log("AuthContext: Found stored role:", storedRole);
        } else {
            // If no valid role is found, ensure state reflects unauthenticated
            setIsAuthenticated(false);
            setUserRole(null);
            console.log("AuthContext: No valid stored role found or role is invalid.");
            // Optionally, clear invalid stored data:
            if (storedRole) {
                localStorage.removeItem('fixify_user_role');
            }
        }
        setLoading(false); // Set loading to false after initial check
    }, []); // Empty dependency array ensures this runs only once

    // Function to simulate user login
    const login = (role: string) => { // Corrected: `role` is a string
        console.log("AuthContext: login function called with role:", role);
        setIsAuthenticated(true);
        setUserRole(role);
        localStorage.setItem('fixify_user_role', role); // Persist role
        console.log("AuthContext: State updated: isAuthenticated=true, userRole=", role);

        // Redirect to the appropriate dashboard
        let redirectPath = '/'; // Default redirect
        if (role === 'user') {
            redirectPath = '/dashboard/user';
        } else if (role === 'provider') {
            redirectPath = '/dashboard/provider';
        } else if (role === 'admin') {
            redirectPath = '/admin';
        }
        console.log("AuthContext: Redirecting to:", redirectPath);
        router.push(redirectPath); // Perform client-side navigation
    };

    // Function to simulate user logout
    const logout = () => { // Corrected: returns void
        console.log("AuthContext: logout function called.");
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('fixify_user_role'); // Clear persisted role
        console.log("AuthContext: State updated: isAuthenticated=false, userRole=null.");
        router.push('/auth'); // Redirect to auth page after logout
    };

    // The value object provided by the context
    const value: AuthContextType = {
        isAuthenticated,
        userRole,
        loading,
        login,
        logout,
    };

    // Show a loading indicator while the initial authentication check is in progress
    if (loading) {
        console.log("AuthContext: Rendering loading state.");
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">Loading authentication...</div>;
    }

    console.log("AuthContext: Rendering children. Current auth state:", { isAuthenticated, userRole });
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Custom hook for easy consumption of the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    // Ensure the hook is used within an AuthProvider and context is not null
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};