const API_BASE = '/wp-json/wc/store/v1';
const STOCK_API = '/wp-json/solit/v1/stock';

const PER_PAGE = 100;

let MINOR = 0;
let SCALE = 1;

export const initCurrency = async () => {
  try {
    const response = await fetch(`${API_BASE}/products/collection-data?calculate_price_range=true&_cb=${Date.now()}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    MINOR = (data && data.price_range && data.price_range.currency_minor_unit) || 0;
    SCALE = Math.pow(10, MINOR);
    console.log('Currency initialized:', { MINOR, SCALE });
  } catch (error) {
    console.error('Failed to init currency:', error);
    MINOR = 0;
    SCALE = 1;
  }
};


export const fmtIDR = (minorVal, minor = MINOR) => {
  return (Number(minorVal || 0) / (10 ** minor)).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  });
};

export const fetchProducts = async (params, signal) => {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(val => qp.append(key, val));
    } else if (value !== null && value !== undefined) {
      qp.append(key, value);
    }
  });
  qp.append('_cb', Date.now());
  
  const url = `${API_BASE}/products?${qp.toString()}`;
  
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal 
  });
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

export const fetchBrands = async () => {
  const url = `${API_BASE}/products/brands?_cb=${Date.now()}`;
  console.log('Fetching brands from:', url);
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  return response.json();
};

export const fetchStockQuantities = async (ids) => {
  const stockMap = {};
  const uniqueIds = [...new Set(ids)];
  
  for (let i = 0; i < uniqueIds.length; i += 100) {
    const chunk = uniqueIds.slice(i, i + 100);
    const qs = new URLSearchParams({ ids: chunk.join(',') });
    const url = `${STOCK_API}?${qs.toString()}`;
    console.log('Fetching stock from:', url);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });
    
    if (response.ok) {
      const json = await response.json();
      (json?.data || []).forEach(row => {
        stockMap[row.id] = row;
      });
    }
  }
  
  return stockMap;
};

export const resolveTagIdsBySlugs = async (slugs) => {
  const out = new Set();
  const qs = new URLSearchParams();
  slugs.forEach(s => qs.append('slug', s));
  
  // Try WooCommerce API first
  try {
    const url = `${API_BASE}/products/tags?${qs.toString()}&_cb=${Date.now()}`;
    console.log('Fetching tags from:', url);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });
    if (response.ok) {
      const rows = await response.json();
      rows.forEach(t => {
        if (slugs.includes(t.slug)) out.add(t.id);
      });
    }
  } catch (error) {
    console.error('Failed to resolve tags from WC API:', error);
  }
  
  if (out.size === 0) {
    try {
      const url = `https://solit03.com/wp-json/wp/v2/product_tag?${qs.toString()}&_cb=${Date.now()}`;
      console.log('Fetching tags from WP API:', url);
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });
      if (response.ok) {
        const rows = await response.json();
        rows.forEach(t => {
          if (slugs.includes(t.slug)) out.add(t.id);
        });
      }
    } catch (error) {
      console.error('Failed to resolve tags from WP API:', error);
    }
  }
  
  return [...out];
};

export const activeProductParams = (filters, extraParams = {}) => {
  const params = {
    per_page: extraParams.per_page ?? PER_PAGE,
    stock_status: 'instock',
    orderby: extraParams.orderby ?? 'price',
    order: extraParams.order ?? 'asc'
  };

  if (filters.min_price !== null) params.min_price = Math.round(filters.min_price * SCALE);
  if (filters.max_price !== null) params.max_price = Math.round(filters.max_price * SCALE);
  if (filters.brand_slug) params.brand = filters.brand_slug;
  if (filters.category_slugs?.length) params.category = filters.category_slugs;

  let tags = [...(filters.tags || [])];
  if (extraParams.tag) {
    if (Array.isArray(extraParams.tag)) {
      tags.push(...extraParams.tag);
    } else {
      tags.push(extraParams.tag);
    }
  }

  // Guard untuk laptop
  const isBrandOrPriceContext = !!filters.brand_slug || (filters.min_price !== null || filters.max_price !== null);
  const LAPTOP_TAG = 'laptop';
  if (isBrandOrPriceContext && !(filters.category_slugs?.length)) {
    if (!tags.includes(LAPTOP_TAG)) tags.push(LAPTOP_TAG);
  }

  if (tags.length) params.tag = [...new Set(tags)];
  if (extraParams.on_sale) params.on_sale = true;
  if (extraParams.page) params.page = extraParams.page;
  
  return params;
};