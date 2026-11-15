-- Vibzo · migration 008 : mise en relation automatique offres ↔ candidats (pays et monde entier)
-- Chaque candidat reçoit des offres suggérées, chaque recruteur reçoit des profils suggérés,
-- classés par un score de compatibilité (secteur, métier, compétences, lieu, mobilité).

alter table public.candidates add column if not exists mobility text not null default 'pays';
do $$ begin
  alter table public.candidates add constraint candidates_mobility_check check (mobility in ('pays','international','teletravail'));
exception when duplicate_object then null; end $$;
alter table public.job_offers add column if not exists skills text[] not null default '{}';
alter table public.job_offers add column if not exists open_to text not null default 'pays';
do $$ begin
  alter table public.job_offers add constraint job_offers_open_to_check check (open_to in ('pays','monde'));
exception when duplicate_object then null; end $$;

-- Mots significatifs d'un texte (minuscules, sans accents, 3 lettres et plus)
create or replace function public.job_words(t text) returns text[]
language sql immutable set search_path = public as $$
  select coalesce(array_agg(distinct w), '{}') from (
    select regexp_split_to_table(translate(lower(coalesce(t, '')), 'àâäáãéèêëíìîïóòôöõúùûüçñ''’', 'aaaaaeeeeiiiiooooouuuucn  '), '[^a-z0-9+#]+') w
  ) x where char_length(w) >= 3 and w not in ('des','les','une','pour','dans','avec','sur','par','and','the','for','with');
$$;

-- L'offre est-elle accessible à ce candidat (lieu / mobilité) ?
create or replace function public.job_reachable(o public.job_offers, c public.candidates) returns boolean
language sql immutable set search_path = public as $$
  select o.country = c.country
      or o.remote = 'Télétravail'
      or (o.open_to = 'monde' and c.mobility = 'international')
      or (c.mobility = 'teletravail' and o.remote <> 'Sur site');
$$;

-- Score de compatibilité 0–100 et raisons lisibles
create or replace function public.job_fit(o public.job_offers, c public.candidates) returns jsonb
language plpgsql immutable set search_path = public as $$
declare s int := 0; r text[] := '{}'; tw text[]; cw text[]; ow text[]; sk text[]; n int;
begin
  if o.sector = c.sector then s := s + 30; r := array_append(r, ('Secteur : ' || o.sector)::text); end if;
  tw := public.job_words(o.title); cw := public.job_words(c.job_title);
  n := (select count(*) from unnest(tw) x where x = any (cw));
  if n > 0 then s := s + least(30, 18 + 6 * n); r := array_append(r, ('Métier : ' || o.title)::text); end if;
  ow := public.job_words(o.title || ' ' || o.description || ' ' || array_to_string(o.skills, ' '));
  sk := array(select k from unnest(c.skills) k where exists (select 1 from unnest(public.job_words(k)) w where w = any (ow)));
  if cardinality(sk) > 0 then s := s + least(24, 8 * cardinality(sk)); r := array_append(r, ('Compétences : ' || array_to_string(sk[1:4], ', '))::text); end if;
  if o.country = c.country and o.region is not null and o.region = c.region then s := s + 16; r := array_append(r, ('Même région : ' || o.region)::text);
  elsif o.country = c.country then s := s + 10; r := array_append(r, 'Même pays'::text);
  elsif o.remote = 'Télétravail' or c.mobility = 'teletravail' then s := s + 6; r := array_append(r, 'Télétravail possible'::text);
  else s := s + 4; r := array_append(r, 'Ouvert à l''international'::text); end if;
  return jsonb_build_object('score', least(100, s), 'reasons', to_jsonb(r));
end $$;

-- Offres suggérées pour moi (candidat)
create or replace function public.job_suggestions(p_limit int default 20)
returns table (id uuid, title text, company text, sector text, contract text, remote text, salary numeric, currency text,
               description text, country text, region text, open_to text, created_at timestamptz, poster_name text,
               user_id uuid, applied_by_me boolean, application_count int, status text, score int, reasons text[])
language plpgsql stable security definer set search_path = public as $$
declare c candidates;
begin
  select * into c from candidates where candidates.user_id = auth.uid();
  if c.user_id is null then return; end if;
  return query
  select o.id, o.title, o.company, o.sector, o.contract, o.remote, o.salary, o.currency, o.description, o.country, o.region, o.open_to,
         o.created_at, p.display_name, o.user_id, false, (select count(*) from applications a where a.offer_id = o.id)::int, o.status,
         (f->>'score')::int, array(select jsonb_array_elements_text(f->'reasons'))
  from job_offers o join profiles p on p.id = o.user_id
  cross join lateral (select public.job_fit(o, c) as f) x
  where o.status = 'open' and o.user_id <> auth.uid() and public.job_reachable(o, c)
    and not exists (select 1 from applications a where a.offer_id = o.id and a.user_id = auth.uid())
    and (f->>'score')::int >= 30
  order by (f->>'score')::int desc, o.created_at desc
  limit least(p_limit, 50);
end $$;

-- Profils suggérés pour mes offres (recruteur) ; p_offer = une offre précise, sinon toutes mes offres en ligne
create or replace function public.candidate_suggestions(p_offer uuid default null, p_limit int default 20)
returns table (user_id uuid, display_name text, username text, avatar_url text, job_title text, sector text, skills text[],
               experience_years int, availability text, about text, country text, region text, mobility text,
               offer_id uuid, offer_title text, score int, reasons text[])
language plpgsql stable security definer set search_path = public as $$
begin
  if p_offer is not null and not exists (select 1 from job_offers where id = p_offer and (job_offers.user_id = auth.uid() or public.is_admin())) then
    raise exception 'Offre introuvable';
  end if;
  return query
  select distinct on (c.user_id) c.user_id, p.display_name, p.username, p.avatar_url, c.job_title, c.sector, c.skills,
         c.experience_years, c.availability, c.about, c.country, c.region, c.mobility,
         o.id, o.title, (public.job_fit(o, c)->>'score')::int, array(select jsonb_array_elements_text(public.job_fit(o, c)->'reasons'))
  from job_offers o
  join candidates c on c.visible and c.user_id <> o.user_id and public.job_reachable(o, c)
  join profiles p on p.id = c.user_id
  where (case when p_offer is null then o.user_id = auth.uid() and o.status in ('open','pending') else o.id = p_offer end)
    and (public.job_fit(o, c)->>'score')::int >= 30
  order by c.user_id, (public.job_fit(o, c)->>'score')::int desc;
  -- (le tri par score et la limite se font côté application)
end $$;

do $$ declare f text; begin
  foreach f in array array['public.job_suggestions(integer)','public.candidate_suggestions(uuid,integer)'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
