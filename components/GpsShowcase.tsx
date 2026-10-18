"use client";

import { useEffect, useState, type ReactNode } from "react";
import SectionHead from "@/components/SectionHead";
import useShowcase from "@/components/useShowcase";
import GpsWatch, {
  altFeet,
  dirName,
  mapOf,
  type GpsScreen,
} from "@/components/gps/faces";
import type { Screen } from "@/components/health/faces";

// Animated GPS showcase drawn on the watch's own screen, for watches with
// built-in GPS: a route that draws itself on a contour map, satellites
// locking on, a live compass and an altitude profile. Only the screens a
// watch really has are shown. Works like the health section: visible without
// JavaScript, tabs + swipe + gentle auto-advance, motion only while on
// screen. Values are illustrative samples.

const DRAW_MS = 6000;
const HOLD_MS = 1600;

const ICONS: Record<GpsScreen, ReactNode> = {
  route: (
    <>
      <path d="M3 20 C10 20 9 9 17 10 S26 18 31 11 L35 6" />
      <circle cx="35" cy="6" r="2.4" />
    </>
  ),
  sats: (
    <>
      <circle cx="20" cy="12" r="5" />
      <ellipse cx="20" cy="12" rx="16" ry="5" transform="rotate(-20 20 12)" />
    </>
  ),
  compass: (
    <>
      <circle cx="20" cy="12" r="10" />
      <path d="M20 4 L23 12 L20 20 L17 12 Z" />
    </>
  ),
  alt: <path d="M2 21 L13 7 L19 14 L25 5 L38 21" />,
};

