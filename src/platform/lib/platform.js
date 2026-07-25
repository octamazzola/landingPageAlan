import fallback from '../data/fallbackContent.json'
import { demoMode, isSupabaseConfigured, supabase } from './supabase'

const DEFAULT_MODULES = [
  { id: 'dashboard', slug: 'dashboard', module_type: 'dashboard', titles: { es: 'Inicio', en: 'Home', pt: 'Início' }, descriptions: { es: 'Resumen de la plataforma.', en: 'Platform overview.', pt: 'Resumo da plataforma.' }, icon: '⌂', sort_order: 0, published: true },
  { id: 'builder', slug: 'prompt-builder', module_type: 'prompt_builder', titles: { es: 'Constructor', en: 'Builder', pt: 'Construtor' }, descriptions: { es: 'Construcción profesional de prompts.', en: 'Professional prompt construction.', pt: 'Construção profissional de prompts.' }, icon: '▦', sort_order: 10, published: true },
  { id: 'bank', slug: 'professional-bank', module_type: 'prompt_bank', titles: { es: 'Banco profesional', en: 'Professional bank', pt: 'Banco profissional' }, descriptions: { es: 'Biblioteca completa de bloques.', en: 'Complete block library.', pt: 'Biblioteca completa de blocos.' }, icon: '☷', sort_order: 20, published: true },
  { id: 'projects', slug: 'projects', module_type: 'projects', titles: { es: 'Proyectos', en: 'Projects', pt: 'Projetos' }, descriptions: { es: 'Configuraciones guardadas.', en: 'Saved configurations.', pt: 'Configurações salvas.' }, icon: '◇', sort_order: 30, published: true },
  { id: 'favorites', slug: 'favorites', module_type: 'favorites', titles: { es: 'Favoritos', en: 'Favorites', pt: 'Favoritos' }, descriptions: { es: 'Prompts y bloques favoritos.', en: 'Favorite prompts and blocks.', pt: 'Prompts e blocos favoritos.' }, icon: '★', sort_order: 40, published: true },
  { id: 'updates', slug: 'updates', module_type: 'changelog', titles: { es: 'Novedades', en: 'Updates', pt: 'Novidades' }, descriptions: { es: 'Versiones y mejoras.', en: 'Versions and improvements.', pt: 'Versões e melhorias.' }, icon: '↗', sort_order: 50, published: true, badge: { es: 'VIVO', en: 'LIVE', pt: 'ATIVO' } },
]

const ACTION_PROMPTS = {
  'AC-01': {
    es: 'Transforma este render arquitectónico en una fotografía arquitectónica ultra realista.',
    pt: 'Transforme este render arquitetônico em uma fotografia arquitetônica ultra-realista.'
  },
  'AC-02': {
    es: 'Transforma esta vista de SketchUp en una fotografía arquitectónica ultra realista.',
    pt: 'Transforme esta vista do SketchUp em uma fotografia arquitetônica ultra-realista.'
  },
  'AC-03': {
    es: 'Genera una visualización arquitectónica ultra realista a partir de este croquis conceptual.',
    pt: 'Gere uma visualização arquitetônica ultra-realista a partir deste esboço conceitual.'
  },
  'AC-04': {
    es: 'Mejora y reinterpreta este render arquitectónico como una imagen final fotorrealista.',
    pt: 'Aprimore e reinterprete este render arquitetônico como uma imagem final fotorrealista.'
  },
  'AC-05': {
    es: 'Genera un nuevo render arquitectónico fotorrealista basado en esta imagen de referencia.',
    pt: 'Gere um novo render arquitetônico fotorrealista com base nesta imagem de referência.'
  },
  'AC-06': {
    es: 'Genera una visualización arquitectónica fotorrealista.',
    pt: 'Gere uma visualização arquitetônica fotorrealista.'
  },
  'AC-07': {
    es: 'Usando el modelo arquitectónico proporcionado como geometría base, aplica el estilo visual, los materiales, la paleta de color y la atmósfera de la imagen de referencia.',
    pt: 'Usando o modelo arquitetônico fornecido como geometria base, aplique o estilo visual, os materiais, a paleta de cores e a atmosfera da imagem de referência.'
  }
}

