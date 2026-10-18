"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/SectionHead";

// Battery section drawn on the watch itself: the photo's screen is covered
// with a live face where liquid fills to the chosen mode's days and the
// number counts. "wave" (Torvan): blue waves, bubbles and a ring of day ticks
// on a round screen. "cells" (Trekon): glossy green battery cells
// stacked inside a shaped screen, lighting up from the bottom with a light
// sweep and the top cell breathing. "radar" (Kaldor): a green tactical
// radar on a round screen, a ring of day segments filling clockwise from
// north while a sweep beam turns and blips light up as it passes. "rings"
// (Varkon): thin emerald rings that light from the outer edge inward, each
// with a soft gleam orbiting it, alternating direction. Steps through the modes on its
// own (tap a card to pick one). Renders complete without JS on the longest
// mode; motion is an extra and pauses off screen.

const STEP_MS = 4800;
const CELLS = 15;
const SWEEP_S = 4;
// Radar blips as [degrees from north, distance from centre].
const BLIPS: [number, number][] = [
  [38, 46],
  [112, 62],
  [205, 34],
  [290, 58],
  [330, 22],
];

// Rings for the "rings" look (viewBox 0 0 200 200), outermost first.
const RINGS = Array.from({ length: 12 }, (_, i) => 93 - i * 4.6);

// One ring segment between two angles (degrees clockwise from north).
function arcSegment(a0: number, a1: number, r0: number, r1: number) {
  const p = (a: number, r: number) => {
    const t = (a * Math.PI) / 180;
    return `${(100 + Math.sin(t) * r).toFixed(2)} ${(100 - Math.cos(t) * r).toFixed(2)}`;
  };
  return `M${p(a0, r1)} A${r1} ${r1} 0 0 1 ${p(a1, r1)} L${p(a1, r0)} A${r0} ${r0} 0 0 0 ${p(a0, r0)}Z`;
}

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
  look?: "wave" | "cells" | "radar" | "rings";
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
  const cells = look === "cells";
  const radar = look === "radar";
  const rings = look === "rings";
  const litRings = Math.round(frac * RINGS.length);
  // Cells light from the bottom, one per CELLS-th of the longest mode.
  const litCells = Math.max(1, Math.round(frac * CELLS));
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
      className={`section bl${cells ? " bl-cellslook" : ""}${radar ? " bl-radarlook" : ""}${rings ? " bl-ringslook" : ""}${live ? "" : " bl-paused"}`}
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
              {rings ? (
                <svg
                  className="bl-rings"
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                >
                  {RINGS.map((r, i) => {
                    const lit = i < litRings;
                    return (
                      <g
                        key={r}
                        className={lit ? "on" : undefined}
                        style={{
                          transitionDelay: `${(lit ? i : RINGS.length - i) * 70}ms`,
                          // Inner rings softer so the number stays easy to read.
                          opacity: 1 - i * 0.06,
                        }}
                      >
                        <circle cx="100" cy="100" r={r} className="bl-ring" />
                        <circle
                          cx="100"
                          cy="100"
                          r={r}
                          pathLength={100}
                          className={i % 2 ? "bl-gleam rev" : "bl-gleam"}
                          style={{ animationDuration: `${5 + i * 0.6}s` }}
                        />
                      </g>
                    );
                  })}
                </svg>
              ) : radar ? (
                <>
                  <span className="bl-sweep" aria-hidden="true" />
                  <svg
                    className="bl-radar"
                    viewBox="0 0 200 200"
                    aria-hidden="true"
                  >
                    <circle cx="100" cy="100" r="28" className="bl-grid-line" />
                    <circle cx="100" cy="100" r="52" className="bl-grid-line" />
                    <circle cx="100" cy="100" r="74" className="bl-grid-line" />
                    <line
                      x1="100"
                      y1="24"
                      x2="100"
                      y2="176"
                      className="bl-grid-line"
                    />
                    <line
                      x1="24"
                      y1="100"
                      x2="176"
                      y2="100"
                      className="bl-grid-line"
                    />
                    {BLIPS.map(([a, d], i) => {
                      const rad = (a * Math.PI) / 180;
                      return (
                        <circle
                          key={i}
                          cx={100 + Math.sin(rad) * d}
                          cy={100 - Math.cos(rad) * d}
                          r="2.2"
                          className="bl-blip"
                          style={{ animationDelay: `${(a / 360) * SWEEP_S}s` }}
                        />
                      );
                    })}
                    {Array.from({ length: max }, (_, i) => {
                      const step = 360 / max;
                      const lit = i < mode.days;
                      return (
                        <path
                          key={i}
                          d={arcSegment(
                            i * step + 1.2,
                            (i + 1) * step - 1.2,
                            80,
                            95,
                          )}
                          className={
                            lit
                              ? i === mode.days - 1
                                ? "bl-seg on head"
                                : "bl-seg on"
                              : "bl-seg"
                          }
                          style={{
                            transitionDelay: `${(lit ? i : max - i) * 25}ms`,
                          }}
                        />
                      );
                    })}
                  </svg>
                </>
              ) : cells ? (
                <div
                  className="bl-cells"
                  style={{
                    ["--clip" as string]:
                      "clip" in screen ? screen.clip : "none",
                  }}
                >
                  {Array.from({ length: CELLS }, (_, i) => {
                    const lit = i < litCells;
                    return (
                      <i
                        key={i}
                        className={
                          lit
                            ? i === litCells - 1
                              ? "on top"
                              : "on"
                            : undefined
                        }
                        style={{
                          ["--d" as string]: `${(lit ? i : CELLS - 1 - i) * 60}ms`,
                          ["--i" as string]: i,
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <>
                  <div
                    className="bl-liquid"
                    style={{ transform: `translateY(${(1 - frac) * 100}%)` }}
                  >
                    <span className="bl-wave bl-wave-back" />
                    <span className="bl-wave bl-wave-front" />
                    <span className="bl-bubbles" aria-hidden="true">
                      {Array.from({ length: 9 }, (_, i) => (
                        <i key={i} />
                      ))}
                    </span>
                  </div>
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
                </>
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
