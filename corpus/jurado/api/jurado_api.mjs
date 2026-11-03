#!/usr/bin/env node
// jurado por API: corre las 120 preguntas del corpus contra un modelo con id exacto, por una API, y guarda los votos
// en el mismo formato que los jurados de ventana (corpus/jurado/jurado-*.json), más el id del modelo, la temperatura,
// la fecha y el hash del prompt. fable (procedencia), 3-nov-2026, sobre el pedido de romina del mismo día: «por API
// sería mejor porque le escribimos nosotros el system prompt más limpio... y de paso, hacemos la misma cosa en gptlandia».
// sin dependencias: fetch de node 22.
//
//   node corpus/jurado/api/jurado_api.mjs --familia anthropic  --modelo claude-haiku-5-5 --jurados 3 --temperatura 1 --nombre nov03
//   node corpus/jurado/api/jurado_api.mjs --familia openrouter --modelo openai/gpt-6-luna --jurados 3 --temperatura 1 --nombre nov03
//   node corpus/jurado/api/jurado_api.mjs --mock   (sin red: prueba la plomería con un voto fijo)
//
// llaves por entorno, nunca por argumento ni en archivos: ANTHROPIC_API_KEY, OPENROUTER_API_KEY.
// salida: corpus/jurado/api/<familia>__<modelo sin barras>__t<temp>__<nombre>__j<k>.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : []).filter(Boolean));
const FAMILIA = args.familia || 'anthropic';
const MODELO = args.modelo || (FAMILIA === 'anthropic' ? 'claude-haiku-5-5' : 'openai/gpt-6-luna');
const JURADOS = Number(args.jurados || 1);
const TEMP = Number(args.temperatura ?? 1);
const NOMBRE = args.nombre || new Date().toISOString().slice(0, 10);
const CONCURRENCIA = Number(args.concurrencia || 4);
const MOCK = Boolean(args.mock);
const LIMITE = args.limite ? Number(args.limite) : null; // para probar con pocas preguntas
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');

const vocab = fs.readFileSync(path.join(RAIZ, 'corpus/jurado/vocabulario.json'), 'utf8');
const preguntas = JSON.parse(fs.readFileSync(path.join(RAIZ, 'corpus/jurado/preguntas.json'), 'utf8')).slice(0, LIMITE || undefined);
const plantilla = fs.readFileSync(path.join(RAIZ, 'corpus/encargos/jurado-api.md'), 'utf8').replace(/^<!--[\s\S]*?-->\s*/, '');

function systemPrompt(nombreJurado) {
  return plantilla
    .replaceAll('{{MODELO}}', MODELO)
    .replaceAll('{{FAMILIA}}', FAMILIA)
    .replaceAll('{{JURADO_NOMBRE}}', nombreJurado)
    .replaceAll('{{TEMPERATURA}}', String(TEMP))
    .replaceAll('{{FECHA}}', NOMBRE)
    .replaceAll('{{VOCABULARIO}}', JSON.stringify(JSON.parse(vocab), null, 1));
}

async function llamar(system, pregunta) {
  if (MOCK) return JSON.stringify({ id: pregunta.id, tarea: 'magnitud', ambito: 'datos_propios', forma: 'cifra_grande', palabra: pregunta.pregunta.split(' ').slice(0, 2).join(' '), duda: false, alternativa: null, por_que_null: null });
  const user = `${pregunta.id}: ${pregunta.pregunta}`;
  if (FAMILIA === 'anthropic') {
    const key = process.env.ANTHROPIC_API_KEY; if (!key) throw new Error('falta ANTHROPIC_API_KEY en el entorno');
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODELO, max_tokens: 400, temperature: TEMP, system, messages: [{ role: 'user', content: user }] }),
    });
    if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const d = await r.json();
    return d.content.filter(b => b.type === 'text').map(b => b.text).join('');
  }
  if (FAMILIA === 'openrouter') {
    const key = process.env.OPENROUTER_API_KEY; if (!key) throw new Error('falta OPENROUTER_API_KEY en el entorno');
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}`, 'HTTP-Referer': 'https://github.com/rominapitronello/motor-de-experiencias-de-datos', 'X-Title': 'experiencias-datos jurado' },
      body: JSON.stringify({ model: MODELO, max_tokens: 400, temperature: TEMP, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
    });
    if (!r.ok) throw new Error(`openrouter ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const d = await r.json();
    return d.choices?.[0]?.message?.content ?? '';
  }
  throw new Error(`familia desconocida: ${FAMILIA} (anthropic | openrouter)`);
}

