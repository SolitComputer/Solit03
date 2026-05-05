import igImg from "../assets/ig_solit.webp";
import tiktokImg from "../assets/tiktok_solit.webp";

export default function SocialMedia() {
  return (
    <section className="px-12 py-20 bg-gray-50 text-center">
      
      {/* Title */}
      <h2 className="text-3xl font-semibold text-blue-900 mb-16">
        Follow Social Media
      </h2>

      {/* Content */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-16">
        
        {/* Instagram */}
        <a 
          href="https://instagram.com/solit.comp" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center group"
        >
          <p className="mb-6 font-medium text-lg">
            Instagram @solit.comp
          </p>

          <img
            src={igImg}
            alt="Instagram"
            className="w-[250px] rounded-3xl shadow-lg group-hover:scale-105 group-hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          />
        </a>

        {/* TikTok */}
        <a 
          href="https://tiktok.com/@solusi_it03" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center group"
        >
          <p className="mb-6 font-medium text-lg">
            Tiktok @solusi_it03
          </p>

          <img
            src={tiktokImg}
            alt="TikTok"
            className="w-[250px] rounded-3xl shadow-lg group-hover:scale-105 group-hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          />
        </a>

      </div>

    </section>
  );
}