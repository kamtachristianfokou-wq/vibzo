// Vibzo · paiement par carte (Visa, Mastercard) et Google Pay via Lemon Squeezy — tout est validé automatiquement.
// L'argent est versé par Lemon Squeezy sur le compte bancaire choisi dans Lemon Squeezy (Azerbaïdjan accepté).
// Actions :
//   POST {action:'init', kind:'coins'|'gold'|'seller'|'challenge', qty, ref?, auto?, return_url} (connecté) → { url, id }
//        auto=true + kind gold/seller + qty=1 → abonnement mensuel renouvelé automatiquement
//   POST {action:'verify', id} → { status }
//   POST {action:'portal', plan} (connecté) → { url } page Lemon Squeezy pour changer de carte ou annuler
//   POST webhook Lemon Squeezy (signé X-Signature) : order_created, subscription_* → crédite / met à jour
// Secrets : LS_API_KEY, LS_STORE_ID, LS_VARIANT_ID (produit « Achat Vibzo », paiement unique),
//           LS_WEBHOOK_SECRET, LS_VARIANT_GOLD et LS_VARIANT_SELLER (abonnements mensuels, facultatifs),
//           LS_FX (FCFA pour 1 unité de la devise de la boutique, défaut 655.957 = 1 EUR),
//           LS_FX_AZN (₼ pour 1 unité de la devise de la boutique, défaut 1.95)
import { createClient } from 'jsr:@supabase/supabase-js@2';

