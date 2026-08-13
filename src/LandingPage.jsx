
import { useEffect, useState } from "react";


const promptBuilderUrl = "https://fanciful-duckanoo-21065b.netlify.app/app#/prompt-builder";


const prices = {
  starter: { USD: ["USD 17", "USD 24"], ARS: ["$33.000", "$46.000"] },
  professional: { USD: ["USD 39", "USD 55"], ARS: ["$57.000", "$80.000"] },
  studio: { USD: ["USD 69", "USD 89"], ARS: ["$93.000", "$130.000"] },
} ;

const copy = {
  es: {
    nav: ["Resultados", "El sistema", "Qué recibís", "Packs", "Preguntas"],
    login: "Acceso clientes",
    topbar: ["Producto digital", "Guías ES / EN / PT", "Uso profesional"],
    eyebrow: "PROMPTS PROFESIONALES PARA ARQUITECTURA",
    h1a: "La IA puede mejorar tu render.",
    h1b: "No debería rediseñar tu proyecto.",
    lead: "Visual Prompt Studio convierte decisiones de arquitectura en prompts precisos para lograr imágenes más consistentes, proteger la geometría y reducir la prueba y error.",
    heroCta: "Ver packs",
    heroProof: "Ver resultados",
    heroNote: "Pago único · Entrega digital · Archivos de acceso permanente",
    source: "MODELO ORIGINAL",
    result: "RESULTADO DIRIGIDO",
    hoverHint: "Mantené el cursor para ver el modelo original",
    locked: "Geometría protegida",
    camera: "Cámara bloqueada",
    prompt: "Prompt estructurado",
    proofLabels: [["56", "prompts arquitectónicos"], ["40", "prompts de humanización adicionales"], ["15", "prompts de vehículos con lógica de ubicación"], ["10", "prompts de efectos ópticos y de cámara"]],
    problemKicker: "EL COSTO OCULTO DE UN PROMPT GENÉRICO",
    problemTitle: "Cuando la instrucción es ambigua, la IA completa el proyecto por su cuenta.",
    problemText: "El problema no es escribir más. Es separar con claridad qué puede cambiar, qué debe conservarse y cómo querés dirigir el resultado.",
    generic: "PROMPT GENÉRICO",
    vps: "MÉTODO VPS",
    genericItems: ["Resultados impredecibles", "Pueden modificar la arquitectura", "Requieren prueba y error", "Instrucciones poco estructuradas", "Difíciles de corregir", "Resultados aislados"],
    vpsItems: ["Mayor control y consistencia", "Preserva geometría, cámara y diseño", "Flujos optimizados que ahorran tiempo", "Sistemas CORE, LOCK y RESCUE", "Protocolos para detectar y resolver errores", "Metodología profesional y repetible"],
    resultsKicker: "LA DIFERENCIA SE VE",
    resultsTitle: "Más realismo, sin perder la lectura del proyecto.",
    resultsText: "Deslizá para comparar el modelo de partida con el resultado dirigido.",
    exterior: "Exterior residencial · preservación de geometría",
    interior: "Interior · luz, materialidad y atmósfera",
    detailExterior: "Humanización + vehículo · inserción controlada",
    detailInterior: "Efecto de cámara · encuadre y profundidad",
    before: "ANTES",
    after: "DESPUÉS",
    systemKicker: "UN SISTEMA, NO UN PROMPT SUELTO",
    systemTitle: "Cada resultado empieza con una secuencia de decisiones controlables.",
    systemText: "VPS organiza el trabajo en capas para que puedas adaptar un prompt sin reconstruirlo desde cero.",
    layers: [
      ["01", "Objetivo", "Definí qué transformación necesitás y para qué tipo de imagen."],
      ["02", "Preservación", "Bloqueá geometría, cámara, composición y elementos críticos."],
      ["03", "Dirección visual", "Elegí materiales, luz, clima, atmósfera y lenguaje fotográfico."],
      ["04", "Salida", "Copiá un prompt maestro en inglés, ordenado y listo para generar."],
    ],
    demoKicker: "PROBÁ LA LÓGICA DEL CONSTRUCTOR",
    demoTitle: "No empezás desde una página en blanco.",
    demoText: "Conocé la nueva interfaz del Prompt Builder. Studio Pro convierte decisiones visuales en un flujo más rápido, organizado y repetible.",
    demoLabel: "Objetivo de visualización",
    demoOptions: ["Fotorrealismo", "Preservación total", "Atmósfera editorial"],
    demoCopy: "Copiar fragmento",
    demoCopied: "Fragmento copiado",
    demoDisclaimer: "Vista de la nueva versión. El constructor completo incluye variables, proyectos y favoritos.",
    includesKicker: "MIRÁ EXACTAMENTE QUÉ COMPRÁS",
    includesTitle: "Archivos y herramientas pensados para trabajar, consultar y volver a usar.",
    deliverables: [
      ["CORE", "Biblioteca esencial con 11 prompts arquitectónicos para iniciar el flujo.", "11"],
      ["PROFESSIONAL PROMPTS", "45 flujos avanzados clasificados por objetivo y tipología.", "45"],
      ["HUMANIZATION", "Biblioteca principal con 30 prompts de humanización controlada.", "30"],
      ["HUMANIZATION_EXTENSION", "10 prompts adicionales para ampliar escenas y usos.", "+10"],
      ["VEHICULE", "15 prompts de inserción vehicular con lógica de ubicación y contacto.", "15"],
      ["CAMERA_EFFECT", "Efectos ópticos y de cámara para ampliar la narrativa visual.", "FX"],
      ["LOCK + RESCUE", "Método de preservación y protocolo para detectar y corregir errores.", "PDF"],
      ["CLIENT KIT + FORMS", "Kit profesional y formularios editables de control y entrega.", "KIT"],
      ["PROMPT BUILDER APP", "Constructor visual con proyectos, favoritos y 12 meses de acceso.", "APP"],
    ],
    categoriesLabel: "Categorías incluidas",
    categories: ["Fotorrealismo", "Interiores", "Fachadas", "Paisajismo", "Plantas", "Axonométricas", "Cortes", "Masterplans", "Urbanismo", "Humanización"],
    audienceKicker: "DISEÑADO PARA FLUJOS REALES",
    audienceTitle: "Una biblioteca que acompaña en el diseño de un proyecto.",
    audiences: [
      ["Arquitectos", "Para preservar decisiones de diseño mientras mejora la comunicación visual."],
      ["Visualizadores", "Para estandarizar prompts, variantes y criterios entre imágenes."],
      ["Estudios", "Para construir un lenguaje común y reducir resultados inconsistentes."],
    ],
    tools: "Pensado para flujos con ChatGPT Images, Midjourney, Krea y modelos compatibles con prompts de texto. La respuesta puede variar según cada plataforma y versión.",
    packsKicker: "ELEGÍ TU NIVEL DE CONTROL",
    packsTitle: "Empezá con una base o incorporá el sistema completo.",
    save: "Hasta 29% de ahorro",
    currency: { USD: "Pago internacional en USD", ARS: "Pago local en pesos argentinos" },
    labels: { starter: "BASE ESENCIAL", professional: "RECOMENDADO", studio: "EXPERIENCIA COMPLETA" },
    descriptions: {
      starter: "Para comenzar a estructurar prompts sin improvisar.",
      professional: "La biblioteca completa para uso profesional frecuente.",
      studio: "La biblioteca profesional más el constructor visual.",
    },
    features: {
      starter: ["CORE — 11 prompts esenciales", "Manual de inicio y ruta de uso", "RESCUE — versión rápida", "Licencia de uso profesional"],
      professional: ["CORE 11 + Professional Prompts 45", "Humanization Library — 30 prompts", "Método LOCK + RESCUE completo", "Client Kit, formularios, manual y matriz", "Licencia de uso profesional"],
      studio: ["Todo Professional Library", "Humanization Extension — 10 prompts", "Vehicle Insertion — 15 prompts", "Architectural Camera Effects", "Prompt Builder App — 12 meses"],
    },
    choose: { starter: "Comprar Starter", professional: "Elegir Professional Library", studio: "Acceder a Studio Pro" },
    oneTime: "Pago único",
    studioTerm: "Pago único · 12 meses de app",
    confidence: [["ENTREGA", "Acceso digital por email"], ["LICENCIA", "Uso en tus proyectos y trabajos para clientes"], ["ARCHIVOS", "Acceso permanente a las descargas"], ["PAGO", "Procesado por proveedores externos"]],
    matrixTitle: "Comparación rápida",
    rescueLevels: ["Versión rápida", "Versión completa", "Versión completa"],
    matrixRows: ["Biblioteca CORE — 11 prompts esenciales", "Professional Prompts — 45 flujos avanzados", "Humanization Library — 30 prompts", "Humanization Extension — 10 prompts adicionales", "Vehicle Insertion — 15 prompts", "Architectural Camera Effects — 10 prompts", "Manual de inicio y ruta de uso", "Manual de usuario profesional", "Matriz de selección de prompts", "Método LOCK para preservar la arquitectura", "Manual RESCUE para corregir resultados", "Professional Client Kit", "Formularios editables de control y entrega", "Acceso a Prompt Builder App durante 12 meses", "Licencia de uso profesional", "Total de prompts operativos"],
    authorKicker: "CREADO DESDE LA PRÁCTICA",
    authorTitle: "Hecho por un arquitecto para resolver un problema de arquitectura.",
    authorText: "Visual Prompt Studio fue desarrollado desde la práctica profesional para aprovechar la potencia visual de la IA sin ceder el control del proyecto. El sistema traduce decisiones arquitectónicas —preservación, materialidad, luz, cámara y atmósfera— en una estructura que la IA puede interpretar mejor.",
    authorRole: "SISTEMA PROFESIONAL PARA ARQUITECTURA",
    faqKicker: "ANTES DE ELEGIR",
    faqTitle: "Respuestas claras, sin letra chica.",
    faqs: [
      ["¿Qué es Visual Prompt Studio?", "Un sistema profesional de prompts y métodos para crear imágenes arquitectónicas con IA."],
      ["¿Necesito experiencia con IA?", "No. Los packs incluyen una ruta de uso clara y progresiva."],
      ["¿VPS genera las imágenes?", "No. VPS proporciona prompts, métodos y herramientas para trabajar con plataformas de IA."],
      ["¿Con qué herramientas funciona?", "La estructura está pensada para ChatGPT Images, Midjourney, Krea y modelos compatibles con prompts de texto. Cada plataforma puede interpretar la misma instrucción de forma diferente según su versión."],
      ["¿Necesito pagar otra plataforma?", "Sí, necesitás tu propia cuenta en la herramienta de IA que uses. VPS no incluye suscripciones de terceros."],
      ["¿Qué pasa después de los 12 meses de Studio Pro?", "Los archivos que descargaste siguen siendo tuyos. Para continuar usando el constructor y recibir nuevas actualizaciones necesitás renovar el acceso."],
      ["¿Cómo recibo el producto?", "Después del pago recibís por email el acceso correspondiente. Los packs incluyen archivos descargables; Studio Pro suma el acceso al constructor."],
      ["¿Puedo usarlo con trabajos para clientes?", "Sí. Podés aplicar los prompts en tus propios proyectos profesionales. Los archivos y textos de VPS no pueden revenderse, compartirse ni redistribuirse."],
    ],
    closingKicker: "MENOS PRUEBA Y ERROR. MÁS DIRECCIÓN.",
    closingTitle: "Tu arquitectura ya está decidida. Ahora decidí cómo querés que la IA la comunique.",
    closingText: "Elegí el pack que mejor se adapta a tu flujo y empezá a construir prompts con un criterio profesional.",
    closingCta: "Comprar packs",
    footer: "Sistema profesional de prompts para visualización arquitectónica con IA.",
    footerPrivacy: "Los pagos son procesados por proveedores externos. VPS no almacena los datos de tu tarjeta.",
    footerTerms: "Producto digital · Licencia de uso profesional · No permite redistribución",
    mobileCta: "Ver packs",
  },
  en: {
    nav: ["Results", "The system", "What you get", "Packs", "Questions"],
    login: "Client access",
    topbar: ["Digital product", "ES / EN / PT guides", "Professional use"],
    eyebrow: "PROFESSIONAL PROMPTS FOR ARCHITECTURE",
    h1a: "AI can improve your render.",
    h1b: "It should not redesign your project.",
    lead: "Visual Prompt Studio turns architectural decisions into precise prompts to create more consistent images, protect geometry and reduce trial and error.",
    heroCta: "See packs",
    heroProof: "See results",
    heroNote: "One-time payment · Digital delivery · Permanent file access",
    source: "ORIGINAL MODEL",
    result: "DIRECTED RESULT",
    hoverHint: "Keep the pointer over the image to see the original model",
    locked: "Protected geometry",
    camera: "Locked camera",
    prompt: "Structured prompt",
    proofLabels: [["56", "architectural prompts"], ["40", "additional humanization prompts"], ["15", "vehicle prompts with placement logic"], ["10", "optical and camera-effect prompts"]],
    problemKicker: "THE HIDDEN COST OF A GENERIC PROMPT",
    problemTitle: "When instructions are ambiguous, AI completes the project on its own.",
    problemText: "The answer is not writing more. It is clearly separating what may change, what must remain and how the result should be directed.",
    generic: "GENERIC PROMPT",
    vps: "VPS METHOD",
    genericItems: ["Unpredictable results", "May alter the architecture", "Require trial and error", "Poorly structured instructions", "Difficult to correct", "Isolated results"],
    vpsItems: ["Greater control and consistency", "Preserves geometry, camera and design", "Optimized workflows that save time", "CORE, LOCK and RESCUE systems", "Protocols to detect and resolve errors", "Professional, repeatable methodology"],
    resultsKicker: "THE DIFFERENCE IS VISIBLE",
    resultsTitle: "More realism without losing the project.",
    resultsText: "Slide to compare the starting model with the directed result.",
    exterior: "Residential exterior · geometry preservation",
    interior: "Interior · light, materials and atmosphere",
    detailExterior: "Humanization + vehicle · controlled insertion",
    detailInterior: "Camera effect · framing and depth",
    before: "BEFORE",
    after: "AFTER",
    systemKicker: "A SYSTEM, NOT A LOOSE PROMPT",
    systemTitle: "Every result starts with a sequence of controllable decisions.",
    systemText: "VPS organizes work in layers so you can adapt a prompt without rebuilding it from scratch.",
    layers: [
      ["01", "Goal", "Define the transformation and the type of image you need."],
      ["02", "Preservation", "Lock geometry, camera, composition and critical elements."],
      ["03", "Visual direction", "Choose materials, light, weather, atmosphere and photographic language."],
      ["04", "Output", "Copy a structured English master prompt ready to generate."],
    ],
    demoKicker: "TRY THE BUILDER LOGIC",
    demoTitle: "You never start from a blank page.",
    demoText: "Explore the new Prompt Builder interface. Studio Pro turns visual decisions into a faster, organized and repeatable workflow.",
    demoLabel: "Visualization goal",
    demoOptions: ["Photorealism", "Total preservation", "Editorial atmosphere"],
    demoCopy: "Copy excerpt",
    demoCopied: "Excerpt copied",
    demoDisclaimer: "New-version preview. The complete builder includes variables, projects and favorites.",
    includesKicker: "SEE EXACTLY WHAT YOU BUY",
    includesTitle: "Files and tools designed to work, consult and reuse.",
    deliverables: [
      ["CORE", "Essential library with 11 architectural prompts to start the workflow.", "11"],
      ["PROFESSIONAL PROMPTS", "45 advanced workflows classified by goal and typology.", "45"],
      ["HUMANIZATION", "Main library with 30 controlled humanization prompts.", "30"],
      ["HUMANIZATION_EXTENSION", "10 additional prompts to expand scenes and use cases.", "+10"],
      ["VEHICULE", "15 vehicle-insertion prompts with placement and contact logic.", "15"],
      ["CAMERA_EFFECT", "Optical and camera effects that expand visual storytelling.", "FX"],
      ["LOCK + RESCUE", "Preservation method and protocol to detect and correct errors.", "PDF"],
      ["CLIENT KIT + FORMS", "Professional kit and editable control and delivery forms.", "KIT"],
      ["PROMPT BUILDER APP", "Visual builder with projects, favorites and 12 months of access.", "APP"],
    ],
    categoriesLabel: "Included categories",
    categories: ["Photorealism", "Interiors", "Facades", "Landscape", "Plans", "Axonometrics", "Sections", "Masterplans", "Urbanism", "Humanization"],
    audienceKicker: "DESIGNED FOR REAL WORKFLOWS",
    audienceTitle: "A library that supports the design of a project.",
    audiences: [
      ["Architects", "Preserve design decisions while improving visual communication."],
      ["Visualizers", "Standardize prompts, variants and criteria across images."],
      ["Studios", "Build a shared language and reduce inconsistent results."],
    ],
    tools: "Designed for workflows with ChatGPT Images, Midjourney, Krea and text-prompt compatible models. Responses may vary by platform and version.",
    packsKicker: "CHOOSE YOUR LEVEL OF CONTROL",
    packsTitle: "Start with the essentials or add the complete system.",
    save: "Save up to 29%",
    currency: { USD: "International payment in USD", ARS: "Local payment in Argentine pesos" },
    labels: { starter: "ESSENTIAL BASE", professional: "RECOMMENDED", studio: "COMPLETE EXPERIENCE" },
    descriptions: {
      starter: "Start structuring prompts without improvising.",
      professional: "The complete library for frequent professional use.",
      studio: "The professional library plus the visual builder.",
    },
    features: {
      starter: ["CORE — 11 essential prompts", "Start manual and usage route", "RESCUE — quick version", "Professional-use license"],
      professional: ["CORE 11 + Professional Prompts 45", "Humanization Library — 30 prompts", "LOCK Method + complete RESCUE", "Client Kit, forms, manual and matrix", "Professional-use license"],
      studio: ["Everything in Professional Library", "Humanization Extension — 10 prompts", "Vehicle Insertion — 15 prompts", "Architectural Camera Effects", "Prompt Builder App — 12 months"],
    },
    choose: { starter: "Buy Starter", professional: "Choose Professional Library", studio: "Access Studio Pro" },
    oneTime: "One-time payment",
    studioTerm: "One-time payment · 12 months of app",
    confidence: [["DELIVERY", "Digital access by email"], ["LICENSE", "Use in your projects and client work"], ["FILES", "Permanent access to downloads"], ["PAYMENT", "Processed by external providers"]],
    matrixTitle: "Quick comparison",
    rescueLevels: ["Quick version", "Complete version", "Complete version"],
    matrixRows: ["CORE Library — 11 essential prompts", "Professional Prompts — 45 advanced workflows", "Humanization Library — 30 prompts", "Humanization Extension — 10 additional prompts", "Vehicle Insertion — 15 prompts", "Architectural Camera Effects — 10 prompts", "Start manual and usage route", "Professional user manual", "Prompt-selection matrix", "LOCK Method for architecture preservation", "RESCUE Manual for correcting results", "Professional Client Kit", "Editable control and delivery forms", "12-month Prompt Builder App access", "Professional-use license", "Total operational prompts"],
    authorKicker: "BUILT FROM PRACTICE",
    authorTitle: "Made by an architect to solve an architectural problem.",
    authorText: "Visual Prompt Studio was developed through professional practice to use AI's visual power without giving up project control. The system translates architectural decisions — preservation, materials, light, camera and atmosphere — into a structure AI can interpret more clearly.",
    authorRole: "PROFESSIONAL SYSTEM FOR ARCHITECTURE",
    faqKicker: "BEFORE YOU CHOOSE",
    faqTitle: "Clear answers, no fine print.",
    faqs: [
      ["What is Visual Prompt Studio?", "A professional system of prompts and methods for creating architectural images with AI."],
      ["Do I need AI experience?", "No. The packs include a clear, progressive usage path."],
      ["Does VPS generate the images?", "No. VPS provides prompts, methods and tools for working with AI platforms."],
      ["Which tools does it work with?", "The structure is designed for ChatGPT Images, Midjourney, Krea and text-prompt compatible models. Each platform may interpret the same instruction differently depending on its version."],
      ["Do I need another paid platform?", "Yes, you need your own account with the AI tool you use. VPS does not include third-party subscriptions."],
      ["What happens after 12 months of Studio Pro?", "Downloaded files remain yours. You need to renew access to keep using the builder and receive new updates."],
      ["How do I receive the product?", "After payment, you receive the relevant access by email. Packs include downloadable files; Studio Pro adds builder access."],
      ["Can I use it for client work?", "Yes. You may apply the prompts to your own professional projects. VPS files and texts may not be resold, shared or redistributed."],
    ],
    closingKicker: "LESS TRIAL AND ERROR. MORE DIRECTION.",
    closingTitle: "Your architecture is already decided. Now decide how AI should communicate it.",
    closingText: "Choose the pack that fits your workflow and start building prompts with professional criteria.",
    closingCta: "Buy packs",
    footer: "Professional prompt system for AI architectural visualization.",
    footerPrivacy: "Payments are processed by external providers. VPS does not store your card details.",
    footerTerms: "Digital product · Professional-use license · Redistribution prohibited",
    mobileCta: "See packs",
  },
  pt: {
    nav: ["Resultados", "O sistema", "O que inclui", "Pacotes", "Perguntas"],
    login: "Acesso clientes",
    topbar: ["Produto digital", "Guias ES / EN / PT", "Uso profissional"],
    eyebrow: "PROMPTS PROFISSIONAIS PARA ARQUITETURA",
    h1a: "A IA pode melhorar seu render.",
    h1b: "Ela não deveria redesenhar seu projeto.",
    lead: "O Visual Prompt Studio transforma decisões de arquitetura em prompts precisos para criar imagens mais consistentes, proteger a geometria e reduzir tentativas e erros.",
    heroCta: "Ver pacotes",
    heroProof: "Ver resultados",
    heroNote: "Pagamento único · Entrega digital · Acesso permanente aos arquivos",
    source: "MODELO ORIGINAL",
    result: "RESULTADO DIRIGIDO",
    hoverHint: "Mantenha o cursor sobre a imagem para ver o modelo original",
    locked: "Geometria protegida",
    camera: "Câmera bloqueada",
    prompt: "Prompt estruturado",
    proofLabels: [["56", "prompts arquitetônicos"], ["40", "prompts adicionais de humanização"], ["15", "prompts de veículos com lógica de posicionamento"], ["10", "prompts de efeitos ópticos e de câmera"]],
    problemKicker: "O CUSTO OCULTO DE UM PROMPT GENÉRICO",
    problemTitle: "Quando a instrução é ambígua, a IA completa o projeto por conta própria.",
    problemText: "A solução não é escrever mais. É separar com clareza o que pode mudar, o que deve permanecer e como o resultado deve ser dirigido.",
    generic: "PROMPT GENÉRICO",
    vps: "MÉTODO VPS",
    genericItems: ["Resultados imprevisíveis", "Podem modificar a arquitetura", "Exigem tentativa e erro", "Instruções pouco estruturadas", "Difíceis de corrigir", "Resultados isolados"],
    vpsItems: ["Maior controle e consistência", "Preserva geometria, câmera e design", "Fluxos otimizados que economizam tempo", "Sistemas CORE, LOCK e RESCUE", "Protocolos para detectar e resolver erros", "Metodologia profissional e repetível"],
    resultsKicker: "A DIFERENÇA É VISÍVEL",
    resultsTitle: "Mais realismo sem perder a leitura do projeto.",
    resultsText: "Deslize para comparar o modelo inicial com o resultado dirigido.",
    exterior: "Exterior residencial · preservação da geometria",
    interior: "Interior · luz, materiais e atmosfera",
    detailExterior: "Humanização + veículo · inserção controlada",
    detailInterior: "Efeito de câmera · enquadramento e profundidade",
    before: "ANTES",
    after: "DEPOIS",
    systemKicker: "UM SISTEMA, NÃO UM PROMPT SOLTO",
    systemTitle: "Cada resultado começa com uma sequência de decisões controláveis.",
    systemText: "O VPS organiza o trabalho em camadas para adaptar um prompt sem reconstruí-lo do zero.",
    layers: [
      ["01", "Objetivo", "Defina a transformação e o tipo de imagem que precisa."],
      ["02", "Preservação", "Bloqueie geometria, câmera, composição e elementos críticos."],
      ["03", "Direção visual", "Escolha materiais, luz, clima, atmosfera e linguagem fotográfica."],
      ["04", "Saída", "Copie um prompt mestre em inglês, estruturado e pronto para gerar."],
    ],
    demoKicker: "TESTE A LÓGICA DO CONSTRUTOR",
    demoTitle: "Você nunca começa de uma página em branco.",
    demoText: "Conheça a nova interface do Prompt Builder. O Studio Pro transforma decisões visuais em um fluxo mais rápido, organizado e repetível.",
    demoLabel: "Objetivo da visualização",
    demoOptions: ["Fotorrealismo", "Preservação total", "Atmosfera editorial"],
    demoCopy: "Copiar trecho",
    demoCopied: "Trecho copiado",
    demoDisclaimer: "Vista da nova versão. O construtor completo inclui variáveis, projetos e favoritos.",
    includesKicker: "VEJA EXATAMENTE O QUE VOCÊ COMPRA",
    includesTitle: "Arquivos e ferramentas pensados para trabalhar, consultar e reutilizar.",
    deliverables: [
      ["CORE", "Biblioteca essencial com 11 prompts arquitetônicos para iniciar o fluxo.", "11"],
      ["PROFESSIONAL PROMPTS", "45 fluxos avançados classificados por objetivo e tipologia.", "45"],
      ["HUMANIZATION", "Biblioteca principal com 30 prompts de humanização controlada.", "30"],
      ["HUMANIZATION_EXTENSION", "10 prompts adicionais para ampliar cenas e usos.", "+10"],
      ["VEHICULE", "15 prompts de inserção veicular com lógica de posição e contato.", "15"],
      ["CAMERA_EFFECT", "Efeitos ópticos e de câmera para ampliar a narrativa visual.", "FX"],
      ["LOCK + RESCUE", "Método de preservação e protocolo para detectar e corrigir erros.", "PDF"],
      ["CLIENT KIT + FORMS", "Kit profissional e formulários editáveis de controle e entrega.", "KIT"],
      ["PROMPT BUILDER APP", "Construtor visual com projetos, favoritos e 12 meses de acesso.", "APP"],
    ],
    categoriesLabel: "Categorias incluídas",
    categories: ["Fotorrealismo", "Interiores", "Fachadas", "Paisagismo", "Plantas", "Axonométricas", "Cortes", "Masterplans", "Urbanismo", "Humanização"],
    audienceKicker: "DESENHADO PARA FLUXOS REAIS",
    audienceTitle: "Uma biblioteca que acompanha o design de um projeto.",
    audiences: [
      ["Arquitetos", "Preserve decisões de projeto enquanto melhora a comunicação visual."],
      ["Visualizadores", "Padronize prompts, variações e critérios entre imagens."],
      ["Estúdios", "Construa uma linguagem comum e reduza resultados inconsistentes."],
    ],
    tools: "Pensado para fluxos com ChatGPT Images, Midjourney, Krea e modelos compatíveis com prompts de texto. A resposta pode variar conforme a plataforma e a versão.",
    packsKicker: "ESCOLHA SEU NÍVEL DE CONTROLE",
    packsTitle: "Comece com a base ou incorpore o sistema completo.",
    save: "Economize até 29%",
    currency: { USD: "Pagamento internacional em USD", ARS: "Pagamento local em pesos argentinos" },
    labels: { starter: "BASE ESSENCIAL", professional: "RECOMENDADO", studio: "EXPERIÊNCIA COMPLETA" },
    descriptions: {
      starter: "Comece a estruturar prompts sem improvisar.",
      professional: "A biblioteca completa para uso profissional frequente.",
      studio: "A biblioteca profissional mais o construtor visual.",
    },
    features: {
      starter: ["CORE — 11 prompts essenciais", "Manual de início e rota de uso", "RESCUE — versão rápida", "Licença de uso profissional"],
      professional: ["CORE 11 + Professional Prompts 45", "Humanization Library — 30 prompts", "Método LOCK + RESCUE completo", "Client Kit, formulários, manual e matriz", "Licença de uso profissional"],
      studio: ["Tudo da Professional Library", "Humanization Extension — 10 prompts", "Vehicle Insertion — 15 prompts", "Architectural Camera Effects", "Prompt Builder App — 12 meses"],
    },
    choose: { starter: "Comprar Starter", professional: "Escolher Professional Library", studio: "Acessar Studio Pro" },
    oneTime: "Pagamento único",
    studioTerm: "Pagamento único · 12 meses de app",
    confidence: [["ENTREGA", "Acesso digital por e-mail"], ["LICENÇA", "Uso em seus projetos e trabalhos para clientes"], ["ARQUIVOS", "Acesso permanente aos downloads"], ["PAGAMENTO", "Processado por provedores externos"]],
    matrixTitle: "Comparação rápida",
    rescueLevels: ["Versão rápida", "Versão completa", "Versão completa"],
    matrixRows: ["Biblioteca CORE — 11 prompts essenciais", "Professional Prompts — 45 fluxos avançados", "Humanization Library — 30 prompts", "Humanization Extension — 10 prompts adicionais", "Vehicle Insertion — 15 prompts", "Architectural Camera Effects — 10 prompts", "Manual de início e rota de uso", "Manual profissional do usuário", "Matriz de seleção de prompts", "Método LOCK para preservar a arquitetura", "Manual RESCUE para corrigir resultados", "Professional Client Kit", "Formulários editáveis de controle e entrega", "Acesso ao Prompt Builder App por 12 meses", "Licença de uso profissional", "Total de prompts operacionais"],
    authorKicker: "CRIADO A PARTIR DA PRÁTICA",
    authorTitle: "Feito por um arquiteto para resolver um problema de arquitetura.",
    authorText: "O Visual Prompt Studio foi desenvolvido a partir da prática profissional para usar o poder visual da IA sem abrir mão do controle do projeto. O sistema traduz decisões arquitetônicas — preservação, materiais, luz, câmera e atmosfera — em uma estrutura que a IA pode interpretar melhor.",
    authorRole: "SISTEMA PROFISSIONAL PARA ARQUITETURA",
    faqKicker: "ANTES DE ESCOLHER",
    faqTitle: "Respostas claras, sem letras pequenas.",
    faqs: [
      ["O que é o Visual Prompt Studio?", "Um sistema profissional de prompts e métodos para criar imagens arquitetônicas com IA."],
      ["Preciso ter experiência com IA?", "Não. Os pacotes incluem uma rota de uso clara e progressiva."],
      ["O VPS gera as imagens?", "Não. O VPS fornece prompts, métodos e ferramentas para trabalhar com plataformas de IA."],
      ["Com quais ferramentas funciona?", "A estrutura foi pensada para ChatGPT Images, Midjourney, Krea e modelos compatíveis com prompts de texto. Cada plataforma pode interpretar a mesma instrução de forma diferente conforme sua versão."],
      ["Preciso pagar outra plataforma?", "Sim, você precisa de sua própria conta na ferramenta de IA utilizada. O VPS não inclui assinaturas de terceiros."],
      ["O que acontece após 12 meses de Studio Pro?", "Os arquivos baixados continuam seus. Para continuar usando o construtor e receber novas atualizações é necessário renovar o acesso."],
      ["Como recebo o produto?", "Após o pagamento, você recebe o acesso correspondente por e-mail. Os pacotes incluem arquivos para download; o Studio Pro adiciona acesso ao construtor."],
      ["Posso usar em trabalhos para clientes?", "Sim. Você pode aplicar os prompts em seus próprios projetos profissionais. Os arquivos e textos do VPS não podem ser revendidos, compartilhados ou redistribuídos."],
    ],
    closingKicker: "MENOS TENTATIVA E ERRO. MAIS DIREÇÃO.",
    closingTitle: "Sua arquitetura já está decidida. Agora decida como a IA deve comunicá-la.",
    closingText: "Escolha o pacote ideal para seu fluxo e comece a construir prompts com critério profissional.",
    closingCta: "Comprar pacotes",
    footer: "Sistema profissional de prompts para visualização arquitetônica com IA.",
    footerPrivacy: "Os pagamentos são processados por provedores externos. O VPS não armazena os dados do seu cartão.",
    footerTerms: "Produto digital · Licença de uso profissional · Redistribuição proibida",
    mobileCta: "Ver pacotes",
  },
} ;

