import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "کاوشگر پروتکل | Protocol Explorer فارسی",
  description: "ابزار تعاملی یادگیری پروتکل‌های اینترنت به زبان فارسی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "Vazirmatn, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
