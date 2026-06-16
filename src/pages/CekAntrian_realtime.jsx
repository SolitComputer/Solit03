// C:\Solit03\src\pages\CekAntrian.jsx
// Real-time via SSE (Server-Sent Events) + fallback polling jika SSE gagal

import { useState, useEffect, useCallback, useRef } from "react";
import { Wrench, Clock, CheckCircle, Package, RefreshCw, Search, Wifi, WifiOff } from "lucide-react";

const POS_BASE = "https://solit-pos.vercel.app";
const STREAM_URL = `${POS_BASE}/api/service/stream`;
const FALLBACK_URL = `${POS_BASE}/api/service/public`;

const STATUS_CONFIG = {
  ANTRIAN: {
    label: "Antrian",
    icon: <Clock size={14} />,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
    desc: "Menunggu giliran dikerjakan",
  },
  SEDANG_DIKERJAKAN: {
    label: "Sedang Dikerjakan",
    icon: <Wrench size={14} />,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
    desc: "Laptop sedang dalam proses perbaikan",
  },
  MENUNGGU_SPAREPART: {
    label: "Menunggu Sparepart",
    icon: <Package size={14} />,
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-400",
    desc: "Menunggu komponen/sparepart tiba",
  },
  DONE: {
    label: "Selesai",
    icon: <CheckCircle size={14} />,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
    desc: "Laptop sudah selesai, silakan diambil",
  },
};

const STATUS_ORDER = ["ANTRIAN", "SEDANG_DIKERJAKAN", "MENUNGGU_SPAREPART", "DONE"];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

