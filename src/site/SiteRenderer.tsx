import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  DoorOpen,
  Layers,
  CalendarCheck,
  Clock,
  Droplets,
  Hammer,
  Home,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Syringe,
  Wind,
} from "lucide-react";
import { Magnetic, Marquee, Parallax, Tilt, WordCycle } from "./effects";
import { BeforeAfter, Counter, DemoCheckout, DemoForm, FaqItem, LeadForm, Quiz, QuizResultView, Reveal, StickyHeader } from "./motion";
import { Estimator } from "./estimator/Estimator";
import type { FunnelTemplate, Img, Section, SiteTemplate, Theme } from "./types";
import "./site.css";
import "./site-blocks.css";

const ICONS: Record<string, React.ElementType> = {
  award: Award,
  check: BadgeCheck,
  calendar: CalendarCheck,
  clock: Clock,
  droplets: Droplets,
  hammer: Hammer,
  home: Home,
  shield: ShieldCheck,
  smile: Smile,
  sparkles: Sparkles,
  sun: Sun,
  syringe: Syringe,
  wind: Wind,
  star: Star,
  layers: Layers,
  door: DoorOpen,
};
export const ICON_NAMES = Object.keys(ICONS);

const FONT_VAR = { inter: "var(--font-inter)", poppins: "var(--font-poppins)", playfair: "var(--font-playfair)", manrope: "var(--font-manrope)", dmsans: "var(--font-dmsans)" };

export function themeVars(t: Theme): React.CSSProperties {
  const c = t.colors;
  return {
    "--s-bg": c.bg,
    "--s-surface": c.surface,
    "--s-text": c.text,
    "--s-muted": c.muted,
    "--s-primary": c.primary,
    "--s-on-primary": c.onPrimary,
    "--s-accent": c.accent,
    "--s-dark": c.dark,
    "--s-on-dark": c.onDark,
    "--s-cta-dark": c.ctaOnDark ?? c.primary,
    "--s-accent-dark": c.accentOnDark ?? c.accent,
    "--s-cta-dark-text": c.ctaOnDark ? "#ffffff" : c.onPrimary,
    "--s-font-heading": FONT_VAR[t.fonts.heading],
    "--s-font-body": FONT_VAR[t.fonts.body],
    "--s-heading-weight": t.headingWeight,
    "--s-radius": t.radius,
    "--s-btn-radius": t.buttonRadius,
  } as React.CSSProperties;
}

// Fotos do Unsplash e do Supabase Storage passam pela otimização da Vercel; links de outros sites vão direto.
const OPTIMIZED_HOSTS = /(^|\.)(images\.unsplash\.com|supabase\.co)$/;
/** `pos` = ponto de foco escolhido no editor ("50% 20%"): é a parte da foto que nunca é cortada. */
/** Formato da moldura escolhido no editor (vazio = o formato padrão do layout). */
const SHAPES: Record<string, number> = { wide: 16 / 9, landscape: 4 / 3, square: 1, portrait: 4 / 5 };
function frame(img?: Img): React.CSSProperties | undefined {
  if (!img?.shape) return undefined;
  const ratio = img.shape === "original" ? img.ratio : SHAPES[img.shape];
  return ratio ? { aspectRatio: String(ratio) } : undefined;
}

function SiteImage({ pos, zoom, style, ...props }: ImageProps & { pos?: string; zoom?: number }) {
  let optimized = false;
  try {
    optimized = typeof props.src === "string" && (props.src.startsWith("/") || OPTIMIZED_HOSTS.test(new URL(props.src).hostname));
  } catch {}
  // Zoom usa a propriedade "scale" (não "transform") para somar com os efeitos de hover/parallax.
  const z = zoom && zoom > 100 ? { scale: String(zoom / 100), transformOrigin: pos ?? "50% 50%" } : {};
  return <Image {...props} style={{ ...style, ...(pos ? { objectPosition: pos } : {}), ...z }} unoptimized={!optimized} />;
}

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

// Perfil do Instagram: mostra "@usuario" a partir do link (instagram.com/usuario/).
const igHandle = (url: string) => {
  const user = url.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").split(/[/?#]/)[0];
  return user ? `@${user}` : "Instagram";
};

// O lucide-react 1.x não traz ícones de marcas; este segue o mesmo traço dos outros ícones.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="s-stars" role="img" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

