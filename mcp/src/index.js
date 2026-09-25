// experiencias-datos: conector MCP del motor de experiencias de datos.
// sin estado, sin llaves, sin OAuth. responde solo con lo que está en el repo (src/knowledge.json se compila en el build).
// transporte: MCP Streamable HTTP, respuesta JSON simple (sin SSE), en POST /mcp.
// pluma: claude · opus 5.5 (Legible), 24-sep-2026. pendiente de segunda pluma.

import K from './knowledge.json' with { type: 'json' };

const SERVER = { name: 'experiencias-datos', version: '0.1.1' };
const PROTOCOLOS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, mcp-protocol-version, mcp-session-id, accept',
};

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const incluye = (hay, aguja) => norm(hay).includes(norm(aguja));

// palabras de todos los días → id del grafo. segunda pluma (fable), 24-sep-2026: un profe escribe "tendencia", no "cambio".
const SINONIMOS = {
  tarea: {
    cambio: ['tendencia', 'evolucion', 'tiempo', 'antes y despues', 'crecio', 'bajo', 'subio', 'cambio'],
    comparar: ['comparacion', 'versus', 'vs', 'diferencia', 'contra'],
    ordenar: ['ranking', 'top', 'mayor', 'menor', 'quien tiene mas', 'orden'],
    magnitud: ['cuanto', 'cuantos', 'total', 'cantidad', 'volumen'],
    parte_todo: ['porcentaje', 'proporcion', 'torta', 'pie', 'composicion', 'reparto', 'participacion'],
    distribucion: ['histograma', 'dispersion', 'como se reparte', 'rango'],
    localizar: ['donde', 'mapa', 'ubicacion', 'territorio'],
    relacionar: ['correlacion', 'relacion', 'depende', 'asociacion'],
    flujo: ['migracion', 'movimiento', 'de donde a donde', 'origen destino'],
    secuencia: ['cronologia', 'hitos', 'etapas', 'pasos'],
    estado: ['avance', 'cumplimiento', 'semaforo', 'compromisos'],
    incertidumbre: ['margen', 'error', 'confianza', 'probabilidad'],
    procedencia: ['fuente', 'de donde sale', 'metodologia'],
    vacio: ['faltan datos', 'sin dato', 'no hay', 'nulos', 'missing'],
  },
  proposito: {
    escala_humana: ['que se entienda', 'entiendan', 'intuitivo', 'para ninos', 'para todos', 'personas'],
    sorpresa: ['impactar', 'que recuerden', 'memorable', 'sorprender'],
    comparacion: ['comparar', 'contrastar'],
    mostrar_cambio: ['tendencia', 'evolucion', 'cambio'],
    revelar_estructura: ['estructura', 'patron', 'sistema'],
    mostrar_incertidumbre: ['incertidumbre', 'duda', 'margen'],
    invitar_a_explorar: ['explorar', 'interactivo', 'que jueguen'],
    rendicion_de_cuentas: ['transparencia', 'rendir cuentas', 'compromisos', 'promesas'],
    activos_primero: ['lo bueno primero', 'fortalezas', 'activos', 'sin estigma'],
  },
};

// devuelve {id, interpretado} : id exacto (sin tildes ni mayusculas), o el primer sinonimo que aparezca en el texto, o null.
function resolver(entrada, ids, tipo) {
  const n = norm(entrada).replace(/[\s-]+/g, '_');
  if (ids.includes(n)) return { id: n, interpretado: n !== entrada };
  const suelto = norm(entrada);
  for (const [id, palabras] of Object.entries(SINONIMOS[tipo] || {})) {
    if (!ids.includes(id)) continue;
    if (palabras.some((w) => suelto.includes(w))) return { id, interpretado: true };
  }
  const parecido = ids.find((id) => suelto.includes(id.replace(/_/g, ' ')) || suelto.includes(id));
  if (parecido) return { id: parecido, interpretado: true };
  return null;
}

