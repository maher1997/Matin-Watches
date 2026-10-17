import SectionHead from "@/components/SectionHead";

// Battery section that compares the usage modes side by side: one row per
// mode, each a strip of day cells (one cell = one day) lit up to how long
// the watch lasts in that mode. Static markup + a short CSS light-up on load.
export default function BatteryModes({
  name,
  mah,
  charge,
  modes,
}: {
  name: string;
  mah: number;
  // Full charge time, e.g. "1.5 h".
  charge: string;
  // Longest mode last; its days set the scale of every strip.
  modes: { label: string; days: number; text: string }[];
}) {
  const max = Math.max(...modes.map((m) => m.days));
  const best = modes.find((m) => m.days === max)!;
  const scale = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * max));

  return (
    <section id="battery" className="section vb" aria-labelledby="vb-title">
      <div className="vb-stage">
        <SectionHead
          id="vb-title"
          eyebrow="Battery"
          title={
            <>
              Up to {max} days. <span className="grad">One charge.</span>
            </>
          }
          intro={`The ${name} runs on a ${mah}mAh battery. Pick the mode that fits your week and charge about once a month, or less.`}
        />

        <div className="vb-grid">
          <div className="vb-hero">
            <p className="vb-big">
              {max}
              <span>days</span>
            </p>
            <p className="vb-big-label">In {best.label.toLowerCase()}</p>
            <p className="vb-big-text">About {Math.round(max / 30)} months between charges.</p>
          </div>

          <div className="vb-modes">
            <ul>
              {modes.map((m) => (
                <li key={m.label} className="vb-mode">
                  <div className="vb-mode-head">
                    <h3>{m.label}</h3>
                    <strong>
                      {m.days} <span>days</span>
                    </strong>
                  </div>
                  <div className="vb-cells" role="img" aria-label={`${m.label}: up to ${m.days} days`}>
                    {Array.from({ length: max }, (_, i) => (
                      <i
                        key={i}
                        className={i < m.days ? "on" : undefined}
                        style={i < m.days ? { animationDelay: `${i * 14}ms` } : undefined}
                      />
                    ))}
                  </div>
                  <p>{m.text}</p>
                </li>
              ))}
            </ul>
            <div className="vb-scale" aria-hidden="true">
              {scale.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <ul className="vb-facts">
          <li>
            <strong>{mah} mAh</strong>
            <span>Li-polymer battery</span>
          </li>
          <li>
            <strong>{charge}</strong>
            <span>Full magnetic charge</span>
          </li>
          <li>
            <strong>Magnetic</strong>
            <span>Charger snaps on in a second</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
