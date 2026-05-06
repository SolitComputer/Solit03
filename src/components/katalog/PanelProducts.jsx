// components/katalog/PanelProducts.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useProducts } from '../../hooks/useProducts';
import { useStock } from '../../hooks/useStock';
import ProductCard from './ProductCard';
import ProgressBar from './ProgressBar';
import { ProductsGridSkeleton, ProductsListSkeleton, LoadingWithMessage } from './LoadingSkeleton';

function PanelProducts({ viewMode, setViewMode }) {
    const { mode, filters, categoryLabel, products, setProducts, loading, setLoading } = useFunnelContext();
    const { fetchProductsByFilters } = useProducts();
    const { stockMap, fetchStock } = useStock();
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Memuat produk...");

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setLoadingMessage("Mengambil data produk...");
            try {
                const fetchedProducts = await fetchProductsByFilters({}, !isFirstLoad);
                setProducts(fetchedProducts);
                setIsFirstLoad(false);
                setLoadingMessage("Memproses data...");
            } catch (error) {
                console.error('Failed to load products:', error);
                setProducts([]);
                setLoadingMessage("Gagal memuat data");
            } finally {
                // Simulasi delay kecil untuk skeleton
                setTimeout(() => setLoading(false), 300);
            }
        };
        loadProducts();
    }, [filters, mode]);

    useEffect(() => {
        if (products.length > 0) {
            setLoadingMessage("Mengambil info stok...");
            fetchStock(products.map(p => p.id));
        }
    }, [products, fetchStock]);

    const getTitle = useMemo(() => {
        console.log('Current mode:', mode);
        console.log('Current filters:', filters);

        if (mode === 'promo') return '🔥 Promo Hari Ini';
        if (mode === 'bestseller') return '⭐ Best Seller';
        if (mode === 'new') return '🆕 Stok Terbaru';
        if (mode === 'az') return '📚 Semua Produk A–Z';
        if (categoryLabel) return `📁 ${categoryLabel}`;
        if (filters.brand_slug) return `🏢 ${filters.brand_slug.toUpperCase()}`;
        if (filters.min_price !== null || filters.max_price !== null) {
            const min = filters.min_price ? `Rp ${filters.min_price.toLocaleString()}` : '0';
            const max = filters.max_price ? `Rp ${filters.max_price.toLocaleString()}` : '∞';
            return `💰 Harga: ${min} - ${max}`;
        }
        if (filters.tags?.length) return `✨ ${filters.tags.join(', ')}`;
        if (filters.category_slugs?.length) return `📂 ${filters.category_slugs.join(', ')}`;
        return '📦 Produk tersedia';
    }, [mode, categoryLabel, filters]);

    const isMobile = window.innerWidth <= 640;

    if (loading) {
        return (
            <div className="panel flex flex-col w-full">
                <ProgressBar currentStep={3} totalSteps={3} />

                {/* Header Skeleton */}
                <div className="flex items-center justify-between flex-wrap mb-4">
                    <div>
                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    {!isMobile && (
                        <div className="flex gap-1">
                            <div className="h-7 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-7 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    )}
                </div>

                {/* Loading Message */}
                <div className="mb-3">
                    <p className="text-xs text-blue-500 animate-pulse">{loadingMessage}</p>
                </div>

                {/* Product Grid Skeleton */}
                {viewMode === 'list' && !isMobile ? (
                    <ProductsListSkeleton count={5} />
                ) : (
                    <ProductsGridSkeleton count={8} />
                )}
            </div>
        );
    }

    return (
        <div className="panel flex flex-col w-full">
            <ProgressBar currentStep={3} totalSteps={3} />

            {/* Header dengan font lebih kecil */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 m-0">
                        {getTitle}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        {products.length} produk ditemukan
                    </p>
                </div>

                {!isMobile && (
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                        <button
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${viewMode === 'grid'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setViewMode('grid')}
                        >
                            ⊞ Grid
                        </button>
                        <button
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${viewMode === 'list'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setViewMode('list')}
                        >
                            ☰ List
                        </button>
                    </div>
                )}
            </div>

            {/* Product Grid */}
            <div className={`grid gap-3 ${isMobile
                ? 'grid-cols-1'
                : (viewMode === 'list'
                    ? 'grid-cols-1'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                )
                }`}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={isMobile ? 'grid' : viewMode}
                        mode={mode}
                        stock={stockMap[product.id]}
                    />
                ))}
            </div>

            {products.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-gray-500 text-sm">Tidak ada produk yang ditemukan</p>
                    <p className="text-gray-400 text-xs mt-1">Coba pilih kategori atau filter lain</p>
                </div>
            )}
        </div>
    );
}

export default PanelProducts;