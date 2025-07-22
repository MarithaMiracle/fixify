"use client";

import React from "react";
import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";

const WhyChooseFixify = () => {
  const valueProps = [
    {
      image: "/alex-starnes-PK_t0Lrh7MM-unsplash.jpg",
      alt: "A woman using a mobile phone to book a service",
      title: "Trusted Professionals",
      description: "We rigorously vet all service providers to ensure you receive top-quality and trustworthy service.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      image: "/magnifying-glass-dollar-banknote-grey-wooden-table.jpg",
      alt: "A magnifying glass over a document showing a price tag",
      title: "Transparent Pricing",
      description: "No hidden fees. See upfront pricing and detailed quotes before you book, ensuring complete transparency.",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      image: "/sergey-zolkin-_UeY8aTI6d0-unsplash.jpg",
      alt: "A person booking a service on their laptop at home",
      title: "Easy Online Booking",
      description: "Book any service anytime through our intuitive platform. Schedule at your convenience, 24/7.",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      image: "/smiling-customer-service-agent.jpg",
      alt: "A friendly customer support agent with a headset on",
      title: "Dedicated Support",
      description: "Our support team is always ready to assist you. Get help whenever you need it, ensuring a smooth experience.",
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-poppins">
            Why Choose Fixify?
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#cc6500] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100"
            >
              <div className="relative pt-[75%] overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.alt}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image";
                  }}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <span className="text-[#cc6500] mr-2">{prop.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800 font-poppins">
                    {prop.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm md:text-base font-inter flex-1">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseFixify;