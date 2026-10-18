// Top-down pool: a swimmer does freestyle lengths in lane 2 while the swim
// log beside it counts laps, distance and strokes. Everything comes from one
// time value t (seconds), so the scene and the numbers always agree.

const LEN = 4.4; // seconds per 25 m length
const TURN = 0.7; // seconds at the wall
const CYCLE = LEN + TURN;
const START = 12; // lengths already swum when the sample starts
const STROKES = 18; // strokes per length
const ARM_CYCLES = STROKES / 2;

// A frame with the swimmer mid-pool, for the first paint and reduced motion.
export const POOL_STILL = LEN * 0.55;

// Pool, in SVG units.
const X0 = 72;
const X1 = 328;
const TOP = 22;
const LANE = 46.5;
const LANE_Y = TOP + LANE * 1.5;

const SPORTS = [
  "Running",
  "Walking",
  "Cycling",
  "Fitness",
  "Rock climbing",
  "Swimming",
];

const TAU = Math.PI * 2;

// One arm, from the shoulder at (sx, side * 5): it pulls under the body from
// reaching forward to the hip, then swings back over the water.
function arm(phase: number, side: 1 | -1) {
  const p = ((phase % 1) + 1) % 1;
  const pull = p < 0.6;
  const a = pull ? (p / 0.6) * Math.PI : Math.PI + ((p - 0.6) / 0.4) * Math.PI;
  const reach = pull ? 3 : 10;
  const sx = 7;
  const sy = side * 5;
  const hx = sx + Math.cos(a) * 13;
  const hy = sy + side * Math.abs(Math.sin(a)) * reach;
  return { sx, sy, hx, hy, pull };
}

