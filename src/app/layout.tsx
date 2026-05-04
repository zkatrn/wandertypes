import type { Metadata } from "next";
import { ClientRootLayout } from "@/components/layout/ClientRootLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VoyageBlitz — Your trip, matched to you",
    template: "%s · VoyageBlitz",
  },
  description:
    "Survey-first travel assistant: find your Wandertype, compare destinations, and decide with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
