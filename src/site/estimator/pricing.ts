// Tabela de preços do estimador: preços reais do Daniel (enviados em 2026-11-19).
// Telhado e siding vieram por "square" (100 sq ft) e estão aqui convertidos para preço por sq ft.

export type ProjectKey = "windows" | "roofing" | "siding" | "doors" | "gutters" | "unsure";
export type Tier = { key: string; name: string; brand: string; note: string };

type Range = [number, number];

export const PROJECTS: { key: ProjectKey; label: string; hint: string }[] = [
  { key: "windows", label: "Windows", hint: "Priced per opening" },
  { key: "roofing", label: "Roofing", hint: "Full replacement" },
  { key: "siding", label: "Siding", hint: "Whole house" },
  { key: "doors", label: "Doors", hint: "Entry or patio" },
  { key: "gutters", label: "Gutters", hint: "Seamless, with guards" },
  { key: "unsure", label: "Not sure yet", hint: "Let’s look together" },
];

/** Opção mais escolhida pelos clientes do Daniel: ganha o selo "Most chosen" e vem marcada por padrão. */
export const POPULAR: Record<Exclude<ProjectKey, "unsure">, string> = {
  windows: "good", // Vytex
  roofing: "better",
  siding: "better",
  doors: "good", // ProVia steel
  gutters: "better",
};

export const TIERS: Record<Exclude<ProjectKey, "unsure">, Tier[]> = {
  windows: [
    { key: "good", name: "Good", brand: "Vytex vinyl", note: "Energy-efficient double-pane, clean white finish" },
    { key: "better", name: "Better", brand: "ProVia Endure vinyl", note: "Heavier frame, upgraded glass, more color options" },
    { key: "best", name: "Best", brand: "ProVia premium", note: "Top glass package, interior wood looks, custom shapes" },
  ],
  roofing: [
    { key: "good", name: "Good", brand: "GAF Timberline HDZ", note: "Full GAF roof system, ventilation included" },
    { key: "better", name: "Better", brand: "GAF Timberline UHDZ", note: "Thicker, more dimensional shingle" },
    { key: "best", name: "Best", brand: "Synthetic cedar shake", note: "Brava synthetic shake, premium look" },
  ],
  siding: [
    { key: "good", name: "Good", brand: "Mastic vinyl", note: "Low maintenance, wide color range" },
    { key: "better", name: "Better", brand: "Mastic insulated vinyl", note: "Added insulation, straighter walls" },
    { key: "best", name: "Best", brand: "James Hardie fiber cement", note: "Fiber cement, the look of wood" },
  ],
  doors: [
    { key: "good", name: "Good", brand: "ProVia steel entry", note: "Secure, efficient, many styles" },
    { key: "better", name: "Better", brand: "ProVia fiberglass entry", note: "Wood-grain look, no rot" },
    { key: "best", name: "Best", brand: "ProVia patio door", note: "Sliding or hinged patio door" },
  ],
  gutters: [
    { key: "good", name: "Good", brand: "Seamless aluminum", note: "6-inch seamless gutters and downspouts" },
    { key: "better", name: "Better", brand: "Seamless + guards", note: "Gutter guards to keep leaves out" },
  ],
};

// Preço instalado (baixo, alto) por unidade. Fonte: Daniel.
const PRICE = {
  windowPerOpening: { good: [1100, 1500], better: [1400, 1800], best: [1500, 2200] } as Record<string, Range>,
  windowSpecialty: [10000, 15000] as Range, // bay ou bow, cada
  roofPerSqft: { good: [9, 12], better: [12, 15], best: [20, 25] } as Record<string, Range>, // $900–1,200 por square etc.
  sidingPerSqft: { good: [13, 16], better: [17, 21], best: [17, 21] } as Record<string, Range>,
  doorEach: { good: [4000, 12000], better: [6000, 23000], best: [5000, 8000] } as Record<string, Range>,
  gutterPerFoot: { good: [35, 40], better: [50, 65] } as Record<string, Range>,  // Capping de alumínio em volta de cada janela/porta, no siding. Fonte: Daniel.
  cappingPerOpening: [250, 400] as Range,
  minimum: { windows: 4000, roofing: 1000, siding: 1000, doors: 4000, gutters: 1000 } as Record<string, number>,
};

