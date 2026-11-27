# www.danielrefundini.com

Daniel Refundini's website, on its own. It is separate from NextLevel CRM: changing the site never means changing the CRM.

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint
```

## Where things are

| To change | Edit |
| --- | --- |
| Homepage text, links, photos, section order, homepage SEO title and description | `src/content.json` |
| Service pages and the Montgomery County page (text, titles, descriptions) | `src/site/pages.ts` |
| Privacy policy | `src/app/privacy/page.tsx` |
| Email, Instagram, licenses, site address, social image | `src/site/config.ts` |
| Structured data (JSON-LD) | `src/site/schema.tsx` |
| Photos | put the file in `public/images/` and use `/images/<file>` |
| Look and layout of a section | `src/site/SiteRenderer.tsx`, `src/site/site.css`, `src/site/site-blocks.css`, `src/site/pages.css` |
| Colors and fonts | `theme` in `content.json`; fonts in `src/site/fonts.ts` |
| Price estimator (prices, times, steps) | `src/site/estimator/` |
| Tab icon | `src/app/icon.png`, `src/app/apple-icon.png` |

There is no public phone number on the site, on purpose. The free estimate form is the only way to reach Daniel from the site. Don't add a `phone` field back to `content.json`.

## Pages

| URL | Source |
| --- | --- |
| `/` | `src/app/page.tsx` + `src/content.json` |
| `/windows`, `/roofing`, `/siding`, `/doors`, `/gutters`, `/attic-insulation`, `/decks` | `src/app/[service]/page.tsx` + `src/site/pages.ts` |
| `/montgomery-county-md` | `src/app/montgomery-county-md/page.tsx` + `src/site/pages.ts` |
| `/privacy` | `src/app/privacy/page.tsx` |
| `/robots.txt`, `/sitemap.xml` | `src/app/robots.ts`, `src/app/sitemap.ts` |

Every page is prerendered as static HTML at build time. When you add a page, add it to `src/app/sitemap.ts`.

Draft copy: pages with `draft: true` (or `DRAFT = true` in the privacy page) show a "Draft copy" ribbon on preview and local builds, never in production. Set it to `false` once Daniel approves the wording.

## Search Console and Google Analytics

Both are optional and read at build time. Nothing is loaded until they are set.

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `GOOGLE_SITE_VERIFICATION` | the `content` value of the `google-site-verification` meta tag | Search Console, add property, "HTML tag" method. Paste only the code, not the whole tag. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID, like `G-XXXXXXXXXX` | Google Analytics, Admin, Data streams, your web stream |

Set them in the Vercel project (Settings, Environment Variables, Production), then redeploy. For local testing, put them in `.env.local` (it is git-ignored). Neither value is a secret, but they never need to be pasted into a chat.

What gets tracked: GA4 page views, plus a `generate_lead` event when the free estimate form is sent successfully. The event carries only the project type, the request type (inspection or call) and the visitor's UTM parameters. Names, phone numbers, emails and addresses are never sent to Google Analytics.

UTMs: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term` (plus `gclid`, `fbclid`, the referrer and the landing page) are captured on the first page of a visit, kept in session storage, and sent with every lead to the CRM (`attribution`) and in the Formspree email. The form works the same when there are no UTMs.

## Domain and redirects

- Canonical host: `https://www.danielrefundini.com`. Canonical URLs have no trailing slash (`/windows`); `/windows/` redirects to `/windows`.
- `http://` to `https://`: done by Vercel automatically for every domain. HSTS is set by Vercel.
- `danielrefundini.com` (apex) to `https://www.danielrefundini.com`: set in Vercel, Settings, Domains (the apex is added as a redirect to www, 308). `next.config.ts` has the same redirect as a safety net, in case the domain setup changes.
- `http://danielrefundini.com` takes two hops (Vercel upgrades to https first, then redirects to www). That is how Vercel works and is fine for search engines.
- If the site moves to a new Vercel project: add both `www.danielrefundini.com` and `danielrefundini.com` to the new project, set the apex to redirect to www, and copy the two environment variables above.

## Social image

`public/og/daniel-exteriors-og.png` (1200 x 630) is used for Open Graph and Twitter cards on every page. Its source is `scripts/og-image.html`. To re-render it after a change, open that file in Chrome at 1200 x 630, or run:

```bash
chrome --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=8000 --screenshot=public/og/daniel-exteriors-og.png scripts/og-image.html
```

## The only link to the CRM

`src/crm.ts` holds two public addresses:

- **Leads:** the estimator posts each request to the CRM's lead address, which creates the contact there. It also emails it through Formspree, so leads still arrive if the CRM is down.
- **Chat:** the AI chat bubble is the CRM's widget script, loaded like any third-party widget.

Delete those two uses and the site has no tie to the CRM at all.

## Publishing

Pushing to `main` publishes the site on Vercel. Other branches get a preview deployment.
