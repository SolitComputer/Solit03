import React, { useState, useEffect, useCallback } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useFunnelNavigation } from '../../hooks/useFunnelNavigation';
import Topbar from '../katalog/Topbar';
import PanelProducts from '../katalog/PanelProducts';
import PanelCategories from '../katalog/PanelCategories';
import PanelBrands from '../katalog/PanelBrands';
import PanelInterest from '../katalog/PanelInteres';
import PanelPrice from '../katalog/PanelPrice';
import PanelHub from '../katalog/PanelHub';
import Hero from '../katalog/Hero';

function FunnelContainer() {
    const { currentPanel, setCurrentPanel, path, setPath, filters, resetFilters } = useFunnelContext();
    const { pushState, replaceState } = useFunnelNavigation();
    const [viewMode, setViewMode] = useState('grid');
    const [isHeroActive, setIsHeroActive] = useState(true);

    const handleBack = useCallback(() => {
        if (currentPanel === 'products') {
            if (path.some(p => p.label === 'Best Seller' || p.label === 'Promo Hari Ini' || p.label === 'Stok Terbaru' || p.label === 'Semua Produk A-Z')) {
                setCurrentPanel('hub');
                setPath([{ label: 'Hub' }]);
                resetFilters();
            } else if (filters.brand_slug) {
                setCurrentPanel('brands');
                setPath([{ label: 'Hub' }, { label: 'Merk' }]);
            } else if (filters.min_price !== null || filters.max_price !== null) {
                setCurrentPanel('price');
                setPath([{ label: 'Hub' }, { label: 'Harga' }]);
            } else if (filters.tags?.length && !filters.category_slugs?.length) {
                setCurrentPanel('interest');
                setPath([{ label: 'Hub' }, { label: 'Minat' }]);
            } else if (filters.category_slugs?.length) {
                setCurrentPanel('categories');
                setPath([{ label: 'Hub' }, { label: 'Kategori' }]);
            } else {
                setCurrentPanel('hub');
                setPath([{ label: 'Hub' }]);
            }
        } else if (['brands', 'price', 'interest', 'categories'].includes(currentPanel)) {
            setCurrentPanel('hub');
            setPath([{ label: 'Hub' }]);
        } else if (currentPanel === 'hub') {
            setCurrentPanel('hero');
            setPath([]);
            resetFilters();
        } else {
            setCurrentPanel('hero');
            setPath([]);
            resetFilters();
        }
    }, [currentPanel, path, filters, setCurrentPanel, setPath, resetFilters]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') handleBack();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleBack]);

    useEffect(() => {
        setIsHeroActive(currentPanel === 'hero');
    }, [currentPanel]);

    useEffect(() => {
        const setVH = () => {
            document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
        };
        setVH();
        window.addEventListener('resize', setVH);
        return () => window.removeEventListener('resize', setVH);
    }, []);

    const renderPanel = () => {
        console.log('🔍 Current panel:', currentPanel);
        console.log('🎯 Available panels:', {
            isHero: currentPanel === 'hero',
            isHub: currentPanel === 'hub',
            isCategories: currentPanel === 'categories'
        });

        switch (currentPanel) {
            case 'hero':
                console.log('✅ Rendering Hero');
                return <Hero onStart={() => { setCurrentPanel('hub'); setPath([{ label: 'Hub' }]); }} />;
            case 'hub':
                console.log('✅ Rendering Hub');
                return <PanelHub />;
            case 'price':
                console.log('✅ Rendering Price');
                return <PanelPrice />;
            case 'interest':
                console.log('✅ Rendering Interest');
                return <PanelInterest />;
            case 'brands':
                console.log('✅ Rendering Brands');
                return <PanelBrands />;
            case 'categories':
                console.log('🎯🎯🎯 Rendering Categories Panel! 🎯🎯🎯');
                return <PanelCategories />;
            case 'products':
                console.log('✅ Rendering Products');
                return <PanelProducts viewMode={viewMode} setViewMode={setViewMode} />;
            default:
                console.log('⚠️ Default: Rendering Hero');
                return <Hero onStart={() => setCurrentPanel('hub')} />;
        }
    };

    return (
        <section id="solit03-funnel" className={`${isHeroActive ? 'hero-active' : ''}`}>
            <div className="max-w-[min(1800px,96vw)] mx-auto px-[clamp(16px,2vw,30px)] min-h-screen flex flex-col gap-[clamp(16px,2vw,30px)]">
                {!isHeroActive && (
                    <Topbar
                        onBack={handleBack}
                        path={path}
                        currentPanel={currentPanel}
                        filters={filters}
                    />
                )}
                {renderPanel()}
            </div>
        </section>
    );
}

export default FunnelContainer;