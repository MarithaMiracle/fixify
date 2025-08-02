// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, handleApiError } from '../lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isProvider: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  profileImage?: string;
  address?: any;
  walletBalance?: number;
  providerProfile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isProvider: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage and verify token on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('fixify_token');
        const storedUser = localStorage.getItem('fixify_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          
          try {
            // Verify token is still valid by fetching current user
            const response = await authAPI.me();
            if (response.data.success) {
              const userData = response.data.data.user;
              setUser(userData);
              localStorage.setItem('fixify_user', JSON.stringify(userData));
              localStorage.setItem('fixify_user_role', userData.isProvider ? 'provider' : 'user');
              console.log('✅ User authenticated:', userData);
            }
          } catch (error) {
            console.log('❌ Token invalid, clearing auth data');
            // Token is invalid, clear everything
            localStorage.removeItem('fixify_token');
            localStorage.removeItem('fixify_user');
            localStorage.removeItem('fixify_user_role');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        // Update state
        setUser(userData);
        setToken(userToken);
        
        // Store in localStorage
        localStorage.setItem('fixify_token', userToken);
        localStorage.setItem('fixify_user', JSON.stringify(userData));
        localStorage.setItem('fixify_user_role', userData.isProvider ? 'provider' : 'user');
        
        console.log('✅ Login successful:', userData);
        
        // Redirect based on user role
        if (userData.isProvider) {
          router.push('/provider-dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw new Error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      if (response.data.success) {
        console.log('✅ Registration successful');
        // Don't auto-login, redirect to login page
        router.push('/auth?tab=login&message=Registration successful! Please login.');
      }
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw new Error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (!token) return;
      
      const response = await authAPI.me();
      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem('fixify_user', JSON.stringify(userData));
        console.log('✅ User data refreshed');
      }
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);
      // If refresh fails, logout user
      logout();
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('fixify_token');
    localStorage.removeItem('fixify_user');
    localStorage.removeItem('fixify_user_role');
    
    console.log('✅ User logged out');
    router.push('/auth');
  };

  const isAuthenticated = !!user && !!token;
  const isProvider = user?.isProvider || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated,
      isProvider,
      login, 
      register, 
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};