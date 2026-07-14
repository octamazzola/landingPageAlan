// ════════════════════════════════════════════════════════════════════════
//  VISUAL PROMPT STUDIO — INICIO (landing / marketing)
//  Proyecto 1/2: página de ventas trilingüe (ES/EN/PT) + formulario de acceso.
//  Al enviar el acceso, guarda el email en localStorage("vps_active_user")
//  y redirige a APP_URL (proyecto "resto"), que retoma esa sesión.
// ════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useCallback } from "react";

// URL del proyecto "resto" (la app/workspace). Ajustar al desplegar.
const APP_URL = "/app";

const COUNTDOWN_START = 12*3600 + 50*60 + 50;
const COUNTDOWN_RESET = 2*3600 + 50*60 + 50;

const DISPLAY_FONT = '"Archivo Expanded", "Archivo", Arial, sans-serif';
const BODY_FONT = '"IBM Plex Sans", Calibri, Arial, sans-serif';
const MONO_FONT = '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace';

import { DEMO_IMAGES } from "./DemoImages";

const HOME = {
  en: {
    eyebrow:"Premium Pack · Manual access · 12-month updates",
    title:"Visual Prompt Studio for architectural AI visualization.",
    text:"A professional prompt constructor designed for architects, students, studios, visualizers and real estate teams who need controlled AI render prompts without losing project identity.",
    primary:"Open the constructor",
    secondary:"View packs",
    loginTitle:"Client workspace",
    loginText:"Manual access for verified clients. Each user keeps their own projects, favorites and custom blocks in a private browser workspace until the production login is connected.",
    email:"client@email.com",
    password:"Access code",
    loginBtn:"Enter workspace",
    accessFoot:"Manual access · User-scoped workspace",
    features:[
      ["Geometry lock","Preservation modes for image-to-image workflows, client presentations and design fidelity."],
      ["Prompt in English","The final prompt is always generated in English, with a translated reading version below."],
      ["Premium recipes","Few, curated workflows for SketchUp, style reference, physical model, collage, section and real estate hero images."],
      ["Tool adapters","Universal, GPT Image, Midjourney, Flux/Stable Diffusion and Krea/Magnific output modes."],
      ["Prompt check","Readable validation for geometry, materiality, camera, lighting and overload risk."],
      ["Per-user storage","Favorites, quality presets, custom blocks and projects are scoped by user for the future login version."]
    ],
    pricingTitle:"Offer structure",
    pricing:[
      ["Pack INICIAL","USD 15","Before USD 25 · ARS $20,000","11-prompt library + camera, lighting and materiality modifiers + PDF guide + mini course + PRO upgrade discount."],
      ["Pack PRO","USD 30","Before USD 65 · ARS $42,500","Complete 45-prompt library + 11 modifiers + PDF guide + course + LOCK Method + case studies + Rescue Manual + tool adapters + professional kit."],
      ["Pack PREMIUM","USD 45","Before USD 95 · ARS $65,000","Everything in PRO + 20 image humanization prompts + Web app with login + constructor + 12-month updates."],
      ["APP Access","USD 25","Before USD 45 · ARS $35,000","Web app access for 12 months + constructor + updates for 12 months."]
    ],
    launchTitle:"Built as the Premium Pack differentiator",
    launchText:"The home screen works as a sales landing and the app is positioned as the exclusive tool included in the PREMIUM pack, with a separate APP-only access option."
  },
  es: {
    eyebrow:"Pack Premium · Acceso manual · Actualizaciones 12 meses",
    title:"Visual Prompt Studio para visualizaciones arquitectónicas con IA.",
    text:"Un constructor profesional de prompts pensado para arquitectos, estudiantes, estudios, renderistas e inmobiliarias que necesitan prompts controlados sin perder la identidad del proyecto.",
    primary:"Abrir el constructor",
    secondary:"Ver packs",
    loginTitle:"Workspace para clientes",
    loginText:"Acceso manual para clientes verificados. Cada usuario conserva sus proyectos, favoritos y bloques personalizados en un espacio propio del navegador hasta conectar el login productivo.",
    email:"cliente@email.com",
    password:"Código de acceso",
    loginBtn:"Entrar al workspace",
    accessFoot:"Acceso manual · Guardado por usuario",
    features:[
      ["Bloqueo geométrico","Modos de preservación para image-to-image, presentaciones a cliente y fidelidad de proyecto."],
      ["Prompt en inglés","El prompt final se genera siempre en inglés, con traducción de lectura debajo en el idioma seleccionado."],
      ["Recetas premium","Pocos workflows curados para SketchUp, referencia de estilo, maqueta física, collage, corte e imagen hero inmobiliaria."],
      ["Adaptadores por herramienta","Modos Universal, GPT Image, Midjourney, Flux/Stable Diffusion y Krea/Magnific."],
      ["Chequeo de prompt","Validación legible de geometría, materialidad, cámara, iluminación y riesgo de sobrecarga."],
      ["Guardado por usuario","Favoritos, presets de calidad, bloques personalizados y proyectos quedan separados por usuario para la versión con login."]
    ],
    pricingTitle:"Estructura de oferta",
    pricing:[
      ["Pack INICIAL","USD 15","Antes USD 25 · ARS $20.000","Biblioteca de 11 prompts + modificadores de cámara, iluminación y materialidad + guía PDF + mini curso + descuento para ingresar al Pack PRO."],
      ["Pack PRO","USD 30","Antes USD 65 · ARS $42.500","Biblioteca completa de 45 prompts + 11 modificadores + guía PDF + curso + Método LOCK + casos de estudio + Manual de rescate + adaptadores por herramienta + kit profesional."],
      ["Pack PREMIUM","USD 45","Antes USD 95 · ARS $65.000","Todo el Pack PRO + 20 prompts de humanización de imágenes + web app con login + constructor + actualizaciones por 12 meses."],
      ["Acceso a APP","USD 25","Antes USD 45 · ARS $35.000","Web app con login por 12 meses + constructor + actualizaciones por 12 meses."]
    ],
    launchTitle:"Pensada como diferencial del Pack Premium",
    launchText:"El Inicio funciona como landing de venta y la app queda posicionada como la herramienta exclusiva del Pack PREMIUM, con una opción separada de acceso solo a la APP."
  },
  pt: {
    eyebrow:"Pack Premium · Acesso manual · Atualizações 12 meses",
    title:"Visual Prompt Studio para visualizações arquitetônicas com IA.",
    text:"Um construtor profissional de prompts para arquitetos, estudantes, estúdios, visualizadores e imobiliárias que precisam de prompts controlados sem perder a identidade do projeto.",
    primary:"Abrir o construtor",
    secondary:"Ver pacotes",
    loginTitle:"Workspace para clientes",
    loginText:"Acesso manual para clientes verificados. Cada usuário mantém seus projetos, favoritos e blocos personalizados em um espaço próprio do navegador até conectar o login produtivo.",
    email:"cliente@email.com",
    password:"Código de acesso",
    loginBtn:"Entrar no workspace",
    accessFoot:"Acesso manual · Guardado por usuário",
    features:[
      ["Bloqueio geométrico","Modos de preservação para image-to-image, apresentações a cliente e fidelidade do projeto."],
      ["Prompt em inglês","O prompt final é sempre gerado em inglês, com tradução de leitura abaixo no idioma selecionado."],
      ["Receitas premium","Poucos workflows curados para SketchUp, referência de estilo, maquete física, collage, corte e imagem hero imobiliária."],
      ["Adaptadores por ferramenta","Modos Universal, GPT Image, Midjourney, Flux/Stable Diffusion e Krea/Magnific."],
      ["Verificação de prompt","Validação legível de geometria, materialidade, câmera, iluminação e risco de sobrecarga."],
      ["Guardado por usuário","Favoritos, presets de qualidade, blocos personalizados e projetos ficam separados por usuário para a versão com login."]
    ],
    pricingTitle:"Estrutura da oferta",
    pricing:[
      ["Pack INICIAL","USD 15","Antes USD 25 · ARS $20.000","Biblioteca de 11 prompts + modificadores de câmera, iluminação e materialidade + guia PDF + mini curso + desconto para entrar no Pack PRO."],
      ["Pack PRO","USD 30","Antes USD 65 · ARS $42.500","Biblioteca completa de 45 prompts + 11 modificadores + guia PDF + curso + Método LOCK + estudos de caso + Manual de resgate + adaptadores por ferramenta + kit profissional."],
      ["Pack PREMIUM","USD 45","Antes USD 95 · ARS $65.000","Todo o Pack PRO + 20 prompts de humanização de imagens + web app com login + construtor + atualizações por 12 meses."]
    ],
    launchTitle:"Pensada como diferencial do Pack Premium",
    launchText:"O Início funciona como landing de venda e a app fica posicionada como ferramenta exclusiva do Pack PREMIUM, com uma opção separada de acesso apenas à APP."
  }
};

