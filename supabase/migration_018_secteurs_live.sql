-- Vibzo · migration 018 : notifications pour toutes les sections + LIVE
-- Notifications : nouveau match, nouvelle commande, suivi de commande, nouvelle candidature, offre validée, live d'un créateur suivi.
-- Live : un membre (compte confirmé) lance un direct ; spectateurs, cœurs, cadeaux (même règle que les vidéos), fin automatique
-- si l'animateur disparaît, l'admin peut couper un live, les lives peuvent être signalés.

-- ---------- types de notification ----------
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (type in
  ('like','comment','reply','follow','mention','repost','comment_like','referral','system','gift','wallet',
   'match','order','order_status','application','offer_ok','live'));
alter table public.notifications add column if not exists ref_id uuid;

-- notify() avec une référence libre (commande, offre, live…)
create or replace function public.notify_ref(p_user uuid, p_actor uuid, p_type text, p_ref uuid, p_body text)
returns void language sql security definer set search_path = public as $$
  insert into notifications (user_id, actor_id, type, ref_id, body)
  select p_user, p_actor, p_type, p_ref, left(coalesce(p_body, ''), 140)
  where p_user is not null and p_user is distinct from p_actor;
$$;
revoke execute on function public.notify_ref(uuid, uuid, text, uuid, text) from public, anon, authenticated;

create or replace view public.notifications_view with (security_invoker = true) as
SELECT n.id, n.user_id, n.actor_id, n.type, n.video_id, n.comment_id, n.body, n.read, n.created_at,
  a.username AS actor_username, a.display_name AS actor_name, a.avatar_url AS actor_avatar, v.video_url, n.ref_id
FROM notifications n LEFT JOIN profiles a ON a.id = n.actor_id LEFT JOIN videos v ON v.id = n.video_id;

create or replace function public.trg_notify_sectors() returns trigger
language plpgsql security definer set search_path = public as $$
declare owner uuid; t text; lbl text;
begin
  if tg_table_name = 'dating_matches' then
    perform public.notify_ref(new.user_a, new.user_b, 'match', new.conversation_id, '💘 Nouveau match ! Écris-lui un message.');
    perform public.notify_ref(new.user_b, new.user_a, 'match', new.conversation_id, '💘 Nouveau match ! Écris-lui un message.');
  elsif tg_table_name = 'orders' then
    select owner_id into owner from shops where id = new.shop_id;
    if tg_op = 'INSERT' then
      perform public.notify_ref(owner, new.buyer_id, 'order', new.id, '🛍️ Nouvelle commande : ' || new.product_name || ' × ' || new.quantity);
      return new;
    end if;
    if new.status is not distinct from old.status then return new; end if;
    lbl := case new.status when 'confirmed' then 'confirmée ✅' when 'shipped' then 'expédiée 🚚' when 'delivered' then 'livrée 📦' when 'cancelled' then 'annulée' else new.status end;
    if auth.uid() is not distinct from new.buyer_id then
      perform public.notify_ref(owner, new.buyer_id, 'order_status', new.id, 'Commande « ' || new.product_name || ' » ' || lbl || ' par le client');
    else
      perform public.notify_ref(new.buyer_id, owner, 'order_status', new.id, 'Ta commande « ' || new.product_name || ' » est ' || lbl);
    end if;
  elsif tg_table_name = 'applications' then
    select user_id, title into owner, t from job_offers where id = new.offer_id;
    perform public.notify_ref(owner, new.user_id, 'application', new.offer_id, '💼 Nouvelle candidature pour « ' || t || ' »');
  elsif tg_table_name = 'job_offers' then
    if new.status = 'open' and old.status is distinct from 'open' then perform public.notify_ref(new.user_id, null, 'offer_ok', new.id, '✅ Ton offre « ' || new.title || ' » est en ligne'); end if;
  end if;
  return new;
end $$;
revoke execute on function public.trg_notify_sectors() from public, anon, authenticated;
drop trigger if exists notify_match on public.dating_matches;
create trigger notify_match after insert on public.dating_matches for each row execute function public.trg_notify_sectors();
drop trigger if exists notify_order on public.orders;
create trigger notify_order after insert or update of status on public.orders for each row execute function public.trg_notify_sectors();
drop trigger if exists notify_application on public.applications;
create trigger notify_application after insert on public.applications for each row execute function public.trg_notify_sectors();
drop trigger if exists notify_offer_ok on public.job_offers;
create trigger notify_offer_ok after update of status on public.job_offers for each row execute function public.trg_notify_sectors();

