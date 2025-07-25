"use client";

import React from 'react';

import { CheckCircle } from 'lucide-react';

const BookingConfirmationModal = ({ isOpen, onClose, bookingData }) => {
    if (!isOpen) return null;

    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between py-1 text-sm border-b border-gray-100 last:border-b-0">
            <span className="font-semibold text-gray-700 font-inter">{label}:</span>
            <span className="text-gray-800 font-inter">{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full text-center transform scale-100 opacity-100 transition-all duration-300 ease-out">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Booking Confirmed!</h2>
                <p className="text-lg text-gray-700 mb-6 font-inter">Your service request has been successfully placed.</p>

                <div className="text-left mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">Summary</h3>
                    <DetailRow label="Service" value={bookingData.selectedService || 'N/A'} />
                    <DetailRow label="Date" value={bookingData.date || 'N/A'} />
                    <DetailRow label="Time" value={bookingData.time || 'N/A'} />
                    <DetailRow label="Address" value={`${bookingData.address}, ${bookingData.city}` || 'N/A'} />
                    <DetailRow label="Payment" value={bookingData.paymentMethod || 'N/A'} />
                    <div className="flex justify-between py-1 mt-2 font-bold text-base border-t border-gray-300 pt-2">
                        <span className="text-gray-800 font-poppins">Total:</span>
                        <span className="text-[#cc6500] font-poppins">₦12,500</span> {/* Example price, match summary */}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmationModal;