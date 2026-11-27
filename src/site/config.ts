// Public facts about the site, in one place. Everything here is already shown on the site.
// Never add a phone number here: the free estimate form is the only way to reach Daniel from the site.

/** Canonical origin. www is the canonical host; the apex redirects here (see README, "Domain and redirects"). */
export const SITE_URL = "https://www.danielrefundini.com";

export const SITE = {
  name: "Daniel Exteriors",
  person: "Daniel Refundini",
  jobTitle: "Remodeling Consultant",
  company: { name: "Presidential Exteriors", url: "https://presidentialexteriors.com/" },
  email: "danielrefundini.exteriors@gmail.com",
  instagram: "https://www.instagram.com/daniel.exteriors/",
  licenses: ["MD Home Improvement #133021", "VA Class A #2705158030"],
  /** 1200 x 630 social card (public/og/daniel-exteriors-og.png). */
  ogImage: { url: "/og/daniel-exteriors-og.png", width: 1200, height: 630, alt: "Daniel Exteriors: windows, roofing, siding and doors in the DMV" },
  locale: "en_US",
};

/** Absolute URL on the canonical host. "/" stays "https://www.danielrefundini.com/"; other paths have no trailing slash. */
export const absoluteUrl = (path = "/") => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

/**
 * Optional IDs, read at build time. Leave them unset until Daniel has the real values.
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID: Google Analytics 4 measurement ID (looks like G-XXXXXXXXXX).
 * - GOOGLE_SITE_VERIFICATION: the content value of Search Console's google-site-verification meta tag.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION?.trim() || "";
