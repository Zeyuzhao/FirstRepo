import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Department Seat Usage",
  description: "Current seat usage by department with missing limit data called out.",
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
