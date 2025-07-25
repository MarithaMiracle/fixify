"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define an interface for the AuthContext value for type safety
interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    loading: boolean;
    login: (role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    // Effect to run once on component mount to check for stored session/role
    useEffect(() => {
        console.log("AuthContext: useEffect - Checking localStorage for role...");
        const storedRole = localStorage.getItem('fixify_user_role');
    
        if (storedRole && ['user', 'provider', 'admin'].includes(storedRole)) {
            setIsAuthenticated(true);
            setUserRole(storedRole);
            console.log("AuthContext: Found stored role:", storedRole);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
            console.log("AuthContext: No valid stored role found or role is invalid.");
        
            if (storedRole) {
                localStorage.removeItem('fixify_user_role');
            }
        }
        setLoading(false);
    }, []);

    // Function to simulate user login
    const login = (role: string) => {
        console.log("AuthContext: login function called with role:", role);
        setIsAuthenticated(true);
        setUserRole(role);
        localStorage.setItem('fixify_user_role', role);
        console.log("AuthContext: State updated: isAuthenticated=true, userRole=", role);

        // Redirect to the appropriate dashboard
        let redirectPath = '/';
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
    const logout = () => {
        console.log("AuthContext: logout function called.");
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('fixify_user_role');
        console.log("AuthContext: State updated: isAuthenticated=false, userRole=null.");
        router.push('/auth');
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};