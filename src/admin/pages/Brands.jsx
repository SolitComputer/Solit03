import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tags,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Package,
  Save,
  AlertTriangle
} from "lucide-react";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from "../services/AdminBrands";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

// Color options for brands (for preview)
const brandColors = [
  { value: "blue", label: "Biru", bg: "bg-blue-100", text: "text-blue-700" },
  { value: "purple", label: "Ungu", bg: "bg-purple-100", text: "text-purple-700" },
  { value: "green", label: "Hijau", bg: "bg-green-100", text: "text-green-700" },
  { value: "orange", label: "Oranye", bg: "bg-orange-100", text: "text-orange-700" },
  { value: "red", label: "Merah", bg: "bg-red-100", text: "text-red-700" },
  { value: "teal", label: "Teal", bg: "bg-teal-100", text: "text-teal-700" },
];

// Modal Component untuk Create/Edit Brand
function BrandModal({ isOpen, onClose, onSubmit, title, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "blue"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        color: initialData.color || "blue"
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        color: "blue"
      });
    }
  }, [initialData, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name: name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama brand harus diisi";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const getColorStyle = (color) => {
    const colorOption = brandColors.find(opt => opt.value === color);
    return colorOption || brandColors[0];
  };

  if (!isOpen) return null;

  const colorStyle = getColorStyle(formData.color);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: ASUS"
              value={formData.name}
              onChange={handleNameChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 transition ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200"
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              placeholder="asus"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 transition bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warna Brand
            </label>
            <div className="flex flex-wrap gap-2">
              {brandColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-full transition-all flex-shrink-0 ${
                    color.bg
                  } ${
                    formData.color === color.value
                      ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                      : "hover:scale-105"
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${colorStyle.bg} rounded-xl flex items-center justify-center`}>
                <Tags className={`${colorStyle.text}`} size={22} />
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {formData.name || "Nama Brand"}
                </div>
                <div className="text-xs text-gray-400">
                  slug: {formData.slug || "slug-brand"}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isEditing ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal Component untuk Delete Confirmation
function DeleteConfirmModal({ isOpen, onClose, onConfirm, brandName, isDeleting }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} className="text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">Konfirmasi Hapus</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            Apakah Anda yakin ingin menghapus brand <span className="font-semibold text-red-600">"{brandName}"</span>?
          </p>
          <p className="text-sm text-gray-500">
            Tindakan ini tidak dapat dibatalkan dan akan menghapus brand dari semua produk yang menggunakannya.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Skeleton Components
function BrandCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div>
            <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
            <div className="w-48 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
          <div className="w-48 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="w-28 h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("newest");
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Load brands
  const loadBrands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data brand", "error");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  // Filter and sort brands
  useEffect(() => {
    let filtered = [...brands];
    
    if (debouncedSearch) {
      filtered = filtered.filter(brand => 
        brand.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        brand.slug?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    setFilteredBrands(filtered);
    setCurrentPage(1);
  }, [brands, debouncedSearch, sortBy]);

  // Create brand
  const handleCreateBrand = async (formData) => {
    setIsSubmitting(true);
    try {
      await createBrand(formData);
      showToast("Brand berhasil ditambahkan", "success");
      setIsCreateModalOpen(false);
      loadBrands();
    } catch (error) {
      console.error(error);
      showToast("Gagal menambahkan brand", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update brand
  const handleUpdateBrand = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateBrand(selectedBrand.id, formData);
      showToast("Brand berhasil diupdate", "success");
      setIsEditModalOpen(false);
      setSelectedBrand(null);
      loadBrands();
    } catch (error) {
      console.error(error);
      showToast("Gagal mengupdate brand", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete brand
  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    
    setDeletingId(selectedBrand.id);
    try {
      await deleteBrand(selectedBrand.id);
      showToast("Brand berhasil dihapus", "success");
      setIsDeleteModalOpen(false);
      setSelectedBrand(null);
      loadBrands();
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus brand", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (brand) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const itemsPerPageOptions = [10, 25, 50, 100];

  // Get color style for brand
  const getBrandColorStyle = (color) => {
    const colorOption = brandColors.find(opt => opt.value === color);
    return colorOption || brandColors[0];
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-2 animate-pulse">
          <div className="w-48 h-10 bg-gray-200 rounded mb-2"></div>
          <div className="w-80 h-5 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
        
        <FormSkeleton />
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="w-48 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <BrandCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modals */}
      <BrandModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBrand}
        title="Tambah Brand Baru"
        isEditing={false}
      />

      <BrandModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBrand(null);
        }}
        onSubmit={handleUpdateBrand}
        title="Edit Brand"
        initialData={selectedBrand}
        isEditing={true}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBrand(null);
        }}
        onConfirm={handleDeleteBrand}
        brandName={selectedBrand?.name}
        isDeleting={deletingId === selectedBrand?.id}
      />

      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Brands
        </h1>
        <p className="text-gray-500 mt-2">
          Kelola semua brand laptop Anda
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Brand</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{brands.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tags className="text-blue-700" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            {brands.length} brand tersedia
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ditampilkan</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{paginatedBrands.length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="text-green-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Per halaman: {itemsPerPage}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Filter Aktif</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {searchTerm ? "1" : "0"}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Search className="text-purple-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {searchTerm ? `Mencari: ${searchTerm}` : "Tidak ada filter"}
          </div>
        </div>
      </div>

      {/* FORM TAMBAH BRAND - Button to open modal */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Tambah Brand Baru</h2>
            <p className="text-sm text-gray-500 mt-1">Klik tombol di samping untuk menambahkan brand baru</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Tambah Brand
          </button>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari brand berdasarkan nama atau slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="name_asc">Nama A-Z</option>
              <option value="name_desc">Nama Z-A</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option} / halaman</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("newest");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
            >
              <RefreshCw size={18} className="text-gray-600" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* BRANDS LIST */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Daftar Brand</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total {filteredBrands.length} brand ditemukan
            </p>
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <BrandCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedBrands.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400">
              <Tags size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">Tidak ada brand</p>
              <p className="text-sm">
                {searchTerm ? "Coba dengan kata kunci berbeda" : "Klik tombol 'Tambah Brand' untuk mulai menambahkan brand"}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedBrands.map((brand) => {
              const colorStyle = getBrandColorStyle(brand.color);
              
              return (
                <div key={brand.id} className="px-6 py-4 hover:bg-gray-50 transition group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${colorStyle.bg} rounded-xl flex items-center justify-center`}>
                          <Tags className={`${colorStyle.text}`} size={22} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {brand.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Slug: {brand.slug}
                          </p>
                          {brand.created_at && (
                            <p className="text-xs text-gray-400 mt-1">
                              Ditambahkan: {new Date(brand.created_at).toLocaleDateString('id-ID')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Brand"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(brand)}
                        disabled={deletingId === brand.id}
                        className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition ${
                          deletingId === brand.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title="Hapus Brand"
                      >
                        {deletingId === brand.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredBrands.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBrands.length)} dari {filteredBrands.length} brand
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}