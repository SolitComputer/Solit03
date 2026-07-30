import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import { getArticles, getArticleCategories } from "../../services/articles";
import { getArticleAds } from "../../services/siteContent";
import AdCard from "./AdCard";
import { getAdSlotPositions } from "../../utils/interleaveAds";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/9] bg-slate-100 rounded-xl" />
      <div className="h-3 w-16 bg-slate-100 rounded mt-4" />
      <div className="h-5 bg-slate-100 rounded mt-2 w-3/4" />
      <div className="h-5 bg-slate-100 rounded mt-1.5 w-1/2" />
    </div>
  );
}

export default function LatestArticles() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [mobileAds, setMobileAds] = useState([]);

  useEffect(() => {
    getArticleCategories().then(setCategories).catch(() => {});
    getArticleAds({ bannerSize: "leaderboard" }).then(setAds).catch(() => setAds([]));
    getArticleAds({ bannerSize: "mobile_leaderboard" }).then(setMobileAds).catch(() => setMobileAds([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getArticles({ page: 1, limit: 6, categorySlug: activeCat || undefined });
      setArticles(data);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [activeCat]);

  useEffect(() => { load(); }, [load]);

  if (!loading && articles.length === 0 && !activeCat) return null;

  const [lead, ...rest] = articles;
  const list = rest.slice(0, 4);

  return (
    <section className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        {/* Header ala The Verge: eyebrow + judul besar + CTA */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Newspaper size={14} /> Berita &amp; Artikel
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-content tracking-tight">
              Yang terbaru dari Solit 03
            </h2>
          </div>
          <Link
            to="/berita"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-content-soft hover:text-blue-600 transition"
          >
            Lihat semua artikel <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category rail */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 border-b border-border pb-4">
            <button
              onClick={() => setActiveCat("")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                !activeCat ? "bg-content text-surface border-content" : "bg-surface-muted text-content-soft border-border hover:border-content/50"
              }`}
            >
              Semua
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  activeCat === c.slug ? "bg-content text-surface border-content" : "bg-surface-muted text-content-soft border-border hover:border-content/50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2"><CardSkeleton /></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-content-muted">Belum ada artikel di kategori ini</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-x-10 gap-y-8">
            {/* Lead story — versi besar khas The Verge */}
            {lead && (
              <Link to={`/berita/${lead.slug}`} className="lg:col-span-2 group">
                <div className="aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden">
                  {lead.cover_image ? (
                    <img
                      src={lead.cover_image}
                      alt={lead.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper size={40} className="text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  {lead.article_categories?.name && (
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                      {lead.article_categories.name}
                    </span>
                  )}
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-content tracking-tight leading-tight mt-1.5 group-hover:text-blue-600 transition-colors">
                    {lead.title}
                  </h3>
                  {lead.excerpt && (
                    <p className="text-content-muted text-sm mt-2 line-clamp-2 max-w-xl">{lead.excerpt}</p>
                  )}
                  <p className="text-xs text-content-muted mt-3">{timeAgo(lead.published_at)}</p>
                </div>
              </Link>
            )}

            {/* Daftar stories ringkas — dipisah garis tipis khas The Verge */}
            {list.length > 0 && (() => {
              const adSlots = getAdSlotPositions(list.length, 2);
              let desktopIdx = 0;
              let mobileIdx = 0;
              const nodes = [];

              list.forEach((a, i) => {
                nodes.push(
                  <Link
                    key={a.id}
                    to={`/berita/${a.slug}`}
                    className="group flex gap-4 py-4 first:pt-0"
                  >
                    <div className="flex-1 min-w-0">
                      {a.article_categories?.name && (
                        <span className="text-blue-600 text-[11px] font-bold uppercase tracking-widest">
                          {a.article_categories.name}
                        </span>
                      )}
                      <h4 className="font-semibold text-content text-sm leading-snug mt-1 line-clamp-3 group-hover:text-blue-600 transition-colors">
                        {a.title}
                      </h4>
                      <p className="text-[11px] text-content-muted mt-1.5">{timeAgo(a.published_at)}</p>
                    </div>
                    {a.cover_image && (
                      <img
                        src={a.cover_image}
                        alt={a.title}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                  </Link>
                );

                if (adSlots.includes(i + 1)) {
                  const desktopAd = ads.length ? ads[desktopIdx % ads.length] : null;
                  const mobileAd = mobileAds.length ? mobileAds[mobileIdx % mobileAds.length] : null;
                  desktopIdx += 1;
                  mobileIdx += 1;

                  if (desktopAd || mobileAd) {
                    nodes.push(
                      <div key={`ad-${i}`} className="py-4">
                        {desktopAd && <div className="hidden sm:block"><AdCard ad={desktopAd} /></div>}
                        {mobileAd && <div className="sm:hidden"><AdCard ad={mobileAd} /></div>}
                      </div>
                    );
                  }
                }
              });

              return <div className="divide-y divide-slate-200">{nodes}</div>;
            })()}
          </div>
        )}

        <Link
          to="/berita"
          className="sm:hidden mt-8 flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 border border-border rounded-xl py-2.5"
        >
          Lihat semua artikel <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
