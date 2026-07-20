import React, { useEffect, useState } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import ProgressBar from './ProgressBar';
import { CategoriesGridSkeleton } from './LoadingSkeleton';
import { Monitor, Presentation, Package, Magnet } from 'lucide-react';

const CATEGORIES = [
    { id: "pc", label: "PC", icon: Monitor, type: "tag", tags: ["pc"] },
    { id: "monitor", label: "Monitor", icon: Monitor, type: "tag", tags: ["monitor"] },
    { id: "proyektor", label: "Proyektor", icon: Presentation, type: "tag", tags: ["proyektor"] },
    { id: "dus", label: "Dus", icon: Package, type: "tag", tags: ["dus"] },
    { id: "bracket", label: "Bracket Monitor", icon: Magnet, type: "tag", tags: ["bracket-monitor"] },
];

function PanelCategories() {
    const { setCurrentPanel, setFilters, setPath, setCategoryLabel, currentPanel } = useFunnelContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🎯 PanelCategories RENDERED!');
        console.log('Current panel from context:', currentPanel);

        // Simulasi loading sebentar untuk skeleton
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [currentPanel]);

    const handleCategoryClick = (category) => {
        console.log('📦 Category clicked:', category.label);

        setFilters({
            brand_slug: null,
            min_price: null,
            max_price: null,
            tags: [...(category.tags || [])],
            category_slugs: []
        });

        setCategoryLabel(category.label);
        setPath(prev => [...prev, { label: category.label }]);
        setCurrentPanel('products');
    };

    if (loading) {
        return (
            <div id="panel-categories" className="panel active flex flex-col w-full">
                <ProgressBar currentStep={2} totalSteps={3} />
                <h3 className="text-2xl font-extrabold text-center mb-5 mx-0 mt-4">
                    Pilih kategori produk
                </h3>
                <CategoriesGridSkeleton count={5} />
            </div>
        );
    }

    return (
        <div id="panel-categories" className="panel active flex flex-col w-full">
            <ProgressBar currentStep={2} totalSteps={3} />

            <h3 className="text-2xl font-extrabold text-center mb-5 mx-0 mt-4">
                Pilih kategori produk
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => (
                    <div
                        key={category.id}
                        className="card-3d flex flex-col items-center gap-3.5 p-5 hover:border-blue-400 cursor-pointer text-center"
                        onClick={() => handleCategoryClick(category)}
                    >
                        <div className="w-[60px] h-[60px] rounded-xl grid place-items-center bg-blue-50 text-blue-600 border border-blue-100">
                            <category.icon className="w-7 h-7" aria-hidden="true" />
                        </div>
                        <div className="font-bold text-lg text-slate-900">{category.label}</div>
                        <div className="text-sm text-slate-500">
                            Tag: {category.tags.join(', ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PanelCategories;