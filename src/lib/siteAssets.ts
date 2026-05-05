/**
 * Hero photo (`public/bg.png`). Browsers cache URLs aggressively for CSS backgrounds
 * even when DevTools “disable cache” is on for documents only.
 *
 * After replacing `public/bg.png`, bump **NEXT_PUBLIC_BG_IMAGE_VERSION** in `.env.local`
 * (e.g. `20260205` or `2`) so every reference uses a new URL.
 */
export const BG_HERO_SRC =
  typeof process.env.NEXT_PUBLIC_BG_IMAGE_VERSION === "string" &&
  process.env.NEXT_PUBLIC_BG_IMAGE_VERSION.trim().length > 0
    ? `/bg.png?v=${encodeURIComponent(process.env.NEXT_PUBLIC_BG_IMAGE_VERSION.trim())}`
    : "/bg.png";
