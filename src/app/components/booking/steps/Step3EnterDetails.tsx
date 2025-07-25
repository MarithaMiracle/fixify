"use client";

import React, { useState } from 'react';

import { ChevronRight, ChevronLeft } from 'lucide-react';

const Step3EnterDetails = ({ onNextStep, onPreviousStep }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (fullName && email && phoneNumber && address && city && state) {
            onNextStep({ fullName, email, phoneNumber, address, city, state, notes });
        } else {
            alert('Please fill in all required contact and address details.');
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins text-center">Enter Address & Contact Info</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Service Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Street Address, House Number"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="city" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                            State <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                            required
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2 font-inter">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        id="notes"
                        rows={3}
                        placeholder="e.g., Any specific instructions for the service provider, gate code, etc."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 resize-y focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                    ></textarea>
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

export default Step3EnterDetails;