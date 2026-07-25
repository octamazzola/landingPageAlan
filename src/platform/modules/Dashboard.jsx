function label(value, lang, fallback = '') { return value?.[lang] || value?.en || value?.es || fallback }
export default function Dashboard({ content, profile, lang, navigate }) {
  const blocks = content.categories.reduce((sum, category) => sum + category.blocks.length, 0)
  return <div className="dashboard-stack">
    <section className="hero-panel blueprint-panel"><p className="eyebrow">VISUAL PROMPT STUDIO</p><h1>Sistemas de producción con IA para visualización arquitectónica.</h1><p>Construí, administrá y actualizá prompts profesionales sin perder la geometría ni la identidad del proyecto.</p><button className="button primary" onClick={() => navigate('prompt-builder')}>Abrir Constructor</button></section>
    <div className="metric-grid"><article className="metric-card"><strong>{blocks}</strong><span>Bloques publicados</span></article><article className="metric-card"><strong>{content.recipes.length}</strong><span>Recetas rápidas</span></article><article className="metric-card"><strong>{content.modules.length}</strong><span>Módulos activos</span></article><article className="metric-card"><strong>{profile?.plan_slug?.toUpperCase() || 'ADMIN'}</strong><span>Plan actual</span></article></div>
    <section className="card"><div className="section-head"><div><span className="section-code">UP</span><h3>Últimas novedades</h3></div></div><div className="updates-list">{content.changelog.slice(0, 3).map((item) => <article key={item.id}><strong>{item.version}</strong><div><h4>{label(item.titles, lang, item.version)}</h4><ul>{(item.items?.[lang] || item.items?.es || []).map((entry) => <li key={entry}>{entry}</li>)}</ul></div></article>)}</div></section>
  </div>
}
