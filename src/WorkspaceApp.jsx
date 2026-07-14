// ════════════════════════════════════════════════════════════════════════
//  VISUAL PROMPT STUDIO — APP (workspace)
//  Proyecto 2/2: constructor de prompts, banco de bloques y favoritos.
//  Requiere que el usuario llegue con `vps_active_user` en localStorage
//  (lo setea el proyecto "inicio" al enviar el formulario de acceso).
//  Si no existe, funciona igual con el scope "manual-client".
// ════════════════════════════════════════════════════════════════════════
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── UI TRANSLATIONS ────────────────────────────────────────────────────────
const T = {
  en: {
    title:"VISUAL PROMPT STUDIO", sub:"Geometry lock · AI output modes · Quick recipes · Final quality",
    tabHome:"Home", tabBuilder:"Builder", tabBank:"Full Bank", tabFavorites:"Favorites",
    randomize:"⟲ Random combination", clearAll:"Clear all",
    acLabel:"ACTION", prLabel:"PRESERVATION", prNote:"— only applies when starting from an image",
    qfLabel:"FINAL QUALITY", qfClear:"Clear quality", qfOptimal:"Optimal quality preset active",
    qfFavSave:"Save quality preset", qfFavName:"Name for this preset…", qfFavAdd:"Save", qfFavCancel:"Cancel",
    resultLabel:"GENERATED PROMPT", resultTranslation:"Translation",
    savePrompt:"★ Save", copy:"Copy", copied:"✓ Copied",
    searchPlaceholder:"Search by keyword…",
    addBlock:"+ Add new block", addBlockEn:"Block text (English)…", addBlockDesc:"Description (optional)…",
    addConfirm:"Add", addCancel:"Cancel",
    emptyFav:"Nothing saved yet. Use ★ in the builder or bank.",
    savedPrompts:"SAVED PROMPTS", savedQuality:"SAVED QUALITY PRESETS",
    useInBuilder:"Use in builder", remove:"Remove", loadPreset:"Load",
    noResults:"No results", translating:"Translating…",
    promptPlaceholder:"Select Action and at least one block to build the prompt…",
    selectBlock:"— choose —", clearSel:"✕", multiSelect:"(multi-select)",
    qfSelected:(n)=>`${n} selected`,
    styleDimsLabel:"WHAT TO EXTRACT FROM REFERENCE",
    styleDimsNote:"— select one or more dimensions (AC-07 only)",
    styleDimsClear:"Clear",
    outputLabel:"OUTPUT MODE", outputNote:"— adapt the generated prompt to each AI workflow", outputUniversal:"Universal", outputGPT:"GPT Image / ChatGPT", outputMJ:"Midjourney", outputSD:"Flux / Stable Diffusion", outputKrea:"Krea / Magnific", outputClient:"Client explanation",
    negativeLabel:"NEGATIVE PROMPT", negativeInclude:"Include restrictions", negativeCopy:"Copy negative", negativeCopied:"✓ Negative copied",
    recipeLabel:"QUICK RECIPES", recipeNote:"— start from a professional workflow and adjust details", recipeApply:"Apply recipe",
    scoreLabel:"PROMPT CHECK", scoreGeo:"Geometry protection", scoreMat:"Material definition", scoreCam:"Camera definition", scoreLight:"Lighting definition", scoreRisk:"Overload risk", scoreLow:"Low", scoreMedium:"Medium", scoreHigh:"High", scoreMissing:"Missing", scoreOk:"OK", scoreImprove:"Improve",
    exportBase:"Base prompt", exportMode:"Adapted output",
    headerEyebrow:"PROFESSIONAL AI ARCHITECTURAL VISUALIZATION SYSTEM",
    workspaceControls:"{t.workspaceControls}", workspaceNote:"Build, randomize, refine and copy a studio-grade prompt.",
    blocksLabel:"BLOCKS", outputStatus:"OUTPUT", chooseAction:"Select an action", choosePreservation:"Select preservation", noPresNeeded:"No preservation needed", waitingAction:"Waiting for action", interfaceReady:"interface", translationReady:"translation ready",
    qualityTagsSelected:(n)=>`${n} quality tags selected`, selectedItems:(n)=>`${n} selected`, clearSelection:"clear", removed:"Removed", loading:"Loading…",
    promptEnglish:"ENGLISH PROMPT", copyEnglish:"Copy English", copyTranslation:"Copy translation", copiedTranslation:"✓ Translation copied", savedPromptCopied:"✓ Saved prompt copied",
    aspectLabel:"ASPECT RATIO", aspectNote:"— Midjourney only", scoreNA:"N/A",
    projectsLabel:"PROJECTS", projectName:"Project name…", saveProject:"Save project", savedProjects:"Saved projects", loadProject:"Load project", noProjects:"No projects saved yet.", projectSaved:"✓ Project saved", projectLoaded:"✓ Project loaded",
  },
  es: {
    title:"VISUAL PROMPT STUDIO", sub:"Bloqueo geométrico · Modos de IA · Recetas rápidas · Calidad final",
    tabHome:"Inicio", tabBuilder:"Constructor", tabBank:"Banco completo", tabFavorites:"Favoritos",
    randomize:"⟲ Combinación aleatoria", clearAll:"Limpiar todo",
    acLabel:"ACCIÓN", prLabel:"PRESERVACIÓN", prNote:"— solo aplica cuando partís de una imagen",
    qfLabel:"CALIDAD FINAL", qfClear:"Limpiar calidad", qfOptimal:"Preset de calidad óptima activo",
    qfFavSave:"Guardar preset de calidad", qfFavName:"Nombre para este preset…", qfFavAdd:"Guardar", qfFavCancel:"Cancelar",
    resultLabel:"PROMPT RESULTANTE", resultTranslation:"Traducción",
    savePrompt:"★ Guardar", copy:"Copiar", copied:"✓ Copiado",
    searchPlaceholder:"Buscar por palabra clave…",
    addBlock:"+ Agregar bloque nuevo", addBlockEn:"Bloque en inglés…", addBlockDesc:"Descripción (opcional)…",
    addConfirm:"Agregar", addCancel:"Cancelar",
    emptyFav:"Todavía no guardaste nada. Usá ★ en el constructor o en el banco.",
    savedPrompts:"PROMPTS GUARDADOS", savedQuality:"PRESETS DE CALIDAD GUARDADOS",
    useInBuilder:"Usar en constructor", remove:"Quitar", loadPreset:"Cargar",
    noResults:"Sin resultados", translating:"Traduciendo…",
    promptPlaceholder:"Seleccioná Acción y al menos un bloque para armar el prompt…",
    selectBlock:"— elegir —", clearSel:"✕", multiSelect:"(multi-selección)",
    qfSelected:(n)=>`${n} seleccionado${n>1?"s":""}`,
    styleDimsLabel:"QUÉ TOMAR DE LA REFERENCIA",
    styleDimsNote:"— seleccioná una o más dimensiones (solo AC-07)",
    styleDimsClear:"Limpiar",
    outputLabel:"MODO DE SALIDA", outputNote:"— adaptá el prompt generado a cada flujo de IA", outputUniversal:"Universal", outputGPT:"GPT Image / ChatGPT", outputMJ:"Midjourney", outputSD:"Flux / Stable Diffusion", outputKrea:"Krea / Magnific", outputClient:"Explicación para cliente",
    negativeLabel:"NEGATIVE PROMPT", negativeInclude:"Incluir restricciones", negativeCopy:"Copiar negative", negativeCopied:"✓ Negative copiado",
    recipeLabel:"RECETAS RÁPIDAS", recipeNote:"— arrancá desde un flujo profesional y ajustá detalles", recipeApply:"Aplicar receta",
    scoreLabel:"CHEQUEO DEL PROMPT", scoreGeo:"Protección geométrica", scoreMat:"Definición material", scoreCam:"Definición de cámara", scoreLight:"Definición de luz", scoreRisk:"Riesgo de sobrecarga", scoreLow:"Bajo", scoreMedium:"Medio", scoreHigh:"Alto", scoreMissing:"Falta", scoreOk:"OK", scoreImprove:"Mejorar",
    exportBase:"Prompt base", exportMode:"Salida adaptada",
    headerEyebrow:"SISTEMA PROFESIONAL DE VISUALIZACIÓN ARQUITECTÓNICA CON IA",
    workspaceControls:"CONTROLES DEL WORKSPACE", workspaceNote:"Construí, ajustá y copiá un prompt de nivel estudio.",
    blocksLabel:"BLOQUES", outputStatus:"SALIDA", chooseAction:"Seleccionar una acción", choosePreservation:"Seleccionar preservación", noPresNeeded:"No requiere preservación", waitingAction:"Esperando acción", interfaceReady:"interfaz", translationReady:"traducción lista",
    qualityTagsSelected:(n)=>`${n} etiquetas de calidad seleccionadas`, selectedItems:(n)=>`${n} seleccionado${n>1?"s":""}`, clearSelection:"limpiar", removed:"Quitado", loading:"Cargando…",
    promptEnglish:"PROMPT EN INGLÉS", copyEnglish:"Copiar inglés", copyTranslation:"Copiar traducción", copiedTranslation:"✓ Traducción copiada", savedPromptCopied:"✓ Prompt guardado copiado",
    aspectLabel:"RELACIÓN DE ASPECTO", aspectNote:"— solo Midjourney", scoreNA:"No aplica",
    projectsLabel:"PROYECTOS", projectName:"Nombre del proyecto…", saveProject:"Guardar proyecto", savedProjects:"Proyectos guardados", loadProject:"Cargar proyecto", noProjects:"Todavía no guardaste proyectos.", projectSaved:"✓ Proyecto guardado", projectLoaded:"✓ Proyecto cargado",
  },
  pt: {
    title:"VISUAL PROMPT STUDIO", sub:"Bloqueio geométrico · Modos de IA · Receitas rápidas · Qualidade final",
    tabHome:"Início", tabBuilder:"Construtor", tabBank:"Banco completo", tabFavorites:"Favoritos",
    randomize:"⟲ Combinação aleatória", clearAll:"Limpar tudo",
    acLabel:"AÇÃO", prLabel:"PRESERVAÇÃO", prNote:"— aplica-se apenas quando parte de uma imagem",
    qfLabel:"QUALIDADE FINAL", qfClear:"Limpar qualidade", qfOptimal:"Preset de qualidade ótima ativo",
    qfFavSave:"Guardar preset de qualidade", qfFavName:"Nome para este preset…", qfFavAdd:"Guardar", qfFavCancel:"Cancelar",
    resultLabel:"PROMPT GERADO", resultTranslation:"Tradução",
    savePrompt:"★ Guardar", copy:"Copiar", copied:"✓ Copiado",
    searchPlaceholder:"Buscar por palavra-chave…",
    addBlock:"+ Adicionar bloco", addBlockEn:"Bloco em inglês…", addBlockDesc:"Descrição (opcional)…",
    addConfirm:"Adicionar", addCancel:"Cancelar",
    emptyFav:"Ainda não guardou nada. Use ★ no construtor ou no banco.",
    savedPrompts:"PROMPTS GUARDADOS", savedQuality:"PRESETS DE QUALIDADE GUARDADOS",
    useInBuilder:"Usar no construtor", remove:"Remover", loadPreset:"Carregar",
    noResults:"Sem resultados", translating:"Traduzindo…",
    promptPlaceholder:"Selecione Ação e pelo menos um bloco para montar o prompt…",
    selectBlock:"— escolher —", clearSel:"✕", multiSelect:"(multi-seleção)",
    qfSelected:(n)=>`${n} selecionado${n>1?"s":""}`,
    styleDimsLabel:"O QUE EXTRAIR DA REFERÊNCIA",
    styleDimsNote:"— selecione uma ou mais dimensões (apenas AC-07)",
    styleDimsClear:"Limpar",
    outputLabel:"MODO DE SAÍDA", outputNote:"— adapte o prompt gerado a cada fluxo de IA", outputUniversal:"Universal", outputGPT:"GPT Image / ChatGPT", outputMJ:"Midjourney", outputSD:"Flux / Stable Diffusion", outputKrea:"Krea / Magnific", outputClient:"Explicação para cliente",
    negativeLabel:"NEGATIVE PROMPT", negativeInclude:"Incluir restrições", negativeCopy:"Copiar negative", negativeCopied:"✓ Negative copiado",
    recipeLabel:"RECEITAS RÁPIDAS", recipeNote:"— comece com um fluxo profissional e ajuste os detalhes", recipeApply:"Aplicar receita",
    scoreLabel:"VERIFICAÇÃO DO PROMPT", scoreGeo:"Proteção geométrica", scoreMat:"Definição material", scoreCam:"Definição de câmera", scoreLight:"Definição de luz", scoreRisk:"Risco de sobrecarga", scoreLow:"Baixo", scoreMedium:"Médio", scoreHigh:"Alto", scoreMissing:"Falta", scoreOk:"OK", scoreImprove:"Melhorar",
    exportBase:"Prompt base", exportMode:"Saída adaptada",
    headerEyebrow:"SISTEMA PROFISSIONAL DE VISUALIZAÇÃO ARQUITETÔNICA COM IA",
    workspaceControls:"CONTROLES DO WORKSPACE", workspaceNote:"Construa, ajuste e copie um prompt de nível estúdio.",
    blocksLabel:"BLOCOS", outputStatus:"SAÍDA", chooseAction:"Selecionar uma ação", choosePreservation:"Selecionar preservação", noPresNeeded:"Não requer preservação", waitingAction:"Aguardando ação", interfaceReady:"interface", translationReady:"tradução pronta",
    qualityTagsSelected:(n)=>`${n} etiquetas de qualidade selecionadas`, selectedItems:(n)=>`${n} selecionado${n>1?"s":""}`, clearSelection:"limpar", removed:"Removido", loading:"Carregando…",
    promptEnglish:"PROMPT EM INGLÊS", copyEnglish:"Copiar inglês", copyTranslation:"Copiar tradução", copiedTranslation:"✓ Tradução copiada", savedPromptCopied:"✓ Prompt guardado copiado",
    aspectLabel:"PROPORÇÃO DA IMAGEM", aspectNote:"— apenas Midjourney", scoreNA:"Não se aplica",
    projectsLabel:"PROJETOS", projectName:"Nome do projeto…", saveProject:"Guardar projeto", savedProjects:"Projetos guardados", loadProject:"Carregar projeto", noProjects:"Ainda não há projetos guardados.", projectSaved:"✓ Projeto guardado", projectLoaded:"✓ Projeto carregado",
  },
};


const DISPLAY_FONT = '"Archivo Expanded", "Archivo", Arial, sans-serif';
const BODY_FONT = '"IBM Plex Sans", Calibri, Arial, sans-serif';
const MONO_FONT = '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace';
const QTAGS = {
  nivel_profesional:{
    label:{en:"Professional level",es:"Nivel profesional",pt:"Nível profissional"},
    tags:[
      {en:"ultra-photorealistic",es:"ultra-fotorrealista",pt:"ultra-fotorrealista"},
      {en:"hyper-realistic",es:"híper-realista",pt:"híper-realista"},
      {en:"photorealistic",es:"fotorrealista",pt:"fotorrealista"},
      {en:"extremely realistic",es:"extremadamente realista",pt:"extremamente realista"},
      {en:"high-end visualization",es:"visualización de alto nivel",pt:"visualização de alto nível"},
      {en:"premium visualization",es:"visualización premium",pt:"visualização premium"},
      {en:"competition-quality",es:"calidad de concurso",pt:"qualidade de concurso"},
      {en:"award-winning quality",es:"calidad premiada",pt:"qualidade premiada"},
      {en:"studio-quality",es:"calidad de estudio",pt:"qualidade de estúdio"},
      {en:"production-quality",es:"calidad de producción",pt:"qualidade de produção"},
      {en:"publication-ready",es:"listo para publicación",pt:"pronto para publicação"},
      {en:"gallery-quality",es:"calidad de galería",pt:"qualidade de galeria"},
    ],
  },
  calidad_tecnica:{
    label:{en:"Technical quality",es:"Calidad técnica",pt:"Qualidade técnica"},
    tags:[
      {en:"physically accurate rendering",es:"render físicamente preciso",pt:"render fisicamente preciso"},
      {en:"physically based materials (PBR)",es:"materiales basados en física (PBR)",pt:"materiais baseados em física (PBR)"},
      {en:"accurate global illumination",es:"iluminación global precisa",pt:"iluminação global precisa"},
      {en:"ray-traced reflections",es:"reflexiones trazadas por rayos",pt:"reflexos com ray-tracing"},
      {en:"soft realistic shadows",es:"sombras suaves y realistas",pt:"sombras suaves e realistas"},
      {en:"high dynamic range lighting (HDRI)",es:"iluminación de alto rango dinámico (HDRI)",pt:"iluminação de alto alcance dinâmico (HDRI)"},
      {en:"cinematic color grading",es:"gradación de color cinematográfica",pt:"gradação de cor cinematográfica"},
      {en:"natural white balance",es:"balance de blancos natural",pt:"balanço de branco natural"},
      {en:"realistic exposure",es:"exposición realista",pt:"exposição realista"},
      {en:"professional post-processing",es:"postprocesado profesional",pt:"pós-processamento profissional"},
      {en:"subsurface scattering",es:"dispersión subsuperficial",pt:"dispersão subsuperficial"},
      {en:"ambient occlusion",es:"oclusión ambiental",pt:"oclusão ambiental"},
    ],
  },
  nivel_detalle:{
    label:{en:"Detail level",es:"Nivel de detalle",pt:"Nível de detalhe"},
    tags:[
      {en:"extremely detailed",es:"extremadamente detallado",pt:"extremamente detalhado"},
      {en:"ultra detailed",es:"ultra detallado",pt:"ultra detalhado"},
      {en:"rich in micro-details",es:"rico en micro-detalles",pt:"rico em micro-detalhes"},
      {en:"fine architectural detailing",es:"detalles arquitectónicos finos",pt:"detalhamento arquitetônico fino"},
      {en:"high texture fidelity",es:"alta fidelidad de texturas",pt:"alta fidelidade de texturas"},
      {en:"crisp edges",es:"bordes nítidos",pt:"arestas nítidas"},
      {en:"sharp focus",es:"foco nítido",pt:"foco nítido"},
      {en:"realistic imperfections",es:"imperfecciones realistas",pt:"imperfeições realistas"},
      {en:"authentic material aging",es:"envejecimiento auténtico de materiales",pt:"envelhecimento autêntico de materiais"},
      {en:"high-resolution details",es:"detalles de alta resolución",pt:"detalhes de alta resolução"},
      {en:"intricate surface details",es:"detalles superficiales intrincados",pt:"detalhes de superfície intrincados"},
      {en:"detailed landscaping",es:"paisajismo detallado",pt:"paisagismo detalhado"},
    ],
  },
  acabado_fotografico:{
    label:{en:"Photographic finish",es:"Acabado fotográfico",pt:"Acabamento fotográfico"},
    tags:[
      {en:"indistinguishable from real photography",es:"indistinguible de fotografía real",pt:"indistinguível de fotografia real"},
      {en:"DSLR-quality photograph",es:"fotografía calidad DSLR",pt:"fotografia qualidade DSLR"},
      {en:"medium-format photography",es:"fotografía de formato medio",pt:"fotografia de médio formato"},
      {en:"editorial-quality architecture photography",es:"fotografía de arquitectura editorial",pt:"fotografia de arquitetura editorial"},
      {en:"magazine-quality image",es:"imagen calidad revista",pt:"imagem qualidade revista"},
      {en:"Architectural Digest quality",es:"calidad Architectural Digest",pt:"qualidade Architectural Digest"},
      {en:"Dezeen editorial style",es:"estilo editorial Dezeen",pt:"estilo editorial Dezeen"},
      {en:"ArchDaily publication quality",es:"calidad publicación ArchDaily",pt:"qualidade publicação ArchDaily"},
      {en:"professional commercial photography",es:"fotografía comercial profesional",pt:"fotografia comercial profissional"},
      {en:"luxury real estate marketing image",es:"imagen de marketing inmobiliario de lujo",pt:"imagem de marketing imobiliário de luxo"},
    ],
  },
  calidad_ia:{
    label:{en:"AI quality",es:"Calidad IA",pt:"Qualidade IA"},
    tags:[
      {en:"8K",es:"8K",pt:"8K"},
      {en:"16K",es:"16K",pt:"16K"},
      {en:"ultra HD",es:"ultra HD",pt:"ultra HD"},
      {en:"maximum realism",es:"máximo realismo",pt:"máximo realismo"},
      {en:"highest quality",es:"máxima calidad",pt:"máxima qualidade"},
      {en:"best quality",es:"mejor calidad",pt:"melhor qualidade"},
      {en:"exceptional image quality",es:"calidad de imagen excepcional",pt:"qualidade de imagem excepcional"},
      {en:"premium output",es:"salida premium",pt:"saída premium"},
      {en:"maximum detail",es:"máximo detalle",pt:"máximo detalhe"},
      {en:"noise-free",es:"sin ruido",pt:"sem ruído"},
      {en:"artifact-free",es:"sin artefactos",pt:"sem artefatos"},
      {en:"perfect rendering",es:"renderizado perfecto",pt:"renderização perfeita"},
    ],
  },
};
const Q_ORDER = ["nivel_profesional","calidad_tecnica","nivel_detalle","acabado_fotografico","calidad_ia"];

const OPTIMAL_PRESET = {
  nivel_profesional:["ultra-photorealistic","high-end visualization"],
  calidad_tecnica:["physically based materials (PBR)","accurate global illumination","soft realistic shadows"],
  nivel_detalle:["extremely detailed","high texture fidelity","sharp focus"],
  acabado_fotografico:["indistinguishable from real photography","editorial-quality architecture photography"],
  calidad_ia:["8K","highest quality","noise-free"],
};

// ─── BLOCK DATA ─────────────────────────────────────────────────────────────
const mkB = (code,en,es,pt) => ({code,en,es,pt});

