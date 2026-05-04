import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — VoyageBlitz",
  description: "Account settings and data controls for VoyageBlitz.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