/** Margem de apresentação sobre a tabela do Daniel: +10% no valor baixo, +20% no alto. */
const CUSHION: Range = [1.1, 1.2];
/** Faixa mostrada quando há média regional: 20% abaixo a 20% acima da média. */
const AVERAGE_BAND: Range = [0.8, 1.2];
/** Janelas: início da faixa mostrada, por janela (pedido do Daniel). */
const WINDOW_START_EACH = 1400;

// Média de referência: Remodeling 2025 Cost vs. Value Report, região MIDDLE ATLANTIC (Nova York e Pensilvânia),
// escolhida pelo Daniel. No relatório, DC e Virginia ficam em South Atlantic, por isso o rótulo diz NY e PA.
// Convertida por unidade. Só onde existe um projeto comparável no relatório.
export const NATIONAL_SOURCE = {
  short: "Mid-Atlantic avg.",
  label: "2025 Cost vs. Value Report, Middle Atlantic region",
  href: "https://www.jlconline.com/cost-vs-value/2025/middle-atlantic/",
};
const NATIONAL = {
  windowVinylEach: 23986 / 10, // 10 janelas vinyl 3x5
  roofAsphaltSqft: 37201 / 3000, // telhado de 3.000 sq ft
  sidingVinylSqft: 21175 / 1250, // 1.250 sq ft de parede, com trim de fábrica nas aberturas e cantos
  sidingFiberSqft: 25666 / 1250,
  doorSteelEach: 2684, // porta de entrada de aço padrão (comparação desligada)
};

export type Answers = {
  project: ProjectKey | null;
  tier: string;
  windows: number;
  specialty: number;
  homeSqft: number;
  stories: 1 | 2 | 3;
  roofShape: "simple" | "some" | "complex";
  roofKnown: boolean; // o cliente sabe a metragem do telhado
  roofSqft: number;
  sidingKnown: boolean; // o cliente sabe a metragem do siding
  sidingSqft: number;
  sidingShare: number; // parte da casa coberta por siding (o resto é tijolo ou pedra)
  doors: number;
  openings: number;
  sidelights: 0 | 1 | 2;
  transom: boolean;
  glass: "none" | "standard" | "decorative";
  reasons: string[];
  timeline: string;
  zip: string;
};

export const INITIAL: Answers = {
  project: null, tier: "better", windows: 12, specialty: 0, homeSqft: 2200, stories: 2,
  roofShape: "some", roofKnown: false, roofSqft: 2000, sidingKnown: true, sidingSqft: 2000, sidingShare: 1, doors: 1, openings: 16, sidelights: 0, transom: false, glass: "standard", reasons: [], timeline: "", zip: "",
};

export type Estimate = { low: number; high: number; scope: string; included: string[]; movers: string[]; national?: { value: number; label: string; why?: string; addOn?: { short: string; label: string; value: number; base: number; note?: string } } };

const round = (n: number) => Math.round(n / 100) * 100;
const scale = ([lo, hi]: Range, qty: number): Range => [lo * qty, hi * qty];

/** Área do telhado: a que o cliente informou, ou estimada pela casa (área por andar + inclinação + beirais + formato). */
/**
 * Área de siding pela casa: perímetro de uma planta retangular (proporção 1,5:1) x altura das paredes
 * (9,5 ft por andar) + as duas empenas (telhado 6/12). Aberturas não são descontadas.
 */
export function sidingAreaOf(a: Answers) {
  if (a.sidingKnown) return a.sidingSqft;
  const footprint = a.homeSqft / a.stories;
  const width = Math.sqrt(footprint / 1.5);
  const perimeter = 5 * width;
  const walls = perimeter * 9.5 * a.stories;
  const gables = (width * width) / 4;
  return (walls + gables) * a.sidingShare;
}

export function roofAreaOf(a: Answers) {
  if (a.roofKnown) return a.roofSqft;
  const shape = a.roofShape === "complex" ? 1.25 : a.roofShape === "some" ? 1.12 : 1;
  return (a.homeSqft / a.stories) * 1.3 * shape;
}

