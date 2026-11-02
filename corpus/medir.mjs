// mide cuántas preguntas del corpus entiende el conector tal como está en este commit.
// fable (procedencia), 2-nov-2026. uso: node corpus/medir.mjs  (requiere mcp/src/knowledge.json compilado: npm --prefix mcp run build)
// no es una prueba: es una medición. el resultado va a corpus/medicion.json con el commit, para comparar entre versiones.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import worker from '../mcp/src/index.js';

const call = async (args) => {
  const res = await worker.fetch(new Request('https://x/mcp', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'consultar_grafo', arguments: args } }),
  }));
  return (await res.json()).result.structuredContent;
};

let commit = 'sin-git';
try { commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}

// criterio de verdad: corpus/anotacion-opus.json (opus 5.5, pr #18). si existe, se mide contra él; si no, solo se cuenta.
let anot = {};
try { for (const a of JSON.parse(readFileSync('corpus/anotacion-opus.json', 'utf8')).filas) anot[a.id] = a; } catch {}

const filas = [];
for (const f of readdirSync('corpus').filter((x) => x.endsWith('.json') && !['medicion.json', 'anotacion-opus.json'].includes(x)).sort()) {
  const d = JSON.parse(readFileSync(`corpus/${f}`, 'utf8'));
  for (const p of d.preguntas) {
    const r = await call({ tarea: p.pregunta });
    const a = anot[p.id];
    const tarea = r.aviso_tarea && /desconocida/.test(r.aviso_tarea) ? null : r.tarea;
    const formas = (r.formas || []).map((x) => x.id);
    const ambito = r.ambito?.id ?? null;
    filas.push({
      id: p.id, persona: d.persona, pregunta: p.pregunta,
      tarea, por: r.interpretado_como?.tarea?.por ?? null, formas, ambito,
      proposito_sugerido: r.proposito_sugerido?.id ?? null,
      esperado: a ? { tarea: a.tarea, ambito: a.ambito, forma: a.forma } : null,
      acierto: a ? { tarea: a.tarea === tarea, ambito: a.ambito === ambito, forma_en_primeras_3: a.forma ? formas.slice(0, 3).includes(a.forma) : null } : null,
    });
  }
}
const n = filas.length;
const entendidas = filas.filter((x) => x.tarea);
const porTarea = {};
for (const x of entendidas) porTarea[x.tarea] = (porTarea[x.tarea] || 0) + 1;
const porPersona = {};
for (const x of filas) { porPersona[x.persona] ??= { total: 0, entendidas: 0, tarea_ok: 0, ambito_ok: 0 }; porPersona[x.persona].total++; if (x.tarea) porPersona[x.persona].entendidas++; if (x.acierto?.tarea) porPersona[x.persona].tarea_ok++; if (x.acierto?.ambito) porPersona[x.persona].ambito_ok++; }
const conAmbito = filas.filter((x) => x.ambito).length;
const conAnot = filas.filter((x) => x.esperado);
const resumen = {
  commit, medido: new Date().toISOString(), preguntas: n,
  con_tarea: entendidas.length, sin_tarea: n - entendidas.length, con_ambito: conAmbito,
  formas_de_lo_hermida_en_magnitud: filas.filter((x) => x.tarea === 'magnitud' && ['unit_chart', 'dorling'].includes(x.formas[0])).length,
  contra_anotacion_opus: conAnot.length ? {
    tarea_igual: conAnot.filter((x) => x.acierto.tarea).length,
    ambito_igual: conAnot.filter((x) => x.acierto.ambito).length,
    forma_esperada_en_primeras_3: conAnot.filter((x) => x.acierto.forma_en_primeras_3).length,
    de: conAnot.length,
  } : null,
  por_tarea: porTarea, por_persona: porPersona,
};
writeFileSync('corpus/medicion.json', JSON.stringify({ resumen, filas }, null, 2));
console.log(JSON.stringify(resumen, null, 2));
