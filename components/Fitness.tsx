"use client";

import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/SectionHead";
import useShowcase from "@/components/useShowcase";
import Multi from "@/components/fitness/Multi";
import Tri, { TRI_STILL } from "@/components/fitness/Tri";

// Animated sport section that is not drawn on the watch: every sport in its
// own animated place with a live workout log (Kaldor), or a triathlon course drawing itself swim,
// bike, run (Varkon). One clock drives the scene while it is on screen;
// without JavaScript, or with reduced motion, a finished frame shows.
export default function Fitness({
  name,
  look,
  count,
}: {
  name: string;
  look: "multi" | "tri";
  count: string;
}) {
  const { ref, live, reduced } = useShowcase(1);
  const still = look === "multi" ? 1 : TRI_STILL;
  const [t, setT] = useState(still);
  const clock = useRef(still);

  useEffect(() => {
    if (!live || reduced.current) return;
    let raf = 0;
    const t0 = performance.now() - clock.current * 1000;
    const tick = (now: number) => {
      clock.current = (now - t0) / 1000;
      setT(clock.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, reduced]);

  const head =
    look === "multi"
      ? {
          eyebrow: "Sport modes",
          title: (
            <>
              Run, ride, climb. <span className="grad">Then swim.</span>
            </>
          ),
          intro: `${count} sport modes on the ${name}. Here are a few of them, each with its own live workout log.`,
        }
      : {
          eyebrow: "Sport & triathlon",
          title: (
            <>
              One race. <span className="grad">Three sports.</span>
            </>
          ),
          intro: `${count} sport modes on the ${name}. Triathlon mode tracks your swim, bike and run in one workout, with a split for every leg.`,
        };

  return (
    <section
      ref={ref}
      id="sports"
      className={`section hm ft ft-${look}${live ? "" : " hm-paused"}`}
      aria-labelledby="sports-title"
    >
      <div className="hm-stage">
        <SectionHead
          id="sports-title"
          eyebrow={head.eyebrow}
          title={head.title}
          intro={head.intro}
        />
        {look === "multi" ? (
          <Multi t={t} count={count} />
        ) : (
          <Tri t={t} count={count} />
        )}
        <p className="hm-note">
          Workouts and values are illustrative samples, not live readings.
        </p>
      </div>
    </section>
  );
}
