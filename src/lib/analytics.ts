"use client";

import type { Analytics } from "firebase/analytics";
import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { app } from "@/lib/firebase";

let analyticsPromise: Promise<Analytics | null> | null = null;

function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    return Promise.resolve(null);
  }
  return import("firebase/analytics").then(async ({ getAnalytics, isSupported }) => {
    const supported = await isSupported();
    if (!supported) return null;
    return getAnalytics(app);
  });
}

export function getAnalyticsInstance(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = initAnalytics();
  }
  return analyticsPromise;
}

/**
 * Firebase Analytics (GA4). No-ops when analytics is disabled or unsupported.
 * Enable with NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID in env.
 */
export async function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    const analytics = await getAnalyticsInstance();
    if (!analytics) return;
    firebaseLogEvent(analytics, name, params);
  } catch {
    // Analytics must never break UX
  }
}
