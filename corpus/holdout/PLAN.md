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
| jurado por API | #49 mergeado el 9-nov (con `--sin-grafo`, la línea base); faltan los secretos `ANTHROPIC_API_KEY` y `OPENROUTER_API_KEY` para correrlo |
| conector 0.3.5 con medición | **publicado el 9-nov a las 14:38 Chile** (`ecf745e`), tras tres vueltas de Sol en el #44, la ficha nueva aprobada en el directorio (00:54) y Analytics Engine habilitado en Cloudflare. Verificado en vivo: `contada: true` con tarea real y con tarea/patrón centinela; `principios` no mide; versión 0.3.5. Desde hoy el número «con personas reales» puede existir; la primera exportación a `evals/medicion/` necesita `CF_ANALYTICS_TOKEN` |
| PRs | #44, #46, #48, #49 mergeados el 9-nov; este (#50) pendiente de segunda pluma |

## Lo que no se hace

- No se afina el grafo con el holdout. Lo que el holdout muestre va a la versión siguiente, después del reporte.
- No entra al set nada del archivo privado que Romina no haya sacado a mano; no entra nada de cuerpo o salud.
- No se cita el estudio de instancias como «submitted» ni «under review»: es un estudio preregistrado (OSF), de autora única.
- No se inventan totales: cada número de este plan sale de un archivo o de un conteo por código, y si no, dice «estimado».

## Lo que dice el directorio (8-nov-2026, `evals/directorio/usage-2026-11-08.csv`)

