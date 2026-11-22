// Vibzo · paiement par carte (Visa, Mastercard) et Google Pay via Lemon Squeezy
// L'argent est versé par Lemon Squeezy sur le compte bancaire choisi dans Lemon Squeezy (Azerbaïdjan accepté).
// Actions :
//   POST {action:'init', kind:'coins'|'gold'|'seller', qty, return_url}  (utilisateur connecté) → { url, id }
//   POST {action:'verify', id}                                                                  → { status }
//   POST webhook Lemon Squeezy (signé X-Signature)                                              → crédite
// Secrets (Supabase > Edge Functions > Secrets) :
//   LS_API_KEY, LS_STORE_ID, LS_VARIANT_ID (un produit « Achat Vibzo » à prix libre), LS_WEBHOOK_SECRET
//   LS_FX (facultatif) : nombre de FCFA pour 1 unité de la devise de la boutique (défaut 655.957 = 1 EUR)
import { createClient } from 'jsr:@supabase/supabase-js@2';

const KEY = Deno.env.get('LS_API_KEY') ?? '', STORE = Deno.env.get('LS_STORE_ID') ?? '', VARIANT = Deno.env.get('LS_VARIANT_ID') ?? '';
const WH = Deno.env.get('LS_WEBHOOK_SECRET') ?? '', FX = Number(Deno.env.get('LS_FX') ?? '655.957');
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const ALLOWED_RETURN = /^https:\/\/(vibzo\.fun|www\.vibzo\.fun|kamtachristianfokou-wq\.github\.io)(\/|$)/;
const cents = (fcfa: number) => Math.ceil(fcfa / FX * 100);

async function hmacHex(secret: string, body: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function same(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!KEY || !STORE || !VARIANT || !WH) return json({ error: 'not_configured' }, 503);
  const raw = await req.text();
  const sig = req.headers.get('X-Signature');
  try {
    if (sig) {
      // Webhook Lemon Squeezy
      if (!same(await hmacHex(WH, raw), sig)) return json({ error: 'signature' }, 401);
      const ev = JSON.parse(raw);
      if (ev?.meta?.event_name !== 'order_created') return json({ ok: true, ignored: true });
      const id = String(ev?.meta?.custom_data?.payment_id ?? '');
      const a = ev?.data?.attributes ?? {};
      if (!/^[0-9a-f-]{36}$/i.test(id) || a.status !== 'paid') return json({ ok: true, ignored: true });
      const { data: p } = await sb.from('payments').select('*').eq('id', id).maybeSingle();
      if (!p || p.status !== 'pending') return json({ ok: true });
      if (Number(a.total) < cents(p.amount)) return json({ error: 'montant' }, 400);
      await sb.from('payments').update({ provider_ref: String(ev.data.id) }).eq('id', id);
      const { error } = await sb.rpc('payment_complete', { p_id: id });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }
    const body = JSON.parse(raw || '{}');
    if (body.action === 'verify') {
      const id = String(body.id ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'id invalide' }, 400);
      const { data: p } = await sb.from('payments').select('status,kind,qty').eq('id', id).maybeSingle();
      return json(p ? { status: p.status, kind: p.kind, qty: p.qty } : { status: 'unknown' });
    }
    if (body.action !== 'init') return json({ error: 'action' }, 400);
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data: ud } = await sb.auth.getUser(token);
    const user = ud?.user; if (!user) return json({ error: 'Connecte-toi d’abord' }, 401);
    const kind = String(body.kind), qty = Number(body.qty);
    const { data: amount } = await sb.rpc('payment_quote', { p_kind: kind, p_qty: qty });
    if (!amount) return json({ error: 'Offre inconnue' }, 400);
    const { data: pay, error } = await sb.from('payments').insert({ user_id: user.id, kind, qty, amount, currency: 'XAF', provider: 'lemonsqueezy' }).select().single();
    if (error) return json({ error: error.message }, 400);
    const back = ALLOWED_RETURN.test(String(body.return_url ?? '')) ? String(body.return_url).split(/[?#]/)[0] : 'https://vibzo.fun/';
    const label = kind === 'coins' ? `${qty} pièces Vibzo` : kind === 'gold' ? `Vibzo Gold · ${qty} mois` : `Boutique Vibzo · ${qty} mois`;
    const r = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: { Accept: 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ data: { type: 'checkouts', attributes: {
        custom_price: cents(amount),
        product_options: { name: label, redirect_url: `${back}?cpay=${pay.id}`, enabled_variants: [Number(VARIANT)] },
        checkout_data: { email: user.email ?? undefined, custom: { payment_id: pay.id } },
        expires_at: new Date(Date.now() + 3600e3).toISOString(),
      }, relationships: { store: { data: { type: 'stores', id: String(STORE) } }, variant: { data: { type: 'variants', id: String(VARIANT) } } } } }),
    });
    const d = await r.json().catch(() => ({}));
    const url = d?.data?.attributes?.url;
    if (!r.ok || !url) { await sb.from('payments').update({ status: 'failed' }).eq('id', pay.id); return json({ error: 'Paiement par carte indisponible' }, 502); }
    return json({ url, id: pay.id });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
