import { useEffect, useState } from "react";
import {
    uploadProductImage,
    uploadMultipleImages,
} from "../../services/storage";
import { supabase } from "../../services/supabase";
import {
    Upload, X, Image as ImageIcon, Cpu, MemoryStick,
    HardDrive, Monitor, Battery, Gamepad2, Laptop, Tag,
    Package, DollarSign, Layers, Link2, Percent, Sparkles, ChevronDown
} from "lucide-react";
import { useToast } from "../context/ToastContext";

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
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "specs", label: "Specs", icon: Cpu },
    { id: "tags", label: "Tags", icon: Tag },
];

function Field({ label, required, hint, children }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
        </div>
    );
}

function Input({ icon: Icon, ...props }) {
    return (
        <div className="relative">
            {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
            <input
                {...props}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition
          py-2.5 pr-3 ${Icon ? "pl-9" : "pl-3"} ${props.className || ""}`}
            />
        </div>
    );
}

function Select({ children, ...props }) {
    return (
        <div className="relative">
            <select
                {...props}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
          transition py-2.5 pl-3 pr-8 appearance-none cursor-pointer"
            >
                {children}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                supabase.from("brands").select("*"),
                supabase.from("categories").select("*"),
                supabase.from("tags").select("*"),
            ]);
            setBrands(b || []);
            setCategories(c || []);
            setTags(t || []);
        } catch {
            showToast("Gagal memuat data", "error");
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return showToast("File harus gambar", "error");
        if (file.size > 5 * 1024 * 1024) return showToast("Maks 5MB", "error");
        try {
            setUploading(true);
            const url = await uploadProductImage(file);
            setForm({ ...form, thumbnail: url });
            showToast("Thumbnail terupload", "success");
        } catch (err) {
            showToast(err.message || "Gagal upload", "error");
        } finally {
            setUploading(false);
        }
    }

    async function handleGalleryUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        for (const f of files) {
            if (!f.type.startsWith("image/")) return showToast("Semua file harus gambar", "error");
            if (f.size > 5 * 1024 * 1024) return showToast("Maks 5MB per gambar", "error");
        }
        try {
            setUploading(true);
            const urls = await uploadMultipleImages(files);
            setForm({ ...form, gallery: [...(form.gallery || []), ...urls] });
            showToast(`${urls.length} gambar diupload`, "success");
        } catch (err) {
            showToast(err.message || "Gagal upload", "error");
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

    return (
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto space-y-4">

            {/* Upload indicator */}
            {uploading && (
                <div className="fixed top-3 right-3 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                </div>
            )}

            {/* Section Tabs */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveSection(id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all
                ${activeSection === id
                                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Icon size={13} />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {/* ── BASIC ── */}
                    {activeSection === "basic" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Nama Produk" required>
                                    <Input
                                        icon={Laptop}
                                        type="text"
                                        placeholder="ASUS ROG Zephyrus G14"
                                        value={form.name || ""}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </Field>
                                <Field label="Slug">
                                    <div className="relative">
                                        <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={form.slug || ""}
                                            onChange={(e) => {
                                                setSlugManual(true);
                                                setForm({ ...form, slug: e.target.value });
                                            }}
                                            placeholder="auto-generated"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-300
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                        transition py-2.5 pl-9 pr-3 font-mono text-xs"
                                        />
                                        {slugManual && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSlugManual(false);
                                                    setForm({ ...form, slug: slugify(form.name || "") });
                                                }}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 hover:text-blue-700"
                                            >
                                                auto
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-400">
                                        {slugManual ? "Manual · klik 'auto' untuk reset" : "Otomatis dari nama produk"}
                                    </p>
                                </Field>
                            </div>

                            {/* Harga */}
                            <div className="border border-gray-100 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Harga</span>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={isDiscounted} onChange={handleDiscountToggle} />
                                            <div className={`w-8 h-4 rounded-full transition-colors ${isDiscounted ? "bg-blue-500" : "bg-gray-200"}`} />
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${isDiscounted ? "left-4.5 translate-x-1" : "left-0.5"}`} />
                                        </div>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Sparkles size={11} className="text-yellow-400" /> Diskon
                                        </span>
                                    </label>
                                </div>

                                {isDiscounted ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Harga Normal" required>
                                                <Input
                                                    icon={DollarSign}
                                                    type="number"
                                                    placeholder="0"
                                                    value={form.normal_price || ""}
                                                    onChange={(e) => setForm({ ...form, normal_price: Number(e.target.value) || "" })}
                                                />
                                            </Field>
                                            <Field label="Harga Diskon" required>
                                                <Input
                                                    icon={Percent}
                                                    type="number"
                                                    placeholder="0"
                                                    value={form.price || ""}
                                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) || "" })}
                                                    className="border-red-200 bg-red-50 focus:border-red-400 focus:ring-red-300"
                                                />
                                            </Field>
                                        </div>
                                        {discountPercent > 0 && (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">-{discountPercent}%</span>
                                                <span className="text-xs text-red-500">
                                                    Hemat Rp {(Number(form.normal_price) - Number(form.price)).toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Field label="Harga Jual" required>
                                        <Input
                                            icon={DollarSign}
                                            type="number"
                                            placeholder="0"
                                            value={form.price || ""}
                                            onChange={(e) => {
                                                const v = Number(e.target.value) || "";
                                                setForm({ ...form, price: v, normal_price: v });
                                            }}
                                        />
                                    </Field>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Stok" required>
                                    <Input
                                        icon={Package}
                                        type="number"
                                        placeholder="0"
                                        value={form.stock || ""}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    />
                                </Field>
                            </div>

                            <Field label="Deskripsi Singkat">
                                <textarea
                                    rows={2}
                                    placeholder="Deskripsi singkat produk..."
                                    value={form.short_description || ""}
                                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                    transition py-2.5 px-3 resize-none"
                                />
                            </Field>

                            <Field label="Deskripsi Lengkap">
                                <textarea
                                    rows={4}
                                    placeholder="Deskripsi lengkap produk..."
                                    value={form.description || ""}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                    transition py-2.5 px-3 resize-none"
                                />
                            </Field>
                        </div>
                    )}

                    {/* ── IMAGES ── */}
                    {activeSection === "images" && (
                        <div className="space-y-5">
                            <Field label="Thumbnail">
                                {form.thumbnail ? (
                                    <div className="flex items-center gap-3">
                                        <img src={form.thumbnail} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                                        <div>
                                            <p className="text-xs text-green-600 font-medium mb-1.5">✓ Terupload</p>
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, thumbnail: "" })}
                                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                            >
                                                <X size={11} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="thumb-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition">
                                        <Upload size={22} className="text-gray-300 mb-2" />
                                        <span className="text-xs text-gray-400">Klik untuk upload thumbnail</span>
                                        <span className="text-[10px] text-gray-300 mt-1">PNG, JPG, WEBP · max 5MB</span>
                                        <input id="thumb-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                )}
                            </Field>

                            <Field label="Galeri">
                                <label htmlFor="gallery-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg py-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition">
                                    <Upload size={18} className="text-gray-300 mb-1.5" />
                                    <span className="text-xs text-gray-400">Upload beberapa foto sekaligus</span>
                                    <input id="gallery-upload" type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                                </label>
                                {form.gallery?.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {form.gallery.map((img, i) => (
                                            <div key={i} className="relative group">
                                                <img src={img} alt="" className="w-full h-20 rounded-lg object-cover border border-gray-100" />
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, idx) => idx !== i) })}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={10} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Field>
                        </div>
                    )}

                    {/* ── SPECS ── */}
                    {activeSection === "specs" && (
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: "processor", label: "Processor", icon: Cpu, placeholder: "Intel Core i7-12700H" },
                                { key: "ram", label: "RAM", icon: MemoryStick, placeholder: "16GB DDR5" },
                                { key: "storage", label: "Storage", icon: HardDrive, placeholder: "512GB SSD NVMe" },
                                { key: "gpu", label: "GPU", icon: Gamepad2, placeholder: "NVIDIA RTX 3060" },
                                { key: "display", label: "Display", icon: Monitor, placeholder: "14\" 2.8K 120Hz" },
                                { key: "system_os", label: "OS", icon: Layers, placeholder: "Windows 11 Home" },
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
                            <div className="col-span-2">
                                <Field label="Battery">
                                    <Input
                                        icon={Battery}
                                        type="text"
                                        placeholder="76WHrs, up to 10 hours"
                                        value={form.specs?.battery || ""}
                                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, battery: e.target.value } })}
                                    />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* ── TAGS ── */}
                    {activeSection === "tags" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Brand">
                                    <Select
                                        value={form.brand_id || ""}
                                        onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                                    >
                                        <option value="">Pilih Brand</option>
                                        {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Kategori">
                                    <Select
                                        value={form.category_id || ""}
                                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Select>
                                </Field>
                            </div>

                            <Field label="Tags">
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {tags.map((tag) => {
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
                                                className={`px-2.5 py-1 rounded-md text-xs font-medium transition
                          ${active
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {tag.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95"
                >
                    {buttonText === "Update" ? "Update Produk" : "Simpan Produk"}
                </button>
            </div>
        </form>
    );
}