import { useEffect, useRef } from "react";

/**
 * CursorSpotlight — cahaya lembut yang membuntuti kursor di dalam parent-nya.
 * Taruh sebagai anak dari container ber-`position: relative; overflow: hidden`.
 * Ringan: update CSS var via 1 rAF, mati di reduce-motion / layar sentuh kecil.
 */
export default function CursorSpotlight({
  color = "rgba(59,130,246,0.16)",
  size = 480,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!parent) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let raf = 0;
    let pending = false;
    let x = 0;
    let y = 0;

    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(() => {
          el.style.setProperty("--sx", `${x}px`);
          el.style.setProperty("--sy", `${y}px`);
          pending = false;
        });
      }
    };
    const onEnter = () => (el.style.opacity = "1");
    const onLeave = () => (el.style.opacity = "0");

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ${className}`}
      style={{
        background: `radial-gradient(${size}px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 45%)`,
      }}
    />
  );
}
