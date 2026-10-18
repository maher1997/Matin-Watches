import Image from "next/image";
import { RESTING, TRACE } from "@/components/health/visuals";

// The real MATIN Torvan with the selected health screen drawn on its round
// AMOLED display, so it is clear these readings come from this watch. The
// overlay sits on the front photo's screen (same circle as the battery
// section). Values are illustrative samples.

const SCREEN = { cx: 49.6, cy: 48.8, r: 24.8 };

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

export default function HealthWatch({
  active,
  bpm,
  restPick,
  onPick,
  o2,
}: {
  active: number;
  bpm: number;
  restPick: number;
  onPick: (i: number) => void;
  o2: number;
}) {
  return (
    <figure className="hw">
      <Image
        src="/products/matin-torvan-front-view.webp"
        alt="MATIN Torvan showing its health screens on the round AMOLED display"
        fill
        sizes="(max-width: 860px) 90vw, 46vw"
        quality={75}
      />
      <div
        className="hw-screen"
        style={{
          left: `${SCREEN.cx - SCREEN.r}%`,
          top: `${SCREEN.cy - SCREEN.r}%`,
          width: `${SCREEN.r * 2}%`,
          height: `${SCREEN.r * 2}%`,
        }}
      >
        {/* Heart rate */}
        <div className={`hw-face hw-hr${active === 0 ? " on" : ""}`} aria-hidden={active !== 0}>
          <svg className="hw-dial" viewBox="0 0 200 200" aria-hidden="true">
            {ticks(60, 88, 94, "hw-tick")}
            <circle cx="100" cy="100" r="82" className="hw-track" />
            <circle
              cx="100"
              cy="100"
              r="82"
              pathLength={100}
              strokeDasharray="18 82"
              className="hw-scan"
            />
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

        {/* Resting heart rate */}
        <div className={`hw-face hw-rest${active === 1 ? " on" : ""}`} aria-hidden={active !== 1}>
          <span className="hw-label">Resting HR</span>
          <span className="hw-num">{RESTING[restPick].bpm}</span>
          <span className="hw-unit">BPM · {RESTING[restPick].day}</span>
          <div className="hw-bars">
            {RESTING.map((d, i) => (
              <button
                key={d.day}
                type="button"
                tabIndex={active === 1 ? 0 : -1}
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

        {/* Blood oxygen */}
        <div className={`hw-face hw-o2${active === 2 ? " on" : ""}`} aria-hidden={active !== 2}>
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

        <span className="hw-glass" aria-hidden="true" />
      </div>
    </figure>
  );
}
