import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";

import {
    createProduct
} from "../services/AdminProducts";
import { useToast } from "../context/ToastContext";

export default function CreateProducts() {

    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] =
        useState(false);

    // Tambahkan normal_price ke state form
    const [form, setForm] = useState({
        name: "",
        slug: "",
        price: "",
        normal_price: "",  // Tambahkan ini
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

    // Update handleSubmit
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            await createProduct({
                ...form,
                price: Number(form.price),
                normal_price: form.normal_price ? Number(form.normal_price) : null, // Tambahkan ini
                stock: Number(form.stock),
                brand_id: Number(form.brand_id),
                category_id: Number(form.category_id)
            });
            showToast("Produk berhasil ditambahkan", "success");
            setTimeout(() => {
                navigate("/admin/products");
            }, 800);
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Tambah Produk
                </h1>

                <p className="text-gray-500 mt-2">
                    Tambahkan produk baru
                </p>

            </div>

            <ProductForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                buttonText={
                    loading
                        ? "Loading..."
                        : "Simpan Produk"
                }
            />

        </section>
    );
}