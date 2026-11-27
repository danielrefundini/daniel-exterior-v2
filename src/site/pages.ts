// Content for the service pages and the Montgomery County page.
//
// DRAFT COPY: every page below is marked `draft: true` until Daniel approves the wording.
// While a page is a draft, preview and local builds show a small "Draft copy" ribbon on it.
// Production never shows the ribbon. To approve a page, change `draft` to false.
//
// Rules for this file: only facts already on the live site, natural American English,
// no em dashes, no prices, no new claims, and never a phone number.

import type { Img } from "./types";

export type ServiceSlug = "windows" | "roofing" | "siding" | "doors" | "gutters" | "attic-insulation" | "decks";

export type ServicePage = {
  slug: ServiceSlug;
  draft: boolean;
  /** Short name for links and breadcrumbs. */
  name: string;
  /** One line for link cards. */
  summary: string;
  /** Used as the Service "serviceType" in JSON-LD. */
  serviceType: string;
  title: string; // 50 to 60 characters
  description: string; // 150 to 160 characters
  h1: string;
  intro: string;
  image?: Img & { width: number; height: number; caption?: string };
  noticingTitle: string;
  noticing: string[];
  helpTitle: string;
  help: string[];
  optionsTitle?: string;
  options?: { name: string; text: string }[];
  credentials?: { name: string; text: string }[];
  /** Where the main button goes: the home estimator, preselected when the estimator covers this service. */
  estimateHref: string;
  ctaLabel: string;
  related: ServiceSlug[];
};

const PROJECT_PHOTOS = {
  roof: {
    src: "/images/roof.webp",
    alt: "Aerial view of a synthetic cedar shake roof in Gaithersburg, MD",
    width: 1280,
    height: 959,
    caption: "Brava synthetic cedar shake roof replacement in Gaithersburg, Maryland. Project photography © Presidential Exteriors.",
  },
  siding: {
    src: "/images/siding.webp",
    alt: "New siding on a home in Columbia, MD",
    width: 1200,
    height: 675,
    caption: "A whole-home exterior refresh in Columbia, Maryland: siding, windows, a sliding door, gutters and trim. Project photography © Presidential Exteriors.",
  },
};

