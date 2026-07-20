import { Calendar, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import CountUp from "./ui/CountUp";
import Reveal from "./ui/Reveal";

/**
 * StatsStrip — baris statistik dengan angka count-up.
 * Metrik dipilih berdasarkan selling value tertinggi untuk target market:
 *  - Tahun solusi IT (kredibilitas), pelanggan puas (social proof),
 *    tahap uji performa (kualitas), % bergaransi (risk management).
 */
const STATS = [
  { icon: Calendar, to: 5, suffix: "+", label: "Tahun Solusi IT" },
  { icon: Users, to: 1000, suffix: "+", label: "Pelanggan Puas" },
  { icon: ShieldCheck, to: 15, suffix: "+", label: "Tahap Uji Performa" },
  { icon: CheckCircle2, to: 100, suffix: "%", label: "Bergaransi Resmi" },
];

export default function StatsStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="text-center rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-6 md:py-8 hover:border-blue-200 transition-colors"
          >
            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <s.icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              <CountUp to={s.to} suffix={s.suffix} />
            </div>
            <p className="mt-1.5 text-xs md:text-sm text-slate-500 font-medium">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
