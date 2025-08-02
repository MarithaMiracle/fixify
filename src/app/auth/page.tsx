"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const { isAuthenticated, login, register, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // Redirect if already authenticated
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#cc6500]"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        router.replace('/dashboard');
        return null; // Return null to prevent rendering anything before redirect
    }

    const [isSignUp, setIsSignUp] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState<'user' | 'provider'>('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleToggleAuthMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        // Clear form
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
    };

    const validateForm = () => {
        if (isSignUp) {
            if (!fullName.trim()) {
                setError('Full name is required');
                return false;
            }
            if (!phone.trim()) {
                setError('Phone number is required');
                return false;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }
        
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        
        return true;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            await register({
                fullName,
                email,
                phone,
                password,
                role: userType,
            });
            router.push('/auth/check-email');
        } catch (err: any) {
            // Correctly access the error message from the backend response
            // The message is typically found in err.response.data.message
            const backendErrorMsg = err.response?.data?.message || err.message || 'Registration failed';
            setError(backendErrorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            await login({
                email,
                password,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center font-poppins">
                        {isSignUp ? 'Create Your Fixify Account' : 'Welcome Back!'}
                    </h2>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                            <span>{error}</span>
                            {error.includes('already exists') && (
                                <button
                                    type="button"
                                    onClick={handleToggleAuthMode}
                                    className="text-[#cc6500] hover:underline font-semibold"
                                >
                                    Log In
                                </button>
                            )}
                        </div>
                    )}

                    {/* User/Provider Toggle */}
                    <div className="flex bg-gray-100 rounded-full p-1 max-w-sm mx-auto">
                        <button
                            type="button"
                            onClick={() => setUserType('user')}
                            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-inter
                                ${userType === 'user' ? 'bg-[#cc6500] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            I'm a User
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('provider')}
                            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-inter
                                ${userType === 'provider' ? 'bg-[#cc6500] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            I'm a Service Provider
                        </button>
                    </div>

                    <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
                        {isSignUp && (
                            <div>
                                <label htmlFor="full-name" className="sr-only">Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        id="full-name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                        placeholder="Full Name"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}
                        
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
                        
                        {isSignUp && (
                            <div>
                                <label htmlFor="phone" className="sr-only">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                        placeholder="Phone Number (e.g., 08012345678)"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}
                        
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

                        {/* --- Added "Forgot password?" link here, only for login --- */}
                        {!isSignUp && (
                            <div className="text-right">
                                <Link href="/forgot-password" className="text-sm text-[#cc6500] hover:text-[#a95500] hover:underline font-semibold">
                                    Forgot password?
                                </Link>
                            </div>
                        )}
                        
                        {isSignUp && (
                            <div>
                                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                        placeholder="Confirm Password"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {isSignUp && (
                            <div className="flex items-center">
                                <input type="checkbox" id="terms" className="h-4 w-4 text-[#cc6500] focus:ring-[#cc6500] border-gray-300 rounded" required />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 font-inter">
                                    I agree to the <Link href="/terms" className="text-[#cc6500] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#cc6500] hover:underline">Privacy Policy</Link>.
                                </label>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                                </>
                            ) : (
                                isSignUp ? 'Sign Up' : 'Log In'
                            )}
                        </button>
                    </form>

                    {/* Toggle between Login/Sign Up */}
                    <p className="text-center text-gray-600 font-inter">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <button type="button" onClick={handleToggleAuthMode} className="text-[#cc6500] hover:underline font-semibold">
                                    Log In
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button type="button" onClick={handleToggleAuthMode} className="text-[#cc6500] hover:underline font-semibold">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
