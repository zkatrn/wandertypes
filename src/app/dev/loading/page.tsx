import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevLoadingPreview } from "./DevLoadingPreview";

export const metadata: Metadata = {
  title: "Dev: Loading preview",
  robots: { index: false, follow: false },
};

/**
 * Local-only route to preview the results loading UI + rotating travel facts.
 * Visit: http://localhost:3000/dev/loading
 * Optional: ?hints=Costa%20Rica,Japan
 */
export default function DevLoadingPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <DevLoadingPreview />;
}
