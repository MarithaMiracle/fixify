"use client";

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUsPage() {
    return (
        <>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-grow pt-24 pb-12">
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 font-poppins flex items-center justify-center gap-4">
                                <Mail className="w-10 h-10 text-[#cc6500]" /> Get in Touch
                            </h1>
                            <p className="text-lg text-gray-700 leading-relaxed text-center mb-10 font-inter">
                                We'd love to hear from you! Please fill out the form below or use our contact details to reach us.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Contact Form */}
                                <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-100">
                                    <form className="space-y-6">
                                        <div>
                                            <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Your Name</label>
                                            <input
                                                type="text"
                                                id="contact-name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Email Address</label>
                                            <input
                                                type="email"
                                                id="contact-email"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                                placeholder="john.doe@example.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Subject</label>
                                            <input
                                                type="text"
                                                id="contact-subject"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                                placeholder="Inquiry about..."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Your Message</label>
                                            <textarea
                                                id="contact-message"
                                                rows={5}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#cc6500] focus:border-[#cc6500] font-inter"
                                                placeholder="Type your message here..."
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="w-full bg-[#cc6500] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#a95500] transition-colors shadow-lg">
                                            Send Message
                                        </button>
                                    </form>
                                </div>

                                {/* Contact Information & Map */}
                                <div className="space-y-8">
                                    <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Our Details</h3>
                                        <div className="flex items-center mb-3">
                                            <Mail className="w-6 h-6 text-[#cc6500] mr-3" />
                                            <p className="text-gray-700 font-inter">info@fixify.com</p>
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <Phone className="w-6 h-6 text-[#cc6500] mr-3" />
                                            <p className="text-gray-700 font-inter">+234 800 123 4567</p>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="w-6 h-6 text-[#cc6500] mr-3 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700 font-inter">
                                                Fixify Headquarters, <br/> 123 Innovation Drive, <br/> Victoria Island, Lagos, Nigeria.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Google Map Embed Placeholder */}
                                    <div className="bg-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden" style={{ height: '400px' }}>
                                        <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.5361744205984!2d3.417146216463819!3d6.426986195341365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf44baf2a2cb1%3A0x9095c93f0864621f!2sVictoria+Island%2C+Lagos!5e0!3m2!1sen!2sng!4v1696007015000!5m2!1sen!2sng"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
