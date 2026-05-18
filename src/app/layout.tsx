import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstRepo",
  description: "A Next.js application scaffold for FirstRepo.",
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
