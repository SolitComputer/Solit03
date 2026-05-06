import { useState, useCallback } from 'react';
import { fetchStockQuantities } from '../services/api';

export const useStock = () => {
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStock = useCallback(async (productIds) => {
    if (!productIds || productIds.length === 0) return;
    
    setLoading(true);
    try {
      const stock = await fetchStockQuantities(productIds);
      setStockMap(prev => ({ ...prev, ...stock }));
    } catch (error) {
      console.error('Failed to fetch stock:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearStock = useCallback(() => {
    setStockMap({});
  }, []);

  return {
    stockMap,
    loading,
    fetchStock,
    clearStock
  };
};