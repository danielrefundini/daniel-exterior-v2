import type { MetadataRoute } from "next";
import { SITE_URL } from "@/site/config";

// The whole marketing site is open to crawlers. Never copy a CRM or app host's "Disallow: /" here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
