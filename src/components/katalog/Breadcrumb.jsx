import React from 'react';

function Breadcrumb({ path, currentPanel, filters }) {
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

  let displayPath = [...path];
  
  if (currentPanel === 'price') {
    const rangeLabel = getPriceRangeLabel();
    if (rangeLabel && displayPath.length && displayPath[displayPath.length - 1]?.label === rangeLabel) {
      displayPath.pop();
    }
  }

  return (
    <div className="crumbs" aria-label="Breadcrumb">
      {displayPath.map((crumb, index) => (
        <span key={index} className="chip" {...(index === displayPath.length - 1 ? { 'aria-current': 'page' } : {})}>
          <span className="chip-icon">📍</span> {crumb.label}
        </span>
      ))}
    </div>
  );
}

export default Breadcrumb;