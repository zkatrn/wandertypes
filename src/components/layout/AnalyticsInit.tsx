"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getAnalyticsInstance, trackEvent } from "@/lib/analytics";

/**
 * Loads Firebase Analytics once and logs virtual page views on soft navigation.
 */
export function AnalyticsInit() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    void getAnalyticsInstance();
  }, []);

  useEffect(() => {
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname || "";
    void trackEvent("vb_page_view", { page_path: path });
  }, [pathname, searchParams]);

  return null;
}
