import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * TiltCard — kartu yang memiring 3D mengikuti kursor (efek "premium tilt").
 *
 * <TiltCard><article>...</article></TiltCard>
 *
 * Halus by design: kemiringan kecil (default 7°) + kilau cahaya tipis mengikuti kursor.
 * - Mati di layar sentuh (pointer: coarse) & reduce-motion → render biasa tanpa listener.
 * - Pakai spring supaya gerak terasa mewah, bukan kaku.
 * - `glare` bisa dimatikan bila tak diinginkan.
 */
export default function TiltCard({
  children,
  className = "",
  max = 7,
  scale = 1.02,
  glare = true,
  ...rest
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const px = useMotionValue(0.5); // posisi kursor 0..1
  const py = useMotionValue(0.5);

  const springCfg = { stiffness: 220, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), springCfg);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), springCfg);

  // Titik pusat kilau mengikuti kursor
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(320px circle at ${x} ${y}, rgba(255,255,255,0.28), transparent 60%)`
  );

  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;

  if (reduce || coarse) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={{ scale }}
      transition={{ type: "spring", ...springCfg }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      className={`group relative ${className}`}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg, mixBlendMode: "soft-light" }}
        />
      )}
    </motion.div>
  );
}
