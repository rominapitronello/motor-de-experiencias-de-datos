#!/usr/bin/env python3
"""cruza los votos del jurado de haikus con el conector (medicion.json) y la anotación de opus.
fable (procedencia), 2-nov-2026, sobre la idea de romina: «los haikus son la llave».
regla 7 de la casa: si los tres jurados coinciden y el conector no → falta sinónimo (conector);
si coinciden con el conector y no con opus → divergencia de juicio en la anotación (se discute);
si los tres no coinciden entre sí → el grafo es ambiguo ahí (grafo)."""
import json, glob, collections, sys
J = {}
for f in sorted(glob.glob('corpus/jurado/jurado-*.json')):
    d = json.load(open(f)); J[d['jurado']] = {v['id']: v for v in d['votos']}
med = {x['id']: x for x in json.load(open('corpus/medicion.json'))['filas']}
anot = {x['id']: x for x in json.load(open('corpus/anotacion-opus.json'))['filas']}
ids = list(med.keys())
nj = len(J)
cat = collections.Counter(); out = {'falta_sinonimo': [], 'divergencia_anotacion': [], 'grafo_ambiguo': [], 'acuerdo_total': 0, 'ambito': collections.Counter()}
for i in ids:
    votos = [J[j][i]['tarea'] for j in J if i in J[j]]
    c = collections.Counter(votos); top, n = c.most_common(1)[0]
    con = med[i]['tarea']; op = anot.get(i, {}).get('tarea')
    unanime = n == nj
    if unanime and con == top and op == top: cat['todos_de_acuerdo'] += 1; out['acuerdo_total'] += 1
    elif unanime and con != top:
        cat['jurado_unanime_conector_distinto'] += 1
        out['falta_sinonimo'].append({'id': i, 'jurado': top, 'conector': con, 'opus': op, 'palabras': sorted({J[j][i].get('palabra') for j in J if i in J[j]} - {None}), 'pregunta': med[i]['pregunta'][:90]})
    elif unanime and con == top and op != top:
        cat['jurado_y_conector_vs_opus'] += 1
        out['divergencia_anotacion'].append({'id': i, 'jurado_y_conector': top, 'opus': op, 'pregunta': med[i]['pregunta'][:90]})
    elif n >= 2:
        cat['mayoria_2_de_3'] += 1
        out['grafo_ambiguo'].append({'id': i, 'votos': votos, 'conector': con, 'opus': op, 'dudas': [J[j][i].get('alternativa') for j in J if i in J[j] and J[j][i].get('duda')], 'pregunta': med[i]['pregunta'][:90]})
    else:
        cat['sin_mayoria'] += 1
        out['grafo_ambiguo'].append({'id': i, 'votos': votos, 'conector': con, 'opus': op, 'sin_mayoria': True, 'pregunta': med[i]['pregunta'][:90]})
    # ámbito
    va = [J[j][i]['ambito'] for j in J if i in J[j]]; ca = collections.Counter(va); ta, na = ca.most_common(1)[0]
    out['ambito'][('unanime' if na == nj else 'mayoria' if na >= 2 else 'sin_mayoria') + ('_conector_igual' if med[i]['ambito'] == ta else '_conector_distinto')] += 1
resumen = {'jurados': list(J), 'preguntas': len(ids), 'tareas': dict(cat), 'ambito': dict(out['ambito']),
           'acuerdo_jurado_conector': sum(1 for i in ids if collections.Counter([J[j][i]['tarea'] for j in J]).most_common(1)[0][0] == med[i]['tarea']),
           'acuerdo_jurado_opus': sum(1 for i in ids if collections.Counter([J[j][i]['tarea'] for j in J]).most_common(1)[0][0] == anot.get(i, {}).get('tarea')),
           'acuerdo_conector_opus': sum(1 for i in ids if med[i]['tarea'] == anot.get(i, {}).get('tarea'))}
out['resumen'] = resumen; out['ambito'] = dict(out['ambito'])
json.dump(out, open('corpus/jurado/cruce.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(resumen, ensure_ascii=False, indent=1))
print('\n--- falta sinónimo (jurado unánime, conector distinto):')
for x in out['falta_sinonimo']: print(f"  {x['id']}: jurado {x['jurado']} / conector {x['conector']} / opus {x['opus']} | palabras {x['palabras']}")
print('\n--- divergencia con la anotación (jurado + conector vs opus):')
for x in out['divergencia_anotacion']: print(f"  {x['id']}: {x['jurado_y_conector']} vs opus {x['opus']} | {x['pregunta'][:60]}")
print('\n--- grafo ambiguo (jurado dividido):')
for x in out['grafo_ambiguo']: print(f"  {x['id']}: votos {x['votos']} / conector {x['conector']} / opus {x['opus']}")
