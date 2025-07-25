"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Briefcase, Settings, Mail, Phone, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(true); // true for Sign Up, false for Sign In
    const [showPassword, setShowPassword] = useState(false);
    const [currentAuthFlow, setCurrentAuthFlow] = useState('main'); // 'main', 'forgot-password', 'verify-email-phone'
    const [userType, setUserType] = useState('user'); // 'user' or 'provider'

    // Form states for sign up/in
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');

    const { isAuthenticated, login } = useAuth();
    const router = useRouter();

    // Effect to redirect if already authenticated and trying to access auth page
    useEffect(() => {
        if (isAuthenticated) {
            const storedRole = localStorage.getItem('fixify_user_role');
            if (storedRole === 'user') {
                router.replace('/dashboard');
            } else if (storedRole === 'provider') {
                router.replace('/provider-dashboard');
            } else if (storedRole === 'admin') {
                router.replace('/admin');
            } else {
                router.replace('/');
            }
        }
    }, [isAuthenticated, router]);

    const handleToggleAuthMode = () => {
        setIsSignUp(!isSignUp);
        setCurrentAuthFlow('main');
        setFullName(''); setEmail(''); setPhone(''); setPassword(''); setConfirmPassword(''); setOtp('');
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Simulating Sign Up Data:", { fullName, email, phone, password, confirmPassword, userType });
        login(userType);
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Simulating Sign In Data:", { email, password, userType });
        login(userType);
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Forgot Password Email:", email);
        alert("Password reset link simulated sent to your email!");
        setCurrentAuthFlow('main');
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("OTP Verification:", otp);
        alert("Account simulated verified successfully!");
        login(userType);
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
                        <button type="submit" className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg">
                            Send Reset Link
                        </button>
                    </form>
                    <p className="text-center text-gray-600 font-inter">
                        <button onClick={() => setCurrentAuthFlow('main')} className="text-[#cc6500] hover:underline font-semibold">
                            Back to Login
                        </button>
                    </p>
                </div>
            );
        }

        if (currentAuthFlow === 'verify-email-phone') {
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center font-poppins">Verify Your Account</h2>
                    <p className="text-gray-600 text-center font-inter">
                        Enter the OTP sent to your email or phone number.
                    </p>
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Smartphone className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                    placeholder="Enter OTP"
                                    maxLength= {6}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg">
                            Verify Account
                        </button>
                    </form>
                    <p className="text-center text-gray-600 font-inter">
                        Didn't receive code? <button onClick={() => alert("Simulating OTP resend...")} className="text-[#cc6500] hover:underline font-semibold">Resend OTP</button>
                    </p>
                </div>
            );
        }

        // Main Sign Up / Sign In Forms
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center font-poppins">
                    {isSignUp ? 'Create Your Fixify Account' : 'Welcome Back!'}
                </h2>

                {/* User/Provider Toggle */}
                <div className="flex bg-gray-100 rounded-full p-1 max-w-sm mx-auto">
                    <button
                        onClick={() => setUserType('user')}
                        className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-inter
                            ${userType === 'user' ? 'bg-[#cc6500] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
                    >
                        I'm a User
                    </button>
                    <button
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
                                    placeholder="Phone Number"
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
                                <span
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </span>
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

                    <button type="submit" className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg">
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                {/* Social Sign-in */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 font-inter">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button className="w-full bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-md">
                    <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="w-6 h-6" />
                    {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
                </button>

                {/* Switcher for Login/Sign Up & Forgot Password Link */}
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
                    {!isSignUp && (
                        <>
                            <br />
                            <button type="button" onClick={() => setCurrentAuthFlow('forgot-password')} className="text-[#cc6500] hover:underline font-semibold mt-2">
                                Forgot Password?
                            </button>
                        </>
                    )}
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