// busqueda por palabras (>= 3 letras): cuenta cuantas palabras de la consulta aparecen en el objeto.
function puntaje(obj, texto) {
  const palabras = norm(texto).split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
  if (!palabras.length) return 1;
  const hay = norm(JSON.stringify(obj));
  return palabras.filter((w) => hay.includes(w)).length;
}

// ---------- herramientas ----------

const TOOLS = [
  {
    name: 'revisar_fuente',
    description:
      'Revisa una fuente de datos públicos contra el catálogo de trampas conocidas (fila contenedor sin geometría, geometría que no se llama geometry, tres clases de vacío, índice que invierte cuartiles, edición nueva con el mismo hash, proxy leído como hecho, marcador de supresión mal atribuido). Recibe una descripción, nombres de columnas y/o una URL. Coincide por señales declaradas: no descarga ni inspecciona el archivo.',
    inputSchema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', description: 'Qué fuente es y qué piensas hacer con ella' },
        columnas: { type: 'array', items: { type: 'string' }, description: 'Nombres de columnas del archivo' },
        url: { type: 'string', description: 'URL de la fuente' },
      },
    },
    run: ({ descripcion = '', columnas = [], url = '' }) => {
      const texto = [descripcion, url, ...columnas].join(' | ');
      if (!texto.trim().replace(/\|/g, '').trim()) {
        return { error: 'Dame al menos una descripción, columnas o una URL.' };
      }
      const hallazgos = K.trampas
        .map((t) => ({ t, señales: (t.senales || []).filter((s) => incluye(texto, s)) }))
        .filter((x) => x.señales.length)
        .sort((a, b) => b.señales.length - a.señales.length)
        .map(({ t, señales }) => ({
          id: t.id, nombre: t.nombre, estado: t.estado, señales_que_coinciden: señales,
          que_pasa: t.que_pasa, como_se_ve: t.como_se_ve, prueba: t.prueba,
          que_hacer: t.que_hacer, fuente_primaria: t.fuente_primaria, ejemplo_publico: t.ejemplo_publico,
        }));
      return {
        metodo: 'coincidencia por señales declaradas en trampas/trampas.yaml; no se descargó ni inspeccionó la fuente',
        hallazgos,
        nota: hallazgos.length
          ? 'Cada trampa trae su prueba: córrela sobre tu archivo antes de darla por aplicable.'
          : 'No reconozco trampas conocidas para esta descripción. Eso no significa que no haya: el catálogo es chico y crece por PR.',
        catalogo: K.trampas.map((t) => `${t.id} ${t.nombre}`),
      };
    },
  },
  {
    name: 'listar_trampas',
    description: 'Lista el catálogo completo de trampas de datos públicos, con su estado (VERIFICADO = reproducida por código en el repo; REFERIDO = documentada por otra pluma, falta reproducir).',
    inputSchema: { type: 'object', properties: { estado: { type: 'string', enum: ['VERIFICADO', 'REFERIDO'] } } },
    run: ({ estado } = {}) => ({ trampas: K.trampas.filter((t) => !estado || t.estado === estado) }),
  },
  {
    name: 'consultar_grafo',
    description:
      'Consulta el grafo pregunta→experiencia. Con una tarea (p. ej. magnitud, comparar, flujo) devuelve formas candidatas; con un propósito didáctico (p. ej. escala_humana, sorpresa) devuelve técnicas; con un patrón (p. ej. predict_reveal) devuelve el nivel de compromiso ICAP esperado. Siempre incluye las restricciones duras. Sin argumentos devuelve el vocabulario completo. Es una consulta determinista, no una recomendación con juicio.',
    inputSchema: {
      type: 'object',
      properties: { tarea: { type: 'string' }, proposito: { type: 'string' }, patron: { type: 'string' } },
    },
    run: ({ tarea, proposito, patron } = {}) => {
      const g = K.grafo;
      if (!tarea && !proposito && !patron) {
        return {
          tareas: g.tareas, propositos: g.propositos, patrones: g.patrones,
          compromiso: g.compromiso, formas: g.formas, restricciones: g.restricciones,
        };
      }
      const out = { restricciones_duras: g.restricciones.duras };
      if (tarea) {
        const r = resolver(tarea, g.tareas.map((t) => t.id), 'tarea');
        out.tarea = r ? r.id : tarea;
        if (r && r.interpretado) out.interpretado_como = { tarea: r.id, desde: tarea };
        const ids = r ? g.aristas.tarea_forma[r.id] : null;
        out.formas = ids ? g.formas.filter((f) => ids.includes(f.id)) : null;
        if (!r) out.aviso_tarea = `tarea desconocida; válidas: ${g.tareas.map((t) => `${t.id} (${t.desc})`).join(', ')}`;
        else if (!ids) out.aviso_tarea = `la tarea ${r.id} está en el vocabulario pero todavía no tiene formas asociadas; crece por PR`;
      }
      if (proposito) {
        const r = resolver(proposito, g.propositos.map((p) => p.id), 'proposito');
        out.proposito = r ? r.id : proposito;
        if (r && r.interpretado) out.interpretado_como = { ...(out.interpretado_como || {}), proposito: r.id, desde: proposito };
        const ids = r ? g.aristas.proposito_tecnica[r.id] : null;
        out.tecnicas = ids ? K.tecnicas.filter((t) => ids.includes(t.id)) : null;
        if (!r) out.aviso_proposito = `propósito desconocido; válidos: ${g.propositos.map((p) => `${p.id} (${p.desc})`).join(', ')}`;
        else if (!ids) out.aviso_proposito = `el propósito ${r.id} está en el vocabulario pero todavía no tiene técnicas asociadas; crece por PR`;
      }
      if (patron) {
        const ids = g.patrones.map((p) => (typeof p === 'string' ? p : p.id));
        const r = resolver(patron, ids, 'patron');
        out.patron = r ? r.id : patron;
        if (r && r.interpretado) out.interpretado_como = { ...(out.interpretado_como || {}), patron: r.id, desde: patron };
        if (!r) out.aviso_patron = `patrón desconocido; válidos: ${ids.join(', ')}`;
        out.compromiso_esperado = r ? (g.aristas.patron_compromiso[r.id] ?? 'sin arista todavía') : null;
        out.referentes = r ? K.referentes.filter((x) => (x.patron || []).includes(r.id)) : [];
      }
      return out;
    },
  },
  {
    name: 'buscar_referentes',
    description: 'Busca piezas de referencia indexadas por operación cognitiva, no por estética. Filtra por patrón pedagógico y/o texto libre. Devuelve URL, operación, qué tomar y qué cuidar. No hay imágenes rehosteadas.',
    inputSchema: { type: 'object', properties: { patron: { type: 'string' }, texto: { type: 'string' } } },
    run: ({ patron, texto } = {}) => {
      const referentes = K.referentes
        .filter((r) => !patron || (r.patron || []).includes(patron))
        .map((r) => ({ r, p: texto ? puntaje(r, texto) : 1 }))
        .filter((x) => x.p > 0)
        .sort((a, b) => b.p - a.p)
        .map((x) => x.r);
      const out = { referentes };
      if (!referentes.length) out.sugerencia = 'El catálogo indexa piezas por operación cognitiva (predecir, comparar, situarse), no por tema ni tipo de gráfico. Prueba consultar_grafo con la tarea de tu pregunta, o busca por patrón: ' + K.grafo.patrones.map((p) => (typeof p === 'string' ? p : p.id)).join(', ');
      return out;
    },
  },
  {
    name: 'buscar_tecnicas',
    description: 'Busca técnicas visuales e interactivas (unit chart, predicción dibujada, líneas hervidas, mapa sin base, etc.) con sus librerías, accesibilidad y riesgo de distorsión.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' }, texto: { type: 'string' } } },
    run: ({ id, texto } = {}) => {
      const tecnicas = K.tecnicas
        .filter((t) => !id || norm(t.id) === norm(id))
        .map((t) => ({ t, p: texto ? puntaje(t, texto) : 1 }))
        .filter((x) => x.p > 0)
        .sort((a, b) => b.p - a.p)
        .map((x) => x.t);
      const out = { tecnicas };
      if (!tecnicas.length) out.sugerencia = 'No hay una técnica con esas palabras. El catálogo no lista tipos de gráfico corrientes (barras, torta, líneas) sino técnicas para que una experiencia se entienda y se recuerde. Pide consultar_grafo con tu tarea (magnitud, comparar, cambio, parte_todo…) y de ahí sal a las técnicas por propósito.';
      return out;
    },
  },
  {
    name: 'principios',
    description: 'Devuelve los principios del motor (PR-01…), cada uno con su enunciado, su evidencia y cómo verificar que se cumple.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ principios: K.principios }),
  },
];

