import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import data from "@/content.json";
import { SITE } from "./config";
import { LiveShell } from "./LiveShell";
import { MONTGOMERY, NEXT_STEPS, SERVICE_BY_SLUG, SERVICES, type ServicePage, type ServiceSlug } from "./pages";
import { JsonLd, breadcrumbs, servicePage } from "./schema";
import { SiteFrame } from "./SiteRenderer";
import type { Section, SiteContent } from "./types";
import "./pages.css";

const content = data as unknown as SiteContent;

/** Header and footer from the homepage, with same-page anchors ("#inspection") pointed at the homepage ("/#inspection"). */
function chrome() {
  const sections = content.pages[0].sections.filter((s) => !s.hidden);
  const fix = (s: Section) => JSON.parse(JSON.stringify(s).replace(/"href":"#/g, '"href":"/#')) as Section;
  const top = sections.filter((s) => s.type === "topbar" || s.type === "header").map(fix);
  const bottom = sections.filter((s) => s.type === "footer" || s.type === "mobileBar").map(fix);
  return { top, bottom };
}

/** Preview and local builds only: a small marker on pages whose copy is still waiting for Daniel's approval. */
function DraftRibbon({ draft }: { draft: boolean }) {
  if (!draft || process.env.VERCEL_ENV === "production") return null;
  return <p className="p-draft">Draft copy for Daniel’s review. Not final.</p>;
}

function Crumbs({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="p-crumbs">
      <Link href="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">{name}</span>
    </nav>
  );
}

function NextSteps() {
  return (
    <section className="s-section s-alt" id="next-steps">
      <div className="s-container">
        <div className="s-heading s-center">
          <p className="s-eyebrow">A simple way to get started</p>
          <h2 className="s-h2">{NEXT_STEPS.title}</h2>
        </div>
        <ol className="s-steps" style={{ "--cols": 3 } as React.CSSProperties}>
          {NEXT_STEPS.items.map((it, i) => (
            <li key={it.title} className="s-step">
              <span className="s-step-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="s-h3">{it.title}</h3>
              <p className="s-muted">{it.text}</p>
            </li>
          ))}
        </ol>
        <p className="p-note">{NEXT_STEPS.note}</p>
      </div>
    </section>
  );
}

function CtaBand({ href, label }: { href: string; label: string }) {
  return (
    <section className="s-section s-dark p-cta">
      <div className="s-container s-narrow s-center">
        <h2 className="s-h2">Ready for a clear next step?</h2>
        <p className="s-lead">Request a free exterior inspection and estimate. Daniel will reach out to set it up.</p>
        <div className="s-btn-row s-center-row">
          <Link href={href} className="s-btn s-btn-primary s-btn-lg">{label} <ArrowUpRight size={17} /></Link>
          <a href={`mailto:${SITE.email}`} className="s-btn s-btn-ghost-light s-btn-lg">Email Daniel</a>
        </div>
      </div>
    </section>
  );
}

function ServiceLinks({ slugs, title }: { slugs: ServiceSlug[]; title: string }) {
  return (
    <section className="s-section">
      <div className="s-container">
        <h2 className="s-h2 p-links-title">{title}</h2>
        <ul className="p-link-cards">
          {slugs.map((slug) => {
            const s = SERVICE_BY_SLUG[slug];
            return (
              <li key={slug}>
                <Link href={`/${slug}`} className="p-link-card">
                  <strong>{s.name}</strong>
                  <span>{s.summary}</span>
                  <span className="p-link-more">Learn more <ArrowUpRight size={15} /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ServicePageView({ service: s }: { service: ServicePage }) {
  const { top, bottom } = chrome();
  const path = `/${s.slug}`;
  return (
    <LiveShell page={s.slug}>
      <JsonLd nodes={[servicePage(path, s.name, s.serviceType, s.description), breadcrumbs([{ name: "Home", path: "/" }, { name: s.name, path }])]} />
      <SiteFrame theme={content.theme} top={top} bottom={bottom}>
        <DraftRibbon draft={s.draft} />
        <section className="p-hero">
          <div className={`s-container p-hero-grid ${s.image ? "" : "no-image"}`}>
            <div>
              <Crumbs name={s.name} />
              <p className="s-eyebrow">{s.name} · Maryland, DC and Northern Virginia</p>
              <h1 className="s-h1 p-h1">{s.h1}</h1>
              <p className="s-lead s-left">{s.intro}</p>
              <div className="s-btn-row">
                <Link href={s.estimateHref} className="s-btn s-btn-primary s-btn-lg">{s.ctaLabel} <ArrowUpRight size={17} /></Link>
                <a href="#next-steps" className="s-btn s-btn-outline s-btn-lg">How it works</a>
              </div>
            </div>
            {s.image && (
              <figure className="p-hero-figure">
                <div className="p-hero-photo">
                  <Image src={s.image.src} alt={s.image.alt} fill priority sizes="(max-width: 900px) 100vw, 540px" />
                </div>
                {s.image.caption && <figcaption className="s-fine">{s.image.caption}</figcaption>}
              </figure>
            )}
          </div>
        </section>

        <section className="s-section">
          <div className="s-container p-two">
            <div>
              <h2 className="s-h2">{s.noticingTitle}</h2>
              <ul className="s-checks">
                {s.noticing.map((n) => <li key={n}><BadgeCheck size={18} /> {n}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="s-h2">{s.helpTitle}</h2>
              {s.help.map((t) => <p key={t} className="p-body">{t}</p>)}
            </div>
          </div>
        </section>

        {s.options && s.options.length > 0 && (
          <section className="s-section s-alt">
            <div className="s-container">
              <div className="s-heading s-center">
                <p className="s-eyebrow">Options to compare</p>
                <h2 className="s-h2">{s.optionsTitle}</h2>
                <p className="s-lead">You don’t need to know which product to choose. We’ll compare materials, appearance, maintenance and budget together.</p>
              </div>
              <ul className="p-options">
                {s.options.map((o) => (
                  <li key={o.name} className="p-option">
                    <h3 className="s-h3">{o.name}</h3>
                    <p className="s-muted">{o.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {s.credentials && s.credentials.length > 0 && (
          <section className="s-section">
            <div className="s-container s-narrow">
              <h2 className="s-h2">Credentials you can check</h2>
              <ul className="p-creds">
                {s.credentials.map((c) => (
                  <li key={c.name}>
                    <ShieldCheck size={20} />
                    <div>
                      <h3 className="s-h3">{c.name}</h3>
                      <p className="s-muted">{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="s-fine">
                Certifications held by Presidential Exteriors.{" "}
                <a href="https://presidentialexteriors.com/about-us/certifications/" target="_blank" rel="noreferrer">Verify them on the company site ↗</a>
              </p>
            </div>
          </section>
        )}

        <NextSteps />
        <ServiceLinks slugs={s.related} title="Related services" />
        <section className="s-section p-area-link">
          <div className="s-container s-narrow s-center">
            <p className="s-muted">
              Serving homeowners across the DMV, with a focus on <Link href={`/${MONTGOMERY.slug}`}>Montgomery County, MD</Link>.
            </p>
          </div>
        </section>
        <CtaBand href={s.estimateHref} label={s.ctaLabel} />
      </SiteFrame>
    </LiveShell>
  );
}

export function MontgomeryPageView() {
  const { top, bottom } = chrome();
  const m = MONTGOMERY;
  const path = `/${m.slug}`;
  return (
    <LiveShell page={m.slug}>
      <JsonLd nodes={[breadcrumbs([{ name: "Home", path: "/" }, { name: m.name, path }])]} />
      <SiteFrame theme={content.theme} top={top} bottom={bottom}>
        <DraftRibbon draft={m.draft} />
        <section className="p-hero">
          <div className="s-container p-hero-grid">
            <div>
              <Crumbs name={m.name} />
              <p className="s-eyebrow">Service area · Montgomery County, Maryland</p>
              <h1 className="s-h1 p-h1">{m.h1}</h1>
              <p className="s-lead s-left">{m.intro}</p>
              <div className="s-btn-row">
                <Link href="/#inspection" className="s-btn s-btn-primary s-btn-lg">Request my free inspection <ArrowUpRight size={17} /></Link>
                <a href="#next-steps" className="s-btn s-btn-outline s-btn-lg">How it works</a>
              </div>
            </div>
            <figure className="p-hero-figure">
              <div className="p-hero-photo">
                <Image src={m.project.image.src} alt={m.project.image.alt} fill priority sizes="(max-width: 900px) 100vw, 540px" />
              </div>
              <figcaption className="s-fine">
                <MapPin size={13} /> {m.project.location}: {m.project.text}{" "}
                <a href={m.project.href} target="_blank" rel="noreferrer">View project ↗</a>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="s-section">
          <div className="s-container s-narrow">
            <h2 className="s-h2">Communities in my focus area</h2>
            <ul className="p-communities">
              {m.communities.map((c) => <li key={c}><MapPin size={16} /> {c}</li>)}
            </ul>
            <p className="p-body">{m.communitiesNote}</p>
          </div>
        </section>

        <section className="s-section s-alt">
          <div className="s-container">
            <div className="s-heading s-center">
              <p className="s-eyebrow">How I work with homeowners</p>
              <h2 className="s-h2">Personal guidance, with an established team behind it</h2>
            </div>
            <ul className="p-options">
              {m.approach.map((a) => (
                <li key={a.title} className="p-option">
                  <h3 className="s-h3">{a.title}</h3>
                  <p className="s-muted">{a.text}</p>
                </li>
              ))}
            </ul>
            <p className="p-note">
              {m.directories.map((d, i) => (
                <span key={d.href}>
                  {i > 0 && " · "}
                  <a href={d.href} target="_blank" rel="noreferrer">{d.label} ↗</a>
                </span>
              ))}
            </p>
          </div>
        </section>

        <ServiceLinks slugs={SERVICES.map((s) => s.slug)} title="Services for Montgomery County homes" />
        <NextSteps />
        <CtaBand href="/#inspection" label="Request my free inspection" />
      </SiteFrame>
    </LiveShell>
  );
}

/** Simple text page (privacy policy) inside the site frame. */
export function TextPageView({ name, draft, children }: { name: string; draft: boolean; children: React.ReactNode }) {
  const { top, bottom } = chrome();
  return (
    <LiveShell page="privacy">
      <SiteFrame theme={content.theme} top={top} bottom={bottom}>
        <DraftRibbon draft={draft} />
        <article className="s-section">
          <div className="s-container s-narrow p-text">
            <Crumbs name={name} />
            {children}
          </div>
        </article>
      </SiteFrame>
    </LiveShell>
  );
}
