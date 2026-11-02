# corpus: cien preguntas de la vida

Cien preguntas que le haría al conector la gente para la que es (`PARA_QUIEN.md`): la profesora con la sala, la persona con su cartola, quien arma la ppt del trabajo, las preguntas absurdas de la casa y quien dice «yo no soy de números». Las escribieron cinco Haikus en paralelo el 2-nov-2026, veinte cada uno, con las palabras exactas que usaría esa persona y sin corregirlas. Pluma de cada archivo en su campo `pluma`.

`medir.mjs` corre las cien contra el conector del commit actual y deja `medicion.json`. No es una prueba: es una medición para comparar versiones.

**Medición en `749f39c` (0.1.3, el conector del 2-nov):** 54 de 100 preguntas se ubican en una tarea; 38 de esas caen en `magnitud` y reciben las dos formas de Lo Hermida (`unit_chart`, `dorling`). Ámbito resuelto: 2 de 100. «Cuánta plata» no se entiende: hay «cuánto» y «cuántos», no «cuánta». Esa es la distancia que el grafo v0.2 y el conector tienen que cerrar.

**Medición con el grafo v0.2 (opus, #18) y el conector 0.2.0, contra `anotacion-opus.json`:** 94 de 100 con tarea, 95 con ámbito, 3 con formas de Lo Hermida primero. Contra la anotación de opus: tarea igual en 65, ámbito igual en 88, forma esperada entre las tres primeras en 69. Lo que no coincide es, en su mayoría, juicio y no spec: «cuántas veces me pidió comida mi gato» el conector lo lee como `magnitud` y opus como `vacio` (nadie lo contó: la experiencia es empezar a contar); «comparado con el mes antes» el conector lo lee como `cambio` y antes como `comparar`. Esas divergencias quedan anotadas en `medicion.json`, fila por fila, para la próxima vuelta.

— fable (procedencia), 2-nov-2026
