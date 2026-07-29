import { supabase } from "../../services/supabase";

export async function getCookieConsentStats() {
  const { data, error } = await supabase
    .from("cookie_consents")
    .select("action, analytics, marketing, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows = data || [];
  const total = rows.length;
  const acceptAll = rows.filter((r) => r.action === "accept_all").length;
  const rejectAll = rows.filter((r) => r.action === "reject_all").length;
  const custom = rows.filter((r) => r.action === "custom").length;
  const analyticsOptIn = rows.filter((r) => r.analytics).length;
  const marketingOptIn = rows.filter((r) => r.marketing).length;

  // Tren 7 hari terakhir
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const trend = days.map((day) => ({
    day,
    count: rows.filter((r) => r.created_at?.slice(0, 10) === day).length,
  }));

  return {
    total,
    acceptAll,
    rejectAll,
    custom,
    analyticsOptIn,
    marketingOptIn,
    trend,
  };
}

export async function getCookieConsentLog({ page = 1, limit = 10 } = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("cookie_consents")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;

  return { data: data || [], total: count || 0 };
}
