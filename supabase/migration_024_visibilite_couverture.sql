-- Visibilité (Tout le monde / Amis / Moi uniquement) et couverture des vidéos, comme TikTok
alter table public.videos add column if not exists visibility text not null default 'public' check (visibility in ('public','friends','private'));
alter table public.videos add column if not exists cover_url text check (cover_url is null or length(cover_url) < 500);
-- check_video_cover : la couverture doit être dans images/<uid>/
-- videos_read : published + can_see_user + (public ou amis mutuels), ou propriétaire, ou admin
-- videos_feed : + visibility, cover_url (appliqué en production via MCP)
