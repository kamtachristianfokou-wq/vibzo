-- Vibzo · migration 014 : validation en 2 étapes (TOTP)
-- Si un membre a activé la validation en 2 étapes, sa session doit être de niveau « aal2 » (code saisi)
-- pour utiliser les pouvoirs admin et pour retirer de l'argent.
create or replace function public.mfa_ok() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified');
$$;
revoke execute on function public.mfa_ok() from public, anon;
grant execute on function public.mfa_ok() to authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') and public.mfa_ok();
$$;

create or replace function public.request_withdrawal(p_method text, p_number text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare w wallets; cur text := public.wallet_currency(auth.uid()); amt numeric;
begin
  if auth.uid() is null then raise exception 'Connecte-toi d’abord'; end if;
  if not public.mfa_ok() then raise exception 'Reconnecte-toi avec ton code de sécurité (validation en 2 étapes)'; end if;
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
