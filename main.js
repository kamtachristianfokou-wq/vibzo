// =====================================================================
// VIBZO : application (version réelle)
// =====================================================================
import { C, ZONES, SECTORS, CONTRACTS, REMOTE, REPORT_REASONS, money } from './data.js';
import { SUPPORT_WHATSAPP, ANDROID_APK_URL } from './config.js';
import { getClient, isConfigured } from './supa.js';

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

/* ---------- état ---------- */
let sb;
const S = {
  session: null, me: null, myShop: null, cur: 'home', prev: 'home', tab: 'pour', muted: true,
  loc: { country: 'CM', region: null, zone: false },
  feed: [], feedOffset: 0, feedDone: false, feedLoading: false, override: null,
  vids: new Map(), prods: new Map(), offers: new Map(), cands: new Map(), orders: new Map(),
  jobTab: 'offres', jobSector: 'all', profTab: 'videos', viewUser: null, chatId: null, chatSub: null, chatInfo: null, unread: 0,
};
const uid = () => S.session && S.session.user && S.session.user.id;
try { const l = JSON.parse(localStorage.getItem('vibzo_loc') || 'null'); if (l && C[l.country]) S.loc = l; } catch (e) { }
const saveLoc = () => { try { localStorage.setItem('vibzo_loc', JSON.stringify(S.loc)); } catch (e) { } };
const countries = () => S.loc.zone ? Object.keys(C).filter(k => C[k].z === C[S.loc.country].z) : [S.loc.country];
const regionF = () => (S.loc.zone ? null : S.loc.region);
const locLabel = () => S.loc.zone ? '🌍 ' + ZONES[C[S.loc.country].z] : C[S.loc.country].f + ' ' + (S.loc.region || C[S.loc.country].n);
const inScope = q => { q = q.in('country', countries()); const r = regionF(); return r ? q.eq('region', r) : q; };

function requireAuth(msg) {
  if (uid()) return true;
  modal(`<div class="card" style="max-width:340px;width:100%;text-align:center;background:#fff"><div style="font-size:40px">🔐</div><h3 style="margin-top:6px">Connexion requise</h3><p class="mut small" style="margin-top:6px">${esc(msg || 'Crée un compte gratuit pour continuer.')}</p><button class="btn" onclick="V.closeModal();V.go('auth')">Se connecter / s’inscrire</button><button class="btn ghost" onclick="V.closeModal()">Plus tard</button></div>`);
  return false;
}

/* ---------- navigation ---------- */
const NAV = [['home', 'Accueil', I.home], ['shop', 'Boutique', I.bag], ['create', '', I.plus], ['jobs', 'Emplois', I.brief], ['profile', 'Profil', I.user]];
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
  $('#ccChips').innerHTML = Object.keys(ZONES).map(z => `<div style="width:100%;font-size:12.5px;font-weight:700;margin:6px 0 2px">${ZONES[z]}</div>` + Object.entries(C).filter(([, c]) => c.z === z).map(([k, c]) => `<button class="chip ${k === S.loc.country ? 'on' : ''}" onclick="V.setLoc('${k}')">${c.f} ${c.n}</button>`).join('')).join('');
  $('#rgChips').innerHTML = `<button class="chip ${S.loc.zone ? 'on' : ''}" onclick="V.setLoc(null,'zone')">🌍 Toute la zone</button><button class="chip ${!S.loc.zone && !S.loc.region ? 'on' : ''}" onclick="V.setLoc(null,'all')">Tout le pays</button>` +
    C[S.loc.country].r.map((r, i) => `<button class="chip ${!S.loc.zone && S.loc.region === r ? 'on' : ''}" onclick="V.setLoc(null,${i})">${esc(r)}</button>`).join('');
}
function setLoc(country, reg) {
  if (country) S.loc = { country, region: null, zone: false };
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
  closeSheet(); go(S.cur);
}

/* =====================================================================
   AUTHENTIFICATION
   ===================================================================== */
