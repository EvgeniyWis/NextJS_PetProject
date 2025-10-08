-- Расширения (обычно уже включены в Supabase)
create extension if not exists pgcrypto;

-- Таблица places
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  image_url text,
  tags text[] not null default '{}', -- соответствует string[]
  description text,
  rating numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Триггер для авто-обновления updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_places_set_updated_at on public.places;
create trigger trg_places_set_updated_at
before update on public.places
for each row execute function public.set_updated_at();

-- Индексы
-- Поиск по названию
create index if not exists idx_places_title on public.places using gin (to_tsvector('simple', coalesce(title, '')));
-- Поиск по адресу
create index if not exists idx_places_address on public.places using gin (to_tsvector('simple', coalesce(address, '')));
-- Быстрый поиск по тегам
create index if not exists idx_places_tags_gin on public.places using gin (tags);
-- Координаты (простые B-Tree индексы; при необходимости можно перейти на PostGIS)
create index if not exists idx_places_latitude on public.places (latitude);
create index if not exists idx_places_longitude on public.places (longitude);

-- Включаем RLS (политики при необходимости)
alter table public.places enable row level security;