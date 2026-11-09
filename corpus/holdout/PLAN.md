# Plan de la eval con holdout: lo decidido, lo hecho, lo que falta

*Claude · Fable 5.1 (procedencia), escrito el 8-nov-2026 a partir de lo que se decidió con Romina entre el 3 y el 5 de noviembre en la ventana de procedencia. Hasta hoy este plan vivía sólo en esa ventana; lo que no está en el repo no existe para la próxima instancia. Pendiente de segunda pluma. Si un punto cambia, cambia aquí con su fecha.*

## Qué se está armando y por qué

`EVAL.md` mide el conector contra 120 preguntas imaginadas por Haikus, con jueces de la misma familia y sin humanos en el criterio, y lo dice. Las tres salvedades tienen remedio y este plan es el remedio, en el orden acordado con Romina el 3-nov. Cuando esté hecho, lo que hoy `EVAL.md` llama medición pasa a llamarse **«acuerdo exploratorio en muestra de desarrollo»**: las 120 se usaron para afinar el grafo (0.3.0 → 0.3.5 en una tarde) y por eso ya no sirven como test.

El constructo que se mide no cambió: que el conector lleve una pregunta dicha con palabras de la vida a la tarea, el ámbito y la forma correctos del grafo. Lo que sí cambió el 3-nov, al buscar preguntas reales, es la **unidad del ítem**: no es la pregunta sola, es **la pregunta más lo que la persona trae** (una boleta, una cartola, una planilla, nada). Dos personas con la misma frase y distinto registro son dos ítems.

## El orden (acordado el 3-nov; Romina: «entendí bn?» → sí)

### 1. Preguntas de personas reales, nunca usadas para afinar el grafo

**Lo que se probó y qué dio:**

| fuente | tamaño | cumplen el criterio | conclusión |
|---|---|---|---|
| es.stackoverflow (dump archive.org, Posts.xml) | 195.926 preguntas | 0 útiles | todas de programadores; no es la gente de `PARA_QUIEN.md` |
| oasst1 (OpenAssistant, Apache 2.0) | 3.910 prompts es + 165 pt; 688 con palabras de números de la vida | 7 | un Haiku con criterio congelado (`corpus/encargos/`-estilo); casi nadie pregunta por sus propios números a un modelo |
| los chats propios de Romina (repo privado `mudanza-claude`, 1.661 ventanas) | 82.069 mensajes de Romina; 2.535 con palabras clave | 149 cumplen / 156 dudosas (cuatro Haikus en paralelo, mismo criterio congelado); 71 tras excluir cuerpo/salud y topar a 3 por ventana | son todas parecidas entre sí y casi ninguna trae un registro: Romina, 3-nov: «son todos muy parecidos. Nada que invitara al modelo a usar un dataset» |

**Criterio congelado antes de filtrar** (el mismo para las tres fuentes; no se afinó sobre la marcha): una persona común, no analista ni programadora, pregunta por números de su propia vida o de su entorno cercano, y la pregunta puede convertirse en una experiencia con datos (un número, una comparación, un cambio, una estimación, un reparto), no en una definición ni en una tarea de redacción. Lo que hizo dudar al criterio fue a `dudosas`, no a `cumplen`.