const LANDING_COPY = {
  en: {
    offer: 'LIMITED TIME OFFER', eyebrow: 'AI ARCHITECTURAL VISUALIZATION', benefits: 'CONTROL  •  SPEED  •  QUALITY', viewPacks: 'VIEW PACKS',
    heroTitleA: 'Direct AI the same way you direct your', heroTitleB: 'studio.', heroBody: 'Turn any render into a professional-level image with AI',
    subtitle: 'The definitive system for creating photorealistic architectural visualizations with Artificial Intelligence',
    heroPrimary: 'I WANT MY PACK', heroSecondary: 'APP ACCESS', accessTitle: 'App Access',
    accessText: 'Manual access for verified clients. Enter your email to open the app workspace and access your prompt constructor.',
    compareHouseTitle: 'From SketchUp massing to premium exterior render', compareHouseSubtitle: 'Hover to reveal the final render',
    compareRoomTitle: 'From interior sketch to editorial bedroom atmosphere', compareRoomSubtitle: 'Hover to reveal the final render',
    pricingEyebrow: 'PACKS & ACCESS', pricingTitle: 'Choose the option that fits your workflow', currencyUsd: 'USD', currencyArs: 'ARS',
    packButton: 'I WANT MY PACK', accessButton: 'I WANT MY ACCESS', footerTitleA: 'Stop fighting with AI.', footerTitleB: 'Start directing it.',
    footerSubtitle: 'Join the professionals already creating architectural visualizations with control, speed and quality.'
  },
  es: {
    offer: 'OFERTA POR TIEMPO LIMITADO', eyebrow: 'VISUALIZACIÓN ARQUITECTÓNICA CON IA', benefits: 'CONTROL  •  VELOCIDAD  •  CALIDAD', viewPacks: 'VER PACKS',
    heroTitleA: 'Dirige la IA como diriges tu', heroTitleB: 'estudio.', heroBody: 'Convertí cualquier render en una imagen de nivel profesional con IA',
    subtitle: 'El sistema definitivo para crear visualizaciones arquitectónicas fotorrealistas con Inteligencia Artificial',
    heroPrimary: 'QUIERO MI PACK', heroSecondary: 'ACCESO A APP', accessTitle: 'Acceso a App',
    accessText: 'Acceso manual para clientes verificados. Ingresá tu email para abrir el workspace de la app y entrar al constructor de prompts.',
    compareHouseTitle: 'De SketchUp a render exterior premium', compareHouseSubtitle: 'Pasá el cursor para revelar el render final',
    compareRoomTitle: 'De sketch interior a atmósfera editorial de dormitorio', compareRoomSubtitle: 'Pasá el cursor para revelar el render final',
    pricingEyebrow: 'PACKS Y ACCESOS', pricingTitle: 'Elegí la opción que mejor se adapta a tu flujo', currencyUsd: 'USD', currencyArs: 'ARS',
    packButton: 'QUIERO MI PACK', accessButton: 'QUIERO MI ACCESO', footerTitleA: 'Deja de pelear con la IA.', footerTitleB: 'Empieza a dirigirla.',
    footerSubtitle: 'Únete a los profesionales que ya generan visualizaciones arquitectónicas con control, velocidad y calidad.'
  },
  pt: {
    offer: 'OFERTA POR TEMPO LIMITADO', eyebrow: 'VISUALIZAÇÃO ARQUITETÔNICA COM IA', benefits: 'CONTROLE  •  VELOCIDADE  •  QUALIDADE', viewPacks: 'VER PACOTES',
    heroTitleA: 'Diriga a IA como você dirige seu', heroTitleB: 'estúdio.', heroBody: 'Transforme qualquer render em uma imagem de nível profissional com IA',
    subtitle: 'O sistema definitivo para criar visualizações arquitetônicas fotorrealistas com Inteligência Artificial',
    heroPrimary: 'QUERO MEU PACK', heroSecondary: 'ACESSO À APP', accessTitle: 'Acesso à App',
    accessText: 'Acesso manual para clientes verificados. Digite seu email para abrir o workspace da app e entrar no construtor de prompts.',
    compareHouseTitle: 'De SketchUp para render externo premium', compareHouseSubtitle: 'Passe o cursor para revelar o render final',
    compareRoomTitle: 'De sketch interno para atmosfera editorial de quarto', compareRoomSubtitle: 'Passe o cursor para revelar o render final',
    pricingEyebrow: 'PACKS E ACESSOS', pricingTitle: 'Escolha a opção que melhor se adapta ao seu fluxo', currencyUsd: 'USD', currencyArs: 'ARS',
    packButton: 'QUERO MEU PACK', accessButton: 'QUERO MEU ACESSO', footerTitleA: 'Pare de brigar com a IA.', footerTitleB: 'Comece a dirigi-la.',
    footerSubtitle: 'Junte-se aos profissionais que já criam visualizações arquitetônicas com controle, velocidade e qualidade.'
  },
};