const ACCION_DATA = [
  {code:"AC-01",needs_image:true,en:"Transform this architectural render into an ultra-realistic architectural photograph.",es:"Conversión de render a fotografía",pt:"Conversão de render para fotografia"},
  {code:"AC-02",needs_image:true,en:"Transform this SketchUp viewport into an ultra-realistic architectural photograph.",es:"Desde SketchUp",pt:"A partir do SketchUp"},
  {code:"AC-03",needs_image:true,en:"Generate an ultra-realistic architectural visualization from this conceptual sketch.",es:"Desde un croquis",pt:"A partir de um esboço"},
  {code:"AC-04",needs_image:true,en:"Enhance and reinterpret this architectural render into a photorealistic final image.",es:"Desde un render existente",pt:"A partir de um render existente"},
  {code:"AC-05",needs_image:true,en:"Generate a new photorealistic architectural render based on this reference image.",es:"Desde una imagen de referencia",pt:"A partir de uma imagem de referência"},
  {code:"AC-06",needs_image:false,en:"Generate a photorealistic architectural visualization.",es:"Generar desde cero",pt:"Gerar do zero"},
  {code:"AC-07",needs_image:true,en:"Using the provided architectural model as the base geometry, apply the visual style, materials, color palette and atmosphere from the reference image.",es:"Modelo base + imagen de estilo",pt:"Modelo base + imagem de estilo"},
];

const PRES_DATA = [
  {
    code:"PR-01",
    en:"Strictly preserve the original geometry, proportions, composition and spatial layout. Do not alter structural elements, openings or volumetric relationships. Apply only surface-level changes such as materials, lighting and atmosphere.",
    es:"Client Safe Mode · Preservación total",pt:"Client Safe Mode · Preservação total",
    desc_es:"Preserva estrictamente la geometría, proporciones y composición. Solo cambia materiales, luz y atmósfera. Úsalo cuando la fidelidad al modelo es crítica (presentación a cliente, concurso).",
    desc_pt:"Preserva estritamente a geometria, proporções e composição. Altera apenas materiais, luz e atmosfera. Use quando a fidelidade ao modelo é crítica.",
  },
  {
    code:"PR-02",
    en:"Maintain the overall composition and primary structural elements. Allow creative reinterpretation of materials, lighting, atmosphere and secondary details. If a style reference image is provided, extract its color palette, material language and mood and apply them to the base model.",
    es:"Studio Render Mode · Preservación flexible",pt:"Studio Render Mode · Preservação flexível",
    desc_es:"Mantén la composición general y la estructura principal. Si hay imagen de estilo (AC-07), extrae su paleta, materiales y atmósfera y aplicálos al modelo base. Buen equilibrio entre fidelidad y calidad visual.",
    desc_pt:"Mantenha a composição geral e a estrutura principal. Se houver imagem de estilo (AC-07), extraia sua paleta, materiais e atmosfera e aplique ao modelo base.",
  },
  {
    code:"PR-03",
    en:"Use the base model only as a loose spatial reference. Freely reinterpret all materials, lighting, atmosphere, entourage and secondary elements to achieve the highest visual quality. If a style reference image is provided, fully absorb its aesthetic language.",
    es:"Concept Freedom Mode · Libertad creativa",pt:"Concept Freedom Mode · Liberdade criativa",
    desc_es:"El modelo es solo referencia espacial. Si hay imagen de estilo (AC-07), absorbé completamente su lenguaje estético. Máxima calidad visual, mínima restricción geométrica. Ideal para exploración conceptual.",
    desc_pt:"O modelo é apenas referência espacial. Se houver imagem de estilo (AC-07), absorva completamente sua linguagem estética. Máxima qualidade visual, mínima restrição geométrica.",
  },
];

// Dimensiones de extracción de estilo — solo visibles cuando Acción = AC-07
// Cada una produce un fragmento de prompt preciso que instruye qué tomar de la imagen de referencia
const STYLE_DIMS = [
  {
    code:"SD-01",
    en:"Extract only the material palette from the reference image: surface finishes, textures, and material combinations. Do not transfer its lighting, atmosphere or landscape.",
    es:"Solo materiales",pt:"Apenas materiais",
    desc_es:"Toma únicamente los materiales y texturas de la imagen de referencia. No transfiere su luz, atmósfera ni entorno.",
    desc_pt:"Extrai apenas os materiais e texturas da imagem de referência. Não transfere luz, atmosfera nem entorno.",
  },
  {
    code:"SD-02",
    en:"Extract only the color palette from the reference image: dominant hues, tonal range, warm/cool balance and color relationships. Do not transfer its materials, lighting setup or spatial composition.",
    es:"Solo paleta de color",pt:"Apenas paleta de cor",
    desc_es:"Toma únicamente la paleta cromática: colores dominantes, equilibrio cálido/frío y relaciones de color. No transfiere materiales ni iluminación.",
    desc_pt:"Extrai apenas a paleta cromática: cores dominantes, equilíbrio quente/frio e relações de cor. Não transfere materiais nem iluminação.",
  },
  {
    code:"SD-03",
    en:"Extract only the landscape and surrounding context from the reference image: vegetation, terrain, sky and environmental elements. Do not transfer its materials, interior finishes or lighting setup.",
    es:"Solo entorno / paisaje",pt:"Apenas entorno / paisagem",
    desc_es:"Toma únicamente el entorno: vegetación, terreno, cielo y elementos ambientales. No transfiere materiales, interiores ni iluminación artificial.",
    desc_pt:"Extrai apenas o entorno: vegetação, terreno, céu e elementos ambientais. Não transfere materiais, interiores nem iluminação artificial.",
  },
  {
    code:"SD-04",
    en:"Extract only the lighting quality and weather conditions from the reference image: light direction, intensity, time of day, shadow quality and atmospheric conditions. Do not transfer its materials or landscape.",
    es:"Solo luz y clima",pt:"Apenas luz e clima",
    desc_es:"Toma únicamente la calidad de luz y las condiciones climáticas: dirección, intensidad, hora del día, calidad de sombras. No transfiere materiales ni paisaje.",
    desc_pt:"Extrai apenas a qualidade de luz e condições climáticas: direção, intensidade, hora do dia, qualidade de sombras. Não transfere materiais nem paisagem.",
  },
  {
    code:"SD-05",
    en:"Extract the overall mood and atmosphere from the reference image: emotional tone, sense of scale, human presence and narrative quality. Apply this feeling to the base model without replicating specific materials or landscape.",
    es:"Solo atmósfera / mood",pt:"Apenas atmosfera / mood",
    desc_es:"Toma únicamente el mood: tono emocional, escala, presencia humana y calidad narrativa. Sin replicar materiales específicos ni paisaje.",
    desc_pt:"Extrai apenas o mood: tom emocional, escala, presença humana e qualidade narrativa. Sem replicar materiais específicos nem paisagem.",
  },
  {
    code:"SD-06",
    en:"Extract only the architectural style language from the reference image: formal composition, massing relationships, facade rhythm and proportional system. Do not transfer its specific materials or color palette.",
    es:"Solo lenguaje arquitectónico",pt:"Apenas linguagem arquitetônica",
    desc_es:"Toma únicamente el lenguaje arquitectónico: composición formal, relaciones de masa, ritmo de fachada y sistema de proporciones. Sin materiales ni paleta específicos.",
    desc_pt:"Extrai apenas a linguagem arquitetônica: composição formal, relações de massa, ritmo de fachada e sistema de proporções. Sem materiais nem paleta específicos.",
  },
  {
    code:"SD-07",
    en:"Extract the photographic and rendering style from the reference image: camera angle, lens characteristics, depth of field, post-processing style and overall visual treatment.",
    es:"Solo estilo fotográfico / render",pt:"Apenas estilo fotográfico / render",
    desc_es:"Toma únicamente el estilo fotográfico: ángulo de cámara, características de lente, profundidad de campo y tratamiento visual general.",
    desc_pt:"Extrai apenas o estilo fotográfico: ângulo de câmera, características de lente, profundidade de campo e tratamento visual geral.",
  },
];


const OUTPUT_MODES = [
  {code:"universal", key:"outputUniversal"},
  {code:"gpt", key:"outputGPT"},
  {code:"midjourney", key:"outputMJ"},
  {code:"sd", key:"outputSD"},
  {code:"krea", key:"outputKrea"},
  {code:"client", key:"outputClient"},
];

const ASPECT_RATIOS = [
  {code:"16:9", label:"16:9 · Horizontal"},
  {code:"9:16", label:"9:16 · Vertical"},
  {code:"4:5", label:"4:5 · Social"},
  {code:"1:1", label:"1:1 · Square"},
  {code:"3:2", label:"3:2 · Photo"},
  {code:"21:9", label:"21:9 · Panoramic"},
];

const NEGATIVE_BASE = [
  "distorted geometry", "changed facade", "altered proportions", "extra floors", "missing openings",
  "new windows", "warped perspective", "incorrect structure", "melted architecture", "floating furniture",
  "duplicated objects", "unrealistic scale", "overexposed image", "low resolution", "artifacts",
  "cartoon style", "childish drawing", "oversaturation", "chaotic composition", "text or watermark"
];

const NEGATIVE_BY_PRES = {
  "PR-01":["redesigned building", "modified massing", "moved walls", "changed roof geometry", "different camera angle", "changed aspect ratio"],
  "PR-02":["major structural changes", "unrecognizable original project", "conflicting materials", "cluttered entourage"],
  "PR-03":["illegible architecture", "loss of spatial hierarchy", "random decorative elements"]
};

const OUTPUT_WRAP = {
  universal:(prompt, negative)=>prompt,
  gpt:(prompt, negative)=>`Use the attached architectural image as the locked reference when provided. ${prompt} Keep the response as a single final image instruction. Avoid these failures: ${negative}.`,
  midjourney:(prompt, negative, aspectRatio="16:9")=>`${prompt} --style raw --ar ${aspectRatio} --no ${negative}`,
  sd:(prompt, negative)=>`POSITIVE PROMPT:\n${prompt}\n\nNEGATIVE PROMPT:\n${negative}`,
  krea:(prompt, negative)=>`Enhance the provided architectural image using this direction:\n${prompt}\n\nPreserve the original project identity and avoid: ${negative}.`,
  client:(prompt, negative)=>`Objetivo visual para cliente:\nConvertir la imagen o modelo arquitectónico en una visualización profesional, manteniendo la geometría y composición del proyecto.\n\nDirección creativa:\n${prompt}\n\nRestricciones importantes:\nNo modificar la volumetría, aberturas, proporciones ni estructura principal. Evitar: ${negative}.`
};

const QUICK_RECIPES = [
  {code:"R-01", name:{en:"SketchUp to premium photo",es:"SketchUp a foto premium",pt:"SketchUp para foto premium"}, desc:{en:"Maximum fidelity for raw model views.",es:"Máxima fidelidad para vistas crudas de modelo.",pt:"Máxima fidelidade para vistas brutas de modelo."}, accion:"AC-02", pres:"PR-01", output:"gpt", sel:{V:"V-01", C:"C-02", A:"A-05", L:"L-02", T:"T-01"}, multi:{M:["M-01","M-06"]}},
  {code:"R-02", name:{en:"Base model + Pinterest reference",es:"Modelo base + referencia Pinterest",pt:"Modelo base + referência Pinterest"}, desc:{en:"Transfers style without losing the original project.",es:"Transfiere estilo sin perder el proyecto original.",pt:"Transfere estilo sem perder o projeto original."}, accion:"AC-07", pres:"PR-01", output:"gpt", styleDims:["SD-01","SD-02","SD-04","SD-07"], sel:{V:"V-01", C:"C-08", A:"A-03", L:"L-04"}, multi:{M:["M-02","M-06"]}},
  {code:"R-03", name:{en:"Physical cardboard model",es:"Maqueta física de cartón",pt:"Maquete física de papelão"}, desc:{en:"Studio photograph of a handcrafted architectural model.",es:"Foto de estudio de una maqueta arquitectónica artesanal.",pt:"Foto de estúdio de uma maquete arquitetônica artesanal."}, accion:"AC-01", pres:"PR-01", output:"gpt", sel:{V:"V-04", C:"C-07", A:"A-10", L:"L-08", T:"T-08"}, multi:{M:["M-21","M-22","M-24"]}},
  {code:"R-04", name:{en:"Competition collage",es:"Collage de concurso",pt:"Colagem de concurso"}, desc:{en:"Editorial, atmospheric and legible mixed-media image.",es:"Imagen editorial, atmosférica y legible de técnica mixta.",pt:"Imagem editorial, atmosférica e legível de técnica mista."}, accion:"AC-04", pres:"PR-02", output:"gpt", sel:{V:"V-09", C:"C-13", A:"A-09", L:"L-07", T:"T-06"}, multi:{M:["M-07","M-12"]}},
  {code:"R-05", name:{en:"Perspective section narrative",es:"Corte perspectivado narrativo",pt:"Corte perspectivado narrativo"}, desc:{en:"Clear cut-plane logic with people, depth and atmosphere.",es:"Lógica de corte clara con personas, profundidad y atmósfera.",pt:"Lógica de corte clara com pessoas, profundidade e atmosfera."}, accion:"AC-04", pres:"PR-01", output:"gpt", sel:{V:"V-02", C:"C-15", A:"A-08", L:"L-03", T:"T-07"}, multi:{M:["M-01","M-02"]}},
  {code:"R-06", name:{en:"Real estate hero image",es:"Imagen hero inmobiliaria",pt:"Imagem hero imobiliária"}, desc:{en:"Clean, commercial, bright and easy to read.",es:"Limpia, comercial, luminosa y fácil de leer.",pt:"Limpa, comercial, luminosa e fácil de ler."}, accion:"AC-01", pres:"PR-01", output:"midjourney", sel:{V:"V-01", C:"C-01", A:"A-01", L:"L-01", T:"T-02"}, multi:{M:["M-02","M-06","M-07"]}},
];

function getOutputLabel(code, lang){
  const m={universal:{en:"Universal",es:"Universal",pt:"Universal"},gpt:{en:"GPT Image / ChatGPT",es:"GPT Image / ChatGPT",pt:"GPT Image / ChatGPT"},midjourney:{en:"Midjourney",es:"Midjourney",pt:"Midjourney"},sd:{en:"Flux / Stable Diffusion",es:"Flux / Stable Diffusion",pt:"Flux / Stable Diffusion"},krea:{en:"Krea / Magnific",es:"Krea / Magnific",pt:"Krea / Magnific"},client:{en:"Client explanation",es:"Explicación para cliente",pt:"Explicação para cliente"}};
  return m[code]?.[lang]||m[code]?.en||code;
}

function buildNegativePrompt(accion, pres, outputMode){
  const parts=[...NEGATIVE_BASE];
  if(pres?.code && NEGATIVE_BY_PRES[pres.code]) parts.push(...NEGATIVE_BY_PRES[pres.code]);
  if(accion?.code==="AC-07") parts.push("copying the reference building geometry", "replacing the base model with the style reference");
  if(outputMode==="midjourney") return Array.from(new Set(parts)).join(", ");
  return Array.from(new Set(parts)).join(", ");
}

function buildOutputPrompt(prompt, negative, outputMode, includeNegative, aspectRatio="16:9"){
  if(!prompt) return "";
  const neg=includeNegative?negative:"";
  if(!includeNegative || outputMode==="universal") return prompt;
  return (OUTPUT_WRAP[outputMode]||OUTPUT_WRAP.universal)(prompt, neg, aspectRatio);
}

function analyzePrompt(accion, pres, sel, multiSel, calidad){
  const materials=(multiSel.M||[]).length;
  const q=Q_ORDER.reduce((s,gk)=>s+(calidad[gk]||[]).length,0);
  const selectedCount=Object.values(sel||{}).filter(Boolean).length + materials;
  return {
    geometry: !accion ? "missing" : accion.code==="AC-06" ? "na" : pres?.code==="PR-01" ? "high" : pres?.code==="PR-02" ? "medium" : pres?.code==="PR-03" ? "low" : accion?.needs_image ? "missing" : "na",
    materials: materials>0 ? "high" : sel?.S ? "medium" : "missing",
    camera: sel?.C ? "high" : "missing",
    light: sel?.L || sel?.A ? "high" : "missing",
    overload: selectedCount>12 || q>10 ? "high" : selectedCount>8 || q>7 ? "medium" : "low",
  };
}

function findBlock(cats, catKey, code){
  return cats[catKey]?.blocks?.find(b=>b.code===code)||null;
}

function readStore(key){
  try{ if(window.storage?.get) return window.storage.get(key); }catch(e){}
  try{ const value=window.localStorage?.getItem(key); return Promise.resolve(value?{value}:null); }catch(e){ return Promise.resolve(null); }
}
function writeStore(key, value){
  try{ if(window.storage?.set) return window.storage.set(key,value); }catch(e){}
  try{ window.localStorage?.setItem(key,value); }catch(e){}
  return Promise.resolve();
}

