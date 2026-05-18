import "./globals.css";

export const metadata = {
  title: "SQL Dashboard",
  description: "Live operational dashboard backed by the connected database",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
