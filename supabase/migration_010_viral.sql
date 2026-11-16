-- Vibzo · migration 010 : fonctions « virales » façon TikTok
-- Réponses et j'aime sur les commentaires, partages comptés, republications, temps de visionnage,
-- « Pas intéressé », notifications (j'aime, commentaires, réponses, abonnés, mentions, republications),
-- parrainage (7 jours de Gold tous les 3 amis inscrits) et nouvel algorithme du fil « Pour toi ».

-- 1. Commentaires : réponses et j'aime
alter table public.comments add column if not exists parent_id uuid references public.comments(id) on delete cascade;
create index if not exists comments_parent_idx on public.comments (parent_id);
create table if not exists public.comment_likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);
alter table public.comment_likes enable row level security;
drop policy if exists "comment likes read" on public.comment_likes;
create policy "comment likes read" on public.comment_likes for select using (true);
drop policy if exists "comment likes own" on public.comment_likes;
create policy "comment likes own" on public.comment_likes for insert with check (user_id = auth.uid());
drop policy if exists "comment likes del" on public.comment_likes;
create policy "comment likes del" on public.comment_likes for delete using (user_id = auth.uid());

create or replace view public.comments_view with (security_invoker = true) as
SELECT c.id, c.video_id, c.user_id, c.body, c.created_at, p.username, p.display_name, p.avatar_url,
  c.parent_id,
  ((SELECT count(*) FROM comment_likes l WHERE l.comment_id = c.id))::integer AS like_count,
  (EXISTS (SELECT 1 FROM comment_likes l WHERE l.comment_id = c.id AND l.user_id = auth.uid())) AS liked_by_me,
  ((SELECT count(*) FROM comments r WHERE r.parent_id = c.id))::integer AS reply_count
FROM comments c JOIN profiles p ON p.id = c.user_id;

-- 2. Partages, temps de visionnage, republications, « Pas intéressé »
alter table public.videos add column if not exists share_count bigint not null default 0;
alter table public.videos add column if not exists watch_sum numeric not null default 0;   -- somme des taux de visionnage (0–1)
alter table public.videos add column if not exists watch_n bigint not null default 0;