export function estimate(a: Answers): Estimate | null {
  if (!a.project || a.project === "unsure") return null;
  const tier = TIERS[a.project].find((t) => t.key === a.tier) ?? TIERS[a.project][1];
  const footprint = a.homeSqft / a.stories;
  let range: Range = [0, 0];
  let scope = "";
  let included: string[] = [];
  let movers: string[] = [];
  let national: Estimate["national"];

  if (a.project === "windows") {
    const standard = Math.max(0, a.windows - a.specialty);
    const [l1, h1] = scale(PRICE.windowPerOpening[tier.key], standard);
    const [l2, h2] = scale(PRICE.windowSpecialty, a.specialty);
    range = [l1 + l2, h1 + h2];
    if (!a.specialty) national = { value: a.windows * NATIONAL.windowVinylEach, label: `${a.windows} vinyl replacement windows` };
    scope = `${a.windows} windows${a.specialty ? `, ${a.specialty} bay or bow` : ""} · ${tier.brand}`;
    included = ["Removal and disposal of old windows", "Custom-measured windows, installed and sealed", "Exterior trim capping and interior finish"];
    movers = ["Rotten framing or sills found during removal", "Grids, colors and glass upgrades", "Upper-floor access or unusual sizes"];
  }
  if (a.project === "roofing") {
    const roofArea = roofAreaOf(a);
    range = scale(PRICE.roofPerSqft[tier.key], roofArea);
    if (tier.key !== "best") {
      const base = roofArea * NATIONAL.roofAsphaltSqft;
      national = {
        value: base,
        label: "an asphalt-shingle roof this size",
        why: tier.key === "better" ? "Timberline UHDZ is GAF’s thicker premium shingle and comes with a longer warranty than the standard roof in the regional average." : undefined,
      };
      // UHDZ: +20% sobre a média de um telhado padrão, pela qualidade e garantia maiores (pedido do Daniel).
      if (tier.key === "better") {
        national.addOn = { short: "premium", label: "20% for the premium UHDZ shingle and longer warranty", value: Math.round(base * 0.2), base: Math.round(base) };
        national.value = base * 1.2;
      }
    }
    scope = `About ${round(roofArea).toLocaleString()} sq ft of roof · ${tier.brand}`;
    included = ["Tear-off down to the deck and disposal", "Full GAF system: underlayment, ice and water, ridge vents", "Cleanup with magnetic nail sweep"];
    movers = ["Rotted decking that needs replacing", "Steep pitch, skylights or chimneys", "Multiple layers of old shingles"];
  }
  if (a.project === "siding") {
    const wallArea = sidingAreaOf(a);
    const [sl, sh] = scale(PRICE.sidingPerSqft[tier.key], wallArea);
    const [cl, ch] = scale(PRICE.cappingPerOpening, a.openings);
    range = [sl + cl, sh + ch];
    national = tier.key === "best"
      ? { value: wallArea * NATIONAL.sidingFiberSqft, label: "fiber-cement siding this size" }
      : {
          value: wallArea * NATIONAL.sidingVinylSqft,
          label: "standard vinyl siding this size",
          why: tier.key === "better" ? "Insulated siding adds a foam backing for energy savings and straighter walls. The regional average is for standard vinyl." : undefined,
        };
    // A média regional não inclui capping de alumínio: somamos o capping das mesmas aberturas (preço médio do Daniel,
    // sem a margem de apresentação) para comparar o mesmo trabalho. O texto da tela mostra essa conta.
    if (a.openings) {
      const capping = a.openings * PRICE.cappingPerOpening[1]; // sempre o valor alto ($400), pedido do Daniel
      national.addOn = {
        short: "capping",
        label: `trim capping on ${a.openings} windows and doors at $400 each`,
        value: Math.round(capping),
        base: Math.round(national.value),
        note: "The report’s figure doesn’t include capping.",
      };
      national.value += capping;
    }
    scope = `${a.sidingKnown ? "" : "About "}${(a.sidingKnown ? Math.round(wallArea) : round(wallArea)).toLocaleString()} sq ft of wall, capping on ${a.openings} windows and doors · ${tier.brand}`;
    included = ["Removal of old siding and disposal", "House wrap and flashing details", "New trim, corners and finishing pieces"];
    movers = ["Sheathing repairs under the old siding", "Shutters, gables and decorative trim", "Height and access around the home"];
  }
  if (a.project === "doors") {
    // Entrada: a configuração (sidelights, transom, vidro) posiciona o preço dentro da faixa do Daniel.
    const [lo, hi] = PRICE.doorEach[tier.key];
    let each: Range = [lo, hi];
    if (tier.key !== "best") {
      const glassScore = { none: 0, standard: 0.1, decorative: 0.35 }[a.glass];
      const score = Math.min(1, [0, 0.25, 0.45][a.sidelights] + (a.transom ? 0.2 : 0) + glassScore);
      const span = hi - lo;
      each = [lo + span * score * 0.8, lo + span * Math.min(1, score * 0.8 + 0.25)];
      // Vidro decorativo pode subir muito o preço: a faixa vai até o topo da tabela do Daniel.
      if (a.glass === "decorative") each[1] = hi;
    }
    range = scale(each, a.doors);
    const config = tier.key === "best" ? [] : [
      a.sidelights ? (a.sidelights === 1 ? "1 sidelight" : "2 sidelights") : "",
      a.transom ? "transom" : "",
      a.glass === "none" ? "solid door" : a.glass === "decorative" ? "decorative glass" : "standard glass",
    ].filter(Boolean);
    scope = `${a.doors} ${a.doors === 1 ? "door" : "doors"} · ${tier.brand}${config.length ? ` · ${config.join(", ")}` : ""}`;
    included = ["Removal of the old door and frame", "New door system installed, sealed and insulated", "Interior and exterior trim finish"];
    movers = [
      ...(a.glass === "decorative" ? ["Decorative glass varies a lot: the design you pick can move the price toward the top of this range"] : ["Decorative glass and hardware choices"]),
      "Sidelights, transoms or wider openings",
      "Rotted sill or subfloor",
    ];
  }
  if (a.project === "gutters") {
    const feet = 4 * Math.sqrt(footprint) * 1.15;
    range = scale(PRICE.gutterPerFoot[tier.key], feet);
    scope = `About ${Math.round(feet / 10) * 10} linear ft · ${tier.brand}`;
    included = ["Removal of old gutters", "Seamless gutters formed on site", "Downspouts directed away from the house"];
    movers = ["Fascia board repairs", "Extra downspouts or underground drains", "Roof height and access"];
  }

  const min = PRICE.minimum[a.project];
  const real: Range = [Math.max(min, range[0]), Math.max(min * 1.3, range[1])];
  // Com média regional: a faixa mostrada vai de 20% abaixo a 20% acima da média, para o preço ficar sempre perto dela.
  // O topo nunca fica abaixo do preço mais alto real do Daniel (ele nunca cota acima do que o cliente viu).
  // Sem média (portas, calhas, shake, bay/bow): margem de apresentação de 10% a 20% sobre a tabela do Daniel.
  const shown: Range = national
    ? [national.value * AVERAGE_BAND[0], Math.max(national.value * AVERAGE_BAND[1], real[1])]
    : [real[0] * CUSHION[0], real[1] * CUSHION[1]];
  // Janelas (preço do Daniel bem abaixo da média): Vytex começa em $1.400 por janela e vai até 20% acima da média.
  // Os níveis acima (Endure, premium) sobem a faixa toda pela mesma diferença que têm sobre a Vytex na tabela.
  if (a.project === "windows" && national) {
    const [tLo, tHi] = PRICE.windowPerOpening[tier.key];
    const [gLo, gHi] = PRICE.windowPerOpening.good;
    shown[0] = a.windows * (WINDOW_START_EACH + (tLo - gLo));
    shown[1] = Math.max(national.value * AVERAGE_BAND[1] + a.windows * (tHi - gHi), real[1]);
  }
  return {
    low: round(shown[0]), high: round(shown[1]), scope, included, movers,
    national: national && { ...national, value: Math.round(national.value) }, // valor exato, sem arredondar para centenas
  };
}

export const REASONS: Record<ProjectKey, string[]> = {
  windows: ["Drafts or high bills", "Foggy glass", "Hard to open", "Rot or damage", "Noise", "New look"],
  roofing: ["Active leak", "Storm damage", "Missing shingles", "Roof is getting old", "Selling soon", "New look"],
  siding: ["Cracks or warping", "Moisture or rot", "Fading color", "Too much maintenance", "Storm damage", "New look"],
  doors: ["Drafts", "Security", "Hard to open", "Damage or rot", "More light", "New look"],
  gutters: ["Overflowing", "Leaks or sagging", "Clogging with leaves", "Water in basement", "Fascia damage", "New look"],
  unsure: ["Leak", "Drafts", "Visible damage", "High energy bills", "Selling soon", "New look"],
};

export const TIMELINES = ["As soon as possible", "1–3 months", "3–6 months", "Just planning"];

export const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
