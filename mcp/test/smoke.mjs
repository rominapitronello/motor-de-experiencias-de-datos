// prueba de humo: llama al worker en proceso, sin red ni Cloudflare. falla con código 1 si algo no calza.
import worker from '../src/index.js';

let fallas = 0;
const check = (cond, msg) => { console.log(`${cond ? 'ok  ' : 'FALLA'} ${msg}`); if (!cond) fallas++; };
const rpc = async (method, params, id = 1) => {
  const res = await worker.fetch(new Request('https://x/mcp', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(id === null ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id, method, params }),
  }));
  return res.status === 202 ? { status: 202 } : { status: res.status, ...(await res.json()) };
};
const call = async (name, args) => (await rpc('tools/call', { name, arguments: args })).result;

const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } });
check(init.result?.serverInfo?.name === 'experiencias-datos', 'initialize devuelve serverInfo');
check(init.result?.protocolVersion === '2025-06-18', 'negocia la versión de protocolo pedida');
check((await rpc('notifications/initialized', {}, null)).status === 202, 'notificación → 202 sin cuerpo');

const list = await rpc('tools/list', {});
const nombres = list.result.tools.map((t) => t.name);
check(['revisar_fuente', 'listar_trampas', 'consultar_grafo', 'buscar_referentes', 'buscar_tecnicas', 'principios'].every((n) => nombres.includes(n)), `tools/list: ${nombres.join(', ')}`);

const r1 = await call('revisar_fuente', { descripcion: 'base del censo 2024 por manzana del INE', columnas: ['CUT', 'CONTENEDOR_COMUNAL', 'n_per', 'n_asistencia_basica'] });
const ids1 = r1.structuredContent.hallazgos.map((h) => h.id);
check(ids1.includes('TR-01') && ids1.includes('TR-06'), `revisar_fuente (censo) detecta TR-01 y TR-06 → ${ids1.join(', ')}`);

const r2 = await call('revisar_fuente', { descripcion: 'quiero comparar el IGVUST de este mes con el anterior por cuartil' });
check(r2.structuredContent.hallazgos.some((h) => h.id === 'TR-04'), 'revisar_fuente (IGVUST) detecta TR-04');

const r3 = await call('revisar_fuente', { descripcion: 'encuesta de satisfacción de clientes de una panadería' });
check(r3.structuredContent.hallazgos.length === 0 && /no significa que no haya/.test(r3.structuredContent.nota), 'revisar_fuente sin coincidencias: null honesto');

const r4 = await call('revisar_fuente', {});
check(r4.isError === true, 'revisar_fuente vacío → isError');

const g = await call('consultar_grafo', { tarea: 'magnitud', proposito: 'escala_humana', patron: 'predict_reveal' });
check(g.structuredContent.formas.some((f) => f.id === 'unit_chart'), 'grafo: magnitud → unit_chart');
check(g.structuredContent.tecnicas.some((t) => t.id === 'T-02'), 'grafo: escala_humana → T-02');
check(g.structuredContent.compromiso_esperado === 'constructivo', 'grafo: predict_reveal → constructivo');
check(g.structuredContent.restricciones_duras.length > 0, 'grafo: siempre trae restricciones duras');

const ref = await call('buscar_referentes', { patron: 'predict_reveal' });
check(ref.structuredContent.referentes.some((r) => r.id === 'P-04'), 'referentes por patrón: predict_reveal → P-04');

const pr = await call('principios', {});
check(pr.structuredContent.principios.length >= 10 && pr.structuredContent.principios.every((p) => p.como_verificar), `principios: ${pr.structuredContent.principios.length}, todos con cómo verificar`);

const desconocida = await rpc('tools/call', { name: 'dame_un_grafico', arguments: {} });
check(desconocida.error?.code === -32602, 'herramienta desconocida → -32602');
check((await rpc('metodo/inexistente', {})).error?.code === -32601, 'método desconocido → -32601');

