import data from "@/content.json";
import { LiveShell } from "@/site/LiveShell";
import { PageRenderer } from "@/site/SiteRenderer";
import { JsonLd, faqPage } from "@/site/schema";
import { pageMetadata } from "@/site/seo";
import type { SiteContent } from "@/site/types";

// The homepage. Text, photos, links and section order live in src/content.json.
const content = data as unknown as SiteContent;

export const metadata = pageMetadata({ path: "/", title: content.seo!.title!, description: content.seo!.description! });

export default function Home() {
  const page = content.pages[0];
  const faq = page.sections.find((s) => s.type === "faq" && !s.hidden);
  return (
    <LiveShell page="home">
      <JsonLd nodes={faq && faq.type === "faq" ? [faqPage("/", faq.items)] : []} />
      <PageRenderer theme={content.theme} sections={page.sections} />
    </LiveShell>
  );
}
