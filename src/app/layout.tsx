import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import { AuthProvider } from "../contexts/AuthContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata export. This works because layout.tsx is a Server Component.
export const metadata: Metadata = {
  title: "Fixify - Book Trusted Local Service Providers Instantly in Nigeria",
  description:
    "Fixify is Nigeria’s go-to platform for booking reliable service providers — from handymen and electricians to makeup artists, caterers, tailors, and more. Fast, secure, and professional.",
  openGraph: {
    title: "Fixify - Book Trusted Local Service Providers Instantly in Nigeria",
    description:
      "Fixify is Nigeria’s go-to platform for booking reliable service providers — from handymen and electricians to makeup artists, caterers, tailors, and more.",
    url: "https://fixify-maritha.vercel.app/",
    images: [
      {
        url: "https://fixify-maritha.vercel.app/fixify.png",
        width: 1200,
        height: 630,
        alt: "Fixify - Nigeria's Trusted Services Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixify – Nigeria’s Trusted Services Platform",
    description:
      "Book trusted service providers across Nigeria. Instant access to reliable home, beauty, catering, and fashion services.",
    images: ["https://fixify-maritha.vercel.app/fixify.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}