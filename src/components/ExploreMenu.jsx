import { useNavigate } from "react-router-dom";
import { LayoutGrid, RefreshCw, Code2, Newspaper, Building2, ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { DEFAULT_SHOWCASE_IMAGES } from "../utils/defaultShowcaseImages";

/**
 * ExploreMenu — navigasi utama gaya "bento": kartu-kartu dengan thumbnail,
 * ikon, dan judul. Kartu "Katalog" tampil besar sebagai fokus utama.
 */
const LINKS = [
  { text: "Katalog", desc: "Ratusan unit laptop siap pakai", href: "/katalog", icon: LayoutGrid, feature: true },
  { text: "Jual-Beli", desc: "Tukar tambah & jual laptop", href: "/jual-beli", icon: RefreshCw },
  { text: "Jasa Web", desc: "Website & aplikasi custom", href: "/jasa-pembuatan-website", icon: Code2 },
  { text: "Berita", desc: "Info & tips teknologi", href: "/berita", icon: Newspaper },
  { text: "Tentang", desc: "Kenali Solit lebih dekat", href: "/tentang", icon: Building2 },
];

export default function ExploreMenu() {
  const navigate = useNavigate();
  const thumbs = DEFAULT_SHOWCASE_IMAGES.map((it) => it.image_url).filter(Boolean);

  const go = (href) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface-muted">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-12">
          <span className="eyebrow">Jelajahi</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
            Semua yang Anda <span className="text-blue-600">Butuhkan</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9rem] md:auto-rows-[10rem] gap-4">
            {LINKS.map((l, i) => {
              const Icon = l.icon;
              const img = thumbs.length ? thumbs[i % thumbs.length] : undefined;
              return (
                <button
                  key={l.text}
                  onClick={() => go(l.href)}
                  className={`group relative overflow-hidden rounded-3xl text-left ring-1 ring-black/5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1
                    ${l.feature ? "col-span-2 row-span-2" : "col-span-1"}`}
                >
                  {/* Background */}
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-blue-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/20 group-hover:from-blue-950/90 transition-colors duration-500" />

                  {/* Icon chip */}
                  <span className={`absolute top-3.5 left-3.5 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white
                    ${l.feature ? "h-12 w-12" : "h-10 w-10"}`}>
                    <Icon className={l.feature ? "w-6 h-6" : "w-5 h-5"} />
                  </span>

                  {/* Arrow */}
                  <span className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className={`font-bold text-white leading-tight ${l.feature ? "text-2xl md:text-3xl" : "text-lg"}`}>
                      {l.text}
                    </h3>
                    <p className={`text-white/70 mt-1 ${l.feature ? "text-sm" : "text-xs"} line-clamp-1`}>
                      {l.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
