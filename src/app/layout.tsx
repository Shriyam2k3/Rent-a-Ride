import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { LanguageProvider } from "@/context/language-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AiChatbot from "@/components/ai-chatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Rent-a-Ride | Modern & Reliable Car Rental Platform",
  description:
    "Find the right car for your journey. Simple, reliable, and flexible car rentals with instant booking, verified vehicles, and transparent pricing in Prayagraj and Uttar Pradesh.",
  keywords: "car rental, rent a car, vehicle hire, electric car rental, luxury car rental, suv rental, prayagraj car rental",
  authors: [{ name: "Rent-a-Ride" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans min-h-screen bg-[#FFFFFF] text-[#18251D] antialiased flex flex-col transition-colors duration-200 selection:bg-[#173F2D] selection:text-white`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <AiChatbot />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
