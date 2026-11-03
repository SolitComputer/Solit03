import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Wrench, Clock, Package, RefreshCw, AlertCircle, Check, Maximize2, X, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import mascotImg from "../assets/solit-mascot.png";

const POS_BASE = "https://pos.solit.id";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const SERVICE_URL = `${POS_BASE}/api/service/public`;
const PREP_URL = `${POS_BASE}/api/preparation/public`;

const SLIDE_MS = 10_000;   // durasi tiap halaman di mode Perbesar
const PER_PAGE = 4;        // customer per layar

// ── Teks berjalan di bawah Mode Display — EDIT isinya di sini ──
const RUNNING_TEXT = [
  "SOLIT 03 — Jual Beli & Service Laptop Second Terpercaya di Depok",
  "Buka Setiap Hari 08.00–22.00 WIB (khusus Selasa mulai 10.00)",
  "Alamat: Kav Adikarya No.77, Rangkapan Jaya, Pancoran Mas, Depok 16435",
  "WhatsApp: 0852-1064-7047",
  "Garansi Resmi • Laptop Second  • Harga Murah",
].join("   •   ");

// ── util waktu ──
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
  const s = Math.floor(v / 1000), j = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), d = s % 60;
  return j > 0 ? `${j}j ${m}m ${d}d` : `${m}m ${d}d`;
}
function formatJam(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", ".");
}

// ── normalisasi penyiapan & service ke bentuk kartu yang sama ──
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
  };
}

// warna per fase aktif
const STEP_STYLE = [
  { bar: "#EF9F27", badgeBg: "bg-amber-50 dark:bg-amber-500/15", badgeText: "text-amber-700 dark:text-amber-300", icon: Clock },     // menunggu
  { bar: "#378ADD", badgeBg: "bg-blue-50 dark:bg-blue-500/15", badgeText: "text-blue-700 dark:text-blue-300", icon: Package },        // diproses
  { bar: "#1D9E75", badgeBg: "bg-emerald-50 dark:bg-emerald-500/15", badgeText: "text-emerald-700 dark:text-emerald-300", icon: Check }, // selesai
];

// Warna kartu ringkasan per fase (full string — jangan dirangkai template literal)
const SUMMARY_TONE = [
  "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300",
  "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300",
  "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
];

// ── Dot progress 3 titik ──
function Dot({ state }) {
  const cls = {
    done: "bg-emerald-500 text-white",
    active1: "bg-amber-500 ring-4 ring-amber-100",
    active2: "bg-blue-500 ring-4 ring-blue-100",
    active3: "bg-emerald-500 ring-4 ring-emerald-100 text-white",
    pending: "bg-surface border-2 border-slate-300",
  }[state];
  return (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>
      {(state === "done" || state === "active3") && <Check size={9} />}
    </div>
  );
}

