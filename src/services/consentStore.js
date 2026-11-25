import { supabase } from "./supabase";

const STORAGE_KEY = "solit03_cookie_consent";
const VISITOR_KEY = "solit03_visitor_id";

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export async function saveConsent({ action, analytics, marketing }) {
  const consent = {
    action,
    necessary: true,
    analytics: !!analytics,
    marketing: !!marketing,
    decided_at: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));

  try {
    await supabase.from("cookie_consents").insert([
      {
        visitor_id: getVisitorId(),
        action,
        necessary: true,
        analytics: !!analytics,
        marketing: !!marketing,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent,
      },
    ]);
  } catch (e) {
    console.error("Gagal mencatat cookie consent:", e);
  }

  return consent;
}

export function clearStoredConsent() {
  localStorage.removeItem(STORAGE_KEY);
}
