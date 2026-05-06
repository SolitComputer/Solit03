const FUNNEL_STATE_KEY = 'solit03_funnel_state_v2_categories';

export const saveFunnelState = (state) => {
  try {
    sessionStorage.setItem(FUNNEL_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save funnel state:', error);
  }
};

export const loadFunnelState = () => {
  try {
    const raw = sessionStorage.getItem(FUNNEL_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load funnel state:', error);
    return null;
  }
};

export const clearFunnelState = () => {
  try {
    sessionStorage.removeItem(FUNNEL_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear funnel state:', error);
  }
};

export const saveCounterData = (data) => {
  try {
    localStorage.setItem('solit03_tx_counter_v1', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save counter data:', error);
  }
};

export const loadCounterData = () => {
  try {
    const raw = localStorage.getItem('solit03_tx_counter_v1');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load counter data:', error);
    return null;
  }
};