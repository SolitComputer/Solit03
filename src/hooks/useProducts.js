// hooks/useProducts.js
import { useState, useCallback, useRef } from 'react';
import { useFunnelContext } from '../context/FunnelContext';
import { fetchProducts, activeProductParams, resolveTagIdsBySlugs } from '../services/api';

const BEST_TAG = 'best-seller';
const TAG_CANDIDATES = {
    promo: ['promo-hari-ini', 'promo', 'promo-today'],
    new: ['new', 'new-stock', 'stok-terbaru', 'stok-baru', 'baru']
};

// Cache system
const productsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export const useProducts = () => {
    const { filters, setFilters, setMode, setCurrentPanel, setCategoryLabel, setProducts, setLoading } = useFunnelContext();
    const abortControllerRef = useRef(null);

    const getCacheKey = (params) => {
        return JSON.stringify(params);
    };

    const fetchWithCache = async (params, forceRefresh = false) => {
        const cacheKey = getCacheKey(params);
        const cached = productsCache.get(cacheKey);

        if (!forceRefresh && cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            console.log('✅ Using cached data');
            return cached.data;
        }

        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            const data = await fetchProducts(params, abortControllerRef.current.signal);
            productsCache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            return data;
        } catch (error) {
            if (error.name !== 'AbortError') {
                throw error;
            }
            return [];
        }
    };

    const fetchProductsByFilters = useCallback(async (extraParams = {}, forceRefresh = false) => {
        setLoading(true);
        try {
            const params = activeProductParams(filters, extraParams);
            const data = await fetchWithCache(params, forceRefresh);
            // Sort by price
            const sorted = [...data].sort((a, b) =>
                (Number(a?.prices?.price || 0) - Number(b?.prices?.price || 0))
            );
            setProducts(sorted);
            return sorted;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, [filters, setProducts, setLoading]);

    const openBestSeller = useCallback(async (push = true) => {
        setFilters({
            min_price: null,
            max_price: null,
            brand_slug: null,
            tags: [],
            category_slugs: []
        });
        setMode('bestseller');
        setCategoryLabel(null);
        setCurrentPanel('products');
        await fetchProductsByFilters({ tag: BEST_TAG, orderby: 'price', order: 'asc' }, true);
    }, [setFilters, setMode, setCurrentPanel, setCategoryLabel, fetchProductsByFilters]);

    const openPromoToday = useCallback(async (forceRefresh = false) => {
        setFilters({
            min_price: null,
            max_price: null,
            brand_slug: null,
            tags: [],
            category_slugs: []
        });
        setMode('promo');
        setCategoryLabel(null);
        setCurrentPanel('products');

        try {
            const tagIds = await resolveTagIdsBySlugs(TAG_CANDIDATES.promo);
            let rows = [];
            if (tagIds.length) {
                rows = await fetchProducts(activeProductParams(filters, { tag: tagIds, orderby: 'price', order: 'asc' }));
            }
            if (!rows.length) {
                rows = await fetchProducts(activeProductParams(filters, { on_sale: true, orderby: 'price', order: 'asc' }));
            }
            const sorted = [...rows].sort((a, b) =>
                (Number(a?.prices?.price || 0) - Number(b?.prices?.price || 0))
            );
            setProducts(sorted);
            return sorted;
        } catch (error) {
            console.error('Failed to fetch promo products:', error);
            setProducts([]);
            return [];
        }
    }, [setFilters, setMode, setCurrentPanel, setCategoryLabel, filters, setProducts]);

    const openNewStock = useCallback(async () => {
        setFilters({
            min_price: null,
            max_price: null,
            brand_slug: null,
            tags: [],
            category_slugs: []
        });
        setMode('new');
        setCategoryLabel(null);
        setCurrentPanel('products');

        try {
            const tagIds = await resolveTagIdsBySlugs(TAG_CANDIDATES.new);
            let rows = [];

            if (tagIds.length) {
                try {
                    rows = await fetchProducts(activeProductParams(filters, { orderby: 'modified', order: 'desc', per_page: 100, tag: tagIds }));
                } catch {
                    rows = await fetchProducts(activeProductParams(filters, { orderby: 'date', order: 'desc', per_page: 100, tag: tagIds }));
                }
            }

            if (!rows.length) {
                try {
                    rows = await fetchProducts(activeProductParams(filters, { orderby: 'modified', order: 'desc', per_page: 100 }));
                } catch {
                    rows = await fetchProducts(activeProductParams(filters, { orderby: 'date', order: 'desc', per_page: 100 }));
                }
            }

            setProducts(rows);
        } catch (error) {
            console.error('Failed to fetch new stock:', error);
            setProducts([]);
        }
    }, [setFilters, setMode, setCurrentPanel, setCategoryLabel, filters, setProducts]);

    const openAllProductsAZ = useCallback(async () => {
        setFilters({
            min_price: null,
            max_price: null,
            brand_slug: null,
            tags: [],
            category_slugs: []
        });
        setMode('az');
        setCategoryLabel(null);
        setCurrentPanel('products');

        try {
            const perPage = 100;
            let page = 1;
            let allProducts = [];

            while (page <= 10) {
                const batch = await fetchProducts(activeProductParams(filters, { orderby: 'title', order: 'asc', per_page: perPage, page }));
                allProducts = [...allProducts, ...batch];
                if (batch.length < perPage) break;
                page++;
            }

            allProducts.sort((a, b) => a.name?.localeCompare(b.name || '', 'id', { sensitivity: 'base' }));
            setProducts(allProducts);
        } catch (error) {
            console.error('Failed to fetch all products:', error);
            setProducts([]);
        }
    }, [setFilters, setMode, setCurrentPanel, setCategoryLabel, filters, setProducts]);

    return {
        fetchProductsByFilters,
        openBestSeller,
        openPromoToday,
        openNewStock,
        openAllProductsAZ
    };
};