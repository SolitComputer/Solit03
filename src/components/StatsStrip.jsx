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
      <Reveal>
        {/* Satu strip menyatu, border gradasi tipis biru→cyan */}
        <div className="max-w-5xl mx-auto rounded-[1.75rem] p-[1.5px] bg-gradient-to-br from-blue-300/50 to-cyan-300/50 shadow-soft">
          <div className="overflow-hidden rounded-[1.65rem] grid grid-cols-2 md:grid-cols-4 gap-px bg-border/70">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="group px-5 py-7 md:py-9 flex flex-col items-center text-center bg-surface-muted/70 dark:bg-slate-800/60 backdrop-blur-sm transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
              >
                <div className="w-12 h-12 mb-3.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-blue-600 group-hover:text-white">
                  <s.icon className="w-5.5 h-5.5" aria-hidden="true" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-content">
                  <RollingCounter to={s.to} suffix={s.suffix} />
                </div>
                <p className="mt-1.5 text-xs md:text-sm text-content-muted font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
