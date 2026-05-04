"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type StarSpec = {
  id: number;
  size: number;
  topPct: number;
  leftPct: number;
  durationS: number;
  delayS: number;
};

function generateStars(count: number): StarSpec[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    size: Math.random() * 2.5 + 0.8,
    topPct: Math.random() * 100,
    leftPct: Math.random() * 100,
    durationS: Math.random() * 3 + 1.5,
    delayS: Math.random() * 5,
  }));
}

type LandingMarketingFixedStarfieldProps = {
  anchorRef: RefObject<HTMLElement | null>;
  starCount?: number;
};

/**
 * Viewport-fixed twinkling stars, clipped to the marketing column’s screen
 * rectangle so they stay “pinned” to the window while navy content scrolls.
 */
export function LandingMarketingFixedStarfield({
  anchorRef,
  starCount = 52,
}: LandingMarketingFixedStarfieldProps) {
  const [stars, setStars] = useState<StarSpec[]>([]);
  const [clipPath, setClipPath] = useState(
    "inset(100% 100% 100% 100%)",
  );
  const rafRef = useRef<number | null>(null);

  const updateClip = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const intersects =
      r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    if (!intersects) {
      setClipPath("inset(100% 100% 100% 100%)");
      return;
    }

    const topInset = Math.max(0, r.top);
    const rightInset = Math.max(0, vw - r.right);
    const bottomInset = Math.max(0, vh - r.bottom);
    const leftInset = Math.max(0, r.left);

    setClipPath(
      `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`,
    );
  }, [anchorRef]);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateClip();
    });
  }, [updateClip]);

  useEffect(() => {
    setStars(generateStars(starCount));
  }, [starCount]);

  useLayoutEffect(() => {
    updateClip();
  }, [updateClip]);

  useEffect(() => {
    const el = anchorRef.current;
    const ro = new ResizeObserver(() => scheduleUpdate());
    if (el) ro.observe(el);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [anchorRef, scheduleUpdate]);

  if (stars.length === 0) return null;

  return (
    <div
      className="lmf-starfield-root"
      style={{ clipPath }}
      aria-hidden
    >
      <div className="lpd-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="lpd-star"
            style={{
              width: s.size,
              height: s.size,
              top: `${s.topPct}%`,
              left: `${s.leftPct}%`,
              ["--d" as string]: `${s.durationS.toFixed(1)}s`,
              animationDelay: `${s.delayS.toFixed(1)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
