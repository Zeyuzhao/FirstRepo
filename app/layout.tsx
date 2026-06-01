import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Analytics Demo",
  description: "A sample data dashboard for sales analytics.",
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
