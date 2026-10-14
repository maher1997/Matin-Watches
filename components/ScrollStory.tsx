"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";

type Stop = { s: number; r: number; hx: number; hy: number; fx: number; fy: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Apple-style "closer look": the watch stays pinned on screen and, as you
// scroll, a camera glides in to each part (screen, GPS, battery...) while its
// note slides in beside it, then pulls back out to the whole watch. Scroll
// sets the target; each frame eases toward it so the movement stays smooth.
export default function ScrollStory({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const watchRef = useRef<HTMLDivElement>(null);
  const callouts = product.callouts ?? [];
  const src = product.images[0];
  const n = callouts.length;

  useEffect(() => {
    const el = ref.current;
    const watch = watchRef.current;
    if (!el || !watch) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("story-static");
      return;
    }
    const notes = [...el.querySelectorAll<HTMLElement>("[data-stop]")];
    const spots = [...el.querySelectorAll<HTMLElement>(".story-spot")];
    let raf = 0;
    let active = -1;
    const cur: Stop = { s: 0.92, r: -8, hx: 0.5, hy: 0.5, fx: 0, fy: 0 };
    let p = 0;

    const stops = (): Stop[] => {
      const w = el.clientWidth;
      const h = innerHeight;
      const phone = w < 860;
      const intro = { s: phone ? 0.95 : 1.05, r: -8, hx: 0.5, hy: 0.5, fx: 0, fy: phone ? -0.06 * h : 0 };
      const parts = callouts.map((c) => ({
        s: (c.zoom ?? 2) * (phone ? 0.9 : 0.85),
        r: 0,
        hx: c.at?.[0] ?? 0.5,
        hy: c.at?.[1] ?? 0.5,
        fx: phone ? 0 : -0.22 * w,
        fy: phone ? -0.12 * h : 0,
      }));
      return [intro, ...parts, { s: 1, r: 0, hx: 0.5, hy: 0.5, fx: 0, fy: phone ? -0.06 * h : 0 }];
    };
    let list = stops();

    const target = (): [Stop, number] => {
      // A short hold on the intro, then one slice of scroll per stop.
      const t = clamp(p * (n + 1.5) - 0.25, 0, n + 1);
      const k = Math.min(n, Math.floor(t));
      const e = ease(clamp((t - k) / 0.6, 0, 1));
      const a = list[k];
      const b = list[k + 1] ?? a;
      const mix = {} as Stop;
      for (const key of Object.keys(a) as (keyof Stop)[]) mix[key] = a[key] + (b[key] - a[key]) * e;
      return [mix, e > 0.5 ? k + 1 : k];
    };

    const frame = () => {
      raf = 0;
      const [t, stop] = target();
      let moving = false;
      for (const key of Object.keys(cur) as (keyof Stop)[]) {
        const d = t[key] - cur[key];
        cur[key] = Math.abs(d) < 0.0005 ? t[key] : cur[key] + d * 0.14;
        if (cur[key] !== t[key]) moving = true;
      }
      // Move the watch so the chosen spot lands on the focus point.
      const size = watch.offsetWidth;
      const rad = (cur.r * Math.PI) / 180;
      const ox = (cur.hx - 0.5) * size;
      const oy = (cur.hy - 0.5) * size;
      const rx = ox * Math.cos(rad) - oy * Math.sin(rad);
      const ry = ox * Math.sin(rad) + oy * Math.cos(rad);
      const dx = cur.fx - rx * cur.s;
      const dy = cur.fy - ry * cur.s;
      watch.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${cur.r.toFixed(2)}deg) scale(${cur.s.toFixed(4)})`;
      watch.style.setProperty("--s", cur.s.toFixed(3));
      el.style.setProperty("--p", p.toFixed(4));

      if (stop !== active) {
        active = stop;
        notes.forEach((note) => note.classList.toggle("on", Number(note.dataset.stop) === stop));
        spots.forEach((spot, i) => spot.classList.toggle("on", i + 1 === stop));
        el.classList.toggle("story-end", stop === n + 1);
      }
      if (moving) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      p = clamp(-r.top / (r.height - innerHeight), 0, 1);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      list = stops();
      onScroll();
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [callouts, n]);

  if (!src || n === 0) return null;

  return (
    <section
      ref={ref}
      className="story"
      style={{ "--n": n } as React.CSSProperties}
      aria-label={`${product.name} closer look`}
    >
      <div className="story-stage">
        <span className="story-word" aria-hidden="true">
          {product.name.replace(/^MATIN\s+/i, "")}
        </span>
        <span className="story-glow" aria-hidden="true" />
        <div ref={watchRef} className="story-watch">
          <Image
            src={src}
            alt={product.imageAlts?.[0] ?? product.name}
            fill
            sizes="(max-width: 860px) 190vw, 1200px"
            style={{ objectFit: "contain" }}
          />
          {callouts.map((c) => (
            <span
              key={c.title}
              className="story-spot"
              aria-hidden="true"
              style={{ left: `${(c.at?.[0] ?? 0.5) * 100}%`, top: `${(c.at?.[1] ?? 0.5) * 100}%` }}
            />
          ))}
        </div>

        <h2 className="story-intro on" data-stop={0}>
          Take a closer look<span className="accent">.</span>
        </h2>
        <ol className="story-notes">
          {callouts.map((c, i) => (
            <li key={c.title} data-stop={i + 1}>
              <span className="story-num">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </span>
              <strong>{c.title}</strong>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
        <p className="story-outro" data-stop={n + 1}>
          Built for hard places<span className="accent">.</span>
        </p>
        <span className="story-bar" aria-hidden="true" />
      </div>
    </section>
  );
}