const matrix = [
  ["✓", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "—", "✓"],
  ["—", "—", "✓"],
  ["—", "—", "✓"],
  ["✓", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "✓", "✓"],
  ["", "", ""],
  ["—", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "—", "✓"],
  ["✓", "✓", "✓"],
  ["11", "72", "127"],
];

const highlightedMatrixRows = new Set([0, 1, 2, 3, 4, 5, 13, 15]);

function track(event, data = {}) {
  if (typeof window === "undefined") return;
  const browserWindow = window;
  browserWindow.dataLayer ||= [];
  browserWindow.dataLayer.push({ event, ...data });
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Visual Prompt Studio">
      <img className="logoMark" src="/assets/isotipo.png" alt="" width={320} height={216}  aria-hidden="true" />
      <span>VISUAL<br/>PROMPT <b>STUDIO</b></span>
    </a>
  );
}

function Compare({
  before,
  after,
  label,
  beforeLabel,
  afterLabel,
}) {
  const [value, setValue] = useState(50);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setValue(percent);
  };
  return (
    <figure className="compareCard">
      <div 
        className="compareMedia"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setValue(50)}
      >
        <img src={after} alt={`${label}: ${afterLabel.toLowerCase()}`} style={{width:"100%", height:"100%", objectFit:"cover"}}   />
        <div className="beforeLayer" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <img src={before} alt={`${label}: ${beforeLabel.toLowerCase()}`} style={{width:"100%", height:"100%", objectFit:"cover"}}   />
        </div>
        <span className="compareTag left">{beforeLabel}</span>
        <span className="compareTag right">{afterLabel}</span>
        <span className="compareLine" style={{ left: `${value}%` }} aria-hidden="true"><i>↔</i></span>
      </div>
      <figcaption><span>{label}</span><b>HOVER</b></figcaption>
    </figure>
  );
}

