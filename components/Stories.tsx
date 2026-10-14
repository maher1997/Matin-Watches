"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product, StoryIcon } from "@/lib/products";

const icons: Record<StoryIcon, string> = {
  shield: "M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z M10 9.5v5l4-2.5-4-2.5z",
  drop: "M12 3c3.5 4.4 6 7.9 6 11a6 6 0 0 1-12 0c0-3.1 2.5-6.6 6-11z M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5",
  dust: "M4 8h9a2.5 2.5 0 1 0-2.5-2.5 M3 12h14a2.5 2.5 0 1 1-2.5 2.5 M5 16h6 M18 6.5h.01 M20 10h.01 M7 20h.01 M12 19.5h.01",
  mountain: "M2 20l7-12 4 6 2.5-3.5L22 20H2z M7.5 10.5l1.5 1.5 1.5-1.5",
  thermo: "M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0V4z M12 9v7.5",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z M6 12.5h3l1.5-2.5 2 4 1.5-1.5h4",
  chart: "M5 20v-6 M10 20V10 M15 20V6 M20 20V3",
  run: "M14 4.5a1.5 1.5 0 1 0 0-.01 M7 21l3.5-6 3 2.5V22 M10.5 15l1.5-6.5L8 10l-2 3 M12 8.5l3 3 3.5.5 M2 9h4 M1 13h3",
  pin: "M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  route: "M6 3.5a2.5 2.5 0 0 0-2.5 2.5c0 2 2.5 4.5 2.5 4.5S8.5 8 8.5 6A2.5 2.5 0 0 0 6 3.5z M18 13.5a2.5 2.5 0 0 0-2.5 2.5c0 2 2.5 4.5 2.5 4.5s2.5-2.5 2.5-4.5a2.5 2.5 0 0 0-2.5-2.5z M6 13v2a3 3 0 0 0 3 3h4 M9 9h6a3 3 0 0 1 3 3",
  battery: "M8 4h8v17H8z M10 2h4 M10.5 7h3 M10.5 10.5h3 M10.5 14h3 M10.5 17.5h3",
  bolt: "M13 2L5 13.5h6L10 22l9-12.5h-6L13 2z",
  magnet: "M5 4h4v8a3 3 0 0 0 6 0V4h4v8a7 7 0 0 1-14 0V4z M5 8h4 M15 8h4",
};

function Icon({ name }: { name: StoryIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={icons[name]} />
    </svg>
  );
}

const AUTOPLAY_MS = 4000;

// Lifestyle slider. The photos have no words baked in; the headline and the
// icon points are real text laid over them. It moves to the next slide every
// few seconds while on screen; the buttons and arrows jump straight to one.
export default function Stories({ product }: { product: Product }) {
  const stories = product.stories ?? [];
  const n = stories.length;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keyed on `active`, so any jump restarts the 4 seconds.
  useEffect(() => {
    if (!inView || paused || n < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, inView, paused, n]);

  if (n === 0) return null;
  const go = (i: number) => setActive((i + n) % n);

  return (
    <section
      ref={ref}
      className={`stories${inView ? " in" : ""}${paused ? " paused" : ""}`}
      aria-roledescription="carousel"
      aria-label={`${product.name} highlights`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
    >
      <div className="stories-tabs" role="tablist" aria-label="Choose a highlight">
        {stories.map((s, i) => (
          <button
            key={s.image}
            type="button"
            role="tab"
            id={`story-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`story-${i}`}
            className={i === active ? "on" : undefined}
            onClick={() => go(i)}
          >
            {s.tab}
            {i === active && <span key={`${active}-${inView}`} className="stories-progress" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <button type="button" className="stories-arrow prev" aria-label="Previous highlight" onClick={() => go(active - 1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className="stories-arrow next" aria-label="Next highlight" onClick={() => go(active + 1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>

      <div
        className="stories-stage"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {stories.map((s, i) => (
          <div
            key={s.image}
            id={`story-${i}`}
            role="tabpanel"
            aria-labelledby={`story-tab-${i}`}
            aria-hidden={i === active ? undefined : true}
            className={`story story-${s.accent ?? "blue"}${i === active ? " on" : ""}`}
          >
            <div className="story-pic">
              <Image src={s.image} alt={s.alt} fill quality={75} sizes="(max-width: 860px) 100vw, 1240px" />
            </div>
            <div className="story-copy">
              <h2>
                <span>{s.title[0]}</span>
                <span className="story-accent">{s.title[1]}</span>
              </h2>
              <p className="story-lede">{s.text}</p>
              <ul className="story-points">
                {s.points.map((pt, j) => (
                  <li key={pt.title} style={{ "--d": `${250 + j * 110}ms` } as React.CSSProperties}>
                    <span className="story-icon">
                      <Icon name={pt.icon} />
                    </span>
                    <span>
                      <strong>{pt.title}</strong>
                      <span>{pt.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {s.tags && (
                <ul className="story-tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