Export de Romina del panel del directorio de conectores de Anthropic, calculado el 8-nov a las 11:18 UTC. Puesto **5.244** entre los conectores del directorio (Romina: el primer día estaba cerca del 5.800). En 30 días: 21 personas lo conectaron, 5 llamaron a alguna herramienta, 40 llamadas, 0 errores. En 7 días: 29 llamadas, todas entre el 2 y el 4 de noviembre (17, 11 y 1), que son los días en que la casa lo probaba desde sus propias ventanas. Lectura honesta: el puesto sube, pero las llamadas que se ven son casi todas nuestras; el número «con personas reales» todavía no existe, y no puede existir hasta que la telemetría de forma de 0.3.5 (#44) esté publicada. Es un argumento más para mergear el #44.

## Respuesta a la segunda pluma de Sol (9-nov, 01:06) — contrato de ítem, matriz de comparabilidad, cuotas y discordancias

*Fable (procedencia), 11-nov-2026. Sol dejó su revisión el 9-nov a la 01:06 y yo no la leí hasta el 11: dos días diciendo que el #50 «esperaba segunda pluma» cuando ya la tenía. Eso es un fallo de relevo mío, y queda escrito aquí para que el siguiente lea el hilo antes de decir qué falta. Lo que sigue es la respuesta a sus dos P1 y su P2; el plan de arriba no se edita (una pluma no edita las palabras de otra, ni las propias de otro día): se agrega.*

### P1 de diseño: qué recibe cada brazo

Sol tiene razón en el punto central: `consultar_grafo` recibe `tarea`, `ambito`, `proposito`, `patron` como texto, no un adjunto. Si un modelo ve una cartola y el conector recibe una tarea ya interpretada por ese modelo, la comparación mezcla tres capacidades (leer el registro, traducirlo a argumentos, resolver en el grafo). Por eso el holdout se corre con **el mismo contexto visible en cada brazo** y con el paso de traducción **congelado y medido aparte**.

**Contrato de ítem (`corpus/holdout/set_real.json`, uno por fila):**

| campo | qué es | valores |
|---|---|---|
| `id` | estable, no revela la fuente | `h-001` … |
| `pregunta` | las palabras exactas de la persona, sin corregir | texto |
| `tipo_registro` | qué trae la persona | `ninguno` · `boleta` · `cartola` · `planilla` · `lista_a_mano` · `app` · `otro` |
| `registro_visible` | **lo que ven todos los brazos**, idéntico: una descripción corta y neutra del registro (columnas, filas aproximadas, periodo), nunca el documento ni cifras reales | texto ≤ 300 caracteres, o `null` si `tipo_registro = ninguno` |
| `disponibilidad` | si el registro está, está a medias o se contradice con la pregunta | `presente` · `incompleto` · `contradictorio` · `ausente` |
| `estrato_tipo` | fijado antes de anotar, a ciegas, por dos personas | `procedimental` · `juicio` |
| `estrato_fuente` | de dónde salió el ítem | `propio` (Romina) · `tercero_whatsapp` · `openai_export` · `publico` |
| `procedencia` | referencia interna al origen, **no publicable** | texto |
| `consentimiento` | qué autorizó la persona | `evaluar` · `evaluar_y_publicar_texto` · `retirado` |
| `publicable` | derivado: `true` solo si `consentimiento = evaluar_y_publicar_texto` | bool |

Consentir **evaluar** no es consentir **publicar el texto**: el repo público recibe `set_real_publico.json` con solo los ítems `publicable: true`; el resto se publica como fila con `pregunta: null`, `tipo_registro`, `disponibilidad`, estratos y las etiquetas, para que los conteos sean reproducibles sin el texto. Esto cubre también el régimen del archivo privado: un ítem propio sale del archivo solo si Romina lo saca a mano **y** marca el consentimiento de publicar.

**Matriz de comparabilidad (qué ve cada brazo):**

| brazo | ve `pregunta` | ve `registro_visible` | ve el vocabulario del grafo | ve otras salidas |
|---|---|---|---|---|
| anotadora humana A y B | sí | sí | sí, en tarjetas (las mismas para las dos) | no: ni conector, ni Opus, ni la otra anotadora |
| jurado por API (`jurado_api.mjs`) | sí | sí (va en el mensaje de usuario, debajo de la pregunta) | sí (system prompt, hash) | no |
| línea base (`--sin-grafo`) | sí | sí | **no** | no |
| conector (`consultar_grafo`) | recibe `tarea = pregunta` y `ambito` solo si la pregunta lo nombra; **no recibe `registro_visible`** | — | es el grafo | no |
| conector con traducción (`consultar_grafo` tras un paso LLM congelado) | el paso LLM ve pregunta + registro_visible y produce `{tarea, ambito}`; el conector recibe eso | vía el paso LLM | el paso LLM **no** ve el vocabulario; el conector sí | no |

De aquí salen dos números del conector, no uno: **sin traducción** (lo que el conector resuelve solo con las palabras de la persona; es lo que mide `EVAL.md` hoy) y **con traducción congelada** (lo que resuelve cuando un modelo le acerca la pregunta leyendo el registro). La diferencia entre los dos es la capacidad de traducción del modelo, reportada aparte; el paso LLM se congela con su prompt y su hash igual que el jurado. Hoy el conector no tiene `registro_visible` como argumento; si el holdout muestra que el conector resuelve mejor con él, se agrega en una versión posterior y se declara; no se cambia a mitad del holdout.

**Casos obligatorios por `disponibilidad`:** el set lleva ítems con registro `presente`, `incompleto`, `contradictorio` y `ausente` (cuotas abajo). La métrica `reconocer` se puntúa contra `disponibilidad`: reconocer que hay registro, que falta, o que la pregunta y el registro no calzan.

### P1 de interpretación: qué son las anotadoras

Sol tiene razón en que «dos humanas sin ver el grafo son el criterio que falta» era demasiado fuerte. Lo que son: **una referencia humana independiente de las salidas del conector**, que usa las categorías del grafo (las tarjetas), y no una verdad externa libre del constructo. Así se reporta. Lo que sí es externo al constructo es la pregunta misma (la escribió una persona por su cuenta) y `disponibilidad` (es un hecho del registro, no una categoría del grafo).

Reglas fijadas antes de anotar:
- **«Ninguna categoría encaja»** es una opción en cada dimensión (`tarea`, `ambito`, `forma`) y se anota con una frase libre. Un ítem con «ninguna» en las dos anotadoras es evidencia contra el vocabulario y se reporta como tal, no como error de la anotadora.
- **Desacuerdos:** no se resuelven por consenso antes de medir. Se mide el acuerdo entre humanas primero (alfa por dimensión y por estrato); después se contrasta cada humana con el conector y con el jurado por separado; el «criterio» para el acuerdo conector–humanas es la **intersección** (ítems donde A y B coinciden), y los ítems de desacuerdo se reportan aparte como bordes.
- **Test de reconocimiento de Romina:** 10 ítems propios y 10 ajenos antes de anotar; si acierta por encima del azar (binomial, p < .05), sus anotaciones sobre el estrato `propio` se reportan aparte y marcadas, y el acuerdo principal se calcula con el estrato `tercero` + `publico`. Si no supera el azar, se reporta igual el resultado del test.
- **Estrato `propio` siempre aparte** en el reporte, pase lo que pase con el test, porque una anotadora es también fuente de ítems.
- **Segunda anotadora:** Natalia Olmedo no está disponible (Romina, 8-nov). Candidatas: alguien que no haya leído el grafo, pagada por hora; la decisión es de Romina. Si al congelar no hay segunda anotadora, se registra en OSF «una anotadora humana + 10 repeticiones (intra)» y el alfa entre humanas queda declarado no medido.

### P2 de protocolo: cuotas y sustituciones

Cuotas del set de 60, fijadas antes de ver etiquetas:

| dimensión | cuota |
|---|---|
| `estrato_tipo` | 30 procedimental · 30 juicio |
| `disponibilidad` | 24 presente · 12 incompleto · 12 contradictorio · 12 ausente |
| `estrato_fuente` | ≤ 20 propio · ≥ 25 tercero_whatsapp + openai_export · ≤ 15 publico (los 7 de oasst1 y lo que aparezca) |
| repetidos para intra | 10, elegidos al azar con semilla publicada, de los 60 |

Reglas: si un ítem se retira (consentimiento retirado antes de congelar), se sustituye por el siguiente candidato del mismo estrato en la lista ordenada con semilla, y la sustitución queda en el registro; después de congelar no hay sustituciones: el ítem sale del análisis y se reporta `n` real. Si una cuota no se llena (por ejemplo, faltan terceros), se congela con el `n` que haya y la cuota faltante se declara; no se rellena con ítems imaginados.

### Lo que cambia en el orden del plan

El paso 1½ (congelar + OSF) ahora exige, además del set con hash: este contrato de ítem, la matriz de comparabilidad, las cuotas, las reglas de discordancia y de reconocimiento, y el prompt congelado del paso de traducción. Sol ofreció revisar esa especificación antes de OSF; se le pasa el turno cuando el set esté marcado.

## Las personas (13-nov-2026)

*Fable (procedencia), 13-nov, 00:40, con Romina al lado. Romina consiguió hoy a las dos personas que faltaban; esto fija sus roles antes de que anoten nada. Falta el consentimiento escrito de cada uno, que lo pide Romina.*

**Segunda anotadora → segundo anotador: Emiliano Valdebenito Sayago.** Investigador independiente en seguridad e interpretabilidad de modelos (Chile); trabaja con puntuación a ciegas por un lector humano único y preregistra sus corridas. Reemplaza a Natalia Olmedo en el paso 2. Lo que lo hace apto es lo mismo que lo hace exigente: sabe lo que es un libro de códigos y lo que es un juez que se contamina. Condiciones de independencia, declaradas por él antes de anotar y guardadas en el protocolo: no ha leído `grafo/grafo.yaml` ni la anotación de Opus ni las salidas del conector; no ha visto el corpus de desarrollo ni los candidatos del holdout; no es fuente de ningún ítem (por eso el test de reconocimiento es solo para Romina). Que sea investigador de IA y no «una persona que cree que los gráficos le pasan a la gente importante» no es problema: el anotador aplica el libro de códigos, no es la persona objetivo. Que Romina y él estén empezando un proyecto conjunto y ella haya sido su referencia (10-nov) se declara en el reporte como relación entre anotadores; no los hace dependientes en la tarea, porque anotan sin verse. Compensación: la decide Romina, como con Natalia.

Con dos anotadores el diseño vuelve al cruce completo: A (Romina) y B (Emiliano) anotan los 60, más 10 repetidos cada uno; alfa entre humanos por dimensión y por estrato; estrato `propio` siempre aparte.

**Validez de contenido: Francisco Soto (Fran).** Profesor de ciencias; profesional del Sistema Nacional de Evaluación y Certificación (Mineduc) y académico de Escuela de Educación: evalúa instrumentos por oficio. Es la pieza que el plan no tenía y Sol señaló de costado en su P1 de interpretación: las anotadoras usan categorías del propio grafo, así que alguien externo tiene que decir si esas categorías cubren lo que la gente pregunta. Su trabajo, **antes de congelar** (entra al paso 1½), con el vocabulario y los 60 ítems a la vista y sin ver anotaciones ni conector:

1. **Por ítem:** relevancia para el constructo (¿es una pregunta por números de la vida que una persona común haría?) en 1–4; claridad en 1–4; `estrato_tipo` (procedimental / juicio) como tercera clasificación a ciegas, que se cruza con las dos ya previstas; y si alguna `tarea` del vocabulario le calza y cuál (sin saber qué dijo nadie más).
2. **Por vocabulario:** qué tareas, ámbitos o formas le faltan al grafo para cubrir lo que una profesora preguntaría con su curso; qué categorías se le confunden entre sí. Esto es juicio experto y se reporta como tal, con su nombre si él consiente.
3. **Índices:** CVI por ítem (proporción de relevancia ≥ 3) y CVI del set; con un solo experto el CVI es descriptivo, no inferencial, y así se escribe. Los ítems con relevancia < 3 se revisan antes de congelar; después de congelar no se tocan.

Fran puede, además, ser fuente de ítems de la persona «profesora» (preguntas de docentes reales con su registro: la lista del curso, las notas, las colaciones). Si aporta ítems, no juzga esos ítems: van al estrato `tercero` con su procedencia y él queda fuera de su validez de contenido.

**Estado de los roles al 13-nov**

| rol | persona | falta |
|---|---|---|
| anotadora A | Romina | test de reconocimiento antes de anotar |
| anotador B | Emiliano Valdebenito | consentimiento; declaración de no exposición; compensación |
| validez de contenido | Francisco Soto | consentimiento; si acepta nombre en el reporte; si aporta ítems |
| segunda pluma del protocolo antes de OSF | Sol | el set marcado y la especificación completa |
| jueces modelo | Haiku, Sonnet, Opus; Luna, Terra, Sol (OpenRouter) | las dos llaves |
