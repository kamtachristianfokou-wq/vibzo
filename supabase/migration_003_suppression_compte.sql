-- =====================================================================
-- VIBZO : mise à jour 003 : suppression de compte par l'utilisateur
-- (exigée par Google Play pour toute app qui permet de créer un compte)
-- =====================================================================
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'Connexion requise'; end if;
  -- Les fichiers (vidéos, photos) sont supprimés par l'application via l'API de stockage juste avant
  -- Le compte : le profil et toutes les données liées sont supprimés en cascade
  delete from auth.users where id = me;
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
