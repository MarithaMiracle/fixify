"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQsPage() {
    const faqs: FAQItem[] = [
        {
            question: "How do I book a service on Fixify?",
            answer: "Booking a service is easy! Simply search for the service you need, browse available professionals, select your preferred date and time, and confirm your booking. Our multi-step booking flow guides you through every step."
        },
        {
            question: "Are Fixify's service providers verified?",
            answer: "Yes, absolutely. All service providers on Fixify undergo a rigorous verification process, which includes background checks, skill assessments, and review of their professional credentials to ensure reliability and quality."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept secure payments through leading payment gateways like Paystack and Flutterwave. You can also use your Fixify Wallet balance for seamless transactions."
        },
        {
            question: "What if I need to cancel or reschedule a booking?",
            answer: "You can easily cancel or reschedule bookings directly from your user dashboard. Please refer to our cancellation policy for any applicable fees or timelines."
        },
        {
            question: "How do I become a service provider on Fixify?",
            answer: "If you're a skilled professional looking to expand your reach, visit our 'Become a Provider' page, fill out the application form, and our team will guide you through the verification and onboarding process."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-24 pb-12">
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 font-poppins flex items-center justify-center gap-4">
                            <HelpCircle className="w-10 h-10 text-[#cc6500]" /> 
                            Frequently Asked Questions
                        </h1>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index} 
                                    className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-200"
                                >
                                    <button
                                        className="w-full text-left flex justify-between items-center font-semibold text-gray-900 text-lg font-poppins focus:outline-none"
                                        onClick={() => toggleFAQ(index)}
                                        aria-expanded={openIndex === index}
                                        aria-controls={`faq-${index}`}
                                    >
                                        <span>{faq.question}</span>
                                        {openIndex === index ? 
                                            <ChevronUp className="w-5 h-5 text-gray-700" /> : 
                                            <ChevronDown className="w-5 h-5 text-gray-700" />
                                        }
                                    </button>
                                    <div 
                                        id={`faq-${index}`}
                                        className={`mt-4 text-gray-700 leading-relaxed font-inter transition-all duration-200 ${
                                            openIndex === index ? 'block' : 'hidden'
                                        }`}
                                    >
                                        {faq.answer}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-gray-600 text-lg mt-10 font-inter">
                            Can't find your answer?{' '}
                            <a 
                                href="/contact" 
                                className="text-[#cc6500] hover:underline font-semibold"
                            >
                                Contact our support team
                            </a>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}