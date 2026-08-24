import { useEffect, useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

/**
 * CurvedLoop — pita teks besar yang berjalan loop tanpa henti sepanjang jalur
 * (bisa melengkung) dan dapat digeser (drag) oleh pengguna.
 *
 * <CurvedLoop text="SOLIT 03 ✦ LAPTOP BERGARANSI ✦ " curve={40} />
 *
 * - Teks diulang secukupnya untuk mengisi jalur, `startOffset` dianimasikan
 *   lewat 1 rAF (tanpa re-render React), dan dibungkus mulus saat melewati 1 salinan.
 * - Reduce-motion → pita statis (teks tetap tampil, tanpa gerak).
 */
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function CurvedLoop({
  text = "SOLIT 03 ✦ LAPTOP BERGARANSI ✦ QUALITY CONTROL ✦ ",
  speed = 60, // px per detik
  curve = 40, // 0 = lurus; makin besar makin melengkung
  direction = "left",
  fontClassName = "fill-current text-content",
  className = "",
}) {
  const reduce = useReducedMotion();
  const measureRef = useRef(null);
  const pathRef = useRef(null);
  const textPathRef = useRef(null);
  const offset = useRef(0);
  const drag = useRef({ active: false, lastX: 0 });
  const [copyW, setCopyW] = useState(0);

  const W = 1440;
  const H = 150;
  const baseline = 100;
  const pathId = "ds-curve-" + hash(text + curve);
  const d = `M-200,${baseline} Q${W / 2},${baseline - curve} ${W + 200},${baseline}`;

  const textStyle = {
    fontSize: 72,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "var(--ds-font-display)",
  };

  useEffect(() => {
    if (measureRef.current) setCopyW(measureRef.current.getComputedTextLength());
  }, [text, curve]);

  const reps = copyW > 0 ? Math.ceil((W * 2) / copyW) + 2 : 6;
  const repeated = text.repeat(reps);

  const wrap = () => {
    if (copyW <= 0) return;
    while (offset.current <= -copyW) offset.current += copyW;
    while (offset.current > 0) offset.current -= copyW;
  };

  const dir = direction === "left" ? 1 : -1;
  useAnimationFrame((_, delta) => {
    if (reduce || drag.current.active || !textPathRef.current || copyW <= 0) return;
    offset.current -= dir * (delta / 1000) * speed;
    wrap();
    textPathRef.current.setAttribute("startOffset", offset.current + "px");
  });

  const onDown = (e) => {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    offset.current += dx;
    wrap();
    textPathRef.current?.setAttribute("startOffset", offset.current + "px");
  };
  const onUp = (e) => {
    drag.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: "pan-y" }}
      >
        <defs>
          <path id={pathId} ref={pathRef} d={d} fill="none" />
        </defs>
        {/* Pengukur lebar 1 salinan (tak terlihat) */}
        <text ref={measureRef} x="0" y="-999" style={textStyle} className={fontClassName}>
          {text}
        </text>
        <text style={textStyle} className={fontClassName}>
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0">
            {repeated}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
