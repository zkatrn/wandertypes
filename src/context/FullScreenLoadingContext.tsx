"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FullScreenLoadingContextValue = {
  /** True while at least one `LoadingScreen` (or other consumer) is mounted. */
  active: boolean;
  begin: () => void;
  end: () => void;
};

export const FullScreenLoadingContext =
  createContext<FullScreenLoadingContextValue | null>(null);

export function FullScreenLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [depth, setDepth] = useState(0);
  const begin = useCallback(() => setDepth((d) => d + 1), []);
  const end = useCallback(() => setDepth((d) => Math.max(0, d - 1)), []);

  useEffect(() => {
    if (depth === 0) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [depth]);

  const value = useMemo(
    () => ({
      active: depth > 0,
      begin,
      end,
    }),
    [depth, begin, end],
  );

  return (
    <FullScreenLoadingContext.Provider value={value}>
      {children}
    </FullScreenLoadingContext.Provider>
  );
}

/** For layout shell inside `FullScreenLoadingProvider` only. */
export function useFullScreenLoading(): FullScreenLoadingContextValue {
  const ctx = useContext(FullScreenLoadingContext);
  if (!ctx) {
    throw new Error(
      "useFullScreenLoading must be used within FullScreenLoadingProvider",
    );
  }
  return ctx;
}
