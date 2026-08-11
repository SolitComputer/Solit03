/**
 * Aurora — pita cahaya (aurora) yang bergerak pelan sebagai latar premium.
 *
 * Murni CSS (blob gradient + blur), tanpa WebGL/three.js — ringan & GPU-friendly
 * karena hanya menganimasikan `transform` & `opacity`.
 *
 * Hemat performa:
 *  - Hormati reduce-motion → tampil statis (tanpa animasi).
 *  - `pointer-events: none` + `aria-hidden` → murni dekoratif.
 *  - Taruh sebagai anak container ber-`position: relative; overflow: hidden`.
 */
export default function Aurora({
  className = "",
  colors = ["#2563eb", "#22d3ee", "#6366f1"],
  blur = 90,
  opacity = 0.5,
}) {
  const [c1, c2, c3] = colors;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <span
        className="ds-aurora-blob ds-aurora-a"
        style={{ background: c1, filter: `blur(${blur}px)` }}
      />
      <span
        className="ds-aurora-blob ds-aurora-b"
        style={{ background: c2, filter: `blur(${blur}px)` }}
      />
      <span
        className="ds-aurora-blob ds-aurora-c"
        style={{ background: c3, filter: `blur(${blur}px)` }}
      />
    </div>
  );
}

// Keyframes disuntik sekali (SSR-safe: dijaga `typeof document`).
const styles = `
  .ds-aurora-blob {
    position: absolute;
    border-radius: 9999px;
    mix-blend-mode: screen;
    will-change: transform;
  }
  .ds-aurora-a {
    top: -18%; left: -10%;
    width: 55%; height: 65%;
    animation: ds-aurora-a 18s ease-in-out infinite;
  }
  .ds-aurora-b {
    top: -12%; right: -12%;
    width: 50%; height: 60%;
    animation: ds-aurora-b 22s ease-in-out infinite;
  }
  .ds-aurora-c {
    bottom: -25%; left: 25%;
    width: 55%; height: 60%;
    animation: ds-aurora-c 26s ease-in-out infinite;
  }
  @keyframes ds-aurora-a {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(18%, 12%) scale(1.15); }
  }
  @keyframes ds-aurora-b {
    0%, 100% { transform: translate(0, 0) scale(1.1); }
    50%      { transform: translate(-14%, 16%) scale(0.95); }
  }
  @keyframes ds-aurora-c {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(-10%, -14%) scale(1.2); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ds-aurora-a, .ds-aurora-b, .ds-aurora-c { animation: none; }
  }
`;

if (typeof document !== "undefined" && !document.querySelector("#ds-aurora-styles")) {
  const el = document.createElement("style");
  el.id = "ds-aurora-styles";
  el.textContent = styles;
  document.head.appendChild(el);
}
