import { ArrowUpRight } from "lucide-react";
import shopeeImg from "../assets/shopee_solit.webp";
import tokopediaImg from "../assets/tokopedia_solit.webp";
import Reveal from "./ui/Reveal";

export default function Marketplace() {
  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <Reveal className="text-center mb-10 md:mb-12">
          <span className="eyebrow">Belanja Online</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-content tracking-tight mt-5">
            Marketplace <span className="text-blue-600">Kami</span>
          </h2>
          <p className="text-sm md:text-base text-content-muted mt-3 max-w-xl mx-auto">
            Transaksi lebih aman &amp; nyaman lewat toko resmi kami.
          </p>
        </Reveal>

        {/* Grid */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-5 md:gap-6 max-w-4xl mx-auto">
          {/* Shopee */}
          <Reveal
            as="a"
            delay={0.05}
            href="https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03"
            target="_blank"
            rel="noopener noreferrer"
            className="group block flex-1"
          >
            <div className="card-3d overflow-hidden h-full">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-base sm:text-lg font-semibold text-content">
                  Shopee
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="overflow-hidden">
                <img
                  src={shopeeImg}
                  alt="Kunjungi toko Shopee Solit"
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          {/* Tokopedia */}
          <Reveal
            as="a"
            delay={0.15}
            href="https://www.tokopedia.com/solit03"
            target="_blank"
            rel="noopener noreferrer"
            className="group block flex-1"
          >
            <div className="card-3d overflow-hidden h-full">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-base sm:text-lg font-semibold text-content">
                  Tokopedia
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="overflow-hidden">
                <img
                  src={tokopediaImg}
                  alt="Kunjungi toko Tokopedia Solit"
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}