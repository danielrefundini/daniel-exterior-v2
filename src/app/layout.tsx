import type { Metadata, Viewport } from "next";
import content from "@/content.json";
import { siteFonts } from "@/site/fonts";
import "./globals.css";

const URL = "https://www.danielrefundini.com";

export const metadata: Metadata = {
  metadataBase: new globalThis.URL(URL),
  title: content.seo.title,
  description: content.seo.description,
  alternates: { canonical: "/" },
  openGraph: { title: content.seo.title, description: content.seo.description, url: URL, type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={siteFonts}>{children}</body>
    </html>
  );
}
