import React from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useProducts } from '../../hooks/useProducts';
import ProgressBar from './ProgressBar';
import { Flame, PartyPopper, Sparkles, Wallet, Building2, FolderOpen, ArrowDownAZ } from 'lucide-react';

const HUB_OPTIONS = [
    { action: 'bestSeller', icon: Flame, title: 'Best Seller', desc: 'Laptop paling laris dan populer', tabName: 'bestseller' },
    { action: 'promoToday', icon: PartyPopper, title: 'Promo Hari Ini', desc: 'Diskon khusus untuk hari ini', tabName: 'promo' },
    { action: 'newStock', icon: Sparkles, title: 'Stok Terbaru', desc: 'Produk Terbaru', tabName: 'new' },
    { action: 'byPrice', icon: Wallet, title: 'Sesuaikan Budget', desc: 'Pilih laptop sesuai kemampuan', tabName: 'price' },
    { action: 'byBrand', icon: Building2, title: 'Pilih Merek', desc: 'Lenovo, Dell, HP, ASUS, dll', tabName: 'brand' },
    { action: 'byInterest', icon: Sparkles, title: 'Untuk Apa?', desc: 'Kantor, Sekolah, Gaming, dll', tabName: 'interest' },
    { action: 'byCategory', icon: FolderOpen, title: 'Kategori Produk', desc: 'PC, Monitor, Proyektor, Dus, Bracket', tabName: 'category' },
    { action: 'allAZ', icon: ArrowDownAZ, title: 'Semua Produk A–Z', desc: 'Urut nama A sampai Z', tabName: 'az' }
];

const LAPTOP_TAG = 'laptop';

function PanelHub() {
    const { setCurrentPanel, setFilters, setMode, setPath, setCategoryLabel, saveTabState, loadTabState } = useFunnelContext();
    const { openBestSeller, openPromoToday, openNewStock, openAllProductsAZ } = useProducts();

    const handleOptionClick = async (action, tabName) => {
        console.log('🖱️ Clicked action:', action, 'tab:', tabName);

        setCategoryLabel(null);

        const hasSavedState = loadTabState(tabName);

        if (hasSavedState) {
            console.log('✅ Loaded saved state for:', tabName);
            setCurrentPanel('products');
            return;
        }

        switch (action) {
            case 'bestSeller':
                console.log('→ Opening Best Seller');
                setPath(prev => [...prev, { label: 'Best Seller' }]);
                await openBestSeller();
                saveTabState('bestseller');
                break;
            case 'promoToday':
                console.log('→ Opening Promo Today');
                setPath(prev => [...prev, { label: 'Promo Hari Ini' }]);
                await openPromoToday();
                saveTabState('promo');
                break;
            case 'newStock':
                console.log('→ Opening New Stock');
                setPath(prev => [...prev, { label: 'Stok Terbaru' }]);
                await openNewStock();
                saveTabState('new');
                break;
            case 'byPrice':
                console.log('→ Opening Price panel');
                setPath(prev => [...prev, { label: 'Harga' }]);
                setFilters({ tags: [LAPTOP_TAG] });
                setCurrentPanel('price');
                break;
            case 'byBrand':
                console.log('→ Opening Brands panel');
                setPath(prev => [...prev, { label: 'Merk' }]);
                setFilters({ tags: [LAPTOP_TAG] });
                setCurrentPanel('brands');
                break;
            case 'byInterest':
                console.log('→ Opening Interest panel');
                setPath(prev => [...prev, { label: 'Minat' }]);
                setCurrentPanel('interest');
                break;
            case 'byCategory':
                console.log('🎯 Opening Categories panel');
                setPath(prev => [...prev, { label: 'Kategori' }]);
                setCurrentPanel('categories');
                break;
            case 'allAZ':
                console.log('→ Opening All Products');
                setPath(prev => [...prev, { label: 'Semua Produk A–Z' }]);
                await openAllProductsAZ();
                saveTabState('az');
                break;
            default:
                console.log('⚠️ Unknown action:', action);
                break;
        }
    };

    return (
        <div id="panel-hub" className="panel active flex flex-col w-full">
            <ProgressBar currentStep={1} totalSteps={3} />
            <h2 className="text-[28px] font-extrabold text-center mb-5 mx-0">
                Apa yang Anda butuhkan?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HUB_OPTIONS.map((option, idx) => (
                    <article
                        key={option.action}
                        className="big-button card-3d flex flex-col items-center gap-3.5 p-5 hover:border-blue-400 cursor-pointer text-center relative overflow-hidden"
                        onClick={() => handleOptionClick(option.action, option.tabName)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleOptionClick(option.action, option.tabName);
                            }
                        }}
                    >
                        <div className="icon w-[60px] h-[60px] rounded-xl grid place-items-center bg-blue-50 text-blue-600 border border-blue-100">
                            <option.icon className="w-7 h-7" aria-hidden="true" />
                        </div>
                        <div className="title font-bold text-lg text-slate-900">{option.title}</div>
                        <div className="desc text-sm text-slate-500">{option.desc}</div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default PanelHub;