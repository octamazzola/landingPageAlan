-- VISUAL PROMPT STUDIO · Esquema modular para Supabase
-- Ejecutar completo desde Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.plans (
  slug text primary key,
  name text not null,
  rank integer not null unique,
  billing_model text not null default 'one_time',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'member' check (role in ('member','admin')),
  locale text not null default 'es' check (locale in ('es','en','pt')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_slug text not null references public.plans(slug),
  active boolean not null default true,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  source text not null default 'manual',
  external_order_id text,
  created_at timestamptz not null default now(),
  unique(user_id, plan_slug, starts_at)
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  module_type text not null default 'content',
  titles jsonb not null default '{}'::jsonb,
  descriptions jsonb not null default '{}'::jsonb,
  icon text not null default '◇',
  route text,
  badge jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  labels jsonb not null default '{}'::jsonb,
  color text not null default '#ff9800',
  multi_select boolean not null default false,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prompt_blocks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  code text not null unique,
  texts jsonb not null default '{}'::jsonb,
  descriptions jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  labels jsonb not null default '{}'::jsonb,
  prompt_texts jsonb not null default '{}'::jsonb,
  needs_image boolean not null default false,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.preservations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  labels jsonb not null default '{}'::jsonb,
  prompt_texts jsonb not null default '{}'::jsonb,
  descriptions jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.style_dimensions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  labels jsonb not null default '{}'::jsonb,
  prompt_texts jsonb not null default '{}'::jsonb,
  descriptions jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.output_modes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  labels jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  names jsonb not null default '{}'::jsonb,
  descriptions jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quality_groups (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  labels jsonb not null default '{}'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  optimal_tags jsonb not null default '[]'::jsonb,
  sort_order integer not null default 100,
  required_plan_slug text references public.plans(slug),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  required_plan_slug text references public.plans(slug),
  updated_at timestamptz not null default now()
);

create table if not exists public.changelog (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  titles jsonb not null default '{}'::jsonb,
  items jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  favorite_type text not null check (favorite_type in ('prompt','block','quality')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  code text,
  texts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_entitlements_user on public.user_entitlements(user_id, active, expires_at);
create index if not exists idx_blocks_category_order on public.prompt_blocks(category_id, sort_order);
create index if not exists idx_favorites_user on public.favorites(user_id, created_at desc);
create index if not exists idx_projects_user on public.projects(user_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.has_plan(required_slug text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select
    public.is_admin()
    or (
      auth.uid() is not null
      and (
        required_slug is null
        or exists (
          select 1
          from public.user_entitlements ue
          join public.plans owned on owned.slug = ue.plan_slug and owned.active
          join public.plans required on required.slug = required_slug
          where ue.user_id = auth.uid()
            and ue.active
            and ue.starts_at <= now()
            and (ue.expires_at is null or ue.expires_at > now())
            and owned.rank >= required.rank
        )
      )
    );
$$;

create or replace function public.has_any_access()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin() or exists (
    select 1 from public.user_entitlements ue
    where ue.user_id = auth.uid() and ue.active and ue.starts_at <= now()
      and (ue.expires_at is null or ue.expires_at > now())
  );
$$;

-- Updated-at triggers
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','modules','categories','prompt_blocks','actions','preservations','style_dimensions','output_modes','recipes','quality_groups','projects','custom_blocks']
  LOOP
    EXECUTE format('drop trigger if exists touch_%I on public.%I', t, t);
    EXECUTE format('create trigger touch_%I before update on public.%I for each row execute procedure public.touch_updated_at()', t, t);
  END LOOP;
END $$;

-- Row Level Security
alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.user_entitlements enable row level security;
alter table public.modules enable row level security;
alter table public.categories enable row level security;
alter table public.prompt_blocks enable row level security;
alter table public.actions enable row level security;
alter table public.preservations enable row level security;
alter table public.style_dimensions enable row level security;
alter table public.output_modes enable row level security;
alter table public.recipes enable row level security;
alter table public.quality_groups enable row level security;
alter table public.app_settings enable row level security;
alter table public.changelog enable row level security;
alter table public.favorites enable row level security;
alter table public.projects enable row level security;
alter table public.custom_blocks enable row level security;

-- Perfiles y planes
create policy "plans readable by authenticated" on public.plans for select to authenticated using (true);
create policy "profiles own or admin select" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles admin update" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "entitlements own or admin select" on public.user_entitlements for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "entitlements admin insert" on public.user_entitlements for insert to authenticated with check (public.is_admin());
create policy "entitlements admin update" on public.user_entitlements for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "entitlements admin delete" on public.user_entitlements for delete to authenticated using (public.is_admin());

-- Contenido administrable
create policy "modules entitled select" on public.modules for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "categories entitled select" on public.categories for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "blocks entitled select" on public.prompt_blocks for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "actions entitled select" on public.actions for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "preservations entitled select" on public.preservations for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "style dimensions entitled select" on public.style_dimensions for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "output modes entitled select" on public.output_modes for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "recipes entitled select" on public.recipes for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "quality groups entitled select" on public.quality_groups for select to authenticated using ((published and public.has_plan(required_plan_slug)) or public.is_admin());
create policy "settings entitled select" on public.app_settings for select to authenticated using (public.has_plan(required_plan_slug) or public.is_admin());
create policy "changelog accessible select" on public.changelog for select to authenticated using ((published and public.has_any_access()) or public.is_admin());

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['modules','categories','prompt_blocks','actions','preservations','style_dimensions','output_modes','recipes','quality_groups','app_settings','changelog']
  LOOP
    EXECUTE format('create policy "%s admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t, t);
    EXECUTE format('create policy "%s admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
    EXECUTE format('create policy "%s admin delete" on public.%I for delete to authenticated using (public.is_admin())', t, t);
  END LOOP;
END $$;

-- Datos privados del usuario
create policy "favorites own select" on public.favorites for select to authenticated using (user_id = auth.uid());
create policy "favorites own insert" on public.favorites for insert to authenticated with check (user_id = auth.uid());
create policy "favorites own update" on public.favorites for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "favorites own delete" on public.favorites for delete to authenticated using (user_id = auth.uid());
create policy "projects own select" on public.projects for select to authenticated using (user_id = auth.uid());
create policy "projects own insert" on public.projects for insert to authenticated with check (user_id = auth.uid());
create policy "projects own update" on public.projects for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "projects own delete" on public.projects for delete to authenticated using (user_id = auth.uid());
create policy "custom blocks own select" on public.custom_blocks for select to authenticated using (user_id = auth.uid());
create policy "custom blocks own insert" on public.custom_blocks for insert to authenticated with check (user_id = auth.uid());
create policy "custom blocks own update" on public.custom_blocks for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "custom blocks own delete" on public.custom_blocks for delete to authenticated using (user_id = auth.uid());
