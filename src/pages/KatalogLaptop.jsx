import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
    Laptop, Search, Cpu, MemoryStick, HardDrive, Monitor,
    ChevronLeft, ChevronRight, X, MessageCircle, Package,
    RotateCcw, Filter, Tag, Loader2, ShoppingBag, Box,
} from "lucide-react";
import { fetchCatalogLaptops } from "../services/catalog";

const WHATSAPP_NUMBER = "6285210647047";
const fmt = (n) => `Rp ${(Number(n) || 0).toLocaleString("id-ID")}`;
const priceLabel = (p) => (Number(p) > 0 ? fmt(p) : "Hubungi untuk harga");

function waLink(l) {
    const harga = Number(l.price) > 0 ? ` (${fmt(l.price)})` : "";
    const msg = `Halo Solit 03, saya tertarik dengan laptop *${l.laptop_name}*${harga}. Apakah masih tersedia?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ── Hooks (port dari Katalog.jsx) ──
function useDebounce(value, delay) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);
    return matches;
}

// ── Carousel foto kartu ──
function PhotoCarousel({ photos, name }) {
    const [idx, setIdx] = useState(0);
    useEffect(() => { setIdx(0); }, [photos]);

    if (!photos?.length) {
        return (
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <Laptop size={40} className="text-slate-300" />
            </div>
        );
    }
    const prev = (e) => { e.stopPropagation(); setIdx((i) => (i > 0 ? i - 1 : photos.length - 1)); };
    const next = (e) => { e.stopPropagation(); setIdx((i) => (i < photos.length - 1 ? i + 1 : 0)); };

    return (
        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden group/ph">
            <img src={photos[idx].image_url} alt={name} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {photos.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover/ph:opacity-100 transition flex items-center justify-center z-10">
                        <ChevronLeft size={14} />
                    </button>
                    <button onClick={next} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover/ph:opacity-100 transition flex items-center justify-center z-10">
                        <ChevronRight size={14} />
                    </button>
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {photos.map((_, i) => <span key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === idx ? "bg-white" : "bg-white/40"}`} />)}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Kartu (mirror AnimatedProductCard) ──
function LaptopCard({ laptop, onClick, index }) {
    return (
        <div onClick={onClick}
            className="group card-3d overflow-hidden cursor-pointer animate-fadeInUp"
            style={{ animationDelay: `${index * 50}ms` }}>
            <div className="relative">
                <PhotoCarousel photos={laptop.photos} name={laptop.laptop_name} />
                {laptop.stock > 0 && (
                    <span className="absolute top-2 left-2 z-10 px-1.5 sm:px-2 py-0.5 bg-green-500 text-white text-[9px] sm:text-[10px] font-semibold rounded-full shadow-soft-sm">
                        Ready {laptop.stock}
                    </span>
                )}
            </div>

            <div className="p-2 sm:p-3">
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mb-0.5 truncate">{laptop.brand || "Umum"}</p>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">{laptop.laptop_name}</h3>

                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1.5 mb-2">
                    {laptop.cpu && (
                        <span className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-medium">
                            <Cpu size={9} />
                            <span className="hidden sm:inline">{laptop.cpu.split(" ").slice(0, 2).join(" ")}</span>
                            <span className="sm:hidden">{laptop.cpu.split(" ")[0]}</span>
                        </span>
                    )}
                    {laptop.ram && (
                        <span className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-medium">
                            <MemoryStick size={9} />{laptop.ram}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                    <div className="flex-1 min-w-0">
                        <p className={`font-black leading-tight truncate ${Number(laptop.price) > 0 ? "text-slate-800 text-sm sm:text-base" : "text-blue-600 text-xs sm:text-sm"}`}>
                            {priceLabel(laptop.price)}
                        </p>
                    </div>
                    <button className="px-2 sm:px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all hover:shadow-soft-sm whitespace-nowrap">
                        Detail
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Search bar (port) ──
function AnimatedSearchBar({ value, onChange, isLoading }) {
    const [isFocused, setIsFocused] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");
    return (
        <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.02]" : "scale-100"}`}>
            <div className={`absolute inset-0 bg-blue-500 rounded-lg blur-lg transition-opacity duration-300 ${isFocused ? "opacity-30" : "opacity-0"}`} />
            <div className="relative">
                <Search size={isMobile ? 14 : 16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ transform: isFocused ? "translateY(-50%) scale(1.1)" : "translateY(-50%)" }} />
                <input type="text" placeholder={isMobile ? "Cari laptop..." : "Cari nama, brand, atau CPU..."} value={value}
                    onChange={(e) => onChange(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                    className="w-full pl-8 pr-8 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition-all duration-300" />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 size={14} className="text-blue-500 animate-spin" /></div>
                )}
                {value && !isLoading && (
                    <button onClick={() => onChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={isMobile ? 12 : 14} />
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Result count (port) ──
function ResultCount({ count, isSearching }) {
    const [display, setDisplay] = useState(count);
    const [anim, setAnim] = useState(false);
    useEffect(() => {
        if (count !== display) {
            setAnim(true);
            const t = setTimeout(() => { setDisplay(count); setAnim(false); }, 200);
            return () => clearTimeout(t);
        }
    }, [count, display]);
    return (
        <div className="flex items-center gap-1.5">
            {isSearching ? (
                <Loader2 size={10} className="text-blue-500 animate-spin" />
            ) : (
                <div className={`w-1.5 h-1.5 rounded-full bg-green-500 transition-all duration-300 ${anim ? "scale-150" : "scale-100"}`} />
            )}
            <p className="text-[11px] sm:text-xs text-slate-500">
                <span className={`font-semibold text-slate-800 transition-all duration-300 ${anim ? "text-blue-600" : ""}`}>{display}</span> laptop ditemukan
            </p>
        </div>
    );
}

// ── Chip + PageBtn (port) ──
function Chip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[9px] sm:text-[10px] font-medium">
            <span className="truncate max-w-[120px] sm:max-w-none">{label}</span>
            <button onClick={onRemove} className="hover:text-blue-900 flex-shrink-0"><X size={8} /></button>
        </span>
    );
}
function PageBtn({ children, active, disabled, onClick }) {
    return (
        <button onClick={onClick} disabled={disabled}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center transition-all ${active ? "bg-blue-600 text-white shadow-sm" : disabled ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"}`}>
            {children}
        </button>
    );
}

// ── Empty state (port) ──
function EmptyState({ onReset, hasFilter, searchTerm }) {
    const [show, setShow] = useState(false);
    useEffect(() => { setShow(true); }, []);
    return (
        <div className={`flex flex-col items-center justify-center py-8 sm:py-12 text-center transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3 animate-bounce">
                {searchTerm ? <Search size={20} className="text-slate-400" /> : <ShoppingBag size={20} className="text-slate-300" />}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-1">
                {searchTerm ? "Laptop tidak ditemukan" : "Belum ada laptop ready"}
            </h3>
            <p className="text-slate-400 text-[11px] sm:text-xs mb-4 px-4">
                {searchTerm ? `Tidak ada laptop yang cocok dengan "${searchTerm}"`
                    : hasFilter ? "Coba ubah filter pencarian" : "Stok tampil setelah admin upload foto"}
            </p>
            {(searchTerm || hasFilter) && (
                <button onClick={onReset} className="px-3 sm:px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] sm:text-xs font-semibold hover:bg-blue-700 transition-all hover:scale-105">
                    {searchTerm ? "Bersihkan Pencarian" : "Reset Filter"}
                </button>
            )}
        </div>
    );
}

// ── Skeleton (port) ──
function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
            <div className="aspect-video bg-slate-200" />
            <div className="p-2 sm:p-3">
                <div className="h-2 bg-slate-200 rounded w-16 sm:w-20 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="flex gap-1 mb-3"><div className="h-3 sm:h-4 bg-slate-200 rounded w-12 sm:w-16" /><div className="h-3 sm:h-4 bg-slate-200 rounded w-10 sm:w-14" /></div>
                <div className="flex justify-between items-center"><div className="h-4 sm:h-5 bg-slate-200 rounded w-16 sm:w-20" /><div className="h-6 sm:h-7 bg-slate-200 rounded w-12 sm:w-16" /></div>
            </div>
        </div>
    );
}
function SkeletonGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
}

// ── Sidebar filter (Brand + Harga) ──
function FilterSidebar({ brands, selectedBrand, setSelectedBrand, priceRange, setPriceRange, hasFilter, onReset }) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Brand</h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                        <input type="radio" name="brand" checked={!selectedBrand} onChange={() => setSelectedBrand(null)} className="w-3 h-3 text-blue-600" />
                        <span className="text-slate-600">Semua Brand</span>
                    </label>
                    {brands.map((b) => (
                        <label key={b} className="flex items-center gap-1.5 cursor-pointer text-xs">
                            <input type="radio" name="brand" checked={selectedBrand === b} onChange={() => setSelectedBrand(b)} className="w-3 h-3 text-blue-600" />
                            <span className="text-slate-600 truncate">{b}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Rentang Harga</h3>
                <div className="flex gap-1.5">
                    <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-1/2 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-1/2 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            {hasFilter && (
                <button onClick={onReset} className="w-full py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                    <RotateCcw size={10} /> Reset Filter
                </button>
            )}
        </div>
    );
}

// ── Modal detail (mirror ProductModal) ──
function DetailModal({ laptop, onClose }) {
    const [imgIdx, setImgIdx] = useState(0);
    const images = (laptop.photos || []).map((p) => p.image_url).filter(Boolean);
    const stock = laptop.stock || 0;

    useEffect(() => { setImgIdx(0); }, [laptop]);
    useEffect(() => {
        document.body.style.overflow = "hidden";
        const h = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", h);
        return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
    }, [onClose]);

    const SPEC_ROWS = [
        { icon: <Cpu size={14} />, label: "Processor", value: laptop.cpu },
        { icon: <MemoryStick size={14} />, label: "RAM", value: laptop.ram },
        { icon: <HardDrive size={14} />, label: "Storage", value: laptop.storage },
        { icon: <Monitor size={14} />, label: "Display", value: laptop.display },
        { icon: <Box size={14} />, label: "GPU", value: laptop.gpu },
    ].filter((r) => r.value && String(r.value).trim());

    const prevImage = () => setImgIdx((p) => (p > 0 ? p - 1 : images.length - 1));
    const nextImage = () => setImgIdx((p) => (p < images.length - 1 ? p + 1 : 0));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-soft-lg mx-2 sm:mx-0" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-3 sm:px-4 py-2 flex sm:py-2.5 items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-100 flex items-center justify-center"><Laptop size={14} className="text-blue-600" /></div>
                        <div className="flex items-center gap-1 text-slate-500 truncate">
                            <span className="hidden sm:inline">Detail Laptop</span>
                            {laptop.brand && (<><ChevronRight size={12} className="text-slate-300 flex-shrink-0" /><span className="text-slate-700 font-medium truncate">{laptop.brand}</span></>)}
                        </div>
                    </div>
                    <button onClick={onClose} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all flex-shrink-0">
                        <X size={12} className="text-slate-500" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-52px)]">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4">
                            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-soft-sm border border-slate-100 group">
                                {images[imgIdx] ? (
                                    <>
                                        <img src={images[imgIdx]} alt={laptop.laptop_name} className="w-full h-full object-contain p-3 sm:p-4" />
                                        {images.length > 1 && (
                                            <>
                                                <button onClick={prevImage} className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><ChevronLeft size={14} /></button>
                                                <button onClick={nextImage} className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><ChevronRight size={14} /></button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Laptop size={48} className="text-slate-300" /></div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="mt-3">
                                    <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 justify-center">
                                        {images.map((img, i) => (
                                            <button key={i} onClick={() => setImgIdx(i)} className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-blue-500 ring-1 ring-blue-200" : "border-slate-200"}`}>
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center text-[9px] sm:text-[10px] text-slate-400 mt-1">{imgIdx + 1} / {images.length}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 sm:p-4 lg:p-5">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {laptop.brand && (
                                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] sm:text-[10px] font-semibold rounded-full"><Tag size={10} /> {laptop.brand}</span>
                                )}
                                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-50 text-green-700 text-[9px] sm:text-[10px] font-semibold rounded-full"><Package size={10} /> Ready {stock} unit</span>
                            </div>

                            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-tight">{laptop.laptop_name}</h1>

                            <div className="mb-3 pb-2 border-b border-slate-100">
                                <p className={`font-black ${Number(laptop.price) > 0 ? "text-blue-700 text-lg sm:text-xl lg:text-2xl" : "text-slate-700 text-base"}`}>{priceLabel(laptop.price)}</p>
                            </div>

                            <div className={`mb-3 p-2 rounded-lg flex items-center gap-2 text-[10px] sm:text-xs ${stock > 0 ? (stock < 5 ? "bg-amber-50 border border-amber-100" : "bg-green-50 border border-green-100") : "bg-red-50 border border-red-100"}`}>
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${stock > 0 ? (stock < 5 ? "bg-amber-500 animate-pulse" : "bg-green-500") : "bg-red-500"}`} />
                                <p className={`font-medium text-[9px] sm:text-[10px] ${stock > 0 ? (stock < 5 ? "text-amber-700" : "text-green-700") : "text-red-700"}`}>
                                    {stock > 0 ? (stock < 5 ? `Sisa ${stock} unit` : `Tersedia (${stock} unit)`) : "Stok habis"}
                                </p>
                            </div>

                            {SPEC_ROWS.length > 0 && (
                                <div className="bg-slate-50 rounded-lg p-2 sm:p-3 mb-3">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center"><Cpu size={12} className="text-blue-600" /></div>
                                        <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase">Spesifikasi</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5 text-[10px] sm:text-xs">
                                        {SPEC_ROWS.map((row) => (
                                            <div key={row.label} className="flex items-start gap-1.5">
                                                <span className="text-slate-400 mt-0.5 flex-shrink-0">{row.icon}</span>
                                                <span className="text-slate-500 w-12 sm:w-16 flex-shrink-0 text-[9px] sm:text-[10px]">{row.label}</span>
                                                <span className="text-slate-800 font-medium text-[9px] sm:text-[10px] flex-1 break-words">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {laptop.condition_note && (
                                <div className="mb-3">
                                    <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase mb-1">Kondisi</p>
                                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{laptop.condition_note}</p>
                                </div>
                            )}

                            <a href={waLink(laptop)} target="_blank" rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 hover:shadow-soft text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                                <MessageCircle size={16} /> Tanya / Pesan via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Page ──
export default function KatalogLaptop() {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 400);
    const [isSearching, setIsSearching] = useState(false);

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selected, setSelected] = useState(null);

    const isMobile = useMediaQuery("(max-width: 640px)");
    const perPage = isMobile ? 8 : 12;

    const load = async () => {
        setLoading(true); setError(null);
        try {
            const data = await fetchCatalogLaptops();
            setLaptops(data.filter((l) => l.photos?.length > 0)); // hanya yg ada foto
        } catch (e) {
            console.error(e);
            setError("Gagal memuat katalog. Coba lagi.");
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    useEffect(() => { setIsSearching(searchInput !== debouncedSearch); }, [searchInput, debouncedSearch]);

    const brands = useMemo(() => {
        const s = new Set(laptops.map((l) => l.brand).filter(Boolean));
        return Array.from(s).sort();
    }, [laptops]);

    const filtered = useMemo(() => {
        let result = [...laptops];
        if (selectedBrand) result = result.filter((l) => l.brand === selectedBrand);
        if (debouncedSearch) {
            const t = debouncedSearch.toLowerCase();
            result = result.filter((l) =>
                l.laptop_name?.toLowerCase().includes(t) ||
                l.brand?.toLowerCase().includes(t) ||
                l.cpu?.toLowerCase().includes(t) ||
                l.ram?.toLowerCase().includes(t));
        }
        if (priceRange.min) result = result.filter((l) => (l.price || 0) >= parseInt(priceRange.min));
        if (priceRange.max) result = result.filter((l) => (l.price || 0) <= parseInt(priceRange.max));
        result.sort((a, b) => {
            if (sort === "price_high") return (b.price || 0) - (a.price || 0);
            if (sort === "price_low") return (a.price || 0) - (b.price || 0);
            if (sort === "name_asc") return (a.laptop_name || "").localeCompare(b.laptop_name || "");
            return new Date(b.created_at) - new Date(a.created_at);
        });
        return result;
    }, [laptops, selectedBrand, debouncedSearch, priceRange.min, priceRange.max, sort]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);
    const hasFilter = !!selectedBrand || !!debouncedSearch || !!priceRange.min || !!priceRange.max;

    const resetFilters = () => {
        setSelectedBrand(null); setSearchInput(""); setPriceRange({ min: "", max: "" }); setPage(1);
    };

    useEffect(() => { setPage(1); }, [selectedBrand, debouncedSearch, priceRange, sort]);

    // Initial loading full-screen (seperti Katalog.jsx)
    if (loading && laptops.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-12 px-2 sm:px-3">
                <div className="max-w-7xl mx-auto"><SkeletonGrid /></div>
            </div>
        );
    }

    if (error && laptops.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <p className="text-red-500 text-xs sm:text-sm mb-2">{error}</p>
                    <button onClick={load} className="px-3 sm:px-3.5 py-1.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg">Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Laptop Ready Stock — Bekas Bergaransi | Solit 03</title>
                <meta name="description" content="Laptop second ready stock bergaransi di Solit 03 Depok. Foto asli, spesifikasi lengkap, harga update setiap hari." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
                <link rel="canonical" href="https://solit03.com/katalog-laptop" />
            </Helmet>

            <div className="bg-slate-50 min-h-screen pt-8">
                <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .animate-fadeInUp { animation: fadeInUp 0.4s cubic-bezier(0.2,0.9,0.4,1.1) forwards; opacity: 0; }
          .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
          .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
          .shimmer-text { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
          @media (max-width: 640px) { .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; } }
        `}</style>

                {/* Toolbar */}
                <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-soft-sm">
                    <div className="w-full px-2 sm:px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-slate-700 flex-shrink-0">
                                <Laptop size={16} className="text-blue-600" />
                                <span className="text-xs sm:text-sm font-bold hidden sm:inline">Laptop Ready</span>
                            </div>

                            <div className="flex-1 max-w-[180px] sm:max-w-xs">
                                <AnimatedSearchBar value={searchInput} onChange={setSearchInput} isLoading={isSearching} />
                            </div>

                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <select value={sort} onChange={(e) => setSort(e.target.value)}
                                    className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all hover:bg-slate-200">
                                    <option value="newest">Terbaru</option>
                                    <option value="price_high">Harga Tertinggi</option>
                                    <option value="price_low">Harga Terendah</option>
                                    <option value="name_asc">Nama A-Z</option>
                                </select>
                                <button onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="lg:hidden flex items-center gap-1 px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs bg-slate-100 rounded-lg transition-all hover:bg-slate-200 flex-shrink-0">
                                    <Filter size={12} />
                                    <span className="hidden sm:inline">Filter</span>
                                    {hasFilter && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-2 sm:px-3 py-6 sm:py-10">
                    <div className="flex gap-4">
                        {/* Sidebar desktop */}
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-16 bg-white rounded-xl border border-slate-200 p-3">
                                <FilterSidebar brands={brands} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
                                    priceRange={priceRange} setPriceRange={setPriceRange} hasFilter={hasFilter} onReset={resetFilters} />
                            </div>
                        </div>

                        {/* Sidebar mobile drawer */}
                        {showMobileFilters && (
                            <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
                                <div className="absolute inset-0 top-16 md:top-20 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                                <div className="absolute right-0 top-16 md:top-20 bottom-0 w-80 max-w-[85vw] bg-white shadow-soft-lg overflow-y-auto animate-slideInRight rounded-tl-2xl">
                                    <div className="p-3 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                                        <h3 className="font-bold text-slate-800 text-sm">Filter</h3>
                                        <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={14} /></button>
                                    </div>
                                    <div className="p-3">
                                        <FilterSidebar brands={brands} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
                                            priceRange={priceRange} setPriceRange={setPriceRange} hasFilter={hasFilter} onReset={resetFilters} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <ResultCount count={filtered.length} isSearching={isSearching} />
                                {hasFilter && (
                                    <div className="flex flex-wrap gap-1.5 animate-slideDown max-w-full">
                                        {selectedBrand && <Chip label={selectedBrand} onRemove={() => setSelectedBrand(null)} />}
                                        {debouncedSearch && <Chip label={`"${debouncedSearch}"`} onRemove={() => setSearchInput("")} />}
                                        {(priceRange.min || priceRange.max) && (
                                            <Chip label={`Harga: ${priceRange.min || "0"} - ${priceRange.max || "∞"}`} onRemove={() => setPriceRange({ min: "", max: "" })} />
                                        )}
                                    </div>
                                )}
                            </div>

                            {isSearching ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
                                    {Array.from({ length: perPage }).map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                                            <div className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 shimmer-text" />
                                            <div className="p-2 sm:p-2.5">
                                                <div className="h-2 bg-slate-200 rounded w-16 mb-1.5" />
                                                <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                                                <div className="flex gap-1 mb-2"><div className="h-3 bg-slate-200 rounded w-12" /><div className="h-3 bg-slate-200 rounded w-12" /></div>
                                                <div className="flex justify-between pt-1.5"><div className="h-4 bg-slate-200 rounded w-20" /><div className="h-6 bg-slate-200 rounded w-14" /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : paged.length === 0 ? (
                                <EmptyState onReset={resetFilters} hasFilter={hasFilter} searchTerm={debouncedSearch} />
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
                                        {paged.map((l, idx) => (
                                            <LaptopCard key={l.id} laptop={l} index={idx} onClick={() => setSelected(l)} />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-6 gap-1 animate-fadeInUp flex-wrap">
                                            <PageBtn onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}><ChevronLeft size={12} /></PageBtn>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let n;
                                                if (totalPages <= 5) n = i + 1;
                                                else if (page <= 3) n = i + 1;
                                                else if (page >= totalPages - 2) n = totalPages - 4 + i;
                                                else n = page - 2 + i;
                                                return <PageBtn key={n} active={page === n} onClick={() => setPage(n)}>{n}</PageBtn>;
                                            })}
                                            <PageBtn onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}><ChevronRight size={12} /></PageBtn>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selected && <DetailModal laptop={selected} onClose={() => setSelected(null)} />}
        </>
    );
}