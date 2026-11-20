-- 023a : réglages de sécurité du profil
alter table public.profiles add column if not exists is_private boolean not null default false;
alter table public.profiles add column if not exists dm_from text not null default 'all' check (dm_from in ('all','followers','mutual','none'));
alter table public.profiles add column if not exists comment_filter text[] not null default '{}';
alter table public.profiles add column if not exists filter_insults boolean not null default true;
alter table public.profiles add column if not exists birth_year int check (birth_year between 1900 and 2100);
grant select (is_private, dm_from) on public.profiles to anon, authenticated;

create or replace function public.is_minor(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select birth_year > extract(year from now())::int - 18 from profiles where id = p_user), false);
$$;
revoke all on function public.is_minor(uuid) from public, anon;
grant execute on function public.is_minor(uuid) to authenticated;

create or replace function public.protect_profile_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() and coalesce(current_setting('vibzo.system', true), '') <> '1' then
    new.role := old.role;
    new.vip_until := old.vip_until;
    new.created_at := old.created_at;
    new.verified := old.verified;
    new.verified_at := old.verified_at;
    if tg_op = 'UPDATE' then
      new.referred_by := old.referred_by;
      -- l'année de naissance ne se change plus une fois donnée
      if old.birth_year is not null then new.birth_year := old.birth_year; end if;
    end if;
  end if;
  -- protections automatiques des mineurs
  if new.birth_year is not null and new.birth_year > extract(year from now())::int - 18 then
    if tg_op = 'INSERT' then new.is_private := true;
    elsif old.birth_year is null then new.is_private := true; end if;
    if new.dm_from in ('all', 'followers') then new.dm_from := 'mutual'; end if;
  end if;
  if coalesce(array_length(new.comment_filter, 1), 0) > 50 then new.comment_filter := new.comment_filter[1:50]; end if;
  return new;
end $$;

create or replace function public.my_safety() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('is_private', is_private, 'dm_from', dm_from, 'comment_filter', comment_filter, 'filter_insults', filter_insults,
    'birth_year', birth_year, 'minor', coalesce(birth_year > extract(year from now())::int - 18, false))
  from profiles where id = auth.uid();
$$;
revoke all on function public.my_safety() from public, anon;
grant execute on function public.my_safety() to authenticated;

create or replace view public.profile_stats with (security_invoker = true) as
 SELECT id, username, display_name, bio, avatar_url, country, region, created_at,
    vip_until IS NOT NULL AND vip_until > now() AS is_vip,
    (( SELECT count(*) FROM follows f WHERE f.followee_id = p.id))::integer AS followers,
    (( SELECT count(*) FROM follows f WHERE f.follower_id = p.id))::integer AS following,
    (( SELECT count(*) FROM videos v WHERE v.user_id = p.id AND v.status = 'published'::text))::integer AS videos,
    (( SELECT count(*) FROM likes l JOIN videos v ON v.id = l.video_id WHERE v.user_id = p.id))::integer AS likes_received,
    (EXISTS ( SELECT 1 FROM follows f WHERE f.followee_id = p.id AND f.follower_id = auth.uid())) AS followed_by_me,
    instagram, tiktok, youtube,
    (( SELECT COALESCE(sum(v.view_count), 0::numeric) FROM videos v WHERE v.user_id = p.id AND v.status = 'published'::text))::bigint AS views,
    is_creator(id) AS is_creator,
    verified,
    is_private, dm_from
   FROM profiles p;
