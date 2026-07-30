import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Rocket, ShieldCheck, Users, Truck, Sparkles, Compass } from "lucide-react";
import CursorSpotlight from "../ui/CursorSpotlight";

/**
 * TimeTravelStory — timeline "perjalanan waktu" yang digerakkan scroll.
 *
 * Section gelap seperti menembus ruang–waktu: garis progress biru mengisi
 * seiring scroll, angka tahun raksasa, dan tiap milestone menyala saat masuk
 * viewport. Data milestone di bawah bisa langsung diedit sesuai sejarah asli.
 */

// ⬇️ Edit teks/tahun di sini sesuai perjalanan Solit 03 yang sebenarnya.
const MILESTONES = [
  {
    year: "2020",
    title: "Titik Awal",
    icon: Rocket,
    text: "Solit 03 lahir dari satu keresahan sederhana: kenapa laptop berkualitas harus selalu mahal? Dimulai dari langkah kecil dengan tekad besar.",
  },
  {
    year: "2021",
    title: "Quality Control Berlapis",
    icon: ShieldCheck,
    text: "Kami bangun standar QC dengan 15+ titik pengecekan pada setiap unit — memastikan performa dan fisik benar-benar layak sebelum sampai ke tangan pelanggan.",
  },
  {
    year: "2022",
    title: "Tumbuh Bersama Pelanggan",
    icon: Users,
    text: "Kepercayaan pelanggan tumbuh. Garansi resmi jadi standar, dan komunitas pengguna Solit 03 semakin luas dari mulut ke mulut.",
  },
  {
    year: "2023",
    title: "Menjangkau Lebih Jauh",
    icon: Truck,
    text: "Layanan meluas: COD Jabodetabek dan pengiriman ke seluruh Indonesia. Laptop berkualitas kini bisa menjangkau lebih banyak orang.",
  },
  {
    year: "2024",
    title: "Digital & Transparan",
    icon: Sparkles,
    text: "Cek garansi dan antrian service kini real-time secara online. Transparansi penuh, tanpa drama — semua bisa dipantau sendiri.",
  },
  {
    year: "2025",
    title: "Menuju Masa Depan",
    icon: Compass,
    text: "Perjalanan belum selesai. Kami terus berinovasi menghadirkan akses teknologi yang berkualitas, terjangkau, dan berdampak bagi masyarakat.",
  },
];

function Milestone({ item, index, reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const Icon = item.icon;
  const isLeft = index % 2 === 0;

  const fromX = reduce ? 0 : isLeft ? -60 : 60;

  return (
    <div
      ref={ref}
      className={`relative flex md:items-center gap-6 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Kartu milestone */}
      <div className="md:w-1/2 pl-16 md:pl-0 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: fromX, y: 24 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          className={`relative ${isLeft ? "md:text-right" : "md:text-left"}`}
        >
          {/* Angka tahun raksasa di belakang */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -top-14 select-none text-7xl md:text-8xl font-extrabold tracking-tighter text-white/5 ${
              isLeft ? "left-0 md:left-auto md:right-0" : "left-0"
            }`}
          >
            {item.year}
          </span>

          <div className="relative rounded-2xl border border-white/10 bg-surface/[0.04] backdrop-blur-md p-5 md:p-6 shadow-[0_8px_40px_rgba(2,6,23,0.5)] hover:border-blue-400/40 transition-colors duration-300">
            <div
              className={`flex items-center gap-2 mb-2 ${
                isLeft ? "md:justify-end" : "md:justify-start"
              }`}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                <Icon className="w-3.5 h-3.5" />
                {item.year}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">
              {item.title}
            </h3>
            <p className="text-sm md:text-[15px] leading-relaxed text-slate-300/90">
              {item.text}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Node di garis tengah */}
      <div className="absolute left-6 md:left-1/2 top-2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
          className={`grid place-items-center w-6 h-6 rounded-full bg-slate-950 ring-2 ring-blue-400 ${
            inView ? "ds-node-active" : ""
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
        </motion.div>
      </div>

      {/* Spacer sisi kosong (desktop) */}
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
}

export default function TimeTravelStory() {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
      {/* Latar ruang–waktu */}
      <div className="absolute inset-0 ds-starfield opacity-70" />
      {/* Cahaya lembut mengikuti kursor */}
      <CursorSpotlight color="rgba(96,165,250,0.18)" size={520} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.25),transparent_55%)]" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-surface/5 border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Perjalanan Waktu
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-white"
          >
            Menembus Waktu Bersama{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              Solit&nbsp;03
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-content-muted max-w-2xl mx-auto text-sm md:text-base"
          >
            Scroll dan ikuti setiap babak perjalanan kami — dari satu langkah
            kecil hingga menjadi tujuan tepercaya untuk laptop berkualitas.
          </motion.p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Garis dasar */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 bg-surface/10" />
          {/* Garis progress (mengisi saat scroll) */}
          <motion.div
            style={{ scaleY: reduce ? 1 : lineScale }}
            className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 origin-top bg-gradient-to-b from-blue-400 via-sky-400 to-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.8)]"
          />

          <div className="space-y-16 md:space-y-24">
            {MILESTONES.map((item, index) => (
              <Milestone key={item.year} item={item} index={index} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
