import { useEffect, useState } from "react";
import {
    uploadProductImage,
    uploadMultipleImages,
} from "../../services/storage";
import { supabase } from "../../services/supabase";
import {
    Upload, X, Image as ImageIcon, Cpu, MemoryStick,
    HardDrive, Monitor, Gamepad2, Laptop, Tag,
    Package, Layers, Link2, Percent, Sparkles, ChevronDown, Check,
    Loader2, ArrowLeft, Info, FileText
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const SECTIONS = [
    { id: "basic", label: "Informasi Dasar", icon: Package },
    { id: "images", label: "Foto & Galeri", icon: ImageIcon },
    { id: "specs", label: "Spesifikasi", icon: Cpu },
    { id: "tags", label: "Kategori & Tags", icon: Tag },
];

function Field({ label, required, hint, children }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-content-soft">
                <span className="flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500 font-bold">*</span>}
                </span>
                {hint && <span className="text-[11px] font-normal text-content-muted">{hint}</span>}
            </label>
            {children}
        </div>
    );
}

function Input({ icon: Icon, prefix, ...props }) {
    return (
        <div className="relative flex items-center">
            {Icon && <Icon size={16} className="absolute left-3.5 text-content-muted pointer-events-none" />}
            {prefix && (
                <span className="absolute left-3.5 text-xs font-semibold text-content-muted pointer-events-none select-none">
                    {prefix}
                </span>
            )}
            <input
                {...props}
                className={`w-full bg-surface-muted/60 border border-border rounded-xl text-sm text-content placeholder:text-content-muted/50
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface transition-all duration-200
          py-2.5 pr-3.5 ${Icon ? "pl-10" : prefix ? "pl-10" : "pl-3.5"} ${props.className || ""}`}
            />
        </div>
    );
}

function Select({ children, ...props }) {
    return (
        <div className="relative">
            <select
                {...props}
                className="w-full bg-surface-muted/60 border border-border rounded-xl text-sm text-content
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface
          transition-all duration-200 py-2.5 pl-3.5 pr-9 appearance-none cursor-pointer"
            >
                {children}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
        </div>
    );
}