const LANDING_EXTRAS = {
  en: {
    stats:[['+45','tested prompts'],['6','professional modifiers'],['30','humanization prompts']],
    audienceTitle:'Designed for architectural workflows that need consistency, speed and visual control.',
    audience:['Independent architects','Architecture students','Design studios','Render artists','Real estate teams'],
    processEyebrow:'HOW IT WORKS',
    processTitle:'From idea to controlled AI prompt in three steps',
    steps:[['01','Choose the objective','Select the visualization type and preservation level.','target'],['02','Direct the style','Combine materials, lighting, camera and atmosphere.','sliders'],['03','Copy and generate','Export the English prompt with its translated reading version.','copy']],
    compareEyebrow:'BEFORE / AFTER',
    benefitTitle:'4 benefits of getting the packs',
    benefits:[['spark','Professional prompt system','Prompt structures designed specifically for architectural visualization workflows.'],['builder','Fast prompt construction','Build more solid prompts in less time, without starting from scratch every time.'],['shield','More control over the result','Guide geometry, style and quality with clearer creative direction.'],['globe','English prompt + local reading','Generate in English and review the translated reading below in your chosen language.']],
    oldPrefix:'Before',
    premiumNote:'Premium visual system for AI architectural rendering.',
    accessIncludedTitle:'App access includes',
    accessBullets:['Private workspace','Prompt constructor','12 months of updates'],
    closeKicker:'READY TO WORK WITH AI LIKE A STUDIO DIRECTOR',
    closeTitleA:'Stop improvising prompts.',
    closeTitleB:'Start selling better images.',
    closeSub:'A complete system to create, control and present AI architectural visualizations with a professional workflow.',
    closeBullets:['Less trial and error','More consistent visual direction','A product ready to use in real projects'],
  },
  es: {
    stats:[['+45','prompts probados'],['6','modificadores profesionales'],['30','prompts de humanización']],
    audienceTitle:'Diseñado para flujos de arquitectura que necesitan consistencia, velocidad y control visual.',
    audience:['Arquitectos independientes','Estudiantes de arquitectura','Estudios de arquitectura','Renderistas','Inmobiliarias'],
    processEyebrow:'CÓMO FUNCIONA',
    processTitle:'De la idea al prompt controlado en tres pasos',
    steps:[['01','Elegí el objetivo','Seleccioná el tipo de visualización y el nivel de preservación.','target'],['02','Dirigí el estilo','Combiná materiales, iluminación, cámara y atmósfera.','sliders'],['03','Copiá y generá','Exportá el prompt en inglés con su traducción de lectura.','copy']],
    compareEyebrow:'ANTES / DESPUÉS',
    benefitTitle:'4 beneficios de obtener los packs',
    benefits:[['spark','Sistema profesional de prompts','Estructuras de prompt pensadas específicamente para visualización arquitectónica.'],['builder','Construcción rápida de prompts','Armá prompts sólidos en menos tiempo, sin empezar desde cero en cada imagen.'],['shield','Más control sobre el resultado','Guiá geometría, estilo y calidad con una dirección creativa mucho más clara.'],['globe','Prompt en inglés + lectura local','Generá en inglés y revisá abajo la traducción de lectura en tu idioma seleccionado.']],
    oldPrefix:'Antes',
    premiumNote:'Sistema visual premium para renders arquitectónicos con IA.',
    accessIncludedTitle:'El acceso a la app incluye',
    accessBullets:['Workspace privado','Constructor de prompts','12 meses de actualizaciones'],
    closeKicker:'LISTO PARA TRABAJAR CON IA COMO DIRECTOR DE ESTUDIO',
    closeTitleA:'Dejá de improvisar prompts.',
    closeTitleB:'Empezá a vender mejores imágenes.',
    closeSub:'Un sistema completo para crear, controlar y presentar visualizaciones arquitectónicas con IA usando un flujo profesional.',
    closeBullets:['Menos prueba y error','Más consistencia visual','Un producto listo para proyectos reales'],
  },
  pt: {
    stats:[['+45','prompts testados'],['6','modificadores profissionais'],['30','prompts de humanização']],
    audienceTitle:'Projetado para fluxos de arquitetura que precisam de consistência, velocidade e controle visual.',
    audience:['Arquitetos independientes','Estudantes de arquitetura','Escritórios de arquitetura','Renderistas','Imobiliárias'],
    processEyebrow:'COMO FUNCIONA',
    processTitle:'Da ideia ao prompt controlado em três passos',
    steps:[['01','Escolha o objetivo','Selecione o tipo de visualização e o nível de preservação.','target'],['02','Dirija o estilo','Combine materiais, iluminação, câmera e atmosfera.','sliders'],['03','Copie e gere','Exporte o prompt em inglês com sua tradução de leitura.','copy']],
    compareEyebrow:'ANTES / DEPOIS',
    benefitTitle:'4 benefícios de obter os pacotes',
    benefits:[['spark','Sistema profissional de prompts','Estruturas de prompt pensadas especificamente para visualização arquitectônica.'],['builder','Construção rápida de prompts','Monte prompts sólidos em menos tempo, sem começar do zero em cada imagem.'],['shield','Mais controle sobre o resultado','Guie geometria, estilo e qualidade com uma direção criativa muito mais clara.'],['globe','Prompt em inglês + leitura local','Gere em inglês e revise abaixo a tradução de leitura no idioma selecionado.']],
    oldPrefix:'Antes',
    premiumNote:'Sistema visual premium para renders arquitectónicos com IA.',
    accessIncludedTitle:'O acesso à app inclui',
    accessBullets:['Workspace privado','Construtor de prompts','12 meses de atualizações'],
    closeKicker:'PRONTO PARA TRABALHAR COM IA COMO DIRETOR DE ESTÚDIO',
    closeTitleA:'Pare de improvisar prompts.',
    closeTitleB:'Comece a vender imagens melhores.',
    closeSub:'Um sistema completo para criar, controlar e apresentar visualizações arquitetônicas com IA usando um fluxo profissional.',
    closeBullets:['Menos tentativa e erro','Mais consistência visual','Um produto pronto para projetos reais'],
  },
};

