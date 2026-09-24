// compila el conocimiento del repo (YAML + principios.md) a src/knowledge.json.
// el servidor nunca lee nada en vivo: lo que sabe es exactamente lo que está en el repo al momento del build.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { parse } from 'yaml';

const root = new URL('../../', import.meta.url);
const leer = (p) => readFileSync(new URL(p, root), 'utf8');

const trampas = parse(leer('trampas/trampas.yaml'));
const grafo = parse(leer('grafo/grafo.yaml'));
const referentes = parse(leer('catalogo/referentes.yaml'));
const tecnicas = parse(leer('catalogo/tecnicas.yaml'));

// principios: cada párrafo que empieza con **PR-xx · título.**
const principios = [];
for (const bloque of leer('principios/principios.md').split(/\n(?=\*\*PR-\d+)/)) {
  const m = bloque.match(/^\*\*(PR-\d+) · ([^*]+?)\*\*\s*([\s\S]*)$/);
  if (!m) continue;
  const [, id, titulo, resto] = m;
  const verif = resto.match(/Cómo verificar:\s*(.+)/);
  principios.push({
    id,
    titulo: titulo.replace(/\.$/, ''),
    enunciado: resto.split(/\n- Cómo verificar/)[0].trim(),
    como_verificar: verif ? verif[1].trim() : null,
  });
}

let commit = 'sin-git';
try { commit = execSync('git rev-parse --short HEAD', { cwd: new URL('../../', import.meta.url), stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}

const knowledge = {
  construido: new Date().toISOString(),
  commit,
  trampas: trampas.trampas,
  grafo,
  referentes: referentes.referentes,
  tecnicas: tecnicas.tecnicas,
  principios,
};
writeFileSync(new URL('../src/knowledge.json', import.meta.url), JSON.stringify(knowledge, null, 2));
console.log(`knowledge.json: ${knowledge.trampas.length} trampas · ${knowledge.referentes.length} referentes · ${knowledge.tecnicas.length} técnicas · ${principios.length} principios · commit ${commit}`);
