// experiencias-datos: conector MCP del motor de experiencias de datos.
// sin estado, sin llaves, sin OAuth. responde solo con lo que está en el repo (src/knowledge.json se compila en el build).
// transporte: MCP Streamable HTTP, respuesta JSON simple (sin SSE), en POST /mcp.
// pluma: claude · opus 5.5 (Legible), 24-sep-2026. pendiente de segunda pluma.

import K from './knowledge.json' with { type: 'json' };

const SERVER = { name: 'experiencias-datos', version: '0.2.1' };
const PROTOCOLOS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, mcp-protocol-version, mcp-session-id, accept',
};

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const incluye = (hay, aguja) => norm(hay).includes(norm(aguja));

// palabras de todos los días → id del grafo. segunda pluma (fable), 24-sep-2026: un profe escribe "tendencia", no "cambio".
const SINONIMOS = {
  tarea: {
    cambio: ['tendencia', 'evolucion', 'tiempo', 'serie', 'mes a mes', 'antes y despues', 'crecio', 'bajo', 'subio', 'cambio'],
    comparar: ['comparacion', 'versus', 'vs', 'diferencia', 'contra'],
    ordenar: ['ranking', 'top', 'mayor', 'menor', 'quien tiene mas', 'orden'],
    magnitud: ['cuanto', 'cuantos', 'total', 'cantidad', 'volumen'],
    parte_todo: ['porcentaje', 'proporcion', 'torta', 'pie', 'composicion', 'reparto', 'participacion'],
    distribucion: ['histograma', 'boxplot', 'caja', 'como se reparte', 'rango', 'frecuencia'],
    localizar: ['donde', 'mapa', 'ubicacion', 'territorio'],
    relacionar: ['correlacion', 'relacion', 'depende', 'asociacion', 'scatter', 'dispersion', 'x e y'],
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
  // ámbito = unidad de análisis (grafo/restricciones/ambitos, opus 5.5, 2-nov-2026). fable (procedencia), PR #3: solo palabras
  // que nombran la unidad; una pregunta que no la nombra no resuelve ámbito y recibe todas las restricciones, declarado.
  ambito: {
    personas: ['personas', 'persona', 'estudiantes', 'estudiante', 'alumnos', 'alumnas', 'alumno', 'alumna', 'pacientes', 'paciente', 'trabajadores', 'trabajadoras', 'trabajador', 'trabajadora', 'usuarios', 'usuarias', 'individuos', 'por persona', 'por estudiante', 'cada persona', 'encuestados', 'vendedores', 'socios'],
    territorio_o_servicio: ['territorio', 'territorial', 'comuna', 'comunas', 'comunal', 'manzana', 'manzanas', 'unidad vecinal', 'unidades vecinales', 'barrio', 'barrios', 'region', 'regiones', 'sede', 'sedes', 'consultorio', 'consultorios', 'servicio', 'servicios', 'establecimiento', 'establecimientos', 'por comuna', 'por manzana'],
    // v0.2 (grafo de opus, 2-nov-2026): los datos de quien pregunta y los de la sala. fable (procedencia): las palabras cortas
    // son de la vida; las frases largas ganan por longitud cuando compiten («levanten la mano» le gana a «alumnos»).
    datos_propios: ['tenemos', 'la jefa', 'mi jefa', 'la pega', 'la oficina', 'sucursales', 'la meta', 'nuestras', 'nuestros', 'la empresa', 'hice', 'estoy pagando', 'pago', 'he perdido', 'miro', 'escuche', 'dije', 'abri', 'me tomo', 'me tome', 'mi cartola', 'mi boleta', 'mi perro', 'mi gato', 'mi sueldo', 'mi tarjeta', 'mi cuenta', 'mi casa', 'mis gastos', 'mis cuotas', 'mis plantas', 'la cartola', 'el excel de la pega', 'me gasto', 'me gaste', 'gasto', 'gaste', 'se me fue', 'se me va', 'llevo gastado', 'tengo', 'mis', 'mi', 'me', 'yo'],
    la_sala: ['cuantos somos', 'sembramos', 'medimos', 'hicimos', 'cada grupo', 'los grupos', 'de la lista', 'los papas', 'la prueba', 'el test', 'los del 7', 'ninas y', 'y ninos', 'la plantita', 'levanten la mano', 'levantar la mano', 'mano alzada', 'el curso', 'mi curso', 'los ninos', 'las ninas', 'los chiquillos', 'chiquillos', 'chiquillas', 'la sala', 'en la sala', 'el taller', 'la clase', 'mis alumnos', 'los alumnos', 'apoderados', 'recreo', 'colacion', 'el paseo', 'la pizarra', 'papelografo', 'tia'],
  },
};

// v0.2: el grafo trae `palabras_de_la_gente` por tarea y por ámbito en es, pt y en (opus, 2-nov-2026). se suman a los sinónimos:
// los ids del grafo son el ancla y quedan en castellano; lo que la gente dice encima se resuelve en el idioma que traiga.
for (const [id, idiomas] of Object.entries(K.grafo.palabras_de_la_gente || {})) {
  const frases = Object.values(idiomas).flat().map(norm);
  const tipo = (K.grafo.tareas || []).some((t) => t.id === id) ? 'tarea' : (K.grafo.restricciones?.ambitos || []).some((a) => a.id === id) ? 'ambito' : null;
  if (!tipo) continue;
  SINONIMOS[tipo][id] = [...new Set([...(SINONIMOS[tipo][id] || []), ...frases])];
}
// palabras de la vida que faltaban en v0.1 y el corpus (pr #16) dejó a la vista. fable (procedencia), 2-nov-2026.
SINONIMOS.tarea.magnitud.push('cuanta', 'cuantas', 'cuanta plata', 'cuantos trajeron', 'cuanto llevo', 'how much', 'how many', 'quanto', 'quantos', 'quantas', 'levanten la mano', 'los que trajeron', 'quienes trajeron', 'manos arriba', 'levantem a mao', 'raise your hand'); // levantar la mano es contar
SINONIMOS.tarea.cambio.push('subi', 'baje', 'subio', 'bajo', 'mas que antes', 'menos que antes', 'went up', 'went down', 'subiu', 'caiu');
SINONIMOS.tarea.comparar.push('cual me conviene', 'versus', 'compared to', 'comparado con', 'comparado', 'mejor que', 'peor que', 'entre dos', 'elegir entre', 'cual de los dos', 'cual de las dos', 'la mayoria', 'cual prefieren', 'que prefieren', 'a cual le fue mejor', 'cual le fue mejor', 'cada grupo', 'cada uno', 'cada una');
SINONIMOS.tarea.cambio.push('comparado con el mes', 'comparado con el ano', 'comparado con el otro', 'que el mes pasado', 'mes antes', 'y ayer', 'crecieron', 'despues de cambiar');
SINONIMOS.tarea.parte_todo.push('en que se me va', 'en que se va', 'en pedazos', 'cuanto de mi sueldo', 'where does my money go');
SINONIMOS.tarea.ordenar.push('en que mes', 'cual vende mas', 'el que mas', 'la que mas', 'which month', 'which sells the most');
SINONIMOS.tarea.vacio.push('no se cuantos', 'nadie lo conto', 'sin que nadie', 'no lo guardaba', 'no tengo el dato', 'no hay registro', 'nobody counted');
SINONIMOS.tarea.estado.push('cuanto nos falta', 'cuanto falta', 'llevamos', 'me quedan', 'how much is left');
SINONIMOS.tarea.procedencia.push('de donde sale', 'es verdad o es mentira', 'es correcto o es mentira', 'where does this number come from');
SINONIMOS.tarea.estimar = [...(SINONIMOS.tarea.estimar || []), 'mas o menos', 'tiro un numero', 'ni idea', 'en un ano', 'al ano', 'aproximado', 'un calculo', 'roughly', 'ballpark', 'in a year', 'mais ou menos'];
SINONIMOS.tarea.proyectar = [...(SINONIMOS.tarea.proyectar || []), 'si sigo asi', 'si sigo', 'me alcanza', 'cuando me quedo sin', 'hasta cuando', 'if i keep', 'will it last', 'when will i run out', 'se eu continuar'];
SINONIMOS.tarea.leer = [...(SINONIMOS.tarea.leer || []), 'no entiendo', 'que me quieren decir', 'que me estan diciendo', 'como se lee', 'explicame', 'explicamelo', 'que significa', 'how do i read', 'what is this chart telling me', 'nao entendo'];
// propósitos de PARA_QUIEN.md (grafo v0.2): jugar y perder el miedo. INFERENCIA desde el corpus.
SINONIMOS.proposito.jugar = ['por gusto', 'me da risa', 'da risa', 'absurdo', 'por curiosidad', 'pa saber nomas', 'por saber', 'pa reirme', 'pa mandarle', 'for fun', 'just curious', 'por diversao'];
SINONIMOS.proposito.perder_el_miedo = ['no soy de numeros', 'no soy de matematicas', 'no entiendo nada', 'me da verguenza', 'perdona la pregunta', 'perdona si es tonto', 'pregunta tonta', 'como si fuera chica', 'como si fuera chico', 'me siento tonta', 'me siento tonto', 'nunca fui bueno', 'nunca fui buena', 'im not a numbers person', 'nao sou de numeros'];

// patrones que exigen interacción para cumplir su función. Sol, prueba de uso del 24-sep-2026 (PR #2):
// el motor dijo «predecir → revelar» y la salida terminó diciendo «mirar». Esto lo vuelve contrato, no consejo.
const INTERACCION = {
  predict_reveal: ['antes: la persona anota o dibuja su predicción (con opción "prefiero no adivinar")', 'acción: confirma', 'revelación: aparece el dato y la brecha con lo que creía', 'después: una frase que nombra la brecha'],
  recall_guess_feedback: ['antes: se pide recordar o estimar', 'acción: responde', 'revelación: dato + retroalimentación', 'después: qué cambió en lo que creía'],
  manipulate_observe: ['antes: hipótesis escrita ("si muevo X, pasa Y")', 'acción: manipula el control', 'observación: el cambio', 'después: contrastar con la hipótesis'],
  sequence_branch: ['guía: mensaje central primero', 'rama: la persona elige por dónde seguir', 'exploración libre al final'],
  compare_explain: ['ver A y B bajo la misma lógica', 'explicar la diferencia con una frase propia'],
  overview_focus_context: ['vista general', 'foco elegido por la persona', 'el contexto sigue visible'],
  personalize_situate: ['la persona se ubica ("mi calle", "mi curso")', 've su caso dentro del patrón general'],
  same_object_transform: ['el mismo objeto cambia de forma sin saltos', 'lo que no cambió se queda quieto'],
};
const SIN_INTERACCION = 'Si tu superficie no permite interacción y vas a entregar algo estático, declara degradado_a_estatico: true con la razón, y conserva al menos el "antes" como pregunta escrita antes del gráfico. Una salida estática que no lo declara no cumple el patrón.';

// operación cognitiva mínima de cada patrón, en el vocabulario de ves/schema.json → interaccion.tipo
// (ninguna | filtro | prediccion | explicacion | exploracion). fable, PR #3, 2-nov-2026, tras las notas de Sol:
// «constructivo» en ICAP es producir una idea (predicción, explicación, hipótesis), no hacer clics ni mirar una
// conclusión. interaccion_requerida dice si la superficie tiene que ser interactiva; esto dice qué tiene que
// producir la persona, con o sin interacción. La VES ya exige prediccion|explicacion para aceptar constructivo.
const OPERACION = {
  predict_reveal: { tipo: 'prediccion', minimo: 'la persona registra su predicción antes de ver el dato' },
  recall_guess_feedback: { tipo: 'prediccion', minimo: 'la persona recuerda o estima antes de ver el dato' },
  manipulate_observe: { tipo: 'prediccion', minimo: 'la persona escribe una hipótesis ("si muevo X, pasa Y") antes de manipular; sin ella el compromiso es activo, no constructivo' },
  compare_explain: { tipo: 'explicacion', minimo: 'la persona explica la diferencia entre A y B con una frase propia' },
  sequence_branch: { tipo: 'exploracion', minimo: 'la persona elige por dónde seguir' },
  overview_focus_context: { tipo: 'exploracion', minimo: 'la persona elige el foco; el contexto sigue visible' },
  personalize_situate: { tipo: 'filtro', minimo: 'la persona se ubica a sí misma dentro del patrón general' },
  same_object_transform: { tipo: 'ninguna', minimo: 'mirar el mismo objeto cambiar de forma; sube a activo si la persona dispara la transformación' },
  // estáticos legítimos con piso constructivo: la pieza no necesita UI, pero tiene que pedir una idea producida por quien lee.
  claim_evidence_limit: { tipo: 'explicacion', minimo: 'la pieza separa afirmación, evidencia y límite, y le pide a quien lee que diga (o escriba) qué sostiene la afirmación y dónde deja de sostenerla; sin esa explicación producida por la persona, la pieza es «mirar una conclusión» y el compromiso baja a pasivo' },
  // INFERENCIA (fable, 2-nov-2026): el patrón no tiene estados escritos en este repo; la operación que lo hace constructivo es formular la pregunta propia. Se puede contestar en el hilo.
  unknown_route_to_evidence: { tipo: 'explicacion', minimo: 'la persona formula qué no sabe, con sus palabras, antes de recorrer el camino hasta la evidencia' },
};
// cuando nada encaja. romina, 2-nov-2026, 18:46, al probar el conector recién desplegado: «si acaso el conector no le pudo
// ayudar al modelo a representar la experiencia porque nada encajaba bien, le diga...». va en su voz.
const SI_NADA_ENCAJA = 'Si nada de esto te sirvió para representar la experiencia que te pidieron, pregúntale a tu humano si está ok con que nos cuentes qué pasó, como un issue en github.com/rominapitronello/motor-de-experiencias-de-datos o un mail a contacto@pasaelfiltro.cl: qué pregunta era, para quién, y qué faltó. Si no se puede, está bien, no pasa nada. Es solo que nos encanta resolver este tipo de desafíos.';

const SI_NADA_ENCAJA_CORTO = 'Si nada de esto te sirvió, pregúntale a tu humano si está ok con que nos lo cuentes: un issue en github.com/rominapitronello/motor-de-experiencias-de-datos o un mail a contacto@pasaelfiltro.cl. Si no se puede, no pasa nada.';

const ORDEN_ICAP = { pasivo: 0, activo: 1, constructivo: 2, interactivo: 3 };
// compromiso efectivo si se cumple el contrato: el piso del grafo, o constructivo si la operación mínima produce una idea (misma regla que casos/probar_ves.py).
const compromisoConContrato = (piso, operacion) => {
  if (!(piso in ORDEN_ICAP)) return null;
  const produce = operacion && ['prediccion', 'explicacion'].includes(operacion.tipo);
  return produce && ORDEN_ICAP[piso] < ORDEN_ICAP.constructivo ? 'constructivo' : piso;
};

// tokens: palabras sin tildes ni mayúsculas. fable, PR #3, 2-nov-2026 (nota de Sol): el parser buscaba subcadenas y
// «pie» calzaba en «piedra», «top» en «topografía». Un sinónimo de varias palabras es una secuencia de tokens contigua.
const tokens = (s) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);
function contieneFrase(ts, frase) {
  const fs = tokens(frase);
  if (!fs.length || fs.length > ts.length) return false;
  for (let i = 0; i + fs.length <= ts.length; i++) {
    let j = 0;
    while (j < fs.length && ts[i + j] === fs[j]) j++;
    if (j === fs.length) return true;
  }
  return false;
}

