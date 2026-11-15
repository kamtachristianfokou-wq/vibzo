-- Vibzo · migration 009 : vues des vidéos, Programme Créateurs (rémunération) et liens Instagram / TikTok / YouTube

-- 1. Comptage des vues (une vue par spectateur, par vidéo et par jour)
alter table public.videos add column if not exists view_count bigint not null default 0;
create table if not exists public.video_views (
  video_id   uuid not null references public.videos(id) on delete cascade,
  viewer_key text not null check (char_length(viewer_key) between 8 and 64),
  day        date not null default current_date,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (video_id, viewer_key, day)
);
create index if not exists video_views_creator_idx on public.video_views (creator_id, day);
alter table public.video_views enable row level security;  -- aucun accès direct : uniquement via les fonctions

create or replace function public.record_view(p_video uuid, p_key text) returns void
language plpgsql security definer set search_path = public as $$
declare cr uuid; n int;
begin
  select user_id into cr from videos where id = p_video and status = 'published';
  if cr is null or cr = auth.uid() then return; end if;   -- pas de vue pour ses propres vidéos
  insert into video_views (video_id, viewer_key, creator_id) values (p_video, coalesce(auth.uid()::text, p_key), cr)
  on conflict do nothing;
  get diagnostics n = row_count;
  if n > 0 then update videos set view_count = view_count + 1 where id = p_video; end if;
end $$;
grant execute on function public.record_view(uuid, text) to anon, authenticated;

-- 2. Liens vers les autres réseaux (publics)
alter table public.profiles add column if not exists instagram text check (instagram ~ '^[A-Za-z0-9_.]{1,30}$');
alter table public.profiles add column if not exists tiktok    text check (tiktok    ~ '^[A-Za-z0-9_.]{1,30}$');
alter table public.profiles add column if not exists youtube   text check (youtube   ~ '^[A-Za-z0-9_.-]{1,40}$');

-- 3. Programme Créateurs : candidature (coordonnées de paiement privées) et gains
create table if not exists public.creator_program (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  status         text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  payout_method  text not null check (char_length(payout_method) between 2 and 40),
  payout_number  text not null check (char_length(payout_number) between 4 and 60),
  created_at     timestamptz not null default now(),
  decided_at     timestamptz
);
create table if not exists public.creator_earnings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  period     text not null,                       -- ex. « 2026-11 »
  amount     numeric(14,2) not null check (amount > 0),
  currency   text not null,
  views      bigint not null default 0,
  status     text not null default 'due' check (status in ('due','paid')),
  note       text not null default '',
  created_at timestamptz not null default now(),
  paid_at    timestamptz
);
alter table public.creator_program  enable row level security;
alter table public.creator_earnings enable row level security;
drop policy if exists "creator program own" on public.creator_program;
create policy "creator program own" on public.creator_program for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "creator earnings own" on public.creator_earnings;
create policy "creator earnings own" on public.creator_earnings for select using (user_id = auth.uid() or public.is_admin());

-- Seuils d'éligibilité
create or replace function public.creator_thresholds() returns jsonb language sql immutable as $$
  select jsonb_build_object('followers', 1000, 'views_30d', 10000, 'videos', 3);
$$;

-- Mes statistiques de créateur
create or replace function public.creator_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); t jsonb := public.creator_thresholds(); r jsonb; f int; v30 bigint; vt bigint; nv int; lk bigint; prog creator_program;
begin
  if me is null then raise exception 'Connexion requise'; end if;
  select count(*) into f from follows where followee_id = me;
  select count(*) into v30 from video_views where creator_id = me and day > current_date - 30;
  select coalesce(sum(view_count), 0), count(*) into vt, nv from videos where user_id = me and status = 'published';
  select count(*) into lk from likes l join videos v on v.id = l.video_id where v.user_id = me;
  select * into prog from creator_program where user_id = me;
  return jsonb_build_object('followers', f, 'views_30d', v30, 'views_total', vt, 'videos', nv, 'likes', lk,
    'thresholds', t,
    'eligible', f >= (t->>'followers')::int and v30 >= (t->>'views_30d')::int and nv >= (t->>'videos')::int,
    'status', prog.status,
    'earned', (select coalesce(sum(amount), 0) from creator_earnings where user_id = me),
    'due', (select coalesce(sum(amount), 0) from creator_earnings where user_id = me and status = 'due'));
