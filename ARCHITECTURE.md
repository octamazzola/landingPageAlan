# Arquitectura funcional

## Capas

1. **Frontend React/Vite**: renderiza el menú y los módulos disponibles.
2. **Supabase Auth**: valida el email y mantiene la sesión.
3. **Entitlements**: define plan, inicio, vencimiento y estado.
4. **Contenido modular**: módulos, categorías, bloques, recetas, calidad y novedades.
5. **Datos privados**: proyectos, favoritos y futuros bloques personalizados.
6. **Administración**: CRUD protegido por rol `admin`.

## Regla de acceso

Un usuario puede leer un elemento cuando:

- está publicado;
- tiene una licencia activa;
- el rango de su plan es igual o superior al plan mínimo del elemento;
- la licencia no venció.

Los administradores omiten esas restricciones.

## Crecimiento

Las actualizaciones de contenido no requieren volver a compilar la app. Las nuevas funciones sí requieren agregar un componente React, pero el menú y los permisos siguen administrándose desde Supabase.
