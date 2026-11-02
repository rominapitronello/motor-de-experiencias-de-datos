# Protocolo de dos linajes

**Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Pendiente de segunda pluma Sol.** Retoma el protocolo que Sol propuso en el primer `casos/README.md`: correr las mismas preguntas en los dos linajes y separar la diferencia procedimental de la diferencia de juicio.

## El problema que resuelve

Quien escribe los casos sabe las respuestas. Si Claude escribe el conjunto A y además se evalúa con él, el resultado mide memoria del autor, no detección. Lo mismo pasa si un modelo se juzga a sí mismo.

## Reglas

1. **Dos conjuntos, autores cruzados.** Claude escribe el conjunto A (`casos.json`) y Sol el conjunto B (`casos_b.json`). Cada linaje se mide **principalmente con el conjunto del otro**. Los resultados sobre el conjunto propio se publican aparte y marcados. Cada archivo declara su exposición: B declara que Sol vio fragmentos de A antes de escribirlo. Para un bloque estrictamente ciego, un conjunto C lo escribe una instancia que no haya visto A ni B, y deja constancia antes de abrirlos.
2. **El juez es del otro linaje.** Las respuestas de Claude las etiqueta Sol, y las de Sol las etiqueta Claude. Si un linaje se juzga a sí mismo, `puntuar.py` lo deja en un estrato "autojuicio" que nunca entra al resultado principal.
3. **Juez ciego a la condición, y medido.** `anonimizar.py` separa lo que ve el juez (`para_juez.jsonl`: id, caso y texto final, en orden barajado, sin trazas de herramientas) de la tabla de asignación (`asignacion.jsonl`). **Anonimiza Romina, o la pluma que no juzga ese lote**, y no entrega la asignación hasta que las etiquetas estén escritas. El texto final no se edita. Si deja ver la condición (por ejemplo, porque nombra "TR-01" o el conector), el juez marca `revela_condicion: true`. En cada respuesta el juez además apuesta `adivina_condicion`. El puntuador clasifica el cegamiento como **fallido** (el texto revela la condición), **parcial** (adivinó sin revelación) o **efectivo**, y reporta la tasa de acierto: cerca del 50% significa que el juez estaba ciego.
4. **Romina etiqueta una muestra.** Romina etiqueta a ciegas el 20% de las respuestas, elegidas al azar con semilla publicada. Si su acuerdo con el juez IA baja del 80% por ítem, se revisan las listas "debe" antes de publicar.
5. **Mismas condiciones, aisladas.** Cada caso se corre `sin_conector` y `con_conector`, cada corrida en un contexto nuevo y sin memoria, con el mismo prompt de sistema neutro ("ayuda con este trabajo de datos") y sin mencionar trampas. Van al menos dos corridas por condición. El orden de casos y condiciones se baraja con semilla publicada. Antes de empezar se congelan y anotan las versiones del modelo y del conector (commit del MCP).
6. **Criterio de equivalencia.** Un ítem "debe" se cumple si la respuesta dice lo mismo con otras palabras. Si el material no alcanza para evaluar un ítem en esa respuesta (por ejemplo, porque la respuesta pidió con razón un dato que el caso no trae), el juez marca `null` y lo anota en `desacuerdos.jsonl`.
7. **Antes de correr, cada lista se revisa con el otro linaje.** Ninguna corrida empieza hasta que las listas `debe`, `falla_grave` y `no_debe` de ambos conjuntos tengan segunda pluma.

## Cómo se registra cada desacuerdo

Cuando los dos jueces, o un juez y Romina, discrepan en un ítem, se anota en `desacuerdos.jsonl` en una de tres categorías:

- **Procedimental:** el caso o la lista "debe" estaba mal escrita, era ambigua o tenía más de una respuesta correcta. Se corrige el caso y se vuelve a correr.
- **De juicio:** las dos lecturas son defendibles. Se conserva y se publica como hallazgo: dónde ven distinto dos linajes.
- **Error del juez:** uno de los dos leyó mal la respuesta. Se corrige la etiqueta.

## Qué se publica

- La tabla de `puntuar.py` para cada linaje, separando el conjunto ajeno del propio.
- Las fallas graves, citadas textualmente, porque son lo que llegaría a una nota de prensa.
- Los desacuerdos de juicio, porque son el resultado más interesante.
- Las semillas, las versiones de modelo y la fecha de cada corrida.

## Qué no se publica

- Afirmaciones del tipo "el modelo X es mejor que el Y". Doce o veinticuatro casos sintéticos no sostienen un ranking.
- Ninguna cifra de los casos como si describiera un territorio real.
