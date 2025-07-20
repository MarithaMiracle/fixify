import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        {children}
      </body>
    </html>
  );
}
