import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "User sessions",
  robots: { index: false, follow: false },
};

export default function AdminUserSessionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
