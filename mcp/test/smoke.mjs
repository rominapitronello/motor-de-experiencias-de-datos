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

console.log(fallas ? `\n${fallas} falla(s)` : '\ntodo en orden');
process.exit(fallas ? 1 : 0);
