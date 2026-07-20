import igImg from "../assets/ig_solit.webp";
import tiktokImg from "../assets/tiktok_solit.webp";
import Reveal from "./ui/Reveal";

export default function SocialMedia() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white text-center">

      {/* Title */}
      <Reveal as="h2" className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-10 md:mb-12">
        Follow <span className="text-blue-600">Social Media</span>
      </Reveal>

      {/* Content */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto">

        {/* Instagram */}
        <Reveal
          as="a"
          delay={0.05}
          href="https://instagram.com/solit.comp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center group w-full sm:w-auto"
        >
          <p className="mb-3 font-medium text-sm sm:text-base text-slate-600">
            Instagram @solit.comp
          </p>

          <img
            src={igImg}
            alt="Instagram"
            className="w-40 sm:w-48 md:w-56 rounded-2xl border border-slate-200 shadow-soft group-hover:scale-105 hover:-translate-y-1 transition duration-300"
          />
        </Reveal>

        {/* TikTok */}
        <Reveal
          as="a"
          delay={0.15}
          href="https://tiktok.com/@solusi_it03"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center group w-full sm:w-auto"
        >
          <p className="mb-3 font-medium text-sm sm:text-base text-slate-600">
            Tiktok @solusi_it03
          </p>

          <img
            src={tiktokImg}
            alt="TikTok"
            className="w-40 sm:w-48 md:w-56 rounded-2xl border border-slate-200 shadow-soft group-hover:scale-105 hover:-translate-y-1 transition duration-300"
          />
        </Reveal>

      </div>
    </section>
  );
}