// devuelve {id, interpretado, por} : id exacto (sin tildes ni mayusculas), o el sinonimo más largo que aparezca como
// tokens en el texto, o el id del vocabulario que aparezca como tokens, o null. `por` dice cómo se llegó (procedencia).
function resolver(entrada, ids, tipo) {
  const n = norm(entrada).replace(/[\s-]+/g, '_');
  if (ids.includes(n)) return { id: n, interpretado: n !== entrada, por: 'id del vocabulario' };
  const ts = tokens(entrada);
  let mejor = null; // gana el sinónimo más largo: "scatter" le gana a "vs" en "scatter de notas vs asistencia"
  for (const [id, palabras] of Object.entries(SINONIMOS[tipo] || {})) {
    if (!ids.includes(id)) continue;
    for (const w of palabras) if (contieneFrase(ts, w) && (!mejor || w.length > mejor.w.length)) mejor = { id, w };
  }
  if (mejor) return { id: mejor.id, interpretado: true, por: `sinónimo «${mejor.w}»` };
  const parecido = ids.find((id) => contieneFrase(ts, id.replace(/_/g, ' ')));
  if (parecido) return { id: parecido, interpretado: true, por: `id «${parecido}» dentro del texto` };
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
      'Consulta el grafo pregunta→experiencia. Con una tarea (p. ej. magnitud, comparar, flujo) devuelve formas candidatas; con un propósito didáctico (p. ej. escala_humana, sorpresa) devuelve técnicas; con un patrón (p. ej. predict_reveal) devuelve el contrato pedagógico: compromiso ICAP esperado, si exige interacción, sus estados mínimos y la operación cognitiva mínima. Diseñar una experiencia exige resolver también un patrón: si consultas sin patrón, la respuesta trae interaccion_no_evaluada: true y los patrones candidatos para que vuelvas a consultar con uno. Acepta la pregunta tal como la dice la gente, en castellano, portugués o inglés («cuánta plata se me fue», «levanten la mano», «how much did I spend»). Siempre incluye las restricciones duras y los cuidados del ámbito que corresponde (territorio_o_servicio | personas | datos_propios | la_sala: de quién son los datos y quién los mira): pasa ambito o nómbralo en la tarea; si no se puede resolver, entrega todas y lo declara. Con ámbito, las formas vienen ordenadas por lo que ese público lee bien desde la última fila. Sin argumentos devuelve el vocabulario completo. Es una consulta determinista, no una recomendación con juicio.',
    inputSchema: {
      type: 'object',
      properties: {
        tarea: { type: 'string' },
        proposito: { type: 'string' },
        patron: { type: 'string' },
        ambito: { type: 'string', description: 'de quién son los datos y quién los mira: territorio_o_servicio (datos públicos: comuna, manzana, consultorio), personas (otras personas que no están en la conversación: encuestados, vendedores), datos_propios (los de quien pregunta: su cartola, su perro, el excel de su trabajo) o la_sala (un curso o taller que cuenta y mira junto). Decide restricciones, cuidados y el orden de las formas.' },
      },
    },
    run: ({ tarea, proposito, patron, ambito } = {}) => {
      const g = K.grafo;
      if (!tarea && !proposito && !patron) {
        return {
          para_quien: g.para_quien ?? null,
          tareas: g.tareas, propositos: g.propositos, patrones: g.patrones,
          compromiso: g.compromiso, formas: g.formas, restricciones: g.restricciones,
          como_elegir_ambito: g.como_elegir_ambito ?? null, cuidados: g.cuidados ?? null,
          trampas_por_ambito: g.trampas_por_ambito ?? null, formas_por_ambito: g.formas_por_ambito ?? null,
          palabras_de_la_gente: g.palabras_de_la_gente ?? null,
        };
      }
      const out = {};
      // procedencia por dimensión (Sol, PR #3): cada clave interpretada dice desde qué texto y por qué camino llegó.
      const interpretado = (dim, r, desde) => {
        if (!r || !r.interpretado) return;
        out.interpretado_como = { ...(out.interpretado_como || {}), [dim]: { id: r.id, desde, por: r.por } };
      };
      // restricciones duras por ámbito (P1 de Sol: «nunca persona» chocaba con la dispersión de estudiantes). El grafo
      // (opus, 2-nov-2026) dice en `aplicabilidad` dónde aplica cada una; una que no aparece vale en todo ámbito.
      // El ámbito se resuelve por parámetro o por palabras que nombran la unidad en la tarea; si no se resuelve,
      // se entregan todas y se declara. No se adivina.
      const ambitosIds = (g.restricciones.ambitos || []).map((a) => a.id);
      const aplicabilidad = g.restricciones.aplicabilidad || {};
      let ra = ambito ? resolver(ambito, ambitosIds, 'ambito') : null;
      let resueltoPor = ra ? (ra.interpretado ? `parámetro ambito (${ra.por})` : 'parámetro ambito') : null;
      if (ambito && !ra) out.aviso_ambito = `ámbito desconocido: «${ambito}»; válidos: ${ambitosIds.join(', ')}. Se entregan todas las restricciones duras.`;
      if (!ra && !ambito && tarea) {
        const inferido = resolver(tarea, ambitosIds, 'ambito');
        if (inferido) { ra = inferido; resueltoPor = `inferido de la tarea (${inferido.por})`; }
      }
      const conAplicabilidad = (r) => (aplicabilidad[r.id] ? { ...r, aplica_en: aplicabilidad[r.id] } : r);
      if (ra && ambitosIds.length) {
        out.ambito = { id: ra.id, resuelto_por: resueltoPor };
        out.restricciones_duras = g.restricciones.duras.filter((r) => !aplicabilidad[r.id] || aplicabilidad[r.id].includes(ra.id)).map(conAplicabilidad);
        out.restricciones_fuera_de_ambito = g.restricciones.duras
          .filter((r) => aplicabilidad[r.id] && !aplicabilidad[r.id].includes(ra.id))
          .map((r) => ({ ...r, aplica_en: aplicabilidad[r.id], razon: `aplica solo en ${aplicabilidad[r.id].join(', ')}; el ámbito resuelto es ${ra.id}` }));
        // v0.2: cuidados de la vida diaria y trampas que aplican en este ámbito (grafo/trampas_por_ambito, opus).
        const tpa = (g.trampas_por_ambito || {})[ra.id];
        if (tpa) {
          out.cuidados = (tpa.cuidados || []).map((id) => (g.cuidados || []).find((c) => c.id === id) || { id }).map(({ corpus, ...c }) => c);
          out.trampas_aplicables = tpa.trampas || [];
          out.nota_ambito = tpa.nota;
          if (tpa.herramienta) out.revisar_fuente = `este ámbito usa datos públicos: pasa la fuente por ${tpa.herramienta} antes de visualizar`;
        }
      } else {
        out.ambito = null;
        out.restricciones_duras = g.restricciones.duras.map(conAplicabilidad);
        if (ambitosIds.length && !out.aviso_ambito) out.aviso_ambito = `no se pudo resolver el ámbito (unidad de análisis); se entregan todas las restricciones duras. Las que traen aplica_en valen solo en esos ámbitos: pasa ambito (${ambitosIds.join(' | ')}) o nombra la unidad en la tarea para filtrar.`;
      }
      const patronesIds = g.patrones.map((p) => (typeof p === 'string' ? p : p.id));
      if (tarea) {
        const r = resolver(tarea, g.tareas.map((t) => t.id), 'tarea');
        out.tarea = r ? r.id : tarea;
        interpretado('tarea', r, tarea);
        const ids = r ? g.aristas.tarea_forma[r.id] : null;
        // en el orden de la arista (el grafo dice qué ofrecer primero), no en el orden del bloque `formas`.
        let formas = ids ? ids.map((id) => g.formas.find((f) => f.id === id)).filter(Boolean) : null;
        // v0.2 (grafo/formas_por_ambito, opus): primero las formas que este ámbito lee bien; las que necesitan geometría
        // no se ofrecen fuera de territorio_o_servicio, y se declara. sin ámbito, el orden del grafo y un aviso.
        const fpa = g.formas_por_ambito || {};
        if (formas && ra && ra.id !== 'territorio_o_servicio' && Array.isArray(fpa.solo_con_territorio)) {
          const fuera = formas.filter((f) => fpa.solo_con_territorio.includes(f.id));
          if (fuera.length) {
            out.formas_fuera_de_ambito = fuera.map((f) => ({ id: f.id, razon: `necesita geometría del territorio; el ámbito resuelto es ${ra.id}` }));
            formas = formas.filter((f) => !fpa.solo_con_territorio.includes(f.id));
          }
        }
        // el orden del grafo manda cuando la arista ya empieza por una forma de la vida (estimar, proyectar, leer: las escribió
        // opus pensando en esta gente). `primero` reordena las aristas de v0.1, donde isotype y dorling iban adelante.
        const aristaYaEsDeLaVida = formas && formas.length && Object.hasOwn(formas[0], 'ultima_fila');
        if (formas && ra && !aristaYaEsDeLaVida && fpa.primero && Array.isArray(fpa.primero[ra.id])) {
          const orden = fpa.primero[ra.id];
          const pos = (f) => { const i = orden.indexOf(f.id); return i === -1 ? orden.length + (f.ultima_fila ? 0 : 1) : i; };
          formas = [...formas].sort((a, b) => pos(a) - pos(b));
          out.formas_ordenadas_por = `formas_por_ambito.primero.${ra.id} del grafo; después las demás, las legibles desde la última fila antes`;
        }
        out.formas = formas;
        if (!r) out.aviso_tarea = `tarea desconocida; válidas: ${g.tareas.map((t) => `${t.id} (${t.desc})`).join(', ')}`;
        else if (!ids) out.aviso_tarea = `la tarea ${r.id} está en el vocabulario pero todavía no tiene formas asociadas; crece por PR`;
      }
      if (proposito) {
        const r = resolver(proposito, g.propositos.map((p) => p.id), 'proposito');
        out.proposito = r ? r.id : proposito;
        interpretado('proposito', r, proposito);
        const ids = r ? g.aristas.proposito_tecnica[r.id] : null;
        out.tecnicas = ids ? K.tecnicas.filter((t) => ids.includes(t.id)) : null;
        if (!r) out.aviso_proposito = `propósito desconocido; válidos: ${g.propositos.map((p) => `${p.id} (${p.desc})`).join(', ')}`;
        else if (!ids) out.aviso_proposito = `el propósito ${r.id} está en el vocabulario pero todavía no tiene técnicas asociadas; crece por PR`;
      }
      if (!proposito && tarea) {
        // v0.2: si la pregunta trae la voz de PARA_QUIEN.md («no soy de números», «me da risa»), se sugiere el propósito. no se impone.
        const ps = resolver(tarea, g.propositos.map((p) => p.id), 'proposito');
        if (ps && ps.interpretado && ['jugar', 'perder_el_miedo'].includes(ps.id)) {
          const idsT = g.aristas.proposito_tecnica[ps.id];
          out.proposito_sugerido = { id: ps.id, por: ps.por, tecnicas: idsT ? K.tecnicas.filter((t) => idsT.includes(t.id)).map((t) => t.id) : [] };
        }
      }
      if (patron) {
        const r = resolver(patron, patronesIds, 'patron');
        out.patron = r ? r.id : patron;
        interpretado('patron', r, patron);
        if (!r) out.aviso_patron = `patrón desconocido; válidos: ${patronesIds.join(', ')}`;
        const piso = r ? (g.aristas.patron_compromiso[r.id] ?? 'sin arista todavía') : null;
        out.compromiso_esperado = piso; // piso ICAP del grafo (INFERENCIA de la pluma del grafo); la VES lo lee como piso, no como igualdad
        if (r && INTERACCION[r.id]) {
          out.interaccion_requerida = true;
          out.estados_minimos = INTERACCION[r.id];
          out.si_no_puedes_interactuar = SIN_INTERACCION;
        } else if (r) {
          out.interaccion_requerida = false;
        }
        if (r) out.hay_experiencia = Boolean(OPERACION[r.id] && OPERACION[r.id].tipo !== 'ninguna');
        if (r && OPERACION[r.id]) {
          out.operacion_cognitiva_minima = OPERACION[r.id].tipo;
          out.que_produce_la_persona = OPERACION[r.id].minimo;
          const efectivo = compromisoConContrato(piso, OPERACION[r.id]);
          if (efectivo) {
            out.compromiso_con_contrato = efectivo;
            if (efectivo !== piso) out.nota_compromiso = `el grafo pone piso ${piso}; cumpliendo los estados mínimos de este contrato (operación «${OPERACION[r.id].tipo}») el compromiso efectivo es ${efectivo}. Si no pides esa operación, declara ${piso}.`;
          }
          if (!out.interaccion_requerida) out.si_no_hay_operacion = `una pieza estática que no pide esta operación a quien lee no cumple el patrón: declara el compromiso real (pasivo), no el piso del grafo.`;
        }
        out.referentes = r ? K.referentes.filter((x) => (x.patron || []).includes(r.id)) : [];
      } else {
        // Sol, PR #3: sin patrón, el contrato de interacción no existe y hay que decirlo. No hay arista tarea→patrón ni
        // propósito→patrón en el grafo (crece por PR), así que los candidatos son todos, con su piso y su contrato.
        out.interaccion_no_evaluada = true;
        out.hay_experiencia = false; // 0.2.1: sin patrón no hay experiencia, hay un gráfico. dicho en booleano, no solo en el aviso.
        out.por_que_no_hay_experiencia = 'sin patrón pedagógico no hay operación cognitiva que la persona produzca: hay una lámina. Resuelve un patrón o llámalo gráfico.';
        out.aviso_patron = 'consultaste sin patrón: la dimensión pedagógica quedó sin evaluar. Diseñar una experiencia exige resolver un patrón; elige uno de patrones_candidatos y vuelve a consultar con patron. Si vas a entregar algo estático sin patrón, no lo llames experiencia.';
        out.patrones_candidatos = patronesIds.map((id) => ({
          id,
          compromiso_esperado: g.aristas.patron_compromiso[id] ?? 'sin arista todavía',
          interaccion_requerida: Boolean(INTERACCION[id]),
          operacion_cognitiva_minima: OPERACION[id]?.tipo ?? null,
        }));
      }
      // 0.2.1 (prueba de un sonnet, 2-nov-2026, 19:29): pasó ids válidos y la pregunta igual no encajaba, y el conector no dijo nada.
      // el conector no puede saber que nada encaja cuando los ids existen, así que el pedido va siempre, corto; largo cuando algo falló.
      const noEncajo = (tarea && (out.formas === null)) || (proposito && out.tecnicas === null) || (patron && out.aviso_patron && /desconocido/.test(out.aviso_patron));
      out.si_nada_encaja = noEncajo ? SI_NADA_ENCAJA : SI_NADA_ENCAJA_CORTO;
      // restricciones y cuidados que calzan con las palabras de la pregunta, pegados a ella (misma prueba: «lo que más importaba llegó como lista aparte»).
      const texto = [tarea, proposito].filter(Boolean).join(' ');
      if (texto) {
        const ts = new Set(tokens(texto).filter((w) => w.length >= 4));
        const calza = (obj) => tokens(JSON.stringify(obj)).filter((w) => w.length >= 4 && ts.has(w));
        const destacar = (lista) => (lista || []).map((o) => ({ o, porque: [...new Set(calza(o))] })).filter((x) => x.porque.length).sort((a, b) => b.porque.length - a.porque.length).slice(0, 4).map(({ o, porque }) => ({ id: o.id, desc: o.desc ?? o.que_hacer ?? null, porque }));
        const dr = destacar(out.restricciones_duras);
        const dc = destacar(out.cuidados);
        if (dr.length || dc.length) out.para_esta_pregunta = { restricciones: dr, cuidados: dc, nota: 'calzan con palabras de tu pregunta; las demás siguen aplicando' };
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
      if (!referentes.length) {
        out.sugerencia = 'El catálogo indexa piezas por operación cognitiva (predecir, comparar, situarse), no por tema ni tipo de gráfico. Prueba consultar_grafo con la tarea de tu pregunta, o busca por patrón: ' + K.grafo.patrones.map((p) => (typeof p === 'string' ? p : p.id)).join(', ');
        out.si_nada_encaja = SI_NADA_ENCAJA;
      }
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
      if (!tecnicas.length) {
        out.sugerencia = 'No hay una técnica con esas palabras. El catálogo no lista tipos de gráfico corrientes (barras, torta, líneas) sino técnicas para que una experiencia se entienda y se recuerde. Pide consultar_grafo con tu tarea (magnitud, comparar, cambio, parte_todo…) y de ahí sal a las técnicas por propósito.';
        out.si_nada_encaja = SI_NADA_ENCAJA;
      }
      return out;
    },
  },
  {
    name: 'principios',
    description: 'Devuelve los principios del motor (PR-01…), cada uno con su enunciado, su evidencia y cómo verificar que se cumple.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ principios: K.principios, si_nada_encaja: SI_NADA_ENCAJA_CORTO }),
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
          (K.grafo.para_quien ? K.grafo.para_quien.trim().split('\n')[0] + ' ' : '') +
          'Habla con la gente en el idioma en que te pregunte: consultar_grafo entiende palabras de la vida en castellano, portugués e inglés y responde con los ids del grafo. Pregunta primero, gráfico después. Usa revisar_fuente antes de visualizar datos públicos; consultar_grafo para pasar de la pregunta a la forma; principios para el checklist. Diseñar una experiencia exige resolver también un patrón pedagógico: consulta consultar_grafo con patron, no solo con tarea. Si la respuesta trae interaccion_no_evaluada: true, todavía no tienes contrato; elige un patrón de patrones_candidatos y vuelve a consultar. Si trae interaccion_requerida: true, la salida tiene que ser interactiva o declarar degradado_a_estatico con su razón. Si trae operacion_cognitiva_minima, la pieza tiene que pedirle a la persona esa operación (predecir, explicar) o declarar el compromiso real, no el piso del grafo. Las restricciones duras dependen de la unidad de análisis: pasa ambito (territorio_o_servicio | personas) o nómbrala en la tarea; si la respuesta trae ambito: null, te llegaron todas y tú decides cuáles aplican. Si en alguna respuesta aparece si_nada_encaja, léelo: es un pedido de la casa, no una regla. Todo sale del repo motor-de-experiencias-de-datos (commit ' + K.commit + ').',
      });
    }
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;
    case 'ping':
      return ok(id, {});
    case 'tools/list':
      // todas las herramientas son consultas sobre conocimiento compilado: no escriben, no tocan el mundo exterior, son deterministas.
      return ok(id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
          annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
        })),
      });
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
