// Modelo de dados dos sites. Uma página é um tema + uma lista de seções aprovadas.
// O cliente edita só o conteúdo das seções; layout, fontes e espaçamento vêm do tema.

export type Theme = {
  id: string;
  name: string;
  colors: {
    bg: string;
    surface: string; // cartões e faixas alternadas
    text: string;
    muted: string;
    primary: string; // botões e destaques
    onPrimary: string;
    accent: string; // detalhes (estrelas, ícones)
    dark: string; // faixas escuras (CTA, rodapé)
    onDark: string;
    ctaOnDark?: string; // botão principal sobre fundos escuros, quando a cor principal já é escura
    accentOnDark?: string; // destaque legível sobre fotos escuras (hero com foto)
  };
  fonts: { heading: "inter" | "poppins" | "playfair" | "manrope"; body: "inter" | "poppins" | "manrope" | "dmsans" };
  headingWeight: 500 | 600 | 700 | 800;
  radius: string; // cartões
  buttonRadius: string;
};

export type Cta = { label: string; href: string };
/** position: ponto de foco ("50% 20%"); zoom: 100–250 (%); shape: formato da moldura; ratio: proporção original (largura/altura). */
export type Img = { src: string; alt: string; position?: string; zoom?: number; shape?: "wide" | "landscape" | "square" | "portrait" | "original"; ratio?: number };

