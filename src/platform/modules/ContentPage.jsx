function label(value, lang, fallback = '') { return value?.[lang] || value?.en || value?.es || fallback }
export default function ContentPage({ module, lang }) {
  const config = module.config || {}
  return <section className="hero-panel blueprint-panel"><p className="eyebrow">MÓDULO DINÁMICO</p><h1>{label(module.titles, lang, module.slug)}</h1><p>{label(module.descriptions, lang, '')}</p>{config.body && <div className="content-body">{label(config.body, lang)}</div>}{config.url && <a className="button primary" href={config.url} target="_blank" rel="noreferrer">Abrir recurso</a>}</section>
}
