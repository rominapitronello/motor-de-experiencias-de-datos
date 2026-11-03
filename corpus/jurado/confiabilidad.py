#!/usr/bin/env python3
"""confiabilidad del jurado de haikus: alfa de Krippendorff (nominal) y kappa de Fleiss sobre tarea y ámbito.
fable (procedencia), 2-nov-2026, a pedido de romina (#43): «indicadores mínimos de validez y confiabilidad (inter e intra)».
inter: los jurados entre sí, aquí. intra: el mismo jurado dos veces, cuando haya segunda corrida (jurado-*-bis.json).
los votos son categorías, así que no es alfa de Cronbach (ítems numéricos) sino Krippendorff nominal.
umbrales habituales (Krippendorff 2004): α ≥ .80 confiable; .67–.80 conclusiones tentativas; < .67 no confiable. se reportan como obtenidos."""
import json, glob, collections, itertools, sys

def krippendorff_nominal(unidades):
    """unidades: lista de listas de valores (uno por codificador, None se ignora). α = 1 - Do/De."""
    vals = collections.Counter(); n = 0; Do_num = 0.0
    for u in unidades:
        v = [x for x in u if x is not None]
        m = len(v)
        if m < 2: continue
        c = collections.Counter(v)
        disagree = sum(a * b for a, b in itertools.permutations(c.values(), 2)) if len(c) > 1 else 0
        Do_num += disagree / (m - 1)
        vals.update(v); n += m
    if n < 2: return None
    Do = Do_num / n
    De = sum(a * b for a, b in itertools.permutations(vals.values(), 2)) / (n * (n - 1))
    return None if De == 0 else 1 - Do / De

def fleiss_kappa(unidades):
    """requiere el mismo número de codificadores por unidad; se usan solo las unidades completas."""
    full = [u for u in unidades if all(x is not None for x in u)]
    if not full: return None
    k = len(full[0]); cats = sorted({x for u in full for x in u}); N = len(full)
    P_i = []; p_j = collections.Counter()
    for u in full:
        c = collections.Counter(u); p_j.update(u)
        P_i.append((sum(v * v for v in c.values()) - k) / (k * (k - 1)))
    Pbar = sum(P_i) / N; Pe = sum((p_j[c] / (N * k)) ** 2 for c in cats)
    return None if Pe == 1 else (Pbar - Pe) / (1 - Pe)

def krippendorff_metrica(unidades, d):
    """alfa con una función de distancia cualquiera (Krippendorff 2004, §11). aquí: confundibilidad empírica, construida desde las
    dudas de los propios jurados (campo `alternativa`): el par más confundido dista 0.2; los nunca confundidos distan 1 (= nominal).
    romina, 2-nov-2026, 23:00: «las categorías las estás pensando como nominales, no ordinales». nominales sí (no hay orden entre
    tareas), pero no todos los desacuerdos pesan igual: magnitud/estimar es chico, magnitud/flujo es grande. se reportan los dos alfas."""
    vals = collections.Counter(); n = 0; Do = 0.0
    for u in unidades:
        v = [x for x in u if x is not None]; m = len(v)
        if m < 2: continue
        Do += sum(d(a, b) for a, b in itertools.permutations(v, 2)) / (m - 1); vals.update(v); n += m
    if n < 2: return None
    Do /= n
    De = sum(d(a, b) * ca * cb for (a, ca), (b, cb) in itertools.permutations(vals.items(), 2)) / (n * (n - 1))
    return None if De == 0 else 1 - Do / De

J = {}
for f in sorted(glob.glob('corpus/jurado/jurado-*.json')):
    if f.endswith('-bis.json'): continue
    d = json.load(open(f)); J[d['jurado']] = {v['id']: v for v in d['votos']}
