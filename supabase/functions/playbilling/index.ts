// Vibzo · achats dans l'appli Android (Google Play Billing, via Digital Goods API)
// POST {sku, token} (utilisateur connecté) → vérifie l'achat auprès de Google, crédite, puis le consomme.
// Secret : GOOGLE_SA_JSON = clé JSON d'un compte de service Google Cloud ayant accès à la Play Console
// (Play Console > Utilisateurs et autorisations > inviter l'e-mail du compte de service, droit « Gérer les commandes »).
import { createClient } from 'jsr:@supabase/supabase-js@2';

const PKG = 'fun.vibzo.app';
const SA = Deno.env.get('GOOGLE_SA_JSON') ?? '';
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
// produit Play (consommable) → (type, quantité)
const SKUS: Record<string, [string, number]> = {
  coins_100: ['coins', 100], coins_500: ['coins', 500], coins_1050: ['coins', 1050], coins_5500: ['coins', 5500],
  gold_1: ['gold', 1], gold_3: ['gold', 3], gold_12: ['gold', 12], seller_1: ['seller', 1], seller_3: ['seller', 3], seller_12: ['seller', 12],
};
const b64u = (b: Uint8Array | string) => btoa(typeof b === 'string' ? b : String.fromCharCode(...b)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
async function accessToken() {
  const sa = JSON.parse(SA), now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/androidpublisher', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const pem = String(sa.private_key).replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${claim}`)));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${b64u(sig)}` }) });
  const d = await r.json(); if (!d.access_token) throw new Error('Google : authentification impossible'); return d.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!SA) return json({ error: 'not_configured' }, 503);
  try {
    const tok = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data: ud } = await sb.auth.getUser(tok); const user = ud?.user;
    if (!user) return json({ error: 'Connecte-toi d’abord' }, 401);
    const { sku, token } = await req.json().catch(() => ({}));
    const def = SKUS[String(sku)]; if (!def || !token || String(token).length > 400) return json({ error: 'Achat inconnu' }, 400);
    const { data: dup } = await sb.from('payments').select('id,status,user_id').eq('provider', 'google_play').eq('provider_ref', String(token)).maybeSingle();
    if (dup) return json(dup.user_id === user.id ? { status: dup.status, kind: def[0], qty: def[1] } : { error: 'Achat déjà utilisé' }, dup.user_id === user.id ? 200 : 409);
    const at = await accessToken();
    const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PKG}/purchases/products/${encodeURIComponent(sku)}/tokens/${encodeURIComponent(token)}`;
    const g = await (await fetch(base, { headers: { Authorization: `Bearer ${at}` } })).json();
    if (g.purchaseState !== 0) return json({ status: 'pending' });
    const { data: amount } = await sb.rpc('payment_quote', { p_kind: def[0], p_qty: def[1] });
    const { data: pay, error } = await sb.from('payments').insert({ user_id: user.id, kind: def[0], qty: def[1], amount: amount ?? 0, currency: 'XAF', provider: 'google_play', provider_ref: String(token) }).select().single();
    if (error) return json({ error: error.message }, 400);
    const { data: done, error: e2 } = await sb.rpc('payment_complete', { p_id: pay.id });
    if (e2) return json({ error: e2.message }, 500);
    await fetch(`${base}:consume`, { method: 'POST', headers: { Authorization: `Bearer ${at}` } }).catch(() => {});
    return json({ status: 'complete', kind: def[0], qty: def[1], until: done?.until ?? null });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
