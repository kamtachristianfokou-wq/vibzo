alter table public.videos add column if not exists photos text[] not null default '{}';
alter table public.videos add column if not exists allow_comments boolean not null default true;
alter table public.videos add column if not exists allow_duet boolean not null default true;
alter table public.videos add column if not exists allow_download boolean not null default true;
alter table public.videos add column if not exists pinned_at timestamptz;
alter table public.videos add column if not exists reply_to uuid references public.comments(id) on delete set null;
alter table public.videos add column if not exists reply_text text check (char_length(reply_text) <= 220);
create index if not exists videos_pinned_idx on public.videos (user_id, pinned_at) where pinned_at is not null;

create or replace function public.check_video_extra() returns trigger
language plpgsql security definer set search_path = public as $$
declare pre text; ph text; src record; cm record;
begin
  if tg_op = 'INSERT' then
    -- réponse en vidéo à un commentaire de sa propre vidéo : le texte affiché vient du commentaire lui-même
    new.reply_text := null;
    if new.reply_to is not null then
      select c.body, p.username into cm from comments c join profiles p on p.id = c.user_id join videos vv on vv.id = c.video_id
       where c.id = new.reply_to and vv.user_id = new.user_id;
      if cm.body is null then new.reply_to := null;
      else new.reply_text := left('@' || cm.username || ' : ' || cm.body, 220); end if;
    end if;
  end if;
  if coalesce(current_setting('vibzo.system', true), '') = '1' or auth.uid() is null or public.is_admin() then return new; end if;
  -- photos : 10 au maximum, uniquement depuis le dossier de l'auteur
  if coalesce(array_length(new.photos, 1), 0) > 10 then raise exception 'Maximum 10 photos'; end if;
  if tg_op = 'INSERT' or new.photos is distinct from old.photos then
    pre := 'https://pcfebfknjtqtgkhctxll.supabase.co/storage/v1/object/public/images/' || new.user_id::text || '/';
    foreach ph in array new.photos loop
      if left(ph, length(pre)) <> pre then raise exception 'Photo invalide'; end if;
    end loop;
  end if;
  -- épinglées : 3 au maximum
  if new.pinned_at is not null and (tg_op = 'INSERT' or old.pinned_at is null) then
    if (select count(*) from videos where user_id = new.user_id and pinned_at is not null and id <> new.id) >= 3 then
      raise exception 'Tu peux épingler 3 vidéos au maximum';
    end if;
  end if;
  if tg_op = 'INSERT' then
    -- Duo / Collage seulement si le créateur l'autorise
    if new.duet_of is not null or new.stitch_of is not null then
      select user_id, allow_duet into src from videos where id = coalesce(new.duet_of, new.stitch_of);
      if src.user_id is not null and src.user_id <> new.user_id and not src.allow_duet then
        raise exception 'Ce créateur n''autorise pas les Duos et Collages';
      end if;
    end if;
  else
    new.reply_to := old.reply_to; new.reply_text := old.reply_text;
    new.duet_of := old.duet_of; new.stitch_of := old.stitch_of;
  end if;
  return new;
end $$;
drop trigger if exists check_video_extra on public.videos;
create trigger check_video_extra before insert or update on public.videos for each row execute function public.check_video_extra();
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert with check (
  user_id = auth.uid() and exists (select 1 from public.videos v where v.id = video_id and (v.allow_comments or v.user_id = auth.uid()))
);
create or replace view public.videos_feed with (security_invoker = true) as
 SELECT v.id, v.user_id, v.video_url, v.title, v.caption, v.tags, v.sound, v.country, v.region, v.product_id, v.status, v.created_at,
    p.username, p.display_name, p.avatar_url,
    p.vip_until IS NOT NULL AND p.vip_until > now() AS is_vip,
    (( SELECT count(*) FROM likes l WHERE l.video_id = v.id))::integer AS like_count,
    (( SELECT count(*) FROM comments c WHERE c.video_id = v.id))::integer AS comment_count,
    (EXISTS ( SELECT 1 FROM likes l WHERE l.video_id = v.id AND l.user_id = auth.uid())) AS liked_by_me,
    (EXISTS ( SELECT 1 FROM saves s WHERE s.video_id = v.id AND s.user_id = auth.uid())) AS saved_by_me,
    (EXISTS ( SELECT 1 FROM follows f WHERE f.followee_id = v.user_id AND f.follower_id = auth.uid())) AS following,
    pr.name AS product_name, pr.price AS product_price, pr.currency AS product_currency,
    v.view_count, v.share_count,
    (( SELECT count(*) FROM reposts r WHERE r.video_id = v.id))::integer AS repost_count,
    (EXISTS ( SELECT 1 FROM reposts r WHERE r.video_id = v.id AND r.user_id = auth.uid())) AS reposted_by_me,
    CASE WHEN v.watch_n > 0 THEN round(v.watch_sum / v.watch_n::numeric, 3) ELSE 0.5 END AS completion,
    v.gift_coins,
    v.photos, v.allow_comments, v.allow_duet, v.allow_download, v.pinned_at, v.reply_to, v.reply_text, v.duet_of, v.stitch_of
   FROM videos v
     JOIN profiles p ON p.id = v.user_id
     LEFT JOIN products pr ON pr.id = v.product_id;
