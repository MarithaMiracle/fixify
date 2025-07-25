"use client";

import React, { useState } from 'react';
import { ChevronRight, TicketPercent, ChevronDown } from 'lucide-react';

interface Step1Data {
    selectedService: string;
    serviceDescription: string;
    couponCode: string;
}

interface Step1SelectServiceProps {
    onNextStep: (data: Step1Data) => void;
    onCancel: () => void;
}

const Step1SelectService: React.FC<Step1SelectServiceProps> = ({ onNextStep, onCancel }) => {
    const [selectedService, setSelectedService] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    const serviceCategories = [
        { value: '', label: 'Select a Service Category' },
        { value: 'home-repairs', label: 'Home & Repairs' },
        { value: 'cleaning-laundry', label: 'Cleaning & Laundry' },
        { value: 'catering-events', label: 'Catering & Events' },
        { value: 'beauty-grooming', label: 'Beauty & Grooming' },
        { value: 'fashion-tailoring', label: 'Fashion & Tailoring' },
        { value: 'tech-installations', label: 'Tech & Installations' },
        { value: 'errands-logistics', label: 'Errands & Logistics' },
        { value: 'tutors-trainers', label: 'Tutors & Trainers' },
        { value: 'media-creativity', label: 'Media & Creativity' },
        { value: 'lifestyle-pet-care', label: 'Lifestyle & Pet Care' },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedService) {
            onNextStep({ selectedService, serviceDescription, couponCode });
        } else {
            alert('Please select a service category.');
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins text-center">Tell Us About Your Needs</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="serviceCategory" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Choose Service Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="serviceCategory"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 appearance-none bg-white pr-10 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                            required
                        >
                            {serviceCategories.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Describe Your Task (Optional)
                    </label>
                    <textarea
                        id="serviceDescription"
                        rows={5}
                        placeholder="e.g., Leaky faucet in kitchen, needs fixing urgently. Or, full bridal makeup for 3 people."
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 resize-y focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                    />
                </div>

                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowCoupon(!showCoupon)}
                        className="text-[#cc6500] text-sm font-semibold hover:underline flex items-center gap-1 font-inter"
                    >
                        <TicketPercent className="w-4 h-4" /> Have a Coupon Code?
                    </button>
                    {showCoupon && (
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-grow p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                            />
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-md font-semibold hover:bg-gray-100 transition-all duration-300 ease-in-out shadow-sm font-inter"
                    >
                        Cancel Booking
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

export default Step1SelectService;