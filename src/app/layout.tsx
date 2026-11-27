import type { Metadata, Viewport } from "next";
import content from "@/content.json";
import { Analytics } from "@/site/analytics";
import { GA_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION, SITE, SITE_URL } from "@/site/config";
import { siteFonts } from "@/site/fonts";
import "./globals.css";

// Defaults for every page. Each page sets its own title, description, canonical, Open Graph and Twitter card.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: content.seo.title,
  description: content.seo.description,
  applicationName: SITE.name,
  // Search Console: set GOOGLE_SITE_VERIFICATION to the code Google gives you (see README). Empty means no tag.
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#112b39" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={siteFonts}>
        {children}
        <Analytics id={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
