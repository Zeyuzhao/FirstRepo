import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sip Trail — Downtown San José",
  description: "A tiny boba trail from Meimei Dumpling.",
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
