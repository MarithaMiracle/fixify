// src/app/booking/page.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useCreateBooking } from '../../hooks/useCreateBooking';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingProgressBar from '../components/booking/BookingProgressBar';
import BookingConfirmationModal from '../booking/BookingConfirmationModal';
import Step1SelectService from '../components/booking/steps/Step1SelectService';
import Step2ChooseDateTime from '../components/booking/steps/Step2ChooseDateTime';
import Step3EnterDetails from '../components/booking/steps/Step3EnterDetails';
import Step4PaymentOptions from '../components/booking/steps/Step4PaymentOptions';
import Step5ConfirmSummary from '../components/booking/steps/Step5ConfirmSummary';

interface BookingData {
    selectedService?: string;
    serviceDescription?: string;
    couponCode?: string;
    date?: string;
    time?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    notes?: string;
    paymentMethod?: string;
}

export default function BookingFlowPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState<BookingData>({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [error, setError] = useState('');
    
    const { isAuthenticated, user } = useAuth();
    const { createBooking, loading } = useCreateBooking();
    const router = useRouter();

    // Redirect to auth if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
        }
    }, [isAuthenticated, router]);

    const handleNextStep = (data: any) => {
        setBookingData((prev) => ({ ...prev, ...data }));
        setCurrentStep(currentStep + 1);
        setError('');
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
        setError('');
    };

    const handleConfirmBooking = async () => {
        try {
            setError('');
            
            // Prepare booking data for API
            const bookingPayload = {
                serviceId: bookingData.selectedService || '', // This should be service ID from step 1
                scheduledDate: bookingData.date || '',
                scheduledTime: bookingData.time || '',
                address: {
                    street: bookingData.address || '',
                    city: bookingData.city || '',
                    state: bookingData.state || '',
                },
                specialInstructions: bookingData.notes || '',
                paymentMethod: bookingData.paymentMethod as 'card' | 'wallet' | 'paystack' || 'paystack',
            };

            const booking = await createBooking(bookingPayload);
            
            if (booking) {
                setShowConfirmationModal(true);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create booking');
        }
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setCurrentStep(1);
        setBookingData({});
        router.push('/dashboard');
    };

    const handleCancelBooking = () => {
        setCurrentStep(1);
        setBookingData({});
        router.push('/');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1SelectService onNextStep={handleNextStep} onCancel={handleCancelBooking} />;
            case 2:
                return <Step2ChooseDateTime onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />;
            case 3:
                return <Step3EnterDetails 
                    onNextStep={handleNextStep} 
                    onPreviousStep={handlePreviousStep}
                    initialData={{
                        fullName: user?.fullName || '',
                        email: user?.email || '',
                        phoneNumber: user?.phone || '',
                    }}
                />;
            case 4:
                return <Step4PaymentOptions onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />;
            case 5:
                return <Step5ConfirmSummary
                    bookingData={bookingData}
                    onPreviousStep={handlePreviousStep}
                    onConfirmBooking={handleConfirmBooking}
                    loading={loading}
                />;
            default:
                return null;
        }
    };

    if (!isAuthenticated) {
        return null; // Will redirect to auth
    }

    return (
        <>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-6">
                        {/* Progress Bar */}
                        <BookingProgressBar currentStep={currentStep} />

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                                {error}
                            </div>
                        )}

                        {/* Render Current Step */}
                        {renderStep()}
                    </div>
                </main>

                {/* Confirmation Modal */}
                <BookingConfirmationModal
                    isOpen={showConfirmationModal}
                    onClose={handleCloseConfirmationModal}
                    bookingData={bookingData}
                />
            </div>
        </>
    );
}