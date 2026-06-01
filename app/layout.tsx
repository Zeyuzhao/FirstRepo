import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Headcount Dashboard",
  description: "Department headcount dashboard with explicit data provenance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
