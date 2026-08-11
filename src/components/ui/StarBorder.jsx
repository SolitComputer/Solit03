/**
 * StarBorder — bingkai dengan cahaya yang berputar pelan mengelilingi tepi.
 *
 * <StarBorder><div className="p-6">konten</div></StarBorder>
 *
 * Teknik: satu lapisan conic-gradient berputar di belakang konten, konten
 * duduk di atas permukaan tema (bg-surface) sehingga hanya tepi tipis yang bercahaya.
 * Ringan (hanya menganimasi `transform: rotate`), theme-aware, reduce-motion → statis.
 */
export default function StarBorder({
  children,
  className = "",
  radius = 16,
  thickness = 1.5,
  color = "#3b82f6",
  speed = 6,
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag
      className={`ds-starborder relative isolate ${className}`}
      style={{
        "--sb-radius": `${radius}px`,
        "--sb-thickness": `${thickness}px`,
        "--sb-color": color,
        "--sb-speed": `${speed}s`,
        borderRadius: `${radius}px`,
      }}
      {...rest}
    >
      <span aria-hidden="true" className="ds-starborder-glow" />
      <span
        className="relative z-[1] block h-full w-full"
        style={{ borderRadius: `calc(${radius}px - ${thickness}px)` }}
      >
        {children}
      </span>
    </Tag>
  );
}

const styles = `
  .ds-starborder {
    padding: var(--sb-thickness);
    background: var(--ds-border);
    overflow: hidden;
  }
  .ds-starborder > span:last-child {
    background: var(--ds-bg);
  }
  .ds-starborder-glow {
    position: absolute;
    inset: -60%;
    z-index: 0;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      var(--sb-color) 60deg,
      #22d3ee 110deg,
      transparent 200deg,
      transparent 360deg
    );
    animation: ds-starborder-spin var(--sb-speed) linear infinite;
    will-change: transform;
  }
  @keyframes ds-starborder-spin {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ds-starborder-glow { animation: none; opacity: 0.6; }
  }
`;

if (typeof document !== "undefined" && !document.querySelector("#ds-starborder-styles")) {
  const el = document.createElement("style");
  el.id = "ds-starborder-styles";
  el.textContent = styles;
  document.head.appendChild(el);
}
