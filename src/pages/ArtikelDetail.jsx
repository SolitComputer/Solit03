import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronLeft, Loader2, Newspaper, Eye, CalendarDays,
  Share2, Check, Flame, Clock, Tag as TagIcon, Megaphone,
} from "lucide-react";
import { getArticleBySlug, getRelatedArticles, getPopularArticles } from "../services/articles";
import { getArticleAds } from "../services/siteContent";
import AdCard from "../components/berita/AdCard";
import logo from "../assets/solit03.jpeg";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function ArtikelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setNotFound(false);
    getArticleBySlug(slug)
      .then(async (data) => {
        setArticle(data);
        const [rel, pop, ads] = await Promise.all([
          getRelatedArticles(data, 6).catch(() => []),
          getPopularArticles(5, data.id).catch(() => []),
          getArticleAds().catch(() => []),
        ]);
        setRelated(rel);
        setPopular(pop);
        setAllAds(ads);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.excerpt || "", url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <Newspaper size={40} className="text-slate-300 mb-3" />
        <h1 className="text-xl font-bold text-slate-800">Artikel tidak ditemukan</h1>
        <button onClick={() => navigate("/berita")} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
          Kembali ke Berita
        </button>
      </div>
    );
  }

  const category = article.article_categories;

  // Select ads for different editorial placements
  const topAd = allAds.find((a) => a.banner_size === "billboard" || a.banner_size === "leaderboard") || allAds[0];
  const sidebarAd = allAds.find((a) => a.banner_size === "medium_rectangle") || (allAds.length > 1 ? allAds[1] : (allAds[0] !== topAd ? allAds[0] : null));
  const contentAd = allAds.length > 2 ? allAds[2] : (allAds.find((a) => a !== topAd && a !== sidebarAd) || null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{article.title} — Solit 03</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || ""} />
        {article.cover_image && <meta property="og:image" content={article.cover_image} />}
        <meta property="og:type" content="article" />
      </Helmet>

      {/* ============ STICKY READING HEADER (THE VERGE STYLE) ============ */}
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all duration-300 ease-in-out ${
          showStickyHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img src={logo} alt="Solit 03" className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700" />
            <span className="text-sm font-black uppercase tracking-tight text-white font-['Hanken_Grotesk',sans-serif]">
              SOLIT<span className="text-blue-500">03</span>
            </span>
          </Link>

          {/* Judul Artikel di Tengah (The Verge Style) */}
          <div className="flex-1 min-w-0 text-center px-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-lg mx-auto">
              {article.title}
            </h2>
          </div>

          {/* Tombol Share di Kanan */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-blue-500 transition shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            <span className="hidden sm:inline">{copied ? "Tersalin" : "Bagikan"}</span>
          </button>
        </div>
      </div>

      {/* ============ IKLAN FLANKING — viewport 2xl ============ */}
      {allAds[3] && (
        <div className="hidden 2xl:block fixed left-4 top-28 w-[220px] z-20">
          <AdCard ad={allAds[3]} />
        </div>
      )}
      {allAds[4] && (
        <div className="hidden 2xl:block fixed right-4 top-28 w-[220px] z-20">
          <AdCard ad={allAds[4]} />
        </div>
      )}

      {/* ============ HEADER ============ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Navigation & Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs">
          <Link
            to="/berita"
            className="group inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={15} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke Berita
          </Link>

          {category?.name && (
            <span className="text-slate-300 font-light">•</span>
          )}

          {category?.name && (
            <Link
              to={`/berita?kategori=${category.slug}`}
              className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-200/80 text-blue-600 text-[11px] font-black uppercase tracking-wider rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all shadow-2xs"
            >
              {category.name}
            </Link>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mt-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="font-serif text-lg md:text-xl text-slate-600 leading-relaxed mt-5 max-w-2xl">
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 pb-6 border-b border-slate-200">
          {article.author && (
            <span className="flex items-center gap-2 text-sm">
              <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-black text-white">
                {article.author.charAt(0).toUpperCase()}
              </span>
              <span className="font-semibold text-blue-600">{article.author}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarDays size={14} /> {formatDate(article.published_at || article.created_at)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <Eye size={14} /> {(article.views || 0).toLocaleString()} views
          </span>

          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition"
          >
            {copied ? <><Check size={13} /> Tersalin</> : <><Share2 size={13} /> Bagikan</>}
          </button>
        </div>
      </div>

      {/* ============ HERO IMAGE ============ */}
      {article.cover_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-2xl shadow-md"
          />
          {article.author && (
            <p className="text-xs text-slate-400 mt-2 text-center">Foto: {article.author} / Solit 03</p>
          )}
        </div>
      )}

      {/* ============ IKLAN SPONSOR ATAS (BILLBOARD / LEADERBOARD) ============ */}
      {topAd && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <Megaphone size={11} className="text-blue-500" /> SPONSORED PROMO
          </div>
          <AdCard ad={topAd} />
        </div>
      )}

      {/* ============ BODY: 2 KOLOM ASIMETRIS ============ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 grid lg:grid-cols-[1fr_320px] gap-12">
        {/* Kolom kiri — artikel */}
        <div>
          <article
            className="article-prose font-serif prose prose-slate max-w-none
              prose-p:text-[19px] prose-p:leading-[1.8]
              prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900
              prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-sm
              [&_video]:rounded-xl [&_video]:shadow-sm [&_video]:w-full [&_video]:my-6
              prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-blue-600
              prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:font-sans
              prose-blockquote:font-bold prose-blockquote:text-2xl md:prose-blockquote:text-3xl
              prose-blockquote:leading-snug prose-blockquote:text-slate-900 prose-blockquote:my-10
              prose-li:text-[19px]"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Iklan Tengah / Bawah Artikel */}
          {contentAd && (
            <div className="my-10 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                <Megaphone size={11} className="text-blue-500" /> PROMO SPESIAL LAPTOP SOLIT 03
              </div>
              <AdCard ad={contentAd} />
            </div>
          )}
        </div>

        {/* Kolom kanan — sticky sidebar */}
        <aside className="lg:sticky lg:top-24 self-start space-y-6">
          {/* Iklan Sidebar */}
          {sidebarAd && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                <Megaphone size={11} className="text-blue-500" /> IKLAN SPONSOR
              </div>
              <AdCard ad={sidebarAd} />
            </div>
          )}

          {popular.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={15} className="text-blue-600" />
                <h2 className="text-xs font-black uppercase tracking-widest text-blue-600">Most Popular</h2>
              </div>
              <ol className="space-y-4">
                {popular.map((a, i) => (
                  <li key={a.id}>
                    <Link to={`/berita/${a.slug}`} className="group flex items-start gap-3">
                      <span className="font-display text-2xl font-black leading-none text-blue-600 flex-shrink-0 w-6">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-3 group-hover:text-blue-600 transition-colors">
                          {a.title}
                        </h3>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                          <Clock size={10} /> {(a.views || 0).toLocaleString()} views
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {article.tags?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TagIcon size={14} className="text-blue-600" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors cursor-default"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <div className="mt-16 bg-slate-100/80 border-t border-slate-200/80 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Newspaper size={14} /> Baca Juga
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-8">
              Artikel Terkait Lainnya
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((a) => (
                <Link
                  key={a.id}
                  to={`/berita/${a.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    {a.cover_image ? (
                      <img
                        src={a.cover_image}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper size={28} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {a.article_categories?.name && (
                      <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                        {a.article_categories.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug mt-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
