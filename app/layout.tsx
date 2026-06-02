import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renewal Risk Dashboard",
  description: "Account manager renewal risk review dashboard.",
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
