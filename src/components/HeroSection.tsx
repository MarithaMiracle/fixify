"use client";

const HeroSection = () => {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 to-lavender-100 py-20 md:py-32 flex items-center justify-center min-h-[60vh] mt-16 md:mt-0 overflow-hidden">
    
            <div className="absolute inset-0 opacity-30">
                <div className="absolute w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-10 left-10 md:w-96 md:h-96"></div>
                <div className="absolute w-64 h-64 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 bottom-10 right-10 md:w-96 md:h-96"></div>
                <div className="absolute w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-96 md:h-96"></div>
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 font-poppins">
                    Need a hand? <br className="md:hidden"/> Book trusted pros near you in seconds.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-inter">
                    Find reliable professionals for plumbing, makeup, catering, tailoring, and more, right here in Nigeria.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
                        Book a Service
                    </button>
                    <button className="bg-white text-teal-700 border-2 border-teal-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 font-inter">
                        Find Talent
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;