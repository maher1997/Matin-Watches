"use client";

import { useRef, useState, type ReactNode } from "react";
import { Athlete, type Sport } from "@/components/sports/rig";
import { sportLibrary } from "@/components/sports/library";

// Every sport the Kaldor names, one at a time: each has its own animated
// place (track, park, road, rock wall, gym) and its own workout log.
// The sport changes by itself every 5 seconds; picking one holds it a while.

const DUR = 5;
const HOLD = 12;
const TAU = Math.PI * 2;
const sin = (t: number) => Math.sin(TAU * t);

// Rock climbing, facing the wall on the right: hands reach up in turn, knees
// step up, and the holds slide down so the climber rises.
const climbing: Sport = {
  id: "climbing",
  name: "Rock climbing",
  dur: 1.6,
  still: 0.25,
  pose: (t) => ({
    lean: -4,
    armF: 152 + 22 * sin(t),
    foreF: 12 + 26 * Math.max(0, -sin(t)),
    armB: 152 - 22 * sin(t),
    foreB: 12 + 26 * Math.max(0, sin(t)),
    legF: 48 + 22 * sin(t),
    shinF: -52 - 14 * sin(t),
    legB: 48 - 22 * sin(t),
    shinB: -52 + 14 * sin(t),
    x: 2,
    y: 2 * sin(t * 2),
  }),
  scene: (k) => (
    <>
      <path d="M50 56 L58 -4" className="ft-rope-line" />
      <g>
        {k.slide(0, 16, 1.6)}
        {[-2, 14, 30, 46, 62, 78, 94].map((y, i) => (
          <ellipse
            key={y}
            cx={i % 2 ? 61 : 63.5}
            cy={y}
            rx={2.6}
            ry={1.8}
            className="ft-hold"
          />
        ))}
      </g>
    </>
  ),
};

const fitness: Sport = {
  ...sportLibrary["jump-rope"],
  id: "fitness",
  name: "Fitness",
};

type Id =
  | "running"
  | "walking"
  | "cycling"
  | "climbing"
  | "fitness";
const SPORTS: { id: Id; name: string; icon: string }[] = [
  {
    id: "running",
    name: "Running",
    icon: "M15 4.5a1.5 1.5 0 1 0 .01 0 M13 8 L10 13 L14 16 L12 21 M10 13 L6 15 M12 9 L16 11 L19 9 M11 9 L8 8 L6 10",
  },
  {
    id: "walking",
    name: "Walking",
    icon: "M13 4.5a1.5 1.5 0 1 0 .01 0 M12 8 L11 14 L13 21 M11 14 L8 21 M12 9 L15 12 M12 9 L9 12",
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: "M6 17a3.5 3.5 0 1 0 .01 0 M18 17a3.5 3.5 0 1 0 .01 0 M6 17 L10 11 L15 11 L18 17 M10 11 L12 17 M14 7a1.3 1.3 0 1 0 .01 0",
  },
  {
    id: "climbing",
    name: "Climbing",
    icon: "M19 3 V21 M12 5a1.5 1.5 0 1 0 .01 0 M12 8 L12 14 M12 9 L17 5 M12 11 L17 12 M12 14 L16 17 M12 14 L9 19",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "M3 9 V15 M6 7 V17 M18 7 V17 M21 9 V15 M6 12 H18",
  },
];

// Places, all 400 x 230 with the ground at y = 200.
const Repeat = ({
  w,
  cls,
  children,
}: {
  w: number;
  cls: string;
  children: ReactNode;
}) => (
  <g className={cls} style={{ ["--w" as string]: `${-w}px` }}>
    <g>{children}</g>
    <g transform={`translate(${w} 0)`}>{children}</g>
  </g>
);