const CATS = {
  E:{name:{en:"SPACE TYPE",es:"TIPO DE ESPACIO",pt:"TIPO DE ESPAÇO"},color:"#ec8800",multi:false,blocks:[
    mkB("E-01","single-family house, suburban context","Vivienda unifamiliar, contexto suburbano","Moradia unifamiliar, contexto suburbano"),
    mkB("E-02","renovated row house with central courtyard (casa chorizo style)","Casa chorizo renovada con patio central","Casa renovada com pátio central"),
    mkB("E-03","compact urban apartment, open-plan living and kitchen","Departamento urbano compacto, living y cocina abiertos","Apartamento urbano compacto, sala e cozinha abertos"),
    mkB("E-04","two-story house with double-height living room","Vivienda dos plantas, living doble altura","Casa dois andares, sala duplo pé-direito"),
    mkB("E-05","boutique retail store, street-facing storefront","Local comercial boutique, vidriera sobre calle","Loja boutique, vitrine para a rua"),
    mkB("E-06","corporate office space, open-plan workstations","Oficina corporativa, planta abierta","Escritório corporativo, planta aberta"),
    mkB("E-07","coworking space with shared common areas","Coworking con áreas comunes compartidas","Coworking com áreas comuns compartilhadas"),
    mkB("E-08","boutique hotel lobby, welcoming entrance area","Lobby hotel boutique, área de ingreso acogedora","Lobby hotel boutique, área de entrada acolhedora"),
    mkB("E-09","restaurant interior, dining area with bar counter","Interior restaurante, comedor con barra","Interior restaurante, sala de jantar com balcão"),
    mkB("E-10","public plaza, urban gathering space","Plaza pública, espacio urbano de encuentro","Praça pública, espaço urbano de encontro"),
    mkB("E-11","rooftop terrace with city skyline view","Terraza azotea con vista al skyline","Terraço cobertura com vista para o skyline"),
    mkB("E-12","minimalist art gallery, white cube exhibition space","Galería arte minimalista, cubo blanco","Galeria de arte minimalista, cubo branco"),
    mkB("E-13","residential kitchen, island counter, open to dining area","Cocina residencial con isla, abierta al comedor","Cozinha residencial com ilha, aberta para o jantar"),
    mkB("E-14","master bedroom suite with en-suite bathroom","Suite principal con baño en suite","Suite principal com banheiro privativo"),
    mkB("E-15","co-living building, shared amenities and private units","Co-living, amenities compartidos y unidades privadas","Co-living, amenidades compartilhadas e unidades privadas"),
    mkB("E-16","educational space, classroom or workshop studio","Espacio educativo, aula o taller","Espaço educativo, sala de aula ou ateliê"),
    mkB("E-17","wellness spa interior, relaxation and treatment rooms","Spa bienestar, salas de relax y tratamiento","Spa bem-estar, salas de relaxamento e tratamento"),
    mkB("E-18","mixed-use building, ground floor retail with residential above","Edificio uso mixto, comercio PB y vivienda arriba","Edifício uso misto, comércio térreo e residencial acima"),
    mkB("E-19","pop-up pavilion, temporary lightweight structure","Pabellón efímero, estructura liviana temporal","Pavilhão temporário, estrutura leve e efêmera"),
    mkB("E-20","renovated industrial loft, exposed brick and steel structure","Loft industrial renovado, ladrillo y acero expuestos","Loft industrial renovado, tijolo e aço aparentes"),
  ]},
  S:{name:{en:"STYLE",es:"ESTILO",pt:"ESTILO"},color:"#ff9800",multi:false,blocks:[
    mkB("S-01","Japanese minimalist style, inspired by Tadao Ando, raw concrete and clean geometry","Minimalismo japonés, Tadao Ando, hormigón en bruto","Minimalismo japonês, Tadao Ando, concreto aparente"),
    mkB("S-02","Scandinavian style, light wood tones, functional simplicity","Escandinavo, maderas claras, simplicidad funcional","Escandinavo, madeiras claras, simplicidade funcional"),
    mkB("S-03","Brutalist style, exposed raw concrete, monolithic forms","Brutalista, hormigón en bruto, formas monolíticas","Brutalista, concreto aparente, formas monolíticas"),
    mkB("S-04","industrial-warm style, exposed brick combined with warm wood accents","Industrial-cálido, ladrillo expuesto y acentos de madera","Industrial-aconchegante, tijolo aparente e acentos de madeira"),
    mkB("S-05","Mediterranean style, white plastered walls, terracotta accents","Mediterráneo, paredes blancas, acentos terracota","Mediterrâneo, paredes brancas, acentos terracota"),
    mkB("S-06","mid-century modern style, inspired by Richard Neutra, clean horizontal lines","Moderno mitad de siglo, Richard Neutra, líneas horizontales","Moderno meados do século, Richard Neutra, linhas horizontais"),
    mkB("S-07","biophilic style, abundant integration of plants and natural light","Biofílico, plantas y luz natural integrados","Biofílico, plantas e luz natural integrados"),
    mkB("S-08","contemporary minimalism, inspired by Tadao Ando, monochrome palette","Minimalismo contemporáneo, paleta monocromática","Minimalismo contemporâneo, paleta monocromática"),
    mkB("S-09","rustic farmhouse style, reclaimed wood and natural stone","Rústico rural, madera recuperada y piedra natural","Rústico rural, madeira recuperada e pedra natural"),
    mkB("S-10","high-tech style, exposed structural and mechanical systems","High-tech, sistemas estructurales y mecánicos expuestos","High-tech, sistemas estruturais e mecânicos aparentes"),
    mkB("S-11","Bauhaus-inspired style, functional geometric forms, primary color accents","Bauhaus, formas geométricas funcionales, colores primarios","Bauhaus, formas geométricas funcionais, cores primárias"),
    mkB("S-12","tropical modernist style, inspired by Geoffrey Bawa, deep overhangs and cross ventilation","Modernismo tropical, Geoffrey Bawa, aleros profundos","Modernismo tropical, Geoffrey Bawa, beirais profundos"),
    mkB("S-13","art deco style, geometric ornamentation, luxurious materials","Art déco, ornamentación geométrica, materiales lujosos","Art déco, ornamentação geométrica, materiais luxuosos"),
    mkB("S-14","deconstructivist style, inspired by Zaha Hadid, fluid dynamic forms","Deconstructivista, Zaha Hadid, formas dinámicas y fluidas","Desconstrutivista, Zaha Hadid, formas dinâmicas e fluidas"),
    mkB("S-15","vernacular regional style, adapted to local climate and materials","Vernáculo regional, adaptado al clima y materiales locales","Vernacular regional, adaptado ao clima e materiais locais"),
    mkB("S-16","Wabi-sabi inspired style, imperfect and weathered natural textures","Wabi-sabi, texturas naturales imperfectas y desgastadas","Wabi-sabi, texturas naturais imperfeitas e desgastadas"),
    mkB("S-17","neo-futurist style, sleek curved forms, glass and metal","Neofuturista, formas curvas pulidas, vidrio y metal","Neofuturista, formas curvas elegantes, vidro e metal"),
    mkB("S-18","modern farmhouse style, black metal accents, white siding","Campo moderno, acentos metal negro, revestimiento blanco","Rural moderno, acentos metal preto, revestimento branco"),
  ]},
  M:{name:{en:"MATERIALS",es:"MATERIALES",pt:"MATERIAIS"},color:"#ffa424",multi:true,blocks:[
    mkB("M-01","board-formed concrete with visible wood grain texture","Hormigón visto con textura de encofrado de tablas","Concreto aparente com textura de madeira do molde"),
    mkB("M-02","natural oak wood flooring, warm honey tone","Piso de roble natural, tono miel cálido","Piso de carvalho natural, tom mel quente"),
    mkB("M-03","handmade terracotta brick, warm reddish tone","Ladrillo terracota artesanal, tono rojizo cálido","Tijolo terracota artesanal, tom avermelhado quente"),
    mkB("M-04","white travertine stone cladding, subtle veining","Revestimiento travertino blanco, veteado sutil","Revestimento travertino branco, veios sutis"),
    mkB("M-05","blackened steel structural elements, matte finish","Acero ennegrecido, terminación mate","Aço enegrecido, acabamento fosco"),
    mkB("M-06","floor-to-ceiling glass facade, minimal black frames","Fachada vidrio piso a techo, marcos negros mínimos","Fachada vidro do piso ao teto, caixilhos pretos mínimos"),
    mkB("M-07","raw linen and natural fiber textiles, soft neutral tones","Textiles lino crudo y fibras naturales, tonos neutros","Têxteis linho cru e fibras naturais, tons neutros"),
    mkB("M-08","white lime-washed plaster walls, matte texture","Paredes revocadas en cal blanca, textura mate","Paredes caiadas de branco, textura fosca"),
    mkB("M-09","dark walnut wood paneling, rich and warm tone","Paneles nogal oscuro, tono rico y cálido","Painéis nogueira escura, tom rico e quente"),
    mkB("M-10","polished microcement flooring, seamless and minimal","Piso microcemento pulido, continuo y minimalista","Piso microcimento polido, contínuo e minimalista"),
    mkB("M-11","natural stone cladding, rough-cut texture, earthy tones","Piedra natural rosticada, tonos terrosos","Pedra natural rústica, tons terrosos"),
    mkB("M-12","corten steel facade panels, rusted orange-brown patina","Paneles acero corten, pátina oxidada marrón","Painéis aço corten, pátina enferrujada"),
    mkB("M-13","woven rattan and natural cane elements","Mimbre y caña natural tejida","Vime e cana natural trançados"),
    mkB("M-14","brushed brass fixtures and accents, warm metallic tone","Latón cepillado, tono metálico cálido","Latão escovado, tom metálico quente"),
    mkB("M-15","exposed structural timber beams, natural wood finish","Vigas madera estructural expuestas, acabado natural","Vigas madeira estrutural aparentes, acabamento natural"),
    mkB("M-16","matte black metal window frames, industrial detailing","Marcos metal negro mate, detalle industrial","Caixilhos metal preto fosco, detalhe industrial"),
    mkB("M-17","terrazzo flooring with colorful aggregate chips","Piso terrazo con agregados de colores","Piso terraço com agregados coloridos"),
    mkB("M-18","green living wall, vertical garden integration","Muro verde vivo, jardín vertical integrado","Parede verde viva, jardim vertical integrado"),
    mkB("M-19","smooth polished concrete walls, monolithic and minimal","Hormigón pulido liso, monolítico y minimalista","Concreto polido liso, monolítico e minimalista"),
    mkB("M-20","reclaimed weathered wood cladding, rustic patina","Madera recuperada y desgastada, pátina rústica","Madeira recuperada e envelhecida, pátina rústica"),
    mkB("M-21","laser-cut architectural cardboard, kraft board and layered matte paper","Cartón arquitectónico cortado láser, cartón kraft y papel mate en capas","Papelão arquitetônico cortado a laser, papel kraft e papel fosco em camadas"),
    mkB("M-22","thin MDF, dark chipboard and stained basswood model materials","MDF delgado, cartón gris oscuro y madera balsa teñida para maqueta","MDF fino, papelão cinza escuro e madeira balsa tingida para maquete"),
    mkB("M-23","white museum board, foam board base and precise hand-cut edges","Cartón blanco de museo, base de foamboard y bordes cortados con precisión","Papel cartão branco de museu, base de foam board e bordas cortadas com precisão"),
    mkB("M-24","burnt umber, toasted brown, raw sienna and muted copper model palette","Paleta de maqueta en sombra tostada, marrón cálido, siena natural y cobre apagado","Paleta de maquete em sombra queimada, marrom tostado, sienna natural e cobre apagado"),
  ]},
  N:{name:{en:"SURROUNDINGS",es:"ENTORNO",pt:"ENTORNO"},color:"#474747",multi:false,blocks:[
    mkB("N-01","dense urban context, surrounded by mid-rise buildings","Contexto urbano denso, edificios de media altura","Contexto urbano denso, edifícios de média altura"),
    mkB("N-02","quiet suburban street, mature trees lining the sidewalk","Calle suburbana tranquila, árboles añejos en la vereda","Rua suburbana tranquila, árvores adultas na calçada"),
    mkB("N-03","coastal setting, ocean visible in the background","Entorno costero, océano visible de fondo","Entorno costeiro, oceano visível ao fundo"),
    mkB("N-04","dense forest surroundings, building integrated into the woods","Bosque denso, edificio integrado entre los árboles","Floresta densa, edifício integrado entre as árvores"),
    mkB("N-05","arid desert landscape, sparse vegetation and open horizon","Paisaje desértico árido, horizonte abierto","Paisagem desértica árida, horizonte aberto"),
    mkB("N-06","mountain landscape, dramatic topography in the background","Paisaje de montaña, topografía dramática de fondo","Paisagem de montanha, topografia dramática ao fundo"),
    mkB("N-07","riverside setting, water adjacent to the building","Entorno ribereño, agua adyacente a la edificación","Entorno ribeirinho, água adjacente ao edifício"),
    mkB("N-08","rural countryside, open fields surrounding the structure","Entorno rural, campos abiertos alrededor","Campo rural, campos abertos ao redor"),
    mkB("N-09","dense historic city center, narrow cobblestone streets","Centro histórico denso, calles empedradas angostas","Centro histórico denso, ruas estreitas de paralelepípedo"),
    mkB("N-10","isolated rooftop setting, city skyline as backdrop","Azotea aislada, skyline de la ciudad como fondo","Cobertura isolada, skyline da cidade como fundo"),
    mkB("N-11","tropical garden surroundings, lush vegetation enclosing the space","Jardín tropical, vegetación exuberante envolviendo el espacio","Jardim tropical, vegetação exuberante ao redor"),
    mkB("N-12","industrial waterfront context, converted warehouses nearby","Frente de agua industrial, galpones reconvertidos","Frente d'água industrial, galpões reconvertidos"),
    mkB("N-13","snow-covered landscape, alpine context","Paisaje nevado, contexto alpino","Paisagem nevada, contexto alpino"),
    mkB("N-14","urban courtyard, enclosed by surrounding buildings","Patio urbano, cerrado por edificación perimetral","Pátio urbano, fechado por edificação perimetral"),
    mkB("N-15","open plaza context, adjacent to public civic buildings","Plaza abierta, adyacente a edificios cívicos","Praça aberta, adjacente a edifícios públicos"),
    mkB("N-16","vineyard landscape, rolling hills in the distance","Paisaje de viñedos, colinas suaves en la distancia","Paisagem de vinhedos, colinas suaves ao longe"),
  ]},
  L:{name:{en:"LIGHT",es:"LUZ",pt:"LUZ"},color:"#ec8800",multi:false,blocks:[
    mkB("L-01","soft overcast daylight, diffused shadows","Día nublado, luz difusa sin sombras duras","Dia nublado, luz difusa sem sombras duras"),
    mkB("L-02","harsh midday sun, strong directional shadows","Sol de mediodía, sombras duras y definidas","Sol do meio-dia, sombras duras e definidas"),
    mkB("L-03","soft north light, even and cool toned","Luz norte pareja y fría, clásica para interiores","Luz norte suave e fria, clássica para interiores"),
    mkB("L-04","dappled light through tree canopy, dynamic shadow patterns","Luz filtrada por árboles, patrones de sombra orgánicos","Luz filtrada pela copa das árvores, padrões de sombra orgânicos"),
    mkB("L-05","backlit silhouette, sun behind the building","Contraluz, sol detrás de la edificación","Contraluz, sol atrás do edifício"),
    mkB("L-06","diffused softbox-style lighting, studio quality, shadowless","Iluminación tipo estudio, sin sombras duras","Iluminação tipo estúdio, sem sombras duras"),
    mkB("L-07","rim light highlighting architectural edges","Luz de contorno que dibuja los bordes del volumen","Luz de contorno destacando as arestas do volume"),
    mkB("L-08","warm artificial lighting, incandescent tone, cozy interior","Iluminación artificial cálida, tono incandescente, interior acogedor","Iluminação artificial quente, tom incandescente, interior aconchegante"),
    mkB("L-09","cool LED lighting, neutral white tone, modern feel","Iluminación LED blanca neutra, sensación contemporánea","Iluminação LED branca neutra, sensação contemporânea"),
    mkB("L-10","dramatic chiaroscuro lighting, strong contrast between light and shadow","Claroscuro dramático, fuerte contraste luz/sombra","Claro-escuro dramático, forte contraste luz/sombra"),
    mkB("L-11","uplighting from ground-level fixtures, dramatic facade illumination","Iluminación desde el suelo hacia arriba, efecto dramático en fachada","Iluminação do chão para cima, efeito dramático na fachada"),
    mkB("L-12","natural skylight illumination from above, soft vertical light","Luz cenital natural, luz vertical suave","Iluminação zenital natural, luz vertical suave"),
    mkB("L-13","candlelight or warm ambient glow, intimate mood","Luz de vela o resplandor cálido ambiental, intimidad","Luz de vela ou brilho ambiente quente, clima íntimo"),
    mkB("L-14","bright clear sky, high contrast sunlight, crisp shadows","Cielo despejado, sol de alto contraste, sombras nítidas","Céu claro, sol de alto contraste, sombras nítidas"),
    mkB("L-15","direct flash-style lighting, flat even illumination","Iluminación tipo flash directo, plana y uniforme","Iluminação tipo flash direto, plana e uniforme"),
    mkB("L-16","light bouncing off white surfaces, soft fill light everywhere","Luz rebotada en superficies blancas, relleno suave","Luz rebatida em superfícies brancas, preenchimento suave"),
    mkB("L-17","deep night exterior lighting, pools of warm light on dark facade","Iluminación exterior nocturna profunda, manchas de luz cálida sobre fachada oscura","Iluminação exterior noturna profunda, manchas de luz quente na fachada escura"),
    mkB("L-18","interior artificial lighting visible from outside at night, glowing volumes","Luz artificial interior visible desde afuera de noche, volúmenes iluminados","Luz artificial interior visível do exterior à noite, volumes iluminados"),
    mkB("L-19","moonlight and starlight, very low ambient light, cool blue tones","Luz de luna y estrellas, luz ambiental muy baja, tonos azulados fríos","Luz da lua e estrelas, luz ambiente muito baixa, tons azulados frios"),
    mkB("L-20","neon and signage glow reflecting on wet street, urban night mood","Reflejos de neón y carteles en calle húmeda, ambiente urbano nocturno","Reflexos de neon e letreiros em rua molhada, ambiente urbano noturno"),
    mkB("L-21","accent lighting highlighting architectural details at night","Iluminación de acento destacando detalles arquitectónicos de noche","Iluminação de destaque realçando detalhes arquitetônicos à noite"),
  ]},
  T:{name:{en:"WEATHER / TIME OF DAY",es:"CLIMA / HORA DEL DÍA",pt:"CLIMA / HORA DO DIA"},color:"#ff9800",multi:false,blocks:[
    mkB("T-01","golden hour sunlight, warm low-angle light","Hora dorada, luz cálida de ángulo bajo","Hora dourada, luz quente de ângulo baixo"),
    mkB("T-02","blue hour, ambient twilight glow, artificial lights turning on","Hora azul, crepúsculo ambiental, luces artificiales encendidas","Hora azul, crepúsculo ambiental, luzes artificiais acendendo"),
    mkB("T-03","night scene, warm interior lights glowing through windows","Noche, interior cálido iluminado visible desde afuera","Noite, interior quente iluminado visível do exterior"),
    mkB("T-04","deep night exterior, only artificial lighting, dramatic darkness","Noche profunda exterior, solo luz artificial, oscuridad dramática","Noite profunda exterior, apenas luz artificial, escuridão dramática"),
    mkB("T-05","late night urban scene, city glow in background","Escena urbana de madrugada, brillo de la ciudad de fondo","Cena urbana de madrugada, brilho da cidade ao fundo"),
    mkB("T-06","night with dramatic storm approaching, lightning in distance","Noche con tormenta dramática acercándose, relámpagos en la distancia","Noite com tempestade dramática se aproximando, relâmpagos ao longe"),
    mkB("T-07","morning mist with soft sunlight breaking through","Niebla matutina con luz solar filtrándose suavemente","Névoa matinal com luz solar suave penetrando"),
    mkB("T-08","clear midday, bright blue sky, full sun","Mediodía despejado, cielo celeste intenso, sol pleno","Meio-dia limpo, céu azul intenso, sol pleno"),
    mkB("T-09","overcast winter day, flat gray sky","Día nublado de invierno, cielo gris uniforme","Dia nublado de inverno, céu cinza uniforme"),
    mkB("T-10","light rain, wet pavement reflections","Lluvia liviana, reflejos en el pavimento húmedo","Chuva leve, reflexos no pavimento molhado"),
    mkB("T-11","heavy rainstorm, dramatic dark clouds","Tormenta intensa, nubes oscuras y dramáticas","Tempestade intensa, nuvens escuras e dramáticas"),
    mkB("T-12","dense fog, low visibility, soft diffused light","Niebla densa, baja visibilidad, luz difusa","Neblina densa, baixa visibilidade, luz difusa"),
    mkB("T-13","fresh snowfall, soft white winter light","Nevada reciente, luz invernal blanca y suave","Nevada recente, luz invernal branca e suave"),
    mkB("T-14","autumn afternoon, warm low sun, falling leaves","Tarde de otoño, sol bajo y cálido, hojas cayendo","Tarde de outono, sol baixo e quente, folhas caindo"),
    mkB("T-15","spring morning, soft fresh light, blooming vegetation","Mañana de primavera, luz fresca, vegetación en flor","Manhã de primavera, luz fresca, vegetação em flor"),
    mkB("T-16","hazy summer heat, warm-toned atmosphere","Calor estival con neblina térmica, atmósfera cálida","Calor de verão com névoa térmica, atmosfera quente"),
    mkB("T-17","just after sunset, deep orange and purple sky gradient","Post-puesta de sol, cielo degradé naranja y violeta","Logo após o pôr do sol, céu degradê laranja e roxo"),
    mkB("T-18","pre-dawn light, cool blue tones, very low sun","Luz previa al amanecer, tonos azulados fríos","Luz pré-amanhecer, tons azulados frios"),
    mkB("T-19","windy day, visible movement in trees and foliage","Día con viento, movimiento visible en árboles y follaje","Dia ventoso, movimento visível em árvores e folhagem"),
    mkB("T-20","night with full moon, soft silver light on facade","Noche de luna llena, luz plateada suave sobre la fachada","Noite de lua cheia, luz prateada suave sobre a fachada"),
    mkB("T-21","rainy night, reflective wet surfaces, blurred city lights","Noche lluviosa, superficies húmedas reflectantes, luces de ciudad difusas","Noite chuvosa, superfícies molhadas refletivas, luzes da cidade difusas"),
    mkB("T-22","twilight with first stars appearing, transitional sky","Crepúsculo con primeras estrellas, cielo en transición","Crepúsculo com primeiras estrelas, céu em transição"),
  ]},
  A:{name:{en:"ATMOSPHERE",es:"ATMÓSFERA",pt:"ATMOSFERA"},color:"#474747",multi:false,blocks:[
    mkB("A-01","serene and minimalist atmosphere, calm and uncluttered","Serena y minimalista, calma y orden","Serena e minimalista, calma e organização"),
    mkB("A-02","warm and inviting domestic atmosphere, lived-in feel","Cálida y acogedora, sensación de hogar habitado","Quente e acolhedora, sensação de lar habitado"),
    mkB("A-03","moody and cinematic atmosphere, dramatic tension","Cinematográfica con tensión dramática","Cinematográfica com tensão dramática"),
    mkB("A-04","fresh and airy atmosphere, light and open feeling","Fresca y aireada, espacios livianos y abiertos","Fresca e arejada, espaços leves e abertos"),
    mkB("A-05","rustic and earthy atmosphere, raw natural materials","Rústica y terrosa, materiales naturales en bruto","Rústica e terrosa, materiais naturais em bruto"),
    mkB("A-06","luxurious and refined atmosphere, high-end finishes","Lujosa y refinada, terminaciones de alta gama","Luxuosa e refinada, acabamentos de alta qualidade"),
    mkB("A-07","industrial and raw atmosphere, exposed structure","Industrial y cruda, estructura expuesta","Industrial e crua, estrutura aparente"),
    mkB("A-08","tranquil zen atmosphere, contemplative and balanced","Zen, contemplativa y equilibrada","Zen, contemplativa e equilibrada"),
    mkB("A-09","vibrant and energetic urban atmosphere, lively street scene","Urbana vibrante y enérgica","Urbana vibrante e enérgica"),
    mkB("A-10","melancholic and nostalgic atmosphere, faded and timeworn","Melancólica y nostálgica, paso del tiempo","Melancólica e nostálgica, passagem do tempo"),
    mkB("A-11","bright and optimistic atmosphere, clean and uplifting","Luminosa y optimista, sensación limpia","Luminosa e otimista, sensação limpa"),
    mkB("A-12","mysterious and dramatic atmosphere, deep shadows and contrast","Misteriosa y dramática, sombras profundas","Misteriosa e dramática, sombras profundas"),
    mkB("A-13","lush and biophilic atmosphere, abundant greenery integration","Biofílica, fuerte integración de vegetación","Biofílica, forte integração de vegetação"),
    mkB("A-14","quiet early morning atmosphere, stillness before the day begins","Primera hora, quietud previa al día","Madrugada, quietude antes do início do dia"),
    mkB("A-15","festive and social atmosphere, gathering and celebration mood","Festiva y social, sensación de encuentro","Festiva e social, sensação de encontro"),
    mkB("A-16","clinical and pristine atmosphere, sterile and precise","Clínica e impecable, estéril y precisa","Clínica e impecável, estéril e precisa"),
    mkB("A-17","warm Mediterranean atmosphere, sun-soaked and relaxed","Mediterránea cálida, bañada de sol","Mediterrânea quente, banhada de sol"),
  ]},
  C:{name:{en:"CAMERA",es:"CÁMARA",pt:"CÂMERA"},color:"#2c2c2c",multi:false,blocks:[
    mkB("C-01","eye-level perspective, human scale viewpoint","Perspectiva a la altura del ojo humano","Perspectiva ao nível dos olhos"),
    mkB("C-02","wide-angle exterior shot, 24mm lens, full facade view","Gran angular 24mm, fachada completa","Grande angular 24mm, fachada completa"),
    mkB("C-03","low-angle shot looking up, emphasizing height and grandeur","Toma desde abajo, enfatiza altura y monumentalidad","Tomada de baixo para cima, enfatiza altura"),
    mkB("C-04","bird's eye view, aerial perspective of building and surroundings","Vista aérea, perspectiva general del edificio y entorno","Vista aérea, perspectiva geral do edifício e entorno"),
    mkB("C-05","interior shot, wide lens, capturing depth of the room","Toma interior angular, capturando profundidad del espacio","Tomada interior angular, capturando profundidade"),
    mkB("C-06","close-up detail shot, focus on material and texture","Primer plano de detalle, foco en material y textura","Close-up de detalhe, foco em material e textura"),
    mkB("C-07","two-point perspective, symmetrical and balanced composition","Perspectiva dos puntos, composición simétrica","Perspectiva de dois pontos, composição simétrica"),
    mkB("C-08","three-quarter view of the building, corner perspective","Vista tres cuartos, perspectiva desde la esquina","Vista em três quartos, perspectiva da esquina"),
    mkB("C-09","straight-on frontal view, architectural elevation style","Vista frontal recta, estilo elevación arquitectónica","Vista frontal direta, estilo elevação arquitetônica"),
    mkB("C-10","shallow depth of field, blurred background, focus on foreground","Profundidad de campo reducida, fondo desenfocado","Profundidade de campo rasa, fundo desfocado"),
    mkB("C-11","drone shot, high altitude, urban context visible","Toma de drone, gran altura, contexto urbano visible","Tomada de drone, grande altitude, contexto urbano"),
    mkB("C-12","interior-to-exterior shot through an open window or door","Toma del interior al exterior a través de ventana","Tomada interior para exterior através de janela"),
    mkB("C-13","wide establishing shot, building within its landscape context","Toma general de establecimiento, edificio en el paisaje","Tomada geral de estabelecimento, edifício na paisagem"),
    mkB("C-14","dynamic diagonal composition, leading lines toward the building","Composición diagonal dinámica, líneas que conducen al edificio","Composição diagonal dinâmica, linhas conduzindo ao edifício"),
    mkB("C-15","section-style cutaway view, revealing interior layers","Vista tipo corte, revelando capas interiores","Vista tipo corte, revelando camadas internas"),
    mkB("C-16","dollhouse view, removed roof showing interior layout from above","Vista casa de muñecas, planta interior desde arriba","Vista casa de bonecas, planta interior vista de cima"),
    mkB("C-17","night street-level view, pedestrian perspective","Vista nocturna a nivel de calle, perspectiva peatonal","Vista noturna ao nível da rua, perspectiva do pedestre"),
    mkB("C-18","tilted Dutch angle, dynamic and unconventional framing","Encuadre inclinado, composición dinámica y poco convencional","Ângulo inclinado, enquadramento dinâmico e não convencional"),
  ]},
  V:{name:{en:"VISUAL STYLE",es:"ESTILO VISUAL",pt:"ESTILO VISUAL"},color:"#ec8800",multi:false,blocks:[
    mkB("V-01","photorealistic render, ultra-detailed, true-to-life materials","Render fotorrealista, ultra detallado, materiales fieles","Render fotorrealista, ultra detalhado, materiais fiéis"),
    mkB("V-02","architectural watercolor illustration, soft washes, hand-painted feel","Acuarela arquitectónica, manchas suaves, pintada a mano","Aquarela arquitetônica, lavagens suaves, pintada à mão"),
    mkB("V-03","clean line-art drawing, minimal black and white linework","Dibujo de líneas limpio, trazo minimalista en b/n","Desenho de linhas limpo, traço minimalista em p/b"),
    mkB("V-04","physical scale model photography style, miniature and tactile","Fotografía de maqueta física a escala, sensación miniatura","Fotografia de maquete física em escala, sensação miniatura"),
    mkB("V-05","soft pastel illustration, muted color palette, editorial feel","Ilustración en pastel suave, paleta apagada, sensación editorial","Ilustração em pastel suave, paleta apagada, sensação editorial"),
    mkB("V-06","technical blueprint style, cyanotype blue and white linework","Plano técnico, líneas blancas sobre azul cianotipo","Planta técnica, linhas brancas sobre azul cianótipo"),
    mkB("V-07","isometric illustration style, clean flat colors, no perspective distortion","Isométrica, colores planos limpios, sin distorsión","Isométrica, cores planas limpas, sem distorção"),
    mkB("V-08","charcoal sketch style, expressive loose linework, high contrast","Boceto a carbón, trazo expresivo y suelto, alto contraste","Esboço a carvão, traço expressivo e solto, alto contraste"),
    mkB("V-09","matte painting style, painterly atmosphere, cinematic color grading","Matte painting, atmósfera pictórica, color cinematográfico","Matte painting, atmosfera pictórica, cor cinematográfica"),
    mkB("V-10","low-poly 3D illustration, simplified geometric forms, flat shading","3D low-poly, formas simplificadas, sombreado plano","3D low-poly, formas simplificadas, sombreamento plano"),
    mkB("V-11","vintage architectural print style, sepia tones, aged paper texture","Lámina vintage, tonos sepia, papel envejecido","Gravura vintage, tons sépia, papel envelhecido"),
    mkB("V-12","bold graphic poster style, high contrast flat colors, minimal detail","Póster gráfico, colores planos alto contraste, mínimo detalle","Cartaz gráfico, cores planas alto contraste, mínimo detalhe"),
  ]},
};

