// experiencias-datos: conector MCP del motor de experiencias de datos.
// sin estado, sin llaves, sin OAuth. responde solo con lo que está en el repo (src/knowledge.json se compila en el build).
// transporte: MCP Streamable HTTP, respuesta JSON simple (sin SSE), en POST /mcp.
// pluma: claude · opus 5.5 (Legible), 24-sep-2026. pendiente de segunda pluma.

import K from './knowledge.json' with { type: 'json' };

const SERVER = { name: 'experiencias-datos', version: '0.1.0' };
const PROTOCOLOS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, mcp-protocol-version, mcp-session-id, accept',
};

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const incluye = (hay, aguja) => norm(hay).includes(norm(aguja));

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
        const ids = g.aristas.tarea_forma[tarea];
        out.tarea = tarea;
        out.formas = ids ? g.formas.filter((f) => ids.includes(f.id)) : null;
        if (!ids) out.aviso_tarea = `tarea desconocida; válidas: ${Object.keys(g.aristas.tarea_forma).join(', ')}`;
      }
      if (proposito) {
        const ids = g.aristas.proposito_tecnica[proposito];
        out.proposito = proposito;
        out.tecnicas = ids ? K.tecnicas.filter((t) => ids.includes(t.id)) : null;
        if (!ids) out.aviso_proposito = `propósito desconocido; válidos: ${Object.keys(g.aristas.proposito_tecnica).join(', ')}`;
      }
      if (patron) {
        out.patron = patron;
        out.compromiso_esperado = g.aristas.patron_compromiso[patron] ?? 'sin arista todavía';
        out.referentes = K.referentes.filter((r) => (r.patron || []).includes(patron));
      }
      return out;
    },
  },
  {
    name: 'buscar_referentes',
    description: 'Busca piezas de referencia indexadas por operación cognitiva, no por estética. Filtra por patrón pedagógico y/o texto libre. Devuelve URL, operación, qué tomar y qué cuidar. No hay imágenes rehosteadas.',
    inputSchema: { type: 'object', properties: { patron: { type: 'string' }, texto: { type: 'string' } } },
    run: ({ patron, texto } = {}) => ({
      referentes: K.referentes.filter(
        (r) => (!patron || (r.patron || []).includes(patron)) && (!texto || incluye(JSON.stringify(r), texto)),
      ),
    }),
  },
  {
    name: 'buscar_tecnicas',
    description: 'Busca técnicas visuales e interactivas (unit chart, predicción dibujada, líneas hervidas, mapa sin base, etc.) con sus librerías, accesibilidad y riesgo de distorsión.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' }, texto: { type: 'string' } } },
    run: ({ id, texto } = {}) => ({
      tecnicas: K.tecnicas.filter((t) => (!id || t.id === id) && (!texto || incluye(JSON.stringify(t), texto))),
    }),
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
  async fetch(request) {
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
