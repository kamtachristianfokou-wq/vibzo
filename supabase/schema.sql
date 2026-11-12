-- =====================================================================
-- VIBZO : schéma de base de données (Supabase / PostgreSQL)
-- À exécuter UNE FOIS dans Supabase > SQL Editor > New query > Run
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- PROFILS
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null check (username ~ '^[a-z0-9_.]{3,24}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  bio          text not null default '' check (char_length(bio) <= 160),
  avatar_url   text,
  country      text not null default 'CM',
  region       text,
  phone        text,
  role         text not null default 'user' check (role in ('user','admin')),
  vip_until    timestamptz,
  created_at   timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; uname text; n int := 0;
begin
  base := regexp_replace(lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'user')), '[^a-z0-9_.]', '', 'g');
  if char_length(base) < 3 then base := base || 'vibzo'; end if;
  base := left(base, 20);
  uname := base;
  while exists (select 1 from public.profiles where username = uname) loop
    n := n + 1; uname := base || n;
  end loop;
  insert into public.profiles (id, username, display_name, country, region, phone)
  values (
    new.id, uname,
    left(coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), uname), 40),
    coalesce(nullif(new.raw_user_meta_data->>'country', ''), 'CM'),
    nullif(new.raw_user_meta_data->>'region', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Un utilisateur ne peut pas se donner le rôle admin ni le statut Gold
create or replace function public.protect_profile_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.vip_until := old.vip_until;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
for each row execute function public.protect_profile_fields();

-- ---------------------------------------------------------------------
-- BOUTIQUES ET PRODUITS
-- ---------------------------------------------------------------------
create table if not exists public.shops (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null unique references public.profiles(id) on delete cascade,
  name         text not null check (char_length(name) between 2 and 50),
  description  text not null default '' check (char_length(description) <= 300),
  platform     text not null default 'vibzo' check (platform in ('vibzo','shopify','woocommerce')),
  external_url text,
  whatsapp     text,
  country      text not null,
  region       text,
  status       text not null default 'pending' check (status in ('pending','active','suspended')),
  paid_until   timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references public.shops(id) on delete cascade,
  name        text not null check (char_length(name) between 2 and 80),
  description text not null default '' check (char_length(description) <= 600),
  price       numeric(14,2) not null check (price >= 0),
  currency    text not null,
  image_url   text,
  stock       int not null default 0 check (stock >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Le statut et l'abonnement d'une boutique ne sont modifiables que par un admin
create or replace function public.protect_shop_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending'; new.paid_until := null;
    else
      new.status := old.status; new.paid_until := old.paid_until; new.owner_id := old.owner_id;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists protect_shop on public.shops;
create trigger protect_shop before insert or update on public.shops
for each row execute function public.protect_shop_fields();

-- ---------------------------------------------------------------------
-- VIDÉOS ET INTERACTIONS
-- ---------------------------------------------------------------------
create table if not exists public.videos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  video_url  text not null,
  title      text not null default '' check (char_length(title) <= 80),
  caption    text not null default '' check (char_length(caption) <= 300),
  tags       text[] not null default '{}',
  sound      text not null default '',
  country    text not null,
  region     text,
  product_id uuid references public.products(id) on delete set null,
  status     text not null default 'published' check (status in ('published','hidden')),
  created_at timestamptz not null default now()
);
create index if not exists videos_country_idx on public.videos (country, created_at desc);
create index if not exists videos_user_idx on public.videos (user_id, created_at desc);

create or replace function public.protect_video_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.status := old.status; new.user_id := old.user_id;
  end if;
  return new;
end $$;
drop trigger if exists protect_video on public.videos;
create trigger protect_video before update on public.videos
for each row execute function public.protect_video_fields();

create table if not exists public.likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  video_id   uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
create table if not exists public.saves (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  video_id   uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  video_id   uuid not null references public.videos(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists comments_video_idx on public.comments (video_id, created_at desc);
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followee_id uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- ---------------------------------------------------------------------
-- EMPLOI
-- ---------------------------------------------------------------------
create table if not exists public.job_offers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  company     text not null check (char_length(company) between 2 and 80),
  title       text not null check (char_length(title) between 2 and 80),
  sector      text not null,
  contract    text not null,
  remote      text not null default 'Sur site',
  salary      numeric(14,2),
  currency    text,
  description text not null default '' check (char_length(description) <= 2000),
  country     text not null,
  region      text,
  status      text not null default 'pending' check (status in ('pending','open','closed','rejected')),
  created_at  timestamptz not null default now()
);

create or replace function public.protect_offer_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending';
    elsif new.status is distinct from old.status and not (old.status = 'open' and new.status = 'closed') then
      new.status := old.status;  -- le recruteur peut seulement fermer son offre
    end if;
  end if;
  return new;
end $$;
drop trigger if exists protect_offer on public.job_offers;
create trigger protect_offer before insert or update on public.job_offers
for each row execute function public.protect_offer_fields();

create table if not exists public.candidates (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  job_title        text not null check (char_length(job_title) between 2 and 80),
  sector           text not null,
  skills           text[] not null default '{}',
  experience_years int not null default 0 check (experience_years between 0 and 60),
  availability     text not null default 'Immédiate',
  about            text not null default '' check (char_length(about) <= 600),
  country          text not null,
  region           text,
  visible          boolean not null default true,
  updated_at       timestamptz not null default now()
);

create table if not exists public.applications (
  id         uuid primary key default gen_random_uuid(),
  offer_id   uuid not null references public.job_offers(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  message    text not null default '' check (char_length(message) <= 1000),
  created_at timestamptz not null default now(),
  unique (offer_id, user_id)
);

-- ---------------------------------------------------------------------
-- COMMANDES
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  buyer_id   uuid not null references public.profiles(id) on delete cascade,
  shop_id    uuid not null references public.shops(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity   int not null check (quantity between 1 and 99),
  unit_price numeric(14,2) not null,
  total      numeric(14,2) not null,
  currency   text not null,
  payment_method text not null default 'cod',
  address    text not null check (char_length(address) between 3 and 300),
  phone      text not null check (char_length(phone) between 6 and 30),
  note       text not null default '',
  status     text not null default 'new' check (status in ('new','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- MESSAGERIE
-- ---------------------------------------------------------------------
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null default 'dm' check (kind in ('dm','job','shop')),
  title      text not null default '',
  ref_id     uuid,
  created_at timestamptz not null default now()
);
create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  last_read_at    timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
create table if not exists public.messages (
  id              bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 2000),
  created_at      timestamptz not null default now()
);
create index if not exists messages_conv_idx on public.messages (conversation_id, created_at);

create or replace function public.is_member(p_conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.conversation_members where conversation_id = p_conv and user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- SIGNALEMENTS
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('video','comment','profile','job','shop','product','message')),
  target_id   text not null,
  reason      text not null check (char_length(reason) between 2 and 300),
  status      text not null default 'open' check (status in ('open','resolved')),
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- SÉCURITÉ (Row Level Security)
-- =====================================================================
alter table public.profiles             enable row level security;
alter table public.shops                enable row level security;
alter table public.products             enable row level security;
alter table public.videos               enable row level security;
alter table public.likes                enable row level security;
alter table public.saves                enable row level security;
alter table public.comments             enable row level security;
alter table public.follows              enable row level security;
alter table public.job_offers           enable row level security;
alter table public.candidates           enable row level security;
alter table public.applications         enable row level security;
alter table public.orders               enable row level security;
alter table public.conversations        enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages             enable row level security;
alter table public.reports              enable row level security;

-- Profils : lisibles par tous, modifiables par soi-même
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update using (id = auth.uid() or public.is_admin());

-- Boutiques
drop policy if exists shops_read on public.shops;
create policy shops_read on public.shops for select using (status = 'active' or owner_id = auth.uid() or public.is_admin());
drop policy if exists shops_insert on public.shops;
create policy shops_insert on public.shops for insert with check (owner_id = auth.uid());
drop policy if exists shops_update on public.shops;
create policy shops_update on public.shops for update using (owner_id = auth.uid() or public.is_admin());
drop policy if exists shops_delete on public.shops;
create policy shops_delete on public.shops for delete using (owner_id = auth.uid() or public.is_admin());

-- Produits
drop policy if exists products_read on public.products;
create policy products_read on public.products for select using (
  (active and exists (select 1 from public.shops s where s.id = shop_id and s.status = 'active'))
  or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  or public.is_admin());
drop policy if exists products_write on public.products;
create policy products_write on public.products for all
  using (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()) or public.is_admin())
  with check (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()) or public.is_admin());

-- Vidéos
drop policy if exists videos_read on public.videos;
create policy videos_read on public.videos for select using (status = 'published' or user_id = auth.uid() or public.is_admin());
drop policy if exists videos_insert on public.videos;
create policy videos_insert on public.videos for insert with check (user_id = auth.uid());
drop policy if exists videos_update on public.videos;
create policy videos_update on public.videos for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists videos_delete on public.videos;
create policy videos_delete on public.videos for delete using (user_id = auth.uid() or public.is_admin());

-- Likes, favoris, abonnements
drop policy if exists likes_read on public.likes;
create policy likes_read on public.likes for select using (true);
drop policy if exists likes_insert on public.likes;
create policy likes_insert on public.likes for insert with check (user_id = auth.uid());
drop policy if exists likes_delete on public.likes;
create policy likes_delete on public.likes for delete using (user_id = auth.uid());
drop policy if exists saves_read on public.saves;
create policy saves_read on public.saves for select using (user_id = auth.uid());
drop policy if exists saves_insert on public.saves;
create policy saves_insert on public.saves for insert with check (user_id = auth.uid());
drop policy if exists saves_delete on public.saves;
create policy saves_delete on public.saves for delete using (user_id = auth.uid());
drop policy if exists follows_read on public.follows;
create policy follows_read on public.follows for select using (true);
drop policy if exists follows_insert on public.follows;
create policy follows_insert on public.follows for insert with check (follower_id = auth.uid());
drop policy if exists follows_delete on public.follows;
create policy follows_delete on public.follows for delete using (follower_id = auth.uid());

-- Commentaires
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select using (true);
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert with check (user_id = auth.uid());
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete using (
  user_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.videos v where v.id = video_id and v.user_id = auth.uid()));

-- Emploi
drop policy if exists offers_read on public.job_offers;
create policy offers_read on public.job_offers for select using (status = 'open' or user_id = auth.uid() or public.is_admin());
drop policy if exists offers_insert on public.job_offers;
create policy offers_insert on public.job_offers for insert with check (user_id = auth.uid());
drop policy if exists offers_update on public.job_offers;
create policy offers_update on public.job_offers for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists offers_delete on public.job_offers;
create policy offers_delete on public.job_offers for delete using (user_id = auth.uid() or public.is_admin());
drop policy if exists candidates_read on public.candidates;
create policy candidates_read on public.candidates for select using (visible or user_id = auth.uid() or public.is_admin());
drop policy if exists candidates_write on public.candidates;
create policy candidates_write on public.candidates for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists applications_read on public.applications;
create policy applications_read on public.applications for select using (
  user_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.job_offers o where o.id = offer_id and o.user_id = auth.uid()));

-- Commandes
drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders for select using (
  buyer_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));
