"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface BookingData {
  selectedService?: string;
  date?: string;
  time?: string;
  address?: string;
  city?: string;
  paymentMethod?: string;
  totalAmount?: string | number;
}

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-1 text-sm border-b border-gray-100 last:border-b-0">
    <span className="font-semibold text-gray-700 font-inter">{label}:</span>
    <span className="text-gray-800 font-inter">{value}</span>
  </div>
);

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  bookingData 
}) => {
  if (!isOpen) return null;

  // Format the total amount with currency symbol
  const formattedTotal = bookingData.totalAmount 
    ? `₦${Number(bookingData.totalAmount).toLocaleString('en-NG')}` 
    : '₦12,500'; // Fallback price

  return (
    <div 
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-[9999]"
      onClick={onClose} // Close modal when clicking on backdrop
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full text-center transform scale-100 opacity-100 transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation inside modal
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Booking Confirmed!</h2>
        <p className="text-lg text-gray-700 mb-6 font-inter">
          Your service request has been successfully placed. A confirmation has been sent to your email.
        </p>

        <div className="text-left mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">Booking Summary</h3>
          <DetailRow label="Service" value={bookingData.selectedService || 'Not specified'} />
          <DetailRow label="Date" value={bookingData.date || 'Not specified'} />
          <DetailRow label="Time" value={bookingData.time || 'Not specified'} />
          <DetailRow 
            label="Address" 
            value={
              bookingData.address && bookingData.city 
                ? `${bookingData.address}, ${bookingData.city}`
                : 'Not specified'
            } 
          />
          <DetailRow label="Payment Method" value={bookingData.paymentMethod || 'Not specified'} />
          
          <div className="flex justify-between py-1 mt-2 font-bold text-base border-t border-gray-300 pt-2">
            <span className="text-gray-800 font-poppins">Total:</span>
            <span className="text-[#cc6500] font-poppins">{formattedTotal}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full bg-[#cc6500] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-lg"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Add functionality to view booking details
              console.log('View booking details');
            }}
            className="w-full bg-white text-[#cc6500] border border-[#cc6500] px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-lg"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;