import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DaterXP - Win at Dates",
  description:
    "Gamified dating courses to help you master confidence, conversation, and connection. Earn XP, unlock levels, and become the best version of yourself.",
  openGraph: {
    title: "DaterXP - Win at Dates",
    description: "Gamified dating education platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0d0000] text-white`}>
        {children}
      </body>
    </html>
  );
}