function PackCard({
  onBuyPack,
  id,
  currency,
  t
}) {
  const price = prices[id][currency];
  const featured = id === "professional";
  const title = id === "professional" ? "Professional Library" : id === "studio" ? "Studio Pro" : "Starter";

  return (
    <article className={`packCard ${featured ? "featured" : ""}`}>
      <div className="packHead">
        <span>{t.labels[id]}</span>
        {featured && <i aria-label={t.labels.professional}>●</i>}
      </div>
      <h3>{title}</h3>
      <p className="packDescription">{t.descriptions[id]}</p>
      <div className="price"><strong>{price[0]}</strong><del>{price[1]}</del></div>
      <small>{id === "studio" ? t.studioTerm : t.oneTime}</small>
      <ul>{t.features[id].map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
      <a
        className={`button ${featured ? "primary" : "secondary"}`}
        onClick={(e) => {
        e.preventDefault();
        onBuyPack(id);
        track("select_pack", { pack: id, currency });
        track("begin_checkout", { pack: id, currency });
      }}
        target="_blank"
        rel="noreferrer"
        
      >
        {t.choose[id]} <span>↗</span>
      </a>
    </article>
  );
}

import "./landing.css";
import PaymentModal from "./PaymentModal";

export default function LandingPage() {
  const [activePack, setActivePack] = useState(null);
  const handleBuyPack = (packId) => {
    // Map internal id to the object format expected by PaymentModal
    const pricesObj = prices[packId];
    const packObj = {
      slug: packId === "studio" ? "studio_pro" : packId,
      name: packId === "studio" ? "Studio Pro" : packId === "professional" ? "Professional Library" : "Starter",
      eyebrow: copy[lang].labels[packId],
      currentUsd: pricesObj.USD[0],
      oldUsd: pricesObj.USD[1],
      currentArs: pricesObj.ARS[0],
      oldArs: pricesObj.ARS[1],
      features: copy[lang].features[packId]
    };
    setActivePack(packObj);
  };

  const [lang, setLang] = useState("es");
  const [currency, setCurrency] = useState("USD");
  const [menu, setMenu] = useState(false);
  const t = copy[lang] ;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const navIds = ["results", "system", "includes", "packs", "faq"];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <main id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="announcement">
        {t.topbar.map((item, index) => <span key={item}><b>{index === 0 ? "●" : "—"}</b>{item}</span>)}
      </div>

      <header className="siteHeader">
        <Logo />
        <nav className={menu ? "open" : ""} aria-label="Principal">
          {t.nav.map((item, index) => (
            <a key={item} href={`#${navIds[index]}`} onClick={() => setMenu(false)}>{item}</a>
          ))}
        </nav>
        <div className="headerTools">
          <div className="langSwitch" aria-label="Idioma">
            {(["es", "en", "pt"]).map((language) => (
              <button
                key={language}
                className={lang === language ? "active" : ""}
                aria-pressed={lang === language}
                onClick={() => setLang(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="loginLink" href={promptBuilderUrl} target="_blank" rel="noreferrer">
            {t.login} <span>↗</span>
          </a>
          <button className="menuButton" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Abrir menú">
            {menu ? "×" : "☰"}
          </button>
        </div>
      </header>

      <section className="hero sectionShell">
        <div className="heroCopy">
          <span className="kicker">{t.eyebrow}</span>
          <h1>{t.h1a}<br/><em>{t.h1b}</em></h1>
          <p>{t.lead}</p>
          <div className="heroActions">
            <a className="button primary heroPrimary" href="#packs" onClick={() => track("view_packs", { source: "hero" })}>
              {t.heroCta} <span>↓</span>
            </a>
            <a className="textButton" href="#results">{t.heroProof} <span>↗</span></a>
          </div>
          <a className="button secondary heroClientAccess" href={promptBuilderUrl} target="_blank" rel="noreferrer">
            {t.login} <span>↗</span>
          </a>
          <small className="heroNote"><span>✓</span>{t.heroNote}</small>
        </div>

        <div className="heroVisual">
          <div className="heroImage hoverSwap" tabIndex={0} aria-label={t.result}>
            <img className="heroResult" src="/assets/veh-after.webp" alt={t.result} style={{width:"100%", height:"100%", objectFit:"cover"}} priority   />
            <img className="heroSource" src="/assets/veh-before.webp" alt={t.source} style={{width:"100%", height:"100%", objectFit:"cover"}}   />
            <span className="resultLabel directedLabel">{t.result}</span>
            <span className="resultLabel sourceLabel">{t.source}</span>
            <div className="preservationRail">
              {[t.locked, t.camera, t.prompt].map((item, index) => (
                <span key={item}><b>0{index + 1}</b><i>✓</i>{item}</span>
              ))}
            </div>
          </div>
          <div className="heroSystemTag"><b>VPS / LOCK</b><span>ARCHITECTURE PRESERVATION SYSTEM</span></div>
        </div>
      </section>

      <section className="proofBand" aria-label="Resumen del producto">
        <div className="sectionShell">
          {t.proofLabels.map(([number, label]) => (
            <div key={label}><strong>{number}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      <section className="problem sectionShell">
        <div className="problemIntro">
          <span className="kicker">{t.problemKicker}</span>
          <h2>{t.problemTitle}</h2>
          <p>{t.problemText}</p>
        </div>
        <div className="methodCompare">
          <article className="generic">
            <span>{t.generic}</span>
            {t.genericItems.map((item) => <p key={item}><i>×</i>{item}</p>)}
          </article>
          <article className="controlled">
            <span>{t.vps}</span>
            {t.vpsItems.map((item) => <p key={item}><i>✓</i>{item}</p>)}
          </article>
        </div>
      </section>

      <section id="results" className="results">
        <div className="sectionShell">
          <div className="sectionIntro">
            <span className="kicker">{t.resultsKicker}</span>
            <h2>{t.resultsTitle}</h2>
            <p>{t.resultsText}</p>
          </div>
          <div className="compareGrid">
            <Compare before="/assets/case-1.webp" after="/assets/case-2.webp" label={t.exterior} beforeLabel={t.before} afterLabel={t.after} />
            <Compare before="/assets/case-3.webp" after="/assets/case-4.webp" label={t.interior} beforeLabel={t.before} afterLabel={t.after} />
            <Compare before="/assets/human-vehicle-before.webp" after="/assets/human-vehicle-after.webp" label={t.detailExterior} beforeLabel={t.before} afterLabel={t.after} />
            <Compare before="/assets/camera-before.webp" after="/assets/camera-after.webp" label={t.detailInterior} beforeLabel={t.before} afterLabel={t.after} />
          </div>
        </div>
      </section>

      <section id="system" className="system sectionShell">
        <div className="systemHeading">
          <span className="kicker">{t.systemKicker}</span>
          <h2>{t.systemTitle}</h2>
          <p>{t.systemText}</p>
        </div>
        <div className="layerGrid">
          {t.layers.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div className="layerIcon" aria-hidden="true">{number === "01" ? "◎" : number === "02" ? "▣" : number === "03" ? "◐" : "↗"}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demo">
        <div className="sectionShell demoGrid">
          <div className="demoCopy">
            <span className="kicker">{t.demoKicker}</span>
            <h2>{t.demoTitle}</h2>
            <p>{t.demoText}</p>
            <small>{t.demoDisclaimer}</small>
          </div>
          <a className="builderPreview" href={promptBuilderUrl} target="_blank" rel="noreferrer" aria-label={t.login}>
            <img
              src="/assets/prompt-builder.webp"
              alt="Vista de la nueva versión de VPS Prompt Builder"
              width={1907}
              height={880}
              unoptimized
              sizes="(max-width: 900px) 100vw, 62vw"
            />
          </a>
        </div>
      </section>

      <section id="includes" className="includes sectionShell">
        <div className="sectionIntro">
          <span className="kicker">{t.includesKicker}</span>
          <h2>{t.includesTitle}</h2>
        </div>
        <div className="deliverableGrid">
          {t.deliverables.map(([title, description, type], index) => (
            <article key={title} className={title === "PROMPT BUILDER APP" ? "promptBuilderDeliverable" : ""}>
              <span>0{index + 1}</span>
              <div className="fileIcon">{type}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="categories">
          <span>{t.categoriesLabel}</span>
          <div>{t.categories.map((category) => <b key={category}>{category}</b>)}</div>
        </div>
      </section>

      <section className="audience">
        <div className="sectionShell">
          <div className="sectionIntro">
            <span className="kicker">{t.audienceKicker}</span>
            <h2>{t.audienceTitle}</h2>
          </div>
          <div className="audienceGrid">
            {t.audiences.map(([title, description], index) => (
              <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
          <p className="toolsNote"><b>COMPATIBILITY NOTE</b>{t.tools}</p>
        </div>
      </section>

      <section id="packs" className="packs sectionShell">
        <div className="sectionIntro row">
          <div>
            <span className="kicker">{t.packsKicker}</span>
            <h2>{t.packsTitle}</h2>
          </div>
          <div className="pricingTools">
            <span>{t.save}</span>
            <div className="currencySwitch" aria-label="Moneda">
              {(["USD", "ARS"]).map((item) => (
                <button key={item} className={currency === item ? "active" : ""} aria-pressed={currency === item} onClick={() => setCurrency(item)}>{item}</button>
              ))}
            </div>
            <small>{t.currency[currency]}</small>
          </div>
        </div>

        <div className="packGrid">
          <PackCard onBuyPack={handleBuyPack} id="starter" currency={currency} t={t} />
          <PackCard onBuyPack={handleBuyPack} id="professional" currency={currency} t={t} />
          <PackCard onBuyPack={handleBuyPack} id="studio" currency={currency} t={t} />
        </div>

        <div className="confidenceBar">
          {t.confidence.map(([label, description]) => <div key={label}><span>{label}</span><p>{description}</p></div>)}
        </div>

        <div className="tableWrap">
          <h3>{t.matrixTitle}</h3>
          <table>
            <thead><tr><th> </th><th>Starter</th><th className="recommended">Professional</th><th>Studio Pro</th></tr></thead>
            <tbody>
              {t.matrixRows.map((row, index) => (
                <tr key={row} className={highlightedMatrixRows.has(index) ? "importantRow" : ""}>
                  <th>{row}</th>
                  {(index === 10 ? t.rescueLevels : matrix[index]).map((value, cell) => <td key={cell} className={cell === 1 ? "recommended" : ""}>{value}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="author">
        <div className="sectionShell authorGrid">
          <div className="authorPortrait" aria-hidden="true">
            <span>VPS</span>
            <b>ARCHITECT<br/>BUILT</b>
            <i>CONTROL / METHOD / VISUAL DIRECTION</i>
          </div>
          <div>
            <span className="kicker">{t.authorKicker}</span>
            <h2>{t.authorTitle}</h2>
            <p>{t.authorText}</p>
            <div className="signature">VISUAL PROMPT STUDIO <span>{t.authorRole}</span></div>
          </div>
        </div>
      </section>

      <section id="faq" className="faq sectionShell">
        <div className="sectionIntro">
          <span className="kicker">{t.faqKicker}</span>
          <h2>{t.faqTitle}</h2>
        </div>
        <div className="faqList">
          {t.faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="closing">
        <div className="sectionShell">
          <span className="kicker">{t.closingKicker}</span>
          <h2>{t.closingTitle}</h2>
          <p>{t.closingText}</p>
          <a className="button primary" href="#packs" onClick={() => track("view_packs", { source: "closing" })}>
            {t.closingCta} <span>↑</span>
          </a>
        </div>
      </section>

      <footer>
        <div className="footerMain">
          <div><Logo/><p>{t.footer}</p></div>
          <div className="footerMeta"><p>{t.footerPrivacy}</p><p>{t.footerTerms}</p></div>
        </div>
        <div className="footerBottom"><span>© 2026 VISUAL PROMPT STUDIO</span><span>BUILT FOR ARCHITECTURAL AI WORKFLOWS</span></div>
      </footer>

      <a className="mobileCta" href="#packs" onClick={() => track("view_packs", { source: "mobile_sticky" })}>
        {t.mobileCta} <span>↓</span>
      </a>
    
      {activePack && <PaymentModal pack={activePack} lang={lang} onClose={() => setActivePack(null)} />}
    </main>
  );
}
