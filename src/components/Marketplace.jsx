import shopeeImg from "../assets/shopee_solit.webp";
import tokopediaImg from "../assets/tokopedia_solit.webp";

export default function Marketplace() {
  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center tracking-tight mb-6 md:mb-8">
          Marketplace Kami
        </h2>

        {/* Grid */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-5 md:gap-6 max-w-4xl mx-auto">
          {/* Shopee */}
          <a
            href="https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03"
            target="_blank"
            rel="noopener noreferrer"
            className="group block flex-1 transition duration-300 hover:-translate-y-0.5"
          >
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-2.5 pb-1 text-center">
                <p className="text-sm font-medium text-gray-800">Shopee</p>
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
          </a>

          {/* Tokopedia */}
          <a
            href="https://www.tokopedia.com/solit03"
            target="_blank"
            rel="noopener noreferrer"
            className="group block flex-1 transition duration-300 hover:-translate-y-0.5"
          >
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-2.5 pb-1 text-center">
                <p className="text-sm font-medium text-gray-800">Tokopedia</p>
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
          </a>
        </div>
      </div>
    </section>
  );
}