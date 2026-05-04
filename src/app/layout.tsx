"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FullScreenLoadingProvider,
  useFullScreenLoading,
} from "@/context/FullScreenLoadingContext";
import { LandingParallaxDecor } from "@/components/landing/LandingParallaxDecor";
import "./globals.css";

function RootLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { active: fullScreenLoading } = useFullScreenLoading();
  const isOnboardingPage = pathname === "/" || pathname?.startsWith("/survey");
  const isLandingPage = pathname === "/";
  const showHeader = !isOnboardingPage && !fullScreenLoading;
  /** Footer on all app pages and on the landing page; hidden only during survey + full-screen loading. */
  const showFooter =
    !fullScreenLoading && (!isOnboardingPage || isLandingPage);
  return (
    <>
      {/* Background image for onboarding pages (home + survey) */}
      {isOnboardingPage && (
        <>
          {isLandingPage ? (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              {/* Extra width so repeat-x + parallax pan never shows empty edges */}
              <div
                className="absolute max-md:inset-0 md:top-0 md:bottom-0 md:left-[-25%] md:h-full md:w-[150%] md:min-w-[1800px] bg-app-photo-backdrop bg-parallax"
                style={{
                  backgroundImage: "url(/bg.png)",
                  backgroundAttachment: "scroll",
                  filter: "saturate(0.5) brightness(1.05)",
                }}
              />
            </div>
          ) : (
            <div
              className="pointer-events-none fixed inset-0 z-0 bg-app-photo-backdrop"
              style={{
                backgroundImage: "url(/bg.png)",
                backgroundAttachment: "fixed",
                filter: "saturate(0.5) brightness(1.05)",
              }}
            />
          )}
          <div className="pointer-events-none fixed inset-0 z-0 bg-white/25" />
        </>
      )}

      <div className="relative z-10">
        {isOnboardingPage && isLandingPage && <LandingParallaxDecor />}
        <div className="relative z-10">
          {showHeader && <Header />}
          {children}
          {showFooter && <Footer />}
        </div>
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
