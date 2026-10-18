"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SectionHead from "@/components/SectionHead";

// Flashlight showcase: the real watch at night, lighting up a dark scene.
// "beam" (Kaldor): the side LED throws a cone of light across a pine forest,
// with High / Low / Flash modes. "screen" (Torvan, Varkon): the watch's own
// screen turns into the light and a pool of light opens round it, over a
// campsite (warm, Torvan) or rocky ground (cool, with light rings, Varkon).
// The scene is drawn twice, dark and lit; the light decides what of the lit
// copy shows. Renders lit without JavaScript; motion pauses off screen.

type Scene = "forest" | "camp" | "rocks";

const pine = (x: number, base: number, h: number, w: number) => {
  const tiers = 4;
  let d = `M${x - 3} ${base} h6 v-${h * 0.18} h-6 Z`;
  for (let i = 0; i < tiers; i++) {
    const top = base - h * 0.18 - (h * 0.82 * i) / tiers - h * 0.1;
    const half = (w / 2) * (1 - i / (tiers + 1));
    d += ` M${x} ${top - (h * 0.82) / tiers - h * 0.12} L${x + half} ${top + h * 0.06} L${x - half} ${top + h * 0.06} Z`;
  }
  return d;
};

const SCENES: Record<Scene, { ground: string; shapes: string }> = {
  forest: {
    ground: "M0 820 C300 790 520 840 800 810 S1300 780 1600 805 V1000 H0 Z",
    shapes: [
      pine(980, 815, 420, 190),
      pine(1130, 805, 520, 230),
      pine(1300, 800, 380, 170),
      pine(1460, 805, 560, 250),
      pine(860, 818, 300, 140),
      pine(1560, 800, 330, 150),
      "M1040 840 c30 -26 90 -30 120 -4 c10 10 4 22 -12 24 h-100 c-14 0 -18 -10 -8 -20 Z",
      "M1240 860 c20 -18 60 -20 82 -2 c8 8 2 16 -8 16 h-68 c-10 0 -14 -6 -6 -14 Z",
    ].join(" "),
  },
  camp: {
    ground: "M0 840 C400 820 800 860 1200 830 S1500 820 1600 835 V1000 H0 Z",
    shapes: [
      "M560 845 L760 590 L960 845 Z M760 590 L740 845 M760 590 L780 845",
      "M1080 860 h120 l-12 -18 h-96 Z M1100 842 l20 -40 l20 40 M1140 842 l20 -40 l20 40",
      pine(1330, 835, 460, 210),
      pine(1480, 830, 360, 170),
      pine(240, 845, 380, 180),
      pine(110, 840, 470, 220),
    ].join(" "),
  },
  rocks: {
    ground: "M0 850 C260 830 520 870 820 845 S1360 830 1600 850 V1000 H0 Z",
    shapes: [
      "M420 850 L520 700 L600 760 L700 640 L860 850 Z",
      "M980 860 L1060 760 L1150 800 L1240 720 L1380 860 Z",
      "M1400 860 L1470 780 L1560 820 L1600 790 V860 Z",
      "M180 860 L240 790 L320 820 L380 860 Z",
      "M700 880 c20 -20 60 -22 80 -4 c6 8 0 14 -10 14 h-60 c-12 0 -16 -4 -10 -10 Z",
    ].join(" "),
  },
};

type Mode = {
  label: string;
  text: string;
  level: "high" | "low" | "flash" | "on" | "off";
};

export default function Flashlight({
  name,
  variant,
  scene,
  image,
  imageAlt,
  point,
  intro,
  modes,
  tone = "white",
}: {
  name: string;
  variant: "beam" | "screen";
  scene: Scene;
  image: string;
  imageAlt: string;
  // Where the light comes from, in % of the photo: the LED (beam) or the
  // screen circle (screen, with r).
  point: { x: number; y: number; r?: number };
  intro: string;
  modes: Mode[];
  tone?: "white" | "warm";
}) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(0);
  const s = SCENES[scene];
  const mode = modes[active];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setTimeout(
      () => setActive((a) => (a + 1) % modes.length),
      Math.max(mode.level === "off" ? 1800 : 4200, held - Date.now()),
    );
    return () => window.clearTimeout(t);
  }, [active, live, held, modes.length, mode.level]);

  const pick = (i: number) => {
    setActive(i);
    setHeld(Date.now() + 12000);
  };

  const scenery = (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path d={s.ground} className="fl-ground" />
      <path d={s.shapes} className="fl-shapes" />
    </svg>
  );

  return (
    <section
      ref={ref}
      id="flashlight"
      className={`section hm fl fl-${variant} fl-${scene} fl-${tone} fl-${mode.level}${live ? "" : " fl-paused"}`}
      aria-labelledby="fl-title"
    >
      <SectionHead
        id="fl-title"
        eyebrow="Flashlight"
        title={
          <>
            Light the way. <span className="grad">From your wrist.</span>
          </>
        }
        intro={intro}
      />

      <div
        className="fl-stage"
        style={
          {
            "--px": point.x,
            "--py": point.y,
            "--pr": point.r ?? 0,
          } as CSSProperties
        }
        role="img"
        aria-label={`${name} lighting up a dark ${scene === "forest" ? "forest" : scene === "camp" ? "campsite" : "trail"} at night`}
      >
        <div className="fl-sky" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 38}%`,
                animationDelay: `${(i % 5) * 0.7}s`,
              }}
            />
          ))}
        </div>
        <div className="fl-dark">{scenery}</div>
        <div className="fl-lit">{scenery}</div>
        {variant === "beam" ? (
          <span className="fl-beam" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i
                key={i}
                style={{
                  top: `${30 + ((i * 29) % 40)}%`,
                  animationDelay: `${(i * 0.43) % 4}s`,
                }}
              />
            ))}
          </span>
        ) : (
          <>
            <span className="fl-pool" aria-hidden="true" />
            {scene === "rocks" &&
              [0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="fl-ring"
                  style={{ animationDelay: `${i * 1.1}s` }}
                  aria-hidden="true"
                />
              ))}
          </>
        )}
        <figure className="fl-watch">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 860px) 70vw, 40vw"
            quality={75}
          />
          {variant === "beam" ? (
            <span className="fl-led" />
          ) : (
            <span className="fl-screen">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 2h8v4l-2 4v10a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V10L8 6Z M8 6h8 M12 13v2" />
              </svg>
            </span>
          )}
        </figure>
      </div>

      <div className="fl-modes" role="group" aria-label="Light modes">
        {modes.map((m, i) => (
          <button
            key={m.label}
            type="button"
            className={i === active ? "fl-mode on" : "fl-mode"}
            aria-pressed={i === active}
            onClick={() => pick(i)}
          >
            <span className={`fl-mode-dot ${m.level}`} aria-hidden="true" />
            <strong>{m.label}</strong>
            <span>{m.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
