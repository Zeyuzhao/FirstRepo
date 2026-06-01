import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Department Seat Usage",
  description: "SQL-verified active seat usage by department.",
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