export type Section =
  | { type: "topbar"; text: string; phone?: string }
  | { type: "header"; brand: string; tagline?: string; logo?: Img; nav: Cta[]; phone?: string; cta: Cta }
  | {
      type: "hero";
      variant: "split-form" | "overlay" | "split-image";
      eyebrow?: string;
      title: string;
      highlight?: string; // trecho do título com a cor de destaque
      subtitle: string;
      primary: Cta;
      secondary?: Cta;
      image: Img;
      badges?: string[];
      form?: { title: string; fields: string[]; button: string; note?: string; next?: string };
      proof?: string; // selo flutuante sobre a foto (ex.: "Rated 4.9 by 600+ patients")
      services?: string[]; // linha de serviços com destaque alternando (ex.: Windows · Roofing · Siding)
      chips?: { title: string; text: string }[]; // selos flutuantes sobre a foto (até 3)
    }
  | { type: "stats"; items: { value: number; suffix?: string; prefix?: string; label: string; decimals?: number }[] }
  | { type: "logos"; title: string; items: string[] }
  | {
      type: "services";
      eyebrow?: string;
      title: string;
      subtitle?: string;
      items: { title: string; text: string; image?: Img; icon?: string; price?: string; label?: string; detail?: string; cta?: Cta }[];
      note?: string; // frase abaixo dos cartões
    }
  | { type: "beforeAfter"; eyebrow?: string; title: string; subtitle?: string; before: Img; after: Img; caption?: string }
  | { type: "steps"; eyebrow?: string; title: string; items: { title: string; text: string }[] }
  | {
      type: "split";
      id?: string;
      eyebrow?: string;
      title: string;
      text: string;
      bullets?: string[];
      image: Img;
      reverse?: boolean;
      cta?: Cta;
      secondary?: Cta;
      signature?: string;
      instagram?: string; // link do perfil (https://www.instagram.com/usuario/)
      dark?: boolean; // faixa escura
      points?: { title: string; text: string }[]; // lista numerada
    }
  | { type: "offer"; id?: string; eyebrow: string; title: string; text: string; price?: string; was?: string; cta: Cta; fine?: string }
  | { type: "testimonials"; title: string; rating: string; items: { name: string; text: string; detail?: string }[] }
  | {
      type: "pricing";
      eyebrow?: string;
      title: string;
      plans: { name: string; price: string; period: string; features: string[]; featured?: boolean; cta: Cta }[];
    }
  | { type: "gallery"; title: string; images: Img[] }
  | { type: "faq"; title: string; items: { q: string; a: string }[] }
  | { type: "cta"; title: string; text: string; primary: Cta; secondary?: Cta }
  | {
      type: "footer";
      brand: string;
      about: string;
      address?: string;
      phone: string;
      email?: string;
      instagram?: string; // link do perfil (https://www.instagram.com/usuario/)
      hours?: string[];
      areas?: string[];
      licenses?: string;
      links?: Cta[];
      legal?: string; // letras miúdas no rodapé
    }
  | { type: "marquee"; items: string[] }
  | { type: "credentials"; title: string; items: { title: string; text: string; href?: string }[] }
  | {
      type: "projects";
      eyebrow?: string;
      title: string;
      link?: Cta;
      items: { image: Img; location: string; title: string; text: string; href?: string }[];
      note?: string;
    }
  | {
      type: "ratings";
      eyebrow?: string;
      title: string;
      link?: Cta;
      ratings: { platform: string; score: string; label?: string }[];
      reviews: { source: string; text: string; name: string; detail?: string }[];
      note?: string;
    }
  | {
      type: "certifications";
      eyebrow?: string;
      title: string;
      highlight?: string;
      subtitle?: string;
      stats: { value: number; prefix?: string; suffix?: string; label: string }[];
      groups: { title: string; icon?: string; items: { name: string; tag: string; text: string }[] }[];
      awards: { name: string; text: string }[];
      note?: string;
      link?: Cta;
    }
  | {
      type: "leadForm";
      eyebrow?: string;
      title: string;
      text: string;
      bullets?: string[];
      phone?: string;
      email?: string;
      formEyebrow?: string;
      formTitle: string;
      formText?: string;
      fields: string[];
      options?: string[]; // caixas de seleção (ex.: produtos de interesse)
      optionsLabel?: string;
      detailsLabel?: string; // campo de texto livre (opcional)
      consent?: string;
      button: string;
      note?: string;
    }
  | {
      type: "estimator"; // estimador de preço em etapas que termina agendando visita ou ligação
      eyebrow?: string;
      title: string;
      text: string;
      bullets?: string[];
      phone?: string;
      email?: string;
      formspree?: string; // opcional: também manda o pedido por e-mail via Formspree
      forwardTo?: string; // opcional: também manda uma cópia do pedido para outro CRM (link de entrada de formulário)
    }
  | { type: "mobileBar"; phone: string; cta: Cta }
  // ─── Blocos de funil ───
  | { type: "funnelHeader"; brand: string; phone?: string; note?: string }
  | {
      type: "quiz";
      eyebrow?: string;
      title: string;
      subtitle?: string;
      questions: { q: string; options: { label: string; icon?: string }[] }[];
      contact: { title: string; fields: string[]; button: string; note?: string };
      next: string;
      storageKey: string;
    }
  | {
      type: "quizResult";
      storageKey: string;
      basedOn: number; // índice da pergunta que define o resultado
      results: { match: string; title: string; text: string; estimate?: string }[];
      fallback: { title: string; text: string; estimate?: string };
      cta: Cta;
      secondary?: Cta;
    }
  | { type: "thankYou"; title: string; text: string; steps: { title: string; text: string }[]; cta?: Cta; secondary?: Cta; note?: string }
  | {
      type: "offerStack";
      eyebrow?: string;
      title: string;
      image?: Img;
      items: { name: string; value: string }[];
      totalValue: string;
      price: string;
      priceNote?: string;
      cta: Cta;
      guarantee?: { title: string; text: string };
      deadline?: string;
    }
  | {
      type: "checkout";
      title: string;
      product: string;
      image?: Img;
      lineItems: { name: string; price: string }[];
      total: string;
      fields: string[];
      button: string;
      next: string;
      note?: string;
    }
  | { type: "funnelFooter"; brand: string; text?: string };

export type FunnelKind = "capture" | "quiz" | "offer";

export type FunnelTemplate = {
  slug: string;
  name: string;
  niche: string;
  kind: FunnelKind;
  description: string;
  preview: Img;
  theme: Theme;
  steps: { slug: string; name: string; sections: Section[] }[];
};

export type SiteTemplate = {
  slug: string;
  name: string; // nome do modelo (interno)
  niche: string;
  description: string;
  preview: Img;
  theme: Theme;
  sections: Section[];
};

/** Conteúdo editável de um site ou funil do cliente. Um site tem uma página (slug ""); um funil, uma por etapa. */
export type EditableSection = Section & { hidden?: boolean };
export type SitePage = { slug: string; name: string; sections: EditableSection[] };
export type SiteContent = {
  template: string; // slug do modelo de origem
  theme: Theme;
  pages: SitePage[];
  seo?: { title?: string; description?: string };
  chat?: { agentId: string | null }; // agente de IA no canto do site (widget de chat)
};
