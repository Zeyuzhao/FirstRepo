import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo Sales Analytics",
  description: "A sample-data sales analytics dashboard.",
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
