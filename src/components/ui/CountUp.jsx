import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * CountUp — angka menghitung naik dari 0 saat masuk viewport.
 * Ringan: 1 requestAnimationFrame, berhenti setelah selesai. Hormati reduce-motion.
 */
export default function CountUp({
  to,
  duration = 1.6,
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
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}
