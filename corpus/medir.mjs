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

const filas = [];
for (const f of readdirSync('corpus').filter((x) => x.endsWith('.json') && x !== 'medicion.json').sort()) {
  const d = JSON.parse(readFileSync(`corpus/${f}`, 'utf8'));
  for (const p of d.preguntas) {
    const r = await call({ tarea: p.pregunta });
    filas.push({
      id: p.id, persona: d.persona, pregunta: p.pregunta,
      tarea: r.aviso_tarea && /desconocida/.test(r.aviso_tarea) ? null : r.tarea,
      por: r.interpretado_como?.tarea?.por ?? null,
      formas: (r.formas || []).map((x) => x.id),
      ambito: r.ambito?.id ?? null,
    });
  }
}
const n = filas.length;
const entendidas = filas.filter((x) => x.tarea);
const porTarea = {};
for (const x of entendidas) porTarea[x.tarea] = (porTarea[x.tarea] || 0) + 1;
const porPersona = {};
for (const x of filas) { porPersona[x.persona] ??= { total: 0, entendidas: 0 }; porPersona[x.persona].total++; if (x.tarea) porPersona[x.persona].entendidas++; }
const conAmbito = filas.filter((x) => x.ambito).length;
const resumen = { commit, medido: new Date().toISOString(), preguntas: n, con_tarea: entendidas.length, sin_tarea: n - entendidas.length, con_ambito: conAmbito, por_tarea: porTarea, por_persona: porPersona };
writeFileSync('corpus/medicion.json', JSON.stringify({ resumen, filas }, null, 2));
console.log(JSON.stringify(resumen, null, 2));
