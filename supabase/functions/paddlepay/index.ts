// Vibzo · paiement par carte (Visa, Mastercard) et Google Pay via Paddle — validation 100 % automatique.
// Paddle verse l'argent sur le compte bancaire indiqué dans Paddle (Azerbaïdjan).
// Actions :
//   POST {action:'config'} → { token, env } (jeton client Paddle.js, public)
//   POST {action:'init', kind:'coins'|'gold'|'seller'|'challenge', qty, ref?, auto?, return_url} (connecté) → { url, id }
//        auto=true + gold/seller + qty=1 → abonnement mensuel renouvelé automatiquement
//   POST {action:'verify', id} → { status }
//   POST {action:'portal'} (connecté) → { url } espace client Paddle (changer de carte, annuler)
//   Webhook Paddle (en-tête Paddle-Signature) : transaction.completed, subscription.* → crédite / met à jour
// Secrets (Supabase > Edge Functions > Secrets) :
//   PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, PADDLE_CLIENT_TOKEN, PADDLE_ENV ('production' par défaut, ou 'sandbox')
//   PADDLE_FX (FCFA pour 1 €, défaut 655.957), PADDLE_FX_AZN (₼ pour 1 €, défaut 1.95)
import { createClient } from 'jsr:@supabase/supabase-js@2';

