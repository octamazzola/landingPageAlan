-- EJEMPLOS DE ADMINISTRACIÓN DE ACCESOS
-- Reemplazar los correos antes de ejecutar.

-- 1) Convertir tu usuario en administrador (primero tenés que invitarte/registrarte en Auth):
update public.profiles
set role = 'admin', display_name = 'Administrador Visual Prompt Studio'
where email = 'TU-EMAIL@DOMINIO.COM';

-- 2) Otorgar Studio Pro durante 12 meses a un comprador:
insert into public.user_entitlements (user_id, plan_slug, starts_at, expires_at, source)
select id, 'studio_pro', now(), now() + interval '12 months', 'manual'
from auth.users
where email = 'CLIENTE@EMAIL.COM';

-- 3) Otorgar acceso Founder por 12 meses:
insert into public.user_entitlements (user_id, plan_slug, starts_at, expires_at, source)
select id, 'founder', now(), now() + interval '12 months', 'manual'
from auth.users
where email = 'CLIENTE@EMAIL.COM';

-- 4) Renovar 12 meses desde el vencimiento actual o desde hoy, lo que sea posterior:
update public.user_entitlements
set expires_at = greatest(coalesce(expires_at, now()), now()) + interval '12 months', active = true
where user_id = (select id from auth.users where email = 'CLIENTE@EMAIL.COM')
  and plan_slug = 'studio_pro';

-- 5) Revocar acceso sin borrar la cuenta:
update public.user_entitlements
set active = false
where user_id = (select id from auth.users where email = 'CLIENTE@EMAIL.COM');
