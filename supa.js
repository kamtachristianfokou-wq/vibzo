// Connexion à Supabase (ou à un faux serveur pendant les tests automatiques)
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const isConfigured = () =>
  !!window.__VIBZO_FAKE__ || (/^https:\/\/.+\.supabase\.co/.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 30);

export async function getClient() {
  if (window.__VIBZO_FAKE__) return window.__VIBZO_FAKE__;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
  });
}
