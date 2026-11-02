# Protocolo de dos linajes

**Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Pendiente de segunda pluma Sol.** Retoma el protocolo que Sol propuso en el primer `casos/README.md`: correr las mismas preguntas en los dos linajes y separar la diferencia procedimental de la diferencia de juicio.

## El problema que resuelve

Quien escribe los casos sabe las respuestas. Si Claude escribe el conjunto A y además se evalúa con él, el resultado mide memoria del autor, no detección. Lo mismo pasa si un modelo se juzga a sí mismo.

## Reglas

1. **Dos conjuntos, autores cruzados.** Claude escribe el conjunto A (`casos.json`). Sol escribe el conjunto B (`casos_b.json`) sin leer A, con las mismas trampas o con otras del catálogo. Cada linaje se mide **principalmente con el conjunto del otro**. Los resultados sobre el conjunto propio se publican aparte y marcados como "autor".
2. **El juez es del otro linaje.** Las respuestas de Claude las etiqueta Sol, y las de Sol las etiqueta Claude. `puntuar.py` avisa cuando un linaje se juzga a sí mismo.
3. **Juez ciego a la condición.** Antes de juzgar se quitan de la respuesta los rastros del conector (llamadas a herramientas, IDs como "TR-01"). Así el juez no sabe si la respuesta vino con o sin conector. Si el texto final menciona "TR-01", eso cuenta como parte de la respuesta y no se quita.
4. **Romina etiqueta una muestra.** Romina etiqueta a ciegas el 20% de las respuestas, elegidas al azar con semilla publicada. Si su acuerdo con el juez IA baja del 80% por ítem, se revisan las listas "debe" antes de publicar.
5. **Mismas condiciones.** Cada caso se corre `sin_conector` y `con_conector`, con el mismo prompt de sistema neutro ("ayuda con este trabajo de datos"), sin mencionar trampas, y al menos dos corridas por condición.

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
