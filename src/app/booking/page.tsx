"use client";

import React, { useState } from 'react';


import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingProgressBar from '../components/booking/BookingProgressBar';
import BookingConfirmationModal from '../booking/BookingConfirmationModal';
import Step1SelectService from '../components/booking/steps/Step1SelectService';
import Step2ChooseDateTime from '../components/booking/steps/Step2ChooseDateTime';
import Step3EnterDetails from '../components/booking/steps/Step3EnterDetails';
import Step4PaymentOptions from '../components/booking/steps/Step4PaymentOptions';
import Step5ConfirmSummary from '../components/booking/steps/Step5ConfirmSummary';


export default function BookingFlowPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const handleNextStep = (data: {}) => {
        setBookingData((prev) => ({ ...prev, ...data }));
        setCurrentStep(currentStep + 1);
        console.log("Current Booking Data (after step):", { ...bookingData, ...data });
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleConfirmBooking = () => {
        console.log("Final Booking Data:", bookingData);
        setShowConfirmationModal(true);
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setCurrentStep(1);
        setBookingData({});
    };

    const handleCancelBooking = () => {
        console.log("Booking cancelled.");
        alert("Booking cancelled.");
        setCurrentStep(1);
        setBookingData({});
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1SelectService onNextStep={handleNextStep} onCancel={handleCancelBooking} />;
            case 2:
                return <Step2ChooseDateTime onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />;
            case 3:
                return <Step3EnterDetails onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />;
            case 4:
                return <Step4PaymentOptions onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />;
            case 5:
                return <Step5ConfirmSummary
                            bookingData={bookingData}
                            onPreviousStep={handlePreviousStep}
                            onConfirmBooking={handleConfirmBooking}
                        />;
            default:
                return null;
        }
    };

    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-6">
                        {/* Progress Bar */}
                        <BookingProgressBar currentStep={currentStep} />

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
