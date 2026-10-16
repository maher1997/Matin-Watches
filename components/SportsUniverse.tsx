"use client";

import { useEffect, useRef, useState } from "react";
import { Athlete } from "./sports/rig";
import { sportLibrary } from "./sports/library";

// "Sport modes" showcase: the count on a watch-style dial, with each sport
// the watch really tracks drawn as a moving athlete around it.
// Everything is visible without JavaScript; motion is an extra and stops
// off screen or when the visitor prefers reduced motion.
export default function SportsUniverse({ count, ids }: { count: string; ids: string[] }) {
  const sports = ids.map((id) => sportLibrary[id]).filter(Boolean);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const touched = useRef(0);
  const live = useRef(false);
  const row = useRef<HTMLUListElement>(null);
  // Set while the row is being slid by code, so it isn't taken as a swipe.
  const autoUntil = useRef(0);

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
            const s = sports[i % sports.length];
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
      setActive((a) => (a + 1) % sports.length);
    }, 2600);
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", sync);
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phone row. The list is drawn three times so it can run on forever:
  // after the last sport it carries on to the first, never rewinding.
  // `pos` is the tile in the middle; it is kept in the middle copy.
  const pos = useRef(-1);
  const center = (r: HTMLElement, p: number, smooth: boolean) => {
    const li = r.children[p] as HTMLElement | undefined;
    if (!li) return;
    r.scrollTo({ left: li.offsetLeft + li.offsetWidth / 2 - r.clientWidth / 2, behavior: smooth ? "smooth" : "auto" });
  };
  const n0 = sports.length;
  const recenter = (r: HTMLElement) => {
    if (pos.current < n0 || pos.current >= 2 * n0) {
      pos.current = (pos.current % n0) + n0;
      autoUntil.current = Date.now() + 300;
      center(r, pos.current, false);
    }
  };

  // Slide forward to the next sport when it changes on its own.
  useEffect(() => {
    const r = row.current;
    if (!r || r.scrollWidth <= r.clientWidth) return;
    if (pos.current < 0) {
      pos.current = n0 + active;
      autoUntil.current = Date.now() + 300;
      center(r, pos.current, false);
      return;
    }
    if (pos.current % n0 === active) return;
    pos.current = pos.current + ((active - (pos.current % n0) + n0) % n0);
    autoUntil.current = Date.now() + 1200;
    center(r, pos.current, true);
    const t = window.setTimeout(() => recenter(r), 1250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Whichever sport the visitor swipes to the middle becomes active.
  useEffect(() => {
    const r = row.current;
    if (!r) return;
    let t = 0;
    const onScroll = () => {
      if (r.scrollWidth <= r.clientWidth || Date.now() < autoUntil.current) return;
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const mid = r.scrollLeft + r.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        Array.from(r.children).forEach((c, i) => {
          const el = c as HTMLElement;
          const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        pos.current = best;
        recenter(r);
        touched.current = Date.now();
        setActive(best % n0);
      }, 120);
    };
    const hold = () => {
      touched.current = Date.now();
      autoUntil.current = 0;
    };
    r.addEventListener("scroll", onScroll, { passive: true });
    r.addEventListener("touchstart", hold, { passive: true });
    return () => {
      r.removeEventListener("scroll", onScroll);
      r.removeEventListener("touchstart", hold);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (i: number, p: number) => {
    touched.current = Date.now();
    const r = row.current;
    if (r && r.scrollWidth > r.clientWidth && pos.current !== p) {
      // Tapped on the phone row: bring that tile to the middle.
      pos.current = p;
      autoUntil.current = Date.now() + 1200;
      center(r, p, true);
      window.setTimeout(() => recenter(r), 1250);
    }
    setActive(i);
  };

  if (!sports.length) return null;
  const n = sports.length;

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

        <ul className="sx-orbit" ref={row}>
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
