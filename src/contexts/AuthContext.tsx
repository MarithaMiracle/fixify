// src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, RegisterData, LoginData } from '../lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'provider' | 'admin';
  isEmailVerified: boolean;
  profileImage?: string;
  walletBalance?: number;
  providerProfile?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check for stored token and validate on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('fixify_token');
      
      if (token) {
        try {
          const response = await authAPI.me();
          if (response.data.success) {
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem('fixify_token');
            localStorage.removeItem('fixify_user_role');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('fixify_token');
          localStorage.removeItem('fixify_user_role');
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('fixify_token', token);
        localStorage.setItem('fixify_user_role', userData.role);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Redirect based on role
        const redirectPath = getRedirectPath(userData.role);
        router.push(redirectPath);
      } else {
        throw new Error('Login failed: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('fixify_token', token);
        localStorage.setItem('fixify_user_role', userData.role);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Redirect based on role
        const redirectPath = getRedirectPath(userData.role);
        router.push(redirectPath);
      } else {
        throw new Error('Registration failed: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fixify_token');
    localStorage.removeItem('fixify_user_role');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const getRedirectPath = (role: string): string => {
    switch (role) {
      case 'user': return '/dashboard';
      case 'provider': return '/provider-dashboard';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#cc6500]"></div>
      </div>
    );
  }

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