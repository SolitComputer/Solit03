import { siInstagram, siTiktok } from "simple-icons";
import { ArrowUpRight } from "lucide-react";
import igImg from "../assets/ig_solit.webp";
import tiktokImg from "../assets/tiktok_solit.webp";
import Reveal from "./ui/Reveal";

const PLATFORMS = [
  {
    name: "Instagram",
    handle: "@solit.comp",
    href: "https://instagram.com/solit.comp",
    img: igImg,
    icon: siInstagram,
    tint: "#E1306C",
  },
  {
    name: "TikTok",
    handle: "@solusi_it03",
    href: "https://tiktok.com/@solusi_it03",
    img: tiktokImg,
    icon: siTiktok,
    tint: "#111111",
  },
];

export default function SocialMedia() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-12">
          <span className="eyebrow">Komunitas</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
            Follow <span className="text-blue-600">Social Media</span>
          </h2>
          <p className="text-sm md:text-base text-content-muted mt-3 max-w-lg mx-auto">
            Update stok terbaru, promo, dan tips seputar laptop setiap hari.
          </p>
        </Reveal>

        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-5 md:gap-6">
          {PLATFORMS.map((p, i) => (
            <Reveal
              key={p.name}
              as="a"
              delay={0.05 + i * 0.1}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block flex-1"
            >
              <div className="card-3d overflow-hidden h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: p.tint }}
                  >
                    <svg role="img" viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
                      <path d={p.icon.path} />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-content leading-tight">{p.name}</p>
                    <p className="text-xs text-content-muted truncate">{p.handle}</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Preview image */}
                <div className="overflow-hidden border-t border-border/70">
                  <img
                    src={p.img}
                    alt={`${p.name} Solit 03`}
                    className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