const E = (k: string, d = '') => Deno.env.get(k) ?? d;
const KEY = E('PADDLE_API_KEY'), WH = E('PADDLE_WEBHOOK_SECRET'), CTOK = E('PADDLE_CLIENT_TOKEN'), ENV = E('PADDLE_ENV', 'production');
const API = ENV === 'sandbox' ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
const FX = Number(E('PADDLE_FX', '655.957')), FX_AZN = Number(E('PADDLE_FX_AZN', '1.95'));
const sb = createClient(E('SUPABASE_URL'), E('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const ALLOWED_RETURN = /^https:\/\/(vibzo\.fun|www\.vibzo\.fun|kamtachristianfokou-wq\.github\.io)(\/|$)/;
const cents = (amount: number, cur: string) => Math.max(70, Math.ceil(amount / (cur === 'AZN' ? FX_AZN : FX) * 100));
const PD = (path: string, init: RequestInit = {}) => fetch(API + path, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` } });
const isId = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

async function hmacHex(secret: string, body: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(body)))].map(b => b.toString(16).padStart(2, '0')).join('');
}
function same(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
async function signed(raw: string, header: string) {
  const parts = Object.fromEntries(header.split(';').map(p => p.split('=') as [string, string]));
  const ts = Number(parts.ts); if (!ts || Math.abs(Date.now() / 1000 - ts) > 600) return false;
  return same(await hmacHex(WH, `${parts.ts}:${raw}`), String(parts.h1 ?? ''));
}
async function userOf(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data } = await sb.auth.getUser(token); return data?.user ?? null;
}

async function webhook(raw: string) {
  const ev = JSON.parse(raw), type = String(ev?.event_type ?? ''), d = ev?.data ?? {}, cd = d.custom_data ?? {};
  if (type === 'transaction.completed' || type === 'transaction.paid') {
    const sub = String(d.subscription_id ?? '');
    if (d.origin === 'subscription_recurring' && sub) {
      // renouvellement automatique : +1 mois
      const { data: s } = await sb.from('card_subscriptions').select('user_id,plan').eq('id', sub).maybeSingle();
      const uid = s?.user_id ?? cd.user_id, plan = s?.plan ?? cd.plan;
      if (!isId(String(uid)) || !['gold', 'seller'].includes(String(plan))) return { ignored: true };
      const { data: amount } = await sb.rpc('payment_quote', { p_kind: plan, p_qty: 1 });
      const { data: pay, error } = await sb.from('payments').insert({ user_id: uid, kind: plan, qty: 1, amount: amount ?? 1, currency: 'XAF', provider: 'paddle', provider_ref: String(d.id) }).select().single();
      if (error) return { ok: true, dup: true };
      await sb.rpc('payment_complete', { p_id: pay.id }); return { ok: true };
    }
    const id = String(cd.payment_id ?? ''); if (!isId(id)) return { ignored: true };
    const { data: p } = await sb.from('payments').select('*').eq('id', id).maybeSingle();
    if (!p || p.status !== 'pending') return { ok: true };
    const paid = Number(d?.details?.totals?.subtotal ?? d?.details?.totals?.total ?? 0);
    if (paid < cents(p.amount, p.currency) - 1) return { error: 'montant' };
    await sb.from('payments').update({ provider_ref: String(d.id) }).eq('id', id);
    await sb.rpc('payment_complete', { p_id: id });
    return { ok: true };
  }
  if (type.startsWith('subscription.')) {
    const uid = String(cd.user_id ?? ''), plan = String(cd.plan ?? '');
    if (!isId(uid) || !['gold', 'seller'].includes(plan)) return { ignored: true };
    await sb.from('card_subscriptions').upsert({ id: String(d.id), user_id: uid, plan, status: String(d.status ?? ''), renews_at: d.next_billed_at ?? null, ends_at: d.canceled_at ?? d?.scheduled_change?.effective_at ?? null, customer_id: d.customer_id ?? null, updated_at: new Date().toISOString() });
    return { ok: true };
  }
  return { ignored: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const raw = await req.text(), sig = req.headers.get('Paddle-Signature');
  try {
    if (sig) {
      if (!WH || !(await signed(raw, sig))) return json({ error: 'signature' }, 401);
      return json(await webhook(raw));
    }
    const body = JSON.parse(raw || '{}');
    if (body.action === 'config') return CTOK ? json({ token: CTOK, env: ENV }) : json({ error: 'not_configured' }, 503);
    if (!KEY || !WH || !CTOK) return json({ error: 'not_configured' }, 503);
    if (body.action === 'verify') {
      const id = String(body.id ?? ''); if (!isId(id)) return json({ error: 'id invalide' }, 400);
      const { data: p } = await sb.from('payments').select('status,kind,qty').eq('id', id).maybeSingle();
      return json(p ? { status: p.status, kind: p.kind, qty: p.qty } : { status: 'unknown' });
    }
    const user = await userOf(req); if (!user) return json({ error: 'Connecte-toi d’abord' }, 401);
    if (body.action === 'portal') {
      const { data: s } = await sb.from('card_subscriptions').select('customer_id').eq('user_id', user.id).not('customer_id', 'is', null).order('updated_at', { ascending: false }).limit(1).maybeSingle();
      if (!s?.customer_id) return json({ error: 'Aucun abonnement par carte' }, 404);
      const r = await PD(`/customers/${encodeURIComponent(s.customer_id)}/portal-sessions`, { method: 'POST', body: '{}' });
      const d = await r.json().catch(() => ({}));
      const url = d?.data?.urls?.general?.overview; return url ? json({ url }) : json({ error: 'Indisponible' }, 502);
    }
    if (body.action !== 'init') return json({ error: 'action' }, 400);
    const kind = String(body.kind), qty = kind === 'challenge' ? 1 : Number(body.qty), ref = String(body.ref ?? '');
    let amount = 0, currency = 'XAF';
    if (kind === 'challenge') {
      if (!isId(ref)) return json({ error: 'Défi inconnu' }, 400);
      const { data: q } = await sb.rpc('challenge_quote', { p_id: ref, p_user: user.id });
      const row = Array.isArray(q) ? q[0] : q; if (!row) return json({ error: 'Défi introuvable ou déjà payé' }, 400);
      amount = row.amount; currency = row.currency;
    } else {
      const { data: a } = await sb.rpc('payment_quote', { p_kind: kind, p_qty: qty }); if (!a) return json({ error: 'Offre inconnue' }, 400); amount = a;
    }
    const sub = !!body.auto && qty === 1 && (kind === 'gold' || kind === 'seller');
    const { data: pay, error } = await sb.from('payments').insert({ user_id: user.id, kind, qty, amount, currency, provider: 'paddle', ref_id: kind === 'challenge' ? ref : null }).select().single();
    if (error) return json({ error: error.message }, 400);
    const back = ALLOWED_RETURN.test(String(body.return_url ?? '')) ? String(body.return_url).split(/[?#]/)[0] : 'https://vibzo.fun/';
    const label = kind === 'coins' ? `${qty} pièces Vibzo` : kind === 'gold' ? (sub ? 'Vibzo Gold · mensuel' : `Vibzo Gold · ${qty} mois`) : kind === 'seller' ? (sub ? 'Vendeur Vibzo · mensuel' : `Vendeur Vibzo · ${qty} mois`) : 'Défi sponsorisé Vibzo';
    const price: Record<string, unknown> = { description: label, name: label, unit_price: { amount: String(cents(amount, currency)), currency_code: 'EUR' }, product: { name: label, tax_category: 'standard' } };
    if (sub) price.billing_cycle = { interval: 'month', frequency: 1 };
    const r = await PD('/transactions', { method: 'POST', body: JSON.stringify({
      items: [{ quantity: 1, price }],
      custom_data: { payment_id: pay.id, user_id: user.id, plan: sub ? kind : '', back },
    }) });
    const d = await r.json().catch(() => ({}));
    const txn = d?.data?.id;
    if (!r.ok || !txn) { await sb.from('payments').update({ status: 'failed' }).eq('id', pay.id); return json({ error: d?.error?.detail || 'Paiement par carte indisponible' }, 502); }
    const url = `https://vibzo.fun/paiement.html?_ptxn=${encodeURIComponent(txn)}&pid=${pay.id}&back=${encodeURIComponent(back)}${user.email ? '&email=' + encodeURIComponent(user.email) : ''}`;
    return json({ url, id: pay.id });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
