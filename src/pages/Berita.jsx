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
  const limit = 9;

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

  return (
    <div className="min-h-screen bg-surface-muted">
      <Helmet>
        <title>Berita &amp; Artikel — Solit 03</title>
        <meta name="description" content="Berita, tips, dan promo terbaru seputar laptop dan teknologi dari Solit 03." />
      </Helmet>

      {/* Header */}
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Newspaper size={14} /> Berita &amp; Artikel
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Update, tips, dan cerita seputar teknologi
          </h1>

          <div className="relative mt-6 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="bg-[#0f172a] border-t border-b border-slate-800 text-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pr-3 mr-1 border-r border-slate-800 text-content-muted text-xs font-bold uppercase tracking-wider shrink-0 select-none">
            <SlidersHorizontal size={13} className="text-blue-400" /> Kategori
          </div>

          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
              !activeCategory
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.03]"
                : "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/70"
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.03]"
                  : "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/70"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured hero */}
        {featured && (
          <div className="mb-10">
            <ArticleCard article={featured} size="large" />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-blue-500" />
          </div>
        ) : listArticles.length === 0 ? (
          <div className="text-center py-24">
            <Newspaper size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-content-muted text-sm">Belum ada artikel ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(() => {
              const nodes = [];
              listArticles.forEach((a, i) => {
                nodes.push(<ArticleCard key={a.id} article={a} />);

                // Insert full-width ad banner between rows every 3 articles
                if ((i + 1) % 3 === 0 && allAds.length > 0) {
                  const adIndex = Math.floor(i / 3) % allAds.length;
                  const ad = allAds[adIndex];
                  if (ad) {
                    nodes.push(
                      <div key={`ad-${i}`} className="col-span-full py-4 my-2">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">
                          <Megaphone size={11} className="text-blue-500" /> SPONSORED PROMO
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
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border text-content-muted hover:bg-surface transition disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-content-muted px-3">Halaman {page} dari {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border text-content-muted hover:bg-surface transition disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
