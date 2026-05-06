import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const FunnelContext = createContext();

export const useFunnelContext = () => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnelContext must be used within FunnelProvider');
  }
  return context;
};

export const FunnelProvider = ({ children }) => {
  const [currentPanel, setCurrentPanel] = useState('hero');
  const [filters, setFilters] = useState({
    min_price: null,
    max_price: null,
    brand_slug: null,
    tags: [],
    category_slugs: []
  });
  const [mode, setMode] = useState(null);
  const [path, setPath] = useState([]);
  const [categoryLabel, setCategoryLabel] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [tabStates, setTabStates] = useState({
    bestseller: { filters: null, products: [] },
    promo: { filters: null, products: [] },
    new: { filters: null, products: [] },
    price: { filters: null, products: [] },
    brand: { filters: null, products: [] },
    interest: { filters: null, products: [] },
    category: { filters: null, products: [] },
    az: { filters: null, products: [] }
  });

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      min_price: null,
      max_price: null,
      brand_slug: null,
      tags: [],
      category_slugs: []
    });
    setMode(null);
    setCategoryLabel(null);
    setProducts([]);
  }, []);

  const saveTabState = useCallback((tabName) => {
    setTabStates(prev => ({
      ...prev,
      [tabName]: {
        filters: { ...filters },
        products: [...products],
        mode: mode,
        categoryLabel: categoryLabel
      }
    }));
  }, [filters, products, mode, categoryLabel]);

  const loadTabState = useCallback((tabName) => {
    const savedState = tabStates[tabName];
    if (savedState && savedState.filters) {
      setFilters(savedState.filters);
      setProducts(savedState.products);
      setMode(savedState.mode);
      setCategoryLabel(savedState.categoryLabel);
      return true;
    }
    return false;
  }, [tabStates, setFilters, setProducts, setMode, setCategoryLabel]);

  const value = {
    currentPanel,
    setCurrentPanel,
    filters,
    setFilters: updateFilters,
    resetFilters,
    mode,
    setMode,
    path,
    setPath,
    categoryLabel,
    setCategoryLabel,
    products,
    setProducts,
    loading,
    setLoading,
    tabStates,
    saveTabState,
    loadTabState
  };

  return (
    <FunnelContext.Provider value={value}>
      {children}
    </FunnelContext.Provider>
  );
};