"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import { scrolling } from "@/lib/scrolling";

// Shared behaviour of the tabbed on-watch showcases (health, GPS): which
// screen is showing, whether the section is on screen, the gentle
// auto-advance every 7s (held for 15s after the visitor touches it),
// arrow keys on the tabs and swipe on the watch.
export default function useShowcase(n: number) {
  const ref = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const hold = useRef(0);
  const reduced = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const touch = useCallback(() => {
    hold.current = Date.now() + 15000;
  }, []);

  // Run animations only while the section is on screen.
  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Move to the next screen by itself, unless the visitor is using it.
  useEffect(() => {
    if (!live || reduced.current) return;
    const t = window.setInterval(() => {
      // Never switch screens in the middle of a scroll in Instagram.
      if (Date.now() > hold.current && !scrolling()) setActive((a) => (a + 1) % n);
    }, 7000);
    return () => window.clearInterval(t);
  }, [live, n]);

  const choose = (i: number) => {
    touch();
    setActive(((i % n) + n) % n);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? n - 1
          : d
            ? (active + d + n) % n
            : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(to);
    tabs.current[to]?.focus();
  };

  const onTouchStart = (e: TouchEvent) => {
    swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touch();
  };
  const onTouchEnd = (e: TouchEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3)
      choose(active + (dx < 0 ? 1 : -1));
  };

  return {
    ref,
    tabs,
    active,
    live,
    reduced,
    touch,
    choose,
    onKey,
    onTouchStart,
    onTouchEnd,
  };
}
