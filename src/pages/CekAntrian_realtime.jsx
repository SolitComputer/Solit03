import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Wrench, Clock, Package, Check, Maximize2, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";

const POS_BASE = "https://pos.solit.id";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const SERVICE_URL = `${POS_BASE}/api/service/public`;
const PREP_URL = `${POS_BASE}/api/preparation/public`;

const SLIDE_MS = 15_000;   // durasi tiap slide di mode Display (15 detik)
const PER_PAGE = 5;        // customer per panel per slide

// ── Teks berjalan di bawah Mode Display ──
const RUNNING_TEXT = [
  "SOLIT 03 — Jual Beli & Service Laptop Second Terpercaya di Depok",
  "Buka Setiap Hari 08.00–22.00 WIB (khusus Selasa mulai 10.00)",
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
  { bar: "#EF9F27", badgeBg: "bg-amber-50 dark:bg-amber-500/15", badgeText: "text-amber-700 dark:text-amber-300", icon: Clock },
  { bar: "#378ADD", badgeBg: "bg-blue-50 dark:bg-blue-500/15", badgeText: "text-blue-700 dark:text-blue-300", icon: Package },
  { bar: "#1D9E75", badgeBg: "bg-emerald-50 dark:bg-emerald-500/15", badgeText: "text-emerald-700 dark:text-emerald-300", icon: Check },
];

// ═══════════════════════════════════════════
// DOT PROGRESS
// ═══════════════════════════════════════════

