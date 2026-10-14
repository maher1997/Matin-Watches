"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// "Turn it around": the section pins while you scroll and the watch turns
// from the front, to an angle, to the side and round to the back, then
// moves in close on the screen. Each photo turns in with a 3D swing and
// its headline swaps beside it. Scroll sets a target; every frame eases
// toward it so the motion stays smooth on any device.
export default function ScrollStory({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const views = (product.views ?? []).filter((v) => product.images[v.image]);
  const n = views.length;

  useEffect(() => {
    const el = ref.current;
    if (!el || n === 0) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("turn-static");
      return;
    }
    const layers = [...el.querySelectorAll<HTMLElement>(".turn-photo")];
    const texts = [...el.querySelectorAll<HTMLElement>(".turn-text")];
    const steps = [...el.querySelectorAll<HTMLElement>(".turn-steps li")];
    let target = 0;
    let cur = 0;
    let raf = 0;
    let active = -1;

    const frame = () => {
      raf = 0;
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.001) cur = target;
      layers.forEach((layer, i) => {
        const d = cur - i; // <0: still to come, >0: already turned past
        const o = clamp(1 - Math.abs(d) * 1.8, 0, 1);
        const rot = clamp(-d * 40, -60, 60);
        const sc = 1 - Math.min(Math.abs(d), 1) * 0.12;
        layer.style.opacity = o.toFixed(3);
        layer.style.transform = `translateX(${(-d * 6).toFixed(2)}%) rotateY(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        layer.style.visibility = o > 0 ? "visible" : "hidden";
      });
      el.style.setProperty("--p", (cur / Math.max(1, n - 1)).toFixed(4));
      const now = Math.round(cur);
      if (now !== active) {
        active = now;
        texts.forEach((t, i) => t.classList.toggle("on", i === now));
        steps.forEach((s, i) => s.classList.toggle("on", i === now));
      }
      if (cur !== target) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
      // Each photo holds for a moment before the next one turns in.
      const t = p * (n - 1);
      const k = Math.floor(t);
      const f = t - k;
      const eased = f < 0.35 ? 0 : f > 0.85 ? 1 : (f - 0.35) / 0.5;
      target = Math.min(n - 1, k + eased);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  if (n === 0) return null;

  return (
    <section
      ref={ref}
      className="turn"
      style={{ "--n": n } as React.CSSProperties}
      aria-label={`${product.name} from every angle`}
    >
      <div className="turn-stage">
        <span className="turn-glow" aria-hidden="true" />
        <span className="turn-ring" aria-hidden="true" />
        <div className="turn-photos">
          {views.map((v, i) => (
            <div
              key={v.title}
              className="turn-photo"
              style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
            >
              <Image
                src={product.images[v.image]}
                alt={product.imageAlts?.[v.image] ?? product.name}
                fill
                sizes="(max-width: 860px) 90vw, 620px"
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        <div className="turn-copy">
          <p className="turn-kicker">{product.name} from every angle</p>
          <div className="turn-texts">
            {views.map((v, i) => (
              <div key={v.title} className={`turn-text${i === 0 ? " on" : ""}`}>
                <p className="eyebrow">
                  {String(i + 1).padStart(2, "0")} · {v.eyebrow}
                </p>
                <h2>{v.title}</h2>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
          <ol className="turn-steps" aria-hidden="true">
            {views.map((v, i) => (
              <li key={v.title} className={i === 0 ? "on" : undefined}>
                {v.eyebrow}
              </li>
            ))}
          </ol>
        </div>
        <span className="turn-bar" aria-hidden="true" />
      </div>
    </section>
  );
}
