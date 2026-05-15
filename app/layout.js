import "./globals.css";

export const metadata = {
  title: "Usage Breakdown Chart",
  description: "A Next.js recreation of a personal usage breakdown chart.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
