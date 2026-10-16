import type { ReactNode } from "react";

// A small stick-figure rig drawn in a 100 x 100 box, facing right.
// Each sport is a pose function of time (0..1 over one loop) plus a few
// props. Poses are sampled and played with SVG <animate> (SMIL), which runs
// smoothly on iPhone Safari and needs no animation library.

export type Pt = [number, number];

// Angles are in degrees. Limbs: 0 = hanging straight down, positive swings
// forward (toward the right). Shin/forearm are relative to the bone above.
// lean: positive tips the upper body forward. x/y move the whole body.
export type Pose = {
  lean?: number;
  armF?: number;
  foreF?: number;
  armB?: number;
  foreB?: number;
  legF?: number;
  shinF?: number;
  legB?: number;
  shinB?: number;
  x?: number;
  y?: number;
};

export const HIP: Pt = [50, 56];
const NECK: Pt = [50, 33.5];
export const SH: Pt = [50, 36];
const ELB: Pt = [50, 49];
export const HAND: Pt = [50, 61];
const KNEE: Pt = [50, 71.5];
export const FOOT: Pt = [50, 87];
export const FLOOR = 91.5;
const BONE = { upper: 13, fore: 12, thigh: 15.5, shin: 15.5 };

const rad = Math.PI / 180;

// Rotate p around c; a > 0 turns a hanging limb forward (counter-clockwise on screen).
export function rot([x, y]: Pt, [cx, cy]: Pt, a: number): Pt {
  const r = -a * rad;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

// Angles for a two-bone limb starting at `base` so its tip reaches `t`.
// Returns [upper, lower] in the Pose convention. `bendFwd` puts the middle
// joint in front of the line (knees); false puts it behind (elbows).
export function ik(base: Pt, t: Pt, l1: number, l2: number, bendFwd: boolean): [number, number] {
  const dx = t[0] - base[0];
  const dy = t[1] - base[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const dir = Math.atan2(dx, dy) / rad;
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) / rad;
  const b = Math.acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2)) / rad;
  return bendFwd ? [dir + a, -(180 - b)] : [dir - a, 180 - b];
}
export const legIk = (t: Pt) => ik(HIP, t, BONE.thigh, BONE.shin, true);
export const armIk = (t: Pt) => ik(SH, t, BONE.upper, BONE.fore, false);

// Hand (or any point held in the hand, given in the rest pose) after the pose.
export function handAt(p: Pose, side: "F" | "B", local: Pt = HAND): Pt {
  let q = rot(local, ELB, p[`fore${side}`] ?? 0);
  q = rot(q, SH, p[`arm${side}`] ?? 0);
  q = rot(q, HIP, -(p.lean ?? 0));
  return [q[0] + (p.x ?? 0), q[1] + (p.y ?? 0)];
}

export function footAt(p: Pose, side: "F" | "B"): Pt {
  let q = rot(FOOT, KNEE, p[`shin${side}`] ?? 0);
  q = rot(q, HIP, p[`leg${side}`] ?? 0);
  return [q[0] + (p.x ?? 0), q[1] + (p.y ?? 0)];
}

// Interpolate keyed poses with an ease in/out between keys.
export function keyed(frames: [number, Pose][]) {
  return (t: number): Pose => {
    let i = 0;
    while (i < frames.length - 2 && t > frames[i + 1][0]) i++;
    const [t0, a] = frames[i];
    const [t1, b] = frames[i + 1];
    const u = t1 > t0 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 0;
    const e = u * u * (3 - 2 * u);
    const out: Pose = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof Pose>) {
      const va = a[k] ?? 0;
      out[k] = va + ((b[k] ?? 0) - va) * e;
    }
    return out;
  };
}

// Smooth bump: 0 outside [a, b], 1 in the middle.
export const bump = (t: number, a: number, b: number) =>
  t <= a || t >= b ? 0 : Math.sin(((t - a) / (b - a)) * Math.PI);

export type Kit = {
  // The full pose at time t (after feet are planted on the floor).
  pose: (t: number) => Pose;
  hand: (t: number, side: "F" | "B", local?: Pt) => Pt;
  foot: (t: number, side: "F" | "B") => Pt;
  // <animateTransform> / <animate> children for a group.
  move: (f: (t: number) => Pt) => ReactNode;
  spin: (f: (t: number) => number, c: Pt) => ReactNode;
  attr: (name: string, f: (t: number) => number | string) => ReactNode;
  slide: (dx: number, dy: number, dur: number) => ReactNode;
};

export type Sport = {
  id: string;
  name: string;
  // Seconds for one loop.
  dur: number;
  // Samples per loop (more for fast, sharp moves).
  n?: number;
  pose: (t: number) => Pose;
  // Keep feet on the floor: both feet, or one standing foot.
  plant?: "both" | "F" | "B";
  // Extra transform for the figure and its props (to fit tall moves).
  fit?: string;
  scene?: (k: Kit) => ReactNode;
  under?: (k: Kit) => ReactNode;
  over?: (k: Kit) => ReactNode;
  torso?: ReactNode;
  handF?: ReactNode;
  // Point in the loop shown when motion is reduced (0..1).
  still?: number;
};

const r1 = (v: number) => (Math.round(v * 10) / 10).toString();