-- 023b : blocage
create table if not exists public.blocks (
  blocker_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index if not exists blocks_blocked_idx on public.blocks (blocked_id);
alter table public.blocks enable row level security;
drop policy if exists blocks_read on public.blocks;
create policy blocks_read on public.blocks for select using (blocker_id = auth.uid());
drop policy if exists blocks_ins on public.blocks;
create policy blocks_ins on public.blocks for insert with check (blocker_id = auth.uid());
drop policy if exists blocks_del on public.blocks;
create policy blocks_del on public.blocks for delete using (blocker_id = auth.uid());
grant select, insert, delete on public.blocks to authenticated;

create or replace function public.blocked_between(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select a is not null and b is not null and exists (select 1 from blocks where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a));
$$;
revoke all on function public.blocked_between(uuid, uuid) from public, anon;
grant execute on function public.blocked_between(uuid, uuid) to authenticated;

-- qui peut voir les publications d'une personne (compte privé, blocage)
create or replace function public.can_see_user(p_owner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select p_owner = auth.uid()
      or (not public.blocked_between(auth.uid(), p_owner)
          and (not coalesce((select is_private from profiles where id = p_owner), false)
               or exists (select 1 from follows where follower_id = auth.uid() and followee_id = p_owner)));
$$;
grant execute on function public.can_see_user(uuid) to anon, authenticated;
-- 023c : quand on bloque quelqu'un, les abonnements dans les deux sens disparaissent
create or replace function public.on_block() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform set_config('vibzo.system', '1', true);
  delete from follows where (follower_id = new.blocker_id and followee_id = new.blocked_id) or (follower_id = new.blocked_id and followee_id = new.blocker_id);
  return new;
end $$;
revoke execute on function public.on_block() from public, anon, authenticated;
drop trigger if exists on_block on public.blocks;
create trigger on_block after insert on public.blocks for each row execute function public.on_block();
-- 023d : politiques mises à jour (comptes privés, blocage)
drop policy if exists videos_read on public.videos;
create policy videos_read on public.videos for select using (
  (status = 'published' and public.can_see_user(user_id)) or user_id = auth.uid() or public.is_admin()
);
drop policy if exists "stories read" on public.stories;
create policy "stories read" on public.stories for select using (
  (expires_at > now() and public.can_see_user(user_id)) or user_id = auth.uid() or public.is_admin()
);
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert with check (
  user_id = auth.uid() and exists (select 1 from public.videos v where v.id = video_id and (v.allow_comments or v.user_id = auth.uid()) and not public.blocked_between(auth.uid(), v.user_id))
);
drop policy if exists follows_insert on public.follows;
create policy follows_insert on public.follows for insert with check (
  follower_id = auth.uid() and not public.blocked_between(auth.uid(), followee_id)
  and not coalesce((select p.is_private from public.profiles p where p.id = followee_id), false)
);
create or replace function public.conv_blocked(p_conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from conversation_members m where m.conversation_id = p_conv and m.user_id <> auth.uid() and public.blocked_between(auth.uid(), m.user_id));
$$;
revoke all on function public.conv_blocked(uuid) from public, anon;
grant execute on function public.conv_blocked(uuid) to authenticated;
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert with check (
  sender_id = auth.uid() and public.is_member(conversation_id) and not public.conv_blocked(conversation_id)
);
-- 023e : messages privés selon les réglages, demandes d'abonnement
create or replace function public.start_conversation(p_other uuid, p_kind text default 'dm', p_title text default '', p_ref uuid default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare cid uuid; rule text; i_follow boolean; they_follow boolean;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  if p_other = auth.uid() then raise exception 'Impossible de s''écrire à soi-même'; end if;
  select dm_from into rule from profiles where id = p_other;
  if rule is null then raise exception 'Utilisateur introuvable'; end if;
  if public.blocked_between(auth.uid(), p_other) then raise exception 'Tu ne peux pas écrire à cette personne'; end if;
  select c.id into cid from conversations c
   where c.kind = p_kind and c.ref_id is not distinct from p_ref
     and exists (select 1 from conversation_members m where m.conversation_id = c.id and m.user_id = auth.uid())
     and exists (select 1 from conversation_members m where m.conversation_id = c.id and m.user_id = p_other)
   limit 1;
  if cid is null then
    if p_kind = 'dm' and not public.is_admin() then
      i_follow := exists (select 1 from follows where follower_id = auth.uid() and followee_id = p_other);
      they_follow := exists (select 1 from follows where follower_id = p_other and followee_id = auth.uid());
      if public.is_minor(p_other) and rule = 'all' then rule := 'mutual'; end if;
      if public.is_minor(auth.uid()) and not (i_follow and they_follow) then raise exception 'Pour ta sécurité, tu peux écrire seulement à tes amis (abonnés mutuels)'; end if;
      if rule = 'none' then raise exception 'Cette personne ne reçoit pas de messages privés'; end if;
      if rule = 'followers' and not i_follow then raise exception 'Abonne-toi à cette personne pour lui écrire'; end if;
      if rule = 'mutual' and not (i_follow and they_follow) then raise exception 'Cette personne accepte seulement les messages de ses amis (abonnés mutuels)'; end if;
    end if;
    insert into conversations (kind, title, ref_id) values (p_kind, left(coalesce(p_title, ''), 120), p_ref) returning id into cid;
    insert into conversation_members (conversation_id, user_id, last_read_at) values (cid, auth.uid(), now()), (cid, p_other, 'epoch');
  end if;
  return cid;
end $$;

create table if not exists public.follow_requests (
  requester_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (requester_id, target_id), check (requester_id <> target_id)
);
create index if not exists follow_requests_target_idx on public.follow_requests (target_id, created_at desc);
alter table public.follow_requests enable row level security;
drop policy if exists fr_read on public.follow_requests;
create policy fr_read on public.follow_requests for select using (requester_id = auth.uid() or target_id = auth.uid());
drop policy if exists fr_ins on public.follow_requests;
create policy fr_ins on public.follow_requests for insert with check (requester_id = auth.uid() and not public.blocked_between(auth.uid(), target_id));
drop policy if exists fr_del on public.follow_requests;
create policy fr_del on public.follow_requests for delete using (requester_id = auth.uid() or target_id = auth.uid());
grant select, insert, delete on public.follow_requests to authenticated;

alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (type = any (array['like','comment','reply','follow','mention','repost','comment_like','referral','system','gift','wallet','match','order','order_status','application','offer_ok','live','review','verified','service','challenge','follow_request','sound','login']));
alter table public.reports drop constraint if exists reports_target_type_check;
alter table public.reports add constraint reports_target_type_check check (target_type = any (array['video','comment','profile','job','shop','product','message','dating','live','service','challenge','sound']));

create or replace function public.on_follow_request() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.notify(new.target_id, new.requester_id, 'follow_request', null, null, 'veut s’abonner à ton compte privé');
  return new;
end $$;
revoke execute on function public.on_follow_request() from public, anon, authenticated;
drop trigger if exists on_follow_request on public.follow_requests;
create trigger on_follow_request after insert on public.follow_requests for each row execute function public.on_follow_request();

create or replace function public.respond_follow(p_requester uuid, p_ok boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from follow_requests where requester_id = p_requester and target_id = auth.uid()) then raise exception 'Demande introuvable'; end if;
  perform set_config('vibzo.system', '1', true);
  delete from follow_requests where requester_id = p_requester and target_id = auth.uid();
  if p_ok and not public.blocked_between(auth.uid(), p_requester) then
    insert into follows (follower_id, followee_id) values (p_requester, auth.uid()) on conflict do nothing;
  end if;
end $$;
revoke all on function public.respond_follow(uuid, boolean) from public, anon;
grant execute on function public.respond_follow(uuid, boolean) to authenticated;
-- 023f : filtre des commentaires, cadeaux réservés aux majeurs, alerte de connexion
create or replace function public.filter_comment() returns trigger
language plpgsql security definer set search_path = public as $$
declare owner uuid; fw text[]; ins boolean; b text := lower(new.body); w text;
begin
  select v.user_id into owner from videos v where v.id = new.video_id;
  if owner is null or owner = new.user_id then return new; end if;
  select comment_filter, filter_insults into fw, ins from profiles where id = owner;
  if ins and b ~* '(^|[^[:alnum:]])(connard|connasse|salope|pute|putain de|enculé|encule|batard|bâtard|fdp|ntm|nique ta|fils de pute|abruti|imbécile|fuck|bitch|asshole|motherfucker|nigga|nigger|whore|slut|cunt|pédé|pd)([^[:alnum:]]|$)' then
    raise exception 'Ce commentaire contient des insultes et a été bloqué';
  end if;
  foreach w in array coalesce(fw, '{}') loop
    if length(trim(w)) >= 2 and position(lower(trim(w)) in b) > 0 then
      raise exception 'Ce commentaire contient un mot filtré par le créateur';
    end if;
  end loop;
  return new;
end $$;
revoke execute on function public.filter_comment() from public, anon, authenticated;
drop trigger if exists filter_comment on public.comments;
create trigger filter_comment before insert on public.comments for each row execute function public.filter_comment();

create or replace function public.gifts_adults_only() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.is_minor(new.from_id) then raise exception 'Les cadeaux sont réservés aux personnes de 18 ans et plus'; end if;
  if public.is_minor(new.to_id) then raise exception 'Cette personne ne peut pas recevoir de cadeaux'; end if;
  return new;
end $$;
revoke execute on function public.gifts_adults_only() from public, anon, authenticated;
drop trigger if exists gifts_adults_only on public.gifts;
create trigger gifts_adults_only before insert on public.gifts for each row execute function public.gifts_adults_only();

create table if not exists public.login_devices (
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_key text not null check (char_length(device_key) between 8 and 64),
  label text not null default '' check (char_length(label) <= 80),
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  primary key (user_id, device_key)
);
alter table public.login_devices enable row level security;
drop policy if exists ld_read on public.login_devices;
create policy ld_read on public.login_devices for select using (user_id = auth.uid());
drop policy if exists ld_del on public.login_devices;
create policy ld_del on public.login_devices for delete using (user_id = auth.uid());
grant select, delete on public.login_devices to authenticated;

create or replace function public.register_device(p_key text, p_label text) returns boolean
language plpgsql security definer set search_path = public as $$
declare known int; fresh boolean;
begin
  if auth.uid() is null then return false; end if;
  select count(*) into known from login_devices where user_id = auth.uid();
  insert into login_devices (user_id, device_key, label) values (auth.uid(), left(p_key, 64), left(coalesce(p_label, ''), 80))
  on conflict (user_id, device_key) do update set last_seen = now(), label = excluded.label
  returning (xmax = 0) into fresh;
  -- nouvel appareil sur un compte qui en avait déjà : on prévient la personne
  if fresh and known > 0 then
    perform public.notify(auth.uid(), null, 'login', null, null, 'Nouvelle connexion : ' || left(coalesce(nullif(p_label, ''), 'appareil inconnu'), 50) || '. Pas toi ? Change ton mot de passe.');
  end if;
  return fresh and known > 0;
end $$;
revoke all on function public.register_device(text, text) from public, anon;
grant execute on function public.register_device(text, text) to authenticated;
-- 023g : Vibzo Sons (bibliothèque musicale des artistes)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sounds', 'sounds', true, 15728640, array['audio/mpeg','audio/mp3','audio/mp4','audio/x-m4a','audio/aac','audio/wav','audio/x-wav','audio/ogg','audio/webm','image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
drop policy if exists "vibzo sounds read" on storage.objects;
create policy "vibzo sounds read" on storage.objects for select using (bucket_id = 'sounds');
drop policy if exists "vibzo sounds upload" on storage.objects;
create policy "vibzo sounds upload" on storage.objects for insert to authenticated with check (
  bucket_id = 'sounds' and (storage.foldername(name))[1] = auth.uid()::text
  and (select count(*) from storage.objects o where o.bucket_id = 'sounds' and (storage.foldername(o.name))[1] = auth.uid()::text and o.created_at > now() - interval '1 day') < 20
);
drop policy if exists "vibzo sounds delete" on storage.objects;
create policy "vibzo sounds delete" on storage.objects for delete to authenticated using (bucket_id = 'sounds' and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.sounds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 60),
  artist text not null check (char_length(artist) between 2 and 60),
  genre text not null default '' check (char_length(genre) <= 30),
  country text,
  audio_url text not null,
  cover_url text,
  duration int check (duration between 3 and 600),
  rights_confirmed boolean not null default false check (rights_confirmed),
  status text not null default 'pending' check (status in ('pending','active','rejected','removed')),
  uses int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists sounds_status_idx on public.sounds (status, uses desc);
alter table public.sounds enable row level security;
drop policy if exists sounds_read on public.sounds;
create policy sounds_read on public.sounds for select using (status = 'active' or owner_id = auth.uid() or public.is_admin());
drop policy if exists sounds_ins on public.sounds;
create policy sounds_ins on public.sounds for insert with check (owner_id = auth.uid());
drop policy if exists sounds_upd on public.sounds;
create policy sounds_upd on public.sounds for update using (owner_id = auth.uid() or public.is_admin());
drop policy if exists sounds_del on public.sounds;
create policy sounds_del on public.sounds for delete using (owner_id = auth.uid() or public.is_admin());
grant select, insert, update, delete on public.sounds to authenticated;
grant select on public.sounds to anon;

create or replace function public.protect_sound() returns trigger
language plpgsql security definer set search_path = public as $$
declare pre text;
begin
  if coalesce(current_setting('vibzo.system', true), '') = '1' or public.is_admin() then return new; end if;
  pre := 'https://pcfebfknjtqtgkhctxll.supabase.co/storage/v1/object/public/sounds/' || new.owner_id::text || '/';
  if tg_op = 'INSERT' then
    new.status := 'pending'; new.uses := 0; new.created_at := now();
    if (select count(*) from sounds where owner_id = new.owner_id and created_at > now() - interval '1 day') >= 10 then raise exception 'Maximum 10 sons par jour'; end if;
  else
    new.owner_id := old.owner_id; new.uses := old.uses; new.created_at := old.created_at;
    -- l'artiste peut retirer son son, mais pas l'approuver lui-même
    if new.status <> old.status and not (new.status = 'removed') then new.status := old.status; end if;
    if new.audio_url <> old.audio_url then new.status := 'pending'; end if;
  end if;
  if left(new.audio_url, length(pre)) <> pre or (new.cover_url is not null and left(new.cover_url, length(pre)) <> pre) then raise exception 'Fichier invalide'; end if;
  return new;
end $$;
revoke execute on function public.protect_sound() from public, anon, authenticated;
drop trigger if exists protect_sound on public.sounds;
create trigger protect_sound before insert or update on public.sounds for each row execute function public.protect_sound();

alter table public.videos add column if not exists sound_id uuid references public.sounds(id) on delete set null;
create index if not exists videos_sound_id_idx on public.videos (sound_id) where sound_id is not null;

create or replace function public.count_sound_use() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.sound_id is not null then
    if not exists (select 1 from sounds where id = new.sound_id and (status = 'active' or owner_id = new.user_id)) then new.sound_id := null; return new; end if;
    perform set_config('vibzo.system', '1', true);
    update sounds set uses = uses + 1 where id = new.sound_id;
    perform set_config('vibzo.system', '', true);
  end if;
  return new;
end $$;
revoke execute on function public.count_sound_use() from public, anon, authenticated;
drop trigger if exists count_sound_use on public.videos;
create trigger count_sound_use before insert on public.videos for each row execute function public.count_sound_use();

create or replace view public.sounds_view with (security_invoker = true) as
  select s.*, p.username, p.display_name, p.avatar_url, p.verified
  from sounds s join profiles p on p.id = s.owner_id;
grant select on public.sounds_view to anon, authenticated;

create or replace function public.admin_sound_decide(p_id uuid, p_status text) returns void
language plpgsql security definer set search_path = public as $$
declare o uuid; t text;
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  if p_status not in ('active','rejected','removed') then raise exception 'Statut invalide'; end if;
  update sounds set status = p_status where id = p_id returning owner_id, title into o, t;
  if o is not null then
    perform public.notify(o, null, 'sound', null, null, case p_status when 'active' then '🎵 Ton son « ' || t || ' » est en ligne dans Vibzo Sons' when 'rejected' then 'Ton son « ' || t || ' » a été refusé (droits ou qualité)' else 'Ton son « ' || t || ' » a été retiré' end);
  end if;
end $$;
revoke all on function public.admin_sound_decide(uuid, text) from public, anon;
grant execute on function public.admin_sound_decide(uuid, text) to authenticated;

-- 023h/i : videos_feed expose sound_id ; helpers de confidentialité
-- (videos_feed recréée avec la colonne sound_id en fin de liste, voir migration 022 pour la définition)
create or replace function public.blocked_between(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select a is not null and b is not null and auth.uid() in (a, b)
     and exists (select 1 from blocks where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a));
$$;
revoke execute on function public.is_minor(uuid) from authenticated;
