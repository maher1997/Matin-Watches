"use client";

import { useRef } from "react";

// Triathlon course: open water, a road over the hills and a trail up to the
// finish. Each leg draws itself in turn while its split counts up; a small
// badge rides the line showing the current sport. Driven by one time value
// t (seconds) so the drawing and the numbers agree.

const LEG = 5.2;
const HOLD = 2.4;
const LOOP = LEG * 3 + HOLD;

// The finished race, for the first paint and reduced motion.
export const TRI_STILL = LEG * 3 + 0.5;

type LegId = "swim" | "bike" | "run";
const LEGS: {
  id: LegId;
  name: string;
  km: number;
  secs: number;
  hr: number;
  d: string;
}[] = [
  {
    id: "swim",
    name: "Swim",
    km: 1.5,
    secs: 28 * 60 + 40,
    hr: 138,
    d: "M22 212 C48 202 66 222 92 210 S128 198 146 206",
  },
  {
    id: "bike",
    name: "Bike",
    km: 40,
    secs: 72 * 60 + 5,
    hr: 146,
    d: "M146 206 C182 212 196 176 232 175 S270 184 286 160",
  },
  {
    id: "run",
    name: "Run",
    km: 10,
    secs: 46 * 60 + 30,
    hr: 158,
    d: "M286 160 L304 142 L316 148 L332 120 L346 126 L362 88 L378 70",
  },
];

const ICON: Record<LegId, string> = {
  swim: "M-6 3 q3 -2 6 0 t6 0 M-4 -1 l4 -3 l3 1 M3 -5 a1.6 1.6 0 1 0 0.01 0",
  bike: "M-4.5 3 a3 3 0 1 0 0.01 0 M4.5 3 a3 3 0 1 0 0.01 0 M-4.5 3 L-1 -2 L3 -2 L4.5 3 M-1 -2 L1 3",
  run: "M1.5 -6 a1.6 1.6 0 1 0 0.01 0 M0.5 -3 L-1 2 L2 6 M-1 2 L-4 5 M0 -2 L3 0 M0 -2 L-3 -1",
};