ids = sorted(set.intersection(*[set(v) for v in J.values()]))
out = {'jurados': list(J), 'unidades': len(ids), 'inter': {}}
for dim in ('tarea', 'ambito', 'forma'):
    uni = [[J[j][i].get(dim) for j in J] for i in ids]
    a = krippendorff_nominal(uni); k = fleiss_kappa(uni)
    acuerdo_pleno = sum(1 for u in uni if len(set(u)) == 1) / len(uni)
    out['inter'][dim] = {'krippendorff_alpha_nominal': None if a is None else round(a, 3), 'fleiss_kappa': None if k is None else round(k, 3), 'acuerdo_pleno': round(acuerdo_pleno, 3)}
# confundibilidad desde las dudas del jurado
pares = collections.Counter()
for j in J:
    for v in J[j].values():
        if v.get('duda') and v.get('alternativa') and v.get('tarea'):
            a, b = sorted([v['tarea'], v['alternativa']]); pares[(a, b)] += 1
mx = max(pares.values()) if pares else 1
dist = lambda a, b: 0.0 if a == b else 1.0 - 0.8 * pares.get(tuple(sorted([a, b])), 0) / mx
uni_t = [[J[j][i].get('tarea') for j in J] for i in ids]
out['inter']['tarea']['krippendorff_alpha_confundibilidad'] = round(krippendorff_metrica(uni_t, dist), 3)
out['inter']['pares_mas_confundidos'] = [{'par': list(p), 'veces': c} for p, c in pares.most_common(8)]
out['inter']['nota_metrica'] = 'nominal: todo desacuerdo vale 1. confundibilidad: el par más confundido por los propios jurados vale 0.2; los nunca confundidos valen 1. se reportan los dos; el segundo dice que los desacuerdos son entre vecinos.'
# por persona (tarea)
por_persona = {}
for i in ids:
    p = i.split('-')[0]; por_persona.setdefault(p, []).append([J[j][i].get('tarea') for j in J])
out['inter']['tarea_por_persona'] = {p: {'alpha_nominal': None if (a := krippendorff_nominal(u)) is None else round(a, 3), 'alpha_confundibilidad': round(krippendorff_metrica(u, dist), 3), 'n': len(u)} for p, u in por_persona.items()}
# intra: si hay jurado-*-bis.json
bis = {}
for f in sorted(glob.glob('corpus/jurado/jurado-*-bis.json')):
    d = json.load(open(f)); bis[d['jurado'].replace(' bis', '')] = {v['id']: v for v in d['votos']}
if bis:
    out['intra'] = {}
    for j, votos in bis.items():
        base = J.get(j)
        if not base: continue
        uni = [[base[i].get('tarea'), votos[i].get('tarea')] for i in ids if i in votos]
        out['intra'][j] = {'tarea_alpha': None if (a := krippendorff_nominal(uni)) is None else round(a, 3), 'n': len(uni)}
else:
    out['intra'] = None
    out['nota_intra'] = 'sin segunda corrida todavía: para medir intra, correr el mismo jurado otra vez y guardar jurado-<nombre>-bis.json'
# validez de criterio: mayoría del jurado vs anotación de opus, y conector vs mayoría
try:
    anot = {x['id']: x for x in json.load(open('corpus/anotacion-opus.json'))['filas']}
    med = {x['id']: x for x in json.load(open('corpus/medicion.json'))['filas']}
    may = {i: collections.Counter([J[j][i].get('tarea') for j in J]).most_common(1)[0][0] for i in ids}
    out['validez'] = {
        'nota': 'validez de criterio, no de constructo: acuerdo con un juicio independiente (opus) y con el conector. la validez con personas reales no está medida (issue #43).',
        'mayoria_jurado_vs_opus': round(sum(1 for i in ids if may[i] == anot.get(i, {}).get('tarea')) / len(ids), 3),
        'conector_vs_mayoria_jurado': round(sum(1 for i in ids if med[i]['tarea'] == may[i]) / len(ids), 3),
        'conector_vs_opus': round(sum(1 for i in ids if med[i]['tarea'] == anot.get(i, {}).get('tarea')) / len(ids), 3),
    }
except Exception as e:
    out['validez'] = {'error': str(e)}
json.dump(out, open('corpus/jurado/confiabilidad.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False, indent=1))
