-- Vibzo · migration 016 : « juste équilibre » des prix et des récompenses
-- Gold Afrique 1 500 F/mois (4 000 F 3 mois, 12 000 F 1 an) · Vendeur 2 000 F/mois (5 500 F 3 mois, 20 000 F 1 an)
-- 1er mois de boutique offert · une boutique n'est visible que si son abonnement est en cours
-- Programme Créateurs : 500 abonnés + 5 000 vues sur 30 jours + 3 vidéos
-- Parrainage : l'ami invité reçoit 3 jours de Gold (en plus des 7 jours au parrain tous les 3 amis)

create or replace function public.payment_quote(p_kind text, p_qty integer) returns integer
language sql immutable set search_path = public as $$
  select case
    when p_kind = 'coins' then case p_qty when 100 then 1000 when 500 then 5000 when 1050 then 10000 when 5500 then 50000 end
    when p_kind = 'gold' then case p_qty when 1 then 1500 when 3 then 4000 when 12 then 12000 end
    when p_kind = 'seller' then case p_qty when 1 then 2000 when 3 then 5500 when 12 then 20000 end
  end;
$$;

create or replace function public.creator_thresholds() returns jsonb language sql immutable set search_path = public as $$
  select jsonb_build_object('followers', 500, 'views_30d', 5000, 'videos', 3);
$$;

-- Boutique : 1er mois offert à la création
create or replace function public.protect_shop_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'active'; new.paid_until := now() + interval '30 days';
    else
      new.status := old.status; new.paid_until := old.paid_until; new.owner_id := old.owner_id;
    end if;
  end if;
  return new;
end $$;
revoke execute on function public.protect_shop_fields() from public, anon, authenticated;

-- Une boutique (et ses produits) n'est visible que si l'abonnement est en cours
drop policy if exists shops_read on public.shops;
create policy shops_read on public.shops for select using (
  (status = 'active' and (paid_until is null or paid_until > now())) or owner_id = auth.uid() or public.is_admin());
drop policy if exists products_read on public.products;
create policy products_read on public.products for select using (
  (active and exists (select 1 from shops s where s.id = products.shop_id and s.status = 'active' and (s.paid_until is null or s.paid_until > now())))
  or exists (select 1 from shops s where s.id = products.shop_id and s.owner_id = auth.uid())
  or public.is_admin());

-- Parrainage : cadeau de bienvenue pour l'ami invité (3 jours de Gold)
create or replace function public.trg_referral() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if new.referred_by is null or new.referred_by = new.id then return new; end if;
  update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '3 days' where id = new.id;
  perform public.notify(new.id, new.referred_by, 'referral', null, null, '🎁 Bienvenue ! 3 jours de Vibzo Gold offerts grâce à ton ami');
  select count(*) into n from profiles where referred_by = new.referred_by;
  perform public.notify(new.referred_by, new.id, 'referral', null, null,
    case when n % 3 = 0 then '🎁 3 amis inscrits : 7 jours de Vibzo Gold offerts !' else n % 3 || '/3 amis inscrits avec ton lien' end);
  if n % 3 = 0 then
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '7 days' where id = new.referred_by;
  end if;
  return new;
end $$;
revoke execute on function public.trg_referral() from public, anon, authenticated;

create or replace function public.trg_referral_manual(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare rb uuid; n int;
begin
  select referred_by into rb from profiles where id = p_user;
  if rb is null then return; end if;
  perform set_config('vibzo.system', '1', true);
  update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '3 days' where id = p_user;
  perform public.notify(p_user, rb, 'referral', null, null, '🎁 Bienvenue ! 3 jours de Vibzo Gold offerts grâce à ton ami');
  select count(*) into n from profiles where referred_by = rb;
  perform public.notify(rb, p_user, 'referral', null, null,
    case when n % 3 = 0 then '🎁 3 amis inscrits : 7 jours de Vibzo Gold offerts !' else n % 3 || '/3 amis inscrits avec ton lien' end);
  if n % 3 = 0 then
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + interval '7 days' where id = rb;
  end if;
  perform set_config('vibzo.system', '', true);
end $$;
revoke execute on function public.trg_referral_manual(uuid) from public, anon, authenticated;
