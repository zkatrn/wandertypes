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
                className={`absolute inset-y-0 -left-[25%] h-full w-[150%] min-w-[1800px] bg-app-photo-backdrop bg-parallax`}
                style={{
                  backgroundImage: "url(/bg.png)",
                  backgroundRepeat: "repeat-x",
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
                backgroundRepeat: "repeat-x",
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
