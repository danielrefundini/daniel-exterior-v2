import Script from "next/script";
import data from "@/content.json";
import { CRM } from "@/crm";
import { SiteRuntimeProvider } from "@/site/motion";
import { PageRenderer } from "@/site/SiteRenderer";
import type { SiteContent } from "@/site/types";

// The whole site is one page. Text, photos, links and section order live in src/content.json.
const content = data as unknown as SiteContent;

export default function Home() {
  const page = content.pages[0];
  return (
    <SiteRuntimeProvider value={{ mode: "live", siteId: CRM.siteId, page: "home" }}>
      <PageRenderer theme={content.theme} sections={page.sections} />
      <Script src={CRM.widgetUrl} strategy="lazyOnload" data-agent={CRM.chatAgentId} data-color="#112b39" data-position="right" />
    </SiteRuntimeProvider>
  );
}
