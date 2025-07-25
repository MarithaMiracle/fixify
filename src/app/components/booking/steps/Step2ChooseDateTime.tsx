"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Step2Data {
    date: string;
    time: string;
}

interface Step2ChooseDateTimeProps {
    onNextStep: (data: Step2Data) => void;
    onPreviousStep: () => void;
}

const Step2ChooseDateTime: React.FC<Step2ChooseDateTimeProps> = ({ onNextStep, onPreviousStep }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Generate time slots for a day
    const timeSlots: string[] = [];
    for (let hour = 8; hour <= 18; hour++) { // From 8 AM to 6 PM
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        timeSlots.push(`${displayHour}:00 ${period}`);
        
        if (hour < 18) { // Add 30-minute slots up to 5:30 PM
            timeSlots.push(`${displayHour}:30 ${period}`);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedDate && selectedTime) {
            onNextStep({ date: selectedDate, time: selectedTime });
        } else {
            alert('Please select both a date and a time.');
        }
    };

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins text-center">Choose Date & Time</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="bookingDate" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        value={selectedDate}
                        min={today}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="bookingTime" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Select Time Slot <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2">
                        {timeSlots.map((slot) => (
                            <button
                                type="button"
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`p-3 rounded-lg border text-sm font-inter transition-all duration-200 ease-in-out
                                    ${selectedTime === slot 
                                        ? 'bg-[#cc6500] text-white shadow-md border-[#cc6500]' 
                                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onPreviousStep}
                        className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-md font-semibold hover:bg-gray-100 transition-all duration-300 ease-in-out shadow-sm font-inter"
                    >
                        <ChevronLeft className="inline-block mr-1 w-5 h-5" /> Previous
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#cc6500] text-white px-8 py-3 rounded-full text-md font-semibold hover:bg-[#a95500] transition-all duration-300 ease-in-out shadow-md font-inter"
                    >
                        Next Step <ChevronRight className="inline-block ml-1 w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step2ChooseDateTime;