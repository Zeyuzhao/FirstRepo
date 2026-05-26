import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotus Lane Yoga Shop",
  description: "A yoga store with curated collections and an inquiry form.",
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
