"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

const AUTOPLAY_MS = 6000;

// One compact panel: tabs on the left switch the story and the picture on the
// right. Pictures keep their real shape (no crop). It moves on by itself
// every few seconds until someone picks a tab.
export default function Showcase({ product }: { product: Product }) {
  const chapters = product.chapters ?? [];
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || chapters.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % chapters.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, auto, chapters.length]);

  if (chapters.length === 0) return null;
  const c = chapters[active];

  return (
    <div className={`showcase-panel${auto ? " is-auto" : ""}`}>
      <div className="showcase-copy">
        <div className="showcase-tabs" role="tablist" aria-label="Highlights">
          {chapters.map((ch, i) => (
            <button
              key={ch.title}
              type="button"
              role="tab"
              id={`showcase-tab-${i}`}
              aria-selected={i === active}
              aria-controls="showcase-body"
              className={i === active ? "on" : undefined}
              onClick={() => {
                setAuto(false);
                setActive(i);
              }}
            >
              {ch.eyebrow}
              {/* Keyed so the bar restarts each time this tab becomes active */}
              {i === active && <span key={active} className="showcase-progress" aria-hidden="true" />}
            </button>
          ))}
        </div>
        <div id="showcase-body" role="tabpanel" aria-labelledby={`showcase-tab-${active}`} key={active} className="showcase-body">
          <h3>{c.title}</h3>
          <p>{c.text}</p>
        </div>
      </div>
      <div className="showcase-pics">
        {chapters.map((ch, i) => {
          const poster = product.posters?.find((p) => p.src === ch.image);
          return ch.image ? (
            <Image
              key={ch.image}
              src={ch.image}
              alt={ch.imageAlt ?? ch.title}
              width={poster?.width ?? 1200}
              height={poster?.height ?? 1500}
              sizes="(max-width: 860px) 80vw, 420px"
              className={i === active ? "on" : undefined}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
