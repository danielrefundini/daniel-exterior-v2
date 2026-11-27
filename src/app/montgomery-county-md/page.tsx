import { MontgomeryPageView } from "@/site/InnerPages";
import { MONTGOMERY } from "@/site/pages";
import { pageMetadata } from "@/site/seo";

// The one service-area page. No separate page per city.
export const metadata = pageMetadata({ path: `/${MONTGOMERY.slug}`, title: MONTGOMERY.title, description: MONTGOMERY.description });

export default function MontgomeryRoute() {
  return <MontgomeryPageView />;
}