export default function ProductForm({ form, setForm, onSubmit, buttonText }) {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [activeSection, setActiveSection] = useState("basic");
    const [isDiscounted, setIsDiscounted] = useState(false);
    const [slugManual, setSlugManual] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
        if (form.normal_price && form.price && Number(form.normal_price) > Number(form.price)) {
            setIsDiscounted(true);
        }
        if (form.slug) setSlugManual(true);
    }, []);

    // Auto-slug dari nama produk
    useEffect(() => {
        if (!slugManual && form.name) {
            setForm((prev) => ({ ...prev, slug: slugify(form.name) }));
        }
    }, [form.name, slugManual]);

    async function loadData() {
        try {
            const [{ data: b }, { data: c }, { data: t }] = await Promise.all([
                supabase.from("brands").select("*").order("name"),
                supabase.from("categories").select("*").order("name"),
                supabase.from("tags").select("*").order("name"),
            ]);
            setBrands(b || []);
            setCategories(c || []);
            setTags(t || []);
        } catch {
            showToast("Gagal memuat data brand & kategori", "error");
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return showToast("File harus berupa gambar", "error");
        if (file.size > 5 * 1024 * 1024) return showToast("Ukuran maksimal 5MB", "error");
        try {
            setUploading(true);
            const url = await uploadProductImage(file);
            setForm({ ...form, thumbnail: url });
            showToast("Thumbnail berhasil diunggah", "success");
        } catch (err) {
            showToast(err.message || "Gagal mengunggah foto", "error");
        } finally {
            setUploading(false);
        }
    }

    async function handleGalleryUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        for (const f of files) {
            if (!f.type.startsWith("image/")) return showToast("Semua file harus berupa gambar", "error");
            if (f.size > 5 * 1024 * 1024) return showToast("Maksimal 5MB per gambar", "error");
        }
        try {
            setUploading(true);
            const urls = await uploadMultipleImages(files);
            setForm({ ...form, gallery: [...(form.gallery || []), ...urls] });
            showToast(`${urls.length} gambar berhasil ditambahkan ke galeri`, "success");
        } catch (err) {
            showToast(err.message || "Gagal mengunggah galeri", "error");
        } finally {
            setUploading(false);
        }
    }

    const handleDiscountToggle = (e) => {
        setIsDiscounted(e.target.checked);
        if (!e.target.checked) setForm({ ...form, normal_price: form.price });
    };

    const discountPercent =
        form.normal_price && form.price && Number(form.normal_price) > Number(form.price)
            ? Math.round(((Number(form.normal_price) - Number(form.price)) / Number(form.normal_price)) * 100)
            : 0;

    const isLoading = buttonText?.toLowerCase().includes("loading");

    return (
        <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-6">

            {/* Indicator Uploading */}
            {uploading && (
                <div className="fixed top-5 right-5 z-50 bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-bounce">
                    <Loader2 size={15} className="animate-spin text-blue-400" />
                    <span>Mengunggah media ke cloud...</span>
                </div>
            )}

            {/* Segmented Tab Navigation Header */}
            <div className="bg-surface border border-border/80 rounded-2xl p-1.5 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                    {SECTIONS.map(({ id, label, icon: Icon }) => {
                        const isActive = activeSection === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveSection(id)}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200
                  ${isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                        : "text-content-muted hover:text-content hover:bg-surface-muted"
                                    }`}
                            >
                                <Icon size={15} className={isActive ? "text-white" : "text-content-muted"} />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Form Body Container */}
            <div className="bg-surface border border-border/80 rounded-2xl shadow-sm p-6 sm:p-7 space-y-6">

                {/* ── SECTION 1: BASIC INFO ── */}
                {activeSection === "basic" && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                            <div>
                                <h3 className="text-base font-bold text-content flex items-center gap-2">
                                    <Package size={18} className="text-blue-600" />
                                    Informasi Produk
                                </h3>
                                <p className="text-xs text-content-muted mt-0.5">Nama, URL slug, harga, stok, dan deskripsi produk.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Nama Produk" required>
                                <Input
                                    icon={Laptop}
                                    type="text"
                                    placeholder="Contoh: ASUS ROG Zephyrus G14"
                                    value={form.name || ""}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </Field>

                            <Field label="Slug URL" hint={slugManual ? "Mode manual" : "Otomatis dibuat dari nama"}>
                                <div className="relative flex items-center">
                                    <Link2 size={16} className="absolute left-3.5 text-content-muted pointer-events-none" />
                                    <input
                                        type="text"
                                        value={form.slug || ""}
                                        onChange={(e) => {
                                            setSlugManual(true);
                                            setForm({ ...form, slug: e.target.value });
                                        }}
                                        placeholder="auto-generated-slug"
                                        className="w-full bg-surface-muted/60 border border-border rounded-xl text-xs text-content font-mono
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface
                      transition-all py-2.5 pl-10 pr-14"
                                    />
                                    {slugManual && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSlugManual(false);
                                                setForm({ ...form, slug: slugify(form.name || "") });
                                            }}
                                            className="absolute right-2.5 text-[10px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded-md transition"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </Field>
                        </div>

                        {/* Box Pengaturan Harga */}
                        <div className="bg-surface-muted/40 border border-border/80 rounded-xl p-4.5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Tag size={15} className="text-blue-600" />
                                    <span className="text-xs font-bold text-content uppercase tracking-wider">Pengaturan Harga</span>
                                </div>

                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <span className="text-xs font-medium text-content-soft flex items-center gap-1">
                                        <Sparkles size={13} className="text-amber-500" /> Aktifkan Harga Diskon
                                    </span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={isDiscounted} onChange={handleDiscountToggle} />
                                        <div className={`w-9 h-5 rounded-full transition-colors ${isDiscounted ? "bg-blue-600" : "bg-border"}`} />
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-surface rounded-full shadow-sm transition-transform duration-200 ${isDiscounted ? "translate-x-4" : "translate-x-0"}`} />
                                    </div>
                                </label>
                            </div>

                            {isDiscounted ? (
                                <div className="space-y-3 pt-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Harga Normal (Coret)" required>
                                            <Input
                                                prefix="Rp"
                                                type="number"
                                                placeholder="15000000"
                                                value={form.normal_price || ""}
                                                onChange={(e) => setForm({ ...form, normal_price: Number(e.target.value) || "" })}
                                            />
                                        </Field>
                                        <Field label="Harga Diskon (Harga Jual)" required>
                                            <Input
                                                prefix="Rp"
                                                type="number"
                                                placeholder="13500000"
                                                value={form.price || ""}
                                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) || "" })}
                                                className="border-red-200 bg-red-50/50 dark:bg-red-500/10 focus:border-red-500 focus:ring-red-500/20"
                                            />
                                        </Field>
                                    </div>

                                    {discountPercent > 0 && (
                                        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-lg">
                                            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md">
                                                Diskon {discountPercent}%
                                            </span>
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                Hemat Rp {(Number(form.normal_price) - Number(form.price)).toLocaleString("id-ID")} untuk pembeli
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <Field label="Harga Jual" required>
                                        <Input
                                            prefix="Rp"
                                            type="number"
                                            placeholder="10000000"
                                            value={form.price || ""}
                                            onChange={(e) => {
                                                const v = Number(e.target.value) || "";
                                                setForm({ ...form, price: v, normal_price: v });
                                            }}
                                        />
                                    </Field>
                                    <Field label="Jumlah Stok Unit" required>
                                        <Input
                                            icon={Package}
                                            type="number"
                                            placeholder="1"
                                            value={form.stock || ""}
                                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        />
                                    </Field>
                                </div>
                            )}

                            {isDiscounted && (
                                <div className="w-full sm:w-1/2 pt-1">
                                    <Field label="Jumlah Stok Unit" required>
                                        <Input
                                            icon={Package}
                                            type="number"
                                            placeholder="1"
                                            value={form.stock || ""}
                                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <Field label="Deskripsi Singkat / Catatan Produk">
                            <textarea
                                rows={3}
                                placeholder="Deskripsikan kondisi laptop, kelengkapan, garansi, atau spesifikasi ringkas..."
                                value={form.short_description || ""}
                                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                className="w-full bg-surface-muted/60 border border-border rounded-xl text-sm text-content placeholder:text-content-muted/50
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface
                  transition-all py-2.5 px-3.5 resize-none"
                            />
                        </Field>
                    </div>
                )}

                {/* ── SECTION 2: IMAGES ── */}
                {activeSection === "images" && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                            <div>
                                <h3 className="text-base font-bold text-content flex items-center gap-2">
                                    <ImageIcon size={18} className="text-blue-600" />
                                    Foto Utamakan & Galeri
                                </h3>
                                <p className="text-xs text-content-muted mt-0.5">Unggah gambar resolusi tinggi untuk meningkatkan daya tarik produk.</p>
                            </div>
                        </div>

                        {/* Thumbnail Utama */}
                        <Field label="Foto Cover Utama (Thumbnail)" required hint="Disarankan format 4:3 atau 1:1 (PNG/JPG/WEBP)">
                            {form.thumbnail ? (
                                <div className="relative group w-full sm:w-64 h-44 rounded-2xl overflow-hidden border border-border shadow-sm">
                                    <img src={form.thumbnail} alt="Thumbnail produk" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, thumbnail: "" })}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1 transition"
                                        >
                                            <X size={14} /> Hapus Foto
                                        </button>
                                    </div>
                                    <span className="absolute bottom-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                        <Check size={11} /> Cover Utama
                                    </span>
                                </div>
                            ) : (
                                <label htmlFor="thumb-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-blue-500/80 rounded-2xl py-9 px-4 cursor-pointer hover:bg-blue-50/40 dark:hover:bg-blue-500/5 transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={22} />
                                    </div>
                                    <span className="text-xs font-bold text-content group-hover:text-blue-600 transition">Klik untuk unggah thumbnail utama</span>
                                    <span className="text-[11px] text-content-muted mt-1">PNG, JPG, WEBP · Maksimal 5MB</span>
                                    <input id="thumb-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </Field>

                        {/* Galeri Tambahan */}
                        <Field label="Galeri Foto Tambahan" hint="Bisa pilih beberapa foto sekaligus">
                            <label htmlFor="gallery-upload" className="flex items-center justify-center gap-2 border border-dashed border-border hover:border-blue-500/80 rounded-xl py-4 px-4 cursor-pointer hover:bg-blue-50/40 dark:hover:bg-blue-500/5 transition-all group">
                                <Upload size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold text-content group-hover:text-blue-600 transition">Tambah Foto ke Galeri</span>
                                <input id="gallery-upload" type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                            </label>

                            {form.gallery?.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                    {form.gallery.map((img, i) => (
                                        <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border shadow-sm bg-surface-muted">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, idx) => idx !== i) })}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                                                title="Hapus gambar"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Field>
                    </div>
                )}

                {/* ── SECTION 3: SPECS ── */}
                {activeSection === "specs" && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                            <div>
                                <h3 className="text-base font-bold text-content flex items-center gap-2">
                                    <Cpu size={18} className="text-blue-600" />
                                    Spesifikasi Perangkat
                                </h3>
                                <p className="text-xs text-content-muted mt-0.5">Isi rincian hardware laptop untuk membantu calon pembeli.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: "processor", label: "Processor (CPU)", icon: Cpu, placeholder: "mis. Intel Core i7-12700H / Ryzen 7 6800H" },
                                { key: "ram", label: "Memori (RAM)", icon: MemoryStick, placeholder: "mis. 16GB DDR5 4800MHz" },
                                { key: "storage", label: "Penyimpanan (SSD/HDD)", icon: HardDrive, placeholder: "mis. 512GB NVMe PCIe 4.0 SSD" },
                                { key: "gpu", label: "Kartu Grafis (GPU)", icon: Gamepad2, placeholder: "mis. NVIDIA GeForce RTX 3060 6GB" },
                                { key: "display", label: "Layar (Display)", icon: Monitor, placeholder: "mis. 14\" WQXGA (2560x1600) 120Hz IPS" },
                                { key: "system_os", label: "Sistem Operasi (OS)", icon: Layers, placeholder: "mis. Windows 11 Home Original" },
                            ].map(({ key, label, icon, placeholder }) => (
                                <Field key={key} label={label}>
                                    <Input
                                        icon={icon}
                                        type="text"
                                        placeholder={placeholder}
                                        value={form.specs?.[key] || ""}
                                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, [key]: e.target.value } })}
                                    />
                                </Field>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SECTION 4: TAGS & CATEGORY ── */}
                {activeSection === "tags" && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                            <div>
                                <h3 className="text-base font-bold text-content flex items-center gap-2">
                                    <Tag size={18} className="text-blue-600" />
                                    Kategori, Brand & Label Tags
                                </h3>
                                <p className="text-xs text-content-muted mt-0.5">Kelompokkan produk agar mudah ditemukan dalam filter pencarian.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Brand / Merk Laptop">
                                <Select
                                    value={form.brand_id || ""}
                                    onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                                >
                                    <option value="">-- Pilih Brand --</option>
                                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </Select>
                            </Field>

                            <Field label="Kategori Utama">
                                <Select
                                    value={form.category_id || ""}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                            </Field>
                        </div>

                        <Field label="Label Tags Spesial" hint="Pilih tag terkait untuk memfilter produk">
                            <div className="flex flex-wrap gap-2 pt-1">
                                {tags.length === 0 ? (
                                    <p className="text-xs text-content-muted py-2">Belum ada tag tersedia.</p>
                                ) : (
                                    tags.map((tag) => {
                                        const active = form.tag_ids?.includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        tag_ids: active
                                                            ? form.tag_ids.filter((id) => id !== tag.id)
                                                            : [...(form.tag_ids || []), tag.id],
                                                    })
                                                }
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5
                          ${active
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]"
                                                        : "bg-surface-muted text-content-soft hover:bg-border/60"
                                                    }`}
                                            >
                                                {active && <Check size={13} />}
                                                <span>{tag.name}</span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </Field>
                    </div>
                )}

            </div>

            {/* Bottom Floating Action Bar */}
            <div className="flex items-center justify-between pt-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="px-5 py-2.5 bg-surface border border-border text-content-soft hover:bg-surface-muted rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                    <ArrowLeft size={15} /> Batal
                </button>

                <button
                    type="submit"
                    disabled={isLoading || uploading}
                    className="px-7 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Menyimpan...</span>
                        </>
                    ) : (
                        <>
                            <Check size={16} />
                            <span>{buttonText === "Update" ? "Simpan Perubahan Produk" : "Simpan & Publikasikan Produk"}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}