const PLACES: Record<Id, ReactNode> = {
  running: (
    <>
      <rect width="400" height="230" fill="url(#ftDusk)" />
      {[60, 160, 260, 360].map((x) => (
        <g key={x}>
          <line x1={x} y1="58" x2={x} y2="150" className="ft-mast" />
          <circle cx={x} cy="56" r="16" className="ft-flood" />
          <rect
            x={x - 6}
            y="52"
            width="12"
            height="6"
            rx="1.5"
            className="ft-lamp"
          />
        </g>
      ))}
      <path d="M0 150 H400 V172 H0 Z" className="ft-stands" />
      <Repeat w={40} cls="ft-loop ft-fast">
        {Array.from({ length: 11 }, (_, i) => (
          <rect
            key={i}
            x={i * 40}
            y="154"
            width="22"
            height="3"
            rx="1"
            className="ft-seat"
          />
        ))}
      </Repeat>
      <rect y="172" width="400" height="58" className="ft-track" />
      {[184, 200, 216].map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} className="ft-lane" />
      ))}
      <Repeat w={80} cls="ft-loop ft-fast">
        {Array.from({ length: 6 }, (_, i) => (
          <text key={i} x={i * 80 + 30} y="212" className="ft-lane-num">
            {(i % 3) + 3}
          </text>
        ))}
      </Repeat>
    </>
  ),
  walking: (
    <>
      <rect width="400" height="230" fill="url(#ftMorning)" />
      <circle cx="300" cy="78" r="26" className="ft-sun" />
      <Repeat w={200} cls="ft-loop ft-slow">
        <path
          d="M0 170 Q50 120 100 165 Q150 115 200 170 V200 H0 Z"
          className="ft-hill-far"
        />
      </Repeat>
      <Repeat w={100} cls="ft-loop ft-mid">
        <g className="ft-tree">
          <rect x="47" y="150" width="4" height="34" />
          <circle cx="49" cy="146" r="14" />
          <circle cx="40" cy="156" r="9" />
          <circle cx="58" cy="156" r="10" />
        </g>
      </Repeat>
      <rect y="184" width="400" height="46" className="ft-grass" />
      <rect y="196" width="400" height="10" className="ft-path" />
      <Repeat w={30} cls="ft-loop ft-walk">
        {Array.from({ length: 15 }, (_, i) => (
          <circle
            key={i}
            cx={i * 30 + 6}
            cy="214"
            r="1.3"
            className="ft-pebble"
          />
        ))}
      </Repeat>
    </>
  ),
  cycling: (
    <>
      <rect width="400" height="230" fill="url(#ftDusk)" />
      <Repeat w={400} cls="ft-loop ft-slow">
        <path
          d="M0 150 L60 112 L110 138 L170 96 L240 140 L300 108 L360 136 L400 150 V200 H0 Z"
          className="ft-mtn"
        />
      </Repeat>
      <Repeat w={200} cls="ft-loop ft-mid">
        <path
          d="M0 175 Q50 145 100 172 Q150 150 200 175 V200 H0 Z"
          className="ft-hill"
        />
      </Repeat>
      <rect y="186" width="400" height="44" className="ft-road-bg" />
      <Repeat w={50} cls="ft-loop ft-fast">
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={i * 50}
            y="207"
            width="26"
            height="2.4"
            className="ft-road-dash"
          />
        ))}
      </Repeat>
    </>
  ),
  climbing: (
    <>
      <rect width="400" height="230" fill="url(#ftMorning)" />
      <Repeat w={200} cls="ft-loop ft-slow">
        <path
          d="M0 230 L40 180 L90 200 L140 160 L200 190 V230 Z"
          className="ft-hill-far"
        />
      </Repeat>
      <path
        d="M212 0 H400 V230 H209 L214 180 L207 120 L214 60 L209 0 Z"
        className="ft-cliff"
      />
      <g className="ft-cracks">
        <path d="M260 20 l20 30 l-8 40 M320 70 l-14 40 l18 50 M360 10 l-10 60" />
      </g>
    </>
  ),
  fitness: (
    <>
      <rect width="400" height="230" className="ft-gym-wall" />
      {[40, 150, 260].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="36"
            width="96"
            height="88"
            rx="4"
            className="ft-window"
          />
          <path
            d={`M${x + 48} 36 V124 M${x} 80 H${x + 96}`}
            className="ft-window-bar"
          />
        </g>
      ))}
      <path d="M0 200 L400 200" className="ft-floor-edge" />
      <rect y="200" width="400" height="30" className="ft-gym-floor" />
      <g className="ft-rack">
        <rect x="318" y="156" width="64" height="4" />
        {[326, 342, 358, 374].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="146" width="3" height="10" rx="1" />
            <rect x={x + 1} y="146" width="3" height="10" rx="1" />
          </g>
        ))}
        <path d="M322 160 V198 M378 160 V198" />
      </g>
      <g className="ft-rack">
        <circle cx="48" cy="190" r="10" />
        <rect x="43" y="174" width="10" height="7" rx="3" />
      </g>
    </>
  ),
};

