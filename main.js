// =====================================================================
// VIBZO : application (version réelle)
// =====================================================================
import { C, ZONES, SECTORS, CONTRACTS, REMOTE, REPORT_REASONS, money } from './data.js';
import { SUPPORT_WHATSAPP, ANDROID_APK_URL, PAYMENT_INFO, SUB_PRICES, SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { getClient, isConfigured } from './supa.js';
import { initI18n, LANGS, langFor, ALSO, getLang } from './i18n.js';

/* ---------- utilitaires ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtN = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + ' M' : n >= 1e4 ? Math.round(n / 1e3) + ' k' : n >= 1e3 ? (n / 1e3).toFixed(1).replace('.', ',') + ' k' : String(n || 0);
const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I = {
  home: sv('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
  bag: sv('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
  plus: sv('<path d="M12 5v14M5 12h14"/>'),
  brief: sv('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>'),
  user: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),
  heart: sv('<path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/>'),
  comment: sv('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
  bookmark: sv('<path d="M6 3h12v18l-6-4-6 4z"/>'),
  share: sv('<path d="M14 5l7 7-7 7v-4c-6 0-9 2-11 5 1-6 4-10 11-11z"/>'),
  search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
  chat: sv('<path d="M4 5h16v11H8l-4 4z"/>'),
  back: sv('<path d="M15 5l-7 7 7 7"/>'),
  close: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
  send: sv('<path d="M4 12 20 4l-6 16-3-7z"/>'),
  gear: sv('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
  bell: sv('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
  repost: sv('<path d="M4 9V7a2 2 0 0 1 2-2h11l-3-3M20 15v2a2 2 0 0 1-2 2H7l3 3"/>'),
  box: sv('<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>'),
};
const GR = [['#5ccbff', '#1e9be8'], ['#87d8ff', '#3a7bd5'], ['#3dd6ff', '#0a6fc2'], ['#7ee8fa', '#1e9be8'], ['#a1e3ff', '#4facfe'], ['#4facfe', '#00c6fb'], ['#6dd5fa', '#2980b9'], ['#89f7fe', '#66a6ff']];
const gfor = s => GR[[...String(s || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % GR.length];
const gbg = g => `background:linear-gradient(135deg,${g[0]},${g[1]})`;
const gst = g => `--g1:${g[0]};--g2:${g[1]};--g3:${g[0]}`;
function ago(ts) {
  const s = (Date.now() - new Date(ts).getTime()) / 1000;
  if (s < 60) return 'à l’instant'; if (s < 3600) return 'il y a ' + Math.floor(s / 60) + ' min';
  if (s < 86400) return 'il y a ' + Math.floor(s / 3600) + ' h'; if (s < 2592000) return 'il y a ' + Math.floor(s / 86400) + ' j';
  return new Date(ts).toLocaleDateString('fr-FR');
}
const avatar = (p, size = 42) => p && p.avatar_url
  ? `<div class="av" style="width:${size}px;height:${size}px"><img class="avimg" src="${esc(p.avatar_url)}" alt=""></div>`
  : `<div class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .4)}px;${gbg(gfor(p && (p.username || p.display_name)))}">${esc(((p && (p.display_name || p.username)) || '?')[0].toUpperCase())}</div>`;

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2600); }
function sheet(title, body) { $('#sheet').innerHTML = `<div class="sh-h"><span>${title}</span><button onclick="V.closeSheet()" aria-label="Fermer">${I.close}</button></div><div class="sh-b">${body}</div>`; $('#sheetBg').classList.add('on'); }
function closeSheet() { $('#sheetBg').classList.remove('on'); }
function modal(html) { $('#modal').innerHTML = html; $('#modal').classList.add('on'); }
function closeModal() { $('#modal').classList.remove('on'); }
const loading = (t = 'Chargement…') => `<div class="loading"><span class="spin"></span>${t}</div>`;
const errMsg = e => (e && (e.message || e.error_description)) || 'Erreur inconnue';
function fail(e) { console.error(e); toast('⚠️ ' + errMsg(e)); }
const busy = (btn, on, label) => { if (!btn) return; btn.disabled = on; if (on) { btn.dataset.l = btn.innerHTML; btn.innerHTML = `<span class="spin"></span> ${label || 'Patiente…'}`; } else if (btn.dataset.l) btn.innerHTML = btn.dataset.l; };

/* ---------- installation de l'application ---------- */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; });
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
async function installApp() {
  closeSheet();
  if (deferredInstall) { deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) { } deferredInstall = null; return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  sheet('📲 Installer Vibzo', `${isStandalone() ? '<p class="small">Vibzo est déjà installée sur cet appareil ✅</p>' : ios
    ? '<ol class="small" style="line-height:1.8;padding-left:18px"><li>Ouvre ce site dans <b>Safari</b></li><li>Touche le bouton <b>Partager</b> (carré avec une flèche)</li><li>Choisis <b>« Sur l’écran d’accueil »</b></li></ol>'
    : '<ol class="small" style="line-height:1.8;padding-left:18px"><li>Ouvre ce site dans <b>Chrome</b></li><li>Touche le menu <b>⋮</b> en haut à droite</li><li>Choisis <b>« Installer l’application »</b> ou <b>« Ajouter à l’écran d’accueil »</b></li></ol>'}
  ${ANDROID_APK_URL ? `<a class="btn" style="text-decoration:none" href="${ANDROID_APK_URL}">⬇️ Télécharger l’app Android (APK)</a><p class="mut small" style="margin-top:8px">Si Android le demande, autorise l’installation depuis ton navigateur.</p>` : ''}`);
}

/* ---------- bannière d'installation (une fois tous les 3 jours, jamais si déjà installée) ---------- */
function maybeInstallBanner() {
  try {
    if (isStandalone() || $('#instBar')) return;
    const last = +localStorage.getItem('vibzo_inst_hide') || 0; if (Date.now() - last < 3 * 864e5) return;
    const b = document.createElement('div'); b.id = 'instBar';
    b.innerHTML = `<span>📲</span><div class="grow"><b>Installe Vibzo</b><small>Plus rapide, comme une vraie application</small></div><button class="btn sm" onclick="V.installApp();V.hideInstall()">Installer</button><button class="x" aria-label="Fermer" onclick="V.hideInstall()">✕</button>`;
    document.body.appendChild(b);
  } catch (e) { }
}
function hideInstall() { try { localStorage.setItem('vibzo_inst_hide', Date.now()); } catch (e) { } const b = $('#instBar'); if (b) b.remove(); }
setTimeout(maybeInstallBanner, 25000);

/* ---------- accueil des nouveaux visiteurs ---------- */
function welcome() {
  try { if (localStorage.getItem('vibzo_welcomed') || uid() || new URLSearchParams(location.search).get('pay')) return; localStorage.setItem('vibzo_welcomed', '1'); } catch (e) { return; }
  const ref = pendingRef(), lite = navigator.connection && navigator.connection.saveData;
  const el = document.createElement('div'); el.id = 'welcomeV';
  const wl = ['fr', 'en', 'pt', 'es', 'ar', 'sw', 'am', 'az'].includes(getLang()) ? getLang() : 'fr';
  el.innerHTML = `<video id="wvid" src="welcome-${wl}.mp4" poster="welcome-${wl}.jpg" playsinline muted ${lite ? 'preload="none"' : 'autoplay preload="auto"'}></video>
  <button class="wv-snd" id="wvSnd" aria-label="Son" onclick="V.wvSound()">🔇</button><button class="wv-skip" onclick="V.wvClose()">Ignorer ✕</button>
  ${lite ? '<button class="wv-play" onclick="document.getElementById(\'wvid\').play();this.remove()">▶</button>' : ''}
  <div class="wv-bot">${ref ? `<p>Ton ami <b>@${esc(ref)}</b> t’invite !</p>` : ''}<div class="wv-row"><button class="btn" onclick="V.wvClose();V.go('auth')">Créer mon compte gratuit</button><button class="btn ghost" onclick="V.wvClose()">Regarder d’abord</button></div></div>`;
  document.body.appendChild(el);
  const v = $('#wvid'); v.onended = () => el.classList.add('done'); setTimeout(() => el.classList.add('done'), 2500);
  const p = v.play && !lite ? v.play() : null; if (p && p.catch) p.catch(() => { });
}
function wvSound() { const v = $('#wvid'); if (!v) return; v.muted = !v.muted; if (!v.muted && v.paused) v.play().catch(() => { }); if (v.ended || v.currentTime > v.duration - 0.2) { v.currentTime = 0; v.play().catch(() => { }); } $('#wvSnd').textContent = v.muted ? '🔇' : '🔊'; }
function wvClose() { const el = $('#welcomeV'); if (!el) return; const v = $('#wvid'); if (v) v.pause(); el.classList.add('out'); setTimeout(() => el.remove(), 250); }

/* ---------- premiers pas (profil) ---------- */
function startChecklist(p) {
  const steps = [[!!p.avatar_url, '📸 Ajoute ta photo de profil', 'V.editProfile()'], [p.videos > 0, '🎬 Publie ta première vidéo', "V.go('create')"], [p.following > 0, '👥 Suis 3 créateurs', "V.go('home')"], [!!(p.instagram || p.tiktok || p.youtube), '🔗 Lie ton TikTok / Instagram', 'V.editProfile()'], [false, '🎁 Invite tes amis (3 amis = 7 jours de Gold)', 'V.inviteSheet()']];
  const done = steps.filter(x => x[0]).length; if (done >= 4) return '';
  return `<div class="card start"><div class="row"><b class="grow">🚀 Pour bien commencer</b><span class="mut small">${done}/${steps.length}</span></div><div class="rbar"><i style="width:${done / steps.length * 100}%"></i></div>${steps.map(x => `<button class="${x[0] ? 'ok' : ''}" onclick="${x[2]}">${x[0] ? '✅' : '⬜'} ${x[1]}</button>`).join('')}</div>`;
}

/* ---------- langue ---------- */
const savedLang = () => { try { return localStorage.getItem('vibzo_lang'); } catch (e) { return null; } };
function applyLang() { initI18n(savedLang() || (S.me && S.me.lang) || langFor((S.me && S.me.country) || S.loc.country)); }
function langSheet() {
  const cc = (S.me && S.me.country) || S.loc.country; const rec = [langFor(cc), ...(ALSO[cc] || [])];
  const order = [...new Set([...rec, ...Object.keys(LANGS)])];
  sheet('🌐 Langue', `<p class="mut small">Langue officielle de ${esc(C[cc].n)} : <b>${LANGS[langFor(cc)]}</b></p><div class="chips" style="margin-top:12px">${order.map(l => `<button class="chip ${getLang() === l ? 'on' : ''}" onclick="V.setLang('${l}')">${LANGS[l]}${rec.includes(l) ? ' ★' : ''}</button>`).join('')}</div>`);
}
async function setLang(l) {
  try { localStorage.setItem('vibzo_lang', l); } catch (e) { }
  closeSheet(); initI18n(l); renderNav(); go(S.cur);
  if (uid()) { const { error } = await sb.from('profiles').update({ lang: l }).eq('id', uid()); if (!error && S.me) S.me.lang = l; }
}

/* ---------- état ---------- */
let sb;
const S = {
  session: null, me: null, myShop: null, cur: 'home', prev: 'home', tab: 'pour', muted: true,
  loc: { country: 'CM', region: null, zone: false, world: true },
  feed: [], feedOffset: 0, feedDone: false, feedLoading: false, override: null,
  vids: new Map(), prods: new Map(), offers: new Map(), cands: new Map(), orders: new Map(),
  jobTab: 'pourtoi', jobSector: 'all', profTab: 'videos', viewUser: null, chatId: null, chatSub: null, chatInfo: null, unread: 0,
};
const uid = () => S.session && S.session.user && S.session.user.id;
const LOC_KEY = 'vibzo_loc2';
try { const l = JSON.parse(localStorage.getItem(LOC_KEY) || 'null'); if (l && C[l.country]) S.loc = l; } catch (e) { }
const saveLoc = () => { try { localStorage.setItem(LOC_KEY, JSON.stringify(S.loc)); } catch (e) { } };
const worldLoc = cc => ({ country: cc || 'CM', region: null, zone: false, world: true });
const countries = () => S.loc.world ? null : S.loc.zone ? Object.keys(C).filter(k => C[k].z === C[S.loc.country].z) : [S.loc.country];
const regionF = () => (S.loc.world || S.loc.zone ? null : S.loc.region);
const locLabel = () => S.loc.world ? '🌐 Monde entier' : S.loc.zone ? '🌍 ' + ZONES[C[S.loc.country].z] : C[S.loc.country].f + ' ' + (S.loc.region || C[S.loc.country].n);
const inScope = q => { const cs = countries(); if (cs) q = q.in('country', cs); const r = regionF(); return r ? q.eq('region', r) : q; };

function requireAuth(msg) {
  if (uid()) return true;
  modal(`<div class="card" style="max-width:340px;width:100%;text-align:center;background:#fff"><div style="font-size:40px">🔐</div><h3 style="margin-top:6px">Connexion requise</h3><p class="mut small" style="margin-top:6px">${esc(msg || 'Crée un compte gratuit pour continuer.')}</p><button class="btn" onclick="V.closeModal();V.go('auth')">Se connecter / s’inscrire</button><button class="btn ghost" onclick="V.closeModal()">Plus tard</button></div>`);
  return false;
}

/* ---------- navigation ---------- */
const NAV = [['home', 'Accueil', I.home], ['shop', 'Boutique', I.bag], ['create', '', I.plus], ['dating', 'Rencontres', I.heart], ['jobs', 'Emplois', I.brief], ['profile', 'Profil', I.user]];
function renderNav() {
  $('#nav').style.display = S.cur === 'auth' || S.cur === 'chat' ? 'none' : 'flex';
  $('#nav').innerHTML = NAV.map(([k, l, ic]) => k === 'create'
    ? `<button onclick="V.go('create')" aria-label="Publier"><span class="plus">${ic}</span></button>`
    : `<button class="${S.cur === k ? 'on' : ''}" onclick="V.go('${k}')">${ic}<span>${l}</span></button>`).join('');
}
const SCREENS = {};
function go(k, opts = {}) {
  if (k === 'profile' && !opts.user) S.viewUser = null;
  if (k === 'profile' && opts.user) S.viewUser = opts.user;
  if (k !== S.cur && k !== 'chat') S.prev = S.cur;
  if (S.cur === 'chat' && k !== 'chat') stopChat();
  if (k === 'home' && !opts.keepOverride) S.override = null;
  S.cur = k;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  $('#s-' + k).classList.add('on');
  if (k !== 'home') document.querySelectorAll('#feed video').forEach(v => v.pause());
  renderNav();
  Promise.resolve(SCREENS[k]()).catch(fail);
}
const hdr = (title, right = '', back = '') => `<div class="hdr">${back ? `<button class="ib" onclick="V.go('${back}')" aria-label="Retour">${I.back}</button>` : ''}<h1>${title}</h1>${right}</div>`;
const locBtn = () => `<button class="loc" onclick="V.openLoc()">📍 ${esc(locLabel())} ▾</button>`;

/* ---------- pays / région ---------- */
function openLoc() {
  sheet('Pays & région', `<div class="mut small">Vibzo t’affiche les vidéos, emplois et boutiques de la zone choisie.</div><div class="lbl">Pays</div><div class="chips" id="ccChips"></div><div class="lbl">Région</div><div class="chips" id="rgChips"></div>${uid() ? '<label class="check"><input type="checkbox" id="locSave"> Enregistrer comme ma région de profil</label>' : ''}<button class="btn" onclick="V.applyLoc()">Appliquer</button>`);
  locChips();
}
function locChips() {
  $('#ccChips').innerHTML = `<button class="chip ${S.loc.world ? 'on' : ''}" onclick="V.setLoc(null,'world')">🌐 Monde entier (tous les pays)</button>` + Object.keys(ZONES).map(z => `<div style="width:100%;font-size:12.5px;font-weight:700;margin:6px 0 2px">${ZONES[z]}</div>` + Object.entries(C).filter(([, c]) => c.z === z).map(([k, c]) => `<button class="chip ${!S.loc.world && k === S.loc.country ? 'on' : ''}" onclick="V.setLoc('${k}')">${c.f} ${c.n}</button>`).join('')).join('');
  $('#rgChips').innerHTML = `<button class="chip ${!S.loc.world && S.loc.zone ? 'on' : ''}" onclick="V.setLoc(null,'zone')">🌍 Toute la zone</button><button class="chip ${!S.loc.world && !S.loc.zone && !S.loc.region ? 'on' : ''}" onclick="V.setLoc(null,'all')">Tout le pays</button>` +
    C[S.loc.country].r.map((r, i) => `<button class="chip ${!S.loc.world && !S.loc.zone && S.loc.region === r ? 'on' : ''}" onclick="V.setLoc(null,${i})">${esc(r)}</button>`).join('');
}
function setLoc(country, reg) {
  if (country) S.loc = { country, region: null, zone: false, world: false };
  if (reg === 'world') S.loc.world = true; else if (reg != null) S.loc.world = false;
  if (reg === 'zone') S.loc.zone = true; else if (reg === 'all') { S.loc.zone = false; S.loc.region = null; } else if (reg != null) { S.loc.zone = false; S.loc.region = C[S.loc.country].r[reg]; }
  locChips();
}
async function applyLoc() {
  saveLoc();
  const chk = $('#locSave');
  if (chk && chk.checked && uid()) {
    const { error } = await sb.from('profiles').update({ country: S.loc.country, region: S.loc.region }).eq('id', uid());
    if (error) return fail(error);
    S.me.country = S.loc.country; S.me.region = S.loc.region; toast('Région de profil mise à jour');
  }
  closeSheet(); applyLang(); renderNav(); go(S.cur);
}

/* =====================================================================
   AUTHENTIFICATION
   ===================================================================== */
let authMode = 'signup';
SCREENS.auth = () => {
  const ccOpts = Object.keys(ZONES).map(z => `<optgroup label="${ZONES[z]}">${Object.entries(C).filter(([, c]) => c.z === z).map(([k, c]) => `<option value="${k}" ${k === S.loc.country ? 'selected' : ''}>${c.f} ${c.n}</option>`).join('')}</optgroup>`).join('');
  $('#s-auth').innerHTML = `<div class="auth"><div class="logo"><span>Vibzo</span></div><p class="mut small" style="text-align:center;margin-top:4px">Vidéos · Emplois · Boutiques près de chez toi</p><div style="text-align:center;margin-top:10px"><button class="chip" onclick="V.langSheet()">🌐 ${LANGS[getLang()]} ▾</button></div>
  <div class="seg" style="margin-top:20px"><button class="${authMode === 'signup' ? 'on' : ''}" onclick="V.authTab('signup')">Créer un compte</button><button class="${authMode === 'login' ? 'on' : ''}" onclick="V.authTab('login')">Se connecter</button></div>
  <button type="button" class="btn ghost gbtn" onclick="V.googleAuth()" style="margin-top:14px;display:flex;align-items:center;justify-content:center;gap:10px"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>Continuer avec Google</button>
  <div class="mut small" style="text-align:center;margin:12px 0 0">— ou avec ton e-mail —</div>
  <form onsubmit="event.preventDefault();V.submitAuth()" style="margin-top:6px">
  ${authMode === 'signup' ? `<div class="field"><label>Ton nom</label><input id="aName" maxlength="40" required placeholder="Ex : Christian K."></div>
  <div class="field"><label>Nom d’utilisateur</label><input id="aUser" maxlength="24" required placeholder="ex : christian.k" pattern="[a-zA-Z0-9_.]{3,24}" title="3 à 24 caractères : lettres, chiffres, . et _"></div>` : ''}
  <div class="field"><label>E-mail</label><input id="aEmail" type="email" required autocomplete="email" placeholder="toi@exemple.com"></div>
  <div class="field"><label>Mot de passe</label><input id="aPass" type="password" required minlength="8" autocomplete="${authMode === 'signup' ? 'new-password' : 'current-password'}" placeholder="8 caractères minimum"></div>
  ${authMode === 'signup' ? `<div class="field"><label>Pays</label><select id="aCc" onchange="V.authRegions()">${ccOpts}</select></div>
  <div class="field"><label>Région</label><select id="aRg"></select></div>
  <div class="field"><label>Téléphone (facultatif)</label><div class="row"><span class="chip" id="aInd" style="flex:none">${C[S.loc.country].tel}</span><input id="aTel" type="tel" inputmode="tel" placeholder="6 12 34 56 78"></div></div>
  <label class="check"><input type="checkbox" id="aAge" required> J’ai 16 ans ou plus.</label>
  <label class="check"><input type="checkbox" id="aCgu" required> J’accepte la <a href="privacy.html" target="_blank" rel="noopener">politique de confidentialité</a> et je m’engage à respecter les autres membres.</label>` : `<p style="margin-top:8px"><button type="button" class="mut small" onclick="V.forgot()" style="text-decoration:underline">Mot de passe oublié ?</button></p>`}
  <div class="err" id="aErr"></div>
  <button class="btn" id="aBtn">${authMode === 'signup' ? 'Créer mon compte' : 'Se connecter'}</button></form>
  <button class="btn ghost" onclick="V.go('home')">Continuer sans compte</button><button class="btn ghost" onclick="V.installApp()">📲 Installer l’application</button></div>`;
  if (authMode === 'signup') authRegions();
};
function authRegions() { const cc = $('#aCc').value; if (!savedLang() && langFor(cc) !== getLang()) { S.loc.country = cc; initI18n(langFor(cc)); } $('#aRg').innerHTML = C[cc].r.map(r => `<option>${esc(r)}</option>`).join(''); $('#aInd').textContent = C[cc].tel; }
function authTab(m) { authMode = m; SCREENS.auth(); }
async function submitAuth() {
  const btn = $('#aBtn'), err = $('#aErr'); err.textContent = '';
  const email = $('#aEmail').value.trim(), password = $('#aPass').value;
  busy(btn, true);
  try {
    if (authMode === 'signup') {
      const cc = $('#aCc').value, tel = $('#aTel').value.replace(/[^\d]/g, '');
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.href.split('#')[0], data: { username: $('#aUser').value.trim().toLowerCase(), display_name: $('#aName').value.trim(), country: cc, region: $('#aRg').value, phone: tel ? C[cc].tel + tel : '', ref: pendingRef() } } });
      if (error) throw error;
      S.loc = worldLoc(cc); saveLoc();
      if (!data.session) { modal(`<div class="card" style="max-width:340px;width:100%;text-align:center;background:#fff"><div style="font-size:40px">📧</div><h3>Vérifie ta boîte e-mail</h3><p class="mut small" style="margin-top:6px">Nous avons envoyé un lien de confirmation à <b>${esc(email)}</b>. Clique dessus, puis reviens te connecter.</p><button class="btn" onclick="V.closeModal();V.authTab('login')">OK</button></div>`); }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  } catch (e) {
    const m = errMsg(e);
    err.textContent = /Invalid login/i.test(m) ? 'E-mail ou mot de passe incorrect.' : /already registered/i.test(m) ? 'Cet e-mail a déjà un compte. Connecte-toi.' : /Email not confirmed/i.test(m) ? 'Confirme d’abord ton e-mail (regarde tes messages).' : m;
  } finally { busy(btn, false); }
}
async function forgot() {
  const email = $('#aEmail').value.trim(); if (!email) { $('#aErr').textContent = 'Écris ton e-mail, puis appuie à nouveau.'; return; }
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] });
  if (error) return fail(error); toast('E-mail de réinitialisation envoyé 📧');
}
async function googleAuth() {
  const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: 'select_account' } } });
  if (error) fail(/provider is not enabled|Unsupported provider/i.test(errMsg(error)) ? { message: 'La connexion Google n’est pas encore activée. Utilise ton e-mail pour l’instant.' } : error);
}
/* Profil à compléter après une inscription avec Google */
function setupProfile() {
  const m = S.me, cc0 = (m.country && C[m.country]) ? m.country : S.loc.country;
  const ccOpts = Object.keys(ZONES).map(z => `<optgroup label="${ZONES[z]}">${Object.entries(C).filter(([, c]) => c.z === z).map(([k, c]) => `<option value="${k}" ${k === cc0 ? 'selected' : ''}>${c.f} ${c.n}</option>`).join('')}</optgroup>`).join('');
  modal(`<form class="card" style="max-width:360px;width:100%;background:#fff;max-height:90vh;overflow:auto" onsubmit="event.preventDefault();V.saveSetup()"><h3>Bienvenue sur Vibzo 👋</h3><p class="mut small" style="margin-top:4px">Complète ton profil pour voir ce qui se passe près de chez toi.</p>
  <div class="field"><label>Ton nom</label><input id="sName" maxlength="40" required value="${esc(m.display_name || '')}"></div>
  <div class="field"><label>Nom d’utilisateur</label><input id="sUser" maxlength="24" required pattern="[a-zA-Z0-9_.]{3,24}" title="3 à 24 caractères : lettres, chiffres, . et _" value="${esc(m.username || '')}"></div>
  <div class="field"><label>Pays</label><select id="sCc" onchange="V.setupRegions()">${ccOpts}</select></div>
  <div class="field"><label>Région</label><select id="sRg"></select></div>
  <label class="check"><input type="checkbox" required> J’ai 16 ans ou plus.</label>
  <label class="check"><input type="checkbox" required> J’accepte la <a href="privacy.html" target="_blank" rel="noopener">politique de confidentialité</a> et je m’engage à respecter les autres membres.</label>
  <div class="err" id="sErr"></div><button class="btn" id="sBtn">C’est parti</button></form>`);
  setupRegions();
}
function setupRegions() { const cc = $('#sCc').value; $('#sRg').innerHTML = C[cc].r.map(r => `<option ${S.me.region === r ? 'selected' : ''}>${esc(r)}</option>`).join(''); }
async function saveSetup() {
  const btn = $('#sBtn'); $('#sErr').textContent = ''; busy(btn, true);
  const cc = $('#sCc').value, upd = { display_name: $('#sName').value.trim(), username: $('#sUser').value.trim().toLowerCase(), country: cc, region: $('#sRg').value, needs_setup: false };
  const { error } = await sb.from('profiles').update(upd).eq('id', uid());
  busy(btn, false);
  if (error) { $('#sErr').textContent = /duplicate|unique/i.test(errMsg(error)) ? 'Ce nom d’utilisateur est déjà pris, choisis-en un autre.' : errMsg(error); return; }
  Object.assign(S.me, upd); S.loc = worldLoc(cc); saveLoc(); applyLang(); closeModal(); toast('Profil prêt ✅'); applyRefIfAny(); go(S.cur === 'auth' ? 'home' : S.cur);
}
// Colonnes publiques du profil (le téléphone est privé : lu via private_phone)
const PROFILE_COLS = 'id,username,display_name,bio,avatar_url,country,region,role,vip_until,created_at,city,lang,needs_setup,instagram,tiktok,youtube';
async function loadMe() {
  if (!uid()) { S.me = null; S.myShop = null; return; }
  const [{ data: me }, { data: shop }] = await Promise.all([
    sb.from('profiles').select(PROFILE_COLS).eq('id', uid()).maybeSingle(),
    sb.from('shops').select('*').eq('owner_id', uid()).maybeSingle(),
  ]);
  S.me = me; S.myShop = shop;
  if (me) { const { data: ph } = await sb.rpc('private_phone', { p_user: uid() }); me.phone = ph || null; }
  if (me && me.needs_setup) setTimeout(setupProfile, 300);
  else if (me && pendingRef() && Date.now() - new Date(me.created_at).getTime() < 864e5) applyRefIfAny(); else if (me) { try { localStorage.removeItem('vibzo_ref'); } catch (e) { } }
  refreshNotifs();
}
function deleteAccount() {
  closeSheet();
  modal(`<div class="card" style="max-width:340px;width:100%;text-align:center;background:#fff"><div style="font-size:40px">⚠️</div><h3>Supprimer définitivement ton compte ?</h3><p class="mut small" style="margin-top:6px">Tes vidéos, messages, profil de rencontre, boutique, offres et commandes seront effacés. Cette action est irréversible.</p><div class="field"><label>Écris SUPPRIMER pour confirmer</label><input id="delConf" autocomplete="off"></div><button class="btn" id="delBtn" style="background:#d81f45" onclick="V.doDeleteAccount()">Supprimer mon compte</button><button class="btn ghost" onclick="V.closeModal()">Annuler</button></div>`);
}
async function doDeleteAccount() {
  if (($('#delConf').value || '').trim().toUpperCase() !== 'SUPPRIMER') return toast('Écris SUPPRIMER pour confirmer');
  const btn = $('#delBtn'); busy(btn, true);
  try {
    for (const b of ['videos', 'images']) {
      const { data } = await sb.storage.from(b).list(uid(), { limit: 1000 });
      if (data && data.length) await sb.storage.from(b).remove(data.map(f => uid() + '/' + f.name));
    }
    const { error } = await sb.rpc('delete_my_account'); if (error) throw error;
    await sb.auth.signOut(); S.session = null; S.me = null; S.myShop = null;
    closeModal(); toast('Ton compte a été supprimé'); go('home');
  } catch (e) { fail(e); } finally { busy(btn, false); }
}
async function logout() { closeSheet(); closeModal(); await sb.auth.signOut(); S.session = null; S.me = null; S.myShop = null; toast('Déconnecté'); go('home'); }

