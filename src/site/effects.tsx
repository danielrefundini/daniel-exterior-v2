"use client";

import { useEffect, useRef, useState } from "react";

// Efeitos de movimento dos sites (vindos do site do Daniel). Todos desligam com "reduzir movimento" do sistema.

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Barra fina no topo que mostra quanto da página já foi lida. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="s-progress" aria-hidden="true" />;
}

/** Move o conteúdo mais devagar que a rolagem (efeito de profundidade). */
export function Parallax({ children, speed = 0.12, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return <div ref={ref} className={`s-parallax ${className}`}>{children}</div>;
}

/** Inclina o cartão em 3D seguindo o mouse, com um brilho que acompanha o cursor. */
export function Tilt({ children, max = 6, className = "" }: { children: React.ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    el.classList.add("is-tilting");
  }
  function leave() {
    const el = ref.current!;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.classList.remove("is-tilting");
  }
  return (
    <div ref={ref} className={`s-tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}

/** Destaca uma palavra da lista por vez, em ciclo. */
export function WordCycle({ words, interval = 1800 }: { words: string[]; interval?: number }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    const id = setInterval(() => setActive((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <>
      {words.map((w, i) => (
        <span key={w} className={`s-cycle-word ${i === active ? "is-active" : ""}`}>
          {w}
          {i < words.length - 1 && <span className="s-cycle-dot"> · </span>}
        </span>
      ))}
    </>
  );
}

/** Botão que é levemente "puxado" na direção do cursor. */
export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  function move(e: React.PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }
  function leave() {
    ref.current!.style.transform = "";
  }
  return (
    <span ref={ref} className="s-magnetic" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  );
}

/** Faixa que rola sem parar (a lista é duplicada para o loop não ter emenda). */
export function Marquee({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="s-ticker" aria-hidden="true">
      <div className="s-ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="s-ticker-item">{item}</span>
        ))}
      </div>
    </div>
  );
}
