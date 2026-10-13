"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";

// Apple-style "closer look": the watch stays pinned in the middle of the
// screen while you scroll, growing and turning slightly, and each callout
// slides in around it. Scroll progress is written to one CSS variable (--p,
// 0 to 1); all the movement is plain CSS driven by that number.
export default function ScrollStory({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const callouts = product.callouts ?? [];
  const src = product.images[0];
  // Each callout gets an equal slice of the scroll, after a short lead-in.
  const step = 0.8 / Math.max(1, callouts.length);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el?.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!src || callouts.length === 0) return null;

  return (
    <section ref={ref} className="story" aria-label={`${product.name} closer look`}>
      <div className="story-stage">
        <h2 className="story-title">
          Take a closer look<span className="accent">.</span>
        </h2>
        <div className="story-watch">
          <span className="story-glow" aria-hidden="true" />
          <Image
            src={src}
            alt={product.imageAlts?.[0] ?? product.name}
            fill
            sizes="(max-width: 860px) 80vw, 560px"
            style={{ objectFit: "contain" }}
          />
        </div>
        {(["left", "right"] as const).map((side, col) => (
          <ul key={side} className={`story-callouts story-${side}`}>
            {callouts.map((c, i) =>
              i % 2 === col ? (
                <li
                  key={c.title}
                  className="callout"
                  style={
                    {
                      "--start": (0.1 + i * step).toFixed(3),
                      // The last note stays on screen until the end.
                      "--end": i === callouts.length - 1 ? "2" : (0.1 + (i + 1) * step).toFixed(3),
                    } as React.CSSProperties
                  }
                >
                  <strong>{c.title}</strong>
                  <span>{c.text}</span>
                </li>
              ) : null,
            )}
          </ul>
        ))}
      </div>
    </section>
  );
}