create table if not exists public.reposts (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  video_id   uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
alter table public.reposts enable row level security;
drop policy if exists "reposts read" on public.reposts;
create policy "reposts read" on public.reposts for select using (true);
drop policy if exists "reposts own" on public.reposts;
create policy "reposts own" on public.reposts for insert with check (user_id = auth.uid());
drop policy if exists "reposts del" on public.reposts;
create policy "reposts del" on public.reposts for delete using (user_id = auth.uid());

create table if not exists public.not_interested (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  video_id   uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
alter table public.not_interested enable row level security;
drop policy if exists "ni own" on public.not_interested;
create policy "ni own" on public.not_interested for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.record_share(p_video uuid) returns void
language sql security definer set search_path = public as $$
  update videos set share_count = share_count + 1 where id = p_video and status = 'published';
$$;
create or replace function public.record_watch(p_video uuid, p_ratio numeric) returns void
language sql security definer set search_path = public as $$
  update videos set watch_sum = watch_sum + greatest(0, least(1, coalesce(p_ratio, 0))), watch_n = watch_n + 1
  where id = p_video and status = 'published';
$$;
grant execute on function public.record_share(uuid) to anon, authenticated;
grant execute on function public.record_watch(uuid, numeric) to anon, authenticated;

-- 3. Vue du fil enrichie (colonnes ajoutées à la fin)
create or replace view public.videos_feed with (security_invoker = true) as
SELECT v.id, v.user_id, v.video_url, v.title, v.caption, v.tags, v.sound, v.country, v.region, v.product_id, v.status, v.created_at,
  p.username, p.display_name, p.avatar_url,
  p.vip_until IS NOT NULL AND p.vip_until > now() AS is_vip,
  ((SELECT count(*) FROM likes l WHERE l.video_id = v.id))::integer AS like_count,
  ((SELECT count(*) FROM comments c WHERE c.video_id = v.id))::integer AS comment_count,
  (EXISTS (SELECT 1 FROM likes l WHERE l.video_id = v.id AND l.user_id = auth.uid())) AS liked_by_me,
  (EXISTS (SELECT 1 FROM saves s WHERE s.video_id = v.id AND s.user_id = auth.uid())) AS saved_by_me,
  (EXISTS (SELECT 1 FROM follows f WHERE f.followee_id = v.user_id AND f.follower_id = auth.uid())) AS following,
  pr.name AS product_name, pr.price AS product_price, pr.currency AS product_currency,
  v.view_count, v.share_count,
  ((SELECT count(*) FROM reposts r WHERE r.video_id = v.id))::integer AS repost_count,
  (EXISTS (SELECT 1 FROM reposts r WHERE r.video_id = v.id AND r.user_id = auth.uid())) AS reposted_by_me,
  CASE WHEN v.watch_n > 0 THEN round(v.watch_sum / v.watch_n, 3) ELSE 0.5 END AS completion
FROM videos v JOIN profiles p ON p.id = v.user_id LEFT JOIN products pr ON pr.id = v.product_id;

-- 4. Algorithme « Pour toi » : engagement par vue, taux de visionnage, partages, coup de pouce aux nouvelles vidéos,
--    goûts personnels ; « Abonnements » inclut les republications des personnes suivies.
create or replace function public.feed(p_countries text[] default null, p_region text default null,
                                       p_mode text default 'pour', p_limit int default 15, p_offset int default 0)
returns setof public.videos_feed language sql stable set search_path = public as $$
  with liked as (
    select v.user_id, v.tags from videos v
     where v.id in (select video_id from likes where user_id = auth.uid() union select video_id from saves where user_id = auth.uid())
  ),
  fav_creators as (select distinct user_id from liked),
  fav_tags as (select distinct lower(t) as tag from liked, unnest(liked.tags) t),
  my_country as (select country from profiles where id = auth.uid())
  select f.* from videos_feed f
  where f.status = 'published'
    and not exists (select 1 from not_interested n where n.user_id = auth.uid() and n.video_id = f.id)
    and (p_mode <> 'abo' or f.following or f.user_id = auth.uid()
         or exists (select 1 from reposts r join follows fo on fo.followee_id = r.user_id and fo.follower_id = auth.uid() where r.video_id = f.id))
    and (p_mode = 'abo' or p_countries is null or f.country = any (p_countries))
    and (p_mode = 'abo' or p_region is null or f.region = p_region)
  order by case when p_mode = 'abo' then extract(epoch from f.created_at)
    else
      -- qualité : interactions par vue (lissé) × taux de visionnage
      ((f.like_count * 2 + f.comment_count * 3 + f.share_count * 4 + f.repost_count * 4 + 1)::numeric / (f.view_count + 20))
      * (0.4 + f.completion)
      -- popularité (log) pour faire monter ce qui marche
      * (1 + ln(1 + f.view_count + f.like_count * 3) / 4)
      -- fraîcheur
      / power(extract(epoch from (now() - f.created_at)) / 3600 + 2, 1.2)
      -- coup de pouce découverte : les vidéos récentes avec peu de vues sont montrées à quelques personnes
      * (case when f.view_count < 50 and f.created_at > now() - interval '48 hours' then 2.5 else 1 end)
      -- goûts personnels
      * (1 + case when f.following then 1.5 else 0 end
           + case when f.user_id in (select user_id from fav_creators) then 1.2 else 0 end
           + least(1.5, 0.5 * (select count(*) from unnest(f.tags) t where lower(t) in (select tag from fav_tags)))
           + case when f.country = (select country from my_country) then 0.3 else 0 end)
    end desc, f.created_at desc
  limit least(p_limit, 50) offset p_offset;
$$;

-- 5. Tendances : hashtags et sons du moment (7 derniers jours)
create or replace function public.trending_tags(p_limit int default 15)
returns table (tag text, videos bigint, score numeric) language sql stable security definer set search_path = public as $$
  select lower(t), count(distinct v.id), sum(1 + v.view_count / 100.0 + (select count(*) from likes l where l.video_id = v.id))
  from videos v, unnest(v.tags) t
  where v.status = 'published' and v.created_at > now() - interval '7 days'
  group by lower(t) order by 3 desc limit least(p_limit, 50);
$$;
create or replace function public.trending_sounds(p_limit int default 10)
returns table (sound text, videos bigint) language sql stable security definer set search_path = public as $$
  select v.sound, count(*) from videos v
  where v.status = 'published' and coalesce(v.sound, '') <> '' and v.created_at > now() - interval '30 days'
  group by v.sound order by 2 desc limit least(p_limit, 30);
$$;
grant execute on function public.trending_tags(integer) to anon, authenticated;
grant execute on function public.trending_sounds(integer) to anon, authenticated;

-- 6. Notifications
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,   -- destinataire
  actor_id   uuid references public.profiles(id) on delete cascade,
  type       text not null check (type in ('like','comment','reply','follow','mention','repost','comment_like','referral','system')),
  video_id   uuid references public.videos(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  body       text not null default '',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
drop policy if exists "notif own read" on public.notifications;
create policy "notif own read" on public.notifications for select using (user_id = auth.uid());
drop policy if exists "notif own update" on public.notifications;
create policy "notif own update" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "notif own delete" on public.notifications;
create policy "notif own delete" on public.notifications for delete using (user_id = auth.uid());

create or replace function public.notify(p_user uuid, p_actor uuid, p_type text, p_video uuid default null, p_comment uuid default null, p_body text default '')
returns void language sql security definer set search_path = public as $$
  insert into notifications (user_id, actor_id, type, video_id, comment_id, body)
  select p_user, p_actor, p_type, p_video, p_comment, left(coalesce(p_body, ''), 140)
  where p_user is not null and p_user is distinct from p_actor
    -- pas de doublon de « j'aime » du même auteur sur la même vidéo
    and not (p_type in ('like','repost','follow','comment_like') and exists (
      select 1 from notifications n where n.user_id = p_user and n.actor_id = p_actor and n.type = p_type
        and n.video_id is not distinct from p_video and n.comment_id is not distinct from p_comment));
$$;
revoke execute on function public.notify(uuid, uuid, text, uuid, uuid, text) from public, anon, authenticated;

-- Mentions @pseudo dans un texte
create or replace function public.notify_mentions(p_text text, p_actor uuid, p_video uuid, p_comment uuid)
returns void language plpgsql security definer set search_path = public as $$
declare u record;
begin
  for u in select distinct p.id from profiles p
    where p.username in (select lower(m[1]) from regexp_matches(coalesce(p_text, ''), '@([A-Za-z0-9_.]{3,24})', 'g') m) limit 10
  loop perform public.notify(u.id, p_actor, 'mention', p_video, p_comment, p_text); end loop;
end $$;
revoke execute on function public.notify_mentions(text, uuid, uuid, uuid) from public, anon, authenticated;

create or replace function public.trg_notify() returns trigger
language plpgsql security definer set search_path = public as $$
declare owner uuid; parent_author uuid;
begin
  if tg_table_name = 'likes' then
    select user_id into owner from videos where id = new.video_id;
    perform public.notify(owner, new.user_id, 'like', new.video_id);
  elsif tg_table_name = 'comments' then
    select user_id into owner from videos where id = new.video_id;
    if new.parent_id is not null then
      select user_id into parent_author from comments where id = new.parent_id;
      perform public.notify(parent_author, new.user_id, 'reply', new.video_id, new.id, new.body);
    end if;
    if owner is distinct from parent_author then perform public.notify(owner, new.user_id, 'comment', new.video_id, new.id, new.body); end if;
    perform public.notify_mentions(new.body, new.user_id, new.video_id, new.id);
  elsif tg_table_name = 'follows' then
    perform public.notify(new.followee_id, new.follower_id, 'follow');
  elsif tg_table_name = 'reposts' then
    select user_id into owner from videos where id = new.video_id;
    perform public.notify(owner, new.user_id, 'repost', new.video_id);
  elsif tg_table_name = 'comment_likes' then
    perform public.notify((select user_id from comments where id = new.comment_id), new.user_id, 'comment_like',
                          (select video_id from comments where id = new.comment_id), new.comment_id);
  elsif tg_table_name = 'videos' then
    perform public.notify_mentions(coalesce(new.caption, '') || ' ' || coalesce(new.title, ''), new.user_id, new.id, null);
  end if;
  return new;
end $$;
revoke execute on function public.trg_notify() from public, anon, authenticated;
drop trigger if exists notify_likes on public.likes;
create trigger notify_likes after insert on public.likes for each row execute function public.trg_notify();
drop trigger if exists notify_comments on public.comments;
create trigger notify_comments after insert on public.comments for each row execute function public.trg_notify();
drop trigger if exists notify_follows on public.follows;
create trigger notify_follows after insert on public.follows for each row execute function public.trg_notify();
drop trigger if exists notify_reposts on public.reposts;
create trigger notify_reposts after insert on public.reposts for each row execute function public.trg_notify();
drop trigger if exists notify_comment_likes on public.comment_likes;
create trigger notify_comment_likes after insert on public.comment_likes for each row execute function public.trg_notify();
drop trigger if exists notify_videos on public.videos;
create trigger notify_videos after insert on public.videos for each row execute function public.trg_notify();

create or replace view public.notifications_view with (security_invoker = true) as
SELECT n.id, n.user_id, n.actor_id, n.type, n.video_id, n.comment_id, n.body, n.read, n.created_at,
  a.username AS actor_username, a.display_name AS actor_name, a.avatar_url AS actor_avatar, v.video_url
FROM notifications n LEFT JOIN profiles a ON a.id = n.actor_id LEFT JOIN videos v ON v.id = n.video_id;

-- 7. Parrainage : 7 jours de Gold tous les 3 amis inscrits avec ton lien
-- (la protection du champ vip_until laisse passer les récompenses accordées par le système)
create or replace function public.protect_profile_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() and coalesce(current_setting('vibzo.system', true), '') <> '1' then
    new.role := old.role;
    new.vip_until := old.vip_until;
  end if;
  return new;
end $$;
revoke execute on function public.protect_profile_fields() from public, anon, authenticated;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id) on delete set null;

create or replace function public.trg_referral() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if new.referred_by is null or new.referred_by = new.id then return new; end if;
  select count(*) into n from profiles where referred_by = new.referred_by;
  perform public.notify(new.referred_by, new.id, 'referral', null, null,
    case when n % 3 = 0 then '🎁 3 amis inscrits : 7 jours de Vibzo Gold offerts !' else n % 3 || '/3 amis inscrits avec ton lien' end);
  if n % 3 = 0 then
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '7 days' where id = new.referred_by;
  end if;
  return new;
end $$;
revoke execute on function public.trg_referral() from public, anon, authenticated;
drop trigger if exists referral_reward on public.profiles;
create trigger referral_reward after insert on public.profiles for each row execute function public.trg_referral();

-- Le parrain est lu dans les métadonnées d'inscription (champ « ref » = nom d'utilisateur du parrain)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; uname text; n int := 0; m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb); ref uuid;
begin
  base := regexp_replace(lower(coalesce(m->>'username', split_part(new.email, '@', 1), 'user')), '[^a-z0-9_.]', '', 'g');
  if char_length(base) < 3 then base := base || 'vibzo'; end if;
  base := left(base, 20);
  uname := base;
  while exists (select 1 from public.profiles where username = uname) loop
    n := n + 1; uname := base || n;
  end loop;
  select id into ref from public.profiles where username = lower(nullif(m->>'ref', ''));
  insert into public.profiles (id, username, display_name, avatar_url, country, region, phone, needs_setup, referred_by)
  values (
    new.id, uname,
    left(coalesce(nullif(m->>'display_name', ''), nullif(m->>'full_name', ''), nullif(m->>'name', ''), uname), 40),
    coalesce(nullif(m->>'avatar_url', ''), nullif(m->>'picture', '')),
    coalesce(nullif(m->>'country', ''), 'CM'),
    nullif(m->>'region', ''),
    nullif(m->>'phone', ''),
    nullif(m->>'country', '') is null,
    ref
  );
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Pour les comptes Google (le « ref » ne passe pas par les métadonnées) : enregistrer son parrain une seule fois
create or replace function public.set_referrer(p_username text) returns boolean
language plpgsql security definer set search_path = public as $$
declare r uuid;
begin
  select id into r from profiles where username = lower(p_username) and id <> auth.uid();
  if r is null then return false; end if;
  update profiles set referred_by = r where id = auth.uid() and referred_by is null and created_at > now() - interval '1 day';
  if found then
    perform public.trg_referral_manual(auth.uid());
    return true;
  end if;
  return false;
end $$;
create or replace function public.trg_referral_manual(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare rb uuid; n int;
begin
  select referred_by into rb from profiles where id = p_user;
  if rb is null then return; end if;
  select count(*) into n from profiles where referred_by = rb;
  perform public.notify(rb, p_user, 'referral', null, null,
    case when n % 3 = 0 then '🎁 3 amis inscrits : 7 jours de Vibzo Gold offerts !' else n % 3 || '/3 amis inscrits avec ton lien' end);
  if n % 3 = 0 then
    perform set_config('vibzo.system', '1', true);
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '7 days' where id = rb;
    perform set_config('vibzo.system', '', true);
  end if;
end $$;
revoke execute on function public.trg_referral_manual(uuid) from public, anon, authenticated;
revoke execute on function public.set_referrer(text) from public, anon;
grant execute on function public.set_referrer(text) to authenticated;

create or replace function public.my_referrals() returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from profiles where referred_by = auth.uid();
$$;
grant execute on function public.my_referrals() to authenticated;
