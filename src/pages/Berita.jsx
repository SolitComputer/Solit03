import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Newspaper, Search, X, Loader2, ChevronLeft, ChevronRight, Megaphone, SlidersHorizontal } from "lucide-react";
import { getFeaturedArticle, getArticles, getArticleCategories } from "../services/articles";
import { getArticleAds } from "../services/siteContent";
import ArticleCard from "../components/berita/ArticleCard";
import AdCard from "../components/berita/AdCard";

export default function Berita() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("kategori") || "";
  const page = Number(searchParams.get("page") || 1);

  const [featured, setFeatured] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [allAds, setAllAds] = useState([]);
  const [isUltraWide, setIsUltraWide] = useState(false);
  const limit = 9;

  useEffect(() => {
    const checkWidth = () => setIsUltraWide(window.innerWidth >= 1380);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    getArticleAds().then(setAllAds).catch(() => setAllAds([]));
  }, []);

  useEffect(() => {
    getArticleCategories().then(setCategories).catch(() => {});
    if (!activeCategory && page === 1) {
      getFeaturedArticle().then(setFeatured).catch(() => {});
    } else {
      setFeatured(null);
    }
  }, [activeCategory, page]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getArticles({
        page, limit, categorySlug: activeCategory || undefined, search: search || undefined,
      });
      setArticles(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  function setCategory(slug) {
    setSearchParams(slug ? { kategori: slug } : {});
  }
  function setPage(p) {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: String(p) });
  }

  const listArticles = featured ? articles.filter((a) => a.id !== featured.id) : articles;
  const flankAds = allAds.filter((a) => a.banner_size === "sidebar_flank");
  const flankLeftAd = flankAds[0] || null;
  const flankRightAd = flankAds[1] || null;
  const feedAds = allAds.filter((a) => a.banner_size !== "sidebar_flank" && a.placement !== "sidebar_flank");

  return (
    <div className="min-h-screen bg-surface-muted">
      <Helmet>
        <title>Berita &amp; Artikel — Solit 03</title>
        <meta name="description" content="Berita, tips, dan promo terbaru seputar laptop dan teknologi dari Solit 03." />
      </Helmet>

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0F2341] to-[#0A1628] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(35,145,255,0.1),transparent)] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-14">
          <div className="flex items-center gap-2 text-[#2391FF] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Newspaper size={14} /> Berita &amp; Artikel
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Update, tips, dan cerita<br className="hidden sm:block" /> seputar teknologi
          </h1>

          <div className="relative mt-8 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2391FF]/50 focus:border-[#2391FF]/30 transition-all backdrop-blur-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="bg-gradient-to-r from-[#0A1628] via-[#0D1D35] to-[#0A1628] border-t border-b border-white/[0.05] text-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pr-3 mr-1 border-r border-white/[0.08] text-slate-500 text-xs font-bold uppercase tracking-wider shrink-0 select-none">
            <SlidersHorizontal size={13} className="text-[#2391FF]" /> Kategori
          </div>

          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
              !activeCategory
                ? "bg-[#2391FF] text-white shadow-lg shadow-[#2391FF]/25 scale-[1.03]"
                : "bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1]"
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                activeCategory === c.slug
                  ? "bg-[#2391FF] text-white shadow-lg shadow-[#2391FF]/25 scale-[1.03]"
                  : "bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Containerr dengan Iklan Flank Kanan-Kiri */}
      <div className="w-full max-w-[1920px] mx-auto flex justify-center py-8">
        
        {/* IKLAN FLANK KIRI BERITA (Murni CSS In-Flow) */}
        {isUltraWide && flankLeftAd && (
          <div className="hidden xl:block flex-1 max-w-[300px] pr-6">
            <div className="sticky top-24 flex justify-end">
              <div style={{ width: Math.min(flankLeftAd.custom_width || 240, 260) }}>
                <AdCard ad={flankLeftAd} />
              </div>
            </div>
          </div>
        )}

        {/* TENGAH: GRID ARTIKEL */}
        <div className="w-full max-w-6xl px-4 sm:px-6 min-w-0">
          {/* Featured hero */}
          {featured && (
            <div className="mb-10">
              <ArticleCard article={featured} size="large" />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="animate-spin text-[#2391FF]" />
            </div>
          ) : listArticles.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Newspaper size={28} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-content-muted text-sm font-medium">Belum ada artikel ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const nodes = [];
                listArticles.forEach((a, i) => {
                  nodes.push(<ArticleCard key={a.id} article={a} />);

                  if ((i + 1) % 3 === 0 && feedAds.length > 0) {
                    const adIndex = Math.floor(i / 3) % feedAds.length;
                    const ad = feedAds[adIndex];
                    if (ad) {
                      nodes.push(
                        <div key={`ad-${i}`} className="col-span-full py-4 my-2">
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">
                            <Megaphone size={11} className="text-[#2391FF]" /> SPONSORED PROMO
                          </div>
                          <div className="max-w-4xl mx-auto">
                            <AdCard ad={ad} />
                          </div>
                        </div>
                      );
                    }
                  }
                });

                return nodes;
              })()}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-border text-content-muted hover:bg-surface hover:border-[#2391FF]/30 hover:text-[#2391FF] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-border disabled:hover:text-content-muted"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-content-muted px-4 font-medium">Halaman <span className="text-content font-bold">{page}</span> dari {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2.5 rounded-xl border border-border text-content-muted hover:bg-surface hover:border-[#2391FF]/30 hover:text-[#2391FF] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-border disabled:hover:text-content-muted"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* IKLAN FLANK KANAN BERITA (Murni CSS In-Flow) */}
        {isUltraWide && flankRightAd && (
          <div className="hidden xl:block flex-1 max-w-[300px] pl-6">
            <div className="sticky top-24 flex justify-start">
              <div style={{ width: Math.min(flankRightAd.custom_width || 240, 260) }}>
                <AdCard ad={flankRightAd} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
