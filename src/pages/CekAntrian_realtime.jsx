import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Wrench, Clock, CheckCircle, Package, RefreshCw, Search, AlertCircle, Check, Hash, Radio, Maximize2, X, Truck, ClipboardList } from "lucide-react";
import { Helmet } from "react-helmet-async";

const POS_BASE = "https://pos.solit.id";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const FALLBACK_URL = `${POS_BASE}/api/service/public`;
const PREP_URL = `${POS_BASE}/api/preparation/public`;

const STATUS_CONFIG = {
  ANTRIAN: { label: "Antrian", icon: <Clock size={13} />, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", rowBg: "hover:bg-amber-50/40", desc: "Menunggu giliran dikerjakan", gradient: "from-amber-500 to-amber-600", badgeBg: "bg-amber-100" },
  SEDANG_DIKERJAKAN: { label: "Dikerjakan", icon: <Wrench size={13} />, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", rowBg: "hover:bg-blue-50/40", desc: "Sedang dalam proses perbaikan", gradient: "from-blue-500 to-blue-600", badgeBg: "bg-blue-100" },
  MENUNGGU_SPAREPART: { label: "Tunggu Sparepart", icon: <Package size={13} />, bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400", rowBg: "hover:bg-orange-50/40", desc: "Menunggu komponen tiba", gradient: "from-orange-500 to-orange-600", badgeBg: "bg-orange-100" },
  DONE: { label: "Selesai", icon: <CheckCircle size={13} />, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", rowBg: "hover:bg-emerald-50/40", desc: "Laptop selesai, silakan diambil", gradient: "from-emerald-500 to-emerald-600", badgeBg: "bg-emerald-100" },
  GAGAL_DIPERBAIKI: { label: "Gagal Diperbaiki", icon: <AlertCircle size={13} />, bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-400", rowBg: "hover:bg-rose-50/40", desc: "Perbaikan tidak bisa dilanjutkan", gradient: "from-rose-500 to-rose-600", badgeBg: "bg-rose-100" },
};

const STATUS_ORDER = ["ANTRIAN", "SEDANG_DIKERJAKAN", "MENUNGGU_SPAREPART", "GAGAL_DIPERBAIKI", "DONE"];

// Config status penyiapan (dipakai kartu prep + slide)
const PREP_CONFIG = {
  MENUNGGU: { label: "Menunggu", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", gradient: "from-amber-500 to-amber-600", desc: "Menunggu diproses" },
  DIPROSES: { label: "Diproses", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", gradient: "from-blue-500 to-blue-600", desc: "Sedang disiapkan" },
  SELESAI: { label: "Selesai", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", gradient: "from-emerald-500 to-emerald-600", desc: "Penyiapan selesai" },
};

// ── 6 fase slide untuk mode Perbesar ──
const SLIDES = [
  { key: "svc-antrian", source: "service", title: "Antrian Servis", sub: "Menunggu giliran dikerjakan", statuses: ["ANTRIAN"] },
  { key: "svc-dikerjakan", source: "service", title: "Servis Dikerjakan", sub: "Sedang dalam proses perbaikan", statuses: ["SEDANG_DIKERJAKAN", "MENUNGGU_SPAREPART"] },
  { key: "svc-selesai", source: "service", title: "Servis Selesai", sub: "Laptop siap diambil", statuses: ["DONE"] },
  { key: "prep-menunggu", source: "prep", title: "Penyiapan Menunggu", sub: "Pesanan menunggu diproses", statuses: ["MENUNGGU"] },
  { key: "prep-diproses", source: "prep", title: "Penyiapan Diproses", sub: "Pesanan sedang disiapkan", statuses: ["DIPROSES"] },
  { key: "prep-selesai", source: "prep", title: "Penyiapan Selesai", sub: "Pesanan siap dikirim/diambil", statuses: ["SELESAI"] },
];

const SLIDE_MS = 30_000;

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.text} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PrepBadge({ status }) {
  const cfg = PREP_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.text} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}
function formatJam(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", ".");
}

// Jam sekarang, update tiap detik → durasi timeline jalan live
function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(t);
  }, [tickMs]);
  return now;
}
function formatDurasi(ms) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return null;
  const totalDetik = Math.floor(ms / 1000);
  const jam = Math.floor(totalDetik / 3600);
  const menit = Math.floor((totalDetik % 3600) / 60);
  const detik = totalDetik % 60;
  return jam > 0 ? `${jam}j ${menit}m ${detik}d` : `${menit}m ${detik}d`;
}

const STAGE_INDEX = { ANTRIAN: 0, SEDANG_DIKERJAKAN: 1, MENUNGGU_SPAREPART: 1, DONE: 2, GAGAL_DIPERBAIKI: 2 };

function TimelineDot({ variant, children }) {
  const style = {
    done: "bg-emerald-500 text-white",
    active: "bg-blue-500 text-white ring-4 ring-blue-100",
    sparepart: "bg-orange-500 text-white ring-4 ring-orange-100",
    fail: "bg-rose-500 text-white ring-4 ring-rose-100",
    pending: "bg-surface border-2 border-slate-300",
  }[variant];
  return <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${style}`}>{children}</div>;
}

function ServiceTimeline({ order, now }) {
  const activeIdx = STAGE_INDEX[order.status] ?? 0;
  const isGagal = order.status === "GAGAL_DIPERBAIKI";
  const isSparepart = order.status === "MENUNGGU_SPAREPART";

  const tMasuk = order.tanggal_masuk ? new Date(order.tanggal_masuk).getTime() : null;
  const tMulai = order.tanggal_mulai ? new Date(order.tanggal_mulai).getTime() : null;
  const tSelesai = order.tanggal_selesai ? new Date(order.tanggal_selesai).getTime() : null;
  const durMenunggu = tMasuk != null ? (tMulai ?? now) - tMasuk : null;
  const durDikerjakan = tMulai != null ? (tSelesai ?? now) - tMulai : null;

  const nodes = [
    { label: "Menunggu dikerjakan", sub: null, time: formatDurasi(durMenunggu), prefix: "nunggu" },
    { label: "Dikerjakan", sub: order.teknisi ? `oleh ${order.teknisi}` : null, time: formatDurasi(durDikerjakan), prefix: "proses" },
    { label: isGagal ? "Gagal diperbaiki" : "Selesai", sub: null, time: formatJam(order.tanggal_selesai), prefix: isGagal ? "" : "selesai" },
  ];

  const variantFor = (i) => {
    if (i < activeIdx) return "done";
    if (i === activeIdx) {
      if (isGagal && i === 2) return "fail";
      if (isSparepart && i === 1) return "sparepart";
      return "active";
    }
    return "pending";
  };

  return (
    <div className="flex items-start mt-3">
      {nodes.map((node, i) => {
        const v = variantFor(i);
        const reached = i <= activeIdx;
        return (
          <div key={i} className="flex-1 relative flex flex-col items-center text-center px-1">
            {i > 0 && <div className={`absolute top-3 -left-1/2 w-full h-0.5 ${i <= activeIdx ? "bg-blue-500" : "bg-slate-200"}`} />}
            <TimelineDot variant={v}>
              {v === "done" ? <Check size={14} /> : v === "fail" ? <AlertCircle size={13} /> : v === "sparepart" ? <Package size={12} /> : v === "active" ? <Wrench size={12} /> : null}
            </TimelineDot>
            <p className={`mt-2 text-[11px] font-semibold leading-tight ${reached ? "text-content" : "text-content-muted"}`}>{node.label}</p>
            {node.sub && <p className="text-[11px] text-blue-600 leading-tight">{node.sub}</p>}
            {i === 1 && isSparepart && <span className="mt-0.5 text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-semibold">Tunggu sparepart</span>}
            <p className="mt-0.5 text-[10px] text-content-muted font-mono">{node.time ? `${node.prefix} ${node.time}`.trim() : "—"}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── Kartu Service (dipakai normal view & slide) ──
function ServiceRow({ order, now, isNew, big = false }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.ANTRIAN;
  return (
    <div className={`${big ? "px-6 py-5" : "px-5 py-4"} transition-colors ${cfg.rowBg} ${isNew ? "bg-blue-50/60" : ""}`}>
      <div className="flex items-center gap-3">
        <div className={`${big ? "w-12 h-12 text-lg" : "w-9 h-9 text-sm"} rounded-xl flex items-center justify-center flex-shrink-0 font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{order.no_urut}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className={`font-bold text-content ${big ? "text-lg" : "text-sm"}`}>{order.nama}</p>
            {isNew && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold animate-pulse">Baru</span>}
            {order.status === "DONE" && <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium"><Check className="w-3 h-3" aria-hidden="true" /> Silakan diambil</span>}
          </div>
          <p className={`${big ? "text-sm" : "text-xs"} text-content-muted truncate`}>
            {order.type_laptop}
            {order.keluhan && <span className="text-content-soft"> · {order.keluhan}</span>}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <ServiceTimeline order={order} now={now} />
    </div>
  );
}

// ── Kartu Penyiapan (ringkas, beda dari service) ──
function PrepRow({ order, big = false }) {
  const cfg = PREP_CONFIG[order.status] ?? PREP_CONFIG.MENUNGGU;
  return (
    <div className={`${big ? "px-6 py-5" : "px-5 py-4"} flex items-center gap-4 transition-colors hover:bg-slate-50/60`}>
      <div className={`${big ? "w-12 h-12" : "w-10 h-10"} rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
        <Truck size={big ? 22 : 18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className={`font-mono ${big ? "text-sm" : "text-xs"} font-bold text-content-soft`}>{order.order_number}</span>
          <span className={`${cfg.bg} ${cfg.text} border ${cfg.border} ${big ? "text-xs" : "text-[10px]"} font-bold px-2 py-0.5 rounded-lg`}>{order.qty} unit</span>
        </div>
        <p className={`font-bold text-content ${big ? "text-lg" : "text-sm"} truncate`}>{order.nama}</p>
        <p className={`${big ? "text-sm" : "text-xs"} text-content-muted truncate`}>
          {order.penyedia ? `Penyedia: ${order.penyedia}` : "—"}
          {order.no_hp && <span className="font-mono"> · {order.no_hp}</span>}
        </p>
      </div>
      <PrepBadge status={order.status} />
    </div>
  );
}

// ── SSE service — TIDAK DIUBAH ──
function useServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const esRef = useRef(null);
  const fallbackRef = useRef(null);
  const reconnectTimer = useRef(null);

  const startFallbackPolling = useCallback(() => {
    const poll = async () => {
      try {
        const res = await fetch(FALLBACK_URL);
        const json = await res.json();
        if (json.success) { setOrders(json.data ?? []); setLastUpdated(new Date()); setError(""); }
      } catch { setError("Koneksi bermasalah, mencoba lagi..."); }
      finally { setLoading(false); }
    };
    poll();
    fallbackRef.current = setInterval(poll, 15_000);
  }, []);

  const stopFallbackPolling = useCallback(() => {
    if (fallbackRef.current) { clearInterval(fallbackRef.current); fallbackRef.current = null; }
  }, []);

  const connectSSE = useCallback(() => {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    clearTimeout(reconnectTimer.current);
    if (typeof EventSource === "undefined") { startFallbackPolling(); return; }

    const es = new EventSource(STREAM_URL);
    esRef.current = es;
    const handleData = (e) => {
      try {
        const payload = JSON.parse(e.data);
        setOrders(payload.orders ?? []);
        setLastUpdated(new Date());
        setConnected(true);
        setLoading(false);
        setError("");
        stopFallbackPolling();
      } catch {}
    };
    es.addEventListener("init", handleData);
    es.addEventListener("update", handleData);
    es.addEventListener("error", () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      reconnectTimer.current = setTimeout(connectSSE, 10_000);
      if (!fallbackRef.current) startFallbackPolling();
    });
  }, [startFallbackPolling, stopFallbackPolling]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(FALLBACK_URL);
      const json = await res.json();
      if (json.success) { setOrders(json.data ?? []); setLastUpdated(new Date()); setError(""); }
    } catch { setError("Gagal memuat ulang data"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    connectSSE();
    return () => { esRef.current?.close(); stopFallbackPolling(); clearTimeout(reconnectTimer.current); };
  }, [connectSSE, stopFallbackPolling]);

  return { orders, loading, error, connected, lastUpdated, refresh };
}

// ── Polling penyiapan (15 detik) ──
function usePrepOrders() {
  const [prep, setPrep] = useState([]);
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch(PREP_URL);
        const json = await res.json();
        if (alive && json.success) setPrep(json.data ?? []);
      } catch {}
    };
    poll();
    const t = setInterval(poll, 15_000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return prep;
}

// ── Wake lock sederhana — layar TV tidak mati saat mode perbesar ──
function useWakeLock(active) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let lock = null;
    let released = false;
    const req = async () => { try { lock = await navigator.wakeLock.request("screen"); } catch {} };
    req();
    const onVis = () => { if (document.visibilityState === "visible" && !released) req(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { released = true; document.removeEventListener("visibilitychange", onVis); try { lock?.release(); } catch {} };
  }, [active]);
}

export default function CekAntrian() {
  const { orders, loading, error, connected, lastUpdated, refresh } = useServiceOrders();
  const prep = usePrepOrders();
  const [newIds, setNewIds] = useState(new Set());
  const [isVisible, setIsVisible] = useState({ hero: false, stats: false, content: false });
  const prevOrdersRef = useRef([]);
  const now = useNow();

  // Mode perbesar
  const [magnify, setMagnify] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const rootRef = useRef(null);
  useWakeLock(magnify);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setIsVisible((p) => ({ ...p, [entry.target.id]: true })); }),
      { threshold: 0.1 }
    );
    ["hero", "stats", "content"].forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prevNos = new Set(prevOrdersRef.current.map((o) => o.no_urut));
    const incoming = orders.filter((o) => !prevNos.has(o.no_urut)).map((o) => o.no_urut);
    if (incoming.length > 0) { setNewIds(new Set(incoming)); setTimeout(() => setNewIds(new Set()), 3000); }
    prevOrdersRef.current = orders;
  }, [orders]);

  // Grup service per status
  const grouped = useMemo(() => STATUS_ORDER.reduce((acc, s) => { acc[s] = orders.filter((o) => o.status === s); return acc; }, {}), [orders]);
  // Grup penyiapan per status
  const prepGrouped = useMemo(() => ({
    MENUNGGU: prep.filter((p) => p.status === "MENUNGGU"),
    DIPROSES: prep.filter((p) => p.status === "DIPROSES"),
    SELESAI: prep.filter((p) => p.status === "SELESAI"),
  }), [prep]);

  // Data per slide + buang slide kosong
  const slidesData = useMemo(() => {
    return SLIDES.map((s) => {
      const items = s.source === "service"
        ? orders.filter((o) => s.statuses.includes(o.status))
        : prep.filter((p) => s.statuses.includes(p.status));
      return { ...s, items };
    }).filter((s) => s.items.length > 0);
  }, [orders, prep]);

  // Auto-slide 30 detik (hanya saat perbesar & ada data)
  useEffect(() => {
    if (!magnify || slidesData.length === 0) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % slidesData.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [magnify, slidesData.length]);

  // Jaga slideIdx tetap valid saat jumlah slide berubah
  useEffect(() => {
    if (slideIdx >= slidesData.length) setSlideIdx(0);
  }, [slidesData.length, slideIdx]);

  // Fullscreen enter/exit + sinkron state kalau user tekan Esc
  const enterMagnify = useCallback(async () => {
    setSlideIdx(0);
    setMagnify(true);
    try { await rootRef.current?.requestFullscreen?.(); } catch {}
  }, []);
  const exitMagnify = useCallback(async () => {
    setMagnify(false);
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch {}
  }, []);
  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setMagnify(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const current = slidesData[slideIdx] ?? null;

  return (
    <div ref={rootRef} className="min-h-screen bg-surface-muted relative overflow-x-hidden">
      <Helmet>
        <title>Cek Antrian Servis & Penyiapan Realtime | Solit 03</title>
        <meta name="description" content="Pantau status antrian servis laptop & penyiapan pesanan Solit 03 secara realtime." />
        <link rel="canonical" href="https://solit03.com/cek-antrian" />
      </Helmet>

      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* ════ MODE PERBESAR (fullscreen display board) ════ */}
      {magnify ? (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}.slide-anim{animation:slideIn .5s cubic-bezier(.2,.9,.4,1.05)}`}</style>

          {/* Header slide */}
          {current ? (
            <>
              <div className={`h-2 bg-gradient-to-r ${current.source === "service" ? (STATUS_CONFIG[current.statuses[0]]?.gradient ?? "from-blue-500 to-blue-600") : (PREP_CONFIG[current.statuses[0]]?.gradient ?? "from-blue-500 to-blue-600")}`} />
              <div className="px-10 pt-7 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${current.source === "service" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-violet-50 text-violet-700 border-violet-200"}`}>
                    {current.source === "service" ? <Wrench size={15} /> : <Truck size={15} />}
                    {current.source === "service" ? "SERVIS" : "PENYIAPAN"}
                  </span>
                  <div>
                    <h1 className="text-3xl font-black text-content leading-tight">{current.title}</h1>
                    <p className="text-sm text-content-muted">{current.sub} · {current.items.length} data</p>
                  </div>
                </div>
                <button onClick={exitMagnify} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-content-soft text-sm font-semibold transition">
                  <X size={16} /> Keluar
                </button>
              </div>

              {/* Konten slide */}
              <div key={current.key} className="slide-anim flex-1 overflow-y-auto px-10 pb-6">
                <div className="bg-surface rounded-2xl border border-border shadow-soft overflow-hidden divide-y divide-slate-100 max-w-5xl mx-auto">
                  {current.source === "service"
                    ? current.items.map((o) => <ServiceRow key={o.no_urut} order={o} now={now} isNew={newIds.has(o.no_urut)} big />)
                    : current.items.map((o) => <PrepRow key={o.order_number} order={o} big />)}
                </div>
              </div>

              {/* Indikator slide + progress */}
              <div className="px-10 py-4 border-t border-border flex items-center justify-center gap-2">
                {slidesData.map((s, i) => (
                  <div key={s.key} className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIdx ? "w-10 bg-blue-500" : "w-4 bg-slate-300"}`} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ClipboardList size={48} className="text-slate-300 mb-4" />
              <p className="text-xl font-bold text-content-soft">Belum ada data</p>
              <p className="text-content-muted mt-1">Antrian servis & penyiapan kosong saat ini</p>
              <button onClick={exitMagnify} className="mt-6 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-content-soft font-semibold">Keluar</button>
            </div>
          )}
        </div>
      ) : (
      /* ════ MODE NORMAL ════ */
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <style>{`@keyframes fadeSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.animate-fadeSlideUp{animation:fadeSlideUp .6s cubic-bezier(0.2,0.9,0.4,1.1) forwards}`}</style>

        <div id="hero" className={`text-center mb-10 transition-all duration-700 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="eyebrow"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Official Solit 03</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-content mt-5">Antrian <span className="text-blue-600">Servis</span> & Penyiapan</h1>
          <p className="text-sm md:text-base text-content-muted max-w-2xl mx-auto mt-4">Pantau status servis laptop & penyiapan pesanan secara <span className="font-semibold text-blue-600">real-time</span>.</p>

          {/* Tombol Perbesar */}
          <button onClick={enterMagnify} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all">
            <Maximize2 size={16} /> Perbesar (Mode Display)
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            <span className="text-xs text-content-muted">{connected ? "Terhubung real-time" : "Mode polling"}</span>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && <span className="text-[11px] text-content-muted font-mono">Update: {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>}
            <button onClick={refresh} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-content-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-border transition disabled:opacity-40">
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-5"><AlertCircle size={14} /> {error}</div>}

        <div id="content" className={`transition-all duration-500 delay-200 ${isVisible.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* ─── SECTION: SERVIS ─── */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border bg-blue-50 text-blue-700 border-blue-200"><Wrench size={15} /> SERVIS</span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
          </div>

          {loading && orders.length === 0 && (
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-soft-sm animate-pulse mb-8"><div className="h-20 bg-gradient-to-r from-slate-200 to-slate-100" /><div className="p-6 space-y-4"><div className="h-5 bg-slate-200 rounded w-3/4" /><div className="h-5 bg-slate-200 rounded w-1/2" /></div></div>
          )}

          {!loading && orders.length === 0 && (
            <div className="bg-surface rounded-2xl border border-border shadow-soft p-10 text-center mb-8"><Wrench size={28} className="text-blue-400 mx-auto mb-3" /><p className="text-content-soft font-bold">Belum ada antrian servis</p></div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-5 mb-10">
              {STATUS_ORDER.map((status) => {
                const items = grouped[status];
                if (!items || items.length === 0) return null;
                const cfg = STATUS_CONFIG[status];
                return (
                  <div key={status} className="animate-fadeSlideUp">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
                        <span className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${cfg.badgeBg}`}>{items.length}</span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                    </div>
                    <div className="bg-surface rounded-2xl border border-border shadow-soft overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${cfg.gradient}`} />
                      <div className="divide-y divide-slate-100">
                        {items.map((order) => <ServiceRow key={order.no_urut} order={order} now={now} isNew={newIds.has(order.no_urut)} />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── SECTION: PENYIAPAN ─── */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border bg-violet-50 text-violet-700 border-violet-200"><Truck size={15} /> PENYIAPAN</span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
          </div>

          {prep.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border shadow-soft p-10 text-center"><Truck size={28} className="text-violet-400 mx-auto mb-3" /><p className="text-content-soft font-bold">Belum ada penyiapan</p></div>
          ) : (
            <div className="space-y-5">
              {["MENUNGGU", "DIPROSES", "SELESAI"].map((status) => {
                const items = prepGrouped[status];
                if (!items || items.length === 0) return null;
                const cfg = PREP_CONFIG[status];
                return (
                  <div key={status} className="animate-fadeSlideUp">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
                        <span className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-white/60">{items.length}</span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                    </div>
                    <div className="bg-surface rounded-2xl border border-border shadow-soft overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${cfg.gradient}`} />
                      <div className="divide-y divide-slate-100">
                        {items.map((order) => <PrepRow key={order.order_number} order={order} />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}