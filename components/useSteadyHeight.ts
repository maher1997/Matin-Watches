"use client";

import { useEffect, useRef } from "react";

// Keeps a box at the tallest height it has had, so switching what it shows
// (a tab, a screen, a longer text) never makes it shorter again. iPhone
// browsers do not hold the reading place when something above changes
// height, so a box growing and shrinking by itself while you scroll made
// everything below it jump: in Instagram it looked like the page shook.
// Starts over when the box changes width (phone turned, window resized).
export default function useSteadyHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let w = el.offsetWidth;
    let max = 0;
    let raf = 0;
    // Applied on the next frame: changing the box inside the observer's own
    // callback trips a "ResizeObserver loop" error.
    const apply = () => {
      raf = 0;
      if (el.offsetWidth !== w) {
        w = el.offsetWidth;
        max = 0;
        el.style.minHeight = "";
      }
      const h = Math.ceil(el.getBoundingClientRect().height);
      if (h > max) {
        max = h;
        el.style.minHeight = `${h}px`;
      }
    };
    const ro = new ResizeObserver(() => {
      if (!raf) raf = requestAnimationFrame(apply);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
