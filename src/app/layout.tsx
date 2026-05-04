"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
        {/* Background image for onboarding pages */}
        {isOnboardingPage && (
          <>
            <div
              className={`fixed inset-0 z-0 pointer-events-none bg-app-photo-backdrop ${
                isLandingPage ? "bg-parallax" : ""
              }`}
              style={{
                backgroundImage: "url(/bg.png)",
                ...(isLandingPage
                  ? {
                      backgroundAttachment: "scroll",
                      filter: "saturate(0.5) brightness(1.05)",
                    }
                  : {
                      backgroundAttachment: "fixed",
                      filter: "saturate(0.5) brightness(1.05)",
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
