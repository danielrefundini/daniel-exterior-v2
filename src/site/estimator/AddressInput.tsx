"use client";

import { useEffect, useRef, useState } from "react";

/** Chave de navegador do Geoapify (a mesma do site antigo do Daniel). Restrinja as origens no painel do Geoapify. */
const GEOAPIFY_KEY = "43646acac4bf453f989864e7b4d77e76";

/** Campo de endereço com sugestões do mapa (Geoapify), puxando para a região de DC/MD/VA. */
export function AddressInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ctrl = useRef<AbortController | undefined>(undefined);
  const skip = useRef(false);

  useEffect(() => {
    clearTimeout(timer.current);
    ctrl.current?.abort();
    if (skip.current) { skip.current = false; return; }
    const text = value.trim();
    if (text.length < 3) { setItems([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      const c = new AbortController();
      ctrl.current = c;
      try {
        const params = new URLSearchParams({ text, apiKey: GEOAPIFY_KEY, format: "json", limit: "5", filter: "countrycode:us", bias: "proximity:-77.0369,38.9072", lang: "en" });
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`, { signal: c.signal });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { results?: { formatted?: string; result_type?: string; address_line1?: string; address_line2?: string; name?: string }[] };
        // Só endereços (sem nome de empresa na frente); máximo de 5.
        const list = [...new Set((data.results ?? [])
          .map((r) => (r.result_type === "amenity" || r.name ? r.address_line2 ?? "" : r.formatted ?? ""))
          .map((v) => v.replace(/, United States of America$/, ""))
          .filter(Boolean))].slice(0, 5);
        setItems(list);
        setActive(-1);
        setOpen(list.length > 0);
      } catch {
        // Sem sugestões: a pessoa digita o endereço completo normalmente.
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [value]);

  function pick(v: string) {
    skip.current = true;
    onChange(v);
    setOpen(false);
  }

  return (
    <div className="d-addr">
      <input
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => items.length && setOpen(true)}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, items.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
          else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(items[active]); }
          else if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Start typing your address"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="d-addr-list"
      />
      {open && (
        <ul className="d-addr-list" id="d-addr-list" role="listbox">
          {items.map((it, i) => (
            <li key={it} role="option" aria-selected={i === active}>
              <button type="button" className={i === active ? "is-active" : ""} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(it)}>
                {it}
              </button>
            </li>
          ))}
          <li className="d-addr-credit">Suggestions by Geoapify</li>
        </ul>
      )}
    </div>
  );
}
