import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yobgxhgmujzxsabqlpvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYmd4aGdtdWp6eHNhYnFscHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTkwOTUsImV4cCI6MjA5MzU5NTA5NX0.aHfRzPvn8n2zp9XASUxX46CHdR3vENGFPV4d9mFxzLQ";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);