const PRESERVATION_PROMPTS = {
  'PR-01': {
    es: 'Preserva estrictamente la geometría original, las proporciones, la composición y la organización espacial. No alteres elementos estructurales, aberturas ni relaciones volumétricas. Aplica únicamente cambios superficiales como materiales, iluminación y atmósfera.',
    pt: 'Preserve estritamente a geometria original, as proporções, a composição e a organização espacial. Não altere elementos estruturais, aberturas nem relações volumétricas. Aplique apenas mudanças superficiais, como materiais, iluminação e atmosfera.'
  },
  'PR-02': {
    es: 'Mantén la composición general y los elementos estructurales principales. Permite una deconstrucción creativa de materiales, iluminación, atmósfera y detalles secundarios. Si se proporciona una imagen de estilo, extrae su paleta cromática, lenguaje material y mood, y aplícalos al modelo base.',
    pt: 'Mantenha a composição geral e os principais elementos estruturais. Permita uma reinterpretação criativa de materiais, iluminação, atmosfera e detalhes secundários. Se uma imagem de estilo for fornecida, extraia sua paleta cromática, linguagem material e mood, e aplique ao modelo base.'
  },
  'PR-03': {
    es: 'Usa el modelo base solo como una referencia espacial flexible. Reinterpreta libremente materiales, iluminación, atmósfera, elementos de escala y detalles secundarios para lograr la máxima calidad visual. Si se proporciona una imagen de estilo, absorbe completamente su lenguaje estético.',
    pt: 'Use o modelo base apenas como uma referência espacial flexível. Reinterprete livremente materiais, iluminação, atmosfera, elementos de escala e detalhes secundários para alcançar a máxima qualidade visual. Se uma imagem de estilo for fornecida, absorva completamente sua linguagem estética.'
  }
}

const STYLE_DIM_PROMPTS = {
  'SD-01': {
    es: 'Extrae únicamente la paleta material de la imagen de referencia: terminaciones, texturas y combinaciones de materiales. No transfieras su iluminación, atmósfera ni paisaje.',
    pt: 'Extraia apenas a paleta material da imagem de referência: acabamentos, texturas e combinações de materiais. Não transfira sua iluminação, atmosfera nem paisagem.'
  },
  'SD-02': {
    es: 'Extrae únicamente la paleta de color de la imagen de referencia: tonos dominantes, rango tonal, equilibrio cálido/frío y relaciones cromáticas. No transfieras sus materiales, iluminación ni composición espacial.',
    pt: 'Extraia apenas a paleta de cores da imagem de referência: tons dominantes, faixa tonal, equilíbrio quente/frio e relações cromáticas. Não transfira seus materiais, iluminação nem composição espacial.'
  },
  'SD-03': {
    es: 'Extrae únicamente el paisaje y el contexto de la imagen de referencia: vegetación, terreno, cielo y elementos ambientales. No transfieras sus materiales, terminaciones interiores ni iluminación artificial.',
    pt: 'Extraia apenas a paisagem e o contexto da imagem de referência: vegetação, terreno, céu e elementos ambientais. Não transfira seus materiais, acabamentos interiores nem iluminação artificial.'
  },
  'SD-04': {
    es: 'Extrae únicamente la calidad de luz y las condiciones climáticas de la imagen de referencia: dirección, intensidad, hora del día, calidad de sombra y atmósfera. No transfieras sus materiales ni paisaje.',
    pt: 'Extraia apenas a qualidade da luz e as condições climáticas da imagem de referência: direção, intensidade, hora do dia, qualidade das sombras e atmosfera. Não transfira seus materiais nem paisagem.'
  },
  'SD-05': {
    es: 'Extrae el mood general y la atmósfera de la imagen de referencia: tono emocional, sensación de escala, presencia humana y calidad narrativa. Aplica esa sensación al modelo base sin copiar materiales ni paisaje específicos.',
    pt: 'Extraia o mood geral e a atmosfera da imagem de referência: tom emocional, sensação de escala, presença humana e qualidade narrativa. Aplique essa sensação ao modelo base sem copiar materiais nem paisagem específicos.'
  },
  'SD-06': {
    es: 'Extrae únicamente el lenguaje arquitectónico de la imagen de referencia: composición formal, relaciones de masa, ritmo de fachada y sistema proporcional. No transfieras materiales ni paleta cromática específicos.',
    pt: 'Extraia apenas a linguagem arquitetônica da imagem de referência: composição formal, relações de massa, ritmo de fachada e sistema proporcional. Não transfira materiais nem paleta cromática específicos.'
  },
  'SD-07': {
    es: 'Extrae el estilo fotográfico y de render de la imagen de referencia: ángulo de cámara, características de lente, profundidad de campo, posproducción y tratamiento visual general.',
    pt: 'Extraia o estilo fotográfico e de render da imagem de referência: ângulo de câmera, características da lente, profundidade de campo, pós-produção e tratamento visual geral.'
  }
}

