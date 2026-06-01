import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Analytics Demo",
  description: "Demo sales analytics page with clearly labeled sample data.",
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
