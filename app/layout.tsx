import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstRepo",
  description: "A clearer trial onboarding homepage for FirstRepo.",
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
