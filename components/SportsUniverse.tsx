"use client";

import { useEffect, useRef, useState } from "react";
import { Athlete } from "./sports/rig";
import { sportLibrary } from "./sports/library";

// "Sport modes" showcase: the count on a watch-style dial, with each sport
// the watch really tracks drawn as a moving athlete around it.
// Everything is visible without JavaScript; motion is an extra and stops
// off screen or when the visitor prefers reduced motion.
// Phone row: one tile is 104px wide with a 12px gap.
const STEP = 116;
const HALF = 52;

export default function SportsUniverse({ count, ids }: { count: string; ids: string[] }) {
  const sports = ids.map((id) => sportLibrary[id]).filter(Boolean);
  const n = sports.length;
  const [active, setActive] = useState(0);
  // Phone row: the list is drawn three times and `pos` is the tile in the
  // middle of the screen, so it can run forward forever and never rewind.
  const [pos, setPos] = useState(n);
  const [jump, setJump] = useState(false);
  const [drag, setDrag] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const touched = useRef(0);
  const live = useRef(false);
  const swipe = useRef<{ x: number; y: number; on: boolean; dx: number } | null>(null);
  const noClick = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svgs = Array.from(el.querySelectorAll<SVGSVGElement>("svg.ath"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const play = live.current && !reduce.matches;
      el.classList.toggle("is-live", play);
      svgs.forEach((svg, i) => {
        if (play) svg.unpauseAnimations();
        else {
          svg.pauseAnimations();
          if (reduce.matches) {
            const s = sports[i % n];
            if (s) svg.setCurrentTime((s.still ?? 0) * s.dur);
          }
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
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", sync);
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the phone row on the active sport, always moving forward.
  useEffect(() => {
    setPos((p) => (p % n === active ? p : p + ((active - (p % n) + n) % n)));
  }, [active, n]);

  // After sliding into the first or last copy, hop back to the same tile in
  // the middle copy without animation (it looks identical).
  const settle = () => {
    if (pos >= n && pos < 2 * n) return;
    setJump(true);
    setPos(((pos % n) + n) % n + n);
    requestAnimationFrame(() => requestAnimationFrame(() => setJump(false)));
  };

  const pick = (i: number, p: number) => {
    if (Date.now() < noClick.current) return;
    touched.current = Date.now();
    setPos(p);
    setActive(i);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY, on: false, dx: 0 };
    touched.current = Date.now();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const s = swipe.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.on && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) s.on = true;
    if (s.on) {
      s.dx = dx;
      setDrag(dx);
    }
  };
  const onTouchEnd = () => {
    const s = swipe.current;
    swipe.current = null;
    touched.current = Date.now();
    if (!s?.on) return;
    noClick.current = Date.now() + 350;
    const steps = Math.round(-s.dx / STEP) || (s.dx < -30 ? 1 : s.dx > 30 ? -1 : 0);
    setDrag(0);
    const p = Math.max(0, Math.min(3 * n - 1, pos + steps));
    setPos(p);
    setActive(p % n);
  };

  if (!n) return null;

  return (
    <section className="section sx" ref={ref} aria-labelledby="sx-title">
      <div className="sx-stage">
        <div className="sx-core">
          <div className="sx-dial" aria-hidden="true">
            <span className="sx-ticks" />
            <span className="sx-sweep" />
          </div>
          <h2 id="sx-title" className="sx-title">
            <span className="sx-num">{count}</span>
            <span className="sx-word">Sport modes</span>
          </h2>
          <p className="sx-sub">One Watch. Every Move.</p>
          <p className="sx-now" aria-live="polite">
            <span>Tracking</span>{" "}
            <strong key={active}>{sports[active].name}</strong>
          </p>
        </div>

        <ul
          className={`sx-orbit${jump || drag ? " sx-still" : ""}`}
          style={{ "--tx": `${-pos * STEP - HALF + drag}px` } as React.CSSProperties}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) settle();
          }}
        >
          {[0, 1, 2].flatMap((copy) =>
            sports.map((s, i) => {
              // Spread the athletes evenly on an ellipse, starting at the top.
              const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
              const real = copy === 1;
              return (
                <li
                  key={`${copy}-${s.id}`}
                  className={[i === active ? "on" : "", real ? "" : "sx-copy"].join(" ").trim() || undefined}
                  aria-hidden={real ? undefined : true}
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
                    tabIndex={real ? undefined : -1}
                    aria-pressed={real ? i === active : undefined}
                    onMouseEnter={() => pick(i, copy * n + i)}
                    onFocus={() => pick(i, copy * n + i)}
                    onClick={() => pick(i, copy * n + i)}
                  >
                    <span className="sx-tile">
                      <Athlete sport={s} />
                    </span>
                    <span className="sx-name">{s.name}</span>
                  </button>
                </li>
              );
            }),
          )}
        </ul>
      </div>
    </section>
  );
}
