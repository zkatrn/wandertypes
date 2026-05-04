"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FullScreenLoadingProvider,
  useFullScreenLoading,
} from "@/context/FullScreenLoadingContext";
import { LandingParallaxDecor } from "@/components/landing/LandingParallaxDecor";
import { AnalyticsInit } from "@/components/layout/AnalyticsInit";
import { SeamlessParallaxBackground } from "@/components/layout/SeamlessParallaxBackground";

function RootLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { active: fullScreenLoading } = useFullScreenLoading();
  const isOnboardingPage = pathname === "/" || pathname?.startsWith("/survey");
  const isLandingPage = pathname === "/";
  const showHeader = !isOnboardingPage && !fullScreenLoading;
  const showFooter =
    !fullScreenLoading && (!isOnboardingPage || isLandingPage);
  return (
    <>
      {isOnboardingPage && (
        <>
          {isLandingPage ? (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <SeamlessParallaxBackground
                imageUrl="/bg.png"
                durationSec={150}
                imageFilter="saturate(0.5) brightness(1.05)"
                wrapperClassName="absolute inset-0"
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

export function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <FullScreenLoadingProvider>
      <Suspense fallback={null}>
        <AnalyticsInit />
      </Suspense>
      <RootLayoutShell>{children}</RootLayoutShell>
    </FullScreenLoadingProvider>
  );
}
