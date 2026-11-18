-- Vibzo · migration 013 : durcissement de la sécurité
-- 1. Les numéros de téléphone ne sont plus lisibles par tout le monde (seulement par le membre lui-même et l'admin).
-- 2. Un membre ne peut plus déplacer sa ligne de conversation_members pour lire les messages d'autres conversations.
-- 3. Les compteurs des vidéos (vues, partages, cadeaux, temps de visionnage) ne peuvent plus être gonflés à la main.
-- 4. Une commande ne peut plus être modifiée (prix, total…) ; seul le statut change, selon qui agit.
-- 5. Le parrain d'un compte ne peut plus être modifié directement.
-- 6. Les fonctions réservées aux membres connectés ne sont plus appelables sans connexion.

-- 1. Téléphone privé ---------------------------------------------------------
revoke select on public.profiles from anon, authenticated;
grant select (id, username, display_name, bio, avatar_url, country, region, role, vip_until, created_at,
              city, lang, needs_setup, instagram, tiktok, youtube) on public.profiles to anon, authenticated;

create or replace function public.private_phone(p_user uuid) returns text
language sql stable security definer set search_path = public as $$
  select phone from profiles where id = p_user and (p_user = auth.uid() or public.is_admin());
$$;
revoke execute on function public.private_phone(uuid) from public, anon;
grant execute on function public.private_phone(uuid) to authenticated;

create or replace view public.subscription_requests_view with (security_invoker = true) as
SELECT r.id, r.user_id, r.plan, r.months, r.payment, r.status, r.created_at,
  p.username, p.display_name, p.country, public.private_phone(p.id) AS phone
FROM subscription_requests r JOIN profiles p ON p.id = r.user_id;

-- 2. conversation_members : seule la date de lecture est modifiable --------------
revoke update on public.conversation_members from anon, authenticated;
grant update (last_read_at) on public.conversation_members to authenticated;

-- 3. Compteurs des vidéos protégés --------------------------------------------
create or replace function public.protect_video_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.view_count := 0; new.share_count := 0; new.watch_sum := 0; new.watch_n := 0; new.gift_coins := 0;
    else
      new.status := old.status; new.user_id := old.user_id;
      new.view_count := old.view_count; new.share_count := old.share_count;
      new.watch_sum := old.watch_sum; new.watch_n := old.watch_n; new.gift_coins := old.gift_coins;
      new.created_at := old.created_at;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists protect_video on public.videos;
create trigger protect_video before insert or update on public.videos for each row execute function public.protect_video_fields();

-- 4. Commandes : seul le statut évolue ----------------------------------------
create or replace function public.protect_order_fields() returns trigger
language plpgsql security definer set search_path = public as $$
declare seller boolean;
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  -- tout sauf le statut reste figé
  new.buyer_id := old.buyer_id; new.shop_id := old.shop_id; new.product_id := old.product_id;
  new.product_name := old.product_name; new.quantity := old.quantity; new.unit_price := old.unit_price;
  new.total := old.total; new.currency := old.currency; new.payment_method := old.payment_method;
  new.address := old.address; new.phone := old.phone; new.note := old.note; new.created_at := old.created_at;
  select exists (select 1 from shops s where s.id = old.shop_id and s.owner_id = auth.uid()) into seller;
  if not seller then
    -- l'acheteur peut seulement annuler
    if new.status is distinct from old.status and new.status <> 'cancelled' then new.status := old.status; end if;
  end if;
  return new;
end $$;
revoke execute on function public.protect_order_fields() from public, anon, authenticated;
drop trigger if exists protect_order on public.orders;
create trigger protect_order before update on public.orders for each row execute function public.protect_order_fields();

-- 5. Profil : rôle, Gold et parrain protégés ----------------------------------
create or replace function public.protect_profile_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() and coalesce(current_setting('vibzo.system', true), '') <> '1' then
    new.role := old.role;
    new.vip_until := old.vip_until;
    new.created_at := old.created_at;
    if tg_op = 'UPDATE' then new.referred_by := old.referred_by; end if;
  end if;
  return new;
end $$;
revoke execute on function public.protect_profile_fields() from public, anon, authenticated;

create or replace function public.set_referrer(p_username text) returns boolean
language plpgsql security definer set search_path = public as $$
declare r uuid;
begin
  select id into r from profiles where username = lower(p_username) and id <> auth.uid();
  if r is null then return false; end if;
  perform set_config('vibzo.system', '1', true);
  update profiles set referred_by = r where id = auth.uid() and referred_by is null and created_at > now() - interval '1 day';
  if found then
    perform set_config('vibzo.system', '', true);
    perform public.trg_referral_manual(auth.uid());
    return true;
  end if;
  perform set_config('vibzo.system', '', true);
  return false;
end $$;
revoke execute on function public.set_referrer(text) from public, anon;
grant execute on function public.set_referrer(text) to authenticated;

-- 6. Fonctions : pas d'appel sans connexion quand ce n'est pas nécessaire -------
do $$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p
    where p.pronamespace = 'public'::regnamespace and p.prosecdef
      and p.proname not in ('feed','record_view','record_share','record_watch','trending_tags','trending_sounds',
                            'video_top_gifters','is_creator','handle_new_user')
      and p.prokind = 'f'
  loop
    execute format('revoke execute on function %s from public, anon', f.sig);
  end loop;
end $$;
-- Les fonctions de déclencheurs ne sont jamais appelées directement
revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- Les fonctions utilisées par les règles d'accès (RLS) doivent rester exécutables par les connectés
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_vip() to authenticated;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.has_dating_profile() to authenticated;
-- … et par les visiteurs non connectés quand une règle publique les utilise
grant execute on function public.is_admin() to anon;

alter function public.gift_price(text) set search_path = public;
alter function public.gift_label(text) set search_path = public;
alter function public.payment_quote(text, integer) set search_path = public;
