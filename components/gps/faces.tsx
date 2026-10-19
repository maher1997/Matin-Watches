"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Screen } from "@/components/health/faces";

// GPS screens drawn on the watch's own display, like the health section
// (same .hw- screen classes and per-watch background look). Route and
// altitude are driven by one progress value p (0 to 1) from GpsShowcase so
// the trail, the moving dot and the numbers stay in step. Everything here is
// an illustrative sample, not a real recording.

export type GpsScreen = "route" | "sats" | "compass" | "alt";

// Map contour lines: wobbly rings round a hill.
const contour = (cx: number, cy: number, r: number, k: number) =>
  Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const rr =
      r * (1 + 0.12 * Math.sin(3 * a + k) + 0.06 * Math.sin(5 * a + 2 * k));
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

// Deterministic scatter for the terrain map (no Math.random, so server and
// browser draw the same dots).
const SCATTER = Array.from({ length: 140 }, (_, i) => {
  const x = (i * 73.13) % 200;
  const y = (i * 41.77 + (i % 7) * 13) % 200;
  return [x, y, 0.6 + ((i * 17) % 10) / 12] as const;
});

// Each watch has its own map and sample route on the 200 x 200 screen box:
// Trekon a topographic trail map, Kaldor a tactical grid with waypoints,
// Varkon a dark terrain map with a river.
export const MAPS = {
  cells: {
    kind: "topo",
    route:
      "M56 136 C64 122 60 108 74 100 S98 94 100 82 S90 60 106 54 S134 58 140 74 S128 102 142 112 S158 120 154 138",
    start: { x: 56, y: 136 },
    end: { x: 154, y: 138 },
    mi: 3.62,
    seconds: 35 * 60 + 29,
    label: "Trail",
  },
  radar: {
    kind: "grid",
    route:
      "M48 150 L48 112 L84 112 L84 76 L118 76 L132 56 L156 56 L156 98 L128 120 L128 148",
    start: { x: 48, y: 150 },
    end: { x: 128, y: 148 },
    mi: 5.1,
    seconds: 52 * 60 + 14,
    label: "Patrol",
  },
  rings: {
    kind: "terrain",
    route:
      "M40 92 C52 70 74 60 92 66 S118 92 136 84 S164 52 150 40 C142 30 120 34 112 48",
    start: { x: 40, y: 92 },
    end: { x: 112, y: 48 },
    mi: 2.48,
    seconds: 21 * 60 + 6,
    label: "Run",
  },
} as const;
export const mapOf = (look?: string) =>
  look === "radar" ? MAPS.radar : look === "rings" ? MAPS.rings : MAPS.cells;

const CONTOURS = [
  ...[14, 26, 38, 50, 62, 76].map((r, i) => contour(124, 70, r, i * 0.5)),
  ...[10, 20, 31, 42].map((r, i) => contour(58, 132, r, 2 + i * 0.6)),
];
const GRID = Array.from({ length: 11 }, (_, i) => i * 20);
const WAYPOINTS = [
  [84, 112],
  [118, 76],
  [156, 56],
  [156, 98],
];

