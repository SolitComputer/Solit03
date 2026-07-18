import { useState, useEffect, useCallback, useRef } from "react";
import { Wrench, Clock, CheckCircle, Package, RefreshCw, Search, AlertCircle } from "lucide-react";

const POS_BASE = "https://solit-pos.store";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const FALLBACK_URL = `${POS_BASE}/api/service/public`;

const STATUS_CONFIG = {
  ANTRIAN: {
    label: "Antrian",
    icon: <Clock size={13} />,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
    rowBg: "hover:bg-amber-50/40",
    desc: "Menunggu giliran dikerjakan",
    gradient: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-100",
  },
  SEDANG_DIKERJAKAN: {
    label: "Dikerjakan",
    icon: <Wrench size={13} />,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
    rowBg: "hover:bg-blue-50/40",
    desc: "Sedang dalam proses perbaikan",
    gradient: "from-blue-500 to-indigo-500",
    badgeBg: "bg-blue-100",
  },
  MENUNGGU_SPAREPART: {
    label: "Tunggu Sparepart",
    icon: <Package size={13} />,
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-400",
    rowBg: "hover:bg-orange-50/40",
    desc: "Menunggu komponen tiba",
    gradient: "from-orange-500 to-red-400",
    badgeBg: "bg-orange-100",
  },
  DONE: {
    label: "Selesai",
    icon: <CheckCircle size={13} />,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    rowBg: "hover:bg-emerald-50/40",
    desc: "Laptop selesai, silakan diambil",
    gradient: "from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-100",
  },
};

const STATUS_ORDER = ["ANTRIAN", "SEDANG_DIKERJAKAN", "MENUNGGU_SPAREPART", "DONE"];

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

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

// ── SSE + fallback hook — TIDAK DIUBAH ──────────────────────────────────────
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
        if (json.success) {
          setOrders(json.data ?? []);
          setLastUpdated(new Date());
          setError("");
        }
      } catch {
        setError("Koneksi bermasalah, mencoba lagi...");
      } finally {
        setLoading(false);
      }
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
    return () => {
      esRef.current?.close();
      stopFallbackPolling();
      clearTimeout(reconnectTimer.current);
    };
  }, [connectSSE, stopFallbackPolling]);

  return { orders, loading, error, connected, lastUpdated, refresh };
}

