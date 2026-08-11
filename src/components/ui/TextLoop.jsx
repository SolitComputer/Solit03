import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * TextLoop — satu slot teks yang berganti-ganti otomatis (roll vertikal halus).
 *
 * <TextLoop items={["Kuliah", "Kerja", "Gaming"]} />
 *
 * - Lebar dikunci ke kata terpanjang (pakai `ch`) supaya teks di sekitarnya
 *   tidak "lompat" saat berganti.
 * - Reduce-motion → tampilkan item pertama secara statis.
 */
export default function TextLoop({
  items = [],
  interval = 2200,
  className = "",
  transition,
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || items.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval, reduce]);

  if (!items.length) return null;

  const maxLen = Math.max(...items.map((s) => String(s).length));

  if (reduce) {
    return <span className={className}>{items[0]}</span>;
  }

  return (
    <span
      className={`relative inline-flex overflow-hidden align-bottom ${className}`}
      style={{ minWidth: `${maxLen}ch` }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={transition || { type: "spring", stiffness: 380, damping: 30 }}
          className="inline-block whitespace-nowrap"
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
