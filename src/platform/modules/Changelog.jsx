function label(value, lang, fallback = '') { return value?.[lang] || value?.en || value?.es || fallback }
export default function Changelog({ content, lang }) {
  return <div className="timeline">{content.changelog.map((item) => <article className="card" key={item.id}><p className="eyebrow">VERSIÓN {item.version}</p><h3>{label(item.titles, lang, item.version)}</h3><small>{item.published_at ? new Date(item.published_at).toLocaleDateString('es-AR') : ''}</small><ul>{(item.items?.[lang] || item.items?.es || []).map((entry) => <li key={entry}>{entry}</li>)}</ul></article>)}</div>
}
