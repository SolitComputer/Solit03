import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import reinaldy from "../../assets/reinaldy.webp";
import bangimron from "../../assets/bangimron.webp";
import nuralim from "../../assets/bangalim.webp";
import novita from "../../assets/owiiii.webp";
import rayhan from "../../assets/Raihan.webp";
import romadhon from "../../assets/bangsalam.webp";
import rafisalim from "../../assets/rafi.webp";
import yoga from "../../assets/masyoga.webp";
import yuna from "../../assets/kayuna.webp";
import ikmal from "../../assets/ikmall.webp";
import fauzan from "../../assets/fauzan.webp";
import fatur from "../../assets/tengkuu.webp";
import fikri from "../../assets/fikri.webp";
import dirga from "../../assets/dirga.webp";
import raesty from "../../assets/raesty.webp";
import jaelani from "../../assets/pamud.webp";
import mbafitri from "../../assets/mbafitri.webp";
import dicky from "../../assets/bangdiki.webp";
import revin from "../../assets/bangrevin.webp";


export default function TeamSlider() {
  const [index, setIndex] = useState(0);

  const members = [
    { name: "Reinaldy Olyvierd Sendouw", role: "CEO", img: reinaldy },
    { name: "Imron Muafi", role: "HRD", img: bangimron },
    { name: "Nur Alim", role: "Marketing", img: nuralim },
    { name: "Novita Glory Sendouw", role: "Content Creator", img: novita },
    { name: "Rayhan Saputra", role: "Accounting", img: rayhan },
    { name: "Ramadon Abdusalam", role: "Head of Sales", img: romadhon },
    { name: "Rafi Salim", role: "Pengelola Barang", img: rafisalim },
    { name: "Yoga Adi Prakoso", role: "Finance", img: yoga },
    { name: "Yuna Luscyana Wati", role: "One Point", img: yuna },
    { name: "Ikmal Fairuz Arabi", role: "Web Developer", img: ikmal },
    { name: "Fauzan Abdul Ghaffar", role: "Web Developer", img: fauzan },
    { name: "Tengku Muhammad Faturahman", role: "Kurir", img: fatur },
    { name: "Fikri Arryansyah", role: "Penyedia Barang", img: fikri },
    { name: "Dirga Riadmas", role: "Teknisi", img: dirga },
    { name: "Raesty Yuliana", role: "Sales Offline", img: raesty },
    { name: "Achmad Jaelani", role: "Chef", img: jaelani },
    { name: "Ramdhani Suci", role: "Management Sales", img: mbafitri },
    { name: "Rizki Revinza Saputra", role: "Sales", img: revin },
    { name: "Dicky Pratama Setiawan", role: "Sotech", img: dicky },
  ];

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + members.length) % members.length);
  }, [members.length]);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % members.length);
  }, [members.length]);

  // ========== TOUCH / SWIPE ==========
  const touchRef = useRef({ startX: 0, startY: 0, swiping: false });

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY, swiping: true };
    paused.current = true; // pause auto-slide saat touch
  };

  const onTouchEnd = (e) => {
    if (!touchRef.current.swiping) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchRef.current.startX;
    const diffY = endY - touchRef.current.startY;

    // Only swipe if horizontal movement > vertical (prevent conflict with page scroll)
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) next();
      else prev();
    }

    touchRef.current.swiping = false;
    // Resume auto-slide setelah 2 detik
    setTimeout(() => { paused.current = false; }, 2000);
  };

  // Auto-geser tiap 3.5 detik — berhenti saat kursor di atas slider
  const paused = useRef(false);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (!paused.current) {
        setIndex((prev) => (prev + 1) % members.length);
      }
    }, 3500);
    return () => clearInterval(id);
  }, [members.length]);

  return (
    <section
      className="text-center overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-16">
        Team Solit
      </h2>

      {/* ===== DESKTOP: 3D Carousel (md+) ===== */}
      <div
        className="relative hidden md:flex items-center justify-center"
        style={{ perspective: "1400px" }}
      >
        <div className="relative w-full max-w-6xl h-[420px] flex items-center justify-center">

          {members.map((member, i) => {
            let offset = i - index;

            // looping biar ga lompat
            if (offset > members.length / 2) offset -= members.length;
            if (offset < -members.length / 2) offset += members.length;

            // hanya render sekitar tengah (biar ringan)
            if (Math.abs(offset) > 2) return null;

            const isCenter = offset === 0;

            return (
              <div
                key={i}
                onClick={() => {
                  if (offset === 1) next();
                  if (offset === -1) prev();
                }}
                className="absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `
                    translateX(${offset * 260}px)
                    translateZ(${-Math.abs(offset) * 200}px)
                    rotateY(${offset * -25}deg)
                    scale(${1 - Math.abs(offset) * 0.15})
                  `,
                  zIndex: 50 - Math.abs(offset),
                  filter: `blur(${Math.abs(offset) * 1}px)`,
                  opacity: isCenter ? 1 : 0.6,
                  willChange: "transform",
                }}
              >
                <div
                  className={`card-3d p-4 w-64 md:w-72 ${!isCenter ? "cursor-pointer" : ""
                    }`}
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-72 object-cover rounded-xl"
                  />

                  <h3 className="mt-4 font-bold text-lg text-slate-900">
                    {member.name}
                  </h3>

                  <p className="text-slate-500 text-sm">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MOBILE: Swipeable single card (< md) ===== */}
      <div className="md:hidden relative px-4">
        <div className="relative flex items-center justify-center min-h-[420px]">
          {members.map((member, i) => {
            let offset = i - index;
            if (offset > members.length / 2) offset -= members.length;
            if (offset < -members.length / 2) offset += members.length;

            // Only render current + adjacent for perf
            if (Math.abs(offset) > 1) return null;

            const isCenter = offset === 0;

            return (
              <div
                key={i}
                className="absolute w-full max-w-[280px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translateX(${offset * 110}%) scale(${isCenter ? 1 : 0.85})`,
                  opacity: isCenter ? 1 : 0.3,
                  zIndex: isCenter ? 10 : 5,
                  pointerEvents: isCenter ? "auto" : "none",
                }}
              >
                <div className="card-3d p-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-72 object-cover rounded-xl"
                  />
                  <h3 className="mt-4 font-bold text-lg text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex justify-center gap-1.5 mt-4">
          {members.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to member ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 h-2 bg-blue-500"
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Swipe hint — shows briefly */}
        <p className="text-[10px] text-slate-400 mt-3 animate-pulse">
          ← Geser untuk lihat tim →
        </p>
      </div>
    </section>
  );
}
