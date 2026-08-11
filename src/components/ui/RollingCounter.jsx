import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * RollingCounter — angka bertambah mulus dari 0 ke target saat masuk viewport.
 * Menggunakan tabular-nums agar angka tampil jelas, proporsional, dan bebas clipping/overlap.
 */
export default function RollingCounter({
  to,
  duration = 1.8,
  prefix = "",
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span
      ref={ref}
      className={`inline-flex items-center tabular-nums ${className}`}
      aria-label={`${prefix}${to}${suffix}`}
    >
      {prefix && <span>{prefix}</span>}
      <span>{val.toLocaleString("id-ID")}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

