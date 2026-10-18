"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/SectionHead";

// Battery section drawn on the watch itself: the photo's screen is covered
// with a live face where liquid fills to the chosen mode's days and the
// number counts. "wave" (Torvan): blue waves, bubbles and a ring of day ticks
// on a round screen. "dash" (Trekon): green liquid made of flowing dashed
// lines with a dashed crest, rising sparks and day ticks up both sides, on a
// shaped screen. Steps through the modes on its
// own (tap a card to pick one). Renders complete without JS on the longest
// mode; motion is an extra and pauses off screen.

const STEP_MS = 4800;

export default function BatteryLiquid({
  name,
  mah,
  image,
  imageAlt,
  screen,
  modes,
  facts,
  intro,
  look = "wave",
}: {
  name: string;
  mah: number;
  // Front photo of the watch, square.
  image: string;
  imageAlt: string;
  // The screen in the photo, in % of the photo width/height: a circle, or a
  // box with a CSS polygon for its outline.
  screen:
    | { cx: number; cy: number; r: number }
    | { x: number; y: number; w: number; h: number; clip: string };
  // Longest mode last; its days are a full screen.
  modes: { label: string; days: number; text: string }[];
  facts: { value: string; label: string }[];
  intro?: string;
  look?: "wave" | "dash";
}) {
  const max = Math.max(...modes.map((m) => m.days));
  const [active, setActive] = useState(modes.length - 1);
  const [shown, setShown] = useState(max);
  const [live, setLive] = useState(true);
  const [heldUntil, setHeldUntil] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const shownRef = useRef(max);

  const mode = modes[active];
  const frac = mode.days / max;
  const dash = look === "dash";
  const box =
    "r" in screen
      ? {
          left: `${screen.cx - screen.r}%`,
          top: `${screen.cy - screen.r}%`,
          width: `${screen.r * 2}%`,
          height: `${screen.r * 2}%`,
        }
      : {
          left: `${screen.x}%`,
          top: `${screen.y}%`,
          width: `${screen.w}%`,
          height: `${screen.h}%`,
          clipPath: screen.clip,
          WebkitClipPath: screen.clip,
        };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const wait = Math.max(STEP_MS, heldUntil - Date.now());
    const t = window.setTimeout(
      () => setActive((a) => (a + 1) % modes.length),
      wait,
    );
    return () => window.clearTimeout(t);
  }, [active, live, heldUntil, modes.length]);

  useEffect(() => {
    const from = shownRef.current;
    const to = mode.days;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1300);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode.days]);

  const pick = (i: number) => {
    setActive(i);
    setHeldUntil(Date.now() + 15000);
  };

  return (
    <section
      ref={ref}
      id="battery"
      className={`section bl${dash ? " bl-dash" : ""}${live ? "" : " bl-paused"}`}
      aria-labelledby="bl-title"
    >
      <div className="bl-stage">
        <SectionHead
          id="bl-title"
          eyebrow="Battery"
          title={
            <>
              Weeks of power. <span className="grad">Not hours.</span>
            </>
          }
          intro={
            intro ??
            `The ${name} carries a ${mah}mAh battery: up to ${modes.find((m) => m.label === "Typical use")?.days ?? max} days of everyday wear, and up to ${max} days in power-saving mode.`
          }
        />

        <div className="bl-grid">
          <figure className="bl-watch">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 860px) 90vw, 44vw"
              quality={75}
            />
            <div
              className={"r" in screen ? "bl-screen" : "bl-screen bl-shaped"}
              style={box}
              role="img"
              aria-label={`Watch screen showing ${mode.days} days of battery in ${mode.label.toLowerCase()}`}
            >
              <div
                className="bl-liquid"
                style={{ transform: `translateY(${(1 - frac) * 100}%)` }}
              >
                {dash ? (
                  <>
                    <span className="bl-dashes" />
                    <span className="bl-crest" />
                  </>
                ) : (
                  <>
                    <span className="bl-wave bl-wave-back" />
                    <span className="bl-wave bl-wave-front" />
                  </>
                )}
                <span className="bl-bubbles" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
              </div>
              {dash ? (
                <svg
                  className="bl-ticks"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {Array.from({ length: max }, (_, i) => {
                    // Day 1 at the bottom; the ticks follow the cut corners.
                    const y = 93 - (i / (max - 1)) * 86;
                    const inset =
                      y < 18
                        ? 12 * (1 - y / 18)
                        : y > 81
                          ? 12 * ((y - 81) / 19)
                          : 0;
                    const len = i % 5 === 4 ? 5 : 3;
                    const delay = {
                      transitionDelay: `${(i < mode.days ? i : max - i) * 18}ms`,
                    };
                    const on = i < mode.days ? "on" : undefined;
                    return (
                      <g key={i}>
                        <line
                          x1={inset + 3}
                          y1={y}
                          x2={inset + 3 + len}
                          y2={y}
                          className={on}
                          style={delay}
                        />
                        <line
                          x1={97 - inset}
                          y1={y}
                          x2={97 - inset - len}
                          y2={y}
                          className={on}
                          style={delay}
                        />
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <svg
                  className="bl-ticks"
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                >
                  {Array.from({ length: max }, (_, i) => {
                    const a = (i / max) * 2 * Math.PI;
                    const s = Math.sin(a);
                    const c = -Math.cos(a);
                    return (
                      <line
                        key={i}
                        x1={100 + s * 90}
                        y1={100 + c * 90}
                        x2={100 + s * (i % 5 === 0 ? 82 : 86)}
                        y2={100 + c * (i % 5 === 0 ? 82 : 86)}
                        className={i < mode.days ? "on" : undefined}
                        style={{
                          transitionDelay: `${(i < mode.days ? i : max - i) * 12}ms`,
                        }}
                      />
                    );
                  })}
                </svg>
              )}
              <div className="bl-face">
                <span className="bl-mah">{mah} mAh</span>
                <span className="bl-num">{shown}</span>
                <span className="bl-days">days</span>
                <span className="bl-mode">{mode.label}</span>
              </div>
              <span className="bl-glass" aria-hidden="true" />
            </div>
          </figure>

          <div className="bl-side">
            <ul className="bl-modes">
              {modes.map((m, i) => (
                <li key={m.label}>
                  <button
                    type="button"
                    className={i === active ? "bl-card is-on" : "bl-card"}
                    aria-pressed={i === active}
                    onClick={() => pick(i)}
                  >
                    <span className="bl-card-head">
                      <span className="bl-card-label">{m.label}</span>
                      <span className="bl-card-days">
                        {m.days} <small>days</small>
                      </span>
                    </span>
                    <span className="bl-pill" aria-hidden="true">
                      <span style={{ width: `${(m.days / max) * 100}%` }} />
                    </span>
                    <span className="bl-card-text">{m.text}</span>
                  </button>
                </li>
              ))}
            </ul>

            <ul className="bl-facts">
              {facts.map((f) => (
                <li key={f.label}>
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
