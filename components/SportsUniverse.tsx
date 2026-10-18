"use client";

import Image from "next/image";
import SectionHead from "@/components/SectionHead";
import { useEffect, useRef, useState } from "react";
import { Athlete } from "./sports/rig";
import { sportLibrary } from "./sports/library";

// "Sport modes" showcase: the real watch with the sport being tracked on its
// screen (moving athlete, name, one dot per sport), and every sport the watch
// really tracks drawn as a moving athlete around it.
// Everything is visible without JavaScript; motion is an extra and stops
// off screen or when the visitor prefers reduced motion.
// SVG arc on a circle of radius r around the dial centre, angles in degrees
// clockwise from 12 o'clock.
function arc(r: number, a0: number, a1: number) {
  const pt = (a: number) => {
    const t = (a * Math.PI) / 180;
    return `${(120 + r * Math.sin(t)).toFixed(2)} ${(120 - r * Math.cos(t)).toFixed(2)}`;
  };
  return `M${pt(a0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1)}`;
}

export default function SportsUniverse({ name, count, ids }: { name: string; count: string; ids: string[] }) {
  const sports = ids.map((id) => sportLibrary[id]).filter(Boolean);
  const n = sports.length;
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const touched = useRef(0);
  const live = useRef(false);

  // Phone reel. The sports are drawn three times in a row and the row is
  // moved frame by frame from JavaScript (no CSS transitions or scrolling,
  // which behaved differently on some iPhones). `pos` is the tile in the
  // middle; after passing the last sport it carries on to the first.
  const track = useRef<HTMLDivElement>(null);
  const pos = useRef(n);
  const x = useRef(0);
  const centers = useRef<number[]>([]);
  const anim = useRef(0);
  const swipe = useRef<{ x: number; y: number; x0: number; on: boolean } | null>(null);
  const noClick = useRef(0);
  const reduced = useRef(false);

  const paint = (v: number) => {
    x.current = v;
    if (track.current) track.current.style.transform = `translate3d(${v.toFixed(1)}px,0,0)`;
  };
  const target = (p: number) => -(centers.current[p] ?? p * 116 + 52);
  const home = (p: number) => (((p % n) + n) % n) + n;
  const goTo = (p: number, smooth = true) => {
    cancelAnimationFrame(anim.current);
    pos.current = p;
    const from = x.current;
    const to = target(p);
    const done = () => {
      // Back to the same tile in the middle copy: looks identical, no motion.
      if (p < n || p >= 2 * n) {
        pos.current = home(p);
        paint(target(pos.current));
      }
    };
    if (!smooth || reduced.current || Math.abs(to - from) < 1) {
      paint(to);
      done();
      return;
    }
    let t0 = -1;
    const step = (now: number) => {
      if (t0 < 0) t0 = now;
      const k = Math.min(1, (now - t0) / 650);
      const e = 1 - Math.pow(1 - k, 3);
      paint(from + (to - from) * e);
      if (k < 1) anim.current = requestAnimationFrame(step);
      else done();
    };
    anim.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svgs = Array.from(el.querySelectorAll<SVGSVGElement>("svg.ath"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = reduce.matches;
    const sync = () => {
      reduced.current = reduce.matches;
      const play = live.current && !reduce.matches;
      el.classList.toggle("is-live", play);
      svgs.forEach((svg) => {
        if (play) svg.unpauseAnimations();
        else {
          svg.pauseAnimations();
          const still = Number(svg.dataset.still);
          if (reduce.matches && still >= 0) svg.setCurrentTime(still);
        }
      });
    };
    const io = new IntersectionObserver(([e]) => {
      live.current = e.isIntersecting;
      sync();
    });
    io.observe(el);
    reduce.addEventListener("change", sync);
    sync();
    // Gently walk through the sports until the visitor picks one.
    const timer = window.setInterval(() => {
      if (!live.current || reduce.matches || Date.now() - touched.current < 7000) return;
      setActive((a) => (a + 1) % n);
    }, 2600);

    // Measure where each reel tile really sits (sizes differ between phones).
    const tr = track.current;
    const measure = () => {
      if (!tr) return;
      centers.current = Array.from(tr.children).map((c) => (c as HTMLElement).offsetLeft + (c as HTMLElement).offsetWidth / 2);
      cancelAnimationFrame(anim.current);
      paint(target(pos.current));
    };
    measure();
    const ro = tr ? new ResizeObserver(measure) : null;
    if (tr) ro!.observe(tr);
    return () => {
      io.disconnect();
      ro?.disconnect();
      reduce.removeEventListener("change", sync);
      window.clearInterval(timer);
      cancelAnimationFrame(anim.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Turn the dial hand to the active sport the short way round.
  useEffect(() => {
    setTurn((t) => {
      let d = (((active - t) % n) + n) % n;
      if (d > n / 2) d -= n;
      return t + d;
    });
  }, [active, n]);

  // Keep the reel on the active sport, always moving forward.
  useEffect(() => {
    const p = pos.current;
    if (p % n !== active) goTo(p + ((active - (p % n) + n) % n));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const pick = (i: number) => {
    touched.current = Date.now();
    setActive(i);
  };
  const tapReel = (i: number, p: number) => {
    if (Date.now() < noClick.current) return;
    touched.current = Date.now();
    goTo(p);
    setActive(i);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    cancelAnimationFrame(anim.current);
    swipe.current = { x: t.clientX, y: t.clientY, x0: x.current, on: false };
    touched.current = Date.now();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const s = swipe.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.on && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) s.on = true;
    if (s.on) paint(s.x0 + dx);
  };
  const onTouchEnd = () => {
    const s = swipe.current;
    swipe.current = null;
    touched.current = Date.now();
    if (!s) return;
    if (!s.on) {
      // A tap or a vertical scroll: settle back where it was.
      goTo(pos.current, false);
      return;
    }
    noClick.current = Date.now() + 350;
    const moved = x.current - s.x0;
    // Nearest tile to where the finger left the row, at least one step.
    let best = pos.current;
    let dist = Infinity;
    centers.current.forEach((c, i) => {
      const d = Math.abs(-c - x.current);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    if (best === pos.current && Math.abs(moved) > 30) best += moved < 0 ? 1 : -1;
    best = Math.max(0, Math.min(3 * n - 1, best));
    goTo(best);
    setActive(best % n);
  };

  if (!n) return null;

  return (
    <section className="section sx" id="sports" ref={ref} aria-labelledby="sx-title">
      <SectionHead
        id="sx-title"
        eyebrow="Sport modes"
        title={
          <>
            One Watch. <span className="grad">Every Move.</span>
          </>
        }
        intro={`The ${name} tracks ${count} sport modes: ${sports
          .map((s) => s.name.toLowerCase())
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")}.`}
      />
      <div className="sx-stage">
        <div className="sx-core">
          {/* The real Torvan: its round screen shows the sport being tracked. */}
          <figure className="sx-watch">
            <Image
              src="/products/matin-torvan-front-view.webp"
              alt={`${name} showing a sport mode on its round AMOLED screen`}
              fill
              sizes="(max-width: 900px) 86vw, 440px"
              quality={75}
            />
            <div className="sx-screen">
              <svg viewBox="0 0 240 240" className="sx-ring" aria-hidden="true">
                {sports.map((s, i) => {
                  const t = (i / n) * Math.PI * 2;
                  return (
                    <circle
                      key={s.id}
                      cx={(120 + 110 * Math.sin(t)).toFixed(2)}
                      cy={(120 - 110 * Math.cos(t)).toFixed(2)}
                      r={i === active ? 4.4 : 2.6}
                      className={i === active ? "sx-mark on" : "sx-mark"}
                    />
                  );
                })}
                <g className="sx-hand" style={{ transform: `rotate(${(turn * 360) / n}deg)` }}>
                  <path d={arc(110, (-180 / n) * 0.72, (180 / n) * 0.72)} className="sx-hand-arc" />
                </g>
              </svg>
              <span className="sx-count" aria-hidden="true">
                {count} sport modes
              </span>
              <span className="sx-fig" key={sports[active].id} aria-hidden="true">
                <Athlete sport={sports[active]} />
              </span>
              <p className="sx-now" aria-live="polite">
                <strong key={active}>{sports[active].name}</strong>
              </p>
            </div>
          </figure>
        </div>

        {/* Desktop: the athletes float around the dial. */}
        <ul className="sx-orbit">
          {sports.map((s, i) => {
            // Spread the athletes evenly on an ellipse, starting at the top.
            const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
            return (
              <li
                key={s.id}
                className={i === active ? "on" : undefined}
                style={
                  {
                    "--x": `${(50 + 43 * Math.cos(a)).toFixed(2)}%`,
                    "--y": `${(50 + 37 * Math.sin(a)).toFixed(2)}%`,
                    "--d": `${(-i * 0.73).toFixed(2)}s`,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  aria-pressed={i === active}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                >
                  <span className="sx-tile">
                    <Athlete sport={s} />
                  </span>
                  <span className="sx-name">{s.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Phone: a reel to swipe that also slides on its own. */}
        <div
          className="sx-reel"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div className="sx-track" ref={track} style={{ transform: `translate3d(${-(n * 116 + 52)}px,0,0)` }}>
            {[0, 1, 2].flatMap((copy) =>
              sports.map((s, i) => (
                <button
                  key={`${copy}-${s.id}`}
                  type="button"
                  tabIndex={copy === 1 ? undefined : -1}
                  aria-hidden={copy === 1 ? undefined : true}
                  aria-pressed={copy === 1 ? i === active : undefined}
                  className={i === active ? "sx-item on" : "sx-item"}
                  onClick={() => tapReel(i, copy * n + i)}
                >
                  <span className="sx-tile">
                    <Athlete sport={s} />
                  </span>
                  <span className="sx-name">{s.name}</span>
                </button>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
