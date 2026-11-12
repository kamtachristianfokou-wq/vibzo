-- =====================================================================
-- VIBZO : mise à jour 002 : section RENCONTRES (abonnés Gold, 18 ans et plus)
-- À exécuter dans Supabase > SQL Editor > New query > Run (après schema.sql)
-- =====================================================================

-- Les conversations peuvent maintenant venir d'un match
alter table public.conversations drop constraint if exists conversations_kind_check;
alter table public.conversations add constraint conversations_kind_check check (kind in ('dm','job','shop','match'));

create or replace function public.is_vip() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and (vip_until > now() or role = 'admin'));
$$;

-- ---------------------------------------------------------------------
-- Profils de rencontre (séparés du profil public)
-- ---------------------------------------------------------------------
create table if not exists public.dating_profiles (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  first_name  text not null check (char_length(first_name) between 2 and 30),
  birth_date  date not null,
  gender      text not null check (gender in ('homme','femme')),
  looking_for text not null default 'tous' check (looking_for in ('homme','femme','tous')),
  intent      text not null default 'serieux' check (intent in ('serieux','libre','les_deux')),
  bio         text not null default '' check (char_length(bio) <= 300),
  photo_url   text not null,
  country     text not null,
  region      text,
  city        text not null check (char_length(city) between 2 and 60),
  interests   text[] not null default '{}',
  visible     boolean not null default true,
  verified    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists dating_geo_idx on public.dating_profiles (country, region, lower(city));

-- 18 ans minimum, et seul un admin peut marquer un profil « vérifié »
create or replace function public.check_dating_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.birth_date > (current_date - interval '18 years')::date then
    raise exception 'L''espace rencontres est réservé aux personnes de 18 ans et plus';
  end if;
  if new.birth_date < date '1920-01-01' then raise exception 'Date de naissance invalide'; end if;
  new.city := initcap(trim(new.city));
  new.updated_at := now();
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then new.verified := false; else new.verified := old.verified; new.user_id := old.user_id; end if;
  end if;
  return new;
end $$;
drop trigger if exists check_dating on public.dating_profiles;
create trigger check_dating before insert or update on public.dating_profiles
for each row execute function public.check_dating_profile();

create table if not exists public.dating_swipes (
  from_id    uuid not null references public.profiles(id) on delete cascade,
  to_id      uuid not null references public.profiles(id) on delete cascade,
  action     text not null check (action in ('like','pass','block')),
  created_at timestamptz not null default now(),
  primary key (from_id, to_id),
  check (from_id <> to_id)
);

create table if not exists public.dating_matches (
  user_a          uuid not null references public.profiles(id) on delete cascade,
  user_b          uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  created_at      timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

-- Demandes d'abonnement (Gold, Vendeur) traitées par l'équipe dans le back-office
create table if not exists public.subscription_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  plan       text not null check (plan in ('gold','vendeur')),
  months     int not null default 1 check (months between 1 and 12),
  payment    text not null default '',
  status     text not null default 'pending' check (status in ('pending','done','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.dating_profiles       enable row level security;
alter table public.dating_swipes         enable row level security;
alter table public.dating_matches        enable row level security;
alter table public.subscription_requests enable row level security;

create or replace function public.has_dating_profile() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.dating_profiles where user_id = auth.uid());
$$;

-- Profils de rencontre : visibles seulement par les abonnés Gold qui ont eux-mêmes un profil
drop policy if exists dating_read on public.dating_profiles;
create policy dating_read on public.dating_profiles for select using (
  user_id = auth.uid() or public.is_admin()
  or (visible and public.is_vip() and public.has_dating_profile())
  or exists (select 1 from public.dating_matches m where (m.user_a = auth.uid() and m.user_b = user_id) or (m.user_b = auth.uid() and m.user_a = user_id)));
drop policy if exists dating_insert on public.dating_profiles;
create policy dating_insert on public.dating_profiles for insert with check (user_id = auth.uid() and public.is_vip());
drop policy if exists dating_update on public.dating_profiles;
create policy dating_update on public.dating_profiles for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists dating_delete on public.dating_profiles;
create policy dating_delete on public.dating_profiles for delete using (user_id = auth.uid() or public.is_admin());

drop policy if exists swipes_read on public.dating_swipes;
create policy swipes_read on public.dating_swipes for select using (from_id = auth.uid());
drop policy if exists matches_read on public.dating_matches;
create policy matches_read on public.dating_matches for select using (user_a = auth.uid() or user_b = auth.uid() or public.is_admin());

drop policy if exists subreq_insert on public.subscription_requests;
create policy subreq_insert on public.subscription_requests for insert with check (user_id = auth.uid());
drop policy if exists subreq_read on public.subscription_requests;
create policy subreq_read on public.subscription_requests for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists subreq_update on public.subscription_requests;
create policy subreq_update on public.subscription_requests for update using (public.is_admin());

-- ---------------------------------------------------------------------
-- Profils proposés : par ville, région, pays ou zone (liste de pays)
-- ---------------------------------------------------------------------
create or replace function public.dating_candidates(
  p_countries text[], p_region text default null, p_city text default null,
  p_intent text default null, p_min_age int default 18, p_max_age int default 99, p_limit int default 20)
returns table (user_id uuid, first_name text, age int, gender text, intent text, bio text, photo_url text,
               country text, region text, city text, interests text[], verified boolean, is_vip boolean)
language plpgsql stable security definer set search_path = public as $$
declare me dating_profiles;
begin
  if not public.is_vip() then raise exception 'Réservé aux abonnés Gold'; end if;
  select * into me from dating_profiles d where d.user_id = auth.uid();
  if me.user_id is null then raise exception 'Crée d''abord ton profil de rencontre'; end if;
  return query
  select d.user_id, d.first_name, date_part('year', age(d.birth_date))::int, d.gender, d.intent, d.bio, d.photo_url,
         d.country, d.region, d.city, d.interests, d.verified, (p.vip_until > now())
  from dating_profiles d join profiles p on p.id = d.user_id
  where d.visible and d.user_id <> auth.uid()
    and (p_countries is null or d.country = any (p_countries))
    and (p_region is null or d.region = p_region)
    and (p_city is null or lower(d.city) = lower(trim(p_city)))
    and (me.looking_for = 'tous' or d.gender = me.looking_for)
    and (d.looking_for = 'tous' or d.looking_for = me.gender)
    and (p_intent is null or d.intent = p_intent or d.intent = 'les_deux' or p_intent = 'les_deux')
    and date_part('year', age(d.birth_date)) between greatest(p_min_age, 18) and p_max_age
    and not exists (select 1 from dating_swipes s where s.from_id = auth.uid() and s.to_id = d.user_id)
    and not exists (select 1 from dating_swipes s where s.from_id = d.user_id and s.to_id = auth.uid() and s.action = 'block')
  order by (lower(d.city) = lower(me.city)) desc, d.verified desc, d.updated_at desc
  limit least(p_limit, 50);
end $$;

-- J'aime / Je passe / Bloquer. En cas de « j'aime » réciproque : match et conversation
create or replace function public.dating_swipe(p_target uuid, p_action text) returns json
language plpgsql security definer set search_path = public as $$
declare a uuid; b uuid; cid uuid;
begin
  if not public.is_vip() then raise exception 'Réservé aux abonnés Gold'; end if;
  if not exists (select 1 from dating_profiles where user_id = auth.uid()) then raise exception 'Crée d''abord ton profil de rencontre'; end if;
  if p_action not in ('like','pass','block') then raise exception 'Action invalide'; end if;
  insert into dating_swipes (from_id, to_id, action) values (auth.uid(), p_target, p_action)
  on conflict (from_id, to_id) do update set action = excluded.action, created_at = now();
  if p_action = 'like' and exists (select 1 from dating_swipes where from_id = p_target and to_id = auth.uid() and action = 'like') then
    a := least(auth.uid(), p_target); b := greatest(auth.uid(), p_target);
    select conversation_id into cid from dating_matches where user_a = a and user_b = b;
    if cid is null then
      cid := public.start_conversation(p_target, 'match', 'Match 💘', null);
      insert into dating_matches (user_a, user_b, conversation_id) values (a, b, cid)
      on conflict (user_a, user_b) do update set conversation_id = excluded.conversation_id;
    end if;
    return json_build_object('match', true, 'conversation_id', cid);
  end if;
  if p_action = 'block' then
    delete from dating_matches where user_a = least(auth.uid(), p_target) and user_b = greatest(auth.uid(), p_target);
  end if;
  return json_build_object('match', false);
end $$;

-- Mes matchs
create or replace view public.my_matches with (security_invoker = true) as
select case when m.user_a = auth.uid() then m.user_b else m.user_a end as other_id,
       d.first_name, d.photo_url, d.city, m.conversation_id, m.created_at
from public.dating_matches m
join public.dating_profiles d on d.user_id = case when m.user_a = auth.uid() then m.user_b else m.user_a end
where m.user_a = auth.uid() or m.user_b = auth.uid();

-- Activer une demande d'abonnement (après paiement reçu)
create or replace function public.admin_activate_request(p_request uuid) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare r subscription_requests; u timestamptz;
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  select * into r from subscription_requests where id = p_request and status = 'pending';
  if r.id is null then raise exception 'Demande introuvable'; end if;
  if r.plan = 'gold' then
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(months => r.months)
     where id = r.user_id returning vip_until into u;
  else
    update shops set status = 'active', paid_until = greatest(coalesce(paid_until, now()), now()) + make_interval(months => r.months)
     where owner_id = r.user_id returning paid_until into u;
    if u is null then raise exception 'Ce membre n''a pas encore de boutique'; end if;
  end if;
  update subscription_requests set status = 'done' where id = r.id;
  return u;
end $$;

create or replace view public.subscription_requests_view with (security_invoker = true) as
select r.*, p.username, p.display_name, p.country, p.phone
from public.subscription_requests r join public.profiles p on p.id = r.user_id;

-- Statistiques du back-office (avec les rencontres)
create or replace function public.admin_stats() returns json
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  return json_build_object(
    'users',          (select count(*) from profiles),
    'users_7d',       (select count(*) from profiles where created_at > now() - interval '7 days'),
    'videos',         (select count(*) from videos),
    'vip',            (select count(*) from profiles where vip_until > now()),
    'dating',         (select count(*) from dating_profiles),
    'matches',        (select count(*) from dating_matches),
    'requests',       (select count(*) from subscription_requests where status = 'pending'),
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

-- Les signalements peuvent viser un profil de rencontre
alter table public.reports drop constraint if exists reports_target_type_check;
alter table public.reports add constraint reports_target_type_check
  check (target_type in ('video','comment','profile','job','shop','product','message','dating'));

-- Ville du profil public (facultative)
alter table public.profiles add column if not exists city text;

-- Langue préférée de l'utilisateur
alter table public.profiles add column if not exists lang text;
