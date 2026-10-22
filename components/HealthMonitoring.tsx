"use client";

import { useEffect, useState, type ReactNode } from "react";
import SectionHead from "@/components/SectionHead";
import useShowcase from "@/components/useShowcase";
import useSteadyHeight from "@/components/useSteadyHeight";
import HealthWatch, { type MetricId, type Screen } from "@/components/health/faces";
import { RESTING, SLEEP_TOTAL, STEPS } from "@/components/health/visuals";

// Animated health showcase drawn on the watch's own screen: only the metrics
// this watch really measures (heart rate, resting heart rate, blood oxygen,
// sleep, activity). Everything is visible without JavaScript; JS only adds
// switching, the gentle auto-advance and small number changes. Animations run
// only while the section is on screen. All values are illustrative samples.

const METRICS: Record<
  MetricId,
  { tab: string; kicker: string; title: string; text: string; caption: string; unit: string; tabVal: string }
> = {
  hr: {
    tab: "Heart rate",
    kicker: "Heart rate",
    title: "Know how hard you are working.",
    text: "Check your heart rate right from your wrist during a workout, a long shift or a hike.",
    caption: "Heart rate is read by the optical sensor on the back of the watch.",
    unit: "BPM",
    tabVal: "72",
  },
  rest: {
    tab: "Resting HR",
    kicker: "Daily resting heart rate",
    title: "Understand Your Resting Rhythm.",
    text: "Track your daily resting heart rate and follow your trends over time.",
    caption: "One resting heart rate value for each day, so you can see your trend.",
    unit: "BPM",
    tabVal: "58",
  },
  spo2: {
    tab: "Blood oxygen",
    kicker: "Blood oxygen (SpO2)",
    title: "A Clearer View of Your Oxygen Levels.",
    text: "Measure blood oxygen saturation directly from your wrist.",
    caption: "Blood oxygen saturation (SpO2) is read by the optical sensor on the back of the watch.",
    unit: "%",
    tabVal: "98",
  },
  sleep: {
    tab: "Sleep",
    kicker: "Sleep tracking",
    title: "See how well you really slept.",
    text: "Wear it to bed and wake up to a clear picture of your night: how long you slept and how restful it was.",
    caption: "Sleep is tracked automatically through the night and synced to the phone app.",
    unit: "h",
    tabVal: "7.5",
  },
  activity: {
    tab: "Activity",
    kicker: "Steps and calories",
    title: "Every step of the day counts.",
    text: "Steps and calories add up on your wrist all day, and a reminder nudges you when you sit too long.",
    caption: "Daily steps and calories, with a sedentary reminder.",
    unit: "steps",
    tabVal: "8.4k",
  },
};

const BPMS = [72, 73, 72, 71, 72, 74, 73];

// Tab icons, drawn on a 40 x 24 box.
const ICONS: Record<MetricId, ReactNode> = {
  hr: <path d="M1 13 H11 L14 9 L18 21 L23 3 L26 15 L28 13 H39" />,
  rest: <path d="M2 8 C8 8 10 15 16 14 S24 18 28 17 S35 19 38 19" />,
  spo2: (
    <>
      <circle cx="20" cy="12" r="9" className="hm-ti-track" />
      <path d="M20 3 A9 9 0 1 1 19 3" />
    </>
  ),
  sleep: (
    <>
      <path d="M23 3 A9 9 0 1 0 30 16 A7 7 0 0 1 23 3 Z" />
      <path d="M32 5 v3 M30.5 6.5 h3" />
    </>
  ),
  activity: <path d="M3 19 L13 12 L20 15 L35 5 M29 5 H35 V11" />,
};

// Shows "SpO2" with a real subscript (the site font has no ₂ character).
const sub = (t: string) =>
  t.split("SpO2").flatMap((part, i) => (i ? [<span key={i}>SpO<sub>2</sub></span>, part] : [part]));

