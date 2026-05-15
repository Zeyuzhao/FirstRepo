import "./globals.css";

export const metadata = {
  title: "FirstRepo Next.js App",
  description: "Minimal Next.js app running with Bun"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