/* =====================================================================
   FIL VIDÉO
   ===================================================================== */
SCREENS.home = async () => {
  const ov = !!S.override;
  $('#s-home').innerHTML = `<div id="topbar">${ov ? `<button class="ib" onclick="V.go(V.S.prev||'home')" aria-label="Retour">${I.back}</button><div></div><div></div>` :
    `<button class="loc" onclick="V.openLoc()">${esc(locLabel())} ▾</button><div class="tabs"><button class="${S.tab === 'abo' ? 'on' : ''}" onclick="V.setTab('abo')">Abonnements</button><button class="${S.tab === 'pour' ? 'on' : ''}" onclick="V.setTab('pour')">Pour toi</button></div><div class="rt"><button class="ib" onclick="V.go('discover')" aria-label="Rechercher">${I.search}</button><button class="ib" id="bellBtn" onclick="V.openNotifs()" aria-label="Notifications">${I.bell}${S.notifs ? `<span class="badge">${S.notifs > 99 ? '99+' : S.notifs}</span>` : ''}</button><button class="ib" onclick="V.openMsgs()" aria-label="Messages">${I.chat}${S.unread ? `<span class="badge">${S.unread}</span>` : ''}</button></div>`}</div>
  <button class="mute" onclick="V.toggleMute()" aria-label="Son">${S.muted ? '🔇' : '🔊'}</button><div id="feed"></div>`;
  if (ov) { S.feed = S.override.list; S.feedDone = true; renderSlides(true); setTimeout(() => { const el = document.querySelector(`.slide[data-id="${S.override.start}"]`); if (el) $('#feed').scrollTop = el.offsetTop; }, 30); return; }
  if (S.tab === 'abo' && !uid()) { $('#feed').innerHTML = endSlide('👥', 'Abonnements', 'Connecte-toi pour suivre tes créateurs préférés.', `<button class="btn" style="width:auto;padding:12px 22px" onclick="V.go('auth')">Se connecter</button>`); return; }
  S.feed = []; S.feedOffset = 0; S.feedDone = false;
  $('#feed').innerHTML = `<div class="slide endslide">${loading()}</div>`;
  await loadFeed(true);
};
const endSlide = (e, t, d, btns = '') => `<div class="slide endslide"><div style="font-size:54px">${e}</div><h2 style="margin:10px 0 6px">${t}</h2><p class="mut">${d}</p>${btns}</div>`;
async function loadFeed(first) {
  if (S.feedLoading || S.feedDone) return; S.feedLoading = true;
  try {
    const { data, error } = await sb.rpc('feed', { p_countries: countries(), p_region: regionF(), p_mode: S.tab, p_limit: 10, p_offset: S.feedOffset });
    if (error) throw error;
    // vidéo partagée par lien (#v=...)
    if (first && /^#v=/.test(location.hash)) {
      const id = location.hash.slice(3); const { data: one } = await sb.from('videos_feed').select('*').eq('id', id.split('&')[0]).maybeSingle();
      if (one) { data.unshift(one); }
    }
    const seen = new Set(S.feed.map(v => v.id));
    const fresh = data.filter(v => !seen.has(v.id));
    S.feed.push(...fresh); S.feedOffset += data.length; if (data.length < 10) S.feedDone = true;
    renderSlides(first);
  } catch (e) { fail(e); } finally { S.feedLoading = false; }
}
function slideHTML(v) {
  S.vids.set(v.id, v);
  const mine = v.user_id === uid();
  return `<div class="slide" data-id="${v.id}">
  <div class="vbg" style="background:#0b2540;animation:none"><video src="${esc(v.video_url)}" loop playsinline ${S.muted ? 'muted' : ''} preload="metadata" onloadedmetadata="V.noImg(this)"></video></div>
  ${v.title ? `<div class="vtitle" style="top:auto;bottom:150px">${esc(v.title)}</div>` : ''}
  <div class="vtap" onclick="V.tapVid(event,'${v.id}')" onpointerdown="V.holdStart(event,this)" onpointerup="V.holdEnd(this)" onpointerleave="V.holdEnd(this)" onpointercancel="V.holdEnd(this)" oncontextmenu="return false"></div><div class="pauseIc">▶</div><div class="spd">2x ⏩</div>
  <div class="vprog" onpointerdown="V.seek(event,this)"><i></i></div>
  <div class="rail">
    <div onclick="V.openProfile('${v.user_id}')" style="position:relative">${avatar(v, 46).replace('class="av"', 'class="av" style="border:2px solid #fff"')}${mine || v.following ? '' : `<button class="fol" onclick="event.stopPropagation();V.follow('${v.user_id}',this)" aria-label="Suivre">+</button>`}</div>
    <button class="rb ${v.liked_by_me ? 'on' : ''}" id="lk${v.id}" onclick="V.like('${v.id}')">${I.heart}<span>${fmtN(v.like_count)}</span></button>
    <button class="rb" onclick="V.openComments('${v.id}')">${I.comment}<span id="cc${v.id}">${fmtN(v.comment_count)}</span></button>
    <button class="rb gift" id="gf${v.id}" onclick="V.giftSheet('${v.id}')"><i class="gi">🎁</i><span>${v.gift_coins ? fmtN(v.gift_coins) : 'Cadeau'}</span></button>
    <button class="rb ${v.saved_by_me ? 'on2' : ''}" id="sv${v.id}" onclick="V.save('${v.id}')">${I.bookmark}<span>${v.saved_by_me ? 'Enregistré' : 'Enregistrer'}</span></button>
    <button class="rb ${v.reposted_by_me ? 'on3' : ''}" id="sh${v.id}" onclick="V.shareVid('${v.id}')">${I.share}<span>${v.share_count || v.repost_count ? fmtN((v.share_count || 0) + (v.repost_count || 0)) : 'Partager'}</span></button>
    <button class="rb" onclick="V.vidMore('${v.id}')" style="font-size:22px">⋯</button>
  </div>
  <div class="vinfo">
    <div class="vauth" onclick="V.openProfile('${v.user_id}')">@${esc(v.username)}${v.is_vip ? '<span class="vgold">👑 Gold</span>' : ''}<span class="vloc">📍 ${esc(v.region || C[v.country]?.n || '')}</span></div>
    <div class="vcap">${richText(v.caption)} ${(v.tags || []).map(t => `<b class="tg" onclick="V.openTag('${esc(t)}')">#${esc(t)}</b>`).join(' ')}</div>
    ${v.product_id ? `<button class="vprod" onclick="V.openProduct('${v.product_id}')">🛍️ ${esc(v.product_name)} · ${money(v.product_price, v.product_currency)}</button>` : ''}
    <div class="vsnd" onclick="V.openSound('${esc((v.sound || '').replace(/'/g, '’'))}','${v.user_id}','${esc(v.username)}')">♪ <span class="mq2">${esc(v.sound || 'Son original · @' + v.username)}</span> · ${esc(ago(v.created_at))}${v.view_count ? ' · ▶ ' + fmtN(v.view_count) : ''}</div>
  </div></div>`;
}
function renderSlides(first) {
  const f = $('#feed'); if (!f) return;
  const list = S.feed;
  let end;
  if (!list.length) end = S.tab === 'abo' ? endSlide('👥', 'Aucune vidéo', 'Suis des créateurs depuis « Pour toi » pour voir leurs vidéos ici.', `<button class="btn" style="width:auto;padding:12px 22px" onclick="V.setTab('pour')">Découvrir</button>`)
    : endSlide('🎬', 'Aucune vidéo ici pour l’instant', 'Sois le premier à publier dans ta zone !', `<button class="btn" style="width:auto;padding:12px 22px" onclick="V.go('create')">＋ Publier une vidéo</button><button class="btn ghost" style="width:auto;padding:12px 22px" onclick="V.openLoc()">📍 Changer de zone</button>`);
  else if (S.feedDone) end = endSlide('🎉', 'Tu as tout vu', 'Reviens plus tard ou explore une autre zone.', `<button class="btn" style="width:auto;padding:12px 22px" onclick="V.openLoc()">📍 Changer de zone</button>`);
  else end = `<div class="slide endslide" id="moreSlide">${loading()}</div>`;
  if (first) f.innerHTML = list.map(slideHTML).join('') + end;
  else { const m = $('#moreSlide'); const html = list.filter(v => !f.querySelector(`.slide[data-id="${v.id}"]`)).map(slideHTML).join('') + end; if (m) m.outerHTML = html; else f.insertAdjacentHTML('beforeend', html); }
  observe();
}
/* Vue comptée après 3 secondes de lecture (une par personne, par vidéo et par jour, côté serveur) */
const viewerKey = (() => { try { let k = localStorage.getItem('vibzo_vk'); if (!k) { k = 'v' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('vibzo_vk', k); } return k; } catch (e) { return 'v' + Math.random().toString(36).slice(2, 14); } })();
const viewed = new Set();
function watchView(v, id) {
  if (!id || viewed.has(id) || v._vw) return; v._vw = true;
  const h = () => { if (v.currentTime >= 3 && !viewed.has(id)) { viewed.add(id); v.removeEventListener('timeupdate', h); sb.rpc('record_view', { p_video: id, p_key: viewerKey }).then(() => { }, () => { }); } };
  v.addEventListener('timeupdate', h);
}
/* Barre de progression, appui long = vitesse x2, temps de visionnage */
function bindProg(v, sl) {
  if (v._pg) return; v._pg = true; v._max = 0; const bar = sl.querySelector('.vprog i');
  v.addEventListener('timeupdate', () => { if (v.duration) { const r = v.currentTime / v.duration; if (bar) bar.style.width = (r * 100) + '%'; v._max = Math.max(v._max || 0, r); } });
  v.addEventListener('ended', () => { v._max = 1; });
  v.addEventListener('seeked', () => { if (v.currentTime < 0.3) v._max = Math.max(v._max, 1); });
}
const watched = new Set();
function flushWatch(v, id) { if (!id || watched.has(id) || !v._max || v._max < 0.05) return; watched.add(id); const loops = v._max >= 0.98 ? 1 : v._max; sb.rpc('record_watch', { p_video: id, p_ratio: loops }).then(() => { }, () => { }); }
function seek(e, el) { e.stopPropagation(); const v = el.parentElement.querySelector('video'); if (!v || !v.duration) return; const r = el.getBoundingClientRect(); const go = x => { v.currentTime = Math.max(0, Math.min(1, (x - r.left) / r.width)) * v.duration; }; go(e.clientX); el.classList.add('drag'); const mv = ev => go(ev.clientX), up = () => { el.classList.remove('drag'); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); }
let holdT;
function holdStart(e, el) { clearTimeout(holdT); holdT = setTimeout(() => { const sl = el.parentElement, v = sl.querySelector('video'); if (!v) return; v.playbackRate = 2; sl.classList.add('fast'); el._held = true; }, 450); }
function holdEnd(el) { clearTimeout(holdT); const sl = el.parentElement, v = sl.querySelector('video'); if (v && sl.classList.contains('fast')) { v.playbackRate = 1; sl.classList.remove('fast'); setTimeout(() => { el._held = false; }, 50); } }
/* Texte enrichi : #hashtags et @mentions cliquables */
const richText = t => esc(t || '').replace(/(^|\s)#([\p{L}\p{N}_]{2,40})/gu, (m, a, h) => `${a}<b class="tg" onclick="event.stopPropagation();V.openTag('${h}')">#${h}</b>`).replace(/(^|\s)@([A-Za-z0-9_.]{3,24})/g, (m, a, u) => `${a}<b class="tg" onclick="event.stopPropagation();V.openUser('${u}')">@${u}</b>`);
async function openUser(u) { const { data } = await sb.from('profiles').select('id').eq('username', u.toLowerCase()).maybeSingle(); if (data) openProfile(data.id); else toast('Compte introuvable'); }
function openTag(t) { closeSheet(); S.searchQ = '#' + String(t).toLowerCase(); go('discover'); }
function openSound(sound, userId, username) {
  closeSheet(); if (!sound) { openProfile(userId); return; }
  S.searchQ = '♪' + sound; go('discover');
}
let io;
function observe() {
  if (io) io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (e.target.id === 'moreSlide') { if (e.isIntersecting) loadFeed(false); return; }
    const v = e.target.querySelector('video'); if (!v) return;
    if (e.isIntersecting && S.cur === 'home' && !e.target.classList.contains('paused')) { v.muted = S.muted; v.play().catch(() => { }); watchView(v, e.target.dataset.id); bindProg(v, e.target); } else { v.pause(); v.playbackRate = 1; flushWatch(v, e.target.dataset.id); }
  }), { threshold: .6 });
  document.querySelectorAll('#feed .slide').forEach(s => io.observe(s));
}
function setTab(t) { S.tab = t; go('home'); }
function toggleMute() { S.muted = !S.muted; document.querySelectorAll('#feed video').forEach(v => v.muted = S.muted); $('.mute').textContent = S.muted ? '🔇' : '🔊'; }
let lastTap = 0, tapT;
function tapVid(e, id) {
  if (e.currentTarget._held) return;
  const now = Date.now(), sl = e.currentTarget.parentElement;
  if (now - lastTap < 300) { clearTimeout(tapT); lastTap = 0; const v = S.vids.get(id); if (v && !v.liked_by_me) like(id); const r = sl.getBoundingClientRect(), h = document.createElement('div'); h.className = 'burst'; h.textContent = '❤️'; h.style.left = (e.clientX - r.left) + 'px'; h.style.top = (e.clientY - r.top) + 'px'; sl.appendChild(h); setTimeout(() => h.remove(), 800); return; }
  lastTap = now; tapT = setTimeout(() => { sl.classList.toggle('paused'); const v = sl.querySelector('video'); if (v) sl.classList.contains('paused') ? v.pause() : v.play().catch(() => { }); }, 300);
}
async function like(id) {
  if (!requireAuth('Connecte-toi pour aimer les vidéos.')) return;
  const v = S.vids.get(id); const on = !v.liked_by_me;
  v.liked_by_me = on; v.like_count += on ? 1 : -1;
  const b = $('#lk' + id); if (b) { b.classList.toggle('on', on); b.querySelector('span').textContent = fmtN(v.like_count); }
  const { error } = on ? await sb.from('likes').insert({ user_id: uid(), video_id: id }) : await sb.from('likes').delete().eq('user_id', uid()).eq('video_id', id);
  if (error && !/duplicate/i.test(error.message)) fail(error);
}
async function save(id) {
  if (!requireAuth('Connecte-toi pour enregistrer des vidéos.')) return;
  const v = S.vids.get(id); const on = !v.saved_by_me; v.saved_by_me = on;
  const b = $('#sv' + id); if (b) { b.classList.toggle('on2', on); b.querySelector('span').textContent = on ? 'Enregistré' : 'Enregistrer'; }
  const { error } = on ? await sb.from('saves').insert({ user_id: uid(), video_id: id }) : await sb.from('saves').delete().eq('user_id', uid()).eq('video_id', id);
  if (error && !/duplicate/i.test(error.message)) fail(error); else toast(on ? 'Ajouté à tes favoris 🔖' : 'Retiré des favoris');
}
async function follow(userId, btn) {
  if (!requireAuth('Connecte-toi pour suivre des créateurs.')) return;
  const { error } = await sb.from('follows').insert({ follower_id: uid(), followee_id: userId });
  if (error && !/duplicate/i.test(error.message)) return fail(error);
  S.vids.forEach(v => { if (v.user_id === userId) v.following = true; });
  document.querySelectorAll('.slide').forEach(sl => { const v = S.vids.get(sl.dataset.id); if (v && v.user_id === userId) { const f = sl.querySelector('.fol'); if (f) f.remove(); } });
  if (btn && btn.classList.contains('fol')) btn.remove();
  toast('Abonnement ajouté ✅');
}
let replyTo = null;
const cmHTML = (c, vid, v, child) => `<div class="cm ${child ? 'reply' : ''}" id="c-${c.id}">${avatar(c, child ? 26 : 34)}<div class="grow"><div class="n">${esc(c.display_name)}${v && c.user_id === v.user_id ? ' <span class="crea">Créateur</span>' : ''} · @${esc(c.username)}</div><div class="t">${richText(c.body)}</div>
  <div class="n" style="font-weight:500;margin-top:4px">${ago(c.created_at)} · <button class="mut small" onclick="V.replyC('${c.parent_id || c.id}','${esc(c.username)}')">Répondre</button>${c.user_id === uid() || (v && v.user_id === uid()) ? ` · <button class="mut small" onclick="V.delComment('${c.id}','${vid}')">Supprimer</button>` : uid() ? ` · <button class="mut small" onclick="V.report('comment','${c.id}')">Signaler</button>` : ''}</div>
  ${!child && c.reply_count ? `<button class="morerep" onclick="V.showReplies('${c.id}','${vid}',this)">— Voir ${c.reply_count} réponse${c.reply_count > 1 ? 's' : ''}</button><div id="rep-${c.id}"></div>` : ''}</div>
  <button class="clike ${c.liked_by_me ? 'on' : ''}" onclick="V.likeComment('${c.id}',this)">${I.heart}<span>${c.like_count ? fmtN(c.like_count) : ''}</span></button></div>`;
async function openComments(id) {
  replyTo = null;
  const v = S.vids.get(id);
  sheet(`${fmtN(v ? v.comment_count : 0)} commentaires`, `<div class="clist" id="clist">${loading()}</div><div id="replyBar" class="replybar" style="display:none"></div><form class="cinput" onsubmit="event.preventDefault();V.addComment('${id}')"><input id="cIn" placeholder="${uid() ? 'Ajouter un commentaire… (@ pour mentionner)' : 'Connecte-toi pour commenter'}" maxlength="500" autocomplete="off"><button aria-label="Envoyer">${I.send}</button></form>`);
  const { data, error } = await sb.from('comments_view').select('*').eq('video_id', id).is('parent_id', null).order('like_count', { ascending: false }).order('created_at', { ascending: false }).limit(100);
  if (error) return fail(error);
  $('#clist').innerHTML = data.length ? data.map(c => cmHTML(c, id, v)).join('') : '<p class="mut small" style="text-align:center;padding:20px">Aucun commentaire. Sois le premier !</p>';
}
async function showReplies(cid, vid, btn) {
  const { data, error } = await sb.from('comments_view').select('*').eq('parent_id', cid).order('created_at').limit(100); if (error) return fail(error);
  const v = S.vids.get(vid); $('#rep-' + cid).innerHTML = data.map(c => cmHTML(c, vid, v, true)).join(''); if (btn) btn.remove();
}
function replyC(parentId, username) {
  if (!requireAuth('Connecte-toi pour répondre.')) return;
  replyTo = parentId; const bar = $('#replyBar'); bar.style.display = ''; bar.innerHTML = `Réponse à @${esc(username)} <button onclick="V.cancelReply()">✕</button>`;
  const inp = $('#cIn'); if (!inp.value.startsWith('@' + username)) inp.value = '@' + username + ' ' + inp.value; inp.focus();
}
function cancelReply() { replyTo = null; const bar = $('#replyBar'); if (bar) bar.style.display = 'none'; }
async function likeComment(cid, btn) {
  if (!requireAuth('Connecte-toi pour aimer les commentaires.')) return;
  const on = !btn.classList.contains('on'), sp = btn.querySelector('span'), n = (parseInt(sp.textContent.replace(/\D/g, '')) || 0) + (on ? 1 : -1);
  btn.classList.toggle('on', on); sp.textContent = n > 0 ? fmtN(n) : '';
  const { error } = on ? await sb.from('comment_likes').insert({ user_id: uid(), comment_id: cid }) : await sb.from('comment_likes').delete().eq('user_id', uid()).eq('comment_id', cid);
  if (error && !/duplicate/i.test(error.message)) fail(error);
}
async function addComment(id) {
  if (!requireAuth('Connecte-toi pour commenter.')) return;
  const inp = $('#cIn'), body = inp.value.trim(); if (!body) return;
  inp.disabled = true;
  const { error } = await sb.from('comments').insert({ video_id: id, user_id: uid(), body, parent_id: replyTo });
  inp.disabled = false; if (error) return fail(error);
  inp.value = ''; const v = S.vids.get(id); if (v) { v.comment_count++; const cc = $('#cc' + id); if (cc) cc.textContent = fmtN(v.comment_count); }
  openComments(id);
}
async function delComment(cid, vid) {
  const { error } = await sb.from('comments').delete().eq('id', cid); if (error) return fail(error);
  const el = $('#c-' + cid); if (el) el.remove(); const v = S.vids.get(vid); if (v) { v.comment_count = Math.max(0, v.comment_count - 1); const cc = $('#cc' + vid); if (cc) cc.textContent = fmtN(v.comment_count); }
}
const shareURL = id => { const u = location.origin + location.pathname; const r = S.me ? `?ref=${encodeURIComponent(S.me.username)}` : ''; return u + r + '#v=' + id; };
function shareVid(id) {
  const v = S.vids.get(id), url = shareURL(id), txt = (v.title || v.caption || 'Regarde cette vidéo sur Vibzo 🔥').slice(0, 120);
  const enc = encodeURIComponent, full = enc(txt + ' ' + url);
  const T = [['whatsapp', '💬', 'WhatsApp', '#25D366', `https://wa.me/?text=${full}`], ['facebook', 'f', 'Facebook', '#1877F2', `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`], ['telegram', '✈️', 'Telegram', '#2AABEE', `https://t.me/share/url?url=${enc(url)}&text=${enc(txt)}`], ['x', '𝕏', 'X', '#111', `https://twitter.com/intent/tweet?text=${full}`], ['sms', '✉️', 'SMS', '#34C759', `sms:?&body=${full}`]];
  sheet('Partager', `<div class="shgrid">${T.map(t => `<a href="${t[4]}" target="_blank" rel="noopener" onclick="V.shared('${id}')"><span style="background:${t[3]}">${t[1]}</span>${t[2]}</a>`).join('')}
  <button onclick="V.copyShare('${id}')"><span style="background:#8a9bb0">🔗</span>Copier le lien</button>${navigator.share ? `<button onclick="V.nativeShare('${id}')"><span style="background:#1e9be8">⋯</span>Plus</button>` : ''}</div>
  <div class="slist" style="margin:14px 0 0"><button onclick="V.repost('${id}')"><span class="e">${v.reposted_by_me ? '↩️' : '🔁'}</span>${v.reposted_by_me ? 'Annuler la republication' : 'Republier pour mes abonnés'}<span class="r">${v.repost_count ? fmtN(v.repost_count) : ''}</span></button>${S.me ? `<button onclick="V.inviteSheet()"><span class="e">🎁</span>Inviter des amis · gagne du Gold<span class="r">›</span></button>` : ''}</div>`);
}
function shared(id) { const v = S.vids.get(id); if (v) { v.share_count = (v.share_count || 0) + 1; updShare(id); } sb.rpc('record_share', { p_video: id }).then(() => { }, () => { }); }
function updShare(id) { const v = S.vids.get(id), b = $('#sh' + id); if (v && b) { b.classList.toggle('on3', !!v.reposted_by_me); b.querySelector('span').textContent = fmtN((v.share_count || 0) + (v.repost_count || 0)); } }
async function copyShare(id) { try { await navigator.clipboard.writeText(shareURL(id)); toast('Lien copié 🔗'); } catch (e) { toast(shareURL(id)); } shared(id); closeSheet(); }
async function nativeShare(id) { const v = S.vids.get(id); try { await navigator.share({ title: 'Vibzo', text: v.title || v.caption || 'Regarde cette vidéo sur Vibzo', url: shareURL(id) }); shared(id); closeSheet(); } catch (e) { } }
async function repost(id) {
  if (!requireAuth('Connecte-toi pour republier.')) return;
  const v = S.vids.get(id); const on = !v.reposted_by_me;
  const { error } = on ? await sb.from('reposts').insert({ user_id: uid(), video_id: id }) : await sb.from('reposts').delete().eq('user_id', uid()).eq('video_id', id);
  if (error && !/duplicate/i.test(error.message)) return fail(error);
  v.reposted_by_me = on; v.repost_count = Math.max(0, (v.repost_count || 0) + (on ? 1 : -1)); updShare(id); closeSheet();
  toast(on ? '🔁 Republiée : tes abonnés la verront dans « Abonnements »' : 'Republication annulée');
}
function vidMore(id) {
  const v = S.vids.get(id); const mine = v.user_id === uid();
  sheet('Options', `<div class="slist" style="margin:0"><button onclick="V.downloadVid('${id}')"><span class="e">⬇️</span>Enregistrer / partager la vidéo</button>${mine ? `<button onclick="V.delVideo('${id}')"><span class="e">🗑️</span>Supprimer ma vidéo</button>` : `<button onclick="V.notInterested('${id}')"><span class="e">🚫</span>Pas intéressé</button><button onclick="V.report('video','${id}')"><span class="e">🚩</span>Signaler la vidéo</button><button onclick="V.openProfile('${v.user_id}')"><span class="e">👤</span>Voir le profil</button>`}<button onclick="V.closeSheet();V.speedVid('${id}')"><span class="e">⏩</span>Vitesse de lecture</button><button onclick="V.shareVid('${id}');V.closeSheet()"><span class="e">🔗</span>Partager</button></div>`);
}
/* ---------- Téléchargement avec la signature Vibzo (comme TikTok) ----------
   La vidéo est rejouée dans un canevas avec le logo Vibzo + @créateur qui changent de coin,
   puis un écran de fin de 3 s (logo, barre animée, « @créateur » dans une barre de recherche).
   Partagée sur WhatsApp ou Instagram, chaque vidéo fait connaître Vibzo et son créateur. */
