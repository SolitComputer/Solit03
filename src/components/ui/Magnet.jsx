import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Magnet — elemen yang "ditarik" pelan ke arah kursor saat kursor mendekat.
 *
 * <Magnet><button className="btn btn-primary">Klik</button></Magnet>
 *
 * Halus: pergeseran dibatasi (`strength`), balik ke posisi semula saat kursor pergi.
 * - Mati di layar sentuh & reduce-motion → render biasa.
 * - Bungkus elemen apa pun (tombol, ikon, kartu kecil).
 */
export default function Magnet({
  children,
  className = "",
  strength = 0.35,
  radius = 90,
  ...rest
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.3 });

  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;

  if (reduce || coarse) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }

  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const reach = radius + Math.max(r.width, r.height) / 2;
    if (dist < reach) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.span>
  );
}