function parsear(texto, pregunta) {
  const m = texto.match(/\{[\s\S]*\}/);
  const base = { id: pregunta.id, tarea: null, ambito: null, forma: null, palabra: null, duda: false, alternativa: null, por_que_null: null };
  if (!m) return { ...base, por_que_null: 'respuesta sin json', crudo: texto.slice(0, 300) };
  try {
    const v = JSON.parse(m[0]);
    const out = { ...base, ...v, id: pregunta.id };
    for (const k of Object.keys(out)) if (!(k in base)) delete out[k];
    return out;
  } catch (e) {
    return { ...base, por_que_null: `json inválido: ${e.message}`, crudo: texto.slice(0, 300) };
  }
}

async function conReintentos(fn, veces = 4) {
  let err;
  for (let i = 0; i < veces; i++) {
    try { return await fn(); } catch (e) { err = e; await new Promise(r => setTimeout(r, 1500 * (i + 1) ** 2)); }
  }
  throw err;
}

async function correrJurado(k) {
  const nombreJurado = `${FAMILIA} ${MODELO} t${TEMP} ${NOMBRE} j${k}`;
  const system = systemPrompt(nombreJurado);
  const hash = crypto.createHash('sha256').update(system).digest('hex');
  const votos = new Array(preguntas.length);
  let i = 0, errores = 0;
  async function worker() {
    while (i < preguntas.length) {
      const idx = i++;
      const p = preguntas[idx];
      try {
        const texto = await conReintentos(() => llamar(system, p));
        votos[idx] = parsear(texto, p);
      } catch (e) {
        errores++;
        votos[idx] = { id: p.id, tarea: null, ambito: null, forma: null, palabra: null, duda: false, alternativa: null, por_que_null: `error de api: ${String(e.message).slice(0, 200)}` };
      }
      if ((idx + 1) % 20 === 0) console.error(`  ${nombreJurado}: ${idx + 1}/${preguntas.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCIA, preguntas.length) }, worker));
  const nulls = votos.filter(v => v.tarea == null).length;
  const salida = {
    jurado: nombreJurado,
    pluma: `${MODELO} (${FAMILIA}), por api, jurado ${k} de ${JURADOS}, temperatura ${TEMP}, ${new Date().toISOString()}`,
    modelo: MODELO, familia: FAMILIA, temperatura: TEMP, corrida: NOMBRE, jurado_k: k,
    prompt_sha256: hash, prompt_archivo: 'corpus/encargos/jurado-api.md',
    preguntas: preguntas.length, nulls, errores_api: errores, mock: MOCK,
    votos,
  };
  const archivo = path.join(RAIZ, 'corpus/jurado/api', `${FAMILIA}__${MODELO.replace(/[\/:]/g, '-')}__t${TEMP}__${NOMBRE}__j${k}${MOCK ? '__mock' : ''}.json`);
  fs.writeFileSync(archivo, JSON.stringify(salida, null, 1) + '\n');
  console.log(`${path.relative(RAIZ, archivo)}: ${preguntas.length} votos, ${nulls} null, ${errores} errores de api, prompt ${hash.slice(0, 12)}`);
}

for (let k = 1; k <= JURADOS; k++) await correrJurado(k);
