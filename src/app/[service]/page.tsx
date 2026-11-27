import { notFound } from "next/navigation";
import { ServicePageView } from "@/site/InnerPages";
import { SERVICE_BY_SLUG, SERVICES, type ServiceSlug } from "@/site/pages";
import { pageMetadata } from "@/site/seo";

// /windows, /roofing, /siding, /doors, /gutters, /attic-insulation, /decks. Prerendered at build time.
// Any other one-segment URL is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props) {
  const s = SERVICE_BY_SLUG[(await params).service as ServiceSlug];
  if (!s) return {};
  return pageMetadata({ path: `/${s.slug}`, title: s.title, description: s.description });
}

export default async function ServiceRoute({ params }: Props) {
  const s = SERVICE_BY_SLUG[(await params).service as ServiceSlug];
  if (!s) notFound();
  return <ServicePageView service={s} />;
}
