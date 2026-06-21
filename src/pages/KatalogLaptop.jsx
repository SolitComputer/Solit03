import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Laptop, Search, Cpu, MemoryStick, HardDrive, Monitor,
  ChevronLeft, ChevronRight, X, MessageCircle, Package,
  RotateCcw, ImageOff, Box,
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

function PhotoCarousel({ photos, name, fit = "cover", rounded = "" }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [photos]);

  if (!photos?.length) {
    return (
      <div className={`aspect-video bg-slate-100 flex items-center justify-center ${rounded}`}>
        <ImageOff size={32} className="text-slate-300" />
      </div>
    );
  }
  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i > 0 ? i - 1 : photos.length - 1)); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i < photos.length - 1 ? i + 1 : 0)); };

  return (
    <div className={`relative aspect-video bg-white overflow-hidden group/ph ${rounded}`}>
      <img src={photos[idx].image_url} alt={name} loading="lazy"
        className={`w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`} />
      {photos.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover/ph:opacity-100 transition flex items-center justify-center">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover/ph:opacity-100 transition flex items-center justify-center">
            <ChevronRight size={14} />
          </button>
          <span className="absolute top-1.5 right-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
            {idx + 1}/{photos.length}
          </span>
        </>
      )}
    </div>
  );
}

function LaptopCard({ laptop, onClick }) {
  return (
    <div onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <PhotoCarousel photos={laptop.photos} name={laptop.laptop_name} rounded="rounded-t-xl" />
        {laptop.stock > 0 && (
          <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold bg-green-500 text-white px-2 py-0.5 rounded-full shadow-sm">
            Ready {laptop.stock}
          </span>
        )}
      </div>
      <div className="p-2.5 sm:p-3">
        <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mb-0.5 truncate">{laptop.brand || "Laptop"}</p>
        <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.2em]">
          {laptop.laptop_name}
        </h3>
        <div className="flex flex-wrap items-center gap-1 mt-1.5 mb-2">
          {laptop.cpu && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] sm:text-[10px] font-medium">
              <Cpu size={9} /><span className="truncate max-w-[80px]">{laptop.cpu.split(" ").slice(0, 2).join(" ")}</span>
            </span>
          )}
          {laptop.ram && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] sm:text-[10px] font-medium">
              <MemoryStick size={9} />{laptop.ram}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
          <p className={`font-black leading-tight truncate ${Number(laptop.price) > 0 ? "text-slate-800 text-sm sm:text-base" : "text-blue-600 text-xs sm:text-sm"}`}>
            {priceLabel(laptop.price)}
          </p>
          <button className="px-2.5 py-1 bg-white border border-slate-300 group-hover:border-blue-500 text-slate-700 group-hover:text-blue-600 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ laptop, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [onClose]);

  const specs = [
    { icon: <Cpu size={14} />, label: "Processor", value: laptop.cpu },
    { icon: <MemoryStick size={14} />, label: "RAM", value: laptop.ram },
    { icon: <HardDrive size={14} />, label: "Storage", value: laptop.storage },
    { icon: <Monitor size={14} />, label: "Display", value: laptop.display },
    { icon: <Box size={14} />, label: "GPU", value: laptop.gpu },
  ].filter((s) => s.value && String(s.value).trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 truncate">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Laptop size={14} className="text-blue-600" />
            </div>
            <span className="font-medium text-slate-700 truncate">{laptop.brand || "Detail Laptop"}</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0">
            <X size={12} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-50px)]">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4">
              <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                <PhotoCarousel photos={laptop.photos} name={laptop.laptop_name} fit="contain" />
              </div>
            </div>

            <div className="p-3 sm:p-4 lg:p-5">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full">
                  <Package size={10} /> Ready {laptop.stock} unit
                </span>
                {laptop.brand && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">
                    {laptop.brand}
                  </span>
                )}
              </div>

              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-tight">{laptop.laptop_name}</h1>

              <div className="mb-3 pb-3 border-b border-slate-100">
                <p className={`font-black ${Number(laptop.price) > 0 ? "text-blue-700 text-xl sm:text-2xl" : "text-slate-700 text-base"}`}>
                  {priceLabel(laptop.price)}
                </p>
              </div>

              {specs.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Spesifikasi</p>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {specs.map((s) => (
                      <div key={s.label} className="flex items-start gap-1.5">
                        <span className="text-slate-400 mt-0.5">{s.icon}</span>
                        <span className="text-slate-500 w-16 flex-shrink-0 text-[10px]">{s.label}</span>
                        <span className="text-slate-800 font-medium text-[10px] flex-1 break-words">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {laptop.condition_note && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Kondisi</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{laptop.condition_note}</p>
                </div>
              )}

              <a href={waLink(laptop)} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-md text-white text-sm font-semibold py-2.5 rounded-lg transition-all">
                <MessageCircle size={16} /> Tanya / Pesan via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-200" />
      <div className="p-3">
        <div className="h-2 bg-slate-200 rounded w-16 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-3/4 mb-3" />
        <div className="flex gap-1 mb-3"><div className="h-4 bg-slate-200 rounded w-14" /><div className="h-4 bg-slate-200 rounded w-12" /></div>
        <div className="flex justify-between pt-2 border-t border-slate-100"><div className="h-4 bg-slate-200 rounded w-20" /><div className="h-6 bg-slate-200 rounded w-14" /></div>
      </div>
    </div>
  );
}

export default function KatalogLaptop() {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [selected, setSelected] = useState(null);

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

  const brands = useMemo(() => {
    const s = new Set(laptops.map((l) => l.brand).filter(Boolean));
    return ["ALL", ...Array.from(s).sort()];
  }, [laptops]);

  const filtered = useMemo(() => {
    let list = [...laptops];
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter((l) =>
        l.laptop_name?.toLowerCase().includes(t) ||
        l.brand?.toLowerCase().includes(t) ||
        l.cpu?.toLowerCase().includes(t) ||
        l.ram?.toLowerCase().includes(t));
    }
    if (brand !== "ALL") list = list.filter((l) => l.brand === brand);
    switch (sort) {
      case "PRICE_ASC": list.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "PRICE_DESC": list.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "NAME": list.sort((a, b) => (a.laptop_name || "").localeCompare(b.laptop_name || "")); break;
      default: list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return list;
  }, [laptops, search, brand, sort]);

  const hasFilter = search.trim() || brand !== "ALL" || sort !== "NEWEST";
  const reset = () => { setSearch(""); setBrand("ALL"); setSort("NEWEST"); };

  return (
    <>
      <Helmet>
        <title>Laptop Ready Stock — Bekas Bergaransi | Solit 03</title>
        <meta name="description" content="Laptop second ready stock bergaransi di Solit 03 Depok. Foto asli, spesifikasi lengkap, harga update setiap hari." />
        <link rel="canonical" href="https://solit03.com/katalog-laptop" />
      </Helmet>

      <div className="bg-slate-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] sm:text-xs font-medium mb-2">
              <Laptop size={12} /> Ready Stock
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black mb-1">Laptop Ready Solit 03</h1>
            <p className="text-blue-100 text-xs sm:text-sm">Laptop siap jual dengan foto asli & garansi. Stok update langsung dari sistem.</p>
          </div>
        </div>

        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari nama, brand, CPU..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
              <select value={brand} onChange={(e) => setBrand(e.target.value)}
                className="px-2 py-1.5 text-[11px] sm:text-xs bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[110px]">
                {brands.map((b) => <option key={b} value={b}>{b === "ALL" ? "Semua Brand" : b}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="px-2 py-1.5 text-[11px] sm:text-xs bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option value="NEWEST">Terbaru</option>
                <option value="PRICE_ASC">Harga Termurah</option>
                <option value="PRICE_DESC">Harga Tertinggi</option>
                <option value="NAME">Nama A-Z</option>
              </select>
              {hasFilter && (
                <button onClick={reset} className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500" title="Reset">
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {!loading && !error && (
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              <span className="font-semibold text-slate-800">{filtered.length}</span> laptop ready
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-sm mb-3">{error}</p>
              <button onClick={load} className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Coba Lagi</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Laptop size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-700 font-bold text-sm mb-1">
                {laptops.length === 0 ? "Belum ada laptop ready" : "Tidak ada hasil"}
              </p>
              <p className="text-slate-400 text-xs">
                {laptops.length === 0 ? "Stok tampil setelah admin upload foto" : "Coba ubah pencarian atau filter"}
              </p>
              {hasFilter && laptops.length > 0 && (
                <button onClick={reset} className="mt-3 text-blue-600 text-sm hover:underline">Reset filter</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {filtered.map((l) => <LaptopCard key={l.id} laptop={l} onClick={() => setSelected(l)} />)}
            </div>
          )}
        </div>
      </div>

      {selected && <DetailModal laptop={selected} onClose={() => setSelected(null)} />}
    </>
  );
}