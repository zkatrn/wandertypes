import type { Metadata } from "next";
import { ClientRootLayout } from "@/components/layout/ClientRootLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WanderTypes — What kind of traveler are you?",
    template: "%s · WanderTypes",
  },
  description:
    "Discover your WanderType in a short quiz — then compare destinations on VoyageBlitz matched to your travel personality.",
  icons: {
    icon: [{ url: "/submarine.png", type: "image/png" }],
    shortcut: "/submarine.png",
    apple: "/submarine.png",
  },
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
