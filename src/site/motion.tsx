"use client";

import { CRM } from "../crm";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// Peças interativas dos sites. Tudo respeita "reduzir movimento" do sistema via CSS (site.css).

/**
 * Onde o site está rodando:
 * - demo: galeria de modelos (formulários só simulam o envio)
 * - editor: prévia dentro do editor (formulários não enviam nada)
 * - live: site publicado (formulários criam o contato no CRM)
 */
export type SiteRuntime = { mode: "demo" | "editor" | "live"; siteId?: string; page?: string };
const RuntimeContext = createContext<SiteRuntime>({ mode: "demo" });
export function SiteRuntimeProvider({ value, children }: { value: SiteRuntime; children: React.ReactNode }) {
  useEffect(() => {
    if (value.mode === "live") captureAttribution();
  }, [value.mode]);
  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}

// De onde veio o visitante (primeira página da visita): UTMs, cliques de anúncio e site de origem.
// A mesma chave é usada pelo /widget.js do chat.
const ATTR_KEY = "nl_attr";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const attr: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) attr[k] = v;
    }
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) attr.referrer = document.referrer;
    attr.landing = window.location.href;
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {}
}

export function readAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}
export const useRuntime = () => useContext(RuntimeContext);

/** Lê os campos do formulário (o nome de cada campo é o rótulo que o visitante vê). */
function formValues(form: HTMLFormElement) {
  const data: Record<string, string> = {};
  new FormData(form).forEach((v, k) => {
    if (typeof v === "string") data[k] = v.trim();
  });
  return data;
}

/** Envia o lead do site publicado para o CRM. */
async function sendLead(rt: SiteRuntime, fields: Record<string, string>, answers?: { q: string; a: string }[]) {
  const res = await fetch(CRM.leadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteId: rt.siteId, page: rt.page ?? "", fields, answers, attribution: readAttribution() }),
  });
  if (!res.ok) throw new Error(String(res.status));
}

/** Campo invisível: pessoas não preenchem, robôs sim. */
const Honeypot = () => (
  <input name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
);

type SendState = "idle" | "sending" | "error";

