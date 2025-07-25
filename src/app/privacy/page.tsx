"use client";

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-grow pt-24 pb-12">
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 font-poppins flex items-center justify-center gap-4">
                                <ShieldCheck className="w-10 h-10 text-[#cc6500]" /> Privacy Policy
                            </h1>
                            <p className="text-lg text-gray-700 leading-relaxed text-center mb-10 font-inter">
                                Your privacy is critically important to us. This policy outlines how Fixify collects, uses, and protects your personal information.
                            </p>

                            <div className="prose max-w-none text-left font-inter">
                                <h2>1. Information We Collect</h2>
                                <p>We collect various types of information to provide and improve our services to you. This includes:</p>
                                <ul>
                                    <li><strong>Personal Identifiable Information (PII):</strong> Such as your name, email address, phone number, physical address, and payment information when you register for an account or book a service.</li>
                                    <li><strong>Service Provider Information:</strong> For service providers, we collect professional details, qualifications, background check information, portfolio images, and bank account details for payouts.</li>
                                    <li><strong>Usage Data:</strong> Information on how the service is accessed and used, including your IP address, browser type, pages visited, and time spent on pages.</li>
                                    <li><strong>Location Data:</strong> With your consent, we may collect and process information about your location.</li>
                                </ul>

                                <h2>2. How We Use Your Information</h2>
                                <p>The information we collect is used for various purposes, including:</p>
                                <ul>
                                    <li>To provide and maintain our service, including processing bookings and payments.</li>
                                    <li>To personalize your experience and to deliver content and product offerings relevant to your interests.</li>
                                    <li>To improve our website, services, and customer support.</li>
                                    <li>To communicate with you about your account, bookings, or promotional offers.</li>
                                    <li>To detect, prevent, and address technical issues or fraudulent activities.</li>
                                    <li>To enforce our Terms of Service and other policies.</li>
                                </ul>

                                <h2>3. Sharing Your Information</h2>
                                <p>We may share your personal information with:</p>
                                <ul>
                                    <li><strong>Service Providers:</strong> We share necessary information between clients and service providers to facilitate bookings.</li>
                                    <li><strong>Payment Processors:</strong> To process secure payments (e.g., Paystack, Flutterwave).</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to respond to valid legal processes.</li>
                                    <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition.</li>
                                </ul>
                                <p>We do not sell or rent your personal data to third parties for their marketing purposes without your explicit consent.</p>

                                <h2>4. Data Security</h2>
                                <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p>

                                <h2>5. Your Data Protection Rights</h2>
                                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                                <ul>
                                    <li>The right to access – You have the right to request copies of your personal data.</li>
                                    <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                                    <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                                    <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                                    <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
                                </ul>

                                <h2>6. Changes to This Privacy Policy</h2>
                                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top. You are advised to review this Privacy Policy periodically for any changes.</p>

                                <h2>7. Contact Us</h2>
                                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                                <ul>
                                    <li>By email: privacy@fixify.com</li>
                                    <li>By visiting this page on our website: <a href="/contact">Contact Us</a></li>
                                </ul>

                                <br />

                                <br />
                                
                                <p><em>Effective Date: July 24, 2025</em></p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
