"use client";

import { useEffect } from "react";

// Lights up a footer link when it is really tapped, but not when a finger
// only passes over it to scroll. The browser's own :active turns on the
// moment a finger lands, so a scroll that starts on a link would flash it.
// Here the link lights only if the finger stays still for a moment.
export default function TapHighlight({ selector }: { selector: string }) {
  useEffect(() => {
    let link: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let wait = 0;
    let fade = 0;

    const off = () => {
      clearTimeout(wait);
      link?.classList.remove("is-tap");
      link = null;
    };
    const start = (e: TouchEvent) => {
      off();
      const target = (e.target as Element).closest<HTMLElement>(selector);
      if (!target) return;
      link = target;
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
      wait = window.setTimeout(() => link?.classList.add("is-tap"), 90);
    };
    const move = (e: TouchEvent) => {
      if (!link) return;
      const t = e.touches[0];
      if (Math.abs(t.clientX - x) > 8 || Math.abs(t.clientY - y) > 8) off();
    };
    const end = () => {
      if (!link) return;
      const tapped = link;
      clearTimeout(wait);
      tapped.classList.add("is-tap");
      clearTimeout(fade);
      fade = window.setTimeout(() => tapped.classList.remove("is-tap"), 300);
      link = null;
    };

    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchmove", move, { passive: true });
    document.addEventListener("touchend", end, { passive: true });
    document.addEventListener("touchcancel", off, { passive: true });
    return () => {
      off();
      clearTimeout(fade);
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
      document.removeEventListener("touchcancel", off);
    };
  }, [selector]);

  return null;
}
