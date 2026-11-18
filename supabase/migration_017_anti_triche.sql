-- Vibzo · migration 017 : anti-triche
-- 1. Vues : une vue anonyme compte une seule fois par adresse IP, vidéo et jour (changer de clé ne sert plus à rien),
--    et une adresse IP ne peut pas produire plus de 300 vues par jour.
-- 2. Argent : seules les vues de VRAIS comptes (e-mail confirmé, pas le créateur lui-même), au plus 20 par spectateur,
--    créateur et jour, comptent pour le Programme Créateurs ; idem pour les abonnés (comptes confirmés uniquement).
-- 3. Temps de visionnage et partages : une fois par IP (ou compte), vidéo et jour.
-- 4. Limites de cadence contre les robots (commentaires, j'aime, abonnements, messages, vidéos, signalements…).
-- 5. Parrainage : récompense seulement quand l'ami a CONFIRMÉ son e-mail, et au plus 5 récompenses par mois.
-- 6. Envois de fichiers : au plus 30 par jour et par compte.

-- ---------- outils ----------
create or replace function public.client_ip_hash() returns text
language sql stable set search_path = public as $$
  select md5(coalesce(
    nullif(current_setting('request.headers', true), '')::json ->> 'cf-connecting-ip',
    nullif(current_setting('request.headers', true), '')::json ->> 'x-real-ip',
    split_part(nullif(current_setting('request.headers', true), '')::json ->> 'x-forwarded-for', ',', 1),
    'inconnu') || 'vibzo-sel');
$$;
revoke execute on function public.client_ip_hash() from public, anon, authenticated;

create or replace function public.is_real_account(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from auth.users u where u.id = p_user and u.email_confirmed_at is not null and u.banned_until is null);
$$;
revoke execute on function public.is_real_account(uuid) from public, anon, authenticated;

-- ---------- 1. vues ----------
alter table public.video_views add column if not exists ip_hash text;
alter table public.video_views add column if not exists real_viewer boolean not null default false;
create index if not exists video_views_ip_day_idx on public.video_views (ip_hash, day);
create index if not exists video_views_creator_day_idx on public.video_views (creator_id, day);

create or replace function public.record_view(p_video uuid, p_key text)
returns void language plpgsql security definer set search_path = public as $$
declare cr uuid; n int; ip text := public.client_ip_hash(); me uuid := auth.uid();
begin
  select user_id into cr from videos where id = p_video and status = 'published';
  if cr is null or cr = me then return; end if;
  if (select count(*) from video_views where ip_hash = ip and day = current_date) >= 300 then return; end if;
  insert into video_views (video_id, viewer_key, creator_id, ip_hash, real_viewer)
  values (p_video, coalesce(me::text, 'ip:' || ip), cr, ip, me is not null and public.is_real_account(me))
  on conflict do nothing;
  get diagnostics n = row_count;
  if n > 0 then update videos set view_count = view_count + 1 where id = p_video; end if;
end $$;
grant execute on function public.record_view(uuid, text) to anon, authenticated;

-- Vues qui comptent pour l'argent : vrais comptes, au plus 20 par spectateur, créateur et jour
create or replace function public.paid_views_30d(p_creator uuid) returns bigint
language sql stable security definer set search_path = public as $$
  select coalesce(sum(least(c, 20)), 0)::bigint from (
    select count(*) c from video_views
    where creator_id = p_creator and real_viewer and day > current_date - 30 and viewer_key <> p_creator::text
    group by viewer_key, day) x;
$$;
revoke execute on function public.paid_views_30d(uuid) from public, anon, authenticated;

create or replace function public.real_followers(p_user uuid) returns bigint
language sql stable security definer set search_path = public as $$
  select count(*) from follows f join auth.users u on u.id = f.follower_id
  where f.followee_id = p_user and u.email_confirmed_at is not null and u.banned_until is null;
$$;
revoke execute on function public.real_followers(uuid) from public, anon, authenticated;

create or replace function public.creator_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); t jsonb := public.creator_thresholds(); f bigint; v30 bigint; vt bigint; nv int; lk bigint; prog creator_program;
begin
  if me is null then raise exception 'Connexion requise'; end if;
  f := public.real_followers(me);
  v30 := public.paid_views_30d(me);
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

