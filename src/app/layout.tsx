import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstRepo SQL Dashboard",
  description: "A live dashboard backed by a local SQL table.",
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
