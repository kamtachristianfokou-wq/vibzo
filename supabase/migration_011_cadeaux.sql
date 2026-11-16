-- Vibzo · migration 011 : cadeaux virtuels et retraits Mobile Money
-- 1 pièce = 10 FCFA (ou 0,03 ₼). Le créateur reçoit 80 % (8 FCFA par pièce reçue), Vibzo garde 20 %.
-- Achat de pièces : demande dans l'appli → paiement Mobile Money / virement → l'admin valide → pièces créditées.
-- Retrait : à partir de 500 pièces reçues → demande → l'admin paie en Mobile Money → marque « payé ».

create table if not exists public.wallets (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  coins          integer not null default 0 check (coins >= 0),          -- pièces achetées, à offrir
  earned         integer not null default 0 check (earned >= 0),         -- pièces reçues en cadeaux, retirables
  pending_out    integer not null default 0 check (pending_out >= 0),    -- pièces en cours de retrait
  total_received integer not null default 0,
  updated_at     timestamptz not null default now()
);
alter table public.wallets enable row level security;
drop policy if exists "wallet own" on public.wallets;
create policy "wallet own" on public.wallets for select using (user_id = auth.uid() or public.is_admin());

create table if not exists public.coin_purchases (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  coins      integer not null check (coins > 0),
  price      numeric not null,
  currency   text not null,
  payment    text not null default '',
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
alter table public.coin_purchases enable row level security;
drop policy if exists "coin purchases own" on public.coin_purchases;
create policy "coin purchases own" on public.coin_purchases for select using (user_id = auth.uid() or public.is_admin());

create table if not exists public.gifts (
  id         uuid primary key default gen_random_uuid(),
  from_id    uuid not null references public.profiles(id) on delete cascade,
  to_id      uuid not null references public.profiles(id) on delete cascade,
  video_id   uuid references public.videos(id) on delete set null,
  gift       text not null,
  coins      integer not null check (coins > 0),
  created_at timestamptz not null default now()
);
create index if not exists gifts_video_idx on public.gifts (video_id);
create index if not exists gifts_to_idx on public.gifts (to_id, created_at desc);
alter table public.gifts enable row level security;
drop policy if exists "gifts read" on public.gifts;
create policy "gifts read" on public.gifts for select using (true);

create table if not exists public.withdrawals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  coins      integer not null check (coins > 0),
  amount     numeric not null,
  currency   text not null,
  method     text not null,
  number     text not null,
  status     text not null default 'pending' check (status in ('pending','paid','rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
alter table public.withdrawals enable row level security;
drop policy if exists "withdrawals own" on public.withdrawals;
create policy "withdrawals own" on public.withdrawals for select using (user_id = auth.uid() or public.is_admin());

alter table public.videos add column if not exists gift_coins bigint not null default 0;

-- Notifications : nouveaux types « gift » et « wallet »
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check
  check (type in ('like','comment','reply','follow','mention','repost','comment_like','referral','system','gift','wallet'));

-- Catalogue (source de vérité côté serveur)
create or replace function public.gift_price(p_gift text) returns integer language sql immutable as $$
  select case p_gift when 'rose' then 1 when 'coeur' then 5 when 'feu' then 10 when 'lion' then 50
                     when 'couronne' then 100 when 'fusee' then 500 when 'chateau' then 1000 end;
$$;
create or replace function public.gift_label(p_gift text) returns text language sql immutable as $$
  select case p_gift when 'rose' then '🌹 Rose' when 'coeur' then '❤️ Cœur' when 'feu' then '🔥 Feu' when 'lion' then '🦁 Lion'
                     when 'couronne' then '👑 Couronne' when 'fusee' then '🚀 Fusée' when 'chateau' then '🏰 Château' end;
$$;
-- Monnaie d'un utilisateur : manat en Azerbaïdjan, FCFA ailleurs
create or replace function public.wallet_currency(p_user uuid) returns text language sql stable security definer set search_path = public as $$
  select case when (select country from profiles where id = p_user) = 'AZ' then '₼' else 'FCFA' end;
$$;

create or replace function public.my_wallet() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'coins', coalesce(w.coins, 0), 'earned', coalesce(w.earned, 0), 'pending_out', coalesce(w.pending_out, 0),
    'total_received', coalesce(w.total_received, 0), 'currency', public.wallet_currency(auth.uid()),
    'rate', case when public.wallet_currency(auth.uid()) = '₼' then 0.024 else 8 end, 'min_out', 500,
    'pending_buy', (select count(*) from coin_purchases where user_id = auth.uid() and status = 'pending'))
  from (select 1) x left join wallets w on w.user_id = auth.uid();
$$;
grant execute on function public.my_wallet() to authenticated;

-- Demande d'achat de pièces (le prix est calculé ici, pas dans l'appli)
create or replace function public.request_coins(p_coins integer, p_payment text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare cur text := public.wallet_currency(auth.uid()); pr numeric; r coin_purchases;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  pr := case cur when '₼' then case p_coins when 100 then 3 when 500 then 15 when 1050 then 30 when 5500 then 150 end
                 else case p_coins when 100 then 1000 when 500 then 5000 when 1050 then 10000 when 5500 then 50000 end end;
  if pr is null then raise exception 'Pack inconnu'; end if;
  if (select count(*) from coin_purchases where user_id = auth.uid() and status = 'pending') >= 3 then
    raise exception 'Tu as déjà 3 demandes en attente. Envoie la preuve de paiement sur WhatsApp.';
  end if;
  insert into coin_purchases (user_id, coins, price, currency, payment) values (auth.uid(), p_coins, pr, cur, left(coalesce(p_payment, ''), 60)) returning * into r;
  return jsonb_build_object('id', r.id, 'coins', r.coins, 'price', r.price, 'currency', r.currency);
end $$;
revoke execute on function public.request_coins(integer, text) from public, anon;
grant execute on function public.request_coins(integer, text) to authenticated;

-- Envoyer un cadeau sur une vidéo
create or replace function public.send_gift(p_video uuid, p_gift text) returns integer
language plpgsql security definer set search_path = public as $$
declare price int := public.gift_price(p_gift); owner uuid; left_coins int;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  if price is null then raise exception 'Cadeau inconnu'; end if;
  select user_id into owner from videos where id = p_video and status = 'published';
  if owner is null then raise exception 'Vidéo indisponible'; end if;
  if owner = auth.uid() then raise exception 'Tu ne peux pas t’offrir un cadeau à toi-même'; end if;
  update wallets set coins = coins - price, updated_at = now() where user_id = auth.uid() and coins >= price returning coins into left_coins;
  if not found then raise exception 'Solde insuffisant'; end if;
  insert into wallets (user_id, earned, total_received) values (owner, price, price)
    on conflict (user_id) do update set earned = wallets.earned + price, total_received = wallets.total_received + price, updated_at = now();
  insert into gifts (from_id, to_id, video_id, gift, coins) values (auth.uid(), owner, p_video, p_gift, price);
  update videos set gift_coins = gift_coins + price where id = p_video;
  perform public.notify(owner, auth.uid(), 'gift', p_video, null, public.gift_label(p_gift) || ' (+' || price || ' pièces)');
  return left_coins;
end $$;
revoke execute on function public.send_gift(uuid, text) from public, anon;
grant execute on function public.send_gift(uuid, text) to authenticated;

-- Meilleurs donateurs d'une vidéo
create or replace function public.video_top_gifters(p_video uuid) returns table (user_id uuid, username text, avatar_url text, coins bigint)
language sql stable security definer set search_path = public as $$
  select g.from_id, p.username, p.avatar_url, sum(g.coins) from gifts g join profiles p on p.id = g.from_id
  where g.video_id = p_video group by g.from_id, p.username, p.avatar_url order by 4 desc limit 3;
$$;
grant execute on function public.video_top_gifters(uuid) to anon, authenticated;

-- Demande de retrait (Mobile Money ou virement)
create or replace function public.request_withdrawal(p_method text, p_number text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare w wallets; cur text := public.wallet_currency(auth.uid()); amt numeric;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  if char_length(coalesce(trim(p_number), '')) < 6 then raise exception 'Numéro de paiement invalide'; end if;
  select * into w from wallets where user_id = auth.uid() for update;
  if w.user_id is null or w.earned < 500 then raise exception 'Il faut au moins 500 pièces reçues pour retirer'; end if;
  if exists (select 1 from withdrawals where user_id = auth.uid() and status = 'pending') then raise exception 'Un retrait est déjà en cours'; end if;
  amt := case cur when '₼' then round(w.earned * 0.024, 2) else w.earned * 8 end;
  update wallets set earned = 0, pending_out = pending_out + w.earned, updated_at = now() where user_id = auth.uid();
  insert into withdrawals (user_id, coins, amount, currency, method, number) values (auth.uid(), w.earned, amt, cur, left(p_method, 40), left(trim(p_number), 40));
  return jsonb_build_object('coins', w.earned, 'amount', amt, 'currency', cur);
end $$;
revoke execute on function public.request_withdrawal(text, text) from public, anon;
grant execute on function public.request_withdrawal(text, text) to authenticated;

create or replace function public.my_gift_history() returns table (kind text, gift text, coins integer, other text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  (select 'recu', g.gift, g.coins, p.username, g.created_at from gifts g join profiles p on p.id = g.from_id where g.to_id = auth.uid()
   union all
   select 'envoye', g.gift, g.coins, p.username, g.created_at from gifts g join profiles p on p.id = g.to_id where g.from_id = auth.uid())
  order by created_at desc limit 50;
$$;
grant execute on function public.my_gift_history() to authenticated;

-- Admin : demandes d'achat de pièces et retraits
create or replace function public.admin_wallet_queue() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  return jsonb_build_object(
    'buys', coalesce((select jsonb_agg(x order by x.created_at) from (
      select c.id, c.user_id, c.coins, c.price, c.currency, c.payment, c.created_at, p.username, p.country, p.phone
      from coin_purchases c join profiles p on p.id = c.user_id where c.status = 'pending') x), '[]'::jsonb),
    'outs', coalesce((select jsonb_agg(x order by x.created_at) from (
      select w.id, w.user_id, w.coins, w.amount, w.currency, w.method, w.number, w.created_at, p.username, p.country
      from withdrawals w join profiles p on p.id = w.user_id where w.status = 'pending') x), '[]'::jsonb),
    'gifts_30d', (select coalesce(sum(coins), 0) from gifts where created_at > now() - interval '30 days'),
    'sold_30d', (select coalesce(sum(coins), 0) from coin_purchases where status = 'approved' and decided_at > now() - interval '30 days'));
end $$;
grant execute on function public.admin_wallet_queue() to authenticated;

create or replace function public.admin_coin_decide(p_id uuid, p_ok boolean) returns void
language plpgsql security definer set search_path = public as $$
declare r coin_purchases;
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  update coin_purchases set status = case when p_ok then 'approved' else 'rejected' end, decided_at = now()
   where id = p_id and status = 'pending' returning * into r;
  if r.id is null then raise exception 'Demande introuvable ou déjà traitée'; end if;
  if p_ok then
    insert into wallets (user_id, coins) values (r.user_id, r.coins)
      on conflict (user_id) do update set coins = wallets.coins + r.coins, updated_at = now();
  end if;
  perform public.notify(r.user_id, null, 'wallet', null, null,
    case when p_ok then '💰 ' || r.coins || ' pièces ajoutées à ton portefeuille' else 'Ta demande de pièces a été refusée. Contacte Vibzo sur WhatsApp.' end);
end $$;
grant execute on function public.admin_coin_decide(uuid, boolean) to authenticated;

create or replace function public.admin_withdrawal_decide(p_id uuid, p_paid boolean) returns void
language plpgsql security definer set search_path = public as $$
declare r withdrawals;
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  update withdrawals set status = case when p_paid then 'paid' else 'rejected' end, decided_at = now()
   where id = p_id and status = 'pending' returning * into r;
  if r.id is null then raise exception 'Retrait introuvable ou déjà traité'; end if;
  update wallets set pending_out = greatest(0, pending_out - r.coins),
                     earned = earned + case when p_paid then 0 else r.coins end, updated_at = now()
   where user_id = r.user_id;
  perform public.notify(r.user_id, null, 'wallet', null, null,
    case when p_paid then '✅ Retrait payé : ' || r.amount || ' ' || r.currency || ' envoyés sur ' || r.method
         else 'Ton retrait a été refusé, les pièces sont revenues dans ton solde.' end);
end $$;
grant execute on function public.admin_withdrawal_decide(uuid, boolean) to authenticated;

-- notify() ignore un auteur nul ; on autorise les notifications système (actor null)
create or replace function public.notify(p_user uuid, p_actor uuid, p_type text, p_video uuid default null, p_comment uuid default null, p_body text default '')
returns void language sql security definer set search_path = public as $$
  insert into notifications (user_id, actor_id, type, video_id, comment_id, body)
  select p_user, p_actor, p_type, p_video, p_comment, left(coalesce(p_body, ''), 140)
  where p_user is not null and p_user is distinct from p_actor
    and not (p_type in ('like','repost','follow','comment_like') and exists (
      select 1 from notifications n where n.user_id = p_user and n.actor_id = p_actor and n.type = p_type
        and n.video_id is not distinct from p_video and n.comment_id is not distinct from p_comment));
$$;
revoke execute on function public.notify(uuid, uuid, text, uuid, uuid, text) from public, anon, authenticated;

-- Vue du fil : total des cadeaux (colonne ajoutée à la fin)
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
  CASE WHEN v.watch_n > 0 THEN round(v.watch_sum / v.watch_n, 3) ELSE 0.5 END AS completion,
  v.gift_coins
FROM videos v JOIN profiles p ON p.id = v.user_id LEFT JOIN products pr ON pr.id = v.product_id;