drop function if exists public.admin_creators();
create or replace function public.admin_creators()
returns table (user_id uuid, username text, display_name text, country text, followers bigint, views_30d bigint, videos bigint,
               status text, payout_method text, payout_number text, due numeric, raw_views_30d bigint, viewers_30d bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  return query
  select p.id, p.username, p.display_name, p.country,
    public.real_followers(p.id),
    public.paid_views_30d(p.id),
    (select count(*) from videos v where v.user_id = p.id and v.status = 'published'),
    cp.status, cp.payout_method, cp.payout_number,
    (select coalesce(sum(e.amount), 0) from creator_earnings e where e.user_id = p.id and e.status = 'due'),
    (select count(*) from video_views w where w.creator_id = p.id and w.day > current_date - 30),
    (select count(distinct w.viewer_key) from video_views w where w.creator_id = p.id and w.real_viewer and w.day > current_date - 30)
  from profiles p left join creator_program cp on cp.user_id = p.id
  where cp.user_id is not null or exists (select 1 from videos v where v.user_id = p.id)
  order by (cp.status = 'pending') desc nulls last, 6 desc
  limit 100;
end $$;
revoke execute on function public.admin_creators() from public, anon;
grant execute on function public.admin_creators() to authenticated;

-- ---------- 3. temps de visionnage et partages ----------
create table if not exists public.engagement_log (
  video_id uuid not null references public.videos(id) on delete cascade,
  kind     text not null,
  who      text not null,
  day      date not null default current_date,
  primary key (video_id, kind, who, day)
);
alter table public.engagement_log enable row level security;  -- aucune règle : accessible seulement par les fonctions

create or replace function public.record_share(p_video uuid) returns void
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  insert into engagement_log (video_id, kind, who) values (p_video, 'share', coalesce(auth.uid()::text, public.client_ip_hash()))
  on conflict do nothing;
  get diagnostics n = row_count;
  if n > 0 then update videos set share_count = share_count + 1 where id = p_video and status = 'published'; end if;
end $$;
grant execute on function public.record_share(uuid) to anon, authenticated;

create or replace function public.record_watch(p_video uuid, p_ratio numeric) returns void
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  insert into engagement_log (video_id, kind, who) values (p_video, 'watch', coalesce(auth.uid()::text, public.client_ip_hash()))
  on conflict do nothing;
  get diagnostics n = row_count;
  if n > 0 then
    update videos set watch_sum = watch_sum + greatest(0, least(1, coalesce(p_ratio, 0))), watch_n = watch_n + 1
    where id = p_video and status = 'published';
  end if;
end $$;
grant execute on function public.record_watch(uuid, numeric) to anon, authenticated;

-- ---------- 4. limites de cadence ----------
-- TG_ARGV : [0] colonne de l'auteur, [1] fenêtre (ex. '10 minutes'), [2] maximum
create or replace function public.rate_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare who uuid; n int;
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  who := (to_jsonb(new) ->> tg_argv[0])::uuid;
  execute format('select count(*) from %I.%I where %I = $1 and created_at > now() - $2::interval', tg_table_schema, tg_table_name, tg_argv[0])
    into n using who, tg_argv[1];
  if n >= tg_argv[2]::int then
    raise exception 'Doucement 🙂 Trop d''actions en peu de temps, réessaie dans quelques minutes.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.rate_limit() from public, anon, authenticated;

do $$
declare r record;
begin
  for r in select * from (values
    ('comments', 'user_id', '10 minutes', 20),
    ('likes', 'user_id', '1 hour', 300),
    ('comment_likes', 'user_id', '1 hour', 300),
    ('follows', 'follower_id', '1 hour', 100),
    ('reposts', 'user_id', '1 hour', 60),
    ('videos', 'user_id', '1 day', 20),
    ('messages', 'sender_id', '10 minutes', 60),
    ('reports', 'reporter_id', '1 day', 20),
    ('job_offers', 'user_id', '1 day', 10),
    ('applications', 'user_id', '1 day', 30),
    ('products', 'shop_id', '1 day', 50)
  ) as t(tbl, col, win, mx)
  loop
    if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = r.tbl and column_name = 'created_at')
       and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = r.tbl and column_name = r.col) then
      execute format('drop trigger if exists rate_limit_ins on public.%I', r.tbl);
      execute format('create trigger rate_limit_ins before insert on public.%I for each row execute function public.rate_limit(%L, %L, %L)', r.tbl, r.col, r.win, r.mx);
    end if;
  end loop;
end $$;

-- ---------- 5. parrainage ----------
alter table public.profiles add column if not exists referral_rewarded boolean not null default false;

create or replace function public.grant_referral(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare rb uuid; n int; recent int;
begin
  select referred_by into rb from profiles where id = p_user and not referral_rewarded;
  if rb is null or not public.is_real_account(p_user) then return; end if;
  perform set_config('vibzo.system', '1', true);
  update profiles set referral_rewarded = true,
         vip_until = greatest(coalesce(vip_until, now()), now()) + interval '3 days' where id = p_user;
  perform public.notify(p_user, rb, 'referral', null, null, '🎁 Bienvenue ! 3 jours de Vibzo Gold offerts grâce à ton ami');
  select count(*) into n from profiles where referred_by = rb and referral_rewarded;
  select count(*) into recent from notifications where user_id = rb and type = 'referral' and body like '🎁 3 amis%' and created_at > now() - interval '30 days';
  if n % 3 = 0 and recent < 5 then
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '7 days' where id = rb;
    perform public.notify(rb, p_user, 'referral', null, null, '🎁 3 amis inscrits : 7 jours de Vibzo Gold offerts !');
  else
    perform public.notify(rb, p_user, 'referral', null, null, (n % 3) || '/3 amis inscrits avec ton lien');
  end if;
  perform set_config('vibzo.system', '', true);
end $$;
revoke execute on function public.grant_referral(uuid) from public, anon, authenticated;

-- l'ancienne récompense immédiate à l'inscription est retirée
drop trigger if exists referral_reward on public.profiles;
create or replace function public.trg_referral_manual(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public.grant_referral(p_user);
end $$;
revoke execute on function public.trg_referral_manual(uuid) from public, anon, authenticated;

-- récompense dès que l'e-mail est confirmé (ou tout de suite pour une connexion Google)
create or replace function public.trg_email_confirmed() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null and (tg_op = 'INSERT' or old.email_confirmed_at is null) then
    perform public.grant_referral(new.id);
  end if;
  return new;
end $$;
revoke execute on function public.trg_email_confirmed() from public, anon, authenticated;
drop trigger if exists z_referral_on_confirm on auth.users;
create trigger z_referral_on_confirm after insert or update of email_confirmed_at on auth.users
  for each row execute function public.trg_email_confirmed();

-- ---------- 6. envois de fichiers ----------
drop policy if exists "vibzo media upload" on storage.objects;
create policy "vibzo media upload" on storage.objects for insert with check (
  bucket_id = any (array['videos', 'images'])
  and (storage.foldername(name))[1] = auth.uid()::text
  and (select count(*) from storage.objects o where o.bucket_id = any (array['videos', 'images'])
       and (storage.foldername(o.name))[1] = auth.uid()::text and o.created_at > now() - interval '1 day') < 30);
