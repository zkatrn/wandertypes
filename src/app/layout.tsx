"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isOnboardingPage = pathname === "/" || pathname?.startsWith("/survey");
  const isLandingPage = pathname === "/";
  const showHeader = !isOnboardingPage;
  
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE && (
          <Script
            id="google-maps"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="beforeInteractive"
          />
        )}
        
        {/* Background image for onboarding pages */}
        {isOnboardingPage && (
          <>
            <div 
              className={`fixed inset-0 z-0 pointer-events-none ${isLandingPage ? 'bg-parallax' : ''}`}
              style={{
                backgroundImage: 'url(/bg.png)',
                ...(isLandingPage
                  ? {
                      backgroundPosition: 'center',
                      backgroundAttachment: 'scroll',
                      filter: 'saturate(0.5) brightness(1.05)',
                    }
                  : {
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundAttachment: 'fixed',
                      filter: 'saturate(0.5) brightness(1.05)',
                    }),
              }}
            />
            <div className="fixed inset-0 z-0 bg-white/25 pointer-events-none" />
          </>
        )}
        
        <div className="relative z-10">
          {showHeader && <Header />}
          {children}
          {!isOnboardingPage && <Footer />}
        </div>
      </body>
    </html>
  );
}