let authMode = 'signup';
SCREENS.auth = () => {
  const ccOpts = Object.keys(ZONES).map(z => `<optgroup label="${ZONES[z]}">${Object.entries(C).filter(([, c]) => c.z === z).map(([k, c]) => `<option value="${k}" ${k === S.loc.country ? 'selected' : ''}>${c.f} ${c.n}</option>`).join('')}</optgroup>`).join('');
  $('#s-auth').innerHTML = `<div class="auth"><div class="logo"><span>Vibzo</span></div><p class="mut small" style="text-align:center;margin-top:4px">Vidéos · Emplois · Boutiques près de chez toi</p>
  <div class="seg" style="margin-top:20px"><button class="${authMode === 'signup' ? 'on' : ''}" onclick="V.authTab('signup')">Créer un compte</button><button class="${authMode === 'login' ? 'on' : ''}" onclick="V.authTab('login')">Se connecter</button></div>
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
function authRegions() { const cc = $('#aCc').value; $('#aRg').innerHTML = C[cc].r.map(r => `<option>${esc(r)}</option>`).join(''); $('#aInd').textContent = C[cc].tel; }
function authTab(m) { authMode = m; SCREENS.auth(); }
async function submitAuth() {
  const btn = $('#aBtn'), err = $('#aErr'); err.textContent = '';
  const email = $('#aEmail').value.trim(), password = $('#aPass').value;
  busy(btn, true);
  try {
    if (authMode === 'signup') {
      const cc = $('#aCc').value, tel = $('#aTel').value.replace(/[^\d]/g, '');
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.href.split('#')[0], data: { username: $('#aUser').value.trim().toLowerCase(), display_name: $('#aName').value.trim(), country: cc, region: $('#aRg').value, phone: tel ? C[cc].tel + tel : '' } } });
      if (error) throw error;
      S.loc = { country: cc, region: $('#aRg').value, zone: false }; saveLoc();
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
async function loadMe() {
  if (!uid()) { S.me = null; S.myShop = null; return; }
  const [{ data: me }, { data: shop }] = await Promise.all([
    sb.from('profiles').select('*').eq('id', uid()).maybeSingle(),
    sb.from('shops').select('*').eq('owner_id', uid()).maybeSingle(),
  ]);
  S.me = me; S.myShop = shop;
}
async function logout() { closeSheet(); await sb.auth.signOut(); S.session = null; S.me = null; S.myShop = null; toast('Déconnecté'); go('home'); }

/* =====================================================================
   FIL VIDÉO
   ===================================================================== */
SCREENS.home = async () => {
  const ov = !!S.override;
  $('#s-home').innerHTML = `<div id="topbar">${ov ? `<button class="ib" onclick="V.go(V.S.prev||'home')" aria-label="Retour">${I.back}</button><div></div><div></div>` :
    `<button class="loc" onclick="V.openLoc()">${esc(locLabel())} ▾</button><div class="tabs"><button class="${S.tab === 'abo' ? 'on' : ''}" onclick="V.setTab('abo')">Abonnements</button><button class="${S.tab === 'pour' ? 'on' : ''}" onclick="V.setTab('pour')">Pour toi</button></div><div class="rt"><button class="ib" onclick="V.go('discover')" aria-label="Rechercher">${I.search}</button><button class="ib" onclick="V.openMsgs()" aria-label="Messages">${I.chat}${S.unread ? `<span class="badge">${S.unread}</span>` : ''}</button></div>`}</div>
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
      const id = location.hash.slice(3); const { data: one } = await sb.from('videos_feed').select('*').eq('id', id).maybeSingle();
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
  <div class="vbg" style="background:#0b2540;animation:none"><video src="${esc(v.video_url)}" loop playsinline ${S.muted ? 'muted' : ''} preload="metadata"></video></div>
  ${v.title ? `<div class="vtitle" style="top:auto;bottom:150px">${esc(v.title)}</div>` : ''}
  <div class="vtap" onclick="V.tapVid(event,'${v.id}')"></div><div class="pauseIc">▶</div>
  <div class="rail">
    <div onclick="V.openProfile('${v.user_id}')" style="position:relative">${avatar(v, 46).replace('class="av"', 'class="av" style="border:2px solid #fff"')}${mine || v.following ? '' : `<button class="fol" onclick="event.stopPropagation();V.follow('${v.user_id}',this)" aria-label="Suivre">+</button>`}</div>
    <button class="rb ${v.liked_by_me ? 'on' : ''}" id="lk${v.id}" onclick="V.like('${v.id}')">${I.heart}<span>${fmtN(v.like_count)}</span></button>
    <button class="rb" onclick="V.openComments('${v.id}')">${I.comment}<span id="cc${v.id}">${fmtN(v.comment_count)}</span></button>
    <button class="rb ${v.saved_by_me ? 'on2' : ''}" id="sv${v.id}" onclick="V.save('${v.id}')">${I.bookmark}<span>${v.saved_by_me ? 'Enregistré' : 'Enregistrer'}</span></button>
    <button class="rb" onclick="V.shareVid('${v.id}')">${I.share}<span>Partager</span></button>
    <button class="rb" onclick="V.vidMore('${v.id}')" style="font-size:22px">⋯</button>
  </div>
  <div class="vinfo">
    <div class="vauth" onclick="V.openProfile('${v.user_id}')">@${esc(v.username)}${v.is_vip ? '<span class="vgold">👑 Gold</span>' : ''}<span class="vloc">📍 ${esc(v.region || C[v.country]?.n || '')}</span></div>
    <div class="vcap">${esc(v.caption)} ${(v.tags || []).map(t => `<b>#${esc(t)}</b>`).join(' ')}</div>
    ${v.product_id ? `<button class="vprod" onclick="V.openProduct('${v.product_id}')">🛍️ ${esc(v.product_name)} · ${money(v.product_price, v.product_currency)}</button>` : ''}
    <div class="vsnd" style="font-size:12px;opacity:.85">${esc(ago(v.created_at))}</div>
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
let io;
function observe() {
  if (io) io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (e.target.id === 'moreSlide') { if (e.isIntersecting) loadFeed(false); return; }
    const v = e.target.querySelector('video'); if (!v) return;
    if (e.isIntersecting && S.cur === 'home' && !e.target.classList.contains('paused')) { v.muted = S.muted; v.play().catch(() => { }); } else v.pause();
  }), { threshold: .6 });
  document.querySelectorAll('#feed .slide').forEach(s => io.observe(s));
}
function setTab(t) { S.tab = t; go('home'); }
function toggleMute() { S.muted = !S.muted; document.querySelectorAll('#feed video').forEach(v => v.muted = S.muted); $('.mute').textContent = S.muted ? '🔇' : '🔊'; }
let lastTap = 0, tapT;
function tapVid(e, id) {
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
async function openComments(id) {
  sheet('Commentaires', `<div class="clist" id="clist">${loading()}</div><form class="cinput" onsubmit="event.preventDefault();V.addComment('${id}')"><input id="cIn" placeholder="${uid() ? 'Ajouter un commentaire…' : 'Connecte-toi pour commenter'}" maxlength="500" autocomplete="off"><button aria-label="Envoyer">${I.send}</button></form>`);
  const { data, error } = await sb.from('comments_view').select('*').eq('video_id', id).order('created_at', { ascending: false }).limit(100);
  if (error) return fail(error);
  const v = S.vids.get(id);
  $('#clist').innerHTML = data.length ? data.map(c => `<div class="cm" id="c-${c.id}">${avatar(c, 34)}<div class="grow"><div class="n">${esc(c.display_name)} · @${esc(c.username)}</div><div class="t">${esc(c.body)}</div><div class="n" style="font-weight:500;margin-top:4px">${ago(c.created_at)}${c.user_id === uid() || (v && v.user_id === uid()) ? ` · <button class="mut small" onclick="V.delComment('${c.id}','${id}')">Supprimer</button>` : uid() ? ` · <button class="mut small" onclick="V.report('comment','${c.id}')">Signaler</button>` : ''}</div></div></div>`).join('') : '<p class="mut small" style="text-align:center;padding:20px">Aucun commentaire. Sois le premier !</p>';
}
async function addComment(id) {
  if (!requireAuth('Connecte-toi pour commenter.')) return;
  const inp = $('#cIn'), body = inp.value.trim(); if (!body) return;
  inp.disabled = true;
  const { error } = await sb.from('comments').insert({ video_id: id, user_id: uid(), body });
  inp.disabled = false; if (error) return fail(error);
  inp.value = ''; const v = S.vids.get(id); if (v) { v.comment_count++; const cc = $('#cc' + id); if (cc) cc.textContent = fmtN(v.comment_count); }
  openComments(id);
}
async function delComment(cid, vid) {
  const { error } = await sb.from('comments').delete().eq('id', cid); if (error) return fail(error);
  const el = $('#c-' + cid); if (el) el.remove(); const v = S.vids.get(vid); if (v) { v.comment_count = Math.max(0, v.comment_count - 1); const cc = $('#cc' + vid); if (cc) cc.textContent = fmtN(v.comment_count); }
}
async function shareVid(id) {
  const v = S.vids.get(id); const url = location.href.split('#')[0] + '#v=' + id;
  try { if (navigator.share) { await navigator.share({ title: 'Vibzo', text: v.title || v.caption || 'Regarde cette vidéo sur Vibzo', url }); return; } } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast('Lien copié 🔗'); } catch (e) { sheet('Partager', `<p class="small">Copie ce lien :</p><input value="${esc(url)}" readonly onclick="this.select()">`); }
}
function vidMore(id) {
  const v = S.vids.get(id); const mine = v.user_id === uid();
  sheet('Options', `<div class="slist" style="margin:0">${mine ? `<button onclick="V.delVideo('${id}')"><span class="e">🗑️</span>Supprimer ma vidéo</button>` : `<button onclick="V.report('video','${id}')"><span class="e">🚩</span>Signaler la vidéo</button><button onclick="V.openProfile('${v.user_id}')"><span class="e">👤</span>Voir le profil</button>`}<button onclick="V.shareVid('${id}');V.closeSheet()"><span class="e">🔗</span>Partager</button></div>`);
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
  $('#s-discover').innerHTML = `<div class="hdr"><button class="ib" onclick="V.go('home')" aria-label="Retour">${I.back}</button><div class="search">${I.search}<input id="q" placeholder="Rechercher vidéos, #hashtags, @personnes" oninput="V.searchDebounced()" autocomplete="off"></div></div><div class="pad" id="users"></div><div class="lbl pad">Vidéos récentes · ${esc(locLabel())}</div><div class="vgrid" id="dres">${loading()}</div>`;
  search();
};
function searchDebounced() { clearTimeout(qTimer); qTimer = setTimeout(search, 350); }
async function search() {
  const q = ($('#q') ? $('#q').value : '').trim();
  let vq = sb.from('videos_feed').select('*').eq('status', 'published');
  if (q.startsWith('#') && q.length > 1) vq = vq.contains('tags', [q.slice(1).toLowerCase()]);
  else if (q && !q.startsWith('@')) vq = vq.ilike('caption', `%${q}%`);
  else vq = inScope(vq);
  const [{ data: vids, error }, users] = await Promise.all([
    vq.order('created_at', { ascending: false }).limit(30),
    q ? sb.from('profile_stats').select('*').ilike('username', `%${q.replace(/^@/, '').toLowerCase()}%`).limit(8) : Promise.resolve({ data: [] }),
  ]);
  if (error) return fail(error);
  $('#users').innerHTML = (users.data || []).length ? `<div class="lbl">Personnes</div>` + users.data.map(u => `<button class="mitem" style="padding:8px 0" onclick="V.openProfile('${u.id}')">${avatar(u, 44)}<div class="grow"><div class="n">${esc(u.display_name)}</div><div class="l">@${esc(u.username)} · ${fmtN(u.followers)} abonnés</div></div></button>`).join('') : '';
  $('#dres').innerHTML = vids.length ? vids.map(v => thumb(v, vids)).join('') : `<div class="empty" style="grid-column:1/-1">Aucune vidéo trouvée.</div>`;
  S._grid = vids;
}
const thumb = (v) => { S.vids.set(v.id, v); return `<button class="vth" style="${gst(gfor(v.id))}" onclick="V.openGrid('${v.id}')"><video src="${esc(v.video_url)}#t=0.5" muted preload="metadata" playsinline></video><span>♥ ${fmtN(v.like_count)}</span></button>`; };
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
  <label class="up"><input type="file" accept="video/*" style="display:none" onchange="V.pickVid(this)"><div class="big">📹</div><b>${draft ? 'Changer de vidéo' : 'Choisir une vidéo'}</b><div class="mut small" style="margin-top:4px">Depuis ta galerie ou ta caméra · 50 Mo et 3 minutes maximum</div></label>
  <div class="prev" id="prev" style="${draft ? '' : 'display:none'};background:#0b2540">${draft ? `<video src="${draft.url}" autoplay loop muted playsinline></video>` : ''}</div>
  <div class="field"><label>Titre à l’écran (facultatif)</label><input id="ct" maxlength="80" placeholder="Ex : Mon premier challenge 🔥"></div>
  <div class="field"><label>Description</label><textarea id="cd" rows="2" maxlength="300" placeholder="Décris ta vidéo…"></textarea></div>
  <div class="field"><label>Hashtags</label><input id="ch" placeholder="danse, humour, cuisine"></div>
  ${prods.length ? `<div class="field"><label>🛍️ Taguer un produit de ma boutique</label><select id="cp"><option value="">Aucun</option>${prods.map(p => `<option value="${p.id}">${esc(p.name)} · ${money(p.price, p.currency)}</option>`).join('')}</select></div>` : ''}
  <p class="mut small" style="margin-top:12px">Ta vidéo sera visible par tous dans ta région. Interdit : nudité, violence, arnaques, contenus mettant en scène des mineurs de façon inappropriée.</p>
  <div class="progress" id="prog" style="display:none"><i></i></div>
  <button class="btn" id="pubBtn" onclick="V.publish()">Publier</button></div>`;
};
function pickVid(inp) {
  const f = inp.files[0]; if (!f) return;
  if (f.size > 50 * 1024 * 1024) { toast('Vidéo trop lourde (50 Mo max). Raccourcis-la ou réduis la qualité.'); return; }
  const url = URL.createObjectURL(f);
  const probe = document.createElement('video'); probe.preload = 'metadata'; probe.src = url;
  probe.onloadedmetadata = () => {
    if (probe.duration && probe.duration > 185) { toast('Vidéo trop longue (3 minutes max).'); return; }
    draft = { file: f, url }; const p = $('#prev'); p.style.display = ''; p.innerHTML = `<video src="${url}" autoplay loop muted playsinline></video>`;
  };
  probe.onerror = () => { draft = { file: f, url }; const p = $('#prev'); p.style.display = ''; p.innerHTML = `<video src="${url}" autoplay loop muted playsinline></video>`; };
}
async function publish() {
  if (!draft) return toast('Choisis d’abord une vidéo 📹');
  const btn = $('#pubBtn'); busy(btn, true, 'Envoi en cours…');
  const prog = $('#prog'); prog.style.display = ''; let pct = 5; const bar = prog.querySelector('i');
  const timer = setInterval(() => { pct = Math.min(90, pct + (90 - pct) * 0.08); bar.style.width = pct + '%'; }, 400);
  try {
    const ext = (draft.file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
    const path = `${uid()}/${Date.now()}.${ext}`;
    const { error: upErr } = await sb.storage.from('videos').upload(path, draft.file, { contentType: draft.file.type || 'video/mp4', upsert: false });
    if (upErr) throw upErr;
    const { data: pub } = sb.storage.from('videos').getPublicUrl(path);
    const tags = ($('#ch').value || '').toLowerCase().split(/[,\s#]+/).map(t => t.replace(/[^a-z0-9àâäéèêëïîôöùûüç_]/g, '')).filter(Boolean).slice(0, 8);
    const row = { user_id: uid(), video_url: pub.publicUrl, title: $('#ct').value.trim(), caption: $('#cd').value.trim(), tags, country: S.me.country, region: S.me.region, product_id: ($('#cp') && $('#cp').value) || null };
    const { error } = await sb.from('videos').insert(row); if (error) throw error;
    bar.style.width = '100%'; draft = null; toast('Vidéo publiée 🎉');
    S.tab = 'pour'; S.loc = { country: S.me.country, region: null, zone: false }; saveLoc();
    go('profile');
  } catch (e) { fail(e); } finally { clearInterval(timer); busy(btn, false); }
}

/* =====================================================================
   EMPLOIS
   ===================================================================== */
SCREENS.jobs = async () => {
  const t = S.jobTab;
  $('#s-jobs').innerHTML = hdr('Emplois', locBtn()) + `<div class="pad"><div class="seg"><button class="${t === 'offres' ? 'on' : ''}" onclick="V.jobTab('offres')">📋 Offres</button><button class="${t === 'cands' ? 'on' : ''}" onclick="V.jobTab('cands')">🙋 Candidats</button><button class="${t === 'mine' ? 'on' : ''}" onclick="V.jobTab('mine')">⭐ Mes annonces</button></div>
  ${t !== 'mine' ? `<div class="row" style="margin-top:10px"><select onchange="V.jobSector(this.value)" style="flex:1"><option value="all">Tous les secteurs</option>${SECTORS.map(s => `<option ${S.jobSector === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>` : ''}
  <div class="row" style="margin-top:10px"><button class="btn sm" onclick="V.postJob()">＋ Publier une offre</button><button class="btn sm ghost" onclick="V.myCV()">📄 Mon profil candidat</button></div>
  <div class="list" id="jlist">${loading()}</div></div>`;
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
  return `<div class="card job"><div class="row"><div class="grow" onclick="V.offerDetail('${o.id}')"><div class="t">${esc(o.title)}</div><div class="co">${esc(o.company)}</div></div>${mine ? pill(o.status) : `<span class="mut small">${ago(o.created_at)}</span>`}</div>
  <div class="tags"><span>📍 ${esc(o.region || '')}${o.region ? ', ' : ''}${esc((C[o.country] || {}).n || '')}</span><span>${esc(o.contract)}</span><span>${esc(o.remote)}</span>${o.salary ? `<span class="g">${money(o.salary, o.currency)} / mois</span>` : ''}<span>${esc(o.sector)}</span></div>
  <div class="jact">${mine ? `<button class="btn sm" onclick="V.offerApps('${o.id}')">👥 Candidatures (${o.application_count})</button>${o.status === 'open' ? `<button class="btn sm ghost" onclick="V.closeOffer('${o.id}')">Fermer</button>` : ''}`
      : `<button class="btn sm ${o.applied_by_me ? 'ghost' : ''}" ${o.applied_by_me || o.user_id === uid() ? 'disabled' : ''} onclick="V.applyJob('${o.id}')">${o.applied_by_me ? 'Candidature envoyée ✓' : o.user_id === uid() ? 'Ton offre' : 'Postuler'}</button><button class="btn sm ghost" style="width:auto" onclick="V.offerDetail('${o.id}')">Détails</button><button class="dots" onclick="V.report('job','${o.id}')">🚩</button>`}</div></div>`;
}
function offerDetail(id) { const o = S.offers.get(id); sheet(esc(o.title), `<div class="co mut">${esc(o.company)} · publié par ${esc(o.poster_name)} ${ago(o.created_at)}</div><div class="tags"><span>📍 ${esc(o.region || '')} ${esc((C[o.country] || {}).n || '')}</span><span>${esc(o.contract)}</span><span>${esc(o.remote)}</span>${o.salary ? `<span class="g">${money(o.salary, o.currency)} / mois</span>` : ''}</div><p style="white-space:pre-wrap;margin-top:14px;line-height:1.5;font-size:14.5px">${esc(o.description || 'Pas de description.')}</p><div class="safety">🛡️<span>Un vrai recruteur ne demande jamais d’argent pour un emploi. Signale toute demande de paiement.</span></div>${o.user_id !== uid() && !o.applied_by_me ? `<button class="btn" onclick="V.applyJob('${o.id}')">Postuler</button>` : ''}`); }
function candCard(c) {
  S.cands.set(c.user_id, c);
  return `<div class="card"><div class="row" onclick="V.openProfile('${c.user_id}')">${avatar(c)}<div class="grow"><b>${esc(c.display_name)}</b><div class="mut small">${esc(c.job_title)} · ${c.experience_years} an${c.experience_years > 1 ? 's' : ''} d’expérience</div></div></div>${c.about ? `<p class="small" style="margin-top:8px">${esc(c.about)}</p>` : ''}<div class="tags">${(c.skills || []).map(k => `<span>${esc(k)}</span>`).join('')}<span>📍 ${esc(c.region || (C[c.country] || {}).n || '')}</span><span class="g">Dispo : ${esc(c.availability)}</span></div>${c.user_id === uid() ? '' : `<div class="jact"><button class="btn sm" onclick="V.contactCand('${c.user_id}')">💬 Contacter</button></div>`}</div>`;
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
  <div class="field"><label>Description du poste</label><textarea id="jd" rows="5" maxlength="2000" placeholder="Missions, profil recherché, horaires, comment postuler…"></textarea></div>
  <div class="safety">🛡️<span>Les offres sont vérifiées par l’équipe Vibzo avant publication. Il est interdit de demander de l’argent aux candidats.</span></div>
  <button class="btn" id="jBtn" onclick="V.savePost()">Envoyer pour publication</button>`);
}
async function savePost() {
  const title = $('#jp').value.trim(), company = $('#jc').value.trim(); if (title.length < 2 || company.length < 2) return toast('Renseigne le poste et l’entreprise');
  const btn = $('#jBtn'); busy(btn, true);
  const sal = $('#jsal').value;
  const { error } = await sb.from('job_offers').insert({ user_id: uid(), title, company, sector: $('#js').value, contract: $('#jk').value, remote: $('#jt').value, salary: sal ? Number(sal) : null, currency: C[S.me.country].cur, description: $('#jd').value.trim(), country: S.me.country, region: $('#jr').value });
  busy(btn, false); if (error) return fail(error);
  closeSheet(); toast('Offre envoyée ✅ Elle sera en ligne après vérification.'); S.jobTab = 'mine'; go('jobs');
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
  <div class="field"><label>À propos de toi</label><textarea id="ca" rows="3" maxlength="600">${esc(c ? c.about : '')}</textarea></div>
  <label class="check"><input type="checkbox" id="cv" ${!c || c.visible ? 'checked' : ''}> Visible par les recruteurs</label>
  <button class="btn" id="cvBtn" onclick="V.saveCV()">Enregistrer</button>`);
}
async function saveCV() {
  const m = $('#cm').value.trim(); if (m.length < 2) return toast('Indique le métier recherché');
  const btn = $('#cvBtn'); busy(btn, true);
  const row = { user_id: uid(), job_title: m, sector: $('#cs2').value, experience_years: Math.max(0, Math.min(60, +$('#ce').value || 0)), skills: $('#ck').value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 12), availability: $('#cdp').value, about: $('#ca').value.trim(), country: S.me.country, region: $('#cr').value, visible: $('#cv').checked, updated_at: new Date().toISOString() };
  const { error } = await sb.from('candidates').upsert(row); busy(btn, false); if (error) return fail(error);
  closeSheet(); toast('Profil candidat enregistré ✅'); if (S.cur === 'jobs') { S.jobTab = 'cands'; go('jobs'); }
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
  <div class="lbl">Mes produits</div><div id="myProds">${loading()}</div>
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
  if (!id) { $('#s-profile').innerHTML = hdr('Profil') + `<div class="empty"><div class="big">👤</div><p>Crée ton compte pour publier, suivre des créateurs, postuler et vendre.</p><button class="btn" onclick="V.go('auth')">Se connecter / s’inscrire</button></div><div class="slist"><button onclick="V.openLoc()"><span class="e">📍</span>Pays & région<span class="r">${esc(locLabel())} ›</span></button><button onclick="V.installApp()"><span class="e">📲</span>Installer l’application<span class="r">›</span></button><button onclick="window.open('privacy.html','_blank')"><span class="e">🔒</span>Confidentialité<span class="r">›</span></button></div>`; return; }
  const own = id === uid();
  $('#s-profile').innerHTML = hdr('Profil', own ? `<button class="ib" onclick="V.openMsgs()" aria-label="Messages">${I.chat}${S.unread ? `<span class="badge">${S.unread}</span>` : ''}</button><button class="ib" onclick="V.settings()" aria-label="Paramètres">${I.gear}</button>` : '', own ? '' : (S.prev && S.prev !== 'profile' ? S.prev : 'home')) + loading();
  const { data: p, error } = await sb.from('profile_stats').select('*').eq('id', id).maybeSingle();
  if (error) throw error; if (!p) { $('#s-profile').innerHTML = hdr('Profil', '', 'home') + '<div class="empty">Profil introuvable.</div>'; return; }
  const tab = own ? S.profTab : 'videos';
  $('#s-profile').innerHTML = hdr('@' + esc(p.username), own ? `<button class="ib" onclick="V.openMsgs()" aria-label="Messages">${I.chat}${S.unread ? `<span class="badge">${S.unread}</span>` : ''}</button><button class="ib" onclick="V.settings()" aria-label="Paramètres">${I.gear}</button>` : `<button class="ib" onclick="V.report('profile','${p.id}')" aria-label="Signaler">🚩</button>`, own ? '' : (S.prev && S.prev !== 'profile' ? S.prev : 'home')) + `
  <div class="ptop"><div class="pav ${p.is_vip ? 'gold' : ''}" style="${p.avatar_url ? '' : gbg(gfor(p.username))}">${p.avatar_url ? `<img class="avimg" src="${esc(p.avatar_url)}" alt="">` : esc(p.display_name[0].toUpperCase())}${p.is_vip ? '<span class="gb">👑</span>' : ''}</div>
  <h2 style="margin-top:12px;font-size:19px">${esc(p.display_name)}</h2>${p.bio ? `<p class="mut" style="font-size:14px;margin-top:4px">${esc(p.bio)}</p>` : ''}
  <div class="tags" style="justify-content:center"><span>📍 ${esc(p.region || '')} ${esc((C[p.country] || {}).f || '')} ${esc((C[p.country] || {}).n || '')}</span>${p.is_vip ? '<span style="color:#a87800">👑 Gold</span>' : ''}</div>
  <div class="pstats"><div><b>${fmtN(p.following)}</b><span>Abonnements</span></div><div><b>${fmtN(p.followers)}</b><span>Abonnés</span></div><div><b>${fmtN(p.likes_received)}</b><span>J’aime</span></div></div>
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
  <button class="btn" id="eBtn" onclick="V.saveProfile()">Enregistrer</button>`);
}
const regionOpts = (cc, sel) => C[cc].r.map(r => `<option ${r === sel ? 'selected' : ''}>${esc(r)}</option>`).join('');
async function saveProfile() {
  const btn = $('#eBtn'); busy(btn, true);
  try {
    const row = { display_name: $('#en').value.trim() || S.me.display_name, username: $('#eu').value.trim().toLowerCase(), bio: $('#eb').value.trim(), country: $('#ec').value, region: $('#er').value, phone: $('#et').value.trim() || null };
    if (!/^[a-z0-9_.]{3,24}$/.test(row.username)) throw new Error('Nom d’utilisateur : 3 à 24 caractères (lettres, chiffres, . et _)');
    const f = $('#ei').files[0]; if (f) row.avatar_url = await uploadImage(f);
    const { data, error } = await sb.from('profiles').update(row).eq('id', uid()).select().single();
    if (error) throw (/duplicate|unique/i.test(error.message) ? new Error('Ce nom d’utilisateur est déjà pris') : error);
    S.me = data; closeSheet(); toast('Profil mis à jour ✅'); go('profile');
  } catch (e) { fail(e); } finally { busy(btn, false); }
}
function settings() {
  const vip = S.me.vip_until && new Date(S.me.vip_until) > new Date();
  sheet('Paramètres', `<div class="slist" style="margin:0">
  <button onclick="V.openLoc()"><span class="e">📍</span>Pays & région<span class="r">${esc(locLabel())} ›</span></button>
  <button onclick="V.gold()"><span class="e">👑</span>Vibzo Gold<span class="r">${vip ? 'Actif jusqu’au ' + new Date(S.me.vip_until).toLocaleDateString('fr-FR') : 'Découvrir'} ›</span></button>
  <button onclick="V.closeSheet();${S.myShop ? 'V.myShopSheet()' : 'V.shopForm()'}"><span class="e">🏪</span>Ma boutique<span class="r">${S.myShop ? (ST[S.myShop.status] || [''])[0] : 'Ouvrir'} ›</span></button>
  <button onclick="V.myCV()"><span class="e">📄</span>Mon profil candidat<span class="r">›</span></button>
  <button onclick="V.installApp()"><span class="e">📲</span>Installer l’application<span class="r">›</span></button>
  <button onclick="window.open('privacy.html','_blank')"><span class="e">🔒</span>Confidentialité<span class="r">›</span></button>
  ${S.me.role === 'admin' ? `<button onclick="V.closeSheet();V.go('admin')"><span class="e">🛠️</span>Back-office admin<span class="r">›</span></button>` : ''}
  <button onclick="V.logout()"><span class="e">🚪</span>Se déconnecter</button></div>
  <p class="mut small" style="text-align:center;margin-top:14px">Connecté : ${esc(S.session.user.email || '')}</p>`);
}
function gold() {
  const msg = encodeURIComponent('Bonjour, je souhaite activer Vibzo Gold pour le compte @' + S.me.username);
  sheet('👑 Vibzo Gold', `<div class="hero" style="margin:0"><div class="cr">👑</div><h2>Vibzo Gold</h2><div class="perks"><div>✨ Badge Gold sur ton profil et tes vidéos</div><div>💼 Mise en avant de tes candidatures et offres (bientôt)</div><div>💘 Espace rencontres entre adultes vérifiés (bientôt)</div></div></div>
  <p class="small" style="margin-top:14px">Le paiement en ligne arrive bientôt. En attendant, l’activation se fait avec l’équipe Vibzo.</p>
  ${SUPPORT_WHATSAPP ? `<a class="btn gold" style="text-decoration:none" href="https://wa.me/${SUPPORT_WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Activer Gold sur WhatsApp</a>` : '<p class="mut small">Contact de l’équipe à venir.</p>'}`);
}

/* =====================================================================
   MESSAGERIE
   ===================================================================== */
function openMsgs() { if (!requireAuth('Connecte-toi pour voir tes messages.')) return; go('msgs'); }
SCREENS.msgs = async () => {
  $('#s-msgs').innerHTML = hdr('Messages', '', S.prev && S.prev !== 'msgs' && S.prev !== 'chat' ? S.prev : 'home') + `<div id="mlist">${loading()}</div>`;
  const { data, error } = await sb.from('conversation_list').select('*').order('last_at', { ascending: false }).limit(100);
  if (error) throw error;
  S.unread = data.filter(c => c.unread).length;
  const tl = { dm: ['Message', 'dm'], job: ['Emploi', 'job'], shop: ['Boutique', 'shop'] };
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
   BACK-OFFICE
   ===================================================================== */
SCREENS.admin = async () => {
  if (!S.me || S.me.role !== 'admin') { $('#s-admin').innerHTML = hdr('Back-office', '', 'profile') + '<div class="empty">Accès réservé.</div>'; return; }
  $('#s-admin').innerHTML = hdr('Back-office', '', 'profile') + `<div class="pad" id="adm">${loading()}</div>`;
  const [st, offers, shops, reports] = await Promise.all([
    sb.rpc('admin_stats'),
    sb.from('offers_view').select('*').eq('status', 'pending').order('created_at').limit(50),
    sb.from('shops').select('*').in('status', ['pending', 'active', 'suspended']).order('created_at', { ascending: false }).limit(100),
    sb.from('reports').select('*').eq('status', 'open').order('created_at').limit(100),
  ]);
  if (st.error) throw st.error;
  const s = st.data;
  (offers.data || []).forEach(o => S.offers.set(o.id, o));
  $('#adm').innerHTML = `<div class="stats">${[['Utilisateurs', s.users], ['Nouveaux (7 j)', s.users_7d], ['Vidéos', s.videos], ['Membres Gold', s.vip], ['Boutiques actives', s.shops_active], ['Boutiques en attente', s.shops_pending], ['Offres en ligne', s.offers_open], ['Offres à valider', s.offers_pending], ['Commandes', s.orders], ['Signalements ouverts', s.reports_open]].map(([l, v]) => `<div class="stat"><b>${fmtN(v)}</b><span>${l}</span></div>`).join('')}</div>
  <div class="lbl">Utilisateurs par pays</div><div class="tags">${Object.entries(s.by_country || {}).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span>${(C[k] || {}).f || ''} ${esc((C[k] || {}).n || k)} : ${n}</span>`).join('')}</div>
  <div class="lbl">Activer Gold (paiement reçu)</div><div class="row"><input id="vu" placeholder="nom d’utilisateur"><input id="vd" type="number" value="30" style="width:80px"><button class="btn sm" style="width:auto" onclick="V.setVip()">OK</button></div>
  <div class="lbl">Offres à valider (${(offers.data || []).length})</div>${(offers.data || []).map(o => `<div class="mq"><div class="grow"><b style="font-size:14px">${esc(o.title)}</b><div class="mut small">${esc(o.company)} · ${esc((C[o.country] || {}).n || '')} · par ${esc(o.poster_name)}</div><button class="mut small" onclick="V.offerDetail('${o.id}')" style="text-decoration:underline">Lire</button></div><div class="acts"><button class="ok" onclick="V.modOffer('${o.id}','open')">Publier</button><button class="ko" onclick="V.modOffer('${o.id}','rejected')">Refuser</button></div></div>`).join('') || '<p class="mut small">Rien à valider.</p>'}
  <div class="lbl">Boutiques</div>${(shops.data || []).map(sh => `<div class="mq"><div class="grow"><b style="font-size:14px">${esc(sh.name)}</b> ${pill(sh.status)}<div class="mut small">${esc((C[sh.country] || {}).n || '')} · ${esc(sh.platform)}${sh.whatsapp ? ' · ' + esc(sh.whatsapp) : ''}${sh.paid_until ? ' · payé jusqu’au ' + new Date(sh.paid_until).toLocaleDateString('fr-FR') : ''}</div></div><div class="acts"><button class="ok" onclick="V.modShop('${sh.id}','active')">+30 j</button>${sh.status !== 'suspended' ? `<button class="ko" onclick="V.modShop('${sh.id}','suspended')">Suspendre</button>` : ''}</div></div>`).join('') || '<p class="mut small">Aucune boutique.</p>'}
  <div class="lbl">Signalements (${(reports.data || []).length})</div>${(reports.data || []).map(r => `<div class="mq"><span class="k">🚩</span><div class="grow"><b style="font-size:14px">${esc(r.reason)}</b><div class="mut small">${esc(r.target_type)} · ${ago(r.created_at)}</div></div><div class="acts">${r.target_type === 'video' ? `<button class="ko" onclick="V.modReport('${r.id}','${esc(r.target_id)}','hide')">Masquer</button>` : r.target_type === 'comment' ? `<button class="ko" onclick="V.modReport('${r.id}','${esc(r.target_id)}','delc')">Supprimer</button>` : r.target_type === 'profile' ? `<button class="ok" onclick="V.openProfile('${esc(r.target_id)}')">Voir</button>` : ''}<button class="ok" onclick="V.modReport('${r.id}','','ok')">Classer</button></div></div>`).join('') || '<p class="mut small">Aucun signalement 🎉</p>'}`;
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
async function setVip() { const u = $('#vu').value.trim().replace(/^@/, ''), d = +$('#vd').value || 30; if (!u) return; const { data, error } = await sb.rpc('admin_set_vip', { p_username: u, p_days: d }); if (error) return fail(error); toast('Gold actif jusqu’au ' + new Date(data).toLocaleDateString('fr-FR')); }

/* =====================================================================
   DÉMARRAGE
   ===================================================================== */
window.V = {
  S, go, closeSheet, closeModal, openLoc, setLoc, applyLoc, authTab, authRegions, submitAuth, forgot, logout,
  setTab, toggleMute, tapVid, like, save, follow, openComments, addComment, delComment, shareVid, vidMore, delVideo, doDelVideo, report, sendReport,
  searchDebounced, openGrid, pickVid, publish,
  jobTab: t => { S.jobTab = t; go('jobs'); }, jobSector: s => { S.jobSector = s; go('jobs'); }, offerDetail, applyJob, sendApp, contactCand, postJob, savePost, myCV, saveCV, offerApps, closeOffer, chatWith,
  openProduct, orderForm, placeOrder, shopForm, saveShop, myShopSheet, addProd, toggleProd, delProd, orderTab: t => { orderTab = t; go('orders'); }, setOrder,
  openProfile, toggleFollow, editProfile, saveProfile, regionOpts, settings, gold, profTab: t => { S.profTab = t; go('profile'); },
  installApp, openMsgs, openChat, sendMsg, chatMore, modOffer, modShop, modReport, setVip,
};

async function start() {
  if (!isConfigured()) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('on')); $('#nav').style.display = 'none';
    $('#s-home').classList.add('on');
    $('#s-home').innerHTML = `<div class="setup"><div class="logo" style="font-size:34px"><span>Vibzo</span></div><h2 style="margin-top:14px">Configuration requise</h2><p class="mut">Le serveur n’est pas encore relié. Ouvre <code>app/config.js</code> et renseigne l’adresse et la clé publique de ton projet Supabase (voir <code>SETUP.md</code>).</p></div>`;
    return;
  }
  try { sb = await getClient(); } catch (e) { $('#s-home').innerHTML = `<div class="setup"><h2>Connexion impossible</h2><p class="mut">Vérifie ta connexion internet puis recharge la page.</p></div>`; return; }
  const { data } = await sb.auth.getSession(); S.session = data.session;
  await loadMe().catch(fail);
  if (S.me && !localStorage.getItem('vibzo_loc')) { S.loc = { country: S.me.country, region: null, zone: false }; saveLoc(); }
  sb.auth.onAuthStateChange(async (ev, session) => {
    const was = uid(); S.session = session;
    if (ev === 'PASSWORD_RECOVERY') { const np = prompt('Nouveau mot de passe (8 caractères minimum)'); if (np && np.length >= 8) { const { error } = await sb.auth.updateUser({ password: np }); toast(error ? '⚠️ ' + error.message : 'Mot de passe modifié ✅'); } }
    if ((session && session.user.id) !== was) { await loadMe().catch(fail); if (session && S.cur === 'auth') { toast('Bienvenue sur Vibzo 👋'); go('home'); } }
  });
  go('home');
  setInterval(refreshUnread, 30000); refreshUnread();
}
start();
