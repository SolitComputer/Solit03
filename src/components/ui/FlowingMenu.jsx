import { useRef } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

/**
 * FlowingMenu — daftar menu vertikal; saat hover, panel warna meluncur masuk
 * dari arah kursor dan menampilkan teks + thumbnail yang berjalan (marquee).
 *
 * <FlowingMenu items={[{ text, image, href, onClick }]} />
 *
 * - Arah masuk/keluar panel ditentukan dari tepi terdekat kursor (atas/bawah).
 * - Reduce-motion / layar sentuh → menu biasa (hover warna, tanpa marquee).
 */
export default function FlowingMenu({ items = [], accent = "#2563eb", className = "" }) {
  if (!items.length) return null;
  return (
    <nav className={`overflow-hidden rounded-2xl border border-border bg-surface ${className}`}>
      {items.map((it, i) => (
        <MenuItem key={i} item={it} accent={accent} last={i === items.length - 1} />
      ))}
    </nav>
  );
}

function MenuItem({ item, accent, last }) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate();
  const itemRef = useRef(null);

  const edgeFromEvent = (ev) => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return "top";
    return ev.clientY - rect.top < rect.height / 2 ? "top" : "bottom";
  };

  const onEnter = (ev) => {
    if (reduce) return;
    const from = edgeFromEvent(ev) === "top" ? "-101%" : "101%";
    animate(
      scope.current,
      { y: [from, "0%"] },
      { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }
    );
  };

  const onLeave = (ev) => {
    if (reduce) return;
    const to = edgeFromEvent(ev) === "top" ? "-101%" : "101%";
    animate(scope.current, { y: to }, { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] });
  };

  const handleClick = (ev) => {
    if (item.onClick) {
      ev.preventDefault();
      item.onClick();
    }
  };

  return (
    <a
      ref={itemRef}
      href={item.href || "#"}
      onClick={handleClick}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={`ds-flow-item group relative flex h-16 md:h-20 items-center justify-center overflow-hidden ${
        last ? "" : "border-b border-border"
      }`}
    >
      {/* Label dasar */}
      <span className="relative z-[1] text-xl md:text-3xl font-bold tracking-tight text-content transition-colors duration-300 group-hover:opacity-0">
        {item.text}
      </span>

      {/* Panel marquee yang meluncur */}
      <div
        ref={scope}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] flex items-center"
        style={{ transform: "translateY(101%)", background: accent }}
      >
        <div className="ds-flow-marquee flex w-max items-center">
          {Array.from({ length: 8 }).map((_, k) => (
            <span key={k} className="flex items-center">
              <span className="mx-6 text-xl md:text-3xl font-bold tracking-tight text-white whitespace-nowrap">
                {item.text}
              </span>
              {item.image && (
                <span
                  className="mx-2 h-10 w-20 md:h-12 md:w-24 rounded-lg bg-cover bg-center shadow-soft"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

const styles = `
  .ds-flow-marquee { animation: ds-flow-scroll 22s linear infinite; will-change: transform; }
  @keyframes ds-flow-scroll { to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) {
    .ds-flow-marquee { animation: none; }
    .ds-flow-item:hover > span:first-child { opacity: 1; }
  }
`;

if (typeof document !== "undefined" && !document.querySelector("#ds-flowmenu-styles")) {
  const el = document.createElement("style");
  el.id = "ds-flowmenu-styles";
  el.textContent = styles;
  document.head.appendChild(el);
}
