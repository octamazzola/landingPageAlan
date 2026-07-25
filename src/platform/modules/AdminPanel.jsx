import { useMemo, useState } from 'react'
import { adminDelete, adminUpsert } from '../lib/platform'

const TABLES = [
  { key: 'modules', label: 'Módulos', kind: 'modules' },
  { key: 'categories', label: 'Categorías', kind: 'categories' },
  { key: 'prompt_blocks', label: 'Bloques', kind: 'blocks' },
  { key: 'recipes', label: 'Recetas', kind: 'recipes' },
  { key: 'changelog', label: 'Novedades', kind: 'changelog' },
]

const EMPTY = {
  modules: { slug: '', module_type: 'content', title_es: '', title_en: '', title_pt: '', description_es: '', icon: '◇', sort_order: 100, required_plan_slug: 'studio_pro', published: true, badge_es: '', config: '{}' },
  categories: { key: '', title_es: '', title_en: '', title_pt: '', color: '#ff9800', multi_select: false, sort_order: 100, required_plan_slug: 'studio_pro', published: true },
  blocks: { category_id: '', code: '', text_en: '', text_es: '', text_pt: '', sort_order: 100, required_plan_slug: 'studio_pro', published: true },
  recipes: { code: '', name_es: '', name_en: '', name_pt: '', description_es: '', sort_order: 100, required_plan_slug: 'studio_pro', published: true, config: '{}' },
  changelog: { version: '', title_es: '', title_en: '', title_pt: '', items_es: '', items_en: '', items_pt: '', published: true },
}

function parseJson(value, fallback = {}) {
  try { return JSON.parse(value || '{}') } catch { return fallback }
}
function lines(value) { return String(value || '').split('\n').map((item) => item.trim()).filter(Boolean) }

