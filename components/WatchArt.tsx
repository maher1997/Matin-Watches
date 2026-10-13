// Drawn placeholder watch, shown until a real product photo is added.
// It is drawn as one small inline image instead of SVG markup in the page,
// which keeps the page light and quick to start up.
type Props = { case: string; strap: string; accent: string; label?: string };

const rect = (x: number, y: number, w: number, h: number, rx: number, rest: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${rest}/>`;

function watchSvg({ case: body, strap, accent, label }: Props) {
  const text = (label ?? "MATIN").replace(/[<>&"]/g, "");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">`,
    `<defs>`,
    `<radialGradient id="g" cx="50%" cy="50%" r="50%">`,
    `<stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>`,
    `<stop offset="100%" stop-color="${accent}" stop-opacity="0"/>`,
    `</radialGradient>`,
    `<linearGradient id="c" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>`,
    `<stop offset="50%" stop-color="${body}"/>`,
    `<stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>`,
    `</linearGradient>`,
    `</defs>`,
    `<circle cx="150" cy="150" r="140" fill="url(#g)"/>`,
    // strap
    rect(112, 10, 76, 80, 10, `fill="${strap}"`),
    rect(112, 210, 76, 80, 10, `fill="${strap}"`),
    ...[30, 50, 70, 225, 245, 265].map((y) => rect(124, y, 52, 5, 2, `fill="#000" opacity="0.3"`)),
    // lugs + buttons
    ...[
      [230, 118],
      [230, 160],
      [56, 118],
      [56, 160],
    ].map(([x, y]) => rect(x, y, 14, 22, 4, `fill="${body}"`)),
    // case and bezel
    `<circle cx="150" cy="150" r="86" fill="url(#c)"/>`,
    `<circle cx="150" cy="150" r="86" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="2"/>`,
    ...Array.from({ length: 12 }, (_, i) =>
      rect(147, 68, 6, 9, 1, `fill="#ffffff" opacity="0.35" transform="rotate(${i * 30} 150 150)"`),
    ),
    ...[45, 135, 225, 315].map(
      (a) =>
        `<circle cx="150" cy="72" r="4" fill="#0b0d12" stroke="#ffffff" stroke-opacity="0.25" transform="rotate(${a} 150 150)"/>`,
    ),
    // screen
    `<circle cx="150" cy="150" r="64" fill="#07080c"/>`,
    `<circle cx="150" cy="150" r="58" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="5"/>`,
    `<path d="M150 92 A58 58 0 1 1 100 178" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`,
    `<text x="150" y="150" text-anchor="middle" fill="#ffffff" font-size="30" font-weight="600" font-family="system-ui, sans-serif">10:08</text>`,
    `<text x="150" y="172" text-anchor="middle" fill="${accent}" font-size="11" letter-spacing="2" font-family="system-ui, sans-serif">${text}</text>`,
    `<ellipse cx="128" cy="115" rx="34" ry="14" fill="#ffffff" opacity="0.06" transform="rotate(-30 128 115)"/>`,
    `</svg>`,
  ].join("");
}

export default function WatchArt(props: Props) {
  return (
    <img
      src={`data:image/svg+xml,${encodeURIComponent(watchSvg(props))}`}
      alt=""
      width={300}
      height={300}
      className="watch-art"
      decoding="async"
    />
  );
}
