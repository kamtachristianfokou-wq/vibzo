// Vibzo · paiement automatique CamPay (MTN Mobile Money, Orange Money, carte si le compte l'autorise)
// Actions :
//   POST {action:'init', kind, qty, ref?, channel:'mtn'|'orange'|'card', return_url}  (connecté) → { url, id }
//   POST {action:'verify', id}                                                          → { status }
//   POST {action:'sweep'}           (tâche planifiée)                                    → revérifie les paiements en attente
//   GET/POST webhook CamPay (?status=…&reference=…&signature=…)                         → revérifie et crédite
// Secrets (Supabase > Edge Functions > Secrets) :
//   CAMPAY_USERNAME, CAMPAY_PASSWORD  : identifiants « App username / App password » de l'application CamPay
//   CAMPAY_WEBHOOK_KEY                : clé webhook de l'application (facultatif : on revérifie toujours chez CamPay)
//   CAMPAY_ENV                        : « live » (www.campay.net) ou « demo » (demo.campay.net)
// Un paiement n'est crédité qu'après vérification directe auprès de l'API CamPay.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const USER = Deno.env.get('CAMPAY_USERNAME') ?? '', PASS = Deno.env.get('CAMPAY_PASSWORD') ?? '';
const LIVE = (Deno.env.get('CAMPAY_ENV') ?? 'live').toLowerCase() !== 'demo';
const API = LIVE ? 'https://www.campay.net/api' : 'https://demo.campay.net/api';
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const ALLOWED_RETURN = /^https:\/\/(vibzo\.fun|www\.vibzo\.fun|kamtachristianfokou-wq\.github\.io)(\/|$)/;

