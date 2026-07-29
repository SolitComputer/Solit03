import { Link } from "react-router-dom";
import { Newspaper, Eye } from "lucide-react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function ArticleCard({ article, size = "default" }) {
  const isLarge = size === "large";

  return (
    <Link
      to={`/berita/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
    >
      <div className={`relative bg-slate-100 overflow-hidden ${isLarge ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper size={32} className="text-slate-300" />
          </div>
        )}
        {article.article_categories?.name && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-md shadow-sm">
            {article.article_categories.name}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h3 className={`font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${isLarge ? "text-xl" : "text-sm"}`}>
          {article.title}
        </h3>
        {isLarge && article.excerpt && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{article.excerpt}</p>
        )}
        <div className="mt-auto pt-3 flex items-center gap-3 text-[11px] text-slate-400">
          {article.author && <span className="font-medium text-slate-500">{article.author}</span>}
          <span>{timeAgo(article.published_at)}</span>
          {article.views > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <Eye size={11} /> {article.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
