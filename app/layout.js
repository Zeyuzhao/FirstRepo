import "./globals.css";

export const metadata = {
  title: "FirstRepo Next.js",
  description: "Minimal Bun + Next.js starter"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
