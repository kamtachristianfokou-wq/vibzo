// Vibzo · jeton LiveKit pour les lives
//   POST {live}  → { url, token, role: 'host'|'viewer'|'guest' }
// L'animateur (host) peut publier caméra + micro ; un membre connecté regarde et écrit dans le chat ;
// un visiteur non connecté regarde seulement.
// Secrets à ajouter dans Supabase (Edge Functions > Secrets) : LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const LK_URL = Deno.env.get('LIVEKIT_URL') ?? '';
const LK_KEY = Deno.env.get('LIVEKIT_API_KEY') ?? '';
const LK_SECRET = Deno.env.get('LIVEKIT_API_SECRET') ?? '';
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const b64url = (b: Uint8Array | string) => {
  const bytes = typeof b === 'string' ? new TextEncoder().encode(b) : b;
  let s = ''; for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
async function sign(payload: Record<string, unknown>) {
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(LK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${head}.${body}`)));
  return `${head}.${body}.${b64url(sig)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!LK_URL || !LK_KEY || !LK_SECRET) return json({ error: 'not_configured' }, 503);
  const { live } = await req.json().catch(() => ({}));
  if (typeof live !== 'string' || !/^[0-9a-f-]{36}$/i.test(live)) return json({ error: 'bad_request' }, 400);
  const { data: l } = await sb.from('lives').select('id, host_id, status').eq('id', live).maybeSingle();
  if (!l || l.status !== 'live') return json({ error: 'ended' }, 404);

  let uid: string | null = null, name = 'Invité';
  const auth = req.headers.get('Authorization') ?? '';
  if (auth.startsWith('Bearer ')) {
    const { data } = await sb.auth.getUser(auth.slice(7));
    if (data?.user) {
      uid = data.user.id;
      const { data: p } = await sb.from('profiles').select('username').eq('id', uid).maybeSingle();
      name = p?.username ?? 'membre';
    }
  }
  const role = uid && uid === l.host_id ? 'host' : uid ? 'viewer' : 'guest';
  const now = Math.floor(Date.now() / 1000);
  const token = await sign({
    iss: LK_KEY, sub: uid ? `${uid}:${crypto.randomUUID().slice(0, 6)}` : `guest-${crypto.randomUUID()}`, name,
    nbf: now - 10, exp: now + 6 * 3600,
    metadata: JSON.stringify({ uid, role }),
    video: {
      room: `live-${l.id}`, roomJoin: true, canSubscribe: true,
      canPublish: role === 'host', canPublishData: role !== 'guest',
      canPublishSources: role === 'host' ? ['camera', 'microphone'] : [],
    },
  });
  return json({ url: LK_URL, token, role });
});
