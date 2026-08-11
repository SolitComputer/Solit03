import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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

// Entrance animation tokens — dipakai konsisten untuk heading & blok carousel
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function TeamSlider() {
  const [index, setIndex] = useState(0);

  const members = [
    { name: "Reinaldy Olyvierd Sendouw", role: "CEO", img: fotoReinaldy },
    { name: "Yoga Adi Prakoso", role: "HRD", img: fotoYoga },
    { name: "Rayhan Saputra", role: "Accounting", img: fotoRayhan },
    { name: "Yulfa", role: "Purchasing", img: fotoYulfa },
    { name: "Ikmal Fairuz Arabi", role: "Programmer", img: fotoIkmal },
    { name: "Fauzan Abdul Ghaffar", role: "Programmer", img: fotoFauzan },
    { name: "Moreno Akbari Pasha", role: "Programmer", img: fotoMoreno },
    { name: "Dimas Dwi Ananda Putra", role: "Programmer", img: fotoDimas },
    { name: "Nur Alim", role: "Marketing", img: fotoNurAlim },
    { name: "Yuna Lucyanawati W", role: "Content Creator", img: fotoYuna },
    { name: "Diva Karamaya", role: "Content Creator", img: fotoDivaK },
    { name: "Raesty Yuliana", role: "Customer Service", img: fotoRaesty },
    { name: "Dirga Riadmas", role: "Teknisi", img: fotoDirga },
    { name: "Rafii Dwi Saputra", role: "Teknisi", img: fotoRafiDwi },
    { name: "Rafi Salim", role: "Pengelola Barang", img: fotoRafiSalim },
    { name: "Lionel Juan Adhitya Alvarro", role: "Pengelola Barang", img: fotoLionel },
    { name: "Muhammad Haifano Addinnya Priadi", role: "Pengelola Barang", img: fotoHaifano },
    { name: "Fikri Aryansyah", role: "Penyedia Barang", img: fotoFikri },
    { name: "Romadon Abdusallam", role: "Kepala Sales", img: fotoRomadon },
    { name: "Dicky Pratama Setiawan", role: "Kepala Sotech", img: fotoDicky },
    { name: "Fadriansyah", role: "Kepala Onpoint", img: fotoFadriansyah },
    { name: "David J.Sendouw", role: "Kepala Zenith", img: fotoDavid },
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

  // Preload semua foto sesegera mungkin saat mount (bukan menunggu idle lagi),
  // dengan fetchPriority "low" supaya tidak menyaingi resource kritis tapi
  // tetap mulai fetch lebih awal — jadi pas carousel digeser foto udah ke-cache
  // dan langsung muncul tanpa jeda loading.
  useEffect(() => {
    members.forEach((member) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = member.img;
      link.fetchPriority = "low";
      document.head.appendChild(link);
    });
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

  // ========== CURSOR SPOTLIGHT (dekoratif) ==========
  // Titik cahaya biru yang mengikuti kursor di desktop — murni visual,
  // tidak menyentuh index/offset/logic carousel sama sekali.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.4 });
  const spotlightY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.4 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      className="relative text-center overflow-hidden py-6"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onMouseMove={handleMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Spotlight yang mengikuti kursor — desktop only, dekoratif murni */}
      <motion.div
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_70%)]"
        style={{
          left: spotlightX,
          top: spotlightY,
          marginLeft: -210,
          marginTop: -210,
        }}
      />

      {/* Dekorasi background — dua radial glow biru yang mengambang pelan, tidak menangkap event apapun */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[560px] md:h-[560px] rounded-full bg-blue-400/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full bg-blue-500/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
        className="relative mb-12 md:mb-16"
      >
        <motion.span
          variants={fadeInUp}
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600/70"
        >
          Orang-Orang di Balik Solit03
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          className="mt-3 text-2xl md:text-4xl font-bold text-content tracking-tight"
        >
          Tim{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Solit
          </span>
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="mx-auto mt-4 h-1 w-16 rounded-full overflow-hidden bg-blue-100"
        >
          <motion.div
            className="h-full w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 bg-[length:200%_100%]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>

      {/* ===== DESKTOP: 3D Carousel (md+) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden md:flex items-center justify-center"
        style={{ perspective: "1400px" }}
      >
        <div className="relative w-full max-w-6xl h-[420px] flex items-center justify-center">
          {/* Spotlight glow tepat di belakang kartu tengah — berdenyut pelan */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute w-64 h-64 rounded-full bg-blue-400/25 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

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
                {/* initial/animate di sini murni mengurus fade+pop saat kartu ini
                    pertama kali masuk ke rentang render (mount) — offset/posisi
                    tetap sepenuhnya dikendalikan style di atas, tidak disentuh */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    scale: isCenter ? [1, 1.015, 1] : 1,
                  }}
                  transition={{
                    opacity: { duration: 0.4, ease: "easeOut" },
                    scale: isCenter
                      ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 },
                  }}
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
                      loading="eager"
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
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors duration-500 ${isCenter
                        ? "border-blue-600 bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
                        : "border-blue-100 bg-blue-50 text-blue-700"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCenter ? "bg-white" : "bg-blue-400"
                      }`}
                    />
                    {member.role}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Tombol panah — desktop */}
        <motion.button
          type="button"
          onClick={prev}
          aria-label="Sebelumnya"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-soft hover:shadow-[0_15px_35px_rgba(37,99,235,0.35)] hover:bg-blue-600 hover:border-blue-600 hover:text-white text-blue-600 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          type="button"
          onClick={next}
          aria-label="Selanjutnya"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-soft hover:shadow-[0_15px_35px_rgba(37,99,235,0.35)] hover:bg-blue-600 hover:border-blue-600 hover:text-white text-blue-600 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* ===== MOBILE: Swipeable single card (< md) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden relative px-4"
      >
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: isCenter ? [1, 1.015, 1] : 1,
                  }}
                  transition={{
                    opacity: { duration: 0.4, ease: "easeOut" },
                    scale: isCenter
                      ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 },
                  }}
                  className="card-3d p-4 border border-blue-100/70 rounded-3xl bg-white/80 backdrop-blur-sm shadow-soft"
                >
                  <div className="relative overflow-hidden rounded-2xl ring-4 ring-white">
                    <img
                      src={member.img}
                      alt={member.name}
                      width={280}
                      height={288}
                      loading="eager"
                      decoding="async"
                      fetchPriority={isCenter ? "high" : "auto"}
                      className="w-full h-72 object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-content tracking-tight">
                    {member.name}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {member.role}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Tombol panah — mobile */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <motion.button
            type="button"
            onClick={prev}
            aria-label="Sebelumnya"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-soft text-blue-600 hover:bg-blue-600 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            type="button"
            onClick={next}
            aria-label="Selanjutnya"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-soft text-blue-600 hover:bg-blue-600 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Swipe hint — nudge halus kiri-kanan supaya kelihatan hidup */}
        <motion.p
          className="inline-flex items-center justify-center gap-1.5 mt-4 mx-auto rounded-full bg-white/60 backdrop-blur-sm px-3 py-1 text-[11px] text-blue-600/80"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <ChevronLeft className="w-3 h-3" />
          </motion.span>
          Geser untuk lihat anggota lain
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <ChevronRight className="w-3 h-3" />
          </motion.span>
        </motion.p>
      </motion.div>
    </section>
  );
}