import { Children, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * CardSwap — tumpukan kartu (deck) 3D yang otomatis bergilir; kartu depan
 * mundur ke belakang tiap beberapa detik.
 *
 * <CardSwap><Card/><Card/><Card/></CardSwap>
 *
 * - Jeda saat hover (pauseOnHover).
 * - Reduce-motion → transisi instan (tetap bergilir, tanpa animasi gerak).
 */
export default function CardSwap({
  children,
  delay = 3600,
  visible = 3,
  pauseOnHover = true,
  width = 320,
  height = 380,
  className = "",
}) {
  const cards = Children.toArray(children);
  const n = cards.length;
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const reduce = useReducedMotion();
  const hover = useRef(false);

  useEffect(() => {
    setOrder(cards.map((_, i) => i));
  }, [n]);

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      if (pauseOnHover && hover.current) return;
      setOrder((prev) => [...prev.slice(1), prev[0]]);
    }, delay);
    return () => clearInterval(id);
  }, [n, delay, pauseOnHover]);

  const posStyle = (p) => ({
    x: p * 22,
    y: -p * 16,
    scale: 1 - p * 0.06,
    rotate: p * 3,
    zIndex: n - p,
    opacity: p < visible ? 1 : 0,
  });

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height }}
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      {order.map((cardIdx, p) => (
        <motion.div
          key={cardIdx}
          className="absolute inset-0"
          initial={false}
          animate={posStyle(p)}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
          style={{ transformOrigin: "center center" }}
        >
          {cards[cardIdx]}
        </motion.div>
      ))}
    </div>
  );
}
