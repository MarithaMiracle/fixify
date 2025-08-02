// src/components/ProviderAuthGuard.tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProviderAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProviderAuthGuard: React.FC<ProviderAuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const { user, loading, isAuthenticated, isProvider } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // User is not logged in
        console.log('❌ User not authenticated, redirecting to auth');
        router.push(redirectTo);
        return;
      }

      if (!isProvider) {
        // User is logged in but not a provider
        console.log('❌ User is not a provider, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }

      console.log('✅ Provider authenticated:', user?.fullName);
    }
  }, [user, loading, isAuthenticated, isProvider, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-[#cc6500]" />
        <p className="mt-4 text-xl font-semibold text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  // Show loading while redirecting
  if (!isAuthenticated || !isProvider) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-[#cc6500]" />
        <p className="mt-4 text-xl font-semibold text-gray-700">Redirecting...</p>
      </div>
    );
  }

  // User is authenticated and is a provider
  return <>{children}</>;
};

export default ProviderAuthGuard;