/** Faz o conteúdo surgir suavemente quando entra na tela. */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`s-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Número que conta até o valor final quando aparece. */
export function Counter({ value, prefix = "", suffix = "", decimals: fixed }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(value);
      const start = performance.now();
      const duration = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        setN(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const decimals = fixed ?? (String(value).split(".")[1] ?? "").length; // 5.0 com decimals=1 mostra "5.0"
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Comparador antes/depois arrastável (mouse, toque e teclado). */
export function BeforeAfter({ before, after, beforeAlt, afterAlt }: { before: string; after: string; beforeAlt: string; afterAlt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="s-ba">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterAlt} className="s-ba-img" draggable={false} />
      <div className="s-ba-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeAlt} className="s-ba-img" draggable={false} />
      </div>
      <span className="s-ba-label s-ba-label-l">Before</span>
      <span className="s-ba-label s-ba-label-r">After</span>
      <div className="s-ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
        <span>⟷</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="s-ba-range"
        aria-label="Drag to compare before and after"
      />
    </div>
  );
}

/** Cabeçalho que ganha sombra e encolhe ao rolar a página. */
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <header className={`s-header ${scrolled ? "is-scrolled" : ""}`}>{children}</header>;
}

/** Pergunta frequente que abre e fecha com animação de altura. */
export function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`s-faq-item ${open ? "is-open" : ""}`}>
      <button className="s-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className="s-faq-icon" aria-hidden="true">+</span>
      </button>
      <div className="s-faq-a">
        <div>
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

/** Formulário de demonstração. Na etapa seguinte ele cria o contato no CRM. */
export function DemoForm({ fields, button, note, next }: { fields: string[]; button: string; note?: string; next?: string }) {
  const rt = useRuntime();
  const [sent, setSent] = useState(false);
  const [state, setState] = useState<SendState>("idle");
  if (sent) {
    return (
      <div className="s-form-done">
        <strong>Thanks! We&apos;ll be in touch shortly.</strong>
        {rt.mode === "demo" && <span>(Template preview: on the live site, this form creates the contact in the CRM.)</span>}
      </div>
    );
  }
  return (
    <form
      className="s-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (rt.mode === "editor") return;
        if (rt.mode === "live") {
          setState("sending");
          try {
            await sendLead(rt, formValues(e.currentTarget));
          } catch {
            setState("error");
            return;
          }
        }
        if (next) window.location.assign(next);
        else setSent(true);
      }}
    >
      {fields.map((f) => (
        <input key={f} name={f} required placeholder={f} aria-label={f} type={inputType(f)} />
      ))}
      <Honeypot />
      <button type="submit" className="s-btn s-btn-primary s-btn-block" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : button}
      </button>
      {state === "error" && <p className="s-form-error" role="alert">Something went wrong. Please try again.</p>}
      {note && <p className="s-form-note">{note}</p>}
    </form>
  );
}

function inputType(f: string) {
  return /email/i.test(f) ? "email" : /phone/i.test(f) ? "tel" : "text";
}

/** Quiz em etapas: uma pergunta por tela, barra de progresso, depois o contato. */
export function Quiz({
  questions,
  contact,
  next,
  storageKey,
}: {
  questions: { q: string; options: { label: string; icon?: string }[] }[];
  contact: { title: string; fields: string[]; button: string; note?: string };
  next: string;
  storageKey: string;
}) {
  const rt = useRuntime();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [state, setState] = useState<SendState>("idle");
  const total = questions.length + 1;
  const onContact = step === questions.length;

  function choose(label: string) {
    const a = [...answers.slice(0, step), label];
    setAnswers(a);
    setStep(step + 1);
  }

  return (
    <div className="s-quiz">
      <div className="s-quiz-progress" aria-hidden="true">
        <span style={{ width: `${((step + (onContact ? 0.5 : 0)) / total) * 100 + 100 / total / 2}%` }} />
      </div>
      <p className="s-quiz-count">
        {onContact ? "Last step" : `Question ${step + 1} of ${questions.length}`}
      </p>
      <div key={step} className="s-quiz-step">
        {!onContact ? (
          <>
            <h3 className="s-h3 s-quiz-q">{questions[step].q}</h3>
            <div className="s-quiz-options">
              {questions[step].options.map((o) => (
                <button key={o.label} type="button" className={`s-quiz-option ${answers[step] === o.label ? "is-picked" : ""}`} onClick={() => choose(o.label)}>
                  {o.icon && <span className="s-quiz-emoji" aria-hidden="true">{o.icon}</span>}
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <form
            className="s-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (rt.mode === "editor") return;
              if (rt.mode === "live") {
                setState("sending");
                try {
                  await sendLead(rt, formValues(e.currentTarget), questions.map((q, i) => ({ q: q.q, a: answers[i] ?? "" })));
                } catch {
                  setState("error");
                  return;
                }
              }
              try {
                sessionStorage.setItem(storageKey, JSON.stringify(answers));
              } catch {}
              window.location.assign(next);
            }}
          >
            <h3 className="s-h3 s-quiz-q">{contact.title}</h3>
            {contact.fields.map((f) => (
              <input key={f} name={f} required placeholder={f} aria-label={f} type={inputType(f)} />
            ))}
            <Honeypot />
            <button type="submit" className="s-btn s-btn-primary s-btn-block" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : contact.button}
            </button>
            {state === "error" && <p className="s-form-error" role="alert">Something went wrong. Please try again.</p>}
            {contact.note && <p className="s-form-note">{contact.note}</p>}
          </form>
        )}
      </div>
      {step > 0 && (
        <button type="button" className="s-quiz-back" onClick={() => setStep(step - 1)}>
          ← Back
        </button>
      )}
    </div>
  );
}

type QuizOutcome = { title: string; text: string; estimate?: string };

/** Resultado do quiz, escolhido pela resposta de uma das perguntas (guardada na sessão). */
export function QuizResultView({
  storageKey,
  basedOn,
  results,
  fallback,
  children,
}: {
  storageKey: string;
  basedOn: number;
  results: (QuizOutcome & { match: string })[];
  fallback: QuizOutcome;
  children?: React.ReactNode;
}) {
  const [outcome, setOutcome] = useState<QuizOutcome>(fallback);
  useEffect(() => {
    try {
      const answers = JSON.parse(sessionStorage.getItem(storageKey) ?? "[]") as string[];
      const hit = results.find((r) => r.match === answers[basedOn]);
      if (hit) setOutcome(hit);
    } catch {}
  }, [storageKey, basedOn, results]);
  return (
    <div className="s-result">
      <p className="s-eyebrow">Your result</p>
      <h1 className="s-h1 s-result-title">{outcome.title}</h1>
      {outcome.estimate && <p className="s-result-estimate">{outcome.estimate}</p>}
      <p className="s-lead">{outcome.text}</p>
      {children}
    </div>
  );
}

/** Checkout de demonstração: sem campos de cartão. O pagamento real entra com o Stripe. */
export function DemoCheckout({ fields, button, next, note }: { fields: string[]; button: string; next: string; note?: string }) {
  const rt = useRuntime();
  const [state, setState] = useState<SendState>("idle");
  return (
    <form
      className="s-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (rt.mode === "editor") return;
        if (rt.mode === "live") {
          setState("sending");
          try {
            await sendLead(rt, formValues(e.currentTarget));
          } catch {
            setState("error");
            return;
          }
        }
        window.location.assign(next);
      }}
    >
      {fields.map((f) => (
        <input key={f} name={f} required placeholder={f} aria-label={f} type={inputType(f)} />
      ))}
      <Honeypot />
      <button type="submit" className="s-btn s-btn-primary s-btn-block s-btn-lg" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : button}
      </button>
      {state === "error" && <p className="s-form-error" role="alert">Something went wrong. Please try again.</p>}
      {rt.mode === "live" ? (
        // Sem Stripe ainda: o site publicado reserva o pedido e a equipe combina o pagamento.
        <p className="s-form-note">We&apos;ll contact you to confirm your order and arrange payment. No card details are collected here.</p>
      ) : (
        <>
          <p className="s-form-note">🔒 {note ?? "Secure checkout powered by Stripe."}</p>
          <p className="s-demo-note">Template preview: real payments are not connected yet. No card details are collected here.</p>
        </>
      )}
    </form>
  );
}

/** Formulário completo de orçamento: campos, caixas de produtos, detalhes e consentimento para ligação. */
export function LeadForm({
  fields,
  options,
  optionsLabel,
  detailsLabel,
  consent,
  button,
  note,
}: {
  fields: string[];
  options?: string[];
  optionsLabel?: string;
  detailsLabel?: string;
  consent?: string;
  button: string;
  note?: string;
}) {
  const rt = useRuntime();
  const [sent, setSent] = useState(false);
  const [state, setState] = useState<SendState>("idle");

  if (sent) {
    return (
      <div className="s-form-done">
        <strong>Thank you. Your request is in.</strong>
        <span>We&apos;ll call you to confirm the details and a time that works for you.</span>
      </div>
    );
  }
  return (
    <form
      className="s-form s-lead-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (rt.mode === "editor") return;
        const form = e.currentTarget;
        const data = new FormData(form);
        const values = formValues(form);
        // Várias caixas marcadas viram uma linha só ("Windows, Roofing").
        delete values.__options;
        const picked = data.getAll("__options").map(String);
        if (picked.length) values[optionsLabel || "Interested in"] = picked.join(", ");
        if (values.__consent) values.Consent = consent || "Agreed to be contacted";
        delete values.__consent;
        if (rt.mode === "live") {
          setState("sending");
          try {
            await sendLead(rt, values);
          } catch {
            setState("error");
            return;
          }
        }
        setSent(true);
      }}
    >
      <div className="s-lead-grid">
        {fields.map((f) => (
          <label key={f} className="s-field">
            <span>{f}</span>
            <input name={f} required placeholder={f} type={inputType(f)} />
          </label>
        ))}
      </div>
      {options && options.length > 0 && (
        <fieldset className="s-options">
          <legend>{optionsLabel || "What would you like us to look at?"} <span>Select all that apply.</span></legend>
          <div className="s-option-grid">
            {options.map((o) => (
              <label key={o} className="s-option">
                <input type="checkbox" name="__options" value={o} />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {detailsLabel && (
        <label className="s-field">
          <span>{detailsLabel}</span>
          <textarea name={detailsLabel} rows={3} maxLength={2000} />
        </label>
      )}
      <Honeypot />
      {consent && (
        <label className="s-consent">
          <input type="checkbox" name="__consent" value="yes" required />
          <span>{consent}</span>
        </label>
      )}
      <button type="submit" className="s-btn s-btn-primary s-btn-block s-btn-lg" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : button}
      </button>
      {state === "error" && <p className="s-form-error" role="alert">Something went wrong. Please try again or call us.</p>}
      {note && <p className="s-form-note">{note}</p>}
    </form>
  );
}
