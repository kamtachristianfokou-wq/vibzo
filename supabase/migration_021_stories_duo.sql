-- Vibzo · migration 021 : Stories 24 h, Duo et Collage
alter table public.videos add column if not exists duet_of uuid references public.videos(id) on delete set null;
alter table public.videos add column if not exists stitch_of uuid references public.videos(id) on delete set null;

create table if not exists public.stories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  media_url  text not null,
  caption    text not null default '' check (char_length(caption) <= 150),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours'
);
create index if not exists stories_user_idx on public.stories (user_id, expires_at desc);
alter table public.stories enable row level security;
create policy "stories read" on public.stories for select using (expires_at > now() or user_id = auth.uid() or public.is_admin());
create policy "stories insert" on public.stories for insert with check (user_id = auth.uid());
create policy "stories delete" on public.stories for delete using (user_id = auth.uid() or public.is_admin());

create or replace function public.protect_story() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if (select count(*) from stories where user_id = auth.uid() and created_at > now() - interval '1 day') >= 20 then
      raise exception 'Maximum 20 stories par jour';
    end if;
    new.created_at := now(); new.expires_at := now() + interval '24 hours';
    if new.media_url not like 'https://pcfebfknjtqtgkhctxll.supabase.co/storage/v1/object/public/videos/' || auth.uid() || '/%' then
      raise exception 'Fichier invalide';
    end if;
  end if;
  return new;
end $$;
revoke execute on function public.protect_story() from public, anon, authenticated;
create trigger protect_story before insert on public.stories for each row execute function public.protect_story();

create table if not exists public.story_views (
  story_id   uuid not null references public.stories(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);
alter table public.story_views enable row level security;
create policy "story views insert" on public.story_views for insert with check (user_id = auth.uid());
create policy "story views read" on public.story_views for select using (
  user_id = auth.uid() or exists (select 1 from stories s where s.id = story_id and s.user_id = auth.uid()));

create or replace view public.stories_feed with (security_invoker = true) as
SELECT s.id, s.user_id, s.media_url, s.caption, s.created_at, s.expires_at,
  p.username, p.display_name, p.avatar_url, p.verified,
  (s.user_id = auth.uid() OR EXISTS (SELECT 1 FROM follows f WHERE f.follower_id = auth.uid() AND f.followee_id = s.user_id)) AS mine_or_followed,
  EXISTS (SELECT 1 FROM story_views sv WHERE sv.story_id = s.id AND sv.user_id = auth.uid()) AS seen,
  CASE WHEN s.user_id = auth.uid() THEN (SELECT count(*) FROM story_views sv WHERE sv.story_id = s.id) END AS view_count
FROM stories s JOIN profiles p ON p.id = s.user_id
WHERE s.expires_at > now();