const CAT_ORDER = ["E","S","M","N","L","T","A","C","V"];

function getBname(b, lang) { return lang==="en"?b.en:(b[lang]||b.en); }
function getCatName(cat, lang) { return cat.name[lang]||cat.name.en; }
function getTagLabel(tag, lang) { return tag[lang]||tag.en; }
function getQLabel(g, lang) { return g.label[lang]||g.label.en; }
function getAcLabel(a, lang) { return lang==="en"?a.en:(a[lang]||a.en); }
function getPrLabel(p, lang) { return lang==="en"?p.en:(p[lang]||p.en); }
function getPrDesc(p, lang) { if(lang==="en")return p.en; return p[`desc_${lang}`]||p.en; }

function buildPrompt(accion, pres, styleDims, sel, multiSel, calidad) {
  const parts=[];
  if(accion) parts.push(accion.en);
  if(pres) parts.push(pres.en);
  if(styleDims&&styleDims.length){
    const dimTexts=styleDims.map(code=>{const d=STYLE_DIMS.find(x=>x.code===code);return d?d.en:null;}).filter(Boolean);
    if(dimTexts.length) parts.push(dimTexts.join(" "));
  }
  CAT_ORDER.forEach(k=>{
    if(k==="M"){
      const ms=multiSel.M||[];
      if(ms.length) parts.push(ms.map(b=>b.en).join(", "));
    } else {
      if(sel[k]) parts.push(sel[k].en);
    }
  });
  const totalQ=Q_ORDER.reduce((s,gk)=>s+(calidad[gk]||[]).length,0);
  const effQ=totalQ===0?OPTIMAL_PRESET:calidad;
  const tags=[];
  Q_ORDER.forEach(gk=>(effQ[gk]||[]).forEach(t=>tags.push(t)));
  if(tags.length) parts.push(tags.join(", "));
  return parts.join(" ");
}

function pickRandom(arr, ex){ const p=ex?arr.filter(b=>b.code!==ex):arr; return p[Math.floor(Math.random()*p.length)]; }
function nextCode(k,cb){ return `${k}-C${String(((cb[k]||[]).length)+1).padStart(2,"0")}`; }

const ACTION_PROMPT_I18N = {
  "AC-01":{es:"Transforma este render arquitectónico en una fotografía arquitectónica ultra realista.",pt:"Transforme este render arquitetônico em uma fotografia arquitetônica ultra-realista."},
  "AC-02":{es:"Transforma esta vista de SketchUp en una fotografía arquitectónica ultra realista.",pt:"Transforme esta vista do SketchUp em uma fotografia arquitetônica ultra-realista."},
  "AC-03":{es:"Genera una visualización arquitectónica ultra realista a partir de este croquis conceptual.",pt:"Gere uma visualização arquitetônica ultra-realista a partir deste esboço conceitual."},
  "AC-04":{es:"Mejora y reinterpreta este render arquitectónico como una imagen final fotorrealista.",pt:"Aprimore e reinterprete este render arquitetônico como uma imagem final fotorrealista."},
  "AC-05":{es:"Genera un nuevo render arquitectónico fotorrealista basado en esta imagen de referencia.",pt:"Gere um novo render arquitetônico fotorrealista com base nesta imagem de referência."},
  "AC-06":{es:"Genera una visualización arquitectónica fotorrealista.",pt:"Gere uma visualização arquitetônica fotorrealista."},
  "AC-07":{es:"Usando el modelo arquitectónico proporcionado como geometría base, aplica el estilo visual, los materiales, la paleta de color y la atmósfera de la imagen de referencia.",pt:"Usando o modelo arquitetônico fornecido como geometria base, aplique o estilo visual, os materiais, a paleta de cores e a atmosfera da imagem de referência."},
};

const PRES_PROMPT_I18N = {
  "PR-01":{
    es:"Preserva estrictamente la geometría original, las proporciones, la composición y la organización espacial. No alteres elementos estructurales, aberturas ni relaciones volumétricas. Aplica únicamente cambios superficiales como materiales, iluminación y atmósfera.",
    pt:"Preserve estritamente a geometria original, as proporções, a composição e a organização espacial. Não altere elementos estruturais, aberturas nem relações volumétricas. Aplique apenas mudanças superficiais, como materiais, iluminação e atmosfera."
  },
  "PR-02":{
    es:"Mantén la composición general y los elementos estructurales principales. Permite una reinterpretación creativa de materiales, iluminación, atmósfera y detalles secundarios. Si se proporciona una imagen de estilo, extrae su paleta cromática, lenguaje material y mood, y aplícalos al modelo base.",
    pt:"Mantenha a composição geral e os principais elementos estruturais. Permita uma reinterpretação criativa de materiais, iluminação, atmosfera e detalhes secundários. Se uma imagem de estilo for fornecida, extraia sua paleta cromática, linguagem material e mood, e aplique ao modelo base."
  },
  "PR-03":{
    es:"Usa el modelo base solo como una referencia espacial flexible. Reinterpreta libremente materiales, iluminación, atmósfera, elementos de escala y detalles secundarios para lograr la máxima calidad visual. Si se proporciona una imagen de estilo, absorbe completamente su lenguaje estético.",
    pt:"Use o modelo base apenas como uma referência espacial flexível. Reinterprete livremente materiais, iluminação, atmosfera, elementos de escala e detalhes secundários para alcançar a máxima qualidade visual. Se uma imagem de estilo for fornecida, absorva completamente sua linguagem estética."
  },
};

const STYLE_DIM_PROMPT_I18N = {
  "SD-01":{es:"Extrae únicamente la paleta material de la imagen de referencia: terminaciones, texturas y combinaciones de materiales. No transfieras su iluminación, atmósfera ni paisaje.",pt:"Extraia apenas a paleta material da imagem de referência: acabamentos, texturas e combinações de materiais. Não transfira sua iluminação, atmosfera nem paisagem."},
  "SD-02":{es:"Extrae únicamente la paleta de color de la imagen de referencia: tonos dominantes, rango tonal, equilibrio cálido/frío y relaciones cromáticas. No transfieras sus materiales, iluminación ni composición espacial.",pt:"Extraia apenas a paleta de cores da imagem de referência: tons dominantes, faixa tonal, equilíbrio quente/frio e relações cromáticas. Não transfira seus materiais, iluminação nem composição espacial."},
  "SD-03":{es:"Extrae únicamente el paisaje y el contexto de la imagen de referencia: vegetación, terreno, cielo y elementos ambientales. No transfieras sus materiales, terminaciones interiores ni iluminación artificial.",pt:"Extraia apenas a paisagem e o contexto da imagem de referência: vegetação, terreno, céu e elementos ambientais. Não transfira seus materiais, acabamentos interiores nem iluminação artificial."},
  "SD-04":{es:"Extrae únicamente la calidad de luz y las condiciones climáticas de la imagen de referencia: dirección, intensidad, hora del día, calidad de sombra y atmósfera. No transfieras sus materiales ni paisaje.",pt:"Extraia apenas a qualidade da luz e as condições climáticas da imagem de referência: direção, intensidade, hora do dia, qualidade das sombras e atmosfera. Não transfira seus materiais nem paisagem."},
  "SD-05":{es:"Extrae el mood general y la atmósfera de la imagen de referencia: tono emocional, sensación de escala, presencia humana y calidad narrativa. Aplica esa sensación al modelo base sin copiar materiales ni paisaje específicos.",pt:"Extraia o mood geral e a atmosfera da imagem de referência: tom emocional, sensação de escala, presença humana e qualidade narrativa. Aplique essa sensação ao modelo base sem copiar materiais nem paisagem específicos."},
  "SD-06":{es:"Extrae únicamente el lenguaje arquitectónico de la imagen de referencia: composición formal, relaciones de masa, ritmo de fachada y sistema proporcional. No transfieras materiales ni paleta cromática específicos.",pt:"Extraia apenas a linguagem arquitetônica da imagem de referência: composição formal, relações de massa, ritmo de fachada e sistema proporcional. Não transfira materiais nem paleta cromática específicos."},
  "SD-07":{es:"Extrae el estilo fotográfico y de render de la imagen de referencia: ángulo de cámara, características de lente, profundidad de campo, posproducción y tratamiento visual general.",pt:"Extraia o estilo fotográfico e de render da imagem de referência: ângulo de câmera, características da lente, profundidade de campo, pós-produção e tratamento visual geral."},
};

const NEGATIVE_I18N = {
  "distorted geometry":{es:"geometría distorsionada",pt:"geometria distorcida"},
  "changed facade":{es:"fachada modificada",pt:"fachada modificada"},
  "altered proportions":{es:"proporciones alteradas",pt:"proporções alteradas"},
  "extra floors":{es:"pisos adicionales",pt:"pavimentos adicionais"},
  "missing openings":{es:"aberturas faltantes",pt:"aberturas ausentes"},
  "new windows":{es:"ventanas nuevas no solicitadas",pt:"janelas novas não solicitadas"},
  "warped perspective":{es:"perspectiva deformada",pt:"perspectiva deformada"},
  "incorrect structure":{es:"estructura incorrecta",pt:"estrutura incorreta"},
  "melted architecture":{es:"arquitectura derretida o deformada",pt:"arquitetura derretida ou deformada"},
  "floating furniture":{es:"mobiliario flotante",pt:"mobiliário flutuante"},
  "duplicated objects":{es:"objetos duplicados",pt:"objetos duplicados"},
  "unrealistic scale":{es:"escala irreal",pt:"escala irreal"},
  "overexposed image":{es:"imagen sobreexpuesta",pt:"imagem superexposta"},
  "low resolution":{es:"baja resolución",pt:"baixa resolução"},
  "artifacts":{es:"artefactos visuales",pt:"artefatos visuais"},
  "cartoon style":{es:"estilo caricatura",pt:"estilo cartoon"},
  "childish drawing":{es:"dibujo infantil",pt:"desenho infantil"},
  "oversaturation":{es:"sobresaturación",pt:"supersaturação"},
  "chaotic composition":{es:"composición caótica",pt:"composição caótica"},
  "text or watermark":{es:"texto o marca de agua",pt:"texto ou marca d'água"},
  "redesigned building":{es:"edificio rediseñado",pt:"edifício redesenhado"},
  "modified massing":{es:"volumetría modificada",pt:"volumetria modificada"},
  "moved walls":{es:"muros desplazados",pt:"paredes deslocadas"},
  "changed roof geometry":{es:"geometría de cubierta modificada",pt:"geometria da cobertura modificada"},
  "different camera angle":{es:"ángulo de cámara diferente",pt:"ângulo de câmera diferente"},
  "changed aspect ratio":{es:"relación de aspecto modificada",pt:"proporção da imagem modificada"},
  "major structural changes":{es:"cambios estructurales importantes",pt:"mudanças estruturais importantes"},
  "unrecognizable original project":{es:"proyecto original irreconocible",pt:"projeto original irreconhecível"},
  "conflicting materials":{es:"materiales incoherentes",pt:"materiais incoerentes"},
  "cluttered entourage":{es:"entourage saturado",pt:"entourage saturado"},
  "illegible architecture":{es:"arquitectura ilegible",pt:"arquitetura ilegível"},
  "loss of spatial hierarchy":{es:"pérdida de jerarquía espacial",pt:"perda de hierarquia espacial"},
  "random decorative elements":{es:"elementos decorativos aleatorios",pt:"elementos decorativos aleatórios"},
  "reference image copied literally":{es:"imagen de referencia copiada literalmente",pt:"imagem de referência copiada literalmente"},
  "style overpowering base geometry":{es:"estilo que domina y anula la geometría base",pt:"estilo que domina e anula a geometria base"},
  "mismatched perspective between model and reference":{es:"perspectiva incoherente entre modelo y referencia",pt:"perspectiva incoerente entre modelo e referência"},
};

const OUTPUT_WRAP_I18N = {
  es:{
    universal:(prompt, negative)=>prompt,
    gpt:(prompt, negative)=>`Usa la imagen arquitectónica adjunta como referencia bloqueada cuando corresponda. ${prompt} Mantén la instrucción como una única indicación final de imagen. Evita estos errores: ${negative}.`,
    midjourney:(prompt, negative, aspectRatio="16:9")=>`${prompt} --style raw --ar ${aspectRatio} --no ${negative}`,
    sd:(prompt, negative)=>`PROMPT POSITIVO:\n${prompt}\n\nPROMPT NEGATIVO:\n${negative}`,
    krea:(prompt, negative)=>`Mejora la imagen arquitectónica proporcionada usando esta dirección:\n${prompt}\n\nPreserva la identidad del proyecto original y evita: ${negative}.`,
    client:(prompt, negative)=>`Objetivo visual para cliente:\nConvertir la imagen o modelo arquitectónico en una visualización profesional, manteniendo la geometría, composición e identidad del proyecto.\n\nDirección creativa:\n${prompt}\n\nRestricciones importantes:\nNo modificar la volumetría, aberturas, proporciones ni estructura principal. Evitar: ${negative}.`
  },
  pt:{
    universal:(prompt, negative)=>prompt,
    gpt:(prompt, negative)=>`Use a imagem arquitetônica anexada como referência bloqueada quando aplicável. ${prompt} Mantenha a instrução como uma única indicação final de imagem. Evite estes erros: ${negative}.`,
    midjourney:(prompt, negative, aspectRatio="16:9")=>`${prompt} --style raw --ar ${aspectRatio} --no ${negative}`,
    sd:(prompt, negative)=>`PROMPT POSITIVO:\n${prompt}\n\nPROMPT NEGATIVO:\n${negative}`,
    krea:(prompt, negative)=>`Aprimore a imagem arquitetônica fornecida usando esta direção:\n${prompt}\n\nPreserve a identidade do projeto original e evite: ${negative}.`,
    client:(prompt, negative)=>`Objetivo visual para cliente:\nConverter a imagem ou modelo arquitetônico em uma visualização profissional, mantendo a geometria, composição e identidade do projeto.\n\nDireção criativa:\n${prompt}\n\nRestrições importantes:\nNão modificar a volumetria, aberturas, proporções nem estrutura principal. Evitar: ${negative}.`
  }
};

function localizeActionPrompt(accion, lang){
  if(!accion) return "";
  if(lang==="en") return accion.en;
  return ACTION_PROMPT_I18N[accion.code]?.[lang] || accion.en;
}

function localizePresPrompt(pres, lang){
  if(!pres) return "";
  if(lang==="en") return pres.en;
  return PRES_PROMPT_I18N[pres.code]?.[lang] || pres.en;
}

function localizeQualityTag(tag, lang){
  if(lang==="en") return tag;
  for(const group of Object.values(QTAGS)){
    for(const item of group.tags){
      if(item.en===tag) return item[lang] || tag;
    }
  }
  return tag;
}

function localizeNegativeTerm(term, lang){
  if(lang==="en") return term;
  return NEGATIVE_I18N[term]?.[lang] || term;
}

function buildPromptLang(accion, pres, styleDims, sel, multiSel, calidad, lang){
  if(lang==="en") return buildPrompt(accion,pres,styleDims,sel,multiSel,calidad);
  const parts=[];
  if(accion) parts.push(localizeActionPrompt(accion,lang));
  if(pres) parts.push(localizePresPrompt(pres,lang));
  if(styleDims&&styleDims.length){
    const dimTexts=styleDims.map(code=>{
      const d=STYLE_DIMS.find(x=>x.code===code);
      return d ? (STYLE_DIM_PROMPT_I18N[code]?.[lang] || d[`desc_${lang}`] || d.en) : null;
    }).filter(Boolean);
    if(dimTexts.length) parts.push(dimTexts.join(" "));
  }
  CAT_ORDER.forEach(k=>{
    if(k==="M"){
      const ms=multiSel.M||[];
      if(ms.length) parts.push(ms.map(b=>b[lang]||b.en).join(", "));
    } else {
      if(sel[k]) parts.push(sel[k][lang]||sel[k].en);
    }
  });
  const totalQ=Q_ORDER.reduce((s,gk)=>s+(calidad[gk]||[]).length,0);
  const effQ=totalQ===0?OPTIMAL_PRESET:calidad;
  const tags=[];
  Q_ORDER.forEach(gk=>(effQ[gk]||[]).forEach(t=>tags.push(localizeQualityTag(t,lang))));
  if(tags.length) parts.push(tags.join(", "));
  return parts.join(" ");
}

function buildNegativePromptLang(accion, pres, outputMode, lang){
  if(lang==="en") return buildNegativePrompt(accion,pres,outputMode);
  const parts=[...NEGATIVE_BASE, ...(pres?NEGATIVE_BY_PRES[pres.code]||[]:[])];
  if(accion?.code==="AC-07") parts.push("reference image copied literally", "style overpowering base geometry", "mismatched perspective between model and reference");
  const localized=Array.from(new Set(parts)).map(term=>localizeNegativeTerm(term,lang));
  return outputMode==="midjourney" ? localized.join(", ") : localized.join("; ");
}

function buildOutputPromptLang(prompt, negative, outputMode, includeNegative, lang, aspectRatio="16:9"){
  if(!prompt) return "";
  if(lang==="en") return buildOutputPrompt(prompt,negative,outputMode,includeNegative,aspectRatio);
  if(!includeNegative || outputMode==="universal") return prompt;
  const wrap=OUTPUT_WRAP_I18N[lang] || OUTPUT_WRAP_I18N.es;
  return (wrap[outputMode]||wrap.universal)(prompt, negative, aspectRatio);
}

async function translatePrompt(text, targetLang, ctx={}){
  if(!text||targetLang==="en") return "";
  const localizedPrompt=buildPromptLang(
    ctx.accion,
    ctx.pres,
    ctx.styleDims||[],
    ctx.sel||{},
    ctx.multiSel||{M:[]},
    ctx.calidad||{},
    targetLang
  );
  const localizedNegative=buildNegativePromptLang(ctx.accion,ctx.pres,ctx.outputMode||"universal",targetLang);
  return buildOutputPromptLang(localizedPrompt,localizedNegative,ctx.outputMode||"universal",ctx.includeNegative!==false,targetLang,ctx.aspectRatio||"16:9");
}