const get = await worker.fetch(new Request('https://x/mcp'));
check(get.status === 405, 'GET /mcp → 405');


// segunda pluma (fable), 24-sep-2026: tolerancia a palabras cotidianas, mayúsculas y tildes.
const s1 = await call('consultar_grafo', { tarea: 'tendencia' });
check(s1.structuredContent.tarea === 'cambio' && s1.structuredContent.interpretado_como?.tarea?.desde === 'tendencia', 'grafo: "tendencia" → cambio, declarado en interpretado_como.tarea');
const s2 = await call('consultar_grafo', { tarea: 'COMPARAR', proposito: 'que mis alumnos entiendan', patron: 'Predict Reveal' });
check(s2.structuredContent.tarea === 'comparar' && s2.structuredContent.proposito === 'escala_humana' && s2.structuredContent.patron === 'predict_reveal', 'grafo: mayúsculas, sinónimos y espacios se resuelven');
const s3 = await call('consultar_grafo', { tarea: 'flujo' });
check(Array.isArray(s3.structuredContent.formas), 'grafo: tarea del vocabulario responde con formas');
const s4 = await call('consultar_grafo', { tarea: 'asdf' });
check(s4.structuredContent.formas === null && /desconocida/.test(s4.structuredContent.aviso_tarea), 'grafo: tarea inventada → aviso con las válidas');
const s5 = await call('buscar_tecnicas', { texto: 'gráfico de barras apiladas' });
check(Array.isArray(s5.structuredContent.tecnicas), 'técnicas: búsqueda por palabras no revienta');
const s6 = await call('buscar_referentes', { texto: 'notas de mi curso' });
check(s6.structuredContent.referentes.length === 0 && /operación cognitiva/.test(s6.structuredContent.sugerencia), 'referentes: sin resultados trae sugerencia, no silencio');


// fable, 25-sep-2026: contrato de interacción (cicatriz de Sol) y piso convencional.
const i1 = await call('consultar_grafo', { patron: 'predict_reveal' });
check(i1.structuredContent.interaccion_requerida === true && i1.structuredContent.estados_minimos.length >= 3 && /degradado_a_estatico/.test(i1.structuredContent.si_no_puedes_interactuar), 'grafo: predict_reveal exige interacción y declara estados mínimos');
const i2 = await call('consultar_grafo', { patron: 'claim_evidence_limit' });
check(i2.structuredContent.interaccion_requerida === false, 'grafo: claim_evidence_limit no exige interacción');
const i3 = await call('consultar_grafo', { tarea: 'scatter de notas vs asistencia' });
check(i3.structuredContent.tarea === 'relacionar' && i3.structuredContent.formas.some((f) => f.id === 'dispersion'), 'grafo: "scatter" → relacionar → dispersion');
const i4 = await call('consultar_grafo', { tarea: 'histograma' });
check(i4.structuredContent.tarea === 'distribucion' && i4.structuredContent.formas.some((f) => f.id === 'histograma'), 'grafo: distribucion ya tiene aristas');
const i5 = await call('consultar_grafo', { tarea: 'ventas mes a mes' });
check(i5.structuredContent.formas.some((f) => f.id === 'serie_temporal'), 'grafo: "mes a mes" → serie_temporal');


// fable, PR #3, 2-nov-2026: los pedidos de Sol (25-sep y 2-nov). Cada negativo dice por qué tiene que fallar.

