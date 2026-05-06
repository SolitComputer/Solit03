import { useState, useEffect } from 'react';

const STORAGE_KEY = 'solit03_tx_counter_v1';
const BASE_COUNT = 100000;
const RATE = 0.2; // +1 every 5 seconds

export const useCounter = () => {
  const [count, setCount] = useState(BASE_COUNT);
  const [formattedCount, setFormattedCount] = useState('');

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num) + ' +';
  };

  useEffect(() => {
    // Load initial data from localStorage
    let data = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        data = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load counter from storage:', e);
    }

    if (!data) {
      data = { c: BASE_COUNT, t: Date.now() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
    }

    setCount(data.c);
    setFormattedCount(formatNumber(data.c));

    // Update counter periodically
    const updateCounter = () => {
      let currentData = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          currentData = JSON.parse(stored);
        }
      } catch (e) {}

      if (!currentData) {
        currentData = { c: BASE_COUNT, t: Date.now() };
      }

      const now = Date.now();
      const seconds = Math.max(0, (now - (currentData.t || now)) / 1000);
      const steps = Math.floor(seconds * RATE);

      if (steps > 0) {
        currentData.c += steps;
        currentData.t = now;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        } catch (e) {}
        setCount(currentData.c);
        setFormattedCount(formatNumber(currentData.c));
      }
    };

    const interval = setInterval(updateCounter, 1000);
    updateCounter();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateCounter();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle storage events for cross-tab sync
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          if (newData && typeof newData.c === 'number' && newData.c > count) {
            setCount(newData.c);
            setFormattedCount(formatNumber(newData.c));
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [count]);

  return { count, formattedCount };
};