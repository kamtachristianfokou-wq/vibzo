-- Vibzo · migration 019 : vendeurs/recruteurs vérifiés, avis clients, achat pendant le live

-- ---------- types de notification ----------
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (type in
  ('like','comment','reply','follow','mention','repost','comment_like','referral','system','gift','wallet',
   'match','order','order_status','application','offer_ok','live','review','verified'));

-- =====================================================================
-- 1. BADGE VÉRIFIÉ (identité contrôlée par l'équipe Vibzo)
-- =====================================================================
alter table public.profiles add column if not exists verified boolean not null default false;
alter table public.profiles add column if not exists verified_at timestamptz;
grant select (verified, verified_at) on public.profiles to anon, authenticated;

create or replace function public.protect_profile_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() and coalesce(current_setting('vibzo.system', true), '') <> '1' then
    new.role := old.role;
    new.vip_until := old.vip_until;
    new.created_at := old.created_at;
    new.verified := old.verified;
    new.verified_at := old.verified_at;
    if tg_op = 'UPDATE' then new.referred_by := old.referred_by; end if;
  end if;
  return new;
end $$;

create table if not exists public.verification_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  kind       text not null check (kind in ('seller','recruiter','creator')),
  full_name  text not null check (char_length(full_name) between 3 and 80),
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create index if not exists verification_requests_status_idx on public.verification_requests (status, created_at);
alter table public.verification_requests enable row level security;
drop policy if exists "verif own" on public.verification_requests;
create policy "verif own" on public.verification_requests for select using (user_id = auth.uid() or public.is_admin());

create or replace function public.request_verification(p_kind text, p_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); rid uuid;
begin
  if me is null then raise exception 'Connecte-toi d’abord'; end if;
  if not public.is_real_account(me) then raise exception 'Confirme ton adresse e-mail d’abord'; end if;
  if (select verified from profiles where id = me) then raise exception 'Ton compte est déjà vérifié ✔️'; end if;
  if p_kind not in ('seller','recruiter','creator') then raise exception 'Type invalide'; end if;
  if char_length(coalesce(trim(p_name), '')) < 3 then raise exception 'Indique ton nom complet'; end if;
  select id into rid from verification_requests where user_id = me and status = 'pending';
  if rid is not null then return rid; end if;
  if (select count(*) from verification_requests where user_id = me and created_at > now() - interval '30 days') >= 3 then
    raise exception 'Trop de demandes ce mois-ci, contacte le support';
  end if;
  insert into verification_requests (user_id, kind, full_name) values (me, p_kind, left(trim(p_name), 80)) returning id into rid;
  return rid;
end $$;
revoke execute on function public.request_verification(text, text) from public, anon;
grant execute on function public.request_verification(text, text) to authenticated;

create or replace function public.admin_verification_queue() returns table (
  id uuid, user_id uuid, username text, display_name text, country text, kind text, full_name text, created_at timestamptz,
  account_age_days integer, sales integer, offers integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé à l’administration'; end if;
  return query
  select r.id, r.user_id, p.username, p.display_name, p.country, r.kind, r.full_name, r.created_at,
    (extract(day from now() - p.created_at))::integer,
    (select count(*) from orders o join shops s on s.id = o.shop_id where s.owner_id = r.user_id and o.status = 'delivered')::integer,
    (select count(*) from job_offers j where j.user_id = r.user_id)::integer
  from verification_requests r join profiles p on p.id = r.user_id
  where r.status = 'pending' order by r.created_at;
end $$;
revoke execute on function public.admin_verification_queue() from public, anon;
grant execute on function public.admin_verification_queue() to authenticated;

create or replace function public.admin_verify(p_req uuid, p_ok boolean) returns void
language plpgsql security definer set search_path = public as $$
declare r verification_requests;
begin
  if not public.is_admin() then raise exception 'Réservé à l’administration'; end if;
  update verification_requests set status = case when p_ok then 'approved' else 'rejected' end, decided_at = now()
    where id = p_req and status = 'pending' returning * into r;
  if r.id is null then raise exception 'Demande introuvable ou déjà traitée'; end if;
  if p_ok then
    perform set_config('vibzo.system', '1', true);
    update profiles set verified = true, verified_at = now() where id = r.user_id;
    perform set_config('vibzo.system', '', true);
    perform public.notify_ref(r.user_id, null, 'verified', r.id, '✔️ Ton compte est vérifié ! Le badge apparaît sur ton profil, ta boutique et tes offres.');
  else
    perform public.notify_ref(r.user_id, null, 'verified', r.id, 'Ta demande de vérification n’a pas pu être validée. Contacte le support pour en savoir plus.');
  end if;
end $$;
revoke execute on function public.admin_verify(uuid, boolean) from public, anon;
grant execute on function public.admin_verify(uuid, boolean) to authenticated;

create or replace function public.admin_set_verified(p_user uuid, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé à l’administration'; end if;
  perform set_config('vibzo.system', '1', true);
  update profiles set verified = p_on, verified_at = case when p_on then now() else null end where id = p_user;
  perform set_config('vibzo.system', '', true);
end $$;
revoke execute on function public.admin_set_verified(uuid, boolean) from public, anon;
grant execute on function public.admin_set_verified(uuid, boolean) to authenticated;

-- =====================================================================
-- 2. AVIS CLIENTS SUR LES BOUTIQUES
-- =====================================================================
alter table public.shops add column if not exists rating_sum   integer not null default 0;
alter table public.shops add column if not exists rating_count integer not null default 0;
alter table public.shops add column if not exists sales_count  integer not null default 0;

create or replace function public.protect_shop_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() and coalesce(current_setting('vibzo.system', true), '') <> '1' then
    if tg_op = 'INSERT' then
      new.status := 'active'; new.paid_until := now() + interval '30 days';
      new.rating_sum := 0; new.rating_count := 0; new.sales_count := 0;
    else
      new.status := old.status; new.paid_until := old.paid_until; new.owner_id := old.owner_id;
      new.rating_sum := old.rating_sum; new.rating_count := old.rating_count; new.sales_count := old.sales_count;
    end if;
  end if;
  return new;
end $$;

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null unique references public.orders(id) on delete cascade,
  shop_id    uuid not null references public.shops(id) on delete cascade,
  buyer_id   uuid not null references public.profiles(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  product_name text not null default '',
  comment    text not null default '' check (char_length(comment) <= 300),
  reply      text check (char_length(reply) <= 300),
  created_at timestamptz not null default now(),
  replied_at timestamptz
);
create index if not exists reviews_shop_idx on public.reviews (shop_id, created_at desc);
alter table public.reviews enable row level security;
drop policy if exists "reviews read" on public.reviews;
create policy "reviews read" on public.reviews for select using (true);

create or replace view public.reviews_view with (security_invoker = true) as
SELECT r.id, r.shop_id, r.rating, r.comment, r.reply, r.created_at, r.replied_at, r.product_name,
  p.username, p.display_name, p.avatar_url
FROM reviews r JOIN profiles p ON p.id = r.buyer_id;

create or replace function public.leave_review(p_order uuid, p_rating integer, p_comment text) returns void
language plpgsql security definer set search_path = public as $$
declare o orders; owner uuid;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  select * into o from orders where id = p_order and buyer_id = auth.uid();
  if o.id is null then raise exception 'Commande introuvable'; end if;
  if not public.is_real_account(auth.uid()) then raise exception 'Confirme ton adresse e-mail pour laisser un avis'; end if;
  if not (o.status = 'delivered' or (o.status in ('confirmed','shipped','new') and o.created_at < now() - interval '10 days')) then
    raise exception 'Tu pourras noter la boutique après la livraison';
  end if;
  if p_rating < 1 or p_rating > 5 then raise exception 'Note invalide'; end if;
  if exists (select 1 from reviews where order_id = p_order) then raise exception 'Tu as déjà noté cette commande'; end if;
  insert into reviews (order_id, shop_id, buyer_id, rating, comment, product_name)
    values (o.id, o.shop_id, auth.uid(), p_rating, left(coalesce(trim(p_comment), ''), 300), o.product_name);
  perform set_config('vibzo.system', '1', true);
  update shops set rating_sum = rating_sum + p_rating, rating_count = rating_count + 1 where id = o.shop_id returning owner_id into owner;
  perform set_config('vibzo.system', '', true);
  perform public.notify_ref(owner, auth.uid(), 'review', o.shop_id, repeat('★', p_rating) || repeat('☆', 5 - p_rating) || ' ' || left(coalesce(trim(p_comment), ''), 100));
end $$;
revoke execute on function public.leave_review(uuid, integer, text) from public, anon;
grant execute on function public.leave_review(uuid, integer, text) to authenticated;

create or replace function public.reply_review(p_review uuid, p_reply text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if char_length(coalesce(trim(p_reply), '')) < 2 then raise exception 'Réponse trop courte'; end if;
  update reviews r set reply = left(trim(p_reply), 300), replied_at = now()
    where r.id = p_review and r.reply is null and exists (select 1 from shops s where s.id = r.shop_id and s.owner_id = auth.uid());
  if not found then raise exception 'Impossible de répondre à cet avis'; end if;
end $$;
revoke execute on function public.reply_review(uuid, text) from public, anon;
grant execute on function public.reply_review(uuid, text) to authenticated;

-- ventes livrées comptées automatiquement + avis possibles dans la liste des commandes
create or replace function public.trg_shop_sales() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'delivered' and old.status is distinct from 'delivered' then
    perform set_config('vibzo.system', '1', true);
    update shops set sales_count = sales_count + 1 where id = new.shop_id;
    perform set_config('vibzo.system', '', true);
  end if;
  return new;
end $$;
revoke execute on function public.trg_shop_sales() from public, anon, authenticated;
drop trigger if exists shop_sales on public.orders;
create trigger shop_sales after update of status on public.orders for each row execute function public.trg_shop_sales();
update shops s set sales_count = (select count(*) from orders o where o.shop_id = s.id and o.status = 'delivered')
  where exists (select 1 from orders o where o.shop_id = s.id and o.status = 'delivered');

-- =====================================================================
-- 3. ACHAT PENDANT LE LIVE
-- =====================================================================
alter table public.lives add column if not exists pinned_product uuid references public.products(id) on delete set null;
alter table public.lives add column if not exists orders_count integer not null default 0;
alter table public.orders add column if not exists live_id uuid references public.lives(id) on delete set null;

create or replace function public.live_pin(p_live uuid, p_product uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_product is not null and not exists (
    select 1 from products pr join shops s on s.id = pr.shop_id
    where pr.id = p_product and pr.active and s.owner_id = auth.uid() and s.status = 'active' and (s.paid_until is null or s.paid_until > now())
  ) then raise exception 'Produit indisponible'; end if;
  update lives set pinned_product = p_product where id = p_live and host_id = auth.uid() and status = 'live';
  if not found then raise exception 'Live introuvable'; end if;
end $$;
revoke execute on function public.live_pin(uuid, uuid) from public, anon;
grant execute on function public.live_pin(uuid, uuid) to authenticated;

-- nouvelle version avec le live (l'ancienne place_order reste pour les applis pas encore mises à jour)
create or replace function public.place_order_v2(p_product uuid, p_qty integer, p_address text, p_phone text, p_note text default '', p_live uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare pr products; s shops; oid uuid; cid uuid; lv uuid;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  select * into pr from products where id = p_product and active;
  if pr.id is null then raise exception 'Produit indisponible'; end if;
  select * into s from shops where id = pr.shop_id and status = 'active';
  if s.id is null then raise exception 'Boutique indisponible'; end if;
  if s.owner_id = auth.uid() then raise exception 'C''est votre propre boutique'; end if;
  if p_qty < 1 or p_qty > 99 then raise exception 'Quantité invalide'; end if;
  if p_live is not null then select id into lv from lives where id = p_live and host_id = s.owner_id; end if;
  insert into orders (buyer_id, shop_id, product_id, product_name, quantity, unit_price, total, currency, address, phone, note, live_id)
  values (auth.uid(), s.id, pr.id, pr.name, p_qty, pr.price, pr.price * p_qty, pr.currency, p_address, p_phone, left(coalesce(p_note, ''), 300), lv)
  returning id into oid;
  if lv is not null then update lives set orders_count = orders_count + 1 where id = lv; end if;
  cid := public.start_conversation(s.owner_id, 'shop', 'Commande : ' || pr.name, oid);
  insert into messages (conversation_id, sender_id, body)
  values (cid, auth.uid(), 'Nouvelle commande' || case when lv is not null then ' (pendant le live)' else '' end || ' : ' || p_qty || ' × ' || pr.name || ' (' || (pr.price * p_qty) || ' ' || pr.currency || '), paiement à la livraison. Adresse : ' || p_address);
  return oid;
end $$;
revoke execute on function public.place_order_v2(uuid, integer, text, text, text, uuid) from public, anon;
grant execute on function public.place_order_v2(uuid, integer, text, text, text, uuid) to authenticated;

-- =====================================================================
-- 4. VUES : badge, notes et produit épinglé
-- =====================================================================
create or replace view public.products_view with (security_invoker = true) as
SELECT pr.id, pr.shop_id, pr.name, pr.description, pr.price, pr.currency, pr.image_url, pr.stock, pr.active, pr.created_at,
  s.name AS shop_name, s.platform, s.whatsapp, s.country, s.region, s.owner_id,
  op.verified AS seller_verified, s.rating_sum, s.rating_count, s.sales_count, s.created_at AS shop_since
FROM products pr JOIN shops s ON s.id = pr.shop_id JOIN profiles op ON op.id = s.owner_id;

create or replace view public.offers_view with (security_invoker = true) as
SELECT o.id, o.user_id, o.company, o.title, o.sector, o.contract, o.remote, o.salary, o.currency, o.description, o.country, o.region, o.status, o.created_at,
  p.display_name AS poster_name,
  ((SELECT count(*) FROM applications a WHERE a.offer_id = o.id))::integer AS application_count,
  (EXISTS (SELECT 1 FROM applications a WHERE a.offer_id = o.id AND a.user_id = auth.uid())) AS applied_by_me,
  p.verified AS poster_verified
FROM job_offers o JOIN profiles p ON p.id = o.user_id;

create or replace view public.profile_stats with (security_invoker = true) as
SELECT id, username, display_name, bio, avatar_url, country, region, created_at,
  ((vip_until IS NOT NULL) AND (vip_until > now())) AS is_vip,
  ((SELECT count(*) FROM follows f WHERE f.followee_id = p.id))::integer AS followers,
  ((SELECT count(*) FROM follows f WHERE f.follower_id = p.id))::integer AS following,
  ((SELECT count(*) FROM videos v WHERE v.user_id = p.id AND v.status = 'published'))::integer AS videos,
  ((SELECT count(*) FROM likes l JOIN videos v ON v.id = l.video_id WHERE v.user_id = p.id))::integer AS likes_received,
  (EXISTS (SELECT 1 FROM follows f WHERE f.followee_id = p.id AND f.follower_id = auth.uid())) AS followed_by_me,
  instagram, tiktok, youtube,
  ((SELECT COALESCE(sum(v.view_count), 0) FROM videos v WHERE v.user_id = p.id AND v.status = 'published'))::bigint AS views,
  is_creator(id) AS is_creator,
  verified
FROM profiles p;

create or replace view public.lives_now with (security_invoker = true) as
SELECT l.id, l.host_id, l.title, l.country, l.region, l.started_at, l.viewers, l.likes, l.gift_coins,
  p.username, p.display_name, p.avatar_url,
  EXISTS (SELECT 1 FROM follows f WHERE f.followee_id = l.host_id AND f.follower_id = auth.uid()) AS following,
  l.pinned_product, p.verified
FROM lives l JOIN profiles p ON p.id = l.host_id
WHERE l.status = 'live' AND l.last_seen > now() - interval '45 seconds';

-- =====================================================================
-- 5. SERVICES PRÈS DE CHEZ MOI (artisans et prestataires)
-- =====================================================================
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (type in
  ('like','comment','reply','follow','mention','repost','comment_like','referral','system','gift','wallet',
   'match','order','order_status','application','offer_ok','live','review','verified','service','challenge'));

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  category     text not null check (char_length(category) between 2 and 40),
  title        text not null check (char_length(title) between 3 and 80),
  description  text not null default '' check (char_length(description) <= 600),
  price_from   numeric check (price_from is null or price_from >= 0),
  currency     text not null default 'FCFA',
  country      text not null,
  region       text,
  area         text check (char_length(area) <= 80),
  whatsapp     text check (char_length(whatsapp) <= 20),
  video_id     uuid references public.videos(id) on delete set null,
  image_url    text,
  status       text not null default 'active' check (status in ('active','hidden')),
  rating_sum   integer not null default 0,
  rating_count integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists services_geo_idx on public.services (country, region, category, created_at desc);
alter table public.services enable row level security;
drop policy if exists "services read" on public.services;
create policy "services read" on public.services for select using (status = 'active' or user_id = auth.uid() or public.is_admin());
drop policy if exists "services insert" on public.services;
create policy "services insert" on public.services for insert with check (user_id = auth.uid());
drop policy if exists "services update" on public.services;
create policy "services update" on public.services for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "services delete" on public.services;
create policy "services delete" on public.services for delete using (user_id = auth.uid() or public.is_admin());

create or replace function public.protect_service_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() and coalesce(current_setting('vibzo.system', true), '') <> '1' then
    if tg_op = 'INSERT' then
      if (select count(*) from services where user_id = auth.uid()) >= 5 then raise exception 'Maximum 5 services par compte'; end if;
      new.rating_sum := 0; new.rating_count := 0; new.status := 'active';
    else
      new.user_id := old.user_id; new.rating_sum := old.rating_sum; new.rating_count := old.rating_count; new.created_at := old.created_at;
    end if;
    if new.video_id is not null and not exists (select 1 from videos v where v.id = new.video_id and v.user_id = new.user_id) then new.video_id := null; end if;
  end if;
  return new;
end $$;
revoke execute on function public.protect_service_fields() from public, anon, authenticated;
drop trigger if exists protect_service on public.services;
create trigger protect_service before insert or update on public.services for each row execute function public.protect_service_fields();

create table if not exists public.service_reviews (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  comment    text not null default '' check (char_length(comment) <= 300),
  created_at timestamptz not null default now(),
  unique (service_id, user_id)
);
alter table public.service_reviews enable row level security;
drop policy if exists "service reviews read" on public.service_reviews;
create policy "service reviews read" on public.service_reviews for select using (true);

create or replace view public.services_view with (security_invoker = true) as
SELECT s.id, s.user_id, s.category, s.title, s.description, s.price_from, s.currency, s.country, s.region, s.area, s.whatsapp,
  s.video_id, s.image_url, s.status, s.rating_sum, s.rating_count, s.created_at,
  p.username, p.display_name, p.avatar_url, p.verified, v.video_url
FROM services s JOIN profiles p ON p.id = s.user_id LEFT JOIN videos v ON v.id = s.video_id AND v.status = 'published';

create or replace view public.service_reviews_view with (security_invoker = true) as
SELECT r.id, r.service_id, r.rating, r.comment, r.created_at, p.username, p.display_name, p.avatar_url
FROM service_reviews r JOIN profiles p ON p.id = r.user_id;

-- Un avis n'est possible qu'après avoir réellement contacté le prestataire par message
create or replace function public.review_service(p_service uuid, p_rating integer, p_comment text) returns void
language plpgsql security definer set search_path = public as $$
declare sv services;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  if not public.is_real_account(auth.uid()) then raise exception 'Confirme ton adresse e-mail pour laisser un avis'; end if;
  select * into sv from services where id = p_service and status = 'active';
  if sv.id is null then raise exception 'Service introuvable'; end if;
  if sv.user_id = auth.uid() then raise exception 'Tu ne peux pas noter ton propre service'; end if;
  if p_rating < 1 or p_rating > 5 then raise exception 'Note invalide'; end if;
  if not exists (
    select 1 from conversation_members a join conversation_members b on b.conversation_id = a.conversation_id
    join messages m on m.conversation_id = a.conversation_id
    where a.user_id = auth.uid() and b.user_id = sv.user_id and m.sender_id = sv.user_id and m.created_at < now() - interval '1 hour'
  ) then raise exception 'Tu pourras noter ce prestataire après avoir échangé avec lui par message'; end if;
  if exists (select 1 from service_reviews where service_id = p_service and user_id = auth.uid()) then raise exception 'Tu as déjà noté ce service'; end if;
  insert into service_reviews (service_id, user_id, rating, comment) values (p_service, auth.uid(), p_rating, left(coalesce(trim(p_comment), ''), 300));
  perform set_config('vibzo.system', '1', true);
  update services set rating_sum = rating_sum + p_rating, rating_count = rating_count + 1 where id = p_service;
  perform set_config('vibzo.system', '', true);
  perform public.notify_ref(sv.user_id, auth.uid(), 'service', sv.id, repeat('★', p_rating) || repeat('☆', 5 - p_rating) || ' ' || sv.title);
end $$;
revoke execute on function public.review_service(uuid, integer, text) from public, anon;
grant execute on function public.review_service(uuid, integer, text) to authenticated;

-- =====================================================================
-- 6. DÉFIS SPONSORISÉS PAR DES MARQUES
-- =====================================================================
-- La marque crée un défi et paie la cagnotte + 15 % de frais Vibzo (paiement manuel validé par l'admin).
-- Participer = publier une vidéo avec le hashtag pendant le défi. Classement selon les vues réelles et les j'aime.
-- À la fin, la marque (ou l'admin après 7 jours) désigne 3 gagnants ; les prix arrivent dans leur portefeuille Vibzo.
create table if not exists public.challenges (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.profiles(id) on delete cascade,
  brand_name  text not null check (char_length(brand_name) between 2 and 60),
  title       text not null check (char_length(title) between 3 and 80),
  hashtag     text not null check (hashtag ~ '^[a-z0-9_]{3,30}$'),
  description text not null default '' check (char_length(description) <= 800),
  prize1      integer not null check (prize1 > 0),
  prize2      integer not null default 0 check (prize2 >= 0),
  prize3      integer not null default 0 check (prize3 >= 0),
  currency    text not null check (currency in ('FCFA','₼')),
  countries   text[],
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      text not null default 'pending' check (status in ('pending','active','finished','rejected')),
  winners     uuid[],
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at)
);
create unique index if not exists challenges_tag_active on public.challenges (hashtag) where status in ('pending','active');
alter table public.challenges enable row level security;
drop policy if exists "challenges read" on public.challenges;
create policy "challenges read" on public.challenges for select using (status in ('active','finished') or brand_id = auth.uid() or public.is_admin());

create or replace function public.create_challenge(p_brand text, p_title text, p_tag text, p_desc text, p_p1 integer, p_p2 integer, p_p3 integer,
  p_days integer, p_countries text[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); cur text := public.wallet_currency(auth.uid()); tag text := lower(regexp_replace(coalesce(p_tag, ''), '^#', '')); cid uuid; total numeric; minp integer;
begin
  if me is null then raise exception 'Connecte-toi d’abord'; end if;
  if not public.is_real_account(me) then raise exception 'Confirme ton adresse e-mail d’abord'; end if;
  if tag !~ '^[a-z0-9_]{3,30}$' then raise exception 'Hashtag invalide : 3 à 30 lettres ou chiffres, sans espace ni accent'; end if;
  if exists (select 1 from challenges where hashtag = tag and status in ('pending','active')) then raise exception 'Ce hashtag est déjà utilisé par un défi en cours'; end if;
  minp := case cur when '₼' then 20 else 10000 end;
  if coalesce(p_p1, 0) < minp then raise exception 'Le 1er prix doit être d’au moins % %', minp, cur; end if;
  if coalesce(p_p2, 0) > p_p1 or coalesce(p_p3, 0) > coalesce(p_p2, 0) then raise exception 'Les prix doivent aller du plus grand au plus petit'; end if;
  if p_days < 3 or p_days > 60 then raise exception 'Durée : entre 3 et 60 jours'; end if;
  if (select count(*) from challenges where brand_id = me and status = 'pending') >= 3 then raise exception 'Tu as déjà 3 défis en attente de paiement'; end if;
  insert into challenges (brand_id, brand_name, title, hashtag, description, prize1, prize2, prize3, currency, countries, starts_at, ends_at)
  values (me, trim(p_brand), trim(p_title), tag, left(coalesce(trim(p_desc), ''), 800), p_p1, coalesce(p_p2, 0), coalesce(p_p3, 0), cur,
    case when p_countries is null or cardinality(p_countries) = 0 then null else p_countries end, now(), now() + make_interval(days => p_days))
  returning id into cid;
  total := (p_p1 + coalesce(p_p2, 0) + coalesce(p_p3, 0)) * 1.15;
  return jsonb_build_object('id', cid, 'prizes', p_p1 + coalesce(p_p2, 0) + coalesce(p_p3, 0), 'total', ceil(total), 'currency', cur);
end $$;
revoke execute on function public.create_challenge(text, text, text, text, integer, integer, integer, integer, text[]) from public, anon;
grant execute on function public.create_challenge(text, text, text, text, integer, integer, integer, integer, text[]) to authenticated;

-- Admin : paiement reçu → le défi démarre maintenant pour la durée prévue
create or replace function public.admin_challenge_decide(p_id uuid, p_ok boolean) returns void
language plpgsql security definer set search_path = public as $$
declare c challenges;
begin
  if not public.is_admin() then raise exception 'Réservé à l’administration'; end if;
  select * into c from challenges where id = p_id and status = 'pending';
  if c.id is null then raise exception 'Défi introuvable ou déjà traité'; end if;
  if p_ok then
    update challenges set status = 'active', starts_at = now(), ends_at = now() + (c.ends_at - c.starts_at) where id = p_id;
    perform public.notify_ref(c.brand_id, null, 'challenge', c.id, '🏆 Ton défi #' || c.hashtag || ' est en ligne !');
  else
    update challenges set status = 'rejected' where id = p_id;
    perform public.notify_ref(c.brand_id, null, 'challenge', c.id, 'Ton défi #' || c.hashtag || ' n’a pas été validé. Contacte le support.');
  end if;
end $$;
revoke execute on function public.admin_challenge_decide(uuid, boolean) from public, anon;
grant execute on function public.admin_challenge_decide(uuid, boolean) to authenticated;

-- Classement : vidéos publiées avec le hashtag pendant le défi, score = vues réelles + 5 × j'aime
create or replace function public.challenge_board(p_id uuid) returns table (
  video_id uuid, user_id uuid, username text, avatar_url text, video_url text, views bigint, likes bigint, score bigint)
language sql stable security definer set search_path = public as $$
  select v.id, v.user_id, p.username, p.avatar_url, v.video_url,
    (select count(*) from video_views vv where vv.video_id = v.id and vv.real_viewer),
    (select count(*) from likes l where l.video_id = v.id),
    (select count(*) from video_views vv where vv.video_id = v.id and vv.real_viewer) + 5 * (select count(*) from likes l where l.video_id = v.id)
  from challenges c join videos v on c.hashtag = any (v.tags) and v.status = 'published' and v.created_at between c.starts_at and c.ends_at
  join profiles p on p.id = v.user_id
  where c.id = p_id and c.status in ('active','finished') and v.user_id <> c.brand_id
    and (c.countries is null or v.country = any (c.countries))
  order by 8 desc, v.created_at limit 50;
$$;
grant execute on function public.challenge_board(uuid) to anon, authenticated;

-- Gagnants : la marque choisit après la fin (ou l'admin) ; un même compte ne gagne qu'une fois ; prix versés en pièces retirables
create or replace function public.challenge_award(p_id uuid, p_videos uuid[]) returns void
language plpgsql security definer set search_path = public as $$
declare c challenges; w uuid[] := '{}'; u uuid; i int := 0; prize int; n_coins int; vid uuid;
begin
  select * into c from challenges where id = p_id and status = 'active';
  if c.id is null then raise exception 'Défi introuvable ou déjà terminé'; end if;
  if not (public.is_admin() or (c.brand_id = auth.uid() and now() > c.ends_at)) then raise exception 'Les gagnants se choisissent après la fin du défi'; end if;
  if cardinality(p_videos) < 1 or cardinality(p_videos) > 3 then raise exception 'Choisis entre 1 et 3 vidéos gagnantes'; end if;
  foreach vid in array p_videos loop
    select b.user_id into u from public.challenge_board(p_id) b where b.video_id = vid;
    if u is null then raise exception 'Cette vidéo ne participe pas au défi'; end if;
    if u = any (w) then raise exception 'Un même participant ne peut gagner qu’une fois'; end if;
    w := w || u; i := i + 1;
    prize := case i when 1 then c.prize1 when 2 then c.prize2 else c.prize3 end;
    if prize > 0 then
      n_coins := case c.currency when '₼' then ceil(prize / 0.024) else ceil(prize / 8.0) end;
      insert into wallets (user_id, earned, total_received) values (u, n_coins, n_coins)
        on conflict (user_id) do update set earned = wallets.earned + n_coins, total_received = wallets.total_received + n_coins, updated_at = now();
      perform public.notify_ref(u, null, 'challenge', c.id, '🏆 Tu as gagné la place n°' || i || ' du défi #' || c.hashtag || ' : ' || prize || ' ' || c.currency || ' ajoutés à ton portefeuille !');
    end if;
  end loop;
  update challenges set status = 'finished', winners = w where id = p_id;
end $$;
revoke execute on function public.challenge_award(uuid, uuid[]) from public, anon;
grant execute on function public.challenge_award(uuid, uuid[]) to authenticated;

create or replace view public.challenges_view with (security_invoker = true) as
SELECT c.id, c.brand_id, c.brand_name, c.title, c.hashtag, c.description, c.prize1, c.prize2, c.prize3, c.currency, c.countries,
  c.starts_at, c.ends_at, c.status, c.winners, c.created_at, p.username AS brand_username, p.avatar_url AS brand_avatar, p.verified AS brand_verified,
  (SELECT count(*) FROM videos v WHERE c.hashtag = ANY (v.tags) AND v.status = 'published' AND v.created_at BETWEEN c.starts_at AND c.ends_at)::integer AS entries
FROM challenges c JOIN profiles p ON p.id = c.brand_id;

-- signalements possibles sur les services et les défis
alter table public.reports drop constraint if exists reports_target_type_check;
alter table public.reports add constraint reports_target_type_check check (target_type = any (array
  ['video','comment','profile','job','shop','product','message','dating','live','service','challenge']));
