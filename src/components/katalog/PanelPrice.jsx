import React from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useProducts } from '../../hooks/useProducts';
import ProgressBar from './ProgressBar';
import { Wallet } from 'lucide-react';

const PRICE_RANGES = [
  { id: "<=1", label: "≤ 1 Juta", min: 0, max: 1000000 },
  { id: "1-3", label: "1–3 Juta", min: 1000000, max: 3000000 },
  { id: "3-5", label: "3–5 Juta", min: 3000000, max: 5000000 },
  { id: "5-7", label: "5–7 Juta", min: 5000000, max: 7000000 },
  { id: ">=7", label: "≥ 7 Juta", min: 7000000, max: null }
];

const LAPTOP_TAG = 'laptop';

function PanelPrice() {
  const { filters, setFilters, setCurrentPanel, setPath, setMode, setCategoryLabel } = useFunnelContext();
  const { fetchProductsByFilters } = useProducts();

  const handlePriceSelect = async (range) => {
    setFilters({
      min_price: range.min,
      max_price: range.max,
      brand_slug: null,
      tags: [LAPTOP_TAG],
      category_slugs: []
    });
    setMode(null);
    setCategoryLabel(null);
    setPath(prev => [...prev, { label: range.label }]);
    setCurrentPanel('products');
    await fetchProductsByFilters();
  };

  return (
    <div className="panel flex flex-col w-full">
      <ProgressBar currentStep={2} totalSteps={3} />
      <h3 className="text-2xl font-extrabold text-center mb-5 mx-0">
        Pilih kisaran harga
      </h3>
      <div className="priceGrid grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRICE_RANGES.map((range, idx) => {
          const isSelected = filters.min_price === range.min && filters.max_price === range.max;
          return (
            <article
              key={range.id}
              className={`big-button card-3d flex flex-col items-center gap-3.5 p-5 cursor-pointer text-center relative overflow-hidden opacity-0 scale-90 animate-[zoomOut_0.5s_forwards] hover:border-blue-400 ${isSelected ? 'border-blue-500' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => handlePriceSelect(range)}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePriceSelect(range);
                }
              }}
            >
              <div className="icon w-[60px] h-[60px] rounded-xl grid place-items-center bg-blue-50 text-blue-600 border border-blue-100">
                <Wallet className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="title font-bold text-lg text-content">{range.label}</div>
              <div className="desc text-sm text-content-muted">Kisaran harga {range.label}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default PanelPrice;