// P1: sin patrón no hay contrato, y se declara.
const c1 = await call('consultar_grafo', { tarea: 'magnitud', proposito: 'escala_humana' });
check(c1.structuredContent.interaccion_no_evaluada === true && /sin patrón/.test(c1.structuredContent.aviso_patron), 'grafo: {tarea, proposito} sin patrón → interaccion_no_evaluada: true con aviso');
check(Array.isArray(c1.structuredContent.patrones_candidatos) && c1.structuredContent.patrones_candidatos.length === 10 && c1.structuredContent.patrones_candidatos.every((p) => 'compromiso_esperado' in p && 'interaccion_requerida' in p), 'grafo: sin patrón trae los 10 patrones candidatos con piso y si exigen interacción');
check(c1.structuredContent.interaccion_requerida === undefined, 'grafo: sin patrón NO inventa interaccion_requerida (ni true ni false)');
const c2 = await call('consultar_grafo', { tarea: 'magnitud', patron: 'predict_reveal' });
check(c2.structuredContent.interaccion_no_evaluada === undefined && c2.structuredContent.interaccion_requerida === true, 'grafo: con patrón, interaccion_no_evaluada no aparece');
check(/resolver también un patrón/.test(init.result.instructions) && /interaccion_no_evaluada/.test(init.result.instructions), 'initialize: las instructions exigen resolver un patrón y nombran interaccion_no_evaluada');

// P1: procedencia por dimensión. Antes, `desde` se pisaba: con tres interpretaciones quedaba solo la última.
const c3 = await call('consultar_grafo', { tarea: 'tendencia', proposito: 'que mis alumnos entiendan', patron: 'Predict Reveal' });
const ic = c3.structuredContent.interpretado_como;
check(ic?.tarea?.desde === 'tendencia' && ic?.proposito?.desde === 'que mis alumnos entiendan' && ic?.patron?.desde === 'Predict Reveal', 'grafo: interpretado_como guarda `desde` por dimensión, ninguna pisa a otra');
check(ic?.tarea?.id === 'cambio' && ic?.proposito?.id === 'escala_humana' && ic?.patron?.id === 'predict_reveal', 'grafo: interpretado_como guarda `id` por dimensión');
check(/sinónimo/.test(ic?.tarea?.por) && /vocabulario/.test(ic?.patron?.por), 'grafo: interpretado_como dice por qué camino llegó (sinónimo vs id normalizado)');
check(!('desde' in (ic || {})), 'grafo: interpretado_como ya no tiene un `desde` suelto a nivel raíz');

// P2: compromiso con contrato. manipulate_observe: piso activo en el grafo; con hipótesis escrita (prediccion) el efectivo es constructivo.
const c4 = await call('consultar_grafo', { patron: 'manipulate_observe' });
check(c4.structuredContent.compromiso_esperado === 'activo' && c4.structuredContent.compromiso_con_contrato === 'constructivo' && c4.structuredContent.operacion_cognitiva_minima === 'prediccion' && /piso activo/.test(c4.structuredContent.nota_compromiso), 'grafo: manipulate_observe declara piso activo y compromiso_con_contrato constructivo, con nota');
check(c4.structuredContent.estados_minimos?.[0]?.includes('hipótesis'), 'grafo: manipulate_observe conserva la hipótesis escrita como estado mínimo (no opcional)');
check(i1.structuredContent.compromiso_con_contrato === 'constructivo' && i1.structuredContent.nota_compromiso === undefined, 'grafo: predict_reveal piso constructivo = efectivo, sin nota');

// nota de Sol (2-nov): claim_evidence_limit es estático legítimo con piso constructivo; la operación mínima es una explicación producida por quien lee.
check(i2.structuredContent.operacion_cognitiva_minima === 'explicacion' && /afirmación, evidencia y límite/.test(i2.structuredContent.que_produce_la_persona), 'grafo: claim_evidence_limit declara operacion_cognitiva_minima explicacion y qué produce la persona');
check(/pasivo/.test(i2.structuredContent.si_no_hay_operacion), 'grafo: claim_evidence_limit sin la operación → declarar pasivo, no el piso');
const ves = ['ninguna', 'filtro', 'prediccion', 'explicacion', 'exploracion'];
check((c1.structuredContent.patrones_candidatos ?? []).length > 0 && c1.structuredContent.patrones_candidatos.every((p) => p.operacion_cognitiva_minima === null || ves.includes(p.operacion_cognitiva_minima)), 'grafo: toda operacion_cognitiva_minima está en el vocabulario de ves/schema.json interaccion.tipo');

