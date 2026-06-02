import { useState, useRef, useEffect } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const SOLIT_POS_API = import.meta.env.VITE_SOLIT_POS_URL || "https://solit-pos.vercel.app";

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

// ── Komponen Utama ────────────────────────────────────────────────────────────
export default function CekGaransi() {
    const [sn, setSn] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [searched, setSearched] = useState(false);
    const inputRef = useRef(null);

    // Fitur tambahan
    const [showConfetti, setShowConfetti] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [isVisible, setIsVisible] = useState({
        hero: false,
        card: false,
        info: false,
        cta: false,
    });

    // Intersection Observer untuk animasi scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.2, triggerOnce: true }
        );

        const sections = ["hero", "card", "info", "cta"];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Copy SN ke clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setToastMessage(`✅ SN "${text}" tersalin!`);
        setTimeout(() => setToastMessage(null), 2000);
    };

    // Trigger confetti sederhana
    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

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
                    headers: { "Content-Type": "application/json" },
                }
            );
            const data = await res.json();
            setResult(data);
            // Jika garansi aktif, munculkan confetti
            if (data.success && data.data?.status === "ACTIVE") {
                triggerConfetti();
            }
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
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
                <style>{`
                    @keyframes fadeSlideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }
                    @keyframes pulse-fast {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(1.02); }
                    }
                    .animate-fadeSlideUp { animation: fadeSlideUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards; }
                    .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
                    .animate-float { animation: float 4s ease-in-out infinite; }
                    .animate-pulse-fast { animation: pulse-fast 1s ease-in-out infinite; }
                `}</style>

                {/* Hero Section */}
                <div
                    id="hero"
                    className={`text-center mb-12 transition-all duration-700 ${
                        isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-3 py-1 mb-4 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-semibold text-blue-700 tracking-wider uppercase">
                            Layanan Pelanggan
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        <span className="text-gray-900">Cek Status </span>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Garansi
                        </span>
                    </h1>

                    <div className="mt-4">
                        <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                            Masukkan <span className="font-semibold text-blue-700">Serial Number (SN)</span>{" "}
                            laptop Anda untuk mengetahui masa berlaku garansi.
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full" />
                        <div className="w-2 h-0.5 bg-blue-500 rounded-full" />
                        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />
                    </div>

                    {/* Dekorasi apung */}
                    <div className="absolute left-4 top-20 opacity-20 hidden lg:block animate-float">
                        <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <div className="absolute right-4 bottom-20 opacity-20 hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
                        <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                </div>

                {/* Kartu Pencarian */}
                <div
                    id="card"
                    className={`transition-all duration-500 delay-100 ${
                        isVisible.card ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                >
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8">
                        <form onSubmit={handleCheck} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Serial Number (SN)
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
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
                                        className="w-full pl-11 pr-10 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 font-mono text-base placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    {sn && (
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <span>ℹ️</span> SN dapat ditemukan di stiker bodi laptop atau nota pembelian.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !sn.trim()}
                                className="group relative w-full h-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-sm"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
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
                </div>

                {/* Area Hasil dengan Skeleton Loading & Confetti */}
                <Confetti active={showConfetti} />
                {loading && <SkeletonResult />}
                {!loading && searched && (
                    <div className="mt-8 transition-all duration-500">
                        {result?.success && result.data ? (
                            <WarrantyResult
                                data={result.data}
                                cfg={cfg}
                                onReset={handleReset}
                                onCopy={copyToClipboard}
                            />
                        ) : (
                            <NotFoundCard
                                message={result?.message}
                                sn={sn}
                                onReset={handleReset}
                                onCopy={copyToClipboard}
                            />
                        )}
                    </div>
                )}

                {/* Info Boxes (Tips) */}
                {!searched && (
                    <div
                        id="info"
                        className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 transition-all duration-500 delay-200 ${
                            isVisible.info ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                    >
                        {[
                            { icon: "📋", title: "Temukan SN", desc: "Cek di stiker bodi laptop atau nota pembelian" },
                            { icon: "🔍", title: "Masukkan SN", desc: "Ketik serial number di kolom pencarian" },
                            { icon: "🛡️", title: "Lihat Status", desc: "Sistem akan menampilkan detail garansi" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center transition-all hover:shadow-md hover:-translate-y-1 duration-300"
                            >
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA WhatsApp Section */}
                <div
                    id="cta"
                    className={`text-center mt-12 transition-all duration-500 delay-300 ${
                        isVisible.cta ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
                        <a
                            href="https://wa.me/6285210647047?text=Halo%20Solit%2003%2C%20saya%20ingin%20bertanya%20tentang%20garansi%20laptop."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <svg className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                                <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                            </svg>
                            <span className="relative font-semibold">Hubungi Kami via WhatsApp</span>
                            <svg className="relative w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="h-3 w-px bg-gray-300"></div>
                        <p className="text-[11px] text-gray-400">Atau hubungi langsung:</p>
                        <a href="https://wa.me/6285210647047" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-green-600 hover:text-green-700 font-medium hover:underline transition">+62 852-1064-7047</a>
                        <div className="h-3 w-px bg-gray-300"></div>
                    </div>
                </div>

                {/* Bottom Decorative Dots */}
                <div className="flex justify-center mt-10">
                    <div className="flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 opacity-40" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-5 py-2 rounded-full shadow-lg text-sm z-50 animate-fadeSlideUp">
                        {toastMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Komponen Confetti (tanpa library) ─────────────────────────────────────────
function Confetti({ active }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 6 + 2,
                speedY: Math.random() * 5 + 3,
                speedX: (Math.random() - 0.5) * 2,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            });
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let stillActive = false;
            for (let p of particles) {
                p.y += p.speedY;
                p.x += p.speedX;
                if (p.y < canvas.height) stillActive = true;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            if (stillActive) {
                animationId = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationId);
            }
        };
        animate();
        return () => cancelAnimationFrame(animationId);
    }, [active]);
    if (!active) return null;
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}

// ── Skeleton Loading ──────────────────────────────────────────────────────────
function SkeletonResult() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
            <div className="h-28 bg-gray-200" />
            <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-20 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
            </div>
        </div>
    );
}

// ── Hasil Garansi (dengan fitur copy & efek pulse) ────────────────────────────
function WarrantyResult({ data, cfg, onReset, onCopy }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(data.warranty_start);
    const end = new Date(data.warranty_end);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const usedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    const pct = Math.min(Math.max((usedDays / totalDays) * 100, 0), 100);
    const daysLeft = data.days_left;
    const isExpiring = data.status === "EXPIRING_SOON";

    return (
        <div className={`rounded-xl border ${cfg.border} overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white`}>
            {/* Header Gradien */}
            <div className={`bg-gradient-to-r ${cfg.gradient} px-6 py-5 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-1/2" />
                <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-xl">{cfg.icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-white text-xl leading-tight">{cfg.label}</p>
                            <p className="text-white/80 text-sm mt-0.5">{cfg.sublabel}</p>
                        </div>
                    </div>
                    {daysLeft >= 0 ? (
                        <div className={`text-right flex-shrink-0 bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm ${isExpiring ? "animate-pulse-fast" : ""}`}>
                            <p className="text-2xl font-black text-white leading-none">{daysLeft}</p>
                            <p className="text-white/70 text-[11px] font-semibold">hari lagi</p>
                        </div>
                    ) : (
                        <div className="bg-white/20 rounded-xl px-3 py-2">
                            <p className="text-white text-xs font-semibold">Berakhir {Math.abs(daysLeft)} hari lalu</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Mulai: {fmtDate(data.warranty_start)}</span>
                        <span>Berakhir: {fmtDate(data.warranty_end)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500 mt-2">
                        <span>0%</span>
                        <span className="font-medium text-gray-700">{Math.round(pct)}% terpakai</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Info Grid dengan tombol copy pada SN */}
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {[
                        { icon: "💻", label: "Laptop", value: data.laptop_name, bold: true },
                        { icon: "🔢", label: "Serial Number", value: data.serial_number, mono: true, copyable: true },
                        { icon: "👤", label: "Nama Pembeli", value: data.customer_name },
                        { icon: "📅", label: "Tanggal Mulai", value: fmtDate(data.warranty_start) },
                        { icon: "🏁", label: "Garansi Berakhir", value: fmtDate(data.warranty_end), highlight: true, cfg },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group">
                            <span className="text-gray-400 text-base flex-shrink-0 w-6 text-center">{row.icon}</span>
                            <span className="text-xs font-medium text-gray-500 w-28 flex-shrink-0">{row.label}</span>
                            <span className={`text-sm flex-1 text-right truncate ${row.mono ? "font-mono font-semibold text-gray-800" : row.bold ? "font-bold text-gray-800" : row.highlight ? `font-bold ${cfg.text}` : "text-gray-700"}`}>
                                {row.value}
                            </span>
                            {row.copyable && (
                                <button
                                    onClick={() => onCopy(row.value)}
                                    className="text-gray-400 hover:text-blue-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Salin SN"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Notes */}
                {data.notes && (
                    <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1"><span>📝</span> Catatan dari Solit 03</p>
                        <p className="text-sm text-blue-800">{data.notes}</p>
                    </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                        href={`https://wa.me/6285210647047?text=${encodeURIComponent(`Halo Solit 03, saya ingin bertanya mengenai garansi laptop dengan SN: ${data.serial_number}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md active:scale-95"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Hubungi via WhatsApp
                    </a>
                    <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all hover:shadow-sm active:scale-95">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                        Cek SN Lain
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Not Found Card (dengan tombol copy) ───────────────────────────────────────
function NotFoundCard({ message, sn, onReset, onCopy }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </div>
                    <div>
                        <p className="font-bold text-white text-xl">Data Tidak Ditemukan</p>
                        <p className="text-white/70 text-sm">Serial number tidak terdaftar</p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-6 space-y-5">
                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex justify-between items-center group">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">SN yang dicari</p>
                        <p className="font-mono font-bold text-gray-800 text-lg tracking-wide">{sn}</p>
                    </div>
                    <button
                        onClick={() => onCopy(sn)}
                        className="text-gray-400 hover:text-blue-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Salin SN"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><span>🔍</span> Kemungkinan penyebab:</p>
                    <ul className="space-y-2">
                        {["Serial number tidak sesuai — periksa kembali ejaan", "Laptop dibeli sebelum sistem garansi digital diterapkan", "Garansi sudah pernah dicabut (VOID)"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600"><span className="w-5 h-5 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i+1}</span>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1"><span>💬</span> Butuh bantuan?</p>
                    <p className="text-sm text-blue-600">Hubungi tim Solit 03 via WhatsApp dengan menyebutkan nomor invoice pembelian Anda.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href={`https://wa.me/6285210647047?text=${encodeURIComponent(`Halo Solit 03, saya ingin mengecek garansi laptop dengan SN: ${sn} tapi tidak ditemukan di sistem.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md active:scale-95"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Tanya via WhatsApp
                    </a>
                    <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all hover:shadow-sm active:scale-95">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                        Cari Ulang
                    </button>
                </div>
            </div>
        </div>
    );
}