import { useMemo, useState } from 'react'
import { demoMode, supabase } from '../lib/supabase'

const LANGS = ['es', 'en', 'pt']

function label(object, lang, fallback = '') {
  return object?.[lang] || object?.es || object?.en || fallback
}

export default function PlatformShell({ profile, content, activeSlug, setActiveSlug, lang, setLang, children, onRefresh }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const modules = useMemo(() => {
    const regular = [...(content.modules || [])]
      .filter((module) => module.published !== false && module.module_type !== 'changelog')
    return regular.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }, [content.modules, profile?.role])

  async function signOut() {
    if (demoMode) return
    await supabase.auth.signOut()
  }

  function openModule(slug) {
    setActiveSlug(slug)
    setMobileOpen(false)
    history.replaceState(null, '', `#/${slug}`)
  }

  return (
    <div className="platform-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-lockup compact"><span>VISUALPROMPT</span> <strong>STUDIO</strong></div>
          <small>MODULAR WORKSPACE</small>
        </div>
        <nav className="sidebar-nav" aria-label="Módulos">
          {modules.map((module) => (
            <button key={module.id || module.slug} className={`nav-item ${activeSlug === module.slug ? 'active' : ''}`} onClick={() => openModule(module.slug)}>
              <span className="nav-icon">{module.icon || '◇'}</span>
              <span className="nav-copy"><strong>{label(module.titles, lang, module.slug)}</strong><small>{label(module.descriptions, lang)}</small></span>
              {module.badge && <em>{label(module.badge, lang)}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="account-card">
            <strong>{profile?.display_name || profile?.email || 'Usuario'}</strong>
            <span>{profile?.plan_slug ? profile.plan_slug.replace('_', ' ').toUpperCase() : 'SIN PLAN'}</span>
            {profile?.expires_at && <small>Acceso hasta {new Date(profile.expires_at).toLocaleDateString('es-AR')}</small>}
          </div>
          <button className="button ghost full" onClick={signOut}>{demoMode ? 'Modo demo' : 'Cerrar sesión'}</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir menú">☰</button>
          <div>
            <p className="eyebrow">SISTEMAS DE PRODUCCIÓN CON IA</p>
            <h2>{label(modules.find((module) => module.slug === activeSlug)?.titles, lang, 'Visual Prompt Studio')}</h2>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={onRefresh} title="Actualizar contenido">↻</button>
            <div className="lang-switch">
              {LANGS.map((code) => <button key={code} className={lang === code ? 'active' : ''} onClick={() => setLang(code)}>{code.toUpperCase()}</button>)}
            </div>
          </div>
        </header>
        <main className="workspace">{children}</main>
      </div>
      {mobileOpen && <button className="sidebar-overlay" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />}
    </div>
  )
}