const E = (k: string, d = '') => Deno.env.get(k) ?? d;
const KEY = E('LS_API_KEY'), STORE = E('LS_STORE_ID'), VARIANT = E('LS_VARIANT_ID'), WH = E('LS_WEBHOOK_SECRET');
const SUBV: Record<string, string> = { gold: E('LS_VARIANT_GOLD'), seller: E('LS_VARIANT_SELLER') };
const FX = Number(E('LS_FX', '655.957')), FX_AZN = Number(E('LS_FX_AZN', '1.95'));
const sb = createClient(E('SUPABASE_URL'), E('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const ALLOWED_RETURN = /^https:\/\/(vibzo\.fun|www\.vibzo\.fun|kamtachristianfokou-wq\.github\.io)(\/|$)/;
const cents = (amount: number, cur: string) => Math.ceil(amount / (cur === 'AZN' ? FX_AZN : FX) * 100);
const LS = (path: string, init: RequestInit = {}) => fetch('https://api.lemonsqueezy.com/v1' + path, { ...init, headers: { Accept: 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${KEY}` } });

async function hmacHex(secret: string, body: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(body)))].map(b => b.toString(16).padStart(2, '0')).join('');
}
function same(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
async function userOf(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data } = await sb.auth.getUser(token); return data?.user ?? null;
}
async function complete(id: string, ref: string) {
  const { data: p } = await sb.from('payments').select('*').eq('id', id).maybeSingle();
  if (!p || p.status !== 'pending') return;
  await sb.from('payments').update({ provider_ref: ref }).eq('id', id);
  await sb.rpc('payment_complete', { p_id: id });
}

async function webhook(raw: string) {
  const ev = JSON.parse(raw), name = String(ev?.meta?.event_name ?? ''), custom = ev?.meta?.custom_data ?? {};
  const a = ev?.data?.attributes ?? {}, oid = String(ev?.data?.id ?? '');
  if (name === 'order_created') {
    const id = String(custom.payment_id ?? '');
    if (!/^[0-9a-f-]{36}$/i.test(id) || a.status !== 'paid') return { ignored: true };
    const { data: p } = await sb.from('payments').select('amount,currency').eq('id', id).maybeSingle();
    if (!p || Number(a.total) < cents(p.amount, p.currency)) return { error: 'montant' };
    await complete(id, 'order_' + oid); return { ok: true };
  }
  const uid = String(custom.user_id ?? ''), plan = String(custom.plan ?? '');
  if (name.startsWith('subscription_') && name !== 'subscription_payment_success' && name !== 'subscription_payment_failed' && name !== 'subscription_payment_recovered') {
    if (!/^[0-9a-f-]{36}$/i.test(uid) || !['gold', 'seller'].includes(plan)) return { ignored: true };
    await sb.from('card_subscriptions').upsert({ id: oid, user_id: uid, plan, status: String(a.status ?? ''), renews_at: a.renews_at ?? null, ends_at: a.ends_at ?? null, updated_at: new Date().toISOString() });
    return { ok: true };
  }
  if (name === 'subscription_payment_success' && a.billing_reason === 'renewal') {
    // facture de renouvellement : on prolonge d'un mois
    const sid = String(a.subscription_id ?? '');
    const { data: s } = await sb.from('card_subscriptions').select('user_id,plan').eq('id', sid).maybeSingle();
    if (!s) return { ignored: true };
    const { data: amount } = await sb.rpc('payment_quote', { p_kind: s.plan, p_qty: 1 });
    const { data: pay, error } = await sb.from('payments').insert({ user_id: s.user_id, kind: s.plan, qty: 1, amount: amount ?? 1, currency: 'XAF', provider: 'lemonsqueezy', provider_ref: 'inv_' + oid }).select().single();
    if (error) return { ok: true, dup: true }; // facture déjà traitée
    await sb.rpc('payment_complete', { p_id: pay.id }); return { ok: true };
  }
  return { ignored: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!KEY || !STORE || !VARIANT || !WH) return json({ error: 'not_configured' }, 503);
  const raw = await req.text(), sig = req.headers.get('X-Signature');
  try {
    if (sig) {
      if (!same(await hmacHex(WH, raw), sig)) return json({ error: 'signature' }, 401);
      return json(await webhook(raw));
    }
    const body = JSON.parse(raw || '{}');
    if (body.action === 'verify') {
      const id = String(body.id ?? ''); if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'id invalide' }, 400);
      const { data: p } = await sb.from('payments').select('status,kind,qty').eq('id', id).maybeSingle();
      return json(p ? { status: p.status, kind: p.kind, qty: p.qty } : { status: 'unknown' });
    }
    const user = await userOf(req); if (!user) return json({ error: 'Connecte-toi d’abord' }, 401);
    if (body.action === 'portal') {
      const { data: s } = await sb.from('card_subscriptions').select('id').eq('user_id', user.id).eq('plan', String(body.plan)).order('updated_at', { ascending: false }).limit(1).maybeSingle();
      if (!s) return json({ error: 'Aucun abonnement par carte' }, 404);
      const d = await (await LS(`/subscriptions/${encodeURIComponent(s.id)}`)).json().catch(() => ({}));
      const url = d?.data?.attributes?.urls?.customer_portal; return url ? json({ url }) : json({ error: 'Indisponible' }, 502);
    }
    if (body.action !== 'init') return json({ error: 'action' }, 400);
    const kind = String(body.kind), qty = Number(body.qty), ref = String(body.ref ?? '');
    let amount = 0, currency = 'XAF';
    if (kind === 'challenge') {
      if (!/^[0-9a-f-]{36}$/i.test(ref)) return json({ error: 'Défi inconnu' }, 400);
      const { data: q } = await sb.rpc('challenge_quote', { p_id: ref, p_user: user.id });
      const row = Array.isArray(q) ? q[0] : q; if (!row) return json({ error: 'Défi introuvable ou déjà payé' }, 400);
      amount = row.amount; currency = row.currency;
    } else {
      const { data: a } = await sb.rpc('payment_quote', { p_kind: kind, p_qty: qty }); if (!a) return json({ error: 'Offre inconnue' }, 400); amount = a;
    }
    const sub = !!body.auto && qty === 1 && (kind === 'gold' || kind === 'seller') && !!SUBV[kind];
    const { data: pay, error } = await sb.from('payments').insert({ user_id: user.id, kind, qty: kind === 'challenge' ? 1 : qty, amount, currency, provider: 'lemonsqueezy', ref_id: kind === 'challenge' ? ref : null }).select().single();
    if (error) return json({ error: error.message }, 400);
    const back = ALLOWED_RETURN.test(String(body.return_url ?? '')) ? String(body.return_url).split(/[?#]/)[0] : 'https://vibzo.fun/';
    const label = kind === 'coins' ? `${qty} pièces Vibzo` : kind === 'gold' ? (sub ? 'Vibzo Gold · mensuel' : `Vibzo Gold · ${qty} mois`) : kind === 'seller' ? (sub ? 'Vendeur Vibzo · mensuel' : `Vendeur Vibzo · ${qty} mois`) : 'Défi sponsorisé Vibzo';
    const variant = sub ? SUBV[kind] : VARIANT;
    const r = await LS('/checkouts', { method: 'POST', body: JSON.stringify({ data: { type: 'checkouts', attributes: {
      custom_price: cents(amount, currency),
      product_options: { name: label, redirect_url: `${back}?cpay=${pay.id}`, enabled_variants: [Number(variant)] },
      checkout_data: { email: user.email ?? undefined, custom: { payment_id: pay.id, user_id: user.id, plan: sub ? kind : '' } },
      expires_at: new Date(Date.now() + 3600e3).toISOString(),
    }, relationships: { store: { data: { type: 'stores', id: String(STORE) } }, variant: { data: { type: 'variants', id: String(variant) } } } } }) });
    const d = await r.json().catch(() => ({}));
    const url = d?.data?.attributes?.url;
    if (!r.ok || !url) { await sb.from('payments').update({ status: 'failed' }).eq('id', pay.id); return json({ error: 'Paiement par carte indisponible' }, 502); }
    return json({ url, id: pay.id });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
