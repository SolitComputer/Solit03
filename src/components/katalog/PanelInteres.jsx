import React from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useProducts } from '../../hooks/useProducts';
import ProgressBar from './ProgressBar';
import { Briefcase, GraduationCap, Gamepad2, Palette, Feather, Pointer } from 'lucide-react';

const INTERESTS = [
  { id: "kantor", label: "Kantor", icon: Briefcase, tag: "kantor" },
  { id: "sekolah", label: "Sekolah/Kuliah", icon: GraduationCap, tag: "sekolah" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, tag: "gaming" },
  { id: "desain", label: "Desain Grafis", icon: Palette, tag: "desain-grafis" },
  { id: "tipis", label: "Tipis & Ringan", icon: Feather, tag: "tipis-ringan" },
  { id: "touch", label: "Touchscreen", icon: Pointer, tag: "touchscreen" }
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
              className={`big-button card-3d flex flex-col items-center gap-3.5 p-5 cursor-pointer text-center relative overflow-hidden opacity-0 scale-90 animate-[zoomOut_0.5s_forwards] hover:border-blue-400 ${isSelected ? 'border-blue-500' : ''}`}
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
              <div className="icon w-[60px] h-[60px] rounded-xl grid place-items-center bg-blue-50 text-blue-600 border border-blue-100">
                <interest.icon className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="title font-bold text-lg text-content">{interest.label}</div>
              <div className="desc text-sm text-content-muted">Untuk keperluan {interest.label}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default PanelInterest;