// ── Komponen Utama ───────────────────────────────────────────────────────────
export default function CekAntrian() {
  const { orders, loading, error, connected, lastUpdated, refresh } = useServiceOrders();
  const [search, setSearch] = useState("");
  const [newIds, setNewIds] = useState(new Set());
  const [isVisible, setIsVisible] = useState({ hero: false, stats: false, content: false, cta: false });
  const prevOrdersRef = useRef([]);

  // ── Intersection observer — sama persis dengan CekGaransi ─────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    ["hero", "stats", "content", "cta"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // ── New order highlight logic — TIDAK DIUBAH ─────────────────────────────
  useEffect(() => {
    const prevNos = new Set(prevOrdersRef.current.map((o) => o.no_urut));
    const incoming = orders.filter((o) => !prevNos.has(o.no_urut)).map((o) => o.no_urut);
    if (incoming.length > 0) {
      setNewIds(new Set(incoming));
      setTimeout(() => setNewIds(new Set()), 3000);
    }
    prevOrdersRef.current = orders;
  }, [orders]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      o.nama.toLowerCase().includes(q) ||
      o.type_laptop.toLowerCase().includes(q) ||
      String(o.no_urut).includes(q)
    );
  });

  const grouped = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = filtered.filter((o) => o.status === s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 relative overflow-x-hidden">
      {/* ── Dot grid background — identik CekGaransi ── */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .animate-fadeSlideUp { animation: fadeSlideUp 0.6s cubic-bezier(0.2,0.9,0.4,1.1) forwards; }
          .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
          .animate-float { animation: float 5s ease-in-out infinite; }
        `}</style>

        {/* ── Hero — identik struktur CekGaransi ── */}
        <div
          id="hero"
          className={`text-center mb-12 transition-all duration-700 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Brand pill */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-blue-100/80 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-semibold text-blue-700 tracking-wider uppercase">Official Solit 03</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-gray-800">Antrian </span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Servis</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Pantau status perbaikan laptop kamu secara{" "}
            <span className="font-semibold text-blue-600">real-time</span> tanpa perlu menunggu di tempat.
          </p>

          {/* Decorative divider — identik CekGaransi */}
          <div className="flex justify-center gap-3 mt-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full" />
            <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-400 to-transparent rounded-full" />
          </div>

          {/* Floating decorations */}
          <div className="absolute left-8 top-24 opacity-30 hidden lg:block animate-float">
            <svg className="w-14 h-14 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="absolute right-8 bottom-24 opacity-30 hidden lg:block animate-float" style={{ animationDelay: "2.5s" }}>
            <svg className="w-12 h-12 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* ── Search + Refresh card — gaya CekGaransi ── */}
        <div
          id="stats"
          className={`transition-all duration-500 delay-100 ${isVisible.stats ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 mb-8">
            {/* Search input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Antrian</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, nomor urut, atau tipe laptop..."
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200/80 rounded-xl text-gray-800 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white/60"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <span className="inline-block w-4 h-4 bg-blue-100 rounded-full text-center text-blue-600 text-[10px] font-bold">i</span>
                Data diperbarui otomatis secara real-time via SSE.
              </p>
            </div>

            {/* Stats grid — 4 kolom, gaya card CekGaransi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATUS_ORDER.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const count = orders.filter((o) => o.status === s).length;
                return (
                  <div
                    key={s}
                    className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border} transition-all hover:shadow-md hover:-translate-y-0.5 duration-300`}
                  >
                    <div className={`flex items-center gap-1.5 mb-2 ${cfg.text}`}>
                      {cfg.icon}
                      <span className="text-[11px] font-semibold truncate">{cfg.label}</span>
                    </div>
                    <p className={`text-3xl font-black ${cfg.text}`}>{count}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{cfg.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-5">
            <AlertCircle size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Toolbar: refresh + last updated ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
            <span className="text-xs text-gray-400">{connected ? "Terhubung real-time" : "Mode polling"}</span>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[11px] text-gray-400 font-mono">
                Update: {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-200 transition disabled:opacity-40"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div
          id="content"
          className={`transition-all duration-500 delay-200 ${isVisible.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Loading skeleton — gaya CekGaransi */}
          {loading && orders.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 overflow-hidden shadow-sm animate-pulse">
              <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-100" />
              <div className="p-6 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && !error && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-12 text-center animate-fadeSlideUp">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench size={28} className="text-blue-400" />
              </div>
              <p className="text-gray-700 font-bold text-base">
                {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada antrian servis"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {search ? "Coba kata kunci lain" : "Data akan muncul otomatis saat ada order masuk"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          )}

          {/* ── Order groups ── */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-6">
              {STATUS_ORDER.map((status) => {
                const items = grouped[status];
                if (items.length === 0) return null;
                const cfg = STATUS_CONFIG[status];

                return (
                  <div key={status} className="animate-fadeSlideUp">
                    {/* Group header — gaya section divider CekGaransi */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                        <span className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${cfg.badgeBg}`}>
                          {items.length}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                      <span className="text-[10px] text-gray-400 hidden sm:block">{cfg.desc}</span>
                    </div>

                    {/* Card container — gaya CekGaransi */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Colored top bar */}
                      <div className={`h-1 bg-gradient-to-r ${cfg.gradient}`} />

                      {items.length > 3 ? (
                        // Table view untuk >3 item
                        <div className="divide-y divide-gray-50/80">
                          <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50/60">
                            <span className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">No</span>
                            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase">Nama</span>
                            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase">Laptop</span>
                            <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase text-right">Masuk</span>
                          </div>
                          {items.map((order) => {
                            const isNew = newIds.has(order.no_urut);
                            return (
                              <div
                                key={order.no_urut}
                                className={`grid grid-cols-12 gap-2 px-5 py-3 items-center transition-colors ${cfg.rowBg} ${isNew ? "bg-blue-50/60" : ""}`}
                              >
                                <div className="col-span-1">
                                  <span className={`inline-flex w-7 h-7 rounded-lg items-center justify-center text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                    {order.no_urut}
                                  </span>
                                </div>
                                <div className="col-span-4 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{order.nama}</p>
                                  {isNew && (
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">Baru</span>
                                  )}
                                </div>
                                <div className="col-span-4 min-w-0">
                                  <p className="text-xs text-gray-600 truncate">{order.type_laptop}</p>
                                </div>
                                <div className="col-span-3 text-right">
                                  <p className="text-[11px] text-gray-400 font-mono">
                                    {new Date(order.tanggal_masuk).toLocaleString("id-ID", {
                                      day: "2-digit", month: "short",
                                      hour: "2-digit", minute: "2-digit", hour12: false,
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Card view untuk ≤3 item
                        <div className="divide-y divide-gray-50/80">
                          {items.map((order) => {
                            const isNew = newIds.has(order.no_urut);
                            return (
                              <div
                                key={order.no_urut}
                                className={`px-5 py-4 flex items-center gap-4 transition-colors ${cfg.rowBg} ${isNew ? "bg-blue-50/60" : ""}`}
                              >
                                {/* Nomor urut */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm border shadow-sm ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                  {order.no_urut}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                    <p className="font-bold text-gray-800 text-sm">{order.nama}</p>
                                    {isNew && (
                                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold animate-pulse">
                                        Baru
                                      </span>
                                    )}
                                    {status === "DONE" && (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                        ✓ Silakan diambil
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 truncate">{order.type_laptop}</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                                    Masuk {formatDate(order.tanggal_masuk)}
                                    {order.tanggal_selesai && (
                                      <span className="ml-2 text-emerald-600">· Selesai {formatDate(order.tanggal_selesai)}</span>
                                    )}
                                  </p>
                                </div>

                                {/* Badge */}
                                <StatusBadge status={status} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Info cards — identik dengan CekGaransi ── */}
        {!loading && filtered.length === 0 && !search && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { icon: "🔢", title: "Temukan Nomor Urut", desc: "Nomor antrian diberikan saat laptop diterima oleh teknisi", bg: "from-blue-50 to-blue-100/50" },
              { icon: "📡", title: "Update Real-Time", desc: "Status berubah otomatis tanpa perlu refresh halaman", bg: "from-indigo-50 to-indigo-100/50" },
              { icon: "🔧", title: "Pantau Progress", desc: "Lihat antrian, dikerjakan, tunggu sparepart, atau selesai", bg: "from-emerald-50 to-emerald-100/50" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.bg} rounded-2xl border border-white/60 shadow-sm p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 duration-300 backdrop-blur-sm`}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-md font-bold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA WhatsApp — identik CekGaransi ── */}
        <div
          id="cta"
          className={`text-center mt-16 transition-all duration-500 delay-300 ${isVisible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition duration-500" />
            <a
              href="https://wa.me/6289680400022?text=Halo%20Solit%2003%2C%20saya%20ingin%20bertanya%20tentang%20status%20servis%20laptop%20saya."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="relative w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
              </svg>
              <span className="relative">Hubungi Kami via WhatsApp</span>
              <svg className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-4 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            <p className="text-xs text-gray-400">Atau hubungi langsung:</p>
            <a
              href="https://wa.me/6289680400022"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-green-600 hover:text-green-700 font-medium hover:underline transition"
            >
              +62 896-8040-0022
            </a>
            <div className="h-4 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          </div>
        </div>

        {/* ── Footer dots — identik CekGaransi ── */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-50 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}