-- ---------- LIVE ----------
create table if not exists public.lives (
  id           uuid primary key default gen_random_uuid(),
  host_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null default '' check (char_length(title) <= 80),
  status       text not null default 'live' check (status in ('live','ended')),
  country      text,
  region       text,
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  last_seen    timestamptz not null default now(),
  viewers      integer not null default 0,
  peak_viewers integer not null default 0,
  likes        bigint not null default 0,
  gift_coins   bigint not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists lives_status_idx on public.lives (status, last_seen desc);
alter table public.lives enable row level security;
drop policy if exists "lives read" on public.lives;
create policy "lives read" on public.lives for select using (true);

alter table public.gifts add column if not exists live_id uuid references public.lives(id) on delete set null;

create or replace view public.lives_now with (security_invoker = true) as
SELECT l.id, l.host_id, l.title, l.country, l.region, l.started_at, l.viewers, l.likes, l.gift_coins,
  p.username, p.display_name, p.avatar_url,
  EXISTS (SELECT 1 FROM follows f WHERE f.followee_id = l.host_id AND f.follower_id = auth.uid()) AS following
FROM lives l JOIN profiles p ON p.id = l.host_id
WHERE l.status = 'live' AND l.last_seen > now() - interval '45 seconds';

create or replace function public.start_live(p_title text) returns uuid
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); lid uuid; pr profiles;
begin
  if me is null then raise exception 'Connecte-toi d’abord'; end if;
  if not public.is_real_account(me) then raise exception 'Confirme ton adresse e-mail pour lancer un live'; end if;
  if (select count(*) from lives where host_id = me and started_at > now() - interval '1 day') >= 10 then
    raise exception 'Tu as déjà lancé 10 lives aujourd’hui, réessaie demain';
  end if;
  update lives set status = 'ended', ended_at = now() where host_id = me and status = 'live';
  select * into pr from profiles where id = me;
  insert into lives (host_id, title, country, region) values (me, left(coalesce(trim(p_title), ''), 80), pr.country, pr.region) returning id into lid;
  insert into notifications (user_id, actor_id, type, ref_id, body)
  select f.follower_id, me, 'live', lid, '🔴 est en direct' || case when coalesce(trim(p_title), '') <> '' then ' : ' || left(trim(p_title), 80) else '' end
  from follows f where f.followee_id = me limit 1000;
  return lid;
end $$;
revoke execute on function public.start_live(text) from public, anon;
grant execute on function public.start_live(text) to authenticated;

create or replace function public.live_ping(p_live uuid, p_viewers integer) returns void
language sql security definer set search_path = public as $$
  update lives set last_seen = now(), viewers = greatest(0, least(coalesce(p_viewers, 0), 100000)),
         peak_viewers = greatest(peak_viewers, least(coalesce(p_viewers, 0), 100000))
  where id = p_live and host_id = auth.uid() and status = 'live';
$$;
revoke execute on function public.live_ping(uuid, integer) from public, anon;
grant execute on function public.live_ping(uuid, integer) to authenticated;

create or replace function public.end_live(p_live uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update lives set status = 'ended', ended_at = now()
  where id = p_live and status = 'live' and (host_id = auth.uid() or public.is_admin());
  if not found then raise exception 'Live introuvable ou déjà terminé'; end if;
end $$;
revoke execute on function public.end_live(uuid) from public, anon;
grant execute on function public.end_live(uuid) to authenticated;

create or replace function public.live_like(p_live uuid, p_n integer) returns void
language sql security definer set search_path = public as $$
  update lives set likes = likes + greatest(1, least(coalesce(p_n, 1), 30)) where id = p_live and status = 'live' and auth.uid() is not null;
$$;
revoke execute on function public.live_like(uuid, integer) from public, anon;
grant execute on function public.live_like(uuid, integer) to authenticated;

create or replace function public.send_gift_live(p_live uuid, p_gift text) returns integer
language plpgsql security definer set search_path = public as $$
declare price int := public.gift_price(p_gift); host uuid; left_coins int;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  if price is null then raise exception 'Cadeau inconnu'; end if;
  select host_id into host from lives where id = p_live and status = 'live' and last_seen > now() - interval '45 seconds';
  if host is null then raise exception 'Ce live est terminé'; end if;
  if host = auth.uid() then raise exception 'Tu ne peux pas t’offrir un cadeau à toi-même'; end if;
  update wallets set coins = coins - price, updated_at = now() where user_id = auth.uid() and coins >= price returning coins into left_coins;
  if not found then raise exception 'Solde insuffisant'; end if;
  insert into wallets (user_id, earned, total_received) values (host, price, price)
    on conflict (user_id) do update set earned = wallets.earned + price, total_received = wallets.total_received + price, updated_at = now();
  insert into gifts (from_id, to_id, live_id, gift, coins) values (auth.uid(), host, p_live, p_gift, price);
  update lives set gift_coins = gift_coins + price where id = p_live;
  return left_coins;
end $$;
revoke execute on function public.send_gift_live(uuid, text) from public, anon;
grant execute on function public.send_gift_live(uuid, text) to authenticated;

create or replace function public.live_top_gifters(p_live uuid) returns table (username text, coins bigint)
language sql stable security definer set search_path = public as $$
  select p.username, sum(g.coins) from gifts g join profiles p on p.id = g.from_id
  where g.live_id = p_live group by p.username order by 2 desc limit 3;
$$;
grant execute on function public.live_top_gifters(uuid) to anon, authenticated;

-- signalement d'un live
alter table public.reports drop constraint if exists reports_target_type_check;
alter table public.reports add constraint reports_target_type_check check (target_type = any (array
  ['video','comment','profile','job','shop','product','message','dating','live']));

-- lives terminés automatiquement s'ils ne donnent plus signe de vie (nettoyage à chaque lancement)
create or replace function public.close_stale_lives() returns void
language sql security definer set search_path = public as $$
  update lives set status = 'ended', ended_at = coalesce(ended_at, last_seen)
  where status = 'live' and last_seen < now() - interval '2 minutes';
$$;
revoke execute on function public.close_stale_lives() from public, anon, authenticated;
create or replace function public.trg_close_stale() returns trigger language plpgsql security definer set search_path = public as $$
begin perform public.close_stale_lives(); return new; end $$;
revoke execute on function public.trg_close_stale() from public, anon, authenticated;
drop trigger if exists close_stale_on_start on public.lives;
create trigger close_stale_on_start after insert on public.lives for each statement execute function public.trg_close_stale();
