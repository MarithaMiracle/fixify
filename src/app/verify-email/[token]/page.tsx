// src/app/verify-email/[token]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../../lib/api';

// Define the shape of the component's props, which will include the URL parameters.
interface VerifyEmailPageProps {
  params: {
    token: string;
  };
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const router = useRouter();
  const { token } = params;

  // State to manage the verification process status
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found.');
        return;
      }

      try {
        // The key change is here: we now use a GET request
        // and send the token as part of the URL, matching your backend route.
        await apiClient.get(`/auth/verify-email/${token}`);

        setStatus('success');
        setMessage('Email verified successfully! You will be redirected to the login page shortly.');

        // Redirect the user to the login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error: any) {
        console.error('Email verification failed:', error);
        setStatus('error');
        // Use a more user-friendly error message if available from the backend
        setMessage(error.response?.data?.message || 'Email verification failed. The link may be expired or invalid.');
      }
    };

    verifyToken();
  }, [token, router]); // Dependency array ensures the effect re-runs if token or router changes

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#cc6500] animate-spin mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Verifying your email...</h1>
            <p className="text-gray-600 font-inter">Please wait, this may take a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Verification Successful!</h1>
            <p className="text-gray-600 font-inter">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Verification Failed</h1>
            <p className="text-gray-600 font-inter">{message}</p>
            <button
                onClick={() => router.push('/login')}
                className="mt-6 w-full max-w-xs bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg"
            >
                Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
