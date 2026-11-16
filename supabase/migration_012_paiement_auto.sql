-- Vibzo · migration 012 : paiement automatique (Notch Pay : MTN MoMo, Orange Money, carte)
-- Le paiement est créé par la fonction serveur « notchpay » ; il est crédité seulement après vérification
-- directe auprès de Notch Pay (jamais sur la seule parole du navigateur ou du webhook).

create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  kind         text not null check (kind in ('coins','gold','seller')),
  qty          integer not null,                 -- pièces (coins) ou mois (gold, seller)
  amount       integer not null check (amount > 0),
  currency     text not null default 'XAF',
  provider     text not null default 'notchpay',
  provider_ref text,
  status       text not null default 'pending' check (status in ('pending','complete','failed')),
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists payments_user_idx on public.payments (user_id, created_at desc);
create unique index if not exists payments_provider_ref_idx on public.payments (provider_ref) where provider_ref is not null;
alter table public.payments enable row level security;
drop policy if exists "payments own" on public.payments;
create policy "payments own" on public.payments for select using (user_id = auth.uid() or public.is_admin());

-- Prix en FCFA (source de vérité)
create or replace function public.payment_quote(p_kind text, p_qty integer) returns integer language sql immutable as $$
  select case
    when p_kind = 'coins' then case p_qty when 100 then 1000 when 500 then 5000 when 1050 then 10000 when 5500 then 50000 end
    when p_kind in ('gold','seller') and p_qty in (1,3,12) then 1000 * p_qty
  end;
$$;

-- Créditer un paiement confirmé (appelé uniquement par la fonction serveur, avec la clé service)
create or replace function public.payment_complete(p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare p payments; u timestamptz;
begin
  select * into p from payments where id = p_id for update;
  if p.id is null then raise exception 'Paiement introuvable'; end if;
  if p.status = 'complete' then return jsonb_build_object('status', 'complete', 'already', true); end if;
  update payments set status = 'complete', completed_at = now() where id = p.id;
  if p.kind = 'coins' then
    insert into wallets (user_id, coins) values (p.user_id, p.qty)
      on conflict (user_id) do update set coins = wallets.coins + p.qty, updated_at = now();
    insert into coin_purchases (user_id, coins, price, currency, payment, status, decided_at)
      values (p.user_id, p.qty, p.amount, 'FCFA', 'Automatique (Notch Pay)', 'approved', now());
    perform public.notify(p.user_id, null, 'wallet', null, null, '💰 Paiement reçu : ' || p.qty || ' pièces ajoutées');
  elsif p.kind = 'gold' then
    update profiles set vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(months => p.qty)
     where id = p.user_id returning vip_until into u;
    perform public.notify(p.user_id, null, 'wallet', null, null, '👑 Paiement reçu : Vibzo Gold activé (' || p.qty || ' mois)');
  else
    update shops set status = 'active', paid_until = greatest(coalesce(paid_until, now()), now()) + make_interval(months => p.qty)
     where owner_id = p.user_id returning paid_until into u;
    perform public.notify(p.user_id, null, 'wallet', null, null,
      case when u is null then 'Paiement reçu. Crée ta boutique puis contacte Vibzo pour l’activer.' else '🏪 Paiement reçu : boutique activée (' || p.qty || ' mois)' end);
  end if;
  return jsonb_build_object('status', 'complete', 'kind', p.kind, 'qty', p.qty, 'until', u);
end $$;
revoke execute on function public.payment_complete(uuid) from public, anon, authenticated;
grant execute on function public.payment_complete(uuid) to service_role;
