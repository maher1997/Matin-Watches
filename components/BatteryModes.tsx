"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/SectionHead";

// Battery section that walks through the usage modes on its own: a glowing
// ring behind the watch photo fills to that mode's days (one tick = one day),
// the big number counts to it and the matching day strip lights up.
// Everything is visible without JS (it renders on the longest mode); the
// motion is only an extra and pauses off screen.

// Ring geometry in the photo's own 1400px units. The case centre sits at
// (700, 680); the SVG viewBox is shifted 20 units so the ring is centred.
const CX = 700;
const CY = 680;
const R_ARC = 560;
const R_TICK_IN = 600;
const R_TICK_OUT = 628;
const CIRC = 2 * Math.PI * R_ARC;
const STEP_MS = 4500;

export default function BatteryModes({
  name,
  mah,
  charge,
  image,
  imageAlt,
  modes,
}: {
  name: string;
  mah: number;
  // Full charge time, e.g. "1.5 h".
  charge: string;
  // Front photo of the watch (1400x1400, case centred at 700,680).
  image: string;
  imageAlt: string;
  // Longest mode last; its days set the scale of the ring and the strips.
  modes: { label: string; days: number; text: string }[];
}) {
  const max = Math.max(...modes.map((m) => m.days));
  const [active, setActive] = useState(modes.length - 1);
  const [shown, setShown] = useState(modes[modes.length - 1].days);
  const [live, setLive] = useState(true);
  const [heldUntil, setHeldUntil] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const shownRef = useRef(shown);

  const mode = modes[active];
  const frac = mode.days / max;

  // Only run the motion while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Step to the next mode every few seconds (held a while after a tap).
  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wait = Math.max(STEP_MS, heldUntil - Date.now());
    const t = window.setTimeout(() => setActive((a) => (a + 1) % modes.length), wait);
    return () => window.clearTimeout(t);
  }, [active, live, heldUntil, modes.length]);

  // Count the big number from where it is to the new mode's days.
  useEffect(() => {
    const from = shownRef.current;
    const to = mode.days;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
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

  const scale = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * max));

  return (
    <section ref={ref} id="battery" className={`section vb${live ? "" : " vb-paused"}`} aria-labelledby="vb-title">
      <div className="vb-stage">
        <SectionHead
          id="vb-title"
          eyebrow="Battery"
          title={
            <>
              Up to {max} days. <span className="grad">One charge.</span>
            </>
          }
          intro={`The ${name} runs on a ${mah}mAh battery. Pick the mode that fits your week and charge about once a month, or less.`}
        />

        <div className="vb-grid">
          <div className="vb-left">
            <figure className="vb-figure">
              <svg className="vb-ring" viewBox="0 -20 1400 1400" aria-hidden="true">
                <defs>
                  <linearGradient id="vb-arc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ff8a5c" />
                    <stop offset="1" stopColor="#e0262b" />
                  </linearGradient>
                </defs>
                <circle cx={CX} cy={CY} r={R_ARC} className="vb-track" />
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_ARC}
                  className="vb-arc"
                  stroke="url(#vb-arc)"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - frac)}
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
                {Array.from({ length: max }, (_, i) => {
                  const a = (i / max) * 2 * Math.PI;
                  const s = Math.sin(a);
                  const c = -Math.cos(a);
                  const on = i < mode.days;
                  return (
                    <line
                      key={i}
                      x1={CX + s * R_TICK_IN}
                      y1={CY + c * R_TICK_IN}
                      x2={CX + s * R_TICK_OUT}
                      y2={CY + c * R_TICK_OUT}
                      className={on ? "vb-tick on" : "vb-tick"}
                      style={{ transitionDelay: `${(on ? i : max - i) * 14}ms` }}
                    />
                  );
                })}
              </svg>
              <div className="vb-head" style={{ transform: `rotate(${frac * 360}deg)` }} aria-hidden="true">
                <span />
              </div>
              <div className="vb-photo">
                <Image src={image} alt={imageAlt} fill sizes="(max-width: 860px) 80vw, 34vw" quality={70} />
              </div>
            </figure>

            <div className="vb-tabs" role="group" aria-label="Battery modes">
              {modes.map((m, i) => (
                <button
                  key={m.label}
                  type="button"
                  className={i === active ? "is-on" : undefined}
                  aria-pressed={i === active}
                  onClick={() => pick(i)}
                >
                  {m.label.replace(" mode", "")}
                </button>
              ))}
            </div>
          </div>

          <div className="vb-right">
            <div className="vb-readout" aria-live="polite">
              <p className="vb-big">
                <span className="vb-num">{shown}</span>
                <span className="vb-unit">days</span>
              </p>
              <p className="vb-big-label">{mode.label}</p>
              <p className="vb-big-text">{mode.text}</p>
            </div>

            <ul className="vb-modes">
              {modes.map((m, i) => (
                <li key={m.label} className={i === active ? "vb-mode is-on" : "vb-mode"}>
                  <div className="vb-mode-head">
                    <h3>{m.label}</h3>
                    <strong>
                      {m.days} <span>days</span>
                    </strong>
                  </div>
                  <div className="vb-cells" role="img" aria-label={`${m.label}: up to ${m.days} days`}>
                    {Array.from({ length: max }, (_, d) => (
                      <i key={d} className={d < m.days ? "on" : undefined} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <div className="vb-scale" aria-hidden="true">
              {scale.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <ul className="vb-facts">
          <li>
            <strong>{mah} mAh</strong>
            <span>Li-polymer battery</span>
          </li>
          <li>
            <strong>{charge}</strong>
            <span>Full magnetic charge</span>
          </li>
          <li>
            <strong>Magnetic</strong>
            <span>Charger snaps on in a second</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
