import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./config";

/** Full metadata for one page: title, description, canonical, Open Graph and Twitter card. */
export function pageMetadata({ path, title, description, noindex = false }: { path: string; title: string; description: string; noindex?: boolean }): Metadata {
  const url = absoluteUrl(path);
  const image = { url: absoluteUrl(SITE.ogImage.url), width: SITE.ogImage.width, height: SITE.ogImage.height, alt: SITE.ogImage.alt };
  return {
    // "absolute" so the layout's title template never adds a second brand suffix.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, locale: SITE.locale, siteName: SITE.name, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
