import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3, Loader2 } from "lucide-react";

import ProductForm from "../components/ProductForm";
import { getProductById, updateProduct } from "../services/AdminProducts";
import { useToast } from "../context/ToastContext";

export default function EditProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    normal_price: "",
    stock: "",
    thumbnail: "",
    gallery: [],
    brand_id: "",
    category_id: "",
    tag_ids: [],
    description: "",
    short_description: "",
    specs: {
      processor: "",
      ram: "",
      storage: "",
      gpu: "",
      display: "",
      system_os: "",
    }
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      const data = await getProductById(id);
      setForm(data);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data produk", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateProduct(id, {
        ...form,
        price: Number(form.price),
        normal_price: form.normal_price ? Number(form.normal_price) : null,
        stock: Number(form.stock)
      });
      showToast("Produk berhasil diperbarui", "success");
      setTimeout(() => {
        navigate("/admin/products");
      }, 600);
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-content-muted">
        <Loader2 size={32} className="animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Edit3 size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
                Edit Produk #{id}
              </h1>
              <p className="text-xs text-content-muted">
                Ubah informasi, harga, stok, atau spesifikasi produk laptop.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        buttonText={submitting ? "Loading..." : "Update"}
      />
    </section>
  );
}