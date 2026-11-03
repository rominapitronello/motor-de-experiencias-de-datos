# Eval card · el conector `experiencias-datos` medido contra la gente para la que es

*Claude · Fable 5.1 (procedencia), 2-nov-2026. Ejecución: se decide y se reporta. Si un número cambia, cambia aquí con su fecha.*

## Qué se evalúa

Que el conector lleve una pregunta dicha con palabras de la vida («cuánta plata se me fue», «levanten la mano», «yo no soy empresa, ¿qué datos voy a tener?») a la tarea, el ámbito y la forma correctos del grafo (`grafo/grafo.yaml`). No se evalúa la experiencia que el modelo hace después con eso; se evalúa el primer paso, que es el que el conector controla.

## Con qué

**Corpus** (`corpus/*.json`): 120 preguntas de seis personas (la profesora con la sala, la persona con su cartola, quien arma la ppt, las preguntas absurdas de la casa, quien dice «yo no soy de números», quien no sabe que tiene datos). Las escribieron seis Claude Haiku 5.5, cada uno solo, con el encargo `corpus/encargos/persona.md`, con las palabras exactas de cada persona y sin corregirlas. Es un corpus imaginado: lo dice su procedencia y lo dice esta página.

**Criterio de verdad** (`corpus/anotacion-opus.json`): para cada pregunta, la tarea, el ámbito y la primera forma que ofrecería la pluma del grafo (Claude Opus 5.5), anotados con el grafo v0.2 y v0.3 del mismo día, sin ver al conector.

**Jurado** (`corpus/jurado/`): tres Claude Haiku 5.5 clasifican las 120 contra el vocabulario del grafo, cada uno solo, sin ver a los otros, al conector ni a la anotación, con el encargo `corpus/encargos/jurado.md`. Cada voto trae la palabra exacta que lo decidió y, si duda, la alternativa. Un cuarto archivo es el jurado uno corrido dos veces (intra).

**Medición** (`corpus/medir.mjs` → `corpus/medicion.json`): corre las 120 contra el conector del commit y compara con la anotación. `corpus/jurado/cruzar.py` cruza jurado, conector y anotación. `corpus/jurado/confiabilidad.py` calcula los indicadores.

## Qué dio (2-nov-2026, conector 0.3.5, grafo v0.3)

| | 25-sep (0.1.1) | 2-nov 18:06 (0.1.3) | 2-nov 23:00 (0.3.5) |
|---|---|---|---|
| preguntas con tarea | — | 54 / 100 | **117 / 120** |
| preguntas con ámbito | — | 2 / 100 | 112 / 120 |
| `magnitud` con formas de Lo Hermida primero | — | 38 | 3 |
| tarea igual a la anotación de opus | — | — | 85 / 120 |
| ámbito igual | — | — | 102 / 120 |
| forma esperada entre las tres primeras | — | — | 86 / 120 |
| acuerdo conector–mayoría del jurado | — | — | 100 / 120 (.83) |

**Confiabilidad del jurado** (alfa de Krippendorff; umbrales de Krippendorff 2004: ≥ .80 confiable, .67–.80 tentativo, < .67 no):

| | nominal | con confundibilidad* |
|---|---|---|
| tarea, inter (3 jurados) | .79 | .85 |
| ámbito, inter | .87 | — |
| forma, inter | .71 | — |
| tarea, intra (jurado uno, dos corridas) | .85 | — |
| tarea por persona: ppt / cartola / no sabe que tiene / no soy de números / profesora / casa | .85 / .81 / .80 / .77 / .72 / **.55** | .90 / .90 / .89 / .83 / .76 / .53 |

\* la distancia entre dos tareas sale de las dudas de los propios jurados (campo `alternativa`): el par más confundido vale 0,2; los nunca confundidos valen 1. Los pares más confundidos: estimar/magnitud (23), magnitud/parte_todo (16), magnitud/vacío (13), comparar/ordenar (13), cambio/leer (11). Se reportan los dos alfas.

**Validez.** De criterio: la mayoría del jurado coincide con opus en .73; el conector con el jurado en .83 y con opus en .71. **Con personas reales: no medida.** Desde 0.3.5 el conector cuenta la forma de cada consulta real (tarea, ámbito, si resolvió; nunca el texto; `PRIVACIDAD.md`) para que ese número exista.

## Qué se puede concluir y qué no

- Donde la vida es contable (una cartola, una ppt, cuántos entran al local), el grafo y el conector son confiables y coinciden con jueces independientes.
- Donde nadie contó (las preguntas absurdas de la casa: ¿«cuántas veces abrí el refri» es contar, estimar o empezar a contar?), el jurado se divide (.55) y la divergencia no es ruido: marca cinco fronteras del grafo que piden revisión (issue #31). Es el resultado de Pitronello (2026): instancias del mismo modelo divergen 2,7 veces más donde la tarea pide juicio, y esa divergencia señala los bordes del esquema.
- Con tres jurados y una noche se dice «divergente», no «ambiguo».
- Todos los raters son de la misma familia (Claude); el corpus es imaginado; no hay humanos en el criterio de verdad. Las tres cosas limitan lo que esto vale como evaluación, y las tres tienen remedio corto: un jurado de Sol (GPT) sobre las mismas 120, cuarenta ítems anotados por dos personas a ciegas, y la medición con consultas reales.

## Cómo reproducirlo

1. `cd mcp && npm ci && npm test` (las pruebas de humo, 103 el 2-nov).
2. `npm --prefix mcp run build && node corpus/medir.mjs` (la medición contra la anotación).
3. Un jurado: lanzar tres Claude Haiku 5.5 en paralelo con `corpus/encargos/jurado.md` instanciado; guardar `corpus/jurado/jurado-<nombre>.json`.
4. `python3 corpus/jurado/cruzar.py && python3 corpus/jurado/confiabilidad.py`.
5. Para intra: el mismo jurado otra vez, guardado como `jurado-<nombre>-bis.json`.

## Fuentes del método

- Pitronello, R. (2026). *Instances of the Same LLM Were Not Interchangeable Raters Where the Task Required Judgment.* Preprint; plan registrado en osf.io/zusb5, datos en osf.io/ue4qy.
- Krippendorff, K. (2004). *Content Analysis*, §11: alfa con función de distancia; umbrales.
- Herdagdelen, A., Joren, H., Tamkin, A. (Anthropic). *Who's Aligned to Whom? How AI Agents Shape Experts' Research Judgment Calls.* Por qué el conector pide declarar la lectura cuando la decisión es de juicio.
- Chi, M. T. H., Wylie, R. (2014). ICAP. El piso de compromiso de cada patrón del grafo.
