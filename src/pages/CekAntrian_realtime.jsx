import { useState, useEffect, useCallback, useRef } from "react";
import { Wrench, Clock, CheckCircle, Package, RefreshCw, Search, WifiOff, AlertCircle } from "lucide-react";

const POS_BASE = "https://solit-pos.vercel.app";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const FALLBACK_URL = `${POS_BASE}/api/service/public`;

const STATUS_CONFIG = {
  ANTRIAN: {
    label: "Antrian",
    icon: <Clock size={13} />,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
    rowBg: "hover:bg-yellow-50/40",
    desc: "Menunggu giliran dikerjakan",
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
  },
};

const STATUS_ORDER = ["ANTRIAN", "SEDANG_DIKERJAKAN", "MENUNGGU_SPAREPART", "DONE"];

// ── Badge compact ─────────────────────────────────────────────────────────────
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

// ── SSE + fallback hook ───────────────────────────────────────────────────────
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

// ── Komponen utama ────────────────────────────────────────────────────────────
export default function CekAntrian() {
  const { orders, loading, error, connected, lastUpdated, refresh } = useServiceOrders();
  const [search, setSearch] = useState("");
  const [newIds, setNewIds] = useState(new Set());
  const prevOrdersRef = useRef([]);

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

  const totalAktif = orders.filter(o => o.status !== "DONE").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero — lebih soft ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-6">

          {/* Brand */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Wrench size={15} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 leading-none">Solit 03</p>
              <p className="text-[11px] text-gray-400 leading-none mt-0.5">Service Center</p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-1">
            Cek Antrian Servis
          </h1>
          <p className="text-sm text-gray-500 mb-5">
            Pantau status perbaikan laptop kamu secara real-time.
          </p>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, nomor, atau tipe laptop..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e] transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Stats bar — di bawah header, border atas ── */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="grid grid-cols-4 gap-2">
            {STATUS_ORDER.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const count = orders.filter((o) => o.status === s).length;
              return (
                <div key={s} className={`rounded-xl px-3 py-2.5 border ${cfg.bg} ${cfg.border}`}>
                  <div className={`flex items-center gap-1 mb-1 ${cfg.text}`}>
                    {cfg.icon}
                    <span className="text-[10px] font-semibold truncate">{cfg.label}</span>
                  </div>
                  <p className={`text-2xl font-black ${cfg.text}`}>{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">

        {/* Status bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-edium text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100 rounded-lg transition disabled:opacity-40"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl">
            <AlertCircle size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && orders.length === 0 && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                  <div className="h-2.5 w-40 bg-gray-100 rounded" />
                </div>
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Wrench size={22} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold text-sm">
              {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada antrian servis"}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {search ? "Coba kata kunci lain" : "Data akan muncul otomatis saat ada order masuk"}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-3 text-xs text-blue-600 hover:underline">
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
                <div key={status}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${cfg.text}`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                      {items.length}
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-gray-400">{cfg.desc}</span>
                  </div>

                  {/* ── Compact table untuk banyak item ── */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {items.length > 3 ? (
                      // Table view — untuk >3 item supaya tidak terlalu panjang
                      <div className="divide-y divide-gray-50">
                        {/* Table header */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
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
                              className={`grid grid-cols-12 gap-2 px-4 py-2.5 items-center transition ${cfg.rowBg} ${isNew ? "bg-blue-50/60" : ""}`}
                            >
                              <div className="col-span-1">
                                <span className={`inline-flex w-7 h-7 rounded-lg items-center justify-center text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                  {order.no_urut}
                                </span>
                              </div>
                              <div className="col-span-4 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{order.nama}</p>
                                {isNew && (
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                                    Baru
                                  </span>
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
                      // Card view — untuk ≤3 item, lebih detail
                      <div className="divide-y divide-gray-50">
                        {items.map((order) => {
                          const isNew = newIds.has(order.no_urut);
                          return (
                            <div
                              key={order.no_urut}
                              className={`px-4 py-3.5 flex items-center gap-3 transition ${cfg.rowBg} ${isNew ? "bg-blue-50/60" : ""}`}
                            >
                              {/* No urut */}
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                {order.no_urut}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="font-semibold text-gray-800 text-sm">{order.nama}</p>
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
    </div>
  );
}