// components/katalog/ProductCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { fmtIDR } from '../../services/api';

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
    const showNewUI = mode === 'new';

    const getSoldCount = () => {
        const seed = (product.id * 9301 + 49297) % 233280;
        return (seed % 400) + 100;
    };

    const soldCount = showBestUI ? getSoldCount() : null;

    const getStockBadge = () => {
        if (!stock) return <span className="text-[10px] text-gray-400">Tersedia</span>;
        if (stock.in_stock === false || stock.stock_status === 'outofstock') {
            return <span className="text-[10px] text-red-500">Habis</span>;
        }

        let qty = null;
        if (stock.type === 'variable' && stock.sum_variation_qty != null) qty = stock.sum_variation_qty;
        if (stock.type !== 'variable' && stock.stock_quantity != null) qty = stock.stock_quantity;

        if (Number.isFinite(qty)) {
            const low = qty <= 5;
            return <span className={`text-[10px] ${low ? 'text-orange-500' : 'text-green-600'}`}>Sisa {qty}</span>;
        }
        return <span className="text-[10px] text-gray-400">Tersedia</span>;
    };

    const getCardClassName = () => {
        let baseClass = "group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden";
        if (mode === 'bestseller') return `${baseClass} border border-yellow-200`;
        if (mode === 'promo') return `${baseClass} border border-pink-200`;
        if (mode === 'new') return `${baseClass} border border-green-200`;
        return `${baseClass} border border-gray-100`;
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
                    <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        👑 Best
                    </span>
                </div>
            )}
            {showDiscountUI && (
                <div className="absolute top-1.5 right-1.5 z-10">
                    <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        🔥 -{discount}%
                    </span>
                </div>
            )}
            {showNewUI && (
                <div className="absolute bottom-1.5 left-1.5 z-10">
                    <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        🆕 New
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
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>}
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
                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-0.5">
                            {product.name}
                        </h4>
                        {showBestUI && soldCount && (
                            <p className="text-[9px] text-gray-400 mb-0.5">Terjual {soldCount}</p>
                        )}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-gray-900">{fmtIDR(nowPrice, minor)}</span>
                            {showDiscountUI && (
                                <span className="text-[9px] line-through text-gray-400">{fmtIDR(regularPrice, minor)}</span>
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
    return (
        <article className={getCardClassName()}>
            {/* Image Container */}
            <div className="relative bg-gray-50 aspect-square overflow-hidden">
                {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>}
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
                <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[2rem] mb-0.5">
                    {product.name}
                </h4>

                {showBestUI && soldCount && (
                    <p className="text-[9px] text-gray-400 mb-1">Terjual {soldCount}</p>
                )}

                <div className="flex items-center justify-between gap-1.5 mt-1.5">
                    <div>
                        <span className="text-xs font-bold text-gray-900">{fmtIDR(nowPrice, minor)}</span>
                        {showDiscountUI && (
                            <span className="text-[9px] line-through text-gray-400 ml-1">{fmtIDR(regularPrice, minor)}</span>
                        )}
                    </div>
                    {getStockBadge()}
                </div>
            </div>

            <a className="absolute inset-0 z-10" href={buildProductUrl()} aria-label={`Buka ${product.name}`} />
        </article>
    );
}

export default ProductCard;