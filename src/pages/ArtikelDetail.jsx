import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronLeft, Loader2, Newspaper, Eye, CalendarDays,
  Share2, Check, Flame, Clock, Tag as TagIcon, Megaphone, Type,
  ChevronRight,
} from "lucide-react";
import { getArticleBySlug, getRelatedArticles, getPopularArticles } from "../services/articles";
import { getArticleAds } from "../services/siteContent";
import AdCard from "../components/berita/AdCard";
import logo from "../assets/solit03.jpeg";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const FONT_SIZE_OPTIONS = [
  { value: "sm", label: "Kecil", className: "article-prose--sm" },
  { value: "md", label: "Sedang", className: "" },
  { value: "lg", label: "Besar", className: "article-prose--lg" },
];

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
  const [isUltraWide, setIsUltraWide] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("solit03-article-font-size") || "md");
  const [stickySizeMenuOpen, setStickySizeMenuOpen] = useState(false);
  const [headerSizeMenuOpen, setHeaderSizeMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);  // ← BARU: index gambar aktif

  useEffect(() => {
    localStorage.setItem("solit03-article-font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    const handleResize = () => {
      setIsUltraWide(window.innerWidth >= 1380);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setActiveImageIndex(0);  // ← BARU: reset index saat ganti artikel
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
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <Loader2 size={28} className="animate-spin text-[#2391FF]" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-muted px-4 text-center">
        <Newspaper size={40} className="text-slate-300 mb-3" />
        <h1 className="text-xl font-bold text-content">Artikel tidak ditemukan</h1>
        <button onClick={() => navigate("/berita")} className="mt-4 text-[#2391FF] text-sm font-semibold hover:underline">
          Kembali ke Berita
        </button>
      </div>
    );
  }

  const category = article.article_categories;

  // ═══ BARU: Ambil images dari article, fallback ke cover_image ═══
  const images =
    article.images?.length > 0
      ? article.images
      : article.cover_image
      ? [{ url: article.cover_image, is_primary: true }]
      : [];

  const hasMultipleImages = images.length > 1;

  // Select ads for different editorial placements
  const horizontalAds = allAds.filter((a) => a.banner_size !== "sidebar_flank");
  const topAd = horizontalAds.find((a) => a.banner_size === "billboard" || a.banner_size === "leaderboard") || horizontalAds[0] || null;
  const sidebarAd = allAds.find((a) => a.banner_size === "medium_rectangle") || (allAds.length > 1 ? allAds[1] : null);
  const contentAd = horizontalAds.length > 1 ? horizontalAds[1] : (horizontalAds.find((a) => a !== topAd) || null);
  const flankAds = allAds.filter((a) => a.banner_size === "sidebar_flank");
  const flankLeftAd = flankAds[0] || null;
  const flankRightAd = flankAds[1] || null;
  const fontSizeClass = FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.className || "";

  return (
    <div className="min-h-screen bg-surface-muted max-w-full">
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
        className={`fixed top-0 left-0 right-0 w-full max-w-full z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-[#2391FF]/10 shadow-xl transition-all duration-300 ease-in-out ${
          showStickyHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img src={logo} alt="Solit 03" className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700" />
            <span className="text-sm font-black uppercase tracking-tight text-white font-['Hanken_Grotesk',sans-serif]">
              SOLIT<span className="text-[#2391FF]">03</span>
            </span>
          </Link>

          {/* Judul Artikel di Tengah (The Verge Style) */}
          <div className="flex-1 min-w-0 text-center px-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-lg mx-auto">
              {article.title}
            </h2>
          </div>

          {/* Tombol Ukuran Font & Share di Kanan */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                onClick={() => setStickySizeMenuOpen((v) => !v)}
                aria-label="Ukuran teks"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-[#2391FF] transition"
              >
                <Type size={13} />
              </button>

              {stickySizeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setStickySizeMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-32 bg-surface border border-border rounded-lg shadow-xl py-1 z-50">
                    {FONT_SIZE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setFontSize(opt.value); setStickySizeMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${fontSize === opt.value ? "text-blue-500 font-bold bg-surface-muted" : "text-content hover:bg-surface-muted"}`}
                      >
                        <Type size={14} /> {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-[#2391FF] transition"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span className="hidden sm:inline">{copied ? "Tersalin" : "Bagikan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============ HEADER ============ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Navigation & Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs">
          <Link
            to="/berita"
            className="group inline-flex items-center gap-1.5 font-semibold text-content-muted hover:text-[#2391FF] transition-colors"
          >
            <ChevronLeft size={15} className="text-content-muted group-hover:text-[#2391FF] transition-transform group-hover:-translate-x-0.5" />
            Kembali ke Berita
          </Link>

          {category?.name && (
            <span className="text-slate-400 dark:text-slate-600 font-light">•</span>
          )}

          {category?.name && (
            <Link
              to={`/berita?kategori=${category.slug}`}
              className="inline-flex items-center px-2.5 py-1 bg-[#2391FF]/10 border border-[#2391FF]/20 text-[#2391FF] text-[11px] font-black uppercase tracking-wider rounded-md hover:bg-[#2391FF]/15 hover:border-[#2391FF]/30 transition-all shadow-2xs"
            >
              {category.name}
            </Link>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-black text-content tracking-tight leading-[1.1] mt-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="font-serif text-lg md:text-xl text-content-soft leading-relaxed mt-5 max-w-2xl">
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 pb-6 border-b border-border">
          {article.author && (
            <span className="flex items-center gap-2 text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2391FF] flex items-center justify-center text-[11px] font-black text-white">
                {article.author.charAt(0).toUpperCase()}
              </span>
              <span className="font-semibold text-[#2391FF]">{article.author}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-content-muted">
            <CalendarDays size={14} /> {formatDate(article.published_at || article.created_at)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-content-muted">
            <Eye size={14} /> {(article.views || 0).toLocaleString()} views
          </span>

          <div className="ml-auto relative">
            <button
              onClick={() => setHeaderSizeMenuOpen((v) => !v)}
              aria-label="Ukuran teks"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-content-soft hover:border-[#2391FF]/40 hover:text-[#2391FF] transition"
            >
              <Type size={13} />
            </button>

            {headerSizeMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setHeaderSizeMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-32 bg-surface border border-border rounded-lg shadow-xl py-1 z-50">
                  {FONT_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFontSize(opt.value); setHeaderSizeMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${fontSize === opt.value ? "text-blue-500 font-bold bg-surface-muted" : "text-content hover:bg-surface-muted"}`}
                    >
                      <Type size={14} /> {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-content-soft hover:border-blue-300 hover:text-blue-600 transition"
          >
            {copied ? <><Check size={13} /> Tersalin</> : <><Share2 size={13} /> Bagikan</>}
          </button>
        </div>
      </div>

      {/* ============ MAIN CONTENT + FLANK ADS ============ */}
      <div className="w-full max-w-[1920px] mx-auto flex justify-center mt-8">
        {/* IKLAN FLANK KIRI (Murni CSS In-Flow) */}
        {isUltraWide && flankLeftAd && (
          <div className="hidden xl:block flex-1 max-w-[300px] pr-6">
            <div className="sticky top-24 flex justify-end">
              <div style={{ width: Math.min(flankLeftAd.custom_width || 260, 300) }}>
                <AdCard ad={flankLeftAd} />
              </div>
            </div>
          </div>
        )}

        {/* TENGAH: HERO + BILLBOARD + ARTIKEL */}
        <div className="w-full max-w-6xl px-4 sm:px-6 min-w-0">

          {/* ═══════════════════════════════════════════════════════ */}
          {/* ═══ HERO IMAGE — MULTI IMAGE GALLERY ═══              */}
          {/* ═══════════════════════════════════════════════════════ */}
          {images.length > 0 && (
            <div className="max-w-5xl mx-auto mb-8">
              {/* Gambar utama yang aktif */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={images[activeImageIndex]?.url}
                  alt={`${article.title} — Foto ${activeImageIndex + 1}`}
                  className="w-full aspect-video object-cover transition-opacity duration-300"
                />

                {/* Navigasi prev/next — hanya tampil kalau > 1 gambar */}
                {hasMultipleImages && (
                  <>
                    {/* Tombol Previous */}
                    <button
                      onClick={() => setActiveImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                      aria-label="Foto sebelumnya"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Tombol Next */}
                    <button
                      onClick={() => setActiveImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                      aria-label="Foto selanjutnya"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {/* Kredit foto */}
              {article.author && (
                <p className="text-xs text-content-muted mt-2 text-center">Foto: {article.author} / Solit 03</p>
              )}
            </div>
          )}

          {/* ============ IKLAN SPONSOR ATAS (BILLBOARD / LEADERBOARD) ============ */}
          {topAd && (
            <div className="max-w-4xl mx-auto my-8">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1.5">
                <Megaphone size={11} className="text-blue-500" /> SPONSORED PROMO
              </div>
              <AdCard ad={topAd} />
            </div>
          )}

          {/* ============ BODY: 2 KOLOM ASIMETRIS ============ */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Kolom kiri — artikel */}
            <div>
              <article
                className={`article-prose ${fontSizeClass} font-serif prose prose-slate dark:prose-invert max-w-none
                  prose-p:leading-[1.8] prose-p:text-slate-800 dark:prose-p:text-slate-200
                  prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-sm
                  [&_video]:rounded-xl [&_video]:shadow-sm [&_video]:w-full [&_video]:my-6
                  prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-blue-600
                  prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:font-sans
                  prose-blockquote:font-bold prose-blockquote:text-2xl md:prose-blockquote:text-3xl
                  prose-blockquote:leading-snug prose-blockquote:text-slate-900 dark:prose-blockquote:text-slate-100 prose-blockquote:my-10
                  prose-li:text-slate-800 dark:prose-li:text-slate-200`}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Iklan Tengah / Bawah Artikel */}
              {contentAd && (
                <div className="my-10 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">
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
                <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">
                    <Megaphone size={11} className="text-blue-500" /> IKLAN SPONSOR
                  </div>
                  <AdCard ad={sidebarAd} />
                </div>
              )}

              {popular.length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame size={15} className="text-[#2391FF]" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-[#2391FF]">Most Popular</h2>
                  </div>
                  <ol className="space-y-4">
                    {popular.map((a, i) => (
                      <li key={a.id}>
                        <Link to={`/berita/${a.slug}`} className="group flex items-start gap-3">
                          <span className="font-display text-2xl font-black leading-none text-[#2391FF] flex-shrink-0 w-6">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-content leading-snug line-clamp-3 group-hover:text-[#2391FF] transition-colors">
                              {a.title}
                            </h3>
                            <span className="flex items-center gap-1 text-[11px] text-content-muted mt-1.5">
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
                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <TagIcon size={14} className="text-[#2391FF]" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-content-muted">Tags</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((t) => (
                      <span
                        key={t.id}
                        className="px-3 py-1.5 bg-surface-muted border border-border text-content-soft text-xs font-semibold rounded-full hover:bg-[#2391FF]/10 hover:border-[#2391FF]/20 hover:text-[#2391FF] transition-colors cursor-default"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* IKLAN FLANK KANAN (Murni CSS In-Flow) */}
        {isUltraWide && flankRightAd && (
          <div className="hidden xl:block flex-1 max-w-[300px] pl-6">
            <div className="sticky top-24 flex justify-start">
              <div style={{ width: Math.min(flankRightAd.custom_width || 260, 300) }}>
                <AdCard ad={flankRightAd} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <div className="mt-16 bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/30 border-t border-border/80 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-[#2391FF] text-xs font-bold uppercase tracking-widest mb-2">
              <Newspaper size={14} /> Baca Juga
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-content tracking-tight mb-8">
              Artikel Terkait Lainnya
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((a) => (
                <Link
                  key={a.id}
                  to={`/berita/${a.slug}`}
                  className="group bg-surface rounded-2xl overflow-hidden border border-border hover:border-[#2391FF]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                      <span className="text-[#2391FF] text-[10px] font-bold uppercase tracking-widest">
                        {a.article_categories.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-content text-sm leading-snug mt-1.5 line-clamp-2 group-hover:text-[#2391FF] transition-colors">
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