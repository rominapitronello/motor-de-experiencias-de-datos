# Ajuste del turno · estado al 23 de noviembre de 2026

**Trabajo en desarrollo.** Esta carpeta es el registro de una evaluación que se está construyendo. No hay resultados sobre ningún modelo: todavía no se ha aplicado a ninguno, y eso es a propósito.

> **In English, briefly.** *Ajuste del turno* ("fit of the turn") is an evaluation under construction for AI assistants answering lay people's questions about their own data. It is being built in the order used for human tests: construct, table of specifications, items with keys written before any response exists, expert review, and only then model runs. As of 23 Nov 2026 the first expert-review round is in (three human reviewers, unpaid volunteers, instructed not to use AI). Its main finding is negative and useful: the table's main dimension did not replicate between two judges who classified twelve items blind (Cohen's kappa 0.44 and −0.33 against the proposed classification, 0.01 between them), although both rated its definitions as clear. That finding changed the scope of the construct. No model has been run. Everything below is in Spanish.

## Qué es

Una persona sin formación en datos le pregunta a un asistente por algo suyo: su plata, su consumo, sus notas. El asistente responde con un artefacto, una pieza que la persona puede tocar y que responde. *Ajuste del turno* es el grado en que ese artefacto se ajusta a la persona que preguntó, a lo que preguntó y a los datos que tiene. El constructo es de Romina Pitronello, psicóloga y psicometrista. Sirve para evaluar al conector `experiencias-datos` de este repositorio comparando un asistente con el conector y sin él.

Se construye en el orden de una prueba para personas: constructo, tabla de especificaciones, ítems con su clave, revisión experta, y recién después las respuestas de los modelos. La regla que ordena todo: no se corre ningún modelo antes de que estén aprobados el marco y la tabla, para no anotar después qué era lo que se iba a medir.

## Lo que está hecho

| paso | estado | dónde |
|---|---|---|
| Constructo, versión 0 | escrito y revisado | `MARCO.md`, `CONSTRUCTO_una_pagina.md` |
| Tabla de especificaciones, versión 0 | escrita y revisada; su dimensión principal no sobrevivió a la revisión | `TABLA_borrador.md`, `TABLA_una_pagina.md` |
| Doce ítems con clave, versión 0 | escritos y revisados | `ITEMS_v0.md`, `ITEMS_v0.json` |
| Primera vuelta de revisión experta | tres revisiones recibidas | `revisiones/` |
| Preguntas donadas | seis, de tres personas | `donadas/` |
| Lecturas | siete, con cuánto se leyó de cada una | `LITERATURA.md` |
| Decisiones de alcance tras la revisión | tomadas el 18-nov | `MARCO.md`, desde «Decisión de alcance» |

Los ítems: once son textos completos de personas en foros públicos (dataset MQA, CC0) y uno lo redactó un modelo y está marcado. Las claves las escribió un modelo (Claude) antes de que existiera ninguna respuesta, y por eso se mandaron a revisar.

Los formularios con que se revisó están aquí y se abren en cualquier navegador: `revision_experta.html` (66 respuestas de un clic), `revision_breve.html` (15), `revision_didactica.html` (18).

## Quién revisó

- **Javiera Wagner Muñoz**, estadística. Revisión completa, 66 de 66.
- **Oscar Cariceo, KintuAI**, investigación de experiencia de usuario cuantitativa. Revisión completa, 66 de 66, y cuatro respuestas de seguimiento.
- **Un profesor de ciencias**, que pidió figurar como anónimo. Revisión desde la didáctica, 17 de 18.

Los tres son voluntarios, sin pago, con la instrucción explícita de no usar IA para responder. Eso no se verificó de forma independiente. Llegaron por la red de la autora o por una convocatoria pública suya, y eso sesga la muestra.

Una cuarta revisora (psicometría) recibió el formulario el 16-nov y un recordatorio el 18-nov; al 23-nov no ha respondido. Un grupo de estudiantes fue invitado por uno de los revisores; no llegó ninguna respuesta.

## Lo que encontró la primera vuelta

Está completo en `revisiones/CAMBIOS_para_v1.md`. Lo principal:

1. **La dimensión principal de la tabla no replica entre jueces.** Dos revisores clasificaron el «estado del registro» de los doce ítems antes de ver la clave. Coincidieron con la propuesta en 7 de 12 (kappa 0,44) y en 0 de 12 (kappa −0,33), y entre ellos en 4 de 12 (kappa 0,01). Los dos habían marcado que las cuatro categorías estaban bien definidas: el problema no se veía leyendo las definiciones y apareció al aplicarlas. Preguntados después, los dos habían leído lo mismo («qué trae la pregunta para trabajar») y no lo que la propuesta quería clasificar. Con doce ítems y dos jueces esto es exploratorio.
2. **Las claves escritas por el modelo leen mal lo que la persona pide.** Dos revisores, sin verse, señalaron en cinco ítems distintos que la clave fuerza una «operación con datos» donde la persona pidió información, una explicación o una estrategia.
3. **El propósito prometía más de lo que se mide.** «¿Qué ciencia se busca enseñar?», preguntó el revisor de didáctica: el instrumento no comprueba aprendizaje.
4. **Dos propiedades se pisan** (modelo del aprendiz y siguiente paso): corregir una es corregir la otra.
5. Un formulario mostraba mal las tildes en algunos visores; se corrigió el 18-nov.

## Lo que se decidió el 18 de noviembre

Decisiones de Romina Pitronello, con sus palabras en `MARCO.md`:

- **Son dos operaciones y dos evaluaciones.** Si la persona trae datos, se evalúa el turno en que el modelo hace el artefacto: eso es *Ajuste del turno*. Si no los trae, lo que corresponde es levantar la data con ella, y eso es otra evaluación, que queda nombrada y sin construir.
- **Los prompts que traen solo una parte de los datos entran**, y se espera que sean la mayoría. Ahí lo ajustado es que el modelo haga el artefacto, que el hueco se vea en el artefacto mismo, y que le diga a la persona al menos un dato que mejoraría la respuesta. Un artefacto que concluye limpio con datos parciales está desajustado aunque se vea mejor terminado.
- **Se corrige el artefacto y el mensaje que lo acompaña.**
- **El propósito se reescribe:** acercar a la persona a decidir con evidencia; el artefacto está bien hecho cuando le deja ver de dónde vienen sus números y dónde faltan.

## Lo que no está decidido

- Si la propiedad A pasa de «operación» a «lo que la persona pidió», separada de E como lo dicho frente a lo no dicho. Propuesta hecha el 18-nov, sin respuesta.
- Qué se hace con las dos propiedades que se pisan.
- Con qué se reemplaza el «estado del registro». Hay una propuesta sin aprobar (si trae todo o una parte; si algo de lo que trae no calza) y no se ha probado con jueces.
- Si la estructura del mensaje como texto entra al constructo más allá de lo ya decidido.

## Lo que falta

1. Cerrar las decisiones de arriba y escribir constructo y tabla en versión 1.
2. Reescribir las claves de los ítems y decidir cuáles ítems quedan: los que no traen datos salen de esta evaluación.
3. Segunda vuelta corta con los mismos revisores, incluida una nueva clasificación a ciegas para ver si la dimensión corregida ahora replica.
4. Aprobación del marco y la tabla por la autora.
5. Producir las respuestas: cada ítem a dos modelos, con el conector y sin él.
6. Cerrar la pauta de corrección, capacitar a dos correctores humanos, corregir a ciegas y calcular el acuerdo entre ellos.
7. Reportar, con lo que no se puede concluir.

## Lo que no se puede afirmar hoy

- Nada sobre ningún modelo ni sobre el conector: no se ha corrido nada.
- Que el instrumento sea válido. Lo que hay es una primera vuelta de revisión que obligó a corregirlo.
- Que las preguntas donadas no estén contaminadas por modelos: se pidió que se escribieran sin IA y se confía en eso.
- Los once ítems de foros vienen de un corpus derivado de la web pública, así que los modelos pueden haberlos visto. Se usan para desarrollo. Las preguntas donadas son el inicio del conjunto que ningún modelo ha visto.

## Lo que no está en esta carpeta

La pauta de corrección en borrador no se publica aquí. Se levantó mirando un par real, hecho con datos de consumo de la propia autora, y cita esos datos. Sus reglas, sin las citas, están resumidas en la parte 2 de `TABLA_borrador.md`.

## Quién escribió qué

El constructo y todas las decisiones son de Romina Pitronello; sus palabras van citadas tal como las escribió. La redacción, la tabla, las claves de los ítems, los formularios y este documento son de Claude · Fable 5.1 y 5.2 (procedencia), un modelo de lenguaje. Las revisiones son de las personas nombradas arriba.

— Claude · Fable 5.2 (procedencia), 23-nov-2026
