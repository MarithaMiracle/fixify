"use client";

import React, { useState } from 'react';

import {
    ChevronRight, DollarSign, Sparkles, CreditCard, ChevronLeft
} from 'lucide-react';

const Step4PaymentOptions = ({ onNextStep, onPreviousStep }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const dummyWalletBalance = '₦15,000'; // Example dummy balance

    const paymentOptions = [
        { id: 'paystack', name: 'Paystack', icon: <CreditCard className="w-8 h-8 text-[#cc6500]" />, description: 'Pay securely with your card via Paystack.' },
        { id: 'flutterwave', name: 'Flutterwave', icon: <DollarSign className="w-8 h-8 text-[#cc6500]" />, description: 'Multiple payment options including bank transfer and USSD.' },
        { id: 'wallet', name: 'Fixify Wallet', icon: <Sparkles className="w-8 h-8 text-[#cc6500]" />, description: `Use your balance: ${dummyWalletBalance}` },
    ];

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (selectedPaymentMethod) {
            onNextStep({ paymentMethod: selectedPaymentMethod });
        } else {
            alert('Please select a payment method.');
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins text-center">Payment Options</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-8">
                    {paymentOptions.map((option) => (
                        <label
                            key={option.id}
                            htmlFor={option.id}
                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                                ${selectedPaymentMethod === option.id ? 'border-[#cc6500] ring-2 ring-[#cc6500] bg-[#fffbf5]' : 'border-gray-300 hover:border-gray-400'}`}
                        >
                            <input
                                type="radio"
                                id={option.id}
                                name="paymentMethod"
                                value={option.id}
                                checked={selectedPaymentMethod === option.id}
                                onChange={() => setSelectedPaymentMethod(option.id)}
                                className="hidden"
                            />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-gray-100 flex-shrink-0">
                                    {option.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 font-poppins">{option.name}</p>
                                    <p className="text-sm text-gray-600 font-inter">{option.description}</p>
                                </div>
                            </div>
                        </label>
                    ))}
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

export default Step4PaymentOptions;