// ── Hook utama: SSE dengan fallback ke polling ────────────────────────────────
function useServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false); // SSE terhubung?
  const [lastUpdated, setLastUpdated] = useState(null);

  const esRef = useRef(null);
  const fallbackRef = useRef(null);
  const reconnectTimer = useRef(null);

  // Fallback: fetch biasa setiap 15 detik jika SSE tidak support/gagal
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

    poll(); // langsung fetch pertama
    fallbackRef.current = setInterval(poll, 15_000);
  }, []);

  const stopFallbackPolling = useCallback(() => {
    if (fallbackRef.current) {
      clearInterval(fallbackRef.current);
      fallbackRef.current = null;
    }
  }, []);

  // SSE connect
  const connectSSE = useCallback(() => {
    // Tutup koneksi lama jika ada
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    clearTimeout(reconnectTimer.current);

    // EventSource tidak support di semua env — cek dulu
    if (typeof EventSource === "undefined") {
      startFallbackPolling();
      return;
    }

    const es = new EventSource(STREAM_URL);
    esRef.current = es;

    es.addEventListener("init", (e) => {
      try {
        const payload = JSON.parse(e.data);
        setOrders(payload.orders ?? []);
        setLastUpdated(new Date());
        setConnected(true);
        setLoading(false);
        setError("");
        stopFallbackPolling(); // SSE berhasil, stop polling
      } catch {}
    });

    es.addEventListener("update", (e) => {
      try {
        const payload = JSON.parse(e.data);
        setOrders(payload.orders ?? []);
        setLastUpdated(new Date());
        setError("");

        // Flash effect — trigger re-render dengan timestamp
        setLastUpdated(new Date());
      } catch {}
    });

    es.addEventListener("error", () => {
      // SSE error/disconnect — switch ke fallback polling
      setConnected(false);
      es.close();
      esRef.current = null;

      // Coba reconnect SSE setelah 10 detik
      reconnectTimer.current = setTimeout(() => {
        // Cek apakah sudah ada fallback berjalan
        if (!fallbackRef.current) startFallbackPolling();
        connectSSE();
      }, 10_000);

      // Langsung start fallback sementara
      if (!fallbackRef.current) startFallbackPolling();
    });

    es.addEventListener("error", (e) => {
      if (es.readyState === EventSource.CLOSED) {
        setConnected(false);
      }
    });
  }, [startFallbackPolling, stopFallbackPolling]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(FALLBACK_URL);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data ?? []);
        setLastUpdated(new Date());
        setError("");
      }
    } catch {
      setError("Gagal memuat ulang data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    connectSSE();

    return () => {
      // Cleanup semua saat unmount
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
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
  const [newIds, setNewIds] = useState(new Set()); // untuk animasi "baru masuk"
  const prevOrdersRef = useRef([]);

  // Deteksi order baru untuk animasi highlight
  useEffect(() => {
    const prevNos = new Set(prevOrdersRef.current.map((o) => o.no_urut));
    const incoming = orders
      .filter((o) => !prevNos.has(o.no_urut))
      .map((o) => o.no_urut);

    if (incoming.length > 0) {
      setNewIds(new Set(incoming));
      // Hapus highlight setelah 3 detik
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

  const stats = STATUS_ORDER.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
    ...STATUS_CONFIG[s],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Wrench size={20} />
            </div>
            <span className="text-blue-200 text-sm font-medium">Solit 03 Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Cek Antrian Servis</h1>
          <p className="text-blue-200 text-base max-w-xl">
            Pantau status perbaikan laptop kamu secara real-time. Data otomatis terupdate tanpa perlu refresh.
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau type laptop..."
              className="w-full pl-11 pr-4 py-3 bg-white/15 backdrop-blur border border-white/20 rounded-xl text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.status} className={`rounded-xl p-4 border ${s.bg} ${s.border}`}>
              <div className={`flex items-center gap-1.5 mb-1 ${s.text}`}>
                {s.icon}
                <span className="text-xs font-semibold">{s.label}</span>
              </div>
              <p className={`text-3xl font-bold ${s.text}`}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Status bar: koneksi + last updated + refresh */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs text-green-700 font-medium">Live · terhubung realtime</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  {lastUpdated
                    ? `Polling · terakhir ${lastUpdated.toLocaleTimeString("id-ID")}`
                    : "Menghubungkan..."}
                </span>
              </>
            )}
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition disabled:opacity-40"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <WifiOff size={14} />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && orders.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gray-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                  <div className="h-6 w-24 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wrench size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold">
              {search ? "Tidak ditemukan" : "Belum ada antrian servis"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? `Tidak ada hasil untuk "${search}"` : "Data antrian akan muncul otomatis saat ada order masuk"}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-3 text-sm text-blue-600 hover:underline">
                Hapus pencarian
              </button>
            )}
          </div>
        )}

        {/* Content grouped by status */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-8">
            {STATUS_ORDER.map((status) => {
              const items = grouped[status];
              if (items.length === 0) return null;
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1.5 text-sm font-bold ${cfg.text}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                      {items.length}
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="space-y-2.5">
                    {items.map((order) => {
                      const isNew = newIds.has(order.no_urut);
                      return (
                        <div
                          key={order.no_urut}
                          className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-4 sm:p-5
                            ${isNew
                              ? "border-blue-300 ring-2 ring-blue-200 ring-offset-1"
                              : status === "DONE"
                                ? "border-green-100"
                                : "border-gray-100"
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            {/* No urut */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                              {order.no_urut}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-800 text-sm">{order.nama}</p>
                                {isNew && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                                    Baru masuk
                                  </span>
                                )}
                                {status === "DONE" && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    ✓ Silakan diambil
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">{order.type_laptop}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Masuk: {formatDate(order.tanggal_masuk)}
                                {order.tanggal_selesai && (
                                  <span className="ml-2">· Selesai: {formatDate(order.tanggal_selesai)}</span>
                                )}
                              </p>
                            </div>

                            {/* Badge */}
                            <div className="flex-shrink-0">
                              <StatusBadge status={status} />
                            </div>
                          </div>

                          {/* Status desc */}
                          <div className={`mt-3 px-3 py-2 rounded-lg text-xs ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                            {cfg.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 font-medium mb-1">ℹ️ Informasi</p>
          <p className="text-xs text-blue-600 leading-relaxed">
            Halaman ini terhubung langsung ke sistem kami dan akan terupdate otomatis tanpa perlu refresh.
            Jika laptop kamu berstatus <strong>Selesai</strong>, silakan datang ke toko untuk mengambilnya.
          </p>
        </div>
      </div>
    </div>
  );
}