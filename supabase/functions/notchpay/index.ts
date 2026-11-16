// Vibzo · paiement automatique Notch Pay (MTN MoMo, Orange Money, carte)
// Actions :
//   POST {action:'init', kind:'coins'|'gold'|'seller', qty, return_url}  (utilisateur connecté)  → { url, id }
//   POST {action:'verify', id}                                                                   → { status }
//   POST webhook Notch Pay (corps libre)                                                         → revérifie et crédite
// Secret à ajouter dans Supabase (Edge Functions > Secrets) : NOTCHPAY_PUBLIC_KEY (clé « live_… » ou « test_… »).
// Un paiement n'est crédité qu'après vérification directe auprès de l'API Notch Pay.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const API = 'https://api.notchpay.co';
const KEY = Deno.env.get('NOTCHPAY_PUBLIC_KEY') ?? '';
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const WEST = ['SN', 'CI', 'BF', 'ML', 'BJ', 'TG', 'NE', 'GW'];
const ALLOWED_RETURN = /^https:\/\/(vibzo\.fun|www\.vibzo\.fun|kamtachristianfokou-wq\.github\.io)(\/|$)/;

async function verify(id: string) {
  const { data: p } = await sb.from('payments').select('*').eq('id', id).maybeSingle();
  if (!p) return { status: 'unknown' };
  if (p.status !== 'pending') return { status: p.status, kind: p.kind, qty: p.qty };
  if (!p.provider_ref) return { status: 'pending' };
  const r = await fetch(`${API}/payments/${encodeURIComponent(p.provider_ref)}`, { headers: { Authorization: KEY, Accept: 'application/json' } });
  const d = await r.json().catch(() => ({}));
  const t = d.transaction ?? {};
  const st = String(t.status ?? '').toLowerCase();
  if (st === 'complete' && Number(t.amount) >= p.amount && (!t.currency || String(t.currency).toUpperCase() === p.currency)) {
    const { data, error } = await sb.rpc('payment_complete', { p_id: p.id });
    if (error) return { status: 'error', message: error.message };
    return { status: 'complete', kind: p.kind, qty: p.qty, until: data?.until ?? null };
  }
  if (['failed', 'canceled', 'cancelled', 'expired', 'rejected'].includes(st)) {
    await sb.from('payments').update({ status: 'failed' }).eq('id', p.id).eq('status', 'pending');
    return { status: 'failed' };
  }
  return { status: 'pending' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!KEY) return json({ error: 'not_configured' }, 503);
  const url = new URL(req.url);
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
  const action = body.action ?? url.searchParams.get('action') ?? 'webhook';

  try {
    if (action === 'init') {
      const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
      const { data: ud } = await sb.auth.getUser(token);
      const user = ud?.user;
      if (!user) return json({ error: 'Connecte-toi d’abord' }, 401);
      const kind = String(body.kind), qty = Number(body.qty);
      const { data: amount } = await sb.rpc('payment_quote', { p_kind: kind, p_qty: qty });
      if (!amount) return json({ error: 'Offre inconnue' }, 400);
      const { data: prof } = await sb.from('profiles').select('username, display_name, country, phone').eq('id', user.id).single();
      const currency = WEST.includes(prof?.country) ? 'XOF' : 'XAF';
      const { data: pay, error } = await sb.from('payments').insert({ user_id: user.id, kind, qty, amount, currency }).select().single();
      if (error) return json({ error: error.message }, 400);
      const back = ALLOWED_RETURN.test(String(body.return_url ?? '')) ? String(body.return_url).split(/[?#]/)[0] : 'https://vibzo.fun/';
      const label = kind === 'coins' ? `${qty} pièces Vibzo` : kind === 'gold' ? `Vibzo Gold · ${qty} mois` : `Boutique Vibzo · ${qty} mois`;
      const r = await fetch(`${API}/payments`, {
        method: 'POST',
        headers: { Authorization: KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          amount, currency, description: label, reference: `vz_${pay.id}`,
          callback: `${back}?pay=${pay.id}`,
          customer: { name: prof?.display_name || prof?.username || 'Vibzo', email: user.email || `${prof?.username}@vibzo.fun`, phone: prof?.phone || undefined },
          metadata: { payment_id: pay.id, kind, qty },
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.authorization_url) {
        await sb.from('payments').update({ status: 'failed' }).eq('id', pay.id);
        return json({ error: d.message || 'Notch Pay indisponible' }, 502);
      }
      await sb.from('payments').update({ provider_ref: d.transaction?.reference ?? null }).eq('id', pay.id);
      return json({ url: d.authorization_url, id: pay.id });
    }

    if (action === 'verify') {
      const id = String(body.id ?? url.searchParams.get('id') ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'id invalide' }, 400);
      return json(await verify(id));
    }

    // Webhook Notch Pay : on retrouve le paiement puis on revérifie auprès de l'API
    const d = body.data ?? body.transaction ?? body;
    const mref = String(d?.trxref ?? d?.merchant_reference ?? '');
    const tref = String(d?.reference ?? '');
    let id = mref.startsWith('vz_') ? mref.slice(3) : '';
    if (!id && tref) {
      const { data: p } = await sb.from('payments').select('id').eq('provider_ref', tref).maybeSingle();
      id = p?.id ?? '';
    }
    if (!id) return json({ ok: true, ignored: true });
    return json(await verify(id));
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
