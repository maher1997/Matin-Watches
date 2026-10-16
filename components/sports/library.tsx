import type { ReactNode } from "react";
import { FLOOR, HIP, armIk, bump, keyed, legIk, rot, type Pt, type Sport } from "./rig";

// Every sport the store can show. A product lists the ids it really
// supports (Product.sportModes), so a watch never shows a sport it can't track.
// To add a sport: give it a pose over one loop and any props it needs.

const TAU = Math.PI * 2;
const sin = (t: number) => Math.sin(TAU * t);
const cos = (t: number) => Math.cos(TAU * t);

const floor = <line x1={6} y1={FLOOR} x2={94} y2={FLOOR} className="pg" />;
// Dashes running backwards under the feet so the athlete reads as moving.
const track = (dur: number, k: { slide: (dx: number, dy: number, d: number) => ReactNode }, y = FLOOR + 4) => (
  <g>
    {k.slide(-20, 0, dur)}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={i * 20 + 4} y1={y} x2={i * 20 + 12} y2={y} className="pd" />
    ))}
  </g>
);

// Gait: one leg's thigh/shin at time t (the other leg runs half a loop later).
const walkLeg = (t: number, swing: number, bias: number, bend: number) => ({
  leg: bias + swing * sin(t),
  shin: -(4 + bend * Math.max(0, cos(t)) ** 2),
});
const runLeg = (t: number) => ({
  leg: 10 + 38 * sin(t),
  shin: -(14 + 96 * Math.max(0, Math.cos(TAU * t + Math.PI / 4)) ** 1.5),
});

// Bike, in scene units.
const BB: Pt = [50, 77];
const BAR: Pt = [71, 50.5];
const BIKE_SHIFT: Pt = [-5, -2];

// Ball rendered around (0,0).
const Ball = ({ r, kind }: { r: number; kind: "basket" | "soccer" }) =>
  kind === "basket" ? (
    <>
      <circle r={r} className="pf" />
      <path d={`M${-r} 0 H${r} M0 ${-r} V${r} M${-r * 0.7} ${-r * 0.7} Q0 0 ${-r * 0.7} ${r * 0.7} M${r * 0.7} ${-r * 0.7} Q0 0 ${r * 0.7} ${r * 0.7}`} className="ps" />
    </>
  ) : (
    <>
      <circle r={r} className="pw" />
      <path d={`M0 ${-r * 0.42} L${r * 0.4} ${-r * 0.13} L${r * 0.25} ${r * 0.34} L${-r * 0.25} ${r * 0.34} L${-r * 0.4} ${-r * 0.13} Z`} className="pfb" />
    </>
  );