export const SERVICES: ServicePage[] = [
  {
    slug: "windows",
    draft: true,
    summary: "Drafty rooms, fogged glass, or windows that won’t open easily? Let’s take a closer look.",
    name: "Windows",
    serviceType: "Window replacement",
    title: "Replacement Windows in the DMV Area | Daniel Exteriors",
    description:
      "Drafty rooms or fogged glass? Compare Vytex and ProVia replacement windows with Daniel Refundini. Free exterior inspection and estimate across the DMV area.",
    h1: "Replacement windows in the DMV, explained before you choose",
    intro:
      "Drafty rooms, fogged glass, or windows that won’t open easily are common reasons to start looking at replacement windows. I’ll help you understand what’s going on with the windows you have and compare your options in plain language, so the recommendation makes sense to you before you decide.",
    image: {
      src: "https://images.unsplash.com/photo-1607900840367-a83dcd63296d?auto=format&fit=crop&w=1600&q=80",
      alt: "Brick colonial home with white sash windows",
      width: 1600,
      height: 1067,
    },
    noticingTitle: "What homeowners usually notice first",
    noticing: [
      "Drafts near windows, or rooms that are hard to keep comfortable",
      "Fogging or condensation between the panes of glass",
      "Sashes that stick, won’t stay open, or won’t lock",
      "Worn frames, or a look that no longer fits your home",
    ],
    helpTitle: "How I help you compare windows",
    help: [
      "We’ll look at the windows you’re concerned about and talk through what you’d like to improve: comfort, appearance, ease of use, or all three.",
      "Glass packages, frame materials, how each window opens, and the installation details all belong in the comparison, not just the price at the bottom.",
    ],
    optionsTitle: "Windows we compare",
    options: [
      { name: "Vytex vinyl windows", text: "An energy-efficient double-pane window with a clean white finish." },
      { name: "ProVia Endure vinyl windows", text: "A heavier frame, upgraded glass and more color options." },
      { name: "ProVia premium windows", text: "The top glass package, interior wood looks and custom shapes." },
      { name: "Bay and bow windows", text: "Ask about bay or bow windows if you’re replacing a larger opening that projects out from the wall." },
    ],
    credentials: [
      { name: "Vytex Certified", text: "The installation team is certified by the window manufacturer." },
      { name: "AAMA-trained installers", text: "Installers trained and certified through the American Architectural Manufacturers Association." },
      { name: "NFRC-certified products", text: "Every window and door offered is rated for energy performance by the National Fenestration Rating Council." },
    ],
    estimateHref: "/#estimate-windows",
    ctaLabel: "Request a free window estimate",
    related: ["doors", "siding", "attic-insulation"],
  },
  {
    slug: "roofing",
    draft: true,
    summary: "Missing shingles or a ceiling stain? Understand the roof’s condition before choosing your next step.",
    name: "Roofing",
    serviceType: "Roof replacement",
    title: "Roof Replacement in the DMV | GAF Roofing | Daniel Exteriors",
    description:
      "Missing shingles or a ceiling stain? Understand your roof’s condition and compare GAF roofing systems with Daniel Refundini. Free inspection across the DMV.",
    h1: "Roof replacement in the DMV, starting with a clear inspection",
    intro:
      "Missing shingles, a stain on the ceiling, or a roof that’s simply getting older can leave you unsure what to do next. A free inspection helps you understand the roof’s condition before you choose a next step, and I’ll walk you through what the findings mean.",
    image: PROJECT_PHOTOS.roof,
    noticingTitle: "What homeowners usually notice first",
    noticing: [
      "Missing or damaged shingles",
      "A ceiling stain or other signs of a leak",
      "Shingles that look worn as the roof gets older",
      "Questions about attic ventilation",
    ],
    helpTitle: "How I help you plan a new roof",
    help: [
      "A roof is a system, not just the shingles you see from the street. We’ll talk through the full roof assembly, ventilation and warranty along with the shingle you choose.",
      "That way you can compare the complete scope of the work, and you’ll know what’s included before you make a decision.",
    ],
    optionsTitle: "Roofing we compare",
    options: [
      { name: "GAF Timberline HDZ", text: "A full GAF roof system, with ventilation included." },
      { name: "GAF Timberline UHDZ", text: "A thicker, more dimensional shingle." },
      { name: "Brava synthetic cedar shake", text: "A premium shake look. The Gaithersburg roof pictured on this page used Brava synthetic cedar shake." },
    ],
    credentials: [
      { name: "GAF Master Elite®", text: "Fewer than 2% of roofers qualify. Authorizes the Golden Pledge™ warranty, GAF’s most comprehensive coverage." },
      { name: "GAF President’s Club", text: "The highest honor GAF gives its Master Elite contractors, for quality, professionalism and customer satisfaction." },
      { name: "GAF CARE training", text: "The team completes GAF’s CARE training every year to stay current on products and installation methods." },
    ],
    estimateHref: "/#estimate-roofing",
    ctaLabel: "Request a free roof inspection",
    related: ["gutters", "attic-insulation", "siding"],
  },
  {
    slug: "siding",
    draft: true,
    summary: "Worn siding, repeated maintenance, or a style you’ve outgrown? Explore the possibilities.",
    name: "Siding",
    serviceType: "Siding installation",
    title: "Siding Replacement in the DMV Area | Daniel Exteriors",
    description:
      "Worn siding or constant upkeep? Compare Mastic vinyl, insulated vinyl and James Hardie fiber cement siding with Daniel Refundini. Free estimate in the DMV.",
    h1: "New siding in the DMV, compared side by side",
    intro:
      "Worn siding, repeated maintenance, or a style you’ve outgrown are all good reasons to explore new siding. I’ll help you compare materials, appearance, upkeep and budget, so you can choose the option that fits your home and the way you live in it.",
    image: PROJECT_PHOTOS.siding,
    noticingTitle: "What homeowners usually notice first",
    noticing: [
      "Siding that looks faded, cracked, warped or loose",
      "Painting or repairs that keep coming back",
      "Trim around windows and doors that needs attention",
      "An exterior style you’d like to change",
    ],
    helpTitle: "How I help you choose siding",
    help: [
      "We’ll compare vinyl, insulated vinyl and fiber cement side by side, including how each one looks, how much upkeep it needs, and what the installation includes.",
      "Trim capping around your windows and doors is part of the conversation too, so the finished exterior looks complete.",
    ],
    optionsTitle: "Siding we compare",
    options: [
      { name: "Mastic vinyl siding", text: "Low maintenance, with a wide color range." },
      { name: "Mastic insulated vinyl siding", text: "Added insulation and straighter-looking walls." },
      { name: "James Hardie fiber cement", text: "Fiber cement siding with the look of wood." },
    ],
    credentials: [
      { name: "James Hardie Elite Preferred", text: "James Hardie’s highest contractor tier, awarded to fewer than 2% of contractors." },
      { name: "Mastic Elite Pro", text: "The highest designation from Ply Gem, the #1 maker of vinyl siding in North America." },
      { name: "PEPA Certified", text: "Certified and trained to install vinyl siding that looks great and performs for years." },
    ],
    estimateHref: "/#estimate-siding",
    ctaLabel: "Request a free siding estimate",
    related: ["windows", "gutters", "doors"],
  },
  {
    slug: "doors",
    draft: true,
    summary: "Make your entry feel right again, with a focus on fit, function, and a finish you love.",
    name: "Doors",
    serviceType: "Entry and patio door replacement",
    title: "Entry and Patio Doors in the DMV | Daniel Exteriors",
    description:
      "Make your entry feel right again. Compare ProVia steel and fiberglass entry doors and ProVia patio doors with Daniel Refundini. Free estimate across the DMV.",
    h1: "Entry and patio doors in the DMV, chosen with care",
    intro:
      "Make your entry feel right again, with a focus on fit, function, and a finish you love. Whether it’s a front door that sticks or a patio door you’d like to update, I’ll help you work through the material, glass, hardware and configuration.",
    image: {
      src: "https://images.unsplash.com/photo-1601041597271-71988152f98b?auto=format&fit=crop&w=1600&q=80",
      alt: "Covered porch with a classic entry door",
      width: 1600,
      height: 1067,
    },
    noticingTitle: "What homeowners usually notice first",
    noticing: [
      "A door that sticks, lets in drafts, or doesn’t latch well",
      "A worn finish or tired hardware",
      "A patio door that’s hard to slide or lock",
      "An entry you’d like to brighten with more glass",
    ],
    helpTitle: "How I help you choose a door",
    help: [
      "We’ll talk through the door itself and what surrounds it: sidelights beside the door, a transom above it, the glass in the door and the hardware.",
      "Getting the configuration right is what makes a new door look like it belongs on your home.",
    ],
    optionsTitle: "Doors we compare",
    options: [
      { name: "ProVia steel entry doors", text: "Secure, efficient, and available in many styles." },
      { name: "ProVia fiberglass entry doors", text: "A wood-grain look without the rot." },
      { name: "ProVia patio doors", text: "Sliding or hinged patio doors." },
    ],
    credentials: [
      { name: "AAMA-trained installers", text: "Installers trained and certified through the American Architectural Manufacturers Association." },
      { name: "NFRC-certified products", text: "Every window and door offered is rated for energy performance by the National Fenestration Rating Council." },
    ],
    estimateHref: "/#estimate-doors",
    ctaLabel: "Request a free door estimate",
    related: ["windows", "siding", "decks"],
  },
  {
    slug: "gutters",
    draft: true,
    summary: "Seamless gutters, downspouts and guards, planned together with your roof and siding.",
    name: "Gutters",
    serviceType: "Seamless gutter installation",
    title: "Seamless Gutters and Guards in the DMV | Daniel Exteriors",
    description:
      "Overflowing or sagging gutters? Talk through seamless aluminum gutters, downspouts and gutter guards with Daniel Refundini. Free exterior estimate in the DMV.",
    h1: "Seamless gutters in the DMV, planned with your roof and siding",
    intro:
      "Gutters carry rainwater off your roof and away from your home. When they overflow, sag or pull away from the house, it’s worth a closer look. I’ll help you understand your options and how new gutters fit with the rest of your exterior.",
    noticingTitle: "What homeowners usually notice first",
    noticing: [
      "Gutters that overflow during heavy rain",
      "Sagging sections, or gutters pulling away from the house",
      "Leaves and debris that need clearing often",
      "Downspouts that drain too close to the house",
    ],
    helpTitle: "How I help you plan new gutters",
    help: [
      "Gutters are often part of a larger project, like a new roof or new siding, and it helps to plan them together. We’ll look at the layout of your gutters and downspouts and talk about whether guards make sense for your home.",
      "A recent whole-home project in Columbia, Maryland included new gutters along with siding, windows, a sliding door and trim.",
    ],
    optionsTitle: "Gutter options we compare",
    options: [
      { name: "Seamless aluminum gutters", text: "6-inch seamless gutters and downspouts." },
      { name: "Seamless gutters with guards", text: "Gutter guards to help keep leaves out." },
    ],
    estimateHref: "/#estimate-gutters",
    ctaLabel: "Request a free gutter estimate",
    related: ["roofing", "siding", "attic-insulation"],
  },
  {
    slug: "attic-insulation",
    draft: true,
    summary: "Review the attic along with the roof, and plan insulation and ventilation together.",
    name: "Attic insulation",
    serviceType: "Attic insulation",
    title: "Attic Insulation in Maryland, DC and NoVA | Daniel Exteriors",
    description:
      "Upstairs rooms hard to keep comfortable? Ask Daniel Refundini about attic insulation as part of your exterior plan. Free inspection and estimate in the DMV.",
    h1: "Attic insulation in the DMV, as part of a complete exterior plan",
    intro:
      "The attic sits right under your roof, and it’s part of the shell that keeps your home comfortable. If upstairs rooms are hard to keep comfortable, or you’re already planning roofing work, it makes sense to ask about attic insulation at the same time.",
    noticingTitle: "What homeowners usually notice first",
    noticing: [
      "Upstairs rooms that run hot in summer or cold in winter",
      "Insulation that looks thin, uneven or compressed",
      "Plans for a new roof, when it’s a good time to review the attic too",
      "Questions about how the attic is ventilated",
    ],
    helpTitle: "How I help with attic insulation",
    help: [
      "During the inspection, we can look at the attic along with the roof and talk through what you’re noticing. Insulation and ventilation work together, so we’ll discuss them as part of the same plan rather than as separate decisions.",
      "Every attic is different, so the right approach depends on what we find. I’ll explain the findings in plain language and include any recommended insulation work in your estimate, so you can decide with the full picture.",
    ],
    estimateHref: "/#inspection",
    ctaLabel: "Request a free inspection",
    related: ["roofing", "windows", "gutters"],
  },
  {
    slug: "decks",
    draft: true,
    summary: "Plan a deck or a covered portico that fits with your doors, siding and roofline.",
    name: "Decks",
    serviceType: "Deck and portico construction",
    title: "Decks and Porticos in the DMV Area | Daniel Exteriors",
    description:
      "Planning a new deck or a covered portico? Talk through the space, materials and scope with Daniel Refundini. Free exterior inspection and estimate in the DMV.",
    h1: "Decks and porticos in the DMV, planned with the rest of your exterior",
    intro:
      "A deck or a portico changes how you use and see the outside of your home. If you’re thinking about adding or replacing one, I’ll help you think through the space, the materials, and how it fits with your doors, siding and roofline.",
    noticingTitle: "What homeowners usually tell me",
    noticing: [
      "A deck that looks worn or no longer feels solid underfoot",
      "An entry that would feel more welcoming with a covered portico",
      "A new patio door that will open onto the yard",
      "A wish for more usable outdoor space",
    ],
    helpTitle: "How I help you plan a deck or portico",
    help: [
      "We’ll talk about how you want to use the space, what’s there today, and what the project would include.",
      "If you’re also updating doors, siding or the roof, we can look at how the pieces fit together so the finished exterior feels considered, not pieced together.",
    ],
    estimateHref: "/#inspection",
    ctaLabel: "Request a free inspection",
    related: ["doors", "siding", "roofing"],
  },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s])) as Record<ServiceSlug, ServicePage>;

