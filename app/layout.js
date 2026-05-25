import "./globals.css";

export const metadata = {
  title: "FirstRepo Preview",
  description: "Tiny Next.js app for preview verification"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
