import React from 'react';

function Topbar({ onBack, path, currentPanel, filters }) {
  const getPriceRangeLabel = () => {
    if (!filters) return null;
    const ranges = [
      { min: 0, max: 1000000, label: "≤ 1 Juta" },
      { min: 1000000, max: 3000000, label: "1–3 Juta" },
      { min: 3000000, max: 5000000, label: "3–5 Juta" },
      { min: 5000000, max: 7000000, label: "5–7 Juta" },
      { min: 7000000, max: null, label: "≥ 7 Juta" }
    ];
    const range = ranges.find(r => r.min === filters.min_price && r.max === filters.max_price);
    return range ? range.label : null;
  };

  const renderCrumbs = () => {
    let crumbs = [...path];
    
    if (currentPanel === 'price') {
      const rangeLabel = getPriceRangeLabel();
      if (rangeLabel && crumbs.length && crumbs[crumbs.length - 1]?.label === rangeLabel) {
        crumbs.pop();
      }
    }
    
    return crumbs.map((crumb, index) => (
      <span 
        key={index} 
        className="chip bg-[#e1eeff] border border-[#a3c5ff] px-3 py-1.5 rounded-full font-semibold text-[#1e90ff] text-xs shadow-sm hover:-translate-y-0.5 transition-all flex-shrink-0"
        {...(index === crumbs.length - 1 ? { 'aria-current': 'page' } : {})}
      >
        <span className="chip-icon text-base mr-1">📍</span> {crumb.label}
      </span>
    ));
  };

  return (
    <div className="topbar sticky top-0 z-[2000] flex items-center gap-2 mb-2 p-2.5 rounded-[20px] backdrop-blur-[20px] backdrop-saturate-[1.8] bg-white/90 border border-white/40 shadow-md">
      <div className="topbar-actions flex justify-between w-full gap-2">
        <button 
          onClick={onBack} 
          className="btn secondary bg-white text-[#0a2540] border border-[#a3c5ff] px-3 py-1.5 rounded-xl font-bold shadow-sm hover:-translate-y-0.5 transition-all text-xs"
        >
          ← Kembali
        </button>
      </div>
      <div className="crumbs flex items-center gap-1.5 flex-1 min-w-0 whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar py-1">
        {renderCrumbs()}
      </div>
    </div>
  );
}

export default Topbar;