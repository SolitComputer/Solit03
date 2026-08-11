import { useNavigate } from "react-router-dom";
import FlowingMenu from "./ui/FlowingMenu";
import Reveal from "./ui/Reveal";
import { DEFAULT_SHOWCASE_IMAGES } from "../utils/defaultShowcaseImages";

/**
 * ExploreMenu — navigasi besar "Jelajahi" memakai FlowingMenu.
 * Setiap item menuju halaman utama; thumbnail diambil dari aset showcase.
 */
const LINKS = [
  { text: "Katalog", href: "/katalog" },
  { text: "Jual-Beli", href: "/jual-beli" },
  { text: "Jasa Web", href: "/jasa-pembuatan-website" },
  { text: "Berita", href: "/berita" },
  { text: "Tentang", href: "/tentang" },
];

export default function ExploreMenu() {
  const navigate = useNavigate();
  const thumbs = DEFAULT_SHOWCASE_IMAGES.map((it) => it.image_url).filter(Boolean);

  const items = LINKS.map((l, i) => ({
    text: l.text,
    href: l.href,
    image: thumbs.length ? thumbs[i % thumbs.length] : undefined,
    onClick: () => {
      navigate(l.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  }));

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface-muted">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-8 md:mb-10">
          <span className="eyebrow">Jelajahi</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
            Semua yang Anda <span className="text-blue-600">Butuhkan</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <FlowingMenu items={items} accent="#2563eb" />
        </Reveal>
      </div>
    </section>
  );
}
