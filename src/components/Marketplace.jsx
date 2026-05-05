import shopeeImg from "../assets/shopee_solit.webp";
import tokopediaImg from "../assets/tokopedia_solit.webp";

export default function Marketplace() {
  return (
    <section className="px-12 py-20 bg-gray-50 text-center">
      
      {/* Title */}
      <h2 className="text-3xl font-semibold text-blue-900 mb-16">
        Marketplace Kami
      </h2>

      {/* Grid */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-16">
        
        {/* Shopee */}
        <a
          href="https://shopee.co.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <p className="mb-6 text-xl font-semibold text-blue-900">
            Shopee
          </p>

          <div className="rounded-3xl overflow-hidden transition duration-300 group-hover:-translate-y-2">
            <img
              src={shopeeImg}
              alt="Shopee"
              className="w-[500px] object-cover"
            />
          </div>
        </a>

        {/* Tokopedia */}
        <a
          href="https://tokopedia.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <p className="mb-6 text-xl font-semibold text-blue-900">
            Tokopedia
          </p>

          <div className="rounded-3xl overflow-hidden transition duration-300 group-hover:-translate-y-2">
            <img
              src={tokopediaImg}
              alt="Tokopedia"
              className="w-[500px] object-cover"
            />
          </div>
        </a>

      </div>

    </section>
  );
}