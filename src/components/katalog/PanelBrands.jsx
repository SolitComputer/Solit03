import React, { useState, useEffect } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useProducts } from '../../hooks/useProducts';
import { fetchBrands } from '../../services/api';
import ProgressBar from './ProgressBar';

function PanelBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters, setCurrentPanel, setPath, setMode, setCategoryLabel } = useFunnelContext();
  const { fetchProductsByFilters } = useProducts();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const brandList = await fetchBrands();
      setBrands(brandList.filter(b => b.count === null || b.count > 0));
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = async (brand) => {
    setFilters({
      ...filters,
      brand_slug: brand.slug
    });
    setMode(null);
    setCategoryLabel(null);
    setPath(prev => [...prev, { label: brand.name }]);
    setCurrentPanel('products');
    await fetchProductsByFilters();
  };

  if (loading) {
    return (
      <div className="panel flex flex-col w-full">
        <ProgressBar currentStep={2} totalSteps={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="loader w-full h-[200px] rounded-2xl bg-gradient-to-r from-[#f3f7ff] via-[#e6f0ff] to-[#f3f7ff] bg-[length:400%_100%] animate-[loaderShine_1.2s_infinite_ease-in-out] border border-[#a3c5ff]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="panel flex flex-col w-full">
      <ProgressBar currentStep={2} totalSteps={3} />
      <h3 className="text-2xl font-extrabold text-center mb-5 mx-0">
        Pilih merek laptop
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand, idx) => {
          const isSelected = filters.brand_slug === brand.slug;
          return (
            <article
              key={brand.id}
              className={`card brand-box grid place-items-center p-5 text-center bg-white border border-[#a3c5ff] rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer opacity-0 scale-90 animate-[zoomOut_0.5s_forwards] ${isSelected ? 'border-[#1e90ff] shadow-md' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => handleBrandSelect(brand)}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBrandSelect(brand);
                }
              }}
            >
              {brand.image ? (
                <img className="brand-logo w-20 h-20 object-contain block mx-auto mb-3 saturate-[1.2] grayscale-[0.1]" src={brand.image} alt={brand.name} loading="lazy" />
              ) : (
                <div className="icon w-[80px] h-[80px] rounded-xl grid place-items-center text-[28px] bg-[#1e90ff]/20 text-[#1e90ff] border border-[#1e90ff]/40 mx-auto mb-3">
                  {(brand.name || '??').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="brand-name font-semibold text-base">{brand.name}</div>
              <div className="brand-count text-sm text-gray-500">
                {brand.count !== null ? `${brand.count} produk` : 'Tersedia'}
              </div>
            </article>
          );
        })}
      </div>
      {brands.length === 0 && (
        <p className="text-gray-500 text-center mt-4">
          Daftar merk kosong. Tambahkan di Products → Brands dan assign ke produk.
        </p>
      )}
    </div>
  );
}

export default PanelBrands;