function mapFallback() {
  const categories = fallback.CAT_ORDER.map((key, index) => ({
    id: key,
    key,
    labels: fallback.CATS[key].name,
    color: fallback.CATS[key].color,
    multi_select: fallback.CATS[key].multi,
    sort_order: index,
    blocks: fallback.CATS[key].blocks.map((b, blockIndex) => ({
      id: `${key}-${b.code}`,
      category_id: key,
      code: b.code,
      texts: { en: b.en, es: b.es, pt: b.pt },
      descriptions: {},
      sort_order: blockIndex,
      published: true,
    })),
  }))

  return {
    source: 'fallback',
    modules: DEFAULT_MODULES,
    categories,
    actions: fallback.ACCION_DATA.map((a, index) => ({ 
      id: a.code, 
      ...a, 
      labels: { en: a.en, es: a.es, pt: a.pt }, 
      prompt_texts: { en: a.en, es: ACTION_PROMPTS[a.code]?.es || a.en, pt: ACTION_PROMPTS[a.code]?.pt || a.en }, 
      sort_order: index 
    })),
    preservations: fallback.PRES_DATA.map((p, index) => ({ 
      id: p.code, 
      ...p, 
      labels: { en: p.en, es: p.es, pt: p.pt }, 
      prompt_texts: { en: p.en, es: PRESERVATION_PROMPTS[p.code]?.es || p.en, pt: PRESERVATION_PROMPTS[p.code]?.pt || p.en }, 
      descriptions: { es: p.desc_es, pt: p.desc_pt }, 
      sort_order: index 
    })),
    styleDimensions: fallback.STYLE_DIMS.map((d, index) => ({ 
      id: d.code, 
      ...d, 
      labels: { en: d.en, es: d.es, pt: d.pt }, 
      prompt_texts: { en: d.en, es: STYLE_DIM_PROMPTS[d.code]?.es || d.en, pt: STYLE_DIM_PROMPTS[d.code]?.pt || d.en }, 
      descriptions: { es: d.desc_es, pt: d.desc_pt }, 
      sort_order: index 
    })),
    outputModes: fallback.OUTPUT_MODES.map((m, index) => ({ id: m.code, code: m.code, labels: { en: m.key, es: m.key, pt: m.key }, sort_order: index })),
    recipes: fallback.QUICK_RECIPES.map((r, index) => ({ id: r.code, code: r.code, names: r.name, descriptions: r.desc, config: r, sort_order: index })),
    qualityGroups: fallback.Q_ORDER.map((key, index) => ({ id: key, key, labels: fallback.QTAGS[key].label, tags: fallback.QTAGS[key].tags, optimal_tags: fallback.OPTIMAL_PRESET[key] || [], sort_order: index })),
    settings: {
      negative_base: fallback.NEGATIVE_BASE,
      negative_by_preservation: fallback.NEGATIVE_BY_PRES,
      aspect_ratios: fallback.ASPECT_RATIOS,
    },
    changelog: [
      { id: '1.0.0', version: '1.0.0', titles: { es: 'Primera plataforma modular', en: 'First modular platform', pt: 'Primeira plataforma modular' }, items: { es: ['Acceso por email', 'Módulos administrables', 'Contenido conectado a Supabase'], en: ['Email access', 'Admin-managed modules', 'Supabase-backed content'], pt: ['Acesso por e-mail', 'Módulos administráveis', 'Conteúdo conectado ao Supabase'] }, published_at: new Date().toISOString() },
    ],
  }
}

const FALLBACK = mapFallback()

