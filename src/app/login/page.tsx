"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [currentAuthFlow, setCurrentAuthFlow] = useState('main'); // 'main', 'forgot-password'

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI states for feedback
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { user, login } = useAuth();
    const router = useRouter();

    // Effect to redirect if already authenticated
    useEffect(() => {
        if (user) {
            if (user.role === 'user') {
                router.replace('/dashboard');
            } else if (user.role === 'provider') {
                router.replace('/provider-dashboard');
            } else {
                router.replace('/'); // Fallback
            }
        }
    }, [user, router]);

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required.');
            return false;
        }
        
        if (!password.trim()) {
            setError('Password is required.');
            return false;
        }
        
        return true;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); setError('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            await login({ email, password });
            setMessage('Logged in successfully! Redirecting...');
        } catch (err: any) {
            console.error("Sign In Error:", err.message);
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('Google Sign-in requires a backend implementation. This feature is not yet available.');
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); setError('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link.');
            }

            setMessage('If an account with that email exists, a password reset link has been sent.');
            setCurrentAuthFlow('main');
        } catch (err: any) {
            console.error("Forgot Password Error:", err.message);
            setError('Failed to send password reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderAuthForm = () => {
        if (currentAuthFlow === 'forgot-password') {
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center font-poppins">Reset Your Password</h2>
                    <p className="text-gray-600 text-center font-inter">Enter your email to receive a password reset link.</p>
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                        <div>
                            <label htmlFor="reset-email" className="sr-only">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    id="reset-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Sending Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                    <p className="text-center text-gray-600 font-inter">
                        <button onClick={() => setCurrentAuthFlow('main')} className="text-[#cc6500] hover:underline font-semibold flex items-center justify-center">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </button>
                    </p>
                </div>
            );
        }

        // Main Sign In Form
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center font-poppins">Welcome Back!</h2>

                {/* Message or Error Display */}
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="sr-only">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                placeholder="Password"
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <button type="button" onClick={() => setCurrentAuthFlow('forgot-password')} className="text-sm text-[#cc6500] hover:text-[#a95500] hover:underline font-semibold">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Logging In...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {/* Social Sign-in */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 font-inter">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="w-6 h-6" />
                    )}
                    Log in with Google
                </button>

                <p className="text-center text-gray-600 font-inter">
                    Don't have an account?{' '}
                    <Link href="/auth" className="text-[#cc6500] hover:underline font-semibold">
                        Sign Up
                    </Link>
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
                {renderAuthForm()}
            </div>
        </div>
    );
}