// ---------- JSON-RPC ----------

const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const err = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

function manejar(msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return err(msg?.id, -32600, 'Invalid Request');
  const { id, method, params = {} } = msg;
  const esNotificacion = id === undefined;

  switch (method) {
    case 'initialize': {
      const pedido = params.protocolVersion;
      return ok(id, {
        protocolVersion: PROTOCOLOS.includes(pedido) ? pedido : PROTOCOLOS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions:
          'Pregunta primero, gráfico después. Usa revisar_fuente antes de visualizar datos públicos; consultar_grafo para pasar de la pregunta a la forma; principios para el checklist. Todo sale del repo motor-de-experiencias-de-datos (commit ' + K.commit + ').',
      });
    }
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;
    case 'ping':
      return ok(id, {});
    case 'tools/list':
      return ok(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return err(id, -32602, `Herramienta desconocida: ${params.name}`);
      try {
        const data = tool.run(params.arguments || {});
        const isError = Boolean(data && data.error);
        return ok(id, {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
          structuredContent: data,
          isError,
        });
      } catch (e) {
        return ok(id, { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true });
      }
    }
    default:
      return esNotificacion ? null : err(id, -32601, `Método no soportado: ${method}`);
  }
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...CORS } });

export default {
  async fetch(request, env = {}) {
    const { pathname } = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    if (pathname === '/' && request.method === 'GET') {
      return new Response(
        `experiencias-datos · conector MCP\nPOST /mcp (JSON-RPC, MCP Streamable HTTP)\nconocimiento: commit ${K.commit}, construido ${K.construido}\n` +
          `${K.trampas.length} trampas · ${K.referentes.length} referentes · ${K.tecnicas.length} técnicas · ${K.principios.length} principios\n`,
        { headers: { 'content-type': 'text/plain; charset=utf-8', ...CORS } },
      );
    }
    if (pathname !== '/mcp') return new Response('not found', { status: 404, headers: CORS });
    if (request.method !== 'POST') return new Response('method not allowed', { status: 405, headers: { Allow: 'POST', ...CORS } });

    if (env.LIMITE) {
      const clave = request.headers.get('cf-connecting-ip') || 'sin-ip';
      const { success } = await env.LIMITE.limit({ key: clave });
      if (!success) return json(err(null, -32000, 'Demasiadas llamadas: máximo 60 por minuto. Intenta de nuevo en un rato.'), 429);
    }

    let body;
    try { body = await request.json(); } catch { return json(err(null, -32700, 'Parse error'), 400); }

    if (Array.isArray(body)) {
      const respuestas = body.map(manejar).filter(Boolean);
      return respuestas.length ? json(respuestas) : new Response(null, { status: 202, headers: CORS });
    }
    const r = manejar(body);
    return r ? json(r) : new Response(null, { status: 202, headers: CORS });
  },
};