// ── Kartu utama (dipakai normal & perbesar) ──
function PhaseCard({ n, big = false }) {
  const st = STEP_STYLE[n.step] ?? STEP_STYLE[0];
  const Icon = st.icon;
  const badgeDur =
    n.step === 0 ? formatDurasi(n.dur1) :
    n.step === 1 ? formatDurasi(n.dur2) :
    formatJam(n.doneTime);
  const badgeLabel = n.labels[n.step];

  const dotState = (i) => {
    if (i < n.step) return "done";
    if (i === n.step) return ["active1", "active2", "active3"][i];
    return "pending";
  };
  const line = (i) => (i < n.step ? (n.step === 2 ? "bg-emerald-500" : "bg-blue-500") : "bg-slate-200");

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div style={{ height: 5, background: st.bar }} />
      <div className={big ? "p-4" : "p-3.5"}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[11px] font-semibold text-content-muted">{n.orderNo}</span>
          <span className={`inline-flex items-center gap-1 ${st.badgeBg} ${st.badgeText} text-[11px] font-semibold px-2 py-0.5 rounded-full`}>
            <Icon size={12} /> {badgeLabel}{badgeDur ? ` · ${badgeDur}` : ""}
          </span>
        </div>

        <p className={`font-bold text-content leading-tight ${big ? "text-lg" : "text-base"}`}>{n.nama}</p>
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

        {/* progress 3 titik */}
        <div className="flex items-center gap-1 mt-3">
          <Dot state={dotState(0)} />
          <div className={`flex-1 h-0.5 rounded ${line(0)}`} />
          <Dot state={dotState(1)} />
          <div className={`flex-1 h-0.5 rounded ${line(1)}`} />
          <Dot state={dotState(2)} />
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

// ── Data hooks ──
function useServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null), fbRef = useRef(null), rcRef = useRef(null);

  const startPoll = useCallback(() => {
    const poll = async () => {
      try { const r = await fetch(SERVICE_URL); const j = await r.json(); if (j.success) setOrders(j.data ?? []); } catch {}
    };
    poll(); fbRef.current = setInterval(poll, 15_000);
  }, []);
  const stopPoll = useCallback(() => { if (fbRef.current) { clearInterval(fbRef.current); fbRef.current = null; } }, []);

  const connect = useCallback(() => {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    clearTimeout(rcRef.current);
    if (typeof EventSource === "undefined") { startPoll(); return; }
    const es = new EventSource(STREAM_URL); esRef.current = es;
    const onData = (e) => { try { const p = JSON.parse(e.data); setOrders(p.orders ?? []); setConnected(true); stopPoll(); } catch {} };
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
    const poll = async () => { try { const r = await fetch(PREP_URL); const j = await r.json(); if (alive && j.success) setPrep(j.data ?? []); } catch {} };
    poll(); const t = setInterval(poll, 15_000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return prep;
}

function useWakeLock(active) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let lock = null, released = false;
    const req = async () => { try { lock = await navigator.wakeLock.request("screen"); } catch {} };
    req();
    const onVis = () => { if (document.visibilityState === "visible" && !released) req(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { released = true; document.removeEventListener("visibilitychange", onVis); try { lock?.release(); } catch {} };
  }, [active]);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function CekAntrian() {
  const { orders, connected } = useServiceOrders();
  const prep = usePrepOrders();
  const now = useNow();

  const [magnify, setMagnify] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const rootRef = useRef(null);
  useWakeLock(magnify);

  // normalisasi + urut terbaru dulu
  const prepCards = useMemo(() =>
    prep.map((o) => normPrep(o, now)).sort((a, b) => b.sortTs - a.sortTs), [prep, now]);
  const svcCards = useMemo(() =>
    orders.map((o) => normSvc(o, now)).sort((a, b) => b.sortTs - a.sortTs), [orders, now]);

  // halaman mode Perbesar: penyiapan dulu (chunk 4), lalu service (chunk 4)
  const pages = useMemo(() => {
    const p = [];
    chunk(prepCards, PER_PAGE).forEach((items, i, arr) =>
      p.push({ key: `prep-${i}`, source: "prep", title: "Penyiapan Barang", items, no: i + 1, total: arr.length }));
    chunk(svcCards, PER_PAGE).forEach((items, i, arr) =>
      p.push({ key: `svc-${i}`, source: "service", title: "Antrian Service", items, no: i + 1, total: arr.length }));
    return p;
  }, [prepCards, svcCards]);

  useEffect(() => {
    if (!magnify || pages.length === 0) return;
    const t = setInterval(() => setPageIdx((i) => (i + 1) % pages.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [magnify, pages.length]);
  useEffect(() => { if (pageIdx >= pages.length) setPageIdx(0); }, [pages.length, pageIdx]);

  const enter = useCallback(async () => {
    setPageIdx(0); setMagnify(true);
    try { await rootRef.current?.requestFullscreen?.(); } catch {}
  }, []);
  const exit = useCallback(async () => {
    setMagnify(false);
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch {}
  }, []);
  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setMagnify(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const cur = pages[pageIdx] ?? null;
  const curCards = cur ? (cur.source === "prep" ? prepCards : svcCards) : [];
  const summaryCounts = [0, 1, 2].map((s) => curCards.filter((c) => c.step === s).length);
  const summaryLabels = cur?.source === "prep"
    ? ["Menunggu disiapkan", "Disiapkan", "Selesai"]
    : ["Menunggu dikerjakan", "Dikerjakan", "Selesai"];

  return (
    <div ref={rootRef} className="min-h-screen bg-surface-muted relative overflow-x-hidden">
      <Helmet>
        <title>Cek Antrian Servis & Penyiapan | Solit 03</title>
        <meta name="description" content="Pantau status servis & penyiapan pesanan Solit 03 secara realtime." />
        <link rel="canonical" href="https://solit03.com/cek-antrian" />
      </Helmet>

      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* ════ MODE PERBESAR ════ */}
      {magnify ? (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col">
          <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}.pg-anim{animation:slideIn .45s cubic-bezier(.2,.9,.4,1.05)}`}</style>

          {/* Maskot — 1 saja, muncul di Mode Display, pojok kiri-bawah */}
          <img
            src={mascotImg}
            alt="Maskot Solit 03"
            className="absolute bottom-12 left-0 w-40 sm:w-52 lg:w-64 xl:w-72 h-auto pointer-events-none select-none drop-shadow-xl z-0"
            draggable={false}
          />
          {cur ? (
            <>
              <div style={{ height: 6, background: cur.source === "prep" ? "#534AB7" : "#378ADD" }} />
              <div className="relative px-10 pt-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${cur.source === "prep" ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"}`}>
                    {cur.source === "prep" ? <Truck size={15} /> : <Wrench size={15} />}
                    {cur.title}
                  </span>
                  <span className="text-sm text-content-muted">Halaman {cur.no} / {cur.total}</span>
                </div>
                <button onClick={exit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-content-soft text-sm font-semibold transition">
                  <X size={16} /> Keluar
                </button>
              </div>

              <div className="px-10 pb-3">
                <div className="grid grid-cols-3 gap-3 max-w-6xl mx-auto">
                  {summaryCounts.map((cnt, i) => (
                    <div key={i} className={`rounded-xl border px-4 py-2.5 flex items-center justify-between ${SUMMARY_TONE[i]}`}>
                      <span className="text-sm font-medium">{summaryLabels[i]}</span>
                      <span className="text-2xl font-black leading-none">{cnt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div key={cur.key} className="pg-anim flex-1 overflow-hidden px-10 pb-4">
                <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
                  {cur.items.map((n) => <PhaseCard key={n.key} n={n} big />)}
                </div>
              </div>

              <div className="px-10 py-4 border-t border-border flex items-center justify-center gap-2">
                {pages.map((p, i) => (
                  <div key={p.key} className={`h-1.5 rounded-full transition-all duration-300 ${i === pageIdx ? "w-10 bg-blue-500" : "w-4 bg-slate-300"}`} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <p className="text-2xl font-black text-content">Belum ada antrian hari ini</p>
              <p className="text-sm text-content-muted mt-2">Papan akan update otomatis begitu ada servis atau penyiapan masuk.</p>
              <button onClick={exit} className="mt-6 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-content-soft font-semibold">Keluar</button>
            </div>
          )}

          {/* ── Running text info toko (paling bawah Mode Display) ── */}
          <div className="relative z-10 shrink-0 overflow-hidden border-t border-border bg-blue-600">
            <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.marquee-track{display:inline-flex;white-space:nowrap;animation:marquee 30s linear infinite}`}</style>
            <div className="marquee-track py-2.5">
              <span className="px-8 text-sm font-semibold text-white">{RUNNING_TEXT}</span>
              <span className="px-8 text-sm font-semibold text-white">{RUNNING_TEXT}</span>
            </div>
          </div>
        </div>
      ) : ( 
      /* ════ MODE NORMAL ════ */
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