// P2: parser por tokens. Negativos: cada uno nombra la subcadena que antes calzaba por error.
const n1 = await call('consultar_grafo', { tarea: 'piedras por comuna' });
check(n1.structuredContent.tarea !== 'parte_todo' && /desconocida/.test(n1.structuredContent.aviso_tarea), 'parser negativo: "piedras" NO es parte_todo (antes calzaba «pie» como subcadena) → tarea desconocida con aviso');
const n2 = await call('consultar_grafo', { tarea: 'topografia del cerro' });
check(n2.structuredContent.tarea !== 'ordenar' && /desconocida/.test(n2.structuredContent.aviso_tarea), 'parser negativo: "topografia" NO es ordenar (antes calzaba «top») → tarea desconocida con aviso');
const n3 = await call('consultar_grafo', { tarea: 'totalmente distinto' });
check(n3.structuredContent.tarea !== 'magnitud' && /desconocida/.test(n3.structuredContent.aviso_tarea), 'parser negativo: "totalmente" NO es magnitud (antes calzaba «total») → tarea desconocida con aviso');
const n4 = await call('consultar_grafo', { tarea: 'poblacion estadounidense en chile' });
check(n4.structuredContent.tarea !== 'estado' && /desconocida/.test(n4.structuredContent.aviso_tarea), 'parser negativo: "estadounidense" NO es estado (el fallback por id también era subcadena: «estado») → tarea desconocida con aviso');
const p1 = await call('consultar_grafo', { tarea: 'notas vs asistencia' });
check(p1.structuredContent.tarea === 'comparar', 'parser positivo: "vs" como token sigue resolviendo comparar');
const p2 = await call('consultar_grafo', { tarea: 'matricula antes y despues de la pandemia' });
check(p2.structuredContent.tarea === 'cambio' && /antes y despues/.test(p2.structuredContent.interpretado_como?.tarea?.por), 'parser positivo: sinónimo de varias palabras ("antes y despues") sigue resolviendo como secuencia de tokens');
const p3 = await call('consultar_grafo', { tarea: 'Parte-Todo' });
check(p3.structuredContent.tarea === 'parte_todo', 'parser positivo: id con guion y mayúsculas sigue resolviendo exacto');


