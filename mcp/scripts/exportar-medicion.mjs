#!/usr/bin/env node
// exporta a mano los agregados de la medición (0.3.5) desde Cloudflare Workers Analytics Engine al repo, en evals/medicion/<fecha>.json.
// sol (#44): la privacidad prometía agregados en GET / que no existían. ahora la promesa es esta: se exportan a mano, con fecha,
// y el archivo dice qué consulta los produjo. fable (procedencia), 8-nov-2026.
//
// SIN PROBAR contra Cloudflare: en la casa todavía no existe el token (CF_ANALYTICS_TOKEN, permiso «Account Analytics: Read»).
// la primera corrida real lo prueba y, si algo cambia, cambia aquí con su fecha.
//
//   CF_ACCOUNT_ID=... CF_ANALYTICS_TOKEN=... node mcp/scripts/exportar-medicion.mjs [--dias 30]
//
// qué exporta: conteos por tarea, por ámbito, por camino (id / sinónimo / ninguno) y por versión, sobre los últimos N días.
// nada individual sale: la consulta ya agrega, y el archivo guarda solo los conteos.
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : []).filter(Boolean));
const DIAS = Number(args.dias || 30);
const cuenta = process.env.CF_ACCOUNT_ID, token = process.env.CF_ANALYTICS_TOKEN;
if (!cuenta || !token) { console.error('faltan CF_ACCOUNT_ID y CF_ANALYTICS_TOKEN en el entorno (nunca por argumento)'); process.exit(2); }

// columnas del punto (mcp/src/index.js, writeDataPoint): blob1 versión, blob2 tarea, blob3 ámbito, blob4 camino, blob5 foco, blob6 propósito, blob7 patrón.
const consultas = {
  por_tarea: `SELECT blob2 AS tarea, SUM(_sample_interval) AS n FROM experiencias_datos_medicion WHERE timestamp > NOW() - INTERVAL '${DIAS}' DAY GROUP BY tarea ORDER BY n DESC`,
  por_ambito: `SELECT blob3 AS ambito, SUM(_sample_interval) AS n FROM experiencias_datos_medicion WHERE timestamp > NOW() - INTERVAL '${DIAS}' DAY GROUP BY ambito ORDER BY n DESC`,
  por_camino: `SELECT blob4 AS camino, SUM(_sample_interval) AS n FROM experiencias_datos_medicion WHERE timestamp > NOW() - INTERVAL '${DIAS}' DAY GROUP BY camino ORDER BY n DESC`,
  por_version: `SELECT blob1 AS version, SUM(_sample_interval) AS n FROM experiencias_datos_medicion WHERE timestamp > NOW() - INTERVAL '${DIAS}' DAY GROUP BY version ORDER BY n DESC`,
  por_dia: `SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS dia, SUM(_sample_interval) AS n FROM experiencias_datos_medicion WHERE timestamp > NOW() - INTERVAL '${DIAS}' DAY GROUP BY dia ORDER BY dia`,
};

async function sql(q) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cuenta}/analytics_engine/sql`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: q });
  if (!r.ok) throw new Error(`cloudflare ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return (await r.json()).data;
}

const salida = { exportado: new Date().toISOString(), dias: DIAS, fuente: 'Cloudflare Workers Analytics Engine, dataset experiencias_datos_medicion', consultas, nota: 'conteos agregados; ningún punto individual. _sample_interval corrige el muestreo de Analytics Engine.', resultados: {} };
for (const [k, q] of Object.entries(consultas)) salida.resultados[k] = await sql(q);
const archivo = path.join('evals/medicion', `${salida.exportado.slice(0, 10)}.json`);
fs.mkdirSync('evals/medicion', { recursive: true });
fs.writeFileSync(archivo, JSON.stringify(salida, null, 1) + '\n');
console.log(`${archivo}: ${Object.entries(salida.resultados).map(([k, v]) => `${k} ${v.length} filas`).join(' · ')}`);
