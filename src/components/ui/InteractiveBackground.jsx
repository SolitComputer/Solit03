import { useEffect, useRef } from "react";

/**
 * InteractiveBackground — jaring partikel di <canvas> yang MENGHINDAR dari kursor.
 *
 * Ringan (murni Canvas 2D, tanpa three.js): partikel saling terhubung garis,
 * dan menjauh saat kursor mendekat lalu perlahan kembali melayang.
 *
 * Hemat performa:
 *  - Auto-pause saat section keluar viewport (IntersectionObserver) & tab disembunyikan.
 *  - Jumlah partikel dibatasi + skala devicePixelRatio dikunci maksimal 1.5.
 *  - Mati total di HP kecil / mode "reduce motion" (render 1 frame statis).
 */
export default function InteractiveBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia?.("(max-width: 640px)").matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const LINK = isSmall ? 108 : 138;      // jarak maksimal antar garis
    const REPEL = 135;                      // radius pengaruh kursor
    const REPEL_FORCE = 3.4;                // seberapa kuat "menghindar"

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function initParticles() {
      const area = width * height;
      const density = isSmall ? 10000 : 5600; // px² per partikel (makin kecil = makin padat)
      let count = Math.round(area / density);
      count = Math.max(30, Math.min(count, isSmall ? 60 : 150));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Update posisi
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Menghindar dari kursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL) {
          const d = Math.sqrt(d2) || 1;
          const f = ((REPEL - d) / REPEL) * REPEL_FORCE;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        // Melayang pelan
        p.x += p.vx;
        p.y += p.vy;

        // Pantul di tepi
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      // Garis penghubung
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            ctx.strokeStyle = `rgba(96,165,250,${(1 - dist / LINK) * 0.45})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Titik
      ctx.fillStyle = "rgba(147,197,253,0.9)";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      draw();
      if (running) raf = requestAnimationFrame(loop);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();

    // Mode hemat: tanpa animasi & tanpa interaksi
    if (reduce || isSmall) {
      draw();
      const onResize = () => {
        resize();
        draw();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    // Pause saat keluar viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Pause saat tab disembunyikan
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
