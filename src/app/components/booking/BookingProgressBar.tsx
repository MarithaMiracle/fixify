"use client";

import React from 'react';
import { MapPin, Calendar, CreditCard, ClipboardList, CheckCircle } from 'lucide-react';

interface BookingStep {
  name: string;
  icon: React.ReactNode;
}

interface BookingProgressBarProps {
  currentStep: number;
  steps?: BookingStep[]; // Optional custom steps
}

const BookingProgressBar: React.FC<BookingProgressBarProps> = ({ 
  currentStep,
  steps = [
    { name: "Service", icon: <ClipboardList className="w-5 h-5" /> },
    { name: "Time & Date", icon: <Calendar className="w-5 h-5" /> },
    { name: "Details", icon: <MapPin className="w-5 h-5" /> },
    { name: "Payment", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Confirm", icon: <CheckCircle className="w-5 h-5" /> },
  ]
}) => {
  // Validate currentStep is within bounds
  const validatedCurrentStep = Math.max(1, Math.min(currentStep, steps.length));
  
  return (
    <div 
      className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 overflow-x-auto whitespace-nowrap"
      aria-label="Booking progress"
      role="progressbar"
      aria-valuenow={validatedCurrentStep}
      aria-valuemin={1}
      aria-valuemax={steps.length}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === validatedCurrentStep;
        const isCompleted = stepNumber < validatedCurrentStep;
        const isPending = stepNumber > validatedCurrentStep;
        
        return (
          <div 
            key={index} 
            className="relative flex flex-col items-center flex-1 min-w-[100px] sm:min-w-[unset]"
            aria-current={isCurrent ? "step" : undefined}
          >
            {/* Step indicator */}
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold mb-2 transition-all duration-300 ease-in-out
                ${isCurrent ? 'bg-[#cc6500] text-white shadow-lg' :
                  isCompleted ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'}`}
              aria-label={`Step ${stepNumber}: ${step.name}`}
            >
              {step.icon}
              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white fill-green-700" />
                </div>
              )}
            </div>
            
            {/* Step name */}
            <span className={`text-sm text-center font-inter 
              ${isCurrent ? 'text-[#cc6500] font-bold' : 
                isCompleted ? 'text-green-600' : 
                'text-gray-600'}`}
            >
              {step.name}
            </span>
            
            {/* Connector line (except for last step) */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-1/2 left-[calc(50%+20px)] w-[calc(100%-40px)] h-1 -z-10 transition-all duration-300 ease-in-out
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} 
                style={{ width: `calc(100% / ${steps.length - 1} - 20px)` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingProgressBar;