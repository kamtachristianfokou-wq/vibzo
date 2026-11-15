-- Vibzo · migration 007 : rencontres façon Tinder + mode « Ce soir » (sans lendemain)
-- Plusieurs photos, Super Like (3 par jour), retour arrière, « Dispo ce soir », « T'a liké ».

alter table public.dating_profiles add column if not exists photos text[] not null default '{}';
alter table public.dating_profiles add column if not exists available_until timestamptz;
do $$ begin
  alter table public.dating_profiles add constraint dating_photos_max check (coalesce(array_length(photos, 1), 0) <= 5);
exception when duplicate_object then null; end $$;

alter table public.dating_swipes drop constraint if exists dating_swipes_action_check;
alter table public.dating_swipes add constraint dating_swipes_action_check check (action in ('like','super','pass','block'));

drop function if exists public.dating_candidates(text[], text, text, text, integer, integer, integer);
create or replace function public.dating_candidates(
  p_countries text[], p_region text default null, p_city text default null,
  p_mode text default 'amour', p_min_age int default 18, p_max_age int default 99, p_limit int default 20)
returns table (user_id uuid, first_name text, age int, gender text, intent text, bio text, photo_url text, photos text[],
               country text, region text, city text, interests text[], verified boolean, is_vip boolean,
               available boolean, liked_me boolean, super_me boolean)
language plpgsql stable security definer set search_path = public as $$
declare me dating_profiles;
begin
  if not public.is_vip() then raise exception 'Réservé aux abonnés Gold'; end if;
  select * into me from dating_profiles d where d.user_id = auth.uid();
  if me.user_id is null then raise exception 'Crée d''abord ton profil de rencontre'; end if;
  return query
  select d.user_id, d.first_name, date_part('year', age(d.birth_date))::int, d.gender, d.intent, d.bio, d.photo_url, d.photos,
         d.country, d.region, d.city, d.interests, d.verified, coalesce(p.vip_until > now(), false),
         coalesce(d.available_until > now(), false),
         exists (select 1 from dating_swipes s where s.from_id = d.user_id and s.to_id = auth.uid() and s.action in ('like','super')),
         exists (select 1 from dating_swipes s where s.from_id = d.user_id and s.to_id = auth.uid() and s.action = 'super')
  from dating_profiles d join profiles p on p.id = d.user_id
  where d.visible and d.user_id <> auth.uid()
    and (p_countries is null or d.country = any (p_countries))
    and (p_region is null or d.region = p_region)
    and (p_city is null or lower(d.city) = lower(trim(p_city)))
    and (me.looking_for = 'tous' or d.gender = me.looking_for)
    and (d.looking_for = 'tous' or d.looking_for = me.gender)
    and (case when p_mode = 'soir' then d.intent in ('libre','les_deux') else d.intent in ('serieux','les_deux') end)
    and date_part('year', age(d.birth_date)) between greatest(p_min_age, 18) and p_max_age
    and not exists (select 1 from dating_swipes s where s.from_id = auth.uid() and s.to_id = d.user_id)
    and not exists (select 1 from dating_swipes s where s.from_id = d.user_id and s.to_id = auth.uid() and s.action = 'block')
  order by
    exists (select 1 from dating_swipes s where s.from_id = d.user_id and s.to_id = auth.uid() and s.action = 'super') desc,
    (p_mode = 'soir' and coalesce(d.available_until > now(), false)) desc,
    (lower(d.city) = lower(me.city)) desc, d.verified desc, d.updated_at desc
  limit least(p_limit, 50);
end $$;
revoke execute on function public.dating_candidates(text[], text, text, text, integer, integer, integer) from public, anon;
grant execute on function public.dating_candidates(text[], text, text, text, integer, integer, integer) to authenticated;

create or replace function public.dating_swipe(p_target uuid, p_action text) returns json
language plpgsql security definer set search_path = public as $$
declare a uuid; b uuid; cid uuid; n int;
begin
  if not public.is_vip() then raise exception 'Réservé aux abonnés Gold'; end if;
  if not exists (select 1 from dating_profiles where user_id = auth.uid()) then raise exception 'Crée d''abord ton profil de rencontre'; end if;
  if p_action not in ('like','super','pass','block') then raise exception 'Action invalide'; end if;
  if p_action = 'super' then
    select count(*) into n from dating_swipes where from_id = auth.uid() and action = 'super' and created_at > now() - interval '24 hours';
    if n >= 3 then raise exception 'Tu as utilisé tes 3 Super Likes du jour ⭐ Reviens demain !'; end if;
  end if;
  insert into dating_swipes (from_id, to_id, action) values (auth.uid(), p_target, p_action)
  on conflict (from_id, to_id) do update set action = excluded.action, created_at = now();
  if p_action in ('like','super') and exists (select 1 from dating_swipes where from_id = p_target and to_id = auth.uid() and action in ('like','super')) then
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

-- Retour arrière : annule le dernier « Non » (moins de 10 minutes)
create or replace function public.dating_rewind() returns uuid
language plpgsql security definer set search_path = public as $$
declare t uuid;
begin
  if not public.is_vip() then raise exception 'Réservé aux abonnés Gold'; end if;
  select to_id into t from dating_swipes where from_id = auth.uid() and action = 'pass' and created_at > now() - interval '10 minutes'
  order by created_at desc limit 1;
  if t is null then return null; end if;
  delete from dating_swipes where from_id = auth.uid() and to_id = t;
  return t;
end $$;

-- « Dispo ce soir » pendant p_hours heures (0 = désactiver)
create or replace function public.dating_set_available(p_hours int) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare v timestamptz;
begin
  if not public.is_vip() then raise exception 'Réservé aux abonnés Gold'; end if;
  v := case when coalesce(p_hours, 0) <= 0 then null else now() + make_interval(hours => least(p_hours, 12)) end;
  update dating_profiles set available_until = v, updated_at = now() where user_id = auth.uid();
  return v;
end $$;

-- Nombre de personnes qui m'ont liké et que je n'ai pas encore vues
create or replace function public.dating_likes_count() returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from dating_swipes s
  where s.to_id = auth.uid() and s.action in ('like','super')
    and not exists (select 1 from dating_swipes m where m.from_id = auth.uid() and m.to_id = s.from_id);
$$;

do $$ declare f text; begin
  foreach f in array array['public.dating_swipe(uuid,text)','public.dating_rewind()','public.dating_set_available(integer)','public.dating_likes_count()'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
