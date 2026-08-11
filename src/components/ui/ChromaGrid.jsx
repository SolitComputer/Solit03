import { useEffect, useRef, useState } from "react";

/**
 * ChromaGrid — grid kartu yang "meredup" secara default, lalu memunculkan warna
 * penuh di sekitar kursor (efek sorotan/spotlight).
 *
 * <ChromaGrid items={[{ image, title, subtitle, borderColor }]} />
 *
 * - Sorotan mengikuti kursor via CSS var (--cx/--cy), di-update lewat 1 rAF.
 * - Nonaktif di layar sentuh / reduce-motion → semua kartu tampil penuh warna.
 */
export default function ChromaGrid({
  items = [],
  columnsClass = "grid-cols-2 sm:grid-cols-3",
  radius = 280,
  className = "",
}) {
  const ref = useRef(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    setInteractive(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pending = false;
    let x = 0;
    let y = 0;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(() => {
          el.style.setProperty("--cx", `${x}px`);
          el.style.setProperty("--cy", `${y}px`);
          pending = false;
        });
      }
    };
    const onLeave = () => {
      el.style.setProperty("--cx", `-9999px`);
      el.style.setProperty("--cy", `-9999px`);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    onLeave();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  if (!items.length) return null;

  return (
    <div
      ref={ref}
      className={`ds-chroma relative grid gap-4 ${columnsClass} ${interactive ? "ds-chroma-on" : ""} ${className}`}
      style={{ "--ds-chroma-r": `${radius}px` }}
    >
      {items.map((it, i) => (
        <article
          key={i}
          className="ds-chroma-card group relative overflow-hidden rounded-2xl border border-border bg-surface"
          style={{ "--card-accent": it.borderColor || "#3b82f6" }}
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={it.image}
              alt={it.title || ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {(it.title || it.subtitle) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent p-3">
              {it.title && <p className="text-white text-sm font-semibold">{it.title}</p>}
              {it.subtitle && <p className="text-white/75 text-xs">{it.subtitle}</p>}
            </div>
          )}
        </article>
      ))}

      {/* Lapisan sorotan — hanya aktif di pointer halus */}
      {interactive && <div aria-hidden="true" className="ds-chroma-fade" />}
    </div>
  );
}

const styles = `
  .ds-chroma-card {
    box-shadow: var(--ds-shadow-sm);
    transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
  }
  .ds-chroma-card:hover {
    transform: translateY(-4px);
    border-color: var(--card-accent);
    box-shadow: var(--ds-shadow-lg), 0 12px 32px -10px var(--card-accent);
  }
  /* Lapisan yang meredupkan seluruh grid, dengan "lubang" mengikuti kursor */
  .ds-chroma-fade {
    position: absolute;
    inset: 0;
    z-index: 20;
    pointer-events: none;
    border-radius: inherit;
    background: var(--ds-bg);
    -webkit-mask-image: radial-gradient(circle var(--ds-chroma-r, 280px) at var(--cx, -9999px) var(--cy, -9999px), transparent 0%, transparent 18%, rgba(0,0,0,0.8) 62%);
            mask-image: radial-gradient(circle var(--ds-chroma-r, 280px) at var(--cx, -9999px) var(--cy, -9999px), transparent 0%, transparent 18%, rgba(0,0,0,0.8) 62%);
    transition: opacity .4s ease;
  }
`;

if (typeof document !== "undefined" && !document.querySelector("#ds-chroma-styles")) {
  const el = document.createElement("style");
  el.id = "ds-chroma-styles";
  el.textContent = styles;
  document.head.appendChild(el);
}
