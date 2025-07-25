"use client";

import React from 'react';

import { MapPin, Calendar, CreditCard, ClipboardList, CheckCircle } from 'lucide-react';

const BookingProgressBar = ({ currentStep }) => {
    const steps = [
        { name: "Service", icon: <ClipboardList className="w-5 h-5" /> },
        { name: "Time & Date", icon: <Calendar className="w-5 h-5" /> },
        { name: "Details", icon: <MapPin className="w-5 h-5" /> },
        { name: "Payment", icon: <CreditCard className="w-5 h-5" /> },
        { name: "Confirm", icon: <CheckCircle className="w-5 h-5" /> },
    ];

    return (
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 overflow-x-auto whitespace-nowrap">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[100px] sm:min-w-[unset]">
                    <div
                        className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold mb-2 transition-all duration-300 ease-in-out
                            ${index + 1 === currentStep ? 'bg-[#cc6500] text-white shadow-lg' :
                               index + 1 < currentStep ? 'bg-green-500 text-white' :
                               'bg-gray-200 text-gray-600'}`}
                    >
                        {step.icon}
                        {index + 1 < currentStep && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-white fill-green-700" />
                            </div>
                        )}
                    </div>
                    <span className={`text-sm text-center font-inter ${index + 1 === currentStep ? 'text-[#cc6500] font-bold' : 'text-gray-600'}`}>
                        {step.name}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={`absolute top-1/2 left-[calc(50%+20px)] w-[calc(100%-40px)] h-1 bg-gray-200 -z-10 transition-all duration-300 ease-in-out
                            ${index + 1 < currentStep ? 'bg-green-500' : ''}`} style={{ width: 'calc(100% / ' + (steps.length - 1) + ' - 20px)' }} ></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BookingProgressBar;