import React from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useProducts } from '../../hooks/useProducts';
import ProgressBar from './ProgressBar';

const INTERESTS = [
  { id: "kantor", label: "Kantor", icon: "👨‍💼", tag: "kantor" },
  { id: "sekolah", label: "Sekolah/Kuliah", icon: "🎓", tag: "sekolah" },
  { id: "gaming", label: "Gaming", icon: "🎮", tag: "gaming" },
  { id: "desain", label: "Desain Grafis", icon: "🎨", tag: "desain-grafis" },
  { id: "tipis", label: "Tipis & Ringan", icon: "🪶", tag: "tipis-ringan" },
  { id: "touch", label: "Touchscreen", icon: "👆", tag: "touchscreen" }
];

function PanelInterest() {
  const { filters, setFilters, setCurrentPanel, setPath, setMode, setCategoryLabel } = useFunnelContext();
  const { fetchProductsByFilters } = useProducts();

  const handleInterestSelect = async (interest) => {
    setFilters({
      tags: [interest.tag],
      brand_slug: null,
      category_slugs: [],
      min_price: null,
      max_price: null
    });
    setMode(null);
    setCategoryLabel(null);
    setPath(prev => [...prev, { label: interest.label }]);
    setCurrentPanel('products');
    await fetchProductsByFilters();
  };

  return (
    <div className="panel flex flex-col w-full">
      <ProgressBar currentStep={2} totalSteps={3} />
      <h3 className="text-2xl font-extrabold text-center mb-5 mx-0">
        Apa kebutuhan utama Anda?
      </h3>
      <div className="interestGrid grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTERESTS.map((interest, idx) => {
          const isSelected = filters.tags?.includes(interest.tag);
          return (
            <article
              key={interest.id}
              className={`big-button flex flex-col items-center gap-3.5 p-5 rounded-2xl bg-white border-2 transition-all cursor-pointer text-center relative overflow-hidden opacity-0 scale-90 animate-[zoomOut_0.5s_forwards] hover:border-[#1e90ff] hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'border-[#1e90ff] shadow-md' : 'border-[#a3c5ff]'}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => handleInterestSelect(interest)}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleInterestSelect(interest);
                }
              }}
            >
              <div className="icon w-[60px] h-[60px] rounded-xl grid place-items-center text-[28px] bg-[#1e90ff]/20 text-[#1e90ff] border border-[#1e90ff]/40">
                {interest.icon}
              </div>
              <div className="title font-bold text-lg">{interest.label}</div>
              <div className="desc text-sm text-gray-600">Untuk keperluan {interest.label}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default PanelInterest;