import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — bar tipis gradient di paling atas yang mengisi
 * sesuai posisi scroll halaman. Sangat ringan (1 elemen, GPU transform).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
    />
  );
}
