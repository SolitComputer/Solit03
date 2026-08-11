import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import CardSwap from "./ui/CardSwap";
import Magnet from "./ui/Magnet";
import Reveal from "./ui/Reveal";
import { DEFAULT_SHOWCASE_IMAGES } from "../utils/defaultShowcaseImages";

/**
 * FeaturedDeck — spotlight "Produk Unggulan": copy di kiri, deck kartu 3D
 * (CardSwap) yang bergilir otomatis di kanan.
 */
export default function FeaturedDeck() {
  const navigate = useNavigate();
  const cards = DEFAULT_SHOWCASE_IMAGES.slice(0, 5).map((it) => it.image_url).filter(Boolean);
  if (cards.length < 2) return null;

  const goCatalog = () => {
    navigate("/katalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface-muted overflow-hidden">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-8 items-center">
        {/* Copy */}
        <Reveal>
          <span className="eyebrow">Produk Unggulan</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
            Unit Pilihan yang <span className="text-blue-600">Siap Pakai</span>
          </h2>
          <p className="text-sm md:text-base text-content-muted mt-4 max-w-md">
            Setiap unit melewati quality control menyeluruh dan bergaransi resmi.
            Tinggal pilih, kami pastikan performanya ngebut sejak hari pertama.
          </p>
          <Magnet>
            <motion.button
              onClick={goCatalog}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="btn btn-primary px-7 py-3 text-sm sm:text-base mt-7 group"
            >
              Lihat Katalog
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Magnet>
        </Reveal>

        {/* Deck */}
        <div className="flex justify-center md:justify-end">
          <div className="relative pr-14 pt-14">
            <CardSwap width={280} height={340}>
              {cards.map((src, i) => (
                <div key={i} className="relative w-full h-full rounded-3xl overflow-hidden border border-border shadow-soft-lg bg-surface">
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Quality Checked
                    </span>
                    <p className="mt-2 text-white font-semibold text-sm">Bergaransi Resmi</p>
                  </div>
                </div>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}