let tok = '', tokExp = 0;
async function token() {
  if (tok && Date.now() < tokExp) return tok;
  const r = await fetch(`${API}/token/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: USER, password: PASS }) });
  const d = await r.json().catch(() => ({}));
  if (!d.token) throw new Error('CamPay : identifiants refusés');
  tok = d.token; tokExp = Date.now() + Math.max(60, Number(d.expires_in ?? 3600) - 120) * 1000; return tok;
}
const api = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Token ${await token()}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } });
  return { ok: r.ok, status: r.status, d: await r.json().catch(() => ({})) as Record<string, unknown> };
};

async function verify(id: string) {
  const { data: p } = await sb.from('payments').select('*').eq('id', id).eq('provider', 'campay').maybeSingle();
  if (!p) return { status: 'unknown' };
  if (p.status !== 'pending') return { status: p.status, kind: p.kind, qty: p.qty };
  if (!p.provider_ref) return { status: 'pending' };
  const { d } = await api(`/transaction/${encodeURIComponent(p.provider_ref)}/`);
  const st = String(d.status ?? '').toUpperCase();
  const paid = Number(d.amount ?? 0);
  if (st === 'SUCCESSFUL' && paid >= p.amount && String(d.currency ?? 'XAF').toUpperCase() === 'XAF' && String(d.external_reference ?? '') === `vz_${p.id}`) {
    const { data, error } = await sb.rpc('payment_complete', { p_id: p.id });
    if (error) return { status: 'error', message: error.message };
    return { status: 'complete', kind: p.kind, qty: p.qty, until: data?.until ?? null };
  }
  if (st === 'FAILED') {
    await sb.from('payments').update({ status: 'failed' }).eq('id', p.id).eq('status', 'pending');
    return { status: 'failed' };
  }
  return { status: 'pending' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!USER || !PASS) return json({ error: 'not_configured' }, 503);
  const url = new URL(req.url);
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
  const action = body.action ?? url.searchParams.get('action') ?? 'webhook';
  try {
    if (action === 'init') {
      const jwt = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
      const { data: ud } = await sb.auth.getUser(jwt); const user = ud?.user;
      if (!user) return json({ error: 'Connecte-toi d’abord' }, 401);
      const kind = String(body.kind), qty = kind === 'challenge' ? 1 : Number(body.qty), ref = String(body.ref ?? '');
      let amount = 0;
      if (kind === 'challenge') {
        if (!/^[0-9a-f-]{36}$/i.test(ref)) return json({ error: 'Défi inconnu' }, 400);
        const { data: q } = await sb.rpc('challenge_quote', { p_id: ref, p_user: user.id });
        const row = Array.isArray(q) ? q[0] : q;
        if (!row) return json({ error: 'Défi introuvable ou déjà payé' }, 400);
        if (row.currency !== 'XAF') return json({ error: 'Mobile Money : uniquement en FCFA. Paie par carte.' }, 400);
        amount = row.amount;
      } else {
        const { data: a } = await sb.rpc('payment_quote', { p_kind: kind, p_qty: qty });
        if (!a) return json({ error: 'Offre inconnue' }, 400); amount = a;
      }
      const { data: prof } = await sb.from('profiles').select('username, display_name, phone').eq('id', user.id).single();
      const { data: pay, error } = await sb.from('payments').insert({ user_id: user.id, kind, qty, amount: Math.round(amount), currency: 'XAF', provider: 'campay', ref_id: kind === 'challenge' ? ref : null }).select().single();
      if (error) return json({ error: error.message }, 400);
      const back = ALLOWED_RETURN.test(String(body.return_url ?? '')) ? String(body.return_url).split(/[?#]/)[0] : 'https://vibzo.fun/';
      const label = kind === 'coins' ? `${qty} pièces Vibzo` : kind === 'gold' ? `Vibzo Gold - ${qty} mois` : kind === 'challenge' ? 'Défi sponsorisé Vibzo' : `Boutique Vibzo - ${qty} mois`;
      const name = String(prof?.display_name || prof?.username || 'Client Vibzo').split(' ');
      const phone = String(prof?.phone ?? '').replace(/\D/g, '');
      const { ok, d } = await api('/get_payment_link/', { method: 'POST', body: JSON.stringify({
        amount: String(Math.round(amount)), currency: 'XAF', description: label, external_reference: `vz_${pay.id}`, external_user: user.id,
        first_name: name[0], last_name: name.slice(1).join(' ') || name[0], email: user.email || undefined,
        ...(/^237\d{9}$/.test(phone) ? { from: phone } : {}),
        redirect_url: `${back}?mpay=${pay.id}`, failure_redirect_url: `${back}?mpay=${pay.id}`,
        payment_options: String(body.channel) === 'card' ? 'CARD' : 'MOMO', payer_can_pay_more: 'no',
      }) });
      if (!ok || !d.link) {
        await sb.from('payments').update({ status: 'failed' }).eq('id', pay.id);
        console.error('campay link', JSON.stringify(d).slice(0, 300));
        return json({ error: String(d.message ?? d.detail ?? 'CamPay indisponible, réessaie') }, 502);
      }
      await sb.from('payments').update({ provider_ref: String(d.reference ?? '') || null }).eq('id', pay.id);
      return json({ url: d.link, id: pay.id });
    }
    if (action === 'verify') {
      const id = String(body.id ?? url.searchParams.get('id') ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'id invalide' }, 400);
      return json(await verify(id));
    }
    if (action === 'sweep') {
      const since = new Date(Date.now() - 48 * 3600e3).toISOString();
      const { data: list } = await sb.from('payments').select('id').eq('status', 'pending').eq('provider', 'campay').not('provider_ref', 'is', null).gte('created_at', since).limit(50);
      let done = 0; for (const p of list ?? []) { const r = await verify(p.id); if (r.status === 'complete') done++; }
      return json({ checked: (list ?? []).length, done });
    }
    // Webhook CamPay : on retrouve le paiement par sa référence et on revérifie auprès de l'API
    const ext = String(body.external_reference ?? url.searchParams.get('external_reference') ?? '');
    const cref = String(body.reference ?? url.searchParams.get('reference') ?? '');
    let id = ext.startsWith('vz_') ? ext.slice(3) : '';
    if (!id && cref) { const { data: p } = await sb.from('payments').select('id').eq('provider', 'campay').eq('provider_ref', cref).maybeSingle(); id = p?.id ?? ''; }
    if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ ok: true, ignored: true });
    // la référence de la transaction peut différer de celle du lien de paiement : on garde celle de la transaction
    if (ext.startsWith('vz_') && /^[0-9a-zA-Z-]{8,64}$/.test(cref)) await sb.from('payments').update({ provider_ref: cref }).eq('id', id).eq('provider', 'campay').eq('status', 'pending');
    return json(await verify(id));
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
