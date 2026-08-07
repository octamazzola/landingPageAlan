import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthScreen from './components/AuthScreen.jsx'
import PlatformShell from './components/PlatformShell.jsx'
import { useSession } from './hooks/useSession.js'
import { deleteFavorite, deleteProject, loadPlatformContent, loadProfile, loadUserWorkspace, saveFavorite, saveProject } from './lib/platform.js'
import Dashboard from './modules/Dashboard.jsx'
import PromptBuilder from './modules/PromptBuilder.jsx'
import PromptBank from './modules/PromptBank.jsx'
import Favorites from './modules/Favorites.jsx'
import Projects from './modules/Projects.jsx'
import Changelog from './modules/Changelog.jsx'
import ContentPage from './modules/ContentPage.jsx'
import AdminPanel from './modules/AdminPanel.jsx'
import './styles.css'

function hashSlug() {
  return window.location.hash.replace(/^#\/?/, '') || 'dashboard'
}

export default function App() {
  const { session, loading: sessionLoading } = useSession()
  const [content, setContent] = useState(null)
  const [profile, setProfile] = useState(null)
  const [workspaceData, setWorkspaceData] = useState({ favorites: [], projects: [], customBlocks: [] })
  const [activeSlug, setActiveSlug] = useState(hashSlug())
  const [lang, setLang] = useState(() => localStorage.getItem('vps_lang') || 'es')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)

  const refreshContent = useCallback(async () => {
    setLoading(true)
    try {
      const next = await loadPlatformContent()
      setContent(next)
      setError(next.loadError ? `Se utilizó el contenido local porque Supabase respondió: ${next.loadError}` : '')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshWorkspace = useCallback(async () => {
    if (!session?.user) return
    const next = await loadUserWorkspace(session.user.id)
    setWorkspaceData(next)
  }, [session?.user])

  useEffect(() => {
    localStorage.setItem('vps_lang', lang)
  }, [lang])

  useEffect(() => {
    const listener = () => setActiveSlug(hashSlug())
    window.addEventListener('hashchange', listener)
    return () => window.removeEventListener('hashchange', listener)
  }, [])

  useEffect(() => {
    if (!session?.user) {
      setContent(null); setProfile(null); setWorkspaceData({ favorites: [], projects: [], customBlocks: [] })
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([loadPlatformContent(), loadProfile(session.user.id), loadUserWorkspace(session.user.id)])
      .then(([nextContent, nextProfile, nextWorkspace]) => {
        if (cancelled) return
        setContent(nextContent); setProfile({ ...nextProfile, email: session.user.email }); setWorkspaceData(nextWorkspace)
        setError(nextContent.loadError ? `Se cargó la copia local: ${nextContent.loadError}` : '')
      })
      .catch((loadError) => { if (!cancelled) setError(loadError.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [session?.user])

  async function addFavorite(favorite) {
    const saved = await saveFavorite(session.user.id, favorite)
    setWorkspaceData((current) => ({ ...current, favorites: [saved, ...current.favorites] }))
  }
  async function removeFavorite(id) {
    await deleteFavorite(id)
    setWorkspaceData((current) => ({ ...current, favorites: current.favorites.filter((item) => item.id !== id) }))
  }
  async function addProject(name, snapshot) {
    const saved = await saveProject(session.user.id, name, snapshot)
    setWorkspaceData((current) => ({ ...current, projects: [saved, ...current.projects] }))
  }
  async function removeProject(id) {
    await deleteProject(id)
    setWorkspaceData((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== id) }))
  }
  async function copy(text) {
    await navigator.clipboard.writeText(text)
  }
  function navigate(slug) {
    setActiveSlug(slug)
    history.replaceState(null, '', `#/${slug}`)
  }

  const activeModule = useMemo(() => {
    return content?.modules?.find((module) => module.slug === activeSlug) || content?.modules?.[0]
  }, [content?.modules, activeSlug])

  if (sessionLoading) return <LoadingScreen text="Verificando sesión…" />
  if (!session) return <AuthScreen />
  if (loading && !content) return <LoadingScreen text="Cargando Visual Prompt Studio…" />
  if (!content || !profile) return <LoadingScreen text={error || 'Preparando plataforma…'} />
  if (profile.role !== 'admin' && !profile.plan_slug) return <AccessPending email={profile.email} />

  let moduleView = <Dashboard content={content} profile={profile} lang={lang} navigate={navigate} />
  if (activeModule?.module_type === 'prompt_builder') moduleView = <PromptBuilder content={content} lang={lang} onSaveFavorite={addFavorite} onSaveProject={addProject} />
  if (activeModule?.module_type === 'prompt_bank') moduleView = <PromptBank content={content} lang={lang} onSaveFavorite={addFavorite} favorites={workspaceData.favorites} onDeleteFavorite={removeFavorite} />
  if (activeModule?.module_type === 'favorites') moduleView = <Favorites favorites={workspaceData.favorites} lang={lang} onDelete={removeFavorite} onCopy={copy} />
  if (activeModule?.module_type === 'projects') moduleView = <Projects projects={workspaceData.projects} lang={lang} onDelete={removeProject} onOpen={setSelectedProject} />
  if (activeModule?.module_type === 'content') moduleView = <ContentPage module={activeModule} lang={lang} />
  // changelog and admin are intentionally hidden from the nav and not rendered

  return <>
    <PlatformShell profile={profile} content={content} activeSlug={activeModule?.slug || activeSlug} setActiveSlug={navigate} lang={lang} setLang={setLang} onRefresh={refreshContent}>
      {error && <div className="notice warning">{error}</div>}
      {moduleView}
    </PlatformShell>
    {selectedProject && (
      <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
        <section className="modal-card card" onClick={(event) => event.stopPropagation()}>
          <div className="section-head">
            <div>
              <span className="section-code">PJ</span>
              <h3>{selectedProject.name}</h3>
            </div>
            <button className="button ghost small" onClick={() => setSelectedProject(null)}>Cerrar</button>
          </div>
          
          {selectedProject.snapshot?.promptText ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '12px', color: 'var(--orange)', fontFamily: 'IBM Plex Mono', fontWeight: 800 }}>PROMPT GENERADO</h4>
              <pre className="prompt-output" style={{ maxHeight: '180px', margin: 0 }}>{selectedProject.snapshot.promptText}</pre>
              
              {selectedProject.snapshot.translatedPrompt && (
                <>
                  <h4 style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#858b96', fontFamily: 'IBM Plex Mono', fontWeight: 800 }}>VERSIÓN TRADUCIDA</h4>
                  <pre className="translation-output" style={{ maxHeight: '180px', margin: 0 }}>{selectedProject.snapshot.translatedPrompt}</pre>
                </>
              )}
              
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#858b96', outline: 'none' }}>Ver configuración técnica (JSON)</summary>
                <pre className="saved-prompt" style={{ marginTop: '8px', fontSize: '10px', maxHeight: '180px' }}>
                  {JSON.stringify(
                    Object.fromEntries(
                      Object.entries(selectedProject.snapshot).filter(([k]) => k !== 'promptText' && k !== 'translatedPrompt')
                    ),
                    null,
                    2
                  )}
                </pre>
              </details>
            </div>
          ) : (
            <pre className="saved-prompt">{JSON.stringify(selectedProject.snapshot, null, 2)}</pre>
          )}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button 
              className="button primary" 
              onClick={() => {
                copy(selectedProject.snapshot?.promptText || JSON.stringify(selectedProject.snapshot, null, 2));
                alert('¡Copiado con éxito!');
              }}
            >
              {selectedProject.snapshot?.promptText ? 'Copiar Prompt' : 'Copiar configuración'}
            </button>
            {selectedProject.snapshot?.promptText && (
              <button 
                className="button ghost" 
                onClick={() => {
                  copy(JSON.stringify(selectedProject.snapshot, null, 2));
                  alert('¡Configuración copiada con éxito!');
                }}
              >
                Copiar JSON de Configuración
              </button>
            )}
          </div>
        </section>
      </div>
    )}
  </>
}

function LoadingScreen({ text }) {
  return <main className="auth-page"><section className="auth-card blueprint-panel"><div className="brand-lockup"><span>VISUALPROMPT</span> <strong>STUDIO</strong></div><div className="loader" /><p className="muted">{text}</p></section></main>
}
function AccessPending({ email }) {
  return <main className="auth-page"><section className="auth-card blueprint-panel"><p className="eyebrow">ACCESO PENDIENTE</p><h1>Tu cuenta todavía no tiene un plan activo</h1><p className="muted">El correo <strong>{email}</strong> está autenticado, pero falta asignarle Starter, Professional o Studio Pro desde el panel de Supabase.</p></section></main>
}
