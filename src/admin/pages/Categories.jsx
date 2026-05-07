import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Layers3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Package,
  Grid3x3,
  Tag,
  Save,
  AlertTriangle
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/AdminCategories";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

// Color options for categories (for preview)
const colorOptions = [
  { value: "purple", label: "Ungu", bg: "bg-purple-100", text: "text-purple-700" },
  { value: "blue", label: "Biru", bg: "bg-blue-100", text: "text-blue-700" },
  { value: "green", label: "Hijau", bg: "bg-green-100", text: "text-green-700" },
  { value: "orange", label: "Oranye", bg: "bg-orange-100", text: "text-orange-700" },
  { value: "red", label: "Merah", bg: "bg-red-100", text: "text-red-700" },
  { value: "teal", label: "Teal", bg: "bg-teal-100", text: "text-teal-700" },
];

// Icon options for categories
const iconOptions = [
  { value: "Laptop", label: "💻 Laptop", emoji: "💻" },
  { value: "Gaming", label: "🎮 Gaming", emoji: "🎮" },
  { value: "Office", label: "📊 Office", emoji: "📊" },
  { value: "Design", label: "🎨 Design", emoji: "🎨" },
  { value: "Student", label: "📚 Student", emoji: "📚" },
  { value: "Premium", label: "⭐ Premium", emoji: "⭐" },
  { value: "Budget", label: "💰 Budget", emoji: "💰" },
  { value: "Ultrabook", label: "✨ Ultrabook", emoji: "✨" },
];

// Modal Component untuk Create/Edit Category
function CategoryModal({ isOpen, onClose, onSubmit, title, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        icon: initialData.icon || ""
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        icon: ""
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
    if (!formData.name.trim()) newErrors.name = "Nama kategori harus diisi";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const getIconDisplay = (icon) => {
    const iconOption = iconOptions.find(opt => opt.value === icon);
    return iconOption ? iconOption.emoji : (icon || "📁");
  };

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
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Gaming Laptop"
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
              placeholder="gaming-laptop"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 transition bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon / Emoji
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm"
            >
              <option value="">Pilih Icon</option>
              {iconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.emoji} {icon.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
                {getIconDisplay(formData.icon)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {formData.name || "Nama Kategori"}
                </div>
                <div className="text-xs text-gray-400">
                  slug: {formData.slug || "slug-kategori"}
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
function DeleteConfirmModal({ isOpen, onClose, onConfirm, categoryName, isDeleting }) {
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
            Apakah Anda yakin ingin menghapus kategori <span className="font-semibold text-red-600">"{categoryName}"</span>?
          </p>
          <p className="text-sm text-gray-500">
            Tindakan ini tidak dapat dibatalkan dan akan menghapus kategori dari semua produk yang menggunakannya.
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
function CategoryCardSkeleton() {
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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Load categories
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data kategori", "error");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter and sort categories
  useEffect(() => {
    let filtered = [...categories];
    
    if (debouncedSearch) {
      filtered = filtered.filter(category => 
        category.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        category.slug?.toLowerCase().includes(debouncedSearch.toLowerCase())
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
    
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [categories, debouncedSearch, sortBy]);

  // Create category
  const handleCreateCategory = async (formData) => {
    setIsSubmitting(true);
    try {
      await createCategory(formData);
      showToast("Kategori berhasil ditambahkan", "success");
      setIsCreateModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error(error);
      showToast("Gagal menambahkan kategori", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update category
  const handleUpdateCategory = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateCategory(selectedCategory.id, formData);
      showToast("Kategori berhasil diupdate", "success");
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error(error);
      showToast("Gagal mengupdate kategori", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    setDeletingId(selectedCategory.id);
    try {
      await deleteCategory(selectedCategory.id);
      showToast("Kategori berhasil dihapus", "success");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus kategori", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const itemsPerPageOptions = [10, 25, 50, 100];

  // Get icon display
  const getIconDisplay = (icon) => {
    const iconOption = iconOptions.find(opt => opt.value === icon);
    return iconOption ? iconOption.emoji : (icon || "📁");
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
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modals */}
      <CategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
        title="Tambah Kategori Baru"
        isEditing={false}
      />

      <CategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdateCategory}
        title="Edit Kategori"
        initialData={selectedCategory}
        isEditing={true}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        categoryName={selectedCategory?.name}
        isDeleting={deletingId === selectedCategory?.id}
      />

      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Categories
        </h1>
        <p className="text-gray-500 mt-2">
          Kelola semua kategori produk laptop Anda
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Kategori</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{categories.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layers3 className="text-blue-700" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            {categories.length} kategori tersedia
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ditampilkan</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{paginatedCategories.length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Grid3x3 className="text-green-600" size={20} />
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

      {/* FORM TAMBAH KATEGORI - Button to open modal */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Tambah Kategori Baru</h2>
            <p className="text-sm text-gray-500 mt-1">Klik tombol di samping untuk menambahkan kategori baru</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Tambah Kategori
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
              placeholder="Cari kategori berdasarkan nama atau slug..."
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

      {/* CATEGORIES LIST */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Daftar Kategori</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total {filteredCategories.length} kategori ditemukan
            </p>
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400">
              <Layers3 size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">Tidak ada kategori</p>
              <p className="text-sm">
                {searchTerm ? "Coba dengan kata kunci berbeda" : "Klik tombol 'Tambah Kategori' untuk mulai menambahkan kategori"}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedCategories.map((category) => (
              <div key={category.id} className="px-6 py-4 hover:bg-gray-50 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
                        {getIconDisplay(category.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Slug: {category.slug}
                        </p>
                        {category.created_at && (
                          <p className="text-xs text-gray-400 mt-1">
                            Ditambahkan: {new Date(category.created_at).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Kategori"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      disabled={deletingId === category.id}
                      className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition ${
                        deletingId === category.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Hapus Kategori"
                    >
                      {deletingId === category.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCategories.length)} dari {filteredCategories.length} kategori
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