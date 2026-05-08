import { useEffect, useState } from "react";
import {
    uploadProductImage,
    uploadMultipleImages
} from "../../services/storage";
import { supabase } from "../../services/supabase";
import {
    Upload,
    X,
    Image as ImageIcon,
    Cpu,
    MemoryStick,
    HardDrive,
    Monitor,
    Battery,
    Gamepad2,
    Laptop,
    Tag,
    Package,
    DollarSign,
    Layers,
    Link2,
    CheckCircle,
    AlertCircle,
    Percent,
    Sparkles
} from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function ProductForm({
    form,
    setForm,
    onSubmit,
    buttonText
}) {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [activeSection, setActiveSection] = useState("basic");
    const [isDiscounted, setIsDiscounted] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
        // Cek apakah produk memiliki diskon
        if (form.normal_price && form.price && Number(form.normal_price) > Number(form.price)) {
            setIsDiscounted(true);
        } else if (form.price && form.price > 0) {
            // Jika tidak ada diskon, set normal_price = price
            setIsDiscounted(false);
        }
    }, []);

    async function loadData() {
        try {
            const { data: brandsData } = await supabase
                .from("brands")
                .select("*");
            const { data: categoriesData } = await supabase
                .from("categories")
                .select("*");
            const { data: tagsData } = await supabase
                .from("tags")
                .select("*");

            setBrands(brandsData || []);
            setCategories(categoriesData || []);
            setTags(tagsData || []);
        } catch (error) {
            console.error(error);
            showToast("Gagal memuat data", "error");
        }
    }

    async function handleImageUpload(e) {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast("File harus berupa gambar", "error");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast("Ukuran file maksimal 5MB", "error");
                return;
            }

            const imageUrl = await uploadProductImage(file);
            setForm({ ...form, thumbnail: imageUrl });
            showToast("Thumbnail berhasil diupload", "success");
        } catch (error) {
            console.error(error);
            showToast(error.message || "Gagal upload gambar", "error");
        } finally {
            setUploading(false);
        }
    }

    async function handleGalleryUpload(e) {
        try {
            setUploading(true);
            const files = Array.from(e.target.files);
            if (!files.length) return;

            for (const file of files) {
                if (!file.type.startsWith('image/')) {
                    showToast("Semua file harus berupa gambar", "error");
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    showToast("Ukuran file maksimal 5MB per gambar", "error");
                    return;
                }
            }

            const urls = await uploadMultipleImages(files);
            setForm({
                ...form,
                gallery: [...(form.gallery || []), ...urls]
            });
            showToast(`${urls.length} gambar berhasil diupload`, "success");
        } catch (error) {
            console.error(error);
            showToast(error.message || "Gagal upload galeri", "error");
        } finally {
            setUploading(false);
        }
    }

    // Handle perubahan toggle diskon
    const handleDiscountToggle = (e) => {
        const checked = e.target.checked;
        setIsDiscounted(checked);
        
        if (!checked) {
            // Jika tidak diskon, set normal_price = price
            setForm({ 
                ...form, 
                normal_price: form.price,
            });
        } else {
            // Jika diskon diaktifkan, set normal_price dari price jika belum ada
            if (!form.normal_price && form.price) {
                setForm({ 
                    ...form, 
                    normal_price: form.price,
                });
            }
        }
    };

    // Handle perubahan harga normal
    const handleNormalPriceChange = (e) => {
        const normalPrice = e.target.value === "" ? "" : Number(e.target.value);
        setForm({ ...form, normal_price: normalPrice });
        
        // Jika diskon aktif dan harga normal < harga diskon, sesuaikan
        if (isDiscounted && normalPrice && form.price && Number(normalPrice) < Number(form.price)) {
            setForm({ ...form, normal_price: normalPrice, price: normalPrice });
            showToast("Harga normal tidak boleh lebih kecil dari harga diskon", "warning");
        }
    };

    // Handle perubahan harga diskon
    const handleDiscountPriceChange = (e) => {
        const discountPrice = e.target.value === "" ? "" : Number(e.target.value);
        setForm({ ...form, price: discountPrice });
        
        // Jika diskon aktif dan harga diskon > harga normal
        if (isDiscounted && form.normal_price && discountPrice && Number(discountPrice) > Number(form.normal_price)) {
            showToast("Harga diskon tidak boleh lebih besar dari harga normal", "warning");
        }
    };

    // Handle perubahan harga biasa (tanpa diskon)
    const handleRegularPriceChange = (e) => {
        const price = e.target.value === "" ? "" : Number(e.target.value);
        setForm({ 
            ...form, 
            price: price,
            normal_price: price  // Untuk produk tanpa diskon, normal_price = price
        });
    };

    const sections = [
        { id: "basic", name: "Informasi Dasar", icon: Package },
        { id: "images", name: "Galeri Produk", icon: ImageIcon },
        { id: "specs", name: "Spesifikasi", icon: Cpu },
        { id: "tags", name: "Tags & Kategori", icon: Tag }
    ];

    // Hitung persentase diskon
    const discountPercent = form.normal_price && form.price && Number(form.normal_price) > Number(form.price)
        ? Math.round(((Number(form.normal_price) - Number(form.price)) / Number(form.normal_price)) * 100)
        : 0;

    return (
        <form onSubmit={onSubmit} className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-0 z-10">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {buttonText === "Update" ? "Edit Produk" : "Tambah Produk Baru"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Lengkapi informasi produk laptop Anda dengan detail
                    </p>
                </div>

                <div className="px-6 py-3 bg-gray-50/50 flex flex-wrap gap-2">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSection(section.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeSection === section.id
                                    ? "bg-blue-700 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon size={16} />
                                <span className="text-sm">{section.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {uploading && (
                <div className="fixed top-4 right-4 z-50 bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Uploading...</span>
                </div>
            )}

            {/* Basic Information Section */}
            {activeSection === "basic" && (
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                    {/* Nama Produk */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Produk <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Laptop className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Contoh: ASUS ROG Zephyrus G14"
                                    value={form.name || ""}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Slug Produk
                            </label>
                            <div className="relative">
                                <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="asus-rog-zephyrus-g14"
                                    value={form.slug || ""}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Harga Section */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-semibold text-gray-700">
                                Pengaturan Harga
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isDiscounted}
                                    onChange={handleDiscountToggle}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Sparkles size={14} className="text-yellow-500" />
                                    Produk Diskon
                                </span>
                            </label>
                        </div>

                        {isDiscounted ? (
                            // Mode DISKON - Tampilkan 2 input harga
                            <div className="grid md:grid-cols-2 gap-5">
                                {/* Harga Normal */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Harga Normal <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            placeholder="Harga sebelum diskon"
                                            value={form.normal_price || ""}
                                            onChange={handleNormalPriceChange}
                                            className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Harga sebelum diskon</p>
                                </div>

                                {/* Harga Diskon */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Harga Diskon <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
                                        <input
                                            type="number"
                                            placeholder="Harga setelah diskon"
                                            value={form.price || ""}
                                            onChange={handleDiscountPriceChange}
                                            className="w-full border border-red-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-red-50"
                                        />
                                    </div>
                                    <p className="text-xs text-red-500 mt-1">Harga spesial diskon</p>
                                </div>

                                {/* Informasi Diskon */}
                                {form.normal_price && form.price && Number(form.normal_price) > Number(form.price) && (
                                    <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <Percent size={20} className="text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-red-700">🔥 Promo Aktif!</p>
                                            <p className="text-xs text-red-600">
                                                Diskon {discountPercent}% • Hemat Rp {(Number(form.normal_price) - Number(form.price)).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-red-700">
                                                {discountPercent}% OFF
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Mode NORMAL - Tampilkan 1 input harga
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Harga Produk <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        placeholder="Harga produk"
                                        value={form.price || ""}
                                        onChange={handleRegularPriceChange}
                                        className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Harga jual produk</p>
                                
                                {form.price && (
                                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-500" />
                                        <p className="text-sm text-gray-600">Produk tanpa diskon</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stok */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stok <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={form.stock || ""}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            placeholder="Tulis deskripsi singkat tentang produk..."
                            value={form.short_description || ""}
                            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                            rows="3"
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Deskripsi Lengkap
                        </label>
                        <textarea
                            placeholder="Tulis deskripsi lengkap produk..."
                            value={form.description || ""}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows="6"
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition resize-none"
                        />
                    </div>
                </div>
            )}

            {/* Images Section - tetap sama */}
            {activeSection === "images" && (
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thumbnail Produk
                        </label>
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${form.thumbnail ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-blue-700"
                            }`}>
                            {form.thumbnail ? (
                                <div className="relative inline-block">
                                    <img src={form.thumbnail} alt="Thumbnail" className="w-40 h-40 rounded-xl object-cover shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm({ ...form, thumbnail: "" });
                                            showToast("Thumbnail dihapus", "info");
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm hover:bg-red-600 transition flex items-center justify-center"
                                    >
                                        <X size={14} />
                                    </button>
                                    <p className="text-sm text-green-600 mt-2">✓ Thumbnail terupload</p>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="thumbnail-upload"
                                    />
                                    <label htmlFor="thumbnail-upload" className="cursor-pointer inline-flex flex-col items-center">
                                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                        <span className="text-blue-700 font-medium">Klik untuk upload thumbnail</span>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Galeri Produk
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-700 transition">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleGalleryUpload}
                                className="hidden"
                                id="gallery-upload"
                            />
                            <label htmlFor="gallery-upload" className="cursor-pointer inline-flex flex-col items-center">
                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                <span className="text-blue-700 font-medium">Upload foto galeri</span>
                                <p className="text-xs text-gray-500 mt-1">Bisa upload banyak foto sekaligus</p>
                            </label>
                        </div>

                        {form.gallery && form.gallery.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
                                {form.gallery.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img src={image} alt="" className="w-full h-32 rounded-xl object-cover shadow-sm" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedGallery = form.gallery.filter((_, i) => i !== index);
                                                setForm({ ...form, gallery: updatedGallery });
                                                showToast("Gambar dihapus dari galeri", "info");
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm opacity-0 group-hover:opacity-100 transition hover:bg-red-600 flex items-center justify-center"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Specifications Section - tetap sama */}
            {activeSection === "specs" && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Cpu size={16} className="inline mr-2" />
                                Processor
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Intel Core i7-12700H"
                                value={form.specs?.processor || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, processor: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MemoryStick size={16} className="inline mr-2" />
                                RAM
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: 16GB DDR5"
                                value={form.specs?.ram || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, ram: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <HardDrive size={16} className="inline mr-2" />
                                Storage
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: 512GB SSD NVMe"
                                value={form.specs?.storage || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, storage: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Gamepad2 size={16} className="inline mr-2" />
                                GPU
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: NVIDIA RTX 3060"
                                value={form.specs?.gpu || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, gpu: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Monitor size={16} className="inline mr-2" />
                                Display
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: 14 inch 2.8K 120Hz"
                                value={form.specs?.display || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, display: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Layers size={16} className="inline mr-2" />
                                Sistem Operasi
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Windows 11 Home"
                                value={form.specs?.system_os || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, system_os: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Battery size={16} className="inline mr-2" />
                                Battery
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: 76WHrs, up to 10 hours"
                                value={form.specs?.battery || ""}
                                onChange={(e) => setForm({
                                    ...form,
                                    specs: { ...form.specs, battery: e.target.value }
                                })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tags & Categories Section */}
            {activeSection === "tags" && (
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Brand
                            </label>
                            <select
                                value={form.brand_id || ""}
                                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition bg-white"
                            >
                                <option value="">Pilih Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Kategori
                            </label>
                            <select
                                value={form.category_id || ""}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition bg-white"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Tags Produk
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => {
                                const checked = form.tag_ids?.includes(tag.id);
                                return (
                                    <button
                                        type="button"
                                        key={tag.id}
                                        onClick={() => {
                                            if (checked) {
                                                setForm({
                                                    ...form,
                                                    tag_ids: form.tag_ids.filter((id) => id !== tag.id)
                                                });
                                                showToast(`Tag "${tag.name}" dihapus`, "info");
                                            } else {
                                                setForm({
                                                    ...form,
                                                    tag_ids: [...(form.tag_ids || []), tag.id]
                                                });
                                                showToast(`Tag "${tag.name}" ditambahkan`, "success");
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${checked
                                            ? "bg-blue-700 text-white shadow-sm"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="sticky bottom-6 flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                    {buttonText === "Update" ? "Update Produk" : "Simpan Produk"}
                </button>
            </div>
        </form>
    );
}