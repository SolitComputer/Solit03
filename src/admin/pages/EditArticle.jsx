import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import { getArticleById, updateArticle } from "../services/AdminArticles";
import { getArticleCategories } from "../services/AdminArticleCategories";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, Edit3 } from "lucide-react";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category_id: "",
    author: "",
    tag_names: [],
    is_featured: false,
    status: "draft",
  });

  useEffect(() => {
    Promise.all([getArticleById(id), getArticleCategories()])
      .then(([article, cats]) => {
        setCategories(cats);
        setForm({
          title: article.title || "",
          slug: article.slug || "",
          excerpt: article.excerpt || "",
          content: article.content || "",
          cover_image: article.cover_image || "",
          category_id: article.category_id || "",
          author: article.author || "",
          tag_names: article.tag_names || [],
          is_featured: !!article.is_featured,
          status: article.status || "draft",
        });
      })
      .catch(() => showToast("Gagal memuat artikel", "error"))
      .finally(() => setInitialLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await updateArticle(id, { ...form, category_id: Number(form.category_id) });
      showToast("Artikel berhasil diperbarui", "success");
      setTimeout(() => navigate("/admin/articles"), 800);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Gagal memperbarui artikel", "error");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-400">Memuat data artikel...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <Link 
            to="/admin/articles" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition mb-1.5"
          >
            <ArrowLeft size={14} /> Kembali ke Daftar Artikel
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Edit3 size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Edit Artikel</h1>
              <p className="text-xs text-gray-400">Perbarui informasi, konten, atau status artikel</p>
            </div>
          </div>
        </div>
      </div>

      <ArticleForm
        form={form}
        setForm={setForm}
        categories={categories}
        onSubmit={handleSubmit}
        disabled={loading}
        buttonText={loading ? "Menyimpan..." : "Update Artikel"}
      />
    </section>
  );
}
