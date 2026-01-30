import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Collab League - Where Creators & Businesses Build Winning Partnerships",
  description: "Connect with top creators or discover business collaborations that match your niche. Simple, transparent, powerful platform for influencer marketing.",
  keywords: ["influencer marketing", "creator economy", "brand partnerships", "collaboration platform"],
  authors: [{ name: "Collab League" }],
  openGraph: {
    title: "Collab League",
    description: "Where Creators & Businesses Build Winning Partnerships",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