const PACKS = {
  en: [
    { id:'initial', eyebrow:'START HERE', name:'Starter Library', featured:false, currentUsd:'USD 15', oldUsd:'USD 25', currentArs:'$20,000', oldArs:'$40,000', cta:'pack', features:['Access to 15 base prompt blocks','Essential camera and materiality modifiers','Quick start PDF guide','Basic updates for 3 months'] },
    { id:'pro', eyebrow:'RECOMMENDED', name:'Complete Library', featured:true, currentUsd:'USD 30', oldUsd:'USD 65', currentArs:'$42,500', oldArs:'$95,000', cta:'pack', features:['Full collection of 90+ prompt blocks','All premium lighting and style modifiers','PDF guide + video case studies','Rescue Manual for AI generation errors','Adapters for Midjourney, Flux, Stable Diffusion'] }
  ],
  es: [
    { id:'initial', eyebrow:'EMPIEZA AQUÍ', name:'Biblioteca Inicial', featured:false, currentUsd:'USD 15', oldUsd:'USD 25', currentArs:'$20.000', oldArs:'$40.000', cta:'pack', features:['Acceso a 15 bloques base de prompts','Modificadores esenciales de cámara y materialidad','Guía de inicio rápido en PDF','Actualizaciones básicas por 3 meses'] },
    { id:'pro', eyebrow:'RECOMENDADO', name:'Biblioteca Completa', featured:true, currentUsd:'USD 30', oldUsd:'USD 65', currentArs:'$42.500', oldArs:'$95.000', cta:'pack', features:['Colección completa de 90+ bloques de prompts','Todos los modificadores premium de iluminación y estilo','Guía PDF + Casos de estudio en video','Manual de rescate para errores de IA','Adaptadores por herramientas (Midjourney, Flux, Stable Diffusion)'] }
  ],
  pt: [
    { id:'initial', eyebrow:'COMECE AQUI', name:'Biblioteca Inicial', featured:false, currentUsd:'USD 15', oldUsd:'USD 25', currentArs:'$20.000', oldArs:'$40.000', cta:'pack', features:['Acesso a 15 blocos base de prompts','Modificadores essenciais de câmera e materialidade','Guia de início rápido em PDF','Atualizações básicas por 3 meses'] },
    { id:'pro', eyebrow:'RECOMENDADO', name:'Biblioteca Completa', featured:true, currentUsd:'USD 30', oldUsd:'USD 65', currentArs:'$42.500', oldArs:'$95.000', cta:'pack', features:['Coleção completa de 90+ blocos de prompts','Todos os modificadores premium de iluminação e estilo','Guia PDF + Estudos de caso em vídeo','Manual de resgate para erros de IA','Adaptadores por ferramentas (Midjourney, Flux, Stable Diffusion)'] }
  ],
};

function formatClock(total) {
  const hrs = String(Math.floor(total/3600)).padStart(2,'0');
  const mins = String(Math.floor((total%3600)/60)).padStart(2,'0');
  const secs = String(total%60).padStart(2,'0');
  return `${hrs}:${mins}:${secs}`;
}

// ─── QUALITY TAGS WITH TRANSLATIONS ────────────────────────────────────────

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




const ImageCompareCard = React.memo(function ImageCompareCard({beforeSrc,afterSrc,title,subtitle}){
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = React.useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPos(pos);
  }, []);

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  return(
    <div className="vps-compare-card" style={S.compareCardWrap}>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={S.compareMedia}
      >
        <img src={beforeSrc} alt={title} style={S.compareImg} loading="lazy"/>
        <div 
          style={{
            ...S.compareOverlay,
            opacity: 1,
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            transition: "none"
          }}
        >
          <img src={afterSrc} alt={title} style={S.compareImg} loading="lazy"/>
        </div>
        <div 
          style={{
            ...S.compareLine,
            left: `${sliderPos}%`,
            transition: "none"
          }}
        >
          <span style={S.compareKnob}>↔</span>
        </div>
        <div style={{...S.compareLabel,left:12}}>SKETCH</div>
        <div style={{...S.compareLabel,right:12,background:"rgba(255,152,0,0.92)",borderColor:"rgba(255,186,80,0.95)",color:"#111"}}>RENDER</div>
      </div>
      <div style={S.compareCopy}>
        <div style={S.compareTitle}>{title}</div>
        <div style={S.compareSubtitle}>{subtitle}</div>
      </div>
    </div>
  );
});



