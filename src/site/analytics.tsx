"use client";

import Script from "next/script";
import { readAttribution } from "./motion";

// Google Analytics 4, loaded only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see README).
// No other ad pixels. Personal form fields (name, phone, email, address) are never sent to analytics.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics({ id }: { id: string }) {
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}
      </Script>
    </>
  );
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** The UTM parameters captured on the visitor's landing page (empty when there were none). */
export function utmParams(): Record<string, string> {
  const attr = readAttribution();
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) if (attr[k]) out[k] = attr[k];
  return out;
}

/**
 * Conversion event for a successful free estimate request.
 * Sends only the project type, the request type and the UTMs. Safe to call when GA is not loaded.
 */
export function trackLead(details: { project?: string; request?: string }) {
  try {
    const params: Record<string, string> = { form: "estimator", ...utmParams() };
    if (details.project) params.project = details.project;
    if (details.request) params.request_type = details.request;
    window.gtag?.("event", "generate_lead", params);
    // Lets tests and any future tag manager see the event even without GA.
    window.dispatchEvent(new CustomEvent("de:lead", { detail: params }));
  } catch {}
}
