import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Axel & Vendela - 15 Augusti",
  description: "Vi gifter oss! Lördagen 15 augusti i Dalarö Kyrka, Haninge.",
  openGraph: {
    title: "Axel & Vendela - 15 Augusti",
    description: "Vi gifter oss! Lördagen 15 augusti i Dalarö Kyrka, Haninge.",
    images: [{ url: "/half-hero-img.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel & Vendela - 15 Augusti",
    description: "Vi gifter oss! Lördagen 15 augusti i Dalarö Kyrka, Haninge.",
    images: ["/half-hero-img.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${greatVibes.variable} ${cormorant.variable} font-[family-name:var(--font-serif)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
