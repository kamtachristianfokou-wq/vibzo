-- Vibzo · migration 005 : connexion avec Google
-- Les comptes créés avec Google n'ont ni pays ni nom d'utilisateur choisi :
-- on les marque « needs_setup » pour que l'application demande de compléter le profil.

alter table public.profiles add column if not exists needs_setup boolean not null default false;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; uname text; n int := 0; m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  base := regexp_replace(lower(coalesce(m->>'username', split_part(new.email, '@', 1), 'user')), '[^a-z0-9_.]', '', 'g');
  if char_length(base) < 3 then base := base || 'vibzo'; end if;
  base := left(base, 20);
  uname := base;
  while exists (select 1 from public.profiles where username = uname) loop
    n := n + 1; uname := base || n;
  end loop;
  insert into public.profiles (id, username, display_name, avatar_url, country, region, phone, needs_setup)
  values (
    new.id, uname,
    left(coalesce(nullif(m->>'display_name', ''), nullif(m->>'full_name', ''), nullif(m->>'name', ''), uname), 40),
    coalesce(nullif(m->>'avatar_url', ''), nullif(m->>'picture', '')),
    coalesce(nullif(m->>'country', ''), 'CM'),
    nullif(m->>'region', ''),
    nullif(m->>'phone', ''),
    nullif(m->>'country', '') is null
  );
  return new;
end $$;
