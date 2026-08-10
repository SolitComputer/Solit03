import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import CursorSpotlight from "../components/ui/CursorSpotlight";

const WHATSAPP_NUMBER = "6285210647047";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Halo Solit03, saya ingin konsultasi mengenai jasa pembuatan website/aplikasi."
)}`;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const PRICING = [
  {
    name: "Landing Page",
    price: "Rp 2.000.000",
    popular: false,
    features: [
      "Desain Responsif & Modern",
      "SEO Basic Setup",
      "Integrasi WhatsApp Kontak",
      "Revisi Minor 2x",
    ],
    cta: "Pilih Paket",
  },
  {
    name: "Company Profile",
    price: "Rp 6.000.000",
    popular: true,
    features: [
      "Multi-page (Up to 5 Halaman)",
      "Custom CMS / Admin Panel",
      "Animasi Interaktif Dasar",
      "Setup Domain & Hosting 1 Thn",
      "Support Teknis 3 Bulan",
    ],
    cta: "Pilih Paket",
  },
  {
    name: "Web App / POS",
    price: "Rp 22.000.000+",
    popular: false,
    features: [
      "Full-Custom Architecture",
      "Database Design & API",
      "Dashboard Analytics (Realtime)",
      "Multi-Role Authentication",
      "Dedicated Maintenance",
    ],
    cta: "Konsultasi Lanjut",
  },
];

const METHODOLOGY = [
  {
    step: "01",
    title: "Discovery & Brief",
    text: "Analisis kebutuhan bisnis, target audiens, dan penetapan tujuan teknis. Kami mendengarkan visi Anda untuk membangun fondasi yang tepat.",
  },
  {
    step: "02",
    title: "Wireframing & UI Design",
    text: "Merancang struktur (UX) dan antarmuka visual (UI) yang modern, estetik, dan memastikan perjalanan pengguna yang intuitif.",
  },
  {
    step: "03",
    title: "Development & Coding",
    text: "Eksekusi kode clean dan terstruktur. Membangun fungsionalitas front-end dan back-end dengan teknologi stack terkini.",
  },
  {
    step: "04",
    title: "QA & Testing",
    text: "Pengujian komprehensif melintasi berbagai perangkat dan browser untuk menjamin nol bug, kecepatan loading, dan keamanan.",
  },
  {
    step: "05",
    title: "Deploy & Maintenance",
    text: "Peluncuran ke server produksi (Live). Dilanjutkan dengan dukungan teknis dan pemeliharaan untuk memastikan stabilitas jangka panjang.",
  },
];

const FAQS = [
  {
    q: "Berapa lama proses pembuatan website?",
    a: "Rata-rata Landing Page selesai dalam 5-7 hari kerja, Company Profile 2-3 minggu, dan Web App/POS custom 4-8 minggu tergantung kompleksitas fitur.",
  },
  {
    q: "Apakah harga sudah termasuk domain dan hosting?",
    a: "Paket Company Profile sudah termasuk domain & hosting 1 tahun pertama. Untuk paket Landing Page dan Web App/POS, domain-hosting dapat ditambahkan sebagai add-on sesuai kebutuhan.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Pembayaran menggunakan sistem termin: DP 50% di awal proyek untuk mulai pengerjaan, dan pelunasan 50% setelah website/aplikasi selesai dan disetujui sebelum go-live.",
  },
];

const CASE_STUDIES = [
  {
    name: "Solit03 E-Commerce",
    tags: "Next.js • Tailwind • Stripe",
  },
  {
    name: "Solit POS System",
    tags: "React • Node.js • PostgreSQL",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
      >
        <span className="text-sm md:text-base font-semibold text-white">
          {item.q}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-300/90 leading-relaxed">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JasaWebsite() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Helmet>
        <title>Jasa Pembuatan Website & Aplikasi Custom | Solit03</title>
        <meta
          name="description"
          content="Jasa pembuatan Landing Page, Company Profile, hingga Web App/Sistem POS custom. Dibangun dengan standar industri global untuk performa maksimal bisnis Anda."
        />
        <meta
          name="keywords"
          content="jasa pembuatan website, jasa aplikasi custom, jasa landing page, jasa company profile, jasa web app, jasa sistem pos"
        />
        <link rel="canonical" href="https://solit03.com/jasa-pembuatan-website" />
      </Helmet>

      <main className="bg-black overflow-hidden">
        {/* ================= HERO ================= */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.28),transparent_55%)]" />
          <div className="absolute inset-0 ds-starfield opacity-50" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Available for New Projects
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 font-serif text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            >
              Jasa Pembuatan Website &amp;{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Aplikasi Custom
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-5 text-sm md:text-lg text-slate-300/90 max-w-xl mx-auto leading-relaxed"
            >
              Spesialis Landing Page, Company Profile, hingga Sistem POS
              terintegrasi. Dibangun dengan standar industri global untuk
              performa maksimal bisnis Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Konsultasi Gratis <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#studi-kasus"
                className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                Lihat Portofolio
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-[11px] md:text-xs font-medium uppercase tracking-wider text-slate-300"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Bergaransi Resmi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Support 24 Jam
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Proses Transparan
              </span>
            </motion.div>
          </div>

          {/* Code editor mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-3xl mx-auto mt-14 md:mt-16"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-blue-600/20 blur-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.6)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              <span className="mx-auto inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                solit03.com
              </span>
            </div>
            <div className="p-5 md:p-7 font-mono text-[12px] md:text-sm leading-relaxed">
              <p>
                <span className="text-purple-400">import</span>{" "}
                <span className="text-slate-200">{"{ SolitCore }"}</span>{" "}
                <span className="text-purple-400">from</span>{" "}
                <span className="text-emerald-400">'@solit/core'</span>
              </p>
              <p className="mt-4">
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">app</span>{" "}
                <span className="text-slate-400">=</span>{" "}
                <span className="text-purple-400">new</span>{" "}
                <span className="text-yellow-300">SolitCore</span>
                <span className="text-slate-400">{"({"}</span>
              </p>
              <p className="pl-6 text-slate-300">
                performance:{" "}
                <span className="text-emerald-400">'maximized'</span>,
              </p>
              <p className="pl-6 text-slate-300">
                design: <span className="text-emerald-400">'pixel-perfect'</span>,
              </p>
              <p className="pl-6 text-slate-300">
                security:{" "}
                <span className="text-emerald-400">'enterprise-grade'</span>
              </p>
              <p className="text-slate-400">{"});"}</p>
              <p className="mt-4">
                <span className="text-blue-300">app</span>
                <span className="text-slate-400">.launch().then(() =&gt; {"{"}</span>
              </p>
              <p className="pl-6">
                <span className="text-slate-300">console.</span>
                <span className="text-yellow-300">log</span>
                <span className="text-slate-400">(</span>
                <span className="text-emerald-400">'Ready to scale'</span>
                <span className="text-slate-400">);</span>
              </p>
              <p className="text-slate-400">{"});"}</p>
            </div>
            </div>
          </motion.div>
        </section>

        {/* ================= PRICING ================= */}
        <section className="relative py-20 md:py-28 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="mb-12 md:mb-16"
            >
              <motion.span
                variants={fadeInUp}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400"
              >
                Paket Layanan
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="mt-3 font-serif text-2xl md:text-4xl font-bold text-white"
              >
                Investasi Digital Berdampak
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="mt-3 text-sm md:text-base text-slate-400 max-w-md"
              >
                Solusi tepat yang disesuaikan dengan skala dan kebutuhan
                bisnis Anda.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {PRICING.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={`relative rounded-2xl border p-6 md:p-7 flex flex-col transition-colors duration-300 ${
                    plan.popular
                      ? "border-blue-500/60 bg-gradient-to-b from-blue-950/60 to-white/[0.02] shadow-[0_20px_60px_rgba(37,99,235,0.25)] md:-mt-4 md:mb-[-1rem]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute top-0 right-6 -translate-y-1/2 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_6px_20px_rgba(37,99,235,0.5)]">
                      <Sparkles className="w-3 h-3" />
                      Populer
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">Mulai dari</p>
                  <p
                    className={`mt-2 text-3xl font-extrabold ${
                      plan.popular ? "text-blue-400" : "text-white"
                    }`}
                  >
                    {plan.price}
                  </p>

                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <Check className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-7 inline-flex items-center justify-center w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "border border-white/15 text-white hover:bg-white/5"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= STUDI KASUS ================= */}
        <section
          id="studi-kasus"
          className="relative py-20 md:py-28 px-4 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
              >
                <motion.span
                  variants={fadeInUp}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400"
                >
                  Karya Kami
                </motion.span>
                <motion.h2
                  variants={fadeInUp}
                  className="mt-3 font-serif text-2xl md:text-4xl font-bold text-white"
                >
                  Studi Kasus Digital
                </motion.h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif italic text-slate-400 text-right md:max-w-xs"
              >
                "Fokus pada performa, estetika, dan konversi."
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Case 1 — E-Commerce */}
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <div className="p-4 bg-slate-900">
                  <div className="rounded-lg overflow-hidden bg-white">
                    <div className="flex items-center justify-between px-3 py-2 bg-blue-700 text-white text-[11px] font-semibold">
                      <span>solit03 Laptop &amp; Aksesoris</span>
                      <span className="rounded bg-white/20 px-2 py-0.5 text-[10px]">
                        Search...
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="text-center">
                          <div className="aspect-square rounded-md bg-slate-200 mb-1.5" />
                          <div className="h-1.5 w-3/4 mx-auto rounded bg-slate-200 mb-1" />
                          <div className="h-4 w-full rounded bg-blue-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-bold text-white">{CASE_STUDIES[0].name}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {CASE_STUDIES[0].tags}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>

              {/* Case 2 — POS System */}
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <div className="p-4 bg-slate-900">
                  <div className="rounded-lg overflow-hidden bg-white p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-1/3 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 flex-1 rounded bg-emerald-100" />
                      <div className="h-6 flex-1 rounded bg-blue-100" />
                    </div>
                    <div className="flex items-end gap-2 h-16">
                      <div className="w-1/5 h-1/3 rounded bg-blue-300" />
                      <div className="w-1/5 h-full rounded bg-blue-500" />
                      <div className="w-1/5 h-2/3 rounded bg-blue-400" />
                      <div className="w-1/5 h-1/2 rounded bg-blue-300" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-bold text-white">{CASE_STUDIES[1].name}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {CASE_STUDIES[1].tags}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            </motion.div>

            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-10 text-center hover:border-blue-400/50 hover:bg-white/[0.02] transition-colors duration-200"
            >
              <span className="text-white font-serif text-lg">
                Proyek Berikutnya, Milik Anda?
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 underline underline-offset-4">
                Mulai Diskusi <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.a>
          </div>
        </section>

        {/* ================= METODOLOGI ================= */}
        <section className="relative py-20 md:py-28 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="mb-10 md:mb-14"
            >
              <motion.span
                variants={fadeInUp}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400"
              >
                Alur Kerja
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="mt-3 font-serif text-2xl md:text-4xl font-bold text-white"
              >
                Metodologi Solit03
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="divide-y divide-white/10 border-t border-white/10"
            >
              {METHODOLOGY.map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  className="group grid md:grid-cols-[3.5rem_16rem_1fr] gap-2 md:gap-8 py-6 md:py-8 md:px-4 md:-mx-4 rounded-xl transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <span className="font-mono text-lg font-bold text-slate-700 transition-colors duration-300 group-hover:text-blue-400">
                    {item.step}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="relative py-20 md:py-28 px-4 border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-2xl md:text-4xl font-bold text-white"
            >
              Pertanyaan Umum
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-sm md:text-base text-slate-400"
            >
              Detail teknis dan operasional layanan kami.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-2xl mx-auto mt-10 space-y-3"
          >
            {FAQS.map((item, idx) => (
              <motion.div key={item.q} variants={fadeInUp}>
                <FaqItem
                  item={item}
                  isOpen={openFaq === idx}
                  onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="relative px-4 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-14 md:py-16 text-center"
          >
            <CursorSpotlight color="rgba(255,255,255,0.18)" size={480} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative z-10">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-white">
                Siap Mendigitalkan Bisnis Anda?
              </h2>
              <p className="mt-4 text-sm md:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
                Jangan biarkan ide Anda hanya menjadi rencana. Mari wujudkan
                platform digital yang cepat, aman, dan memukau bersama
                Solit03.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 bg-white text-blue-700 text-sm font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              >
                Hubungi via WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
