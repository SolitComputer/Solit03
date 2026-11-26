import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Wrench, Clock, Package, Check, Maximize2, Truck, User, Monitor, MessageSquare, X } from "lucide-react";
import { Helmet } from "react-helmet-async";

const POS_BASE = "https://pos.solit.id";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const SERVICE_URL = `${POS_BASE}/api/service/public`;
const PREP_URL = `${POS_BASE}/api/preparation/public`;

const SLIDE_MS_PREP = 15_000;  // durasi slide Penyiapan Barang (15 detik)
const SLIDE_MS_SVC  = 10_000;  // durasi slide Service (10 detik)
const PER_PAGE = 5;        // customer per panel per slide

// ── Teks berjalan di bawah Mode Display ──
const RUNNING_TEXT = [
  "SOLIT 03 — Jual Beli & Service Laptop Second Terpercaya di Depok",
  "Buka Setiap Hari 08.00–23.00 WIB (khusus Selasa mulai 10.00)",
  "Alamat: Kav Adikarya No.77, Rangkapan Jaya, Pancoran Mas, Depok 16435",
  "WhatsApp: 0852-1064-7047",
  "Garansi Resmi • Laptop Second  • Harga Murah",
].join("   •   ");

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(t);
  }, [tickMs]);
  return now;
}

function ms(iso) { return iso ? new Date(iso).getTime() : null; }

function formatDurasi(v) {
  if (v == null || !Number.isFinite(v) || v < 0) return null;
  const totalSec = Math.floor(v / 1000);
  const totalHours = totalSec / 3600;

  // ≥ 24 jam → tampilkan dalam hari
  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    return `${days} Hari`;
  }

  const j = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const d = totalSec % 60;
  return j > 0 ? `${j}j ${m}m ${d}d` : `${m}m ${d}d`;
}

