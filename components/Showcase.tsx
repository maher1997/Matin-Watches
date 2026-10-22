"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";

const AUTOPLAY_MS = 3500;

// One compact panel: tabs on the left switch the story and the picture on the
// right. Pictures keep their real shape (no crop). It moves on by itself
// every few seconds while it is on screen (always starting from the first tab
// when you arrive), until someone picks a tab.
export default function Showcase({ product }: { product: Product }) {
  const chapters = product.chapters ?? [];
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Only run while at least half the panel is visible; restart from the
  // first tab each time it comes back into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setActive((a) => (auto ? 0 : a));
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [auto]);

  useEffect(() => {
    if (!auto || !inView || chapters.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % chapters.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, auto, inView, chapters.length]);

  // Pictures load one tab ahead instead of all at once: they all loading
  // and decoding together on the way past made the scroll catch in
  // Instagram's browser.
  const [loaded, setLoaded] = useState<number[]>([0]);
  useEffect(() => {
    if (!inView || chapters.length < 2) return;
    const next = (active + 1) % chapters.length;
    setLoaded((l) => (l.includes(active) && l.includes(next) ? l : [...new Set([...l, active, next])]));
  }, [active, inView, chapters.length]);

  // Phones: the photo box takes each photo's shape, so the card would grow
  // and shrink every few seconds and push everything below it up and down
  // (iPhone browsers do not hold the reading place, so in Instagram the page
  // looked like it shook). The card keeps the height it has with its
  // tallest photo; with a wider photo the spare room sits at its bottom.
  useEffect(() => {
    const el = ref.current;
    const pics = el?.querySelector<HTMLElement>(".showcase-pics");
    if (!el || !pics) return;
    const phone = matchMedia("(max-width: 860px)");
    const tallest = Math.max(
      ...chapters.map((ch) => {
        const p = product.posters?.find((x) => x.src === ch.image);
        return ch.image ? (p?.height ?? 1500) / (p?.width ?? 1200) : 0;
      }),
    );
    let w = -1;
    const fit = () => {
      if (!phone.matches || !tallest) {
        el.style.minHeight = "";
        w = -1;
        return;
      }
      if (pics.offsetWidth === w) return;
      w = pics.offsetWidth;
      el.style.minHeight = "";
      // Everything but the photo stays the same height, mid-change or not.
      const rest = el.offsetHeight - pics.offsetHeight;
      el.style.minHeight = `${Math.ceil(rest + w * tallest)}px`;
    };
    fit();
    addEventListener("resize", fit);
    phone.addEventListener("change", fit);
    return () => {
      removeEventListener("resize", fit);
      phone.removeEventListener("change", fit);
    };
  }, [chapters, product.posters]);

  if (chapters.length === 0) return null;

  const posterFor = (src?: string) => product.posters?.find((p) => p.src === src);
  const ratio = (src?: string) => {
    const p = posterFor(src);
    return `${p?.width ?? 1200} / ${p?.height ?? 1500}`;
  };

  return (
    <div ref={ref} className={`showcase-panel${auto && inView ? " is-auto" : ""}`}>
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
              {i === active && <span key={`${active}-${inView}`} className="showcase-progress" aria-hidden="true" />}
            </button>
          ))}
        </div>
        {/* All texts share one spot so the panel keeps the height of the longest */}
        <div className="showcase-bodies">
          {chapters.map((ch, i) => (
            <div
              key={ch.title}
              id={i === active ? "showcase-body" : undefined}
              role={i === active ? "tabpanel" : undefined}
              aria-labelledby={i === active ? `showcase-tab-${i}` : undefined}
              aria-hidden={i === active ? undefined : true}
              className={`showcase-body${i === active ? " on" : ""}`}
            >
              <h3>{ch.title}</h3>
              <p>{ch.text}</p>
            </div>
          ))}
        </div>
      </div>
      {/* On phones the picture box takes the shape of the picture on show, so
          a wider photo never leaves an empty band under it */}
      <div
        className="showcase-pics"
        style={{ ["--ar" as string]: ratio(chapters[active]?.image) }}
      >
        {chapters.map((ch, i) => {
          const poster = posterFor(ch.image);
          return ch.image && loaded.includes(i) ? (
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
