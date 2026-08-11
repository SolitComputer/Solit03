import {
  siAsus, siAcer, siDell, siLenovo, siApple,
  siSamsung, siRazer, siToshiba, siHuawei, siXiaomi, siIntel,
} from "simple-icons";
import LogoLoop from "./ui/LogoLoop";
import Reveal from "./ui/Reveal";

/**
 * BrandMarquee — "trust bar" berisi logo brand laptop yang berjalan mulus.
 * Logo diambil dari simple-icons (monokrom, mewarna saat hover).
 */
const BRANDS = [
  siAsus, siAcer, siDell, siLenovo, siApple,
  siSamsung, siRazer, siToshiba, siHuawei, siXiaomi, siIntel,
];

const LOGOS = BRANDS.map((b) => ({
  title: b.title,
  node: (
    <svg role="img" viewBox="0 0 24 24" width={32} height={32} fill="currentColor" aria-hidden="true">
      <path d={b.path} />
    </svg>
  ),
}));

export default function BrandMarquee() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-20 bg-surface-muted">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-8 md:mb-10">
          <span className="eyebrow">Brand Tepercaya</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-content mt-4">
            Ratusan Unit dari <span className="text-blue-600">Brand Ternama</span>
          </h2>
        </Reveal>

        <LogoLoop logos={LOGOS} logoHeight={32} gap={56} duration={34} />
      </div>
    </section>
  );
}
