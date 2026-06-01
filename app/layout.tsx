import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Headcount Dashboard",
  description: "Department-level employee headcount dashboard.",
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
