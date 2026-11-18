-- Vibzo · migration 015 : l'admin peut offrir des pièces (prix d'un défi, créateurs fondateurs)
create or replace function public.admin_give_coins(p_username text, p_coins integer) returns integer
language plpgsql security definer set search_path = public as $$
declare u uuid; total int;
begin
  if not public.is_admin() then raise exception 'Réservé aux administrateurs'; end if;
  if p_coins is null or p_coins < 1 or p_coins > 10000 then raise exception 'Entre 1 et 10 000 pièces'; end if;
  select id into u from profiles where username = lower(trim(p_username));
  if u is null then raise exception 'Utilisateur introuvable'; end if;
  insert into wallets (user_id, coins) values (u, p_coins)
    on conflict (user_id) do update set coins = wallets.coins + p_coins, updated_at = now()
    returning coins into total;
  perform public.notify(u, null, 'wallet', null, null, '🎁 Vibzo t’offre ' || p_coins || ' pièces !');
  return total;
end $$;
revoke execute on function public.admin_give_coins(text, integer) from public, anon;
grant execute on function public.admin_give_coins(text, integer) to authenticated;
