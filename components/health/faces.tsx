import Image from "next/image";
import { KCAL, RESTING, SLEEP, SLEEP_TOTAL, STEP_GOAL, TRACE } from "@/components/health/visuals";

// The real watch with the selected health screen drawn on its own display,
// so it is clear these readings come from this watch. The overlay sits on the
// front photo's screen (the same one the battery section uses): a circle, or
// a box with a CSS polygon for a shaped screen. Values are illustrative.

export type MetricId = "hr" | "rest" | "spo2" | "sleep" | "activity";
export type Screen = { cx: number; cy: number; r: number } | { x: number; y: number; w: number; h: number; clip: string };

const ticks = (n: number, r0: number, r1: number, cls: string) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const big = i % (n / 12) === 0;
    const ri = big ? r0 - 3 : r0;
    return (
      <line
        key={i}
        x1={(100 + ri * Math.sin(a)).toFixed(2)}
        y1={(100 - ri * Math.cos(a)).toFixed(2)}
        x2={(100 + r1 * Math.sin(a)).toFixed(2)}
        y2={(100 - r1 * Math.cos(a)).toFixed(2)}
        className={big ? `${cls} big` : cls}
      />
    );
  });

const LO = 54;
const HI = 66;

// Sleep chart blocks on a 120 x 36 box, awake on top, deep at the bottom.
const SLEEP_MIN = SLEEP.reduce((t, [, m]) => t + m, 0);
const SLEEP_BLOCKS = SLEEP.reduce<{ x: number; w: number; s: number }[]>((out, [s, m]) => {
  const x = out.length ? out[out.length - 1].x + out[out.length - 1].w : 0;
  return [...out, { x, w: (m / SLEEP_MIN) * 120, s }];
}, []);

// A few stars over the sleep face as [x %, y %, delay s].
const STARS: [number, number, number][] = [
  [24, 22, 0],
  [70, 17, 1.1],
  [80, 34, 2.2],
  [18, 40, 1.6],
  [60, 10, 0.5],
];

