import igImg from "../assets/ig_solit.webp";
import tiktokImg from "../assets/tiktok_solit.webp";

export default function SocialMedia() {
  return (
    <section className="px-4 sm:px-6 py-10 md:py-12 bg-gray-50 text-center">
      
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 mb-6 md:mb-8">
        Follow Social Media
      </h2>

      {/* Content */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto">
        
        {/* Instagram */}
        <a 
          href="https://instagram.com/solit.comp" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center group w-full sm:w-auto"
        >
          <p className="mb-3 font-medium text-xs sm:text-sm text-gray-700">
            Instagram @solit.comp
          </p>

          <img
            src={igImg}
            alt="Instagram"
            className="w-40 sm:w-48 md:w-56 rounded-xl shadow-md group-hover:scale-105 group-hover:shadow-lg hover:-translate-y-1 transition duration-300"
          />
        </a>

        {/* TikTok */}
        <a 
          href="https://tiktok.com/@solusi_it03" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center group w-full sm:w-auto"
        >
          <p className="mb-3 font-medium text-xs sm:text-sm text-gray-700">
            Tiktok @solusi_it03
          </p>

          <img
            src={tiktokImg}
            alt="TikTok"
            className="w-40 sm:w-48 md:w-56 rounded-xl shadow-md group-hover:scale-105 group-hover:shadow-lg hover:-translate-y-1 transition duration-300"
          />
        </a>

      </div>
    </section>
  );
}