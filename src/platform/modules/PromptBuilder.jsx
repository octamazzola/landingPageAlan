import { useMemo, useState } from 'react'

const OUTPUT_LABELS = {
  universal: { es: 'Universal', en: 'Universal', pt: 'Universal' },
  gpt: { es: 'GPT Image / ChatGPT', en: 'GPT Image / ChatGPT', pt: 'GPT Image / ChatGPT' },
  midjourney: { es: 'Midjourney', en: 'Midjourney', pt: 'Midjourney' },
  sd: { es: 'Flux / Stable Diffusion', en: 'Flux / Stable Diffusion', pt: 'Flux / Stable Diffusion' },
  krea: { es: 'Krea / Magnific', en: 'Krea / Magnific', pt: 'Krea / Magnific' },
  client: { es: 'Explicación para cliente', en: 'Client explanation', pt: 'Explicação para cliente' },
}

const COPY = {
  es: { action: 'Acción', preservation: 'Preservación', recipe: 'Recetas rápidas', blocks: 'Bloques profesionales', quality: 'Calidad final', output: 'Modo de salida', generated: 'Prompt generado', negative: 'Negative prompt', copy: 'Copiar', save: 'Guardar favorito', project: 'Guardar proyecto', clear: 'Limpiar', empty: 'Seleccioná una acción y bloques para construir el prompt.', projectName: 'Nombre del proyecto', saveProject: 'Guardar', selected: 'seleccionados', optimal: 'Preset óptimo activo', noPres: 'No requiere preservación', translation: 'Versión traducida' },
  en: { action: 'Action', preservation: 'Preservation', recipe: 'Quick recipes', blocks: 'Professional blocks', quality: 'Final quality', output: 'Output mode', generated: 'Generated prompt', negative: 'Negative prompt', copy: 'Copy', save: 'Save favorite', project: 'Save project', clear: 'Clear', empty: 'Select an action and blocks to build the prompt.', projectName: 'Project name', saveProject: 'Save', selected: 'selected', optimal: 'Optimal preset active', noPres: 'No preservation required', translation: 'Translated version' },
  pt: { action: 'Ação', preservation: 'Preservação', recipe: 'Receitas rápidas', blocks: 'Blocos profissionais', quality: 'Qualidade final', output: 'Modo de saída', generated: 'Prompt gerado', negative: 'Negative prompt', copy: 'Copiar', save: 'Guardar favorito', project: 'Guardar projeto', clear: 'Limpar', empty: 'Selecione uma ação e blocos para construir o prompt.', projectName: 'Nome do projeto', saveProject: 'Guardar', selected: 'selecionados', optimal: 'Preset ótimo ativo', noPres: 'Não requer preservação', translation: 'Versão traduzida' },
}

function text(value, lang, fallback = '') {
  return value?.[lang] || value?.en || value?.es || fallback
}
function promptText(item, lang = 'en') {
  return item?.prompt_texts?.[lang] || item?.prompt_texts?.en || item?.texts?.[lang] || item?.texts?.en || item?.en || ''
}
function blockText(block, lang = 'en') {
  return block?.texts?.[lang] || block?.texts?.en || block?.en || ''
}
function unique(list) { return [...new Set(list.filter(Boolean))] }

function wrapOutput(prompt, negative, mode, includeNegative, aspectRatio) {
  if (!prompt) return ''
  if (!includeNegative || mode === 'universal') return prompt
  if (mode === 'gpt') return `Use the attached architectural image as the locked reference when provided. ${prompt} Keep the response as a single final image instruction. Avoid these failures: ${negative}.`
  if (mode === 'midjourney') return `${prompt} --style raw --ar ${aspectRatio} --no ${negative}`
  if (mode === 'sd') return `POSITIVE PROMPT:\n${prompt}\n\nNEGATIVE PROMPT:\n${negative}`
  if (mode === 'krea') return `Enhance the provided architectural image using this direction:\n${prompt}\n\nPreserve the original project identity and avoid: ${negative}.`
  if (mode === 'client') return `Objetivo visual para cliente:\nConvertir la imagen o modelo arquitectónico en una visualización profesional, manteniendo la geometría y composición del proyecto.\n\nDirección creativa:\n${prompt}\n\nRestricciones importantes:\nNo modificar la volumetría, aberturas, proporciones ni estructura principal. Evitar: ${negative}.`
  return prompt
}

