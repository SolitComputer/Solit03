/**
 * LogoLoop — barisan logo yang berjalan mulus tak-putus (marquee).
 *
 * <LogoLoop logos={[{ node: <svg/>, title: "Asus" }, ...]} />
 *
 * - Dua salinan konten digulung -50% agar seamless.
 * - Jeda saat hover (pauseOnHover), tepi memudar (fade) biar rapi.
 * - Hormati reduce-motion → tampil statis (baris tengah, tanpa gerak).
 */
export default function LogoLoop({
  logos = [],
  duration = 32,
  gap = 56,
  logoHeight = 30,
  pauseOnHover = true,
  fade = true,
  className = "",
}) {
  if (!logos.length) return null;

  const Item = ({ item, i }) => {
    const inner = (
      <span
        className="inline-flex items-center justify-center text-content-muted transition-colors duration-300 hover:text-content"
        style={{ height: logoHeight }}
        title={item.title}
      >
        {item.node}
      </span>
    );
    return item.href ? (
      <a
        key={i}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.title}
        className="shrink-0"
        style={{ marginInline: gap / 2 }}
      >
        {inner}
      </a>
    ) : (
      <span key={i} aria-hidden="true" className="shrink-0" style={{ marginInline: gap / 2 }}>
        {inner}
      </span>
    );
  };

  const row = (copy) =>
    logos.map((item, i) => <Item key={`${copy}-${i}`} item={item} i={`${copy}-${i}`} />);

  return (
    <div
      className={`ds-logoloop group relative w-full overflow-hidden ${fade ? "ds-logoloop-fade" : ""} ${className}`}
      style={{ "--ll-duration": `${duration}s` }}
    >
      <div className={`ds-logoloop-track flex w-max items-center ${pauseOnHover ? "ds-logoloop-pausable" : ""}`}>
        <div className="flex items-center">{row("a")}</div>
        <div className="flex items-center" aria-hidden="true">{row("b")}</div>
      </div>
    </div>
  );
}

const styles = `
  .ds-logoloop-track {
    animation: ds-logoloop-scroll var(--ll-duration, 30s) linear infinite;
    will-change: transform;
  }
  .ds-logoloop:hover .ds-logoloop-pausable { animation-play-state: paused; }
  @keyframes ds-logoloop-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .ds-logoloop-fade {
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
            mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .ds-logoloop-track { animation: none; transform: none; justify-content: center; width: 100%; flex-wrap: wrap; gap: 1rem 0; }
    .ds-logoloop-track > div:last-child { display: none; }
  }
`;

if (typeof document !== "undefined" && !document.querySelector("#ds-logoloop-styles")) {
  const el = document.createElement("style");
  el.id = "ds-logoloop-styles";
  el.textContent = styles;
  document.head.appendChild(el);
}
