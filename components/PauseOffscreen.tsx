"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Sections that are off screen get data-off, which pauses their looping
// animations (battery cells, flowing liquid, the sports ticker, the watch
// screens). They kept running while out of sight, so the phone redrew them
// all the time and scrolling felt heavy. On screen they look and move the
// same as before.
export default function PauseOffscreen() {
  const path = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("main section, .marquee");
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) e.target.toggleAttribute("data-off", !e.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      els.forEach((el) => el.removeAttribute("data-off"));
    };
  }, [path]);
  return null;
}
