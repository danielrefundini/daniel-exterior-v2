"use client";

import { CRM } from "../../crm";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, CalendarCheck, Check, ClipboardCheck, DoorOpen, Droplets, HelpCircle, Home, Info,
  Layers, LockKeyhole, Phone, PanelsTopLeft, ShieldCheck, Sparkles,
} from "lucide-react";
import { INITIAL, NATIONAL_SOURCE, POPULAR, PROJECTS, roofAreaOf, sidingAreaOf, REASONS, TIERS, TIMELINES, estimate, money, type Answers, type ProjectKey } from "./pricing";

import { trackLead, utmParams } from "../analytics";
import { readAttribution, useRuntime } from "../motion";
import { AddressInput } from "./AddressInput";
import "./estimator.css";

// Estimador de preço (seção "estimator" dos sites). Começou no site do Daniel (danielrefundini-v2) e veio para o CRM.

type Step = "project" | "size" | "tier" | "details" | "result" | "next" | "schedule" | "contact" | "done";
type NextStep = "inspection" | "call";

const ICONS: Record<ProjectKey, typeof Home> = {
  windows: PanelsTopLeft, roofing: Home, siding: Layers, doors: DoorOpen, gutters: Droplets, unsure: HelpCircle,
};

// Same hours as the Daniel Exteriors CRM calendar (Mon–Fri, 10 AM–7 PM, 1-hour
// appointments), so every pick can be booked there. Change both together.
const SLOTS: Record<NextStep, string[]> = {
  inspection: ["10:00 AM", "1:00 PM", "4:00 PM", "6:00 PM"],
  call: ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM", "6:00 PM"],
};

function nextDays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) days.push(new Date(d)); // weekdays only
  }
  return days;
}

