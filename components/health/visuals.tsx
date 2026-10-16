// Drawn visuals for the health monitoring section. Plain SVG with CSS
// animations (classes in globals.css under "Health monitoring"), so they
// render on the server and need no animation library. All numbers shown are
// illustrative samples, never live readings.

// One heartbeat of a monitor-style trace, 100 units wide, baseline at 50.
const BEAT = (x: number) =>
  `L${x + 16} 50 Q${x + 20} 43 ${x + 24} 50 L${x + 33} 50 L${x + 36} 55 L${x + 40} 14 L${x + 44} 68 L${x + 47} 50 L${x + 57} 50 Q${x + 66} 36 ${x + 75} 50 L${x + 100} 50`;
const TRACE = `M0 50 ${Array.from({ length: 8 }, (_, i) => BEAT(i * 100)).join(" ")}`;

// A heart rate monitor dial: a scanning ring, a pulse wave on every beat
// and the sample reading in the middle.
export function HeartScene({ bpm }: { bpm: number }) {
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const r0 = i % 6 === 0 ? 103 : 107;
    return (
      <line
        key={i}
        x1={(120 + r0 * Math.sin(a)).toFixed(2)}
        y1={(120 - r0 * Math.cos(a)).toFixed(2)}
        x2={(120 + 112 * Math.sin(a)).toFixed(2)}
        y2={(120 - 112 * Math.cos(a)).toFixed(2)}
        className={i % 6 === 0 ? "hm-hr-tick big" : "hm-hr-tick"}
      />
    );
  });
  return (
    <div className="hm-heart-scene">
      <div className="hm-hr-glow" aria-hidden="true" />
      <div className="hm-hr">
        <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="hmHrFace" cx="50%" cy="45%" r="60%">
              <stop offset="0" stopColor="#2a0d16" />
              <stop offset="0.65" stopColor="#120a10" />
              <stop offset="1" stopColor="#0a0b10" />
            </radialGradient>
            <radialGradient id="hmHrCore" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ff4d62" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ff4d62" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="120" cy="120" r="117" className="hm-hr-outer" />
          {ticks}
          <circle cx="120" cy="120" r="96" className="hm-hr-track" />
          <g className="hm-hr-scan">
            <circle cx="120" cy="120" r="96" pathLength={100} strokeDasharray="22 78" strokeDashoffset="-4" className="hm-hr-arc a" transform="rotate(-90 120 120)" />
            <circle cx="120" cy="120" r="96" pathLength={100} strokeDasharray="12 88" strokeDashoffset="-14" className="hm-hr-arc b" transform="rotate(-90 120 120)" />
            <circle cx="120" cy="120" r="96" pathLength={100} strokeDasharray="3 97" strokeDashoffset="-23" className="hm-hr-arc c" transform="rotate(-90 120 120)" />
          </g>
          <circle cx="120" cy="120" r="74" className="hm-hr-wave red" />
          <circle cx="120" cy="120" r="74" className="hm-hr-wave blue" />
          <circle cx="120" cy="120" r="78" fill="url(#hmHrFace)" />
          <circle cx="120" cy="120" r="78" fill="url(#hmHrCore)" className="hm-hr-core" />
          <circle cx="120" cy="120" r="78" className="hm-hr-rim" />
          <g className="hm-hr-icon">
            <path d="M120 88 C113 83 106 78.5 106 71.5 C106 67 109.5 64 113.2 64 C116.2 64 118.7 65.8 120 68.3 C121.3 65.8 123.8 64 126.8 64 C130.5 64 134 67 134 71.5 C134 78.5 127 83 120 88 Z" />
            <path d="M104.5 74.5 H113 L115.5 70 L119 79.5 L122 69 L124.5 74.5 H135.5" className="hm-hr-icon-line" />
          </g>
        </svg>
        <div className="hm-hr-read">
          <span className="hm-hr-num">{bpm}</span>
          <span className="hm-hr-unit">BPM</span>
        </div>
      </div>

      <div className="hm-ecg" aria-hidden="true">
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" focusable="false">
          <line x1="0" y1="50" x2="400" y2="50" className="hm-ecg-base" />
          <g className="hm-ecg-run">
            <path d={TRACE} className="hm-ecg-glow" />
            <path d={TRACE} className="hm-ecg-line" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Sample week of resting heart rate (illustrative).
export const RESTING = [
  { day: "Mon", bpm: 63 },
  { day: "Tue", bpm: 61 },
  { day: "Wed", bpm: 62 },
  { day: "Thu", bpm: 59 },
  { day: "Fri", bpm: 60 },
  { day: "Sat", bpm: 57 },
  { day: "Sun", bpm: 58 },
];

const CW = 600;
const CH = 320;
const PAD = { l: 44, r: 30, t: 40, b: 48 };
const LO = 52;
const HI = 68;
export const chartPoint = (i: number) => {
  const x = PAD.l + (i * (CW - PAD.l - PAD.r)) / (RESTING.length - 1);
  const y = PAD.t + ((HI - RESTING[i].bpm) * (CH - PAD.t - PAD.b)) / (HI - LO);
  return [x, y] as const;
};

// Smooth curve through the points (Catmull-Rom as cubic Beziers).
function smooth() {
  const p = RESTING.map((_, i) => chartPoint(i));
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] ?? c;
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${c[0]} ${c[1]}`;
  }
  return d;
}
const CURVE = smooth();
const AREA = `${CURVE} L${chartPoint(RESTING.length - 1)[0]} ${CH - PAD.b} L${PAD.l} ${CH - PAD.b} Z`;

export function RestingScene({ pick, onPick }: { pick: number; onPick: (i: number) => void }) {
  const [px, py] = chartPoint(pick);
  return (
    <div className="hm-rest-scene">
      <div className="hm-rest-top">
        <svg viewBox="0 0 24 24" className="hm-rest-heart" aria-hidden="true" focusable="false">
          <path d="M12 20.5 C7 16.8 3 13.6 3 9.3 C3 6.6 5.1 4.6 7.6 4.6 C9.4 4.6 11.2 5.7 12 7.3 C12.8 5.7 14.6 4.6 16.4 4.6 C18.9 4.6 21 6.6 21 9.3 C21 13.6 17 16.8 12 20.5 Z" />
        </svg>
        <span>Resting heart rate, 7-day sample</span>
      </div>
      <div className="hm-chart">
        <svg viewBox={`0 0 ${CW} ${CH}`} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="hmRestArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4fb4ff" stopOpacity="0.32" />
              <stop offset="1" stopColor="#4fb4ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hmRestLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5285f7" />
              <stop offset="1" stopColor="#5fd6d0" />
            </linearGradient>
          </defs>
          {[56, 60, 64].map((v) => {
            const y = PAD.t + ((HI - v) * (CH - PAD.t - PAD.b)) / (HI - LO);
            return (
              <g key={v}>
                <line x1={PAD.l} x2={CW - PAD.r} y1={y} y2={y} className="hm-grid" />
                <text x={PAD.l - 10} y={y + 4} className="hm-axis">
                  {v}
                </text>
              </g>
            );
          })}
          <path d={AREA} fill="url(#hmRestArea)" className="hm-area hm-once" />
          <path d={CURVE} className="hm-curve-glow hm-once" pathLength={1} />
          <path d={CURVE} className="hm-curve hm-once" pathLength={1} />
          <line x1={px} x2={px} y1={py} y2={CH - PAD.b} className="hm-drop" />
          {RESTING.map((r, i) => {
            const [x, y] = chartPoint(i);
            return (
              <g key={r.day}>
                <circle cx={x} cy={y} r={i === pick ? 7 : 4.5} className={i === pick ? "hm-dot hm-once on" : "hm-dot hm-once"} style={{ animationDelay: `${0.25 + i * 0.12}s` }} />
                <text x={x} y={CH - 16} className={i === pick ? "hm-day on" : "hm-day"}>
                  {r.day}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          className="hm-tip"
          style={{
            left: `${(px / CW) * 100}%`,
            top: `${(py / CH) * 100}%`,
            // Keep the label inside the chart at both ends.
            translate: `${pick === 0 ? -18 : pick === RESTING.length - 1 ? -82 : -50}% calc(-100% - 16px)`,
          }}
          aria-hidden="true"
        >
          <b>{RESTING[pick].bpm}</b> BPM
        </div>
        {RESTING.map((r, i) => {
          const [x] = chartPoint(i);
          return (
            <button
              key={r.day}
              type="button"
              className="hm-hit"
              style={{ left: `${(x / CW) * 100}%` }}
              aria-label={`${r.day}: ${r.bpm} BPM resting (sample)`}
              aria-pressed={i === pick}
              onClick={() => onPick(i)}
              onMouseEnter={() => onPick(i)}
              onFocus={() => onPick(i)}
            />
          );
        })}
      </div>
    </div>
  );
}

// Oxygen dots drifting up inside the ring: [x, start y, size, seconds, delay].
const BUBBLES: [number, number, number, number, number][] = [
  [86, 168, 2.4, 5.2, 0],
  [150, 172, 1.8, 6.1, 1.4],
  [112, 176, 1.5, 4.6, 2.6],
  [134, 164, 2.6, 6.8, 0.8],
  [98, 160, 1.6, 5.6, 3.3],
  [160, 150, 1.4, 5, 2],
  [76, 146, 1.9, 6.4, 4.1],
  [124, 178, 1.3, 4.9, 3.8],
  [104, 172, 2.1, 7.2, 5],
  [142, 176, 1.2, 5.4, 4.6],
];

export function OxygenScene({ value }: { value: number }) {
  return (
    <div className="hm-o2-scene">
      <div className="hm-o2-glow" aria-hidden="true" />
      <svg className="hm-o2" viewBox="0 0 240 240" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="hmO2Ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7cf2ff" />
            <stop offset="0.5" stopColor="#4fb4ff" />
            <stop offset="1" stopColor="#5285f7" />
          </linearGradient>
          <radialGradient id="hmO2Face" cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#123048" />
            <stop offset="1" stopColor="#0a0f18" />
          </radialGradient>
          <clipPath id="hmO2Clip">
            <circle cx="120" cy="120" r="84" />
          </clipPath>
        </defs>
        <circle cx="120" cy="120" r="112" className="hm-o2-outer" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const r1 = i % 5 === 0 ? 103 : 106;
          return (
            <line
              key={i}
              x1={(120 + r1 * Math.sin(a)).toFixed(2)}
              y1={(120 - r1 * Math.cos(a)).toFixed(2)}
              x2={(120 + 110 * Math.sin(a)).toFixed(2)}
              y2={(120 - 110 * Math.cos(a)).toFixed(2)}
              className={i % 5 === 0 ? "hm-o2-tick big" : "hm-o2-tick"}
            />
          );
        })}
        <circle cx="120" cy="120" r="94" className="hm-o2-track" />
        <circle
          cx="120"
          cy="120"
          r="94"
          className="hm-o2-arc hm-once"
          pathLength={100}
          strokeDasharray="98 100"
          transform="rotate(-90 120 120)"
        />
        <g className="hm-o2-breath">
          <circle cx="120" cy="120" r="84" fill="url(#hmO2Face)" />
          <g clipPath="url(#hmO2Clip)">
            <path d="M-108 166 Q-76 154 -44 166 T20 166 T84 166 T148 166 T212 166 T276 166 V240 H-108 Z" className="hm-o2-wave" />
            <path d="M-108 176 Q-76 166 -44 176 T20 176 T84 176 T148 176 T212 176 T276 176 V240 H-108 Z" className="hm-o2-wave b" />
            {BUBBLES.map(([x, y, s, d, delay], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={s}
                className="hm-bubble"
                style={{ animationDuration: `${d}s`, animationDelay: `${-delay}s` }}
              />
            ))}
          </g>
          <circle cx="120" cy="120" r="84" className="hm-o2-rim" />
        </g>
      </svg>
      <div className="hm-o2-read">
        <span className="hm-o2-num">
          {value}
          <small>%</small>
        </span>
        <span className="hm-o2-label">
          SpO<sub>2</sub>
        </span>
      </div>
    </div>
  );
}

// A small round watch (the Torvan has a round face and a blue side plate)
// showing the screen for the selected metric.
export function MiniWatch({ metric, bpm }: { metric: number; bpm: number }) {
  return (
    <svg className="hm-watch" viewBox="0 0 200 220" role="img" aria-label="MATIN Torvan screen (illustration)">
      <defs>
        <linearGradient id="hmWSteel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f96a6" />
          <stop offset="0.35" stopColor="#2c313b" />
          <stop offset="0.7" stopColor="#575e6c" />
          <stop offset="1" stopColor="#1a1d24" />
        </linearGradient>
        <linearGradient id="hmWStrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1d24" />
          <stop offset="1" stopColor="#0c0e12" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="62" y="0" width="76" height="40" rx="10" fill="url(#hmWStrap)" transform="rotate(180 100 20)" />
      <rect x="62" y="180" width="76" height="40" rx="10" fill="url(#hmWStrap)" />
      <rect x="176" y="84" width="12" height="52" rx="5" fill="#3d6be0" />
      <rect x="182" y="96" width="8" height="28" rx="3" fill="#5285f7" />
      <circle cx="100" cy="110" r="84" fill="url(#hmWSteel)" />
      <circle cx="100" cy="110" r="76" fill="#05060a" />
      <circle cx="100" cy="110" r="76" fill="none" stroke="rgba(255,255,255,0.08)" />
      <g key={metric} className="hm-wscreen hm-once">
        {metric === 0 && (
          <>
            <path
              d="M100 82 C92 76 84 71 84 63 C84 58 88 55 92 55 C95 55 98 57 100 60 C102 57 105 55 108 55 C112 55 116 58 116 63 C116 71 108 76 100 82 Z"
              fill="none"
              stroke="#ff4d62"
              strokeWidth="2.4"
              strokeLinejoin="round"
              className="hm-wbeat"
            />
            <text x="100" y="124" className="hm-wt hm-wt-big">
              {bpm}
            </text>
            <text x="100" y="140" className="hm-wt hm-wt-small">
              BPM
            </text>
            <path d="M66 156 H86 L90 150 L94 164 L98 144 L102 160 L106 156 H134" className="hm-wline" />
          </>
        )}
        {metric === 1 && (
          <>
            <text x="100" y="74" className="hm-wt hm-wt-small">
              Resting HR
            </text>
            <text x="100" y="118" className="hm-wt hm-wt-big">
              58
            </text>
            <text x="100" y="134" className="hm-wt hm-wt-small">
              BPM
            </text>
            {RESTING.map((r, i) => (
              <rect
                key={r.day}
                x={70 + i * 9}
                y={164 - (r.bpm - 52) * 1.6}
                width="5"
                height={(r.bpm - 52) * 1.6}
                rx="2"
                fill={i === 6 ? "#5fd6d0" : "#2c5bbf"}
              />
            ))}
          </>
        )}
        {metric === 2 && (
          <>
            <circle cx="100" cy="110" r="54" fill="none" stroke="rgba(95,214,208,0.18)" strokeWidth="6" />
            <circle
              cx="100"
              cy="110"
              r="54"
              fill="none"
              stroke="#5fd6d0"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="98 100"
              transform="rotate(-90 100 110)"
            />
            <text x="100" y="118" className="hm-wt hm-wt-big">
              98%
            </text>
            <text x="100" y="136" className="hm-wt hm-wt-small">
              SpO2
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
