"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import SectionHead from "@/components/SectionHead";
import { HeartScene, MiniWatch, OxygenScene, RESTING, RestingScene } from "@/components/health/visuals";

// Animated health monitoring showcase: heart rate, daily resting heart rate
// and blood oxygen. Everything is visible without JavaScript; JS only adds
// switching, the gentle auto-advance and small number changes. Animations run
// only while the section is on screen. All values are illustrative samples.

const METRICS = [
  {
    id: "hr",
    tab: "Heart rate",
    kicker: "Heart rate",
    title: "Every beat, all day long.",
    text: "Your heart rate is read from your wrist around the clock, so you always know how hard you are working.",
    caption: "Continuous wrist heart rate monitoring with per-minute readings.",
    unit: "BPM",
  },
  {
    id: "rest",
    tab: "Resting HR",
    kicker: "Daily resting heart rate",
    title: "Understand Your Resting Rhythm.",
    text: "Track your daily resting heart rate and follow your trends over time.",
    caption: "One resting heart rate value for each day, so you can see your trend.",
    unit: "BPM",
  },
  {
    id: "spo2",
    tab: "Blood oxygen",
    kicker: "Blood oxygen (SpO2)",
    title: "A Clearer View of Your Oxygen Levels.",
    text: "Measure blood oxygen saturation directly from your wrist.",
    caption: "Blood oxygen saturation (SpO2) is read by the optical sensor on the back of the watch.",
    unit: "%",
  },
] as const;

const BPMS = [72, 73, 72, 71, 72, 74, 73];

// Shows "SpO2" with a real subscript (the site font has no ₂ character).
const sub = (t: string) =>
  t.split("SpO2").flatMap((part, i) => (i ? [<span key={i}>SpO<sub>2</sub></span>, part] : [part]));

export default function HealthMonitoring() {
  const ref = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const [bpmStep, setBpmStep] = useState(0);
  const [restPick, setRestPick] = useState(RESTING.length - 1);
  const [o2, setO2] = useState(98);
  const hold = useRef(0);
  const reduced = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const touch = () => {
    hold.current = Date.now() + 15000;
  };
  const go = useCallback((i: number) => setActive(((i % 3) + 3) % 3), []);

  // Run animations only while the section is on screen.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Move to the next metric by itself, unless the visitor is using it.
  useEffect(() => {
    if (!live || reduced.current) return;
    const t = window.setInterval(() => {
      if (Date.now() > hold.current) setActive((a) => (a + 1) % 3);
    }, 7000);
    return () => window.clearInterval(t);
  }, [live]);

  // Small natural changes in the sample heart rate.
  useEffect(() => {
    if (!live || active !== 0 || reduced.current) return;
    const t = window.setInterval(() => setBpmStep((s) => (s + 1) % BPMS.length), 2600);
    return () => window.clearInterval(t);
  }, [live, active]);

  // Count the oxygen value up when its panel opens.
  useEffect(() => {
    if (active !== 2 || reduced.current) {
      setO2(98);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now;
      const u = Math.min(1, (now - t0) / 1300);
      setO2(Math.round(90 + 8 * (1 - Math.pow(1 - u, 3))));
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const choose = (i: number) => {
    touch();
    go(i);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? 2 : d ? (active + d + 3) % 3 : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(to);
    tabs.current[to]?.focus();
  };

  const onTouchStart = (e: TouchEvent) => {
    swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touch();
  };
  const onTouchEnd = (e: TouchEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) choose(active + (dx < 0 ? 1 : -1));
  };

  const m = METRICS[active];
  const value = active === 0 ? BPMS[bpmStep] : active === 1 ? RESTING[restPick].bpm : 98;

  return (
    <section
      ref={ref}
      id="health"
      className={`section hm${live ? "" : " hm-paused"}`}
      aria-labelledby="hm-title"
      onMouseEnter={touch}
      onMouseMove={touch}
    >
      <div className="hm-stage">
        <SectionHead
          id="hm-title"
          eyebrow="Heart rate & SpO2"
          title={
            <>
              Your Health. <span className="grad">In Every Beat.</span>
            </>
          }
          intro="Intelligent health monitoring that keeps you connected to what matters most."
        />

        <div className="hm-tabs" role="tablist" aria-label="Health features" onKeyDown={onKey}>
          {METRICS.map((t, i) => (
            <button
              key={t.id}
              ref={(b) => {
                tabs.current[i] = b;
              }}
              type="button"
              role="tab"
              id={`hm-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls="hm-panel"
              tabIndex={i === active ? 0 : -1}
              className={`hm-tab hm-tab-${t.id}${i === active ? " on" : ""}`}
              onClick={() => choose(i)}
            >
              <svg viewBox="0 0 40 24" aria-hidden="true" focusable="false">
                {i === 0 && <path d="M1 13 H11 L14 9 L18 21 L23 3 L26 15 L28 13 H39" />}
                {i === 1 && <path d="M2 8 C8 8 10 15 16 14 S24 18 28 17 S35 19 38 19" />}
                {i === 2 && (
                  <>
                    <circle cx="20" cy="12" r="9" className="hm-ti-track" />
                    <path d="M20 3 A9 9 0 1 1 19 3" />
                  </>
                )}
              </svg>
              <span className="hm-tab-name">{t.tab}</span>
              <span className="hm-tab-val">
                {i === 0 ? 72 : i === 1 ? 58 : 98}
                <small>{t.unit}</small>
              </span>
              <span className="hm-tab-bar" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="hm-body">
          <div
            className={`hm-visual hm-visual-${m.id}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <span className="hm-badge">Illustrative</span>
            <div className={`hm-scene${active === 0 ? " on" : ""}`} aria-hidden={active !== 0} inert={active !== 0}>
              <HeartScene bpm={BPMS[bpmStep]} />
            </div>
            <div className={`hm-scene${active === 1 ? " on" : ""}`} aria-hidden={active !== 1} inert={active !== 1}>
              <RestingScene
                pick={restPick}
                onPick={(i) => {
                  touch();
                  setRestPick(i);
                }}
              />
            </div>
            <div className={`hm-scene${active === 2 ? " on" : ""}`} aria-hidden={active !== 2} inert={active !== 2}>
              <OxygenScene value={o2} />
            </div>
            <div className="hm-dots" aria-hidden="true">
              {METRICS.map((t, i) => (
                <span key={t.id} className={i === active ? "on" : ""} />
              ))}
            </div>
          </div>

          <div className="hm-info" id="hm-panel" role="tabpanel" aria-labelledby={`hm-tab-${m.id}`}>
            <div key={m.id} className="hm-info-in hm-once">
              <p className="hm-kicker">{sub(m.kicker)}</p>
              <h3>{m.title}</h3>
              <p className="hm-text">{m.text}</p>
              <div className="hm-read">
                <span className="hm-value" aria-live="off">
                  <span key={value} className="hm-digits hm-once">
                    {value}
                  </span>
                  <small>{m.unit}</small>
                </span>
                <span className="hm-read-note">
                  {active === 1 ? `${RESTING[restPick].day}, sample` : "Sample reading"}
                </span>
              </div>
              <p className="hm-caption">{sub(m.caption)}</p>
            </div>
            <MiniWatch metric={active} bpm={BPMS[bpmStep]} />
          </div>
        </div>

        <p className="hm-note">
          Animations and values are illustrative, not live readings. The MATIN Torvan is a wellness smartwatch, not a
          medical device, and is not intended to diagnose any condition.
        </p>
      </div>
    </section>
  );
}
