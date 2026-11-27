// Structured data (JSON-LD), rendered on the server into the raw HTML.
//
// Kept honest on purpose:
// - no telephone, no street address, no geo, no opening hours (none are on the site)
// - no aggregateRating or review counts (the ratings shown belong to Presidential Exteriors)
// - no offers or prices
// Daniel is a remodeling consultant serving an area, not a storefront.

import { SITE, SITE_URL, absoluteUrl } from "./config";

const ID = {
  business: `${SITE_URL}/#business`,
  person: `${SITE_URL}/#daniel`,
  company: `${SITE_URL}/#presidential-exteriors`,
  website: `${SITE_URL}/#website`,
};

const AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "Montgomery County, Maryland" },
  { "@type": "State", name: "Maryland" },
  { "@type": "City", name: "Washington, DC" },
  { "@type": "AdministrativeArea", name: "Northern Virginia" },
];

/** Business, person, installing company and website. Shared by every page so the @ids resolve. */
export function siteGraph() {
  return [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": ID.business,
      name: SITE.name,
      alternateName: SITE.person,
      url: absoluteUrl("/"),
      email: SITE.email,
      image: absoluteUrl(SITE.ogImage.url),
      description:
        "Daniel Refundini, Remodeling Consultant at Presidential Exteriors, helps homeowners in Maryland, Washington, DC, and Northern Virginia plan windows, roofing, siding, doors, gutters, attic insulation and decks.",
      areaServed: AREA_SERVED,
      knowsAbout: ["Windows", "Roofing", "Siding", "Doors", "Gutters", "Attic insulation", "Decks"],
      employee: { "@id": ID.person },
      sameAs: [SITE.instagram],
    },
    {
      "@type": "Person",
      "@id": ID.person,
      name: SITE.person,
      jobTitle: SITE.jobTitle,
      worksFor: { "@id": ID.company },
      email: SITE.email,
      url: absoluteUrl("/"),
      sameAs: [SITE.instagram],
    },
    {
      "@type": "Organization",
      "@id": ID.company,
      name: SITE.company.name,
      url: SITE.company.url,
      hasCredential: SITE.licenses.map((name) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "license", name })),
    },
    {
      "@type": "WebSite",
      "@id": ID.website,
      url: absoluteUrl("/"),
      name: SITE.name,
      alternateName: SITE.person,
      inLanguage: "en-US",
      publisher: { "@id": ID.business },
    },
  ];
}

export function faqPage(path: string, items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
}

export function servicePage(path: string, name: string, serviceType: string, description: string) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: { "@id": ID.business },
    areaServed: AREA_SERVED,
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: absoluteUrl(t.path) })),
  };
}

/** One <script type="application/ld+json"> with the shared graph plus this page's nodes. "<" is escaped so text can't close the tag. */
export function JsonLd({ nodes }: { nodes: object[] }) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": [...siteGraph(), ...nodes] }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
