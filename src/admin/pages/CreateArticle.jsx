import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import { createArticle } from "../services/AdminArticles";
import { getArticleCategories } from "../services/AdminArticleCategories";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, PenTool } from "lucide-react";

export default function CreateArticle() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
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
    getArticleCategories().then(setCategories).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await createArticle({ ...form, category_id: Number(form.category_id) });
      showToast("Artikel berhasil ditambahkan", "success");
      setTimeout(() => navigate("/admin/articles"), 800);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Gagal menambahkan artikel", "error");
    } finally {
      setLoading(false);
    }
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
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <PenTool size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tulis Artikel Baru</h1>
              <p className="text-xs text-gray-400">Buat berita, promo, atau tips baru untuk pengunjung toko</p>
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
        buttonText={loading ? "Menyimpan..." : "Simpan & Publikasikan"}
      />
    </section>
  );
}