function formatJam(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", ".");
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ═══════════════════════════════════════════
// NORMALISASI DATA → KARTU
// ═══════════════════════════════════════════

const PREP_STEP = { MENUNGGU: 0, DIPROSES: 1, SIAP_KIRIM: 2 };
const SVC_STEP = { ANTRIAN: 0, SEDANG_DIKERJAKAN: 1, MENUNGGU_SPAREPART: 1, DONE: 2 };

function normPrep(o, now) {
  const step = PREP_STEP[o.status] ?? 0;
  const t1 = ms(o.tanggal_masuk), t2 = ms(o.tanggal_diproses), t3 = ms(o.tanggal_selesai);
  const chips = o.spek ? [o.spek.cpu, o.spek.ram, o.spek.storage].filter(Boolean) : [];
  return {
    key: `p-${o.order_number}`,
    source: "prep",
    orderNo: o.order_number,
    nama: o.nama,
    device: o.type_barang || "—",
    chips,
    subtitle: `${o.qty} unit`,
    step,
    step2Name: o.disiapkan_oleh,
    sortTs: t1 ?? 0,
    labels: ["Menunggu disiapkan", "Disiapkan", "Selesai"],
    dur1: t1 != null ? (t2 ?? now) - t1 : null,
    dur2: t2 != null ? (t3 ?? now) - t2 : null,
    doneTime: o.tanggal_selesai,
    catatan: o.catatan_progres || o.catatan || null,
  };
}

function normSvc(o, now) {
  const step = SVC_STEP[o.status] ?? 0;
  const t1 = ms(o.tanggal_masuk), t2 = ms(o.tanggal_mulai), t3 = ms(o.tanggal_selesai);
  return {
    key: `s-${o.no_urut}`,
    source: "service",
    orderNo: `#${o.no_urut}`,
    nama: o.nama,
    device: o.type_laptop || "—",
    chips: [],
    subtitle: o.keluhan || null,
    step,
    step2Name: o.teknisi,
    sortTs: t1 ?? 0,
    labels: ["Menunggu dikerjakan", "Dikerjakan", "Selesai"],
    dur1: t1 != null ? (t2 ?? now) - t1 : null,
    dur2: t2 != null ? (t3 ?? now) - t2 : null,
    doneTime: o.tanggal_selesai,
    catatan: o.catatan_progres || o.catatan || null,
  };
}

// ═══════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════

const STEP_STYLE = [
  { bar: "#EF9F27", badgeBg: "bg-amber-50 dark:bg-amber-900/30", badgeText: "text-amber-700 dark:text-amber-300", icon: Clock },
  { bar: "#2391FF", badgeBg: "bg-blue-50 dark:bg-[#2391FF]/15", badgeText: "text-[#2391FF] dark:text-blue-300", icon: Package },
  { bar: "#1D9E75", badgeBg: "bg-emerald-50 dark:bg-emerald-900/30", badgeText: "text-emerald-700 dark:text-emerald-300", icon: Check },
];

// ═══════════════════════════════════════════
// DOT PROGRESS
// ═══════════════════════════════════════════

function Dot({ state, big = false }) {
  const size = big ? "w-5 h-5" : "w-[18px] h-[18px]";
  const iconSize = big ? 11 : 10;
  const cls = {
    done: "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30",
    active1: "bg-amber-500 ring-4 ring-amber-500/20 animate-pulse",
    active2: "bg-[#2391FF] ring-4 ring-[#2391FF]/20 animate-pulse",
    active3: "bg-emerald-500 ring-4 ring-emerald-500/20 text-white",
    pending: "bg-surface border-2 border-slate-300 dark:border-slate-600",
  }[state];
  return (
    <div className={`${size} rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>
      {(state === "done" || state === "active3") && <Check size={iconSize} />}
    </div>
  );
}

function dotState(step, i) {
  if (i < step) return "done";
  if (i === step) return ["active1", "active2", "active3"][i];
  return "pending";
}

function lineColor(step, i) {
  return i < step ? (step === 2 ? "bg-emerald-500" : "bg-[#2391FF]") : "bg-slate-200 dark:bg-slate-700";
}

// ═══════════════════════════════════════════
// KARTU — MODE NORMAL (tetap sama)
// ═══════════════════════════════════════════

function PhaseCard({ n }) {
  const st = STEP_STYLE[n.step] ?? STEP_STYLE[0];
  const Icon = st.icon;
  const badgeDur =
    n.step === 0 ? formatDurasi(n.dur1) :
      n.step === 1 ? formatDurasi(n.dur2) :
        formatJam(n.doneTime);
  const badgeLabel = n.labels[n.step];

  return (
    <div className="group relative bg-white/80 dark:bg-[#0F2341]/60 backdrop-blur-sm border border-slate-200/80 dark:border-[#2391FF]/15 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(35,145,255,0.1)] hover:-translate-y-1 hover:border-[#2391FF]/30 dark:hover:border-[#2391FF]/40 transition-all duration-300 ease-out">
      <div style={{ height: 4, background: `linear-gradient(90deg, ${st.bar}, ${st.bar}88)` }} />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-xs font-bold text-[#2391FF] bg-[#2391FF]/8 dark:bg-[#2391FF]/15 px-2.5 py-1 rounded-lg tracking-wide">{n.orderNo}</span>
          <span className={`inline-flex items-center gap-1.5 ${st.badgeBg} ${st.badgeText} text-xs font-bold px-3 py-1.5 rounded-full`}>
            <Icon size={13} /> {badgeLabel}{badgeDur ? ` · ${badgeDur}` : ""}
          </span>
        </div>
        <p className="font-extrabold text-content leading-tight text-base sm:text-lg tracking-tight">{n.nama}</p>
        <p className="text-sm text-content-soft dark:text-slate-300 mt-1 truncate">
          {n.device}{n.subtitle ? <span className="text-content-muted dark:text-slate-400"> · {n.subtitle}</span> : null}
        </p>
        {n.chips.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2.5">
            {n.chips.map((c, i) => (
              <span key={i} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${["bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"][i % 3]}`}>{c}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-3.5">
          <Dot state={dotState(n.step, 0)} />
          <div className={`flex-1 h-[3px] rounded-full ${lineColor(n.step, 0)}`} />
          <Dot state={dotState(n.step, 1)} />
          <div className={`flex-1 h-[3px] rounded-full ${lineColor(n.step, 1)}`} />
          <Dot state={dotState(n.step, 2)} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className={`text-[11px] ${n.step >= 0 ? "text-content font-semibold" : "text-content-muted"}`}>{n.labels[0]}</span>
          <span className={`text-[11px] ${n.step >= 1 ? "text-[#2391FF] dark:text-blue-400 font-semibold" : "text-content-muted"} truncate px-1`}>
            {n.step2Name ? `oleh ${n.step2Name}` : n.labels[1]}
          </span>
          <span className={`text-[11px] ${n.step >= 2 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-content-muted"}`}>{n.labels[2]}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// KARTU — MODE DISPLAY: PANEL KIRI (BESAR)
// ═══════════════════════════════════════════

function BigCard({ n }) {
  const st = STEP_STYLE[n.step] ?? STEP_STYLE[0];
  const Icon = st.icon;

  const statusColor =
    n.step === 0 ? "text-amber-600 dark:text-amber-400"
      : n.step === 1 ? "text-[#2391FF]"
        : "text-emerald-600 dark:text-emerald-400";

  const dotGradient =
    n.step === 0 ? "from-amber-400 to-amber-500"
      : n.step === 1 ? "from-[#2391FF] to-blue-500"
        : "from-emerald-400 to-emerald-500";

  const badgeDur =
    n.step === 0 ? formatDurasi(n.dur1) :
      n.step === 1 ? formatDurasi(n.dur2) :
        formatJam(n.doneTime);

  const catatanLines = n.catatan
    ? n.catatan.split(/\n|;|,/).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="h-full w-full flex flex-col">
      {/* ═══ MAIN CONTENT: Left info + Right timeline ═══ */}
      <div className="flex-1 flex gap-8 xl:gap-12 min-h-0">

        {/* ─── LEFT: Customer info ─── */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">

          {/* Nama Customer */}
          <div className="mb-6 xl:mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <User size={16} className="text-[#2391FF]/60 dark:text-[#2391FF]/50" />
              <p className="text-xs xl:text-sm text-[#2391FF]/60 dark:text-[#2391FF]/50 font-bold tracking-[0.25em] uppercase">
                Nama Customer
              </p>
            </div>
            <p className="text-5xl xl:text-6xl 2xl:text-7xl font-black text-slate-800 dark:text-white tracking-tight leading-[1.05]">
              {n.nama}
            </p>
          </div>

          {/* Tipe Barang / Laptop */}
          <div className="pb-5 xl:pb-6 mb-5 xl:mb-6 border-b border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5 mb-3">
              <Monitor size={16} className="text-[#2391FF]/60 dark:text-[#2391FF]/50" />
              <p className="text-xs xl:text-sm text-[#2391FF]/60 dark:text-[#2391FF]/50 font-bold tracking-[0.25em] uppercase">
                {n.source === "prep" ? "Tipe Barang" : "Tipe Laptop"}
              </p>
            </div>
            <p className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-slate-700 dark:text-white/90 leading-snug">
              {n.device}
            </p>
          </div>

          {/* Keluhan (service) or Spesifikasi (prep) */}
          {n.source === "service" && n.subtitle ? (
            <div className="pb-5 xl:pb-6 mb-5 xl:mb-6 border-b border-slate-200/60 dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-3">
                <MessageSquare size={16} className="text-[#2391FF]/60 dark:text-[#2391FF]/50" />
                <p className="text-xs xl:text-sm text-[#2391FF]/60 dark:text-[#2391FF]/50 font-bold tracking-[0.25em] uppercase">Keluhan</p>
              </div>
              <p className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-slate-700 dark:text-white/80 leading-snug">{n.subtitle}</p>
            </div>
          ) : n.chips.length > 0 ? (
            <div className="pb-5 xl:pb-6 mb-5 xl:mb-6 border-b border-slate-200/60 dark:border-white/[0.06]">
              <p className="text-xs xl:text-sm text-[#2391FF]/60 dark:text-[#2391FF]/50 font-bold tracking-[0.25em] uppercase mb-4">Spesifikasi</p>
              <div className="flex gap-3 flex-wrap">
                {n.chips.map((c, ci) => (
                  <span key={ci} className={`text-lg xl:text-xl 2xl:text-2xl font-bold px-5 py-2.5 rounded-xl ${
                    ["bg-[#2391FF]/10 text-[#2391FF] border border-[#2391FF]/15 dark:border-[#2391FF]/20",
                     "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
                     "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"][ci % 3]
                  }`}>{c}</span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Catatan Progres */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <MessageSquare size={16} className="text-[#2391FF]/60 dark:text-[#2391FF]/50" />
              <p className="text-xs xl:text-sm text-[#2391FF]/60 dark:text-[#2391FF]/50 font-bold tracking-[0.25em] uppercase">Catatan Progres</p>
            </div>
            {catatanLines.length > 0 ? (
              <div className="space-y-3">
                {catatanLines.map((line, li) => (
                  <div key={li} className="flex gap-4 items-start">
                    <span className="shrink-0 w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-[#2391FF] to-blue-600 flex items-center justify-center shadow-lg shadow-[#2391FF]/20">
                      <span className="text-white font-black text-sm xl:text-base">{li + 1}</span>
                    </span>
                    <p className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-slate-700 dark:text-white/80 leading-snug pt-0.5">{line}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-2xl xl:text-3xl font-bold text-slate-200 dark:text-white/15">— Belum ada catatan</p>
            )}
          </div>
        </div>

        {/* ─── RIGHT: Status timeline in card ─── */}
        <div className="shrink-0 w-64 xl:w-80 2xl:w-[22rem] flex flex-col justify-center">
          <div className="bg-slate-50/90 dark:bg-white/[0.04] backdrop-blur-sm rounded-3xl p-7 xl:p-9 border border-slate-200/60 dark:border-white/[0.06] shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <p className="text-xs xl:text-sm font-bold tracking-[0.3em] text-[#2391FF]/50 dark:text-[#2391FF]/40 uppercase mb-7 xl:mb-9">Progress</p>
            <div className="flex flex-col">
              {n.labels.map((lbl, si) => {
                const isDone = si < n.step;
                const isCurrent = si === n.step;
                const stepDur = si === 0 ? formatDurasi(n.dur1) : si === 1 ? formatDurasi(n.dur2) : formatJam(n.doneTime);
                return (
                  <div key={si}>
                    <div className="flex items-start gap-4">
                      {/* Dot */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-7 h-7 xl:w-8 xl:h-8 rounded-full shrink-0 flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                            : isCurrent
                              ? `bg-gradient-to-br ${dotGradient} ring-[3px] ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0A1628] shadow-lg`
                              : "bg-slate-200 dark:bg-white/10"
                        }`} style={isCurrent ? { ringColor: st.bar + '30' } : undefined}>
                          {isDone && <Check size={16} className="text-white" strokeWidth={3} />}
                          {isCurrent && <div className="w-3 h-3 rounded-full bg-white animate-pulse" />}
                        </div>
                      </div>
                      {/* Label + durasi */}
                      <div className="flex-1 min-w-0 -mt-0.5">
                        <p className={`text-xl xl:text-2xl font-bold leading-snug ${
                          isCurrent ? statusColor : isDone ? "text-emerald-500 dark:text-emerald-400" : "text-slate-300 dark:text-white/20"
                        }`}>{lbl}</p>
                        {(isCurrent || isDone) && stepDur && (
                          <span className={`inline-block text-sm xl:text-base font-bold tabular-nums mt-2 px-3 py-1 rounded-lg ${
                            isDone ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                   : n.step === 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                   : n.step === 1 ? "bg-[#2391FF]/10 text-[#2391FF]"
                                   : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/40"
                          }`}>{stepDur}</span>
                        )}
                        {isCurrent && n.step2Name && (
                          <p className="text-base xl:text-lg text-slate-400 dark:text-white/50 font-semibold mt-1.5">oleh {n.step2Name}</p>
                        )}
                      </div>
                    </div>
                    {/* Connecting line */}
                    {si < n.labels.length - 1 && (
                      <div className="flex items-stretch ml-[13px] xl:ml-[15px]">
                        <div className={`w-[2px] min-h-[36px] xl:min-h-[44px] my-2 rounded-full transition-colors ${isDone ? "bg-emerald-400/60" : "bg-slate-200 dark:bg-white/[0.06]"}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// HOOK — TEXT-TO-SPEECH (SUARA AI)
// ═══════════════════════════════════════════

function useTTS() {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [unlocked, setUnlocked] = useState(false);

  const queueRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const prevMapRef = useRef(null); // null = belum ada data awal, skip announce
  const volumeRef = useRef(volume);
  const chimeRef = useRef(null); // audio notifikasi "ding" sebelum suara AI

  useEffect(() => { volumeRef.current = volume; }, [volume]);

  // Inisialisasi audio chime (sound_antrian.mp3 di /public)
  useEffect(() => {
    const audio = new Audio("/sound_antrian.mp3");
    audio.preload = "auto";
    audio.volume = volume;
    audio.addEventListener("canplaythrough", () => {
      console.log("[chime] file berhasil di-load, siap diputar ✅");
    });
    audio.addEventListener("error", () => {
      console.error(
        "[chime] FILE GAGAL DI-LOAD. Kemungkinan: file tidak ada di /public/sound_antrian.mp3, atau nama file beda huruf besar/kecil. Error code:", audio.error?.code
      );
    });
    chimeRef.current = audio;
    return () => {
      try { audio.pause(); } catch { }
      chimeRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume ke chime kalau user geser slider
  useEffect(() => {
    if (chimeRef.current) chimeRef.current.volume = volume;
  }, [volume]);

  // Unlock audio context via user gesture (TTS + chime)
  const unlock = useCallback(() => {
    if (typeof speechSynthesis === "undefined") return;
    const u = new SpeechSynthesisUtterance(" ");
    u.lang = "id-ID";
    u.volume = 0;
    speechSynthesis.speak(u);

    // Unlock HTMLAudioElement juga — play volume 0 lalu pause
    const audio = chimeRef.current;
    if (audio) {
      const prevVol = audio.volume;
      audio.volume = 0;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = prevVol;
      }).catch(() => {
        audio.volume = prevVol;
      });
    }

    setUnlocked(true);
  }, []);

  // Mainkan chime "sound_antrian.mp3", resolve setelah selesai (atau gagal)
  const playChime = useCallback(() => {
    return new Promise((resolve) => {
      const audio = chimeRef.current;
      if (!audio) {
        console.warn("[chime] chimeRef kosong — audio belum terinisialisasi");
        resolve();
        return;
      }
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = volumeRef.current;
      } catch (e) {
        console.warn("[chime] gagal reset audio:", e);
      }
      const done = () => {
        audio.removeEventListener("ended", done);
        audio.removeEventListener("error", done);
        resolve();
      };
      audio.addEventListener("ended", () => {
        console.log("[chime] selesai main normal ✅");
        done();
      }, { once: true });
      audio.addEventListener("error", () => {
        console.error("[chime] GAGAL load/play. Error code:", audio.error?.code, "src:", audio.src);
        done();
      }, { once: true });
      audio.play()
        .then(() => console.log("[chime] play() sukses, sedang berbunyi..."))
        .catch((err) => {
          console.error("[chime] play() DITOLAK browser:", err?.name, err?.message);
          done();
        });
    });
  }, []);

  // Hentikan semuanya sekaligus
  const stopAll = useCallback(() => {
    queueRef.current = [];
    isSpeakingRef.current = false;
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    const audio = chimeRef.current;
    if (audio) {
      try { audio.pause(); audio.currentTime = 0; } catch { }
    }
  }, []);

  const processQueue = useCallback(async () => {
    if (isSpeakingRef.current || queueRef.current.length === 0) return;
    if (typeof speechSynthesis === "undefined") return;

    isSpeakingRef.current = true;
    const { text, withChime } = queueRef.current.shift();

    if (withChime) {
      await playChime();
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.volume = volumeRef.current;
    u.rate = 0.95;

    const voices = speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang === "id-ID" || v.lang.startsWith("id"));
    if (idVoice) u.voice = idVoice;

    u.onend = () => { isSpeakingRef.current = false; processQueue(); };
    u.onerror = () => { isSpeakingRef.current = false; processQueue(); };
    speechSynthesis.speak(u);
  }, [playChime]);

  const enqueue = useCallback((text, withChime = true) => {
    queueRef.current.push({ text, withChime });
    processQueue();
  }, [processQueue]);

  const detectChanges = useCallback(
    (prepCards, svcCards) => {
      if (!enabled || !unlocked) return;

      const allCards = [...prepCards, ...svcCards];
      const newMap = new Map();
      allCards.forEach((c) => newMap.set(c.key, c.step));

      if (prevMapRef.current === null) {
        prevMapRef.current = newMap;
        return;
      }

      prepCards.forEach((c) => {
        const prev = prevMapRef.current.get(c.key);
        if (prev !== undefined && prev !== c.step) {
          enqueue(
            `Perhatian, update penyiapan barang. Atas nama ${c.nama}, perangkat ${c.device}, barang anda ${c.step === 2 ? 'sudah diselesaikan' : `sedang ${c.labels[c.step]}`}.`
          );
        }
      });
      svcCards.forEach((c) => {
        const prev = prevMapRef.current.get(c.key);
        if (prev !== undefined && prev !== c.step) {
          enqueue(
            `Perhatian, update servis. Atas nama ${c.nama}, perangkat ${c.device}, barang anda ${c.step === 2 ? 'sudah diselesaikan' : `sedang ${c.labels[c.step]}`}.`
          );
        }
      });

      allCards.forEach((c) => {
        if (!prevMapRef.current.has(c.key)) {
          const srcLabel = c.source === "prep" ? "penyiapan barang" : "servis";
          enqueue(
            `${srcLabel === "penyiapan barang" ? "Penyiapan barang" : "Servis"} baru masuk. Customer ${c.nama}, laptop ${c.device}.`
          );
        }
      });

      prevMapRef.current = newMap;
    },
    [enabled, unlocked, enqueue]
  );

  useEffect(() => {
    if (enabled && unlocked) {
      prevMapRef.current = null;
    }
  }, [enabled, unlocked]);

  const isSpeaking = useCallback(() => isSpeakingRef.current || queueRef.current.length > 0, []);

  return { enabled, setEnabled, volume, setVolume, unlock, unlocked, detectChanges, enqueue, isSpeaking, stopAll };
}

// ═══════════════════════════════════════════
// HOOKS — DATA FETCHING
// ═══════════════════════════════════════════

function useServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null), fbRef = useRef(null), rcRef = useRef(null);

  const startPoll = useCallback(() => {
    const poll = async () => {
      try { const r = await fetch(SERVICE_URL); const j = await r.json(); if (j.success) setOrders(j.data ?? []); } catch { }
    };
    poll(); fbRef.current = setInterval(poll, 15_000);
  }, []);
  const stopPoll = useCallback(() => { if (fbRef.current) { clearInterval(fbRef.current); fbRef.current = null; } }, []);

  const connect = useCallback(() => {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    clearTimeout(rcRef.current);
    if (!fbRef.current) startPoll();
    if (typeof EventSource === "undefined") return;
    const es = new EventSource(STREAM_URL); esRef.current = es;
    const onData = (e) => { try { const p = JSON.parse(e.data); setOrders(p.orders ?? []); setConnected(true); } catch { } };
    es.addEventListener("init", onData);
    es.addEventListener("update", onData);
    es.addEventListener("error", () => { setConnected(false); es.close(); esRef.current = null; rcRef.current = setTimeout(connect, 10_000); if (!fbRef.current) startPoll(); });
  }, [startPoll, stopPoll]);

  useEffect(() => { connect(); return () => { esRef.current?.close(); stopPoll(); clearTimeout(rcRef.current); }; }, [connect, stopPoll]);
  return { orders, connected };
}

function usePrepOrders() {
  const [prep, setPrep] = useState([]);
  useEffect(() => {
    let alive = true;
    const poll = async () => { try { const r = await fetch(PREP_URL); const j = await r.json(); if (alive && j.success) setPrep(j.data ?? []); } catch { } };
    poll(); const t = setInterval(poll, 15_000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return prep;
}

function useWakeLock(active) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let lock = null, released = false;
    const req = async () => { try { lock = await navigator.wakeLock.request("screen"); } catch { } };
    req();
    const onVis = () => { if (document.visibilityState === "visible" && !released) req(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { released = true; document.removeEventListener("visibilitychange", onVis); try { lock?.release(); } catch { } };
  }, [active]);
}

// ═══════════════════════════════════════════
// KOMPONEN UTAMA
// ═══════════════════════════════════════════

export default function CekAntrian() {
  const { orders, connected } = useServiceOrders();
  const prep = usePrepOrders();
  const now = useNow();
  const tts = useTTS();

  const [magnify, setMagnify] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const rootRef = useRef(null);
  useWakeLock(magnify);

  // Normalisasi + urut terbaru dulu
  const prepCards = useMemo(() =>
    prep.map((o) => normPrep(o, now)).sort((a, b) => b.sortTs - a.sortTs), [prep, now]);
  const svcCards = useMemo(() =>
    orders.map((o) => normSvc(o, now)).sort((a, b) => b.sortTs - a.sortTs), [orders, now]);

  // Halaman mode Display: penyiapan dulu, lalu service
  const pages = useMemo(() => {
    const p = [];
    chunk(prepCards, PER_PAGE).forEach((items, i, arr) =>
      p.push({ key: `prep-${i}`, source: "prep", title: "Penyiapan Barang", items, no: i + 1, total: arr.length }));
    chunk(svcCards, PER_PAGE).forEach((items, i, arr) =>
      p.push({ key: `svc-${i}`, source: "service", title: "Antrian Service", items, no: i + 1, total: arr.length }));
    return p;
  }, [prepCards, svcCards]);

  // slideMap: setiap slide = 1 kartu
  const slideMap = useMemo(() => {
    const map = [];
    pages.forEach((page, pi) => {
      page.items.forEach((card) => map.push({ pageIdx: pi, card }));
    });
    return map;
  }, [pages]);
  const totalSlides = slideMap.length || 1;
  const prevCardMapRef = useRef(null);

  const slideMapRef = useRef(slideMap);
  slideMapRef.current = slideMap;
  const slideIdxRef = useRef(slideIdx);
  slideIdxRef.current = slideIdx;

  // Auto-jump + TTS SINKRON
  useEffect(() => {
    if (!magnify || slideMap.length === 0) return;
    const currentMap = new Map(slideMap.map(s => [s.card.key, s.card.step]));

    if (prevCardMapRef.current !== null) {
      const newIdx = slideMap.findIndex(s => !prevCardMapRef.current.has(s.card.key));
      if (newIdx !== -1) {
        const c = slideMap[newIdx].card;
        setSlideIdx(newIdx);
        const srcLabel = c.source === "prep" ? "penyiapan barang" : "servis";
        tts.enqueue(
          `${srcLabel === "penyiapan barang" ? "Penyiapan barang" : "Servis"} baru masuk. Customer ${c.nama}, laptop ${c.device}.`,
          true
        );
      } else {
        const changedIdx = slideMap.findIndex(s => {
          const prevStep = prevCardMapRef.current.get(s.card.key);
          return prevStep !== undefined && prevStep !== s.card.step;
        });
        if (changedIdx !== -1) {
          const c = slideMap[changedIdx].card;
          setSlideIdx(changedIdx);
          if (c.source === "prep") {
            tts.enqueue(
              `Perhatian, update penyiapan barang. Atas nama ${c.nama}, perangkat ${c.device}, barang anda ${c.step === 2 ? 'sudah diselesaikan' : `sedang ${c.labels[c.step]}`}.`,
              false
            );
          } else {
            tts.enqueue(
              `Perhatian, update servis. Atas nama ${c.nama}, perangkat ${c.device}, barang anda ${c.step === 2 ? 'sudah diselesaikan' : `sedang ${c.labels[c.step]}`}.`,
              false
            );
          }
        }
      }
    }
    prevCardMapRef.current = currentMap;
  }, [magnify, slideMap]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-slide — durasi dinamis
  useEffect(() => {
    if (!magnify || totalSlides < 2) return;
    let timer = null;
    const tick = () => {
      const sm = slideMapRef.current;
      const current = sm[slideIdxRef.current % sm.length];
      const delay = current?.card?.source === "service" ? SLIDE_MS_SVC : SLIDE_MS_PREP;
      timer = setTimeout(() => {
        if (!tts.isSpeaking()) {
          setSlideIdx((i) => (i + 1) % totalSlides);
        }
        tick();
      }, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, [magnify, totalSlides]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (slideIdx >= totalSlides) setSlideIdx(0); }, [totalSlides, slideIdx]);

  // Enter/exit fullscreen
  const enter = useCallback(async () => {
    setSlideIdx(0); setMagnify(true); prevCardMapRef.current = null;
    tts.unlock();
    tts.setEnabled(true);
    try { await rootRef.current?.requestFullscreen?.(); } catch { }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const exit = useCallback(async () => {
    setMagnify(false);
    tts.stopAll();
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setMagnify(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Panel kiri & kanan
  const currentSlide = slideMap.length > 0 ? slideMap[slideIdx % slideMap.length] : null;
  const leftCard = currentSlide?.card ?? null;
  const rightPage = currentSlide ? pages[currentSlide.pageIdx] : null;
  const rightAllCards = rightPage ? (rightPage.source === "prep" ? prepCards : svcCards) : [];
  const rightLabels = rightPage?.source === "prep"
    ? ["Menunggu disiapkan", "Disiapkan", "Selesai"]
    : ["Menunggu dikerjakan", "Dikerjakan", "Selesai"];

  // Live clock for display mode
  const clockTime = new Date(now).toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).replace(/:/g, ".");

  return (
    <div ref={rootRef} className="min-h-screen bg-surface-muted relative overflow-x-hidden">
      <Helmet>
        <title>Cek Antrian Servis & Penyiapan | Solit 03</title>
        <meta name="description" content="Pantau status servis & penyiapan pesanan Solit 03 secara realtime." />
        <link rel="canonical" href="https://solit.id/cek-antrian" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* MODE DISPLAY (PERBESAR) — REDESIGN v2       */}
      {/* ════════════════════════════════════════════ */}
      {magnify ? (
        <>
          <style>{`
            .poppins-display, .poppins-display * { font-family: 'Poppins', sans-serif !important; --ds-font-sans: 'Poppins', sans-serif; --font-sans: 'Poppins', sans-serif; }
            @keyframes cardEnter{
              0%{opacity:0;transform:translateY(20px) scale(.98);filter:blur(4px)}
              100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}
            }
            @keyframes panelSlide{
              0%{opacity:0;transform:translateX(16px)}
              100%{opacity:1;transform:translateX(0)}
            }
            @keyframes shimmer{
              0%{background-position:-200% 0}
              100%{background-position:200% 0}
            }
            @keyframes activeGlow{
              0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.2),0 2px 8px rgba(0,0,0,0.06)}
              50%{box-shadow:0 0 28px 8px rgba(59,130,246,0.08),0 4px 16px rgba(0,0,0,0.04)}
            }
            @keyframes floatOrb{
              0%,100%{transform:translate(0,0) scale(1)}
              33%{transform:translate(30px,-20px) scale(1.1)}
              66%{transform:translate(-20px,15px) scale(0.95)}
            }
            @keyframes slideNumber{
              0%{opacity:0;transform:translateY(8px)}
              100%{opacity:1;transform:translateY(0)}
            }
            .anim-left{animation:cardEnter .5s cubic-bezier(.22,1,.36,1) both}
            .anim-right{animation:panelSlide .4s cubic-bezier(.22,1,.36,1) .08s both}
            .active-card-glow{animation:activeGlow 3s ease-in-out infinite}
            .slide-num{animation:slideNumber .4s ease both}
            @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
            .marquee-track{display:inline-flex;white-space:nowrap;animation:marquee 40s linear infinite}
          `}</style>
          <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-[#0A1628] dark:via-[#0D1D35] dark:to-[#0A1628] flex flex-col poppins-display">
            {/* Decorative floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#2391FF]/[0.06] dark:bg-[#2391FF]/[0.04]" style={{animation:'floatOrb 20s ease-in-out infinite'}} />
              <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-violet-400/[0.05] dark:bg-violet-500/[0.03]" style={{animation:'floatOrb 25s ease-in-out infinite reverse'}} />
              <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-emerald-400/[0.04] dark:bg-emerald-500/[0.03]" style={{animation:'floatOrb 22s ease-in-out infinite 5s'}} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(35,145,255,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(35,145,255,0.06),transparent)]" />
            </div>

            {/* ═══ TOP BAR — dark premium + clock + counter ═══ */}
            {leftCard && (
              <div className="shrink-0 relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-50 to-white dark:from-[#060E1A] dark:via-[#0A1628] dark:to-[#060E1A] shadow-sm dark:shadow-none" />
                {/* Shimmer overlay */}
                <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]" style={{
                  background:'linear-gradient(90deg,transparent 0%,rgba(35,145,255,0.4) 50%,transparent 100%)',
                  backgroundSize:'200% 100%',
                  animation:'shimmer 6s ease-in-out infinite'
                }} />
                {/* Accent line bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                  leftCard.source === "prep"
                    ? "bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                    : "bg-gradient-to-r from-transparent via-[#2391FF] to-transparent"
                }`} />

                <div className="relative flex items-center justify-between px-8 xl:px-12 py-3 xl:py-4">
                  {/* Left: Source + Title */}
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 xl:w-12 xl:h-12 rounded-xl flex items-center justify-center border backdrop-blur-sm ${
                      leftCard.source === "prep"
                        ? "bg-violet-100 border-violet-200 dark:bg-violet-500/15 dark:border-violet-500/25 shadow-[0_0_20px_rgba(139,92,246,0.1)] dark:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                        : "bg-[#2391FF]/10 border-[#2391FF]/20 dark:bg-[#2391FF]/15 dark:border-[#2391FF]/25 shadow-[0_0_20px_rgba(35,145,255,0.1)] dark:shadow-[0_0_20px_rgba(35,145,255,0.15)]"
                    }`}>
                      {leftCard.source === "prep"
                        ? <Truck size={22} className="text-violet-600 dark:text-violet-400" />
                        : <Wrench size={22} className="text-[#2391FF]" />
                      }
                    </div>
                    <div>
                      <span className="text-slate-800 dark:text-white font-extrabold text-lg xl:text-xl tracking-wide block leading-tight">
                        {leftCard.source === "prep" ? "Penyiapan Barang" : "Antrian Service"}
                      </span>
                      <span className="text-[#2391FF]/70 dark:text-[#2391FF]/50 text-xs xl:text-sm font-bold tracking-[0.2em] uppercase">SOLIT 03</span>
                    </div>
                  </div>

                  {/* Right: Clock + Live + Counter + Close */}
                  <div className="flex items-center gap-4">
                    {/* Clock */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-white/60">
                      <Clock size={18} />
                      <span className="font-mono text-lg xl:text-xl font-bold tabular-nums tracking-wider">{clockTime}</span>
                    </div>

                    <div className="w-px h-7 bg-slate-200 dark:bg-white/10" />

                    {/* LIVE badge */}
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full px-4 py-1.5 border border-emerald-200 dark:border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs xl:text-sm font-bold tracking-wider">LIVE</span>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ═══ KONTEN UTAMA ═══ */}
            {slideMap.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mb-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/50 dark:border-white/[0.06]">
                  <Wrench size={52} className="text-slate-300 dark:text-white/15" />
                </div>
                <p className="text-4xl xl:text-5xl font-black text-slate-800 dark:text-white">Belum ada antrian hari ini</p>
                <p className="text-lg xl:text-xl text-slate-400 dark:text-white/40 mt-4 max-w-lg">Papan akan update otomatis begitu ada servis atau penyiapan masuk.</p>
                <button onClick={exit} className="mt-10 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-500 dark:text-white/60 text-base font-semibold transition-colors border border-slate-200 dark:border-white/[0.08]">
                  <X size={18} /> Keluar Mode Display
                </button>
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden min-h-0">

                {/* ═══ PANEL KIRI (74%) ═══ */}
                <div className="w-[74%] flex flex-col overflow-hidden relative" key={`left-${leftCard?.key}`}>
                  {leftCard && (
                    <div className="anim-left flex-1 min-h-0 flex items-center px-8 xl:px-14 2xl:px-16 py-6 xl:py-8">
                      <BigCard n={leftCard} />
                    </div>
                  )}
                </div>

                {/* ═══ DIVIDER ═══ */}
                <div className="w-px shrink-0 bg-gradient-to-b from-transparent via-slate-200/80 dark:via-white/[0.08] to-transparent" />

                {/* ═══ PANEL KANAN (26%) — REDESIGN v2 ═══ */}
                <div className="w-[26%] flex flex-col overflow-y-auto bg-slate-50/50 dark:bg-white/[0.02]" key={`right-${rightPage?.key}`}>
                  {rightPage ? (
                    <div className="anim-right flex flex-col h-full px-3 xl:px-4 py-4">

                      {/* Cards */}
                      <div className="flex-1 flex flex-col justify-center space-y-2.5">
                        {rightPage.items.map((n, ni) => {
                          const isActive = leftCard?.key === n.key;
                          const statusColor =
                            n.step === 0 ? "text-amber-600 dark:text-amber-500"
                              : n.step === 1 ? "text-[#2391FF]"
                                : "text-emerald-600 dark:text-emerald-400";
                          const accentColor =
                            n.step === 0 ? "from-amber-400 to-amber-500" :
                            n.step === 1 ? "from-blue-400 to-blue-500" :
                            "from-emerald-400 to-emerald-500";
                          const dotColor =
                            n.step === 0 ? "bg-amber-400" : n.step === 1 ? "bg-blue-400" : "bg-emerald-400";
                          const queueBg =
                            n.step === 0 ? "from-amber-500 to-amber-600" :
                            n.step === 1 ? "from-blue-500 to-blue-600" :
                            "from-emerald-500 to-emerald-600";

                          const badgeDur =
                            n.step === 0 ? formatDurasi(n.dur1) :
                              n.step === 1 ? formatDurasi(n.dur2) :
                                formatJam(n.doneTime);

                          return (
                            <div key={n.key} className={`rounded-2xl transition-all duration-500 relative overflow-hidden ${
                              isActive
                                ? "bg-white dark:bg-white/[0.07] shadow-xl dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/80 dark:ring-white/[0.1] active-card-glow"
                                : "bg-white/40 dark:bg-white/[0.02] opacity-45 hover:opacity-55"
                            }`}>
                              {/* Accent bar kiri */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b ${accentColor} ${isActive ? "opacity-100" : "opacity-20"}`} />

                              <div className="px-4 py-4 pl-5">
                                {/* Row 1: Queue number + Name */}
                                <div className="flex items-center gap-3">
                                  {/* Queue position */}
                                  <div className={`shrink-0 w-8 h-8 xl:w-9 xl:h-9 rounded-lg flex items-center justify-center ${
                                    isActive
                                      ? `bg-gradient-to-br ${queueBg} shadow-lg shadow-blue-500/20`
                                      : "bg-slate-100 dark:bg-white/[0.06]"
                                  }`}>
                                    <span className={`text-sm xl:text-base font-black ${
                                      isActive ? "text-white" : "text-slate-400 dark:text-white/25"
                                    }`}>{ni + 1}</span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-base xl:text-lg 2xl:text-xl leading-tight tracking-tight truncate ${
                                      isActive ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-white/50"
                                    }`}>{n.nama}</p>
                                  </div>
                                </div>

                                {/* Row 2: Device */}
                                <p className="text-xs xl:text-sm text-slate-400 dark:text-white/30 font-medium mt-1.5 truncate pl-[44px] xl:pl-[48px]">
                                  {n.device}
                                </p>

                                {/* Row 3: Status + Duration */}
                                <div className="flex items-center gap-2 mt-2.5 pl-[44px] xl:pl-[48px]">
                                  <div className={`w-2 h-2 rounded-full ${dotColor} ${isActive ? "animate-pulse shadow-[0_0_6px_currentColor]" : ""}`} />
                                  <span className={`text-xs xl:text-sm font-bold ${statusColor}`}>
                                    {n.labels[n.step]}
                                  </span>
                                  {badgeDur && (
                                    <span className="text-xs xl:text-sm font-semibold text-slate-400 dark:text-white/30 tabular-nums">
                                      · {badgeDur}
                                    </span>
                                  )}
                                  {n.step2Name && (
                                    <span className="text-xs xl:text-sm font-medium text-slate-400 dark:text-white/25 truncate">· {n.step2Name}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : leftCard ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                      <p className="text-lg font-bold text-slate-300 dark:text-white/20">Tidak ada data lain</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* ═══ FOOTER — slide indicator + running text ═══ */}
            <div className="shrink-0 relative">
              {/* Slide indicators */}
              {totalSlides > 1 && (
                <div className="px-8 py-2.5 flex items-center justify-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  {Array.from({ length: totalSlides }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIdx(i)}
                      className={`rounded-full transition-all duration-500 ${i === slideIdx % totalSlides
                        ? "h-2.5 w-10 bg-gradient-to-r from-[#2391FF] to-violet-500 shadow-md shadow-[#2391FF]/30"
                        : "h-2 w-2 bg-slate-300/50 dark:bg-white/10 hover:bg-slate-400/60 dark:hover:bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              )}
              {/* Running text marquee */}
              <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-[#060E1A] dark:via-[#0A1628] dark:to-[#060E1A]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2391FF]/5 via-violet-600/5 to-[#2391FF]/5" />
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-800 dark:from-[#060E1A] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-800 dark:from-[#060E1A] to-transparent z-10 pointer-events-none" />
                <div className="relative marquee-track py-3.5">
                  <span className="px-14 text-sm xl:text-base font-semibold text-white/60 dark:text-white/50 tracking-wider">{RUNNING_TEXT}</span>
                  <span className="px-14 text-sm xl:text-base font-semibold text-white/60 dark:text-white/50 tracking-wider">{RUNNING_TEXT}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ════════════════════════════════════════════ */
        /* MODE NORMAL (tetap sama persis)             */
        /* ════════════════════════════════════════════ */
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.fadeUp{animation:fadeUp .5s ease forwards}`}</style>

          <div className="text-center mb-10 md:mb-14">
            <span className="eyebrow"><span className="w-1.5 h-1.5 bg-[#2391FF] rounded-full" /> Official Solit 03</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-content mt-5">Antrian <span className="text-[#2391FF]">Servis</span> & Penyiapan</h1>
            <p className="text-base text-content-muted mt-4 max-w-md mx-auto">Pantau status laptop & pesanan kamu secara real-time.</p>
            <button onClick={enter} className="mt-6 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2391FF] to-blue-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-[#2391FF]/25 hover:-translate-y-0.5 shadow-soft transition-all duration-300">
              <Maximize2 size={18} /> Perbesar (Mode Display TV)
            </button>
            <div className="flex items-center justify-center gap-2.5 mt-4">
              <div className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-slate-300"}`} />
              <span className="text-sm text-content-muted font-medium">{connected ? "Terhubung real-time" : "Mode polling"}</span>
            </div>
          </div>

          {/* PENYIAPAN */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 shadow-sm"><Truck size={16} /> PENYIAPAN BARANG</span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent dark:from-violet-500/20" />
          </div>
          {prepCards.length === 0 ? (
            <div className="bg-white/60 dark:bg-[#0F2341]/40 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-violet-500/10 p-10 text-center mb-12"><Truck size={30} className="text-violet-400/60 mx-auto mb-3" /><p className="text-content-soft font-bold text-base">Belum ada penyiapan hari ini</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12 fadeUp">
              {prepCards.map((n) => <PhaseCard key={n.key} n={n} />)}
            </div>
          )}

          {/* SERVICE */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-blue-50 text-[#2391FF] dark:bg-[#2391FF]/15 dark:text-blue-300 shadow-sm"><Wrench size={16} /> ANTRIAN SERVICE</span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-[#2391FF]/20" />
          </div>
          {svcCards.length === 0 ? (
            <div className="bg-white/60 dark:bg-[#0F2341]/40 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-[#2391FF]/10 p-10 text-center"><Wrench size={30} className="text-[#2391FF]/40 mx-auto mb-3" /><p className="text-content-soft font-bold text-base">Belum ada antrian servis</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fadeUp">
              {svcCards.map((n) => <PhaseCard key={n.key} n={n} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}