import React, { useRef, useEffect, useState } from 'react';
import { fmtIDR } from '../../services/api';
import { Crown, Flame, Sparkles } from 'lucide-react';
import { isNewProduct } from '../../utils/dateUtils';
import TiltCard from '../ui/TiltCard';
import CursorSpotlight from '../ui/CursorSpotlight';

function ProductCard({ product, viewMode, mode, stock }) {
    const imgRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const imgSrc = product.images?.[0]?.src || 'https://via.placeholder.com/400x300?text=No+Image';
    const minor = product.prices?.currency_minor_unit ?? 0;
    const nowPrice = +product?.prices?.price || 0;
    const regularPrice = +product?.prices?.regular_price || nowPrice;
    const isOnSale = product.prices?.sale_price > 0 && product.prices?.sale_price < regularPrice;
    const discount = isOnSale ? Math.round(100 - (product.prices.sale_price / regularPrice * 100)) : 0;

    const showDiscountUI = mode === 'promo' && isOnSale;
    const showBestUI = mode === 'bestseller';
    const createdDate = product.created_at || product.date_created || product.date_created_gmt;
    const showNewUI = mode === 'new' || (createdDate ? isNewProduct(createdDate, 30) : false);

    const getSoldCount = () => {
        const seed = (product.id * 9301 + 49297) % 233280;
        return (seed % 400) + 100;
    };

    const soldCount = showBestUI ? getSoldCount() : null;

    const getStockBadge = () => {
        if (!stock) return <span className="text-[10px] text-content-muted">Tersedia</span>;
        if (stock.in_stock === false || stock.stock_status === 'outofstock') {
            return <span className="text-[10px] text-red-500">Habis</span>;
        }

        let qty = null;
        if (stock.type === 'variable' && stock.sum_variation_qty != null) qty = stock.sum_variation_qty;
        if (stock.type !== 'variable' && stock.stock_quantity != null) qty = stock.stock_quantity;

        if (Number.isFinite(qty)) {
            const low = qty <= 5;
            return <span className={`text-[10px] ${low ? 'text-amber-500' : 'text-green-600'}`}>Sisa {qty}</span>;
        }
        return <span className="text-[10px] text-content-muted">Tersedia</span>;
    };

    const getCardClassName = () => {
        let baseClass = "group relative card-3d overflow-hidden";
        if (mode === 'bestseller') return `${baseClass} border-amber-200`;
        if (mode === 'promo') return `${baseClass} border-red-200`;
        if (mode === 'new') return `${baseClass} border-emerald-200`;
        return baseClass;
    };

    const buildProductUrl = () => {
        const backHash = window.location.hash;
        const fromBase = window.location.pathname;
        const separator = product.permalink.includes('?') ? '&' : '?';
        return `${product.permalink}${separator}return=${encodeURIComponent(backHash)}&from=${encodeURIComponent(fromBase)}`;
    };

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setImageLoaded(true);
        }
    }, []);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const isMobile = window.innerWidth <= 640;
    const finalViewMode = isMobile ? 'grid' : viewMode;

    // Badge kecil
    const renderBadges = () => (
        <>
            {showBestUI && (
                <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="inline-flex items-center gap-0.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-soft-sm">
                        <Crown className="w-2.5 h-2.5" aria-hidden="true" /> Best
                    </span>
                </div>
            )}
            {showDiscountUI && (
                <div className="absolute top-1.5 right-1.5 z-10">
                    <span className="inline-flex items-center gap-0.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-soft-sm">
                        <Flame className="w-2.5 h-2.5" aria-hidden="true" /> -{discount}%
                    </span>
                </div>
            )}
            {showNewUI && (
                <div className="absolute bottom-1.5 left-1.5 z-10">
                    <span className="inline-flex items-center gap-0.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-soft-sm">
                        <Sparkles className="w-2.5 h-2.5" aria-hidden="true" /> New
                    </span>
                </div>
            )}
        </>
    );

    // LIST VIEW
    if (finalViewMode === 'list' && !isMobile) {
        return (
            <article className={getCardClassName()}>
                <div className="flex gap-2.5 p-2.5">
                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                        {!imageLoaded && <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>}
                        <img
                            ref={imgRef}
                            className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            src={imgSrc}
                            alt={product.name}
                            loading="lazy"
                            onLoad={handleImageLoad}
                        />
                        {renderBadges()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-content line-clamp-2 mb-0.5">
                            {product.name}
                        </h4>
                        {showBestUI && soldCount && (
                            <p className="text-[9px] text-content-muted mb-0.5">Terjual {soldCount}</p>
                        )}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-content">{fmtIDR(nowPrice, minor)}</span>
                            {showDiscountUI && (
                                <span className="text-[9px] line-through text-content-muted">{fmtIDR(regularPrice, minor)}</span>
                            )}
                            {getStockBadge()}
                        </div>
                    </div>
                </div>
                <a className="absolute inset-0 z-10" href={buildProductUrl()} aria-label={`Buka ${product.name}`} />
            </article>
        );
    }

    // GRID VIEW (Compact)
    const gridCard = (
        <article className={getCardClassName()}>
            {/* Image Container */}
            <div className="relative bg-white aspect-square overflow-hidden">
                {!imageLoaded && <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>}
                <img
                    ref={imgRef}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={imgSrc}
                    alt={product.name}
                    loading="lazy"
                    onLoad={handleImageLoad}
                />
                {renderBadges()}
            </div>

            {/* Content - Compact */}
            <div className="p-2.5">
                <h4 className="text-xs font-semibold text-content line-clamp-2 min-h-[2rem] mb-0.5">
                    {product.name}
                </h4>

                {showBestUI && soldCount && (
                    <p className="text-[9px] text-content-muted mb-1">Terjual {soldCount}</p>
                )}

                <div className="flex items-center justify-between gap-1.5 mt-1.5">
                    <div>
                        <span className="text-xs font-bold text-content">{fmtIDR(nowPrice, minor)}</span>
                        {showDiscountUI && (
                            <span className="text-[9px] line-through text-content-muted ml-1">{fmtIDR(regularPrice, minor)}</span>
                        )}
                    </div>
                    {getStockBadge()}
                </div>
            </div>

            <a className="absolute inset-0 z-10" href={buildProductUrl()} aria-label={`Buka ${product.name}`} />
            {/* Sorotan cahaya lembut mengikuti kursor — di atas gambar, tak menghalangi klik */}
            <CursorSpotlight size={360} color="rgba(59,130,246,0.16)" className="z-20" />
        </article>
    );

    return <TiltCard max={6} scale={1.03} className="rounded-2xl h-full">{gridCard}</TiltCard>;
}

export default ProductCard;