import "./globals.css";

export const metadata = {
  title: "Tiny Next App",
  description: "A tiny Next.js app scaffold.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
