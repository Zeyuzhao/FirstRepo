import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstRepo - Landing Page",
  description: "Welcome to FirstRepo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
