export default function Favorites({ favorites, lang, onDelete, onCopy }) {
  if (!favorites.length) return <div className="empty-state"><span>☆</span><h3>{lang === 'pt' ? 'Ainda não há favoritos' : lang === 'en' ? 'No favorites yet' : 'Todavía no hay favoritos'}</h3><p>Guardá prompts y bloques desde el constructor o el banco profesional.</p></div>
  return <div className="stack-list">{favorites.map((favorite) => {
    const payload = favorite.payload || {}
    return <article className="card favorite-card" key={favorite.id}>
      <div className="favorite-head"><div><small>{favorite.favorite_type?.toUpperCase()}</small><h3>{payload.code || payload.actionCode || 'Prompt guardado'}</h3></div><button className="button danger small" onClick={() => onDelete(favorite.id)}>Eliminar</button></div>
      {favorite.favorite_type === 'prompt' ? <pre className="saved-prompt">{payload.text}</pre> : <><p>{payload.texts?.[lang] || payload.texts?.en}</p><code>{payload.texts?.en}</code></>}
      {payload.text && <button className="button ghost small" onClick={() => onCopy(payload.text)}>Copiar</button>}
    </article>
  })}</div>
}
