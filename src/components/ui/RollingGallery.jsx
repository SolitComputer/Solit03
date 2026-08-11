import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

/**
 * RollingGallery — galeri foto berbentuk silinder 3D yang berputar otomatis
 * dan bisa di-drag (geser) oleh pengguna.
 *
 * <RollingGallery images={["/a.webp", "/b.webp", ...]} />
 *
 * - Auto-rotate pelan; jeda saat hover / saat sedang di-drag.
 * - Reduce-motion / layar kecil tanpa 3D → fallback strip horizontal yang bisa di-scroll.
 */
export default function RollingGallery({
  images = [],
  autoplay = true,
  pauseOnHover = true,
  speed = 6, // derajat per detik
  className = "",
}) {
  const reduce = useReducedMotion();
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsSmall(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const rotation = useMotionValue(0);
  const transform = useTransform(rotation, (v) => `rotate3d(0,1,0,${v}deg)`);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const startX = useRef(0);
  const startRot = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduce || !autoplay || dragging.current) return;
    if (pauseOnHover && hovering.current) return;
    rotation.set(rotation.get() - (delta / 1000) * speed);
  });

  // Fallback tanpa 3D: strip horizontal
  if (reduce) {
    return (
      <div className={`flex gap-4 overflow-x-auto pb-4 snap-x ${className}`}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="h-56 w-auto rounded-2xl border border-border object-cover shrink-0 snap-center"
          />
        ))}
      </div>
    );
  }

  const faceCount = images.length || 1;
  const cylinderWidth = isSmall ? 1100 : 1900;
  const faceWidth = (cylinderWidth / faceCount) * 1.6;
  const radius = cylinderWidth / (2 * Math.PI);
  const imgHeight = isSmall ? 160 : 250;

  const onPointerDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startRot.current = rotation.get();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    rotation.set(startRot.current + dx * 0.16);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: imgHeight + 60, perspective: "1000px" }}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* Tepi memudar */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />

      <motion.div
        className="flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          transform,
          transformStyle: "preserve-3d",
          width: cylinderWidth,
          height: "100%",
          margin: "0 auto",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              width: faceWidth,
              height: imgHeight,
              marginLeft: -faceWidth / 2,
              marginTop: -imgHeight / 2,
              transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
              padding: "0 8px",
            }}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              className="h-full w-full rounded-2xl border border-border object-cover shadow-soft select-none pointer-events-none"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
