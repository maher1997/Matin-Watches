"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";

const AUTOPLAY_MS = 4500;

// "From every angle": a row of big photo cards you swipe sideways (or step
// through with the arrows). While it is on screen it glides to the next card
// by itself, and stops for good once someone touches it.
export default function AngleCards({ product }: { product: Product }) {
  const views = (product.views ?? []).filter((v) => product.images[v.image]);
  const n = views.length;
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);

  const cards = () => [...(track.current?.children ?? [])] as HTMLElement[];

  const go = (i: number) => {
    const t = track.current;
    const card = cards()[(i + n) % n];
    if (!t || !card) return;
    t.scrollTo({ left: card.offsetLeft - cards()[0].offsetLeft, behavior: "smooth" });
  };

  // Which card sits at the start of the row
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const list = cards();
        const x0 = list[0]?.offsetLeft ?? 0;
        let best = 0;
        list.forEach((c, i) => {
          if (Math.abs(c.offsetLeft - x0 - t.scrollLeft) < Math.abs(list[best].offsetLeft - x0 - t.scrollLeft)) best = i;
        });
        // At the far end the last cards can't reach the start; count it as the last one
        if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 4) best = list.length - 1;
        setActive(best);
      });
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      t.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) el.classList.add("in");
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || n < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, auto, inView, n]);

  if (n === 0) return null;
  const stop = () => setAuto(false);

  return (
    <section ref={ref} className="angles" aria-label={`${product.name} from every angle`}>
      <div className="angles-head">
        <div>
          <p className="eyebrow">Take it all in</p>
          <h2>{product.name} from every angle</h2>
        </div>
        <div className="angles-nav">
          <button type="button" aria-label="Previous photo" onClick={() => (stop(), go(active - 1))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" aria-label="Next photo" onClick={() => (stop(), go(active + 1))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="angles-track"
        onPointerDown={stop}
        onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && stop()}
      >
        {views.map((v, i) => (
          <article
            key={v.title}
            className={`angle-card${i === active ? " on" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className="angle-pic">
              <Image
                src={product.images[v.image]}
                alt={product.imageAlts?.[v.image] ?? product.name}
                fill
                quality={75}
                sizes="(max-width: 860px) 82vw, 440px"
              />
            </div>
            <div className="angle-text">
              <p className="angle-eyebrow">{v.eyebrow}</p>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="angles-dots" aria-hidden="true">
        {views.map((v, i) => (
          <span key={v.title} className={i === active ? "on" : undefined} />
        ))}
      </div>
    </section>
  );
}
