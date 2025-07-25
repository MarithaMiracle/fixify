"use client";

import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-grow pt-24 pb-12">
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 font-poppins flex items-center justify-center gap-4">
                                <FileText className="w-10 h-10 text-[#cc6500]" /> Terms of Service
                            </h1>
                            <p className="text-lg text-gray-700 leading-relaxed text-center mb-10 font-inter">
                                Welcome to Fixify! These Terms of Service ("Terms") govern your use of the Fixify website and mobile applications (collectively, the "Service").
                            </p>

                            <div className="prose max-w-none text-left font-inter">
                                <h2> <strong>1. Acceptance of Terms</strong></h2>
                                <p>By accessing or using the Service, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree to these Terms, you may not use the Service.</p>


                                <h2><strong>2. Changes to Terms</strong></h2>
                                <p>We reserve the right to modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email notification, providing notice through the Service, or updating the "Last Updated" date at the beginning of these Terms. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>


                                <h2><strong>3. Eligibility</strong></h2>
                                <p>You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are 18 years of age or older and have the legal capacity to enter into a binding contract.</p>


                                <h2><strong>4. Service Description</strong></h2>
                                <p>Fixify is an online platform that connects users seeking various services with independent service providers. Fixify does not directly provide services; rather, it facilitates connections between users and providers. We are not responsible for the acts or omissions of any service providers or users.</p>


                                <h2><strong>5. User Accounts</strong></h2>
                                <ul>
                                    <li><strong>Registration:</strong> To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
                                    <li><strong>Account Security:</strong> You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately if you suspect any unauthorized use of your account.</li>
                                </ul>


                                <h2><strong>6. Booking and Payments</strong></h2>
                                <ul>
                                    <li><strong>Booking Process:</strong> Users can book services through the platform by selecting a service, choosing a date/time, and providing necessary details.</li>
                                    <li><strong>Pricing:</strong> Service providers set their own prices for services. All pricing will be displayed upfront.</li>
                                    <li><strong>Payments:</strong> Payments for services booked through Fixify are processed securely via third-party payment gateways (e.g., Paystack, Flutterwave). You agree to abide by the terms and conditions of these payment processors.</li>
                                    <li><strong>Cancellations and Refunds:</strong> Our cancellation and refund policy is detailed in our FAQs and will apply to all bookings.</li>
                                </ul>


                                <h2><strong>7. Provider Obligations</strong></h2>
                                <p>Service providers agree to:</p>
                                <ul>
                                    <li>Provide services with reasonable care and skill.</li>
                                    <li>Maintain necessary licenses and insurance.</li>
                                    <li>Abide by all applicable laws and regulations.</li>
                                    <li>Communicate professionally with users.</li>
                                </ul>


                                <h2><strong>8. User Obligations</strong></h2>
                                <p>Users agree to:</p>
                                <ul>
                                    <li>(a) Provide accurate information for bookings.</li>
                                    <li>(b) Treat service providers with respect.</li>
                                    <li>(c) Make payments promptly.</li>
                                </ul>


                                <h2><strong>9. Disclaimers</strong></h2>
                                <p>The Service is provided "as is" and "as available." Fixify makes no warranties, express or implied, regarding the services provided by third-party service providers or the suitability of the Service for your needs.</p>


                                <h2><strong>10. Limitation of Liability</strong></h2>
                                <p>To the fullest extent permitted by law, Fixify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
                                    <ul>
                                        <li>(a) your access to or use of or inability to access or use the Service;</li>
                                        <li>(b) any conduct or content of any third party on the Service;</li>
                                        <li>(c) any content obtained from the Service; and</li>
                                        <li>(d) unauthorized access, use, or alteration of your transmissions or content.</li>
                                        </ul>
                                </p>


                                <h2><strong>11. Governing Law</strong></h2>
                                <p>These Terms shall be governed by the laws of Nigeria, without regard to its conflict of law provisions.</p>


                                <h2><strong>12. Contact Information</strong></h2>
                                <p>If you have any questions about these Terms, please contact us at terms@fixify.com.</p>

                                <br />

                                <br />
                                
                                <p><em>Last Updated: July 24, 2025</em></p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