const dayLabel = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const digits = (v: string) => v.replace(/\D/g, "");
function formatPhone(v: string) {
  const d = digits(v).replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * formspree: endereço opcional do Formspree que manda o pedido por e-mail para o dono do site.
 * forwardTo: endereço opcional de outro CRM que recebe uma cópia do pedido (o link de "Website form").
 */
export function Estimator({ formspree, forwardTo }: { formspree?: string; forwardTo?: string }) {
  const rt = useRuntime();
  const [step, setStep] = useState<Step>("project");
  const [a, setA] = useState<Answers>(INITIAL);
  const [next, setNext] = useState<NextStep>("inspection");
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", email: "", address: "", consent: false });
  /** Armadilha para robôs: campo escondido que pessoas não veem. Se vier preenchido, Formspree e CRM descartam o envio. */
  const [gotcha, setGotcha] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  // 5 weekdays always fit in the CRM's 7-day booking window.
  const days = useMemo(() => nextDays(5), []);
  const est = useMemo(() => estimate(a), [a]);
  const unsure = a.project === "unsure";

  // Links como #estimate-windows (nos cards de serviço) abrem o estimador já no produto certo.
  useEffect(() => {
    function fromHash() {
      const m = window.location.hash.match(/^#estimate-(\w+)/);
      if (!m) return;
      const key = m[1] as ProjectKey;
      if (PROJECTS.some((p) => p.key === key)) pickProject(key);
      document.getElementById("inspection")?.scrollIntoView({ behavior: "smooth" });
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function go(s: Step) {
    setError("");
    setStep(s);
    const top = card.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) card.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickProject(key: ProjectKey) {
    setA((cur) => ({ ...cur, project: key, reasons: [], tier: key === "unsure" ? "better" : POPULAR[key] }));
    setError("");
    setStep(key === "unsure" ? "details" : "size");
  }

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((cur) => ({ ...cur, [k]: v }));
  const toggleReason = (r: string) => set("reasons", a.reasons.includes(r) ? a.reasons.filter((x) => x !== r) : [...a.reasons, r]);

  function submitDetails() {
    if (!/^\d{5}$/.test(a.zip)) return setError("Please enter your 5-digit ZIP code.");
    if (!a.timeline) return setError("Please choose when you’d like to start.");
    go(unsure ? "next" : "result");
  }

  function submitSchedule() {
    if (day === null || !time) return setError("Please pick a day and a time.");
    go("contact");
  }

  /** Tudo o que o cliente respondeu, em texto, para o e-mail do Daniel e para o contato no CRM. */
  function summary(): Record<string, string> {
    const proj = PROJECTS.find((p) => p.key === a.project)?.label ?? "";
    const tierInfo = a.project && a.project !== "unsure" ? TIERS[a.project].find((t) => t.key === a.tier) : undefined;
    const size =
      a.project === "windows" ? `${a.windows} windows${a.specialty ? ` (${a.specialty} bay or bow)` : ""}`
      : a.project === "doors" ? `${a.doors} ${a.doors === 1 ? "door" : "doors"}${a.tier !== "best" ? `, sidelights: ${a.sidelights}, transom: ${a.transom ? "yes" : "no"}, glass: ${a.glass}` : ""}`
      : a.project === "roofing" ? (a.roofKnown ? `Roof size given: ${a.roofSqft.toLocaleString()} sq ft` : `Home ${a.homeSqft.toLocaleString()} sq ft, ${a.stories} stories, roof shape: ${a.roofShape} (≈ ${Math.round(roofAreaOf(a)).toLocaleString()} sq ft of roof)`)
      : a.project === "siding" ? `${a.sidingKnown ? `Siding size given: ${a.sidingSqft.toLocaleString()} sq ft` : `Home ${a.homeSqft.toLocaleString()} sq ft, ${a.stories} stories, ${Math.round(a.sidingShare * 100)}% siding (≈ ${Math.round(sidingAreaOf(a)).toLocaleString()} sq ft)`}; ${a.openings} windows and doors for capping`
      : a.project === "gutters" ? `Home ${a.homeSqft.toLocaleString()} sq ft, ${a.stories} stories`
      : "";
    return {
      "Request": next === "inspection" ? "Free in-home inspection" : "15-minute phone call",
      "Appointment": slot,
      "Full name": contact.name.trim(),
      "Phone": contact.phone,
      "Email": contact.email.trim(),
      "Property address": next === "inspection" ? contact.address.trim() : "",
      "ZIP code": a.zip,
      "Project": proj,
      "Option chosen": tierInfo ? `${tierInfo.name}: ${tierInfo.brand}` : "",
      "Size and details": size,
      "What’s going on": a.reasons.join(", "),
      "Timeline": a.timeline,
      "Range shown": est ? `${money(est.low)} – ${money(est.high)} (${est.scope})` : "No range (not sure yet)",
      "Mid-Atlantic avg. shown": est?.national ? money(est.national.value) : "",
      "Consent": "Agreed to be called or texted about this request",
    };
  }

  async function sendRequest() {
    const fields = Object.fromEntries(Object.entries(summary()).filter(([, v]) => v));
    const subject = `New ${next === "inspection" ? "inspection" : "call"} booked: ${fields["Project"] || "exterior project"}, ${slot}`;
    // Formspree em FormData, como o formulário antigo: em JSON o filtro de spam (Formshield) barrava o envio e o e-mail não saía.
    const form = new FormData();
    for (const [k, v] of Object.entries(fields)) form.append(k, v);
    form.append("email", contact.email.trim()); // vira o "responder para" do e-mail
    form.append("_subject", subject);
    // Where the visitor came from (utm_source, utm_medium, ...), so the email can be tied back to a campaign.
    for (const [k, v] of Object.entries(utmParams())) form.append(k, v);
    if (gotcha) form.append("_gotcha", gotcha);
    const email = formspree
      ? fetch(formspree, { method: "POST", body: form, headers: { Accept: "application/json" } }).then((r) => r.ok)
      : Promise.resolve(false);
    const crm = fetch(CRM.leadUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: rt.siteId, page: rt.page ?? "", fields: gotcha ? { ...fields, _hp: gotcha } : fields, attribution: readAttribution() }),
    }).then((r) => r.ok);
    // Cópia para outro CRM, se configurada. Não conta para o sucesso: se esse CRM
    // estiver fora do ar, o cliente não vê erro (o e-mail e este CRM já bastam).
    // text/plain evita a checagem prévia de CORS do navegador; keepalive garante
    // que o envio termina mesmo se a página mudar logo em seguida.
    if (forwardTo) {
      fetch(forwardTo, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(gotcha ? { ...fields, _gotcha: gotcha } : fields),
        keepalive: true,
      }).catch(() => {});
    }
    const results = await Promise.allSettled([email, crm]);
    return results.map((r) => r.status === "fulfilled" && r.value);
  }

  async function submitContact() {
    if (contact.name.trim().length < 2) return setError("Please enter your name.");
    if (digits(contact.phone).length !== 10) return setError("Please enter a 10-digit phone number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) return setError("Please enter a valid email address.");
    if (next === "inspection" && contact.address.trim().length < 6) return setError("Please enter the property address.");
    if (!contact.consent) return setError("Please check the box so Daniel can contact you.");
    // Fora do site publicado (editor e galeria de modelos) nada é enviado.
    if (rt.mode !== "live") return go("done");
    setSending(true);
    setError("");
    // Envia para o Formspree (e-mail para o Daniel) e para o CRM (vira contato). Basta um dar certo.
    const [emailOk, crmOk] = await sendRequest();
    setSending(false);
    if (!emailOk && !crmOk) return setError("Something went wrong. Please try again, or email Daniel at danielrefundini.exteriors@gmail.com.");
    trackLead({ project: a.project ?? undefined, request: next });
    go("done");
  }

  const totalSteps = unsure ? 5 : 8;
  const order: Step[] = unsure
    ? ["project", "details", "next", "schedule", "contact"]
    : ["project", "size", "tier", "details", "result", "next", "schedule", "contact"];
  const position = Math.max(0, order.indexOf(step));
  const back = position > 0 ? order[position - 1] : null;
  const slot = day !== null ? `${dayLabel(days[day])} at ${time}` : "";

  return (
    <div className="d-est" ref={card}>
      {step !== "done" && (
        <div className="d-est-top">
          {back ? (
            <button type="button" className="d-est-back" onClick={() => go(back)}>
              <ArrowLeft size={15} /> Back
            </button>
          ) : <span className="d-est-kicker"><Sparkles size={14} /> 60-second price check</span>}
          <span className="d-est-count">Step {position + 1} of {totalSteps}</span>
        </div>
      )}
      {step !== "done" && <div className="d-est-bar"><span style={{ width: `${((position + 1) / totalSteps) * 100}%` }} /></div>}

      {step === "project" && (
        <>
          <h3 className="d-est-q">What would you like to price?</h3>
          <p className="d-est-sub">See a price range for your home in about a minute.</p>
          <div className="d-est-tiles">
            {PROJECTS.map((p) => {
              const Icon = ICONS[p.key];
              return (
                <button type="button" key={p.key} className={`d-est-tile ${a.project === p.key ? "on" : ""}`} onClick={() => pickProject(p.key)}>
                  <Icon size={22} />
                  <strong>{p.label}</strong>
                  <small>{p.hint}</small>
                </button>
              );
            })}
          </div>
        </>
      )}

      {step === "size" && a.project && (
        <>
          <h3 className="d-est-q">{a.project === "windows" ? "How many windows?" : a.project === "doors" ? "How many doors?" : "Tell me about the house."}</h3>
          <p className="d-est-sub">A good guess is fine. We measure everything at the inspection.</p>
          {a.project === "windows" && (
            <>
              <Counter label="Windows to replace" value={a.windows} min={1} max={60} onChange={(v) => setA({ ...a, windows: v, specialty: Math.min(a.specialty, v) })} />
              <Counter label="Bay or bow windows (included above)" value={a.specialty} min={0} max={Math.min(6, a.windows)} onChange={(v) => set("specialty", v)} />
            </>
          )}
          {a.project === "doors" && <Counter label="Doors to replace" value={a.doors} min={1} max={8} onChange={(v) => set("doors", v)} />}
          {a.project === "siding" && (
            <Chips
              label="How should we size your siding?"
              options={["siding", "home"]}
              names={{ siding: "I know my siding size", home: "Estimate from my home size" }}
              value={a.sidingKnown ? "siding" : "home"}
              onChange={(v) => set("sidingKnown", v === "siding")}
            />
          )}
          {a.project === "siding" && a.sidingKnown && (
            <label className="d-field">
              <span>Siding size (square feet of wall)</span>
              <input type="range" min={500} max={8000} step={50} value={a.sidingSqft} onChange={(e) => set("sidingSqft", Number(e.target.value))} className="d-est-range" />
              <output className="d-est-out">{a.sidingSqft.toLocaleString()} sq ft of siding</output>
              <small className="d-est-hint">That’s {Math.round(a.sidingSqft / 100)} squares. Check an old siding proposal if you have one.</small>
            </label>
          )}
          {a.project === "roofing" && (
            <Chips
              label="How should we size your roof?"
              options={["home", "roof"]}
              names={{ home: "Use my home size", roof: "I know my roof size" }}
              value={a.roofKnown ? "roof" : "home"}
              onChange={(v) => set("roofKnown", v === "roof")}
            />
          )}
          {a.project === "roofing" && a.roofKnown && (
            <label className="d-field">
              <span>Roof size (square feet)</span>
              <input type="range" min={500} max={8000} step={50} value={a.roofSqft} onChange={(e) => set("roofSqft", Number(e.target.value))} className="d-est-range" />
              <output className="d-est-out">{a.roofSqft.toLocaleString()} sq ft of roof</output>
              <small className="d-est-hint">That’s {Math.round(a.roofSqft / 100)} squares. Check an old roofing proposal or insurance report if you have one.</small>
            </label>
          )}
          {((a.project === "siding" && !a.sidingKnown) || a.project === "gutters" || (a.project === "roofing" && !a.roofKnown)) && (
            <>
              <label className="d-field">
                <span>Home size (living space, all floors)</span>
                <input type="range" min={800} max={6000} step={100} value={a.homeSqft} onChange={(e) => set("homeSqft", Number(e.target.value))} className="d-est-range" />
                <output className="d-est-out">{a.homeSqft.toLocaleString()} sq ft</output>
              </label>
              <Chips label="Stories" options={["1", "2", "3"]} value={String(a.stories)} onChange={(v) => set("stories", Number(v) as 1 | 2 | 3)} />
              {a.project === "roofing" && (
                <Chips
                  label="Roof shape"
                  options={["simple", "some", "complex"]}
                  names={{ simple: "Simple", some: "A few peaks", complex: "Many peaks and valleys" }}
                  value={a.roofShape}
                  onChange={(v) => set("roofShape", v as Answers["roofShape"])}
                />
              )}
              {a.project === "roofing" && (
                <p className="d-est-derived">
                  ≈ <strong>{(Math.round(roofAreaOf(a) / 50) * 50).toLocaleString()} sq ft of roof</strong>. A {a.stories}-story home’s roof covers one floor, plus slope and overhangs.
                </p>
              )}
              {a.project === "siding" && (
                <Chips
                  label="How much of the outside is siding?"
                  options={["1", "0.75", "0.5", "0.25"]}
                  names={{ "1": "All of it", "0.75": "About 3/4", "0.5": "About half", "0.25": "About 1/4" }}
                  value={String(a.sidingShare)}
                  onChange={(v) => set("sidingShare", Number(v))}
                />
              )}
              {a.project === "siding" && (
                <p className="d-est-derived">
                  ≈ <strong>{(Math.round(sidingAreaOf(a) / 50) * 50).toLocaleString()} sq ft of siding</strong>. Measured around the outside walls of a {a.stories}-story home, including the gable ends{a.sidingShare < 1 ? ", minus the brick or stone" : ""}.
                </p>
              )}
            </>
          )}
          {a.project === "siding" && (
            <Counter label="Windows and doors on the house (for trim capping)" value={a.openings} min={0} max={60} onChange={(v) => set("openings", v)} />
          )}
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={() => go("tier")}>Continue <ArrowRight size={17} /></button>
        </>
      )}

      {step === "tier" && a.project && a.project !== "unsure" && (
        <>
          <h3 className="d-est-q">Which level fits what you want?</h3>
          <p className="d-est-sub">Not sure? Start with the most chosen. We’ll compare all the options in person.</p>
          <div className="d-est-tiers">
            {TIERS[a.project].map((t) => (
              <button type="button" key={t.key} className={`d-est-tier ${a.tier === t.key ? "on" : ""}`} onClick={() => set("tier", t.key)}>
                <span className="d-est-tier-name">{t.name}{t.key === POPULAR[a.project as Exclude<ProjectKey, "unsure">] && <em>Most chosen</em>}</span>
                <strong>{t.brand}</strong>
                <small>{t.note}</small>
                {a.tier === t.key && <Check size={18} className="d-est-tick" />}
              </button>
            ))}
          </div>
          {a.project === "doors" && a.tier !== "best" && (
            <>
              <Chips label="Sidelights (glass panels beside the door)" options={["0", "1", "2"]} names={{ "0": "None", "1": "One", "2": "Two" }} value={String(a.sidelights)} onChange={(v) => set("sidelights", Number(v) as 0 | 1 | 2)} />
              <Chips label="Transom (glass above the door)" options={["no", "yes"]} names={{ no: "No", yes: "Yes" }} value={a.transom ? "yes" : "no"} onChange={(v) => set("transom", v === "yes")} />
              <Chips label="Glass in the door" options={["none", "standard", "decorative"]} names={{ none: "Solid, no glass", standard: "Standard glass", decorative: "Decorative glass" }} value={a.glass} onChange={(v) => set("glass", v as Answers["glass"])} />
            </>
          )}
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={() => go("details")}>Continue <ArrowRight size={17} /></button>
        </>
      )}

      {step === "details" && a.project && (
        <>
          <h3 className="d-est-q">{unsure ? "What are you noticing?" : "Last thing before your price."}</h3>
          <p className="d-est-sub">This helps Daniel come prepared.</p>
          <fieldset className="d-checks">
            <legend>What’s going on? <span>Select all that apply.</span></legend>
            <div className="d-est-chips">
              {REASONS[a.project].map((r) => (
                <button type="button" key={r} className={`d-est-chip ${a.reasons.includes(r) ? "on" : ""}`} onClick={() => toggleReason(r)}>{r}</button>
              ))}
            </div>
          </fieldset>
          <Chips label="When would you like to start?" options={TIMELINES} value={a.timeline} onChange={(v) => set("timeline", v)} />
          <label className="d-field">
            <span>Project ZIP code</span>
            <input inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="e.g. 20850" value={a.zip} onChange={(e) => set("zip", digits(e.target.value).slice(0, 5))} />
          </label>
          {error && <p className="d-form-error" role="alert">{error}</p>}
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={submitDetails}>
            {unsure ? "Continue" : "See my price range"} <ArrowRight size={17} />
          </button>
          <p className="d-est-lock"><LockKeyhole size={13} /> No name or phone needed to see your range.</p>
        </>
      )}

      {step === "result" && est && (
        <>
          <p className="d-est-kicker"><Sparkles size={14} /> Your estimated range</p>
          <div className="d-est-price"><span>{money(est.low)}</span><i>to</i><span>{money(est.high)}</span></div>
          <p className="d-est-scope">{est.scope} · ZIP {a.zip}</p>
          {est.national && <NationalCompare low={est.low} high={est.high} national={est.national.value} label={est.national.label} why={est.national.why} addOn={est.national.addOn} />}
          <div className="d-est-box">
            <p className="d-est-box-title"><Check size={16} /> Usually included</p>
            <ul>{est.included.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="d-est-box-title"><Info size={16} /> What can move the price</p>
            <ul>{est.movers.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <p className="d-est-fine">A planning range for typical projects like yours in the DMV, not a quote. Your exact price comes from a free inspection. Ask about financing options.</p>
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={() => go("next")}>Get my exact price <ArrowRight size={17} /></button>
        </>
      )}

      {step === "next" && (
        <>
          <h3 className="d-est-q">{unsure ? "No problem. That’s what the inspection is for." : "How would you like to get your exact price?"}</h3>
          <p className="d-est-sub">Free, no pressure. Pick what’s easiest for you.</p>
          <div className="d-est-options">
            <Option on={next === "inspection"} onClick={() => setNext("inspection")} icon={<ClipboardCheck size={22} />} title="Free in-home inspection" badge="Recommended" text="Daniel measures, inspects and gives you an exact written price. About 60–90 minutes." />
            <Option on={next === "call"} onClick={() => setNext("call")} icon={<Phone size={22} />} title="15-minute phone call" text="Talk through your range and options first. Book the visit later if it makes sense." />
          </div>
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={() => go("schedule")}>
            Pick a time <ArrowRight size={17} />
          </button>
        </>
      )}

      {step === "schedule" && (
        <>
          <h3 className="d-est-q">{next === "inspection" ? "When can Daniel come by?" : "When should Daniel call?"}</h3>
          <p className="d-est-sub">Pick a time that works. Daniel will confirm it with you.</p>
          <div className="d-est-days">
            {days.map((d, i) => (
              <button type="button" key={d.toISOString()} className={`d-est-day ${day === i ? "on" : ""}`} onClick={() => { setDay(i); setTime(""); }}>
                <small>{d.toLocaleDateString("en-US", { weekday: "short" })}</small>
                <strong>{d.getDate()}</strong>
                <small>{d.toLocaleDateString("en-US", { month: "short" })}</small>
              </button>
            ))}
          </div>
          {day !== null && (
            <div className="d-est-times">
              {SLOTS[next].map((t) => (
                <button type="button" key={t} className={`d-est-chip ${time === t ? "on" : ""}`} onClick={() => setTime(t)}>{t}</button>
              ))}
            </div>
          )}
          {error && <p className="d-form-error" role="alert">{error}</p>}
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={submitSchedule}>Continue <ArrowRight size={17} /></button>
        </>
      )}

      {step === "contact" && (
        <>
          <h3 className="d-est-q">Almost done. Who should Daniel ask for?</h3>
          {slot && <p className="d-est-slot"><CalendarCheck size={16} /> {next === "inspection" ? "Inspection" : "Phone call"} · {slot}</p>}
          <div className="s-form d-est-form">
            <label className="d-field"><span>Full name</span><input autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your name" /></label>
            <label className="d-field"><span>Mobile phone</span><input type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: formatPhone(e.target.value) })} placeholder="(301) 555-0123" /></label>
            <label className="d-field"><span>Email</span><input type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@email.com" /></label>
            {next === "inspection" && <div className="d-field"><span>Property address</span><AddressInput value={contact.address} onChange={(v) => setContact((c) => ({ ...c, address: v }))} /></div>}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" value={gotcha} onChange={(e) => setGotcha(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
            <label className="d-consent">
              <input type="checkbox" checked={contact.consent} onChange={(e) => setContact({ ...contact, consent: e.target.checked })} />
              <span>I agree that Daniel Refundini or Presidential Exteriors may call or text me about this request. Consent isn’t required to buy.</span>
            </label>
          </div>
          {error && <p className="d-form-error" role="alert">{error}</p>}
          <button type="button" className="s-btn s-btn-primary s-btn-block s-btn-lg" onClick={submitContact} disabled={sending}>
            {sending ? "Sending…" : next === "inspection" ? "Request my free inspection" : "Request my call"} <ArrowRight size={17} />
          </button>
          <p className="d-est-lock"><ShieldCheck size={13} /> Your details go only to Daniel. Never sold or shared.</p>
        </>
      )}

      {step === "done" && (
        <div className="d-est-done">
          <span className="d-est-done-mark"><Check size={26} /></span>
          <h3 className="d-est-q">{next === "inspection" ? "Your inspection request is in." : "Your call request is in."}</h3>
          <p className="d-est-sub">
            {`Thanks, ${contact.name.split(" ")[0]}. Daniel will reach out to confirm a time.`}
          </p>
          <div className="d-est-ticket">
            {slot && <p><CalendarCheck size={16} /> <strong>{slot}</strong></p>}
            {est && <p><span>Estimated range</span><strong>{money(est.low)} – {money(est.high)}</strong></p>}
            {est && <small>{est.scope}</small>}
          </div>
          {next === "inspection" && (
            <ul className="d-est-prep">
              <li>Daniel arrives with samples so you can see and touch the options.</li>
              <li>You get an exact written price before he leaves.</li>
            </ul>
          )}
          <button type="button" className="s-btn s-btn-outline s-btn-block" onClick={() => { setA(INITIAL); setDay(null); setTime(""); setStep("project"); }}>Start over</button>
        </div>
      )}
    </div>
  );
}

/** Faixa do Daniel vs. média nacional (Cost vs. Value) numa régua só. */
function NationalCompare({ low, high, national, label, why, addOn }: { low: number; high: number; national: number; label: string; why?: string; addOn?: { short: string; label: string; value: number; base: number; note?: string } }) {
  const min = Math.min(low, national) * 0.85;
  const max = Math.max(high, national) * 1.08;
  const pos = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div className="d-est-nat">
      <div className="d-est-nat-track">
        <span className="d-est-nat-range" style={{ left: pos(low), width: `calc(${pos(high)} - ${pos(low)})` }} />
        <span className="d-est-nat-mark" style={{ left: pos(national) }} />
      </div>
      <div className="d-est-nat-legend">
        <span><i className="d-est-nat-dot gold" /> Your estimated range</span>
        <span><i className="d-est-nat-dot navy" /> {NATIONAL_SOURCE.short}{addOn ? ` + ${addOn.short}` : ""} <strong>{money(national)}</strong></span>
      </div>
      {why && <p className="d-est-nat-why">{why}</p>}
      <p className="d-est-nat-note">
        {addOn ? (
          <>Average cost of {label} in the Mid-Atlantic region, {money(addOn.base)}, from the{" "}
          <a href={NATIONAL_SOURCE.href} target="_blank" rel="noreferrer">2025 Cost vs. Value Report</a>, plus {addOn.label}, {money(addOn.value)}.{addOn.note ? ` ${addOn.note}` : ""}</>
        ) : (
          <>Average cost of {label} in the Mid-Atlantic region, from the{" "}
          <a href={NATIONAL_SOURCE.href} target="_blank" rel="noreferrer">2025 Cost vs. Value Report</a>.</>
        )}
      </p>
    </div>
  );
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="d-field">
      <span>{label}</span>
      <div className="d-est-counter">
        <button type="button" aria-label={`Fewer: ${label}`} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <output>{value}</output>
        <button type="button" aria-label={`More: ${label}`} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

function Chips({ label, options, value, onChange, names }: { label: string; options: string[]; value: string; onChange: (v: string) => void; names?: Record<string, string> }) {
  return (
    <fieldset className="d-checks">
      <legend>{label}</legend>
      <div className="d-est-chips">
        {options.map((o) => (
          <button type="button" key={o} className={`d-est-chip ${value === o ? "on" : ""}`} onClick={() => onChange(o)}>{names?.[o] ?? o}</button>
        ))}
      </div>
    </fieldset>
  );
}

function Option({ on, onClick, icon, title, text, badge }: { on: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string; badge?: string }) {
  return (
    <button type="button" className={`d-est-option ${on ? "on" : ""}`} onClick={onClick}>
      <span className="d-est-option-icon">{icon}</span>
      <span>
        <strong>{title}{badge && <em>{badge}</em>}</strong>
        <small>{text}</small>
      </span>
      {on && <Check size={18} className="d-est-tick" />}
    </button>
  );
}