end $$;

create or replace function public.creator_apply(p_method text, p_number text) returns void
language plpgsql security definer set search_path = public as $$
declare s jsonb := public.creator_stats();
begin
  if not (s->>'eligible')::boolean then raise exception 'Tu n''as pas encore atteint les seuils du Programme Créateurs'; end if;
  insert into creator_program (user_id, payout_method, payout_number) values (auth.uid(), trim(p_method), trim(p_number))
  on conflict (user_id) do update set payout_method = excluded.payout_method, payout_number = excluded.payout_number,
    status = case when creator_program.status = 'rejected' then 'pending' else creator_program.status end;
end $$;

-- Admin : classement des créateurs (vues sur 30 jours), décisions et paiements
create or replace function public.admin_creators() returns table (user_id uuid, username text, display_name text, country text,
  followers bigint, views_30d bigint, videos bigint, status text, payout_method text, payout_number text, due numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  return query
  select p.id, p.username, p.display_name, p.country,
    (select count(*) from follows f where f.followee_id = p.id),
    (select count(*) from video_views w where w.creator_id = p.id and w.day > current_date - 30),
    (select count(*) from videos v where v.user_id = p.id and v.status = 'published'),
    cp.status, cp.payout_method, cp.payout_number,
    (select coalesce(sum(e.amount), 0) from creator_earnings e where e.user_id = p.id and e.status = 'due')
  from profiles p left join creator_program cp on cp.user_id = p.id
  where cp.user_id is not null or exists (select 1 from videos v where v.user_id = p.id)
  order by (cp.status = 'pending') desc nulls last, 6 desc
  limit 100;
end $$;

create or replace function public.admin_creator_decide(p_user uuid, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  if p_status not in ('approved','rejected','suspended') then raise exception 'Statut invalide'; end if;
  update creator_program set status = p_status, decided_at = now() where user_id = p_user;
end $$;

create or replace function public.admin_add_earning(p_user uuid, p_amount numeric, p_currency text, p_period text, p_note text default '') returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  insert into creator_earnings (user_id, period, amount, currency, note, views)
  values (p_user, p_period, p_amount, p_currency, coalesce(p_note, ''),
          (select count(*) from video_views w where w.creator_id = p_user and w.day > current_date - 30));
end $$;

create or replace function public.admin_mark_paid(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  update creator_earnings set status = 'paid', paid_at = now() where user_id = p_user and status = 'due';
end $$;

do $$ declare f text; begin
  foreach f in array array['public.creator_stats()','public.creator_apply(text,text)','public.admin_creators()',
    'public.admin_creator_decide(uuid,text)','public.admin_add_earning(uuid,numeric,text,text,text)','public.admin_mark_paid(uuid)'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;

-- 4. Statistiques publiques du profil : liens, vues, badge Créateur
create or replace function public.is_creator(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from creator_program where user_id = p_user and status = 'approved');
$$;
grant execute on function public.is_creator(uuid) to anon, authenticated;
create or replace view public.profile_stats with (security_invoker = true) as
SELECT id, username, display_name, bio, avatar_url, country, region, created_at,
    vip_until IS NOT NULL AND vip_until > now() AS is_vip,
    ((SELECT count(*) FROM follows f WHERE f.followee_id = p.id))::integer AS followers,
    ((SELECT count(*) FROM follows f WHERE f.follower_id = p.id))::integer AS following,
    ((SELECT count(*) FROM videos v WHERE v.user_id = p.id AND v.status = 'published'))::integer AS videos,
    ((SELECT count(*) FROM likes l JOIN videos v ON v.id = l.video_id WHERE v.user_id = p.id))::integer AS likes_received,
    (EXISTS (SELECT 1 FROM follows f WHERE f.followee_id = p.id AND f.follower_id = auth.uid())) AS followed_by_me,
    instagram, tiktok, youtube,
    ((SELECT coalesce(sum(v.view_count), 0) FROM videos v WHERE v.user_id = p.id AND v.status = 'published'))::bigint AS views,
    public.is_creator(p.id) AS is_creator
FROM profiles p;
