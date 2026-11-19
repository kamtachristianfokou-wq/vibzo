-- live banned (1 colonne)
alter table public.lives add column if not exists banned uuid[] not null default '{}';
