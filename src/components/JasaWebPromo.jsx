import { Link } from "react-router-dom";
import { Code2, ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./ui/Reveal";
import CursorSpotlight from "./ui/CursorSpotlight";

export default function JasaWebPromo() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-surface">
      <Reveal className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-white/10 shadow-soft-lg">
          <CursorSpotlight color="rgba(59,130,246,0.2)" size={520} />
          <div className="absolute inset-0 ds-starfield opacity-40 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10 px-6 py-10 md:px-12 md:py-14">
            <div className="hidden md:flex w-16 h-16 shrink-0 rounded-2xl bg-blue-500/15 border border-blue-400/30 items-center justify-center">
              <Code2 className="w-8 h-8 text-blue-300" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                <Sparkles className="w-3 h-3" />
                Layanan Baru
              </span>
              <h2 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-white">
                Butuh Website atau Aplikasi Custom untuk Bisnis Anda?
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-300/90 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Solit03 juga melayani jasa pembuatan Landing Page, Company
                Profile, hingga Sistem POS custom — dibangun dengan standar
                industri untuk performa maksimal.
              </p>
            </div>

            <Link
              to="/jasa-pembuatan-website"
              className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Lihat Layanan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