// Sample altitude profile on a 160 x 60 box (y down), and its range in feet.
const ALT_PTS = Array.from({ length: 41 }, (_, i) => {
  const x = i * 4;
  const y = 50 - i * 0.82 - 6 * Math.sin(i / 3.2) - 3 * Math.sin(i / 1.4);
  return [x, Math.max(4, Math.min(56, y))] as const;
});
export const ALT_LINE = ALT_PTS.map(
  ([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`,
).join(" ");
const ALT_AREA = `${ALT_LINE} L160 60 L0 60 Z`;
const FT_LOW = 820;
const FT_HIGH = 1284;
export const altFeet = (p: number) => {
  const f = Math.min(ALT_PTS.length - 1, Math.max(0, p * (ALT_PTS.length - 1) || 0));
  const i = Math.floor(f);
  const [, y0] = ALT_PTS[i];
  const [, y1] = ALT_PTS[Math.min(ALT_PTS.length - 1, i + 1)];
  const y = y0 + (y1 - y0) * (f - i);
  const top = Math.min(...ALT_PTS.map(([, v]) => v));
  const bottom = Math.max(...ALT_PTS.map(([, v]) => v));
  return Math.round(
    FT_LOW + ((bottom - y) / (bottom - top)) * (FT_HIGH - FT_LOW),
  );
};

const DIRS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];
export const dirName = (deg: number) =>
  DIRS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];

const ticks = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const big = i % (n / 12) === 0;
    const r0 = big ? 78 : 82;
    return (
      <line
        key={i}
        x1={(100 + r0 * Math.sin(a)).toFixed(2)}
        y1={(100 - r0 * Math.cos(a)).toFixed(2)}
        x2={(100 + 88 * Math.sin(a)).toFixed(2)}
        y2={(100 - 88 * Math.cos(a)).toFixed(2)}
        className={big ? "gw-tick big" : "gw-tick"}
      />
    );
  });

// Satellite orbits round the globe: [tilt degrees, seconds per lap].
const ORBITS: [number, number][] = [
  [-28, 9],
  [32, 12],
  [88, 15],
];
const ORBIT_PATH = "M22 100 A78 26 0 1 0 178 100 A78 26 0 1 0 22 100 Z";

const pace = (m: { mi: number; seconds: number }) => {
  const s = m.seconds / m.mi;
  return `${Math.floor(s / 60)}'${String(Math.round(s % 60)).padStart(2, "0")}"`;
};

const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function GpsWatch({
  image,
  imageAlt,
  screen,
  screens,
  active,
  look = "wave",
  p,
  heading,
  sats,
  locked,
  systems,
  barometric,
}: {
  image: string;
  imageAlt: string;
  screen: Screen;
  screens: GpsScreen[];
  active: GpsScreen;
  look?: string;
  p: number;
  heading: number;
  sats: number;
  locked: boolean;
  systems: string[];
  barometric?: boolean;
}) {
  const map = mapOf(look);
  const routeRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (routeRef.current) setLen(routeRef.current.getTotalLength());
  }, []);
  const dot =
    len && routeRef.current
      ? routeRef.current.getPointAtLength(len * p)
      : map.end;
  const altIdx = Math.min(
    ALT_PTS.length - 1,
    Math.max(0, Math.round(p * (ALT_PTS.length - 1)) || 0),
  );
  const [ax, ay] = ALT_PTS[altIdx];

  const round = "r" in screen;
  const box = round
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
  const face = (id: GpsScreen) => ({
    className: `hw-face gw-${id} gw-map-${map.kind}${active === id ? " on" : ""}`,
    "aria-hidden": active !== id,
  });

  return (
    <figure className="hw">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(max-width: 860px) 90vw, 46vw"
        quality={75}
      />
      <div
        className={`hw-screen hw-look-${look}${round ? "" : " hw-shaped"}`}
        style={box}
      >
        {screens.includes("route") && (
          <div {...face("route")}>
            <svg className="gw-map" viewBox="0 0 200 200" aria-hidden="true">
              {map.kind === "topo" &&
                CONTOURS.map((c, i) => (
                  <polyline key={i} points={c} className="gw-contour" />
                ))}
              {map.kind === "grid" && (
                <>
                  {GRID.map((g) => (
                    <g key={g} className="gw-grid">
                      <line x1={g} y1="0" x2={g} y2="200" />
                      <line x1="0" y1={g} x2="200" y2={g} />
                    </g>
                  ))}
                  <rect
                    x="96"
                    y="96"
                    width="22"
                    height="16"
                    className="gw-block"
                  />
                  <rect
                    x="60"
                    y="56"
                    width="30"
                    height="12"
                    className="gw-block"
                  />
                  <rect
                    x="138"
                    y="122"
                    width="16"
                    height="26"
                    className="gw-block"
                  />
                </>
              )}
              {map.kind === "terrain" && (
                <>
                  {SCATTER.map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} className="gw-speck" />
                  ))}
                  <path
                    d="M0 150 C40 132 70 160 104 140 S160 126 200 140"
                    className="gw-river"
                  />
                </>
              )}
              <path d={map.route} className="gw-trail-ghost" />
              <path
                ref={routeRef}
                d={map.route}
                className="gw-trail"
                style={
                  len
                    ? { strokeDasharray: len, strokeDashoffset: len * (1 - p) }
                    : undefined
                }
              />
              {map.kind === "grid" &&
                WAYPOINTS.map(([x, y], i) => (
                  <path
                    key={i}
                    d={`M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z`}
                    className="gw-wp"
                  />
                ))}
              <circle
                cx={map.start.x}
                cy={map.start.y}
                r="4.5"
                className="gw-start"
              />
              <g
                transform={`translate(${dot.x.toFixed(1)} ${dot.y.toFixed(1)})`}
              >
                <circle r="11" className="gw-pulse" />
                <circle r="5" className="gw-dot" />
              </g>
            </svg>
            <span className="gw-top">
              <i className="gw-live" /> GPS · {map.label}
            </span>
            <span className="gw-stats">
              <span className="gw-big">
                {(map.mi * p).toFixed(2)}
                <small>mi</small>
              </span>
              <span className="gw-sub">
                {fmtTime(map.seconds * p)} · {pace(map)}/mi
              </span>
            </span>
          </div>
        )}

        {screens.includes("sats") && (
          <div {...face("sats")}>
            <svg className="gw-sky" viewBox="0 0 200 200" aria-hidden="true">
              <g className="gw-globe">
                <circle cx="100" cy="100" r="34" className="gw-earth" />
                {[0, 1, 2].map((i) => (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="100"
                    rx="34"
                    ry="34"
                    className="gw-meridian"
                  >
                    <animate
                      attributeName="rx"
                      values="34;0;34"
                      dur="6s"
                      begin={`${-i * 2}s`}
                      repeatCount="indefinite"
                    />
                  </ellipse>
                ))}
                <line
                  x1="66"
                  y1="100"
                  x2="134"
                  y2="100"
                  className="gw-meridian"
                />
                <ellipse
                  cx="100"
                  cy="86"
                  rx="30"
                  ry="4"
                  className="gw-meridian"
                />
                <ellipse
                  cx="100"
                  cy="114"
                  rx="30"
                  ry="4"
                  className="gw-meridian"
                />
              </g>
              {ORBITS.map(([tilt, dur], i) => (
                <g key={i} transform={`rotate(${tilt} 100 100)`}>
                  <path d={ORBIT_PATH} className="gw-orbit" />
                  {[0, 1].map((j) => (
                    <g key={j}>
                      <circle r="3.2" className="gw-sat" />
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${-(j * dur) / 2 - i}s`}
                        repeatCount="indefinite"
                        path={ORBIT_PATH}
                      />
                    </g>
                  ))}
                </g>
              ))}
            </svg>
            <span className={locked ? "gw-status ok" : "gw-status"}>
              <i /> {locked ? "Signal locked" : "Searching"}
            </span>
            <span className="hw-num hw-num-sm gw-satnum">{sats}</span>
            <span className="hw-unit">satellites</span>
            <span className="gw-chips">
              {systems.map((s, i) => (
                <i key={s} style={{ animationDelay: `${0.25 + i * 0.22}s` }}>
                  {s}
                </i>
              ))}
            </span>
          </div>
        )}

        {screens.includes("compass") && (
          <div {...face("compass")}>
            <svg className="gw-rose" viewBox="0 0 200 200" aria-hidden="true">
              <g transform={`rotate(${(-heading).toFixed(1)} 100 100)`}>
                {ticks(72)}
                {(["N", "E", "S", "W"] as const).map((d, i) => (
                  <text
                    key={d}
                    x={100 + 66 * Math.sin((i * Math.PI) / 2)}
                    y={100 - 66 * Math.cos((i * Math.PI) / 2)}
                    className={d === "N" ? "gw-cardinal n" : "gw-cardinal"}
                    transform={`rotate(${heading.toFixed(1)} ${100 + 66 * Math.sin((i * Math.PI) / 2)} ${100 - 66 * Math.cos((i * Math.PI) / 2)})`}
                  >
                    {d}
                  </text>
                ))}
                <path
                  d="M100 40 L106 100 L100 94 L94 100 Z"
                  className="gw-needle-n"
                />
                <path
                  d="M100 160 L106 100 L100 106 L94 100 Z"
                  className="gw-needle-s"
                />
              </g>
              <path d="M100 6 L106 16 L94 16 Z" className="gw-index" />
            </svg>
            <span className="gw-heading">
              <span className="gw-deg">
                {Math.round(((heading % 360) + 360) % 360)}°
              </span>
              <span className="gw-dir">{dirName(heading)}</span>
            </span>
            <span className="gw-altchip">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" />
              </svg>
              {FT_HIGH.toLocaleString("en-US")} ft
            </span>
          </div>
        )}

        {screens.includes("alt") && (
          <div {...face("alt")}>
            <span className="hw-label gw-alt-label">
              {barometric ? "Barometric altitude" : "Altitude"}
            </span>
            <span className="hw-num hw-num-sm">
              {altFeet(p).toLocaleString("en-US")}
            </span>
            <span className="hw-unit">feet</span>
            <span className="gw-profile">
              <svg
                viewBox="0 0 160 60"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="gw-alt-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#34d97f" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#34d97f" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="gw-alt-clip">
                    <rect x="0" y="0" width={160 * p} height="60" />
                  </clipPath>
                </defs>
                <path d={ALT_AREA} className="gw-alt-ghost" />
                <g clipPath="url(#gw-alt-clip)">
                  <path d={ALT_AREA} fill="url(#gw-alt-fill)" />
                  <path d={ALT_LINE} className="gw-alt-line" />
                </g>
                <line
                  x1={ax}
                  y1={ay}
                  x2={ax}
                  y2="60"
                  className="gw-alt-cursor"
                />
              </svg>
              <i
                className="gw-alt-dot"
                style={{
                  left: `${(ax / 160) * 100}%`,
                  top: `${(ay / 60) * 100}%`,
                }}
              />
            </span>
            <span className="gw-climb">
              ▲ {(altFeet(p) - FT_LOW).toLocaleString("en-US")} ft climbed
            </span>
          </div>
        )}

        <span className="hw-glass" aria-hidden="true" />
      </div>
    </figure>
  );
}