export default function AdminPanel({ content, onRefresh }) {
  const [section, setSection] = useState('modules')
  const [form, setForm] = useState(EMPTY.modules)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const items = useMemo(() => {
    if (section === 'modules') return content.modules
    if (section === 'categories') return content.categories
    if (section === 'blocks') return content.categories.flatMap((category) => category.blocks.map((block) => ({ ...block, category })))
    if (section === 'recipes') return content.recipes
    if (section === 'changelog') return content.changelog
    return []
  }, [section, content])

  function changeSection(next) {
    setSection(next); setForm(EMPTY[next]); setEditingId(null); setStatus('')
  }

  function edit(item) {
    setEditingId(item.id)
    if (section === 'modules') setForm({ slug: item.slug, module_type: item.module_type, title_es: item.titles?.es || '', title_en: item.titles?.en || '', title_pt: item.titles?.pt || '', description_es: item.descriptions?.es || '', icon: item.icon || '◇', sort_order: item.sort_order || 0, required_plan_slug: item.required_plan_slug || '', published: item.published !== false, badge_es: item.badge?.es || '', config: JSON.stringify(item.config || {}, null, 2) })
    if (section === 'categories') setForm({ key: item.key, title_es: item.labels?.es || '', title_en: item.labels?.en || '', title_pt: item.labels?.pt || '', color: item.color || '#ff9800', multi_select: Boolean(item.multi_select), sort_order: item.sort_order || 0, required_plan_slug: item.required_plan_slug || '', published: item.published !== false })
    if (section === 'blocks') setForm({ category_id: item.category_id, code: item.code, text_en: item.texts?.en || '', text_es: item.texts?.es || '', text_pt: item.texts?.pt || '', sort_order: item.sort_order || 0, required_plan_slug: item.required_plan_slug || '', published: item.published !== false })
    if (section === 'recipes') setForm({ code: item.code, name_es: item.names?.es || '', name_en: item.names?.en || '', name_pt: item.names?.pt || '', description_es: item.descriptions?.es || '', sort_order: item.sort_order || 0, required_plan_slug: item.required_plan_slug || '', published: item.published !== false, config: JSON.stringify(item.config || {}, null, 2) })
    if (section === 'changelog') setForm({ version: item.version, title_es: item.titles?.es || '', title_en: item.titles?.en || '', title_pt: item.titles?.pt || '', items_es: (item.items?.es || []).join('\n'), items_en: (item.items?.en || []).join('\n'), items_pt: (item.items?.pt || []).join('\n'), published: item.published !== false })
  }

  function buildRecord() {
    const base = editingId ? { id: editingId } : {}
    if (section === 'modules') return { ...base, slug: form.slug, module_type: form.module_type, titles: { es: form.title_es, en: form.title_en, pt: form.title_pt }, descriptions: { es: form.description_es }, icon: form.icon, sort_order: Number(form.sort_order), required_plan_slug: form.required_plan_slug || null, published: form.published, badge: form.badge_es ? { es: form.badge_es, en: form.badge_es, pt: form.badge_es } : {}, config: parseJson(form.config) }
    if (section === 'categories') return { ...base, key: form.key, labels: { es: form.title_es, en: form.title_en, pt: form.title_pt }, color: form.color, multi_select: form.multi_select, sort_order: Number(form.sort_order), required_plan_slug: form.required_plan_slug || null, published: form.published }
    if (section === 'blocks') return { ...base, category_id: form.category_id, code: form.code, texts: { en: form.text_en, es: form.text_es, pt: form.text_pt }, descriptions: {}, sort_order: Number(form.sort_order), required_plan_slug: form.required_plan_slug || null, published: form.published }
    if (section === 'recipes') return { ...base, code: form.code, names: { es: form.name_es, en: form.name_en, pt: form.name_pt }, descriptions: { es: form.description_es }, config: parseJson(form.config), sort_order: Number(form.sort_order), required_plan_slug: form.required_plan_slug || null, published: form.published }
    return { ...base, version: form.version, titles: { es: form.title_es, en: form.title_en, pt: form.title_pt }, items: { es: lines(form.items_es), en: lines(form.items_en), pt: lines(form.items_pt) }, published: form.published, published_at: new Date().toISOString() }
  }

  async function submit(event) {
    event.preventDefault(); setBusy(true); setStatus('')
    try { await adminUpsert(section === 'blocks' ? 'prompt_blocks' : section, buildRecord()); setStatus('Guardado ✓'); setForm(EMPTY[section]); setEditingId(null); await onRefresh() }
    catch (error) { setStatus(error.message) }
    finally { setBusy(false) }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este registro?')) return
    try { await adminDelete(section === 'blocks' ? 'prompt_blocks' : section, id); await onRefresh() } catch (error) { setStatus(error.message) }
  }

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  return <div className="admin-layout">
    <aside className="card admin-nav"><p className="eyebrow">PANEL ADMIN</p>{TABLES.map((table) => <button key={table.key} className={section === table.key ? 'active' : ''} onClick={() => changeSection(table.key)}>{table.label}</button>)}</aside>
    <section className="admin-content">
      <form className="card admin-form" onSubmit={submit}>
        <div className="section-head"><div><span className="section-code">DB</span><h3>{editingId ? 'Editar' : 'Nuevo'} {TABLES.find((table) => table.key === section)?.label}</h3></div>{editingId && <button type="button" className="button ghost small" onClick={() => { setEditingId(null); setForm(EMPTY[section]) }}>Cancelar edición</button>}</div>
        {section === 'modules' && <>
          <div className="form-grid"><Field label="Slug" value={form.slug} set={(value) => set('slug', value)} /><Field label="Tipo" value={form.module_type} set={(value) => set('module_type', value)} /><Field label="Título ES" value={form.title_es} set={(value) => set('title_es', value)} /><Field label="Título EN" value={form.title_en} set={(value) => set('title_en', value)} /><Field label="Título PT" value={form.title_pt} set={(value) => set('title_pt', value)} /><Field label="Icono" value={form.icon} set={(value) => set('icon', value)} /><Field label="Descripción ES" value={form.description_es} set={(value) => set('description_es', value)} /><Field label="Badge" value={form.badge_es} set={(value) => set('badge_es', value)} /></div><TextArea label="Config JSON" value={form.config} set={(value) => set('config', value)} />
        </>}
        {section === 'categories' && <div className="form-grid"><Field label="Código" value={form.key} set={(value) => set('key', value)} /><Field label="Título ES" value={form.title_es} set={(value) => set('title_es', value)} /><Field label="Título EN" value={form.title_en} set={(value) => set('title_en', value)} /><Field label="Título PT" value={form.title_pt} set={(value) => set('title_pt', value)} /><Field label="Color" value={form.color} set={(value) => set('color', value)} type="color" /><Check label="Multi-selección" value={form.multi_select} set={(value) => set('multi_select', value)} /></div>}
        {section === 'blocks' && <><div className="form-grid"><Select label="Categoría" value={form.category_id} set={(value) => set('category_id', value)} options={content.categories.map((category) => ({ value: category.id, label: `${category.key} · ${category.labels?.es}` }))} /><Field label="Código" value={form.code} set={(value) => set('code', value)} /><Field label="Texto EN" value={form.text_en} set={(value) => set('text_en', value)} /><Field label="Texto ES" value={form.text_es} set={(value) => set('text_es', value)} /><Field label="Texto PT" value={form.text_pt} set={(value) => set('text_pt', value)} /></div></>}
        {section === 'recipes' && <><div className="form-grid"><Field label="Código" value={form.code} set={(value) => set('code', value)} /><Field label="Nombre ES" value={form.name_es} set={(value) => set('name_es', value)} /><Field label="Nombre EN" value={form.name_en} set={(value) => set('name_en', value)} /><Field label="Nombre PT" value={form.name_pt} set={(value) => set('name_pt', value)} /><Field label="Descripción ES" value={form.description_es} set={(value) => set('description_es', value)} /></div><TextArea label="Config JSON" value={form.config} set={(value) => set('config', value)} /></>}
        {section === 'changelog' && <><div className="form-grid"><Field label="Versión" value={form.version} set={(value) => set('version', value)} /><Field label="Título ES" value={form.title_es} set={(value) => set('title_es', value)} /><Field label="Título EN" value={form.title_en} set={(value) => set('title_en', value)} /><Field label="Título PT" value={form.title_pt} set={(value) => set('title_pt', value)} /></div><TextArea label="Ítems ES · uno por línea" value={form.items_es} set={(value) => set('items_es', value)} /><TextArea label="Ítems EN" value={form.items_en} set={(value) => set('items_en', value)} /><TextArea label="Ítems PT" value={form.items_pt} set={(value) => set('items_pt', value)} /></>}
        {section !== 'changelog' && <div className="form-grid compact-grid"><Field label="Orden" value={form.sort_order} set={(value) => set('sort_order', value)} type="number" /><Select label="Plan mínimo" value={form.required_plan_slug} set={(value) => set('required_plan_slug', value)} options={[{ value: '', label: 'Sin restricción' }, { value: 'starter', label: 'Starter' }, { value: 'professional', label: 'Professional' }, { value: 'studio_pro', label: 'Studio Pro' }, { value: 'founder', label: 'Founder' }]} /><Check label="Publicado" value={form.published} set={(value) => set('published', value)} /></div>}
        {section === 'changelog' && <Check label="Publicado" value={form.published} set={(value) => set('published', value)} />}
        <button className="button primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar en Supabase'}</button>{status && <span className="admin-status">{status}</span>}
      </form>
      <div className="admin-list">{items.map((item) => <article className="card admin-row" key={item.id}><div><small>{item.slug || item.key || item.code || item.version}</small><strong>{item.titles?.es || item.labels?.es || item.names?.es || item.texts?.es || item.category?.labels?.es || 'Registro'}</strong></div><div><button className="button ghost small" onClick={() => edit(item)}>Editar</button><button className="button danger small" onClick={() => remove(item.id)}>Eliminar</button></div></article>)}</div>
    </section>
  </div>
}

function Field({ label, value, set, type = 'text' }) { return <label className="field"><span>{label}</span><input type={type} value={value ?? ''} onChange={(event) => set(event.target.value)} /></label> }
function TextArea({ label, value, set }) { return <label className="field"><span>{label}</span><textarea rows="5" value={value ?? ''} onChange={(event) => set(event.target.value)} /></label> }
function Check({ label, value, set }) { return <label className="check-field"><input type="checkbox" checked={Boolean(value)} onChange={(event) => set(event.target.checked)} /><span>{label}</span></label> }
function Select({ label, value, set, options }) { return <label className="field"><span>{label}</span><select value={value ?? ''} onChange={(event) => set(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label> }
