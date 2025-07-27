import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Love View Estate | Ayrshire Property Sales & Lettings",
    template: "%s | Love View Estate",
  },
  description: "Your premier real estate partner for exceptional properties for sale and to rent in North, South, and East Ayrshire.",
  openGraph: {
    title: "Love View Estate | Ayrshire Property Sales & Lettings",
    description: "Your premier real estate partner for exceptional properties in Ayrshire.",
    url: 'https://www.loveviewestate.co.uk', // Replace with your actual domain
    siteName: 'Love View Estate',
    images: [
      {
        url: '/logo-1.png', // A default image for sharing
        width: 1200,
        height: 630,
        alt: 'Love View Estate Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Love View Estate | Ayrshire Property Sales & Lettings",
    description: "Your premier real estate partner for exceptional properties in Ayrshire.",
    images: ['/logo-1.png'], // A default image for sharing
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
