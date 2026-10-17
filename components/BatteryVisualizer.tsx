"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import SectionHead from "@/components/SectionHead";

// "Battery" showcase: a glowing watch face with the battery at 100%, its
// capacity and how many days it lasts. Plain SVG + CSS keyframes, no library.
// Everything is visible without JavaScript and there is no entrance or
// scroll reveal: motion is only ambient (orbiting sparks, liquid, glow) and
// is paused while the section is off screen or for reduced motion.

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function WatchFace({ mah, days }: { mah: number; days: string }) {
  return (
    <svg className="bv-svg" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <linearGradient id="bv-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00CC44" />
          <stop offset=".55" stopColor="#00FF66" />
          <stop offset="1" stopColor="#9DFFC6" />
        </linearGradient>
        <linearGradient id="bv-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5CFF9D" />
          <stop offset=".35" stopColor="#00FF66" />
          <stop offset="1" stopColor="#00A63A" />
        </linearGradient>
        <linearGradient id="bv-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9DFFC6" stopOpacity=".9" />
          <stop offset="1" stopColor="#00CC44" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="bv-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bv-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#00FF66" stopOpacity=".22" />
          <stop offset=".6" stopColor="#00CC44" stopOpacity=".06" />
          <stop offset="1" stopColor="#00CC44" stopOpacity="0" />
        </radialGradient>
        <filter id="bv-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bv-spark" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bv-blur" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id="bv-cell">
          <rect x="144" y="114" width="104" height="40" rx="6" />
        </clipPath>
      </defs>

      {/* Ambient halo */}
      <circle className="bv-breathe" cx="200" cy="200" r="150" fill="url(#bv-halo)" />

      {/* Minute ticks: one dashed circle (60 dashes) + every 5th brighter */}
      <g className="bv-ticks bv-spin">
        <circle cx="200" cy="200" r="166" fill="none" stroke="#1E3A2A" strokeWidth="6" strokeDasharray="1.2 16.18" />
        <circle cx="200" cy="200" r="166" fill="none" stroke="#2F6B48" strokeWidth="8" strokeDasharray="1.6 85.32" />
      </g>

      {/* Outer energy ring, full = 100%, starting at 12 o'clock */}
      <g transform="rotate(-90 200 200)">
        <circle cx="200" cy="200" r="182" fill="none" stroke="#12241A" strokeWidth="8" />
        <circle
          cx="200"
          cy="200"
          r="182"
          fill="none"
          stroke="url(#bv-ring)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#bv-glow)"
        />
      </g>

      {/* Orbiting particle pulses */}
      <g className="bv-comet bv-spin">
        <circle
          cx="200"
          cy="200"
          r="182"
          fill="none"
          stroke="#D9FFE8"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="4 96"
          transform="rotate(-90 200 200)"
          filter="url(#bv-spark)"
        />
      </g>
      <g className="bv-orbit-a bv-spin">
        <circle cx="200" cy="18" r="2.6" fill="#EFFFF5" filter="url(#bv-spark)" />
      </g>
      <g className="bv-orbit-b bv-spin">
        <circle cx="382" cy="200" r="2" fill="#9DFFC6" filter="url(#bv-spark)" />
        <circle cx="18" cy="200" r="1.6" fill="#00FF66" filter="url(#bv-spark)" />
      </g>
      <g className="bv-orbit-c bv-spin">
        <circle cx="200" cy="34" r="1.4" fill="#00FF66" opacity=".8" />
        <circle cx="317" cy="317" r="1.2" fill="#9DFFC6" opacity=".7" />
        <circle cx="83" cy="317" r="1.2" fill="#00FF66" opacity=".7" />
      </g>

      {/* Capacity badge */}
      <rect x="160" y="74" width="80" height="22" rx="11" fill="rgba(0,255,102,.08)" stroke="#00CC44" strokeOpacity=".55" />
      <text className="bv-t-badge" x="200" y="89" textAnchor="middle">
        {mah} mAh
      </text>

      {/* Battery: floats, liquid energy fill, bubbles, sheen */}
      <g className="bv-float">
        <rect className="bv-breathe" x="140" y="110" width="112" height="48" rx="10" fill="#00FF66" filter="url(#bv-blur)" />
        <rect x="138" y="108" width="116" height="52" rx="11" fill="#0B0E14" stroke="url(#bv-shell)" strokeWidth="2.5" />
        <rect x="257" y="124" width="6" height="20" rx="2.5" fill="#00CC44" />
        <g clipPath="url(#bv-cell)">
          <rect x="144" y="114" width="104" height="40" fill="url(#bv-liquid)" />
          {/* Two waves, 2 periods wider than the cell so a 60px shift loops */}
          <path
            className="bv-wave bv-wave-back"
            fill="#00A63A"
            opacity=".45"
            d="M144 128 q7.5 -4 15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 V154 H144 Z"
          />
          <path
            className="bv-wave"
            fill="#B8FFD6"
            opacity=".35"
            d="M144 119 q7.5 -4 15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 V114 H144 Z"
          />
          <circle className="bv-bubble" style={d(0)} cx="160" cy="156" r="1.8" fill="#EFFFF5" />
          <circle className="bv-bubble" style={d(0.7)} cx="186" cy="156" r="1.3" fill="#EFFFF5" />
          <circle className="bv-bubble" style={d(1.4)} cx="214" cy="156" r="2" fill="#EFFFF5" />
          <circle className="bv-bubble" style={d(2.1)} cx="236" cy="156" r="1.4" fill="#EFFFF5" />
          <rect className="bv-sheen" x="144" y="110" width="26" height="48" fill="url(#bv-sheen)" />
        </g>
        <path d="M203 118 L187 137 H198 L194 150 L211 130 H200 Z" fill="#0B0E14" opacity=".85" />
      </g>

      {/* Charge level, with a pulsing blurred copy behind it */}
      <text className="bv-t-pct bv-glow-pulse" x="200" y="224" textAnchor="middle" filter="url(#bv-blur)" fill="#00FF66">
        100%
      </text>
      <text className="bv-t-pct" x="200" y="224" textAnchor="middle">
        100<tspan dx="2">%</tspan>
      </text>

      {/* Battery life range */}
      <text className="bv-t-label" x="200" y="250" textAnchor="middle">
        BATTERY LIFE
      </text>
      <text className="bv-t-days bv-glow-pulse" style={d(1.2)} x="200" y="273" textAnchor="middle" filter="url(#bv-blur)" fill="#00FF66">
        {days} Days
      </text>
      <text className="bv-t-days" x="200" y="273" textAnchor="middle">
        <tspan>{days}</tspan> Days
      </text>

      {/* Status pill: two messages cross-fade */}
      <rect x="98" y="290" width="204" height="26" rx="13" fill="rgba(0,255,102,.10)" stroke="#00FF66" strokeOpacity=".35" />
      <circle className="bv-dot" cx="116" cy="303" r="3" fill="#00FF66" filter="url(#bv-spark)" />
      <text className="bv-t-pill bv-msg-a" x="208" y="307" textAnchor="middle">
        Ultra Power Mode
      </text>
      <text className="bv-t-pill bv-msg-b" x="208" y="307" textAnchor="middle">
        Longer Use • Less Charging
      </text>
    </svg>
  );
}

