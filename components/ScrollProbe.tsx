"use client";

import { useEffect, useState } from "react";

// Temporary: with ?probe=1, records what happens during the first scroll
// (frame times, scroll position, screen height, images, the buy bar) and
// shows a summary on screen, to find the shake inside Instagram's browser.
export default function ScrollProbe() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!new URLSearchParams(location.search).has("probe")) return;
    const t0 = performance.now();
    const ms = () => Math.round(performance.now() - t0);
    const log: string[] = [];
    const ev = (s: string) => log.push(`${ms()} ${s}`);
    const frames: [number, number, number, number][] = [];
    let raf = 0;
    let started = 0;
    let last = performance.now();

    const tick = (now: number) => {
      frames.push([Math.round(now - t0), Math.round(now - last), Math.round(scrollY), innerHeight]);
      last = now;
      if (started && now - started > 6000) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onTouch = () => {
      if (!started) {
        started = performance.now();
        ev("first touch");
      }
    };
    const onResize = () => ev(`resize h=${innerHeight} vv=${Math.round(visualViewport?.height ?? 0)}`);
    addEventListener("touchstart", onTouch, { passive: true });
    addEventListener("resize", onResize);
    const bar = document.querySelector(".buy-bar");
    const mo = new MutationObserver(() => ev(`bar ${bar?.className}`));
    if (bar) mo.observe(bar, { attributes: true, attributeFilter: ["class"] });
    // Sections that play something when they arrive.
    const mo2 = new MutationObserver((list) => {
      let rv = 0;
      for (const m of list) {
        const el = m.target as HTMLElement;
        if (el.classList.contains("rv-in") && !(m.oldValue || "").includes("rv-in")) rv++;
        else if (el.matches(".stories, .showcase-panel, .bl, .hm")) ev(`${el.className.slice(0, 30)}`);
      }
      if (rv) ev(`reveal x${rv}`);
    });
    mo2.observe(document.body, { attributes: true, attributeFilter: ["class"], attributeOldValue: true, subtree: true });
    const onLoad = (e: Event) => {
      const t = e.target as HTMLImageElement;
      if (t.tagName === "IMG") ev(`img ${(t.currentSrc || "").replace(/.*%2F|&.*/g, "").slice(0, 28)}`);
    };
    document.addEventListener("load", onLoad, true);

    function finish() {
      const big = frames.filter((f) => f[0] > started - t0 - 200 && f[1] > 30);
      const back: string[] = [];
      for (let i = 2; i < frames.length; i++) {
        const a = frames[i - 2][2], b = frames[i - 1][2], c = frames[i][2];
        if ((b - a) * (c - b) < 0 && Math.abs(c - b) > 2) back.push(`${frames[i][0]}:${b}>${c}`);
      }
      const hs = [...new Set(frames.map((f) => f[3]))];
      setText(
        [
          `start ${Math.round(started - t0)}  UA ${/Instagram/.test(navigator.userAgent) ? "IG" : "other"}`,
          `slow frames (time:ms): ${big.map((f) => `${f[0]}:${f[1]}`).join(" ") || "none"}`,
          `scroll reversals: ${back.slice(0, 12).join(" ") || "none"}`,
          `heights: ${hs.join(",")}`,
          ...log.filter((l) => parseInt(l) > started - t0 - 500).slice(0, 30),
        ].join("\n"),
      );
      cleanup();
    }
    function cleanup() {
      cancelAnimationFrame(raf);
      removeEventListener("touchstart", onTouch);
      removeEventListener("resize", onResize);
      document.removeEventListener("load", onLoad, true);
      mo.disconnect();
      mo2.disconnect();
    }
    return cleanup;
  }, []);

  if (!text) return null;
  return (
    <pre
      onClick={() => setText("")}
      style={{
        position: "fixed",
        top: 70,
        left: 8,
        right: 8,
        zIndex: 999,
        background: "rgba(0,0,0,0.88)",
        color: "#7CFC9A",
        font: "11px/1.35 monospace",
        padding: 10,
        borderRadius: 8,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {text}
    </pre>
  );
}
