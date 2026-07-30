import { useState, useRef, useEffect } from "react";
import {
    Check, AlertTriangle, X, Search, Keyboard, Shield,
    Laptop, Hash, User, Calendar, Flag, FileText, MessageCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

// ── Konfigurasi API ──────────────────────────────────────────────────────────
const SOLIT_POS_API = import.meta.env.VITE_SOLIT_POS_URL || "https://solit-pos.vercel.app";

const STATUS_CONFIG = {
    ACTIVE: {
        label: "Garansi Aktif",
        sublabel: "Laptop Anda masih dalam masa garansi",
        icon: Check,
        gradient: "from-emerald-500 to-emerald-600",
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
        icon: AlertTriangle,
        gradient: "from-amber-500 to-amber-600",
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
        icon: X,
        gradient: "from-red-500 to-red-600",
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

// ── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
export default function CekGaransi() {
    const [sn, setSn] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [searched, setSearched] = useState(false);
    const inputRef = useRef(null);
    const buttonRef = useRef(null);

    const [showConfetti, setShowConfetti] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [isVisible, setIsVisible] = useState({
        hero: false,
        card: false,
        info: false,
        cta: false,
    });

    const [clickRipples, setClickRipples] = useState([]);
    const [waterRipples, setWaterRipples] = useState([]);
    const [sparkles, setSparkles] = useState([]);
    const [isBtnPressed, setIsBtnPressed] = useState(false);
    const [btnFlash, setBtnFlash] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setToastMessage(`SN "${text}" tersalin!`);
        setTimeout(() => setToastMessage(null), 2000);
    };

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
            if (data.success && data.data?.status === "ACTIVE") {
                triggerConfetti();
                setShowSuccessPopup(true);
                setTimeout(() => setShowSuccessPopup(false), 2500);
            }
        } catch {
            setResult({ success: false, message: "Tidak dapat terhubung ke server. Coba lagi beberapa saat." });
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleClickWithAwesomeAnim = (e) => {
        setIsBtnPressed(true);
        setTimeout(() => setIsBtnPressed(false), 150);
        setBtnFlash(true);
        setTimeout(() => setBtnFlash(false), 200);

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newRipples = Array.from({ length: 12 }, (_, i) => ({
                id: Date.now() + i,
                x, y,
                size: Math.random() * 8 + 4,
                angle: Math.random() * Math.PI * 2,
            }));
            setClickRipples((prev) => [...prev, ...newRipples]);
            setTimeout(() => {
                setClickRipples((prev) => prev.filter((r) => !newRipples.some((nr) => nr.id === r.id)));
            }, 500);

            const waterId = Date.now();
            setWaterRipples((prev) => [...prev, { id: waterId, x, y, radius: 0 }]);
            let radius = 0;
            const interval = setInterval(() => {
                radius += 12;
                setWaterRipples((prev) => prev.map((r) => (r.id === waterId ? { ...r, radius } : r)));
                if (radius >= 80) {
                    clearInterval(interval);
                    setWaterRipples((prev) => prev.filter((r) => r.id !== waterId));
                }
            }, 30);

            const newSparkles = Array.from({ length: 8 }, (_, i) => ({
                id: Date.now() + i,
                x: x + (Math.random() - 0.5) * 60,
                y: y + (Math.random() - 0.5) * 40,
                size: Math.random() * 6 + 3,
                angle: Math.random() * Math.PI * 2,
            }));
            setSparkles((prev) => [...prev, ...newSparkles]);
            setTimeout(() => {
                setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
            }, 600);
        }

        handleCheck(e);
    };

    const handleReset = () => {
        setSn("");
        setResult(null);
        setSearched(false);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const cfg = result?.data ? STATUS_CONFIG[result.data.status] || STATUS_CONFIG.EXPIRED : null;

    return (
        <div className="min-h-screen bg-surface-muted relative overflow-x-hidden">
            <Helmet>
                <title>Cek Garansi Laptop | Solit 03</title>
                <meta
                    name="description"
                    content="Cek status garansi laptop Solit 03 secara online. Masukkan serial number untuk melihat masa berlaku garansi laptop second bergaransi kamu."
                />
                <link rel="canonical" href="https://solit03.com/cek-garansi" />
            </Helmet>
            <div className="fixed inset-0 -z-10 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
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
                    @keyframes pulse-fast {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.02); }
                    }
                    @keyframes glow {
                        0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
                        70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
                        100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
                    }
                    @keyframes rippleFly {
                        0% { transform: translate(0,0) scale(0.4); opacity: 0.9; }
                        100% { transform: translate(var(--dx), var(--dy)) scale(1.3); opacity: 0; }
                    }
                    @keyframes waterRipple {
                        0% { transform: translate(-50%,-50%) scale(0); opacity: 0.5; }
                        100% { transform: translate(-50%,-50%) scale(1); opacity: 0; }
                    }
                    @keyframes sparkleFly {
                        0% { transform: translate(0,0) scale(0) rotate(0deg); opacity: 1; }
                        100% { transform: translate(var(--dx), var(--dy)) scale(1.2) rotate(180deg); opacity: 0; }
                    }
                    @keyframes popupBounce {
                        0% { transform: scale(0.6); opacity: 0; }
                        50% { transform: scale(1.05); opacity: 1; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes popupFadeOut {
                        0% { opacity: 1; transform: scale(1); }
                        100% { opacity: 0; transform: scale(0.9); visibility: hidden; }
                    }
                    .animate-fadeSlideUp { animation: fadeSlideUp 0.6s cubic-bezier(0.2,0.9,0.4,1.1) forwards; }
                    .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
                    .animate-float { animation: float 5s ease-in-out infinite; }
                    .animate-pulse-fast { animation: pulse-fast 1.2s ease-in-out infinite; }
                    .animate-glow { animation: glow 1.8s ease-in-out infinite; }
                    .btn-ripple-particle {
                        position: absolute;
                        pointer-events: none;
                        border-radius: 50%;
                        background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(59,130,246,0.7) 100%);
                        animation: rippleFly 0.5s ease-out forwards;
                    }
                    .btn-water-ripple {
                        position: absolute;
                        pointer-events: none;
                        border-radius: 50%;
                        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(59,130,246,0.1) 100%);
                        animation: waterRipple 0.6s ease-out forwards;
                    }
                    .btn-sparkle {
                        position: absolute;
                        pointer-events: none;
                        background: radial-gradient(circle, #ffd700, #ff8c00);
                        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                        animation: sparkleFly 0.6s ease-out forwards;
                    }
                    .success-popup {
                        animation: popupBounce 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards, popupFadeOut 0.3s ease-in forwards 2.3s;
                    }
                `}</style>

                {showSuccessPopup && (
                    <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
                        <div className="bg-surface/95 backdrop-blur-md rounded-2xl shadow-soft-lg p-6 flex flex-col items-center gap-3 success-popup border border-emerald-200 min-w-[280px]">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-soft">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-content">Selamat!</p>
                                <p className="text-xl font-semibold text-emerald-600">Garansi Anda Aktif</p>
                            </div>
                        </div>
                    </div>
                )}

                <div id="hero" className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <span className="eyebrow">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Official Solit 03
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-content mt-5">
                        Cek Status <span className="text-blue-600">Garansi</span>
                    </h1>
                    <p className="text-sm md:text-base text-content-muted max-w-2xl mx-auto mt-4">
                        Masukkan <span className="font-semibold text-blue-600">Serial Number (SN)</span> laptop Anda untuk mengetahui masa berlaku garansi dengan mudah.
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
                    </div>
                </div>

                <div id="card" className={`transition-all duration-500 delay-100 ${isVisible.card ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                    <div className="bg-surface rounded-2xl border border-border shadow-soft hover:shadow-soft-lg transition-all duration-300 p-6 sm:p-8">
                        <form onSubmit={handleClickWithAwesomeAnim} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-content-soft mb-2">Serial Number (SN)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-blue-500 transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                                        onKeyDown={(e) => e.key === "Enter" && handleClickWithAwesomeAnim(e)}
                                        placeholder="Contoh: SN-0006151"
                                        maxLength={60}
                                        className="w-full pl-12 pr-12 py-4 border-2 border-border rounded-xl text-content font-mono text-base placeholder:text-content-muted focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-surface-muted"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    {sn && (
                                        <button type="button" onClick={handleReset} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-soft transition p-1 rounded-full hover:bg-slate-100">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-content-muted mt-3 flex items-center gap-1">
                                    <span className="inline-block w-4 h-4 bg-blue-100 rounded-full text-center text-blue-600 text-[10px] font-bold">i</span>
                                    SN dapat ditemukan di stiker bodi laptop atau nota pembelian.
                                </p>
                            </div>

                            <div className="relative overflow-visible">
                                <button
                                    ref={buttonRef}
                                    type="submit"
                                    disabled={loading || !sn.trim()}
                                    className={`group relative w-full h-14 overflow-visible rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-300 shadow-soft hover:shadow-soft-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                                        isBtnPressed && !loading ? "scale-95 ring-4 ring-blue-400/60" : ""
                                    } ${btnFlash ? "bg-surface text-blue-700" : ""}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="relative z-10">Memeriksa Garansi...</span>
                                            <div className="absolute inset-0 rounded-xl bg-blue-500/30 animate-pulse-fast"></div>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                            <span>Cek Garansi Sekarang</span>
                                        </>
                                    )}
                                </button>

                                {clickRipples.map((p) => {
                                    const dx = Math.cos(p.angle) * 55;
                                    const dy = Math.sin(p.angle) * 45 - 15;
                                    return (
                                        <div key={p.id} className="btn-ripple-particle" style={{ left: p.x, top: p.y, width: p.size, height: p.size, '--dx': `${dx}px`, '--dy': `${dy}px` }} />
                                    );
                                })}
                                {waterRipples.map((r) => (
                                    <div key={r.id} className="btn-water-ripple" style={{ left: r.x, top: r.y, width: r.radius * 2, height: r.radius * 2 }} />
                                ))}
                                {sparkles.map((s) => {
                                    const dx = Math.cos(s.angle) * 45;
                                    const dy = Math.sin(s.angle) * 35 - 10;
                                    return (
                                        <div key={s.id} className="btn-sparkle" style={{ left: s.x, top: s.y, width: s.size, height: s.size, '--dx': `${dx}px`, '--dy': `${dy}px` }} />
                                    );
                                })}
                            </div>
                        </form>
                    </div>
                </div>

                <Confetti active={showConfetti} />
                {loading && <SkeletonResult />}
                {!loading && searched && (
                    <div className="mt-8 transition-all duration-500 animate-fadeSlideUp">
                        {result?.success && result.data ? (
                            <WarrantyResult data={result.data} cfg={cfg} onReset={handleReset} onCopy={copyToClipboard} />
                        ) : (
                            <NotFoundCard message={result?.message} sn={sn} onReset={handleReset} onCopy={copyToClipboard} />
                        )}
                    </div>
                )}

                {!searched && (
                    <div id="info" className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 transition-all duration-500 delay-200 ${isVisible.info ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        {[
                            { icon: Search, title: "Temukan SN", desc: "Lihat stiker bodi laptop atau nota pembelian" },
                            { icon: Keyboard, title: "Masukkan SN", desc: "Ketik serial number dengan benar di kolom" },
                            { icon: Shield, title: "Lihat Status", desc: "Sistem akan menampilkan detail garansi Anda" },
                        ].map((item, i) => (
                            <div key={i} className="card-3d p-6 text-center">
                                <div className="flex justify-center mb-3"><item.icon className="w-9 h-9 text-blue-600" aria-hidden="true" /></div>
                                <p className="text-md font-bold text-content">{item.title}</p>
                                <p className="text-sm text-content-muted mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div id="cta" className={`text-center mt-16 transition-all duration-500 delay-300 ${isVisible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <div className="relative inline-block">
                        <a
                            href="https://wa.me/6285210647047?text=Halo%20Solit%2003%2C%20saya%20ingin%20bertanya%20tentang%20garansi%20laptop."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
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
                        <div className="h-4 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                        <p className="text-xs text-content-muted">Atau hubungi langsung:</p>
                        <a href="https://wa.me/6285210647047" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-green-600 hover:text-green-700 font-medium hover:underline transition">+62 852-1064-7047</a>
                        <div className="h-4 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                    </div>
                </div>

                <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                </div>

                {toastMessage && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-soft-lg text-sm z-50 animate-fadeSlideUp flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> {toastMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

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
        for (let i = 0; i < 200; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 6 + 2,
                speedY: Math.random() * 5 + 3,
                speedX: (Math.random() - 0.5) * 2,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
            });
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let stillActive = false;
            for (let p of particles) {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotSpeed;
                if (p.y < canvas.height) stillActive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
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

function SkeletonResult() {
    return (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-soft-sm animate-pulse">
            <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-100" />
            <div className="p-6 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="h-24 bg-slate-100 rounded-xl" />
                <div className="h-12 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}

// ── HASIL GARANSI - DIPERBAIKI UNTUK HP (RAPI) ──────────────────────────────
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
        <div className={`rounded-2xl border ${cfg.border} overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 bg-surface transform hover:-translate-y-1`}>
            <div className={`bg-gradient-to-r ${cfg.gradient} px-6 py-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-surface/10 transform -skew-x-12 translate-x-1/2" />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-surface/25 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <cfg.icon className="w-7 h-7 text-white" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-2xl leading-tight">{cfg.label}</p>
                            <p className="text-white/80 text-sm mt-0.5">{cfg.sublabel}</p>
                        </div>
                    </div>
                    {daysLeft >= 0 ? (
                        <div className={`text-right flex-shrink-0 bg-surface/20 rounded-xl px-4 py-2 backdrop-blur-sm ${isExpiring ? "animate-pulse-fast" : ""}`}>
                            <p className="text-3xl font-black text-white leading-none">{daysLeft}</p>
                            <p className="text-white/70 text-xs font-semibold">hari lagi</p>
                        </div>
                    ) : (
                        <div className="bg-surface/20 rounded-xl px-4 py-2">
                            <p className="text-white text-xs font-semibold">Berakhir {Math.abs(daysLeft)} hari lalu</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="px-6 py-6 space-y-6">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs text-content-muted mb-2">
                        <span>Mulai: {fmtDate(data.warranty_start)}</span>
                        <span>Berakhir: {fmtDate(data.warranty_end)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-border">
                        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${cfg.barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-content-muted mt-2">
                        <span>0%</span>
                        <span className="font-medium text-content-soft">{Math.round(pct)}% terpakai</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Tabel Detail - Responsif: label dan value dalam satu baris dengan wrap */}
                <div className="bg-surface-muted/80 rounded-xl border border-border overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {[
                            { icon: Laptop, label: "Laptop", value: data.laptop_name, bold: true },
                            { icon: Hash, label: "Serial Number", value: data.serial_number, mono: true, copyable: true },
                            { icon: User, label: "Nama Pembeli", value: data.customer_name },
                            { icon: Calendar, label: "Tanggal Mulai", value: fmtDate(data.warranty_start) },
                            { icon: Flag, label: "Garansi Berakhir", value: fmtDate(data.warranty_end), highlight: true, cfg },
                        ].map((row, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-surface transition-colors group">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    {/* Ikon dan label dalam satu baris untuk HP */}
                                    <div className="flex items-center gap-2 sm:w-32 flex-shrink-0">
                                        <span className="text-content-muted w-6 flex justify-center"><row.icon className="w-4 h-4" aria-hidden="true" /></span>
                                        <span className="text-xs font-medium text-content-soft">{row.label}</span>
                                    </div>
                                    {/* Value dan tombol copy */}
                                    <div className="flex-1 flex items-center justify-between gap-2">
                                        <span className={`text-sm break-words flex-1 ${row.mono ? "font-mono font-semibold text-content" : row.bold ? "font-bold text-content" : row.highlight ? `font-bold ${cfg.text}` : "text-content-soft"}`}>
                                            {row.value}
                                        </span>
                                        {row.copyable && (
                                            <button
                                                onClick={() => onCopy(row.value)}
                                                className="text-content-muted hover:text-blue-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 flex-shrink-0"
                                                title="Salin SN"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {data.notes && (
                    <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-3">
                        <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1"><FileText className="w-3.5 h-3.5" aria-hidden="true" /> Catatan</p>
                        <p className="text-sm text-blue-800">{data.notes}</p>
                    </div>
                )}

                {/* Ketentuan Garansi */}
                <WarrantyTerms />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                        href={`https://wa.me/6285210647047?text=${encodeURIComponent(`Halo Solit 03, saya ingin bertanya mengenai garansi laptop dengan SN: ${data.serial_number}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-12 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-soft active:scale-95"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                            <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                        </svg>
                        WhatsApp
                    </a>
                    <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 h-12 bg-surface border border-border hover:bg-surface-muted text-content-soft text-sm font-semibold rounded-xl transition-all hover:shadow-soft-sm active:scale-95">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                        </svg>
                        Cek SN Lain
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── KETENTUAN GARANSI (reusable) ─────────────────────────────────────────────
function WarrantyTerms() {
    const terms = [
        "Garansi hanya berlaku untuk kerusakan yang BUKAN akibat human error.",
        "Kerusakan LCD seperti pecah, kena air, terbakar, bergaris, berkedip, gelap/redup, blank putih, dead pixel, berbayang/shadow, warna pudar/tidak akurat, serta bercak hitam/putih TIDAK termasuk garansi.",
        "Wajib membawa nota pembelian ini saat melakukan klaim garansi.",
    ];

    return (
        <div className="rounded-2xl border border-border bg-surface shadow-soft-sm overflow-hidden">
            {/* Note: barang tidak bisa dikembalikan/ditukar */}
            <div className="flex items-start gap-3 bg-amber-50 border-b border-amber-100 px-5 py-3.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold mt-0.5">!</span>
                <p className="text-sm text-amber-800 leading-relaxed">
                    <span className="font-bold">Note:</span> Barang yang sudah dibeli tidak bisa dikembalikan dan ditukar.
                </p>
            </div>

            {/* Header */}
            <div className="px-5 pt-5 pb-2">
                <p className="text-sm font-bold text-content flex items-center gap-2">
                    <Shield className="w-4 h-4" aria-hidden="true" /> Ketentuan Garansi
                </p>
            </div>

            {/* Daftar ketentuan */}
            <ol className="px-5 pb-5 space-y-3">
                {terms.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-content-soft leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                        </span>
                        <span>{t}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}

// ── Not Found Card (tetap) ───────────────────────────────────────────────────
function NotFoundCard({ message, sn, onReset, onCopy }) {
    return (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-slate-900 px-6 py-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-surface/20 rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-white text-2xl">Data Tidak Ditemukan</p>
                        <p className="text-white/70 text-sm">Serial number tidak terdaftar</p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-6 space-y-6">
                <div className="bg-surface-muted rounded-xl px-5 py-3 border border-border flex justify-between items-center group">
                    <div>
                        <p className="text-xs text-content-muted mb-1">SN yang dicari</p>
                        <p className="font-mono font-bold text-content text-lg tracking-wide">{sn}</p>
                    </div>
                    <button onClick={() => onCopy(sn)} className="text-content-muted hover:text-blue-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100 p-1" title="Salin SN">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-3">
                    <p className="text-sm font-bold text-content-soft flex items-center gap-2"><Search className="w-4 h-4" aria-hidden="true" /> Kemungkinan penyebab:</p>
                    <ul className="space-y-2.5">
                        {["Serial number tidak sesuai — periksa kembali ejaan", "Laptop dibeli sebelum sistem garansi digital diterapkan", "Garansi sudah pernah dicabut (VOID)"].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-content-soft">
                                <span className="w-5 h-5 bg-slate-200 text-content-soft rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i+1}</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-3">
                    <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> Butuh bantuan?</p>
                    <p className="text-sm text-blue-600">Hubungi tim Solit 03 via WhatsApp dengan menyebutkan nomor invoice pembelian Anda.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href={`https://wa.me/6285210647047?text=${encodeURIComponent(`Halo Solit 03, saya ingin mengecek garansi laptop dengan SN: ${sn} tapi tidak ditemukan di sistem.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-12 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-soft active:scale-95"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                            <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                        </svg>
                        WhatsApp
                    </a>
                    <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 h-12 bg-surface border border-border hover:bg-surface-muted text-content-soft text-sm font-semibold rounded-xl transition-all hover:shadow-soft-sm active:scale-95">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                        </svg>
                        Cari Ulang
                    </button>
                </div>
            </div>
        </div>
    );
}