export default function HealthMonitoring({
  name,
  metrics,
  continuous,
  image,
  imageAlt,
  screen,
  look,
}: {
  name: string;
  metrics: MetricId[];
  continuous?: boolean;
  image: string;
  imageAlt: string;
  screen: Screen;
  look?: string;
}) {
  const n = metrics.length;
  const { ref, tabs, active, live, reduced, touch, choose, onKey, onTouchStart, onTouchEnd } = useShowcase(n);
  const body = useSteadyHeight<HTMLDivElement>();
  const [bpmStep, setBpmStep] = useState(0);
  const [restPick, setRestPick] = useState(RESTING.length - 1);
  const [o2, setO2] = useState(98);
  const [steps, setSteps] = useState(STEPS);
  const id = metrics[active];

  // Small natural changes in the sample heart rate.
  useEffect(() => {
    if (!live || id !== "hr" || reduced.current) return;
    const t = window.setInterval(() => setBpmStep((s) => (s + 1) % BPMS.length), 2600);
    return () => window.clearInterval(t);
  }, [live, id]);

  // Count the oxygen value or the steps up when their screen opens.
  useEffect(() => {
    if ((id !== "spo2" && id !== "activity") || reduced.current) {
      setO2(98);
      setSteps(STEPS);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now;
      const u = Math.min(1, Math.max(0, now - t0) / (id === "activity" ? 1600 : 1300));
      const e = 1 - Math.pow(1 - u, 3);
      if (id === "spo2") setO2(Math.round(90 + 8 * e));
      else setSteps(Math.round(STEPS * e));
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [id]);

  const m = METRICS[id];
  const text =
    id === "hr" && continuous
      ? {
          title: "Every beat, all day long.",
          text: "Your heart rate is read from your wrist around the clock, so you always know how hard you are working.",
          caption: "Continuous wrist heart rate monitoring with per-minute readings.",
        }
      : m;
  const value: ReactNode =
    id === "hr" ? (
      BPMS[bpmStep]
    ) : id === "rest" ? (
      RESTING[restPick].bpm
    ) : id === "spo2" ? (
      98
    ) : id === "sleep" ? (
      <>
        {SLEEP_TOTAL.h}
        <small>h</small> {SLEEP_TOTAL.m}
        <small>m</small>
      </>
    ) : (
      STEPS.toLocaleString("en-US")
    );
  const titleEnd = metrics.includes("spo2") ? "SpO2" : metrics.includes("sleep") ? "sleep" : "more";

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
          eyebrow={`Heart rate & ${titleEnd}`}
          title={
            <>
              Your Health. <span className="grad">In Every Beat.</span>
            </>
          }
          intro={`Health tracking on the ${name}, right on its own screen.`}
        />

        <div
          className="hm-tabs"
          role="tablist"
          aria-label="Health features"
          onKeyDown={onKey}
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {metrics.map((t, i) => (
            <button
              key={t}
              ref={(b) => {
                tabs.current[i] = b;
              }}
              type="button"
              role="tab"
              id={`hm-tab-${t}`}
              aria-selected={i === active}
              aria-controls="hm-panel"
              tabIndex={i === active ? 0 : -1}
              className={`hm-tab hm-tab-${t}${i === active ? " on" : ""}`}
              onClick={() => choose(i)}
            >
              <svg viewBox="0 0 40 24" aria-hidden="true" focusable="false">
                {ICONS[t]}
              </svg>
              <span className="hm-tab-name">{METRICS[t].tab}</span>
              <span className="hm-tab-val">
                {METRICS[t].tabVal}
                <small>{METRICS[t].unit}</small>
              </span>
              <span className="hm-tab-bar" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div ref={body} className="hm-body">
          <div className={`hm-visual hm-visual-${id}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <span className="hm-badge">Illustrative</span>
            <HealthWatch
              image={image}
              imageAlt={imageAlt}
              screen={screen}
              metrics={metrics}
              active={id}
              bpm={BPMS[bpmStep]}
              restPick={restPick}
              onPick={(i) => {
                touch();
                setRestPick(i);
              }}
              o2={o2}
              steps={steps}
              look={look}
            />
            <div className="hm-dots" aria-hidden="true">
              {metrics.map((t, i) => (
                <span key={t} className={i === active ? "on" : ""} />
              ))}
            </div>
          </div>

          <div className="hm-info" id="hm-panel" role="tabpanel" aria-labelledby={`hm-tab-${id}`}>
            <div key={id} className="hm-info-in hm-once">
              <p className="hm-kicker">{sub(m.kicker)}</p>
              <h3>{text.title}</h3>
              <p className="hm-text">{text.text}</p>
              <div className="hm-read">
                <span className="hm-value" aria-live="off">
                  <span key={String(id === "hr" ? BPMS[bpmStep] : id === "rest" ? restPick : id)} className="hm-digits hm-once">
                    {value}
                  </span>
                  {id !== "sleep" && <small>{m.unit}</small>}
                </span>
                <span className="hm-read-note">
                  {id === "rest" ? `${RESTING[restPick].day}, sample` : id === "sleep" ? "Last night, sample" : id === "activity" ? "Today, sample" : "Sample reading"}
                </span>
              </div>
              <p className="hm-caption">{sub(text.caption)}</p>
            </div>
          </div>
        </div>

        <p className="hm-note">
          Animations and values are illustrative, not live readings. The {name} is a wellness smartwatch, not a medical
          device, and is not intended to diagnose any condition.
        </p>
      </div>
    </section>
  );
}