/** The one service-area page. Cities are named as part of a service area, never as an office location. */
export const MONTGOMERY = {
  slug: "montgomery-county-md",
  draft: true,
  name: "Montgomery County, MD",
  title: "Home Exteriors in Montgomery County, MD | Daniel Exteriors",
  description:
    "Windows, roofing, siding and doors for homeowners in Rockville, Bethesda, Gaithersburg, Silver Spring and Potomac. Free estimate with Daniel Refundini.",
  h1: "Exterior remodeling help for homeowners in Montgomery County, MD",
  intro:
    "Montgomery County is the center of where I work. I help homeowners in Rockville, Bethesda, Gaithersburg, Silver Spring, Potomac and nearby communities understand their options for windows, roofing, siding, doors, gutters, attic insulation and decks.",
  communities: ["Rockville", "Bethesda", "Gaithersburg", "Silver Spring", "Potomac"],
  communitiesNote:
    "These are the communities I focus on, along with other parts of Montgomery County. I also work with homeowners across the DMV, including other parts of Maryland, Washington, DC, and Northern Virginia. Share your ZIP code in the form so we can confirm availability for your location and project.",
  approach: [
    {
      title: "Start with what you’re noticing.",
      text: "You don’t need to know which product to choose. Tell me what you’re seeing at home, whether that’s a draft, a leak, worn siding or a door that sticks, and we’ll work through the solution together.",
    },
    {
      title: "Compare the complete scope.",
      text: "Materials, preparation, installation and finishing details belong in the conversation, not just the price at the bottom.",
    },
    {
      title: "Know who’s behind the work.",
      text: "Your project is through Presidential Exteriors, which holds the manufacturer credentials shown on this site. You can look the company up in the GAF and James Hardie contractor directories.",
    },
  ],
  directories: [
    { label: "GAF contractor directory", href: "https://www.gaf.com/en-us/roofing-contractors/residential/usa/md/rockville/presidential-exteriors-1108926" },
    { label: "James Hardie contractor directory", href: "https://www.jameshardie.com/find-a-contractor/results/presidential-exteriors-rockville/" },
  ],
  project: {
    image: PROJECT_PHOTOS.roof,
    location: "Gaithersburg, Maryland",
    title: "A new roof, beautifully considered.",
    text: "Brava synthetic cedar shake roof replacement.",
    href: "https://presidentialexteriors.com/premium-roof-replacement-gaithersburg-brava-synthetic-cedar-shake/",
  },
};

/** Shared "what happens next" steps. Same wording as the homepage steps, plus the note from the homepage FAQ. */
export const NEXT_STEPS = {
  title: "What happens after you send the form",
  items: [
    { title: "Tell me about your home", text: "Share your contact details, property address, and the projects you have in mind." },
    { title: "We arrange an inspection", text: "We’ll connect to confirm your project details, appointment time, and what you’d like us to look at." },
    { title: "You understand your options", text: "Review the findings, recommended work, and an estimate. Ask the questions that matter to you." },
  ],
  note: "The form sends an inspection request to Daniel. Your appointment is confirmed only after we connect and agree on a time.",
};