export default function Pool({ t, count }: { t: number; count: string }) {
  const i = Math.floor(t / CYCLE);
  const u = t - i * CYCLE;
  const swimming = u < LEN;
  const f = swimming ? u / LEN : 1;
  const right = i % 2 === 0;
  const x = right ? X0 + (X1 - X0) * f : X1 - (X1 - X0) * f;
  // At the wall the swimmer turns round in place.
  const turn = swimming ? 0 : Math.min(1, (u - LEN) / TURN);
  const angle = (right ? 0 : 180) + 180 * (turn * turn * (3 - 2 * turn));
  const phase = swimming ? f * ARM_CYCLES : 0.6;
  const a1 = arm(phase, 1);
  const a2 = arm(phase + 0.5, -1);
  const kick = Math.sin(TAU * f * ARM_CYCLES * 3) * (swimming ? 2.2 : 0.4);

  const laps = START + i + (swimming ? 0 : 1);
  const strokes =
    (START + i) * STROKES + Math.min(STROKES, Math.floor(f * STROKES));
  const swolf = 48 + (i % 3);
  const hr = Math.round(131 + 5 * Math.sin(t / 2.3) + 2 * Math.sin(t / 0.9));

  return (
    <div className="ft-body">
      <div className="ft-scene">
        <span className="hm-badge">Illustrative</span>
        <svg
          viewBox="0 0 400 230"
          className="ft-pool-svg"
          role="img"
          aria-label="Top view of a swimmer doing freestyle lengths in a 25 metre pool"
        >
          <defs>
            <linearGradient id="ftWater" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0f5b57" />
              <stop offset="0.55" stopColor="#0b4744" />
              <stop offset="1" stopColor="#08332f" />
            </linearGradient>
            <radialGradient id="ftLight" cx="0.3" cy="0.2" r="0.8">
              <stop offset="0" stopColor="#7cf0c9" stopOpacity="0.22" />
              <stop offset="1" stopColor="#7cf0c9" stopOpacity="0" />
            </radialGradient>
            <clipPath id="ftWaterClip">
              <rect x="24" y={TOP} width="352" height={LANE * 4} rx="6" />
            </clipPath>
          </defs>

          <rect
            x="8"
            y="8"
            width="384"
            height="214"
            rx="14"
            className="ft-deck"
          />
          <rect
            x="24"
            y={TOP}
            width="352"
            height={LANE * 4}
            rx="6"
            fill="url(#ftWater)"
          />
          <g clipPath="url(#ftWaterClip)">
            <rect
              x="24"
              y={TOP}
              width="352"
              height={LANE * 4}
              fill="url(#ftLight)"
            />
            {/* Light on the pool floor, drifting slowly. */}
            <g className="ft-caustics">
              {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                <path
                  key={k}
                  d={`M-40 ${TOP + 14 + k * 27} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`}
                />
              ))}
            </g>
            {/* Lane floor lines with T ends. */}
            {[0, 1, 2, 3].map((k) => {
              const y = TOP + LANE * (k + 0.5);
              return (
                <path
                  key={k}
                  d={`M44 ${y} H356 M44 ${y - 6} V${y + 6} M356 ${y - 6} V${y + 6}`}
                  className="ft-floorline"
                />
              );
            })}
            {/* Wake behind the swimmer. */}
            {swimming && (
              <g
                transform={`translate(${x} ${LANE_Y}) rotate(${right ? 0 : 180}) scale(1.45)`}
                className="ft-wake"
              >
                <path d="M-18 -7 Q-40 -11 -66 -15" />
                <path d="M-18 7 Q-40 11 -66 15" />
                <path d="M-24 0 H-52" />
              </g>
            )}
            {/* Ripple at the wall on every turn. */}
            {!swimming && (
              <circle
                key={i}
                cx={right ? X1 + 14 : X0 - 14}
                cy={LANE_Y}
                r="6"
                className="ft-ripple"
              />
            )}
          </g>

          {/* Lane ropes. */}
          {[1, 2, 3].map((k) => (
            <g key={k} className="ft-rope">
              <line
                x1="24"
                x2="376"
                y1={TOP + LANE * k}
                y2={TOP + LANE * k}
                className="ft-rope-a"
              />
              <line
                x1="24"
                x2="376"
                y1={TOP + LANE * k}
                y2={TOP + LANE * k}
                className="ft-rope-b"
              />
            </g>
          ))}

          {/* Swimmer, facing +x in its own frame. */}
          <g
            transform={`translate(${x.toFixed(1)} ${LANE_Y}) rotate(${angle.toFixed(1)}) scale(1.45)`}
          >
            <ellipse cx="0" cy="0" rx="16" ry="11" className="ft-splash" />
            {[a1, a2]
              .filter((a) => a.pull)
              .map((a, k) => (
                <path
                  key={`p${k}`}
                  d={`M${a.sx} ${a.sy} L${a.hx.toFixed(1)} ${a.hy.toFixed(1)}`}
                  className="ft-arm-under"
                />
              ))}
            <path
              d={`M-9 2.5 L-24 ${(3 + kick).toFixed(1)} M-9 -2.5 L-24 ${(-3 - kick).toFixed(1)}`}
              className="ft-leg"
            />
            <path
              d="M-11 0 C-11 -6 9 -7.5 9 0 C9 7.5 -11 6 -11 0 Z"
              className="ft-body-shape"
            />
            <circle cx="12.5" cy="0" r="4.6" className="ft-cap" />
            {[a1, a2]
              .filter((a) => !a.pull)
              .map((a, k) => (
                <g key={`r${k}`}>
                  <path
                    d={`M${a.sx} ${a.sy} L${a.hx.toFixed(1)} ${a.hy.toFixed(1)}`}
                    className="ft-arm-over"
                  />
                  <circle
                    cx={a.hx.toFixed(1)}
                    cy={a.hy.toFixed(1)}
                    r="1.9"
                    className="ft-hand"
                  />
                </g>
              ))}
          </g>

          <text x="200" y="217" textAnchor="middle" className="ft-label">
            25 m
          </text>
          <text x="31" y={LANE_Y + 3} className="ft-lane-no">
            2
          </text>
        </svg>
      </div>

      <div className="ft-panel" aria-live="off">
        <div className="ft-hero-stat">
          <span className="ft-k">Laps</span>
          <strong key={laps} className="ft-pop">
            {laps}
          </strong>
          <span className="ft-sub">Pool swim · freestyle</span>
        </div>
        <dl className="ft-grid">
          <div>
            <dt>Distance</dt>
            <dd>
              {(laps * 25).toLocaleString("en-US")}
              <small>m</small>
            </dd>
          </div>
          <div>
            <dt>Strokes</dt>
            <dd>{strokes}</dd>
          </div>
          <div>
            <dt>SWOLF</dt>
            <dd>{swolf}</dd>
          </div>
          <div>
            <dt>Pace</dt>
            <dd>
              2:05<small>/100m</small>
            </dd>
          </div>
          <div className="ft-wide">
            <dt>Heart rate</dt>
            <dd>
              <span className="ft-heart" aria-hidden="true" />
              {hr}
              <small>bpm</small>
            </dd>
          </div>
        </dl>
      </div>

      <div className="ft-sports">
        <p className="ft-sports-title">
          <strong>{count}</strong> sport modes, including
        </p>
        <ul>
          {SPORTS.map((s, k) => (
            <li
              key={s}
              className={
                k === Math.floor(t / 1.8) % SPORTS.length ? "on" : undefined
              }
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
