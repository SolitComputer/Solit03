import React, { useEffect, useState } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import ProgressBar from './ProgressBar';
import { CategoriesGridSkeleton } from './LoadingSkeleton';

const CATEGORIES = [
    { id: "pc", label: "PC", icon: "🖥️", type: "tag", tags: ["pc"] },
    { id: "monitor", label: "Monitor", icon: "🖲️", type: "tag", tags: ["monitor"] },
    { id: "proyektor", label: "Proyektor", icon: "📽️", type: "tag", tags: ["proyektor"] },
    { id: "dus", label: "Dus", icon: "📦", type: "tag", tags: ["dus"] },
    { id: "bracket", label: "Bracket Monitor", icon: "🧲", type: "tag", tags: ["bracket-monitor"] },
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
                        className="flex flex-col items-center gap-3.5 p-5 rounded-2xl bg-white border-2 border-[#a3c5ff] hover:border-[#1e90ff] hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer text-center"
                        onClick={() => handleCategoryClick(category)}
                    >
                        <div className="w-[60px] h-[60px] rounded-xl grid place-items-center text-[28px] bg-blue-100 text-[#1e90ff] border border-blue-200">
                            {category.icon}
                        </div>
                        <div className="font-bold text-lg">{category.label}</div>
                        <div className="text-sm text-gray-500">
                            Tag: {category.tags.join(', ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PanelCategories;