export const sportLibrary: Record<string, Sport> = {
  walking: {
    id: "walking",
    name: "Walking",
    dur: 1.2,
    plant: "both",
    still: 0.15,
    pose: (t) => {
      const a = walkLeg(t, 22, 0, 34);
      const b = walkLeg(t + 0.5, 22, 0, 34);
      return { lean: 3, legF: a.leg, shinF: a.shin, legB: b.leg, shinB: b.shin, armF: -20 * sin(t), foreF: 18, armB: 20 * sin(t), foreB: 18 };
    },
    scene: (k) => (
      <>
        {floor}
        {track(1.2, k)}
      </>
    ),
  },

  running: {
    id: "running",
    name: "Running",
    dur: 0.72,
    plant: "both",
    still: 0.6,
    pose: (t) => {
      const a = runLeg(t);
      const b = runLeg(t + 0.5);
      return { lean: 13, legF: a.leg, shinF: a.shin, legB: b.leg, shinB: b.shin, armF: 5 - 46 * sin(t), foreF: 95, armB: 5 + 46 * sin(t), foreB: 95, y: -2.5 * Math.abs(cos(t)) };
    },
    scene: (k) => (
      <>
        {floor}
        {track(0.4, k)}
      </>
    ),
  },

  hiking: {
    id: "hiking",
    name: "Hiking",
    dur: 1.5,
    plant: "both",
    still: 0.2,
    torso: <rect x={39.5} y={36.5} width={8} height={15} rx={2.6} className="pf" />,
    pose: (t) => {
      const a = walkLeg(t, 26, 12, 42);
      const b = walkLeg(t + 0.5, 26, 12, 42);
      return { lean: 14, legF: a.leg, shinF: a.shin, legB: b.leg, shinB: b.shin, armF: 10 - 22 * sin(t), foreF: 30, armB: 10 + 22 * sin(t), foreB: 30 };
    },
    scene: (k) => (
      <>
        <path d="M58 30 L70 14 L77 22 L84 15 L96 30" className="pm" />
        <g transform="rotate(-12 50 91.5)">
          <line x1={-10} y1={FLOOR} x2={110} y2={FLOOR} className="pg" />
          {track(1.5, k)}
        </g>
      </>
    ),
  },

  cycling: {
    id: "cycling",
    name: "Cycling",
    dur: 0.9,
    still: 0.1,
    pose: (t) => {
      const lean = 33;
      // Feet follow the pedals; hands stay on the bars.
      const bb: Pt = [BB[0] - BIKE_SHIFT[0], BB[1] - BIKE_SHIFT[1]];
      const pedal = (ph: number): Pt => [bb[0] + 7 * Math.cos(TAU * ph), bb[1] + 7 * Math.sin(TAU * ph)];
      const [legF, shinF] = legIk(pedal(t));
      const [legB, shinB] = legIk(pedal(t + 0.5));
      const bar = rot([BAR[0] - BIKE_SHIFT[0], BAR[1] - BIKE_SHIFT[1]], HIP, lean);
      const [armF, foreF] = armIk(bar);
      return { lean, legF, shinF, legB, shinB, armF, foreF, armB: armF + 6, foreB: foreF - 4, x: BIKE_SHIFT[0], y: BIKE_SHIFT[1] };
    },
    scene: (k) => (
      <>
        {floor}
        {track(0.45, k)}
        {[24, 78].map((x) => (
          <g key={x}>
            <circle cx={x} cy={79} r={12.5} className="pa" />
            <g>
              {k.spin((t) => 720 * t, [x, 79])}
              <path d={`M${x - 12} 79 H${x + 12} M${x} 67 V91`} className="pt" />
            </g>
          </g>
        ))}
        <path d="M24 79 L50 77 L69 61 L78 79 M50 77 L46 60 L24 79 M46 61 L68 58 M68 56 L70 62 M68 56 L70 51 L73 51.5 M40 57.5 H50" className="pa" />
        <g>
          {k.spin((t) => 360 * t + 180, BB)}
          <path d={`M${BB[0]} ${BB[1]} H${BB[0] + 7} M${BB[0] + 5.5} ${BB[1]} H${BB[0] + 8.5}`} className="pa" />
        </g>
      </>
    ),
    over: (k) => (
      <>
        <circle cx={BB[0]} cy={BB[1]} r={3.6} className="pa" />
        <g>
          {k.spin((t) => 360 * t, BB)}
          <path d={`M${BB[0]} ${BB[1]} H${BB[0] + 7} M${BB[0] + 5.5} ${BB[1]} H${BB[0] + 8.5}`} className="pa" />
        </g>
      </>
    ),
  },

  basketball: {
    id: "basketball",
    name: "Basketball",
    dur: 0.8,
    plant: "both",
    still: 0.1,
    pose: (t) => ({ lean: 14, legF: 24, shinF: -40, legB: -4, shinB: -18, armF: 34, foreF: 30 + 26 * cos(t), armB: 42, foreB: 55, y: 0.8 * (1 - cos(t)) }),
    scene: () => floor,
    over: (k) => {
      // The ball leaves the hand at t = 0, hits the floor at 0.5 and is back at 1.
      const r = 5.4;
      const h = k.hand(0, "F");
      const top = h[1] + 2.4 + r;
      const low = FLOOR - 0.6 - r;
      return (
        <g>
          {k.move((t) => {
            const u = Math.abs(2 * t - 1);
            return [h[0] + 2, low - (low - top) * (1 - (1 - u) ** 2)];
          })}
          <g>
            {k.spin((t) => 180 * t, [0, 0])}
            <Ball r={r} kind="basket" />
          </g>
        </g>
      );
    },
  },

  soccer: {
    id: "soccer",
    name: "Soccer",
    dur: 1.7,
    n: 48,
    plant: "B",
    still: 0.5,
    pose: keyed([
      [0, { legF: 0, shinF: -6, legB: -4, shinB: -6, armF: 0, armB: 0, foreF: 25, foreB: 25 }],
      [0.36, { lean: -6, legF: -38, shinF: -98, legB: -4, shinB: -10, armF: 40, armB: -42, foreF: 30, foreB: 30 }],
      [0.5, { lean: 6, legF: 16, shinF: -18, legB: -4, shinB: -10, armF: -22, armB: 34, foreF: 30, foreB: 30 }],
      [0.64, { lean: -4, legF: 62, shinF: -4, legB: -6, shinB: -6, armF: -40, armB: 48, foreF: 25, foreB: 25 }],
      [0.86, { legF: 0, shinF: -6, legB: -4, shinB: -6, armF: 0, armB: 0, foreF: 25, foreB: 25 }],
      [1, { legF: 0, shinF: -6, legB: -4, shinB: -6, armF: 0, armB: 0, foreF: 25, foreB: 25 }],
    ]),
    scene: () => floor,
    over: (k) => {
      const r = 5;
      const f = k.foot(0.5, "F");
      const rest: Pt = [f[0] + 6.5, FLOOR - 0.6 - r];
      return (
        <g>
          {k.move((t) => {
            if (t < 0.5 || t > 0.8) return rest;
            const s = (t - 0.5) / 0.3;
            return [rest[0] + 50 * s, rest[1] - 16 * Math.sin(Math.PI * s)];
          })}
          {k.attr("opacity", (t) => (t > 0.6 && t < 0.86 ? 0 : t >= 0.86 ? Math.min(1, (t - 0.86) / 0.1) : 1))}
          <g>
            {k.spin((t) => (t < 0.5 ? 0 : 720 * Math.min(1, (t - 0.5) / 0.3)), [0, 0])}
            <Ball r={r} kind="soccer" />
          </g>
        </g>
      );
    },
  },

  badminton: {
    id: "badminton",
    name: "Badminton",
    dur: 1.4,
    n: 48,
    plant: "both",
    still: 0.4,
    // Overhead smash needs head room: shrink the figure a little.
    fit: "translate(9 16.2) scale(.82)",
    handF: (
      <>
        <line x1={50} y1={61} x2={50} y2={67.5} className="pa" />
        <ellipse cx={50} cy={73.6} rx={3.9} ry={6.2} className="pa" />
        <path d="M48 70 V77.5 M52 70 V77.5 M46.6 73.6 H53.4" className="pt" />
      </>
    ),
    pose: (t) => {
      const p = keyed([
        [0, { lean: -8, armF: 165, foreF: 130, armB: 150, foreB: 10 }],
        [0.3, { lean: -8, armF: 168, foreF: 135, armB: 150, foreB: 10 }],
        [0.42, { lean: 4, armF: 160, foreF: 6, armB: 95, foreB: 20 }],
        [0.56, { lean: 14, armF: 50, foreF: 25, armB: 30, foreB: 30 }],
        [0.8, { lean: 0, armF: 130, foreF: 105, armB: 120, foreB: 20 }],
        [1, { lean: -8, armF: 165, foreF: 130, armB: 150, foreB: 10 }],
      ])(t);
      return { ...p, legF: 14, shinF: -12, legB: -16, shinB: -14, y: -4 * bump(t, 0.32, 0.52) };
    },
    scene: () => floor,
    over: (k) => {
      const c = k.hand(0.42, "F", [50, 73.6]);
      const s: Pt = [c[0] + 30, c[1] - 16];
      const e: Pt = [c[0] + 40, c[1] + 46];
      const inA = (Math.atan2(c[1] - s[1], c[0] - s[0]) * 180) / Math.PI;
      const outA = (Math.atan2(e[1] - c[1], e[0] - c[0]) * 180) / Math.PI;
      return (
        <g>
          {k.move((t) => {
            if (t < 0.08 || t > 0.58) return s;
            if (t <= 0.42) {
              const u = (t - 0.08) / 0.34;
              return [s[0] + (c[0] - s[0]) * u, s[1] + (c[1] - s[1]) * u - 6 * Math.sin(Math.PI * u)];
            }
            const u = (t - 0.42) / 0.16;
            return [c[0] + (e[0] - c[0]) * u, c[1] + (e[1] - c[1]) * u];
          })}
          {k.attr("opacity", (t) => (t < 0.06 || t > 0.56 ? 0 : 1))}
          <g>
            {k.spin((t) => (t <= 0.42 ? inA : outA), [0, 0])}
            <path d="M-1.2 -1.7 L-8.5 -3.9 L-8.5 3.9 L-1.2 1.7 Z" className="psk" />
            <circle r={2} className="pw" />
          </g>
        </g>
      );
    },
  },

  yoga: {
    id: "yoga",
    name: "Yoga",
    dur: 5.5,
    n: 48,
    plant: "F",
    still: 0.66,
    fit: "translate(5 9) scale(.9)",
    // Stand, sweep the arms up, then tip into a one-leg balance and back.
    pose: keyed([
      [0, { armF: 4, armB: -4, foreF: 6, foreB: 6 }],
      [0.18, { armF: 176, armB: 172 }],
      [0.3, { armF: 176, armB: 172 }],
      [0.52, { lean: 82, armF: 178, armB: 174, legB: -86, shinB: 0 }],
      [0.8, { lean: 82, armF: 178, armB: 174, legB: -86, shinB: 0 }],
      [0.96, { armF: 4, armB: -4, foreF: 6, foreB: 6 }],
      [1, { armF: 4, armB: -4, foreF: 6, foreB: 6 }],
    ]),
    scene: () => <rect x={22} y={89.8} width={56} height={3.2} rx={1.6} className="pmat" />,
  },

  "jump-rope": {
    id: "jump-rope",
    name: "Jump rope",
    dur: 0.66,
    plant: "both",
    still: 0.5,
    pose: (t) => {
      const h = 7 * Math.max(0, cos(t - 0.5)) ** 1.5;
      return { lean: 2, armF: 16, foreF: 40, armB: -6, foreB: 44, legF: 4 + h, shinF: -4 - 2.6 * h, legB: -2 + h, shinB: -4 - 2.6 * h, y: -h * 1.2 };
    },
    scene: () => (
      <>
        {floor}
        <ellipse cx={50} cy={51} rx={19} ry={40.5} className="ptrail" />
      </>
    ),
    over: (k) => (
      <path className="prope">
        {k.attr("d", (t) => {
          // The rope is a long loop from both hands round to its far end p,
          // which circles the athlete: over the head, down the front, under the feet.
          const hb = k.hand(t, "B");
          const hf = k.hand(t, "F");
          const p: Pt = [50 + 19 * sin(t), 51 - 40.5 * cos(t)];
          const v: Pt = [cos(t), sin(t) * 2.1];
          const vl = Math.hypot(...v);
          const curve = (h: Pt, side: number) => {
            const m: Pt = [(h[0] + p[0]) / 2, (h[1] + p[1]) / 2];
            const o: Pt = [m[0] - 50, m[1] - 51];
            const ol = Math.hypot(...o) || 1;
            const len = Math.hypot(p[0] - h[0], p[1] - h[1]);
            const b = len * 0.32;
            const tr = len * 0.18;
            return [m[0] + (o[0] / ol) * b - (v[0] / vl) * tr + side * (-o[1] / ol) * 3.2, m[1] + (o[1] / ol) * b - (v[1] / vl) * tr + side * (o[0] / ol) * 3.2] as Pt;
          };
          const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
          return `M${f(hb)} Q${f(curve(hb, -1))} ${f(p)} Q${f(curve(hf, 1))} ${f(hf)}`;
        })}
      </path>
    ),
  },
};