export default function GpsShowcase({
  name,
  screens,
  systems = ["GPS"],
  barometric,
  image,
  imageAlt,
  screen,
  look,
}: {
  name: string;
  screens: GpsScreen[];
  systems?: string[];
  barometric?: boolean;
  image: string;
  imageAlt: string;
  screen: Screen;
  look?: string;
}) {
  const n = screens.length;
  const {
    ref,
    tabs,
    active,
    live,
    reduced,
    choose,
    onKey,
    onTouchStart,
    onTouchEnd,
  } = useShowcase(n);
  const id = screens[active];
  const satTarget = systems.length * 5 + 4;
  const route = mapOf(look);
  const [p, setP] = useState(1);
  const [heading, setHeading] = useState(42);
  const [sats, setSats] = useState(satTarget);

  // Route and altitude: draw over DRAW_MS, hold, then start again.
  useEffect(() => {
    if (!live || reduced.current || (id !== "route" && id !== "alt")) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) % (DRAW_MS + HOLD_MS);
      const u = Math.min(1, t / DRAW_MS);
      setP(u * u * (3 - 2 * u) * 0.15 + u * 0.85);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, id, reduced]);

  // Compass: the heading drifts gently, like a watch held while walking.
  useEffect(() => {
    if (!live || reduced.current || id !== "compass") return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      setHeading(42 + 30 * Math.sin(t / 2300) + 9 * Math.sin(t / 830));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, id, reduced]);

  // Satellites: count up as they are found.
  useEffect(() => {
    if (id !== "sats" || reduced.current) {
      setSats(satTarget);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const u = Math.min(1, (now - t0) / 2200);
      setSats(Math.round(satTarget * (1 - Math.pow(1 - u, 2))));
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id, satTarget, reduced]);

  const list =
    systems.length > 1
      ? `${systems.slice(0, -1).join(", ")} and ${systems[systems.length - 1]}`
      : systems[0];
  const COPY: Record<
    GpsScreen,
    {
      tab: string;
      kicker: string;
      title: string;
      text: string;
      caption: string;
    }
  > = {
    route: {
      tab: "Route",
      kicker: "Built-in GPS",
      title: "Every trail, mapped as you go.",
      text: `The ${name} has GPS built in, so it tracks your route, distance and pace on runs, rides and hikes.`,
      caption: "Your route, distance, time and pace for each GPS workout.",
    },
    sats: {
      tab: "Satellites",
      kicker: `${systems.length} satellite systems`,
      title: "More satellites. A steadier fix.",
      text: `It listens to ${systems.length} satellite systems at once, which helps it find you and hold your position under trees and between buildings.`,
      caption: `Supports ${list}.`,
    },
    compass: {
      tab: "Compass",
      kicker: "Compass & altitude",
      title: "Always know which way is north.",
      text: "The built-in compass points the way, and the altitude meter shows how high you are.",
      caption: "Compass and altitude meter on your wrist.",
    },
    alt: {
      tab: "Altitude",
      kicker: barometric ? "Barometric altimeter" : "Altitude meter",
      title: "See every climb.",
      text: barometric
        ? "A barometric altimeter reads your height from air pressure, so you can follow every climb on the trail."
        : "The altitude meter shows how high you are and how much you have climbed.",
      caption: barometric
        ? "Barometric altimeter, compass and gyroscope built in."
        : "Altitude meter built in.",
    },
  };
  const tabVal: Record<GpsScreen, [string, string]> = {
    route: [route.mi.toFixed(2), "mi"],
    sats: [String(systems.length), "systems"],
    compass: ["NE", "42°"],
    alt: ["1,284", "ft"],
  };
  const value: Record<GpsScreen, [string, string, string]> = {
    route: [
      (route.mi * p).toFixed(2),
      "mi",
      `Sample ${route.label.toLowerCase()}`,
    ],
    sats: [String(sats), "satellites", `${systems.length} systems, sample`],
    compass: [
      `${Math.round(((heading % 360) + 360) % 360)}°`,
      dirName(heading),
      "Live heading, sample",
    ],
    alt: [altFeet(p).toLocaleString("en-US"), "ft", "Sample climb"],
  };
  const m = COPY[id];

  return (
    <section
      ref={ref}
      id="gps"
      className={`section hm gps${live ? "" : " hm-paused"}`}
      aria-labelledby="gps-title"
    >
      <div className="hm-stage">
        <SectionHead
          id="gps-title"
          eyebrow="GPS & navigation"
          title={
            <>
              Find your way. <span className="grad">Anywhere.</span>
            </>
          }
          intro={`Built-in GPS on the ${name}, shown right on its own screen.`}
        />

        <div
          className="hm-tabs"
          role="tablist"
          aria-label="GPS features"
          onKeyDown={onKey}
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {screens.map((t, i) => (
            <button
              key={t}
              ref={(b) => {
                tabs.current[i] = b;
              }}
              type="button"
              role="tab"
              id={`gps-tab-${t}`}
              aria-selected={i === active}
              aria-controls="gps-panel"
              tabIndex={i === active ? 0 : -1}
              className={`hm-tab gps-tab-${t}${i === active ? " on" : ""}`}
              onClick={() => choose(i)}
            >
              <svg viewBox="0 0 40 24" aria-hidden="true" focusable="false">
                {ICONS[t]}
              </svg>
              <span className="hm-tab-name">{COPY[t].tab}</span>
              <span className="hm-tab-val">
                {tabVal[t][0]}
                <small>{tabVal[t][1]}</small>
              </span>
              <span className="hm-tab-bar" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="hm-body">
          <div
            className={`hm-visual gps-visual-${id}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <span className="hm-badge">Illustrative</span>
            <GpsWatch
              image={image}
              imageAlt={imageAlt}
              screen={screen}
              screens={screens}
              active={id}
              look={look}
              p={p}
              heading={heading}
              sats={sats}
              locked={sats >= satTarget}
              systems={systems}
              barometric={barometric}
            />
            <div className="hm-dots" aria-hidden="true">
              {screens.map((t, i) => (
                <span key={t} className={i === active ? "on" : ""} />
              ))}
            </div>
          </div>

          <div
            className="hm-info"
            id="gps-panel"
            role="tabpanel"
            aria-labelledby={`gps-tab-${id}`}
          >
            <div key={id} className="hm-info-in hm-once">
              <p className="hm-kicker">{m.kicker}</p>
              <h3>{m.title}</h3>
              <p className="hm-text">{m.text}</p>
              <div className="hm-read">
                <span className="hm-value" aria-live="off">
                  <span className="hm-digits">{value[id][0]}</span>
                  <small>{value[id][1]}</small>
                </span>
                <span className="hm-read-note">{value[id][2]}</span>
              </div>
              <p className="hm-caption">{m.caption}</p>
            </div>
          </div>
        </div>

        <p className="hm-note">
          Map, route and values are illustrative samples, not live readings. GPS
          accuracy depends on sky view and surroundings.
        </p>
      </div>
    </section>
  );
}
