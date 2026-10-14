"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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

// Big lifestyle panels. The photo has no words baked in; the headline and the
// icon points are real text laid over it, and slide in when the panel shows.
export default function Stories({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -15% 0px" },
    );
    root.querySelectorAll(".story").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const stories = product.stories ?? [];
  if (stories.length === 0) return null;

  return (
    <div ref={ref} className="stories">
      {stories.map((s) => (
        <section key={s.image} className={`story story-${s.accent ?? "blue"}`} aria-label={s.title.join(" ")}>
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
              {s.points.map((pt, i) => (
                <li key={pt.title} style={{ "--d": `${200 + i * 110}ms` } as React.CSSProperties}>
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
        </section>
      ))}
    </div>
  );
}
