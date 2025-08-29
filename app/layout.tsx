import type { Metadata } from "next";
import { Teko, Rubik } from "next/font/google";
import "./globals.css";
import Image from "next/image";
// import { Suspense } from "react";
// import BookingFormSkeleton from "@/components/booking-form/skeleton";
// import Script from "next/script";

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OTSU Esports Arena Booking Portal",
  description:
    "Book your spot at the OTSU esports arena with ease in just a few clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*<Script
					crossOrigin="anonymous"
					src="//unpkg.com/react-scan/dist/auto.global.js"
				/>*/}
      </head>
      <body className={`${teko.variable} ${rubik.variable} antialiased`}>
        <div className="relative px-3 py-12 w-full max-w-lg mx-auto space-y-12">
          <header className="flex flex-col items-center gap-6">
            <Image
              src="/esports-logo-colour.png"
              alt="OTSU Esports Logo"
              width={150}
              height={188}
              priority
            />
            <h1 className="font-bold text-center w-full py-3 flex flex-col items-center">
              <span className="text-6xl text-gradient">OTSU Esports</span>
              <span className="text-4xl">Arena Booking Portal</span>
            </h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
