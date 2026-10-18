"use client";

import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/SectionHead";
import useShowcase from "@/components/useShowcase";
import Pool, { POOL_STILL } from "@/components/fitness/Pool";
import Tri, { TRI_STILL } from "@/components/fitness/Tri";

// Animated sport section that is not drawn on the watch: a top-down pool
// with a live swim log (Kaldor) or a triathlon course drawing itself swim,
// bike, run (Varkon). One clock drives the scene while it is on screen;
// without JavaScript, or with reduced motion, a finished frame shows.
export default function Fitness({
  name,
  look,
  count,
}: {
  name: string;
  look: "pool" | "tri";
  count: string;
}) {
  const { ref, live, reduced } = useShowcase(1);
  const still = look === "pool" ? POOL_STILL : TRI_STILL;
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
    look === "pool"
      ? {
          eyebrow: "Sport & swim",
          title: (
            <>
              Train hard. <span className="grad">Swim smart.</span>
            </>
          ),
          intro: `${count} sport modes on the ${name}, from running and cycling to rock climbing, plus swim tracking in the pool and open water.`,
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
        {look === "pool" ? (
          <Pool t={t} count={count} />
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