export default function PromptBuilder({ content, lang, onSaveFavorite, onSaveProject }) {
  const c = COPY[lang]
  const [actionCode, setActionCode] = useState('')
  const [preservationCode, setPreservationCode] = useState('')
  const [styleDimensionCodes, setStyleDimensionCodes] = useState([])
  const [selections, setSelections] = useState({})
  const [quality, setQuality] = useState({})
  const [outputMode, setOutputMode] = useState('universal')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [includeNegative, setIncludeNegative] = useState(true)
  const [projectName, setProjectName] = useState('')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('')

  const action = content.actions.find((item) => item.code === actionCode)
  const preservation = content.preservations.find((item) => item.code === preservationCode)
  const needsPreservation = Boolean(action?.needs_image)
  const totalQuality = Object.values(quality).reduce((sum, list) => sum + (list?.length || 0), 0)

  const basePrompt = useMemo(() => {
    const parts = []
    if (action) parts.push(promptText(action, 'en'))
    if (needsPreservation && preservation) parts.push(promptText(preservation, 'en'))
    if (action?.code === 'AC-07') {
      styleDimensionCodes.forEach((code) => {
        const item = content.styleDimensions.find((dimension) => dimension.code === code)
        if (item) parts.push(promptText(item, 'en'))
      })
    }
    content.categories.forEach((category) => {
      const selected = selections[category.key]
      if (Array.isArray(selected)) selected.forEach((block) => parts.push(blockText(block, 'en')))
      else if (selected) parts.push(blockText(selected, 'en'))
    })
    content.qualityGroups.forEach((group) => {
      const tags = totalQuality ? quality[group.key] || [] : group.optimal_tags || []
      parts.push(...tags)
    })
    return parts.filter(Boolean).join(' ')
  }, [action, preservation, needsPreservation, styleDimensionCodes, selections, quality, totalQuality, content])

  const translatedPrompt = useMemo(() => {
    if (lang === 'en') return ''
    const parts = []
    if (action) parts.push(promptText(action, lang))
    if (needsPreservation && preservation) parts.push(promptText(preservation, lang))
    if (action?.code === 'AC-07') styleDimensionCodes.forEach((code) => {
      const item = content.styleDimensions.find((dimension) => dimension.code === code)
      if (item) parts.push(promptText(item, lang))
    })
    content.categories.forEach((category) => {
      const selected = selections[category.key]
      if (Array.isArray(selected)) selected.forEach((block) => parts.push(blockText(block, lang)))
      else if (selected) parts.push(blockText(selected, lang))
    })
    content.qualityGroups.forEach((group) => {
      const tags = totalQuality ? quality[group.key] || [] : group.optimal_tags || []
      tags.forEach((tag) => {
        const tagObject = (group.tags || []).find((item) => item.en === tag)
        parts.push(tagObject?.[lang] || tag)
      })
    })
    return parts.filter(Boolean).join(' ')
  }, [lang, action, preservation, needsPreservation, styleDimensionCodes, selections, quality, totalQuality, content])

  const negativePrompt = useMemo(() => {
    const base = content.settings.negative_base || []
    const byPreservation = content.settings.negative_by_preservation?.[preservationCode] || []
    const style = actionCode === 'AC-07' ? ['copying the reference building geometry', 'replacing the base model with the style reference'] : []
    return unique([...base, ...byPreservation, ...style]).join(', ')
  }, [content.settings, preservationCode, actionCode])

  const finalPrompt = useMemo(() => wrapOutput(basePrompt, negativePrompt, outputMode, includeNegative, aspectRatio), [basePrompt, negativePrompt, outputMode, includeNegative, aspectRatio])

  function toggleBlock(category, block) {
    setSelections((current) => {
      if (!category.multi_select) {
        const currentSingle = current[category.key]
        return { ...current, [category.key]: currentSingle?.id === block.id ? null : block }
      }
      const list = Array.isArray(current[category.key]) ? current[category.key] : []
      const exists = list.some((item) => item.id === block.id)
      return { ...current, [category.key]: exists ? list.filter((item) => item.id !== block.id) : [...list, block] }
    })
  }

  function toggleQuality(groupKey, tag) {
    setQuality((current) => {
      const list = current[groupKey] || []
      return { ...current, [groupKey]: list.includes(tag) ? list.filter((item) => item !== tag) : [...list, tag] }
    })
  }

  function applyRecipe(recipe) {
    const config = recipe.config || {}
    setActionCode(config.accion || '')
    setPreservationCode(config.pres || '')
    setOutputMode(config.output || 'universal')
    setAspectRatio(config.aspectRatio || '16:9')
    setStyleDimensionCodes(config.styleDims || [])
    const next = {}
    Object.entries(config.sel || {}).forEach(([categoryKey, code]) => {
      const category = content.categories.find((item) => item.key === categoryKey)
      const block = category?.blocks.find((item) => item.code === code)
      if (block) next[categoryKey] = block
    })
    Object.entries(config.multi || {}).forEach(([categoryKey, codes]) => {
      const category = content.categories.find((item) => item.key === categoryKey)
      next[categoryKey] = codes.map((code) => category?.blocks.find((item) => item.code === code)).filter(Boolean)
    })
    setSelections(next)
    setStatus(`${text(recipe.names, lang, recipe.code)} ✓`)
  }

  function clearAll() {
    setActionCode(''); setPreservationCode(''); setStyleDimensionCodes([]); setSelections({}); setQuality({}); setOutputMode('universal'); setAspectRatio('16:9'); setIncludeNegative(true); setStatus('')
  }

  async function copyPrompt() {
    if (!finalPrompt) return
    await navigator.clipboard.writeText(finalPrompt)
    setCopied(true); setTimeout(() => setCopied(false), 1400)
  }

  async function saveFavorite() {
    if (!finalPrompt) return
    await onSaveFavorite({ favorite_type: 'prompt', payload: { text: finalPrompt, basePrompt, translatedPrompt, outputMode, actionCode, preservationCode, savedAt: new Date().toISOString() } })
    setStatus('★')
  }

  async function saveProject() {
    if (!projectName.trim()) return
    await onSaveProject(projectName.trim(), { 
      actionCode, 
      preservationCode, 
      styleDimensionCodes, 
      selections: Object.fromEntries(Object.entries(selections).map(([key, value]) => [key, Array.isArray(value) ? value.map((item) => item.code) : value?.code])), 
      quality, 
      outputMode, 
      aspectRatio, 
      includeNegative,
      promptText: finalPrompt,
      translatedPrompt: translatedPrompt
    })
    setProjectName(''); setStatus('Proyecto guardado ✓')
  }

  const aspects = content.settings.aspect_ratios || [{ code: '16:9', label: '16:9' }, { code: '9:16', label: '9:16' }, { code: '1:1', label: '1:1' }]

  return (
    <div className="builder-layout">
      <section className="builder-controls">
        <div className="toolbar card dark-card">
          <div><p className="eyebrow">WORKSPACE</p><h3>Constructor profesional</h3></div>
          <div className="toolbar-actions"><button className="button ghost" onClick={clearAll}>{c.clear}</button>{status && <span className="status-pill">{status}</span>}</div>
        </div>

        <section className="card">
          <div className="section-head"><div><span className="section-code">AC</span><h3>{c.action}</h3></div></div>
          <div className="choice-grid">
            {content.actions.map((item) => <button key={item.id} className={`choice ${actionCode === item.code ? 'active' : ''}`} onClick={() => { const next = actionCode === item.code ? '' : item.code; setActionCode(next); if (!item.needs_image) setPreservationCode('') }}><small>{item.code}</small><strong>{text(item.labels, lang, item.code)}</strong></button>)}
          </div>
        </section>

        {needsPreservation && <section className="card">
          <div className="section-head"><div><span className="section-code neutral">PR</span><h3>{c.preservation}</h3></div></div>
          <div className="choice-grid three">
            {content.preservations.map((item) => <button key={item.id} className={`choice ${preservationCode === item.code ? 'active' : ''}`} onClick={() => setPreservationCode(preservationCode === item.code ? '' : item.code)}><small>{item.code}</small><strong>{text(item.labels, lang, item.code)}</strong><span>{text(item.descriptions, lang)}</span></button>)}
          </div>
        </section>}

        {actionCode === 'AC-07' && <section className="card">
          <div className="section-head"><div><span className="section-code">SD</span><h3>Referencia de estilo</h3></div></div>
          <div className="tag-cloud">
            {content.styleDimensions.map((item) => <button key={item.id} className={`tag ${styleDimensionCodes.includes(item.code) ? 'active' : ''}`} onClick={() => setStyleDimensionCodes((list) => list.includes(item.code) ? list.filter((code) => code !== item.code) : [...list, item.code])}>{text(item.labels, lang, item.code)}</button>)}
          </div>
        </section>}

        <section className="card dark-card">
          <div className="section-head light"><div><span className="section-code">RX</span><h3>{c.recipe}</h3></div></div>
          <div className="recipe-grid">
            {content.recipes.map((recipe) => <button key={recipe.id} className="recipe" onClick={() => applyRecipe(recipe)}><small>{recipe.code}</small><strong>{text(recipe.names, lang, recipe.code)}</strong><span>{text(recipe.descriptions, lang)}</span></button>)}
          </div>
        </section>

        <div className="category-grid">
          {content.categories.map((category) => {
            const selected = selections[category.key]
            const selectedList = Array.isArray(selected) ? selected : selected ? [selected] : []
            return <section className="card category-card" key={category.id}>
              <div className="category-title"><span style={{ color: category.color }}>{category.key}</span><h3>{text(category.labels, lang, category.key)}</h3>{selectedList.length > 0 && <em>{selectedList.length} {c.selected}</em>}</div>
              <div className="block-list">
                {category.blocks.map((block) => {
                  const active = selectedList.some((item) => item.id === block.id)
                  return <button key={block.id} className={`block-option ${active ? 'active' : ''}`} onClick={() => toggleBlock(category, block)}><small>{block.code}</small><span>{blockText(block, lang)}</span></button>
                })}
              </div>
            </section>
          })}
        </div>

        <section className="card">
          <div className="section-head"><div><span className="section-code neutral">QF</span><h3>{c.quality}</h3></div><em className="status-pill">{totalQuality ? `${totalQuality} ${c.selected}` : c.optimal}</em></div>
          {content.qualityGroups.map((group) => <div className="quality-group" key={group.id}><h4>{text(group.labels, lang, group.key)}</h4><div className="tag-cloud">{(group.tags || []).map((tag) => <button key={tag.en} className={`tag ${(quality[group.key] || []).includes(tag.en) ? 'active' : ''}`} onClick={() => toggleQuality(group.key, tag.en)}>{tag[lang] || tag.en}</button>)}</div></div>)}
        </section>

        <section className="card">
          <div className="section-head"><div><span className="section-code neutral">OM</span><h3>{c.output}</h3></div></div>
          <div className="choice-grid three">
            {content.outputModes.map((mode) => <button key={mode.id} className={`choice compact ${outputMode === mode.code ? 'active' : ''}`} onClick={() => setOutputMode(mode.code)}><strong>{text(OUTPUT_LABELS[mode.code], lang, mode.code)}</strong></button>)}
          </div>
          {outputMode !== 'universal' && <label className="checkbox-row"><input type="checkbox" checked={includeNegative} onChange={(event) => setIncludeNegative(event.target.checked)} /> Incluir restricciones</label>}
          {outputMode === 'midjourney' && <div className="tag-cloud top-gap">{aspects.map((item) => <button key={item.code} className={`tag ${aspectRatio === item.code ? 'active' : ''}`} onClick={() => setAspectRatio(item.code)}>{item.label || item.code}</button>)}</div>}
        </section>
      </section>

      <aside className="result-column">
        <section className="result-card blueprint-panel">
          <div className="result-head"><span>{c.generated}</span><div><button className="button ghost small" onClick={saveFavorite} disabled={!finalPrompt}>{c.save}</button><button className="button primary small" onClick={copyPrompt} disabled={!finalPrompt}>{copied ? '✓' : c.copy}</button></div></div>
          <pre className="prompt-output">{finalPrompt || c.empty}</pre>
          {lang !== 'en' && translatedPrompt && <><h4>{c.translation}</h4><pre className="translation-output">{translatedPrompt}</pre></>}
          {finalPrompt && includeNegative && outputMode !== 'universal' && <><h4>{c.negative}</h4><pre className="negative-output">{negativePrompt}</pre></>}
          <div className="project-save"><input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder={c.projectName} /><button className="button ghost" onClick={saveProject} disabled={!projectName.trim()}>{c.saveProject}</button></div>
        </section>
      </aside>
    </div>
  )
}
