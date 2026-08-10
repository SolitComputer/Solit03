import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fotoReinaldy from "../../assets/foto/reinaldy-olyvierd-sendouw.webp";
import fotoYoga from "../../assets/foto/yoga-adi-prakoso.webp";
import fotoRayhan from "../../assets/foto/rayhan-saputra.webp";
import fotoYulfa from "../../assets/foto/yulfa.webp";
import fotoIkmal from "../../assets/foto/ikmal-fairuz-arabi.webp";
import fotoFauzan from "../../assets/foto/fauzan-abdul-g.webp";
import fotoMoreno from "../../assets/foto/moreno-akbari-p.webp";
import fotoDimas from "../../assets/foto/dimas-dwi-ap.webp";
import fotoNurAlim from "../../assets/foto/nur-alim.webp";
import fotoYuna from "../../assets/foto/yuna-lw.webp";
import fotoDivaK from "../../assets/foto/diva-k.webp";
import fotoRaesty from "../../assets/foto/raesty-yuliana.webp";
import fotoDirga from "../../assets/foto/dirga-riadmas.webp";
import fotoRafiDwi from "../../assets/foto/rafi-dwi-saputra.webp";
import fotoRafiSalim from "../../assets/foto/rafi-salim.webp";
import fotoLionel from "../../assets/foto/lionel-jaa.webp";
import fotoHaifano from "../../assets/foto/m-haifano-ap.webp";
import fotoFikri from "../../assets/foto/fikri-aryansyah.webp";
import fotoRomadon from "../../assets/foto/romadon-abdusallam.webp";
import fotoDicky from "../../assets/foto/dicky-pratama-s.webp";
import fotoFadriansyah from "../../assets/foto/fadriansyah.webp";
import fotoDavid from "../../assets/foto/david-j-sendouw.webp";
import fotoAndhika from "../../assets/foto/andhika.webp";
import fotoAmaliyah from "../../assets/foto/amaliyah.webp";
import fotoAndiniSazkia from "../../assets/foto/andini-sazkia-putri.webp";
import fotoFauziahNurul from "../../assets/foto/fauziah-nurul-rahma.webp";
import fotoBungaChalista from "../../assets/foto/bunga-chalista-augustav.webp";
import fotoFitriHidayat from "../../assets/foto/fitri-hidayat.webp";
import fotoNovaRovatul from "../../assets/foto/nova-rovatul-walidah.webp";
import fotoNovitaGlory from "../../assets/foto/novita-glory-sendouw.webp";
import fotoHerry from "../../assets/foto/r-herry-sudiarman.webp";
import fotoAchmadJaelani from "../../assets/foto/achmad-jaelani.webp";

