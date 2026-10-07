import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus } from "lucide-react";

import ProductForm from "../components/ProductForm";

import {
    createProduct
} from "../services/AdminProducts";
import { useToast } from "../context/ToastContext";

export default function CreateProducts() {

    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);

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

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            await createProduct({
                ...form,
                price: Number(form.price),
                normal_price: form.normal_price ? Number(form.normal_price) : null,
                stock: Number(form.stock),
                brand_id: Number(form.brand_id),
                category_id: Number(form.category_id)
            });
            showToast("Produk berhasil ditambahkan", "success");
            setTimeout(() => {
                navigate("/admin/products");
            }, 600);
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <PackagePlus size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
                                Tambah Produk Baru
                            </h1>
                            <p className="text-xs text-content-muted">
                                Masukkan rincian produk laptop baru ke katalog toko Solit 03.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ProductForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                buttonText={loading ? "Loading..." : "Simpan Produk"}
            />
        </section>
    );
}
