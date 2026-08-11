import { Calendar, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import RollingCounter from "./ui/RollingCounter";
import Reveal from "./ui/Reveal";

/**
 * StatsStrip — baris statistik dengan angka menggulung (RollingCounter).
 * Metrik dipilih berdasarkan selling value tertinggi untuk target market:
 *  - Tahun solusi IT (kredibilitas), pelanggan puas (social proof),
 *    tahap uji performa (kualitas), % bergaransi (risk management).
 *
 * Kartu memakai border gradasi biru→cyan yang RATA di semua sisi (statis, halus)
 * agar terasa premium tanpa terlihat "belang" seperti border berputar.
 */
const STATS = [
  { icon: Calendar, to: 5, suffix: "+", label: "Tahun Solusi IT" },
  { icon: Users, to: 1000, suffix: "+", label: "Pelanggan Puas" },
  { icon: ShieldCheck, to: 15, suffix: "+", label: "Tahap Uji Performa" },
  { icon: CheckCircle2, to: 100, suffix: "%", label: "Bergaransi Resmi" },
];

export default function StatsStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-20 bg-surface">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="h-full">
            {/* Border gradasi rata di seluruh tepi (trik padding + gradient) */}
            <div className="group h-full rounded-2xl p-[1.5px] bg-gradient-to-br from-blue-300/60 to-cyan-300/60 hover:from-blue-500 hover:to-cyan-400 shadow-soft-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="h-full rounded-[15px] bg-surface-muted/70 px-4 py-6 md:py-8 text-center">
                <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-100">
                  <s.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-content">
                  <RollingCounter to={s.to} suffix={s.suffix} />
                </div>
                <p className="mt-1.5 text-xs md:text-sm text-content-muted font-medium">
                  {s.label}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
