-- Vibzo · migration 006 : durcissement (alertes du conseiller de sécurité Supabase)
-- Fonctions de déclencheur : jamais appelables via l'API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_profile_fields() from public, anon, authenticated;
revoke execute on function public.protect_shop_fields() from public, anon, authenticated;
revoke execute on function public.protect_video_fields() from public, anon, authenticated;
revoke execute on function public.protect_offer_fields() from public, anon, authenticated;
revoke execute on function public.check_dating_profile() from public, anon, authenticated;
-- Fonctions réservées aux membres connectés
do $$ declare f text; begin
  foreach f in array array[
    'public.admin_activate_request(uuid)','public.admin_set_vip(text,integer)','public.admin_stats()',
    'public.apply_to_offer(uuid,text)','public.dating_candidates(text[],text,text,text,integer,integer,integer)',
    'public.dating_swipe(uuid,text)','public.mark_read(uuid)','public.place_order(uuid,integer,text,text,text)',
    'public.start_conversation(uuid,text,text,uuid)','public.delete_my_account()']
  loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
alter function public.feed(text[], text, text, integer, integer) set search_path = public;