let dlBusy = false, logoImg = null, logoP = null;
const loadLogo = () => logoP || (logoP = new Promise(r => { const i = new Image(); i.onload = () => { logoImg = i; r(i); }; i.onerror = () => r(null); i.src = 'icon-192.png'; }));
function drawOutro(ctx, W, H, t, user) {
  // t de 0 à 1 sur la durée de l'écran de fin
  const u = Math.min(W, H) / 720, e = k => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);
  ctx.fillStyle = '#0b0f1a'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 - 60 * u, s = e(t / 0.25);
  return loadLogo().then(img => {
    ctx.save(); ctx.globalAlpha = s; ctx.translate(cx, cy); ctx.scale(0.6 + 0.4 * s, 0.6 + 0.4 * s);
    const L = 150 * u; if (img) ctx.drawImage(img, -L / 2, -L / 2 - 20 * u, L, L);
    ctx.fillStyle = '#fff'; ctx.font = `800 ${58 * u}px 'Plus Jakarta Sans',sans-serif`; ctx.textAlign = 'center'; ctx.fillText('Vibzo', 0, L / 2 + 50 * u);
    ctx.restore();
    const bw = 420 * u, bh = 56 * u, bx = cx - bw / 2, by = cy + 170 * u;
    if (t < 0.45) { // barre lumineuse qui balaie
      const k = e((t - 0.15) / 0.3), g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
      g.addColorStop(0, '#2ee6d6'); g.addColorStop(Math.max(0.01, k * 0.6), '#ffffff'); g.addColorStop(Math.min(0.99, 0.6 + k * 0.4), '#1e9be8'); g.addColorStop(1, '#0b0f1a');
      ctx.globalAlpha = Math.min(1, t / 0.15); ctx.fillStyle = g; ctx.fillRect(bx, by + bh / 2 - 12 * u, bw * Math.max(0.05, k), 24 * u); ctx.globalAlpha = 1;
    } else { // barre de recherche avec @créateur
      const a = e((t - 0.45) / 0.15); ctx.globalAlpha = a;
      ctx.fillStyle = '#2ee6d6'; roundRect(ctx, bx - 3 * u, by - 3 * u, bw, bh, 12 * u); ctx.fill();
      ctx.fillStyle = '#1e9be8'; roundRect(ctx, bx + 3 * u, by + 3 * u, bw, bh, 12 * u); ctx.fill();
      ctx.fillStyle = '#fff'; roundRect(ctx, bx, by, bw, bh, 12 * u); ctx.fill();
      ctx.fillStyle = '#0b2540'; ctx.font = `600 ${24 * u}px 'Plus Jakarta Sans',sans-serif`; ctx.textAlign = 'left';
      ctx.fillText('🔍  @' + user, bx + 20 * u, by + bh / 2 + 8 * u);
      ctx.fillStyle = '#9fb3c8'; ctx.font = `500 ${22 * u}px 'Plus Jakarta Sans',sans-serif`; ctx.textAlign = 'center';
      ctx.fillText('vibzo.fun', cx, by + bh + 52 * u); ctx.globalAlpha = 1;
    }
  });
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
async function downloadVid(id) {
  closeSheet(); const v = S.vids.get(id); if (!v || dlBusy) return;
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { window.open(v.video_url, '_blank'); return; }
  dlBusy = true; let cancel = false; window.__dlCancel = () => { cancel = true; };
  modal(`<div class="card" style="max-width:320px;width:100%;background:#fff;text-align:center"><div style="font-size:36px">🎬</div><h3>Préparation de la vidéo…</h3><p class="mut small">Ajout de la signature Vibzo. Garde l’écran allumé.</p><div class="rbar"><i id="dlBar" style="width:0"></i></div><div class="mut small" id="dlPct">0 %</div><button class="btn ghost" style="margin-top:10px" onclick="window.__dlCancel()">Annuler</button></div>`);
  const user = v.username, end = () => { dlBusy = false; };
  try {
    const vid = document.createElement('video'); vid.crossOrigin = 'anonymous'; vid.playsInline = true; vid.preload = 'auto'; vid.src = v.video_url;
    await new Promise((ok, ko) => { vid.onloadedmetadata = ok; vid.onerror = () => ko(new Error('Vidéo illisible')); });
    let W = vid.videoWidth || 720, H = vid.videoHeight || 1280; const k = Math.min(1, 1280 / Math.max(W, H)); W = Math.round(W * k / 2) * 2; H = Math.round(H * k / 2) * 2;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    await loadLogo(); try { await document.fonts.load(`800 40px 'Plus Jakarta Sans'`); } catch (e) { }
    const stream = cv.captureStream(30);
    let ac = null; try { ac = new AudioContext(); const src = ac.createMediaElementSource(vid), dest = ac.createMediaStreamDestination(); src.connect(dest); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t)); } catch (e) { vid.muted = true; }
    const mime = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m)) || '';
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined), chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    const done = new Promise(r => { rec.onstop = r; });
    const u = Math.min(W, H) / 720, dur = vid.duration || 15;
    const mark = () => { // logo + @créateur, qui change de coin à mi-vidéo
      const late = vid.currentTime > dur / 2, x = late ? W - 24 * u : 24 * u, y = late ? H - 120 * u : 70 * u;
      ctx.save(); ctx.globalAlpha = 0.85; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 6 * u; ctx.textAlign = late ? 'right' : 'left';
      const L = 40 * u; if (logoImg) ctx.drawImage(logoImg, late ? x - L : x, y - L + 6 * u, L, L);
      ctx.fillStyle = '#fff'; ctx.font = `800 ${30 * u}px 'Plus Jakarta Sans',sans-serif`; ctx.fillText('Vibzo', late ? x - L - 8 * u : x + L + 8 * u, y);
      ctx.font = `600 ${20 * u}px 'Plus Jakarta Sans',sans-serif`; ctx.fillText('@' + user, x, y + 30 * u); ctx.restore();
    };
    rec.start(500); if (ac && ac.state === 'suspended') await ac.resume();
    await vid.play();
    await new Promise((r, ko) => {
      const step = () => { try {
        if (cancel) { vid.pause(); return r(); }
        ctx.drawImage(vid, 0, 0, W, H); mark();
        const p = Math.min(1, vid.currentTime / dur) * 0.85; const b = $('#dlBar'); if (b) { b.style.width = (p * 100) + '%'; $('#dlPct').textContent = Math.round(p * 100) + ' %'; }
        if (vid.ended) return r();
        (vid.requestVideoFrameCallback ? vid.requestVideoFrameCallback(step) : requestAnimationFrame(step));
      } catch (e) { vid.pause(); ko(e); } };
      vid.onended = () => setTimeout(r, 50); step();
    });
    if (!cancel) { // écran de fin : 3 secondes
      const t0 = performance.now();
      await new Promise(r => { const f = async () => { const t = (performance.now() - t0) / 3000; await drawOutro(ctx, W, H, Math.min(1, t), user); const b = $('#dlBar'); if (b) { b.style.width = (85 + 15 * Math.min(1, t)) + '%'; $('#dlPct').textContent = Math.round(85 + 15 * Math.min(1, t)) + ' %'; } if (t >= 1 || cancel) r(); else requestAnimationFrame(f); }; f(); });
    }
    rec.stop(); await done; try { ac && ac.close(); } catch (e) { }
    if (cancel) { closeModal(); toast('Annulé'); return end(); }
    let blob = new Blob(chunks, { type: (mime || 'video/webm').split(';')[0] });
    if (!/avc1/.test(mime)) { $('#dlPct').textContent = 'Conversion en MP4…'; try { blob = await convertVideo(new File([blob], 'v.webm', { type: blob.type })); } catch (e) { } }
    const ext = /mp4/.test(blob.type) ? 'mp4' : 'webm', file = new File([blob], `vibzo-${user}-${id.slice(0, 6)}.${ext}`, { type: blob.type });
    shared(id);
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      modal(`<div class="card" style="max-width:320px;width:100%;background:#fff;text-align:center"><div style="font-size:36px">✅</div><h3>Vidéo prête</h3><p class="mut small">Avec la signature Vibzo et @${esc(user)}.</p><button class="btn" id="dlShare">📤 Partager (WhatsApp, Instagram…)</button><button class="btn ghost" style="margin-top:8px" id="dlSave">⬇️ Enregistrer</button><button class="btn ghost" style="margin-top:8px" onclick="V.closeModal()">Fermer</button></div>`);
      $('#dlShare').onclick = async () => { try { await navigator.share({ files: [file], text: `Vidéo de @${user} sur Vibzo 🔥 ${location.origin}/?ref=${encodeURIComponent((S.me && S.me.username) || user)}#v=${id}` }); } catch (e) { } };
      $('#dlSave').onclick = () => saveBlob(file);
    } else { saveBlob(file); closeModal(); toast('⬇️ Vidéo enregistrée'); }
  } catch (e) { closeModal(); fail(e); }
  end();
}
function saveBlob(file) { const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); }
async function notInterested(id) {
  closeSheet(); if (!requireAuth('Connecte-toi pour personnaliser ton fil.')) return;
  await sb.from('not_interested').insert({ user_id: uid(), video_id: id });
  const el = document.querySelector(`.slide[data-id="${id}"]`); const next = el && el.nextElementSibling;
  if (el) el.remove(); S.feed = S.feed.filter(x => x.id !== id); if (next) next.scrollIntoView();
  toast('On te montrera moins de vidéos comme celle-ci 👍');
}
function speedVid(id) {
  const v = document.querySelector(`.slide[data-id="${id}"] video`); if (!v) return;
  sheet('Vitesse de lecture', `<div class="row" style="gap:8px;flex-wrap:wrap">${[0.5, 1, 1.5, 2].map(r => `<button class="chip ${v.playbackRate === r ? 'on' : ''}" onclick="document.querySelector('.slide[data-id=&quot;${id}&quot;] video').playbackRate=${r};V.closeSheet()">${r}x</button>`).join('')}</div>`);
}
async function delVideo(id) {
  if (!confirmBox('Supprimer définitivement cette vidéo ?', `V.doDelVideo('${id}')`)) return;
}
function confirmBox(text, action) {
  modal(`<div class="card" style="max-width:320px;width:100%;text-align:center;background:#fff"><h3>${esc(text)}</h3><p class="mut small" style="margin-top:6px">Cette action est définitive.</p><button class="btn" style="background:#d81f45" onclick="V.closeModal();${action}">Confirmer</button><button class="btn ghost" onclick="V.closeModal()">Annuler</button></div>`);
  return false;
}
async function doDelVideo(id) {
  closeSheet();
  const { error } = await sb.from('videos').delete().eq('id', id); if (error) return fail(error);
  const v = S.vids.get(id);
  if (v && v.video_url) { const path = v.video_url.split('/storage/v1/object/public/videos/')[1]; if (path) await sb.storage.from('videos').remove([decodeURIComponent(path)]); }
  S.feed = S.feed.filter(x => x.id !== id); const el = document.querySelector(`.slide[data-id="${id}"]`); if (el) el.remove();
  toast('Vidéo supprimée'); if (S.cur === 'profile') go('profile', { user: S.viewUser });
}
function report(type, id) {
  if (!requireAuth('Connecte-toi pour signaler un contenu.')) return;
  sheet('Signaler', `<p class="mut small">Pourquoi signales-tu ce contenu ? L’équipe Vibzo vérifie chaque signalement.</p><div class="slist" style="margin:12px 0 0">${REPORT_REASONS.map((r, i) => `<button onclick="V.sendReport('${type}','${id}',${i})"><span class="e">🚩</span>${esc(r)}</button>`).join('')}</div>`);
}
async function sendReport(type, id, i) {
  const { error } = await sb.from('reports').insert({ reporter_id: uid(), target_type: type, target_id: id, reason: REPORT_REASONS[i] });
  closeSheet(); if (error) return fail(error); toast('Merci, signalement envoyé 🛡️');
}

/* =====================================================================
   RECHERCHE
   ===================================================================== */
let qTimer;
SCREENS.discover = () => {
  const pre = S.searchQ || ''; S.searchQ = null;
  $('#s-discover').innerHTML = `<div class="hdr"><button class="ib" onclick="V.go('home')" aria-label="Retour">${I.back}</button><div class="search">${I.search}<input id="q" placeholder="Rechercher vidéos, #hashtags, @personnes" oninput="V.searchDebounced()" autocomplete="off" value="${esc(pre)}"></div></div><div class="pad" id="trends"></div><div class="pad" id="users"></div><div class="lbl pad" id="dlbl">Vidéos récentes · ${esc(locLabel())}</div><div class="vgrid" id="dres">${loading()}</div>`;
  loadTrends(); search();
};
async function loadTrends() {
  const el = $('#trends'); if (!el) return;
  const q = ($('#q') ? $('#q').value : '').trim();
  if (q) { el.innerHTML = q.startsWith('#') ? `<div class="taghead"><div class="big">#</div><div><b>${esc(q.slice(1))}</b><div class="mut small">Hashtag · publie ta vidéo avec #${esc(q.slice(1))} pour participer au défi</div></div><button class="btn sm" style="width:auto" onclick="V.go('create')">＋ Participer</button></div>` : q.startsWith('♪') ? `<div class="taghead"><div class="big">♪</div><div><b>${esc(q.slice(1))}</b><div class="mut small">Son · toutes les vidéos avec ce son</div></div></div>` : ''; return; }
  const [{ data: tags }, { data: snds }] = await Promise.all([sb.rpc('trending_tags', { p_limit: 12 }), sb.rpc('trending_sounds', { p_limit: 6 })]);
  el.innerHTML = (tags || []).length || (snds || []).length ? `<div class="lbl">🔥 Tendances de la semaine</div><div class="trend">${(tags || []).map((t, i) => `<button onclick="V.openTag('${esc(t.tag)}')"><b>${i < 3 ? ['🥇', '🥈', '🥉'][i] : '#'}</b> ${esc(t.tag)} <span>${fmtN(t.videos)}</span></button>`).join('')}${(snds || []).map(s => `<button onclick="V.openSound('${esc(s.sound.replace(/'/g, '’'))}')">♪ ${esc(s.sound)} <span>${fmtN(s.videos)}</span></button>`).join('')}</div>` : '';
}
function searchDebounced() { clearTimeout(qTimer); qTimer = setTimeout(search, 350); }
async function search() {
  const q = ($('#q') ? $('#q').value : '').trim();
  let vq = sb.from('videos_feed').select('*').eq('status', 'published');
  if (q.startsWith('#') && q.length > 1) vq = vq.contains('tags', [q.slice(1).toLowerCase()]);
  else if (q.startsWith('♪') && q.length > 1) vq = vq.eq('sound', q.slice(1));
  else if (q && !q.startsWith('@')) vq = vq.ilike('caption', `%${q}%`);
  else vq = inScope(vq);
  const [{ data: vids, error }, users] = await Promise.all([
    (q.startsWith('#') || q.startsWith('♪') ? vq.order('view_count', { ascending: false }) : vq).order('created_at', { ascending: false }).limit(30),
    q && !q.startsWith('♪') && !q.startsWith('#') ? sb.from('profile_stats').select('*').ilike('username', `%${q.replace(/^@/, '').toLowerCase()}%`).limit(8) : Promise.resolve({ data: [] }),
  ]);
  if (error) return fail(error);
  $('#users').innerHTML = (users.data || []).length ? `<div class="lbl">Personnes</div>` + users.data.map(u => `<button class="mitem" style="padding:8px 0" onclick="V.openProfile('${u.id}')">${avatar(u, 44)}<div class="grow"><div class="n">${esc(u.display_name)}</div><div class="l">@${esc(u.username)} · ${fmtN(u.followers)} abonnés</div></div></button>`).join('') : '';
  $('#dres').innerHTML = vids.length ? vids.map(v => thumb(v, vids)).join('') : `<div class="empty" style="grid-column:1/-1">Aucune vidéo trouvée.</div>`;
  S._grid = vids; const lb = $('#dlbl'); if (lb) lb.textContent = q ? (q.startsWith('#') || q.startsWith('♪') ? 'Les plus vues' : 'Résultats') : 'Vidéos récentes · ' + locLabel();
  if (q) loadTrends();
}
const thumb = (v) => { S.vids.set(v.id, v); return `<button class="vth" style="${gst(gfor(v.id))}" onclick="V.openGrid('${v.id}')"><video src="${esc(v.video_url)}#t=0.5" muted preload="metadata" playsinline></video><span>${v.view_count ? '▶ ' + fmtN(v.view_count) : '♥ ' + fmtN(v.like_count)}</span></button>`; };
function openGrid(id) { const list = S._grid || [S.vids.get(id)]; S.override = { list, start: id }; go('home', { keepOverride: true }); }

/* =====================================================================
   PUBLIER UNE VIDÉO
   ===================================================================== */
let draft = null;
SCREENS.create = async () => {
  if (!uid()) { $('#s-create').innerHTML = hdr('Publier') + `<div class="empty"><div class="big">🎬</div><p>Crée un compte gratuit pour publier tes vidéos.</p><button class="btn" onclick="V.go('auth')">Se connecter / s’inscrire</button></div>`; return; }
  let prods = [];
  if (S.myShop) { const { data } = await sb.from('products').select('id,name,price,currency').eq('shop_id', S.myShop.id).eq('active', true); prods = data || []; }
  $('#s-create').innerHTML = hdr('Nouvelle vidéo', `<span class="loc">📍 ${esc((C[S.me.country] || {}).f || '')} ${esc(S.me.region || '')}</span>`) + `<div class="pad">
  <label class="up"><input type="file" accept="video/*" style="display:none" onchange="V.pickVid(this)"><div class="big">📹</div><b>${draft ? 'Changer de vidéo' : 'Choisir une vidéo'}</b><div class="mut small" style="margin-top:4px">Depuis ta galerie ou ta caméra · tous formats · 3 minutes maximum</div></label>
  <div class="prev" id="prev" style="${draft ? '' : 'display:none'};background:#0b2540">${draft ? `<video src="${draft.url}" autoplay loop muted playsinline></video>` : ''}</div>
  <div class="field"><label>Titre à l’écran (facultatif)</label><input id="ct" maxlength="80" placeholder="Ex : Mon premier challenge 🔥"></div>
  <div class="field"><label>Description</label><textarea id="cd" rows="2" maxlength="300" placeholder="Décris ta vidéo…"></textarea></div>
  <div class="field"><label>Hashtags</label><input id="ch" placeholder="danse, humour, cuisine"></div>
  ${prods.length ? `<div class="field"><label>🛍️ Taguer un produit de ma boutique</label><select id="cp"><option value="">Aucun</option>${prods.map(p => `<option value="${p.id}">${esc(p.name)} · ${money(p.price, p.currency)}</option>`).join('')}</select></div>` : ''}
  <p class="mut small" style="margin-top:12px">Ta vidéo sera visible par tous dans ta région. Interdit : nudité, violence, arnaques, contenus mettant en scène des mineurs de façon inappropriée.</p>
  <div class="progress" id="prog" style="display:none"><i></i></div>
  <button class="btn" id="pubBtn" onclick="V.publish()">Publier</button></div>`;
};
/* =====================================================================
   CONVERSION VIDÉO : tout format → MP4 H.264 + AAC, 720p max, lisible partout
   (WebCodecs via Mediabunny, chargé seulement au moment de publier)
   ===================================================================== */
async function isHevc(f) {
  const scan = async (b) => /hvc1|hev1/.test(new TextDecoder('latin1').decode(new Uint8Array(await b.arrayBuffer())));
  const n = 2 * 1024 * 1024;
  try { return await scan(f.slice(0, n)) || (f.size > n && await scan(f.slice(Math.max(n, f.size - n)))); } catch (e) { return false; }
}
const HEVC_MSG = 'Ton appareil n’arrive pas à convertir cette vidéo (format HEVC). Dans les réglages de ton appareil photo, désactive « Vidéos haute efficacité / HEVC » (Android) ou choisis « Le plus compatible » (iPhone), puis filme à nouveau. Tu peux aussi publier depuis ton téléphone.';
async function convertVideo(file, onProgress) {
  if (!('VideoEncoder' in window) || !('VideoDecoder' in window)) throw new Error('webcodecs');
  const M = await import('https://cdn.jsdelivr.net/npm/mediabunny@1/+esm');
  const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
  const vt = await input.getPrimaryVideoTrack(); if (!vt) throw new Error('novideo');
  const output = new M.Output({ format: new M.Mp4OutputFormat({ fastStart: 'in-memory' }), target: new M.BufferTarget() });
  const conv = await M.Conversion.init({
    input, output,
    video: { codec: 'avc', width: 720, height: 1280, fit: 'contain', bitrate: 2_000_000, frameRate: 30, forceTranscode: true },
    audio: { codec: 'aac', bitrate: 128_000, numberOfChannels: 2, sampleRate: 44100 },
  });
  if (!conv.isValid || conv.discardedTracks.some(t => t.track.type === 'video')) throw new Error('invalid');
  conv.onProgress = p => onProgress && onProgress(p);
  await conv.execute();
  return new Blob([output.target.buffer], { type: 'video/mp4' });
}
/* Plan B : conversion logicielle (FFmpeg compilé en WebAssembly) quand l'appareil
   ne sait pas lire le format d'origine (ex. HEVC sur ordinateur). Plus lent, mais lit tout. */
