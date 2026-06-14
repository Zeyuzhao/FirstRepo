import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attention Workbench",
  description: "An interactive scaled dot-product attention demo.",
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
