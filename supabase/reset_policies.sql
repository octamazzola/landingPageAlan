-- VISUAL PROMPT STUDIO · Reseteo de políticas RLS
-- Ejecutar esto si el schema.sql ya fue corrido antes y da error de policies duplicadas.

-- ── Eliminar todas las policies existentes ─────────────────────────────────
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ── Recrear policies ────────────────────────────────────────────────────────

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
