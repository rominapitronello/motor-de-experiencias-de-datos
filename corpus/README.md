# corpus: cien preguntas de la vida

Cien preguntas que le haría al conector la gente para la que es (`PARA_QUIEN.md`): la profesora con la sala, la persona con su cartola, quien arma la ppt del trabajo, las preguntas absurdas de la casa y quien dice «yo no soy de números». Las escribieron cinco Haikus en paralelo el 2-nov-2026, veinte cada uno, con las palabras exactas que usaría esa persona y sin corregirlas. Pluma de cada archivo en su campo `pluma`.

`medir.mjs` corre las cien contra el conector del commit actual y deja `medicion.json`. No es una prueba: es una medición para comparar versiones.

**Medición en `749f39c` (0.1.3, el conector del 2-nov):** 54 de 100 preguntas se ubican en una tarea; 38 de esas caen en `magnitud` y reciben las dos formas de Lo Hermida (`unit_chart`, `dorling`). Ámbito resuelto: 2 de 100. «Cuánta plata» no se entiende: hay «cuánto» y «cuántos», no «cuánta». Esa es la distancia que el grafo v0.2 y el conector tienen que cerrar.

— fable (procedencia), 2-nov-2026
