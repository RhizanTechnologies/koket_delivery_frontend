import type { Metadata } from "next";
import { Geist, Geist_Mono, Kaushan_Script } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/ToastProvider";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryProvider } from "./providers/QueryProvider";
import { ConditionalLayout } from "./components/ConditionalLayout";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kaushanScript = Kaushan_Script({
  weight: "400",
  variable: "--font-kaushan",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://koket-bakery.com'),
  title: {
    default: 'Koket Bakery & Pastry - Handcrafted Cakes & Desserts in Ethiopia',
    template: '%s | Koket Bakery & Pastry'
  },
  description: 'Koket Bakery & Pastry offers handcrafted cakes, pastries, and desserts made with the finest ingredients. Order custom cakes for birthdays, weddings, and special occasions in Ethiopia.',
  keywords: ['bakery', 'pastry', 'cakes', 'custom cakes', 'desserts', 'birthday cakes', 'wedding cakes', 'Ethiopia bakery', 'Koket', 'handcrafted desserts', 'fresh pastries'],
  authors: [{ name: 'Koket Bakery & Pastry' }],
  creator: 'Koket Bakery & Pastry',
  publisher: 'Koket Bakery & Pastry',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://koket-bakery.com',
    title: 'Koket Bakery & Pastry - Handcrafted Cakes & Desserts',
    description: 'Order handcrafted cakes, pastries, and desserts made with the finest ingredients. Custom cakes for every celebration.',
    siteName: 'Koket Bakery & Pastry',
    images: [
      {
        url: '/assets/cake.avif',
        width: 1200,
        height: 630,
        alt: 'Koket Bakery & Pastry - Delicious Handcrafted Cakes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koket Bakery & Pastry - Handcrafted Cakes & Desserts',
    description: 'Order handcrafted cakes, pastries, and desserts made with the finest ingredients.',
    images: ['/assets/cake.avif'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kaushanScript.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <ErrorBoundary>
                <ConditionalLayout>{children}</ConditionalLayout>
                <ToastProvider />
              </ErrorBoundary>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
