import { motion, useReducedMotion } from "framer-motion";

/**
 * SplitText — judul yang muncul bertahap per kata/huruf (blur → tajam, naik halus).
 *
 * <SplitText text="Solit 03" as="h1" />
 * <SplitText text="Halo dunia" by="char" delay={0.2} />
 *
 * - `by="word"` (default) atau `by="char"`.
 * - Otomatis nonaktif saat reduce-motion (langsung tampil utuh).
 * - `once` → animasi sekali saja saat masuk viewport.
 * - Children boleh dipakai untuk menyisipkan <span> berwarna via `text` biasa,
 *   tapi untuk gaya campuran, bungkus manual dengan beberapa <SplitText>.
 */
export default function SplitText({
  text = "",
  as = "span",
  by = "word",
  className = "",
  delay = 0,
  stagger = 0.045,
  duration = 0.6,
  y = 18,
  once = true,
  amount = 0.4,
  ...rest
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.span;

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {text}
      </Plain>
    );
  }

  const units = by === "char" ? Array.from(text) : text.split(/(\s+)/);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const item = {
    hidden: { opacity: 0, y, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      aria-label={text}
      {...rest}
    >
      {units.map((u, i) =>
        /^\s+$/.test(u) ? (
          <span key={i}>{u}</span>
        ) : (
          <motion.span
            key={i}
            variants={item}
            aria-hidden="true"
            style={{ display: "inline-block", willChange: "transform, filter" }}
          >
            {u}
          </motion.span>
        )
      )}
    </Tag>
  );
}
