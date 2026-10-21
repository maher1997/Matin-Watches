// True while the page is being scrolled (and for a moment after) inside
// Instagram's browser (html[data-ig], set in app/layout.tsx). The watch-screen
// animations drawn by script every frame hold still then: re-drawing them in
// the middle of a finger scroll made the page shake there. Other browsers and
// CSS animations are not affected.
let last = -1e9;
let listening = false;

export function scrolling() {
  if (typeof document === "undefined" || !document.documentElement.hasAttribute("data-ig"))
    return false;
  if (!listening) {
    listening = true;
    addEventListener("scroll", () => (last = performance.now()), {
      passive: true,
      capture: true,
    });
  }
  return performance.now() - last < 160;
}
