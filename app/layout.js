import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

export const metadata = {
  title: "GlowCart — Makeup & Beauty",
  description: "Discover your perfect makeup routine with GlowCart. AI-powered recommendations, Shade Match, and curated looks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-glow-bg text-glow-text min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
