"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FullScreenLoadingProvider,
  useFullScreenLoading,
} from "@/context/FullScreenLoadingContext";
import "./globals.css";

function RootLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { active: fullScreenLoading } = useFullScreenLoading();
  const isOnboardingPage = pathname === "/" || pathname?.startsWith("/survey");
  const isLandingPage = pathname === "/";
  const showHeader = !isOnboardingPage && !fullScreenLoading;
  const showFooter = !isOnboardingPage && !fullScreenLoading;

  return (
    <>
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
        {showFooter && <Footer />}
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <FullScreenLoadingProvider>
          <RootLayoutShell>{children}</RootLayoutShell>
        </FullScreenLoadingProvider>
      </body>
    </html>
  );
}