function Dot({ state, big = false }) {
  const size = big ? "w-5 h-5" : "w-4 h-4";
  const iconSize = big ? 11 : 9;
  const cls = {
    done: "bg-emerald-500 text-white",
    active1: "bg-amber-500 ring-4 ring-amber-100 animate-pulse",
    active2: "bg-blue-500 ring-4 ring-blue-100 animate-pulse",
    active3: "bg-emerald-500 ring-4 ring-emerald-100 text-white",
    pending: "bg-surface border-2 border-slate-300",
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
  return i < step ? (step === 2 ? "bg-emerald-500" : "bg-blue-500") : "bg-slate-200";
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
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-500/40 transition-all duration-300 ease-out">
      <div style={{ height: 6, background: `linear-gradient(90deg, ${st.bar}, ${st.bar}cc)` }} />
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[11px] font-bold text-content-soft bg-surface-muted dark:bg-slate-700/50 px-1.5 py-0.5 rounded-md">{n.orderNo}</span>
          <span className={`inline-flex items-center gap-1 ${st.badgeBg} ${st.badgeText} text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm`}>
            <Icon size={12} /> {badgeLabel}{badgeDur ? ` · ${badgeDur}` : ""}
          </span>
        </div>
        <p className="font-bold text-content leading-tight text-sm">{n.nama}</p>
        <p className="text-xs text-content-soft dark:text-slate-300 mt-0.5 truncate">
          {n.device}{n.subtitle ? <span className="text-content-muted dark:text-slate-400"> · {n.subtitle}</span> : null}
        </p>
        {n.chips.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            {n.chips.map((c, i) => (
              <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded ${["bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"][i % 3]}`}>{c}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 mt-2">
          <Dot state={dotState(n.step, 0)} />
          <div className={`flex-1 h-0.5 rounded ${lineColor(n.step, 0)}`} />
          <Dot state={dotState(n.step, 1)} />
          <div className={`flex-1 h-0.5 rounded ${lineColor(n.step, 1)}`} />
          <Dot state={dotState(n.step, 2)} />
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-[10px] ${n.step >= 0 ? "text-content font-medium" : "text-content-muted"}`}>{n.labels[0]}</span>
          <span className={`text-[10px] ${n.step >= 1 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-content-muted"} truncate px-1`}>
            {n.step2Name ? `oleh ${n.step2Name}` : n.labels[1]}
          </span>
          <span className={`text-[10px] ${n.step >= 2 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-content-muted"}`}>{n.labels[2]}</span>
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
  const badgeDur =
    n.step === 0 ? formatDurasi(n.dur1) :
      n.step === 1 ? formatDurasi(n.dur2) :
        formatJam(n.doneTime);

  // Warna status sesuai step
  const statusColor =
    n.step === 0 ? "text-amber-600 dark:text-amber-400"
      : n.step === 1 ? "text-blue-600 dark:text-blue-400"
        : "text-emerald-600 dark:text-emerald-400";

  // Entri info di sisi kiri (tanpa nomor)
  const entries = [
    { label: "Nama Customer", value: n.nama, big: true },
    { label: n.source === "prep" ? "Tipe Barang" : "Tipe Laptop", value: n.device },
  ];

  // Keluhan / Spesifikasi
  if (n.source === "service") {
    entries.push({ label: "Keluhan", value: n.subtitle || "—" });
  } else if (n.chips.length > 0) {
    entries.push({ label: "Spesifikasi", chips: n.chips });
  }

  // Catatan Progres — dari API, kalau ada tampilin bernomor, kalau kosong "—"
  const catatanLines = n.catatan
    ? n.catatan.split(/\n|;|,/).map(s => s.trim()).filter(Boolean)
    : [];
  entries.push({ label: "Catatan Progres", catatan: true, catatanLines });

  return (
    <div className="h-full flex items-center px-6 xl:px-10">
      <div className="flex gap-6 xl:gap-10 w-full">

        {/* ═══ KOLOM KIRI: info tanpa nomor ═══ */}
        <div className="flex-1 min-w-0">
          {entries.map((entry, i) => (
            <div key={i} className={i < entries.length - 1 ? "pb-5 xl:pb-7 2xl:pb-8 mb-5 xl:mb-7 2xl:mb-8 border-b border-slate-200/50 dark:border-slate-700/30" : "pb-1"}>
              <p className="text-xs xl:text-sm 2xl:text-base text-content-muted/70 font-bold tracking-[0.2em] leading-none uppercase">
                {entry.label}
              </p>

              {entry.big ? (
                <p className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-content tracking-tight leading-snug mt-2">
                  {entry.value}
                </p>
              ) : entry.chips ? (
                <div className="flex gap-2 flex-wrap mt-2">
                  {entry.chips.map((c, ci) => (
                    <span key={ci} className={`text-lg xl:text-xl font-bold px-3 py-1 rounded-lg ${["bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
                        "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
                        "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"][ci % 3]
                      }`}>{c}</span>
                  ))}
                </div>
              ) : entry.catatan ? (
                /* Catatan Progres — bernomor kalau ada isi, strip kalau kosong */
                entry.catatanLines.length > 0 ? (
                  <div className="mt-2 space-y-1.5">
                    {entry.catatanLines.map((line, li) => (
                      <div key={li} className="flex gap-3 items-baseline">
                        <span className="shrink-0 w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-sm">
                          <span className="text-white font-black text-xs xl:text-sm">{li + 1}</span>
                        </span>
                        <p className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-content leading-snug">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-content-muted/50 leading-tight mt-2">—</p>
                )
              ) : (
                <p className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-content leading-snug mt-2">
                  {entry.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ═══ KOLOM KANAN: status progress timeline ═══ */}
        <div className="shrink-0 flex flex-col justify-center pl-8 xl:pl-10 border-l-2 border-slate-200/80 dark:border-slate-700/60">
          <div className="space-y-1">
            {n.labels.map((lbl, si) => {
              const isDone = si < n.step;
              const isCurrent = si === n.step;
              const stepDur = si === 0 ? formatDurasi(n.dur1) : si === 1 ? formatDurasi(n.dur2) : formatJam(n.doneTime);
              return (
                <div key={si} className="flex items-start gap-3">
                  {/* Dot + garis vertikal */}
                  <div className="flex flex-col items-center shrink-0 pt-1.5">
                    <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full shrink-0 ${isDone ? "bg-emerald-500 shadow-sm shadow-emerald-500/30" : isCurrent ? "bg-blue-500 ring-[5px] ring-blue-500/15 shadow-sm shadow-blue-500/30" : "bg-slate-300 dark:bg-slate-600"
                      }`} />
                    {si < n.labels.length - 1 && (
                      <div className={`w-0.5 h-6 xl:h-8 ${isDone ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-600"}`} />
                    )}
                  </div>
                  {/* Label + durasi */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xl xl:text-2xl 2xl:text-3xl font-extrabold leading-snug ${isCurrent ? statusColor : isDone ? "text-emerald-600 dark:text-emerald-400" : "text-content-muted"
                      }`}>
                      {lbl}
                      {(isCurrent || isDone) && stepDur && (
                        <span className={`font-semibold text-base xl:text-lg ${isDone ? "opacity-60" : "opacity-80"}`}> · {stepDur}</span>
                      )}
                    </p>
                    {isCurrent && n.step2Name && (
                      <p className="text-sm xl:text-base text-content-soft font-medium mt-0.5">oleh {n.step2Name}</p>
                    )}
                  </div>
                </div>
              );
            })}
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

  useEffect(() => { volumeRef.current = volume; }, [volume]);

  // Unlock audio context via user gesture
  const unlock = useCallback(() => {
    if (typeof speechSynthesis === "undefined") return;
    const u = new SpeechSynthesisUtterance(" ");
    u.lang = "id-ID";
    u.volume = 0;
    speechSynthesis.speak(u);
    setUnlocked(true);
  }, []);

  const processQueue = useCallback(() => {
    if (isSpeakingRef.current || queueRef.current.length === 0) return;
    if (typeof speechSynthesis === "undefined") return;

    isSpeakingRef.current = true;
    const text = queueRef.current.shift();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.volume = volumeRef.current;
    u.rate = 0.95;

    // Prefer Indonesian voice if available
    const voices = speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang === "id-ID" || v.lang.startsWith("id"));
    if (idVoice) u.voice = idVoice;

    u.onend = () => { isSpeakingRef.current = false; processQueue(); };
    u.onerror = () => { isSpeakingRef.current = false; processQueue(); };
    speechSynthesis.speak(u);
  }, []);

  const enqueue = useCallback((text) => {
    queueRef.current.push(text);
    processQueue();
  }, [processQueue]);

  // Deteksi perubahan status → masukkan ke antrean suara
  const detectChanges = useCallback(
    (prepCards, svcCards) => {
      if (!enabled || !unlocked) return;

      const allCards = [...prepCards, ...svcCards];
      const newMap = new Map();
      allCards.forEach((c) => newMap.set(c.key, c.step));

      // Load pertama → simpan data awal tanpa announce
      if (prevMapRef.current === null) {
        prevMapRef.current = newMap;
        return;
      }

      // Cek perubahan status
      prepCards.forEach((c) => {
        const prev = prevMapRef.current.get(c.key);
        if (prev !== undefined && prev !== c.step) {
          enqueue(
            `Informasi penyiapan barang. CS ${c.nama}, laptop ${c.device}, status pengerjaan berubah menjadi ${c.labels[c.step]}.`
          );
        }
      });
      svcCards.forEach((c) => {
        const prev = prevMapRef.current.get(c.key);
        if (prev !== undefined && prev !== c.step) {
          enqueue(
            `Informasi servis. CS ${c.nama}, laptop ${c.device}, status servis berubah menjadi ${c.labels[c.step]}.`
          );
        }
      });

      // Deteksi data baru yang belum pernah ada sebelumnya
      allCards.forEach((c) => {
        if (!prevMapRef.current.has(c.key)) {
          const srcLabel = c.source === "prep" ? "penyiapan barang" : "servis";
          enqueue(
            `${srcLabel === "penyiapan barang" ? "Penyiapan barang" : "Servis"} baru masuk. CS ${c.nama}, laptop ${c.device}.`
          );
        }
      });

      prevMapRef.current = newMap;
    },
    [enabled, unlocked, enqueue]
  );

  // Reset prevMap ketika TTS pertama kali diaktifkan agar tidak announce semua data lama
  useEffect(() => {
    if (enabled && unlocked) {
      prevMapRef.current = null; // akan di-set pada detectChanges berikutnya
    }
  }, [enabled, unlocked]);

  return { enabled, setEnabled, volume, setVolume, unlock, unlocked, detectChanges };
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
    if (typeof EventSource === "undefined") { startPoll(); return; }
    const es = new EventSource(STREAM_URL); esRef.current = es;
    const onData = (e) => { try { const p = JSON.parse(e.data); setOrders(p.orders ?? []); setConnected(true); stopPoll(); } catch { } };
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

  // Trigger TTS detection ketika data berubah
  useEffect(() => {
    if (magnify) tts.detectChanges(prepCards, svcCards);
  }, [prepCards, svcCards, magnify]); // eslint-disable-line react-hooks/exhaustive-deps

  // Halaman mode Display: penyiapan dulu, lalu service
  const pages = useMemo(() => {
    const p = [];
    chunk(prepCards, PER_PAGE).forEach((items, i, arr) =>
      p.push({ key: `prep-${i}`, source: "prep", title: "Penyiapan Barang", items, no: i + 1, total: arr.length }));
    chunk(svcCards, PER_PAGE).forEach((items, i, arr) =>
      p.push({ key: `svc-${i}`, source: "service", title: "Antrian Service", items, no: i + 1, total: arr.length }));
    return p;
  }, [prepCards, svcCards]);

  // slideMap: setiap slide = 1 kartu, disinkronkan dengan halaman kanan
  // Kiri cycle A→B→C dalam page, baru pindah page berikutnya
  const slideMap = useMemo(() => {
    const map = [];
    pages.forEach((page, pi) => {
      page.items.forEach((card) => map.push({ pageIdx: pi, card }));
    });
    return map;
  }, [pages]);
  const totalSlides = slideMap.length || 1;

  // Auto-slide setiap 15 detik
  useEffect(() => {
    if (!magnify || totalSlides < 2) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % totalSlides), SLIDE_MS);
    return () => clearInterval(t);
  }, [magnify, totalSlides]);
  useEffect(() => { if (slideIdx >= totalSlides) setSlideIdx(0); }, [totalSlides, slideIdx]);

  // Enter/exit fullscreen
  const enter = useCallback(async () => {
    setSlideIdx(0); setMagnify(true);
    // Auto-unlock + aktifkan TTS (klik Perbesar = user gesture)
    tts.unlock();
    tts.setEnabled(true);
    try { await rootRef.current?.requestFullscreen?.(); } catch { }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const exit = useCallback(async () => {
    setMagnify(false);
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { }
  }, []);
  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setMagnify(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Panel kiri & kanan — disinkronkan lewat slideMap
  const currentSlide = slideMap.length > 0 ? slideMap[slideIdx % slideMap.length] : null;
  const leftCard = currentSlide?.card ?? null;
  const rightPage = currentSlide ? pages[currentSlide.pageIdx] : null;
  const rightAllCards = rightPage ? (rightPage.source === "prep" ? prepCards : svcCards) : [];
  const rightLabels = rightPage?.source === "prep"
    ? ["Menunggu disiapkan", "Disiapkan", "Selesai"]
    : ["Menunggu dikerjakan", "Dikerjakan", "Selesai"];

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
      {/* MODE DISPLAY (PERBESAR)                     */}
      {/* ════════════════════════════════════════════ */}
      {magnify ? (
        <>
          <style>{`
            .poppins-display, .poppins-display * { font-family: 'Poppins', sans-serif !important; --ds-font-sans: 'Poppins', sans-serif; --font-sans: 'Poppins', sans-serif; }
        `}</style>
          <div className="fixed inset-0 z-[100] bg-surface flex flex-col poppins-display">
            <style>{`
            @keyframes cardEnter{
              from{opacity:0;transform:translateY(24px) scale(.97)}
              to{opacity:1;transform:translateY(0) scale(1)}
            }
            @keyframes panelSlide{
              from{opacity:0;transform:translateX(20px)}
              to{opacity:1;transform:translateX(0)}
            }
            .anim-left{animation:cardEnter .6s cubic-bezier(.16,1,.3,1) both}
            .anim-right{animation:panelSlide .5s cubic-bezier(.16,1,.3,1) .1s both}
          `}</style>

            {/* ── Konten utama: 2 panel (top bar dihapus, keluar via ESC) ── */}
            {slideMap.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <p className="text-2xl font-black text-content">Belum ada antrian hari ini</p>
                <p className="text-sm text-content-muted mt-2">Papan akan update otomatis begitu ada servis atau penyiapan masuk.</p>
                <p className="text-xs text-content-muted mt-4">Tekan ESC untuk keluar</p>
              </div>
            ) : (
              <>
              {/* Header badge — full width di tengah atas */}
              {leftCard && (
                <div className="flex items-center justify-center py-3">
                  <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-sm ${leftCard.source === "prep"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    }`}>
                    {leftCard.source === "prep" ? <Truck size={16} /> : <Wrench size={16} />}
                    {leftCard.source === "prep" ? "Penyiapan Barang" : "Antrian Service"}
                  </span>
                </div>
              )}

              <div className="flex-1 flex overflow-hidden min-h-0">
                {/* ═══ PANEL KIRI (72%) — 1 kartu besar full ═══ */}
                <div className="w-[72%] flex flex-col p-5 overflow-hidden" key={`left-${leftCard?.key}`}>
                  {leftCard && (
                    <div className="anim-left flex flex-col h-full">
                      {/* Satu kartu besar — full height */}
                      <div className="flex-1 min-h-0">
                        <BigCard n={leftCard} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ DIVIDER ═══ */}
                <div className="w-px bg-border shrink-0" />

                {/* ═══ PANEL KANAN (28%) — daftar antrian ═══ */}
                <div className="w-[28%] flex flex-col overflow-y-auto bg-gradient-to-b from-slate-50 via-slate-50/80 to-white dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-900/30" key={`right-${rightPage?.key}`}>
                  {rightPage ? (
                    <div className="anim-right flex flex-col h-full justify-center px-4 xl:px-5 py-4">
                      {/* Header panel kanan */}
                      <div className="flex items-center gap-2.5 mb-4 px-1">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${rightPage.source === "prep" ? "bg-violet-500" : "bg-blue-500"
                          }`} />
                        <span className="text-xs xl:text-sm font-extrabold text-content-soft uppercase tracking-[0.15em]">
                          {rightPage.source === "prep" ? "Penyiapan" : "Service"}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600" />
                        <span className="text-[11px] xl:text-xs font-bold text-white bg-slate-400 dark:bg-slate-600 px-2 py-0.5 rounded-full tabular-nums">
                          {rightPage.no}/{rightPage.total}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {rightPage.items.map((n, idx) => {
                          const dur1Str = formatDurasi(n.dur1);
                          const dur2Str = formatDurasi(n.dur2);
                          const isActive = leftCard?.key === n.key;
                          const statusColor =
                            n.step === 0 ? "text-amber-600 dark:text-amber-400"
                              : n.step === 1 ? "text-blue-600 dark:text-blue-400"
                                : "text-emerald-600 dark:text-emerald-400";
                          const statusBg =
                            n.step === 0 ? "bg-amber-50 dark:bg-amber-500/10"
                              : n.step === 1 ? "bg-blue-50 dark:bg-blue-500/10"
                                : "bg-emerald-50 dark:bg-emerald-500/10";
                          const activeBorder =
                            n.step === 0 ? "border-amber-400" : n.step === 1 ? "border-blue-500" : "border-emerald-500";

                          return (
                            <div key={n.key} className={`rounded-xl px-3.5 py-3 xl:py-3.5 transition-all duration-500 ${isActive
                                ? `bg-white dark:bg-slate-800 shadow-md shadow-slate-200/60 dark:shadow-black/20 border border-slate-200/80 dark:border-slate-700 border-l-[3px] ${activeBorder}`
                                : "opacity-35 hover:opacity-50 border border-transparent"
                              }`}>
                              {/* Baris 1: Nomor urut + Nama CS */}
                              <div className="flex items-baseline gap-2">
                                <span className={`text-[11px] xl:text-xs font-mono font-bold shrink-0 px-1.5 py-0.5 rounded ${isActive ? "bg-slate-100 dark:bg-slate-700 text-content-soft" : "text-content-muted"
                                  }`}>{n.orderNo}</span>
                                <p className={`font-extrabold text-lg xl:text-xl 2xl:text-2xl leading-snug tracking-tight truncate ${isActive ? "text-content" : "text-content-soft"
                                  }`}>
                                  {n.nama}
                                </p>
                              </div>

                              {/* Baris 2: Tipe Device */}
                              <p className="text-sm xl:text-base 2xl:text-lg text-content-muted font-medium mt-0.5 truncate">
                                {n.device}
                              </p>

                              {/* Baris 3: Status badge + teknisi + durasi */}
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className={`inline-flex items-center text-[11px] xl:text-xs font-bold px-2 py-0.5 rounded-md ${statusColor} ${statusBg}`}>
                                  {n.labels[n.step]}
                                </span>
                                {n.step2Name && (
                                  <span className="text-[11px] xl:text-xs font-medium text-content-muted truncate">· {n.step2Name}</span>
                                )}
                                {(dur1Str || dur2Str) && (
                                  <span className="text-[10px] xl:text-[11px] font-semibold text-content-muted tabular-nums ml-auto">
                                    {n.step <= 1 && dur1Str}{n.step === 1 && dur2Str ? ` → ${dur2Str}` : ""}
                                    {n.step === 2 && formatJam(n.doneTime) ? `selesai ${formatJam(n.doneTime)}` : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : leftCard ? (
                    /* Kalau cuma 1 data, panel kanan kosong dengan info */
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900/30">
                      <p className="text-xl font-bold text-content-muted">Tidak ada data lain</p>
                      <p className="text-base text-content-muted mt-2">Semua data ditampilkan di panel kiri.</p>
                    </div>
                  ) : null}
                </div>
              </div>
              </>
            )}

            {/* ── Footer: page dots + running text ── */}
            <div className="shrink-0">
              {/* Page dots */}
              {totalSlides > 1 && (
                <div className="px-6 py-2 flex items-center justify-center gap-2">
                  {Array.from({ length: totalSlides }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-500 ${i === slideIdx
                          ? "w-10 bg-gradient-to-r from-blue-500 to-violet-500"
                          : "w-2.5 bg-slate-300 dark:bg-slate-600"
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Running text */}
              <div className="relative z-10 overflow-visible bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
                <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.marquee-track{display:inline-flex;white-space:nowrap;animation:marquee 30s linear infinite}`}</style>
                <div className="marquee-track py-2.5">
                  <span className="px-8 text-sm font-semibold text-white">{RUNNING_TEXT}</span>
                  <span className="px-8 text-sm font-semibold text-white">{RUNNING_TEXT}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ════════════════════════════════════════════ */
        /* MODE NORMAL (tetap sama persis)             */
        /* ════════════════════════════════════════════ */
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.fadeUp{animation:fadeUp .5s ease forwards}`}</style>

          <div className="text-center mb-8">
            <span className="eyebrow"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Official Solit 03</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-4">Antrian <span className="text-blue-600">Servis</span> & Penyiapan</h1>
            <p className="text-sm text-content-muted mt-3">Pantau status laptop & pesanan kamu secara real-time.</p>
            <button onClick={enter} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-soft transition">
              <Maximize2 size={16} /> Perbesar (Mode Display TV)
            </button>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
              <span className="text-xs text-content-muted">{connected ? "Terhubung real-time" : "Mode polling"}</span>
            </div>
          </div>

          {/* PENYIAPAN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"><Truck size={15} /> PENYIAPAN BARANG</span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
          </div>
          {prepCards.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border p-8 text-center mb-10"><Truck size={26} className="text-violet-400 mx-auto mb-2" /><p className="text-content-soft font-bold text-sm">Belum ada penyiapan hari ini</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 fadeUp">
              {prepCards.map((n) => <PhaseCard key={n.key} n={n} />)}
            </div>
          )}

          {/* SERVICE */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"><Wrench size={15} /> ANTRIAN SERVICE</span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
          </div>
          {svcCards.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border p-8 text-center"><Wrench size={26} className="text-blue-400 mx-auto mb-2" /><p className="text-content-soft font-bold text-sm">Belum ada antrian servis</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fadeUp">
              {svcCards.map((n) => <PhaseCard key={n.key} n={n} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}