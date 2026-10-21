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
    };

    const play = (el: HTMLElement) => {
      const delay = parseFloat(el.style.getPropertyValue("--rv-d")) || 0;
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