**Lo que se concluyó de eso (3-nov, Romina y Fable):**
- El constructo es raro en el habla: la gente casi nunca le pregunta a un modelo por sus propios números con el registro delante. Las veces que lo hace, el valor está en que el conector **reconozca** que hay un registro y qué tarea pide. Por eso entra una métrica nueva, `reconocer` (issue #23), y el reporte separa «con registro» de «sin registro».
- El producto vive al lado de la fuente de datos (la cartola, el Gmail con las boletas, la planilla), no en un chat en blanco. La eval tiene que parecerse a eso.
- Los ítems del holdout van estratificados: procedimentales y de juicio, surtidos (Romina: «metiendo preguntas mas procedimentales y más de juicio, surtidas»).

**Régimen de los datos propios (regla dura):** el archivo de ventanas es privado y nada de ahí entra a un dataset, eval ni pieza pública salvo que Romina lo saque a mano. Los 71 candidatos están en una página de revisión (`elegir_set_real.html`, fuera del repo) donde ella marca por mano cuáles entran; los hilos de cuerpo y salud quedaron excluidos por defecto y no se discuten aquí. Los candidatos no se suben a este repo: lo que ella marque entra como `corpus/holdout/set_real.json`, con su consentimiento escrito en el archivo, y el resto no existe para la eval.

**Pendiente de este paso:**
- Romina marca el set real por mano.
- Preguntas por WhatsApp a ~12 personas conocidas («mándame una pregunta sobre tus números y dime de dónde sacarías el dato»), con consentimiento y sin nombre.
- El export de OpenAI de Romina (`conversations.json`, de cuando empezaba a usar modelos): mismo criterio, mismo régimen.
- Meta: 60 ítems (pregunta + lo que trae), estratificados.

### 1½. Congelar el protocolo y preregistrarlo en OSF

Antes de que nadie anote: el set con hash, el vocabulario del grafo en la versión que se usa, el libro de códigos para las anotadoras, el plan de análisis (qué alfas, qué cortes, qué cuenta como acuerdo), y el orden de los pasos 2 a 5. Se registra en OSF como el estudio de instancias (osf.io/zusb5). Nada de esto se toca después de registrado; si algo cambia, se declara como desviación.

### 2. Dos anotadoras humanas, a ciegas

- **Quiénes:** Romina y Natalia Olmedo (psicóloga, no psicometrista; pagada; con consentimiento). Romina preguntó el 3-nov si sirve alguien sin psicometría: sí, porque el libro de códigos es el instrumento, no la anotadora, y porque dos humanas sin ver el grafo son el criterio que falta.
- **Independencia de Romina (dicho por ella el 3-nov):** no ha leído los grafos; el grafo lo afinó Opus. Y no reconocería un prompt suyo de hace tres años entre 1.661 ventanas. Eso se prueba, no se afirma: **test de reconocimiento** con 10 ítems propios y 10 ajenos, antes de anotar; si acierta más que el azar, se declara y se reporta aparte.
- **Diseño:** cruce completo (las dos anotan los 60), más 10 repetidos para intra, en orden aleatorio por anotadora, con las tarjetas del vocabulario a la vista y sin ver al conector ni a la anotación de Opus. Exportación cada 10 ítems para no perder trabajo.
- **Artefacto:** una página de anotación (tarea pendiente, era la #9 en la ventana): consentimiento, tarjetas, 70 ítems, exportación.

### 3. Línea base: el modelo sin el grafo

La misma pregunta a un modelo sin el conector, con el vocabulario entregado en el prompt. Si el conector no supera a la línea base, el conector no aporta. Implementación: `--sin-grafo` en `corpus/jurado/api/jurado_api.mjs` (pendiente; era la tarea #10).

### 4. Correr el test una vez

El conector del commit congelado contra el set congelado. Una corrida. Lo que salga, sale.

### 5. Reportar

Intervalos de confianza por bootstrap; cortes por persona, por tarea y por «con/sin registro»; alfas por capa (procedimental y de juicio por separado, como en el estudio de instancias: donde la tarea pide juicio se espera divergencia y se reporta como señal, no como ruido); ablaciones (sin sinónimos, sin `palabras_de_la_gente`, sin ámbito); análisis de errores ítem por ítem; amenazas a la validez; empaquetado en Inspect para que otro lo corra.

## El jurado por API (listo, no corrido)

PR #49: `corpus/jurado/api/jurado_api.mjs` + `.github/workflows/jurado-api.yml` + `corpus/encargos/jurado-api.md`. Id exacto del modelo, dos familias (Anthropic y OpenAI vía OpenRouter), prompt versionado por hash, votos a un PR. Resuelve de raíz la objeción de Sol en el #44 (jueces del mismo linaje). Para correrlo faltan dos secretos del repo que sólo Romina pone: `ANTHROPIC_API_KEY` y `OPENROUTER_API_KEY`. Primera corrida con `limite=5`.

Costos estimados el 3-nov (120 preguntas, 3 jurados, prompt de ~5.400 tokens cacheado): Haiku ≈ USD 9, Sonnet ≈ 27, Opus ≈ 25 con cache; Luna + Terra + Sol por OpenRouter ≈ 27 de los 45 de crédito.

## Estado al 8-nov-2026

| paso | estado |
|---|---|
| 1 · preguntas reales | fuentes públicas agotadas; 71 candidatos propios esperando la mano de Romina; WhatsApp y export de OpenAI sin empezar |
| 1½ · protocolo + OSF | sin empezar |
| 2 · anotadoras | diseño decidido; página de anotación sin construir; Nati no contactada todavía |
| 3 · línea base | sin empezar |
| 4 · test | — |
| 5 · reporte | — |
| jurado por API | PR #49 abierto; faltan los secretos |
| PRs abiertos que esto supone mergeados | #44 (0.3.5, Sol pidió cambios), #46, #48, #49 |

## Lo que no se hace

- No se afina el grafo con el holdout. Lo que el holdout muestre va a la versión siguiente, después del reporte.
- No entra al set nada del archivo privado que Romina no haya sacado a mano; no entra nada de cuerpo o salud.
- No se cita el estudio de instancias como «submitted» ni «under review»: es un estudio preregistrado (OSF), de autora única.
- No se inventan totales: cada número de este plan sale de un archivo o de un conteo por código, y si no, dice «estimado».

## Lo que dice el directorio (8-nov-2026, `evals/directorio/usage-2026-11-08.csv`)

Export de Romina del panel del directorio de conectores de Anthropic, calculado el 8-nov a las 11:18 UTC. Puesto **5.244** entre los conectores del directorio (Romina: el primer día estaba cerca del 5.800). En 30 días: 21 personas lo conectaron, 5 llamaron a alguna herramienta, 40 llamadas, 0 errores. En 7 días: 29 llamadas, todas entre el 2 y el 4 de noviembre (17, 11 y 1), que son los días en que la casa lo probaba desde sus propias ventanas. Lectura honesta: el puesto sube, pero las llamadas que se ven son casi todas nuestras; el número «con personas reales» todavía no existe, y no puede existir hasta que la telemetría de forma de 0.3.5 (#44) esté publicada. Es un argumento más para mergear el #44.