type Stat = [string, string, string?];
function stats(
  id: Id,
  t: number,
  tl: number,
): { hero: Stat; sub: string; items: Stat[] } {
  const wob = (base: number, a: number, s: number) =>
    Math.round(base + a * Math.sin(t / s) + (a / 3) * Math.sin(t / 0.8));
  const clock = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  switch (id) {
    case "running":
      return {
        hero: ["Distance", (3.18 + tl * 0.011).toFixed(2), "km"],
        sub: "Outdoor run",
        items: [
          ["Pace", "5:12", "/km"],
          ["Cadence", String(wob(168, 3, 1.6)), "spm"],
          ["Time", clock(992 + tl)],
          ["Heart rate", String(wob(148, 4, 2)), "bpm"],
        ],
      };
    case "walking":
      return {
        hero: [
          "Steps",
          Math.round(6420 + tl * 1.9).toLocaleString("en-US"),
          "",
        ],
        sub: "Outdoor walk",
        items: [
          ["Distance", (4.61 + tl * 0.0014).toFixed(2), "km"],
          ["Calories", String(Math.round(212 + tl * 0.12)), "kcal"],
          ["Time", clock(3105 + tl)],
          ["Heart rate", String(wob(98, 3, 2)), "bpm"],
        ],
      };
    case "cycling":
      return {
        hero: ["Speed", (27.4 + 0.8 * Math.sin(t / 1.3)).toFixed(1), "km/h"],
        sub: "Outdoor ride",
        items: [
          ["Distance", (12.6 + tl * 0.0076).toFixed(2), "km"],
          ["Cadence", String(wob(86, 3, 1.4)), "rpm"],
          ["Time", clock(1655 + tl)],
          ["Heart rate", String(wob(138, 4, 2)), "bpm"],
        ],
      };
    case "climbing":
      return {
        hero: ["Climbed", `+${Math.round(42 + tl * 0.6)}`, "m"],
        sub: "Rock climbing",
        items: [
          ["Routes", "3", ""],
          ["Calories", String(Math.round(318 + tl * 0.2)), "kcal"],
          ["Time", clock(2290 + tl)],
          ["Heart rate", String(wob(141, 5, 2)), "bpm"],
        ],
      };
    case "fitness":
      return {
        hero: ["Jumps", String(Math.round(320 + tl * 3)), ""],
        sub: "Fitness · jump rope",
        items: [
          ["Rate", String(wob(178, 3, 1.5)), "/min"],
          ["Calories", String(Math.round(96 + tl * 0.25)), "kcal"],
          ["Time", clock(108 + tl)],
          ["Heart rate", String(wob(156, 4, 2)), "bpm"],
        ],
      };
  }
}

export default function Multi({ t, count }: { t: number; count: string }) {
  const [base, setBase] = useState({ idx: 0, at: 0 });
  const since = useRef({ id: -1, t: 0 });
  const n = SPORTS.length;
  const active =
    (((base.idx + Math.floor(Math.max(0, t - base.at) / DUR)) % n) + n) % n;
  if (since.current.id !== active) since.current = { id: active, t };
  const tl = Math.max(0, t - since.current.t);
  const sport = SPORTS[active];
  const s = stats(sport.id, t, tl);
  const pick = (i: number) => setBase({ idx: i, at: t + HOLD - DUR });

  return (
    <div className="ft-body ft-multi-body">
      <div
        className="ft-tabs"
        role="tablist"
        aria-label={`${count} sport modes, some of them`}
      >
        {SPORTS.map((sp, i) => (
          <button
            key={sp.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`ft-tab${i === active ? " on" : ""}`}
            onClick={() => pick(i)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={sp.icon} />
            </svg>
            <span>{sp.name}</span>
            {i === active && (
              <i key={`${since.current.t}`} className="ft-tab-bar" />
            )}
          </button>
        ))}
      </div>

      <div className="ft-arena-wrap">
        <div
          className={`ft-scene ft-arena ft-arena-${sport.id}`}
          key={sport.id}
        >
          <span className="hm-badge">Illustrative</span>
          <svg
            viewBox="0 0 400 230"
            className="ft-place"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="ftDusk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0d1418" />
                <stop offset="1" stopColor="#173027" />
              </linearGradient>
              <linearGradient id="ftMorning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10181a" />
                <stop offset="1" stopColor="#21362a" />
              </linearGradient>
            </defs>
            {PLACES[sport.id]}
          </svg>
          <div
            className="ft-ath"
            role="img"
            aria-label={`Athlete ${sport.name.toLowerCase()}`}
          >
            <Athlete
              sport={
                sport.id === "climbing"
                  ? climbing
                  : sport.id === "fitness"
                    ? fitness
                    : sportLibrary[sport.id]
              }
            />
          </div>
          <span className="ft-arena-name">{sport.name}</span>
        </div>

        <div className="ft-panel" aria-live="off">
          <div className="ft-hero-stat">
            <span className="ft-k">{s.hero[0]}</span>
            <strong>
              {s.hero[1]}
              {s.hero[2] && <small>{s.hero[2]}</small>}
            </strong>
            <span className="ft-sub">{s.sub}</span>
          </div>
          <dl className="ft-grid">
            {s.items.map(([k, v, u]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  {k === "Heart rate" && (
                    <span className="ft-heart" aria-hidden="true" />
                  )}
                  {v}
                  {u && <small>{u}</small>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