// fable (procedencia), PR #3, 2-nov-2026: restricciones duras por ámbito (P1 de Sol; aplicabilidad en el grafo por opus 5.5).
// Regresión que pidió opus: el caso escolar (personas) contra uno territorial, y que las restricciones difieran.
const voc = await call('consultar_grafo', {});
const todasDuras = voc.structuredContent.restricciones.duras.map((r) => r.id);
check(Array.isArray(voc.structuredContent.restricciones.ambitos) && voc.structuredContent.restricciones.aplicabilidad, 'grafo: el vocabulario trae ambitos y aplicabilidad');
const esc = await call('consultar_grafo', { tarea: 'scatter de notas vs asistencia', ambito: 'estudiantes' });
const escIds = esc.structuredContent.restricciones_duras.map((r) => r.id);
check(esc.structuredContent.ambito?.id === 'personas' && /parámetro/.test(esc.structuredContent.ambito.resuelto_por), 'ámbito: "estudiantes" por parámetro → personas, con procedencia');
check(!escIds.includes('sin_datos_personales') && !escIds.includes('tres_nadas') && escIds.includes('sin_identificables'), 'ámbito personas: NO entrega sin_datos_personales ni tres_nadas (son territoriales); SÍ entrega sin_identificables');
const fuera = esc.structuredContent.restricciones_fuera_de_ambito ?? [];
check(fuera.length === 2 && fuera.map((r) => r.id).sort().join(',') === 'sin_datos_personales,tres_nadas' && fuera.every((r) => /aplica solo en territorio_o_servicio/.test(r.razon)), 'ámbito personas: las excluidas se declaran con su razón, no desaparecen en silencio');
const ter = await call('consultar_grafo', { tarea: 'hacinamiento por unidad vecinal', ambito: 'territorio_o_servicio' });
const terIds = ter.structuredContent.restricciones_duras.map((r) => r.id);
check(ter.structuredContent.ambito?.id === 'territorio_o_servicio' && terIds.includes('sin_datos_personales') && terIds.includes('tres_nadas') && terIds.includes('sin_identificables') && ter.structuredContent.restricciones_fuera_de_ambito?.length === 0, 'ámbito territorial: entrega todas, incluidas las dos acotadas, y nada queda fuera');
check(terIds.length === todasDuras.length && escIds.length === todasDuras.length - 2 && escIds.join(',') !== terIds.join(','), 'regresión: el caso escolar y el territorial reciben restricciones distintas (escolar = todas menos las dos territoriales)');
const inf = await call('consultar_grafo', { tarea: 'dispersion de notas vs asistencia por estudiante' });
check(inf.structuredContent.ambito?.id === 'personas' && /inferido de la tarea/.test(inf.structuredContent.ambito.resuelto_por) && !inf.structuredContent.restricciones_duras.some((r) => r.id === 'sin_datos_personales'), 'ámbito: "por estudiante" en la tarea se infiere como personas y filtra');
const sinAmb = await call('consultar_grafo', { tarea: 'magnitud' });
check(sinAmb.structuredContent.ambito === null && sinAmb.structuredContent.restricciones_duras.length === todasDuras.length && /no se pudo resolver el ámbito/.test(sinAmb.structuredContent.aviso_ambito), 'ámbito sin resolver: NO adivina, entrega todas y lo declara en aviso_ambito');
check(sinAmb.structuredContent.restricciones_duras.filter((r) => r.aplica_en).map((r) => r.id).sort().join(',') === 'sin_datos_personales,tres_nadas', 'ámbito sin resolver: las acotadas llevan aplica_en para que el modelo decida');
const marte = await call('consultar_grafo', { tarea: 'magnitud', ambito: 'marte' });
check(marte.structuredContent.ambito === null && /desconocido: «marte»/.test(marte.structuredContent.aviso_ambito) && marte.structuredContent.restricciones_duras.length === todasDuras.length, 'ámbito negativo: "marte" NO se resuelve (no es ámbito ni sinónimo) → aviso con los válidos y todas las restricciones');
check(!('sin_datos_personales' in Object.fromEntries(escIds.map((i) => [i, 1]))) && 'sin_datos_personales' in Object.fromEntries(terIds.map((i) => [i, 1])), 'la línea «nunca persona» de Opus sigue intacta en el grafo y solo se entrega en territorio_o_servicio');


// romina, 2-nov-2026, 18:46: si nada encaja, que el conector pida permiso al humano para contarnos. va solo donde algo no encajó.
check(/contacto@pasaelfiltro\.cl/.test(s4.structuredContent.si_nada_encaja) && /no pasa nada/.test(s4.structuredContent.si_nada_encaja), 'si_nada_encaja: tarea desconocida trae el pedido de feedback, en la voz de romina');
check(s6.structuredContent.si_nada_encaja !== undefined, 'si_nada_encaja: referentes vacíos también lo traen');
check(g.structuredContent.si_nada_encaja === undefined && esc.structuredContent.si_nada_encaja === undefined, 'si_nada_encaja: NO aparece cuando la consulta encajó (sería ruido)');
check(/si_nada_encaja/.test(init.result.instructions), 'initialize: las instructions avisan que si_nada_encaja es un pedido, no una regla');