export default function HealthWatch({
  image,
  imageAlt,
  screen,
  metrics,
  active,
  bpm,
  restPick,
  onPick,
  o2,
  steps,
  look = "wave",
}: {
  image: string;
  imageAlt: string;
  screen: Screen;
  metrics: MetricId[];
  active: MetricId;
  bpm: number;
  restPick: number;
  onPick: (i: number) => void;
  o2: number;
  steps: number;
  // The watch's battery look, reused so each watch's screens get their own
  // background: "wave" Torvan, "cells" Trekon, "radar" Kaldor, "rings" Varkon.
  look?: string;
}) {
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
  const face = (id: MetricId) => ({
    className: `hw-face hw-${id === "spo2" ? "o2" : id === "activity" ? "act" : id}${active === id ? " on" : ""}`,
    "aria-hidden": active !== id,
  });

  return (
    <figure className="hw">
      <Image src={image} alt={imageAlt} fill sizes="(max-width: 860px) 90vw, 46vw" quality={75} />
      <div className={`hw-screen hw-look-${look}${round ? "" : " hw-shaped"}`} style={box}>
        {metrics.includes("hr") && (
          <div {...face("hr")}>
            <svg className="hw-dial" viewBox="0 0 200 200" aria-hidden="true">
              {ticks(60, 88, 94, "hw-tick")}
              <circle cx="100" cy="100" r="82" className="hw-track" />
              <circle cx="100" cy="100" r="82" pathLength={100} strokeDasharray="18 82" className="hw-scan" />
            </svg>
            <svg className="hw-heart" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.5 C7 16.8 3 13.6 3 9.3 C3 6.6 5.1 4.6 7.6 4.6 C9.4 4.6 11.2 5.7 12 7.3 C12.8 5.7 14.6 4.6 16.4 4.6 C18.9 4.6 21 6.6 21 9.3 C21 13.6 17 16.8 12 20.5 Z" />
            </svg>
            <span className="hw-num">{bpm}</span>
            <span className="hw-unit">BPM</span>
            <div className="hw-ecg" aria-hidden="true">
              <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                <g className="hw-ecg-run">
                  <path d={TRACE} />
                </g>
              </svg>
            </div>
          </div>
        )}

        {metrics.includes("rest") && (
          <div {...face("rest")}>
            <span className="hw-label">Resting HR</span>
            <span className="hw-num">{RESTING[restPick].bpm}</span>
            <span className="hw-unit">BPM · {RESTING[restPick].day}</span>
            <div className="hw-bars">
              {RESTING.map((d, i) => (
                <button
                  key={d.day}
                  type="button"
                  tabIndex={active === "rest" ? 0 : -1}
                  className={i === restPick ? "on" : undefined}
                  onClick={() => onPick(i)}
                  aria-label={`${d.day}: ${d.bpm} BPM resting`}
                >
                  <i style={{ height: `${20 + ((d.bpm - LO) / (HI - LO)) * 80}%`, animationDelay: `${i * 0.06}s` }} />
                  <span>{d.day[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {metrics.includes("spo2") && (
          <div {...face("spo2")}>
            <svg className="hw-dial" viewBox="0 0 200 200" aria-hidden="true">
              {ticks(60, 88, 94, "hw-tick")}
              <circle cx="100" cy="100" r="80" className="hw-track" />
              <circle
                cx="100"
                cy="100"
                r="80"
                pathLength={100}
                strokeDasharray={`${o2} 100`}
                className="hw-arc"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <span className="hw-wave" aria-hidden="true" />
            <span className="hw-label">
              SpO<sub>2</sub>
            </span>
            <span className="hw-num">
              {o2}
              <small>%</small>
            </span>
            <span className="hw-unit">Blood oxygen</span>
          </div>
        )}

        {metrics.includes("sleep") && (
          <div {...face("sleep")}>
            <span className="hw-stars" aria-hidden="true">
              {STARS.map(([x, y, d]) => (
                <i key={x} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />
              ))}
            </span>
            <svg className="hw-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 3 A9 9 0 1 0 21 15 A7.5 7.5 0 0 1 15 3 Z" />
            </svg>
            <span className="hw-num hw-num-sm">
              {SLEEP_TOTAL.h}
              <small>h</small> {SLEEP_TOTAL.m}
              <small>m</small>
            </span>
            <span className="hw-unit">Last night</span>
            <svg className="hw-hypno" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true">
              <g className="hw-hypno-in">
                {SLEEP_BLOCKS.map((b, i) => (
                  <rect key={i} x={b.x} y={2 + b.s * 12} width={b.w + 0.2} height="8" rx="1.5" className={`s${b.s}`} />
                ))}
              </g>
            </svg>
            <span className="hw-legend" aria-hidden="true">
              <i className="s2" />
              Deep
              <i className="s1" />
              Light
              <i className="s0" />
              Awake
            </span>
          </div>
        )}

        {metrics.includes("activity") && (
          <div {...face("activity")}>
            <svg className="hw-dial" viewBox="0 0 200 200" aria-hidden="true">
              {ticks(60, 88, 94, "hw-tick")}
              <circle cx="100" cy="100" r="80" className="hw-track" />
              <circle
                cx="100"
                cy="100"
                r="80"
                pathLength={100}
                strokeDasharray={`${(steps / STEP_GOAL) * 100} 100`}
                className="hw-ring"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <svg className="hw-feet" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.5 3 C9.6 3 10.4 5.6 10 8.4 C9.7 10.6 8.6 12 7 12 C5.3 12 4.6 10.3 4.8 8 C5 5.4 5.7 3 7.5 3 Z M5.2 13.6 L9.4 13.2 C9.6 15.6 9 17.6 7.4 17.6 C5.9 17.6 5.3 15.8 5.2 13.6 Z" />
              <path d="M16.5 6.5 C18.3 6.5 19.2 8.9 19 11.6 C18.8 13.9 17.7 15.4 16 15.4 C14.4 15.4 13.6 13.7 13.8 11.4 C14 8.9 14.8 6.5 16.5 6.5 Z M14.4 17 L18.6 17.4 C18.4 19.8 17.6 21.4 16.1 21.3 C14.6 21.2 14.2 19.3 14.4 17 Z" />
            </svg>
            <span className="hw-num hw-num-sm">{steps.toLocaleString("en-US")}</span>
            <span className="hw-unit">steps</span>
            <span className="hw-kcal">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 C13 6 17 8 17 13.5 A5 5 0 0 1 7 13.5 C7 10.5 9 9 9.5 6.5 C11 8 11 9.5 11 10.5 C12.5 9 12.6 5 12 2 Z" />
              </svg>
              {KCAL} kcal
            </span>
          </div>
        )}

        <span className="hw-glass" aria-hidden="true" />
      </div>
    </figure>
  );
}
