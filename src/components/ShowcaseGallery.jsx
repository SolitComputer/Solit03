import RollingGallery from "./ui/RollingGallery";
import Reveal from "./ui/Reveal";
import { DEFAULT_SHOWCASE_IMAGES } from "../utils/defaultShowcaseImages";

/**
 * ShowcaseGallery — galeri 3D foto laptop pilihan (RollingGallery).
 * Sumber foto: aset laptop showcase. Sembunyi bila tak ada foto.
 */
export default function ShowcaseGallery() {
  const images = DEFAULT_SHOWCASE_IMAGES.map((it) => it.image_url).filter(Boolean);
  if (!images.length) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-14">
          <span className="eyebrow">Galeri</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
            Koleksi <span className="text-blue-600">Laptop Pilihan</span>
          </h2>
          <p className="text-sm md:text-base text-content-muted mt-4 max-w-2xl mx-auto">
            Geser untuk menjelajah — setiap unit lolos quality control sebelum sampai ke tangan Anda.
          </p>
        </Reveal>
      </div>

      <RollingGallery images={images} />
    </section>
  );
}