const PREVIEW_BLOCKS = {
  en: {
    eyebrow: "LIBRARY PREVIEW",
    categories: [
      { id: "spaces", label: "Spaces" },
      { id: "styles", label: "Styles" },
      { id: "materials", label: "Materials" },
      { id: "camera", label: "Camera" },
      { id: "lighting", label: "Lighting" }
    ],
    items: {
      spaces: [
        { code: "S-01", title: "Residential Living Room", desc: "Minimalist open layout, double height ceilings, floor-to-ceiling glass doors" },
        { code: "S-02", title: "Brutalist Museum", desc: "Exposed concrete panels, skylights casting sharp geometric shadows" },
        { code: "S-03", title: "Modern Bedroom", desc: "Warm wood paneling, indirect LED lighting, integrated king size bed" },
        { code: "S-04", title: "Office Workspace", desc: "Biophilic design, acoustic ceiling baffles, collaborative desks" },
        { code: "S-05", title: "Retail Store", desc: "Terracotta tile accents, arched display niches, terrazzo flooring" },
        { code: "S-06", title: "Tiny House", desc: "Compact loft configuration, folding furniture, warm plywood finishes" }
      ],
      styles: [
        { code: "ST-01", title: "Tadao Ando Minimalist", desc: "Symmetric concrete sheets, clean lines, serene natural light" },
        { code: "ST-02", title: "Scandinavian Hygge", desc: "Light white oak, neutral wool rugs, soft pastel accents" },
        { code: "ST-03", title: "Industrial Loft", desc: "Exposed brick walls, black iron framing, high timber joists" },
        { code: "ST-04", title: "Mid-Century Modern", desc: "Teak wooden structures, organic shapes, brass hardware accents" },
        { code: "ST-05", title: "Mediterranean Organic", desc: "Smoothed plaster walls, microcement floors, rounded corners" },
        { code: "ST-06", title: "High-Tech Architecture", desc: "Steel trusses, visible HVAC ducts, metallic finishes" }
      ],
      materials: [
        { code: "M-01", title: "Travertine Marble", desc: "Unfilled roman travertine, porous texture, beige tones" },
        { code: "M-02", title: "Raw Concrete", desc: "Formwork pattern, matte grey texture, modular construction seams" },
        { code: "M-03", title: "Brushed Brass", desc: "Golden metallic sheen, subtle linear brushing, warm highlights" },
        { code: "M-04", title: "Fluted Glass", desc: "Ribbed vertical texture, semi-translucent light diffusion, black trim" },
        { code: "M-05", title: "Terracotta Brick", desc: "Handmade clay bricks, uneven textures, thin cement grout lines" },
        { code: "M-06", title: "Polished Microcement", desc: "Seamless floor covering, light grey cloud pattern, satin finish" }
      ],
      camera: [
        { code: "C-01", title: "Architectural Eye-Level", desc: "Human height perspective, perfect vertical lines correction, 24mm lens" },
        { code: "C-02", title: "Aerial Cenital", desc: "90-degree top view, orthographic layout representation, details nítidos" },
        { code: "C-03", title: "Interior Editorial Shot", desc: "Wide angle lens, natural daylight balance, magazine look" },
        { code: "C-04", title: "Close-up Detail", desc: "Macro focal depth, blurred background, highlighting material seams" },
        { code: "C-05", title: "One-Point Perspective", desc: "Symmetrical axial alignment, centered frame composition" },
        { code: "C-06", title: "Dusk Twilight Long Exposure", desc: "Soft warm ambient glow, blurred clouds, interior light traces" }
      ],
      lighting: [
        { code: "L-01", title: "Golden Hour", desc: "Late afternoon sun, long warm shadows, golden highlights on walls" },
        { code: "L-02", title: "Overcast Soft Light", desc: "Diffuse shadowless sky glow, natural ambient occlusion, realistic raw look" },
        { code: "L-03", title: "Dramatic Cinematic", desc: "High contrast keys, side light rays, misty volume shadows" },
        { code: "L-04", title: "Dusk Twilight Glow", desc: "Cool exterior blue hour light mixed with warm golden interior lamps" },
        { code: "L-05", title: "Studio High-Key", desc: "Even bright presentation, crisp clean shadows, commercial render look" },
        { code: "L-06", title: "Sunbeams", desc: "Sharp daylight volumetric rays passing through windows" }
      ]
    },
    sectionTitle: "Explore the Prompt Block Library",
    sectionSubtitle: "Click on the categories to discover the ready-made prompt blocks included in the packs.",
    copyBtn: "Copy Block",
    copied: "Copied!"
  },
  es: {
    eyebrow: "VISTA PREVIA DE BIBLIOTECA",
    categories: [
      { id: "spaces", label: "Espacios" },
      { id: "styles", label: "Estilos" },
      { id: "materials", label: "Materiales" },
      { id: "camera", label: "Cámara" },
      { id: "lighting", label: "Iluminación" }
    ],
    items: {
      spaces: [
        { code: "S-01", title: "Sala Residencial", desc: "Distribución abierta minimalista, techos de doble altura, puertas vidriadas de piso a techo" },
        { code: "S-02", title: "Museo Brutalista", desc: "Paneles de hormigón visto, claraboyas que proyectan sombras geométricas marcadas" },
        { code: "S-03", title: "Dormitorio Moderno", desc: "Revestimiento de madera cálida, iluminación LED indirecta, cama King integrada" },
        { code: "S-04", title: "Espacio de Oficina", desc: "Diseño biofílico, bafles acústicos de techo, escritorios colaborativos" },
        { code: "S-05", title: "Tienda Comercial", desc: "Detalles de azulejos de terracota, nichos arqueados de exhibición, piso de terrazo" },
        { code: "S-06", title: "Minicasa", desc: "Distribución compacta en loft, mobiliario plegable, acabados en contrachapado cálido" }
      ],
      styles: [
        { code: "ST-01", title: "Minimalismo Tadao Ando", desc: "Placas simétricas de hormigón, líneas depuradas, luz natural serena" },
        { code: "ST-02", title: "Nórdico Cálido", desc: "Roble blanco claro, alfombras de lana neutras, toques de color pastel suave" },
        { code: "ST-03", title: "Loft Industrial", desc: "Paredes de ladrillo a la vista, marcos de hierro negro, vigas de madera altas" },
        { code: "ST-04", title: "Moderno de Mitad de Siglo", desc: "Estructuras de madera de teca, formas orgánicas, acentos de herrajes de latón" },
        { code: "ST-05", title: "Orgánico Mediterráneo", desc: "Paredes de yeso alisado, pisos de microcemento, esquinas redondeadas" },
        { code: "ST-06", title: "Arquitectura High-Tech", desc: "Cerchas de acero, conductos de climatización expuestos, acabados metálicos" }
      ],
      materials: [
        { code: "M-01", title: "Mármol Travertino", desc: "Travertino romano sin taponar, textura porosa, tonos beige" },
        { code: "M-02", title: "Hormigón Visto", desc: "Patrón de encofrado, textura gris mate, costuras modulares" },
        { code: "M-03", title: "Latón Cepillado", desc: "Brillo metálico dorado, cepillado lineal sutil, reflejos cálidos" },
        { code: "M-04", title: "Vidrio Acanalado", desc: "Textura acanalada vertical, difusión de luz semitranslúcida, perfiles negros" },
        { code: "M-05", title: "Ladrillo Terracota", desc: "Ladrillos de arcilla artesanales, texturas irregulares, juntas de cemento delgadas" },
        { code: "M-06", title: "Microcemento Pulido", desc: "Revestimiento continuo, patrón de nubes gris claro, acabado satinado" }
      ],
      camera: [
        { code: "C-01", title: "Nivel de Ojo Humano", desc: "Perspectiva a altura humana, corrección de verticales perfecta, lente de 24mm" },
        { code: "C-02", title: "Aérea Cenital", desc: "Vista superior a 90 grados, representación ortogonal de la planta, detalles nítidos" },
        { code: "C-03", title: "Toma Editorial de Interior", desc: "Lente gran angular, balance de luz diurna natural, estética de revista" },
        { code: "C-04", title: "Detalle en Primer Plano", desc: "Profundidad focal macro, fondo difuminado, resaltando uniones de materiales" },
        { code: "C-05", title: "Perspectiva de Un Punto", desc: "Alineación axial simétrica, composición de encuadre centrado" },
        { code: "C-06", title: "Larga Exposición al Atardecer", desc: "Brillo cálido suave del atardecer, nubes difusas, trazas de luz interior" }
      ],
      lighting: [
        { code: "L-01", title: "Hora Dorada", desc: "Sol de última hora de la tarde, sombras largas y cálidas, reflejos dorados en las paredes" },
        { code: "L-02", title: "Día Nublado Suave", desc: "Luz difusa sin sombras marcadas, oclusión ambiental natural, aspecto fotorrealista crudo" },
        { code: "L-03", title: "Cinematográfica Dramática", desc: "Luces clave de alto contraste, rayos laterales de luz, sombras volumétricas con niebla" },
        { code: "L-04", title: "Atardecer Azulado", desc: "Luz exterior fresca de la hora azul combinada con lámparas interiores doradas y cálidas" },
        { code: "L-05", title: "Iluminación de Estudio", desc: "Presentación brillante y uniforme, sombras limpias y nítidas, aspecto de render comercial" },
        { code: "L-06", title: "Rayos de Sol Directos", desc: "Rayos volumétricos definidos de luz solar diurna atravesando ventanales" }
      ]
    },
    sectionTitle: "Explorá la Biblioteca de Bloques",
    sectionSubtitle: "Haz clic en las categorías para descubrir los bloques de prompt pre-diseñados incluidos en los packs.",
    copyBtn: "Copiar Bloque",
    copied: "¡Copiado!"
  },
  pt: {
    eyebrow: "PRÉ-VISUALIZAÇÃO DA BIBLIOTECA",
    categories: [
      { id: "spaces", label: "Espaços" },
      { id: "styles", label: "Estilos" },
      { id: "materials", label: "Materiais" },
      { id: "camera", label: "Câmera" },
      { id: "lighting", label: "Iluminação" }
    ],
    items: {
      spaces: [
        { code: "S-01", title: "Sala Residencial", desc: "Layout aberto minimalista, pé-direito duplo, portas de vidro do piso ao teto" },
        { code: "S-02", title: "Museu Brutalista", desc: "Painéis de concreto aparente, claraboias projetando sombras geométricas marcadas" },
        { code: "S-03", title: "Dormitório Moderno", desc: "Painéis de madeira quente, iluminação LED indireta, cama king integrada" },
        { code: "S-04", title: "Espaço de Escritório", desc: "Design biofílico, bafles acústicos no teto, mesas colaborativas" },
        { code: "S-05", title: "Loja Comercial", desc: "Detalhes de ladrilho de terracota, nichos de exibição arqueados, piso de granilite" },
        { code: "S-06", title: "Tiny House", desc: "Layout compacto de loft, móveis dobráveis, acabamentos em compensado quente" }
      ],
      styles: [
        { code: "ST-01", title: "Minimalismo Tadao Ando", desc: "Placas simétricas de concreto, linhas limpas, luz natural serena" },
        { code: "ST-02", title: "Nórdico Aconchegante", desc: "Carvalho branco claro, tapetes de lã neutros, detalhes em cores pastel suaves" },
        { code: "ST-03", title: "Loft Industrial", desc: "Paredes de tijolo aparente, esquadrias de ferro preto, vigas altas de madeira" },
        { code: "ST-04", title: "Moderno de Meados do Século", desc: "Estruturas de madeira teca, formas orgânicas, detalhes em latão" },
        { code: "ST-05", title: "Orgânico Mediterrâneo", desc: "Paredes de gesso alisado, piso de microcimento, cantos arredondados" },
        { code: "ST-06", title: "Arquitetura High-Tech", desc: "Treliças de aço, dutos de climatização visíveis, acabamentos metálicos" }
      ],
      materials: [
        { code: "M-01", title: "Mármore Travertino", desc: "Travertino romano sem estuque, textura porosa, tons de bege" },
        { code: "M-02", title: "Concreto Aparente", desc: "Padrão de fôrma, textura cinza fosca, juntas de construção modulares" },
        { code: "M-03", title: "Latão Escovado", desc: "Brilho metálico dourado, escovado linear sutil, reflexos quentes" },
        { code: "M-04", title: "Vidrio Canelado", desc: "Textura canelada vertical, difusão de luz semitranslúcida, perfis pretos" },
        { code: "M-05", title: "Tijolo de Terracota", desc: "Tijolos de argila artesanais, texturas irregulares, juntas finas de cimento" },
        { code: "M-06", title: "Microcimento Polido", desc: "Revestimento contínuo, padrão de nuvens cinza claro, acabamento acetinado" }
      ],
      camera: [
        { code: "C-01", title: "Nível do Olho Humano", desc: "Perspectiva na altura humana, correção de verticais perfeita, lente 24mm" },
        { code: "C-02", title: "Aérea Cenital", desc: "Vista superior de 90 graus, representação ortogonal da planta, detalhes nítidos" },
        { code: "C-03", title: "Foto Editorial de Interior", desc: "Lente grande angular, balanço de luz diurna natural, visual de revista" },
        { code: "C-04", title: "Detalhe em Primer Plano", desc: "Profundidade focal macro, fundo desfocado, destacando juntas de materiais" },
        { code: "C-05", title: "Perspectiva de Um Ponto", desc: "Alinhamento axial simétrico, composição de enquadramento centralizado" },
        { code: "C-06", title: "Longa Exposição no Crepúsculo", desc: "Brilho quente e suave do pôr do sol, nuvens difusas, traços de luz interna" }
      ],
      lighting: [
        { code: "L-01", title: "Hora de Ouro", desc: "Sol do fim da tarde, sombras longas e quentes, reflexos dourados nas paredes" },
        { code: "L-02", title: "Dia Nublado Suave", desc: "Luz difusa sem sombras marcadas, oclusão ambientar natural, visual fotorrealista cru" },
        { code: "L-03", title: "Cinematográfica Dramática", desc: "Luzes principais de alto contraste, raios de luz laterais, sombras volumétricas com névoa" },
        { code: "L-04", title: "Crepúsculo Azulado", desc: "Luz externa fresca da hora azul misturada com lâmpadas internas douradas e quentes" },
        { code: "L-05", title: "Iluminação de Estúdio", desc: "Apresentação brilhante e uniforme, sombras limpas e nítidas, visual de render comercial" },
        { code: "L-06", title: "Raios de Sol Diretos", desc: "Raios volumétricos definidos de luz solar diurna atravessando janelas" }
      ]
    },
    sectionTitle: "Explore a Biblioteca de Blocos",
    sectionSubtitle: "Clique nas categorias para descobrir os blocos de prompt pré-definidos incluídos nos pacotes.",
    copyBtn: "Copiar Bloco",
    copied: "Copiado!"
  }
};