const clock = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = String(m).padStart(h ? 2 : 1, "0");
  return `${h ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
};

export default function Tri({ t, count }: { t: number; count: string }) {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const u = ((t % LOOP) + LOOP) % LOOP;
  const leg = Math.min(2, Math.floor(u / LEG));
  const done = u >= LEG * 3;
  const progress = (k: number) =>
    done ? 1 : k < leg ? 1 : k > leg ? 0 : (u - LEG * k) / LEG;

  const cur = LEGS[leg];
  const f = progress(leg);
  // Badge position on the active line (measured once the SVG is in the page).
  const el = paths.current[leg];
  let pos: [number, number] = done ? [378, 70] : [22, 212];
  if (el) {
    const p = el.getPointAtLength(el.getTotalLength() * f);
    pos = [p.x, p.y];
  }
  const elapsed = LEGS.reduce((sum, l, k) => sum + l.secs * progress(k), 0);
  const hr = Math.round(cur.hr + 4 * Math.sin(t / 1.7) + 2 * Math.sin(t / 0.7));
  const toast = done
    ? "Finish · splits saved"
    : leg === 0
      ? "Open water swim · recognised"
      : `${cur.name} · next leg`;

  return (
    <div className="ft-body ft-tri-body">
      <ol className="ft-legs">
        {LEGS.map((l, k) => {
          const p = progress(k);
          const state = p >= 1 ? "done" : k === leg ? "on" : "next";
          return (
            <li key={l.id} className={`ft-leg ft-leg-${l.id} is-${state}`}>
              <svg viewBox="-8 -8 16 16" aria-hidden="true" focusable="false">
                <path d={ICON[l.id]} />
              </svg>
              <span className="ft-leg-name">{l.name}</span>
              <span className="ft-leg-km">
                {(l.km * p).toFixed(l.km < 10 ? 2 : 1)}
                <small> / {l.km} km</small>
              </span>
              <span className="ft-leg-time">{clock(l.secs * p)}</span>
              <span
                className="ft-leg-bar"
                style={{ transform: `scaleX(${p})` }}
              />
            </li>
          );
        })}
      </ol>

      <div className="ft-tri-main">
        <div className="ft-scene">
          <span className="hm-badge">Illustrative</span>
          <span key={done ? "end" : leg} className="ft-toast">
            {toast}
          </span>
          <svg
            viewBox="0 36 400 214"
            className="ft-tri-svg"
            role="img"
            aria-label="Triathlon course: swim, bike and run legs drawing in turn"
          >
            <defs>
              <linearGradient id="ftSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0f3d55" />
                <stop offset="1" stopColor="#081d2a" />
              </linearGradient>
              <linearGradient id="ftHill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1d2a2c" />
                <stop offset="1" stopColor="#10161a" />
              </linearGradient>
              <linearGradient id="ftPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2a3236" />
                <stop offset="1" stopColor="#12171b" />
              </linearGradient>
              <pattern
                id="ftDots"
                width="14"
                height="14"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="0.7" fill="#ffffff" opacity="0.08" />
              </pattern>
            </defs>

            <rect width="400" height="250" fill="url(#ftDots)" />
            {/* Far ridge, hills, then the mountain with the trail. */}
            <path
              d="M150 250 L210 150 L238 168 L270 120 L300 150 L330 96 L400 140 V250 Z"
              className="ft-ridge"
            />
            <path d="M110 250 Q190 150 300 250 Z" fill="url(#ftHill)" />
            <path
              d="M248 250 L288 168 L306 150 L318 156 L334 128 L348 134 L364 96 L378 78 L392 94 L400 102 V250 Z"
              fill="url(#ftPeak)"
            />
            {[
              [262, 214],
              [276, 200],
              [300, 206],
              [322, 186],
            ].map(([px, py]) => (
              <path
                key={px}
                d={`M${px} ${py} l5 -12 l5 12 Z`}
                className="ft-pine"
              />
            ))}
            {/* Open water. */}
            <path d="M0 196 Q80 188 160 200 V250 H0 Z" fill="url(#ftSea)" />
            <g className="ft-waves">
              {[0, 1, 2, 3].map((k) => (
                <path
                  key={k}
                  d={`M-40 ${206 + k * 11} q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0`}
                />
              ))}
            </g>
            <circle cx="58" cy="203" r="2.6" className="ft-buoy" />
            <circle cx="118" cy="200" r="2.6" className="ft-buoy" />
            {/* Road under the bike leg. */}
            <path d={LEGS[1].d} className="ft-road" />
            <path d={LEGS[1].d} className="ft-road-line" />

            {/* The course: faint full route, then each leg drawn so far. */}
            {LEGS.map((l) => (
              <path key={`g${l.id}`} d={l.d} className="ft-route-ghost" />
            ))}
            {LEGS.map((l, k) => (
              <path
                key={l.id}
                ref={(e) => {
                  paths.current[k] = e;
                }}
                d={l.d}
                pathLength={1}
                className={`ft-route ft-route-${l.id}`}
                style={{ strokeDashoffset: 1 - progress(k) }}
              />
            ))}
            <circle cx="22" cy="212" r="3.4" className="ft-start" />
            <g transform="translate(378 70)" className="ft-flag">
              <path d="M0 0 V-16" />
              <path
                d="M0 -16 h10 l-2.5 3.5 l2.5 3.5 h-10 Z"
                className="ft-flag-cloth"
              />
            </g>

            {/* The athlete: a badge with the current sport. */}
            <g
              transform={`translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)})`}
            >
              <circle r="13" className={`ft-glow ft-glow-${cur.id}`} />
              <circle r="8.5" className="ft-badge-dot" />
              <path
                d={ICON[done ? "run" : cur.id]}
                className="ft-badge-icon"
                transform="scale(0.78)"
              />
            </g>
          </svg>
        </div>

        <div className="ft-tri-stats">
          <div>
            <span className="ft-k">Total time</span>
            <strong>{clock(elapsed)}</strong>
          </div>
          <div>
            <span className="ft-k">
              {leg === 0 && !done ? "Underwater heart rate" : "Heart rate"}
            </span>
            <strong>
              <span className="ft-heart" aria-hidden="true" />
              {hr}
              <small>bpm</small>
            </strong>
          </div>
          <div>
            <span className="ft-k">Sport modes</span>
            <strong>{count}</strong>
          </div>
          <div>
            <span className="ft-k">Smart recognition</span>
            <strong className="ft-on">
              <span className="ft-switch" aria-hidden="true" />
              On
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
