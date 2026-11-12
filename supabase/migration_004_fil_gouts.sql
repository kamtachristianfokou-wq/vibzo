-- Vibzo · migration 004 : fil « Pour toi » selon les goûts, tous pays confondus
-- Le fil montre les vidéos de tous les pays et classe en premier celles qui
-- ressemblent à ce que l'utilisateur aime : créateurs suivis, créateurs dont il a
-- aimé ou enregistré des vidéos, mêmes #hashtags, puis un léger bonus pour son pays.

create or replace function public.feed(p_countries text[] default null, p_region text default null,
                                       p_mode text default 'pour', p_limit int default 15, p_offset int default 0)
returns setof public.videos_feed language sql stable as $$
  with liked as (
    select v.user_id, v.tags
      from public.videos v
     where v.id in (select video_id from public.likes where user_id = auth.uid()
                    union select video_id from public.saves where user_id = auth.uid())
  ),
  fav_creators as (select distinct user_id from liked),
  fav_tags as (select distinct lower(t) as tag from liked, unnest(liked.tags) t),
  my_country as (select country from public.profiles where id = auth.uid())
  select f.* from public.videos_feed f
  where f.status = 'published'
    and (p_mode <> 'abo' or f.following or f.user_id = auth.uid())
    and (p_mode = 'abo' or p_countries is null or f.country = any (p_countries))
    and (p_mode = 'abo' or p_region is null or f.region = p_region)
  order by case when p_mode = 'abo' then extract(epoch from f.created_at)
                else (f.like_count * 2 + f.comment_count * 3 + 1)
                     / power(extract(epoch from (now() - f.created_at)) / 3600 + 2, 1.3)
                     * (1
                        + case when f.following then 2 else 0 end
                        + case when f.user_id in (select user_id from fav_creators) then 1.5 else 0 end
                        + least(1.5, 0.5 * (select count(*) from unnest(f.tags) t
                                             where lower(t) in (select tag from fav_tags)))
                        + case when f.country = (select country from my_country) then 0.3 else 0 end)
           end desc,
           f.created_at desc
  limit least(p_limit, 50) offset p_offset;
$$;
