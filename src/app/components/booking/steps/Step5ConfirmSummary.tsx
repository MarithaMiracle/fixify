"use client";

import React from 'react';

import { CheckCircle, ChevronLeft } from 'lucide-react';

const Step5ConfirmSummary = ({ bookingData, onPreviousStep, onConfirmBooking }) => {
    // Helper function to render a detail row
    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 font-inter">{label}:</span>
            <span className="text-gray-800 font-inter">{value}</span>
        </div>
    );

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins text-center">Confirm Your Booking</h2>
            <p className="text-gray-700 mb-8 text-center font-inter">Please review all the details below before confirming your service.</p>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Booking Summary</h3>
                <DetailRow label="Service Category" value={bookingData.selectedService || 'N/A'} />
                {bookingData.serviceDescription && (
                    <DetailRow label="Service Description" value={bookingData.serviceDescription} />
                )}
                {bookingData.couponCode && (
                    <DetailRow label="Coupon Code" value={bookingData.couponCode} />
                )}
                <DetailRow label="Date" value={bookingData.date || 'N/A'} />
                <DetailRow label="Time" value={bookingData.time || 'N/A'} />
                <DetailRow label="Full Name" value={bookingData.fullName || 'N/A'} />
                <DetailRow label="Email" value={bookingData.email || 'N/A'} />
                <DetailRow label="Phone Number" value={bookingData.phoneNumber || 'N/A'} />
                <DetailRow label="Address" value={`${bookingData.address}, ${bookingData.city}, ${bookingData.state}` || 'N/A'} />
                {bookingData.notes && (
                    <DetailRow label="Additional Notes" value={bookingData.notes} />
                )}
                <DetailRow label="Payment Method" value={bookingData.paymentMethod || 'N/A'} />
                
                {/* Dummy Total Price */}
                <div className="flex justify-between items-center py-2 mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                    <span className="font-bold text-lg text-gray-800 font-poppins">Estimated Total:</span>
                    <span className="font-bold text-lg text-[#cc6500] font-poppins">₦12,500</span> {/* Example price */}
                </div>
            </div>

            <div className="flex justify-between gap-4">
                <button
                    type="button"
                    onClick={onPreviousStep}
                    className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-md font-semibold hover:bg-gray-100 transition-all duration-300 ease-in-out shadow-sm font-inter"
                >
                    <ChevronLeft className="inline-block mr-1 w-5 h-5" /> Previous
                </button>
                <button
                    type="button"
                    onClick={onConfirmBooking}
                    className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-full text-md font-semibold hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md font-inter"
                >
                    Confirm Booking <CheckCircle className="inline-block ml-1 w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Step5ConfirmSummary;