export default function TeamSlider() {
  const [index, setIndex] = useState(0);

  const members = [
    { name: "Reinaldy Olyvierd Sendouw", role: "CEO", img: fotoReinaldy },
    { name: "Yoga Adi Prakoso", role: "HRD", img: fotoYoga },
    { name: "Rayhan Saputra", role: "Accounting", img: fotoRayhan },
    { name: "Yulfa", role: "Purchasing", img: fotoYulfa },
    { name: "Ikmal Fairuz Arabi", role: "Programmer", img: fotoIkmal },
    { name: "Fauzan Abdul G", role: "Programmer", img: fotoFauzan },
    { name: "Moreno Akbari P", role: "Programmer", img: fotoMoreno },
    { name: "Dimas Dwi A.P", role: "Programmer", img: fotoDimas },
    { name: "Nur Alim", role: "Marketing", img: fotoNurAlim },
    { name: "Yuna Lucyanawati W", role: "Content Creator", img: fotoYuna },
    { name: "Diva Karamaya", role: "Content Creator", img: fotoDivaK },
    { name: "Raesty Yuliana", role: "Customer Service", img: fotoRaesty },
    { name: "Dirga Riadmas", role: "Teknisi", img: fotoDirga },
    { name: "Rafii Dwi Saputra", role: "Teknisi", img: fotoRafiDwi },
    { name: "Rafi Salim", role: "Pengelola Barang", img: fotoRafiSalim },
    { name: "Lionel J.A.A", role: "Pengelola Barang", img: fotoLionel },
    { name: "M. Haifano A.P", role: "Pengelola Barang", img: fotoHaifano },
    { name: "Fikri Aryansyah", role: "Penyedia Barang", img: fotoFikri },
    { name: "Romadon Abdusallam", role: "Kepala Sales", img: fotoRomadon },
    { name: "Dicky Pratama S.", role: "Kepala Sotech", img: fotoDicky },
    { name: "Fadriansyah", role: "Kepala Onpoint", img: fotoFadriansyah },
    { name: "David J. Sendouw", role: "Kepala Zenith", img: fotoDavid },
    { name: "Andhika", role: "Sales", img: fotoAndhika },
    { name: "Amaliyah", role: "Sales", img: fotoAmaliyah },
    { name: "Andini Sazkia Putri", role: "Sales", img: fotoAndiniSazkia },
    { name: "Fauziah Nurul Rahma", role: "Sales", img: fotoFauziahNurul },
    { name: "Bunga Chalista Augustav", role: "Sales", img: fotoBungaChalista },
    { name: "Fitri Hidayat", role: "Sales", img: fotoFitriHidayat },
    { name: "Nova Rovatul Walidah", role: "Sales", img: fotoNovaRovatul },
    { name: "Novita Glory Sendouw", role: "Sales", img: fotoNovitaGlory },
    { name: "R Herry Sudiarman", role: "Pengantaran", img: fotoHerry },
    { name: "Achmad Jaelani", role: "Chef", img: fotoAchmadJaelani },
 ];

  // Preload semua foto di waktu browser idle, supaya pas carousel digeser
  // foto udah ke-cache dan langsung muncul tanpa nunggu network lagi
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;

    const handle = idle(() => {
      members.forEach((member) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = member.img;
        link.fetchPriority = "low";
        document.head.appendChild(link);
      });
    });

    return () => cancelIdle(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      className="relative text-center overflow-hidden py-6"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Dekorasi background — satu radial glow biru lembut di tengah, tidak menangkap event apapun */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[560px] md:h-[560px] rounded-full bg-blue-400/10 blur-3xl"
      />

      {/* Heading */}
      <div className="relative mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-content tracking-tight">
          Tim{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Solit
          </span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
      </div>

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
                  filter: `blur(${Math.abs(offset) * 1}px) grayscale(${isCenter ? 0 : 45}%)`,
                  opacity: isCenter ? 1 : 0.6,
                  willChange: "transform",
                }}
              >
                <div
                  className={`card-3d group relative p-4 w-64 md:w-72 rounded-3xl border bg-white/70 backdrop-blur-sm transition-all duration-500 ${isCenter
                      ? "border-blue-200 shadow-[0_25px_60px_-20px_rgba(37,99,235,0.45),0_10px_25px_-10px_rgba(15,23,42,0.15)]"
                      : "border-transparent shadow-soft"
                    } ${!isCenter ? "cursor-pointer" : ""}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${isCenter ? "ring-4 ring-white" : ""
                      }`}
                  >
                   <img
                      src={member.img}
                      alt={member.name}
                      width={288}
                      height={288}
                      loading={Math.abs(offset) <= 1 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={isCenter ? "high" : "auto"}
                      className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3
                    className={`mt-4 font-bold text-content tracking-tight transition-all duration-500 ${isCenter ? "text-xl" : "text-base"
                      }`}
                  >
                    {member.name}
                  </h3>

                  <span
                    className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors duration-500 ${isCenter
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-100 bg-blue-50 text-blue-700"
                      }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tombol panah — desktop */}
        <button
          type="button"
          onClick={prev}
          aria-label="Sebelumnya"
          className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-soft hover:shadow-soft-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-95 text-blue-600 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Selanjutnya"
          className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-soft hover:shadow-soft-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-95 text-blue-600 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
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
                <div className="card-3d p-4 border border-blue-100/70 rounded-3xl bg-white/80 backdrop-blur-sm shadow-soft">
                  <div className="relative overflow-hidden rounded-2xl ring-4 ring-white">
                    <img
                      src={member.img}
                      alt={member.name}
                      width={280}
                      height={288}
                      loading={Math.abs(offset) <= 1 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={isCenter ? "high" : "auto"}
                      className="w-full h-72 object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-content tracking-tight">
                    {member.name}
                  </h3>
                  <span className="mt-2 inline-block rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    {member.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tombol panah — mobile */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Sebelumnya"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-soft text-blue-600 active:scale-95 hover:bg-blue-600 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Selanjutnya"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-soft text-blue-600 active:scale-95 hover:bg-blue-600 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe hint — shows briefly */}
        <p className="text-[11px] text-blue-600/70 mt-4 flex items-center justify-center gap-1.5 animate-pulse">

        </p>
      </div>
    </section>
  );
}