async function rows(table, columns = '*', options = {}) {
  let query = supabase.from(table).select(columns)
  if (options.order) query = query.order(options.order, { ascending: options.ascending !== false })
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function loadPlatformContent() {
  if (!isSupabaseConfigured || demoMode) return FALLBACK
  try {
    const [modules, categories, blocks, actions, preservations, styleDimensions, outputModes, recipes, qualityGroups, settingsRows, changelog] = await Promise.all([
      rows('modules', '*', { order: 'sort_order' }),
      rows('categories', '*', { order: 'sort_order' }),
      rows('prompt_blocks', '*', { order: 'sort_order' }),
      rows('actions', '*', { order: 'sort_order' }),
      rows('preservations', '*', { order: 'sort_order' }),
      rows('style_dimensions', '*', { order: 'sort_order' }),
      rows('output_modes', '*', { order: 'sort_order' }),
      rows('recipes', '*', { order: 'sort_order' }),
      rows('quality_groups', '*', { order: 'sort_order' }),
      rows('app_settings'),
      rows('changelog', '*', { order: 'published_at', ascending: false }),
    ])
    const settings = Object.fromEntries(settingsRows.map((item) => [item.key, item.value]))
    const categoryMap = new Map(categories.map((category) => [category.id, { ...category, blocks: [] }]))
    blocks.forEach((block) => categoryMap.get(block.category_id)?.blocks.push(block))
    return {
      source: 'supabase', modules, categories: [...categoryMap.values()], actions, preservations,
      styleDimensions, outputModes, recipes, qualityGroups, settings, changelog,
    }
  } catch (error) {
    console.error('Falling back to embedded content:', error)
    return { ...FALLBACK, source: 'fallback-error', loadError: error.message }
  }
}

export async function loadProfile(userId) {
  if (!isSupabaseConfigured || demoMode) return { id: 'demo-user', email: 'admin@visualpromptstudio.demo', display_name: 'Administrador demo', role: 'admin', plan_slug: 'studio_pro', expires_at: null }
  const [{ data: profile, error: profileError }, { data: entitlements, error: entitlementError }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_entitlements').select('*, plans(*)').eq('user_id', userId).eq('active', true).order('expires_at', { ascending: false, nullsFirst: true }),
  ])
  if (profileError) throw profileError
  if (entitlementError) throw entitlementError
  const entitlement = (entitlements || []).find((item) => !item.expires_at || new Date(item.expires_at) > new Date())
  return { ...profile, plan_slug: entitlement?.plan_slug || null, expires_at: entitlement?.expires_at || null, entitlement }
}

export async function loadUserWorkspace(userId) {
  if (!isSupabaseConfigured || demoMode) {
    const read = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } }
    return { favorites: read('vps_demo_favorites'), projects: read('vps_demo_projects'), customBlocks: read('vps_demo_custom_blocks') }
  }
  const [favorites, projects, customBlocks] = await Promise.all([
    rowsForUser('favorites', userId), rowsForUser('projects', userId), rowsForUser('custom_blocks', userId),
  ])
  return { favorites, projects, customBlocks }
}

async function rowsForUser(table, userId) {
  const { data, error } = await supabase.from(table).select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function saveFavorite(userId, favorite) {
  if (!isSupabaseConfigured || demoMode) return saveLocalCollection('vps_demo_favorites', favorite)
  const payload = { user_id: userId, favorite_type: favorite.favorite_type, payload: favorite.payload }
  const { data, error } = await supabase.from('favorites').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function deleteFavorite(id) {
  if (!isSupabaseConfigured || demoMode) return deleteLocalCollection('vps_demo_favorites', id)
  const { error } = await supabase.from('favorites').delete().eq('id', id)
  if (error) throw error
}

export async function saveProject(userId, name, snapshot) {
  if (!isSupabaseConfigured || demoMode) return saveLocalCollection('vps_demo_projects', { name, snapshot })
  const { data, error } = await supabase.from('projects').insert({ user_id: userId, name, snapshot }).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  if (!isSupabaseConfigured || demoMode) return deleteLocalCollection('vps_demo_projects', id)
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

function saveLocalCollection(key, item) {
  const collection = JSON.parse(localStorage.getItem(key) || '[]')
  const record = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item }
  localStorage.setItem(key, JSON.stringify([record, ...collection]))
  return record
}
function deleteLocalCollection(key, id) {
  const collection = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify(collection.filter((item) => item.id !== id)))
}

export async function adminList(table) {
  if (!isSupabaseConfigured || demoMode) return []
  return rows(table, '*', { order: table === 'changelog' ? 'published_at' : 'sort_order' })
}

export async function adminUpsert(table, record) {
  if (!isSupabaseConfigured || demoMode) throw new Error('El panel demo no escribe en Supabase.')
  const clean = Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined))
  const { data, error } = await supabase.from(table).upsert(clean).select().single()
  if (error) throw error
  return data
}

export async function adminDelete(table, id) {
  if (!isSupabaseConfigured || demoMode) throw new Error('El panel demo no escribe en Supabase.')
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