export default function LandingPage(){
  const [lang,setLang]=useState("es");
  const [activeCat, setActiveCat] = useState("spaces");
  const [copiedIdx, setCopiedIdx] = useState(null);
  const h=HOME[lang]||HOME.es;
  const landing=LANDING_COPY[lang]||LANDING_COPY.es;
  const extras=LANDING_EXTRAS[lang]||LANDING_EXTRAS.es;
  const packs=PACKS[lang]||PACKS.es;
  const [currency,setCurrency]=useState("ars");
  const [offerTime,setOfferTime]=useState(COUNTDOWN_START);
  const [viewportWidth,setViewportWidth]=useState(typeof window!=="undefined"?window.innerWidth:1440);

  useEffect(()=>{
    const onResize=()=>setViewportWidth(window.innerWidth);
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>{
      setOfferTime(prev=>prev<=COUNTDOWN_RESET?COUNTDOWN_START:prev-1);
    },1000);
    return ()=>clearInterval(id);
  },[]);

  const isMobile=viewportWidth<960;
  const isTablet=viewportWidth<1280;
  const getDisplayedPrice = useCallback((pack)=>currency==="ars"?pack.currentArs:pack.currentUsd,[currency]);
  const getDisplayedOldPrice = useCallback((pack)=>currency==="ars"?(pack.oldArs||pack.oldUsd):pack.oldUsd,[currency]);
  const goToPacks = useCallback(()=>document.getElementById("vps-pricing")?.scrollIntoView({behavior:"smooth"}),[]);

  return(
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;700;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        html,body,#root{margin:0;min-height:100%;background:#0d0d0f;}
        *{box-sizing:border-box;}
        :focus-visible{outline:2px solid #ff9800;outline-offset:2px;border-radius:4px;}
        button:focus-visible,input:focus-visible{outline:2px solid #ff9800;outline-offset:2px;}
        ::selection{background:rgba(255,152,0,.32);color:#111;}
        .vps-grid{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:28px 28px;background-position:-1px -1px;}
        .vps-plate{position:relative;}
        .vps-plate::before,.vps-plate::after{content:"";position:absolute;width:16px;height:16px;pointer-events:none;opacity:.55;z-index:2;}
        .vps-plate::before{top:10px;left:10px;border-top:1.5px solid #ff9800;border-left:1.5px solid #ff9800;}
        .vps-plate::after{bottom:10px;right:10px;border-bottom:1.5px solid #ff9800;border-right:1.5px solid #ff9800;}
        .vps-btn,.vps-card-hover{transition:transform .24s cubic-bezier(.2,.8,.2,1), box-shadow .24s ease, border-color .24s ease, background .24s ease, color .24s ease, filter .24s ease;}
        .vps-btn:hover,.vps-card-hover:hover{transform:translateY(-2px);}
        .vps-btn:active,.vps-card-hover:active{transform:translateY(0);}
        .vps-result-panel{animation:vpsFadeUp .6s cubic-bezier(.2,.8,.2,1) both;}
        .vps-landing-card{animation:vpsFadeUp .7s cubic-bezier(.2,.8,.2,1) both;}
        .vps-pricing-card{position:relative;}
        .vps-pricing-card-inner-shine{position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none;}
        .vps-pricing-card-inner-shine:before{content:"";position:absolute;inset:-1px;border-radius:inherit;background:linear-gradient(115deg,transparent 0%,rgba(255,152,0,.22) 42%,rgba(255,255,255,.10) 50%,transparent 60%);transform:translateX(-120%);transition:transform .7s cubic-bezier(.2,.8,.2,1);z-index:0;}
        .vps-pricing-card:hover .vps-pricing-card-inner-shine:before{transform:translateX(120%);}
        .vps-pricing-card:hover{filter:brightness(1.04);}
        .vps-premium-card{animation:vpsPremiumGlow 3.8s ease-in-out infinite;}
        .vps-access-line{animation:vpsSweep 2.8s ease-in-out infinite;}
        .vps-compare-card:hover .vps-compare-overlay{opacity:1;}
        .vps-compare-card:hover .vps-compare-line{left:100%;}
        .vps-compare-card:hover .vps-compare-hint{opacity:1; transform:translate(-50%,0);}
        @keyframes vpsFadeUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes vpsPremiumGlow{0%,100%{box-shadow:0 22px 54px rgba(255,152,0,.16),0 16px 42px rgba(0,0,0,.34)}50%{box-shadow:0 28px 70px rgba(255,152,0,.26),0 18px 46px rgba(0,0,0,.42)}}
        @keyframes vpsSweep{0%{transform:translateX(-120%);opacity:.2}50%{opacity:1}100%{transform:translateX(120%);opacity:.2}}
        @media (prefers-reduced-motion: reduce){.vps-result-panel,.vps-landing-card,.vps-premium-card,.vps-access-line{animation:none!important}.vps-btn,.vps-card-hover{transition:none!important}}
      `}</style>
      <div className="vps-plate vps-grid" style={S.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px"}}>
          <div>
            <div style={S.eyebrow}>{landing.eyebrow}</div>
            <h1 style={S.brandTitle}><span style={S.brandWhite}>VISUALPROMPT</span> <span style={S.brandOrange}>STUDIO</span></h1>
            <div style={S.sub}>{landing.benefits}</div>
          </div>
          <div style={S.langSwitch}>
            {["en","es","pt"].map(l=>(
              <button key={l} style={{...S.langBtn,...(lang===l?S.langBtnOn:{})}} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={S.salesShell}>
          <div style={{...S.salesHero,gridTemplateColumns:"1fr"}}>
            <div style={{...S.salesHeroCopy, backgroundImage:`radial-gradient(circle at 14% 10%,rgba(255,152,0,.20),transparent 30%), linear-gradient(135deg,rgba(9,10,12,.91) 0%,rgba(10,12,15,.88) 52%,rgba(10,12,15,.92) 100%), url(${DEMO_IMAGES.houseRender})`, backgroundSize:"cover", backgroundPosition:"center"}}>
              <div style={S.heroGlow}></div>
              <div style={S.salesHeroTop}>
                <div style={S.salesPill}><Icon name="spark" size={14} color="#ff9800"/>{landing.eyebrow}</div>
                <button className="vps-btn" style={{...S.darkBtnGhost,...S.viewPacksBtn}} onClick={goToPacks}>{landing.viewPacks}</button>
              </div>
              <h2 style={S.salesTitle}>{landing.heroTitleA} <span style={S.salesTitleAccent}>{landing.heroTitleB}</span></h2>
              <div style={S.salesHeroBody}>{landing.heroBody}</div>
              <p style={S.salesText}>{landing.subtitle}</p>
              <div style={S.salesActions}>
                <button className="vps-btn" style={{...S.btnPri,...S.heroMainBtn}} onClick={goToPacks}>{landing.heroPrimary}</button>
              </div>
              <div style={S.heroStatsGrid}>
                {extras.stats.map((s)=>(
                  <div key={s[0]+s[1]} style={S.heroStatItem}>
                    <div style={S.heroStatNumber}>{s[0]}</div>
                    <div style={S.heroStatLabel}>{s[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="vps-landing-card" style={S.audienceBox}>
            <div style={S.audienceTitle}>{extras.audienceTitle}</div>
            <div style={S.audienceChips}>
              {extras.audience.map((item)=><span key={item} style={S.audienceChip}>{item}</span>)}
            </div>
          </div>

          <div style={S.sectionIntro}>
            <div style={S.sectionEyebrow}>{extras.compareEyebrow}</div>
          </div>
          <div style={{...S.compareGrid,gridTemplateColumns:isMobile?"1fr":"repeat(2,minmax(0,1fr))"}}>
            <ImageCompareCard beforeSrc={DEMO_IMAGES.houseSketch} afterSrc={DEMO_IMAGES.houseRender} title={landing.compareHouseTitle} subtitle={landing.compareHouseSubtitle}/>
            <ImageCompareCard beforeSrc={DEMO_IMAGES.bedSketch} afterSrc={DEMO_IMAGES.bedRender} title={landing.compareRoomTitle} subtitle={landing.compareRoomSubtitle}/>
          </div>

          <div className="vps-landing-card" style={S.processSection}>
            <div style={S.sectionEyebrow}>{extras.processEyebrow}</div>
            <div style={S.sectionTitle}>{extras.processTitle}</div>
            <div style={{...S.processGrid,gridTemplateColumns:isMobile?"1fr":"repeat(3,minmax(0,1fr))"}}>
              {extras.steps.map((step)=>(
                <div key={step[0]} style={S.processCard}>
                  <div style={S.processIconWrap}><Icon name={step[3]} size={20} color="#ff9800"/></div>
                  <div style={S.processNumber}>{step[0]}</div>
                  <div style={S.processTitle}>{step[1]}</div>
                  <div style={S.processText}>{step[2]}</div>
                </div>
              ))}
            </div>
          </div>



          <div className="vps-landing-card" style={S.benefitsSection}>
            <div style={S.sectionEyebrow}>BENEFITS</div>
            <div style={S.sectionTitle}>{extras.benefitTitle}</div>
            <div style={{...S.benefitsGrid,gridTemplateColumns:isMobile?"1fr":"repeat(2,minmax(0,1fr))"}}>
              {extras.benefits.map((b)=>(
                <div key={b[1]} style={S.benefitCard}>
                  <div style={S.benefitIcon}><Icon name={b[0]} size={20} color="#ff9800"/></div>
                  <div style={S.benefitTitle}>{b[1]}</div>
                  <div style={S.benefitText}>{b[2]}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="vps-pricing" className="vps-landing-card" style={S.pricingSection}>
            <div style={S.pricingHead}>
              <div>
                <div style={S.salesPill}><Icon name="pricing" size={14} color="#ff9800"/>{landing.pricingEyebrow}</div>
                <div style={S.pricingSectionTitle}>{landing.pricingTitle}</div>
              </div>
              <div style={S.currencyToggle}>
                <button className="vps-btn" style={{...S.currencyBtn,...(currency==="usd"?S.currencyBtnOn:{})}} onClick={()=>setCurrency("usd")}>{landing.currencyUsd}</button>
                <button className="vps-btn" style={{...S.currencyBtn,...(currency==="ars"?S.currencyBtnOn:{})}} onClick={()=>setCurrency("ars")}>{landing.currencyArs}</button>
              </div>
            </div>
            <div style={{...S.pricingGrid,gridTemplateColumns:isMobile?"1fr":"repeat(2,minmax(0,1fr))"}}>
              {packs.map((pack)=>(
                <div key={pack.id} className={`vps-card-hover vps-pricing-card ${pack.featured?"vps-premium-card":""}`} style={{...S.pricingCardDark,...(pack.featured?S.pricingFeaturedDark:{})}}>
                  <div className="vps-pricing-card-inner-shine"></div>
                  <div style={S.pricingTopGlow}></div>
                  {pack.featured&&<div style={S.pricingBadge}>{pack.eyebrow}</div>}
                  <div style={S.pricingEyebrowText}>{pack.eyebrow}</div>
                  <div style={S.pricingNameDark}>{pack.name}</div>
                  <div style={S.pricingPriceWrap}>
                    <div style={S.pricingCurrent}>{getDisplayedPrice(pack)}</div>
                    <div style={S.pricingOneTime}>/ único</div>
                  </div>
                  <div style={S.pricingOldLine}>{extras.oldPrefix} {getDisplayedOldPrice(pack)}</div>
                  <ul style={S.pricingList}>
                    {pack.features.map((item)=>(
                      <li key={item} style={S.pricingListItem}><span style={S.pricingCheck}>✓</span><span>{item}</span></li>
                    ))}
                  </ul>
                  <button className="vps-btn" style={pack.featured?{...S.btnPri,...S.pricingPremiumCta}:S.pricingButtonGhost} onClick={pack.cta==="access"?goToAccess:goToPacks}>
                    {pack.cta==="access"?landing.accessButton:landing.packButton}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="vps-landing-card" style={S.footerCtaBox}>
            <div style={S.footerCtaKicker}>{extras.closeKicker}</div>
            <div style={S.footerCtaTitle}><span>{extras.closeTitleA} </span><span style={S.salesTitleAccent}>{extras.closeTitleB}</span></div>
            <div style={S.footerCtaText}>{extras.closeSub}</div>
            <div style={S.footerPromiseRow}>
              {extras.closeBullets.map((item)=><span key={item} style={S.footerPromise}><Icon name="check" size={14} color="#ff9800"/>{item}</span>)}
            </div>
            <button className="vps-btn" style={{...S.btnPri,...S.heroMainBtn,marginTop:"22px"}} onClick={goToPacks}>{landing.heroPrimary}</button>
          </div>
        </div>
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
  pricingCardDark:{background:"radial-gradient(circle at 12% 0%,rgba(255,152,0,.08),transparent 32%),linear-gradient(180deg,#13151c 0%,#0d0f14 100%)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"14px",padding:"24px",display:"flex",flexDirection:"column",gap:"13px",boxShadow:"0 24px 64px rgba(0,0,0,0.36)",position:"relative",overflow:"visible"},
  pricingFeaturedDark:{border:"1.5px solid #ff9800",background:"radial-gradient(circle at 15% 0%,rgba(255,152,0,.18),transparent 36%),linear-gradient(180deg,#171922 0%,#0e1015 100%)",boxShadow:"0 24px 70px rgba(255,152,0,0.22), 0 18px 46px rgba(0,0,0,.38)"},
  pricingBadge:{position:"absolute",top:0,left:"50%",transform:"translate(-50%,-50%)",background:"#ff9800",color:"#111",padding:"6px 14px",borderRadius:"999px",fontSize:"10px",fontWeight:900,letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap",zIndex:10},
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

  catalogSection: {background:"linear-gradient(180deg,#15171d 0%,#0d0f14 100%)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"24px",boxShadow:"0 18px 46px rgba(0,0,0,0.22)"},
  catalogTabs: {display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap",margin:"18px 0 24px"},
  catalogTabBtn: {background:"rgba(255,255,255,0.04)",color:"#bfc3cb",border:"1px solid rgba(255,255,255,0.09)",padding:"10px 18px",fontSize:"12.5px",fontWeight:800,borderRadius:"999px",cursor:"pointer",fontFamily:BODY_FONT,transition:"all 0.25s ease"},
  catalogTabBtnOn: {background:"#ff9800",borderColor:"#ff9800",color:"#111111",boxShadow:"0 10px 24px rgba(255,152,0,0.18)"},
  catalogGrid: {display:"grid",gap:"16px",marginTop:"18px"},
  catalogCard: {background:"radial-gradient(circle at 12% 0%,rgba(255,152,0,0.04),transparent 30%),linear-gradient(180deg,#16181f 0%,#101217 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"13px",padding:"20px",boxShadow:"0 12px 28px rgba(0,0,0,0.18)",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:"140px",transition:"border-color 0.3s ease"},
  catalogCardHover: {borderColor:"rgba(255,152,0,0.4)"},
  catalogCardTop: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px"},
  catalogCardCode: {fontFamily:MONO_FONT,fontSize:"10px",fontWeight:900,color:"#ff9800",background:"rgba(255,152,0,0.08)",border:"1px solid rgba(255,152,0,0.25)",borderRadius:"4px",padding:"3px 6px",letterSpacing:"0.05em"},
  catalogCardTitle: {fontFamily:DISPLAY_FONT,fontSize:"18.5px",lineHeight:1.1,color:"#ffffff",marginTop:"4px"},
  catalogCardDesc: {fontSize:"12.5px",lineHeight:1.55,color:"#bfc3cb",margin:"8px 0 14px"},
  catalogCopyBtn: {background:"rgba(255,152,0,0.08)",color:"#ffb65e",border:"1px solid rgba(255,152,0,0.22)",padding:"8px 12px",fontSize:"11px",fontWeight:800,borderRadius:"8px",cursor:"pointer",fontFamily:BODY_FONT,display:"flex",alignItems:"center",gap:"6px",width:"fit-content",transition:"all 0.25s ease"},
  catalogCopyBtnOn: {background:"#ff9800",borderColor:"#ff9800",color:"#111111"}
};
