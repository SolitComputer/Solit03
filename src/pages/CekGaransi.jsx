import { useState, useRef } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
// Ganti dengan URL Solit POS yang sudah deploy
const SOLIT_POS_API = import.meta.env.VITE_SOLIT_POS_URL || "https://solit-pos.vercel.app";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    ACTIVE: {
        label: "Garansi Aktif",
        sublabel: "Laptop Anda masih dalam masa garansi",
        icon: "✓",
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-800",
        barColor: "bg-emerald-500",
    },
    EXPIRING_SOON: {
        label: "Segera Berakhir",
        sublabel: "Masa garansi hampir habis",
        icon: "!",
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-800",
        barColor: "bg-amber-500",
    },
    EXPIRED: {
        label: "Masa Garansi Berakhir",
        sublabel: "Garansi sudah tidak berlaku",
        icon: "✕",
        gradient: "from-red-500 to-rose-500",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        badgeBg: "bg-red-100",
        badgeText: "text-red-800",
        barColor: "bg-red-400",
    },
};

const fmtDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CekGaransi() {
    const [sn, setSn] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // null | { success, data, message }
    const [searched, setSearched] = useState(false);
    const inputRef = useRef(null);

    const handleCheck = async (e) => {
        e?.preventDefault();
        const trimmed = sn.trim().toUpperCase();
        if (!trimmed) {
            inputRef.current?.focus();
            return;
        }

        setLoading(true);
        setResult(null);
        setSearched(false);

        try {
            const res = await fetch(
                `${SOLIT_POS_API}/api/warranty/check?sn=${encodeURIComponent(trimmed)}`,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ); const data = await res.json();
            setResult(data);
        } catch {
            setResult({ success: false, message: "Tidak dapat terhubung ke server. Coba lagi beberapa saat." });
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleReset = () => {
        setSn("");
        setResult(null);
        setSearched(false);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const cfg = result?.data ? STATUS_CONFIG[result.data.status] || STATUS_CONFIG.EXPIRED : null;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">

                {/* ── Decorative background shapes ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-32 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-100/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-2xl mx-auto px-4 py-12 sm:py-20">

                    {/* ── Header ── */}
                    <div className="text-center mb-10">
                        {/* Shield icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-200 mb-5">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <polyline points="9 12 11 14 15 10" />
                            </svg>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Cek Garansi
                        </h1>
                        <p className="mt-3 text-slate-500 text-base max-w-md mx-auto leading-relaxed">
                            Masukkan <span className="font-semibold text-blue-700">Serial Number</span> laptop untuk mengecek status garansi pembelian Anda di Solit 03.
                        </p>
                    </div>

                    {/* ── Search Card ── */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 mb-6">
                        <form onSubmit={handleCheck} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Serial Number (SN)
                                </label>
                                <div className="relative">
                                    {/* Barcode icon */}
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M3 9V6a1 1 0 011-1h2" /><path d="M20 9V6a1 1 0 00-1-1h-2" />
                                            <path d="M3 15v3a1 1 0 001 1h2" /><path d="M20 15v3a1 1 0 01-1 1h-2" />
                                            <path d="M7 8v8M10 8v8M13 8v8M16 8v8" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={sn}
                                        onChange={(e) => setSn(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                                        placeholder="Contoh: 0006151"
                                        maxLength={60}
                                        className="w-full pl-11 pr-4 h-13 py-3.5 border-2 border-slate-200 rounded-xl text-slate-800 font-mono text-base placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    {sn && (
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    SN dapat ditemukan di stiker bodi laptop atau nota pembelian Anda.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !sn.trim()}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-sm"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Mencari Data...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        Cek Garansi Sekarang
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ── Result ── */}
                    {searched && !loading && (
                        <div className="animate-in">
                            {result?.success && result.data ? (
                                <WarrantyResult data={result.data} cfg={cfg} onReset={handleReset} />
                            ) : (
                                <NotFoundCard message={result?.message} sn={sn} onReset={handleReset} />
                            )}
                        </div>
                    )}

                    {/* ── Info boxes ── */}
                    {!searched && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                            {[
                                {
                                    icon: "📋",
                                    title: "Temukan SN",
                                    desc: "Cek di stiker bodi laptop atau nota pembelian Anda",
                                },
                                {
                                    icon: "🔍",
                                    title: "Masukkan SN",
                                    desc: "Ketik serial number di kolom pencarian di atas",
                                },
                                {
                                    icon: "🛡️",
                                    title: "Lihat Status",
                                    desc: "Sistem akan menampilkan detail garansi secara instan",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white/80 rounded-xl border border-slate-100 p-4 text-center"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Footer note ── */}
                    <p className="text-center text-xs text-slate-400 mt-8">
                        Butuh bantuan?{" "}
                        <a
                            href="https://wa.me/6285210647047"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Hubungi tim Solit 03
                        </a>
                    </p>
                </div>

                <style>{`
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
            animation: slide-up 0.35s ease both;
        }
      `}</style>
            </div>
        </>
    );
}

// ── Warranty Result Card ──────────────────────────────────────────────────────
function WarrantyResult({ data, cfg, onReset }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(data.warranty_start);
    const end = new Date(data.warranty_end);

    // Progress garansi
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const usedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    const pct = Math.min(Math.max((usedDays / totalDays) * 100, 0), 100);

    const daysLeft = data.days_left;

    return (
        <div className={`rounded-2xl border-2 ${cfg.border} overflow-hidden shadow-lg`}>

            {/* Header dengan gradient */}
            <div className={`bg-gradient-to-r ${cfg.gradient} px-6 py-5`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{cfg.icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg leading-tight">{cfg.label}</p>
                            <p className="text-white/80 text-sm mt-0.5">{cfg.sublabel}</p>
                        </div>
                    </div>
                    {/* Days left badge */}
                    {daysLeft >= 0 ? (
                        <div className="text-right flex-shrink-0">
                            <p className="text-3xl font-black text-white leading-none">{daysLeft}</p>
                            <p className="text-white/70 text-xs">hari lagi</p>
                        </div>
                    ) : (
                        <div className="bg-white/20 rounded-xl px-3 py-1.5">
                            <p className="text-white text-xs font-semibold">Berakhir {Math.abs(daysLeft)} hari lalu</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className={`${cfg.bg} px-6 py-5 space-y-4`}>

                {/* Progress bar */}
                <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Mulai: {fmtDate(data.warranty_start)}</span>
                        <span>Berakhir: {fmtDate(data.warranty_end)}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${cfg.barColor}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>0%</span>
                        <span className="font-medium text-slate-600">{Math.round(pct)}% terpakai</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Info grid */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    {[
                        {
                            icon: (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            ),
                            label: "Laptop",
                            value: data.laptop_name,
                            bold: true,
                        },
                        {
                            icon: (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 7V5a1 1 0 011-1h2" /><path d="M7 8v8" /><path d="M10 8v8" /><path d="M13 8v8" /><path d="M16 8v8" />
                                    <path d="M20 7V5a1 1 0 00-1-1h-2" /><path d="M4 17v2a1 1 0 001 1h2" /><path d="M20 17v2a1 1 0 01-1 1h-2" />
                                </svg>
                            ),
                            label: "Serial Number",
                            value: data.serial_number,
                            mono: true,
                        },
                        {
                            icon: (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                            ),
                            label: "Nama Pembeli",
                            value: data.customer_name,
                        },
                        {
                            icon: (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            ),
                            label: "Tanggal Mulai",
                            value: fmtDate(data.warranty_start),
                        },
                        {
                            icon: (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            ),
                            label: "Garansi Berakhir",
                            value: fmtDate(data.warranty_end),
                            highlight: true,
                            cfg,
                        },
                    ].map((row, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-3 ${i !== 0 ? "border-t border-slate-100" : ""}`}
                        >
                            <span className="text-slate-400 flex-shrink-0">{row.icon}</span>
                            <span className="text-xs text-slate-500 w-28 flex-shrink-0">{row.label}</span>
                            <span
                                className={`text-sm flex-1 text-right ${row.mono ? "font-mono font-semibold text-slate-700" :
                                    row.bold ? "font-semibold text-slate-800" :
                                        row.highlight ? `font-bold ${cfg.text}` :
                                            "text-slate-700"
                                    }`}
                            >
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Notes jika ada */}
                {data.notes && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Catatan dari Solit 03</p>
                        <p className="text-sm text-blue-800">{data.notes}</p>
                    </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <a
                        href={`https://wa.me/6285210647047?text=${encodeURIComponent(`Halo Solit 03, saya ingin bertanya mengenai garansi laptop dengan SN: ${data.serial_number}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Hubungi via WhatsApp
                    </a>
                    <button
                        onClick={onReset}
                        className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                        </svg>
                        Cek SN Lain
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Not Found Card ────────────────────────────────────────────────────────────
function NotFoundCard({ message, sn, onReset }) {
    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">Data Tidak Ditemukan</p>
                        <p className="text-white/70 text-sm mt-0.5">Serial number tidak terdaftar</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5 space-y-4">
                <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">SN yang dicari</p>
                    <p className="font-mono font-bold text-slate-800">{sn}</p>
                </div>

                <div className="space-y-2.5">
                    <p className="text-sm font-semibold text-slate-700">Kemungkinan penyebab:</p>
                    {[
                        "Serial number tidak sesuai — periksa kembali ejaan",
                        "Laptop dibeli sebelum sistem garansi digital diterapkan",
                        "Garansi sudah pernah dicabut (VOID)",
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <span className="w-5 h-5 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                {i + 1}
                            </span>
                            {item}
                        </div>
                    ))}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Butuh bantuan?</p>
                    <p className="text-sm text-blue-600">
                        Hubungi tim Solit 03 via WhatsApp dengan menyebutkan nomor invoice pembelian Anda.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <a
                        href={`https://wa.me/6285210647047?text=${encodeURIComponent(`Halo Solit 03, saya ingin mengecek garansi laptop dengan SN: ${sn} tapi tidak ditemukan di sistem.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Tanya via WhatsApp
                    </a>
                    <button
                        onClick={onReset}
                        className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                        </svg>
                        Cari Ulang
                    </button>
                </div>
            </div>
        </div>
    );
}