// ─── CUSTOM DROPDOWN ────────────────────────────────────────────────────────
const CatDropdown = React.memo(function CatDropdown({catKey, cat, lang, value, multiValue, onChange, onMultiToggle, onStar, isSaved, t}){
  const [open, setOpen]=useState(false);
  const ref=useRef(null);
  const isMulti=cat.multi;

  useEffect(()=>{
    const handler=(e)=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",handler);
    return ()=>document.removeEventListener("mousedown",handler);
  },[]);

  const selectedLabel = isMulti
    ? (multiValue&&multiValue.length ? t.selectedItems(multiValue.length) : t.selectBlock)
    : (value ? getBname(value,lang) : t.selectBlock);

  return (
    <div ref={ref} style={{position:"relative",marginBottom:"7px",color:"#111111"}}>
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{...S.dropBtn, borderColor: (isMulti?multiValue?.length:value)?CATS[catKey].color:"#d0d0d0"}}>
        <span style={{flex:1,textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:"11px"}}>
          {selectedLabel}
        </span>
        <span style={{fontSize:"9px",color:"#7a7a7a",marginLeft:"4px"}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div className="vps-scrollbar" style={S.dropList}>
          {!isMulti&&value&&(
            <div style={{...S.dropItem,background:"#f5f5f5",borderBottom:"1px solid #d0d0d0"}}>
              <span style={{fontSize:"10px",color:"#474747",flex:1}}>{t.clearSel} {getBname(value,lang)}</span>
              <button style={S.dropClear} onClick={()=>{onChange(null);setOpen(false);}}>{t.clearSel} {t.clearSelection}</button>
            </div>
          )}
          {cat.blocks.map(b=>{
            const active=isMulti?(multiValue||[]).some(x=>x.code===b.code):(value?.code===b.code);
            const saved=isSaved(catKey,b.code);
            return(
              <div key={b.code} style={{...S.dropItem,...(active?{background:"#fff4e6"}:{})}}>
                <button style={S.dropCodeBtn} onClick={()=>{ if(isMulti){onMultiToggle(b);}else{onChange(b);setOpen(false);} }}>
                  <span style={{fontFamily:MONO_FONT,fontSize:"9px",color:cat.color,fontWeight:700,minWidth:"36px"}}>{b.code}</span>
                  <span style={{fontSize:"10.5px",color:"#2c2c2c",flex:1,textAlign:"left",lineHeight:1.3}}>
                    {getBname(b,lang)}
                    {lang!=="en"&&<span style={{display:"block",fontFamily:MONO_FONT,fontSize:"8.5px",color:"#7a7a7a"}}>{b.en}</span>}
                  </span>
                  {isMulti&&<span style={{fontSize:"11px",color:active?cat.color:"#ccc",marginLeft:"4px"}}>{active?"✓":""}</span>}
                </button>
                <button style={{...S.dropStar,...(saved?S.starOn:{})}} onClick={()=>onStar(catKey,b)}>
                  {saved?"★":"☆"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});


const Icon = React.memo(function Icon({name,size=16,color="currentColor",stroke=1.8}){
  const common={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:color,strokeWidth:stroke,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":true};
  switch(name){
    case "home": return <svg {...common}><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>;
    case "check": return <svg {...common}><path d="M20 6 9 17l-5-5"/></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></svg>;
    case "shield": return <svg {...common}><path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg>;
    case "login": return <svg {...common}><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>;
    case "pricing": return <svg {...common}><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 1 1 2.2-3.7L12 7z"/><path d="M12 7h4.5a2.5 2.5 0 1 0-2.2-3.7L12 7z"/></svg>;
    case "builder": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "bank": return <svg {...common}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/></svg>;
    case "favorites": return <svg {...common}><path d="m12 17.3-5.2 3 1.4-5.9L3.5 10l6.1-.5L12 4l2.4 5.5 6.1.5-4.7 4.4 1.4 5.9z"/></svg>;
    case "action": return <svg {...common}><path d="m14 5 5 5"/><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10z"/></svg>;
    case "lock": return <svg {...common}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></svg>;
    case "blocks": return <svg {...common}><path d="M4 8.5 12 4l8 4.5-8 4.5z"/><path d="M4 15.5 12 20l8-4.5"/><path d="M4 12l8 4.5 8-4.5"/></svg>;
    case "output": return <svg {...common}><path d="M5 12h10"/><path d="m11 6 6 6-6 6"/></svg>;
    case "spark": return <svg {...common}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/></svg>;
    case "result": return <svg {...common}><path d="M7 3h8l5 5v13H7z"/><path d="M15 3v5h5"/><path d="M10 13h6"/><path d="M10 17h6"/></svg>;
    case "target": return <svg {...common}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>;
    case "sliders": return <svg {...common}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="18" r="2"/></svg>;
    case "copy": return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
  }
});


// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("es");
  const t=T[lang];
  const [tab,setTab]=useState("builder");
  const [accion,setAccion]=useState(null);
  const [pres,setPres]=useState(null);
  const [sel,setSel]=useState({});       // single-select categories
  const [multiSel,setMultiSel]=useState({M:[]}); // multi-select (Materiales)
  const [calidad,setCalidad]=useState({});
  const [styleDims,setStyleDims]=useState([]); // dimensiones seleccionadas para AC-07
  const [copied,setCopied]=useState(false);
  const [favorites,setFavorites]=useState([]);
  const [projects,setProjects]=useState([]);
  const [projectName,setProjectName]=useState("");
  const [custom,setCustom]=useState({});
  const [loaded,setLoaded]=useState(false);
  const [flash,setFlash]=useState(null);
  const [bankFilter,setBankFilter]=useState("");
  const [addingTo,setAddingTo]=useState(null);
  const [newEn,setNewEn]=useState(""); const [newDesc,setNewDesc]=useState("");
  const [translation,setTranslation]=useState("");
  const [translating,setTranslating]=useState(false);
  const [savingQFav,setSavingQFav]=useState(false);
  const [qFavName,setQFavName]=useState("");
  const [outputMode,setOutputMode]=useState("universal");
  const [aspectRatio,setAspectRatio]=useState("16:9");
  const [includeNegative,setIncludeNegative]=useState(true);
  const [copiedNegative,setCopiedNegative]=useState(false);
  const [activeRecipe,setActiveRecipe]=useState(null);
  const [workspaceUser,setWorkspaceUser]=useState(()=>{try{return window.localStorage?.getItem("vps_active_user")||"manual-client";}catch(e){return "manual-client";}});
  const translateTimer=useRef(null);
  const [viewportWidth,setViewportWidth]=useState(typeof window!=="undefined"?window.innerWidth:1440);

  useEffect(()=>{
    const onResize=()=>setViewportWidth(window.innerWidth);
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);


  const showPres=accion?.needs_image===true;
  const totalQ=useMemo(()=>Q_ORDER.reduce((s,gk)=>s+(calidad[gk]||[]).length,0),[calidad]);
  const isOptimal=totalQ===0;
  const isMobile=viewportWidth<960;
  const isTablet=viewportWidth<1280;
  const storageScope=useMemo(()=>`vps_${String(workspaceUser||"manual-client").trim().toLowerCase().replace(/[^a-z0-9]+/g,"_")}`,[workspaceUser]);

  const cats=useMemo(()=>{
    const m={};
    CAT_ORDER.forEach(k=>{m[k]={...CATS[k],blocks:[...CATS[k].blocks,...(custom[k]||[])]};});
    return m;
  },[custom]);

  const fullPrompt=useMemo(()=>buildPrompt(accion,showPres?pres:null,accion?.code==="AC-07"?styleDims:[],sel,multiSel,calidad),[accion,pres,showPres,styleDims,sel,multiSel,calidad]);
  const negativePrompt=useMemo(()=>buildNegativePrompt(accion,pres,outputMode),[accion,pres,outputMode]);
  const outputPrompt=useMemo(()=>buildOutputPrompt(fullPrompt,negativePrompt,outputMode,includeNegative,aspectRatio),[fullPrompt,negativePrompt,outputMode,includeNegative,aspectRatio]);
  const promptScore=useMemo(()=>analyzePrompt(accion,pres,sel,multiSel,calidad),[accion,pres,sel,multiSel,calidad]);

  // Local final-prompt translation with debounce. It mirrors the selected output mode.
  useEffect(()=>{
    if(lang==="en"){setTranslation("");setTranslating(false);return;}
    if(!fullPrompt){setTranslation("");setTranslating(false);return;}
    clearTimeout(translateTimer.current);
    translateTimer.current=setTimeout(async()=>{
      setTranslating(true);
      const tr=await translatePrompt(fullPrompt,lang,{
        accion,
        pres:showPres?pres:null,
        styleDims:accion?.code==="AC-07"?styleDims:[],
        sel,
        multiSel,
        calidad,
        outputMode,
        aspectRatio,
        includeNegative,
      });
      setTranslation(tr); setTranslating(false);
    },250);
    return()=>clearTimeout(translateTimer.current);
  },[fullPrompt,lang,accion,pres,showPres,styleDims,sel,multiSel,calidad,outputMode,aspectRatio,includeNegative]);

  useEffect(()=>{
    (async()=>{
      setLoaded(false);
      try{const r=await readStore(`${storageScope}_fav_v7`);setFavorites(r?.value?JSON.parse(r.value):[]);}catch(e){setFavorites([]);}
      try{const r=await readStore(`${storageScope}_projects_v7`);setProjects(r?.value?JSON.parse(r.value):[]);}catch(e){setProjects([]);}
      try{const r=await readStore(`${storageScope}_custom_v7`);setCustom(r?.value?JSON.parse(r.value):{});}catch(e){setCustom({});}
      setLoaded(true);
    })();
  },[storageScope]);

  const showFlash=useCallback(msg=>{setFlash(msg);setTimeout(()=>setFlash(null),1600);},[]);
  const saveFavs=useCallback(async next=>{setFavorites(next);try{await writeStore(`${storageScope}_fav_v7`,JSON.stringify(next));}catch(e){};},[storageScope]);
  const saveProjectsCb=useCallback(async next=>{setProjects(next);try{await writeStore(`${storageScope}_projects_v7`,JSON.stringify(next));}catch(e){};},[storageScope]);
  const saveCustomCb=useCallback(async next=>{setCustom(next);try{await writeStore(`${storageScope}_custom_v7`,JSON.stringify(next));}catch(e){};},[storageScope]);

  const isSaved=useCallback((k,code)=>favorites.some(f=>f.type==="block"&&f.catKey===k&&f.code===code),[favorites]);
  const toggleBlock=useCallback((k,b)=>{
    const ex=favorites.some(f=>f.type==="block"&&f.catKey===k&&f.code===b.code);
    if(ex){saveFavs(favorites.filter(f=>!(f.type==="block"&&f.catKey===k&&f.code===b.code)));showFlash(t.removed);}
    else{saveFavs([...favorites,{type:"block",catKey:k,code:b.code,en:b.en,desc:getBname(b,lang)}]);showFlash("★");}
  },[favorites,saveFavs,showFlash,lang,t]);

  const savePromptFav=useCallback(()=>{
    if(!outputPrompt)return;
    saveFavs([...favorites,{type:"prompt",text:outputPrompt,translation,accionLabel:accion?getAcLabel(accion,lang):"",outputMode,aspectRatio,savedAt:Date.now()}]);
    showFlash(t.savePrompt);
  },[outputPrompt,translation,favorites,saveFavs,showFlash,accion,lang,t,outputMode,aspectRatio]);

  const saveQFavCb=useCallback(()=>{
    if(!qFavName.trim())return;
    saveFavs([...favorites,{type:"quality",name:qFavName.trim(),calidad:{...calidad},savedAt:Date.now()}]);
    setSavingQFav(false);setQFavName("");showFlash("★");
  },[qFavName,calidad,favorites,saveFavs,showFlash]);

  const removeFav=useCallback(i=>saveFavs(favorites.filter((_,j)=>j!==i)),[favorites,saveFavs]);

  const randomizeAll=useCallback(()=>{
    const next={};
    CAT_ORDER.forEach(k=>{
      if(k==="M"){
        const pick=[pickRandom(cats[k].blocks)];
        if(Math.random()>0.5) pick.push(pickRandom(cats[k].blocks,pick[0].code));
        setMultiSel({M:pick});
      } else {next[k]=pickRandom(cats[k].blocks);}
    });
    setSel(next);
    setAccion(ACCION_DATA[Math.floor(Math.random()*ACCION_DATA.length)]);
    setPres(PRES_DATA[Math.floor(Math.random()*PRES_DATA.length)]);
    setCopied(false);
  },[cats]);

  const clearAll=useCallback(()=>{setSel({});setMultiSel({M:[]});setCalidad({});setAccion(null);setPres(null);setStyleDims([]);setOutputMode("universal");setAspectRatio("16:9");setIncludeNegative(true);setActiveRecipe(null);setCopied(false);setTranslation("");},[]);
  const toggleQ=useCallback((gk,tag)=>{setCalidad(prev=>{const c=prev[gk]||[];return{...prev,[gk]:c.includes(tag)?c.filter(x=>x!==tag):[...c,tag]};});},[]);

  const applyRecipe=useCallback((recipe)=>{
    const ac=ACCION_DATA.find(a=>a.code===recipe.accion)||null;
    const pr=PRES_DATA.find(p=>p.code===recipe.pres)||null;
    const nextSel={};
    Object.entries(recipe.sel||{}).forEach(([k,code])=>{const b=findBlock(cats,k,code); if(b) nextSel[k]=b;});
    const nextMulti={M:[]};
    Object.entries(recipe.multi||{}).forEach(([k,codes])=>{nextMulti[k]=codes.map(code=>findBlock(cats,k,code)).filter(Boolean);});
    setAccion(ac); setPres(pr); setSel(nextSel); setMultiSel(nextMulti); setStyleDims(recipe.styleDims||[]); setOutputMode(recipe.output||"universal"); setAspectRatio(recipe.aspectRatio||"16:9"); setIncludeNegative(true); setActiveRecipe(recipe.code); setCopied(false);
    showFlash(`${t.recipeApply}: ${recipe.name[lang]||recipe.name.en}`);
  },[cats,showFlash,t,lang]);

  const copyNegative=useCallback(async()=>{
    if(!negativePrompt)return;
    try{await navigator.clipboard.writeText(negativePrompt);setCopiedNegative(true);setTimeout(()=>setCopiedNegative(false),1800);}
    catch(e){const ta=document.createElement("textarea");ta.value=negativePrompt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.focus();ta.select();document.execCommand("copy");document.body.removeChild(ta);setCopiedNegative(true);setTimeout(()=>setCopiedNegative(false),1800);}
  },[negativePrompt]);

  const scoreText=useCallback((v)=>v==="high"?t.scoreHigh:v==="medium"?t.scoreMedium:v==="low"?t.scoreLow:v==="missing"?t.scoreMissing:v==="na"?t.scoreNA:v, [t]);

  const copy=useCallback(async()=>{
    if(!outputPrompt)return;
    try{
      await navigator.clipboard.writeText(outputPrompt);
      setCopied(true);setTimeout(()=>setCopied(false),1800);
    }catch(e){
      // fallback
      const ta=document.createElement("textarea");
      ta.value=outputPrompt;ta.style.position="fixed";ta.style.opacity="0";
      document.body.appendChild(ta);ta.focus();ta.select();
      document.execCommand("copy");document.body.removeChild(ta);
      setCopied(true);setTimeout(()=>setCopied(false),1800);
    }
  },[outputPrompt]);

  const copyText=useCallback(async(textToCopy, message)=>{
    if(!textToCopy)return;
    try{await navigator.clipboard.writeText(textToCopy);}
    catch(e){
      const ta=document.createElement("textarea");
      ta.value=textToCopy;ta.style.position="fixed";ta.style.opacity="0";
      document.body.appendChild(ta);ta.focus();ta.select();
      document.execCommand("copy");document.body.removeChild(ta);
    }
    showFlash(message||t.copied);
  },[showFlash,t]);

  const copyTranslation=useCallback(()=>{
    if(!translation)return;
    copyText(translation,t.copiedTranslation);
  },[translation,copyText,t]);

  const makeProjectSnapshot=useCallback((name)=>({
    id:`p_${Date.now()}`,
    name:name.trim(),
    savedAt:Date.now(),
    accionCode:accion?.code||null,
    presCode:pres?.code||null,
    selCodes:Object.fromEntries(Object.entries(sel||{}).filter(([,b])=>b).map(([k,b])=>[k,b.code])),
    multiCodes:Object.fromEntries(Object.entries(multiSel||{}).map(([k,arr])=>[k,(arr||[]).map(b=>b.code)])),
    calidad:{...calidad},
    styleDims:[...styleDims],
    outputMode,
    aspectRatio,
    includeNegative,
  }),[accion,pres,sel,multiSel,calidad,styleDims,outputMode,aspectRatio,includeNegative]);

  const saveCurrentProject=useCallback(()=>{
    if(!projectName.trim())return;
    const snapshot=makeProjectSnapshot(projectName);
    saveProjectsCb([snapshot,...projects.filter(p=>p.name.trim().toLowerCase()!==projectName.trim().toLowerCase())]);
    setProjectName("");
    showFlash(t.projectSaved);
  },[projectName,makeProjectSnapshot,saveProjectsCb,projects,showFlash,t]);

  const loadProject=useCallback((project)=>{
    const ac=ACCION_DATA.find(a=>a.code===project.accionCode)||null;
    const pr=PRES_DATA.find(p=>p.code===project.presCode)||null;
    const nextSel={};
    Object.entries(project.selCodes||{}).forEach(([k,code])=>{const b=findBlock(cats,k,code); if(b) nextSel[k]=b;});
    const nextMulti={};
    Object.entries(project.multiCodes||{}).forEach(([k,codes])=>{nextMulti[k]=(codes||[]).map(code=>findBlock(cats,k,code)).filter(Boolean);});
    setAccion(ac); setPres(pr); setSel(nextSel); setMultiSel({...{M:[]},...nextMulti}); setCalidad(project.calidad||{}); setStyleDims(project.styleDims||[]);
    setOutputMode(project.outputMode||"universal"); setAspectRatio(project.aspectRatio||"16:9"); setIncludeNegative(project.includeNegative!==false); setActiveRecipe(null); setCopied(false); setTab("builder");
    showFlash(t.projectLoaded);
  },[cats,showFlash,t]);

  const removeProject=useCallback((id)=>saveProjectsCb(projects.filter(p=>p.id!==id)),[projects,saveProjectsCb]);


  const addCustomBlock=useCallback(k=>{
    if(!newEn.trim())return;
    const code=nextCode(k,custom);
    const nb={code,en:newEn.trim(),es:newDesc.trim()||newEn.trim(),pt:newDesc.trim()||newEn.trim()};
    saveCustomCb({...custom,[k]:[...(custom[k]||[]),nb]});
    setNewEn("");setNewDesc("");setAddingTo(null);showFlash(t.addConfirm);
  },[newEn,newDesc,custom,saveCustomCb,showFlash,t]);

  const removeCustomBlock=useCallback((k,code)=>saveCustomCb({...custom,[k]:(custom[k]||[]).filter(b=>b.code!==code)}),[custom,saveCustomCb]);

  const totalBlocks=CAT_ORDER.reduce((s,k)=>s+cats[k].blocks.length,0);
  const effectiveCalidad=isOptimal?OPTIMAL_PRESET:calidad;
  const visibleTabs = [ ["builder",t.tabBuilder,"builder"], ["bank",`${t.tabBank} (${totalBlocks})`,"bank"], ["favorites",`${t.tabFavorites}${favorites.length?` (${favorites.length})`:""}`,"favorites"] ];

  // Favorites organized by category
  const favByCategory=useMemo(()=>{
    const grouped={};
    CAT_ORDER.forEach(k=>{grouped[k]=[];});
    favorites.forEach((f,i)=>{if(f.type==="block"&&grouped[f.catKey])grouped[f.catKey].push({...f,_idx:i});});
    return grouped;
  },[favorites]);
  const favPrompts=favorites.map((f,i)=>({...f,_idx:i})).filter(f=>f.type==="prompt");
  const favQuality=favorites.map((f,i)=>({...f,_idx:i})).filter(f=>f.type==="quality");

  return(
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;700;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        html,body,#root{margin:0;min-height:100%;background:#0d0d0f;}
        *{box-sizing:border-box;}
        :focus-visible{outline:2px solid #ff9800;outline-offset:2px;border-radius:4px;}
        button:focus-visible,input:focus-visible{outline:2px solid #ff9800;outline-offset:2px;}
        ::selection{background:rgba(255,152,0,.32);color:#111;}
        /* ── Blueprint grid: faint technical graph-paper texture, used behind key sheets ── */
        .vps-grid{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:28px 28px;background-position:-1px -1px;}
        /* ── Drawing-sheet registration marks: the page's signature detail ──
             Borrowed from the corner crop/registration marks on a printed architectural
             drawing sheet. Applied sparingly, only on the header, hero and the
             generated-prompt "plate" — the three places a real sheet would be stamped. */
        .vps-plate{position:relative;}
        .vps-plate::before,.vps-plate::after{content:"";position:absolute;width:16px;height:16px;pointer-events:none;opacity:.55;z-index:2;}
        .vps-plate::before{top:10px;left:10px;border-top:1.5px solid #ff9800;border-left:1.5px solid #ff9800;}
        .vps-plate::after{bottom:10px;right:10px;border-bottom:1.5px solid #ff9800;border-right:1.5px solid #ff9800;}
        .vps-btn,.vps-card-hover,.vps-dark-card,.vps-tab{transition:transform .24s cubic-bezier(.2,.8,.2,1), box-shadow .24s ease, border-color .24s ease, background .24s ease, color .24s ease, filter .24s ease;}
        .vps-btn:hover,.vps-card-hover:hover,.vps-dark-card:hover,.vps-tab:hover{transform:translateY(-2px);}
        .vps-btn:active,.vps-card-hover:active,.vps-dark-card:active,.vps-tab:active{transform:translateY(0);}
        .vps-tab:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.12);}
        .vps-overview-card:hover{box-shadow:0 20px 44px rgba(0,0,0,.34);border-color:#3a3d42;}
        .vps-soft-card:hover{box-shadow:0 16px 34px rgba(0,0,0,.18);}
        .vps-dark-card:hover{box-shadow:0 18px 34px rgba(0,0,0,.24);border-color:#7a7a82;}
        .vps-result-panel{animation:vpsFadeUp .6s cubic-bezier(.2,.8,.2,1) both;}
        .vps-result-panel:hover{box-shadow:0 34px 78px rgba(255,152,0,.24),0 28px 62px rgba(0,0,0,.48);}
        .vps-landing-card{animation:vpsFadeUp .7s cubic-bezier(.2,.8,.2,1) both;}
        .vps-pricing-card{position:relative;isolation:isolate;}
        .vps-pricing-card:before{content:"";position:absolute;inset:-1px;border-radius:inherit;background:linear-gradient(115deg,transparent 0%,rgba(255,152,0,.22) 42%,rgba(255,255,255,.10) 50%,transparent 60%);transform:translateX(-120%);transition:transform .7s cubic-bezier(.2,.8,.2,1);z-index:-1;}
        .vps-pricing-card:hover:before{transform:translateX(120%);}
        .vps-pricing-card:hover{filter:brightness(1.04);}
        .vps-premium-card{animation:vpsPremiumGlow 3.8s ease-in-out infinite;}
        .vps-access-line{animation:vpsSweep 2.8s ease-in-out infinite;}
        .vps-scrollbar::-webkit-scrollbar{width:10px;height:10px;}
        .vps-scrollbar::-webkit-scrollbar-thumb{background:#3b3b3f;border-radius:999px;border:2px solid transparent;background-clip:padding-box;}
        .vps-scrollbar::-webkit-scrollbar-track{background:transparent;}
        .vps-compare-card:hover .vps-compare-overlay{opacity:1;}
        .vps-compare-card:hover .vps-compare-line{left:100%;}
        .vps-compare-card:hover .vps-compare-hint{opacity:1; transform:translate(-50%,0);}
        @keyframes vpsPulse{0%,100%{box-shadow:0 0 0 rgba(255,152,0,0)}50%{box-shadow:0 0 32px rgba(255,152,0,.24)}}
        @keyframes vpsFadeUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes vpsPremiumGlow{0%,100%{box-shadow:0 22px 54px rgba(255,152,0,.16),0 16px 42px rgba(0,0,0,.34)}50%{box-shadow:0 28px 70px rgba(255,152,0,.26),0 18px 46px rgba(0,0,0,.42)}}
        @keyframes vpsSweep{0%{transform:translateX(-120%);opacity:.2}50%{opacity:1}100%{transform:translateX(120%);opacity:.2}}
        @media (prefers-reduced-motion: reduce){.vps-result-panel,.vps-landing-card,.vps-premium-card,.vps-access-line{animation:none!important}.vps-btn,.vps-card-hover,.vps-dark-card,.vps-tab{transition:none!important}}
      `}</style>
      <div className="vps-plate vps-grid" style={S.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px"}}>
          <div>
            <div style={S.eyebrow}>WORKSPACE</div>
            <h1 style={S.brandTitle}><span style={S.brandWhite}>VISUALPROMPT</span> <span style={S.brandOrange}>STUDIO</span></h1>
            <div style={S.sub}>{workspaceUser}</div>
          </div>
          <div style={S.langSwitch}>
            {["en","es","pt"].map(l=>(
              <button key={l} style={{...S.langBtn,...(lang===l?S.langBtnOn:{})}} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{...S.tabBar, gridTemplateColumns:isMobile?"1fr":"repeat(3,minmax(0,1fr))"}}>
        {visibleTabs.map(([k,l,icon])=>(
          <button key={k} className="vps-tab" style={{...S.tab,...(tab===k?S.tabOn:{})}} onClick={()=>setTab(k)}>
            <span style={S.tabIcon}><Icon name={icon} size={15} color={tab===k?"#111111":"#d0d0d0"}/></span>
            <span>{l}</span>
          </button>
        ))}
      </div>


      {tab==="builder"&&<>
        <div style={{...S.overviewGrid,gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))"}}>
          <div className="vps-overview-card" style={S.overviewCard}>
            <div style={S.overviewHead}><span style={S.overviewIcon}><Icon name="action" size={16} color="#ff9800"/></span><div style={S.overviewLabel}>{t.acLabel}</div></div>
            <div style={S.overviewValue}>{accion?getAcLabel(accion,lang):"—"}</div>
            <div style={S.overviewMeta}>{accion?.code||t.chooseAction}</div>
          </div>
          <div className="vps-overview-card" style={S.overviewCard}>
            <div style={S.overviewHead}><span style={S.overviewIcon}><Icon name="lock" size={16} color="#ff9800"/></span><div style={S.overviewLabel}>{t.prLabel}</div></div>
            <div style={S.overviewValue}>{showPres?(pres?getPrLabel(pres,lang):"—"):t.scoreNA}</div>
            <div style={S.overviewMeta}>{showPres?(pres?.code||t.choosePreservation):(accion?t.noPresNeeded:t.waitingAction)}</div>
          </div>
          <div className="vps-overview-card" style={S.overviewCard}>
            <div style={S.overviewHead}><span style={S.overviewIcon}><Icon name="blocks" size={16} color="#ff9800"/></span><div style={S.overviewLabel}>{t.blocksLabel}</div></div>
            <div style={S.overviewValue}>{CAT_ORDER.reduce((sum,k)=>sum+(sel[k]?1:0)+((multiSel[k]||[]).length),0)}</div>
            <div style={S.overviewMeta}>{t.qualityTagsSelected(totalQ)}</div>
          </div>
          <div className="vps-overview-card" style={S.overviewCard}>
            <div style={S.overviewHead}><span style={S.overviewIcon}><Icon name="output" size={16} color="#ff9800"/></span><div style={S.overviewLabel}>{t.outputStatus}</div></div>
            <div style={S.overviewValue}>{t[(OUTPUT_MODES.find(m=>m.code===outputMode)||OUTPUT_MODES[0]).key]}</div>
            <div style={S.overviewMeta}>{lang.toUpperCase()} {t.interfaceReady} {lang!=="en"&&translation?`· ${t.translationReady}`:""}</div>
          </div>
        </div>

        <div style={{...S.dashboardGrid,gridTemplateColumns:isMobile?"1fr":"minmax(0,1.62fr) minmax(380px,0.88fr)"}}>
          <div style={S.mainCol}>
            <div style={{...S.box, marginTop:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                <div>
                  <div style={{...S.boxLbl,display:"inline-flex"}}><span style={S.sectionIcon}><Icon name="spark" size={15} color="#ff9800"/></span> {t.workspaceControls}</div>
                  <div style={S.toolbarNote}>{t.workspaceNote}</div>
                </div>
                <div style={S.row}>
                  <button className="vps-btn" style={S.btnPri} onClick={randomizeAll}>{t.randomize}</button>
                  <button className="vps-btn" style={S.btnGh} onClick={clearAll}>{t.clearAll}</button>
                </div>
              </div>
            </div>

            <div className="vps-soft-card" style={{...S.box,marginTop:"16px"}}>
              <div style={S.boxLbl}><span style={{color:"#ff9800",fontWeight:700,fontFamily:MONO_FONT}}>PJ</span> {t.projectsLabel}</div>
              <div style={{...S.row,alignItems:"stretch"}}>
                <input style={{...S.addIn,flex:"1 1 220px",marginBottom:0}} placeholder={t.projectName} value={projectName} onChange={e=>setProjectName(e.target.value)}/>
                <button className="vps-btn" style={S.btnGh} onClick={saveCurrentProject} disabled={!projectName.trim()}>{t.saveProject}</button>
              </div>
              {projects.length>0&&(
                <div style={{marginTop:"10px"}}>
                  <div style={{fontFamily:MONO_FONT,fontSize:"9.5px",letterSpacing:"0.08em",color:"#7a7a7a",fontWeight:800,marginBottom:"7px"}}>{t.savedProjects} ({projects.length})</div>
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(180px,1fr))",gap:"7px"}}>
                    {projects.slice(0,6).map(project=>(
                      <div key={project.id} style={S.projectMiniCard}>
                        <div style={{fontWeight:900,color:"#222222",fontSize:"12px",lineHeight:1.25}}>{project.name}</div>
                        <div style={{fontFamily:MONO_FONT,fontSize:"9px",color:"#777777",margin:"4px 0 8px"}}>{project.outputMode||"universal"} · {project.aspectRatio||"16:9"}</div>
                        <div style={S.row}>
                          <button style={{...S.btnGh,padding:"5px 9px",fontSize:"10.5px"}} onClick={()=>loadProject(project)}>{t.loadProject}</button>
                          <button style={S.btnDg} onClick={()=>removeProject(project.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {projects.length===0&&<div style={{fontSize:"11px",color:"#7a7a7a",marginTop:"8px"}}>{t.noProjects}</div>}
            </div>

            <div style={S.recipeSection}>
              <div style={{...S.boxLbl,color:"#e2e2e2"}}><span style={{color:"#ff9800",fontWeight:700,fontFamily:MONO_FONT}}>RX</span> {t.recipeLabel} <span style={{fontStyle:"italic",fontWeight:400,color:"#c8c8c8",fontSize:"9px"}}>{t.recipeNote}</span></div>
              <div style={{...S.recipeGrid,gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,minmax(0,1fr))":"repeat(auto-fit,minmax(200px,1fr))"}}>
                {QUICK_RECIPES.map(r=>(
                  <button key={r.code} className="vps-dark-card" style={{...S.recipeBtn,...(activeRecipe===r.code?S.recipeBtnOn:{})}} onClick={()=>applyRecipe(r)}>
                    <span style={{...S.acCode,color:activeRecipe===r.code?"#ffffff":"#ffb84d"}}>{r.code}</span>
                    <span style={{...S.acLbl,color:"#ffffff"}}>{r.name[lang]||r.name.en}</span>
                    <span style={{display:"block",fontSize:"9.5px",lineHeight:1.3,marginTop:"4px",color:activeRecipe===r.code?"#f2f2f2":"#ececec"}}>{r.desc[lang]||r.desc.en}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="vps-soft-card" style={S.box}>
              <div style={S.boxLbl}><span style={{color:"#ec8800",fontWeight:700,fontFamily:MONO_FONT}}>AC</span> {t.acLabel}</div>
              <div style={S.acGrid}>
                {ACCION_DATA.map(a=>(
                  <button key={a.code} className="vps-card-hover" style={{...S.acBtn,...(accion?.code===a.code?S.acBtnOn:{})}} onClick={()=>{setAccion(a);if(!a.needs_image)setPres(null);}}>
                    <span style={{...S.acCode,...(accion?.code===a.code?{color:"#ffffff"}:{})}}>{a.code}</span>
                    <span style={{...S.acLbl,...(accion?.code===a.code?{color:"#ffffff"}:{})}}>{getAcLabel(a,lang)}</span>
                  </button>
                ))}
              </div>
              {accion&&<div style={S.enBox}>{accion.en}</div>}
            </div>

            {showPres&&(
              <div className="vps-soft-card" style={S.box}>
                <div style={S.boxLbl}><span style={{color:"#474747",fontWeight:700,fontFamily:MONO_FONT}}>PR</span> {t.prLabel} <span style={{fontStyle:"italic",fontWeight:400,color:"#7a7a7a",fontSize:"9px"}}>{t.prNote}</span></div>
                <div style={S.prGrid}>
                  {PRES_DATA.map(p=>(
                    <button key={p.code} className="vps-card-hover" style={{...S.prBtn,...(pres?.code===p.code?S.prBtnOn:{})}} onClick={()=>setPres(pres?.code===p.code?null:p)}>
                      <div style={{...S.prCode,...(pres?.code===p.code?{color:"#ffffff"}:{})}}>{p.code}</div>
                      <div style={{...S.prLbl,...(pres?.code===p.code?{color:"#ffffff"}:{})}}>{getPrLabel(p,lang)}</div>
                    </button>
                  ))}
                </div>
                {pres&&<div style={S.enBox}>{getPrDesc(pres,lang)}</div>}
              </div>
            )}

            {accion?.code==="AC-07"&&(<div className="vps-soft-card" style={S.box}>
              <div style={S.boxLbl}><span style={{color:"#ec8800",fontWeight:700,fontFamily:MONO_FONT}}>SD</span> {t.styleDimsLabel} <span style={{fontStyle:"italic",fontWeight:400,color:"#7a7a7a",fontSize:"9px"}}>{t.styleDimsNote}</span></div>
              <div style={S.tagCloud}>
                {STYLE_DIMS.map(d=>{
                  const on=styleDims.includes(d.code);
                  return <button key={d.code} style={{...S.tagBtn,...(on?S.tagOn:{})}} onClick={()=>setStyleDims(prev=>on?prev.filter(x=>x!==d.code):[...prev,d.code])}>
                    <span style={{fontFamily:MONO_FONT,fontWeight:700,marginRight:"4px"}}>{d.code}</span>{getAcLabel(d,lang)}
                    <span style={{display:"block",fontSize:"8.5px",color:on?"#ffffff":"#474747",marginTop:"2px",lineHeight:1.25}}>{lang==="en"?d.en:(d[`desc_${lang}`]||d.en)}</span>
                  </button>
                })}
              </div>
              {styleDims.length>0&&<button style={{...S.btnGh,fontSize:"11px",padding:"5px 10px",marginTop:"10px"}} onClick={()=>setStyleDims([])}>{t.styleDimsClear}</button>}
            </div>)}

            <div style={{...S.catGrid,gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(auto-fit,minmax(240px,1fr))":"repeat(auto-fit,minmax(260px,1fr))"}}>
              {CAT_ORDER.map(k=>{
                const cat=cats[k];
                const isMulti=cat.multi;
                const selected=sel[k];
                const multiSelected=multiSel[k]||[];
                return(
                  <div key={k} style={S.catCard}>
                    <div style={S.catHead}>
                      <span style={{...S.catCode,color:cat.color}}>{k}</span>
                      <span style={{...S.catName,color:"#111111"}}>{getCatName(cat,lang)}{isMulti&&<span style={{fontSize:"9px",color:"#7a7a7a",fontWeight:400,marginLeft:"4px"}}>{t.multiSelect}</span>}</span>
                      <button style={S.dice} onClick={()=>{
                        if(isMulti){const b=pickRandom(cat.blocks);setMultiSel(p=>({...p,[k]:[b]}));}
                        else{setSel(p=>({...p,[k]:pickRandom(cat.blocks,p[k]?.code)}));}
                        setCopied(false);
                      }}>⟲</button>
                    </div>
                    <CatDropdown
                      catKey={k} cat={cat} lang={lang}
                      value={selected} multiValue={multiSelected}
                      onChange={b=>{setSel(p=>({...p,[k]:b}));setCopied(false);}}
                      onMultiToggle={b=>{
                        setMultiSel(p=>{
                          const cur=p[k]||[];
                          const ex=cur.find(x=>x.code===b.code);
                          return {...p,[k]:ex?cur.filter(x=>x.code!==b.code):[...cur,b]};
                        });setCopied(false);
                      }}
                      onStar={toggleBlock} isSaved={isSaved} t={t}
                    />
                    {isMulti&&multiSelected.length>0&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"4px"}}>
                        {multiSelected.map(b=>(
                          <span key={b.code} style={{...S.chip,borderColor:cat.color}}>
                            <span style={{color:cat.color,fontFamily:MONO_FONT,fontSize:"8.5px",fontWeight:700}}>{b.code}</span>
                            <span style={{fontSize:"9px",color:"#2c2c2c",marginLeft:"3px"}}>{getBname(b,lang).slice(0,22)}{getBname(b,lang).length>22?"…":""}</span>
                            <button style={S.chipX} onClick={()=>setMultiSel(p=>({...p,[k]:(p[k]||[]).filter(x=>x.code!==b.code)}))}>✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                    {!isMulti&&selected&&(
                      <div style={S.selBox}>
                        <div style={S.selTop}>
                          <span style={{...S.selCode,color:cat.color}}>{selected.code}</span>
                          <div style={S.row}>
                            <button style={{...S.star,...(isSaved(k,selected.code)?S.starOn:{})}} onClick={()=>toggleBlock(k,selected)}>{isSaved(k,selected.code)?"★":"☆"}</button>
                            <button style={{...S.star,color:"#ec8800",fontSize:"11px"}} onClick={()=>{setSel(p=>{const n={...p};delete n[k];return n;})}} title={t.clearSel}>✕</button>
                          </div>
                        </div>
                        <div style={S.selEn}>{selected.en}</div>
                        <div style={S.selEs}>{getBname(selected,lang)}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="vps-soft-card" style={S.box}>
              <div style={{...S.boxLbl,marginBottom:"12px",flexWrap:"wrap",gap:"6px"}}>
                <span style={{color:"#2c2c2c",fontWeight:700,fontFamily:MONO_FONT}}>QF</span> {t.qfLabel}
                {isOptimal?<span style={{...S.qCount,background:"#ff9800"}}>{t.qfOptimal}</span>:<span style={S.qCount}>{t.qfSelected(totalQ)}</span>}
              </div>
              {Q_ORDER.map(gk=>{
                const g=QTAGS[gk]; const userTags=calidad[gk]||[];
                return(
                  <div key={gk} style={{marginBottom:"14px"}}>
                    <div style={S.qGrpLbl}>{getQLabel(g,lang)}</div>
                    <div style={S.tagCloud}>
                      {g.tags.map(tag=>{
                        const userOn=userTags.includes(tag.en);
                        const optOn=isOptimal&&(OPTIMAL_PRESET[gk]||[]).includes(tag.en);
                        const displayLabel=lang==="en"?tag.en:`${getTagLabel(tag,lang)}`;
                        const subLabel=lang!=="en"?tag.en:null;
                        return(
                          <button key={tag.en} style={{...S.tagBtn,...(userOn?S.tagOn:{}),...(optOn&&!userOn?S.tagOpt:{})}}
                            onClick={()=>toggleQ(gk,tag.en)}>
                            <span>{displayLabel}{optOn&&!userOn?" ✦":""}</span>
                            {subLabel&&<span style={{display:"block",fontSize:"8px",color:userOn?"#ffffff":"#7a7a7a",fontFamily:MONO_FONT,marginTop:"1px"}}>{subLabel}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div style={{...S.row,marginTop:"6px",flexWrap:"wrap"}}>
                {totalQ>0&&<button style={{...S.btnGh,fontSize:"11px",padding:"5px 10px"}} onClick={()=>setCalidad({})}>{t.qfClear}</button>}
                {!savingQFav
                  ?<button style={{...S.btnGh,fontSize:"11px",padding:"5px 10px"}} onClick={()=>setSavingQFav(true)}>{t.qfFavSave}</button>
                  :<div style={{...S.row,flexWrap:"nowrap"}}>
                    <input style={{...S.addIn,width:"160px"}} placeholder={t.qfFavName} value={qFavName} onChange={e=>setQFavName(e.target.value)} autoFocus/>
                    <button style={S.addOk} onClick={saveQFavCb} disabled={!qFavName.trim()}>{t.qfFavAdd}</button>
                    <button style={S.addCancel} onClick={()=>{setSavingQFav(false);setQFavName("");}}>{t.qfFavCancel}</button>
                  </div>}
              </div>
            </div>

            <div className="vps-soft-card" style={S.box}>
              <div style={S.boxLbl}><span style={{color:"#2c2c2c",fontWeight:700,fontFamily:MONO_FONT}}>OM</span> {t.outputLabel} <span style={{fontStyle:"italic",fontWeight:400,color:"#7a7a7a",fontSize:"9px"}}>{t.outputNote}</span></div>
              <div style={{...S.outputGrid,gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,minmax(0,1fr))":"repeat(auto-fit,minmax(155px,1fr))"}}>
                {OUTPUT_MODES.map(m=>(
                  <button key={m.code} className="vps-card-hover" style={{...S.modeBtn,...(outputMode===m.code?S.modeBtnOn:{})}} onClick={()=>setOutputMode(m.code)}>{t[m.key]}</button>
                ))}
              </div>
              {outputMode!=="universal"&&<label style={{...S.row,marginTop:"10px",fontSize:"11.5px",color:"#474747",cursor:"pointer"}}>
                <input type="checkbox" checked={includeNegative} onChange={e=>setIncludeNegative(e.target.checked)}/> {t.negativeInclude}
              </label>}
              {outputMode==="midjourney"&&(
                <div style={{marginTop:"12px"}}>
                  <div style={S.boxLbl}><span style={{color:"#ff9800",fontWeight:700,fontFamily:MONO_FONT}}>AR</span> {t.aspectLabel} <span style={{fontStyle:"italic",fontWeight:400,color:"#7a7a7a",fontSize:"9px"}}>{t.aspectNote}</span></div>
                  <div style={{...S.outputGrid,gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,minmax(0,1fr))":"repeat(auto-fit,minmax(120px,1fr))"}}>
                    {ASPECT_RATIOS.map(ar=>(
                      <button key={ar.code} className="vps-card-hover" style={{...S.modeBtn,...(aspectRatio===ar.code?S.modeBtnOn:{})}} onClick={()=>setAspectRatio(ar.code)}>{ar.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="vps-soft-card" style={S.box}>
              <div style={S.boxLbl}><span style={{color:"#ff9800",fontWeight:700,fontFamily:MONO_FONT}}>PC</span> {t.scoreLabel}</div>
              <div style={{...S.scoreGrid,gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(160px,1fr))"}}>
                {[
                  [t.scoreGeo,promptScore.geometry],
                  [t.scoreMat,promptScore.materials],
                  [t.scoreCam,promptScore.camera],
                  [t.scoreLight,promptScore.light],
                  [t.scoreRisk,promptScore.overload],
                ].map(([label,val])=>{
                  const badgeStyle = val==="high" ? S.scoreBadgeHigh : val==="medium" ? S.scoreBadgeMedium : val==="low" ? S.scoreBadgeLow : val==="missing" ? S.scoreBadgeMissing : val==="na" ? S.scoreBadgeNA : S.scoreBadgeDefault;
                  return(
                    <div key={label} style={S.scoreItem}>
                      <span style={S.scoreLabelText}>{label}</span>
                      <span style={{...S.scoreBadge, ...badgeStyle}}>{scoreText(val)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={S.sideCol}>
            <div style={{...S.resultStickyWrap,position:isMobile?"relative":"sticky",top:isMobile?"0px":"18px"}}>
              <div className="vps-result-panel vps-plate" style={S.resultBox}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px",flexWrap:"wrap",gap:"8px"}}>
                  <span style={{fontFamily:MONO_FONT,fontSize:"10px",letterSpacing:"0.14em",color:"#ffffff",fontWeight:800,background:"#ff9800",padding:"6px 10px",borderRadius:"999px",display:"inline-flex",alignItems:"center",gap:"7px"}}><Icon name="result" size={14} color="#ffffff"/>{t.promptEnglish}</span>
                  <div style={S.row}>
                    <button style={{...S.btnGh,padding:"7px 12px",fontSize:"12px"}} onClick={savePromptFav} disabled={!outputPrompt}>{t.savePrompt}</button>
                    <button style={{...S.copyBtn,...(copied?S.copyOn:{}),opacity:outputPrompt?1:0.4}} onClick={copy} disabled={!outputPrompt}>{copied?t.copied:t.copyEnglish}</button>
                  </div>
                </div>
                <div style={S.resultText}>{outputPrompt||t.promptPlaceholder}</div>
                {fullPrompt&&includeNegative&&outputMode!=="universal"&&(<div style={{marginTop:"12px",borderTop:"1px solid rgba(255,255,255,0.10)",paddingTop:"12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                    <div style={{fontFamily:MONO_FONT,fontSize:"9.5px",letterSpacing:"0.08em",color:"#bdbdbd"}}>{t.negativeLabel}</div>
                    <button style={{...S.btnGh,padding:"5px 9px",fontSize:"10.5px"}} onClick={copyNegative}>{copiedNegative?t.negativeCopied:t.negativeCopy}</button>
                  </div>
                  <div style={{...S.negativeText,minHeight:"24px"}}>{negativePrompt}</div>
                </div>)}
                {lang!=="en"&&fullPrompt&&(
                  <div style={{marginTop:"12px",borderTop:"1px solid rgba(255,255,255,0.10)",paddingTop:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                      <div style={{fontFamily:MONO_FONT,fontSize:"9.5px",letterSpacing:"0.08em",color:"#bdbdbd"}}>{t.resultTranslation}</div>
                      <button style={{...S.btnGh,padding:"5px 9px",fontSize:"10.5px",opacity:translation?1:.45}} onClick={copyTranslation} disabled={!translation}>{t.copyTranslation}</button>
                    </div>
                    <div style={{...S.translationText,minHeight:"24px"}}>
                      {translating?<span style={{fontStyle:"italic"}}>{t.translating}</span>:(translation||"")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>}

      {/* ── BANCO COMPLETO ───────────────────────── */}
      {tab==="bank"&&<>
        <input style={S.search} placeholder={t.searchPlaceholder} value={bankFilter} onChange={e=>setBankFilter(e.target.value)}/>
        <div style={{...S.bankGrid,gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,minmax(0,1fr))":"repeat(auto-fit,minmax(220px,1fr))"}}>
          {CAT_ORDER.map(k=>{
            const cat=cats[k]; const fl=bankFilter.trim().toLowerCase();
            const blocks=cat.blocks.filter(b=>!fl||b.en.toLowerCase().includes(fl)||(b.es||"").toLowerCase().includes(fl)||(b.pt||"").toLowerCase().includes(fl)||b.code.toLowerCase().includes(fl));
            const isC=code=>(custom[k]||[]).some(b=>b.code===code);
            return(
              <div key={k} style={S.bankCol}>
                <div style={{...S.bankHead,borderColor:cat.color}}>
                  <span style={{color:"#111111",fontWeight:900}}>{k}</span> <span style={{color:"#111111",fontWeight:900}}>{getCatName(cat,lang)}</span>
                  <span style={S.bankCnt}>{blocks.length}</span>
                </div>
                <div className="vps-scrollbar" style={S.bankList}>
                  {blocks.map(b=>{
                    const saved=isSaved(k,b.code); const c=isC(b.code);
                    return(
                      <div key={b.code} style={S.bankItem}>
                        <div style={S.bankTop}>
                          <button style={{...S.bankCode,color:cat.color}} onClick={()=>{
                            if(cat.multi){setMultiSel(p=>{const cur=p[k]||[];const ex=cur.find(x=>x.code===b.code);return{...p,[k]:ex?cur.filter(x=>x.code!==b.code):[...cur,b]};});}
                            else{setSel(p=>({...p,[k]:b}));} showFlash("→ "+b.code);
                          }} title={t.useInBuilder}>
                            {b.code}{c&&<span style={{color:"#ff9800",fontSize:"7px",marginLeft:"3px"}}>●</span>}
                          </button>
                          <div style={S.row}>
                            <button style={{...S.starSm,...(saved?S.starOn:{})}} onClick={()=>toggleBlock(k,b)}>{saved?"★":"☆"}</button>
                            {c&&<button style={S.rmBtn} onClick={()=>removeCustomBlock(k,b.code)}>✕</button>}
                          </div>
                        </div>
                        <div style={{fontFamily:MONO_FONT,fontSize:"9.5px",color:"#2c2c2c",marginTop:"2px",lineHeight:1.3}}>{b.en}</div>
                        {lang!=="en"&&<div style={{fontSize:"9px",color:"#474747",marginTop:"1px",lineHeight:1.25}}>{getBname(b,lang)}</div>}
                      </div>
                    );
                  })}
                  {blocks.length===0&&<div style={{fontSize:"10.5px",color:"#7a7a7a",padding:"8px",textAlign:"center"}}>{t.noResults}</div>}
                  {addingTo===k?(
                    <div style={{background:"#f5f5f5",padding:"7px",borderRadius:"2px",marginTop:"4px"}}>
                      <input style={S.addIn} placeholder={t.addBlockEn} value={newEn} onChange={e=>setNewEn(e.target.value)} autoFocus/>
                      <input style={S.addIn} placeholder={t.addBlockDesc} value={newDesc} onChange={e=>setNewDesc(e.target.value)}/>
                      <div style={S.row}>
                        <button style={S.addOk} onClick={()=>addCustomBlock(k)} disabled={!newEn.trim()}>{t.addConfirm}</button>
                        <button style={S.addCancel} onClick={()=>{setAddingTo(null);setNewEn("");setNewDesc("");}}>{t.addCancel}</button>
                      </div>
                    </div>
                  ):(
                    <button style={S.addBtn} onClick={()=>setAddingTo(k)}>{t.addBlock}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* ── FAVORITOS ────────────────────────────── */}
      {tab==="favorites"&&(
        <div>
          {!loaded&&<div style={S.empty}>{t.loading}</div>}
          {loaded&&favorites.length===0&&<div style={S.empty}>{t.emptyFav}</div>}

          {/* Presets de calidad */}
          {favQuality.length>0&&<>
            <div style={S.favLbl}>{t.savedQuality} ({favQuality.length})</div>
            {favQuality.map(f=>(
              <div key={f._idx} style={{...S.favCard,borderLeft:"3px solid #2c2c2c"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                  <span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:"13px"}}>{f.name}</span>
                  <div style={S.row}>
                    <button style={{...S.btnGh,padding:"5px 10px",fontSize:"11px"}} onClick={()=>{setCalidad(f.calidad);showFlash(t.loadPreset);}}>{t.loadPreset}</button>
                    <button style={S.btnDg} onClick={()=>removeFav(f._idx)}>✕</button>
                  </div>
                </div>
                <div style={S.tagCloud}>
                  {Q_ORDER.map(gk=>(f.calidad[gk]||[]).map(tagEn=>{
                    const tagObj=QTAGS[gk]?.tags.find(x=>x.en===tagEn);
                    return<span key={tagEn} style={{...S.tagBtn,...S.tagOn,cursor:"default",fontSize:"9.5px",padding:"3px 7px"}}>{tagObj?getTagLabel(tagObj,lang):tagEn}</span>;
                  }))}
                </div>
              </div>
            ))}
          </>}

          {/* Prompts guardados */}
          {favPrompts.length>0&&<>
            <div style={S.favLbl}>{t.savedPrompts} ({favPrompts.length})</div>
            {favPrompts.map(f=>(
              <div key={f._idx} style={S.favCard}>
                {f.accionLabel&&<div style={{fontFamily:MONO_FONT,fontSize:"9.5px",color:"#ec8800",fontWeight:700,marginBottom:"6px"}}>{f.accionLabel}</div>}
                <div style={{fontFamily:MONO_FONT,fontSize:"11px",lineHeight:1.5,color:"#2c2c2c",background:"#f5f5f5",padding:"9px 11px",borderRadius:"2px",marginBottom:"6px"}}>{f.text}</div>
                {f.translation&&<div style={{fontFamily:MONO_FONT,fontSize:"10px",lineHeight:1.5,color:"#474747",background:"#ffffff",padding:"7px 11px",borderRadius:"2px",marginBottom:"6px",borderLeft:"2px solid #d0d0d0"}}>{f.translation}</div>}
                <div style={S.row}>
                  <button className="vps-btn" style={S.btnGh} onClick={()=>copyText(f.text,t.savedPromptCopied)}>{t.copy}</button>
                  <button style={S.btnDg} onClick={()=>removeFav(f._idx)}>{t.remove}</button>
                </div>
              </div>
            ))}
          </>}

          {/* Bloques favoritos por categoría */}
          {CAT_ORDER.map(k=>{
            const catFavs=favByCategory[k];
            if(!catFavs||catFavs.length===0) return null;
            const cat=cats[k];
            return(
              <div key={k}>
                <div style={{...S.favLbl,display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{color:cat.color,fontFamily:MONO_FONT,fontWeight:700}}>{k}</span>
                  {getCatName(cat,lang)} ({catFavs.length})
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"8px",marginBottom:"8px"}}>
                  {catFavs.map(f=>(
                    <div key={f._idx} style={S.favCard}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                        <span style={{fontFamily:MONO_FONT,fontSize:"10px",fontWeight:700,color:cat.color}}>{f.code}</span>
                        <button style={S.btnDg} onClick={()=>removeFav(f._idx)}>✕</button>
                      </div>
                      <div style={{fontFamily:MONO_FONT,fontSize:"10px",color:"#2c2c2c",marginBottom:"3px",lineHeight:1.35}}>{f.en}</div>
                      {f.desc&&f.desc!==f.en&&<div style={{fontSize:"9.5px",color:"#474747",lineHeight:1.3,marginBottom:"8px"}}>{f.desc}</div>}
                      <button style={{...S.btnGh,fontSize:"10.5px",padding:"4px 8px"}} onClick={()=>{
                        const b=cat.blocks.find(b=>b.code===f.code)||{code:f.code,en:f.en,es:f.desc,pt:f.desc};
                        if(cat.multi){setMultiSel(p=>({...p,[k]:[...((p[k]||[]).filter(x=>x.code!==f.code)),b]}));}
                        else{setSel(p=>({...p,[k]:b}));}
                        showFlash(t.useInBuilder);
                      }}>{t.useInBuilder}</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const S={
  page:{fontFamily:BODY_FONT,background:"#0a0b10",color:"#f3f3f3",padding:"28px 22px 56px",maxWidth:"1440px",margin:"0 auto",minHeight:"100vh",boxSizing:"border-box"},
  header:{background:"linear-gradient(135deg,#13141a 0%,#0f1014 64%,#171923 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"13px",padding:"24px 26px 22px",marginBottom:"18px",boxShadow:"0 22px 70px rgba(0,0,0,0.34)",position:"relative",overflow:"hidden"},
  eyebrow:{fontFamily:MONO_FONT,fontSize:"9.5px",letterSpacing:"0.18em",color:"#ff9800",marginBottom:"7px",textTransform:"uppercase"},
  sub:{fontSize:"12.5px",color:"#d8d8d8",letterSpacing:"0.18em",fontWeight:700,textTransform:"uppercase"},
  offerBar:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"14px",background:"linear-gradient(90deg,rgba(255,152,0,.32) 0%, rgba(255,152,0,.14) 100%)",border:"1px solid rgba(255,152,0,.42)",borderRadius:"999px",padding:"14px 20px",marginBottom:"18px",fontSize:"14px",fontWeight:900,letterSpacing:"0.14em",textTransform:"uppercase",color:"#fff1dc",boxShadow:"0 14px 32px rgba(255,152,0,.16)"},
  offerTime:{fontFamily:MONO_FONT,fontSize:"24px",fontWeight:900,color:"#ffb24b",letterSpacing:"0.08em",textShadow:"0 0 16px rgba(255,152,0,.25)"},
  brandTitle:{fontFamily:DISPLAY_FONT,fontWeight:700,fontSize:"clamp(28px,4vw,42px)",lineHeight:1,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.06em",color:"#ffffff"},
  brandWhite:{color:"#ffffff"},
  brandOrange:{color:"#ff9800"},
  langSwitch:{display:"flex",gap:"6px",background:"rgba(255,255,255,0.06)",padding:"5px",borderRadius:"999px",border:"1px solid rgba(255,255,255,0.12)"},
  langBtn:{background:"transparent",border:"1px solid transparent",padding:"5px 11px",fontSize:"11px",fontWeight:700,cursor:"pointer",borderRadius:"999px",fontFamily:MONO_FONT,color:"#ffffff"},
  langBtnOn:{background:"#ff9800",borderColor:"#ff9800",color:"#ffffff"},
  tabBar:{display:"grid",gap:"6px",background:"#232323",border:"1px solid #474747",borderRadius:"16px",padding:"6px",marginBottom:"18px",boxShadow:"0 12px 34px rgba(0,0,0,0.18)"},
  tab:{background:"transparent",border:"1px solid transparent",padding:"10px 16px",fontSize:"12px",fontWeight:700,color:"#d0d0d0",cursor:"pointer",fontFamily:"inherit",borderRadius:"12px",letterSpacing:"0.02em",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"9px"},
  tabOn:{color:"#111111",background:"#ffffff",border:"1px solid #ffffff",boxShadow:"0 10px 20px rgba(0,0,0,0.24)"},
  tabIcon:{display:"inline-flex",alignItems:"center",justifyContent:"center"},
  flash:{background:"#ff9800",color:"#ffffff",fontSize:"11.5px",padding:"8px 13px",marginBottom:"12px",borderRadius:"999px",display:"inline-block",boxShadow:"0 8px 20px rgba(236,136,0,0.25)",fontWeight:700},
  row:{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"},
  overviewGrid:{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:"14px",marginBottom:"18px"},
  overviewCard:{background:"linear-gradient(180deg,#1b1c1f 0%,#121315 100%)",border:"1px solid #2b2d31",borderRadius:"18px",padding:"16px 16px 15px",boxShadow:"0 16px 38px rgba(0,0,0,0.30)",position:"relative",overflow:"hidden"},
  overviewHead:{display:"flex",alignItems:"center",gap:"9px",marginBottom:"8px"},
  overviewIcon:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"30px",height:"30px",borderRadius:"10px",background:"rgba(255,152,0,0.10)",border:"1px solid rgba(255,152,0,0.18)"},
  overviewLabel:{fontFamily:MONO_FONT,fontSize:"9px",letterSpacing:"0.16em",color:"#8f8f95",fontWeight:700},
  overviewValue:{fontSize:"16px",fontWeight:800,color:"#ffffff",lineHeight:1.25,marginBottom:"6px"},
  overviewMeta:{fontSize:"11px",color:"#b8b8bc",lineHeight:1.35},
  dashboardGrid:{display:"grid",gridTemplateColumns:"minmax(0,1.58fr) minmax(380px,0.86fr)",gap:"20px",alignItems:"start"},
  mainCol:{display:"flex",flexDirection:"column",gap:"0px"},
  sideCol:{display:"block",alignSelf:"start"},
  resultStickyWrap:{position:"sticky",top:"18px"},
  toolbarNote:{fontSize:"12px",color:"#7a7a7a",marginTop:"2px",letterSpacing:"0.01em"},
  btnPri:{background:"linear-gradient(180deg,#ffad33 0%,#ff9800 100%)",color:"#ffffff",border:"1px solid #ff9800",padding:"10px 17px",fontSize:"12.5px",fontWeight:700,cursor:"pointer",borderRadius:"12px",fontFamily:"inherit",boxShadow:"0 10px 24px rgba(236,136,0,0.22)"},
  btnGh:{background:"#ffffff",color:"#2c2c2c",border:"1px solid #d9d9d9",padding:"10px 17px",fontSize:"12.5px",fontWeight:600,cursor:"pointer",borderRadius:"12px",fontFamily:"inherit"},
  btnDg:{background:"#fff6eb",color:"#ec8800",border:"1px solid #ffa424",padding:"6px 10px",fontSize:"11px",fontWeight:700,cursor:"pointer",borderRadius:"8px",fontFamily:"inherit"},
  box:{background:"#ffffff",color:"#111111",border:"1px solid #dfdfdf",borderRadius:"18px",padding:"18px",marginTop:"16px",boxShadow:"0 14px 38px rgba(0,0,0,0.16)",overflow:"hidden"},
  recipeSection:{background:"linear-gradient(180deg,#45454b 0%,#34343a 100%)",border:"1px solid #606068",borderRadius:"18px",padding:"18px",marginTop:"16px",boxShadow:"0 18px 40px rgba(0,0,0,0.28)",overflow:"hidden"},
  resultBox:{background:"linear-gradient(180deg,#17181b 0%,#101114 100%)",border:"2px solid #ff9800",borderRadius:"13px",padding:"22px",marginTop:"0px",boxShadow:"0 28px 64px rgba(255,152,0,0.18), 0 22px 52px rgba(0,0,0,0.40)",overflow:"hidden"},
  boxLbl:{fontFamily:MONO_FONT,fontSize:"10px",letterSpacing:"0.12em",color:"#111111",fontWeight:800,marginBottom:"12px",display:"flex",alignItems:"center",gap:"7px",textTransform:"uppercase"},
  acGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(158px,1fr))",gap:"8px"},
  acBtn:{background:"#fbfbfb",border:"1px solid #dedede",borderRadius:"12px",padding:"10px 11px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s ease"},
  acBtnOn:{background:"#2c2c2c",borderColor:"#ff9800",boxShadow:"inset 0 0 0 1px #ff9800, 0 10px 24px rgba(0,0,0,0.16)"},
  acCode:{display:"block",fontFamily:MONO_FONT,fontSize:"8.5px",color:"#ec8800",marginBottom:"4px",fontWeight:700,letterSpacing:"0.08em"},
  acLbl:{display:"block",fontSize:"11.5px",fontWeight:700,color:"#2c2c2c",lineHeight:1.25},
  enBox:{fontFamily:MONO_FONT,fontSize:"10.3px",background:"#f5f5f5",padding:"9px 11px",borderRadius:"10px",marginTop:"11px",lineHeight:1.55,color:"#2c2c2c",border:"1px solid #e2e2e2"},
  prGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"8px"},
  prBtn:{background:"#fbfbfb",border:"1px solid #dedede",borderRadius:"12px",padding:"12px 10px",cursor:"pointer",fontFamily:"inherit",textAlign:"center"},
  prBtnOn:{background:"#474747",borderColor:"#ff9800",boxShadow:"inset 0 0 0 1px #ff9800"},
  prCode:{fontFamily:MONO_FONT,fontSize:"8.5px",color:"#474747",marginBottom:"4px",fontWeight:700},
  prLbl:{fontSize:"11.5px",fontWeight:700,color:"#2c2c2c",lineHeight:1.25},
  catGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"14px",marginTop:"16px"},
  catCard:{background:"#ffffff",color:"#111111",border:"1px solid #dedede",borderRadius:"16px",padding:"14px",boxShadow:"0 8px 26px rgba(0,0,0,0.06)"},
  catHead:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",paddingBottom:"8px",borderBottom:"1px solid #efefef",color:"#111111"},
  catCode:{fontFamily:MONO_FONT,fontWeight:800,fontSize:"13px",letterSpacing:"0.08em"},
  catName:{fontFamily:BODY_FONT,fontWeight:900,fontSize:"12.5px",flex:1,letterSpacing:"0.04em",color:"#111111",textTransform:"uppercase"},
  dice:{background:"#f5f5f5",border:"1px solid #d9d9d9",color:"#111111",width:"28px",height:"28px",borderRadius:"9px",cursor:"pointer",fontSize:"12px"},
  dropBtn:{width:"100%",display:"flex",alignItems:"center",padding:"9px 10px",fontSize:"11px",fontFamily:MONO_FONT,border:"1.5px solid #d9d9d9",borderRadius:"10px",background:"#fbfbfb",color:"#2c2c2c",cursor:"pointer",textAlign:"left"},
  dropList:{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#ffffff",color:"#111111",border:"1.5px solid #2c2c2c",borderRadius:"14px",boxShadow:"0 18px 46px rgba(0,0,0,0.22)",zIndex:100,maxHeight:"300px",overflowY:"auto"},
  dropItem:{display:"flex",alignItems:"stretch",borderBottom:"1px solid #f0f0f0"},
  dropCodeBtn:{flex:1,display:"flex",alignItems:"flex-start",gap:"7px",padding:"9px 10px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"inherit"},
  dropClear:{padding:"5px 9px",fontSize:"9.5px",color:"#ec8800",background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",fontWeight:700},
  dropStar:{background:"transparent",border:"none",cursor:"pointer",fontSize:"14px",color:"#8a8a8a",padding:"0 9px",lineHeight:1},
  chip:{display:"inline-flex",alignItems:"center",background:"#f5f5f5",border:"1px solid #d9d9d9",borderRadius:"999px",padding:"3px 6px",gap:"4px"},
  chipX:{background:"transparent",border:"none",cursor:"pointer",fontSize:"9px",color:"#ec8800",padding:"0 1px",lineHeight:1,fontWeight:700},
  selBox:{background:"#f7f7f7",padding:"9px 10px",borderRadius:"12px",border:"1px solid #e6e6e6"},
  selTop:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"},
  selCode:{fontFamily:MONO_FONT,fontSize:"10px",fontWeight:800},
  selEn:{fontFamily:MONO_FONT,fontSize:"10.5px",color:"#2c2c2c",marginBottom:"3px",lineHeight:1.4},
  selEs:{fontSize:"10px",color:"#474747",lineHeight:1.35},
  star:{background:"transparent",border:"none",cursor:"pointer",fontSize:"14px",color:"#7a7a7a",padding:"0 2px"},
  starSm:{background:"transparent",border:"none",cursor:"pointer",fontSize:"12px",color:"#7a7a7a",padding:"0 2px"},
  starOn:{color:"#ff9800"},
  qCount:{marginLeft:"4px",fontFamily:MONO_FONT,fontSize:"9.5px",background:"#2c2c2c",color:"#ffffff",padding:"2px 7px",borderRadius:"999px"},
  qGrpLbl:{fontSize:"11.5px",fontWeight:800,color:"#2c2c2c",marginBottom:"7px",fontFamily:"Calibri, Arial, sans-serif",letterSpacing:"0.04em"},
  tagCloud:{display:"flex",flexWrap:"wrap",gap:"6px"},
  tagBtn:{background:"#fbfbfb",border:"1px solid #dedede",borderRadius:"10px",padding:"7px 9px",fontSize:"10px",cursor:"pointer",fontFamily:MONO_FONT,color:"#2c2c2c",textAlign:"left",lineHeight:1.25},
  tagOn:{background:"#2c2c2c",borderColor:"#ff9800",color:"#ffffff"},
  tagOpt:{background:"#fff4e6",borderColor:"#ff9800",color:"#ec8800"},
  resultText:{fontFamily:MONO_FONT,fontSize:"12.5px",lineHeight:1.78,color:"#111111",background:"#ffffff",padding:"18px 18px",borderRadius:"16px",minHeight:"66px",userSelect:"text",border:"1px solid #ffd6a1",whiteSpace:"pre-wrap",boxShadow:"inset 0 0 0 1px rgba(255,152,0,0.08), 0 10px 22px rgba(0,0,0,0.08)"},
  negativeText:{fontFamily:MONO_FONT,fontSize:"10.8px",lineHeight:1.65,color:"#6b2d1d",background:"#fff5eb",padding:"14px 15px",borderRadius:"12px",border:"1px solid #ffc57a",whiteSpace:"pre-wrap"},
  translationText:{fontFamily:MONO_FONT,fontSize:"11px",lineHeight:1.65,color:"#f0f0f0",background:"#26272b",padding:"14px 15px",borderRadius:"14px",border:"1px solid #424248",whiteSpace:"pre-wrap"},
  copyBtn:{background:"#ff9800",color:"#ffffff",border:"1px solid #ff9800",padding:"9px 16px",fontSize:"12px",fontWeight:800,borderRadius:"10px",cursor:"pointer",fontFamily:"inherit",boxShadow:"0 10px 24px rgba(255,152,0,0.24)"},
  copyOn:{background:"#2c2c2c",borderColor:"#2c2c2c"},
  search:{width:"100%",padding:"12px 14px",fontSize:"12.5px",border:"1.5px solid #d9d9d9",borderRadius:"14px",marginBottom:"14px",fontFamily:"inherit",background:"#ffffff",color:"#2c2c2c",boxSizing:"border-box"},
  bankGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"12px"},
  bankCol:{background:"#ffffff",color:"#111111",border:"1px solid #dedede",borderRadius:"16px",overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"},
  bankHead:{fontFamily:"Calibri, Arial, sans-serif",fontSize:"11.5px",fontWeight:900,padding:"10px 12px",borderBottom:"2px solid",display:"flex",alignItems:"center",gap:"5px",letterSpacing:"0.04em",color:"#111111",background:"#ffffff"},
  bankCnt:{marginLeft:"auto",fontFamily:MONO_FONT,fontSize:"9.5px",color:"#7a7a7a",fontWeight:400},
  bankList:{maxHeight:"520px",overflowY:"auto",padding:"7px"},
  bankItem:{padding:"8px",borderBottom:"1px solid #f0f0f0",borderRadius:"10px",color:"#111111"},
  bankTop:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  bankCode:{background:"transparent",border:"none",cursor:"pointer",fontFamily:MONO_FONT,fontWeight:800,fontSize:"10px",padding:0,textAlign:"left",display:"flex",alignItems:"center",gap:"3px"},
  addBtn:{width:"100%",background:"#fbfbfb",border:"1px dashed #a0a0a0",color:"#474747",padding:"8px",fontSize:"10.5px",cursor:"pointer",borderRadius:"10px",marginTop:"6px",fontFamily:"inherit"},
  addIn:{padding:"7px 9px",fontSize:"10px",border:"1px solid #d9d9d9",borderRadius:"10px",marginBottom:"5px",fontFamily:"inherit",background:"#ffffff",color:"#2c2c2c",width:"100%",boxSizing:"border-box"},
  addOk:{background:"#2c2c2c",color:"#ffffff",border:"none",padding:"6px 11px",fontSize:"10px",fontWeight:800,cursor:"pointer",borderRadius:"8px",fontFamily:"inherit"},
  addCancel:{background:"transparent",color:"#474747",border:"1px solid #d0d0d0",padding:"6px 11px",fontSize:"10px",cursor:"pointer",borderRadius:"8px",fontFamily:"inherit"},
  rmBtn:{background:"transparent",border:"none",color:"#ec8800",cursor:"pointer",fontSize:"10px",padding:"0 2px",fontWeight:800},
  empty:{fontSize:"12.5px",color:"#474747",padding:"32px",textAlign:"center",background:"#ffffff",border:"1px dashed #d0d0d0",borderRadius:"16px"},
  favLbl:{fontFamily:MONO_FONT,fontSize:"10px",letterSpacing:"0.1em",color:"#111111",fontWeight:800,margin:"18px 0 10px",textTransform:"uppercase"},
  favCard:{background:"#ffffff",color:"#111111",border:"1px solid #dedede",borderRadius:"16px",padding:"14px",marginBottom:"10px",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"},
  recipeGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"9px"},
  recipeBtn:{background:"#4a4a4f",border:"1px solid #626268",borderRadius:"14px",padding:"11px 12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",boxShadow:"0 8px 22px rgba(0,0,0,0.18)"},
  recipeBtnOn:{background:"#ff9800",borderColor:"#ff9800",boxShadow:"0 10px 26px rgba(236,136,0,0.25)"},
  outputGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:"8px"},
  projectMiniCard:{background:"#f7f7f7",border:"1px solid #e2e2e2",borderRadius:"12px",padding:"10px",boxShadow:"0 6px 16px rgba(0,0,0,0.06)"},
  modeBtn:{background:"#fbfbfb",border:"1px solid #dedede",borderRadius:"12px",padding:"10px 11px",cursor:"pointer",fontSize:"11.5px",fontWeight:800,color:"#2c2c2c",fontFamily:"inherit"},
  modeBtnOn:{background:"#2c2c2c",borderColor:"#ff9800",color:"#ffffff",boxShadow:"inset 0 0 0 1px #ff9800"},

  salesShell:{display:"flex",flexDirection:"column",gap:"18px"},
  salesHero:{display:"grid",gap:"18px",alignItems:"stretch"},
  salesHeroCopy:{background:"linear-gradient(135deg,#191a1d 0%,#101113 70%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"42px",boxShadow:"0 34px 90px rgba(0,0,0,0.42)",position:"relative",overflow:"hidden",minHeight:"470px",display:"flex",flexDirection:"column",justifyContent:"center"},
  salesPill:{display:"inline-flex",alignItems:"center",gap:"8px",fontFamily:MONO_FONT,fontSize:"10px",letterSpacing:"0.14em",fontWeight:800,color:"#f2f2f2",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"999px",padding:"7px 10px",textTransform:"uppercase"},
  salesTitle:{fontFamily:DISPLAY_FONT,fontSize:"clamp(40px,5vw,74px)",lineHeight:0.94,letterSpacing:"-0.03em",color:"#ffffff",margin:"22px 0 12px",fontWeight:700,maxWidth:"980px"},
  salesText:{fontSize:"16px",lineHeight:1.65,color:"#d6d6dc",margin:"0 0 24px",maxWidth:"760px"},
  salesActions:{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"},
  darkBtnGhost:{background:"rgba(255,255,255,0.06)",color:"#ffffff",border:"1px solid rgba(255,255,255,0.16)",padding:"10px 17px",fontSize:"12.5px",fontWeight:700,cursor:"pointer",borderRadius:"12px",fontFamily:"inherit"},
  salesLoginCard:{background:"radial-gradient(circle at 10% 0%,rgba(255,152,0,.16),transparent 34%),linear-gradient(180deg,#171922 0%,#0f1117 100%)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"16px",padding:"28px",boxShadow:"0 28px 70px rgba(0,0,0,0.42)",position:"relative",overflow:"hidden"},
  salesLoginIcon:{width:"54px",height:"54px",borderRadius:"18px",background:"linear-gradient(180deg,#ffbd58 0%,#ff9800 100%)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px",boxShadow:"0 16px 32px rgba(255,152,0,0.28)"},
  salesLoginTitle:{fontFamily:DISPLAY_FONT,fontSize:"32px",lineHeight:1.02,color:"#ffffff",margin:"0 0 10px",fontWeight:900},
  salesLoginText:{fontSize:"13.5px",lineHeight:1.62,color:"#d0d4dc",margin:"0 0 16px"},
  salesInput:{width:"100%",boxSizing:"border-box",background:"#ffffff",border:"1px solid #d8d8d8",borderRadius:"12px",padding:"12px 13px",fontSize:"12.5px",marginBottom:"10px",fontFamily:"inherit",color:"#2c2c2c"},
  salesLoginFoot:{fontFamily:MONO_FONT,fontSize:"10px",letterSpacing:"0.08em",color:"#a4a8b1",marginTop:"12px",textAlign:"center"},
  salesFeatureGrid:{display:"grid",gap:"14px"},
  salesFeatureCard:{background:"#ffffff",color:"#111111",border:"1px solid #dfdfdf",borderRadius:"13px",padding:"20px",boxShadow:"0 14px 34px rgba(0,0,0,0.14)"},
  salesFeatureIcon:{width:"38px",height:"38px",borderRadius:"14px",background:"#fff5eb",border:"1px solid #ffd39f",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"13px"},
  salesFeatureTitle:{fontSize:"15px",fontWeight:900,color:"#202020",marginBottom:"7px"},
  salesFeatureText:{fontSize:"12.5px",lineHeight:1.55,color:"#565656"},
  pricingSection:{background:"linear-gradient(180deg,#0f1117 0%,#0b0d12 100%)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"24px",boxShadow:"0 20px 52px rgba(0,0,0,0.30)"},
  pricingHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},
  pricingGrid:{display:"grid",gap:"14px"},
  pricingCard:{background:"#ffffff",color:"#111111",border:"1px solid #dedede",borderRadius:"13px",padding:"20px",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 12px 28px rgba(0,0,0,0.12)"},
  pricingFeatured:{border:"2px solid #ff9800",boxShadow:"0 18px 44px rgba(255,152,0,0.20),0 12px 28px rgba(0,0,0,0.16)"},
  pricingName:{fontSize:"13px",fontWeight:900,color:"#222222",letterSpacing:"0.04em",textTransform:"uppercase"},
  pricingPrice:{fontSize:"34px",lineHeight:1,fontWeight:900,color:"#111111",letterSpacing:"-0.04em"},
  pricingOld:{fontFamily:MONO_FONT,fontSize:"10.5px",fontWeight:800,color:"#ec8800",background:"#fff4e6",border:"1px solid #ffd39f",borderRadius:"999px",padding:"5px 8px",display:"inline-flex",width:"fit-content"},
  pricingDesc:{fontSize:"12.5px",lineHeight:1.55,color:"#565656",minHeight:"88px"},
  launchBox:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"16px",flexWrap:"wrap",background:"#ffffff",color:"#111111",border:"1px solid #dfdfdf",borderRadius:"13px",padding:"22px",boxShadow:"0 16px 38px rgba(0,0,0,0.16)"},
  launchTitle:{fontSize:"19px",fontWeight:900,color:"#111111",marginBottom:"5px"},
  launchText:{fontSize:"13px",lineHeight:1.5,color:"#555555"},
  scoreGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"8px"},
  scoreItem:{background:"#f7f7f7",border:"1px solid #e2e2e2",borderRadius:"14px",padding:"10px 12px",display:"flex",justifyContent:"space-between",gap:"10px",fontSize:"11.5px",alignItems:"center"},
  scoreLabelText:{color:"#1f1f1f",fontWeight:700,flex:1},
  scoreBadge:{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:"76px",padding:"6px 10px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.03em",border:"1px solid transparent"},
  scoreBadgeHigh:{background:"#fff1da",color:"#9a5a00",borderColor:"#ffc266"},
  scoreBadgeMedium:{background:"#fff7e8",color:"#8a6510",borderColor:"#e7c98d"},
  scoreBadgeLow:{background:"#efefef",color:"#3f3f46",borderColor:"#d6d6db"},
  scoreBadgeMissing:{background:"#ffe6e1",color:"#a03d2b",borderColor:"#efb3a7"},
  scoreBadgeNA:{background:"#f2f2f2",color:"#777777",borderColor:"#dddddd"},
  scoreBadgeDefault:{background:"#f1f1f3",color:"#2c2c2c",borderColor:"#dddddf"},

  heroGlow:{position:"absolute",right:"-18%",top:"-20%",width:"420px",height:"420px",borderRadius:"999px",background:"radial-gradient(circle,rgba(255,152,0,.18),transparent 64%)",filter:"blur(8px)",pointerEvents:"none"},
  heroStatsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:"10px",marginTop:"26px",position:"relative",zIndex:1},
  heroStatItem:{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"16px",padding:"12px 13px",backdropFilter:"blur(8px)"},
  heroStatNumber:{fontFamily:DISPLAY_FONT,fontSize:"22px",lineHeight:1,color:"#ffffff"},
  heroStatLabel:{fontSize:"11.5px",lineHeight:1.25,color:"#bfc3cb",marginTop:"3px"},
  accessTopLine:{height:"3px",width:"100%",background:"linear-gradient(90deg,transparent,#ff9800,transparent)",borderRadius:"999px",marginBottom:"18px",animation:"vpsPulse 2.8s ease-in-out infinite"},
  accessKicker:{fontSize:"10px",letterSpacing:"0.13em",textTransform:"uppercase",fontWeight:800,color:"#ffb65e",marginBottom:"8px"},
  audienceBox:{background:"linear-gradient(180deg,#11141a 0%,#0d0f14 100%)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"14px",padding:"20px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"18px",flexWrap:"wrap",boxShadow:"0 16px 40px rgba(0,0,0,.24)"},
  audienceTitle:{fontFamily:DISPLAY_FONT,fontSize:"22px",lineHeight:1.16,color:"#ffffff",maxWidth:"660px"},
  audienceChips:{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"flex-end"},
  audienceChip:{fontSize:"12px",fontWeight:800,color:"#f5f5f5",border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.04)",borderRadius:"999px",padding:"8px 11px"},
  sectionIntro:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:"14px",flexWrap:"wrap",padding:"8px 2px 0"},
  sectionEyebrow:{fontSize:"11px",fontWeight:900,letterSpacing:"0.16em",textTransform:"uppercase",color:"#ff9800"},
  sectionTitle:{fontFamily:DISPLAY_FONT,fontSize:"clamp(26px,3vw,42px)",lineHeight:1.05,color:"#ffffff",marginTop:"7px"},
  compareLine:{position:"absolute",left:"0%",top:0,bottom:0,width:"2px",background:"rgba(255,152,0,.95)",boxShadow:"0 0 24px rgba(255,152,0,.5)",transition:"left .55s ease",zIndex:4},
  compareKnob:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"999px",background:"#ff9800",color:"#111",fontWeight:900,fontSize:"14px",boxShadow:"0 8px 24px rgba(0,0,0,.35)"},
  processSection:{background:"linear-gradient(180deg,#15171d 0%,#0d0f14 100%)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"16px",padding:"24px",boxShadow:"0 18px 48px rgba(0,0,0,.26)"},
  processGrid:{display:"grid",gap:"14px",marginTop:"18px"},
  processCard:{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.10)",borderRadius:"13px",padding:"18px",minHeight:"150px"},
  processNumber:{fontFamily:MONO_FONT,fontSize:"12px",fontWeight:900,color:"#ff9800",marginBottom:"18px"},
  processTitle:{fontFamily:DISPLAY_FONT,fontSize:"21px",lineHeight:1.1,color:"#ffffff",marginBottom:"8px"},
  processText:{fontSize:"13px",lineHeight:1.55,color:"#bfc3cb"},

  salesHeroTop:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",flexWrap:"wrap"},
  salesTitleAccent:{color:"#ff9800"},
  salesHeroBody:{fontFamily:DISPLAY_FONT,fontSize:"clamp(24px,3vw,34px)",lineHeight:1.1,color:"#ffffff",margin:"6px 0 14px",maxWidth:"800px"},
  compareGrid:{display:"grid",gap:"16px"},
  compareCardWrap:{background:"linear-gradient(180deg,#15171d 0%,#101217 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"14px",boxShadow:"0 20px 52px rgba(0,0,0,0.30)"},
  compareMedia:{position:"relative",borderRadius:"18px",overflow:"hidden",aspectRatio:"16 / 9",background:"#111"},
  compareImg:{width:"100%",height:"100%",objectFit:"cover",display:"block"},
  compareOverlay:{position:"absolute",inset:0,opacity:0,overflow:"hidden",transition:"opacity .45s ease",zIndex:2},
  compareLabel:{position:"absolute",top:12,background:"rgba(11,12,15,0.75)",border:"1px solid rgba(255,255,255,0.18)",padding:"7px 10px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.12em",color:"#fff"},
  compareHint:{position:"absolute",left:"50%",bottom:14,transform:"translate(-50%,8px)",opacity:0,transition:"all .3s ease",background:"rgba(0,0,0,.58)",border:"1px solid rgba(255,255,255,.18)",padding:"8px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:700,color:"#fff",zIndex:6},
  compareCopy:{padding:"14px 4px 4px"},
  compareTitle:{display:"none"},
  compareSubtitle:{fontSize:"12.5px",lineHeight:1.5,color:"#bfc3cb"},
  pricingSectionTitle:{fontFamily:DISPLAY_FONT,fontSize:"clamp(24px,2.5vw,34px)",color:"#fff",lineHeight:1.08,marginTop:"14px"},
  currencyToggle:{display:"inline-flex",gap:"6px",padding:"5px",borderRadius:"999px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.10)"},
  currencyBtn:{background:"transparent",color:"#bfc3cb",border:"1px solid transparent",padding:"9px 14px",fontSize:"11px",fontWeight:800,borderRadius:"999px",cursor:"pointer",fontFamily:BODY_FONT,letterSpacing:"0.1em"},
  currencyBtnOn:{background:"#ff9800",borderColor:"#ff9800",color:"#111111"},
  pricingCardDark:{background:"radial-gradient(circle at 12% 0%,rgba(255,152,0,.08),transparent 32%),linear-gradient(180deg,#13151c 0%,#0d0f14 100%)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"14px",padding:"24px",display:"flex",flexDirection:"column",gap:"13px",boxShadow:"0 24px 64px rgba(0,0,0,0.36)",position:"relative",overflow:"hidden"},
  pricingFeaturedDark:{border:"1.5px solid #ff9800",background:"radial-gradient(circle at 15% 0%,rgba(255,152,0,.18),transparent 36%),linear-gradient(180deg,#171922 0%,#0e1015 100%)",boxShadow:"0 24px 70px rgba(255,152,0,0.22), 0 18px 46px rgba(0,0,0,.38)"},
  pricingBadge:{position:"absolute",top:0,left:"50%",transform:"translate(-50%,-50%)",background:"#ff9800",color:"#111",padding:"8px 16px",borderRadius:"999px",fontSize:"11px",fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase"},
  pricingEyebrowText:{fontSize:"12px",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"#ffb65e",marginTop:"4px"},
  pricingNameDark:{fontFamily:DISPLAY_FONT,fontSize:"26px",lineHeight:1.05,color:"#fff"},
  pricingCurrent:{fontFamily:DISPLAY_FONT,fontSize:"46px",lineHeight:1,color:"#fff",letterSpacing:"-0.04em"},
  pricingOldLine:{fontSize:"13px",color:"#9da2ae",textDecoration:"line-through",minHeight:"18px",fontWeight:700},
  pricingList:{listStyle:"none",padding:0,margin:"2px 0 8px",display:"flex",flexDirection:"column",gap:"10px",flex:1},
  pricingListItem:{display:"flex",alignItems:"flex-start",gap:"10px",fontSize:"13px",lineHeight:1.45,color:"#d7dbe2"},
  pricingCheck:{color:"#ff9800",fontWeight:900},
  pricingButtonGhost:{background:"rgba(255,255,255,0.055)",color:"#ffffff",border:"1px solid rgba(255,255,255,0.14)",padding:"13px 16px",fontSize:"12.5px",fontWeight:800,cursor:"pointer",borderRadius:"14px",fontFamily:BODY_FONT},
  viewPacksBtn:{background:"#ff9800",color:"#111111",border:"1px solid #ff9800",boxShadow:"0 10px 26px rgba(255,152,0,.22)"},
  heroMainBtn:{padding:"15px 26px",fontSize:"14.5px",fontWeight:800,borderRadius:"14px"},
  footerCtaBox:{background:"radial-gradient(circle at 50% 0%,rgba(255,152,0,.18),transparent 38%),linear-gradient(180deg,#15171f 0%,#0c0e13 100%)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"16px",padding:"38px 28px",boxShadow:"0 24px 66px rgba(0,0,0,0.34)",textAlign:"center",position:"relative",overflow:"hidden"},
  footerCtaTitle:{fontFamily:DISPLAY_FONT,fontSize:"clamp(34px,4vw,58px)",lineHeight:.98,color:"#fff",marginBottom:"14px",letterSpacing:"-0.035em"},
  footerCtaText:{fontSize:"16px",lineHeight:1.65,color:"#c8cdd6",maxWidth:"860px",margin:"0 auto"},
  accessHeaderRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"16px",marginBottom:"14px"},
  accessTopLineGlow:{display:"block",width:"70%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.55),#ff9800,transparent)",borderRadius:"999px"},
  accessPriceBox:{textAlign:"right",background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.10)",borderRadius:"18px",padding:"12px 14px",minWidth:"118px"},
  accessPriceLabel:{fontFamily:MONO_FONT,fontSize:"10px",fontWeight:900,letterSpacing:"0.14em",color:"#ffb65e",marginBottom:"4px"},
  accessPrice:{fontFamily:DISPLAY_FONT,fontSize:"28px",lineHeight:1,color:"#ffffff",letterSpacing:"-0.04em"},
  accessOldPrice:{fontSize:"11px",color:"#9096a3",textDecoration:"line-through",marginTop:"4px"},
  accessIncludedBox:{background:"rgba(255,255,255,.045)",border:"1px solid rgba(255,255,255,.10)",borderRadius:"18px",padding:"14px",margin:"0 0 16px"},
  accessIncludedTitle:{fontFamily:MONO_FONT,fontSize:"10px",fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#ffb65e",marginBottom:"10px"},
  accessIncludedItem:{display:"flex",alignItems:"center",gap:"8px",fontSize:"12.5px",lineHeight:1.45,color:"#e2e5eb",margin:"7px 0"},
  accessBtn:{padding:"14px 18px",fontSize:"13.5px",fontWeight:900,borderRadius:"15px"},
  pricingPremiumCta:{padding:"13px 16px",fontSize:"13px",fontWeight:900,borderRadius:"14px",boxShadow:"0 14px 34px rgba(255,152,0,.28)"},
  pricingTopGlow:{position:"absolute",top:0,left:"12%",right:"12%",height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,152,0,.9),transparent)",opacity:.85},
  pricingPriceWrap:{display:"flex",alignItems:"flex-end",gap:"8px",marginTop:"2px"},
  pricingOneTime:{fontSize:"12px",color:"#9ca2ad",fontWeight:700,paddingBottom:"5px"},
  footerCtaKicker:{fontFamily:MONO_FONT,fontSize:"11px",fontWeight:900,letterSpacing:"0.14em",color:"#ffb65e",textTransform:"uppercase",marginBottom:"14px"},
  footerPromiseRow:{display:"flex",justifyContent:"center",gap:"10px",flexWrap:"wrap",marginTop:"20px"},
  footerPromise:{display:"inline-flex",alignItems:"center",gap:"7px",background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.10)",borderRadius:"999px",padding:"9px 12px",fontSize:"12.5px",fontWeight:700,color:"#e6e8ed"},
  benefitsSection:{background:"linear-gradient(180deg,#12141a 0%,#0d0f14 100%)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"24px",boxShadow:"0 18px 46px rgba(0,0,0,0.22)"},
  benefitsGrid:{display:"grid",gap:"14px",marginTop:"18px"},
  benefitCard:{background:"linear-gradient(180deg,#16181f 0%,#101217 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"13px",padding:"18px",boxShadow:"0 12px 28px rgba(0,0,0,.18)"},
  benefitIcon:{width:"44px",height:"44px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"14px",background:"rgba(255,152,0,.10)",border:"1px solid rgba(255,152,0,.24)",marginBottom:"14px"},
  benefitTitle:{fontFamily:DISPLAY_FONT,fontSize:"20px",lineHeight:1.08,color:"#ffffff",marginBottom:"8px"},
  benefitText:{fontSize:"13px",lineHeight:1.58,color:"#c6cad2"},
};