let ffmpegP = null;
function loadFfmpeg() {
  if (ffmpegP) return ffmpegP;
  ffmpegP = (async () => {
    const blobURL = async (u, type) => URL.createObjectURL(new Blob([await (await fetch(u)).arrayBuffer()], { type }));
    const { FFmpeg } = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/+esm');
    const base = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
    const ff = new FFmpeg();
    await ff.load({
      classWorkerURL: await blobURL('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm/worker.js/+esm', 'text/javascript'),
      coreURL: await blobURL(base + '/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await blobURL(base + '/ffmpeg-core.wasm', 'application/wasm'),
    });
    return ff;
  })();
  ffmpegP.catch(() => { ffmpegP = null; });
  return ffmpegP;
}
async function convertVideoSoft(file, onProgress) {
  const ff = await loadFfmpeg();
  const onP = e => onProgress && onProgress(Math.max(0, Math.min(1, e.progress || 0)));
  ff.on('progress', onP);
  const inName = 'in.' + ((file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4');
  try {
    await ff.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
    const code = await ff.exec(['-i', inName, '-vf', "scale='min(720,iw)':-2", '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-movflags', '+faststart', 'out.mp4']);
    if (code !== 0) throw new Error('ffmpeg ' + code);
    return new Blob([await ff.readFile('out.mp4')], { type: 'video/mp4' });
  } finally { ff.off('progress', onP); ff.deleteFile(inName).catch(() => { }); ff.deleteFile('out.mp4').catch(() => { }); }
}
function pickVid(inp) {
  const f = inp.files[0]; if (!f) return;
  if (f.size > 500 * 1024 * 1024) { toast('Vidéo trop lourde (500 Mo max).'); return; }
  const url = URL.createObjectURL(f);
  const show = () => { draft = { file: f, url }; const p = $('#prev'); p.style.display = ''; p.innerHTML = `<video src="${url}" autoplay loop muted playsinline></video>`; };
  const probe = document.createElement('video'); probe.preload = 'metadata'; probe.muted = true; probe.src = url;
  probe.onloadedmetadata = () => { if (probe.duration && probe.duration > 185) { toast('Vidéo trop longue (3 minutes max).'); return; } show(); };
  probe.onerror = show;
}
async function publish() {
  if (!draft) return toast('Choisis d’abord une vidéo 📹');
  const btn = $('#pubBtn'); busy(btn, true, 'Envoi en cours…');
  const prog = $('#prog'); prog.style.display = ''; let pct = 5; const bar = prog.querySelector('i');
  const timer = setInterval(() => { pct = Math.min(90, pct + (90 - pct) * 0.08); bar.style.width = pct + '%'; }, 400);
  try {
    let body = draft.file, type = draft.file.type || 'video/mp4', ext = (draft.file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
    clearInterval(timer); btn.innerHTML = '<span class="spin"></span> Préparation de la vidéo…';
    try {
      body = await convertVideo(draft.file, p => { bar.style.width = Math.round(p * 70) + '%'; btn.innerHTML = `<span class="spin"></span> Préparation ${Math.round(p * 100)} %`; });
      type = 'video/mp4'; ext = 'mp4';
    } catch (ce) {
      console.warn('conversion rapide impossible, plan B', ce);
      btn.innerHTML = '<span class="spin"></span> Conversion du format…';
      try {
        body = await convertVideoSoft(draft.file, p => { bar.style.width = Math.round(p * 70) + '%'; btn.innerHTML = `<span class="spin"></span> Conversion ${Math.round(p * 100)} %`; });
        type = 'video/mp4'; ext = 'mp4';
      } catch (se) {
        console.warn('conversion logicielle', se);
        throw new Error('Impossible de préparer cette vidéo. Vérifie ta connexion internet et réessaie, ou choisis une autre vidéo.');
      }
    }
    if (body.size > 50 * 1024 * 1024) throw new Error('Vidéo trop lourde après préparation (50 Mo max). Raccourcis-la.');
    btn.innerHTML = '<span class="spin"></span> Envoi en cours…'; pct = 70; bar.style.width = '70%';
    const timer2 = setInterval(() => { pct = Math.min(95, pct + (95 - pct) * 0.08); bar.style.width = pct + '%'; }, 400);
    const path = `${uid()}/${Date.now()}.${ext}`;
    const { error: upErr } = await sb.storage.from('videos').upload(path, body, { contentType: type, upsert: false });
    clearInterval(timer2);
    if (upErr) throw upErr;
    const { data: pub } = sb.storage.from('videos').getPublicUrl(path);
    const tags = ($('#ch').value || '').toLowerCase().split(/[,\s#]+/).map(t => t.replace(/[^a-z0-9àâäéèêëïîôöùûüç_]/g, '')).filter(Boolean).slice(0, 8);
    const row = { user_id: uid(), video_url: pub.publicUrl, title: $('#ct').value.trim(), caption: $('#cd').value.trim(), tags, country: S.me.country, region: S.me.region, product_id: ($('#cp') && $('#cp').value) || null };
    const { error } = await sb.from('videos').insert(row); if (error) throw error;
    bar.style.width = '100%'; draft = null; toast('Vidéo publiée 🎉');
    S.tab = 'pour'; S.loc = worldLoc(S.me.country); saveLoc();
    go('profile');
  } catch (e) { fail(e); } finally { clearInterval(timer); busy(btn, false); }
}

/* =====================================================================
   EMPLOIS
   ===================================================================== */
SCREENS.jobs = async () => {
  const t = S.jobTab;
  $('#s-jobs').innerHTML = hdr('Emplois', locBtn()) + `<div class="pad"><div class="seg"><button class="${t === 'pourtoi' ? 'on' : ''}" onclick="V.jobTab('pourtoi')">✨ Pour toi</button><button class="${t === 'offres' ? 'on' : ''}" onclick="V.jobTab('offres')">📋 Offres</button><button class="${t === 'cands' ? 'on' : ''}" onclick="V.jobTab('cands')">🙋 Candidats</button><button class="${t === 'mine' ? 'on' : ''}" onclick="V.jobTab('mine')">⭐ Mes annonces</button></div>
  ${t !== 'mine' && t !== 'pourtoi' ? `<div class="row" style="margin-top:10px"><select onchange="V.jobSector(this.value)" style="flex:1"><option value="all">Tous les secteurs</option>${SECTORS.map(s => `<option ${S.jobSector === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>` : ''}
  <div class="row" style="margin-top:10px"><button class="btn sm" onclick="V.postJob()">＋ Publier une offre</button><button class="btn sm ghost" onclick="V.myCV()">📄 Mon profil candidat</button></div>
  <div class="list" id="jlist">${loading()}</div></div>`;
  if (t === 'pourtoi') return renderForYou();
  if (t === 'offres') {
    let q = inScope(sb.from('offers_view').select('*').eq('status', 'open'));
    if (S.jobSector !== 'all') q = q.eq('sector', S.jobSector);
    const { data, error } = await q.order('created_at', { ascending: false }).limit(60); if (error) throw error;
    $('#jlist').innerHTML = data.length ? data.map(jobCard).join('') : `<div class="empty"><div class="big">📋</div>Aucune offre dans cette zone pour l’instant.<br><button class="btn" onclick="V.postJob()">Publier la première offre</button></div>`;
  } else if (t === 'cands') {
    let q = inScope(sb.from('candidates_view').select('*').eq('visible', true));
    if (S.jobSector !== 'all') q = q.eq('sector', S.jobSector);
    const { data, error } = await q.order('updated_at', { ascending: false }).limit(60); if (error) throw error;
    $('#jlist').innerHTML = data.length ? data.map(candCard).join('') : `<div class="empty"><div class="big">🙋</div>Aucun candidat dans cette zone pour l’instant.</div>`;
  } else {
    if (!uid()) { $('#jlist').innerHTML = `<div class="empty">Connecte-toi pour gérer tes annonces.<button class="btn" onclick="V.go('auth')">Se connecter</button></div>`; return; }
    const { data, error } = await sb.from('offers_view').select('*').eq('user_id', uid()).order('created_at', { ascending: false }); if (error) throw error;
    $('#jlist').innerHTML = data.length ? data.map(o => jobCard(o, true)).join('') : `<div class="empty">Tu n’as publié aucune offre.</div>`;
  }
};
const ST = { pending: ['En vérification', 'warn'], open: ['En ligne', 'ok2'], closed: ['Fermée', ''], rejected: ['Refusée', 'bad'], active: ['Active', 'ok2'], suspended: ['Suspendue', 'bad'], new: ['Nouvelle', 'warn'], confirmed: ['Confirmée', 'ok2'], shipped: ['Expédiée', 'ok2'], delivered: ['Livrée', 'ok2'], cancelled: ['Annulée', 'bad'] };
const pill = s => `<span class="pill ${(ST[s] || [])[1] || ''}">${(ST[s] || [s])[0]}</span>`;
function jobCard(o, mine) {
  S.offers.set(o.id, o);
  return `<div class="card job">${o.score ? matchBar(o.score, o.reasons) : ''}<div class="row"><div class="grow" onclick="V.offerDetail('${o.id}')"><div class="t">${esc(o.title)}</div><div class="co">${esc(o.company)}</div></div>${mine ? pill(o.status) : `<span class="mut small">${ago(o.created_at)}</span>`}</div>
  <div class="tags"><span>📍 ${esc(o.region || '')}${o.region ? ', ' : ''}${esc((C[o.country] || {}).n || '')}</span><span>${esc(o.contract)}</span><span>${esc(o.remote)}</span>${o.open_to === 'monde' ? '<span>🌍 Monde entier</span>' : ''}${o.salary ? `<span class="g">${money(o.salary, o.currency)} / mois</span>` : ''}<span>${esc(o.sector)}</span></div>
  <div class="jact">${mine ? `<button class="btn sm" onclick="V.offerApps('${o.id}')">👥 Candidatures (${o.application_count})</button><button class="btn sm ghost" style="width:auto" onclick="V.offerMatches('${o.id}')">✨ Profils suggérés</button>${o.status === 'open' ? `<button class="btn sm ghost" onclick="V.closeOffer('${o.id}')">Fermer</button>` : ''}`
      : `<button class="btn sm ${o.applied_by_me ? 'ghost' : ''}" ${o.applied_by_me || o.user_id === uid() ? 'disabled' : ''} onclick="V.applyJob('${o.id}')">${o.applied_by_me ? 'Candidature envoyée ✓' : o.user_id === uid() ? 'Ton offre' : 'Postuler'}</button><button class="btn sm ghost" style="width:auto" onclick="V.offerDetail('${o.id}')">Détails</button><button class="dots" onclick="V.report('job','${o.id}')">🚩</button>`}</div></div>`;
}
function offerDetail(id) { const o = S.offers.get(id); sheet(esc(o.title), `<div class="co mut">${esc(o.company)} · publié par ${esc(o.poster_name)} ${ago(o.created_at)}</div><div class="tags"><span>📍 ${esc(o.region || '')} ${esc((C[o.country] || {}).n || '')}</span><span>${esc(o.contract)}</span><span>${esc(o.remote)}</span>${o.salary ? `<span class="g">${money(o.salary, o.currency)} / mois</span>` : ''}</div><p style="white-space:pre-wrap;margin-top:14px;line-height:1.5;font-size:14.5px">${esc(o.description || 'Pas de description.')}</p><div class="safety">🛡️<span>Un vrai recruteur ne demande jamais d’argent pour un emploi. Signale toute demande de paiement.</span></div>${o.user_id !== uid() && !o.applied_by_me ? `<button class="btn" onclick="V.applyJob('${o.id}')">Postuler</button>` : ''}`); }
function candCard(c) {
  S.cands.set(c.user_id, c);
  return `<div class="card">${c.score ? matchBar(c.score, c.reasons, c.offer_title) : ''}<div class="row" onclick="V.openProfile('${c.user_id}')">${avatar(c)}<div class="grow"><b>${esc(c.display_name)}</b><div class="mut small">${esc(c.job_title)} · ${c.experience_years} an${c.experience_years > 1 ? 's' : ''} d’expérience</div></div></div>${c.about ? `<p class="small" style="margin-top:8px">${esc(c.about)}</p>` : ''}<div class="tags">${(c.skills || []).map(k => `<span>${esc(k)}</span>`).join('')}<span>📍 ${esc(c.region || (C[c.country] || {}).n || '')}</span><span class="g">Dispo : ${esc(c.availability)}</span>${c.mobility === 'international' ? '<span>✈️ Mobile à l’international</span>' : c.mobility === 'teletravail' ? '<span>💻 Télétravail</span>' : ''}</div>${c.user_id === uid() ? '' : `<div class="jact"><button class="btn sm" onclick="V.contactCand('${c.user_id}')">💬 Contacter</button></div>`}</div>`;
}
const matchBar = (sc, reasons, forOffer) => `<div class="mbar"><div class="mtop"><span class="mpct ${sc >= 70 ? 'hi' : sc >= 50 ? 'mid' : ''}">✨ ${sc} % compatible</span>${forOffer ? `<span class="mut small">pour « ${esc(forOffer)} »</span>` : ''}</div>${(reasons || []).length ? `<div class="mwhy">${reasons.map(r => `<span>✓ ${esc(r)}</span>`).join('')}</div>` : ''}</div>`;
async function renderForYou() {
  const el = $('#jlist');
  if (!uid()) { el.innerHTML = `<div class="card fy"><div style="font-size:40px">✨</div><b>Des offres et des profils choisis pour toi</b><p class="small mut" style="margin-top:6px">Vibzo compare ton métier, tes compétences et ta ville avec les offres et les candidats de ton pays et du monde entier.</p><button class="btn" onclick="V.go('auth')">Se connecter</button></div>`; return; }
  const [cv, offers, sugO, sugC] = await Promise.all([
    sb.from('candidates').select('user_id').eq('user_id', uid()).maybeSingle(),
    sb.from('job_offers').select('id').eq('user_id', uid()).in('status', ['open', 'pending']).limit(1),
    sb.rpc('job_suggestions', { p_limit: 20 }),
    sb.rpc('candidate_suggestions', { p_offer: null, p_limit: 20 }),
  ]);
  const hasCV = !!(cv.data), hasOffers = !!(offers.data && offers.data.length);
  const so = (sugO.data || []), sc = (sugC.data || []).sort((a, b) => b.score - a.score).slice(0, 20);
  let h = '';
  h += `<div class="lbl">🎯 Offres pour toi${hasCV ? ` (${so.length})` : ''}</div>`;
  h += !hasCV ? `<div class="card fy"><b>Tu cherches un travail ?</b><p class="small mut" style="margin-top:4px">Crée ton profil candidat : Vibzo te propose automatiquement les offres qui te correspondent, dans ton pays et partout dans le monde.</p><button class="btn" onclick="V.myCV()">📄 Créer mon profil candidat</button></div>`
    : so.length ? so.map(o => jobCard(o)).join('') : `<div class="card fy"><p class="small">Pas encore d’offre compatible. Ajoute des compétences à ton profil ou choisis « partout dans le monde » / « télétravail » pour élargir.</p><button class="btn ghost" onclick="V.myCV()">Modifier mon profil candidat</button></div>`;
  h += `<div class="lbl" style="margin-top:16px">🙋 Profils pour tes offres${hasOffers ? ` (${sc.length})` : ''}</div>`;
  h += !hasOffers ? `<div class="card fy"><b>Tu recrutes ?</b><p class="small mut" style="margin-top:4px">Publie une offre : Vibzo te suggère automatiquement les meilleurs candidats, près de chez toi ou dans le monde entier.</p><button class="btn" onclick="V.postJob()">＋ Publier une offre</button></div>`
    : sc.length ? sc.map(candCard).join('') : `<div class="card fy"><p class="small">Pas encore de candidat compatible. Ouvre ton offre au « monde entier » ou au télétravail pour en trouver plus.</p></div>`;
  el.innerHTML = h;
}
async function offerMatches(id) {
  const o = S.offers.get(id);
  sheet('✨ Profils suggérés', `<b>${esc(o.title)}</b><div class="mut small">Classés par compatibilité avec ton offre</div><div class="list" id="omx">${loading()}</div>`);
  const { data, error } = await sb.rpc('candidate_suggestions', { p_offer: id, p_limit: 30 }); if (error) return fail(error);
  const list = (data || []).sort((a, b) => b.score - a.score).slice(0, 30);
  $('#omx').innerHTML = list.length ? list.map(c => candCard({ ...c, offer_title: null })).join('') : '<p class="mut small">Aucun candidat compatible pour l’instant. Ouvre l’offre au monde entier ou au télétravail pour élargir la recherche.</p>';
}
function applyJob(id) {
  if (!requireAuth('Connecte-toi pour postuler.')) return;
  const o = S.offers.get(id);
  sheet('Postuler', `<b>${esc(o.title)}</b><div class="mut small">${esc(o.company)}</div><div class="field"><label>Ton message au recruteur</label><textarea id="am" rows="5" maxlength="1000">Bonjour, je suis intéressé(e) par le poste de ${esc(o.title)}. Voici mon profil : </textarea></div><p class="mut small" style="margin-top:8px">Astuce : complète ton profil candidat pour que le recruteur voie tes compétences.</p><button class="btn" id="apBtn" onclick="V.sendApp('${id}')">Envoyer ma candidature</button>`);
}
async function sendApp(id) {
  const btn = $('#apBtn'); busy(btn, true);
  const { data, error } = await sb.rpc('apply_to_offer', { p_offer: id, p_message: $('#am').value.trim() });
  busy(btn, false); if (error) return fail(error);
  closeSheet(); toast('Candidature envoyée ✅'); openChat(data);
}
async function contactCand(userId) {
  if (!requireAuth('Connecte-toi pour contacter un candidat.')) return;
  const { data, error } = await sb.rpc('start_conversation', { p_other: userId, p_kind: 'job', p_title: 'Contact recruteur', p_ref: null });
  if (error) return fail(error); openChat(data);
}
function postJob() {
  if (!requireAuth('Connecte-toi pour publier une offre.')) return;
  const c = C[S.me.country];
  sheet('Publier une offre', `<div class="field"><label>Intitulé du poste</label><input id="jp" maxlength="80" placeholder="Ex : Vendeur(se) en boutique"></div><div class="field"><label>Entreprise</label><input id="jc" maxlength="80" placeholder="Nom de l’entreprise"></div>
  <div class="row"><div class="field grow"><label>Secteur</label><select id="js">${SECTORS.map(s => `<option>${s}</option>`).join('')}</select></div><div class="field grow"><label>Contrat</label><select id="jk">${CONTRACTS.map(s => `<option>${s}</option>`).join('')}</select></div></div>
  <div class="row"><div class="field grow"><label>Mode</label><select id="jt">${REMOTE.map(s => `<option>${s}</option>`).join('')}</select></div><div class="field grow"><label>Salaire / mois (${esc(c.cur)})</label><input id="jsal" type="number" inputmode="numeric" min="0" placeholder="Facultatif"></div></div>
  <div class="field"><label>Région</label><select id="jr">${c.r.map(r => `<option ${r === S.me.region ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select></div>
  <div class="field"><label>Compétences recherchées (séparées par des virgules)</label><input id="jsk" maxlength="200" placeholder="Excel, anglais, permis B"></div>
  <div class="field"><label>Je recrute</label><select id="jo"><option value="pays">📍 Dans mon pays (${esc(c.n)})</option><option value="monde">🌍 Partout dans le monde</option></select></div>
  <div class="field"><label>Description du poste</label><textarea id="jd" rows="5" maxlength="2000" placeholder="Missions, profil recherché, horaires, comment postuler…"></textarea></div>
  <div class="safety">🛡️<span>Les offres sont vérifiées par l’équipe Vibzo avant publication. Il est interdit de demander de l’argent aux candidats.</span></div>
  <button class="btn" id="jBtn" onclick="V.savePost()">Envoyer pour publication</button>`);
}
async function savePost() {
  const title = $('#jp').value.trim(), company = $('#jc').value.trim(); if (title.length < 2 || company.length < 2) return toast('Renseigne le poste et l’entreprise');
  const btn = $('#jBtn'); busy(btn, true);
  const sal = $('#jsal').value;
  const { error } = await sb.from('job_offers').insert({ user_id: uid(), title, company, sector: $('#js').value, contract: $('#jk').value, remote: $('#jt').value, salary: sal ? Number(sal) : null, currency: C[S.me.country].cur, description: $('#jd').value.trim(), country: S.me.country, region: $('#jr').value, skills: $('#jsk').value.split(',').map(x => x.trim()).filter(Boolean).slice(0, 12), open_to: $('#jo').value });
  busy(btn, false); if (error) return fail(error);
  closeSheet(); toast('Offre envoyée ✅ Voici déjà les profils qui lui correspondent.'); S.jobTab = 'pourtoi'; go('jobs');
}
async function myCV() {
  if (!requireAuth('Connecte-toi pour créer ton profil candidat.')) return;
  const { data: c } = await sb.from('candidates').select('*').eq('user_id', uid()).maybeSingle();
  const cc = C[S.me.country];
  sheet('Mon profil candidat', `<div class="field"><label>Métier recherché</label><input id="cm" maxlength="80" value="${esc(c ? c.job_title : '')}" placeholder="Ex : Comptable"></div>
  <div class="row"><div class="field grow"><label>Secteur</label><select id="cs2">${SECTORS.map(s => `<option ${c && c.sector === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div><div class="field" style="width:110px"><label>Expérience</label><input id="ce" type="number" min="0" max="60" inputmode="numeric" value="${c ? c.experience_years : 0}"></div></div>
  <div class="field"><label>Compétences (séparées par des virgules)</label><input id="ck" value="${esc(c ? (c.skills || []).join(', ') : '')}" placeholder="Excel, anglais, vente"></div>
  <div class="field"><label>Disponibilité</label><select id="cdp">${['Immédiate', 'Sous 2 semaines', 'Sous 1 mois', 'En poste, à l’écoute'].map(s => `<option ${c && c.availability === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
  <div class="field"><label>Région</label><select id="cr">${cc.r.map(r => `<option ${(c ? c.region : S.me.region) === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select></div>
  <div class="field"><label>Je cherche un travail</label><select id="cmob"><option value="pays" ${!c || c.mobility === 'pays' ? 'selected' : ''}>📍 Dans mon pays (${esc(cc.n)})</option><option value="international" ${c && c.mobility === 'international' ? 'selected' : ''}>🌍 Partout dans le monde (je peux partir)</option><option value="teletravail" ${c && c.mobility === 'teletravail' ? 'selected' : ''}>💻 En télétravail, pour le monde entier</option></select></div>
  <div class="field"><label>À propos de toi</label><textarea id="ca" rows="3" maxlength="600">${esc(c ? c.about : '')}</textarea></div>
  <label class="check"><input type="checkbox" id="cv" ${!c || c.visible ? 'checked' : ''}> Visible par les recruteurs</label>
  <button class="btn" id="cvBtn" onclick="V.saveCV()">Enregistrer</button>`);
}
async function saveCV() {
  const m = $('#cm').value.trim(); if (m.length < 2) return toast('Indique le métier recherché');
  const btn = $('#cvBtn'); busy(btn, true);
  const row = { user_id: uid(), job_title: m, sector: $('#cs2').value, experience_years: Math.max(0, Math.min(60, +$('#ce').value || 0)), skills: $('#ck').value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 12), availability: $('#cdp').value, about: $('#ca').value.trim(), country: S.me.country, region: $('#cr').value, visible: $('#cv').checked, mobility: $('#cmob').value, updated_at: new Date().toISOString() };
  const { error } = await sb.from('candidates').upsert(row); busy(btn, false); if (error) return fail(error);
  closeSheet(); toast('Profil candidat enregistré ✅ Voici les offres qui te correspondent.'); S.jobTab = 'pourtoi'; go('jobs');
}
async function offerApps(id) {
  const o = S.offers.get(id);
  sheet('Candidatures', `<b>${esc(o.title)}</b><div class="list" id="apps">${loading()}</div>`);
  const { data, error } = await sb.from('applications_view').select('*').eq('offer_id', id).order('created_at', { ascending: false }); if (error) return fail(error);
  $('#apps').innerHTML = data.length ? data.map(a => `<div class="card"><div class="row">${avatar(a, 38)}<div class="grow"><b>${esc(a.display_name)}</b><div class="mut small">@${esc(a.username)} · ${ago(a.created_at)}</div></div></div><p class="small" style="margin-top:8px;white-space:pre-wrap">${esc(a.message)}</p><div class="jact"><button class="btn sm" onclick="V.chatWith('${a.user_id}','job','Candidature : ${esc(o.title.replace(/'/g, '’'))}','${o.id}')">💬 Répondre</button><button class="btn sm ghost" onclick="V.openProfile('${a.user_id}')">Profil</button></div></div>`).join('') : '<p class="mut small">Pas encore de candidature.</p>';
}
async function closeOffer(id) { const { error } = await sb.from('job_offers').update({ status: 'closed' }).eq('id', id); if (error) return fail(error); toast('Offre fermée'); go('jobs'); }
async function chatWith(userId, kind, title, ref) {
  if (!requireAuth()) return;
  const { data, error } = await sb.rpc('start_conversation', { p_other: userId, p_kind: kind, p_title: title, p_ref: ref || null });
  if (error) return fail(error); closeSheet(); openChat(data);
}

/* =====================================================================
   BOUTIQUES
   ===================================================================== */
SCREENS.shop = async () => {
  const sh = S.myShop;
  const banner = !uid() || !sh ? `<div class="sbanner"><div class="big">🛍️</div><div class="grow"><b>Tu as une boutique ?</b><div class="small" style="opacity:.92">Vends tes produits dans tes vidéos, partout dans ta région.</div></div><button class="btn" onclick="V.shopForm()">Ouvrir</button></div>`
    : sh.status === 'pending' ? `<div class="sbanner" style="background:linear-gradient(135deg,#ffd76a,#e0a800);color:#3a2a00"><div class="big">⏳</div><div class="grow"><b>${esc(sh.name)} : en attente d’activation</b><div class="small">L’équipe Vibzo te contacte pour activer ton abonnement Vendeur.</div></div><button class="btn" onclick="V.myShopSheet()">Gérer</button></div>`
      : sh.status === 'suspended' ? `<div class="sbanner" style="background:#d81f45"><div class="big">⛔</div><div class="grow"><b>${esc(sh.name)} : suspendue</b><div class="small">Contacte l’équipe Vibzo.</div></div></div>`
        : `<div class="sbanner"><div class="big">🏪</div><div class="grow"><b>${esc(sh.name)}</b><div class="small" style="opacity:.92">Boutique active${sh.paid_until ? ' jusqu’au ' + new Date(sh.paid_until).toLocaleDateString('fr-FR') : ''}</div></div><button class="btn" onclick="V.myShopSheet()">Gérer</button></div>`;
  $('#s-shop').innerHTML = hdr('Boutiques', `${locBtn()}<button class="ib" onclick="V.go('orders')" aria-label="Commandes">${I.box}</button>`) + banner + `<div class="lbl pad">Produits · ${esc(locLabel())}</div><div class="pgrid" id="pgrid">${loading()}</div>`;
  const { data, error } = await inScope(sb.from('products_view').select('*').eq('active', true)).order('created_at', { ascending: false }).limit(60);
  if (error) throw error;
  $('#pgrid').innerHTML = data.length ? data.map(prodCard).join('') : `<div class="empty" style="grid-column:1/-1"><div class="big">🛍️</div>Aucun produit dans cette zone pour l’instant.</div>`;
};
const prodImg = p => p.image_url ? `<img class="thumbimg" src="${esc(p.image_url)}" alt="" loading="lazy">` : '🛍️';
function prodCard(p) { S.prods.set(p.id, p); return `<button class="prod" onclick="V.openProduct('${p.id}')"><div class="im" style="${gst(gfor(p.id))}">${prodImg(p)}</div><div class="bd"><div class="n">${esc(p.name)}</div><div class="p">${money(p.price, p.currency)}</div><div class="s">${esc(p.shop_name)} · ${esc(p.region || '')}</div></div></button>`; }
async function openProduct(id) {
  let p = S.prods.get(id);
  if (!p) { const { data, error } = await sb.from('products_view').select('*').eq('id', id).maybeSingle(); if (error || !data) return toast('Produit indisponible'); p = data; S.prods.set(id, p); }
  const mine = p.owner_id === uid();
  const wa = p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour, je suis intéressé(e) par « ' + p.name + ' » vu sur Vibzo.')}` : '';
  sheet(esc(p.shop_name), `<div class="bigim" style="${gst(gfor(p.id))};position:relative;overflow:hidden">${prodImg(p)}</div><h2 style="margin-top:14px;font-size:20px">${esc(p.name)}</h2><div class="row" style="margin-top:6px"><b style="font-size:22px" class="grow">${money(p.price, p.currency)}</b>${p.stock ? `<span class="mut small">${p.stock} en stock</span>` : ''}</div>
  <div class="tags"><span>📍 ${esc(p.region || '')} ${esc((C[p.country] || {}).n || '')}</span><span>💵 Paiement à la livraison</span></div>
  ${p.description ? `<p style="margin-top:12px;font-size:14px;line-height:1.5;white-space:pre-wrap">${esc(p.description)}</p>` : ''}
  ${mine ? '<p class="mut small" style="margin-top:12px">C’est ton produit.</p>' : `<div class="row" style="margin-top:14px"><div class="qty"><button onclick="const e=document.getElementById('pq');e.textContent=Math.max(1,+e.textContent-1)">−</button><span id="pq">1</span><button onclick="const e=document.getElementById('pq');e.textContent=Math.min(99,+e.textContent+1)">+</button></div><button class="btn grow" style="margin:0" onclick="V.orderForm('${p.id}')">Commander</button></div>
  ${wa ? `<a class="btn ghost" href="${wa}" target="_blank" rel="noopener" style="text-decoration:none">💬 Contacter sur WhatsApp</a>` : ''}
  <button class="btn ghost" onclick="V.report('product','${p.id}')">🚩 Signaler</button>`}`);
}
function orderForm(id) {
  if (!requireAuth('Connecte-toi pour commander.')) return;
  const p = S.prods.get(id), q = +($('#pq') ? $('#pq').textContent : 1);
  sheet('Commander', `<div class="citem"><div class="im" style="${gst(gfor(p.id))};position:relative;overflow:hidden">${prodImg(p)}</div><div class="grow"><b>${esc(p.name)}</b><div class="mut small">${q} × ${money(p.price, p.currency)}</div></div><b>${money(p.price * q, p.currency)}</b></div>
  <div class="field"><label>Adresse de livraison</label><textarea id="oa" rows="2" maxlength="300" placeholder="Quartier, rue, repère…"></textarea></div>
  <div class="field"><label>Téléphone</label><input id="op" type="tel" inputmode="tel" value="${esc(S.me.phone || '')}" placeholder="${esc(C[S.me.country].tel)} …"></div>
  <div class="field"><label>Note pour le vendeur (facultatif)</label><input id="on" maxlength="300" placeholder="Taille, couleur, horaires…"></div>
  <div class="safety">💵<span>Paiement à la livraison : tu paies en espèces ou par Mobile Money quand tu reçois le produit.</span></div>
  <button class="btn" id="oBtn" onclick="V.placeOrder('${id}',${q})">Confirmer la commande</button>`);
}
async function placeOrder(id, q) {
  const address = $('#oa').value.trim(), phone = $('#op').value.trim();
  if (address.length < 3) return toast('Indique ton adresse de livraison'); if (phone.replace(/\D/g, '').length < 6) return toast('Indique un numéro de téléphone valide');
  const btn = $('#oBtn'); busy(btn, true);
  const { error } = await sb.rpc('place_order', { p_product: id, p_qty: q, p_address: address, p_phone: phone, p_note: $('#on').value.trim() });
  busy(btn, false); if (error) return fail(error);
  closeSheet(); toast('Commande envoyée au vendeur ✅'); go('orders');
}
function shopForm() {
  if (!requireAuth('Connecte-toi pour ouvrir ta boutique.')) return;
  const sh = S.myShop || {}; const c = C[S.me.country];
  sheet(sh.id ? 'Modifier ma boutique' : 'Ouvrir ma boutique', `${sh.id ? '' : `<div class="card" style="${gbg(GR[0])};border:0;color:#fff"><b style="font-size:16px">Abonnement Vendeur</b><div class="small" style="margin-top:6px;line-height:1.6">✓ Tes produits visibles par toute ta région<br>✓ Produits tagués dans tes vidéos<br>✓ Commandes reçues directement dans Vibzo<br>Ta boutique est activée par l’équipe Vibzo après validation.</div></div>`}
  <div class="field"><label>Nom de la boutique</label><input id="sn" maxlength="50" value="${esc(sh.name || '')}" placeholder="Ex : Bella Mode ${esc(c.r[0])}"></div>
  <div class="field"><label>Description</label><textarea id="sd" rows="2" maxlength="300">${esc(sh.description || '')}</textarea></div>
  <div class="field"><label>Plateforme</label><select id="spl"><option value="vibzo" ${sh.platform === 'vibzo' ? 'selected' : ''}>Boutique sur Vibzo</option><option value="shopify" ${sh.platform === 'shopify' ? 'selected' : ''}>J’ai une boutique Shopify</option><option value="woocommerce" ${sh.platform === 'woocommerce' ? 'selected' : ''}>J’ai une boutique WooCommerce</option></select></div>
  <div class="field"><label>Lien de ta boutique (facultatif)</label><input id="su" inputmode="url" value="${esc(sh.external_url || '')}" placeholder="https://"></div>
  <div class="field"><label>WhatsApp de la boutique</label><input id="sw" type="tel" inputmode="tel" value="${esc(sh.whatsapp || S.me.phone || '')}" placeholder="${esc(c.tel)} …"></div>
  <div class="field"><label>Région</label><select id="sr">${c.r.map(r => `<option ${(sh.region || S.me.region) === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select></div>
  <button class="btn" id="sBtn" onclick="V.saveShop()">${sh.id ? 'Enregistrer' : 'Envoyer ma demande'}</button>`);
}
async function saveShop() {
  const name = $('#sn').value.trim(); if (name.length < 2) return toast('Donne un nom à ta boutique');
  const btn = $('#sBtn'); busy(btn, true);
  const row = { name, description: $('#sd').value.trim(), platform: $('#spl').value, external_url: $('#su').value.trim() || null, whatsapp: $('#sw').value.trim() || null, region: $('#sr').value };
  const res = S.myShop ? await sb.from('shops').update(row).eq('id', S.myShop.id).select().single() : await sb.from('shops').insert({ ...row, owner_id: uid(), country: S.me.country }).select().single();
  busy(btn, false); if (res.error) return fail(res.error);
  S.myShop = res.data; closeSheet(); toast(S.myShop.status === 'pending' ? 'Demande envoyée ✅ L’équipe Vibzo va te contacter.' : 'Boutique enregistrée ✅'); go('shop');
}
async function myShopSheet() {
  const sh = S.myShop;
  sheet('🏪 ' + esc(sh.name), `<div class="row"><span class="grow">${pill(sh.status)}</span><button class="chip" onclick="V.shopForm()">✏️ Modifier</button></div>
  ${sh.status === 'pending' ? `<p class="small" style="margin-top:10px">Tu peux déjà ajouter tes produits. Ils seront visibles dès l’activation de ta boutique.${SUPPORT_WHATSAPP ? ` <a href="https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Bonjour, je souhaite activer ma boutique Vibzo « ' + sh.name + ' ».')}" target="_blank" rel="noopener">Contacter l’équipe sur WhatsApp</a>` : ''}</p>` : ''}
  ${sh.status !== 'active' ? `<div class="card" style="margin-top:12px"><b>Activer ma boutique (abonnement Vendeur)</b>${goldBlock('vendeur')}</div>` : ''}<div class="lbl">Mes produits</div><div id="myProds">${loading()}</div>
  <div class="lbl">Ajouter un produit</div>
  <div class="field"><input id="pn" maxlength="80" placeholder="Nom du produit"></div>
  <div class="row"><div class="field grow"><input id="pp" type="number" inputmode="decimal" min="0" placeholder="Prix (${esc(C[sh.country].cur)})"></div><div class="field" style="width:110px"><input id="ps" type="number" inputmode="numeric" min="0" placeholder="Stock"></div></div>
  <div class="field"><textarea id="pd" rows="2" maxlength="600" placeholder="Description (taille, matière, couleur…)"></textarea></div>
  <div class="field"><label>Photo</label><input id="pi" type="file" accept="image/jpeg,image/png,image/webp"></div>
  <button class="btn" id="paBtn" onclick="V.addProd()">＋ Ajouter le produit</button>
  <button class="btn ghost" onclick="V.closeSheet();V.go('orders')">📦 Commandes reçues</button>`);
  loadMyProds();
}
async function loadMyProds() {
  const { data, error } = await sb.from('products').select('*').eq('shop_id', S.myShop.id).order('created_at', { ascending: false }); if (error) return fail(error);
  $('#myProds').innerHTML = data.length ? data.map(p => `<div class="citem"><div class="im" style="${gst(gfor(p.id))};position:relative;overflow:hidden">${prodImg(p)}</div><div class="grow"><b style="font-size:14px">${esc(p.name)}</b><div class="mut small">${money(p.price, p.currency)} · stock ${p.stock}</div></div><button class="chip" onclick="V.toggleProd('${p.id}',${!p.active})">${p.active ? 'Masquer' : 'Afficher'}</button><button class="chip" onclick="V.delProd('${p.id}')">🗑️</button></div>`).join('') : '<p class="mut small">Aucun produit pour l’instant.</p>';
}
async function uploadImage(file) {
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error('Image trop lourde (5 Mo max)');
  const ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `${uid()}/${Date.now()}.${ext}`;
  const { error } = await sb.storage.from('images').upload(path, file, { contentType: file.type, upsert: false }); if (error) throw error;
  return sb.storage.from('images').getPublicUrl(path).data.publicUrl;
}
async function addProd() {
  const name = $('#pn').value.trim(), price = Number($('#pp').value);
  if (name.length < 2 || !(price >= 0) || $('#pp').value === '') return toast('Nom et prix requis');
  const btn = $('#paBtn'); busy(btn, true);
  try {
    const image_url = await uploadImage($('#pi').files[0]);
    const { error } = await sb.from('products').insert({ shop_id: S.myShop.id, name, price, currency: C[S.myShop.country].cur, stock: Math.max(0, +$('#ps').value || 0), description: $('#pd').value.trim(), image_url });
    if (error) throw error;
    ['pn', 'pp', 'ps', 'pd'].forEach(i => $('#' + i).value = ''); $('#pi').value = '';
    toast('Produit ajouté ✅'); loadMyProds();
  } catch (e) { fail(e); } finally { busy(btn, false); }
}
async function toggleProd(id, on) { const { error } = await sb.from('products').update({ active: on }).eq('id', id); if (error) return fail(error); loadMyProds(); }
async function delProd(id) { const { error } = await sb.from('products').delete().eq('id', id); if (error) return fail(error); toast('Produit supprimé'); loadMyProds(); }

/* ---------- commandes ---------- */
let orderTab = 'buy';
SCREENS.orders = async () => {
  if (!uid()) { $('#s-orders').innerHTML = hdr('Commandes', '', 'shop') + `<div class="empty">Connecte-toi pour voir tes commandes.<button class="btn" onclick="V.go('auth')">Se connecter</button></div>`; return; }
  $('#s-orders').innerHTML = hdr('Commandes', '', 'shop') + `<div class="pad">${S.myShop ? `<div class="seg"><button class="${orderTab === 'buy' ? 'on' : ''}" onclick="V.orderTab('buy')">🛒 Mes achats</button><button class="${orderTab === 'sell' ? 'on' : ''}" onclick="V.orderTab('sell')">🏪 Reçues</button></div>` : ''}<div class="list" id="olist">${loading()}</div></div>`;
  const sell = orderTab === 'sell' && S.myShop;
  const { data, error } = await sb.from('orders_view').select('*').eq(sell ? 'seller_id' : 'buyer_id', uid()).order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  $('#olist').innerHTML = data.length ? data.map(o => { S.orders.set(o.id, o); return `<div class="card"><div class="row"><div class="grow"><b>${esc(o.product_name)}</b> × ${o.quantity}<div class="mut small">${sell ? 'Client : ' + esc(o.buyer_name) : esc(o.shop_name)} · ${ago(o.created_at)}</div></div>${pill(o.status)}</div><div class="tags"><span class="g">${money(o.total, o.currency)}</span><span>💵 À la livraison</span></div>${sell ? `<p class="small" style="margin-top:8px">📍 ${esc(o.address)}<br>📞 ${esc(o.phone)}${o.note ? '<br>📝 ' + esc(o.note) : ''}</p><div class="jact"><select onchange="V.setOrder('${o.id}',this.value)" style="flex:1">${['new', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${ST[s][0]}</option>`).join('')}</select><button class="btn sm" style="width:auto" onclick="V.chatWith('${o.buyer_id}','shop','Commande : ${esc(o.product_name.replace(/'/g, '’'))}','${o.id}')">💬</button></div>` : `<div class="jact">${o.status === 'new' ? `<button class="btn sm ghost" onclick="V.setOrder('${o.id}','cancelled')">Annuler</button>` : ''}<button class="btn sm" onclick="V.chatWith('${o.seller_id}','shop','Commande : ${esc(o.product_name.replace(/'/g, '’'))}','${o.id}')">💬 Vendeur</button></div>`}</div>`; }).join('') : `<div class="empty"><div class="big">📦</div>Aucune commande pour l’instant.</div>`;
};
async function setOrder(id, st) { const { error } = await sb.from('orders').update({ status: st }).eq('id', id); if (error) return fail(error); toast('Commande : ' + ST[st][0]); go('orders'); }

/* =====================================================================
   PROFIL
   ===================================================================== */
SCREENS.profile = async () => {
  const id = S.viewUser || uid();
  if (!id) { $('#s-profile').innerHTML = hdr('Profil') + `<div class="empty"><div class="big">👤</div><p>Crée ton compte pour publier, suivre des créateurs, postuler et vendre.</p><button class="btn" onclick="V.go('auth')">Se connecter / s’inscrire</button></div><div class="slist"><button onclick="V.openLoc()"><span class="e">📍</span>Pays & région<span class="r">${esc(locLabel())} ›</span></button><button onclick="V.langSheet()"><span class="e">🌐</span>Langue<span class="r">${LANGS[getLang()]} ›</span></button><button onclick="V.installApp()"><span class="e">📲</span>Installer l’application<span class="r">›</span></button><button onclick="window.open('privacy.html','_blank')"><span class="e">🔒</span>Confidentialité<span class="r">›</span></button></div>`; return; }
  const own = id === uid();
  $('#s-profile').innerHTML = hdr('Profil', own ? `<button class="ib" onclick="V.openMsgs()" aria-label="Messages">${I.chat}${S.unread ? `<span class="badge">${S.unread}</span>` : ''}</button><button class="ib" onclick="V.settings()" aria-label="Paramètres">${I.gear}</button>` : '', own ? '' : (S.prev && S.prev !== 'profile' ? S.prev : 'home')) + loading();
  const { data: p, error } = await sb.from('profile_stats').select('*').eq('id', id).maybeSingle();
  if (error) throw error; if (!p) { $('#s-profile').innerHTML = hdr('Profil', '', 'home') + '<div class="empty">Profil introuvable.</div>'; return; }
  const tab = own ? S.profTab : 'videos';
  $('#s-profile').innerHTML = hdr('@' + esc(p.username), own ? `<button class="ib" onclick="V.openMsgs()" aria-label="Messages">${I.chat}${S.unread ? `<span class="badge">${S.unread}</span>` : ''}</button><button class="ib" onclick="V.settings()" aria-label="Paramètres">${I.gear}</button>` : `<button class="ib" onclick="V.report('profile','${p.id}')" aria-label="Signaler">🚩</button>`, own ? '' : (S.prev && S.prev !== 'profile' ? S.prev : 'home')) + `
  <div class="ptop"><div class="pav ${p.is_vip ? 'gold' : ''}" style="${p.avatar_url ? '' : gbg(gfor(p.username))}">${p.avatar_url ? `<img class="avimg" src="${esc(p.avatar_url)}" alt="">` : esc(p.display_name[0].toUpperCase())}${p.is_vip ? '<span class="gb">👑</span>' : ''}</div>
  <h2 style="margin-top:12px;font-size:19px">${esc(p.display_name)}${p.is_creator ? ' <span class="crb">💰 Créateur</span>' : ''}</h2>${p.bio ? `<p class="mut" style="font-size:14px;margin-top:4px">${esc(p.bio)}</p>` : ''}
  <div class="tags" style="justify-content:center"><span>📍 ${esc(p.region || '')} ${esc((C[p.country] || {}).f || '')} ${esc((C[p.country] || {}).n || '')}</span>${p.is_vip ? '<span style="color:#a87800">👑 Gold</span>' : ''}</div>
  ${socials(p)}
  <div class="pstats"><div><b>${fmtN(p.following)}</b><span>Abonnements</span></div><div><b>${fmtN(p.followers)}</b><span>Abonnés</span></div><div><b>${fmtN(p.likes_received)}</b><span>J’aime</span></div><div><b>${fmtN(p.views || 0)}</b><span>Vues</span></div></div>
  ${own ? startChecklist(p) : ''}
  ${own ? `<button class="crcta" onclick="V.creatorSheet()">💰 <b>Programme Créateurs</b> · gagne de l’argent avec tes vidéos ›</button>` : ''}
  <div class="pbtns">${own ? `<button class="btn sm ghost grow" onclick="V.editProfile()">Modifier le profil</button><button class="btn sm ghost" style="width:auto" onclick="V.go('orders')">📦 Commandes</button>`
      : `<button class="btn sm grow ${p.followed_by_me ? 'ghost' : ''}" onclick="V.toggleFollow('${p.id}',${p.followed_by_me})">${p.followed_by_me ? 'Abonné ✓' : 'Suivre'}</button><button class="btn sm ghost grow" onclick="V.chatWith('${p.id}','dm','',null)">💬 Message</button>`}</div></div>
  ${own ? `<div class="ptabs"><button class="${tab === 'videos' ? 'on' : ''}" onclick="V.profTab('videos')">Mes vidéos</button><button class="${tab === 'saved' ? 'on' : ''}" onclick="V.profTab('saved')">Favoris</button></div>` : '<div class="ptabs"><button class="on">Vidéos</button></div>'}
  <div class="vgrid" id="pgridv">${loading()}</div>`;
  let vids = [];
  if (tab === 'saved') {
    const { data: sv } = await sb.from('saves').select('video_id').eq('user_id', uid()).order('created_at', { ascending: false }).limit(60);
    const ids = (sv || []).map(x => x.video_id);
    if (ids.length) { const { data } = await sb.from('videos_feed').select('*').in('id', ids); vids = data || []; }
  } else {
    const { data, error: e2 } = await sb.from('videos_feed').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(60); if (e2) throw e2; vids = data;
  }
  S._grid = vids;
  $('#pgridv').innerHTML = vids.length ? vids.map(v => thumb(v)).join('') : `<div class="empty" style="grid-column:1/-1">${own && tab === 'videos' ? 'Publie ta première vidéo avec le bouton ＋' : 'Rien ici pour le moment.'}</div>`;
};
const SOC = { instagram: ['Instagram', 'https://instagram.com/', '#E1306C', '📸'], tiktok: ['TikTok', 'https://www.tiktok.com/@', '#111', '🎵'], youtube: ['YouTube', 'https://www.youtube.com/@', '#FF0000', '▶️'] };
const socials = p => { const l = Object.keys(SOC).filter(k => p[k]); return l.length ? `<div class="socs">${l.map(k => `<a href="${SOC[k][1]}${encodeURIComponent(p[k])}" target="_blank" rel="noopener" style="background:${SOC[k][2]}">${SOC[k][3]} ${SOC[k][0]}</a>`).join('')}</div>` : ''; };
const cleanHandle = v => (v || '').trim().replace(/^https?:\/\/[^/]+\/(@)?/i, '').replace(/^@/, '').split(/[/?#]/)[0] || null;
function openProfile(id) { closeSheet(); go('profile', { user: id === uid() ? null : id }); if (id === uid()) S.viewUser = null; }
async function toggleFollow(id, on) {
  if (!requireAuth('Connecte-toi pour suivre des créateurs.')) return;
  const { error } = on ? await sb.from('follows').delete().eq('follower_id', uid()).eq('followee_id', id) : await sb.from('follows').insert({ follower_id: uid(), followee_id: id });
  if (error) return fail(error); S.vids.forEach(v => { if (v.user_id === id) v.following = !on; }); go('profile', { user: id });
}
function editProfile() {
  const m = S.me; const c = C[m.country];
  sheet('Modifier le profil', `<div class="field"><label>Photo de profil</label><input id="ei" type="file" accept="image/jpeg,image/png,image/webp"></div>
  <div class="field"><label>Nom</label><input id="en" maxlength="40" value="${esc(m.display_name)}"></div>
  <div class="field"><label>Nom d’utilisateur</label><input id="eu" maxlength="24" value="${esc(m.username)}" pattern="[a-z0-9_.]{3,24}"></div>
  <div class="field"><label>Bio</label><textarea id="eb" rows="3" maxlength="160">${esc(m.bio)}</textarea></div>
  <div class="field"><label>Pays</label><select id="ec" onchange="document.getElementById('er').innerHTML=V.regionOpts(this.value)">${Object.entries(C).map(([k, x]) => `<option value="${k}" ${k === m.country ? 'selected' : ''}>${x.f} ${x.n}</option>`).join('')}</select></div>
  <div class="field"><label>Région</label><select id="er">${regionOpts(m.country, m.region)}</select></div>
  <div class="field"><label>Téléphone</label><input id="et" type="tel" value="${esc(m.phone || '')}" placeholder="${esc(c.tel)} …"></div>
  <div class="lbl">Lier mes autres réseaux</div><p class="mut small" style="margin:-4px 0 8px">Ton nom d’utilisateur (ou le lien de ton profil). Tes abonnés pourront te suivre partout.</p>
  <div class="field"><label>📸 Instagram</label><input id="eig" maxlength="80" value="${esc(m.instagram || '')}" placeholder="ton.compte"></div>
  <div class="field"><label>🎵 TikTok</label><input id="ett" maxlength="80" value="${esc(m.tiktok || '')}" placeholder="toncompte"></div>
  <div class="field"><label>▶️ YouTube</label><input id="eyt" maxlength="80" value="${esc(m.youtube || '')}" placeholder="TaChaine"></div>
  <button class="btn" id="eBtn" onclick="V.saveProfile()">Enregistrer</button>`);
}
const regionOpts = (cc, sel) => C[cc].r.map(r => `<option ${r === sel ? 'selected' : ''}>${esc(r)}</option>`).join('');
async function saveProfile() {
  const btn = $('#eBtn'); busy(btn, true);
  try {
    const row = { display_name: $('#en').value.trim() || S.me.display_name, username: $('#eu').value.trim().toLowerCase(), bio: $('#eb').value.trim(), country: $('#ec').value, region: $('#er').value, phone: $('#et').value.trim() || null, instagram: cleanHandle($('#eig').value), tiktok: cleanHandle($('#ett').value), youtube: cleanHandle($('#eyt').value) };
    if (row.instagram && !/^[A-Za-z0-9_.]{1,30}$/.test(row.instagram)) throw new Error('Nom Instagram invalide');
    if (row.tiktok && !/^[A-Za-z0-9_.]{1,30}$/.test(row.tiktok)) throw new Error('Nom TikTok invalide');
    if (row.youtube && !/^[A-Za-z0-9_.-]{1,40}$/.test(row.youtube)) throw new Error('Nom de chaîne YouTube invalide');
    if (!/^[a-z0-9_.]{3,24}$/.test(row.username)) throw new Error('Nom d’utilisateur : 3 à 24 caractères (lettres, chiffres, . et _)');
    const f = $('#ei').files[0]; if (f) row.avatar_url = await uploadImage(f);
    const { data, error } = await sb.from('profiles').update(row).eq('id', uid()).select(PROFILE_COLS).single();
    if (error) throw (/duplicate|unique/i.test(error.message) ? new Error('Ce nom d’utilisateur est déjà pris') : error);
    data.phone = row.phone; S.me = data; closeSheet(); toast('Profil mis à jour ✅'); go('profile');
  } catch (e) { fail(e); } finally { busy(btn, false); }
}
async function creatorSheet() {
  if (!requireAuth()) return;
  sheet('💰 Programme Créateurs', loading());
  const { data: s, error } = await sb.rpc('creator_stats'); if (error) return fail(error);
  const t = s.thresholds, cur = C[S.me.country].cur;
  const bar = (lbl, v, max) => { const p = Math.min(100, Math.round(v / max * 100)); return `<div class="cbar"><div class="row"><span class="grow">${lbl}</span><b>${fmtN(v)} / ${fmtN(max)}</b></div><div class="track"><i style="width:${p}%;${p >= 100 ? 'background:#12a150' : ''}"></i></div></div>`; };
  const st = { pending: ['⏳ Candidature en cours d’examen', 'warn'], approved: ['✅ Tu fais partie du Programme Créateurs', 'ok2'], rejected: ['Candidature refusée. Continue à publier et réessaie plus tard.', 'bad'], suspended: ['⛔ Compte créateur suspendu. Contacte Vibzo.', 'bad'] }[s.status];
  $('#sheet .sh-b').innerHTML = `<div class="hero" style="margin:0;text-align:center"><div style="font-size:42px">💰</div><h2>Gagne de l’argent avec tes vidéos</h2><p class="small" style="margin-top:6px">Chaque mois, Vibzo partage une partie de ses revenus entre les créateurs du programme, selon les <b>vues</b> de leurs vidéos.</p></div>
  <div class="pstats" style="margin:14px 0"><div><b>${fmtN(s.views_30d)}</b><span>Vues (30 j)</span></div><div><b>${fmtN(s.followers)}</b><span>Abonnés</span></div><div><b>${fmtN(s.likes)}</b><span>J’aime</span></div></div>
  ${st ? `<div class="safety ${st[1]}" style="margin-bottom:10px"><span>${st[0]}</span></div>` : ''}
  ${s.status === 'approved' ? `<div class="card" style="text-align:center"><div class="mut small">Gains à recevoir</div><div style="font-size:26px;font-weight:800;color:#12a150">${money(s.due, cur)}</div><div class="mut small">Total gagné : ${money(s.earned, cur)} · paiement chaque mois sur ton Mobile Money ou compte bancaire</div></div>` : `
  <div class="lbl">Conditions pour rejoindre</div>${bar('👥 Abonnés', s.followers, t.followers)}${bar('👁️ Vues sur 30 jours', s.views_30d, t.views_30d)}${bar('🎬 Vidéos publiées', s.videos, t.videos)}
  <div class="perks" style="margin-top:10px"><div>🔞 <span>Avoir 18 ans ou plus</span></div><div>🎥 <span>Publier tes propres vidéos (pas de copie d’autres créateurs)</span></div><div>🤝 <span>Respecter les règles de la communauté</span></div></div>
  ${s.status === 'pending' ? '' : s.eligible ? `<div class="lbl">Où recevoir tes gains ?</div><div class="field"><select id="crm">${['MTN Mobile Money', 'Orange Money', 'Wave', 'M-Pesa', 'Airtel Money', 'Moov Money', 'Virement bancaire (IBAN)', 'm10 / Birbank'].map(x => `<option>${x}</option>`).join('')}</select></div><div class="field"><input id="crn" maxlength="60" placeholder="Numéro ou IBAN"></div><label class="check"><input type="checkbox" id="cr18"> J’ai 18 ans ou plus et je publie mes propres vidéos.</label><button class="btn gold" id="crBtn" onclick="V.creatorApply()">💰 Rejoindre le Programme Créateurs</button>`
      : `<p class="small mut" style="text-align:center;margin-top:12px">Continue à publier : dès que tu atteins les 3 objectifs, tu pourras envoyer ta candidature ici. 🚀</p>`}`}
  <div class="lbl">Astuces pour grandir</div><div class="perks"><div>🔗 <span>Lie ton Instagram, TikTok et YouTube (Modifier le profil) et partage tes vidéos Vibzo</span></div><div>⏱️ <span>Publie régulièrement, 1 vidéo par jour si possible</span></div><div>#️⃣ <span>Utilise des hashtags et réponds aux commentaires</span></div></div>`;
}
async function creatorApply() {
  const n = $('#crn').value.trim(); if (n.length < 4) return toast('Indique ton numéro ou ton IBAN'); if (!$('#cr18').checked) return toast('Coche la case pour continuer');
  const btn = $('#crBtn'); busy(btn, true);
  const { error } = await sb.rpc('creator_apply', { p_method: $('#crm').value, p_number: n }); busy(btn, false); if (error) return fail(error);
  toast('Candidature envoyée ✅'); creatorSheet();
}
function settings() {
  const vip = S.me.vip_until && new Date(S.me.vip_until) > new Date();
  sheet('Paramètres', `<div class="slist" style="margin:0">
  <button onclick="V.openLoc()"><span class="e">📍</span>Pays & région<span class="r">${esc(locLabel())} ›</span></button>
  <button onclick="V.gold()"><span class="e">👑</span>Vibzo Gold<span class="r">${vip ? 'Actif jusqu’au ' + new Date(S.me.vip_until).toLocaleDateString('fr-FR') : 'Découvrir'} ›</span></button>
  <button onclick="V.closeSheet();${S.myShop ? 'V.myShopSheet()' : 'V.shopForm()'}"><span class="e">🏪</span>Ma boutique<span class="r">${S.myShop ? (ST[S.myShop.status] || [''])[0] : 'Ouvrir'} ›</span></button>
  <button onclick="V.myCV()"><span class="e">📄</span>Mon profil candidat<span class="r">›</span></button>
  <button onclick="V.creatorSheet()"><span class="e">💰</span>Programme Créateurs<span class="r">›</span></button>
  <button onclick="V.mfaSheet()"><span class="e">🔐</span>Validation en 2 étapes<span class="r">${S.mfaOn ? '✅ activée' : 'conseillé ›'}</span></button>
  <button onclick="V.walletSheet()"><span class="e">💰</span>Mon portefeuille<span class="r">pièces et gains ›</span></button>
  <button onclick="V.inviteSheet()"><span class="e">🎁</span>Inviter des amis<span class="r">3 amis = 7 j de Gold ›</span></button>
  <button onclick="V.langSheet()"><span class="e">🌐</span>Langue<span class="r">${LANGS[getLang()]} ›</span></button>
  <button onclick="V.installApp()"><span class="e">📲</span>Installer l’application<span class="r">›</span></button>
  <button onclick="window.open('privacy.html','_blank')"><span class="e">🔒</span>Confidentialité<span class="r">›</span></button>
  ${S.me.role === 'admin' ? `<button onclick="V.closeSheet();V.go('admin')"><span class="e">🛠️</span>Back-office admin<span class="r">›</span></button>` : ''}
  <button onclick="V.logout()"><span class="e">🚪</span>Se déconnecter</button>
  <button onclick="V.deleteAccount()" style="color:#d81f45"><span class="e">🗑️</span>Supprimer mon compte</button></div>
  <p class="mut small" style="text-align:center;margin-top:14px">Connecté : ${esc(S.session.user.email || '')}</p>`);
}
/* =====================================================================
   RENCONTRES (abonnés Gold, 18 ans et plus)
   ===================================================================== */
const isVip = () => !!(S.me && (S.me.role === 'admin' || (S.me.vip_until && new Date(S.me.vip_until) > new Date())));
const PAYZ = { O: ['Orange Money', 'MTN MoMo', 'Wave', 'Moov Money'], C: ['Orange Money', 'MTN MoMo', 'Airtel Money', 'Moov Money'], E: ['M-Pesa', 'Airtel Money', 'MTN MoMo'], A: ['m10', 'Birbank', 'Carte bancaire'] };
const INTENT = { serieux: ['💍', 'Relation sérieuse'], libre: ['🔥', 'Sans lendemain'], les_deux: ['✨', 'Ouvert(e) aux deux'] };
let dScope = 'city', dMode = 'amour', dAge = 'all', dQueue = [], dMe = null, dPhotoIdx = 0;
const subPrice = () => { const cc = payPreviewCc || (S.me && S.me.country) || S.loc.country; const p = SUB_PRICES[C[cc].z] || SUB_PRICES.default; return { ...p, local: C[cc].cur !== 'FCFA' && p.cur === 'FCFA' }; };
const subTotal = m => { const p = subPrice(); return money(p.amount * m, p.cur) + (p.local ? ' (ou l’équivalent en monnaie locale)' : ''); };
function goldBlock(plan = 'gold') {
  const zone = C[(S.me && S.me.country) || S.loc.country].z, p = subPrice();
  return `<div class="card" style="text-align:center;margin:12px 0;background:#f2f9ff"><div class="mut small">Prix</div><div style="font-size:26px;font-weight:800;color:#1e9be8">${money(p.amount, p.cur)} <span style="font-size:14px;font-weight:600">/ mois</span></div></div>
  <div class="field"><label>Durée</label><select id="gMonths" onchange="document.getElementById('gTot').textContent=V.subTotal(+this.value)"><option value="1">1 mois</option><option value="3">3 mois</option><option value="12">12 mois</option></select></div>
  <p class="small" style="text-align:center;margin:-4px 0 10px">Total : <b id="gTot">${subTotal(1)}</b></p>
  <div class="field"><label>Comment veux-tu payer ?</label><select id="gPay">${[...PAYZ[zone], 'Espèces', 'Autre'].map(p => `<option>${p}</option>`).join('')}</select></div>
  <button class="btn gold" id="gBtn" onclick="V.requestSub('${plan}')">${plan === 'gold' ? '👑 Demander l’activation Gold' : '🏪 Demander l’activation Vendeur'}</button>
  <p class="mut small" style="margin-top:8px;text-align:center">Après ta demande, paie le montant et envoie la capture sur WhatsApp. L’abonnement est activé dès réception.</p>`;
}
function goldHero() {
  return `<div class="hero" style="margin:0"><div class="cr">👑</div><h2>Vibzo Gold</h2><div class="perks"><div>💘 <span><b>Rencontres</b> : relation sérieuse ou sans lendemain, entre adultes, par ville, région ou pays</span></div><div>✨ <span>Badge Gold sur ton profil et tes vidéos</span></div><div>🛡️ <span>Profils 18+, signalement et blocage en un clic</span></div></div></div>`;
}
async function requestSub(plan) {
  if (!requireAuth()) return;
  const btn = $('#gBtn'); busy(btn, true);
  if (await autoPay(plan === 'gold' ? 'gold' : 'seller', +$('#gMonths').value)) return;
  const { error } = await sb.from('subscription_requests').insert({ user_id: uid(), plan, months: +$('#gMonths').value, payment: $('#gPay').value });
  busy(btn, false); if (error) return fail(error);
  closeSheet(); if (S.cur === 'dating') go('dating');
  payInfo(plan, +$('#gMonths')?.value || 1, $('#gPay')?.value || '');
}
let payPreviewCc = null;
function previewPay(z) {
  if (z === 'form') { sheet('👑 Vibzo Gold (aperçu)', goldHero() + goldBlock('gold').replace('V.requestSub(', 'V.toast(\'Aperçu : demande non envoyée\');void(')); return; }
  payPreviewCc = z === 'A' ? 'AZ' : 'CM'; payInfo('gold', 1, z === 'A' ? 'm10' : 'MTN MoMo'); payPreviewCc = null;
}
function payInfo(plan, months, pay) {
  const cc = payPreviewCc || (S.me && S.me.country) || S.loc.country, zone = C[cc].z, pi = PAYMENT_INFO[zone];
  const label = plan === 'gold' ? 'Vibzo Gold' : 'Vendeur';
  const msg = `Bonjour Vibzo 👋 Je viens de demander l’abonnement ${label} (${months} mois) depuis ${C[cc].n}. Utilisateur : @${S.me ? S.me.username : ''}. Montant : ${subTotal(months)}. Paiement : ${pay}.`;
  const wa = SUPPORT_WHATSAPP ? `<a class="btn" style="background:#25D366;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;margin-top:12px" href="https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 Écrire à Vibzo sur WhatsApp</a>` : '';
  const momo = pi && pi.momo ? `<div class="card" style="text-align:left;margin-top:12px;background:#fffbe6"><b>Mobile Money</b><div class="small" style="margin-top:6px">${esc(pi.momo)}<br>Numéro : <b style="user-select:all">${esc(pi.number)}</b></div><button class="btn ghost" style="margin-top:8px" onclick="navigator.clipboard&&navigator.clipboard.writeText('${pi.number}').then(()=>V.toast('Numéro copié ✅'))">📋 Copier le numéro</button></div>` : '';
  const bank = pi && pi.iban ? `<div class="card" style="text-align:left;margin-top:12px;background:#f2f9ff"><b>Virement bancaire</b><div class="small" style="margin-top:6px">Banque : <b>${esc(pi.bank)}</b><br>Bénéficiaire : <b>${esc(pi.holder)}</b><br>IBAN : <b style="user-select:all">${esc(pi.iban)}</b></div><button class="btn ghost" style="margin-top:8px" onclick="navigator.clipboard&&navigator.clipboard.writeText('${pi.iban}').then(()=>V.toast('IBAN copié ✅'))">📋 Copier l’IBAN</button></div>` : '';
  modal(`<div class="card" style="max-width:360px;width:100%;background:#fff;text-align:center;max-height:90vh;overflow:auto"><div style="font-size:40px">✅</div><h3>Demande envoyée</h3>
  <div style="font-size:22px;font-weight:800;color:#1e9be8;margin-top:6px">${esc(subTotal(months))}</div><p class="mut small" style="margin-top:6px">1. Paie ce montant (${esc(pay)}${pi && pi.iban ? ' ou virement' : ''}).<br>2. Envoie la capture du paiement sur WhatsApp.<br>3. Ton abonnement ${label} est activé dès réception.</p>${momo}${wa}${bank}
  <button class="btn ghost" style="margin-top:10px" onclick="V.closeModal()">Fermer</button></div>`);
}
function gold() {
  if (!requireAuth()) return;
  const vip = isVip();
  sheet('👑 Vibzo Gold', goldHero() + (vip ? `<p class="small" style="margin-top:14px;text-align:center">✅ Ton abonnement Gold est actif${S.me.vip_until ? ' jusqu’au ' + new Date(S.me.vip_until).toLocaleDateString('fr-FR') : ''}.</p><button class="btn gold" onclick="V.closeSheet();V.go('dating')">💘 Aller aux rencontres</button>` : goldBlock('gold')));
}
SCREENS.dating = async () => {
  const el = $('#s-dating');
  if (!uid()) { el.innerHTML = hdr('💘 Rencontres') + `<div class="empty"><div class="big">💘</div><p>Rencontre des personnes de ta ville, de ta région ou de ton pays.</p><button class="btn" onclick="V.go('auth')">Se connecter / s’inscrire</button></div>`; return; }
  if (!isVip()) {
    const { data: req } = await sb.from('subscription_requests').select('*').eq('user_id', uid()).eq('plan', 'gold').eq('status', 'pending').limit(1);
    el.innerHTML = hdr('💘 Rencontres') + `<div class="pad">${goldHero()}<p class="small" style="margin-top:14px">L’espace rencontres est réservé aux membres <b>Gold</b> de 18 ans et plus.</p>${req && req.length ? `<div class="safety">⏳<span>Ta demande Gold est en cours. L’équipe Vibzo te contacte dans la messagerie.</span></div>` : goldBlock('gold')}</div>`;
    return;
  }
  el.innerHTML = hdr('💘 Rencontres', `<button class="ib" onclick="V.datingForm()" aria-label="Mon profil rencontre">${I.user}</button>`) + `<div class="pad" id="dBody">${loading()}</div>`;
  const { data: me, error } = await sb.from('dating_profiles').select('*').eq('user_id', uid()).maybeSingle();
  if (error) throw error; dMe = me;
  if (!me) {
    $('#dBody').innerHTML = `<div class="card" style="margin-top:6px;text-align:center"><div style="font-size:44px">💘</div><h3 style="margin-top:6px">Crée ton profil de rencontre</h3><p class="mut small" style="margin-top:6px">Il est séparé de ton profil public. Seuls les membres Gold qui ont aussi un profil de rencontre peuvent le voir.</p>
    <div class="perks" style="text-align:left;margin-top:12px"><div>🔞 <span>Réservé aux 18 ans et plus</span></div><div>🤝 <span>Respect et consentement avant tout</span></div><div>🚫 <span>Interdit : nudité, échanges d’argent, prostitution, faux profils</span></div></div>
    <button class="btn" onclick="V.datingForm()">Créer mon profil</button></div>`;
    return;
  }
  renderDating();
};
function datingForm() {
  const m = dMe || {}; const cc = (S.me && S.me.country) || 'CM'; const c = C[cc];
  const maxDate = new Date(); maxDate.setFullYear(maxDate.getFullYear() - 18);
  sheet(m.user_id ? 'Mon profil rencontre' : 'Créer mon profil rencontre', `
  <div class="field"><label>Photo de toi (visage visible)</label>${m.photo_url ? `<img src="${esc(m.photo_url)}" alt="" style="width:90px;height:90px;object-fit:cover;border-radius:14px;display:block;margin-bottom:8px">` : ''}<input id="dPhoto" type="file" accept="image/jpeg,image/png,image/webp"></div>
  <div class="field"><label>Autres photos (jusqu’à 5)</label><div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:6px" id="dExtra">${(m.photos || []).map((u, i) => `<span style="position:relative"><img src="${esc(u)}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:10px"><button type="button" onclick="V.dDelPhoto(${i})" style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;background:#e5484d;color:#fff;font-size:12px">✕</button></span>`).join('')}</div><input id="dPhotos" type="file" accept="image/jpeg,image/png,image/webp" multiple></div>
  <div class="field"><label>Prénom</label><input id="dName" maxlength="30" value="${esc(m.first_name || (S.me && S.me.display_name.split(' ')[0]) || '')}"></div>
  <div class="field"><label>Date de naissance</label><input id="dBirth" type="date" max="${maxDate.toISOString().slice(0, 10)}" value="${esc(m.birth_date || '')}"></div>
  <div class="row"><div class="field grow"><label>Je suis</label><select id="dGender"><option value="homme" ${m.gender === 'homme' ? 'selected' : ''}>Un homme</option><option value="femme" ${m.gender === 'femme' ? 'selected' : ''}>Une femme</option></select></div>
  <div class="field grow"><label>Je cherche</label><select id="dLook"><option value="femme" ${m.looking_for === 'femme' ? 'selected' : ''}>Des femmes</option><option value="homme" ${m.looking_for === 'homme' ? 'selected' : ''}>Des hommes</option><option value="tous" ${m.looking_for === 'tous' ? 'selected' : ''}>Les deux</option></select></div></div>
  <div class="field"><label>Ce que je recherche</label><select id="dIntent">${Object.entries(INTENT).map(([k, v]) => `<option value="${k}" ${m.intent === k ? 'selected' : ''}>${v[0]} ${v[1]}</option>`).join('')}</select></div>
  <div class="row"><div class="field grow"><label>Région</label><select id="dRegion">${c.r.map(r => `<option ${(m.region || (S.me && S.me.region)) === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select></div>
  <div class="field grow"><label>Ville</label><input id="dCity" maxlength="60" list="dCities" value="${esc(m.city || (S.me && S.me.city) || '')}" placeholder="Ex : Douala"><datalist id="dCities">${c.r.map(r => `<option value="${esc(r)}">`).join('')}</datalist></div></div>
  <div class="field"><label>À propos de moi</label><textarea id="dBio" rows="3" maxlength="300" placeholder="Ce que j’aime, ce que je cherche…">${esc(m.bio || '')}</textarea></div>
  <div class="field"><label>Centres d’intérêt (séparés par des virgules)</label><input id="dInt" value="${esc((m.interests || []).join(', '))}" placeholder="Musique, voyage, cuisine"></div>
  <label class="check"><input type="checkbox" id="dVis" ${m.user_id ? (m.visible ? 'checked' : '') : 'checked'}> Mon profil est visible</label>
  <label class="check"><input type="checkbox" id="dAdult" ${m.user_id ? 'checked' : ''}> Je certifie avoir 18 ans ou plus.</label>
  <label class="check"><input type="checkbox" id="dRules" ${m.user_id ? 'checked' : ''}> Je respecte la charte : consentement, respect, aucun échange d’argent, aucune nudité, aucun faux profil.</label>
  <button class="btn" id="dBtn" onclick="V.saveDating()">Enregistrer</button>
  ${m.user_id ? `<button class="btn ghost" onclick="V.deleteDating()">Supprimer mon profil rencontre</button>` : ''}`);
}
async function saveDating() {
  const name = $('#dName').value.trim(), birth = $('#dBirth').value, city = $('#dCity').value.trim();
  if (name.length < 2) return toast('Indique ton prénom'); if (!birth) return toast('Indique ta date de naissance'); if (city.length < 2) return toast('Indique ta ville');
  const b = new Date(birth), n = new Date(); let age = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;
  if (age < 18) return toast('⛔ L’espace rencontres est réservé aux 18 ans et plus.');
  if (!$('#dAdult').checked || !$('#dRules').checked) return toast('Coche les deux cases pour continuer');
  const f = $('#dPhoto').files[0]; if (!f && !(dMe && dMe.photo_url)) return toast('Ajoute une photo de toi');
  const btn = $('#dBtn'); busy(btn, true);
  try {
    const row = { user_id: uid(), first_name: name, birth_date: birth, gender: $('#dGender').value, looking_for: $('#dLook').value, intent: $('#dIntent').value, region: $('#dRegion').value, city, bio: $('#dBio').value.trim(), interests: $('#dInt').value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8), visible: $('#dVis').checked, country: S.me.country };
    row.photo_url = f ? await uploadImage(f) : dMe.photo_url;
    const keep = (dMe && dMe.photos) || [], extra = [...$('#dPhotos').files].slice(0, Math.max(0, 5 - keep.length));
    row.photos = [...keep, ...(await Promise.all(extra.map(uploadImage)))].slice(0, 5);
    const { data, error } = await sb.from('dating_profiles').upsert(row).select().single(); if (error) throw error;
    dMe = data; closeSheet(); toast('Profil rencontre enregistré ✅'); go('dating');
  } catch (e) { fail(e); } finally { busy(btn, false); }
}
function dDelPhoto(i) { if (!dMe) return; dMe.photos = (dMe.photos || []).filter((_, k) => k !== i); const el = $('#dExtra'); if (el) el.children[i] && el.children[i].remove(); toast('Photo retirée (clique sur Enregistrer)'); }
function deleteDating() { confirmBox('Supprimer ton profil rencontre ?', 'V.doDeleteDating()'); }
async function doDeleteDating() { closeSheet(); const { error } = await sb.from('dating_profiles').delete().eq('user_id', uid()); if (error) return fail(error); dMe = null; toast('Profil rencontre supprimé'); go('dating'); }
async function renderDating() {
  const m = dMe, zoneName = ZONES[C[m.country].z];
  const scopes = [['city', '📍 ' + m.city], ['region', m.region || 'Ma région'], ['country', C[m.country].f + ' ' + C[m.country].n], ['zone', '🌍 ' + zoneName]];
  const avail = m.available_until && new Date(m.available_until) > new Date();
  $('#dBody').innerHTML = `<div class="dtabs"><button class="${dMode === 'amour' ? 'on' : ''}" onclick="V.dSet('mode','amour')">💍 Amour</button><button class="${dMode === 'soir' ? 'on soir' : ''}" onclick="V.dSet('mode','soir')">🔥 Ce soir</button></div>
  ${dMode === 'soir' ? `<div class="dispo ${avail ? 'on' : ''}"><div class="grow"><b>${avail ? '🟢 Tu es dispo ce soir' : 'Dispo ce soir ?'}</b><div class="small">${avail ? 'Jusqu’à ' + new Date(m.available_until).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' · tu apparais en premier' : 'Montre aux autres que tu es libre maintenant (6 h)'}</div></div><button class="btn sm" style="width:auto" onclick="V.dDispo(${avail ? 0 : 6})">${avail ? 'Arrêter' : 'Activer'}</button></div>` : ''}
  <div class="row" style="gap:8px;overflow-x:auto;padding:8px 0 4px">${scopes.map(([k, l]) => `<button class="chip ${dScope === k ? 'on' : ''}" style="flex:none" onclick="V.dSet('scope','${k}')">${esc(l)}</button>`).join('')}
  <select onchange="V.dSet('age',this.value)" style="width:auto;flex:none;padding:7px 10px"><option value="all">Tous âges</option>${[['18-25', '18–25 ans'], ['26-35', '26–35 ans'], ['36-45', '36–45 ans'], ['46-99', '46 ans et +']].map(([k, l]) => `<option value="${k}" ${dAge === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  <div id="dLikes"></div><div id="dMatches"></div>
  ${dMode === 'soir' ? `<div class="safety">🔥<span>Entre adultes consentants. Lieu public d’abord, préviens un proche, protège-toi. Aucun échange d’argent : c’est interdit et signalé.</span></div>` : `<div class="safety">🛡️<span>Premier rendez-vous dans un lieu public, préviens un proche. N’envoie jamais d’argent.</span></div>`}
  <div class="stack" id="stack">${loading()}</div><div class="dbtns" id="dBtns"></div>`;
  loadMatches(); loadCandidates();
  sb.rpc('dating_likes_count').then(({ data }) => { const el = $('#dLikes'); if (el && data > 0) el.innerHTML = `<div class="likes-me">💛 <b>${data}</b> ${data > 1 ? 'personnes t’ont liké' : 'personne t’a liké'} · ${data > 1 ? 'elles apparaissent' : 'elle apparaît'} avec le badge « T’a liké »</div>`; }, () => { });
}
async function dDispo(h) { const { data, error } = await sb.rpc('dating_set_available', { p_hours: h }); if (error) return fail(error); dMe.available_until = data; toast(h ? '🟢 Tu es dispo ce soir' : 'Disponibilité désactivée'); renderDating(); }
function dSet(k, v) { if (k === 'scope') dScope = v; if (k === 'mode') dMode = v; if (k === 'age') dAge = v; renderDating(); }
async function loadMatches() {
  const { data } = await sb.from('my_matches').select('*').order('created_at', { ascending: false }).limit(30);
  const el = $('#dMatches'); if (!el) return;
  el.innerHTML = data && data.length ? `<div class="lbl">Tes matchs (${data.length})</div><div class="matches">${data.map(x => `<button onclick="V.openChat('${x.conversation_id}')"><span class="av" style="background:#ccc;overflow:hidden"><img class="avimg" src="${esc(x.photo_url)}" alt=""></span>${esc(x.first_name)}</button>`).join('')}</div>` : '';
}
async function loadCandidates() {
  const m = dMe; const [a1, a2] = dAge === 'all' ? [18, 99] : dAge.split('-').map(Number);
  const countries = dScope === 'zone' ? Object.keys(C).filter(k => C[k].z === C[m.country].z) : [m.country];
  const { data, error } = await sb.rpc('dating_candidates', { p_countries: countries, p_region: dScope === 'region' ? m.region : null, p_city: dScope === 'city' ? m.city : null, p_mode: dMode, p_min_age: a1, p_max_age: a2, p_limit: 20 });
  if (error) return fail(error);
  dQueue = data || []; drawStack();
}
const dPics = d => [d.photo_url, ...(d.photos || [])].filter(Boolean);
function dCard(d, i) {
  const it = INTENT[d.intent] || INTENT.serieux, pics = dPics(d), k = i === 0 ? Math.min(dPhotoIdx, pics.length - 1) : 0;
  return `<div class="dcard ${i === 0 ? 'top' : 'b' + i}" data-id="${d.user_id}" style="background:#0b2540"><img src="${esc(pics[k])}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  ${pics.length > 1 ? `<div class="pdots">${pics.map((_, j) => `<i class="${j === k ? 'on' : ''}"></i>`).join('')}</div>${i === 0 ? '<div class="ptap l" onclick="V.dPhoto(-1)"></div><div class="ptap r" onclick="V.dPhoto(1)"></div>' : ''}` : ''}
  ${i === 0 ? `<button class="more" onclick="V.dMore('${d.user_id}')" style="color:#fff">⋯</button>` : ''}<div class="stamp l">J’AIME</div><div class="stamp n">NON</div><div class="stamp s">SUPER</div>
  <div class="inf">${d.super_me ? '<span class="tag sup">⭐ T’a super-liké</span>' : d.liked_me ? '<span class="tag lk">💛 T’a liké</span>' : ''}${d.available ? '<span class="tag dv">🟢 Dispo ce soir</span>' : ''}
  <div class="nm">${esc(d.first_name)} <small>${d.age}</small>${d.verified ? '<span class="ver">✓</span>' : ''}${d.is_vip ? ' 👑' : ''}</div><div class="small">📍 ${esc(d.city)}${d.region ? ', ' + esc(d.region) : ''}</div><span class="intent" style="background:${d.intent === 'libre' ? 'rgba(255,90,60,.92)' : 'rgba(30,155,232,.9)'}">${it[0]} ${it[1]}</span>${d.bio ? `<div class="bio">${esc(d.bio)}</div>` : ''}${(d.interests || []).length ? `<div class="int">${d.interests.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}</div></div>`;
}
function dPhoto(step) { const d = dQueue[0]; if (!d) return; const n = dPics(d).length; dPhotoIdx = (dPhotoIdx + step + n) % n; drawStack(); }
async function dRewind() { const { data, error } = await sb.rpc('dating_rewind'); if (error) return fail(error); if (!data) return toast('Rien à annuler (seulement les « Non » des 10 dernières minutes)'); toast('↺ Profil récupéré'); loadCandidates(); }
function drawStack() {
  const st = $('#stack'); if (!st) return;
  const top = dQueue.slice(0, 3);
  st.innerHTML = top.length ? top.map((d, i) => dCard(d, i)).reverse().join('') : `<div class="empty card" style="height:100%;display:flex;flex-direction:column;justify-content:center"><div class="big">🌍</div><b>Plus de profils ici pour l’instant</b><p class="small" style="margin-top:6px">Élargis la zone (région, pays) ou reviens plus tard : de nouveaux membres arrivent chaque jour.</p></div>`;
  $('#dBtns').innerHTML = top.length ? `<button class="rw" onclick="V.dRewind()" aria-label="Retour">↺</button><button class="x" onclick="V.dSwipe('pass')" aria-label="Passer">✕</button><button class="st" onclick="V.dSwipe('super')" aria-label="Super Like">★</button><button class="h" onclick="V.dSwipe('like')" aria-label="J’aime">♥</button>` : '';
  bindSwipe();
}
function bindSwipe() {
  const c = document.querySelector('.dcard.top'); if (!c) return; let sx = 0, dx = 0, dr = false;
  c.onpointerdown = e => { if (e.target.closest('.more,.ptap')) return; dr = true; sx = e.clientX; dx = 0; c.setPointerCapture(e.pointerId); c.style.transition = 'none'; };
  c.onpointermove = e => { if (!dr) return; dx = e.clientX - sx; c.style.transform = `translateX(${dx}px) rotate(${dx / 16}deg)`; c.dataset.dir = dx > 40 ? 'like' : dx < -40 ? 'nope' : ''; };
  c.onpointerup = c.onpointercancel = () => { if (!dr) return; dr = false; c.style.transition = ''; if (dx > 100) dSwipe('like'); else if (dx < -100) dSwipe('pass'); else { c.style.transform = ''; c.dataset.dir = ''; } };
}
async function dSwipe(action, target) {
  const c = document.querySelector('.dcard.top'); const id = target || (c && c.dataset.id); if (!id) return;
  if (c && !target) { c.style.transform = action === 'super' ? 'translateY(-600px)' : `translateX(${action === 'like' ? 500 : -500}px) rotate(${action === 'like' ? 25 : -25}deg)`; c.style.opacity = '0'; c.dataset.dir = action === 'super' ? 'super' : action === 'like' ? 'like' : 'nope'; }
  dPhotoIdx = 0;
  const d = dQueue.find(x => x.user_id === id);
  dQueue = dQueue.filter(x => x.user_id !== id);
  setTimeout(drawStack, 250);
  const { data, error } = await sb.rpc('dating_swipe', { p_target: id, p_action: action });
  if (error) { if (d) { dQueue.unshift(d); setTimeout(drawStack, 260); } return fail(error); }
  if (action === 'super' && !(data && data.match)) toast('⭐ Super Like envoyé !');
  if (data && data.match) {
    modal(`<div class="match"><h2>C’est un match !</h2><p class="mut" style="color:#fff">Toi et ${esc(d ? d.first_name : '')} vous êtes plu.</p><div class="pair"><div class="av" style="overflow:hidden">${dMe.photo_url ? `<img class="avimg" src="${esc(dMe.photo_url)}" alt="">` : ''}</div><div class="av" style="overflow:hidden">${d ? `<img class="avimg" src="${esc(d.photo_url)}" alt="">` : ''}</div></div><button class="btn" onclick="V.closeModal();V.openChat('${data.conversation_id}')">💬 Envoyer un message</button><button class="btn ghost" onclick="V.closeModal();V.loadMatchesPub()">Continuer</button></div>`);
  }
}
function dMore(id) {
  sheet('Options', `<div class="slist" style="margin:0"><button onclick="V.dBlock('${id}')"><span class="e">🚫</span>Bloquer ce profil</button><button onclick="V.closeSheet();V.report('dating','${id}')"><span class="e">🚩</span>Signaler ce profil</button><button onclick="V.dSafety()"><span class="e">🛡️</span>Conseils de sécurité</button></div>`);
}
async function dBlock(id) { closeSheet(); await dSwipe('block', id); toast('Profil bloqué'); drawStack(); }
function dSafety() { sheet('Conseils de sécurité', `<div class="perks" style="margin:0">${['☕ Premier rendez-vous dans un lieu public', '📲 Préviens un proche de l’heure et du lieu', '💸 N’envoie jamais d’argent à un match', '🤝 Le consentement est clair, explicite et peut être retiré à tout moment', '🚩 Signale tout comportement abusif ou suspect'].map(t => `<div>${t}</div>`).join('')}</div>`); }

/* =====================================================================
   MESSAGERIE
   ===================================================================== */
function openMsgs() { if (!requireAuth('Connecte-toi pour voir tes messages.')) return; go('msgs'); }
SCREENS.msgs = async () => {
  $('#s-msgs').innerHTML = hdr('Messages', '', S.prev && S.prev !== 'msgs' && S.prev !== 'chat' ? S.prev : 'home') + `<div id="mlist">${loading()}</div>`;
  const { data, error } = await sb.from('conversation_list').select('*').order('last_at', { ascending: false }).limit(100);
  if (error) throw error;
  S.unread = data.filter(c => c.unread).length;
  const tl = { dm: ['Message', 'dm'], job: ['Emploi', 'job'], shop: ['Boutique', 'shop'], match: ['Rencontre', 'match'] };
  $('#mlist').innerHTML = data.length ? data.map(c => `<button class="mitem" onclick="V.openChat('${c.id}')">${avatar({ avatar_url: c.other_avatar, display_name: c.other_name || '?' }, 52)}<div class="grow"><div class="n">${esc(c.other_name || 'Utilisateur')} <span class="typ ${tl[c.kind][1]}">${tl[c.kind][0]}</span></div><div class="l">${c.title ? esc(c.title) + ' · ' : ''}${c.last_body ? (c.last_sender === uid() ? 'Toi : ' : '') + esc(c.last_body) : ''}</div></div>${c.unread ? '<span class="dot"></span>' : `<span class="mut small">${ago(c.last_at)}</span>`}</button>`).join('') : `<div class="empty"><div class="big">💬</div>Aucune conversation.<br><span class="small">Contacte un créateur, un recruteur ou un vendeur pour commencer.</span></div>`;
};
async function openChat(id) { S.chatId = id; go('chat'); }
SCREENS.chat = async () => {
  const id = S.chatId;
  $('#s-chat').innerHTML = `<div class="hdr"><button class="ib" onclick="V.go('msgs')" aria-label="Retour">${I.back}</button><div id="chHead" class="row grow">${loading('')}</div><button class="ib" onclick="V.chatMore()">⋯</button></div><div class="msgs" id="msgs">${loading()}</div>
  <form class="cbar" onsubmit="event.preventDefault();V.sendMsg()"><input id="mIn" placeholder="Écris un message…" autocomplete="off" maxlength="2000"><button aria-label="Envoyer">${I.send}</button></form>`;
  const [{ data: info }, { data: msgs, error }] = await Promise.all([
    sb.from('conversation_list').select('*').eq('id', id).maybeSingle(),
    sb.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true }).limit(300),
  ]);
  if (error) throw error;
  S.chatInfo = info;
  $('#chHead').innerHTML = info ? `<div onclick="V.openProfile('${info.other_id}')" class="row">${avatar({ avatar_url: info.other_avatar, display_name: info.other_name }, 38)}<div class="grow"><b>${esc(info.other_name || '')}</b><div class="mut small">${esc(info.title || '')}</div></div></div>` : '';
  $('#msgs').innerHTML = `<div class="bub sys">🛡️ Ne partage jamais tes codes, mots de passe ou paiements d’avance. Signale tout comportement suspect.</div>` + msgs.map(bubble).join('');
  scrollMsgs();
  sb.rpc('mark_read', { p_conv: id }).then(() => { }, () => { });
  stopChat();
  S.chatSub = sb.channel('conv-' + id).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'conversation_id=eq.' + id }, payload => {
    const m = payload.new; if (document.getElementById('m-' + m.id)) return;
    $('#msgs').insertAdjacentHTML('beforeend', bubble(m)); scrollMsgs(); sb.rpc('mark_read', { p_conv: id }).then(() => { }, () => { });
  }).subscribe();
};
const bubble = m => `<div class="bub ${m.sender_id === uid() ? 'me' : ''}" id="m-${m.id}">${esc(m.body)}<div style="font-size:10.5px;opacity:.7;margin-top:3px;text-align:right">${new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div></div>`;
const scrollMsgs = () => { const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight; };
function stopChat() { if (S.chatSub) { try { sb.removeChannel(S.chatSub); } catch (e) { } S.chatSub = null; } }
async function sendMsg() {
  const inp = $('#mIn'), body = inp.value.trim(); if (!body) return;
  inp.value = '';
  const { data, error } = await sb.from('messages').insert({ conversation_id: S.chatId, sender_id: uid(), body }).select().single();
  if (error) { inp.value = body; return fail(error); }
  if (!document.getElementById('m-' + data.id)) { $('#msgs').insertAdjacentHTML('beforeend', bubble(data)); scrollMsgs(); }
}
function chatMore() { const i = S.chatInfo; sheet('Options', `<div class="slist" style="margin:0">${i ? `<button onclick="V.openProfile('${i.other_id}')"><span class="e">👤</span>Voir le profil</button><button onclick="V.report('profile','${i.other_id}')"><span class="e">🚩</span>Signaler cette personne</button>` : ''}</div>`); }
async function refreshUnread() {
  if (!uid()) return;
  const { data } = await sb.from('conversation_list').select('id,unread').eq('unread', true);
  const n = (data || []).length; if (n !== S.unread) { S.unread = n; if (S.cur === 'home' && !S.override) { const b = document.querySelector('#topbar .rt .ib:last-child'); if (b) b.innerHTML = I.chat + (n ? `<span class="badge">${n}</span>` : ''); } }
}

/* =====================================================================
   NOTIFICATIONS ET PARRAINAGE
   ===================================================================== */
const NT = { like: ['❤️', 'a aimé ta vidéo'], comment: ['💬', 'a commenté :'], reply: ['↩️', 'a répondu à ton commentaire :'], follow: ['👤', 'a commencé à te suivre'], mention: ['@', 't’a mentionné :'], repost: ['🔁', 'a republié ta vidéo'], comment_like: ['💗', 'a aimé ton commentaire'], referral: ['🎁', ''], system: ['📣', ''], gift: ['🎁', 't’a offert'], wallet: ['💰', ''] };
async function refreshNotifs() {
  if (!uid()) return;
  const { count } = await sb.from('notifications').select('id', { count: 'exact', head: true }).eq('read', false);
  const n = count || 0; if (n !== S.notifs) { S.notifs = n; const b = $('#bellBtn'); if (b) b.innerHTML = I.bell + (n ? `<span class="badge">${n > 99 ? '99+' : n}</span>` : ''); }
}
async function openNotifs() {
  if (!requireAuth('Connecte-toi pour voir tes notifications.')) return;
  sheet('🔔 Notifications', `<div id="nlist">${loading()}</div>`);
  const { data, error } = await sb.from('notifications_view').select('*').order('created_at', { ascending: false }).limit(80); if (error) return fail(error);
  $('#nlist').innerHTML = data.length ? data.map(n => { const t = NT[n.type] || NT.system; return `<button class="nrow ${n.read ? '' : 'new'}" onclick="V.openNotif('${n.type}','${n.video_id || ''}','${n.actor_id || ''}')">${n.actor_avatar ? `<img class="avimg" src="${esc(n.actor_avatar)}" alt="" style="width:40px;height:40px;border-radius:50%">` : `<span class="nic">${t[0]}</span>`}<div class="grow" style="text-align:left"><div><b>${esc(n.actor_name || 'Vibzo')}</b> ${t[1]} ${n.body ? `<span class="mut">${richText(n.body)}</span>` : ''}</div><div class="mut small">${ago(n.created_at)}</div></div>${n.video_url ? `<video src="${esc(n.video_url)}#t=0.5" muted preload="metadata" playsinline class="nth"></video>` : ''}</button>`; }).join('') : '<div class="empty"><div class="big">🔔</div><p>Pas encore de notification. Publie, commente et suis des créateurs !</p></div>';
  if (data.some(n => !n.read)) { await sb.from('notifications').update({ read: true }).eq('read', false); S.notifs = 0; const b = $('#bellBtn'); if (b) b.innerHTML = I.bell; }
}
async function openNotif(type, vid, actor) {
  closeSheet(); if (type === 'wallet') { walletSheet(); return; }
  if (vid) { const { data } = await sb.from('videos_feed').select('*').eq('id', vid).maybeSingle(); if (data) { S.override = { list: [data], start: vid }; go('home', { keepOverride: true }); if (type === 'comment' || type === 'reply' || type === 'mention' || type === 'comment_like') setTimeout(() => openComments(vid), 400); return; } }
  if (actor) openProfile(actor);
}
/* Parrainage : ?ref=pseudo dans le lien → 7 jours de Gold pour le parrain tous les 3 amis inscrits */
(() => { try { const r = new URLSearchParams(location.search).get('ref'); if (r && /^[a-z0-9_.]{3,24}$/i.test(r)) localStorage.setItem('vibzo_ref', r.toLowerCase()); } catch (e) { } })();
const pendingRef = () => { try { return localStorage.getItem('vibzo_ref') || ''; } catch (e) { return ''; } };
async function applyRefIfAny() { const r = pendingRef(); if (!r || !S.me || r === S.me.username) return; const { data } = await sb.rpc('set_referrer', { p_username: r }); try { localStorage.removeItem('vibzo_ref'); } catch (e) { } if (data) toast('🎁 Bienvenue ! Ton ami a été remercié.'); }
async function inviteSheet() {
  if (!requireAuth()) return;
  const url = `${location.origin}${location.pathname}?ref=${encodeURIComponent(S.me.username)}`, msg = `Rejoins-moi sur Vibzo 🔥 vidéos, emplois, boutiques et rencontres près de chez toi : ${url}`;
  sheet('🎁 Inviter des amis', `<div class="hero" style="margin:0;text-align:center"><div style="font-size:40px">🎁</div><h2>3 amis = 7 jours de Gold</h2><p class="small" style="margin-top:6px">Chaque fois que 3 amis s’inscrivent avec ton lien, tu reçois <b>7 jours de Vibzo Gold</b> gratuits.</p></div>
  <div class="card" style="text-align:center;margin:12px 0"><div class="mut small">Amis inscrits avec ton lien</div><div style="font-size:28px;font-weight:800;color:#1e9be8" id="refN">…</div><div class="rbar"><i id="refBar" style="width:0"></i></div><div class="mut small" id="refNext"></div></div>
  <div class="field"><input value="${esc(url)}" readonly onclick="this.select()"></div>
  <a class="btn" style="background:#25D366;display:flex;align-items:center;justify-content:center;text-decoration:none" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 Inviter sur WhatsApp</a>
  <button class="btn ghost" style="margin-top:8px" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(url)}').then(()=>V.toast('Lien copié 🔗'))">🔗 Copier mon lien</button>`);
  const { data } = await sb.rpc('my_referrals'); const n = data || 0, k = n % 3;
  $('#refN').textContent = n; $('#refBar').style.width = (k / 3 * 100) + '%'; $('#refNext').textContent = `Encore ${3 - k} ami${3 - k > 1 ? 's' : ''} pour gagner 7 jours de Gold`;
}

/* =====================================================================
   CADEAUX VIRTUELS ET PORTEFEUILLE (1 pièce = 10 FCFA ; le créateur reçoit 80 %)
   ===================================================================== */
const GIFTS = [['rose', '🌹', 'Rose', 1], ['coeur', '❤️', 'Cœur', 5], ['feu', '🔥', 'Feu', 10], ['lion', '🦁', 'Lion', 50], ['couronne', '👑', 'Couronne', 100], ['fusee', '🚀', 'Fusée', 500], ['chateau', '🏰', 'Château', 1000]];
const COIN_PACKS = [[100, 1000, 3, ''], [500, 5000, 15, ''], [1050, 10000, 30, '+5 % offerts'], [5500, 50000, 150, '+10 % offerts']];
const OUT_METHODS = { O: ['Orange Money', 'Wave', 'MTN MoMo', 'Moov Money', 'Virement bancaire'], C: ['MTN MoMo', 'Orange Money', 'Airtel Money', 'Moov Money', 'Virement bancaire'], E: ['M-Pesa', 'Airtel Money', 'MTN MoMo', 'Virement bancaire'], A: ['Virement bancaire (IBAN)', 'm10', 'Birbank'] };
const myCc = () => (S.me && S.me.country) || S.loc.country;
const coinCur = () => myCc() === 'AZ' ? '₼' : 'FCFA';
const toUsd = (n, cur) => '≈ ' + (cur === '₼' ? n / 1.7 : n / (+localStorage.getItem('vibzo_usd') || 560)).toFixed(2) + ' USD';
let W = null, packSel = 500, giftBusy = false;
async function loadWallet() { const { data, error } = await sb.rpc('my_wallet'); if (error) throw error; W = data; return W; }
/* =====================================================================
   VALIDATION EN 2 ÉTAPES (codes à 6 chiffres : Google Authenticator, Microsoft Authenticator…)
   Une fois activée, les pouvoirs admin et les retraits d'argent exigent le code à chaque connexion.
   ===================================================================== */
async function mfaFactors() {
  if (!sb.auth.mfa) return { on: null, pending: [] };
  const { data } = await sb.auth.mfa.listFactors();
  const all = (data && data.all) || [];
  return { on: all.find(f => f.factor_type === 'totp' && f.status === 'verified') || null, pending: all.filter(f => f.status !== 'verified') };
}
async function checkMfa() {
  if (!uid() || !sb.auth.mfa) return;
  try {
    const f = await mfaFactors(); S.mfaOn = !!f.on;
    const { data } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (data && data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') mfaPrompt(f.on.id);
  } catch (e) { }
}
function mfaPrompt(factorId) {
  modal(`<div class="card" style="max-width:340px;width:100%;background:#fff;text-align:center"><div style="font-size:40px">🔐</div><h3>Code de sécurité</h3>
  <p class="mut small">Ouvre ton application d’authentification et écris le code à 6 chiffres de <b>Vibzo</b>.</p>
  <input id="mfaC" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" style="font-size:26px;letter-spacing:8px;text-align:center;margin:12px 0;width:100%;padding:10px;border-radius:12px;border:1px solid #cfe6f7" onkeyup="if(this.value.length===6)V.mfaLogin('${factorId}')">
  <div class="mut small" id="mfaE" style="color:#d33;min-height:18px"></div>
  <button class="btn" id="mfaB" onclick="V.mfaLogin('${factorId}')">Valider</button>
  <button class="btn ghost" style="margin-top:8px" onclick="V.logout()">Se déconnecter</button></div>`);
  setTimeout(() => { const i = $('#mfaC'); if (i) i.focus(); }, 100);
}
let mfaBusy = false;
async function mfaLogin(factorId) {
  if (mfaBusy) return; const code = ($('#mfaC').value || '').replace(/\D/g, ''); if (code.length !== 6) { $('#mfaE').textContent = 'Le code a 6 chiffres.'; return; }
  mfaBusy = true; busy($('#mfaB'), true);
  const { error } = await sb.auth.mfa.challengeAndVerify({ factorId, code }); mfaBusy = false; busy($('#mfaB'), false);
  if (error) { $('#mfaE').textContent = 'Code incorrect ou expiré. Réessaie avec le nouveau code.'; $('#mfaC').value = ''; return; }
  closeModal(); await loadMe().catch(() => { }); toast('🔐 Connexion sécurisée');
  if (S.cur === 'admin') go('admin');
}
async function mfaSheet() {
  if (!requireAuth()) return;
  if (!sb.auth.mfa) { toast('Indisponible ici'); return; }
  sheet('🔐 Validation en 2 étapes', `<div id="mfaW">${loading()}</div>`);
  const f = await mfaFactors(); S.mfaOn = !!f.on;
  if (f.on) {
    $('#mfaW').innerHTML = `<div class="safety ok2">✅<span><b>Activée.</b> À chaque connexion, Vibzo te demandera le code à 6 chiffres de ton application d’authentification.</span></div>
    <p class="mut small" style="margin:10px 0">Garde ton téléphone en sécurité. Si tu le perds, contacte Vibzo sur WhatsApp pour récupérer ton compte.</p>
    <button class="btn ghost" onclick="V.mfaOff('${f.on.id}')">Désactiver</button>`;
    return;
  }
  for (const p of f.pending) { try { await sb.auth.mfa.unenroll({ factorId: p.id }); } catch (e) { } }
  const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Vibzo ' + new Date().toISOString().slice(0, 16), issuer: 'Vibzo' });
  if (error) { $('#mfaW').innerHTML = `<p class="mut small">${esc(errMsg(error))}</p>`; return; }
  $('#mfaW').innerHTML = `<p class="small"><b>1.</b> Installe <b>Google Authenticator</b> (ou Microsoft Authenticator) sur ton téléphone.</p>
  <p class="small" style="margin-top:6px"><b>2.</b> Dans l’application, appuie sur <b>+</b> puis scanne ce code${matchMedia('(max-width:700px)').matches ? ' (ou copie la clé si tu es sur le même téléphone)' : ''} :</p>
  <div style="text-align:center;margin:10px 0"><img id="mfaQr" alt="QR code" style="width:190px;height:190px;background:#fff;padding:6px;border-radius:12px;border:1px solid #cfe6f7"></div>
  <div class="field"><label>Clé (si tu ne peux pas scanner)</label><input value="${esc(data.totp.secret)}" readonly onclick="this.select()" style="font-family:monospace;font-size:13px"></div>
  <button class="btn ghost" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(data.totp.secret)}').then(()=>V.toast('Clé copiée'))">📋 Copier la clé</button>
  <p class="small" style="margin-top:12px"><b>3.</b> Écris le code à 6 chiffres affiché pour <b>Vibzo</b> :</p>
  <input id="mfaN" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" style="font-size:24px;letter-spacing:8px;text-align:center;margin:8px 0;width:100%;padding:10px;border-radius:12px;border:1px solid #cfe6f7">
  <div class="mut small" id="mfaNE" style="color:#d33;min-height:18px"></div>
  <button class="btn" id="mfaNB" onclick="V.mfaEnable('${data.id}')">🔐 Activer</button>`;
  const qr = String(data.totp.qr_code || ''), m = qr.match(/^data:image\/svg\+xml;(?:utf-?8,|charset=utf-?8,)([\s\S]*)$/i);
  $('#mfaQr').src = m ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(m[1]) : qr;
}
async function mfaEnable(factorId) {
  const code = ($('#mfaN').value || '').replace(/\D/g, ''); if (code.length !== 6) { $('#mfaNE').textContent = 'Le code a 6 chiffres.'; return; }
  busy($('#mfaNB'), true); const { error } = await sb.auth.mfa.challengeAndVerify({ factorId, code }); busy($('#mfaNB'), false);
  if (error) { $('#mfaNE').textContent = 'Code incorrect. Vérifie l’heure de ton téléphone et réessaie avec le nouveau code.'; return; }
  S.mfaOn = true; closeSheet(); toast('✅ Validation en 2 étapes activée'); await loadMe().catch(() => { }); if (S.cur === 'admin' || S.cur === 'profile') go(S.cur);
}
async function mfaOff(factorId) {
  if (!confirm('Désactiver la validation en 2 étapes ? Ton compte sera moins protégé.')) return;
  const { error } = await sb.auth.mfa.unenroll({ factorId });
  if (error) return fail(/aal2|assurance/i.test(error.message) ? new Error('Reconnecte-toi avec ton code avant de désactiver.') : error);
  S.mfaOn = false; closeSheet(); toast('Validation en 2 étapes désactivée');
}

/* Paiement automatique (Notch Pay : MTN MoMo, Orange Money, carte). Si le service n'est pas encore activé
   ou indisponible, l'appli bascule sur le paiement manuel (WhatsApp + Mobile Money / IBAN). */
const PAY_FN = `${SUPABASE_URL}/functions/v1/notchpay`;
async function autoPay(kind, qty) {
  if (C[myCc()].z === 'A' || window.__VIBZO_FAKE__ && !window.__AUTOPAY__) return false;
  try {
    const { data: { session } } = await sb.auth.getSession(); if (!session) return false;
    const r = await fetch(PAY_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ action: 'init', kind, qty, return_url: location.origin + location.pathname }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) { toast('🔒 Redirection vers le paiement sécurisé…'); setTimeout(() => { location.href = d.url; }, 400); return true; }
    if (d.error && d.error !== 'not_configured') toast('⚠️ Paiement automatique indisponible : paiement manuel proposé');
  } catch (e) { }
  return false;
}
async function checkPayReturn() {
  const id = new URLSearchParams(location.search).get('pay'); if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return;
  history.replaceState(null, '', location.pathname + location.hash);
  modal(`<div class="card" style="max-width:340px;width:100%;background:#fff;text-align:center"><div style="font-size:40px">⏳</div><h3>Vérification du paiement…</h3><p class="mut small">Valide la demande sur ton téléphone si ce n’est pas encore fait.</p></div>`);
  for (let i = 0; i < 20; i++) {
    let d = {};
    try { const r = await fetch(PAY_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY }, body: JSON.stringify({ action: 'verify', id }) }); d = await r.json(); } catch (e) { }
    if (d.status === 'complete') {
      await loadMe().catch(() => { });
      const t = d.kind === 'coins' ? [`💰`, `${d.qty} pièces ajoutées !`, 'Offre des cadeaux à tes créateurs préférés.'] : d.kind === 'gold' ? ['👑', 'Vibzo Gold activé !', 'L’espace rencontres est ouvert.'] : ['🏪', 'Boutique activée !', 'Tes produits sont visibles par tous.'];
      modal(`<div class="card" style="max-width:340px;width:100%;background:#fff;text-align:center"><div style="font-size:48px">${t[0]}</div><h3>Paiement reçu ✅</h3><p style="font-weight:700;margin-top:6px">${t[1]}</p><p class="mut small">${t[2]}</p><button class="btn" style="margin-top:12px" onclick="V.closeModal();${d.kind === 'gold' ? "V.go('dating')" : d.kind === 'coins' ? 'V.walletSheet()' : "V.go('profile')"}">Continuer</button></div>`);
      return;
    }
    if (d.status === 'failed' || d.status === 'unknown') { closeModal(); toast('❌ Paiement annulé ou refusé. Tu peux réessayer.'); return; }
    if (d.error === 'not_configured') break;
    await new Promise(r => setTimeout(r, 3000));
  }
  closeModal(); toast('⏳ Paiement en cours de confirmation : tu recevras une notification.');
}
async function giftSheet(id) {
  if (!requireAuth('Connecte-toi pour offrir un cadeau.')) return;
  const v = S.vids.get(id); if (!v) return; if (v.user_id === uid()) { toast('Tes fans peuvent t’offrir des cadeaux ici 🎁'); walletSheet(); return; }
  sheet(`🎁 Offrir un cadeau à @${esc(v.username)}`, `<div class="gbal"><span>🪙 <b id="gBal">…</b> pièces</span><button class="btn sm gold" style="width:auto" onclick="V.buyCoins()">＋ Recharger</button></div><div id="gTop"></div>
  <div class="ggrid">${GIFTS.map(g => `<button onclick="V.sendGift('${id}','${g[0]}')"><span class="ge">${g[1]}</span><b>${g[2]}</b><small>🪙 ${fmtN(g[3])}</small></button>`).join('')}</div>
  <p class="mut small" style="text-align:center;margin-top:12px">💚 80 % de la valeur va directement au créateur, qui peut la retirer en Mobile Money.</p>`);
  const [w, top] = await Promise.all([loadWallet().catch(() => null), sb.rpc('video_top_gifters', { p_video: id })]);
  if (w && $('#gBal')) $('#gBal').textContent = fmtN(w.coins);
  if (top.data && top.data.length && $('#gTop')) $('#gTop').innerHTML = `<div class="gtop">🏆 ${top.data.map((t, i) => `<span>${['🥇', '🥈', '🥉'][i]} @${esc(t.username)} · 🪙 ${fmtN(t.coins)}</span>`).join('')}</div>`;
}
async function sendGift(id, g) {
  if (giftBusy) return; const G = GIFTS.find(x => x[0] === g); if (!G) return;
  if (W && W.coins < G[3]) { toast('Pas assez de pièces : recharge ton solde 🪙'); buyCoins(); return; }
  giftBusy = true; const { data, error } = await sb.rpc('send_gift', { p_video: id, p_gift: g }); giftBusy = false;
  if (error) { if (/insuffisant/i.test(error.message)) { toast('Pas assez de pièces : recharge ton solde 🪙'); buyCoins(); return; } return fail(error); }
  if (W) W.coins = data; if ($('#gBal')) $('#gBal').textContent = fmtN(data);
  const v = S.vids.get(id); v.gift_coins = (v.gift_coins || 0) + G[3]; const gb = $('#gf' + id); if (gb) gb.querySelector('span').textContent = fmtN(v.gift_coins);
  giftFly(G[1], G[3]); toast(`${G[1]} ${G[2]} envoyé à @${v.username} !`);
}
function giftFly(e, n) { const d = document.createElement('div'); d.className = 'gfly' + (n >= 100 ? ' big' : ''); d.textContent = e; document.body.appendChild(d); setTimeout(() => d.remove(), 1800); }
function pickPack(n, el) { packSel = n; document.querySelectorAll('.pack').forEach(x => x.classList.toggle('on', x === el)); }
function buyCoins() {
  if (!requireAuth()) return; const cur = coinCur(), zone = C[myCc()].z; packSel = 500;
  sheet('🪙 Acheter des pièces', `<p class="mut small" style="margin-bottom:10px">Les pièces servent à offrir des cadeaux aux créateurs que tu aimes. 1 pièce = ${cur === '₼' ? '0,03 ₼' : '10 FCFA'}.</p>
  <div class="packs">${COIN_PACKS.map(p => `<button class="pack ${p[0] === 500 ? 'on' : ''}" onclick="V.pickPack(${p[0]},this)"><b>🪙 ${p[0].toLocaleString('fr-FR')}</b>${p[3] ? `<i>${p[3]}</i>` : ''}<span>${money(cur === '₼' ? p[2] : p[1], cur)}</span></button>`).join('')}</div>
  <div class="field"><label>Comment veux-tu payer ?</label><select id="cPay">${[...PAYZ[zone], 'Autre'].map(x => `<option>${x}</option>`).join('')}</select></div>
  <button class="btn gold" id="cBtn" onclick="V.reqCoins()">Continuer</button>
  <p class="mut small" style="margin-top:8px;text-align:center">Après ta demande, paie et envoie la capture sur WhatsApp : les pièces arrivent dès réception.</p>`);
}
async function reqCoins() {
  const btn = $('#cBtn'), pay = $('#cPay').value; busy(btn, true);
  if (await autoPay('coins', packSel)) return;
  const { data, error } = await sb.rpc('request_coins', { p_coins: packSel, p_payment: pay }); busy(btn, false);
  if (error) return fail(error);
  closeSheet();
  const cc = myCc(), pi = PAYMENT_INFO[C[cc].z], amount = money(data.price, data.currency);
  const msg = `Bonjour Vibzo 👋 Je viens de demander ${data.coins} pièces depuis ${C[cc].n}. Utilisateur : @${S.me.username}. Montant : ${amount}. Paiement : ${pay}.`;
  modal(`<div class="card" style="max-width:360px;width:100%;background:#fff;text-align:center;max-height:90vh;overflow:auto"><div style="font-size:40px">🪙</div><h3>Demande envoyée</h3>
  <div style="font-size:22px;font-weight:800;color:#1e9be8;margin-top:6px">${esc(amount)}</div><div class="mut small">pour ${data.coins.toLocaleString('fr-FR')} pièces</div>
  <p class="mut small" style="margin-top:6px">1. Paie ce montant (${esc(pay)}).<br>2. Envoie la capture du paiement sur WhatsApp.<br>3. Tes pièces sont ajoutées dès réception.</p>
  ${pi && pi.momo ? `<div class="card" style="text-align:left;margin-top:12px;background:#fffbe6"><b>Mobile Money</b><div class="small" style="margin-top:6px">${esc(pi.momo)}<br>Numéro : <b style="user-select:all">${esc(pi.number)}</b></div><button class="btn ghost" style="margin-top:8px" onclick="navigator.clipboard&&navigator.clipboard.writeText('${pi.number}').then(()=>V.toast('Numéro copié ✅'))">📋 Copier le numéro</button></div>` : ''}
  ${SUPPORT_WHATSAPP ? `<a class="btn" style="background:#25D366;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;margin-top:12px" href="https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 Envoyer la preuve sur WhatsApp</a>` : ''}
  ${pi && pi.iban ? `<div class="card" style="text-align:left;margin-top:12px;background:#f2f9ff"><b>Virement bancaire</b><div class="small" style="margin-top:6px">Banque : <b>${esc(pi.bank)}</b><br>Bénéficiaire : <b>${esc(pi.holder)}</b><br>IBAN : <b style="user-select:all">${esc(pi.iban)}</b></div><button class="btn ghost" style="margin-top:8px" onclick="navigator.clipboard&&navigator.clipboard.writeText('${pi.iban}').then(()=>V.toast('IBAN copié ✅'))">📋 Copier l’IBAN</button></div>` : ''}
  <button class="btn ghost" style="margin-top:10px" onclick="V.closeModal()">Fermer</button></div>`);
}
async function walletSheet() {
  if (!requireAuth()) return;
  sheet('💰 Mon portefeuille', `<div id="wal">${loading()}</div>`);
  const [w, hist, outs] = await Promise.all([loadWallet(), sb.rpc('my_gift_history'), sb.from('withdrawals').select('*').order('created_at', { ascending: false }).limit(10)]).catch(e => { fail(e); return []; });
  if (!w) return;
  const cur = w.currency, val = n => cur === '₼' ? +(n * w.rate).toFixed(2) : Math.round(n * w.rate), zone = C[myCc()].z, need = Math.max(0, w.min_out - w.earned);
  const G = Object.fromEntries(GIFTS.map(g => [g[0], g]));
  $('#wal').innerHTML = `<div class="wcards"><div class="wcard"><div class="mut small">🪙 Pièces à offrir</div><b>${fmtN(w.coins)}</b>${w.pending_buy ? `<div class="mut small">⏳ ${w.pending_buy} achat(s) en attente</div>` : ''}<button class="btn sm gold" onclick="V.buyCoins()">＋ Recharger</button></div>
  <div class="wcard earn"><div class="mut small">💎 Gains des cadeaux</div><b>${money(val(w.earned), cur)}</b><div class="mut small">${fmtN(w.earned)} pièces reçues · ${toUsd(val(w.earned), cur)}</div></div></div>
  ${w.pending_out ? `<div class="safety">⏳<span>Retrait en cours : <b>${money(val(w.pending_out), cur)}</b>. L’équipe Vibzo t’envoie le paiement sous 72 h.</span></div>` : ''}
  ${w.earned >= w.min_out ? `<div class="card" style="margin:12px 0"><b>Retirer ${money(val(w.earned), cur)}</b>
    <div class="field" style="margin-top:8px"><label>Recevoir sur</label><select id="wM">${OUT_METHODS[zone].map(x => `<option>${x}</option>`).join('')}</select></div>
    <div class="field"><label>Numéro Mobile Money ou IBAN</label><input id="wN" placeholder="${zone === 'A' ? 'AZ00…' : '+237 6…'}" value="${esc((S.me && S.me.phone) || '')}"></div>
    <button class="btn" id="wBtn" onclick="V.withdraw()">💸 Demander le retrait</button></div>`
    : `<div class="card" style="margin:12px 0;text-align:center"><div class="mut small">Retrait possible à partir de ${w.min_out} pièces reçues (${money(val(w.min_out), cur)})</div><div class="rbar"><i style="width:${Math.min(100, w.earned / w.min_out * 100)}%"></i></div><div class="mut small">Encore ${fmtN(need)} pièces · publie des vidéos et fais des directs pour recevoir des cadeaux 🎁</div></div>`}
  <p class="mut small">Tu reçois 80 % de la valeur de chaque cadeau (1 pièce reçue = ${cur === '₼' ? '0,024 ₼' : '8 FCFA'}).</p>
  ${(outs.data || []).length ? `<div class="lbl">Mes retraits</div>${outs.data.map(o => `<div class="whist"><span>${o.status === 'paid' ? '✅' : o.status === 'pending' ? '⏳' : '❌'} ${money(o.amount, o.currency)} · ${esc(o.method)}</span><span class="mut small">${ago(o.created_at)}</span></div>`).join('')}` : ''}
  ${(hist.data || []).length ? `<div class="lbl">Historique des cadeaux</div>${hist.data.map(h => `<div class="whist"><span>${(G[h.gift] || ['', '🎁'])[1]} ${h.kind === 'recu' ? `de @${esc(h.other)}` : `à @${esc(h.other)}`}</span><span class="${h.kind === 'recu' ? 'plus' : 'mut'}">${h.kind === 'recu' ? '+' : '−'}${fmtN(h.coins)} 🪙</span></div>`).join('')}` : ''}`;
}
async function withdraw() {
  const btn = $('#wBtn'); busy(btn, true);
  const { data, error } = await sb.rpc('request_withdrawal', { p_method: $('#wM').value, p_number: $('#wN').value }); busy(btn, false);
  if (error) return fail(error);
  toast(`💸 Retrait de ${money(data.amount, data.currency)} demandé`); walletSheet();
}
async function loadAdminWallet() {
  const el = $('#admW'); if (!el) return;
  const { data, error } = await sb.rpc('admin_wallet_queue'); if (error) { el.innerHTML = `<p class="mut small">${esc(errMsg(error))}</p>`; return; }
  el.innerHTML = `<div class="mut small" style="margin-bottom:6px">30 derniers jours : ${fmtN(data.sold_30d)} pièces vendues · ${fmtN(data.gifts_30d)} pièces offertes en cadeaux (ta part : 20 %)</div>
  ${data.buys.map(b => `<div class="mq"><span class="k">🪙</span><div class="grow"><b style="font-size:14px">${b.coins.toLocaleString('fr-FR')} pièces · ${money(b.price, b.currency)}</b><div class="mut small">@${esc(b.username)} · ${esc((C[b.country] || {}).n || '')} · ${esc(b.payment)}${b.phone ? ' · ' + esc(b.phone) : ''} · ${ago(b.created_at)}</div></div><div class="acts"><button class="ok" onclick="V.coinDecide('${b.id}',true)">Payé ✓</button><button class="ko" onclick="V.coinDecide('${b.id}',false)">Refuser</button></div></div>`).join('') || '<p class="mut small">Aucun achat de pièces en attente.</p>'}
  ${data.outs.map(o => `<div class="mq"><span class="k">💸</span><div class="grow"><b style="font-size:14px">À payer : ${money(o.amount, o.currency)}</b><div class="mut small">@${esc(o.username)} · ${esc((C[o.country] || {}).n || '')} · ${esc(o.method)} : <b style="user-select:all">${esc(o.number)}</b> · ${fmtN(o.coins)} pièces · ${ago(o.created_at)}</div></div><div class="acts"><button class="ok" onclick="V.outDecide('${o.id}',true)">Envoyé ✓</button><button class="ko" onclick="V.outDecide('${o.id}',false)">Refuser</button></div></div>`).join('') || '<p class="mut small">Aucun retrait à payer.</p>'}`;
}
async function coinDecide(id, ok) { const { error } = await sb.rpc('admin_coin_decide', { p_id: id, p_ok: ok }); if (error) return fail(error); toast(ok ? 'Pièces créditées ✅' : 'Demande refusée'); loadAdminWallet(); }
async function outDecide(id, paid) { const { error } = await sb.rpc('admin_withdrawal_decide', { p_id: id, p_paid: paid }); if (error) return fail(error); toast(paid ? 'Retrait marqué comme payé ✅' : 'Retrait refusé, pièces rendues'); loadAdminWallet(); }

/* =====================================================================
   BACK-OFFICE
   ===================================================================== */
SCREENS.admin = async () => {
  if (!S.me || S.me.role !== 'admin') { $('#s-admin').innerHTML = hdr('Back-office', '', 'profile') + '<div class="empty">Accès réservé.</div>'; return; }
  $('#s-admin').innerHTML = hdr('Back-office', '', 'profile') + `${S.mfaOn ? '' : `<div class="pad" style="padding-bottom:0"><div class="safety warn">🔐<span><b>Protège ton compte admin :</b> active la validation en 2 étapes. Ensuite, même avec ton mot de passe, un pirate ne pourra rien faire dans le back-office. <button class="btn sm" style="width:auto;margin-top:6px" onclick="V.mfaSheet()">Activer maintenant</button></span></div></div>`}<div class="pad" id="adm">${loading()}</div>`;
  const [st, offers, shops, reports, subs] = await Promise.all([
    sb.rpc('admin_stats'),
    sb.from('offers_view').select('*').eq('status', 'pending').order('created_at').limit(50),
    sb.from('shops').select('*').in('status', ['pending', 'active', 'suspended']).order('created_at', { ascending: false }).limit(100),
    sb.from('reports').select('*').eq('status', 'open').order('created_at').limit(100),
    sb.from('subscription_requests_view').select('*').eq('status', 'pending').order('created_at').limit(100),
  ]);
  if (st.error) throw st.error;
  const s = st.data;
  (offers.data || []).forEach(o => S.offers.set(o.id, o));
  $('#adm').innerHTML = `<div class="stats">${[['Utilisateurs', s.users], ['Nouveaux (7 j)', s.users_7d], ['Vidéos', s.videos], ['Membres Gold', s.vip], ['Profils rencontre', s.dating], ['Matchs', s.matches], ['Demandes d’abonnement', s.requests], ['Boutiques actives', s.shops_active], ['Boutiques en attente', s.shops_pending], ['Offres en ligne', s.offers_open], ['Offres à valider', s.offers_pending], ['Commandes', s.orders], ['Signalements ouverts', s.reports_open]].map(([l, v]) => `<div class="stat"><b>${fmtN(v)}</b><span>${l}</span></div>`).join('')}</div>
  <div class="lbl">Utilisateurs par pays</div><div class="tags">${Object.entries(s.by_country || {}).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span>${(C[k] || {}).f || ''} ${esc((C[k] || {}).n || k)} : ${n}</span>`).join('')}</div>
  <div class="lbl">🎁 Cadeaux : pièces à valider et retraits à payer</div><div id="admW">${loading()}</div>
  <div class="lbl">💰 Programme Créateurs (vues sur 30 jours)</div><button class="btn sm gold" style="margin-bottom:8px" onclick="V.payCalc()">🧮 Calculer les gains du mois</button><div id="admCr">${loading()}</div>
  <div class="lbl">Aperçu de la page de paiement (ce que voient les membres)</div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" style="width:auto" onclick="V.previewPay('A')">🇦🇿 Azerbaïdjan</button><button class="btn sm ghost" style="width:auto" onclick="V.previewPay('C')">🌍 Afrique</button><button class="btn sm ghost" style="width:auto" onclick="V.previewPay('form')">👑 Formulaire Gold</button></div>
  <div class="lbl">Demandes d’abonnement (${(subs.data || []).length})</div>${(subs.data || []).map(r => `<div class="mq"><span class="k">${r.plan === 'gold' ? '👑' : '🏪'}</span><div class="grow"><b style="font-size:14px">${r.plan === 'gold' ? 'Gold' : 'Vendeur'} · ${r.months} mois</b><div class="mut small">@${esc(r.username)} · ${esc((C[r.country] || {}).n || '')} · ${esc(r.payment)}${r.phone ? ' · ' + esc(r.phone) : ''} · ${ago(r.created_at)}</div></div><div class="acts"><button class="ok" onclick="V.chatWith('${r.user_id}','dm','Abonnement ${r.plan === 'gold' ? 'Gold' : 'Vendeur'}',null)">💬</button><button class="ok" onclick="V.activateReq('${r.id}')">Activer</button></div></div>`).join('') || '<p class="mut small">Aucune demande.</p>'}
  <div class="lbl">Activer Gold manuellement (paiement reçu)</div><div class="row"><input id="vu" placeholder="nom d’utilisateur"><input id="vd" type="number" value="30" style="width:80px"><button class="btn sm" style="width:auto" onclick="V.setVip()">OK</button></div>
  <div class="lbl">Offrir des pièces (gagnants d’un défi, créateurs fondateurs)</div><div class="row"><input id="gcu" placeholder="nom d’utilisateur"><input id="gcn" type="number" value="500" min="1" max="10000" style="width:90px"><button class="btn sm" style="width:auto" onclick="V.giveCoins()">Offrir</button></div>
  <div class="lbl">Offres à valider (${(offers.data || []).length})</div>${(offers.data || []).map(o => `<div class="mq"><div class="grow"><b style="font-size:14px">${esc(o.title)}</b><div class="mut small">${esc(o.company)} · ${esc((C[o.country] || {}).n || '')} · par ${esc(o.poster_name)}</div><button class="mut small" onclick="V.offerDetail('${o.id}')" style="text-decoration:underline">Lire</button></div><div class="acts"><button class="ok" onclick="V.modOffer('${o.id}','open')">Publier</button><button class="ko" onclick="V.modOffer('${o.id}','rejected')">Refuser</button></div></div>`).join('') || '<p class="mut small">Rien à valider.</p>'}
  <div class="lbl">Boutiques</div>${(shops.data || []).map(sh => `<div class="mq"><div class="grow"><b style="font-size:14px">${esc(sh.name)}</b> ${pill(sh.status)}<div class="mut small">${esc((C[sh.country] || {}).n || '')} · ${esc(sh.platform)}${sh.whatsapp ? ' · ' + esc(sh.whatsapp) : ''}${sh.paid_until ? ' · payé jusqu’au ' + new Date(sh.paid_until).toLocaleDateString('fr-FR') : ''}</div></div><div class="acts"><button class="ok" onclick="V.modShop('${sh.id}','active')">+30 j</button>${sh.status !== 'suspended' ? `<button class="ko" onclick="V.modShop('${sh.id}','suspended')">Suspendre</button>` : ''}</div></div>`).join('') || '<p class="mut small">Aucune boutique.</p>'}
  <div class="lbl">Signalements (${(reports.data || []).length})</div>${(reports.data || []).map(r => `<div class="mq"><span class="k">🚩</span><div class="grow"><b style="font-size:14px">${esc(r.reason)}</b><div class="mut small">${esc(r.target_type)} · ${ago(r.created_at)}</div></div><div class="acts">${r.target_type === 'video' ? `<button class="ko" onclick="V.modReport('${r.id}','${esc(r.target_id)}','hide')">Masquer</button>` : r.target_type === 'comment' ? `<button class="ko" onclick="V.modReport('${r.id}','${esc(r.target_id)}','delc')">Supprimer</button>` : r.target_type === 'profile' ? `<button class="ok" onclick="V.openProfile('${esc(r.target_id)}')">Voir</button>` : ''}<button class="ok" onclick="V.modReport('${r.id}','','ok')">Classer</button></div></div>`).join('') || '<p class="mut small">Aucun signalement 🎉</p>'}`;
  loadAdminCreators(); loadAdminWallet();
};
async function modOffer(id, st) { closeSheet(); const { error } = await sb.from('job_offers').update({ status: st }).eq('id', id); if (error) return fail(error); toast(st === 'open' ? 'Offre publiée' : 'Offre refusée'); go('admin'); }
async function modShop(id, st) {
  const row = { status: st }; if (st === 'active') { const { data } = await sb.from('shops').select('paid_until').eq('id', id).single(); const base = data && data.paid_until && new Date(data.paid_until) > new Date() ? new Date(data.paid_until) : new Date(); base.setDate(base.getDate() + 30); row.paid_until = base.toISOString(); }
  const { error } = await sb.from('shops').update(row).eq('id', id); if (error) return fail(error); toast('Boutique mise à jour'); go('admin');
}
async function modReport(id, target, action) {
  if (action === 'hide') { const { error } = await sb.from('videos').update({ status: 'hidden' }).eq('id', target); if (error) return fail(error); }
  if (action === 'delc') { const { error } = await sb.from('comments').delete().eq('id', target); if (error) return fail(error); }
  const { error } = await sb.from('reports').update({ status: 'resolved' }).eq('id', id); if (error) return fail(error); toast('Signalement traité'); go('admin');
}
async function loadAdminCreators() {
  const el = $('#admCr'); if (!el) return;
  const { data, error } = await sb.rpc('admin_creators'); if (error) { el.innerHTML = `<p class="mut small">${esc(errMsg(error))}</p>`; return; }
  const stl = { pending: '⏳ Candidature', approved: '✅ Créateur', rejected: 'Refusé', suspended: '⛔ Suspendu' };
  el.innerHTML = (data || []).length ? data.slice(0, 30).map(c => `<div class="mq"><span class="k">${c.status === 'approved' ? '💰' : '🎬'}</span><div class="grow"><b style="font-size:14px">@${esc(c.username)}</b> ${c.status ? `<span class="pill">${stl[c.status]}</span>` : ''}<div class="mut small">${(C[c.country] || {}).f || ''} · 👁️ ${fmtN(c.views_30d)} vues · 👥 ${fmtN(c.followers)} · 🎬 ${c.videos}${c.payout_method ? ` · ${esc(c.payout_method)} : <b>${esc(c.payout_number)}</b>` : ''}${+c.due ? ` · <b style="color:#12a150">À payer : ${money(c.due, '')}</b>` : ''}</div></div><div class="acts">${c.status === 'pending' ? `<button class="ok" onclick="V.crDecide('${c.user_id}','approved')">Valider</button><button onclick="V.crDecide('${c.user_id}','rejected')">Refuser</button>` : ''}${c.status === 'approved' ? `<button class="ok" onclick="V.crEarn('${c.user_id}','${esc(c.username)}')">+ Gain</button>${+c.due ? `<button onclick="V.crPaid('${c.user_id}')">Payé ✓</button>` : ''}` : ''}</div></div>`).join('') : '<p class="mut small">Aucun créateur pour l’instant.</p>';
}
/* Calculateur : cagnotte = bénéfice net × % ; part = cagnotte × vues du créateur ÷ vues totales (créateurs validés) */
const PAY_MIN = { FCFA: 5000, '₼': 10, USD: 10, EUR: 10 };
let calcData = [];
async function payCalc() {
  const d = new Date(), per = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  sheet('🧮 Gains des créateurs', `<p class="small mut" style="margin-top:0">Cagnotte = bénéfice net du mois × pourcentage. Chaque créateur validé reçoit une part selon ses vues des 30 derniers jours.</p>
  <div class="row"><div class="field grow"><label>Bénéfice net du mois</label><input id="pcP" type="number" min="0" inputmode="decimal" placeholder="250000" oninput="V.payCalcRun()"></div><div class="field" style="width:100px"><label>Devise</label><select id="pcC" onchange="V.payCalcRun()"><option>FCFA</option><option>USD</option></select></div></div>
  <div class="field"><label>Taux : 1 USD = … FCFA</label><input id="pcT" type="number" min="1" value="${localStorage.getItem('vibzo_usd') || 560}" oninput="V.payCalcRun()"></div>
  <div class="row"><div class="field grow"><label>Part créateurs (%)</label><input id="pcR" type="number" min="1" max="100" value="20" oninput="V.payCalcRun()"></div><div class="field grow"><label>Plafond par créateur (%)</label><input id="pcX" type="number" min="1" max="100" value="40" oninput="V.payCalcRun()"></div></div>
  <div class="field"><label>Période</label><input id="pcM" value="${per}"></div>
  <div id="pcOut">${loading()}</div>`);
  const { data, error } = await sb.rpc('admin_creators'); if (error) return fail(error);
  calcData = (data || []).filter(c => c.status === 'approved' && +c.views_30d > 0);
  payCalcRun();
}
function payCalcRun() {
  const el = $('#pcOut'); if (!el) return;
  if (!calcData.length) { el.innerHTML = '<p class="mut small">Aucun créateur validé avec des vues sur 30 jours pour l’instant.</p>'; return; }
  const profit = +$('#pcP').value || 0, rate = Math.min(100, Math.max(0, +$('#pcR').value || 0)), cap = Math.min(100, Math.max(1, +$('#pcX').value || 40)), cur = $('#pcC').value, min = PAY_MIN[cur] || 0;
  const fx = +$('#pcT').value || 560; try { localStorage.setItem('vibzo_usd', fx); } catch (e) { }
  const other = cur === 'FCFA' ? 'USD' : 'FCFA', conv = a => cur === 'FCFA' ? Math.round(a / fx * 100) / 100 : Math.round(a * fx);
  const both = a => `${money(a, cur)} <span class="mut" style="font-weight:600;font-size:.8em">≈ ${money(conv(a), other)}</span>`;
  const pool = Math.floor(profit * rate / 100), total = calcData.reduce((a, c) => a + +c.views_30d, 0);
  let rows = calcData.map(c => ({ c, raw: pool * +c.views_30d / total }));
  // plafond, puis redistribution du surplus entre les autres (une passe)
  const capAmt = pool * cap / 100; let extra = 0; rows.forEach(r => { if (r.raw > capAmt) { extra += r.raw - capAmt; r.raw = capAmt; r.capped = true; } });
  const freeViews = rows.filter(r => !r.capped).reduce((a, r) => a + +r.c.views_30d, 0);
  if (extra && freeViews) rows.forEach(r => { if (!r.capped) r.raw = Math.min(capAmt, r.raw + extra * +r.c.views_30d / freeViews); });
  rows.forEach(r => { r.amt = Math.floor(r.raw); r.ok = r.amt >= min; });
  rows.sort((a, b) => b.amt - a.amt);
  const toPay = rows.filter(r => r.ok).reduce((a, r) => a + r.amt, 0);
  el.innerHTML = `<div class="card" style="text-align:center;margin:6px 0 10px"><div class="mut small">Cagnotte (${rate} %)</div><div style="font-size:24px;font-weight:800;color:#12a150">${both(pool)}</div><div class="mut small">${fmtN(total)} vues · ${rows.length} créateur(s) · minimum ${money(min, cur)}</div></div>
  ${rows.map(r => `<div class="mq"><span class="k">${r.ok ? '💰' : '⏸️'}</span><div class="grow"><b style="font-size:14px">@${esc(r.c.username)}</b><div class="mut small">👁️ ${fmtN(r.c.views_30d)} vues (${Math.round(r.c.views_30d / total * 100)} %)${r.capped ? ' · plafonné' : ''} · ${esc(r.c.payout_method || '')} ${esc(r.c.payout_number || '')}</div></div><b style="color:${r.ok ? '#12a150' : '#999'};text-align:right">${r.ok ? both(r.amt) : 'sous le minimum'}</b></div>`).join('')}
  <button class="btn" style="margin-top:12px" ${toPay > 0 ? '' : 'disabled'} onclick="V.payCalcSave()">✅ Enregistrer ${money(toPay, cur)} (≈ ${money(conv(toPay), other)}) de gains</button>
  <p class="mut small" style="text-align:center;margin-top:8px">Les montants sous le minimum ne sont pas versés ce mois-ci (frais de transfert trop élevés).</p>`;
  window.__pc = { rows, cur, conv, other };
}
async function payCalcSave() {
  const { rows, cur, conv, other } = window.__pc || {}; if (!rows) return;
  const per = $('#pcM').value.trim(), list = rows.filter(r => r.ok && r.amt > 0);
  for (const r of list) { const { error } = await sb.rpc('admin_add_earning', { p_user: r.c.user_id, p_amount: r.amt, p_currency: cur, p_period: per, p_note: `Part des vues ${per} (${$('#pcR').value} %) ≈ ${money(conv(r.amt), other)}` }); if (error) return fail(error); }
  closeSheet(); toast(`${list.length} gain(s) enregistrés ✅ Paie-les puis clique « Payé ✓ »`); loadAdminCreators();
}
async function crDecide(u, st) { const { error } = await sb.rpc('admin_creator_decide', { p_user: u, p_status: st }); if (error) return fail(error); toast('Enregistré ✅'); loadAdminCreators(); }
function crEarn(u, name) {
  const d = new Date(), per = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  sheet('Ajouter un gain', `<b>@${esc(name)}</b><div class="row"><div class="field grow"><label>Montant</label><input id="gea" type="number" min="1" inputmode="decimal"></div><div class="field" style="width:110px"><label>Devise</label><select id="gec"><option>FCFA</option><option>₼</option><option>USD</option><option>EUR</option></select></div></div><div class="field"><label>Période</label><input id="gep" value="${per}"></div><div class="field"><label>Note</label><input id="gen" maxlength="120" placeholder="Ex : part des vues de novembre"></div><button class="btn" onclick="V.crEarnSave('${u}')">Enregistrer</button>`);
}
async function crEarnSave(u) { const a = +$('#gea').value; if (!(a > 0)) return toast('Montant invalide'); const { error } = await sb.rpc('admin_add_earning', { p_user: u, p_amount: a, p_currency: $('#gec').value, p_period: $('#gep').value.trim(), p_note: $('#gen').value.trim() }); if (error) return fail(error); closeSheet(); toast('Gain ajouté ✅'); loadAdminCreators(); }
async function crPaid(u) { const { error } = await sb.rpc('admin_mark_paid', { p_user: u }); if (error) return fail(error); toast('Marqué comme payé ✅'); loadAdminCreators(); }
async function activateReq(id) { const { data, error } = await sb.rpc('admin_activate_request', { p_request: id }); if (error) return fail(error); toast('Activé jusqu’au ' + new Date(data).toLocaleDateString('fr-FR')); go('admin'); }
async function giveCoins() {
  const u = $('#gcu').value.trim().replace(/^@/, ''), n = Math.round(+$('#gcn').value); if (!u || !(n > 0)) return;
  if (!confirm(`Offrir ${n} pièces à @${u} ?`)) return;
  const { error } = await sb.rpc('admin_give_coins', { p_username: u, p_coins: n }); if (error) return fail(error);
  toast(`🪙 ${n} pièces offertes à @${u}`); $('#gcu').value = '';
}
async function setVip() { const u = $('#vu').value.trim().replace(/^@/, ''), d = +$('#vd').value || 30; if (!u) return; const { data, error } = await sb.rpc('admin_set_vip', { p_username: u, p_days: d }); if (error) return fail(error); toast('Gold actif jusqu’au ' + new Date(data).toLocaleDateString('fr-FR')); }

/* =====================================================================
   DÉMARRAGE
   ===================================================================== */
window.V = {
  wvSound, wvClose,
  downloadVid,
  giveCoins,
  hideInstall,
  mfaSheet, mfaEnable, mfaOff, mfaLogin,
  giftSheet, sendGift, buyCoins, pickPack, reqCoins, walletSheet, withdraw, coinDecide, outDecide,
  holdStart, holdEnd, seek, openTag, openUser, openSound, notInterested, speedVid, shared, copyShare, nativeShare, repost, replyC, cancelReply, likeComment, showReplies, openNotifs, openNotif, inviteSheet, refreshNotifs,
  payCalc, payCalcRun, payCalcSave,
  creatorSheet, creatorApply, crDecide, crEarn, crEarnSave, crPaid,
  dDispo, dPhoto, dRewind, dDelPhoto,
  payInfo, toast, subTotal, previewPay,
  convertVideo,
  noImg: el => { if (el.videoWidth === 0 && el.duration > 0 && !el.parentNode.querySelector('.noimg')) el.insertAdjacentHTML('afterend', '<div class="noimg" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:30px;color:#fff;font-size:14px;opacity:.85">🎞️ Cette vidéo est dans un format que ton appareil ne peut pas afficher (HEVC).</div>'); },
  googleAuth, setupRegions, saveSetup,
  S, go, closeSheet, closeModal, openLoc, setLoc, applyLoc, authTab, authRegions, submitAuth, forgot, logout,
  setTab, toggleMute, tapVid, like, save, follow, openComments, addComment, delComment, shareVid, vidMore, delVideo, doDelVideo, report, sendReport,
  searchDebounced, openGrid, pickVid, publish,
  jobTab: t => { S.jobTab = t; go('jobs'); }, jobSector: s => { S.jobSector = s; go('jobs'); }, offerDetail, applyJob, sendApp, contactCand, postJob, savePost, myCV, saveCV, offerApps, closeOffer, chatWith, offerMatches,
  openProduct, orderForm, placeOrder, shopForm, saveShop, myShopSheet, addProd, toggleProd, delProd, orderTab: t => { orderTab = t; go('orders'); }, setOrder,
  openProfile, toggleFollow, editProfile, saveProfile, regionOpts, settings, gold, profTab: t => { S.profTab = t; go('profile'); },
  deleteAccount, doDeleteAccount, installApp, langSheet, setLang, requestSub, datingForm, saveDating, deleteDating, doDeleteDating, dSet, dSwipe, dMore, dBlock, dSafety, loadMatchesPub: () => loadMatches(), openMsgs, openChat, sendMsg, chatMore, activateReq, modOffer, modShop, modReport, setVip,
};

async function start() {
  if (!isConfigured()) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('on')); $('#nav').style.display = 'none';
    $('#s-home').classList.add('on');
    $('#s-home').innerHTML = `<div class="setup"><div class="logo" style="font-size:34px"><span>Vibzo</span></div><h2 style="margin-top:14px">Configuration requise</h2><p class="mut">Le serveur n’est pas encore relié. Ouvre <code>app/config.js</code> et renseigne l’adresse et la clé publique de ton projet Supabase (voir <code>SETUP.md</code>).</p></div>`;
    return;
  }
  applyLang();
  try { sb = await getClient(); } catch (e) { $('#s-home').innerHTML = `<div class="setup"><h2>Connexion impossible</h2><p class="mut">Vérifie ta connexion internet puis recharge la page.</p></div>`; return; }
  const { data } = await sb.auth.getSession(); S.session = data.session;
  await loadMe().catch(fail);
  checkPayReturn(); checkMfa(); setTimeout(welcome, 1500);
  if (S.me && !localStorage.getItem(LOC_KEY)) { S.loc = worldLoc(S.me.country); saveLoc(); }
  applyLang();
  sb.auth.onAuthStateChange(async (ev, session) => {
    const was = uid(); S.session = session;
    if (ev === 'PASSWORD_RECOVERY') { const np = prompt('Nouveau mot de passe (8 caractères minimum)'); if (np && np.length >= 8) { const { error } = await sb.auth.updateUser({ password: np }); toast(error ? '⚠️ ' + error.message : 'Mot de passe modifié ✅'); } }
    if ((session && session.user.id) !== was) { await loadMe().catch(fail); applyLang(); if (session) checkMfa(); if (session && S.cur === 'auth') { toast('Bienvenue sur Vibzo 👋'); go('home'); } }
  });
  go('home');
  setInterval(() => { refreshUnread(); refreshNotifs(); }, 30000); refreshUnread();
}
start();
