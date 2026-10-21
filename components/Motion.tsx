"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Blocks that rise and fade in when they first reach the screen, and the
// cards inside them that follow one after another.
const BLOCKS = "main section > *";
const ITEMS =
  ".card, .big-stat, .fgroup, .lp-reasons > *, .lp-colls > *, .lp-trio-item, .faq-item";
const STEP = 90; // ms between cards in a row
const SAFETY = 1600; // ms: anything still waiting after it is in view shows anyway
const RISE = 34; // px a block rises while it arrives
const RISE_MS = 1150;

// cubic-bezier(0.16, 0.84, 0.24, 1), the same soft curve the CSS used.
function ease(t: number) {
  const x1 = 0.16, y1 = 0.84, x2 = 0.24, y2 = 1;
  const bx = (u: number) => 3 * u * (1 - u) * (1 - u) * x1 + 3 * u * u * (1 - u) * x2 + u * u * u;
  const by = (u: number) => 3 * u * (1 - u) * (1 - u) * y1 + 3 * u * u * (1 - u) * y2 + u * u * u;
  let lo = 0, hi = 1, u = t;
  for (let i = 0; i < 20; i++) {
    u = (lo + hi) / 2;
    if (bx(u) < t) lo = u;
    else hi = u;
  }
  return by(u);
}

// Soft "arrive" animations, Apple style. Each block plays once, on its own
// clock, when it reaches the screen; it is never tied to how far or how fast
// you scroll. Without JavaScript nothing is hidden, blocks already on the
// first screen are left alone, and a safety timer shows anything that has
// not played, so a section can never stay blank.
export default function Motion() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const timers: number[] = [];
    let raf = 0;
    let waiting: HTMLElement[] = [];
    const frames = new Set<number>();

    const usable = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return (
        cs.position !== "absolute" &&
        cs.position !== "fixed" &&
        cs.position !== "sticky" &&
        cs.transform === "none" &&
        cs.display !== "none" &&
        !el.querySelector(".buy-bar")
      );
    };

    const done = (el: HTMLElement) => {
      el.classList.remove("rv", "rv-in");
      el.style.removeProperty("--rv-d");
      el.style.removeProperty("transform");
    };

    // The rise is moved here rather than by a CSS transition so that every
    // frame lands on a whole screen pixel. Moved by fractions of a pixel,
    // thin borders and photos flickered between sharp and soft in Chrome.
    const rise = (el: HTMLElement, delay: number) => {
      const px = 1 / (window.devicePixelRatio || 1);
      const set = (y: number) => {
        const snapped = Math.round(y / px) * px;
        el.style.transform = snapped > 0 ? `translate3d(0, ${snapped}px, 0)` : "none";
      };
      set(RISE);
      let t0 = 0;
      const step = (now: number) => {
        if (!el.classList.contains("rv-in")) return;
        if (!t0) t0 = now + delay;
        const t = Math.min(1, Math.max(0, (now - t0) / RISE_MS));
        set(RISE * (1 - ease(t)));
        if (t < 1) frames.add(requestAnimationFrame(step));
      };
      frames.add(requestAnimationFrame(step));
    };

    const play = (el: HTMLElement) => {
      const delay = parseFloat(el.style.getPropertyValue("--rv-d")) || 0;
      // The lineup table only fades in (its photos flickered while moving).
      if (!el.matches(".cmp-panel")) rise(el, delay);
      el.classList.add("rv-in");
      timers.push(window.setTimeout(() => done(el), delay + 1300));
    };

    const check = () => {
      raf = 0;
      const h = window.innerHeight;
      waiting = waiting.filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.92) {
          play(el);
          return false;
        }
        return true;
      });
      if (!waiting.length) stop();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    const stop = () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };

    // Wait a frame so a new page's content is in place after navigation.
    const start = requestAnimationFrame(() => {
      const h = window.innerHeight;
      const below = (el: HTMLElement) =>
        el.getBoundingClientRect().top > h * 0.92;
      const blocks = [...document.querySelectorAll<HTMLElement>(BLOCKS)].filter(
        (el) => below(el) && usable(el),
      );
      const items = [...document.querySelectorAll<HTMLElement>(ITEMS)].filter(
        (el) => below(el) && usable(el) && !blocks.includes(el),
      );
      // Cards in the same row follow one another.
      const rows = new Map<Element | null, number>();
      for (const el of items) {
        const k = rows.get(el.parentElement) ?? 0;
        rows.set(el.parentElement, k + 1);
        el.style.setProperty("--rv-d", `${(k % 6) * STEP}ms`);
      }
      waiting = [...blocks, ...items];
      if (!waiting.length) return;
      root.classList.add("rv-on");
      for (const el of waiting) el.classList.add("rv");
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      check();
      // Safety net: if scrolling events never arrive (or anything else goes
      // wrong), show whatever is on screen anyway.
      const safety = window.setInterval(() => {
        const vh = window.innerHeight;
        for (const el of waiting) {
          const r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > 0 && !el.classList.contains("rv-in")) {
            timers.push(
              window.setTimeout(
                () => !el.classList.contains("rv-in") && play(el),
                SAFETY,
              ),
            );
          }
        }
      }, 1000);
      timers.push(safety);
    });

    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(raf);
      frames.forEach(cancelAnimationFrame);
      stop();
      timers.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
      document.querySelectorAll<HTMLElement>(".rv").forEach(done);
    };
  }, [path]);

  return null;
}
