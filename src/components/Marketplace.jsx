import shopeeImg from "../assets/shopee_solit.webp";
import tokopediaImg from "../assets/tokopedia_solit.webp";

export default function Marketplace() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center tracking-tight mb-12 md:mb-16">
          Marketplace Kami
        </h2>

        {/* Grid */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-12">
          {/* Shopee */}
          <a
            href="https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03"
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full max-w-md mx-auto transition duration-300 hover:-translate-y-1"
          >
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-4 pb-2 text-center">
                <p className="text-xl font-medium text-gray-800">Shopee</p>
              </div>
              <div className="overflow-hidden">
                <img
                  src={shopeeImg}
                  alt="Kunjungi toko Shopee Solit"
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </a>

          {/* Tokopedia */}
          <a
            href="https://www.tokopedia.com/solit03"
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full max-w-md mx-auto transition duration-300 hover:-translate-y-1"
          >
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-4 pb-2 text-center">
                <p className="text-xl font-medium text-gray-800">Tokopedia</p>
              </div>
              <div className="overflow-hidden">
                <img
                  src={tokopediaImg}
                  alt="Kunjungi toko Tokopedia Solit"
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}