drop policy if exists orders_update on public.orders;
create policy orders_update on public.orders for update using (
  public.is_admin() or buyer_id = auth.uid()
  or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));

-- Messagerie
drop policy if exists conv_read on public.conversations;
create policy conv_read on public.conversations for select using (public.is_member(id) or public.is_admin());
drop policy if exists members_read on public.conversation_members;
create policy members_read on public.conversation_members for select using (public.is_member(conversation_id) or public.is_admin());
drop policy if exists members_update on public.conversation_members;
create policy members_update on public.conversation_members for update using (user_id = auth.uid());
drop policy if exists messages_read on public.messages;
create policy messages_read on public.messages for select using (public.is_member(conversation_id) or public.is_admin());
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert with check (sender_id = auth.uid() and public.is_member(conversation_id));

-- Signalements
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert with check (reporter_id = auth.uid());
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select using (reporter_id = auth.uid() or public.is_admin());
drop policy if exists reports_update on public.reports;
create policy reports_update on public.reports for update using (public.is_admin());

-- =====================================================================
-- VUES (exécutées avec les droits de l'utilisateur)
-- =====================================================================
create or replace view public.videos_feed with (security_invoker = true) as
select v.id, v.user_id, v.video_url, v.title, v.caption, v.tags, v.sound, v.country, v.region,
       v.product_id, v.status, v.created_at,
       p.username, p.display_name, p.avatar_url,
       (p.vip_until is not null and p.vip_until > now()) as is_vip,
       (select count(*) from public.likes l where l.video_id = v.id)::int    as like_count,
       (select count(*) from public.comments c where c.video_id = v.id)::int as comment_count,
       exists (select 1 from public.likes l where l.video_id = v.id and l.user_id = auth.uid())   as liked_by_me,
       exists (select 1 from public.saves s where s.video_id = v.id and s.user_id = auth.uid())   as saved_by_me,
       exists (select 1 from public.follows f where f.followee_id = v.user_id and f.follower_id = auth.uid()) as following,
       pr.name as product_name, pr.price as product_price, pr.currency as product_currency
from public.videos v
join public.profiles p on p.id = v.user_id
left join public.products pr on pr.id = v.product_id;

create or replace view public.comments_view with (security_invoker = true) as
select c.id, c.video_id, c.user_id, c.body, c.created_at, p.username, p.display_name, p.avatar_url
from public.comments c join public.profiles p on p.id = c.user_id;

create or replace view public.profile_stats with (security_invoker = true) as
select p.id, p.username, p.display_name, p.bio, p.avatar_url, p.country, p.region, p.created_at,
       (p.vip_until is not null and p.vip_until > now()) as is_vip,
       (select count(*) from public.follows f where f.followee_id = p.id)::int as followers,
       (select count(*) from public.follows f where f.follower_id = p.id)::int as following,
       (select count(*) from public.videos v where v.user_id = p.id and v.status = 'published')::int as videos,
       (select count(*) from public.likes l join public.videos v on v.id = l.video_id where v.user_id = p.id)::int as likes_received,
       exists (select 1 from public.follows f where f.followee_id = p.id and f.follower_id = auth.uid()) as followed_by_me
from public.profiles p;

create or replace view public.products_view with (security_invoker = true) as
select pr.*, s.name as shop_name, s.platform, s.whatsapp, s.country, s.region, s.owner_id
from public.products pr join public.shops s on s.id = pr.shop_id;

create or replace view public.offers_view with (security_invoker = true) as
select o.*, p.display_name as poster_name,
       (select count(*) from public.applications a where a.offer_id = o.id)::int as application_count,
       exists (select 1 from public.applications a where a.offer_id = o.id and a.user_id = auth.uid()) as applied_by_me
from public.job_offers o join public.profiles p on p.id = o.user_id;

create or replace view public.candidates_view with (security_invoker = true) as
select c.*, p.display_name, p.username, p.avatar_url
from public.candidates c join public.profiles p on p.id = c.user_id;

create or replace view public.applications_view with (security_invoker = true) as
select a.*, p.display_name, p.username, o.title as offer_title, o.user_id as offer_owner
from public.applications a join public.profiles p on p.id = a.user_id join public.job_offers o on o.id = a.offer_id;

create or replace view public.orders_view with (security_invoker = true) as
select o.*, s.name as shop_name, s.owner_id as seller_id, b.display_name as buyer_name
from public.orders o join public.shops s on s.id = o.shop_id join public.profiles b on b.id = o.buyer_id;

create or replace view public.conversation_list with (security_invoker = true) as
select c.id, c.kind, c.title, c.created_at,
       op.id as other_id, op.display_name as other_name, op.avatar_url as other_avatar,
       lm.body as last_body, lm.sender_id as last_sender, coalesce(lm.created_at, c.created_at) as last_at,
       (lm.created_at is not null and lm.sender_id <> auth.uid() and lm.created_at > me.last_read_at) as unread
from public.conversations c
join public.conversation_members me on me.conversation_id = c.id and me.user_id = auth.uid()
left join lateral (select m2.user_id from public.conversation_members m2
                   where m2.conversation_id = c.id and m2.user_id <> auth.uid() limit 1) om on true
left join public.profiles op on op.id = om.user_id
left join lateral (select m.body, m.sender_id, m.created_at from public.messages m
                   where m.conversation_id = c.id order by m.created_at desc limit 1) lm on true;

-- =====================================================================
-- FONCTIONS (RPC)
-- =====================================================================

-- Fil vidéo : 'pour' (pour toi, classé par popularité récente) ou 'abo' (abonnements)
create or replace function public.feed(p_countries text[] default null, p_region text default null,
                                       p_mode text default 'pour', p_limit int default 15, p_offset int default 0)
returns setof public.videos_feed language sql stable as $$
  select f.* from public.videos_feed f
  where f.status = 'published'
    and (p_mode <> 'abo' or f.following or f.user_id = auth.uid())
    and (p_mode = 'abo' or p_countries is null or f.country = any (p_countries))
    and (p_mode = 'abo' or p_region is null or f.region = p_region)
  order by case when p_mode = 'abo' then extract(epoch from f.created_at)
                else (f.like_count * 2 + f.comment_count * 3 + 1)
                     / power(extract(epoch from (now() - f.created_at)) / 3600 + 2, 1.3) end desc,
           f.created_at desc
  limit least(p_limit, 50) offset p_offset;
$$;

-- Ouvre (ou retrouve) une conversation avec un autre utilisateur
create or replace function public.start_conversation(p_other uuid, p_kind text default 'dm',
                                                     p_title text default '', p_ref uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  if p_other = auth.uid() then raise exception 'Impossible de s''écrire à soi-même'; end if;
  if not exists (select 1 from profiles where id = p_other) then raise exception 'Utilisateur introuvable'; end if;
  select c.id into cid from conversations c
   where c.kind = p_kind and c.ref_id is not distinct from p_ref
     and exists (select 1 from conversation_members m where m.conversation_id = c.id and m.user_id = auth.uid())
     and exists (select 1 from conversation_members m where m.conversation_id = c.id and m.user_id = p_other)
   limit 1;
  if cid is null then
    insert into conversations (kind, title, ref_id) values (p_kind, left(coalesce(p_title, ''), 120), p_ref) returning id into cid;
    insert into conversation_members (conversation_id, user_id, last_read_at) values (cid, auth.uid(), now()), (cid, p_other, 'epoch');
  end if;
  return cid;
end $$;

-- Marque une conversation comme lue
create or replace function public.mark_read(p_conv uuid) returns void
language sql security definer set search_path = public as $$
  update conversation_members set last_read_at = now() where conversation_id = p_conv and user_id = auth.uid();
$$;

-- Postuler à une offre : enregistre la candidature et ouvre la discussion avec le recruteur
create or replace function public.apply_to_offer(p_offer uuid, p_message text) returns uuid
language plpgsql security definer set search_path = public as $$
declare o job_offers; cid uuid;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  select * into o from job_offers where id = p_offer and status = 'open';
  if o.id is null then raise exception 'Offre indisponible'; end if;
  if o.user_id = auth.uid() then raise exception 'C''est votre propre offre'; end if;
  insert into applications (offer_id, user_id, message) values (p_offer, auth.uid(), left(coalesce(p_message, ''), 1000))
  on conflict (offer_id, user_id) do nothing;
  cid := public.start_conversation(o.user_id, 'job', 'Candidature : ' || o.title, o.id);
  insert into messages (conversation_id, sender_id, body)
  values (cid, auth.uid(), left(coalesce(nullif(p_message, ''), 'Bonjour, je suis intéressé(e) par votre offre « ' || o.title || ' ».'), 2000));
  return cid;
end $$;

-- Passer une commande (paiement à la livraison) : le prix est relu en base, jamais pris du téléphone
create or replace function public.place_order(p_product uuid, p_qty int, p_address text, p_phone text, p_note text default '')
returns uuid language plpgsql security definer set search_path = public as $$
declare pr products; s shops; oid uuid; cid uuid;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  select * into pr from products where id = p_product and active;
  if pr.id is null then raise exception 'Produit indisponible'; end if;
  select * into s from shops where id = pr.shop_id and status = 'active';
  if s.id is null then raise exception 'Boutique indisponible'; end if;
  if s.owner_id = auth.uid() then raise exception 'C''est votre propre boutique'; end if;
  if p_qty < 1 or p_qty > 99 then raise exception 'Quantité invalide'; end if;
  insert into orders (buyer_id, shop_id, product_id, product_name, quantity, unit_price, total, currency, address, phone, note)
  values (auth.uid(), s.id, pr.id, pr.name, p_qty, pr.price, pr.price * p_qty, pr.currency, p_address, p_phone, left(coalesce(p_note, ''), 300))
  returning id into oid;
  cid := public.start_conversation(s.owner_id, 'shop', 'Commande : ' || pr.name, oid);
  insert into messages (conversation_id, sender_id, body)
  values (cid, auth.uid(), 'Nouvelle commande : ' || p_qty || ' × ' || pr.name || ' (' || (pr.price * p_qty) || ' ' || pr.currency || '), paiement à la livraison. Adresse : ' || p_address);
  return oid;
end $$;

-- Statistiques du back-office
create or replace function public.admin_stats() returns json
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  return json_build_object(
    'users',          (select count(*) from profiles),
    'users_7d',       (select count(*) from profiles where created_at > now() - interval '7 days'),
    'videos',         (select count(*) from videos),
    'vip',            (select count(*) from profiles where vip_until > now()),
    'shops_active',   (select count(*) from shops where status = 'active'),
    'shops_pending',  (select count(*) from shops where status = 'pending'),
    'offers_open',    (select count(*) from job_offers where status = 'open'),
    'offers_pending', (select count(*) from job_offers where status = 'pending'),
    'orders',         (select count(*) from orders),
    'reports_open',   (select count(*) from reports where status = 'open'),
    'by_country',     (select coalesce(json_object_agg(country, n), '{}'::json)
                       from (select country, count(*) n from profiles group by country) t)
  );
end $$;

-- Activer Gold pour un utilisateur (après paiement reçu) : réservé admin
create or replace function public.admin_set_vip(p_username text, p_days int) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare u timestamptz;
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(days => p_days)
   where username = lower(p_username) returning vip_until into u;
  if u is null then raise exception 'Utilisateur introuvable'; end if;
  return u;
end $$;

-- =====================================================================
-- STOCKAGE DES FICHIERS
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 52428800, array['video/mp4','video/quicktime','video/webm','video/3gpp']),
       ('images', 'images', true, 5242880,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "vibzo media read" on storage.objects;
create policy "vibzo media read" on storage.objects for select
  using (bucket_id in ('videos','images'));
drop policy if exists "vibzo media upload" on storage.objects;
create policy "vibzo media upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('videos','images') and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "vibzo media delete" on storage.objects;
create policy "vibzo media delete" on storage.objects for delete to authenticated
  using (bucket_id in ('videos','images') and (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================================
-- TEMPS RÉEL (messagerie)
-- =====================================================================
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when others then null;
end $$;
