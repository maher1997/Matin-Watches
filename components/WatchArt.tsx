// Drawn placeholder watch, shown until a real product photo is added.
type Props = { case: string; strap: string; accent: string; label?: string };

export default function WatchArt({ case: body, strap, accent, label }: Props) {
  const id = accent.replace("#", "");
  return (
    <svg viewBox="0 0 300 300" className="watch-art" aria-hidden="true">
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`case-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="50%" stopColor={body} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="140" fill={`url(#glow-${id})`} />
      {/* strap */}
      <rect x="112" y="10" width="76" height="80" rx="10" fill={strap} />
      <rect x="112" y="210" width="76" height="80" rx="10" fill={strap} />
      {[30, 50, 70].map((y) => (
        <rect key={y} x="124" y={y} width="52" height="5" rx="2" fill="#000" opacity="0.3" />
      ))}
      {[225, 245, 265].map((y) => (
        <rect key={y} x="124" y={y} width="52" height="5" rx="2" fill="#000" opacity="0.3" />
      ))}
      {/* lugs + buttons */}
      <rect x="230" y="118" width="14" height="22" rx="4" fill={body} />
      <rect x="230" y="160" width="14" height="22" rx="4" fill={body} />
      <rect x="56" y="118" width="14" height="22" rx="4" fill={body} />
      <rect x="56" y="160" width="14" height="22" rx="4" fill={body} />
      {/* case and bezel */}
      <circle cx="150" cy="150" r="86" fill={`url(#case-${id})`} />
      <circle cx="150" cy="150" r="86" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="147"
          y="68"
          width="6"
          height="9"
          rx="1"
          fill="#ffffff"
          opacity="0.35"
          transform={`rotate(${i * 30} 150 150)`}
        />
      ))}
      {[45, 135, 225, 315].map((a) => (
        <circle
          key={a}
          cx="150"
          cy="72"
          r="4"
          fill="#0b0d12"
          stroke="#ffffff"
          strokeOpacity="0.25"
          transform={`rotate(${a} 150 150)`}
        />
      ))}
      {/* screen */}
      <circle cx="150" cy="150" r="64" fill="#07080c" />
      <circle cx="150" cy="150" r="58" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="5" />
      <path
        d="M150 92 A58 58 0 1 1 100 178"
        fill="none"
        stroke={accent}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text x="150" y="150" textAnchor="middle" fill="#ffffff" fontSize="30" fontWeight="600" fontFamily="system-ui, sans-serif">
        10:08
      </text>
      <text x="150" y="172" textAnchor="middle" fill={accent} fontSize="11" letterSpacing="2" fontFamily="system-ui, sans-serif">
        {label ?? "MATIN"}
      </text>
      <ellipse cx="128" cy="115" rx="34" ry="14" fill="#ffffff" opacity="0.06" transform="rotate(-30 128 115)" />
    </svg>
  );
}
