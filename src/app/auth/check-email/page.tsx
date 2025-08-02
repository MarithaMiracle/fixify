// src/app/auth/check-email/page.tsx
import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <Mail className="w-16 h-16 text-[#cc6500]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please click the link to activate your account.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Didn't receive the email?</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              className="flex items-center justify-center text-[#cc6500] hover:text-[#a95500] transition-colors font-semibold"
            >
              Resend Email <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <Link
              href="/auth"
              className="flex items-center justify-center text-[#cc6500] hover:text-[#a95500] transition-colors font-semibold"
            >
              Go to Login <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
