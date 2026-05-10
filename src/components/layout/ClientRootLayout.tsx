"use client";

import { usePathname } from "next/navigation";
import { LandingParallaxDecor } from "@/components/landing/LandingParallaxDecor";

function RootLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWanderTypesSurface =
    pathname === "/" ||
    pathname === "/quiz" ||
    pathname === "/types" ||
    pathname?.startsWith("/result/");

  return (
    <>
      {isWanderTypesSurface && (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-0 bg-[#0f0c29]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 100% 70% at 50% -15%, rgba(255, 217, 125, 0.07), transparent 42%), linear-gradient(180deg, #141233 0%, #0f0c29 45%, #08071a 100%)",
            }}
            aria-hidden
          />
          <LandingParallaxDecor />
        </>
      )}

      <div className="relative z-10">
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}

export function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootLayoutShell>{children}</RootLayoutShell>;
}
