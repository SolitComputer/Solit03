import { useEffect, useState, useCallback } from "react";
import {
  Cookie, ShieldCheck, ShieldX, Settings2, BarChart3,
  ChevronLeft, ChevronRight, Activity, Globe
} from "lucide-react";
import { getCookieConsentStats, getCookieConsentLog } from "../services/AdminCookieConsent";
import { useToast } from "../context/ToastContext";

const actionBadge = {
  accept_all: { label: "Terima Semua", cls: "bg-emerald-100 text-emerald-700" },
  reject_all: { label: "Tolak Non-Esensial", cls: "bg-red-100 text-red-600" },
  custom: { label: "Kustom", cls: "bg-blue-100 text-blue-700" },
};

function Skeleton({ className }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

const EMPTY_STATS = {
  total: 0,
  acceptAll: 0,
  rejectAll: 0,
  custom: 0,
  analyticsOptIn: 0,
  marketingOptIn: 0,
  trend: [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { day: d.toISOString().slice(0, 10), count: 0 };
  }),
};

export default function CookieTracking() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [log, setLog] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);
  const limit = 10;
  const { showToast } = useToast();

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      setStats(await getCookieConsentStats());
    } catch {
      setStats(EMPTY_STATS);
      showToast("Gagal memuat statistik cookie consent", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadLog = useCallback(async () => {
    setLogLoading(true);
    try {
      const { data, total } = await getCookieConsentLog({ page, limit });
      setLog(data);
      setTotal(total);
    } catch {
      showToast("Gagal memuat log cookie consent", "error");
    } finally {
      setLogLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadLog(); }, [loadLog]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const maxTrend = stats ? Math.max(1, ...stats.trend.map((t) => t.count)) : 1;

  const cards = stats ? [
    { label: "Total Consent", value: stats.total, icon: Cookie, color: "blue", pct: 100 },
    {
      label: "Terima Semua",
      value: stats.acceptAll,
      icon: ShieldCheck,
      color: "emerald",
      pct: stats.total ? Math.round((stats.acceptAll / stats.total) * 100) : 0,
    },
    {
      label: "Tolak Non-Esensial",
      value: stats.rejectAll,
      icon: ShieldX,
      color: "red",
      pct: stats.total ? Math.round((stats.rejectAll / stats.total) * 100) : 0,
    },
    {
      label: "Kustom",
      value: stats.custom,
      icon: Settings2,
      color: "violet",
      pct: stats.total ? Math.round((stats.custom / stats.total) * 100) : 0,
    },
  ] : [];

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", bar: "from-blue-500 to-blue-400" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "from-emerald-500 to-emerald-400" },
    red: { bg: "bg-red-50", text: "text-red-500", bar: "from-red-500 to-red-400" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", bar: "from-violet-500 to-violet-400" },
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Cookie Consent Tracking
        </h1>
        <p className="text-sm text-content-muted mt-1">Pantau preferensi cookie yang dipilih pengunjung situs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-14 h-6" />
              </div>
            ))
          : cards.map(({ label, value, icon: Icon, color, pct }) => {
              const c = colorMap[color];
              return (
                <div key={label} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${c.bg} ${c.text}`}>{pct}%</span>
                  </div>
                  <p className="text-[11px] text-content-muted font-medium uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-bold text-content mt-1">{value.toLocaleString()}</p>
                  <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Trend chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-content-soft" />
            <h2 className="text-base font-semibold text-content">Tren 7 Hari Terakhir</h2>
          </div>
          {loading ? (
            <Skeleton className="w-full h-40" />
          ) : (
            <div className="flex items-end gap-3 h-40">
              {stats.trend.map((t) => {
                const heightPct = Math.max((t.count / maxTrend) * 100, t.count > 0 ? 6 : 2);
                return (
                  <div key={t.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                        title={`${t.count} consent`}
                      />
                    </div>
                    <span className="text-[10px] text-content-muted font-semibold">{t.count}</span>
                    <span className="text-[10px] text-content-muted">
                      {new Date(t.day).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Opt-in breakdown */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-content-soft" />
            <h2 className="text-base font-semibold text-content">Opt-in Kategori</h2>
          </div>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
            </div>
          ) : (
            <div className="space-y-5">
              {[
                { label: "Analitik", value: stats.analyticsOptIn, color: "blue" },
                { label: "Marketing", value: stats.marketingOptIn, color: "violet" },
              ].map(({ label, value, color }) => {
                const c = colorMap[color];
                const pct = stats.total ? Math.round((value / stats.total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-content-soft">{label}</span>
                      <span className="text-xs font-semibold text-content-soft">{value} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Log table */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-border flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <p className="text-sm font-bold text-content-soft">Log Consent</p>
          <p className="text-xs font-semibold text-content-muted bg-gray-100 px-2 py-1 rounded-lg">{total} tercatat</p>
        </div>

        {logLoading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            ))}
          </div>
        ) : log.length === 0 ? (
          <div className="py-16 text-center">
            <Cookie size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-content-muted">Belum ada data consent yang tercatat</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-content-muted border-b border-border">
                  <th className="px-5 py-3 font-semibold">Waktu</th>
                  <th className="px-5 py-3 font-semibold">Aksi</th>
                  <th className="px-5 py-3 font-semibold">Analitik</th>
                  <th className="px-5 py-3 font-semibold">Marketing</th>
                  <th className="px-5 py-3 font-semibold">Halaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {log.map((r) => {
                  const badge = actionBadge[r.action] || actionBadge.custom;
                  return (
                    <tr key={r.id} className="hover:bg-surface-muted/80 transition">
                      <td className="px-5 py-3 text-xs text-content-muted whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        {r.analytics ? <span className="text-emerald-600 font-semibold">Ya</span> : <span className="text-content-muted">Tidak</span>}
                      </td>
                      <td className="px-5 py-3 text-xs">
                        {r.marketing ? <span className="text-emerald-600 font-semibold">Ya</span> : <span className="text-content-muted">Tidak</span>}
                      </td>
                      <td className="px-5 py-3 text-xs text-content-muted">
                        <span className="inline-flex items-center gap-1">
                          <Globe size={12} className="text-gray-300" />
                          {r.page_url || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t-2 border-border bg-surface-muted flex items-center justify-between">
            <p className="text-xs font-medium text-content-soft">Halaman {page} dari {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border-2 border-border bg-surface text-content-soft hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border-2 border-border bg-surface text-content-soft hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
