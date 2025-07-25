// src/app/layout.tsx
// This file is a SERVER COMPONENT by default. DO NOT add "use client"; here.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Your global CSS for Tailwind and other styles

// CORRECTED PATHS: Use correct relative paths or your configured aliases (e.g., '@/components/Navbar')
import Navbar from "./components/Navbar"; // Assuming components is in src/components, sibling to src/app
import Footer from "./components/Footer"; // Assuming components is in src/components, sibling to src/app

// Ensure correct path for AuthProvider
import { AuthProvider } from "../contexts/AuthContext"; // Assuming contexts is in src/contexts, sibling to src/app

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
    url: "https://fixify-maritha.vercel.app/", // replace with your actual domain
    siteName: "Fixify",
    images: [
      {
        url: "https://fixify-maritha.vercel.app/fixify.png", // replace with your actual image URL
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
    images: ["https://fixify-maritha.vercel.app/fixify.png"], // same image URL
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