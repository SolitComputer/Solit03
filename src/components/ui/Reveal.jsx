import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal — pembungkus animasi scroll-in yang reusable (Framer Motion).
 *
 * <Reveal>...</Reveal>              → fade + naik halus saat masuk viewport
 * <Reveal delay={0.1} y={40}>       → atur delay / jarak
 * <Reveal as="ul"> ... </Reveal>    → render tag lain
 *
 * Otomatis nonaktif jika user memilih "reduce motion".
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
