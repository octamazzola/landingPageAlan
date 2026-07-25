import { useMemo, useState } from 'react'

function label(value, lang, fallback = '') { return value?.[lang] || value?.en || value?.es || fallback }
function blockText(block, lang) { return block?.texts?.[lang] || block?.texts?.en || '' }

export default function PromptBank({ content, lang, onSaveFavorite, favorites = [], onDeleteFavorite }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return content.categories.map((category) => ({
      ...category,
      blocks: category.blocks.filter((block) => !query || `${block.code} ${Object.values(block.texts || {}).join(' ')}`.toLowerCase().includes(query)),
    })).filter((category) => category.blocks.length)
  }, [content.categories, search])

  async function save(block, category) {
    await onSaveFavorite({ favorite_type: 'block', payload: { categoryKey: category.key, category: label(category.labels, lang), code: block.code, texts: block.texts } })
    setStatus(`${block.code} ★`); setTimeout(() => setStatus(''), 1200)
  }

  return <div>
    <div className="toolbar card dark-card"><div><p className="eyebrow">BIBLIOTECA DINÁMICA</p><h3>{content.categories.reduce((sum, category) => sum + category.blocks.length, 0)} bloques publicados</h3></div>{status && <span className="status-pill">{status}</span>}</div>
    <input className="search-input" placeholder={lang === 'pt' ? 'Buscar por palavra-chave…' : lang === 'en' ? 'Search by keyword…' : 'Buscar por palabra clave…'} value={search} onChange={(event) => setSearch(event.target.value)} />
    <div className="bank-grid">
      {filtered.map((category) => <section className="card bank-column" key={category.id}>
        <div className="category-title"><span style={{ color: category.color }}>{category.key}</span><h3>{label(category.labels, lang, category.key)}</h3><em>{category.blocks.length}</em></div>
        <div className="bank-list">{category.blocks.map((block) => {
          const existingFav = favorites?.find((f) => f.favorite_type === 'block' && f.payload?.code === block.code)
          return <article key={block.id} className="bank-block">
            <div>
              <small>{block.code}</small>
              <button 
                onClick={() => existingFav ? onDeleteFavorite(existingFav.id) : save(block, category)} 
                title="Favorito"
                style={{ color: existingFav ? '#ffb13d' : '#858b96', fontSize: '18px', padding: '0 4px' }}
              >
                {existingFav ? '★' : '☆'}
              </button>
            </div>
            <p>{blockText(block, lang)}</p>
            {lang !== 'en' && <code>{blockText(block, 'en')}</code>}
          </article>
        })}</div>
      </section>)}
    </div>
  </div>
}