const icons = {
  cell: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="7" width="17" height="10" rx="2.2" />
      <path d="M21.5 10.5v3" />
      <path d="M5.5 10v4M8.5 10v4M11.5 10v4" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  ),
  magnet: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.5v8a6 6 0 0 0 12 0v-8" />
      <path d="M6 7.5h3.5M14.5 7.5H18M9.5 3.5v8a2.5 2.5 0 0 0 5 0v-8" />
    </svg>
  ),
};

export default function BatteryVisualizer({
  name,
  mah,
  days,
}: {
  name: string;
  mah: number;
  // Battery life range, e.g. "11 – 30".
  days: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(true);

  // Pause the ambient motion while the section is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const points = [
    { icon: icons.cell, value: `${mah} mAh`, title: "Large battery", text: "A big cell built for long weeks away from a charger." },
    { icon: icons.calendar, value: `${days} days`, title: "On one charge", text: "Depending on how much you use GPS and notifications." },
    { icon: icons.magnet, value: "Magnetic", title: "Quick charging", text: "The magnetic cable snaps on in a second, no fiddly ports." },
  ];

  return (
    <section ref={ref} id="battery" className={`section bv${live ? "" : " bv-paused"}`} aria-labelledby="bv-title">
      <div className="bv-stage">
        <SectionHead
          id="bv-title"
          eyebrow="Battery"
          title={
            <>
              Charge less. <span className="grad">Go further.</span>
            </>
          }
          intro={`The ${name} packs a ${mah}mAh battery that keeps going for ${days} days on a single charge.`}
        />

        <div className="bv-grid">
          <figure className="bv-watch">
            <div
              className="bv-screen"
              role="img"
              aria-label={`Watch screen: battery 100%, ${mah} mAh, ${days} days of battery life, Ultra Power Mode`}
            >
              <WatchFace mah={mah} days={days} />
            </div>
          </figure>

          <ul className="bv-points">
            {points.map((p) => (
              <li key={p.title}>
                <span className="bv-icon">{p.icon}</span>
                <div>
                  <strong>{p.value}</strong>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
