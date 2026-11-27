import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/site/config";
import { MONTGOMERY, SERVICES } from "@/site/pages";

// Every public, indexable URL. Keep noindex pages out of this list.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...SERVICES.map((s) => ({ url: absoluteUrl(`/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: absoluteUrl(`/${MONTGOMERY.slug}`), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