// fable (procedencia), 2-nov-2026, noche: conector 0.2 sobre el grafo v0.2 de opus (pr #18) y PARA_QUIEN.md.
const v1 = await call('consultar_grafo', { tarea: 'cuánta plata se me fue en comida al paso el mes pasado, de verdad' });
check(v1.structuredContent.tarea === 'magnitud' && v1.structuredContent.ambito?.id === 'datos_propios', 'v0.2: «cuánta plata se me fue» → magnitud, ámbito datos_propios (la primera pregunta de romina al conector)');
check(v1.structuredContent.formas[0].id === 'cifra_grande' && !v1.structuredContent.formas.some((f) => f.id === 'dorling'), 'v0.2: para la cartola, la primera forma es cifra_grande y dorling no se ofrece (necesita territorio)');
check(v1.structuredContent.formas_fuera_de_ambito.some((f) => f.id === 'dorling' && /territorio/.test(f.razon)), 'v0.2: dorling queda declarado en formas_fuera_de_ambito con su razón');
check(Array.isArray(v1.structuredContent.cuidados) && v1.structuredContent.cuidados.some((c) => c.id === 'CU-04'), 'v0.2: datos_propios trae los cuidados de la vida diaria (CU-04: la categoría la pone quien lee)');
check(v1.structuredContent.trampas_aplicables.length === 0 && /no aplican/.test(v1.structuredContent.nota_ambito), 'v0.2: en datos_propios las TR-xx no aplican y se dice');
const v2 = await call('consultar_grafo', { tarea: 'chiquillos, levanten la mano los que trajeron fruta de colación' });
check(v2.structuredContent.ambito?.id === 'la_sala' && v2.structuredContent.formas[0].id === 'palitos', 'v0.2: «levanten la mano» → la_sala, primera forma palitos');
check(v2.structuredContent.restricciones_duras.some((r) => r.id === 'en_la_sala_nadie_senalado') && !v2.structuredContent.restricciones_duras.some((r) => r.id === 'sin_datos_personales'), 'v0.2: la_sala trae en_la_sala_nadie_senalado y deja fuera «nunca persona»');
const v3 = await call('consultar_grafo', { tarea: 'quanto dinheiro gastei em delivery no mês passado' });
check(v3.structuredContent.tarea === 'magnitud' && /quanto/.test(v3.structuredContent.interpretado_como.tarea.por), 'v0.2: portugués → magnitud, con procedencia');
const v4 = await call('consultar_grafo', { tarea: 'how many times did I open the fridge today' });
check(v4.structuredContent.tarea === 'magnitud', 'v0.2: inglés → magnitud');
const v5 = await call('consultar_grafo', { tarea: 'si sigo gastando así, cuándo me quedo sin plata en la tarjeta' });
check(v5.structuredContent.tarea === 'proyectar' && v5.structuredContent.formas[0].id === 'linea_con_proyeccion', 'v0.2: «si sigo así» → proyectar → linea_con_proyeccion');
const v6 = await call('consultar_grafo', { tarea: 'perdona la pregunta tonta pero no entiendo este gráfico que me mandó el banco' });
check(v6.structuredContent.tarea === 'leer' && v6.structuredContent.proposito_sugerido?.id === 'perder_el_miedo', 'v0.2: «no entiendo este gráfico» → leer, y sugiere el propósito perder_el_miedo sin imponerlo');
const v7 = await call('consultar_grafo', { tarea: 'cuántos niños hay en la comuna por unidad vecinal' });
check(v7.structuredContent.ambito?.id === 'territorio_o_servicio' && v7.structuredContent.formas.some((f) => f.id === 'dorling') && v7.structuredContent.formas_fuera_de_ambito === undefined, 'v0.2: en territorio, dorling sigue ofreciéndose y nada queda fuera');
check(/para personas que creen que los gráficos le pasan a la gente importante/.test(init.result.instructions), 'initialize: las instructions empiezan por para_quien del grafo');
const voc2 = await call('consultar_grafo', {});
check(typeof voc2.structuredContent.para_quien === 'string' && voc2.structuredContent.palabras_de_la_gente && voc2.structuredContent.cuidados, 'vocabulario: trae para_quien, palabras_de_la_gente y cuidados');

console.log(fallas ? `\n${fallas} falla(s)` : '\ntodo en orden');
process.exit(fallas ? 1 : 0);
