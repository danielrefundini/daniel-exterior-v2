import Script from "next/script";
import { CRM } from "@/crm";
import { SiteRuntimeProvider } from "./motion";

/**
 * Wraps every public page: captures UTMs and the referrer on the visitor's landing page
 * (session storage, sent later with the lead), and loads the chat bubble.
 */
export function LiveShell({ page, children }: { page: string; children: React.ReactNode }) {
  return (
    <SiteRuntimeProvider value={{ mode: "live", siteId: CRM.siteId, page }}>
      {children}
      <Script src={CRM.widgetUrl} strategy="lazyOnload" data-agent={CRM.chatAgentId} data-color="#112b39" data-position="right" />
    </SiteRuntimeProvider>
  );
}