export function makeKit(s: Sport): Kit {
  const n = s.n ?? 24;
  const dur = `${s.dur}s`;
  const cache = new Map<number, Pose>();
  const pose = (t: number): Pose => {
    const hit = cache.get(t);
    if (hit) return hit;
    const p = { ...s.pose(t) };
    if (s.plant) {
      const bare = { ...p, x: 0, y: 0 };
      const ys =
        s.plant === "both"
          ? [footAt(bare, "F")[1], footAt(bare, "B")[1]]
          : [footAt(bare, s.plant)[1]];
      p.y = (p.y ?? 0) + FOOT[1] - Math.max(...ys);
    }
    cache.set(t, p);
    return p;
  };
  const times = Array.from({ length: n + 1 }, (_, i) => i / n);
  const anim = (type: "rotate" | "translate", vals: string[]) => (
    <animateTransform
      attributeName="transform"
      type={type}
      values={vals.join(";")}
      dur={dur}
      repeatCount="indefinite"
    />
  );
  return {
    pose,
    hand: (t, side, local) => handAt(pose(t), side, local),
    foot: (t, side) => footAt(pose(t), side),
    move: (f) => anim("translate", times.map((t) => f(t).map(r1).join(" "))),
    spin: (f, c) => anim("rotate", times.map((t) => `${r1(f(t))} ${c[0]} ${c[1]}`)),
    attr: (name, f) => (
      <animate
        attributeName={name}
        values={times.map((t) => (typeof f(t) === "number" ? r1(f(t) as number) : f(t))).join(";")}
        dur={dur}
        repeatCount="indefinite"
      />
    ),
    slide: (dx, dy, d) => (
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`0 0;${dx} ${dy}`}
        dur={`${d}s`}
        repeatCount="indefinite"
      />
    ),
  };
}

// A joint: rotates its children around c, animated when the angle changes.
function Joint({
  c,
  vals,
  dur,
  children,
}: {
  c: Pt;
  vals: number[];
  dur: string;
  children: ReactNode;
}) {
  // SVG rotate() is clockwise; our angles are forward = counter-clockwise.
  const v = vals.map((a) => r1(-a));
  if (v.every((x) => x === v[0])) {
    return v[0] === "0" ? <g>{children}</g> : <g transform={`rotate(${v[0]} ${c[0]} ${c[1]})`}>{children}</g>;
  }
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={v.map((a) => `${a} ${c[0]} ${c[1]}`).join(";")}
        dur={dur}
        repeatCount="indefinite"
      />
      {children}
    </g>
  );
}

const Bone = ({ a, b, cls }: { a: Pt; b: Pt; cls: string }) => (
  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={cls} />
);

export function Athlete({ sport }: { sport: Sport }) {
  const k = makeKit(sport);
  const n = sport.n ?? 24;
  const dur = `${sport.dur}s`;
  const times = Array.from({ length: n + 1 }, (_, i) => i / n);
  const track = (key: keyof Pose, sign = 1) => times.map((t) => (k.pose(t)[key] ?? 0) * sign);

  const lean = track("lean", -1);
  const moves = times.map((t) => {
    const p = k.pose(t);
    return `${r1(p.x ?? 0)} ${r1(p.y ?? 0)}`;
  });
  const still = moves.every((m) => m === moves[0]);

  const arm = (side: "F" | "B", slot?: ReactNode) => (
    <Joint c={HIP} vals={lean} dur={dur}>
      <Joint c={SH} vals={track(`arm${side}`)} dur={dur}>
        <Bone a={SH} b={ELB} cls={side === "F" ? "lf" : "lb"} />
        <Joint c={ELB} vals={track(`fore${side}`)} dur={dur}>
          {slot}
          <Bone a={ELB} b={HAND} cls={side === "F" ? "lf" : "lb"} />
        </Joint>
      </Joint>
    </Joint>
  );
  const leg = (side: "F" | "B") => (
    <Joint c={HIP} vals={track(`leg${side}`)} dur={dur}>
      <Bone a={HIP} b={KNEE} cls={side === "F" ? "lf" : "lb"} />
      <Joint c={KNEE} vals={track(`shin${side}`)} dur={dur}>
        <path d="M50 71.5 L50 87 L54 87.6" className={side === "F" ? "lf" : "lb"} />
      </Joint>
    </Joint>
  );

  return (
    <svg viewBox="0 0 100 100" className="ath" aria-hidden="true" focusable="false">
      {sport.scene?.(k)}
      <g transform={sport.fit}>
        {sport.under?.(k)}
        <g transform={still && moves[0] !== "0 0" ? `translate(${moves[0]})` : undefined}>
          {!still && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={moves.join(";")}
              dur={dur}
              repeatCount="indefinite"
            />
          )}
          {arm("B")}
          {leg("B")}
          <Joint c={HIP} vals={lean} dur={dur}>
            {sport.torso}
            <Bone a={HIP} b={NECK} cls="lt" />
            <circle cx={50} cy={24.5} r={6.4} className="hd" />
          </Joint>
          {leg("F")}
          {arm("F", sport.handF)}
        </g>
        {sport.over?.(k)}
      </g>
    </svg>
  );
}
