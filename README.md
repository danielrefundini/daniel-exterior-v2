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
| Text, links, phone, photos, section order, SEO title | `src/content.json` |
| Photos | put the file in `public/images/` and use `/images/<file>` in `content.json` |
| Look and layout of a section | `src/site/SiteRenderer.tsx`, `src/site/site.css`, `src/site/site-blocks.css` |
| Colors and fonts | `theme` in `content.json`; fonts in `src/site/fonts.ts` |
| Price estimator (prices, times, steps) | `src/site/estimator/` |
| Tab icon | `src/app/icon.png`, `src/app/apple-icon.png` |

## The only link to the CRM

`src/crm.ts` holds two public addresses:

- **Leads:** the contact form and the estimator post each request to the CRM's lead address, which creates the contact there. The estimator also emails it through Formspree, so leads still arrive if the CRM is down.
- **Chat:** the AI chat bubble is the CRM's widget script, loaded like any third-party widget.

Delete those two uses and the site has no tie to the CRM at all.

## Publishing

Pushing to `master` publishes the site on Vercel (its own project, not the CRM's).
