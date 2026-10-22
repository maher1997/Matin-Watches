"use client";

import { useEffect, useRef } from "react";

// Shows the final number in the HTML (for Google and no-JS visitors) and
// counts up to it from zero the first time it is fully in view.
export default function CountUp({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, Math.max(0, now - start) / 1400);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${Math.round(to * eased)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, suffix]);

  // The final number sits underneath, invisible, so the box keeps its full
  // width while counting and nothing beside it shifts.
  return (
    <span className="count-up">
      <span aria-hidden="true" className="count-up-size">
        {to}
        {suffix}
      </span>
      <span ref={ref}>
        {to}
        {suffix}
      </span>
    </span>
  );
}