function Heading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "s-heading s-center" : "s-heading"}>
      {eyebrow && <p className="s-eyebrow">{eyebrow}</p>}
      <h2 className="s-h2">{title}</h2>
      {subtitle && <p className="s-lead">{subtitle}</p>}
    </Reveal>
  );
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title;
  const [a, b] = title.split(highlight);
  return (
    <>
      {a}
      <span className="s-highlight">{highlight}</span>
      {b}
    </>
  );
}

function SectionView({ s }: { s: Section }) {
  switch (s.type) {
    case "topbar":
      return (
        <div className="s-topbar">
          <span>{s.text}</span>
          {s.phone && (
            <a href={tel(s.phone)} className="s-topbar-phone">
              <Phone size={14} /> {s.phone}
            </a>
          )}
        </div>
      );

    case "header":
      return (
        <StickyHeader>
          <div className="s-container s-header-row">
            {s.logo ? (
              <Link href="/" className="s-brand-logo">
                <SiteImage src={s.logo.src} alt={s.logo.alt} pos={s.logo.position} zoom={s.logo.zoom} width={44} height={37} priority />
                <span>
                  <strong>{s.brand}</strong>
                  {s.tagline && <small>{s.tagline}</small>}
                </span>
              </Link>
            ) : (
              <Link href="/" className="s-brand">{s.brand}</Link>
            )}
            <nav className="s-nav">
              {s.nav.map((n) => (
                <a key={n.href} href={n.href}>{n.label}</a>
              ))}
            </nav>
            <div className="s-header-actions">
              {s.phone && (
                <a href={tel(s.phone)} className="s-header-phone">
                  <Phone size={16} /> {s.phone}
                </a>
              )}
              <a href={s.cta.href} className="s-btn s-btn-primary s-btn-sm">{s.cta.label}</a>
            </div>
          </div>
        </StickyHeader>
      );

    case "hero":
      if (s.variant === "overlay") {
        return (
          <section className="s-hero s-hero-overlay">
            <SiteImage src={s.image.src} alt={s.image.alt} pos={s.image.position} zoom={s.image.zoom} fill priority sizes="100vw" className="s-hero-bg" />
            <div className="s-hero-shade" />
            <div className="s-container s-hero-overlay-content s-enter">
              {s.eyebrow && <p className="s-eyebrow s-eyebrow-light">{s.eyebrow}</p>}
              <h1 className="s-h1">{renderTitle(s.title, s.highlight)}</h1>
              <p className="s-hero-sub">{s.subtitle}</p>
              <div className="s-btn-row">
                <a href={s.primary.href} className="s-btn s-btn-primary s-btn-lg">{s.primary.label}</a>
                {s.secondary && <a href={s.secondary.href} className="s-btn s-btn-ghost-light s-btn-lg">{s.secondary.label}</a>}
              </div>
              {s.badges && (
                <ul className="s-badges s-badges-light">
                  {s.badges.map((b) => <li key={b}><BadgeCheck size={16} /> {b}</li>)}
                </ul>
              )}
            </div>
          </section>
        );
      }
      return (
        <section className={`s-hero s-hero-split ${s.variant === "split-form" ? "with-form" : ""}`}>
          <div className="s-container s-hero-grid">
            <div className="s-enter">
              {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
              <h1 className="s-h1">{renderTitle(s.title, s.highlight)}</h1>
              {s.services && s.services.length > 0 && (
                <p className="s-hero-services"><WordCycle words={s.services} /></p>
              )}
              <p className="s-hero-sub s-muted">{s.subtitle}</p>
              <div className="s-btn-row">
                <Magnetic><a href={s.primary.href} className="s-btn s-btn-primary s-btn-lg s-shine">{s.primary.label} <ArrowUpRight size={17} /></a></Magnetic>
                {s.secondary && (
                  <Magnetic>
                    <a href={s.secondary.href} className="s-btn s-btn-outline s-btn-lg">
                      {s.secondary.href.startsWith("tel:") && <Phone size={17} />} {s.secondary.label}
                    </a>
                  </Magnetic>
                )}
              </div>
              {s.badges && (
                <ul className="s-badges">
                  {s.badges.map((b) => <li key={b}><BadgeCheck size={16} /> {b}</li>)}
                </ul>
              )}
            </div>
            {s.variant === "split-form" && s.form ? (
              <div className="s-hero-media s-enter-late">
                <div className="s-hero-photo" style={frame(s.image)}>
                  <SiteImage src={s.image.src} alt={s.image.alt} pos={s.image.position} zoom={s.image.zoom} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
                </div>
                <div className="s-form-card" id="estimate">
                  <h3 className="s-h3">{s.form.title}</h3>
                  <DemoForm fields={s.form.fields} button={s.form.button} note={s.form.note} next={s.form.next} />
                </div>
              </div>
            ) : (
              <div className={`s-hero-media s-enter-late ${s.chips?.length ? "with-chips" : ""}`}>
                <div className="s-hero-photo s-hero-photo-tall" style={frame(s.image)}>
                  <Parallax speed={-0.06} className="s-parallax-fill">
                    <SiteImage src={s.image.src} alt={s.image.alt} pos={s.image.position} zoom={s.image.zoom} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
                  </Parallax>
                </div>
                {s.chips?.slice(0, 3).map((c, i) => (
                  <div key={c.title} className={`s-chip s-chip-${i + 1}`}>
                    <ShieldCheck size={20} />
                    <span><strong>{c.title}</strong><small>{c.text}</small></span>
                  </div>
                ))}
                {s.proof && (
                  <div className="s-float-card">
                    <Stars />
                    <span>{s.proof}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="s-stats">
          <div className="s-container s-stats-grid">
            {s.items.map((it, i) => (
              <Reveal key={it.label} delay={i * 80}>
                <div className="s-stat">
                  <strong><Counter value={it.value} prefix={it.prefix} suffix={it.suffix} decimals={it.decimals} /></strong>
                  <span>{it.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "logos":
      return (
        <section className="s-logos">
          <div className="s-container">
            <p className="s-logos-title">{s.title}</p>
            <div className="s-marquee">
              <div className="s-marquee-track">
                {[...s.items, ...s.items].map((l, i) => <span key={i} className="s-logo-word">{l}</span>)}
              </div>
            </div>
          </div>
        </section>
      );

    case "services":
      return (
        <section className="s-section" id="services">
          <div className="s-container">
            <Heading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
            <div className="s-cards">
              {s.items.map((it, i) => {
                const Icon = it.icon ? ICONS[it.icon] : null;
                return (
                  <Reveal key={it.title} delay={i * 90}>
                    <Tilt>
                      <article className="s-card">
                        {it.image && (
                          <div className="s-card-img" style={frame(it.image)}>
                            <SiteImage src={it.image.src} alt={it.image.alt} pos={it.image.position} zoom={it.image.zoom} fill sizes="(max-width: 700px) 100vw, 33vw" />
                          </div>
                        )}
                        <div className="s-card-body">
                          {Icon && <span className="s-icon"><Icon size={22} /></span>}
                          {it.label && <p className="s-card-label">{it.label}</p>}
                          <h3 className="s-h3">{it.title}</h3>
                          <p className="s-muted">{it.text}</p>
                          {it.detail && <p className="s-card-detail">{it.detail}</p>}
                          {it.price && <p className="s-price">{it.price}</p>}
                          {it.cta && <a href={it.cta.href} className="s-card-link">{it.cta.label} <ArrowUpRight size={15} /></a>}
                          {it.more && <a href={it.more.href} className="s-card-more">{it.more.label}</a>}
                        </div>
                      </article>
                    </Tilt>
                  </Reveal>
                );
              })}
            </div>
            {s.note && (
              <Reveal>
                <p className="s-cards-note">{s.note}</p>
              </Reveal>
            )}
            {s.links && s.links.length > 0 && (
              <ul className="s-pill-links">
                {s.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
              </ul>
            )}
          </div>
        </section>
      );

    case "beforeAfter":
      return (
        <section className="s-section s-alt" id="projects">
          <div className="s-container s-narrow">
            <Heading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
            <Reveal>
              <BeforeAfter before={`${s.before.src}`} after={`${s.after.src}`} beforeAlt={s.before.alt} afterAlt={s.after.alt} />
              {s.caption && <p className="s-caption">{s.caption}</p>}
            </Reveal>
          </div>
        </section>
      );

    case "steps":
      return (
        <section className="s-section" id="process">
          <div className="s-container">
            <Heading eyebrow={s.eyebrow} title={s.title} />
            <ol className="s-steps" style={{ "--cols": Math.min(s.items.length, 4) } as React.CSSProperties}>
              {s.items.map((it, i) => (
                <li key={it.title} className="s-step-item">
                  <Reveal delay={i * 100}>
                    <div className="s-step">
                      <span className="s-step-n">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="s-h3">{it.title}</h3>
                      <p className="s-muted">{it.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );

    case "split":
      return (
        <section className={`s-section ${s.dark ? "s-dark" : ""}`} id={s.id}>
          <div className={`s-container s-split ${s.reverse ? "is-reverse" : ""}`}>
            <Reveal className="s-split-media">
              <div className="s-split-photo" style={frame(s.image)}>
                <SiteImage src={s.image.src} alt={s.image.alt} pos={s.image.position} zoom={s.image.zoom} fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
              <h2 className="s-h2">{s.title}</h2>
              <p className="s-lead s-left">{s.text}</p>
              {s.bullets && (
                <ul className="s-checks">
                  {s.bullets.map((b) => <li key={b}><BadgeCheck size={18} /> {b}</li>)}
                </ul>
              )}
              {s.points && (
                <ol className="s-points">
                  {s.points.map((pt) => <li key={pt.title}><strong>{pt.title}</strong> {pt.text}</li>)}
                </ol>
              )}
              {s.signature && <p className="s-signature">{s.signature}</p>}
              {(s.cta || s.secondary || s.instagram) && (
                <div className="s-btn-row">
                  {s.cta && <a href={s.cta.href} className="s-btn s-btn-primary">{s.cta.label}</a>}
                  {s.secondary && <a href={s.secondary.href} className={`s-btn ${s.dark ? "s-btn-ghost-light" : "s-btn-outline"}`}>{s.secondary.label}</a>}
                  {s.instagram && (
                    <a href={s.instagram} target="_blank" rel="noreferrer" className={`s-btn ${s.dark ? "s-btn-ghost-light" : "s-btn-outline"}`}>
                      <InstagramIcon size={17} /> {igHandle(s.instagram)}
                    </a>
                  )}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      );

    case "offer":
      return (
        <section className="s-section s-tight" id={s.id}>
          <div className="s-container">
            <Reveal>
              <div className="s-offer">
                <div>
                  <p className="s-eyebrow">{s.eyebrow}</p>
                  <h2 className="s-h2">{s.title}</h2>
                  <p className="s-muted">{s.text}</p>
                  {s.fine && <p className="s-fine">{s.fine}</p>}
                </div>
                <div className="s-offer-side">
                  {s.price && (
                    <p className="s-offer-price">
                      {s.price}
                      {s.was && <span className="s-was">{s.was}</span>}
                    </p>
                  )}
                  <a href={s.cta.href} className="s-btn s-btn-primary s-btn-lg">{s.cta.label}</a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section className="s-section s-alt" id="reviews">
          <div className="s-container">
            <Heading title={s.title} />
            <Reveal className="s-rating">
              <Stars size={20} /> <span>{s.rating}</span>
            </Reveal>
          </div>
          <div className="s-marquee s-marquee-reviews">
            <div className="s-marquee-track s-marquee-slow">
              {[...s.items, ...s.items].map((r, i) => (
                <figure key={i} className="s-review">
                  <Stars />
                  <blockquote>“{r.text}”</blockquote>
                  <figcaption>
                    <strong>{r.name}</strong>
                    {r.detail && <span>{r.detail}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case "pricing":
      return (
        <section className="s-section" id="memberships">
          <div className="s-container">
            <Heading eyebrow={s.eyebrow} title={s.title} />
            <div className="s-plans">
              {s.plans.map((p, i) => (
                <Reveal key={p.name} delay={i * 90}>
                  <div className={`s-plan ${p.featured ? "is-featured" : ""}`}>
                    {p.featured && <span className="s-plan-tag">Most popular</span>}
                    <h3 className="s-h3">{p.name}</h3>
                    <p className="s-plan-price">
                      {p.price}
                      <span>{p.period}</span>
                    </p>
                    <ul className="s-checks">
                      {p.features.map((f) => <li key={f}><BadgeCheck size={16} /> {f}</li>)}
                    </ul>
                    <a href={p.cta.href} className={`s-btn ${p.featured ? "s-btn-primary" : "s-btn-outline"} s-btn-block`}>{p.cta.label}</a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="s-section">
          <div className="s-container">
            <Heading title={s.title} />
            <div className="s-gallery">
              {s.images.map((img, i) => (
                <Reveal key={img.src} delay={i * 70}>
                  <div className="s-gallery-item">
                    <SiteImage src={img.src} alt={img.alt} pos={img.position} zoom={img.zoom} fill sizes="(max-width: 700px) 50vw, 25vw" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="s-section" id="faq">
          <div className="s-container s-narrow">
            <Heading title={s.title} />
            <Reveal className="s-faq">
              {s.items.map((it, i) => <FaqItem key={it.q} q={it.q} a={it.a} defaultOpen={i === 0} />)}
            </Reveal>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="s-cta" id="contact">
          <div className="s-container s-cta-inner">
            <Reveal>
              <h2 className="s-h2">{s.title}</h2>
              <p className="s-cta-text">{s.text}</p>
              <div className="s-btn-row s-center-row">
                <a href={s.primary.href} className="s-btn s-btn-primary s-btn-lg">{s.primary.label}</a>
                {s.secondary && <a href={s.secondary.href} className="s-btn s-btn-ghost-light s-btn-lg">{s.secondary.label}</a>}
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "footer":
      return (
        <footer className="s-footer">
          <div className="s-container s-footer-grid">
            <div>
              <p className="s-brand s-brand-light">{s.brand}</p>
              <p className="s-footer-muted">{s.about}</p>
            </div>
            <div>
              <p className="s-footer-title">Contact</p>
              {s.address && <p className="s-footer-line"><MapPin size={15} /> {s.address}</p>}
              {s.phone && <p className="s-footer-line"><Phone size={15} /> <a href={tel(s.phone)}>{s.phone}</a></p>}
              {s.email && (
                <p className="s-footer-line">
                  <Mail size={15} /> {s.email.includes("@") ? <a href={`mailto:${s.email}`}>{s.email}</a> : s.email}
                </p>
              )}
              {s.instagram && (
                <p className="s-footer-line">
                  <InstagramIcon size={15} /> <a href={s.instagram} target="_blank" rel="noreferrer">{igHandle(s.instagram)}</a>
                </p>
              )}
            </div>
            {s.hours && s.hours.length > 0 && (
              <div>
                <p className="s-footer-title">Hours</p>
                {s.hours.map((h) => <p key={h} className="s-footer-line">{h}</p>)}
              </div>
            )}
            {s.services && s.services.length > 0 && (
              <nav aria-label="Services">
                <p className="s-footer-title">Services</p>
                <ul className="s-footer-links">
                  {s.services.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                </ul>
              </nav>
            )}
            {s.areas && (
              <div>
                <p className="s-footer-title">Service areas</p>
                <p className="s-footer-muted">{s.areas.join(" · ")}</p>
                {s.areasLink && <p className="s-footer-muted"><a href={s.areasLink.href}>{s.areasLink.label} service area</a></p>}
              </div>
            )}
            {(s.licenses || s.links?.length) && (
              <div>
                <p className="s-footer-title">Licenses</p>
                {s.licenses && <p className="s-footer-muted">{s.licenses}</p>}
                {s.links?.map((l) => (
                  <p key={l.href} className="s-footer-muted"><a href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a></p>
                ))}
              </div>
            )}
          </div>
          <div className="s-container s-footer-bottom">
            <span>© {new Date().getFullYear()} {s.brand}. All rights reserved.</span>
            <span>{s.legal ?? ""}</span>
            {s.legalLinks && s.legalLinks.length > 0 && (
              <span className="s-footer-legal">
                {s.legalLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
              </span>
            )}
          </div>
        </footer>
      );

    case "marquee":
      return <Marquee items={s.items} />;

    case "credentials":
      return (
        <section className="s-creds">
          <div className="s-container s-creds-row">
            <p className="s-creds-title">{s.title}</p>
            {s.items.map((c) => (
              <a key={c.title} href={c.href ?? "#"} target={c.href ? "_blank" : undefined} rel="noreferrer" className="s-cred">
                <ShieldCheck size={22} />
                <span>
                  <strong>{c.title}</strong>
                  <small>{c.text}{c.href ? " ↗" : ""}</small>
                </span>
              </a>
            ))}
          </div>
        </section>
      );

    case "projects":
      return (
        <section className="s-section" id="work">
          <div className="s-container">
            <Reveal className="s-heading s-heading-row">
              <div>
                {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
                <h2 className="s-h2">{s.title}</h2>
              </div>
              {s.link && <a href={s.link.href} target="_blank" rel="noreferrer" className="s-text-link">{s.link.label} ↗</a>}
            </Reveal>
            <div className="s-projects">
              {s.items.map((p, i) => (
                <Reveal key={p.title} delay={i * 120}>
                  <a href={p.href ?? "#"} target={p.href ? "_blank" : undefined} rel="noreferrer" className="s-project">
                    <div className="s-project-img" style={frame(p.image)}>
                      <SiteImage src={p.image.src} alt={p.image.alt} pos={p.image.position} zoom={p.image.zoom} fill sizes="(max-width: 900px) 100vw, 50vw" />
                    </div>
                    <p className="s-project-loc"><MapPin size={14} /> {p.location}</p>
                    <h3 className="s-h3">{p.title}</h3>
                    <p className="s-muted">{p.text}</p>
                    {p.href && <span className="s-text-link">View project ↗</span>}
                  </a>
                </Reveal>
              ))}
            </div>
            {s.note && <p className="s-fine">{s.note}</p>}
          </div>
        </section>
      );

    case "ratings":
      return (
        <section className="s-section s-alt" id="reviews">
          <div className="s-container">
            <Reveal className="s-heading s-heading-row">
              <div>
                {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
                <h2 className="s-h2">{s.title}</h2>
              </div>
              {s.link && <a href={s.link.href} target="_blank" rel="noreferrer" className="s-text-link">{s.link.label} ↗</a>}
            </Reveal>
            <div className="s-ratings">
              {s.ratings.map((r, i) => (
                <Reveal key={r.platform} delay={i * 70}>
                  <div className="s-rating-box">
                    <p>{r.platform}</p>
                    <strong>{r.score}</strong>
                    {r.label ? <span className="s-rating-label">{r.label}</span> : <Stars size={13} />}
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="s-reviews">
              {s.reviews.map((r, i) => (
                <Reveal key={r.name + i} delay={i * 100}>
                  <Tilt max={4}>
                    <figure className="s-review s-review-card">
                      <span className="s-review-source">{r.source}</span>
                      <Stars />
                      <blockquote>“{r.text}”</blockquote>
                      <figcaption><strong>{r.name}</strong>{r.detail && <span>{r.detail}</span>}</figcaption>
                    </figure>
                  </Tilt>
                </Reveal>
              ))}
            </div>
            {s.note && <p className="s-fine">{s.note}</p>}
          </div>
        </section>
      );

    case "certifications":
      return (
        <section className="s-section s-dark s-certs" id="certifications">
          <div className="s-container">
            <Reveal className="s-heading s-center">
              {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
              <h2 className="s-h2">{renderTitle(s.title, s.highlight)}</h2>
              {s.subtitle && <p className="s-lead">{s.subtitle}</p>}
            </Reveal>
            <div className="s-cert-stats">
              {s.stats.map((c, i) => (
                <Reveal key={c.label} delay={i * 90}>
                  <div className="s-cert-stat">
                    <strong>{c.value ? <Counter value={c.value} prefix={c.prefix} suffix={c.suffix} decimals={0} /> : `${c.prefix ?? ""}${c.suffix ?? ""}`}</strong>
                    <span>{c.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="s-cert-groups">
              {s.groups.map((g, gi) => {
                const Icon = (g.icon && ICONS[g.icon]) || ShieldCheck;
                return (
                  <Reveal key={g.title} delay={gi * 120}>
                    <Tilt max={4}>
                      <div className="s-cert-group">
                        <p className="s-cert-group-title"><Icon size={18} /> {g.title}</p>
                        <ul>
                          {g.items.map((c) => (
                            <li key={c.name} className="s-cert">
                              <ShieldCheck size={20} className="s-cert-icon" />
                              <div>
                                <p className="s-cert-name">{c.name} <span className="s-cert-tag">{c.tag}</span></p>
                                <p className="s-cert-text">{c.text}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Tilt>
                  </Reveal>
                );
              })}
            </div>
            {s.awards.length > 0 && (
              <Reveal>
                <div className="s-awards">
                  <p className="s-awards-title"><Award size={18} /> Awards &amp; recognition</p>
                  <ul>
                    {s.awards.map((a) => <li key={a.name}><strong>{a.name}</strong><span>{a.text}</span></li>)}
                  </ul>
                </div>
              </Reveal>
            )}
            {(s.note || s.link) && (
              <p className="s-fine s-certs-fine">
                {s.note} {s.link && <a href={s.link.href} target="_blank" rel="noreferrer">{s.link.label} ↗</a>}
              </p>
            )}
          </div>
        </section>
      );

    case "leadForm":
      return (
        <section className="s-section s-dark" id="inspection">
          <div className="s-container s-final">
            <Reveal>
              {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
              <h2 className="s-h2">{s.title}</h2>
              <p className="s-lead s-left">{s.text}</p>
              {s.bullets && (
                <ul className="s-checks">
                  {s.bullets.map((b) => <li key={b}><BadgeCheck size={18} /> {b}</li>)}
                </ul>
              )}
              {(s.phone || s.email) && (
                <div className="s-contact-lines">
                  {s.phone && <a href={tel(s.phone)}><Phone size={17} /> {s.phone}</a>}
                  {s.email && <a href={`mailto:${s.email}`}><Mail size={17} /> Email us directly</a>}
                </div>
              )}
            </Reveal>
            <Reveal delay={120}>
              <div className="s-final-card">
                {s.formEyebrow && <p className="s-eyebrow">{s.formEyebrow}</p>}
                <h3 className="s-h2 s-final-title">{s.formTitle}</h3>
                {s.formText && <p className="s-muted">{s.formText}</p>}
                <LeadForm fields={s.fields} options={s.options} optionsLabel={s.optionsLabel} detailsLabel={s.detailsLabel} consent={s.consent} button={s.button} note={s.note} />
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "estimator":
      return (
        <section className="s-section s-dark" id="inspection">
          <div className="s-container s-final">
            <Reveal>
              {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
              <h2 className="s-h2">{s.title}</h2>
              <p className="s-lead s-left">{s.text}</p>
              {s.bullets && (
                <ul className="s-checks">
                  {s.bullets.map((b) => <li key={b}><BadgeCheck size={18} /> {b}</li>)}
                </ul>
              )}
              {(s.phone || s.email) && (
                <div className="s-contact-lines">
                  {s.phone && <a href={tel(s.phone)}><Phone size={17} /> {s.phone}</a>}
                  {s.email && <a href={`mailto:${s.email}`}><Mail size={17} /> Email us directly</a>}
                </div>
              )}
            </Reveal>
            <Reveal delay={120}>
              <div className="s-final-card">
                <Estimator formspree={s.formspree} forwardTo={s.forwardTo} />
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "funnelHeader":
      return (
        <header className="s-funnel-header">
          <div className="s-container s-header-row">
            <span className="s-brand">{s.brand}</span>
            {s.note && <span className="s-funnel-note">{s.note}</span>}
            {s.phone && (
              <a href={tel(s.phone)} className="s-header-phone s-funnel-phone">
                <Phone size={16} /> {s.phone}
              </a>
            )}
          </div>
        </header>
      );

    case "quiz":
      return (
        <section className="s-section s-quiz-section">
          <div className="s-container s-narrow">
            <div className="s-heading s-center s-enter">
              {s.eyebrow && <p className="s-eyebrow">{s.eyebrow}</p>}
              <h1 className="s-h1 s-quiz-title">{s.title}</h1>
              {s.subtitle && <p className="s-lead">{s.subtitle}</p>}
            </div>
            <div className="s-enter-late">
              <Quiz questions={s.questions} contact={s.contact} next={s.next} storageKey={s.storageKey} />
            </div>
          </div>
        </section>
      );

    case "quizResult":
      return (
        <section className="s-section s-result-section">
          <div className="s-container s-narrow s-enter">
            <QuizResultView storageKey={s.storageKey} basedOn={s.basedOn} results={s.results} fallback={s.fallback}>
              <div className="s-btn-row s-center-row">
                <a href={s.cta.href} className="s-btn s-btn-primary s-btn-lg">{s.cta.label}</a>
                {s.secondary && <a href={s.secondary.href} className="s-btn s-btn-outline s-btn-lg">{s.secondary.label}</a>}
              </div>
            </QuizResultView>
          </div>
        </section>
      );

    case "thankYou":
      return (
        <section className="s-section s-thanks">
          <div className="s-container s-narrow s-center">
            <div className="s-enter">
              <span className="s-thanks-check" aria-hidden="true"><BadgeCheck size={40} /></span>
              <h1 className="s-h1">{s.title}</h1>
              <p className="s-lead">{s.text}</p>
            </div>
            <ol className="s-thanks-steps">
              {s.steps.map((st, i) => (
                <Reveal key={st.title} delay={i * 120}>
                  <li>
                    <span className="s-step-n">{i + 1}</span>
                    <div>
                      <h3 className="s-h3">{st.title}</h3>
                      <p className="s-muted">{st.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            {(s.cta || s.secondary) && (
              <div className="s-btn-row s-center-row">
                {s.cta && <a href={s.cta.href} className="s-btn s-btn-primary s-btn-lg">{s.cta.label}</a>}
                {s.secondary && <a href={s.secondary.href} className="s-btn s-btn-outline s-btn-lg">{s.secondary.label}</a>}
              </div>
            )}
            {s.note && <p className="s-fine">{s.note}</p>}
          </div>
        </section>
      );

    case "offerStack":
      return (
        <section className="s-section s-alt" id="offer">
          <div className="s-container">
            <Heading eyebrow={s.eyebrow} title={s.title} />
            <Reveal>
              <div className={`s-stack ${s.image ? "has-image" : ""}`}>
                {s.image && (
                  <div className="s-stack-photo" style={frame(s.image)}>
                    <SiteImage src={s.image.src} alt={s.image.alt} pos={s.image.position} zoom={s.image.zoom} fill sizes="(max-width: 900px) 100vw, 40vw" />
                  </div>
                )}
                <div className="s-stack-card">
                  <ul className="s-stack-list">
                    {s.items.map((it) => (
                      <li key={it.name}>
                        <span><BadgeCheck size={18} /> {it.name}</span>
                        <span className="s-stack-value">{it.value}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="s-stack-total">
                    <span>Total value</span>
                    <span className="s-was">{s.totalValue}</span>
                  </div>
                  <p className="s-stack-price">
                    {s.price}
                    {s.priceNote && <span>{s.priceNote}</span>}
                  </p>
                  <a href={s.cta.href} className="s-btn s-btn-primary s-btn-lg s-btn-block">{s.cta.label}</a>
                  {s.deadline && <p className="s-fine s-center">{s.deadline}</p>}
                  {s.guarantee && (
                    <div className="s-guarantee">
                      <ShieldCheck size={26} />
                      <div>
                        <strong>{s.guarantee.title}</strong>
                        <p>{s.guarantee.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "checkout":
      return (
        <section className="s-section s-checkout-section">
          <div className="s-container s-checkout">
            <div className="s-enter">
              <p className="s-eyebrow">Checkout</p>
              <h1 className="s-h2">{s.title}</h1>
              <DemoCheckout fields={s.fields} button={s.button} next={s.next} note={s.note} />
            </div>
            <aside className="s-order s-enter-late">
              {s.image && (
                <div className="s-order-photo" style={frame(s.image)}>
                  <SiteImage src={s.image.src} alt={s.image.alt} pos={s.image.position} zoom={s.image.zoom} fill sizes="(max-width: 900px) 100vw, 35vw" />
                </div>
              )}
              <p className="s-h3">{s.product}</p>
              <ul className="s-order-lines">
                {s.lineItems.map((l) => (
                  <li key={l.name}><span>{l.name}</span><span>{l.price}</span></li>
                ))}
              </ul>
              <div className="s-order-total"><span>Total today</span><strong>{s.total}</strong></div>
            </aside>
          </div>
        </section>
      );

    case "funnelFooter":
      return (
        <footer className="s-funnel-footer">
          <div className="s-container">
            <p>© {new Date().getFullYear()} {s.brand}. {s.text ?? "All rights reserved."}</p>
            <p>Privacy policy · Terms</p>
          </div>
        </footer>
      );

    case "mobileBar":
      return (
        <div className={s.phone ? "s-mobile-bar" : "s-mobile-bar is-single"}>
          {s.phone && <a href={tel(s.phone)} className="s-btn s-btn-outline-light"><Phone size={16} /> Call</a>}
          <a href={s.cta.href} className="s-btn s-btn-primary">{s.cta.label}</a>
        </div>
      );
  }
}

/** Inner pages: the site's own header and footer around custom page content. */
export function SiteFrame({ theme, top, bottom, children }: { theme: Theme; top: Section[]; bottom: Section[]; children: React.ReactNode }) {
  return (
    <div className="s-site" style={themeVars(theme)}>
      {top.map((s, i) => <SectionView key={`t${i}`} s={s} />)}
      <main>{children}</main>
      {bottom.map((s, i) => <SectionView key={`b${i}`} s={s} />)}
    </div>
  );
}

export function SiteRenderer({ template }: { template: SiteTemplate }) {
  return <PageRenderer theme={template.theme} sections={template.sections} />;
}

export function PageRenderer({ theme, sections, editable = false }: { theme: Theme; sections: (Section & { hidden?: boolean })[]; editable?: boolean }) {
  return (
    <div className="s-site" style={themeVars(theme)}>
      {sections.map((s, i) =>
        s.hidden ? null : editable ? (
          // display: contents mantém o layout; o editor usa o índice para saber qual seção foi clicada.
          <div key={i} data-s-index={i} style={{ display: "contents" }}>
            <SectionView s={s} />
          </div>
        ) : (
          <SectionView key={i} s={s} />
        )
      )}
    </div>
  );
}

export function FunnelStepRenderer({ funnel, step }: { funnel: FunnelTemplate; step: string }) {
  const current = funnel.steps.find((st) => st.slug === step) ?? funnel.steps[0];
  return <PageRenderer theme={funnel.theme} sections={current.sections} />;
}