create table if not exists public.watch_history (
  user_id  uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  seen_at  timestamptz not null default now(),
  primary key (user_id, video_id)
);
create index if not exists watch_history_user_idx on public.watch_history (user_id, seen_at desc);
alter table public.watch_history enable row level security;
drop policy if exists wh_read on public.watch_history;
create policy wh_read on public.watch_history for select using (user_id = auth.uid());
drop policy if exists wh_ins on public.watch_history;
create policy wh_ins on public.watch_history for insert with check (user_id = auth.uid());
drop policy if exists wh_upd on public.watch_history;
create policy wh_upd on public.watch_history for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists wh_del on public.watch_history;
create policy wh_del on public.watch_history for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.watch_history to authenticated;
create or replace function public.creator_analytics(p_days int default 7) returns json
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); d int := least(greatest(coalesce(p_days, 7), 1), 60); since date; r json;
begin
  if me is null then raise exception 'auth'; end if;
  since := current_date - (d - 1);
  select json_build_object(
    'days', d,
    'views', (select count(*) from video_views where creator_id = me and day >= since),
    'prev_views', (select count(*) from video_views where creator_id = me and day >= since - d and day < since),
    'likes', (select count(*) from likes l join videos v on v.id = l.video_id where v.user_id = me and l.created_at >= since),
    'comments', (select count(*) from comments c join videos v on v.id = c.video_id where v.user_id = me and c.user_id <> me and c.created_at >= since),
    'followers_new', (select count(*) from follows where followee_id = me and created_at >= since),
    'followers', (select count(*) from follows where followee_id = me),
    'shares', (select coalesce(sum(share_count), 0) from videos where user_id = me),
    'gifts', (select coalesce(sum(gift_coins), 0) from videos where user_id = me),
    'completion', (select case when sum(watch_n) > 0 then round(sum(watch_sum) / sum(watch_n), 3) else null end from videos where user_id = me),
    'daily', (select coalesce(json_agg(json_build_object('d', g.day::date, 'v', coalesce(x.n, 0), 'f', coalesce(y.n, 0)) order by g.day), '[]'::json)
              from generate_series(since::timestamp, current_date::timestamp, interval '1 day') as g(day)
              left join (select day, count(*) n from video_views where creator_id = me and day >= since group by day) x on x.day = g.day::date
              left join (select created_at::date dd, count(*) n from follows where followee_id = me and created_at >= since group by 1) y on y.dd = g.day::date),
    'top', (select coalesce(json_agg(t), '[]'::json) from (
              select v.id, v.video_url, v.photos, v.title, v.caption, v.view_count,
                     (select count(*) from video_views w where w.video_id = v.id and w.day >= since) period_views,
                     (select count(*) from likes l where l.video_id = v.id) likes,
                     (select count(*) from comments c where c.video_id = v.id) comments,
                     case when v.watch_n > 0 then round(v.watch_sum / v.watch_n, 3) else null end completion
              from videos v where v.user_id = me and v.status = 'published'
              order by period_views desc, v.view_count desc limit 10) t)
  ) into r;
  return r;
end $$;
revoke all on function public.creator_analytics(int) from public, anon;
grant execute on function public.creator_analytics(int) to authenticated;

create or replace function public.search_tags(p_q text, p_limit int default 20) returns table(tag text, videos bigint)
language sql stable security definer set search_path = public as $$
  select t, count(*) from videos v, unnest(v.tags) t
  where v.status = 'published' and t ilike replace(replace(lower(coalesce(p_q, '')), '%', ''), '_', '\_') || '%'
  group by t order by 2 desc limit least(coalesce(p_limit, 20), 40);
$$;
grant execute on function public.search_tags(text, int) to anon, authenticated;

create or replace function public.search_sounds(p_q text, p_limit int default 20) returns table(sound text, videos bigint)
language sql stable security definer set search_path = public as $$
  select v.sound, count(*) from videos v
  where v.status = 'published' and coalesce(v.sound, '') <> '' and v.sound ilike '%' || replace(replace(coalesce(p_q, ''), '%', ''), '_', '\_') || '%'
  group by v.sound order by 2 desc limit least(coalesce(p_limit, 20), 40);
$$;
grant execute on function public.search_sounds(text, int) to anon, authenticated;
